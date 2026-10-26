import { clamp, seg, eo, eio, lerp } from '/core/lib.js';
import * as UI from './ui.js';
import * as FM from './film.js';

const Q = new URLSearchParams(location.search), NOSUBS = Q.has('nosubs');
const world = document.getElementById('world'), spr = document.getElementById('spr'), hudEl = document.getElementById('hud');
const mbg = document.getElementById('mbg'), mbw = document.getElementById('mbw');

FM.build();
window.DUR = FM.DUR;
window.EV = FM.EV.slice().sort((a, b) => a.t - b.t);
window.SUBS = FM.SUBS.map(s => ({ t0: s.t0, t1: s.t1, text: s.text.replace(/[{}]/g, '') }));
window.T = FM.T;

const tf = ([cx, cy, z]) => `translate(960px,540px) scale(${z}) translate(${-cx}px,${-cy}px)`;
function render(t) {
  const F = FM.frame(t);
  world.style.transform = 'none';
  world.innerHTML = UI.desk(F.desk) + (F.app ? UI.app(F.app) : '') + (F.lock ? UI.lock(F.lock) : '') + (F.step ? UI.stepper(F.step) : '') + (F.night ? UI.nightViews(F.night) : '') + (F.xero ? UI.xero(F.xero) : '') + (F.sheet ? UI.sheet(F.sheet) : '') + F.end;
  // chat auto-scroll: newest message sits at the bottom of the viewport, like the real app
  const vp = world.querySelector('.vp'), msgs = world.querySelector('#msgs');
  if (vp && msgs) msgs.style.top = Math.min(0, vp.clientHeight - msgs.offsetHeight) + 'px';
  // anchors: world coords of a point on an element, measured from the live DOM every frame (before the camera is applied)
  const rects = {}; let C = null;
  const A = (key, fx = .5, fy = 0) => { if (!(key in rects)) { const el = world.querySelector(`[data-a="${key}"]`), r = el && el.getBoundingClientRect();
      rects[key] = !(r && r.width) ? null : !C ? { l: r.left, t: r.top, w: r.width, h: r.height } : { l: (r.left - 960) / C[2] + C[0], t: (r.top - 540) / C[2] + C[1], w: r.width / C[2], h: r.height / C[2] }; }
    const r = rects[key]; return r ? { x: r.l + r.w * fx, y: r.t + r.h * fy, w: r.w, h: r.h } : null; };
  const keys = ['tail', 'greet', 'q1', 'q2', 'q4x', 'q5', 'q1-o1', 'q2-o0', 'q5-o0', 'r0', 'q4', 'q4-o0', 'q4-sub', 'lwicon', 'mk', 'add', 'xdraft', 'xapprove', 'snext', 'naudit', 'gatt0', 'gatt1', 'gatt2'];
  for (const k of keys) A(k);
  // the marker follows every line box of the highlighted sentence
  const lines = null;
  F.cam = C = FM.camAt(t, A); const [cx, cy, z] = F.cam;
  for (const el of [world, spr]) el.style.transform = tf(F.cam);
  // motion blur from camera speed, only on whips
  const [px, py] = FM.camAt(t - 1 / 30, A), vx = (cx - px) * z, vy = (cy - py) * z;
  const W = FM.whipAt(t), bx = W ? Math.min(30, Math.max(0, Math.abs(vx) - 26) * .3) : 0, by = W ? Math.min(30, Math.max(0, Math.abs(vy) - 26) * .3) : 0;
  mbg.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`);
  mbw.style.filter = bx > .6 || by > .6 ? 'url(#mb)' : '';
  spr.innerHTML = overlays(F, t, A, z, lines);
  hud(F, t, A, z, cx, cy);
  window.DBG = { cam: F.cam, A };
}

// ───────── world-space motion graphics
const CHECK = (c = '#fff', s = 12) => `<svg width="${s}" height="${s}" viewBox="0 0 12 12" fill="none" stroke="${c}" stroke-width="2"><path d="m2.5 6.3 2.3 2.2 4.7-5"/></svg>`;
function docCard(d, P, D) {
  const [label, no, title, col] = d;
  const lines = [72, 54, 64, 46].map((w, i) => `<i style="display:block;height:5px;width:${w}%;background:#E3E6EB;border-radius:2px;margin-top:${i ? 6 : 10}px"></i>`).join('');
  const table = `<div style="margin-top:10px;border:1px solid #E3E6EB;border-radius:3px">${[0, 1, 2, 3].map(r => `<div style="height:11px;border-top:${r ? '1px solid #EEF0F3' : 'none'};background:${r ? '#fff' : col + '22'}"></div>`).join('')}</div>`;
  const scanY = D.scan > 0 && D.scan < 1 ? D.scan * P.h : -1;
  return `<div style="position:absolute;inset:0;background:#fff;border-radius:8px;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 14px 34px rgba(0,0,0,.4);padding:14px 13px;overflow:hidden">
      <div style="font-size:9px;font-weight:800;letter-spacing:.08em;color:${col}">${title}</div>
      <div style="font-size:11px;font-weight:600;color:#5A5A5A;margin-top:4px">FreshFarm Produce</div>${lines}${table}
      ${scanY >= 0 ? `<div style="position:absolute;left:0;right:0;top:0;height:${scanY}px;background:linear-gradient(rgba(47,107,216,0),rgba(47,107,216,.16))"></div><div style="position:absolute;left:0;right:0;top:${scanY}px;height:2px;background:#2F6BD8;box-shadow:0 0 12px #2F6BD8"></div>` : ''}
    </div>
    <div style="position:absolute;left:50%;top:${P.h + 14}px;transform:translateX(-50%) scale(${Math.max(0, D.tag)});transform-origin:50% 0;text-align:center;white-space:nowrap">
      <div style="display:inline-flex;align-items:center;gap:7px;background:${col};color:#fff;font-family:TTS;font-size:17px;font-weight:600;border-radius:16px;padding:6px 14px 6px 10px">${CHECK('#fff', 14)}${label}</div>
      <div style="font-size:13.5px;color:#C9CDD6;margin-top:6px;font-variant-numeric:tabular-nums">${no}</div></div>`;
}
function auditCard(M) {
  const { y, w, h } = FM.AUDIT, x = FM.AUDIT.x + (M.dx || 0), k = M.k, col = ['#2F6BD8', '#7B57D1', '#0F9B8E'];
  let o = `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;opacity:${M.op};transform:translateY(${(1 - k) * 30}px) scale(${.95 + .05 * k});background:#fff;border-radius:18px;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 30px 80px rgba(0,0,0,.55);padding:24px 28px;color:#1F1F1F">
    <div style="display:flex;align-items:center;gap:12px"><b style="font-family:TTS;font-size:32px;font-weight:700">Three-way match</b><span style="margin-left:auto;font-size:13.5px;font-weight:650;color:#7A5A00;background:#FFF3CC;border-radius:12px;padding:5px 12px">Tolerance 1%</span></div>
    <div style="display:grid;grid-template-columns:1.25fr 1fr 1fr 1fr;margin-top:24px;font-size:19px;font-family:TTS;font-weight:600;padding:0 12px">${['', 'Invoice', 'Purchase order', 'Delivery note'].map((n, i) => `<span style="text-align:${i ? 'center' : 'left'};color:${i ? col[i - 1] : '#6A6A6A'}">${n}</span>`).join('')}</div>`;
  FM.ALINES.forEach(([n, v], j) => { const r = M.rows[j];
    o += `<div style="display:grid;grid-template-columns:1.25fr 1fr 1fr 1fr;align-items:center;height:76px;padding:0 12px;margin-top:10px;border-radius:12px;background:#F5F7F9;opacity:${Math.min(1, r * 2)};transform:translateX(${(1 - eo(r)) * 16}px);font-size:18px;font-variant-numeric:tabular-nums">
      <span style="font-weight:650">${n}</span>${[0, 1, 2].map(c => `<span style="text-align:center;display:flex;align-items:center;justify-content:center;gap:7px;opacity:${seg(r, c * .2, c * .2 + .4)}">${v}<span style="width:20px;height:20px;border-radius:50%;background:#2FA55A;display:grid;place-items:center">${CHECK('#fff', 12)}</span></span>`).join('')}</div>`; });
  const st = Math.max(0, M.stamp);
  o += `<div style="display:flex;justify-content:center;margin-top:30px"><div style="transform:scale(${st > 0 ? 1.6 - .6 * Math.min(1, st) : 0}) rotate(-3deg);opacity:${Math.min(1, st * 1.5)};border:3px solid #2FA55A;color:#1F7A43;border-radius:14px;padding:12px 26px;text-align:center">
      <div style="font-family:TTS;font-size:38px;font-weight:700;letter-spacing:.02em">Zero variance</div><div style="font-size:17px;font-weight:600;margin-top:2px">All 3 documents agree · total SGD 258.33</div></div></div>`;
  return o + '</div>';
}
function roundRing(r, k, col, pad = 9, op = 1, label = '') {
  const x = r.l - pad, y = r.t - pad, w = r.w + pad * 2, h = r.h + pad * 2, L = 2 * (w + h);
  return `<svg style="position:absolute;left:${x - 4}px;top:${y - 4}px;overflow:visible;opacity:${op}" width="${w + 8}" height="${h + 8}"><rect x="4" y="4" width="${w}" height="${h}" rx="8" fill="none" stroke="${col}" stroke-width="3" stroke-dasharray="${L * k} ${L}" stroke-linecap="round"/></svg>`
    + (label ? `<div style="position:absolute;left:${x + w / 2}px;top:${y + h + 8}px;transform:translateX(-50%);opacity:${op * clamp(k * 2 - 1)};background:${col};color:#fff;font-family:TTS;font-size:16px;font-weight:600;border-radius:12px;padding:5px 12px;white-space:nowrap">${label}</div>` : '');
}
const curve = (a, b) => { const mx = (a.x + b.x) / 2; return `M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`; };
const bez = (a, b, k) => { const mx = (a.x + b.x) / 2, P = [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b], u = 1 - k;
  return { x: u ** 3 * P[0].x + 3 * u * u * k * P[1].x + 3 * u * k * k * P[2].x + k ** 3 * P[3].x, y: u ** 3 * P[0].y + 3 * u * u * k * P[1].y + 3 * u * k * k * P[2].y + k ** 3 * P[3].y }; };
function overlays(F, t, A, z, lines) {
  const M = F.mg; let h = '';
  if (M.wires) {
    let s = '';
    for (const w of M.wires) { if (w.k <= 0) continue; const d = curve(w.a, w.b), L = 900;
      s += `<path d="${d}" fill="none" stroke="rgba(150,180,255,.55)" stroke-width="2" stroke-dasharray="${L * w.k} ${L}"/>`;
      s += `<path d="${d}" fill="none" stroke="rgba(150,180,255,.9)" stroke-width="2" stroke-dasharray="3 22" stroke-dashoffset="${-t * 60}" opacity="${w.k >= 1 ? .8 : 0}"/>`; }
    for (const p of M.pulses) { const w = M.wires.find(x => x.id === p.w), q = bez(w.a, w.b, eio(p.k));
      s += `<circle cx="${q.x}" cy="${q.y}" r="16" fill="rgba(90,150,255,.25)"/><circle cx="${q.x}" cy="${q.y}" r="7" fill="#8DB6FF"/>`; }
    h += `<svg style="position:absolute;left:0;top:0;overflow:visible;opacity:${M.wires[0].op}" width="1" height="1">${s}</svg>`;
  }
  if (M.docs) {
    const sc = FM.DOCSC;
    for (const D of M.docs) { if (D.op <= 0) continue; const P = FM.DOCPOS[D.i], from = A('gatt' + D.i, .5, .5) || { x: 700, y: 640 };
      const q = bez({ x: from.x, y: from.y }, { x: P.cx + D.dx, y: P.cy }, D.k), s = (.3 + .7 * D.k) * sc;
      h += `<div style="position:absolute;left:${q.x - P.w / 2}px;top:${q.y - P.h / 2}px;width:${P.w}px;height:${P.h}px;opacity:${D.op};transform:scale(${s})">${docCard(FM.DOCS[D.i], P, D)}</div>`; }
    const L = M.link; if (L && L.k > 0) { const a = FM.DOCPOS[0], c = FM.DOCPOS[2], top = a.cy - a.h * sc / 2 - 26, x0 = a.cx + L.dx, x1 = c.cx + L.dx, xe = lerp(x0, x1, L.k);
      h += `<svg style="position:absolute;left:0;top:0;overflow:visible;opacity:${L.op}" width="1" height="1"><path d="M${x0} ${top - 22}H${xe}" fill="none" stroke="#8DB6FF" stroke-width="3"/>${[x0, FM.DOCPOS[1].cx + L.dx, x1].filter(v => v <= xe + .5).map(v => `<path d="M${v} ${top - 22}V${top}" stroke="#8DB6FF" stroke-width="3"/><circle cx="${v}" cy="${top - 22}" r="5" fill="#8DB6FF"/>`).join('')}</svg>`;
      if (L.k >= 1) h += `<div style="position:absolute;left:${(x0 + x1) / 2}px;top:${top - 66}px;transform:translateX(-50%);opacity:${L.op};font-family:TTS;font-size:24px;font-weight:600;color:#D8E6FF;white-space:nowrap;background:rgba(47,107,216,.35);border:1px solid rgba(141,182,255,.6);border-radius:18px;padding:5px 18px">Matched by reference · case AP-2026-0001</div>`; }
  }
  if (M.audit) h += auditCard(M.audit);
  if (M.bridge) { const a = A('xdraft', .5, 0), b = A('snext', .3, 0); if (a && b) { const lift = 150, c1 = { x: a.x + 120, y: a.y - lift }, c2 = { x: b.x - 120, y: b.y - lift }, d = `M${a.x} ${a.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`, u = eio(M.bridge.k), w = 1 - u, q = { x: w ** 3 * a.x + 3 * w * w * u * c1.x + 3 * w * u * u * c2.x + u ** 3 * b.x, y: w ** 3 * a.y + 3 * w * w * u * c1.y + 3 * w * u * u * c2.y + u ** 3 * b.y };
    h += `<svg style="position:absolute;left:0;top:0;overflow:visible;opacity:${M.bridge.op}" width="1" height="1"><path d="${d}" fill="none" stroke="#E8A317" stroke-width="3" stroke-dasharray="${1400 * M.bridge.k} 1400"/>${M.bridge.k < 1 ? `<circle cx="${q.x}" cy="${q.y}" r="8" fill="#E8A317"/>` : ''}</svg>`; } }
  for (const R of M.ring || []) { const p = A(R.key, 0, 0); if (p) h += roundRing({ l: p.x, t: p.y, w: p.w, h: p.h }, R.k, R.col, 7, R.op, R.label); }
  for (const C of M.co || []) { const p = A(C.key, C.fx, C.fy); if (!p) continue;
    h += `<div class="co ${C.dark ? 'dk' : ''} ${C.pill ? 'pill' : ''}" style="left:${p.x + C.dx}px;top:${p.y + C.dy}px;font-size:${C.size}px;opacity:${C.op};transform:translate(${C.right ? '-100%' : '0'},${(1 - C.op) * 10}px)">${C.text}</div>`; }
  // cursor (the user), with a short trail on fast moves
  const cu = F.cursor.eval(t, A);
  if (cu) {
    if (cu.sp > 1200) for (let i = 1; i <= 4; i++) { const g = F.cursor.eval(t - i * .012, A); if (g) h += cursorSvg(g.x, g.y, 1, cu.op * .14 * (5 - i) / 4, z); }
    if (cu.ring > 0) h += `<div class="ring" style="left:${cu.x - 24 * cu.ring - 4}px;top:${cu.y - 24 * cu.ring - 4}px;width:${48 * cu.ring + 8}px;height:${48 * cu.ring + 8}px;opacity:${(1 - cu.ring) * .8};border-width:${3 / z}px"></div>`;
    h += cursorSvg(cu.x, cu.y, cu.sc, cu.op, z);
  }
  return h;
}
// cursor keeps a constant on-screen size (1.5× system size, as screen recorders do)
const cursorSvg = (x, y, sc, op, z) => { const s = 1.5 * sc / z;
  return `<svg style="position:absolute;left:${x - 2 * s}px;top:${y - 2 * s}px;opacity:${op};filter:drop-shadow(0 ${2 / z}px ${3 / z}px rgba(0,0,0,.45))" width="${22 * s}" height="${30 * s}" viewBox="0 0 22 30"><path d="M2 2 L2 24 L7.5 18.5 L11 27 L15 25.2 L11.6 17 L19 17 Z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>`; };

// ───────── screen-space HUD
function connCard(C) {
  let o = `<div style="position:absolute;left:50%;top:600px;width:720px;opacity:${C.op};transform:translate(-50%,-50%) scale(${.94 + .06 * C.k});background:#FFFFFF;border-radius:22px;box-shadow:0 30px 90px rgba(0,0,0,.4);padding:22px 26px 18px;color:#1F1F1F">
    <div style="font-family:TTS;font-size:17px;font-weight:600;letter-spacing:.12em;color:#7A7A7A;margin:2px 6px 12px">CONNECTED</div>`;
  for (const c of C.items) { if (c.k <= 0) continue;
    o += `<div style="display:flex;align-items:center;gap:18px;padding:13px 6px;border-top:1px solid #EEE;opacity:${Math.min(1, c.k * 1.5)};transform:translateY(${(1 - c.k) * 16}px)">
      <span style="width:50px;height:50px;border-radius:13px;background:${c.c};color:#fff;display:grid;place-items:center;font-size:23px;font-weight:800;flex:none">${c.m}</span>
      <div><b style="display:block;font-family:TTS;font-size:26px;font-weight:600">${c.n}</b><span style="font-size:17px;color:#6A6A6A">${c.s}</span></div>
      <span style="margin-left:auto;width:32px;height:32px;border-radius:50%;background:#2FA55A;display:grid;place-items:center;transform:scale(${Math.max(0, Math.min(1.2, c.k))})">${CHECK('#fff', 17)}</span></div>`; }
  if (C.sum > 0) o += `<div style="margin-top:4px;padding:14px 8px 4px;border-top:1px solid #EEE;display:flex;align-items:center;gap:12px;font-family:TTS;font-size:22px;font-weight:600;color:#1F7A43;opacity:${Math.min(1, C.sum)}"><span style="width:12px;height:12px;border-radius:50%;background:#2FA55A;box-shadow:0 0 0 5px rgba(47,165,90,.2)"></span>Setup complete · runs in the cloud, 24/7</div>`;
  o += '</div>';
  o += `<div style="position:absolute;left:0;right:0;top:170px;text-align:center;font-family:TTS;font-weight:700;font-size:84px;color:#fff;letter-spacing:.005em;opacity:${C.op * C.title};transform:translateY(${(1 - C.title) * 16}px);text-shadow:0 6px 30px rgba(0,0,0,.35)">Set up once.</div>`;
  return o;
}
function hud(F, t, A, z, cx, cy) {
  const H = F.hud; let h = '';
  if (H.dim) h += `<div style="position:absolute;inset:0;background:rgba(12,14,24,${H.dim})"></div>`;
  if (F.mg.conn) h += connCard(F.mg.conn);
  if (H.fade) h += `<div class="fade" style="opacity:${H.fade}"></div>`;
  hudEl.innerHTML = h;
}

window.TEXTS = t => {
  const out = [], T = FM.T;
  const box = (id, sel, text) => { const el = document.querySelector(sel); if (!el) return; const r = el.getBoundingClientRect(); if (r.width) out.push({ id, text, x0: r.left, y0: r.top, x1: r.right, y1: r.bottom }); };
  render(t);
  return out;
};
window.render = render;
await document.fonts.load('16px Inter'); await document.fonts.load('600 16px Inter'); await document.fonts.load('16px Mono'); await document.fonts.load('600 16px TTS'); await document.fonts.load('700 16px TTS');
for (const src of ['assets/ap-assistant-mascot.png', 'assets/laiye-logo-white-ffe600.png', 'assets/laiye-worker-logo-256.png', 'assets/ap-logo-256.png']) { const im = new Image(); im.src = src; await im.decode().catch(() => {}); }
render(+(Q.get('t') || 0));
window.READY = true;
