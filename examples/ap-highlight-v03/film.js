// "Set it once, then the night shift" (story v3): timeline for picture, camera, cursor, motion graphics, captions and sound events.
// 120 BPM (beat 0.5 s, bar 2 s). One invoice (INV-2026-5211). No mascot: MG layers show the work across Gmail, Sheets and Xero.
import { clamp, lerp, seg, ss, eio, eo, ei, back } from '/core/lib.js';

export const B = .5, DUR = 50.0;
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });

// ───────── key times
export const T = {
  icon: .6, open: .7, mk: 1.9, add: 3.2, close: 3.8, view: 4.3, greet: 4.9,
  q: [6.0, 7.3, 8.5, 9.5], conn: 10.8, lid: 12.8, night0: 13.6, night1: 15.4, lockline: 14.3, quiet: 15.6, stage: 16.0,
  vg: 16.2, mail: 16.8, att: 17.3, fly: [17.9, 18.05, 18.2], vd: 18.6, read: [19.2, 19.65, 20.1], link: 20.4,
  vu: 20.9, dupA: 21.3, dupB: 21.6, va: 22.1, arow: [22.6, 23.0, 23.4], stamp: 24.0, vs: 25.1, row: 25.4, pass: 26.4, readback: 26.8,
  vp: 27.3, wait: 28.0, done: [18.6, 20.8, 21.9, 24.5, 27.0, 28.5], stageOut: 29.2,
  morn0: 29.6, morn1: 31.2, hush: 31.2, wake: 31.6, pickA: 34.2, submit: 35.0, reply: 35.3,
  win: 35.8, badge: 36.4, sheetIn: 38.0, upd: [38.4, 38.8, 39.2], sheetOut: 40.2, hover: 41.0,
  eve0: 43.6, endc: 44.2, endLand: 44.7, fade: 49.4,
};

// ───────── wallpaper and clock
const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, k) => { const A = hx(a), Bc = hx(b); return '#' + A.map((v, i) => Math.round(lerp(v, Bc[i], k)).toString(16).padStart(2, '0')).join(''); };
const SKY = { dusk: ['#2C2A4A', '#8E5A7A', '#E7966A'], night: ['#05080F', '#0B1124', '#151B3A'], morn: ['#5E8FC8', '#A9C6E6', '#F3D7B6'] };
const skyMix = (a, b, k) => SKY[a].map((c, i) => mix(c, SKY[b][i], k));
function clockAt(t) {
  const K = [[0, 17 * 60 + 40], [T.night0, 17 * 60 + 46], [T.night1, 26 * 60 + 14], [T.morn0, 26 * 60 + 31], [T.morn1, 33 * 60 + 3], [T.eve0, 33 * 60 + 9], [T.endc, 47 * 60 + 40], [DUR, 47 * 60 + 41]];
  let m = K[0][1];
  for (let i = 0; i < K.length - 1; i++) { const [a, ma] = K[i], [b, mb] = K[i + 1]; if (t >= a) m = lerp(ma, mb, (i % 2 === 1 ? eio : x => x)(seg(t, a, b))); }
  m = Math.floor(m); const day = m >= 24 * 60 ? 23 : 22, mm = m % (24 * 60);
  return { clock: `${String(Math.floor(mm / 60)).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`, date: `${day}/10/2026`, day: day === 22 ? 'Thursday, 22 October' : 'Friday, 23 October' };
}

// ───────── camera (zoom ≥ 1, never beyond the screen)
const EASE = { eio, ss, eo, whip: x => { x = clamp(x); return x < .5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2; } };
const MOVES = []; const CAM0 = [1050, 870, 2.2];
const cam = (t0, d, to, e = 'eio') => { MOVES.push({ t0, d, to, e }); if (e === 'whip') ev(t0 + d * .35, 'whoosh', { d }); };
const fitCam = ([x, y, z]) => { z = Math.max(1, z); const hw = 960 / z, hh = 540 / z; return [clamp(x, hw, 1920 - hw), clamp(y, hh, 1080 - hh), z]; };
export function camAt(t, A) {
  let v = [CAM0[0], CAM0[1], Math.log(CAM0[2])];
  for (const m of MOVES) { if (t <= m.t0) break; const to = typeof m.to === 'function' ? (A && m.to(A)) : m.to; if (!to) continue;
    const f = fitCam(to), p = EASE[m.e]((t - m.t0) / m.d); v = [lerp(v[0], f[0], p), lerp(v[1], f[1], p), lerp(v[2], Math.log(f[2]), p)]; }
  return fitCam([v[0] + Math.sin(t * .7) * 1.4, v[1] + Math.sin(t * .53 + 1) * 1.0, Math.exp(v[2])]);
}
export const whipAt = t => MOVES.some(m => m.e === 'whip' && t > m.t0 && t < m.t0 + m.d);
const follow = (z, sy = 800, x = 910) => A => { const p = A('tail', .5, 1); return p && [x, p.y - (sy - 540) / z, z]; };
const on = (key, z, fx = .5, fy = .5, x = null, dy = 0) => A => { const p = A(key, fx, fy); return p && [x ?? p.x, p.y + dy, z]; };

// ───────── cursor (the user)
class Cursor {
  constructor() { this.moves = []; this.clicks = []; this.vis = []; }
  show(t0, t1) { this.vis.push([t0, t1]); return this; }
  move(t0, t1, to, arc = 40) { this.moves.push({ t0, t1, to, arc }); return this; }
  click(t) { this.clicks.push(t); ev(t, 'click'); return this; }
  eval(t, A) {
    let op = 0; for (const [a, b] of this.vis) op = Math.max(op, Math.min(seg(t, a, a + .2), 1 - seg(t, b - .25, b)));
    if (op <= 0) return null;
    let p = null, prev = null;
    for (const m of this.moves) { const to = typeof m.to === 'function' ? m.to(A, t) : m.to; if (!to) continue;
      if (t < m.t0 && prev) break;
      if (!prev) { p = to; prev = to; if (t < m.t0) break; continue; }
      const k = seg(t, m.t0, m.t1), e = eio(k), from = prev, dx = to.x - from.x, dy = to.y - from.y, L = Math.hypot(dx, dy) || 1;
      p = { x: lerp(from.x, to.x, e) - dy / L * m.arc * Math.sin(Math.PI * e), y: lerp(from.y, to.y, e) + dx / L * m.arc * Math.sin(Math.PI * e), sp: Math.abs(Math.sin(Math.PI * k)) * L / (m.t1 - m.t0) };
      prev = k >= 1 ? to : from; if (k < 1) break; }
    if (!p) return null;
    let sc = 1, ring = 0; for (const c of this.clicks) { if (t >= c && t < c + .1) sc = .82; if (t >= c && t < c + .45) ring = seg(t, c, c + .45); }
    return { ...p, op, sc, ring };
  }
}
const at = (key, fx = .5, fy = 0, fb = null, dx = 0, dy = 0) => A => { const p = A(key, fx, fy); return p ? { x: p.x + dx, y: p.y + dy } : fb; };
const pt = (x, y) => () => ({ x, y });

// ───────── no bottom captions: text appears only as callouts at close-ups
export const SUBS = [];
export const CHIPS = [
  { c: '#EA4335', m: 'M', n: 'Gmail', s: 'Documents come from the mailbox' },
  { c: '#1E8E3E', m: 'S', n: 'Google Sheets', s: 'AP Ledger · worksheet AP Cases' },
  { c: '#13B5EA', m: 'X', n: 'Xero Accounting', s: 'LAIYE PTE · SGD · drafts' },
  { c: '#E8A317', m: '%', n: 'Variance rule', s: 'Unit-price gaps ≤ 1% pass' },
];
// the three documents, labelled for the viewer (big type) with the real number underneath; drawn at 1.5×
export const DOCS = [['Invoice', 'INV-2026-5211', 'TAX INVOICE', '#2F6BD8'], ['Purchase order', 'PO-2026-0518', 'PURCHASE ORDER', '#7B57D1'], ['Delivery note', 'DO-2026-3302', 'DELIVERY ORDER', '#0F9B8E']];
export const DOCSC = 1.9, DOCPOS = DOCS.map((_, i) => ({ cx: 960 + (i - 1) * 380, cy: 590, w: 150, h: 196 }));
export const AUDIT = { x: 580, y: 290, w: 760, h: 600 };
export const ALINES = [['Fresh Pak Choi', '50 kg × 1.80'], ['Iceberg Lettuce', '30 kg × 2.50'], ['Cherry Tomatoes', '20 kg × 3.60']];

// ───────── build
let CUR;
export function build() {
  EV.length = 0; MOVES.length = 0; CUR = new Cursor();
  for (const [k, v] of Object.entries({ land0: T.add, view: T.view, q0: T.q[0], conn: T.conn, lid: T.lid, night0: T.night0, quiet: T.quiet, stage: T.stage, audit: T.va, morn0: T.morn0, hush: T.hush, wake: T.wake, submit: T.submit, badge: T.badge, eve0: T.eve0, endLand: T.endLand, fade: T.fade })) ev(v, 'mark', { k });

  // ═════ A. Open Laiye Worker, hire (0–4.9)
  cam(.75, .9, [960, 540, 1.0], 'eio');
  CUR.show(0, 10.6).move(0, 0, pt(1250, 960)).move(.05, .55, at('lwicon', .5, .5, pt(1060, 1056)), 30).click(T.icon)
    .move(1.2, 1.85, at('mk', .4, .5, pt(250, 960)), 60).click(T.mk)
    .move(2.3, 3.1, at('add', .55, .6, pt(500, 610)), 50).click(T.add)
    .move(3.7, 4.6, pt(1500, 700), 30);
  ev(T.open, 'pane'); ev(T.mk + .1, 'pane');
  cam(2.15, .8, [690, 400, 1.75], 'eio');
  ev(T.add + .05, 'morph'); ev(T.close, 'pane');
  cam(3.8, 1.0, [950, 360, 1.3], 'eio');
  cam(4.9, .9, on('greet', 1.7, .5, .5, 910), 'eio');

  // ═════ B. Setup: the camera stays on the card being answered; then one Connected card
  const QID = ['q1', 'q2', 'q4x', 'q5'];
  T.q.forEach((tq, i) => { ev(tq, 'pop'); ev(tq + .55, 'tick2', { i }); cam(tq - .05, .6, on(QID[i], 1.85, .5, .5, 910), 'eio'); });
  CUR.move(5.4, 6.0, at('q1-o1', .3, .5, pt(800, 700)), 30).click(T.q[0] + .5)
    .move(6.9, 7.6, at('q2-o0', .3, .5, pt(800, 700)), 30).click(T.q[1] + .5)
    .move(9.0, 9.9, at('q5-o0', .3, .5, pt(800, 700)), 30).click(T.q[3] + .5)
    .move(10.1, 10.6, pt(1900, 1000), 30);
  cam(T.conn - .1, .7, [960, 540, 1.0], 'eio');
  ev(T.conn, 'pane'); CHIPS.forEach((_, i) => ev(T.conn + .25 + i * .15, 'chip'));
  ev(T.conn + 1.0, 'stamp', { i: 4 });

  // ═════ C. Close the lid (12.8–16)
  ev(T.lid, 'lid');
  cam(13.2, 2.2, [960, 420, 1.15], 'ss');
  for (let t = T.night0 + .05; t < T.night1; t += .085) ev(t, 'tick', { v: .5 });

  // ═════ D. Night shift: stepper on top, one view at a time (16–29.2)
  cam(15.9, 1.2, [960, 520, 1.12], 'eio');
  ev(T.stage, 'pane'); ev(T.mail, 'chime');
  [T.vg, T.vd, T.vu, T.va, T.vs, T.vp].forEach(t => ev(t, 'pane'));
  T.fly.forEach(t => ev(t, 'send'));
  T.read.forEach((t, i) => ev(t, 'scan', { i }));
  T.done.forEach((t, i) => ev(t, 'tick2', { i }));
  ev(T.link, 'link'); ev(T.dupA, 'stamp', { i: 0 }); ev(T.dupB, 'stamp', { i: 1 });
  cam(T.va + .1, .8, [960, 525, 1.14], 'eio');
  T.arow.forEach(t => ev(t, 'tick', { v: .8 })); ev(T.stamp, 'stamp', { i: 4 });
  cam(T.vs, .8, [960, 520, 1.12], 'eio');
  for (let k = 0; k < 5; k++) ev(T.row + k * .16, 'key', { v: .6 });
  ev(T.pass, 'key', { v: .7 }); ev(T.readback, 'stamp', { i: 2 }); ev(T.wait, 'pop');

  // ═════ E. Morning (29.2–34)
  for (let t = T.morn0 + .05; t < T.morn1; t += .085) ev(t, 'tick', { v: .5 });
  ev(T.wake, 'wake');
  cam(T.wake + .1, 1.0, on('r0', 1.55, .5, .5, 910), 'eio');
  cam(33.0, .8, on('q4', 1.85, .5, .55, 910), 'eio');
  CUR.show(32.6, 42.9).move(32.6, 32.6, pt(1500, 1000)).move(33.2, 34.0, at('q4-o0', .32, .5, pt(800, 700)), 40).click(T.pickA)
    .move(34.35, 34.85, at('q4-sub', .5, .5, pt(1200, 900)), 30).click(T.submit);

  // ═════ F. Xero draft → ledger synced → approval stays with you (35.8–43.6), one window at a time
  ev(T.win, 'pane');
  cam(T.win, .6, [960, 520, 1.0], 'whip');
  ev(T.badge, 'stamp', { i: 3 });
  cam(T.badge - .2, .9, on('xdraft', 1.5, .5, .5, 880, 150), 'eio');
  ev(T.sheetIn, 'pane');
  cam(T.sheetIn, .7, [960, 500, 1.18], 'eio');
  T.upd.forEach(t => { for (let k = 0; k < 8; k++) ev(t + k * .035, 'key', { v: .45 }); });
  ev(T.upd[1] + .5, 'stamp', { i: 2 });
  ev(T.sheetOut, 'pane');
  CUR.move(40.2, 40.9, at('xapprove', .45, .55, pt(1300, 900)), 50);
  cam(T.sheetOut + .1, 1.0, on('xapprove', 1.6, .5, .5, null, -150), 'eio');

  // ═════ G. Night again, end card (43.6–50)
  cam(T.eve0 - .2, 1.2, [960, 540, 1.0], 'eio');
  cam(T.endc, 5.6, [960, 545, 1.05], 'ss');
  ev(T.endc, 'whoosh', { d: 0 });
}

// ───────── chat state at time t
const G = (t, t0, d = .35) => seg(t, t0, t0 + d);
const Q = [
  { id: 'q1', title: 'How will you provide documents?', opts: [{ l: 'A', t: 'Drop files into this chat', rec: 1 }, { l: 'B', t: 'Fetch from Gmail' }], sel: 1,
    after: 'Gmail is connected — I confirmed read-only access to <span class="lk">ap.inbox@yourco.com</span>.' },
  { id: 'q2', title: 'Where should the AP ledger be kept?', opts: [{ l: 'A', t: 'Use Google Sheets', rec: 1 }, { l: 'B', t: 'Use a local Excel file' }, { l: 'C', t: 'Handle everything in this chat' }], sel: 0,
    after: 'Google Sheets is connected. The AP Ledger is ready: worksheet AP Cases, header written and verified.' },
  { id: 'q4x', title: 'Where should accounting drafts be prepared?', opts: [{ l: 'A', t: '', hide: 1 }, { l: 'B', t: 'Xero Accounting' }], sel: 1, only: 1,
    after: 'Xero is connected and I confirmed the organization: LAIYE PTE, base currency SGD.' },
  { id: 'q5', title: 'How should invoice variances be handled?', opts: [{ l: 'A', t: 'Default: up to 1% price gap passes', rec: 1 }, { l: 'B', t: 'Ask me about every difference' }, { l: 'C', t: 'Set a custom tolerance' }], sel: 0,
    after: 'Saved: unit-price gaps up to 1% pass automatically when quantities match.' },
];
function chat(t) {
  const C = [];
  if (t >= T.greet) C.push({ k: 'time', text: '17:40', p: G(t, T.greet, .2), h: 30 },
    { k: 'bub', id: 'greet', p: G(t, T.greet), h: 100, html: "I'm your accounts payable colleague: I receive supplier invoices, reconcile them with POs and delivery notes, maintain the AP ledger, and prepare accounting drafts." });
  Q.forEach((q, i) => { const tq = T.q[i]; if (t < tq) return;
    const land = tq + .5, done = t >= land;
    C.push({ k: 'q', id: q.id, title: q.title, opts: q.opts, sel: done || q.only ? q.sel : null, ckp: q.only ? 1 : G(t, land, .15), hl: !done && !q.only && t > land - .35 ? q.sel : null, collapsed: q.only ? 1 : G(t, land + .25, .3), p: G(t, tq, .3), h: 280 });
    if (t >= land + .35) C.push({ k: 'bub', p: G(t, land + .35, .3), h: 60, html: q.after });
  });
  if (t >= T.conn - .3) C.push({ k: 'bub', id: 'sum', p: G(t, T.conn - .3, .4), h: 110, html: 'Setup is done: Gmail for documents, Google Sheets ledger (AP Ledger, worksheet AP Cases), Xero Accounting for drafts (LAIYE PTE, SGD), 1% price tolerance.' });
  if (t >= T.wake - .2) {
    C.push({ k: 'time', text: '02:14', h: 30 },
      { k: 'bub', h: 90, html: 'I found one new email in the accounting mailbox with three PDFs — an invoice (INV-2026-5211), a purchase order (PO-2026-0518) and a delivery order (DO-2026-3302).' },
      { k: 'res', id: 'r', h: 300, rows: [
        { html: '<b>AP-2026-0001 · INV-2026-5211:</b> all three documents agree line for line — net 237.00, GST 9% 21.33, total 258.33 SGD. <span class="hlt">Audit passed with zero variance</span>, so this one is ready for a draft.' },
        { html: 'I created AP-2026-0001 in the AP Cases sheet and verified the row reads back correctly. Proposed Xero draft: supplier FreshFarm Produce Pte Ltd, lines coded to account 300 Purchase with 9% input GST, status Draft. Creating it will not approve, post or pay anything.' }] });
    const picked = t >= T.pickA;
    C.push({ k: 'q', id: 'q4', title: 'How should I proceed?', opts: [{ l: 'A', t: 'Create the Xero draft for INV-2026-5211', rec: 1 }],
      sel: picked ? 0 : null, ckp: G(t, T.pickA, .15), hl: t > 33.8 && !picked ? 0 : null, collapsed: G(t, T.submit + .05, .3), subHot: t >= T.submit - .05 && t < T.submit + .15, h: 230 });
  }
  if (t >= T.reply) C.push({ k: 'bub', p: G(t, T.reply, .3), h: 80, html: '<b>The Xero draft for INV-2026-5211 is created and verified.</b> It is a draft only — nothing has been approved, posted or paid.' });
  return C;
}

// a view slides in from the right, holds, and leaves to the left
const slide = (t, t0, t1) => { const i = eo(seg(t, t0, t0 + .4)), o = ei(seg(t, t1 - .35, t1)); return { x: (1 - i) * 160 - o * 160, op: Math.min(i, 1 - o) }; };

// ───────── one frame
export function frame(t) {
  const F = { t, hud: {}, mg: {} };
  const ck = clockAt(t);
  let sky;
  if (t < T.night0) sky = SKY.dusk; else if (t < T.night1) sky = skyMix('dusk', 'night', ss(seg(t, T.night0, T.night1)));
  else if (t < T.morn0) sky = SKY.night; else if (t < T.morn1) sky = skyMix('night', 'morn', ss(seg(t, T.morn0, T.morn1)));
  else if (t < T.eve0) sky = SKY.morn; else sky = skyMix('morn', 'night', ss(seg(t, T.eve0, T.endc)));
  const stars = t < T.night0 ? 0 : t < T.morn0 ? seg(t, T.night0 + .6, T.night1) : t < T.eve0 ? 1 - seg(t, T.morn0, T.morn0 + .8) : seg(t, T.eve0 + .5, T.endc);
  F.desk = { sky, stars, clock: ck.clock, date: ck.date, darkTask: (t > T.night0 + .8 && t < T.morn0 + 1.2) || t > T.eve0 + .6, appOn: t >= T.icon, iconHot: t > .4 && t < T.icon + .2 };
  if (t >= T.lid && t < T.wake + .6) F.lock = { op: Math.min(eio(seg(t, T.lid, T.lid + .6)), 1 - eio(seg(t, T.wake, T.wake + .6))),
    top: Math.min(seg(t, T.lid + .3, T.lid + .8), 1 - seg(t, T.stage - .3, T.stage + .2) + seg(t, T.stageOut, T.stageOut + .4), 1 - seg(t, T.wake - .1, T.wake + .3)),
    line: Math.min(eo(seg(t, T.lockline, T.lockline + .5)), 1 - seg(t, T.stage - .3, T.stage + .1)), clock: ck.clock, day: ck.day };
  // Worker window
  const Ap = { session: t >= T.close, sessions: [], mkHot: t > T.mk - .25 && t < T.mk + .3 };
  const openK = eo(seg(t, T.open, T.open + .5));
  Ap.op = Math.min(1, openK * 1.4); Ap.tf = `scale(${.86 + .14 * openK})`; Ap.to = '55% 100%';
  if (t >= T.mk + .1 && t < T.view) Ap.market = { added: t >= T.add + .05, hot: t > 3.0 && t < T.add + .15, op: Math.min(eo(seg(t, T.mk + .1, T.mk + .45)), 1 - eio(seg(t, T.close, T.view))) };
  if (t >= T.add + .3) {
    const sub = t < T.greet ? 'Environment not prepared yet' : t < T.q[0] ? "I'm your accounts payable c…" : t < T.wake ? 'Setup is done: Gmail for doc…' : t < T.reply ? 'How should I proceed?' : 'The Xero draft for INV-2026-…';
    Ap.sessions.push({ sub, when: t >= T.greet ? 'Just now' : '', p: eo(seg(t, T.add + .3, T.add + .7)) });
  }
  if (Ap.session) {
    Ap.chat = chat(t); Ap.ready = t >= T.greet;
    if (t < T.greet + .2) Ap.setup = { op: Math.min(seg(t, T.close, T.view), 1 - seg(t, T.greet - .1, T.greet + .1)), d: Math.floor(t * 4) % 3 };
  }
  if (t >= T.eve0 - .2) { const k = eio(seg(t, T.eve0 - .2, T.endc)); Ap.op = 1 - k; Ap.tf = `scale(${1 - .05 * k})`; }
  F.app = t < T.endc ? Ap : null;
  // night shift
  if (t >= T.stage && t < T.stageOut + .5) {
    const out = eio(seg(t, T.stageOut, T.stageOut + .5));
    const st = T.done.map((d, i) => t >= d ? 2 : t >= [T.vg + .2, T.vd, T.vu, T.va, T.vs, T.vp][i] ? 1 : 0);
    F.step = { op: Math.min(eo(seg(t, T.stage, T.stage + .5)), 1 - out), head: eo(seg(t, T.stage, T.stage + .5)), pulse: .5 + .5 * Math.sin(t * 4), st,
      fill: clamp(T.done.reduce((n, d) => n + clamp((t - d) / .4), 0) - 1, 0, 5) / 5, pop: T.done.map(d => t > d && t < d + .4 ? Math.sin(seg(t, d, d + .4) * Math.PI) : 0) };
    const N = {};
    if (t >= T.vg && t < T.vd) N.gmail = { ...slide(t, T.vg, T.vd), mail: eo(seg(t, T.mail, T.mail + .4)), att: eo(seg(t, T.att, T.att + .3)), sent: T.fly.map(f => seg(t, f, f + .3)) };
    if (t >= T.vu && t < T.va) N.dup = { ...slide(t, T.vu, T.va), a: back(seg(t, T.dupA, T.dupA + .3), 1.5), b: back(seg(t, T.dupB, T.dupB + .3), 1.5) };
    if (t >= T.vs && t < T.vp) {
      const vals = ['AP-2026-0001', 'FreshFarm Produce Pte Ltd', 'INV-2026-5211', '258.33', 'NOT_DUPLICATE'], n = Math.floor(clamp((t - T.row) / .8) * 5 + 1e-6);
      const row = vals.map((v, i) => i < n ? { v, fl: t < T.row + 2 } : null);
      row.push({ v: t > T.pass ? 'PASSED ✓' : '', cls: 'ok', a: 'naudit', fl: t > T.pass && t < T.pass + 1.2 });
      N.sheet = { ...slide(t, T.vs, T.vp), rows: t > T.row ? [row] : [] };
    }
    if (t >= T.vp && t < T.stageOut + .5) { const sl = slide(t, T.vp, T.stageOut + .5); N.draft = { ...sl, wait: back(seg(t, T.wait, T.wait + .35), 1.6) }; }
    F.night = N;
  }
  // morning: Xero draft, then the ledger slides over it, then back to Approve
  if (t >= T.win - .05 && t < T.endc) {
    const ki = eo(seg(t, T.win - .05, T.win + .4)), ko = eio(seg(t, T.eve0 - .2, T.eve0 + .8));
    F.xero = { op: Math.min(1, ki * 1.5) * (1 - ko), tf: `translateY(${(1 - ki) * 50}px) scale(${.95 + .05 * ki})`, body: eo(seg(t, T.win + .2, T.win + .5)), hot: t > T.hover,
      bs: t >= T.badge && t < T.badge + .35 ? 1 + .25 * Math.sin(seg(t, T.badge, T.badge + .35) * Math.PI) : 1 };
  }
  if (t >= T.sheetIn && t < T.sheetOut + .5) {
    const si = eo(seg(t, T.sheetIn, T.sheetIn + .45)), so = ei(seg(t, T.sheetOut, T.sheetOut + .45));
    const ty = (t0, s) => s.slice(0, Math.floor(clamp((t - t0) / .35) * s.length));
    const r = [{ v: 'AP-2026-0001' }, { v: ty(T.upd[0], 'DRAFTED_PENDING_APPROVAL'), fl: t > T.upd[0] && t < T.upd[0] + 1.4 }, { v: 'INV-2026-5211' }, { v: '258.33' },
      { v: ty(T.upd[1], 'Draft created; awaiting approval'), fl: t > T.upd[1] && t < T.upd[1] + 1.4, a: 'snext' }, { v: ty(T.upd[2], 'Xero bill 737411ea-0a63-41ae-…'), fl: t > T.upd[2] && t < T.upd[2] + 1.4 }];
    const fx = t < T.upd[0] ? ['A1', 'Case ID'] : t < T.upd[1] ? ['B2', 'DRAFTED_PENDING_APPROVAL'] : t < T.upd[2] ? ['E2', 'Draft created; awaiting approval (not posted or paid)'] : ['F2', 'Xero bill 737411ea-0a63-41ae-ab27-cfd938c004dc'];
    F.sheet = { op: Math.min(si * 1.4, 1), tf: `translateX(${(1 - si) * 700 + so * 900}px)`, rows: [r], fx };
  }
  F.end = t >= T.endc - .1 ? endCard(t) : '';
  F.cursor = CUR;
  mg(F, t);
  hud(F, t);
  return F;
}

// ───────── motion graphics state (drawn by main.js)
function mg(F, t) {
  const M = F.mg;
  if (F.night) {
    // documents: Gmail attachment → centre; read, tagged, linked; they leave with the docs view
    if (t >= T.fly[0] && t < T.vu) {
      const sl = slide(t, T.vd - .4, T.vu);
      M.docs = DOCS.map((d, i) => ({ i, k: eio(seg(t, T.fly[i], T.fly[i] + .6)), op: Math.min(1, seg(t, T.fly[i], T.fly[i] + .1)) * (t > T.vd ? sl.op : 1), dx: t > T.vd ? sl.x : 0,
        scan: seg(t, T.read[i] - .05, T.read[i] + .45), tag: back(seg(t, T.read[i] + .35, T.read[i] + .6), 1.4) }));
      M.link = { k: eio(seg(t, T.link, T.link + .45)), op: t > T.vd ? sl.op : 1, dx: t > T.vd ? sl.x : 0 };
    }
    if (t >= T.va && t < T.vs) { const sl = slide(t, T.va, T.vs); M.audit = { k: eo(seg(t, T.va, T.va + .45)), op: sl.op, dx: sl.x, rows: T.arow.map(r => seg(t, r, r + .3)), stamp: back(seg(t, T.stamp, T.stamp + .35), 1.6) }; }
    if (t >= T.readback && t < T.vp) M.ring = [{ key: 'naudit', k: eo(seg(t, T.readback, T.readback + .45)), op: slide(t, T.vs, T.vp).op, col: '#2FA55A', label: 'read back ✓' }];
  }
  M.ring ||= [];
  if (F.xero && t >= T.badge && t < T.sheetIn + .3) M.ring.push({ key: 'xdraft', k: eo(seg(t, T.badge, T.badge + .5)), op: 1 - seg(t, T.sheetIn, T.sheetIn + .3), col: '#E8A317', label: 'Created by your AI employee' });
  if (F.sheet && t >= T.upd[1] + .5) M.ring.push({ key: 'snext', k: eo(seg(t, T.upd[1] + .5, T.upd[1] + 1.0)), op: 1 - seg(t, T.sheetOut, T.sheetOut + .2), col: '#E8A317' });
  if (F.xero && t >= T.hover) M.ring.push({ key: 'xapprove', k: eo(seg(t, T.hover, T.hover + .6)), op: F.xero.op * (.75 + .25 * Math.sin((t - T.hover) * 5)), col: '#1D9F57' });
  // callouts (text only at close-ups), anchored to what they describe
  M.co = [];
  if (t >= 33.2 && t < T.submit + .4) M.co.push({ key: 'q4', text: 'One click to confirm.', fx: 1, fy: 0, dx: -16, dy: -30, size: 24, pill: 1, right: 1, op: Math.min(eo(seg(t, 33.4, 33.8)), 1 - seg(t, T.submit, T.submit + .4)) });
  if (t >= T.hover + .2 && t < T.eve0) M.co.push({ key: 'xapprove', text: 'Approval stays with you.', fx: 0, fy: .5, dx: -24, dy: -24, size: 26, pill: 1, right: 1, op: Math.min(eo(seg(t, T.hover + .3, T.hover + .8)), F.xero ? F.xero.op : 0) });
  // the Connected card (screen space)
  if (t >= T.conn && t < T.lid + .4) M.conn = { op: Math.min(eo(seg(t, T.conn, T.conn + .35)), 1 - seg(t, T.lid - .2, T.lid + .3)), k: eo(seg(t, T.conn, T.conn + .45)),
    items: CHIPS.map((c, i) => ({ ...c, k: back(seg(t, T.conn + .25 + i * .15, T.conn + .6 + i * .15), 1.3) })), sum: back(seg(t, T.conn + 1.0, T.conn + 1.35), 1.4), title: eo(seg(t, T.conn + .1, T.conn + .6)) };
}

function endCard(t) {
  const k = i => eo(seg(t, T.endc + i * .18, T.endc + .5 + i * .18)), y = i => (1 - k(i)) * 22;
  return `<div class="endc" style="top:240px;opacity:${k(0)};transform:translateY(${y(0)}px) scale(${.9 + .1 * k(0)})"><img src="assets/ap-logo-256.png" style="width:120px;height:120px;border-radius:27px;box-shadow:0 12px 40px rgba(0,0,0,.45)"></div>
  <div class="endc" style="top:392px"><span style="display:inline-block;font-size:84px;font-weight:700;letter-spacing:.005em;opacity:${k(1)};transform:translateY(${y(1)}px)">AI Accounts Payable Assistant</span></div>
  <div class="endc" style="top:508px;font-size:40px;font-weight:600;color:#D9D9D9;opacity:${k(2)};transform:translateY(${y(2)}px)">Your <span style="color:#FF8A78">24/7</span> AI employee for accounts payable.</div>
  <div class="endc" style="top:604px;font-size:30px;color:#F2CC40;font-weight:600;letter-spacing:.02em;opacity:${k(3)};transform:translateY(${y(3)}px)">laiye.com/en/ai-accounts-payable-assistant</div>
  <div class="endc" style="top:740px;opacity:${k(4)}"><img src="assets/laiye-logo-white-ffe600.png" style="height:60px"></div>`;
}

function hud(F, t) {
  const H = F.hud;
  if (t < .3) H.fade = 1 - eo(t / .3);
  if (F.mg.conn) H.dim = F.mg.conn.op * .62;
}
