// 来也验收检查：node check.mjs <片子工程> [--step 0.5] [--facts FACTS.md] [--only fonts,brand,facts] [--size 1920x1080] [--lib <引擎>]
// 按 --step 秒逐帧调用页面的 window.render(t)，读取 DOM，做三项检查：
//   fonts  MG 层（不在 [data-layer="product"] 里的元素）的文字只用 LY 开头的品牌字体族，且用到的品牌字体都加载成功
//   brand  MG 层的文字色、底色、边框色、SVG 描边和填充都在品牌色板里（brand/tokens.json）。
//          片子确实需要的额外颜色（如产品自己的进行色）写进工程根目录的 palette-extra.json：{ "#2F6BD8": "理由" }
//   facts  画面上（产品界面层和 MG 层都算）出现的单号、日期、时间、数字、百分比都要在 FACTS.md 里出现（HTML 注释里的不算）
// 另外列出偏小的字（只提醒，不判失败）。
// 退出码：0 全部通过；1 有问题；2 没法检查。
import fs from 'fs'; import path from 'path'; import os from 'os'; import { pathToFileURL, fileURLToPath } from 'url';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const STEP = +opt('--step', 0.5), ONLY = new Set(opt('--only', 'fonts,brand,facts').split(',')), FACTS = opt('--facts', null);
const [VW, VH] = opt('--size', '1920x1080').split('x').map(Number), LIBARG = opt('--lib', null);
const dir = args[0] && path.resolve(args[0]);
if (!dir || !fs.existsSync(path.join(dir, 'index.html')) || !(STEP > 0)) {
  console.error('用法：node check.mjs <片子工程（含 index.html）> [--step 0.5] [--facts FACTS.md] [--only fonts,brand,facts]'); process.exit(2);
}
const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function findLib() {
  if (LIBARG) return LIBARG;
  if (process.env.LIB) return process.env.LIB;
  const b = path.join(dir, 'build.sh');
  if (fs.existsSync(b)) { const m = /^LIB=(.+)$/m.exec(fs.readFileSync(b, 'utf8')); if (m && !m[1].includes('$')) return m[1].trim().replace(/^["']|["']$/g, ''); }
  return process.env.LEMO_OPUSCAR_HOME || path.join(os.homedir(), 'lemo-opuscar');
}
const LIB = findLib();
if (!fs.existsSync(path.join(LIB, 'core/render/page.mjs'))) { console.error(`找不到渲染引擎：${LIB}（先运行 scripts/setup.sh，或加 --lib）`); process.exit(2); }
const { openDemo, closeServer } = await import(pathToFileURL(path.join(LIB, 'core/render/page.mjs')).href);

const tokPath = [path.join(dir, 'brand/tokens.json'), path.join(SKILL, 'brand/tokens.json')].find(p => fs.existsSync(p));
const TOK = JSON.parse(fs.readFileSync(tokPath, 'utf8'));
const extraPath = path.join(dir, 'palette-extra.json');
const EXTRA = fs.existsSync(extraPath) ? JSON.parse(fs.readFileSync(extraPath, 'utf8')) : {};

// ───────── 在页面里逐帧采样（页面内去重，只回传每种东西第一次出现的时间）
const { browser, page } = await openDemo(dir, { w: VW, h: VH });
const S = await page.evaluate(({ STEP }) => {
  if (typeof window.render !== 'function' || !(window.DUR > 0)) return { bad: true };
  const DUR = window.DUR, W = innerWidth, H = innerHeight;
  const texts = new Map(), colors = new Map();
  const SHAPES = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text']);
  const desc = el => {
    const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '';
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls}${txt ? ` “${txt}”` : ''}`;
  };
  const times = []; for (let t = 0; t < DUR - 1e-6; t += STEP) times.push(+t.toFixed(3)); times.push(+(DUR - 1 / 30).toFixed(3));
  for (const t of times) {
    window.render(t);
    const opc = new Map();
    const opacity = el => {
      if (!el || el === document.body) return 1;
      if (opc.has(el)) return opc.get(el);
      const cs = getComputedStyle(el);
      const v = cs.display === 'none' || cs.visibility === 'hidden' ? 0 : +cs.opacity * opacity(el.parentElement);
      opc.set(el, v); return v;
    };
    for (const el of document.body.querySelectorAll('*')) {
      if (/^(SCRIPT|STYLE|defs|filter|feGaussianBlur|clipPath|mask)$/.test(el.tagName)) continue;
      const r = el.getBoundingClientRect();
      if ((!r.width && !r.height) || r.right < 0 || r.bottom < 0 || r.left > W || r.top > H) continue;
      if (opacity(el) < .3) continue;
      const cs = getComputedStyle(el), product = !!el.closest('[data-layer="product"]');
      let txt = ''; for (const n of el.childNodes) if (n.nodeType === 3) txt += n.textContent;
      txt = txt.replace(/\s+/g, ' ').trim();
      if (txt) {
        const scale = el.offsetHeight ? r.height / el.offsetHeight : 1, px = parseFloat(cs.fontSize) * scale;
        const fam = cs.fontFamily.split(',')[0].trim().replace(/["']/g, ''), key = txt + '\u0000' + fam + '\u0000' + product;
        const o = texts.get(key);
        if (!o) texts.set(key, { t, text: txt, product, fam, weight: cs.fontWeight, px, tagged: !!el.closest('[data-t]') });
        else o.px = Math.max(o.px, px);   // 取最大：入场、收起动画中途变小不算
      }
      if (product) continue;
      const add = (c, what) => {
        if (!c || c === 'none' || c.startsWith('url') || c === 'transparent' || c === 'rgba(0, 0, 0, 0)') return;
        const o = colors.get(c); if (o) o.n++; else colors.set(c, { c, t, n: 1, what, where: desc(el) });
      };
      if (txt) add(cs.color, '文字');
      add(cs.backgroundColor, '底色');
      for (const s of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(cs[`border${s}Width`]) > 0) { add(cs[`border${s}Color`], '边框'); break; }
      if (el instanceof SVGElement && SHAPES.has(el.tagName)) { add(cs.fill, 'SVG 填充'); add(cs.stroke, 'SVG 描边'); }
    }
  }
  const fonts = [...document.fonts].map(f => ({ family: f.family.replace(/["']/g, ''), weight: f.weight, status: f.status }));
  return { dur: DUR, n: times.length, texts: [...texts.values()], colors: [...colors.values()], fonts };
}, { STEP });
await browser.close(); closeServer();
if (S.bad) { console.error('页面没有 window.render(t) 或 window.DUR'); process.exit(2); }

let fail = 0;
const head = (ok, s) => console.log(`\n${ok ? '✓' : '✗'} ${s}`);
const list = (rows, max = 40) => { for (const r of rows.slice(0, max)) console.log('   ' + r); if (rows.length > max) console.log(`   …还有 ${rows.length - max} 条`); };
const ts = t => t.toFixed(2).padStart(6) + 's';
console.log(`检查 ${dir}\n采样 ${S.n} 帧（每 ${STEP}s，全长 ${S.dur}s）`);

// ───────── fonts
if (ONLY.has('fonts')) {
  const mgText = S.texts.filter(x => !x.product);
  const off = mgText.filter(x => !x.fam.startsWith('LY '));
  const range = w => { const [a, b] = String(w).split(' ').map(Number); return [a, b ?? a]; };
  const used = new Map(); for (const x of S.texts) if (x.fam.startsWith('LY ')) used.set(x.fam + ' ' + x.weight, x);
  const notLoaded = [...used.values()].filter(x => !S.fonts.some(f => f.family === x.fam && f.status === 'loaded' && (([a, b]) => +x.weight >= a - 100 && +x.weight <= b + 100)(range(f.weight))));
  const errors = S.fonts.filter(f => f.status === 'error');
  const ok = !off.length && !notLoaded.length && !errors.length; if (!ok) fail++;
  head(ok, `字体：MG 层 ${mgText.length} 段文字，非品牌字体 ${off.length} 段；没加载上的品牌字体 ${notLoaded.length + errors.length} 个`);
  list(off.map(x => `${ts(x.t)}  ${x.fam} ${x.weight}  “${x.text.slice(0, 40)}”  → 改用 var(--ly-…)，或这段属于产品界面就给它的容器加 data-layer="product"`));
  list(notLoaded.map(x => `没加载：${x.fam} ${x.weight}（首次 ${ts(x.t)} “${x.text.slice(0, 30)}”）`));
  list(errors.map(f => `加载失败：${f.family} ${f.weight}（检查 brand/fonts/ 里的文件）`));
  const small = S.texts.filter(x => (x.tagged && x.px < 26) || (!x.product && !x.tagged && x.px < 16));
  if (small.length) {
    console.log(`  提醒：${small.length} 段字即使在最大时落到屏幕上也偏小（要读的 data-t 文字 < 26px，其他 MG 文字 < 16px）`);
    list(small.sort((a, b) => a.px - b.px).map(x => `${ts(x.t)}  ${x.px.toFixed(1)}px  “${x.text.slice(0, 40)}”`), 15);
  }
}

// ───────── brand colours
if (ONLY.has('brand')) {
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const PAL = []; for (const [g, o] of Object.entries(TOK.palette)) for (const [n, h] of Object.entries(o)) PAL.push({ name: `${g}.${n}`, h, rgb: hex(h) });
  const EXT = Object.entries(EXTRA).filter(([k]) => /^#[0-9a-f]{6}$/i.test(k)).map(([h, why]) => ({ name: `palette-extra（${why}）`, h, rgb: hex(h) }));
  const C = TOK.check;
  const parse = c => { const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v[3] ?? 1]; };
  const hsl = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; return [d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)), l]; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const bad = [];
  for (const x of S.colors) {
    const v = parse(x.c); if (!v || v[3] < C.minAlpha) continue;
    const [s, l] = hsl(v); if (s <= C.saturation || l < C.lightness[0] || l > C.lightness[1]) continue;   // 灰阶、近黑、近白放行
    const near = [...PAL, ...EXT].map(p => ({ p, d: dist(v, p.rgb) })).sort((a, b) => a.d - b.d)[0];
    if (near.d <= C.distance) continue;
    const h = '#' + v.slice(0, 3).map(n => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase();
    bad.push({ ...x, h, near });
  }
  if (bad.length) fail++;
  head(!bad.length, `品牌色：MG 层用了 ${S.colors.length} 种颜色，色板外的饱和色 ${bad.length} 种`);
  list(bad.sort((a, b) => b.n - a.n).map(x => `${x.h}  ${x.what}  ×${x.n}  首次 ${ts(x.t)}  ${x.where}  （最近的品牌色 ${x.near.p.h} ${x.near.p.name}）`));
  if (bad.length) console.log('   → 换成品牌色；确实需要（如产品自己的状态色）就写进 palette-extra.json 并写明理由');
}

// ───────── facts
if (ONLY.has('facts')) {
  const fp = FACTS ? path.resolve(FACTS) : path.join(dir, 'FACTS.md');
  if (!fs.existsSync(fp)) { fail++; head(false, `事实：没有 ${path.basename(fp)}，画面上的数字无从核对（模板见 templates/FACTS.md）`); }
  else {
    const facts = fs.readFileSync(fp, 'utf8').replace(/<!--[\s\S]*?-->/g, ''), flat = facts.replace(/,/g, '');
    // 单号（INV-2026-5211）| 日期 | 时刻 | 数字、金额、百分比；夹在字母数字中间的片段（GUID、1080p）不算
    const RE = /(?<![A-Za-z0-9])(?:[A-Z][A-Z0-9]*-[A-Z0-9-]*\d[A-Z0-9-]*|\d{1,4}[/.-]\d{1,2}[/.-]\d{1,4}|\d{1,2}:\d{2}|\d[\d,]*(?:\.\d+)?%?)(?![A-Za-z0-9])/g;
    // FACTS.md 里可以声明动画过程中的数字不查，如：忽略正则：`^\d{2}:\d{2}$`（时钟飞转的中间读数）
    const IGN = [...facts.matchAll(/忽略正则[:：]\s*`([^`]+)`/g)].map(m => new RegExp(m[1]));
    const seen = new Map();
    for (const x of S.texts) for (const m of x.text.matchAll(RE)) {
      const tok = m[0].replace(/[.,]$/, '');
      if (/^\d$/.test(tok) || IGN.some(r => r.test(tok))) continue;   // 单个数字（步骤号、个位计数）和声明过的不查
      if (facts.includes(tok) || flat.includes(tok.replace(/,/g, ''))) continue;
      if (!seen.has(tok)) seen.set(tok, x);
    }
    const unknown = [...seen.entries()];
    if (unknown.length) fail++;
    head(!unknown.length, `事实：画面上有 ${unknown.length} 个数字 / 单号 / 时间在 ${path.basename(fp)} 里找不到`);
    list(unknown.map(([tok, x]) => `${tok.padEnd(16)} ${ts(x.t)}  ${x.product ? '产品界面' : 'MG'}  “${x.text.slice(0, 50)}”`));
    if (unknown.length) console.log('   → 有出处的补进 FACTS.md（写明来源）；戏剧化的写进"戏剧化处理"；没有出处的从画面上删掉');
  }
}

console.log(fail ? `\n✗ ${fail} 项没通过` : '\n✓ 全部通过');
process.exit(fail ? 1 : 0);
