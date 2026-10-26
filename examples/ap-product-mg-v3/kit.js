// 机制层：事件、镜头、DOM 锚点、光标、高亮框、定位、文字登记、片尾定版。
// 这里只管"怎么动、怎么量"，不管"长什么样"：颜色、版式、节奏都在 film.js 里按 TREATMENT 决定。
import { clamp, lerp, seg, eio, eo, ei, ss, back, env } from '/core/lib.js';
export { clamp, lerp, seg, eio, eo, ei, ss, back, env };

export const W = innerWidth, H = innerHeight;
export const LANG = document.body.dataset.lang || 'en';
export const STYLE = document.body.dataset.style || 'laiye-screencast';

// ───────── 事件：sound.py 和检查脚本都读 window.EV。返回 t，方便写 T.x = ev(1.2, 'click')
export const EV = [];
export const ev = (t, type, o = {}) => { EV.push({ t: +t.toFixed(3), type, ...o }); return t; };

// ───────── 镜头：[cx, cy, z] = 画面中心对准的世界坐标 + 缩放
// 缩放在对数空间插值；minZoom ≥ 1 时把画面限制在 bounds 内（不拉出屏幕外）。
// 目标可以是固定值，也可以是 A => [cx, cy, z]：按 DOM 锚点算，界面动了镜头跟着动。
export const EASE = {
  eio, ss, eo, ei, lin: x => clamp(x),
  whip: x => { x = clamp(x); return x < .5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2; },
};
export class Camera {
  constructor(start = [W / 2, H / 2, 1], { minZoom = 1, bounds = [0, 0, W, H], drift = 0 } = {}) {
    Object.assign(this, { start, minZoom, bounds, drift, moves: [] });
  }
  move(t0, d, to, ease = 'eio') {
    this.moves.push({ t0, d, to, ease }); this.moves.sort((a, b) => a.t0 - b.t0);
    if (ease === 'whip') ev(t0 + d * .35, 'whoosh', { d });
    return this;
  }
  fit([x, y, z]) {
    z = Math.max(this.minZoom, z);
    if (this.minZoom < 1) return [x, y, z];
    const [x0, y0, x1, y1] = this.bounds, hw = W / 2 / z, hh = H / 2 / z;
    return [clamp(x, x0 + hw, x1 - hw), clamp(y, y0 + hh, y1 - hh), z];
  }
  at(t, A) {
    const s = typeof this.start === 'function' ? (A && this.start(A)) || [W / 2, H / 2, 1] : this.start;
    let v = [s[0], s[1], Math.log(s[2])];
    for (const m of this.moves) {
      if (t <= m.t0) break;
      const to = typeof m.to === 'function' ? A && m.to(A) : m.to; if (!to) continue;
      const f = this.fit(to), p = EASE[m.ease]((t - m.t0) / m.d);
      v = [lerp(v[0], f[0], p), lerp(v[1], f[1], p), lerp(v[2], Math.log(f[2]), p)];
    }
    const d = this.drift;   // 手持感：静止时的轻微漂移，0 = 完全锁定
    return this.fit([v[0] + Math.sin(t * .7) * d, v[1] + Math.sin(t * .53 + 1) * d * .7, Math.exp(v[2])]);
  }
  whipping(t) { return this.moves.some(m => m.ease === 'whip' && t > m.t0 && t < m.t0 + m.d); }
}
export const camTransform = ([cx, cy, z]) => `translate(${W / 2}px,${H / 2}px) scale(${z}) translate(${-cx}px,${-cy}px)`;
// 世界坐标 → 屏幕坐标（画屏幕空间的东西对准世界里的元素时用）
export const toScreen = ([cx, cy, z], p) => ({ x: (p.x - cx) * z + W / 2, y: (p.y - cy) * z + H / 2 });

// ───────── 锚点：量 [data-a="key"] 元素在世界坐标里的位置。main.js 在套镜头之前量，所以结果就是世界坐标。
// A(key, fx, fy) → { x, y, l, t, w, h }：x/y 是元素内 (fx, fy) 比例处的点；元素不存在时返回 null。
export function anchors(root) {
  const box = {};
  const A = (key, fx = .5, fy = .5) => {
    if (!(key in box)) {
      const el = root.querySelector(`[data-a="${key}"]`), r = el && el.getBoundingClientRect();
      box[key] = r && r.width ? { l: r.left, t: r.top, w: r.width, h: r.height } : null;
    }
    const r = box[key];
    return r ? { x: r.l + r.w * fx, y: r.t + r.h * fy, l: r.l, t: r.t, w: r.w, h: r.h } : null;
  };
  A.all = () => { for (const el of root.querySelectorAll('[data-a]')) A(el.dataset.a); return A; };
  return A;
}
// 光标或镜头的目标点：at('btn') → A => 点
export const at = (key, fx = .5, fy = .5, dx = 0, dy = 0) => A => { const p = A(key, fx, fy); return p && { x: p.x + dx, y: p.y + dy }; };
export const pt = (x, y) => () => ({ x, y });
// 镜头对准锚点：on('btn', 1.8) → A => [x, y, 1.8]
export const on = (key, z, fx = .5, fy = .5, dx = 0, dy = 0) => A => { const p = A(key, fx, fy); return p && [p.x + dx, p.y + dy, z]; };

// ───────── 光标（= 用户）：平滑弧线移动、点击收缩 + 扩散环、屏幕上大小恒定
export class Cursor {
  constructor() { this.moves = []; this.clicks = []; this.vis = []; }
  show(t0, t1) { this.vis.push([t0, t1]); return this; }
  move(t0, t1, to, arc = 40) { this.moves.push({ t0, t1, to, arc }); return this; }
  click(t) { this.clicks.push(t); ev(t, 'click'); return this; }
  eval(t, A) {
    let op = 0; for (const [a, b] of this.vis) op = Math.max(op, Math.min(seg(t, a, a + .2), 1 - seg(t, b - .25, b)));
    if (op <= 0) return null;
    let p = null, prev = null;
    for (const m of this.moves) {
      const to = m.to(A, t); if (!to) continue;
      if (!prev) { p = prev = to; if (t < m.t0) break; continue; }
      if (t < m.t0) break;
      const k = seg(t, m.t0, m.t1), e = eio(k), dx = to.x - prev.x, dy = to.y - prev.y, L = Math.hypot(dx, dy) || 1, s = Math.sin(Math.PI * e);
      p = { x: lerp(prev.x, to.x, e) - dy / L * m.arc * s, y: lerp(prev.y, to.y, e) + dx / L * m.arc * s, sp: Math.abs(Math.sin(Math.PI * k)) * L / (m.t1 - m.t0) };
      if (k < 1) break; prev = to;
    }
    if (!p) return null;
    let sc = 1, ring = 0;
    for (const c of this.clicks) { if (t >= c && t < c + .1) sc = .82; if (t >= c && t < c + .45) ring = seg(t, c, c + .45); }
    return { ...p, op, sc, ring };
  }
  // z = 当前镜头缩放：光标在屏幕上保持系统光标 1.5 倍大小
  svg(c, z) {
    if (!c) return '';
    const s = 1.5 * c.sc / z, ring = c.ring > 0 ? `<div style="position:absolute;left:${c.x - 24 * c.ring - 4}px;top:${c.y - 24 * c.ring - 4}px;width:${48 * c.ring + 8}px;height:${48 * c.ring + 8}px;border-radius:50%;border:${3 / z}px solid rgba(0,0,0,.35);opacity:${(1 - c.ring) * .8}"></div>` : '';
    return ring + `<svg style="position:absolute;left:${c.x - 2 * s}px;top:${c.y - 2 * s}px;opacity:${c.op};filter:drop-shadow(0 ${2 / z}px ${3 / z}px rgba(0,0,0,.45))" width="${22 * s}" height="${30 * s}" viewBox="0 0 22 30"><path d="M2 2 L2 24 L7.5 18.5 L11 27 L15 25.2 L11.6 17 L19 17 Z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  }
}

// ───────── 高亮框：沿圆角矩形描出来。r = 锚点盒子 { l, t, w, h }，k = 0→1 描边进度
export function ring(r, k, { color = '#FFE600', pad = 8, width = 3, radius = 10, op = 1 } = {}) {
  if (!r || k <= 0) return '';
  const x = r.l - pad, y = r.t - pad, w = r.w + pad * 2, h = r.h + pad * 2, L = 2 * (w + h);
  return `<svg style="position:absolute;left:${x - width}px;top:${y - width}px;overflow:visible;opacity:${op}" width="${w + width * 2}" height="${h + width * 2}"><rect x="${width}" y="${width}" width="${w}" height="${h}" rx="${radius}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="${L * clamp(k)} ${L}" stroke-linecap="round"/></svg>`;
}

// ───────── 定位：把一段 HTML 放在点 p 上，(ax, ay) 是这段 HTML 自己的对齐点（0,0 左上；.5,.5 居中；1,.5 右侧居中）
export const place = (p, html, ax = 0, ay = 0, extra = '') => p ? `<div style="position:absolute;left:${p.x}px;top:${p.y}px;transform:translate(${-ax * 100}%,${-ay * 100}%);${extra}">${html}</div>` : '';

// ───────── 文字登记：给 readcheck（阅读时长）和 check.mjs 用
// 要让观众读的文字元素加 data-t="唯一 id"；打字机效果另加 data-full="完整文字"（readcheck 要求从第一帧就报完整文字）。
export function visibleTexts() {
  const out = [];
  for (const el of document.querySelectorAll('[data-t]')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    let op = 1, e = el;
    while (e && e !== document.body) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') { op = 0; break; }
      op *= +cs.opacity; e = e.parentElement;
    }
    if (op < .6) continue;
    out.push({ id: el.dataset.t, text: el.dataset.full || el.textContent.trim(), x0: r.left, y0: r.top, x1: r.right, y1: r.bottom });
  }
  return out;
}

// ───────── 片尾定版（品牌规定）：产品图标 / 产品名 / 一句主张 / CTA / 来也 logo。逐行入场后停住，不淡出。
// o = { icon, name, line, note（可选，主张下面的一行小字）, cta, theme: 'dark' | 'light', logo（可选，默认按 theme 选） }
export function endCard(t, t0, o) {
  if (t < t0 - .05) return '';
  const k = i => eo(seg(t, t0 + i * .18, t0 + .5 + i * .18)), y = i => (1 - k(i)) * 22;
  const dark = o.theme !== 'light', zh = LANG === 'zh';
  const fg = dark ? '#F5F5F0' : '#1A1A1A', sub = dark ? '#BDBDB8' : '#4A4A4A';
  const disp = zh ? 'var(--ly-display-zh)' : 'var(--ly-display-en)', sans = zh ? 'var(--ly-sans-zh)' : 'var(--ly-sans-en)';
  const logo = o.logo || (dark ? 'brand/logos/laiye-en-white.png' : 'brand/logos/laiye-en-black.png');
  // CTA：深色底可以用黄字；浅色底不能用黄字，改成黄底黑字
  const cta = dark ? `color:#FFE600` : `color:#1A1A1A;background:#FFE600;padding:6px 18px;border-radius:6px`;
  const row = (i, html, css = '') => `<div style="opacity:${k(i)};transform:translateY(${y(i)}px);${css}">${html}</div>`;
  let i = 0, h = '';
  if (o.icon) h += row(i++, `<img src="${o.icon}" style="width:120px;height:120px;border-radius:27px;box-shadow:0 12px 40px rgba(0,0,0,${dark ? .45 : .18})">`, 'margin-bottom:34px');
  if (o.name) h += row(i++, `<span data-t="end-name">${o.name}</span>`, `font-family:${disp};font-weight:700;font-size:84px;line-height:1.1;color:${fg}`);
  if (o.line) h += row(i++, `<span data-t="end-line">${o.line}</span>`, `font-family:${disp};font-weight:600;font-size:40px;margin-top:22px;color:${sub}`);
  if (o.note) h += row(i++, `<span data-t="end-note">${o.note}</span>`, `font-family:${sans};font-weight:500;font-size:28px;margin-top:18px;color:${sub}`);
  if (o.cta) h += row(i++, `<span data-t="end-cta" style="${cta}">${o.cta}</span>`, `font-family:${sans};font-weight:600;font-size:30px;margin-top:40px;letter-spacing:.02em`);
  h += row(i++, `<img src="${logo}" style="height:60px">`, 'margin-top:70px');
  return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">${h}</div>`;
}
