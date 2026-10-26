// 示例时间线。它只演示机制：镜头推拉、光标点击、产品界面状态变化、DOM 锚点上的高亮框和标注、片尾定版、声音事件。
// 写完 TREATMENT.md 之后整段替换：故事、结构、版式、颜色都按你的 TREATMENT 来，不要沿用这个示例。
//
// 约定：
//   frame(t) 返回这一帧的状态 { world, mg, hud }
//     world：产品界面层和世界里的场景（HTML 字符串），跟着镜头走。重绘的产品界面元素加 data-layer="product"
//     mg(A, cam)：世界空间的 MG（高亮框、标注、连线、光标），跟着镜头走，A 是锚点
//     hud：屏幕空间的 MG（全片主张、片尾），不跟镜头
//   要被读的文字加 data-t="id"；镜头和 MG 要对准的元素加 data-a="key"
import { ev, Camera, Cursor, ring, place, at, on, endCard, seg, eo, eio, clamp, LANG, STYLE } from './kit.js';

const STR = {
  en: { app: 'Example App', run: 'Run', task: 'Monthly report', wait: 'Waiting', done: 'Done', note: 'One short callout.', name: 'Product Name', line: 'One clear promise.', cta: 'laiye.com' },
  zh: { app: '示例应用', run: '运行', task: '月度报表', wait: '等待中', done: '已完成', note: '一句短标注', name: '产品名称', line: '一句话说清价值', cta: 'laiye.com' },
}[LANG];
const DARK = STYLE === 'laiye-keynote';

export const DUR = 10;
export const FPS = 30;
export const ASSETS = ['brand/logos/laiye-en-white.png', 'brand/logos/laiye-en-black.png', 'brand/logos/laiye-worker.png'];

// ───────── 关键时刻：一处定义，画面、镜头、声音都引用它
export const T = { click: 1.6, flip: 1.75, toRow: 1.9, ring: 2.3, note: 2.5, pull: 5.4, dim: 5.6, end: 6.0 };
ev(T.ring, 'tick'); ev(T.end + .2, 'land');

// ───────── 镜头：从按钮的特写开始，跟到结果行，再拉回全景
export const cam = new Camera(on('btn', 1.9), { drift: DARK ? 0 : 1.2 })
  .move(T.toRow, .9, on('row', 1.9, .35), 'eio')
  .move(T.pull, .7, [960, 540, 1], 'ss');

// ───────── 光标：第一个 move 是起始位置
const cursor = new Cursor().show(.2, 4.6)
  .move(0, 0, at('btn', .5, .5, 160, 90))
  .move(.3, 1.4, at('btn', .5, .55))
  .click(T.click)
  .move(2.0, 2.9, at('row', .9, 1.6), 30);

// ───────── 产品界面层（示例：一个通用窗口；真片子按 ui-rebuild.md 重绘真实产品）
function app(t) {
  const done = t >= T.flip, c = DARK
    ? { desk: '#0B0B0C', win: '#17171A', side: '#202024', line: '#2A2A2E', ink: '#F5F5F0', mute: '#8A8A8F', btn: '#F5F5F0', btnInk: '#0B0B0C', ok: '#3DDC84' }
    : { desk: 'linear-gradient(160deg,#C9D6E8,#E9E2D6)', win: '#FAFAFA', side: '#F2F2F2', line: '#E6E6E6', ink: '#1F1F1F', mute: '#8A8A8A', btn: '#171717', btnInk: '#FFFFFF', ok: '#2FA55A' };
  const rowCss = `display:flex;align-items:center;height:64px;padding:0 24px;border-bottom:1px solid ${c.line};font-size:20px`;
  const rows = ['A', 'B'].map(x => `<div style="${rowCss};color:${c.mute}">${STR.task} ${x}<span style="margin-left:auto">${STR.done}</span></div>`).join('');
  return `<div style="position:absolute;inset:0;background:${c.desk}"></div>
  <div data-layer="product" style="position:absolute;left:260px;top:140px;width:1400px;height:800px;background:${c.win};border-radius:10px;box-shadow:0 30px 90px rgba(0,0,0,.35);display:flex;overflow:hidden;font-family:var(--ly-sans-en),var(--ly-sans-zh);color:${c.ink}">
    <div style="width:280px;background:${c.side};border-right:1px solid ${c.line};padding:24px;font-size:22px;font-weight:600">${STR.app}</div>
    <div style="flex:1;padding:40px 48px">
      <div style="display:flex;align-items:center;margin-bottom:28px"><b style="font-size:28px">${STR.task}</b>
        <span data-a="btn" style="margin-left:auto;background:${c.btn};color:${c.btnInk};font-weight:650;font-size:20px;border-radius:8px;padding:10px 26px">${STR.run}</span></div>
      <div style="border:1px solid ${c.line};border-radius:10px;overflow:hidden">${rows}
        <div data-a="row" style="${rowCss};border-bottom:0">${STR.task} C<span style="margin-left:auto;font-weight:600;color:${done ? c.ok : c.mute}">${done ? '✓ ' + STR.done : STR.wait}</span></div></div>
    </div>
  </div>`;
}

// ───────── 世界空间 MG：高亮框 + 标注 + 光标
function mg(t, A, z) {
  let h = '';
  const r = A('row');
  if (r) {
    const fade = 1 - seg(t, T.pull - .2, T.pull + .2);
    h += ring(r, eo(seg(t, T.ring, T.ring + .5)), { color: DARK ? '#FFE600' : '#1A1A1A', op: fade });
    const k = eo(seg(t, T.note, T.note + .4)) * fade;
    // 同一时刻只有一样东西是来也黄（深色版是高亮框），按钮和标注用中性色。标注字号按镜头缩放反算，落到屏幕上是 34px
    if (k > 0) h += place({ x: r.l + r.w * .55, y: r.t + r.h + 22 }, `<div data-t="note" style="opacity:${k};transform:translateY(${(1 - k) * 10}px);white-space:nowrap;font-family:${LANG === 'zh' ? 'var(--ly-display-zh)' : 'var(--ly-display-en)'};font-weight:600;font-size:${34 / z}px;padding:${8 / z}px ${16 / z}px;border-radius:${10 / z}px;background:${DARK ? '#F5F5F0' : '#1A1A1A'};color:${DARK ? '#0B0B0C' : '#FFFFFF'}">${STR.note}</div>`, .5, 0);
  }
  return h + cursor.svg(cursor.eval(t, A), z);
}

export function frame(t) {
  const dim = eio(seg(t, T.dim, T.end + .2));
  return {
    world: app(t),
    mg: (A, cam) => mg(t, A, cam[2]),
    hud: (dim > 0 ? `<div style="position:absolute;inset:0;background:${DARK ? '#0B0B0C' : '#F8F9FA'};opacity:${dim}"></div>` : '')
      + endCard(t, T.end, { icon: 'brand/logos/laiye-worker.png', name: STR.name, line: STR.line, cta: STR.cta, theme: DARK ? 'dark' : 'light' }),
  };
}
