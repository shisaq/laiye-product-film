// State → HTML: the desktop (wallpaper, taskbar, lock screen), the Laiye Worker window (light theme), the cloud stage
// (assistant card with Gmail / Google Sheets / Xero panels) and two browser windows (Xero, Google Sheets),
// redrawn and simplified from the 2026-10-23 recording.
import { clamp, eo } from '/core/lib.js';

export const WIN = { x: 110, y: 34, w: 1700, h: 980 };
export const XERO = { x: 300, y: 60, w: 1320, h: 940 }, SHEET = { x: 330, y: 200, w: 1260, h: 600 };
const AV = 'assets/ap-assistant-mascot.png', LW = 'assets/laiye-worker-logo-256.png';
const av = (sz, a = '') => `<img class="av" ${a} src="${AV}" style="width:${sz}px;height:${sz}px">`;

export const I = {
  side: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3.5" width="14" height="13" rx="2.5"/><path d="M8 3.5v13M12.5 8.5 10.5 10l2 1.5"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="7" r="3.2"/><path d="M3.5 16.5c.8-3 3-4.5 5.5-4.5 1.2 0 2.3.3 3.2.9M15.5 11.5v5M13 14h5"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="9" r="5.5"/><path d="m13.2 13.2 3.6 3.6"/></svg>',
  store: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3.5 7.5 5 3.5h10l1.5 4M3.5 7.5h13v1a2.2 2.2 0 0 1-4.3.6 2.2 2.2 0 0 1-4.4 0A2.2 2.2 0 0 1 3.5 8.5zM4.5 10v6.5h11V10M8.5 16.5v-3.5h3v3.5"/></svg>',
  acct: '<svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><circle cx="10" cy="8" r="2.8"/><path d="M5 15.5c1.2-2 2.9-3 5-3s3.8 1 5 3"/></svg>',
  updown: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m4 5.5 3-3 3 3M4 8.5l3 3 3-3"/></svg>',
  chat: '<svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 4.5h10v7h-6l-3 2.5v-2.5h-1zM13.5 8h3v6.5h-1V17l-3-2.5h-4.5v-1"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m4 9.5 3.2 3L14 5.5"/></svg>',
  done: '<svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="#2FA55A" stroke-width="1.6"><circle cx="10" cy="10" r="7.6"/><path d="m6.6 10.2 2.3 2.2 4.6-4.8"/></svg>',
  act: '<svg width="19" height="19" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.6" stroke="#2F6BD8" stroke-width="1.6"/><circle cx="10" cy="10" r="3.4" fill="#2F6BD8"/></svg>',
  todo: '<svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="#9A9A9A" stroke-width="1.5" stroke-dasharray="2.4 2.2"><circle cx="10" cy="10" r="7.6"/></svg>',
  send: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" stroke-width="2"><path d="M8 13V3.5M4 7.5l4-4 4 4"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3v10M3 8h10"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
  x: '<svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m5 5 10 10M15 5 5 15"/></svg>',
  refresh: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15.5 8A6 6 0 0 0 4.6 7M4.5 12a6 6 0 0 0 10.9 1M15.5 3.5V8H11M4.5 16.5V12H9"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M16 10H4M9 5l-5 5 5 5"/></svg>',
  fwd: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#B0B0B0" stroke-width="1.7"><path d="M4 10h12M11 5l5 5-5 5"/></svg>',
  rel: '<svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M16 10a6 6 0 1 1-2-4.5M16 3.5V7h-3.5"/></svg>',
  clip: '<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M13.5 6.5 7.8 12.2a1.8 1.8 0 0 0 2.6 2.6l6-6a3.4 3.4 0 0 0-4.8-4.8l-6.2 6.2a5 5 0 0 0 7 7l4.8-4.8"/></svg>',
  moon: '<svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path d="M15.5 13.2A7 7 0 0 1 6.8 4.5 7 7 0 1 0 15.5 13.2z"/></svg>',
  cloud: '<svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 15.5h8.2a3.3 3.3 0 0 0 .4-6.6A4.6 4.6 0 0 0 5.8 9 3.3 3.3 0 0 0 6 15.5z"/></svg>',
};
const wctl = (c = '#3A3A3A') => `<span style="display:flex;gap:30px">${['M3 8h10', '', 'm3 3 10 10M13 3 3 13'].map((d, i) => i === 1 ? `<svg width="14" height="14" viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="11" height="11" rx="1.5" fill="none" stroke="${c}" stroke-width="1.4"/></svg>` : `<svg width="14" height="14" viewBox="0 0 16 16"><path d="${d}" stroke="${c}" stroke-width="1.4"/></svg>`).join('')}</span>`;

// ───────── desktop
export function desk(D) {
  const [a, b, c] = D.sky;
  let h = `<div id="wall" style="background:linear-gradient(180deg,${a} 0%,${b} 55%,${c} 100%)">`;
  if (D.stars > 0) for (let i = 0; i < 70; i++) {
    const x = (i * 263.7) % 1920, y = (i * 97.3 + (i % 7) * 41) % 760, s = 1.5 + (i % 3);
    h += `<i class="star" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;opacity:${D.stars * (.35 + (i % 5) * .13)}"></i>`;
  }
  h += '</div>';
  const dk = D.darkTask, ink = dk ? '#DADADA' : '#2A2A2A';
  h += `<div id="task" class="${dk ? 'dark' : ''}"><div class="tb-mid">${['#5B8DEF', '#E8B04A', '#7C7C86', '#53B37A'].map(c => `<i class="tbi"><b style="background:${c}"></b></i>`).join('')}<i class="tbi ${D.appOn ? 'on' : ''} ${D.iconHot ? 'hot' : ''}" data-a="lwicon"><img src="${LW}"></i></div>
    <div class="tb-r" style="color:${ink}"><span>ENG</span><span class="tb-clock" data-a="clock"><b>${D.clock}</b><small>${D.date}</small></span></div></div>`;
  return h;
}
// lock screen: the computer is asleep; the clock keeps time
export function lock(L) {
  return `<div class="lock" style="opacity:${L.op}"><div class="lk-t" style="opacity:${L.top}" data-a="lockclock">${L.clock}</div><div class="lk-d" style="opacity:${L.top}">${L.day}</div>
    <div class="lk-s" style="opacity:${L.top}">${I.moon}<span>Asleep</span></div>
    <div class="lk-c" style="opacity:${L.line};transform:translateY(${(1 - L.line) * 14}px)">Your computer sleeps.<br><span>Your AI employee keeps working.</span></div></div>`;
}

// ───────── Worker window
export function app(A) {
  const W = WIN;
  let h = `<div class="win" style="left:${W.x}px;top:${W.y}px;width:${W.w}px;height:${W.h}px;opacity:${A.op ?? 1};transform:${A.tf || 'none'};transform-origin:${A.to || '50% 50%'}">`;
  h += `<div class="side"><div class="s-top"><b>Laiye Worker</b><span>${I.side}${I.user}</span></div>
    <div class="s-search">${I.search}<span>Search sessions</span></div>`;
  for (const s of A.sessions || []) h += `<div class="sess on" data-a="sess" style="opacity:${s.p ?? 1};transform:translateY(${(1 - (s.p ?? 1)) * 10}px)">${av(44)}<div class="sx"><div class="sn"><b>AI Accounts Payable Assi…</b><em>${s.when || ''}</em></div><div class="ss">${s.sub}</div></div></div>`;
  h += `<div class="s-bot"><div class="mk ${A.mkHot ? 'hot' : ''}" data-a="mk">${I.store}<span>Marketplace</span></div>
    <div class="acct">${I.acct}<div><b>ap.team@yourco.com</b><small>Personal edition</small></div><span class="ud">${I.updown}</span></div></div></div>`;
  h += `<div class="main"><div class="ctrl"><i></i><i class="mx"></i><i class="cl"></i></div>`;
  if (A.session) {
    h += `<div class="vp"><div class="msgs" id="msgs">`;
    (A.chat || []).forEach((it, i, a) => { if (i === a.length - 1) it.tail = 1; h += item(it); });
    h += `</div></div><div class="hfade"></div>`;
    h += `<div class="hdr"><span class="hp">${av(30)}<b>AI Accounts Payable Assistant</b></span><span class="hi">${I.chat}</span></div>`;
    if (A.setup) { const k = A.setup; h += `<div class="setup" style="opacity:${k.op}"><p>Almost there — you can hand it work in a moment.</p><div class="dots">${[0, 1, 2].map(i => `<i style="opacity:${i === k.d ? 1 : .35}"></i>`).join('')}</div></div>`; }
    h += `<div class="ib"><span class="plus">+</span><div class="field"><span>${A.ready === false ? 'You can hand over work once the Worker is ready' : 'Message AI Accounts Payable Assistant'}</span><span class="send">${I.send}</span></div></div>`;
  } else h += `<div class="empty"><img src="${LW}"><p>Add a worker from the Marketplace to get started.</p></div>`;
  h += `</div>`;
  if (A.market) h += market(A.market);
  return h + `</div>`;
}

function market(M) {
  const k = M.op ?? 1;
  return `<div class="scrim" style="opacity:${k}"></div><div class="modal" style="opacity:${k};transform:scale(${.96 + .04 * k})"><h1>Marketplace</h1><span class="mx">${I.x}</span>
    <div class="tabs"><b>Worker</b><span>${I.refresh}</span></div>
    <div class="cards"><div class="mcard feat" data-a="card"><div class="ca"><img src="${AV}"></div><span class="fp">Featured</span>
      <h3>AI Accounts Payable Assistant</h3><p>Receive supplier invoices, link purchase orders and delivery notes, check duplicates, reconcile the three…</p>
      <div class="ma"><span class="addb ${M.added ? 'on' : ''} ${M.hot ? 'hot' : ''}" data-a="add">${M.added ? I.check + 'Added' : I.plus + 'Add'}</span><span class="det">Details ${I.arrow}</span></div></div>
    <div class="mcard ghost"><i style="width:68px;height:68px;border-radius:15px"></i><i style="width:62%;height:18px;margin-top:22px"></i><i style="width:92%;height:12px;margin-top:20px"></i><i style="width:84%;height:12px;margin-top:14px"></i><i style="width:56%;height:12px;margin-top:14px"></i><i style="width:96px;height:38px;border-radius:19px;margin-top:40px"></i></div></div></div>`;
}

const da = it => it.id ? `data-a="${it.id}"` : '';
const grow = (it, inner, cls = '') => {
  const p = it.p ?? 1, e = eo(clamp(p));
  const mh = p < 1 ? `max-height:${(it.h || 200) * e}px;overflow:hidden;` : '';
  return `<div class="it ${cls}" ${it.tail ? 'data-a="tail"' : ''} style="${mh}opacity:${Math.min(1, p * 2.2)}">${inner}</div>`;
};
function item(it) {
  switch (it.k) {
    case 'time': return grow(it, `<div class="ts">${it.text}</div>`);
    case 'bub': return grow(it, `<div class="bub" ${da(it)}>${it.html}</div>`);
    case 'q': {
      let o = `<div class="q" ${da(it)}><div class="qt">${it.title}</div>`;
      const cp = it.collapsed === true ? 1 : (it.collapsed || 0), keep = (o, i) => it.sel != null ? i === it.sel : !o.hide;
      const opts = cp >= 1 ? it.opts.filter(keep) : it.opts.filter(o => !o.hide);
      o += `<div class="opts">${opts.map(op => { const i = it.opts.indexOf(op), sel = i === it.sel, fold = cp > 0 && !keep(op, i);
        return `<div class="op ${sel ? 'sel' : ''} ${it.hl === i ? 'hl' : ''}" data-a="${it.id}-o${i}" style="${fold ? `height:${50 * (1 - cp)}px;opacity:${1 - cp}` : ''}"><span class="ol">${op.l}</span><span class="ot">${op.t}</span>${op.rec && cp < 1 ? `<em ${sel ? 'style="margin-right:12px"' : ''}>Recommended</em>` : ''}${sel ? `<span class="ck" style="opacity:${it.ckp ?? 1};${op.rec && cp < 1 ? 'margin-left:0' : ''}">${I.check}</span>` : ''}</div>`; }).join('')}</div>`;
      if (cp < 1) o += `<div style="${cp > 0 ? `max-height:${120 * (1 - cp)}px;overflow:hidden;opacity:${1 - cp}` : ''}"><div class="free"><span>Or just type your answer</span></div><div class="sb"><span class="sub ${it.sel != null ? 'on' : ''} ${it.subHot ? 'hot' : ''}" data-a="${it.id}-sub">Submit</span></div></div>`;
      return grow(it, o + '</div>');
    }
    case 'res': return grow(it, `<div class="bub res" ${da(it)}>${it.rows.map((r, i) => `<p data-a="${it.id}${i}" style="opacity:${r.p ?? 1}">${r.html}</p>`).join('')}</div>`, 'w');
  }
  return '';
}

// ───────── a small spreadsheet grid (shared by the cloud-stage panel and the browser window)
export function grid(cols, rows, o = {}) {
  const L = 'ABCDEFGHIJ';
  let g = `<div class="grow hd"><span class="rn"></span>${cols.map(([, w], i) => `<span class="c" style="width:${w}px">${L[i]}</span>`).join('')}</div>`;
  g += `<div class="grow h1"><span class="rn">1</span>${cols.map(([n, w]) => `<span class="c" style="width:${w}px">${n}</span>`).join('')}</div>`;
  for (let r = 0; r < (o.n || 12); r++) {
    const R = rows[r];
    g += `<div class="grow" ${R ? `data-a="${o.key || 'row'}${r}"` : ''}><span class="rn">${r + 2}</span>${cols.map(([, w, num], i) => {
      const cell = R && R[i], v = cell ? cell.v : '';
      return `<span class="c ${num ? 'num' : ''} ${cell && cell.fl ? 'new' : ''} ${cell && cell.cls || ''}" ${cell && cell.a ? `data-a="${cell.a}"` : ''} style="width:${w}px">${v}</span>`; }).join('')}</div>`;
  }
  return `<div class="grid">${g}</div>`;
}

// ───────── night shift: the assistant header and a 6-step stepper on top; one view at a time in the middle
export const STEPS = ['Collect', 'Read', 'Dedupe', 'Match', 'Log', 'Draft'];
export function stepper(P) {
  const W = 1180, x0 = 960 - W / 2, dx = W / (STEPS.length - 1);
  let h = `<div class="sp" style="opacity:${P.op}"><div class="sp-h" style="opacity:${P.head}">${av(40)}<b>AI Accounts Payable Assistant</b><span class="sp-on"><i style="opacity:${.55 + .45 * P.pulse}"></i>Running in the cloud</span><span class="sp-pc">${I.moon} Your computer: asleep</span></div>`;
  h += `<div class="sp-l" style="left:${x0}px;width:${W}px"><i style="width:${P.fill * W}px"></i></div>`;
  STEPS.forEach((n, i) => { const st = P.st[i], x = x0 + i * dx;
    h += `<div class="sp-s s${st}" data-a="step${i}" style="left:${x}px;transform:translateX(-50%) scale(${1 + .18 * (P.pop[i] || 0)})"><span class="dot">${st === 2 ? I.check.replace(/20/g, '22') : i + 1}</span><b>${n}</b></div>`; });
  return h + '</div>';
}
const view = (V, w, h, inner, key, y = 300) => `<div class="vw" data-a="${key}" style="left:${960 - w / 2 + V.x}px;top:${y}px;width:${w}px;height:${h}px;opacity:${V.op};transform:scale(${V.s ?? 1})">${inner}</div>`;
export function nightViews(N) {
  let h = '';
  if (N.gmail) { const G = N.gmail;
    h += view(G, 1060, 600, `<div class="pn-h"><span class="tile" style="background:#EA4335">M</span><b>Gmail</b><span class="pn-s">ap.inbox@yourco.com</span></div>
      <div class="gm big"><div class="gm-r">Inbox</div>
        <div class="gm-m new" style="opacity:${G.mail};transform:translateY(${(1 - G.mail) * -20}px)"><span class="gm-dot"></span><div><b>FreshFarm Produce Pte Ltd</b><p>Invoice INV-2026-5211, purchase order and delivery order</p></div><em>02:14</em></div>
        <div class="gm-a" style="opacity:${G.att}">${I.clip}<span>3 attachments</span></div>
        <div class="gm-th" style="opacity:${G.att}">${['Invoice', 'Purchase order', 'Delivery note'].map((n, i) => `<div class="gm-f" data-a="gatt${i}" style="opacity:${1 - (G.sent[i] || 0) * .6}"><span class="pdf">PDF</span><span>${n}</span></div>`).join('')}</div>
        <div class="gm-m old" style="transform:translateY(${(1 - G.mail) * -20}px)"><span></span><div><b style="font-weight:500">Weekly supplier statement</b><p>Statement of account, September</p></div><em>Oct 20</em></div>
        <div class="gm-m old"><span></span><div><b style="font-weight:500">Payment advice</b><p>Remittance for INV-2026-4987</p></div><em>Oct 18</em></div></div>`, 'vgmail', 290); }
  if (N.dup) { const D = N.dup;
    const row = (c, m, n, s, k) => `<div class="du-r"><span class="tile big" style="background:${c}">${m}</span><div><b>${n}</b><span>${s}</span></div><span class="du-ok" style="transform:scale(${Math.max(0, k)});opacity:${Math.min(1, k * 2)}">${I.check.replace(/20/g, '18')}No match</span></div>`;
    h += view(D, 820, 330, `<div class="du-t">Duplicate check · INV-2026-5211</div>${row('#1E8E3E', 'S', 'AP Ledger', 'Google Sheets · AP Cases', D.a)}${row('#13B5EA', 'X', 'Xero bills', 'LAIYE PTE · all statuses', D.b)}`, 'vdup', 380); }
  if (N.sheet) { const S = N.sheet;
    h += view(S, 1120, 470, `<div class="pn-h"><span class="tile" style="background:#1E8E3E">S</span><b>Google Sheets</b><span class="pn-s">AP Ledger · worksheet AP Cases</span></div>
      ${grid([['Case ID', 150], ['Supplier', 236], ['Invoice', 160], ['Amount', 100, 1], ['Duplicate', 170], ['Audit', 150]], S.rows, { n: 9, key: 'nrow' })}`, 'vsheet', 330); }
  if (N.draft) { const D = N.draft;
    h += view(D, 860, 440, `<div class="pn-h"><span class="tile" style="background:#13B5EA">X</span><b>Xero</b><span class="pn-s">Draft preview · nothing written yet</span><span class="wait" style="transform:scale(${Math.max(0, D.wait)})">Waiting for your OK</span></div>
      <div class="dp"><div class="dp-r"><span>Contact</span><b>FreshFarm Produce Pte Ltd</b></div><div class="dp-r"><span>Reference</span><b>INV-2026-5211</b></div>
        <div class="dp-r"><span>Lines</span><b>3 lines · 300 - Purchase · GST 9%</b></div><div class="dp-r"><span>Status on creation</span><b>Draft</b></div>
        <div class="dp-r tot"><span>Total</span><b>SGD 258.33</b></div></div>`, 'vdraft', 360); }
  return h;
}

// ───────── browser window chrome
function browser(B, tab, icon, url, inner) {
  return `<div class="bw" style="left:${B.x}px;top:${B.y}px;width:${B.w}px;height:${B.h}px;opacity:${B.op ?? 1};transform:${B.tf || 'none'}">
    <div class="tabsr"><div class="tab"><i style="background:${icon}"></i><span>${tab}</span>${I.x.replace(/22/g, '14')}</div><div class="wc">${wctl()}</div></div>
    <div class="addr">${I.back}${I.fwd}${I.rel}<div class="url">${url}</div></div>${inner}</div>`;
}
// Google Sheets in the morning: the same row, now pointing at the Xero draft
export function sheet(S) {
  const cols = [['Case ID', 128], ['Stage', 250], ['Invoice Number', 140], ['Amount', 84, 1], ['Next Action', 290], ['Finance Draft ID', 330]];
  const inner = `<div class="gs-h"><span class="gs-ic"></span><div class="gs-t"><b>AP Ledger</b><span>${'File Edit View Insert Format Data Tools Extensions Help'.split(' ').map(s => `<i style="font-style:normal">${s}</i>`).join('')}</span></div></div>
    <div class="gs-tb"></div><div class="gs-fx"><b>${S.fx[0]}</b><span style="color:#9A9A9A">fx</span><span>${S.fx[1]}</span></div>${grid(cols, S.rows, { n: 14, key: 'mrow' })}
    <div class="gs-foot"><span style="font-size:20px;color:#5A5A5A">+</span><b>AP Cases</b></div>`;
  return browser({ ...SHEET, ...S }, 'AP Ledger - Google Sheets', '#1E8E3E', 'docs.google.com/spreadsheets/d/…/edit', inner);
}
// Xero: Edit Bill INV-2026-5211 (the draft the assistant wrote)
export function xero(X) {
  const L = [['PM-001 Fresh Pak Choi kg', '50.00', '1.80', '90.00'], ['VG-204 Iceberg Lettuce kg', '30.00', '2.50', '75.00'], ['VG-118 Tomatoes (Cherry) kg', '20.00', '3.60', '72.00']];
  const inner = `<div class="xn"><span class="xl">xero</span><span class="org">LAIYE PTE ▾</span><span>Home</span><span>Sales</span><span class="on">Purchases</span><span>Reporting</span><span>Accounting</span><span class="hl">HL</span></div>
    <div class="xb"><div class="xbc">Purchases overview › Bills to pay ›</div><div class="xh">Edit Bill INV-2026-5211</div>
      <div class="xc" style="opacity:${X.body ?? 1}"><span class="xst" data-a="xdraft" style="transform:scale(${X.bs ?? 1})">Draft</span><div class="xpp"><span>Print PDF</span><span>Bill Options ▾</span></div>
        <div class="xf"><div><small>From</small><span style="width:226px">FreshFarm Produce Pte Ltd</span></div><div><small>Date</small><span style="width:112px">24 Aug 2026</span></div><div><small>Due Date</small><span style="width:112px">23 Sep 2026</span></div><div><small>Reference</small><span style="width:140px">INV-2026-5211</span></div><div class="tot"><small>Total</small><span>258.33</span></div></div>
        <div class="xae"><span>SGD Singapore Dollar ▾</span><span style="border:none;background:none;padding:6px 0">Amounts are&nbsp;&nbsp;<b style="font-weight:500;border:1px solid #C9CED6;border-radius:4px;padding:6px 12px">Tax Exclusive ▾</b></span></div>
        <div class="xt"><div class="xr hd"><span>Description</span><span class="n">Qty</span><span class="n">Price</span><span>Account</span><span>Tax Rate</span><span class="n">Amount</span></div>
          ${L.map(([d, q, u, a], i) => `<div class="xr" style="opacity:${X.lines ? X.lines[i] : 1}"><span>${d}</span><span class="n">${q}</span><span class="n">${u}</span><span>300 - Purchase</span><span>Standard-Rated Purchases (9%)</span><span class="n">${a}</span></div>`).join('')}</div>
        <div class="xsum"><span>Subtotal</span><b>237.00</b><span>Total Tax 9.00%</span><b>21.33</b><span class="T">TOTAL</span><b class="T" data-a="xtotal">258.33</b></div>
        <div class="xbtn"><span class="xsave">Save</span><span class="xapp ${X.hot ? 'hot' : ''}" data-a="xapprove">Approve</span><span class="xcan">Cancel</span></div></div></div>`;
  return browser({ ...XERO, ...X }, 'Xero | Edit Bill | LAIYE PTE', '#13B5EA', 'go.xero.com/AccountsPayable/Edit.aspx?InvoiceID=737411ea-…', inner);
}
