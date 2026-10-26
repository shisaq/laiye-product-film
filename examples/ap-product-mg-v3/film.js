// AI Accounts Payable Assistant · Product MG v3（故事线 v2）
// 一段 journey：你雇了一位 AI 员工，睡一觉，早上点一下，账单就备好了。
// 向导 = AI 员工的头像（世界空间，跟着它干活的地方走）；光标 = 你。左边 Laiye Worker 窗口，右边外部系统（夜里 Gmail，早上 Xero）。
// 时间流逝和章节标题都是居中单独一拍，窗口压暗。120 BPM。
import { ev, Camera, Cursor, ring, at, pt, on, endCard, seg, eo, eio, ei, ss, clamp, lerp } from './kit.js';
import { hash } from '/core/lib.js';
import { worker, gmail, xero, CSS } from './ui.js';

document.head.insertAdjacentHTML('beforeend', `<style>${CSS}</style>`);
export const DUR = 60.0, FPS = 30;
export const ASSETS = ['brand/logos/laiye-worker.png', 'assets/ap-avatar.png', 'assets/ap-icon.png', 'brand/logos/laiye-en-white.png'];
const C = { s2: '#202024', fg: '#F5F5F0', mute: '#9A9A9F', y: '#FFE600', ok: '#3DDC84', ink: '#0B0B0C' };
const F = { disp: 'var(--ly-display-en)', sans: 'var(--ly-sans-en)', mono: 'var(--ly-mono)' };
const mark = (t, k) => ev(t, 'mark', { k });

// ───────── 关键时刻
export const T = {
  t1: [.05, 3.0], win: 3.05, mk: 4.3, modal: 4.45, add: 6.5, orb: 7.1, close: 7.4, sess: 8.2, chat: 8.4, hp: 9.0,
  greet: 9.3, duty: [10.0, 10.5, 11.0, 11.5], t2: [12.5, 15.2],
  q: [15.4, 17.3, 19.2, 21.1], done: 22.9, c1: [24.0, 27.4],
  out1: 27.5, gm: 27.3, mail: 28.3, orbMail: 28.7, att: 29.0, back: 30.2, attMsg: 30.25, orbAtt: 31.1,
  list: 31.6, steps: [32.7, 33.5, 34.3, 35.1, 38.6], strip: 35.3, hush: 35.4, lock0: 35.9, flash: 37.1, stamp: 37.3, stripIn: 38.2,
  home: 38.9, c2: [39.5, 42.5], ask: 42.7, pick: 44.1, submit: 44.9, reply: 45.3,
  out2: 47.3, xe: 47.1, orbX: 48.2, orbAp: 49.0, ringT: 49.8, callout: 50.3, outro: 53.3, end: 53.9,
};
// 节奏微调：配置之后整体提前 0.5 s，印章之后顺延，让 Zero variance 停够读完
const SH = v => v < 22.9 ? v : v <= 37.3 ? v - .5 : v + .9;
for (const [k, v] of Object.entries(T)) if (k !== 't1') T[k] = Array.isArray(v) ? v.map(SH) : SH(v);
mark(0, 'intro'); mark(T.win, 'groove'); mark(T.c1[0], 'night'); mark(T.hush, 'hush'); mark(T.stamp, 'stamp'); mark(T.c2[0], 'morning'); mark(T.end, 'end');
const QS = [
  { id: 'q0', title: 'How will you provide documents?', opts: [{ l: 'A', t: 'Drop files into this chat', rec: 1 }, { l: 'B', t: 'Fetch from Gmail' }], sel: 1, h: 190 },
  { id: 'q1', title: 'Where should the AP ledger be kept?', opts: [{ l: 'A', t: 'Use Google Sheets', rec: 1 }, { l: 'B', t: 'Use a local Excel file' }, { l: 'C', t: 'Handle everything in this chat' }], sel: 0, h: 240 },
  { id: 'q2', title: 'Where should accounting drafts be prepared?', opts: [{ l: 'B', t: 'Xero Accounting' }], sel: 0, h: 140 },
  { id: 'q3', title: 'How should invoice variances be handled?', opts: [{ l: 'A', t: 'Default: up to 1% price gap passes', rec: 1 }, { l: 'B', t: 'Ask me about every difference' }, { l: 'C', t: 'Set a custom tolerance' }], sel: 0, h: 240 },
];
const qClick = i => T.q[i] + .95;
const LOCK = (c, k) => T.lock0 + c * .4 + k * .07;
const WORK = [[T.orbMail, T.back], [T.list, T.steps[4]], [T.orbX, T.orbAp]];

// 事件（声音）
ev(T.t1[0], 'land'); ev(T.win, 'whoosh', { d: .6 }); ev(T.modal, 'pop', { i: 0 }); ev(T.add + .05, 'added');
ev(T.orb, 'pop', { i: 3 }); ev(T.sess, 'tick', { n: 4 }); ev(T.hp, 'tick', { n: 6 }); ev(T.greet, 'pop', { i: 1 });
T.duty.forEach((t, i) => ev(t, 'tick', { n: 7 + i }));
ev(T.t2[0], 'seal'); T.q.forEach((t, i) => { ev(t, 'pop', { i: i + 2 }); ev(qClick(i) + .4, 'tick', { n: i }); }); ev(T.done, 'arp');
ev(T.c1[0], 'flip'); ev(T.c1[0] + .4, 'roll', { d: 1.2 });
ev(T.mail, 'chime'); ev(T.orbMail, 'sweep', { d: .6 }); [0, 1, 2, 3, 4, 5].forEach(i => ev(T.att + i * .08, 'pop', { i: 4 + i }));
[0, 1, 2, 3, 4, 5].forEach(i => ev(T.orbAtt - .3 + i * .06, 'tick', { n: 2 + i }));
T.steps.forEach((t, i) => ev(t, 'check', { n: i })); ev(T.list, 'pop', { i: 7 });
ev(T.strip, 'whoosh', { d: .4 }); [0, 1, 2].forEach(c => [0, 1, 2, 4, 5].forEach((k, j) => ev(LOCK(c, k), 'lock', { n: c * 5 + j })));
ev(T.stamp, 'stamp'); ev(T.stripIn, 'retract', { n: 0 });
ev(T.c2[0], 'flip'); ev(T.c2[0] + .3, 'roll', { d: 1.0 });
ev(T.ask, 'pop', { i: 2 }); ev(T.reply, 'pop', { i: 9 }); ev(T.orbX, 'seal'); ev(T.ringT, 'sweep', { d: .5 });
ev(T.outro, 'seal'); ev(T.end + .1, 'hit');

// ───────── 镜头：世界是横向的，左边 Laiye Worker（x≈960），右边外部系统（x≈2880）
const tail = z => A => { const p = A('tail', .5, 1); return p && [980, p.y - (880 - 540) / z, z]; };
export const cam = new Camera([960, 540, 1], { bounds: [0, 0, 3840, 1080] })
  .move(4.5, .9, on('card', 1.55), 'eio')
  .move(7.3, .9, [960, 540, 1.0], 'eio')
  .move(9.2, 1.0, tail(1.55), 'eio')
  .move(T.out1, .8, [2880, 560, 1.22], 'whip')
  .move(T.back, .8, tail(1.55), 'whip')
  .move(T.strip - .1, .7, A => { const p = A('prog', .5, .5); return p && [980, p.y + 70, 1.3]; }, 'eio')
  .move(T.stripIn + .1, .7, tail(1.55), 'eio')
  .move(T.out2, .8, [2880, 540, 1.22], 'whip')
  .move(T.orbAp, 1.0, on('approve', 1.55, .5, .5, -330, -150), 'eio');

// ───────── 光标（= 你）：每次点完退到固定停靠点，锚点消失后也不会跳
const REST = pt(1460, 880);
const cursor = new Cursor()
  .show(3.3, 7.0).move(0, 0, pt(1500, 1020)).move(3.4, 4.15, at('mk', .3, .5)).click(T.mk).move(5.4, 6.3, at('add', .5, .55)).click(T.add).move(6.7, 7.0, pt(1340, 900))
  .show(15.3, 22.7);
QS.forEach((q, i) => cursor.move(T.q[i] + .2, qClick(i) - .15, at(`${q.id}-o${q.sel}`, .35, .55), 50).click(qClick(i)).move(qClick(i) + .2, qClick(i) + .6, REST, 20));
cursor.show(T.ask + .1, T.reply + .4).move(T.ask + .5, T.pick - .15, at('qd-o0', .35, .55)).click(T.pick).move(T.pick + .15, T.submit - .1, at('qd-sub', .5, .55)).click(T.submit).move(T.submit + .15, T.submit + .6, REST, 20);

// ───────── 向导（= AI 员工）：它的头像，从卡片诞生 → 会话列表 → 对话顶部；夜里去 Gmail 取件、沿清单走；早上去 Xero，停在 Approve 旁
const guide = new Cursor()
  .show(T.orb, T.hp + .1).move(0, 0, at('cardav', .5, .5)).move(T.orb + .05, T.sess, at('sessav', .5, .5), 120).move(T.chat, T.hp, at('hpav', .5, .5), 80)
  .show(T.out1, T.home + .45).move(T.out1, T.orbMail, at('mail', 0, .5, -34), 160).move(T.back, T.orbAtt, at('attmsg', .02, .3), 160)
  .move(T.list + .1, T.list + .5, at('step0', .015, .5), 30);
T.steps.slice(0, 5).forEach((s, i) => guide.move(s, s + .35, at(`step${i + 1}`, .015, .5), 0));
guide.move(T.home, T.home + .4, at('hpav', .5, .5), 60)
  .show(T.out2, T.outro + .3).move(T.out2, T.orbX, at('xdraft', 1, .5, 62), 160).move(T.orbAp, T.orbAp + .6, at('approve', .5, 1, 0, 58), 40);
function drawGuide(t, A, z) {
  const g = guide.eval(t, A); if (!g) return '';
  const work = WORK.some(([a, b]) => t >= a && t < b), pulse = .5 + .5 * Math.sin(t * Math.PI * 2);
  const s = 54 / z, glow = work ? `,0 0 0 ${(7 + 5 * pulse) / z}px rgba(255,230,0,.35),0 0 ${30 / z}px rgba(255,230,0,.6)` : '';
  let h = '';
  if ((g.sp || 0) > 900) for (let i = 1; i <= 3; i++) { const q = guide.eval(t - i * .03, A); if (q) h += `<div style="position:absolute;left:${q.x - s / 2}px;top:${q.y - s / 2}px;width:${s}px;height:${s}px;border-radius:50%;background:rgba(255,255,255,${.12 * (4 - i) / 3 * g.op})"></div>`; }
  return h + `<div style="position:absolute;left:${g.x - s / 2}px;top:${g.y - s / 2}px;width:${s}px;height:${s}px;border-radius:50%;overflow:hidden;opacity:${g.op};box-shadow:0 0 0 ${3 / z}px #FFFFFF,0 ${6 / z}px ${18 / z}px rgba(0,0,0,.45)${glow}"><img src="assets/ap-avatar.png" style="width:100%;height:100%;display:block"></div>`;
}

// ───────── Laiye Worker 窗口的状态
function chat(t) {
  const C_ = [], G = (a, d = .45) => seg(t, a, a + d);
  C_.push({ k: 'time', text: '17:40', p: G(T.hp), h: 30 });
  if (t >= T.greet) C_.push({ k: 'greet', p: G(T.greet), h: 110, hl: T.duty.map(d => eo(seg(t, d, d + .3))) });
  QS.forEach((q, i) => {
    if (t < T.q[i]) return;
    const c = qClick(i);
    C_.push({ k: 'q', id: q.id, title: q.title, opts: q.opts, sel: t >= c ? q.sel : null, ck: seg(t, c, c + .15), hl: t > c - .35 && t < c ? q.sel : null, collapsed: eio(seg(t, c + .3, c + .7)), p: G(T.q[i], .4), h: q.h });
  });
  if (t >= T.done) C_.push({ k: 'bub', p: G(T.done), h: 80, html: 'Setup is done: Gmail for documents, Google Sheets ledger, Xero Accounting for drafts, 1% price tolerance.' });
  if (t >= T.attMsg) {
    C_.push({ k: 'time', text: '02:14', p: G(T.attMsg - .05, .3), h: 30 });
    C_.push({ k: 'att', p: G(T.attMsg, .5), h: 130, files: seg(t, T.orbAtt - .35, T.orbAtt + .1), html: 'I found the accounting mailbox: one email carrying six PDFs.' });
  }
  if (t >= T.list) {
    const st = T.steps.map((d, i) => t >= d ? 2 : (i === 0 ? 1 : (t >= T.steps[i - 1] ? 1 : 0)));
    st.push(t >= T.steps[4] ? 1 : 0);
    C_.push({ k: 'prog', p: G(T.list, .5), h: 260, st });
  }
  if (t >= T.ask) {
    C_.push({ k: 'time', text: '09:03', p: G(T.ask - .05, .3), h: 30 });
    C_.push({ k: 'q', id: 'qd', title: 'How should I proceed?', opts: [{ l: 'A', t: 'Create the Xero draft for INV-2026-5211', rec: 1 }], sel: t >= T.pick ? 0 : null, ck: seg(t, T.pick, T.pick + .15), hl: t > T.pick - .35 && t < T.pick ? 0 : null, submit: true, subHot: t > T.submit - .25 && t < T.submit + .2, collapsed: eio(seg(t, T.submit + .2, T.submit + .6)), p: G(T.ask, .4), h: 250 });
  }
  if (t >= T.reply) C_.push({ k: 'bub', id: 'reply', p: G(T.reply), h: 60, html: 'The Xero draft for INV-2026-5211 is created and verified.' });
  return C_;
}
function workerState(t) {
  const rise = eo(seg(t, T.win, T.win + .8));
  const S = { op: clamp(rise * 1.5), dy: (1 - rise) * 80, mkHot: t > T.mk - .3 && t < T.mk + .2, sessions: [], session: t >= T.chat, chat: [], hpOp: eo(seg(t, T.hp - .1, T.hp + .2)) };
  if (t >= T.modal && t < T.sess + .2) {
    const k = eo(seg(t, T.modal, T.modal + .35)) * (1 - eio(seg(t, T.close, T.close + .35)));
    S.market = { op: k, added: t >= T.add + .05, hot: t > T.add - .3 && t < T.add + .1, avOp: t < T.orb ? 1 : 0 };
  }
  if (t >= T.orb) S.sessions.push({ p: eo(seg(t, T.sess - .25, T.sess + .1)), av: t >= T.sess ? 1 : 0, sub: t >= T.greet ? "I'm your accounts payable coll…" : 'Just added' });
  if (S.session) S.chat = chat(t);
  return S;
}

// ───────── 舞台（横向，足够宽）
function stage(t) {
  const night = ss(seg(t, T.c1[0], T.c1[0] + .8)) * (1 - ss(seg(t, T.c2[0] + .6, T.c2[0] + 1.6)));
  return `<div style="position:absolute;left:-200px;top:-200px;width:4240px;height:1480px;background:#0B0B0C"></div>
  <div style="position:absolute;left:-200px;top:-200px;width:4240px;height:1480px;background:radial-gradient(ellipse 30% 55% at 25% 30%,rgba(255,255,255,${.06 - .035 * night}),transparent 70%),radial-gradient(ellipse 30% 55% at 72% 30%,rgba(255,255,255,${.05 - .03 * night}),transparent 70%)"></div>
  <div style="position:absolute;left:-192px;top:-192px;width:4224px;height:1464px;opacity:${eo(seg(t, 0, 1)) * (1 - .45 * night)};background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);background-size:192px 192px,192px 192px,48px 48px,48px 48px"></div>`;
}
function external(t) {
  let h = '';
  if (t >= T.gm && t < T.orbAtt + .5) {
    const k = eo(seg(t, T.out1, T.out1 + .6)), o = eio(seg(t, T.orbAtt, T.orbAtt + .4));
    h += gmail({ op: k * (1 - o), dy: (1 - k) * 40, open: seg(t, T.mail, T.mail + .5), hot: t > T.orbMail && t < T.back + .2, att: seg(t, T.att, T.att + .5), sent: seg(t, T.back, T.back + .3) });
  }
  if (t >= T.xe) {
    const k = eo(seg(t, T.out2, T.out2 + .6)), o = eio(seg(t, T.outro, T.outro + .5));
    h += xero({ op: k * (1 - o), dy: (1 - k) * 40, hot: t > T.ringT });
  }
  return h;
}

// ───────── 世界空间 MG：附件跟着头像回来、三单对照条、Approve 的黄圈和提示、头像、光标
function overlays(t, A, z) {
  let h = drawGuide(t, A, z);   // 头像画在最下层：对照条弹出时盖住它
  // 附件跟在头像后面飞回对话
  if (t > T.back && t < T.orbAtt) for (let i = 0; i < 6; i++) {
    const q = guide.eval(t - .07 * (i + 1), A); if (!q) continue;
    const s = 30 / z;
    h += `<div style="position:absolute;left:${q.x - s / 2 + 26 / z}px;top:${q.y - s * .65 + 22 / z}px;width:${s}px;height:${s * 1.25}px;border-radius:${4 / z}px;background:#FFFFFF;box-shadow:0 ${3 / z}px ${10 / z}px rgba(0,0,0,.4);display:grid;place-items:center;font-family:${F.mono};font-size:${9 / z}px;font-weight:700;color:#E5534B">PDF</div>`;
  }
  // 三单对照条：从第 5 步那一行里弹出，压在清单上方，最后收回那一行
  const o = A('step4', .3, .5), pg = A('prog', .5, .5), k = eo(seg(t, T.strip, T.strip + .5)), b = ei(seg(t, T.stripIn, T.stripIn + .4));
  if (o && pg && k > 0 && b < 1) {
    h += `<div style="position:absolute;left:${pg.l}px;top:${pg.t}px;width:${pg.w}px;height:${pg.h}px;border-radius:14px;background:rgba(11,11,12,${.55 * k * (1 - b)})"></div>`;
    const cx = lerp(o.x, 980, k * (1 - b)), cy = lerp(o.y, pg.y + 20, k * (1 - b)), sc = lerp(.25, 1, k) * (1 - .75 * b);
    const DOC = [['INVOICE', 'INV-2026-5211'], ['PURCHASE ORDER', 'PO-2026-0518'], ['DELIVERY ORDER', 'DO-2026-3302']], CX = [380, 590, 800];
    const flash = t >= T.flash ? Math.max(0, 1 - seg(t, T.flash, T.flash + .7)) : 0;
    const tag = (s, n) => `<span style="font-family:${F.mono};font-size:${n}px;letter-spacing:.12em;color:${C.mute}">${s}</span>`;
    let inner = `<div style="position:absolute;left:26px;top:22px">${tag('THREE-WAY AUDIT · 1% TOLERANCE', 15)}</div>
      <div style="position:absolute;right:20px;top:16px"><span style="font-family:${F.mono};font-size:14px;letter-spacing:.12em;color:${C.mute};border:1px solid rgba(255,255,255,.2);border-radius:7px;padding:4px 9px">SAMPLE DOCUMENTS</span></div>`;
    DOC.forEach(([ty, no], c) => { inner += `<div style="position:absolute;left:${CX[c] - 100}px;top:58px;width:200px;text-align:center">${tag(ty, 13)}<div style="font-family:${F.mono};font-size:19px;color:${C.fg};margin-top:4px">${no}</div></div>`; });
    inner += `<div style="position:absolute;left:26px;top:130px;font-family:${F.sans};font-weight:700;font-size:21px;color:${C.fg}">Total (incl. GST)</div>`;
    DOC.forEach((_, c) => {
      const s = [...'258.33'].map((ch, kk) => { if (ch === '.') return '.'; const lt = LOCK(c, kk), done = t >= lt;
        return `<span style="display:inline-block;transform:translateY(${done ? -5 * (1 - eo(seg(t, lt, lt + .18))) : 0}px);color:${done ? C.fg : 'rgba(245,245,240,.4)'}">${done ? ch : Math.floor(hash(c * 131 + kk * 17 + Math.floor(t * 20)) * 10)}</span>`; }).join('');
      inner += `<div data-t="tot-${c}" data-full="258.33" style="position:absolute;left:${CX[c] - 85}px;top:116px;width:170px;height:52px;display:flex;align-items:center;justify-content:center;font-family:${F.mono};font-weight:600;font-size:29px;color:${C.fg};border-radius:9px;box-shadow:0 0 0 2px rgba(61,220,132,${.9 * flash}),0 0 22px rgba(61,220,132,${.4 * flash})">${s}</div>`;
    });
    h += `<div style="position:absolute;left:${cx - 450}px;top:${cy - 100}px;width:900px;height:200px;opacity:${clamp(k * 2) * (1 - b)};transform:scale(${sc});background:${C.s2};border:1px solid rgba(255,255,255,.1);border-radius:14px;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 30px 80px rgba(0,0,0,.6)">${inner}</div>`;
    const st = seg(t, T.stamp, T.stamp + .22);
    if (st > 0) h += `<div style="position:absolute;left:${cx + 120}px;top:${cy + 92}px;width:330px;height:80px;opacity:${Math.min(1, st * 2) * (1 - b)};transform:scale(${(1.5 - .5 * eo(st)) * (1 - .75 * b)}) rotate(-3deg)"><div data-t="stamp" style="height:100%;display:grid;place-items:center;border:4px solid ${C.ok};border-radius:14px;background:rgba(11,11,12,.9);font-family:${F.disp};font-weight:700;font-size:38px;color:${C.ok}">Zero variance</div></div>`;
  }
  // Approve：一圈来也黄 + 提示（批准权在你）
  const ap = A('approve');
  if (ap && t > T.ringT - .1) {
    const fade = 1 - seg(t, T.outro, T.outro + .3);
    h += ring(ap, eo(seg(t, T.ringT, T.ringT + .5)), { color: C.y, pad: 9, width: 4.5 / z, radius: 10, op: fade });
    const ck = eo(seg(t, T.callout, T.callout + .4)) * fade;
    // 提示放在 Approve 左边的空白处（真实 Xero 里 Save 在最左边，中间是空的），不压住上面的金额
    if (ck > 0) h += `<div style="position:absolute;left:${ap.l - 30 / z}px;top:${ap.y}px;transform:translate(-100%,-50%) translateX(${(1 - ck) * -12 / z}px);opacity:${ck};white-space:nowrap;background:#141414;color:#FFFFFF;border-radius:999px;padding:${10 / z}px ${24 / z}px;font-family:${F.disp};font-weight:600;font-size:${34 / z}px;box-shadow:0 ${10 / z}px ${30 / z}px rgba(0,0,0,.35)"><span data-t="callout">Approval stays with you.</span></div>`;
  }
  return h + cursor.svg(cursor.eval(t, A), z);
}

// ───────── 屏幕空间：章节标题、时间一拍、片尾
function beat(t, a, b, inner, dim = true) {
  const k = eo(seg(t, a, a + .4)), o = ei(seg(t, b - .35, b));
  if (k <= 0 || o >= 1) return '';
  const v = k * (1 - o);
  return (dim ? `<div style="position:absolute;inset:0;background:rgba(11,11,12,${.86 * v})"></div>` : '')
    + `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:${v};transform:translateY(${(1 - k) * 20 - o * 16}px)">${inner}</div>`;
}
const big = (id, s, size = 112) => `<div data-t="${id}" style="font-family:${F.disp};font-weight:700;font-size:${size}px;line-height:1.05;color:${C.fg}">${s}</div>`;
function clock(t, a, m0, m1, r0, r1) {
  const m = Math.round(lerp(m0, m1, eio(seg(t, a + r0, a + r1)))), mm = ((m % 1440) + 1440) % 1440;
  return `${String(Math.floor(mm / 60)).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`;
}
function hud(t) {
  let h = `<div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 75% at 50% 48%,transparent 55%,rgba(0,0,0,.5))"></div>`;
  h += beat(t, T.t1[0], T.t1[1], big('t1', 'Hire an AI employee.'), false);
  h += beat(t, T.t2[0], T.t2[1], big('t2', 'Set it up once.'));
  h += beat(t, T.c1[0], T.c1[1], `<div style="font-family:${F.mono};font-weight:500;font-size:200px;line-height:1;color:${C.fg};font-variant-numeric:tabular-nums">${clock(t, T.c1[0], 17 * 60 + 40, 26 * 60 + 14, .4, 1.6)}</div>
    <div style="margin-top:34px">${big('c1line', 'It works around the clock.', 64)}</div><div data-t="c1sub" style="margin-top:16px;font-family:${F.sans};font-size:30px;color:${C.mute}">Runs in the cloud.</div>`);
  h += beat(t, T.c2[0], T.c2[1], `<div style="font-family:${F.mono};font-weight:500;font-size:200px;line-height:1;color:${C.fg};font-variant-numeric:tabular-nums">${clock(t, T.c2[0], 2 * 60 + 31, 9 * 60 + 3, .3, 1.3)}</div>
    <div style="margin-top:34px">${big('c2line', 'You make the call.', 64)}</div>`);
  h += endCard(t, T.end, { icon: 'assets/ap-icon.png', name: 'AI Accounts Payable Assistant', line: 'Your 24/7 AI employee for accounts payable.', note: 'Runs on Laiye Worker', cta: 'laiye.com/en/ai-accounts-payable-assistant', theme: 'dark' });
  return h;
}

// 对话自动滚到最新一条（和真实产品一样）
export function layout(root) {
  const vp = root.querySelector('.vp'), msgs = root.querySelector('#msgs');
  if (vp && msgs) msgs.style.top = Math.min(0, vp.clientHeight - msgs.offsetHeight) + 'px';
}

export function frame(t) {
  const fin = 1 - eio(seg(t, T.outro, T.outro + .6));
  const W = workerState(t); W.op *= fin;
  return {
    world: stage(t) + (t >= T.win - .05 ? worker(W) : '') + external(t),
    mg: (A, cam) => overlays(t, A, cam[2]),
    hud: hud(t),
  };
}
