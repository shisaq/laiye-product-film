// 三个窗口：Laiye Worker（浅色主题，按 2026-10-23 录屏重绘）、Gmail、Xero（简化重绘，名字放在中性色块上，不用 logo）。
// 技术参考 skill 的 examples/ap-highlight-v03/ui.js。每个窗口根元素带 data-layer="product"；镜头和 MG 要对准的元素带 data-a。
import { clamp, eo } from './kit.js';

const AV = 'assets/ap-avatar.png', LW = 'brand/logos/laiye-worker.png';
export const WIN = { x: 180, y: 90, w: 1560, h: 900 };          // Laiye Worker 窗口（世界坐标）
export const EXT = { x: 2160, y: 100, w: 1440, h: 880 };        // 右边的外部系统窗口（Gmail / Xero）
const av = (sz, a = '', css = '') => `<img class="av" ${a} src="${AV}" style="width:${sz}px;height:${sz}px;${css}">`;
const I = {
  side: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3.5" width="14" height="13" rx="2.5"/><path d="M8 3.5v13"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="7" r="3.2"/><path d="M3.5 16.5c.8-3 3-4.5 5.5-4.5M15.5 11.5v5M13 14h5"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="9" r="5.5"/><path d="m13.2 13.2 3.6 3.6"/></svg>',
  store: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3.5 7.5 5 3.5h10l1.5 4M3.5 7.5h13v1a2.2 2.2 0 0 1-4.3.6 2.2 2.2 0 0 1-4.4 0A2.2 2.2 0 0 1 3.5 8.5zM4.5 10v6.5h11V10"/></svg>',
  acct: '<svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><circle cx="10" cy="8" r="2.8"/><path d="M5 15.5c1.2-2 2.9-3 5-3s3.8 1 5 3"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m4 9.5 3.2 3L14 5.5"/></svg>',
  done: '<svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="#2FA55A" stroke-width="1.6"><circle cx="10" cy="10" r="7.6"/><path d="m6.6 10.2 2.3 2.2 4.6-4.8"/></svg>',
  act: '<svg width="19" height="19" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.6" stroke="#2F6BD8" stroke-width="1.6"/><circle cx="10" cy="10" r="3.4" fill="#2F6BD8"/></svg>',
  todo: '<svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="#9A9A9A" stroke-width="1.5" stroke-dasharray="2.4 2.2"><circle cx="10" cy="10" r="7.6"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3v10M3 8h10"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
  x: '<svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m5 5 10 10M15 5 5 15"/></svg>',
  send: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" stroke-width="2"><path d="M8 13V3.5M4 7.5l4-4 4 4"/></svg>',
  clip: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M13.5 6.5 7.8 12.2a1.8 1.8 0 0 0 2.6 2.6l6-6a3.4 3.4 0 0 0-4.8-4.8l-6.2 6.2a5 5 0 0 0 7 7l4.8-4.8"/></svg>',
};

// ───────── Laiye Worker 窗口
// A = { op, dy, mkHot, market, sessions: [{ p }], session, chat: [...], hpOp }
export function worker(A) {
  const W = WIN;
  let h = `<div class="lw win" data-layer="product" style="left:${W.x}px;top:${W.y + (A.dy || 0)}px;width:${W.w}px;height:${W.h}px;opacity:${A.op ?? 1}">`;
  h += `<div class="side"><div class="s-top"><b>Laiye Worker</b><span>${I.side}${I.user}</span></div><div class="s-search">${I.search}<span>Search sessions</span></div>`;
  for (const s of A.sessions || []) h += `<div class="sess on" data-a="sess" style="opacity:${s.p};transform:translateY(${(1 - s.p) * 10}px)">${av(44, 'data-a="sessav"', `opacity:${s.av ?? 1}`)}<div class="sx"><div class="sn"><b>AI Accounts Payable Assi…</b><em>Just now</em></div><div class="ss">${s.sub || 'Ready to help'}</div></div></div>`;
  h += `<div class="s-bot"><div class="mk ${A.mkHot ? 'hot' : ''}" data-a="mk">${I.store}<span>Marketplace</span></div><div class="acct">${I.acct}<div><b>ap.team@yourco.com</b><small>Personal edition</small></div></div></div></div>`;
  h += `<div class="main"><div class="ctrl"><i></i><i class="mx"></i><i class="cl"></i></div>`;
  if (A.session) {
    h += `<div class="vp"><div class="msgs" id="msgs">`;
    (A.chat || []).forEach((it, i, a) => { if (i === a.length - 1) it.tail = 1; h += item(it); });
    h += `</div></div><div class="hfade"></div>`;
    h += `<div class="hdr"><span class="hp" data-a="hp" style="opacity:${A.hpOp ?? 1}">${av(30, 'data-a="hpav"')}<b>AI Accounts Payable Assistant</b></span></div>`;
    h += `<div class="ib"><span class="plus">+</span><div class="field"><span>Message AI Accounts Payable Assistant</span><span class="send">${I.send}</span></div></div>`;
  } else h += `<div class="empty"><img src="${LW}"><p>Add a worker from the Marketplace to get started.</p></div>`;
  h += `</div>`;
  if (A.market) h += market(A.market);
  return h + `</div>`;
}
function market(M) {
  const k = M.op ?? 1;
  return `<div class="scrim" style="opacity:${k * .9}"></div><div class="modal" style="opacity:${k};transform:scale(${.96 + .04 * k})"><h1>Marketplace</h1><span class="mx">${I.x}</span>
    <div class="tabs"><b>Worker</b></div>
    <div class="cards"><div class="mcard feat" data-a="card"><div class="ca"><img src="${AV}" data-a="cardav" style="opacity:${M.avOp ?? 1}"></div><span class="fp">Featured</span>
      <h3>AI Accounts Payable Assistant</h3><p>Receive supplier invoices, link purchase orders and delivery notes, check duplicates, reconcile the three…</p>
      <div class="ma"><span class="addb ${M.added ? 'on' : ''} ${M.hot ? 'hot' : ''}" data-a="add">${M.added ? I.check + 'Added' : I.plus + 'Add'}</span><span class="det">Details ${I.arrow}</span></div></div>
    <div class="mcard ghost"><i style="width:68px;height:68px;border-radius:15px"></i><i style="width:62%;height:18px;margin-top:22px"></i><i style="width:92%;height:12px;margin-top:20px"></i><i style="width:84%;height:12px;margin-top:14px"></i><i style="width:96px;height:38px;border-radius:19px;margin-top:52px"></i></div></div></div>`;
}

// 对话里的条目：p = 出现进度（高度展开 + 淡入）
const grow = (it, inner, cls = '') => {
  const p = it.p ?? 1, e = eo(clamp(p));
  const mh = p < 1 ? `max-height:${(it.h || 200) * e}px;overflow:hidden;` : '';
  return `<div class="it ${cls}" ${it.tail ? 'data-a="tail"' : ''} style="${mh}opacity:${Math.min(1, p * 2.2)}">${inner}</div>`;
};
const DUTIES = ['I receive supplier invoices', 'reconcile them with POs and delivery notes', 'maintain the AP ledger', 'prepare accounting drafts'];
function item(it) {
  switch (it.k) {
    case 'time': return grow(it, `<div class="ts">${it.text}</div>`);
    case 'greet': {
      const mark = i => `<span style="box-shadow:inset 0 -.42em 0 rgba(255,230,0,${.85 * clamp(it.hl[i] || 0)})">${DUTIES[i]}</span>`;
      return grow(it, `<div class="bub" data-a="greet">I'm your accounts payable colleague: ${mark(0)}, ${mark(1)}, ${mark(2)}, and ${mark(3)}.</div>`);
    }
    case 'bub': return grow(it, `<div class="bub" ${it.id ? `data-a="${it.id}"` : ''}>${it.html}</div>`);
    case 'att': return grow(it, `<div class="bub" data-a="attmsg">${it.html}<div class="files">${['Invoice', 'Invoice', 'Purchase order', 'Purchase order', 'Delivery order', 'Delivery order'].map((n, i) => `<span class="file" style="opacity:${clamp((it.files ?? 1) * 6 - i)}"><span class="pdf">PDF</span>${n}</span>`).join('')}</div></div>`, 'w');
    case 'q': {
      const cp = it.collapsed || 0, keep = i => it.sel == null || i === it.sel;
      let o = `<div class="q" data-a="${it.id}"><div class="qt">${it.title}</div><div class="opts">`;
      o += it.opts.map((op, i) => { const sel = i === it.sel, fold = cp > 0 && !keep(i);
        return `<div class="op ${sel ? 'sel' : ''} ${it.hl === i ? 'hl' : ''}" data-a="${it.id}-o${i}" style="${fold ? `height:${50 * (1 - cp)}px;opacity:${1 - cp}` : ''}"><span class="ol">${op.l}</span><span class="ot">${op.t}</span>${op.rec && cp < 1 ? '<em>Recommended</em>' : ''}${sel ? `<span class="ck" style="opacity:${it.ck ?? 1}">${I.check}</span>` : ''}</div>`; }).join('') + '</div>';
      if (it.submit && cp < 1) o += `<div style="${cp > 0 ? `max-height:${120 * (1 - cp)}px;overflow:hidden;opacity:${1 - cp}` : ''}"><div class="free"><span>Or just type your answer</span></div><div class="sb"><span class="sub ${it.sel != null ? 'on' : ''} ${it.subHot ? 'hot' : ''}" data-a="${it.id}-sub">Submit</span></div></div>`;
      return grow(it, o + '</div>');
    }
    case 'prog': {
      const cur = it.st.indexOf(1), done = it.st.filter(s => s === 2).length;
      const head = done >= 5 && cur === 5 ? `<span>Checklist has open items · 5/6 marked complete</span>` : `<span class="dots"><i></i><i></i><i></i></span><span>On step ${Math.max(1, cur + 1)} of 6</span>`;
      return grow(it, `<div class="prog" data-a="prog"><div class="ph">${head}</div>${STEPS.map((s, i) => `<div class="st s${it.st[i]}" data-a="step${i}">${[I.todo, I.act, I.done][it.st[i]]}<span>${s}</span></div>`).join('')}</div>`, 'w');
    }
  }
  return '';
}
export const STEPS = [
  'Retrieve the six PDF attachments from the Gmail message',
  'Read and classify each PDF (invoice / PO / delivery note) and extract facts',
  'Duplicate control for INV-2026-5211 and INV-2026-5212',
  'Create AP cases in the ledger and link invoices to PO/delivery notes',
  'Three-way audit against 1% tolerance',
  'Prepare draft previews (no Xero write without confirmation)',
];

// ───────── 右边的外部系统窗口：按 2026-10-23 录屏重绘（Gmail 26:35、Xero 24:55），带简化的浏览器标签栏和地址栏。
// 不用对方的 logo 图片，名称用文字；录屏里的真实姓名、邮箱、头像缩写都换掉。
const browser = (E, tab, url, inner) => `<div class="lw xw" data-layer="product" style="left:${EXT.x}px;top:${EXT.y + (E.dy || 0)}px;width:${EXT.w}px;height:${EXT.h}px;opacity:${E.op ?? 1}">
  <div class="btabs"><span class="btab"><i></i>${tab}</span></div><div class="baddr"><span class="bnav">‹ › ↻</span><span class="burl">${url}</span></div>${inner}</div>`;
const DOCS = [['PURCHASE ORDER', 'Sample_Purchase…'], ['DELIVERY ORDER', 'Sample_Delivery…'], ['DELIVERY ORDER', 'Sample_Delivery…'], ['TAX INVOICE', 'Sample_Invoice_…'], ['PURCHASE ORDER', 'Sample_Purchase…'], ['TAX INVOICE', 'Sample_Invoice_…']];
const thumb = title => `<div class="gth"><b>${title}</b><span>FreshFarm Produce Pte Ltd</span>${[78, 60, 70, 52].map(w => `<i style="width:${w}%"></i>`).join('')}<u></u></div>`;
// Gmail：G = { op, dy, open (邮件打开 0→1), hot (头像落在附件上), att (附件出现 0→1), sent (附件被带走 0→1) }
export function gmail(G) {
  const nav = [['Inbox', 1], ['Starred'], ['Snoozed'], ['Sent'], ['Drafts', 0, '1'], ['Purchases'], ['More']];
  const cards = DOCS.map(([t, n], i) => `<div class="gcard" style="opacity:${clamp(G.att * 6 - i) * (1 - clamp((G.sent || 0) * 6 - i) * .75)}">${thumb(t)}<div class="gcf"><span class="pdf">PDF</span>${n}</div></div>`).join('');
  const inner = `<div class="gtop"><span class="ghm">☰</span><b class="gname">Gmail</b><span class="gsearch">Search mail</span><span class="gav">A</span></div>
    <div class="gwrap"><div class="gnav2"><span class="gcomp">✎ Compose</span>${nav.map(([n, on, c]) => `<span class="gni ${on ? 'on' : ''}">${n}${c ? `<em>${c}</em>` : ''}</span>`).join('')}<span class="glab">Labels <em>+</em></span></div>
    <div class="gpane"><div class="gtool"><span>←</span><span>⊡</span><span>ⓘ</span><span>🗑</span><span class="g1">1 of 1</span></div>
      <div class="gmsg" style="opacity:${clamp(G.open * 1.5)};transform:translateY(${(1 - eo(clamp(G.open))) * 24}px)">
        <div class="gsubj">Invoices, POs and delivery orders</div>
        <div class="gfrom"><span class="gfav">F</span><b>FreshFarm Produce</b><span class="gtime">2:14 AM</span></div>
        <div class="gbodyimg"><img src="brand/logos/laiye-en-black.png"></div>
        <div class="gatth ${G.hot ? 'hot' : ''}" data-a="mail"><b>6 Attachments</b> · Scanned by Gmail <span class="gdrive">Add all to Drive</span></div>
        <div class="gcards">${cards}</div>
        <div class="gbtns"><span>↩ Reply</span><span>↪ Forward</span></div></div></div></div>`;
  return browser(G, 'Invoices, POs and delivery orders', 'mail.google.com/mail/u/0/#inbox', inner);
}
// Xero：X = { op, dy, hot }
export function xero(X) {
  const L = [['PM-001 Fresh Pak Choi kg', '50.00', '1.80', '90.00'], ['VG-204 Iceberg Lettuce kg', '30.00', '2.50', '75.00'], ['VG-118 Tomatoes (Cherry) kg', '20.00', '3.60', '72.00']];
  const inner = `<div class="xn"><span class="xl">xero</span><span class="org">LAIYE PTE ▾</span><span>Home</span><span>Sales</span><span class="on">Purchases</span><span>Reporting</span><span>Accounting</span><span>Tax</span><span>Contacts</span><span>Projects</span><span class="hl">AP</span></div>
    <div class="xb"><div class="xbc">Purchases overview › Bills to pay ›</div><div class="xh">Edit Bill INV-2026-5211</div>
      <div class="xc"><span class="xst" data-a="xdraft">Draft</span><div class="xpp"><span>Print PDF</span><span>Bill Options ▾</span></div>
        <div class="xf"><div><small>From</small><span style="width:250px">FreshFarm Produce Pte Ltd</span></div><div><small>Date</small><span style="width:130px">24 Aug 2026</span></div><div><small>Due Date</small><span style="width:130px">23 Sep 2026</span></div><div><small>Reference</small><span style="width:170px">INV-2026-5211</span></div><div class="tot"><small>Total</small><span>258.33</span></div></div>
        <div class="xae"><span>SGD Singapore Dollar ▾</span><span class="xae2">Amounts are <b>Tax Exclusive ▾</b></span></div>
        <div class="xt"><div class="xr hd"><span>Description</span><span class="n">Qty</span><span class="n">Unit Price</span><span>Account</span><span>Tax Rate</span><span class="n">Amount SGD</span></div>
          ${L.map(([d, q, u, a]) => `<div class="xr"><span>${d}</span><span class="n">${q}</span><span class="n">${u}</span><span>300 - Purchase</span><span>Standard-Rated Purchases (9%)</span><span class="n">${a}</span></div>`).join('')}</div>
        <div class="xsum"><span>Subtotal</span><b>237.00</b><span>Total Tax 9.00%</span><b>21.33</b><span class="T">TOTAL</span><b class="T">258.33</b></div>
        <div class="xbtn"><span class="xsave">Save ▾</span><span class="xapp ${X.hot ? 'hot' : ''}" data-a="approve">Approve ▾</span><span class="xcan">Cancel</span></div></div></div>`;
  return browser(X, 'Xero | Edit Bill | LAIYE PTE', 'go.xero.com/AccountsPayable/Edit.aspx', inner);
}

export const CSS = `
.lw{position:absolute;font-family:var(--ly-sans-en);color:#1F1F1F;-webkit-font-smoothing:antialiased}
.lw .av{display:block;border-radius:50%;object-fit:cover}
.lw.win{background:#FAFAFA;border-radius:12px;overflow:hidden;display:flex;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 40px 120px rgba(0,0,0,.65)}
.lw .side{width:330px;flex:none;background:#F2F2F2;border-right:1px solid #E6E6E6;display:flex;flex-direction:column;padding:0 12px}
.lw .s-top{height:58px;display:flex;align-items:center;padding:0 12px}.lw .s-top b{font-size:23px;font-weight:650}.lw .s-top span{margin-left:auto;display:flex;gap:22px;color:#5A5A5A}
.lw .s-search{height:40px;border-radius:9px;background:#E6E6E6;display:flex;align-items:center;gap:10px;padding:0 14px;color:#7A7A7A;font-size:16.5px;margin:4px 0 12px}
.lw .sess{display:flex;gap:12px;align-items:center;padding:10px 12px;border-radius:12px;height:66px;background:#E2E2E2}
.lw .sx{min-width:0;flex:1}.lw .sn{display:flex;align-items:center;gap:8px}.lw .sn b{font-size:16.5px;font-weight:600;white-space:nowrap}
.lw .sn em{margin-left:auto;font-style:normal;font-size:14px;color:#8A8A8A}.lw .ss{font-size:15px;color:#6A6A6A;margin-top:2px}
.lw .s-bot{margin-top:auto;padding-bottom:12px}
.lw .mk{display:flex;gap:12px;align-items:center;height:44px;padding:0 12px;border-radius:10px;font-size:17px;color:#4A4A4A}.lw .mk.hot{background:#E2E2E2}
.lw .acct{display:flex;gap:12px;align-items:center;padding:10px 12px;color:#5A5A5A}.lw .acct b{display:block;font-size:15.5px;font-weight:500;color:#1F1F1F}.lw .acct small{font-size:14px;color:#6A6A6A}
.lw .main{flex:1;position:relative;min-width:0;background:#FAFAFA}
.lw .ctrl{position:absolute;right:20px;top:16px;display:flex;gap:40px;z-index:2}
.lw .ctrl i{width:14px;height:14px;position:relative;display:block}
.lw .ctrl i:before{content:'';position:absolute;left:0;right:0;top:7px;height:1.5px;background:#3A3A3A}
.lw .ctrl .mx:before{top:1px;bottom:1px;height:auto;border:1.5px solid #3A3A3A;background:none;border-radius:2px}
.lw .ctrl .cl:before,.lw .ctrl .cl:after{content:'';position:absolute;left:-1px;right:-1px;top:6px;height:1.5px;background:#3A3A3A;transform:rotate(45deg)}.lw .ctrl .cl:after{transform:rotate(-45deg)}
.lw .hdr{position:absolute;left:0;right:0;top:8px;display:flex;justify-content:center;z-index:3}
.lw .hp{display:flex;align-items:center;gap:10px;background:#FFFFFF;border-radius:24px;padding:7px 16px 7px 8px;box-shadow:0 1px 6px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.05)}.lw .hp b{font-size:17px;font-weight:550}
.lw .hfade{position:absolute;left:0;right:0;top:0;height:70px;background:linear-gradient(#FAFAFA 40%,rgba(250,250,250,0));z-index:2}
.lw .vp{position:absolute;left:0;right:0;top:0;bottom:84px;overflow:hidden}
.lw .msgs{position:absolute;left:40px;width:860px;display:flex;flex-direction:column;gap:12px;padding:80px 0 26px;font-size:17px;line-height:1.55}
.lw .it{flex:none}.lw .ts{text-align:center;color:#8A8A8A;font-size:14px;width:1150px;padding:2px 0}
.lw .bub{display:inline-block;background:#F0F0F0;border-radius:14px;padding:11px 17px;max-width:860px}.lw .it.w .bub{display:block}
.lw .files{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.lw .file{display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;border:1px solid #E2E2E2;border-radius:8px;padding:6px 10px;font-size:14.5px;white-space:nowrap}
.lw .pdf{background:#E5534B;color:#fff;font-size:10px;font-weight:800;border-radius:3px;padding:2px 4px}
.lw .q{background:#F0F0F0;border-radius:14px;padding:16px 17px}
.lw .qt{font-weight:600;font-size:17px;padding:0 1px 12px}
.lw .opts{border-radius:9px;overflow:hidden;display:flex;flex-direction:column;border:1px solid #DDDDDD;background:#DDDDDD;gap:1px}
.lw .op{display:flex;align-items:center;gap:14px;height:50px;padding:0 16px 0 14px;background:#E9E9E9;font-size:17px}
.lw .op.sel,.lw .op.hl{background:#DCDCDC}
.lw .ol{width:26px;height:26px;border-radius:5px;background:#DCDCDC;display:grid;place-items:center;font-size:13px;color:#6A6A6A;font-weight:600;flex:none}
.lw .op em{margin-left:auto;font-style:normal;font-size:14.5px;color:#6A6A6A}.lw .op .ck{margin-left:auto;color:#3A3A3A;display:flex}.lw .op em+.ck{margin-left:12px}
.lw .free{margin-top:12px;height:46px;border-radius:9px;background:#FFFFFF;border:1px solid #E2E2E2;display:flex;align-items:center;padding:0 15px;font-size:16.5px;color:#9A9A9A}
.lw .sb{display:flex;justify-content:flex-end;margin-top:12px}
.lw .sub{background:#A9A9A9;color:#FFFFFF;border-radius:8px;padding:9px 18px;font-size:16.5px;font-weight:650}.lw .sub.on{background:#171717}.lw .sub.hot{background:#000;box-shadow:0 0 0 4px rgba(0,0,0,.12)}
.lw .prog{background:#F0F0F0;border-radius:14px;padding:14px 22px 14px 17px;font-size:16.5px}
.lw .ph{display:flex;align-items:center;gap:12px;color:#4A4A4A;margin-bottom:6px;height:28px}
.lw .dots{display:inline-flex;gap:5px}.lw .dots i{width:6px;height:6px;border-radius:50%;background:#9A9A9A;display:block}
.lw .st{display:flex;align-items:center;gap:12px;height:33px;color:#6A6A6A;white-space:nowrap}.lw .st svg{flex:none}.lw .st.s1{color:#1F1F1F;font-weight:550}.lw .st.s2{color:#3A3A3A}
.lw .ib{position:absolute;left:24px;right:24px;bottom:18px;display:flex;align-items:center;gap:14px}
.lw .plus{width:38px;height:38px;border-radius:50%;background:#FFFFFF;border:1px solid #E2E2E2;display:grid;place-items:center;color:#5A5A5A;font-size:24px;font-weight:300}
.lw .field{flex:1;height:52px;border-radius:16px;background:#FFFFFF;border:1px solid #E2E2E2;display:flex;align-items:center;padding:0 10px 0 22px;font-size:17px;color:#9A9A9A}
.lw .field .send{margin-left:auto;width:32px;height:32px;border-radius:50%;background:#2A2A2A;display:grid;place-items:center}
.lw .empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;color:#8A8A8A;font-size:18px}.lw .empty img{width:72px;height:72px;border-radius:18px}
.lw .scrim{position:absolute;inset:0;background:rgba(0,0,0,.44);z-index:8}
.lw .modal{position:absolute;left:230px;top:70px;width:1100px;height:760px;background:#FFFFFF;border-radius:20px;z-index:9;padding:36px 42px}
.lw .modal h1{font-size:21px;font-weight:600}.lw .modal .mx{position:absolute;right:38px;top:34px;color:#3A3A3A}
.lw .tabs{margin-top:34px;border-bottom:1px solid #E6E6E6;display:flex;align-items:flex-end;height:44px}.lw .tabs b{font-size:17px;font-weight:500;padding:0 6px 12px;border-bottom:2.5px solid #1F1F1F}
.lw .cards{display:flex;gap:20px;margin-top:22px}
.lw .mcard{width:356px;height:322px;border-radius:16px;padding:24px;position:relative}
.lw .mcard.feat{background:#24262B;box-shadow:0 10px 30px rgba(0,0,0,.18)}.lw .mcard.ghost{background:#FFFFFF;border:1px solid #ECECEC}.lw .mcard.ghost i{display:block;border-radius:8px;background:#F1F1F1}
.lw .ca{width:68px;height:68px;border-radius:15px;background:#FBEDEA;overflow:hidden}.lw .ca img{width:68px;height:68px;object-fit:cover}
.lw .fp{position:absolute;right:24px;top:28px;background:#3B3626;color:#F2CC40;font-weight:650;font-size:14px;border-radius:15px;padding:5px 11px}
.lw .mcard h3{margin-top:20px;font-size:20px;font-weight:650;color:#FFFFFF}.lw .mcard p{margin-top:12px;font-size:16.5px;line-height:1.75;color:#BDBDBD}
.lw .ma{position:absolute;left:24px;bottom:26px;display:flex;align-items:center;gap:24px}
.lw .addb{display:flex;align-items:center;gap:7px;border:1.5px solid #CDAA2E;background:#36321F;color:#F2CC40;font-weight:650;font-size:16.5px;border-radius:22px;padding:8px 16px}
.lw .addb.hot{box-shadow:0 0 0 4px rgba(242,204,64,.22)}.lw .addb.on{background:#F2CC40;color:#1F1F1F;border-color:#F2CC40}
.lw .det{color:#D6D6D6;font-size:16px;display:flex;align-items:center;gap:6px}
.lw.xw{background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 40px 120px rgba(0,0,0,.65)}
.lw .btabs{height:40px;background:#DFE3EA;display:flex;align-items:flex-end;padding:0 12px}
.lw .btab{height:32px;background:#FFFFFF;border-radius:9px 9px 0 0;display:flex;align-items:center;gap:9px;padding:0 16px;font-size:14px;color:#2A2A2A;width:300px;white-space:nowrap;overflow:hidden}.lw .btab i{width:14px;height:14px;border-radius:3px;background:#C9CED6;flex:none}
.lw .baddr{height:42px;display:flex;align-items:center;gap:16px;padding:0 16px;border-bottom:1px solid #E6E6E6;color:#5A5A5A}
.lw .bnav{font-size:16px;letter-spacing:.2em;color:#6A6A6A}.lw .burl{flex:1;height:30px;border-radius:15px;background:#EEF1F5;display:flex;align-items:center;padding:0 16px;font-size:14px;color:#3A3A3A}
.lw .gtop{height:68px;display:flex;align-items:center;gap:18px;padding:0 20px;background:#F6F8FC}
.lw .ghm{font-size:22px;color:#5F6368}.lw .gname{font-size:24px;font-weight:500;color:#5F6368;width:150px}
.lw .gsearch{width:640px;height:46px;border-radius:23px;background:#EAF1FB;display:flex;align-items:center;padding:0 22px;font-size:17px;color:#5F6368}
.lw .gav{margin-left:auto;width:36px;height:36px;border-radius:50%;background:#8A6BB8;color:#fff;display:grid;place-items:center;font-weight:600}
.lw .gwrap{display:flex;height:calc(100% - 150px);background:#F6F8FC}
.lw .gnav2{width:240px;padding:6px 12px;display:flex;flex-direction:column;gap:2px;font-size:15.5px;color:#202124}
.lw .gcomp{display:inline-flex;align-self:flex-start;align-items:center;gap:10px;background:#C2E7FF;border-radius:16px;padding:16px 22px;font-weight:550;margin:4px 0 14px}
.lw .gni{display:flex;align-items:center;height:34px;padding:0 18px;border-radius:0 17px 17px 0;margin-left:-12px}.lw .gni.on{background:#D3E3FD;font-weight:700}.lw .gni em{margin-left:auto;font-style:normal;font-size:13px}
.lw .glab{margin-top:18px;padding-left:6px;font-size:17px;display:flex}.lw .glab em{margin-left:auto;font-style:normal}
.lw .gpane{flex:1;background:#FFFFFF;border-radius:16px;margin:0 16px 16px 0;padding:0 34px;overflow:hidden}
.lw .gtool{height:50px;display:flex;align-items:center;gap:26px;color:#5F6368;font-size:16px;border-bottom:1px solid #F1F3F4}.lw .g1{margin-left:auto;font-size:13.5px}
.lw .gsubj{font-size:22px;color:#1F1F1F;margin:18px 0 12px}
.lw .gfrom{display:flex;align-items:center;gap:12px;font-size:15px}.lw .gfav{width:36px;height:36px;border-radius:50%;background:#7CB342;color:#fff;display:grid;place-items:center;font-weight:600}.lw .gtime{margin-left:auto;color:#5F6368;font-size:13.5px}
.lw .gbodyimg{width:180px;height:130px;background:#FFE600;display:grid;place-items:center;margin:16px 0 18px 48px}.lw .gbodyimg img{width:132px}
.lw .gatth{display:inline-flex;align-items:center;gap:8px;font-size:16px;color:#3C4043;padding:6px 10px;margin-left:38px;border-radius:8px;border-top:1px solid #E8EAED}.lw .gatth.hot{background:#FFF8C2}
.lw .gdrive{margin-left:18px;color:#5F6368}
.lw .gcards{display:flex;flex-wrap:wrap;gap:12px;margin:10px 0 0 48px;width:1000px}
.lw .gcard{width:186px;height:132px;border:1px solid #E0E0E0;border-radius:4px;overflow:hidden;position:relative;background:#FFFFFF}
.lw .gth{height:92px;padding:9px 12px;background:#FFFFFF;display:flex;flex-direction:column;gap:4px}.lw .gth b{font-size:9.5px;color:#2F5597;text-align:center;letter-spacing:.04em}.lw .gth span{font-size:7.5px;color:#2F5597;font-weight:600}
.lw .gth i{display:block;height:4px;border-radius:2px;background:#E6E9EE}.lw .gth u{display:block;height:9px;background:#2C4A5E;margin-top:2px}
.lw .gcf{height:40px;background:#F5F5F5;display:flex;align-items:center;gap:8px;padding:0 10px;font-size:13.5px;font-weight:550;color:#3C4043;border-top:1px solid #EEE}
.lw .gcard:after{content:'';position:absolute;right:0;bottom:0;border-style:solid;border-width:0 0 20px 20px;border-color:transparent transparent #EA4335 transparent}
.lw .gbtns{display:flex;gap:12px;margin:26px 0 0 48px}.lw .gbtns span{border:1px solid #747775;border-radius:20px;padding:9px 22px;font-size:15px;color:#444746}
.lw .xn{height:58px;background:#3966DB;display:flex;align-items:center;gap:26px;padding:0 24px;color:#FFFFFF;font-size:17px;font-weight:500}
.lw .xl{font-size:28px;font-weight:700;letter-spacing:-.04em}.lw .org{background:#355CC4;border-radius:6px;padding:6px 12px;font-weight:600}
.lw .xn .on{background:rgba(255,255,255,.16);border-radius:6px;padding:5px 9px}
.lw .xn .hl{margin-left:auto;width:34px;height:34px;border-radius:50%;background:#A59FCF;color:#1F1F1F;display:grid;place-items:center;font-size:13px;font-weight:700}
.lw .xb{background:#FCFCFC;height:calc(100% - 140px);padding:14px 40px}
.lw .xbc{font-size:14.5px;color:#3D85C6;padding-left:6px}.lw .xh{font-size:28px;font-weight:650;color:#1F1F1F;margin:2px 0 14px 6px}
.lw .xc{background:#FFFFFF;border:1px solid #DCE0E6;border-radius:6px;padding:14px 18px 16px;position:relative}
.lw .xst{display:inline-block;font-size:15px;color:#6A6A6A;font-weight:600;padding:2px 2px}
.lw .xpp{position:absolute;right:18px;top:10px;display:flex;gap:10px}.lw .xpp span{border:1px solid #C9CED6;background:#F7FAFC;border-radius:5px;padding:6px 14px;font-size:14px;color:#3D85C6;font-weight:650}
.lw .xf{display:flex;gap:16px;margin-top:20px}.lw .xf div{display:flex;flex-direction:column;gap:5px}.lw .xf small{font-size:14px;font-weight:650;color:#2A2A2A}
.lw .xf span{height:34px;border:1px solid #C9CED6;border-radius:3px;display:flex;align-items:center;padding:0 10px;font-size:15px;color:#1F1F1F;white-space:nowrap}
.lw .xf .tot{margin-left:auto;align-items:flex-end}.lw .xf .tot span{justify-content:flex-end;min-width:150px}
.lw .xae{display:flex;justify-content:space-between;align-items:center;margin-top:14px;font-size:14.5px;color:#2A2A2A}.lw .xae>span:first-child{border:1px solid #C9CED6;border-radius:3px;padding:7px 12px}.lw .xae2 b{font-weight:500;border:1px solid #C9CED6;border-radius:3px;padding:7px 12px;margin-left:8px}
.lw .xt{margin-top:14px;border-top:1px solid #DCE0E6}
.lw .xr{display:grid;grid-template-columns:330px 80px 100px 150px 1fr 120px;align-items:center;min-height:50px;border-bottom:1px solid #E6E9ED;font-size:15px;color:#1F1F1F}
.lw .xr>*{padding:0 10px}.lw .xr .n{text-align:right}.lw .xr.hd{min-height:36px;font-size:14px;color:#4A4A4A;font-weight:650;background:#FAFAFB}
.lw .xsum{display:grid;grid-template-columns:1fr 150px;width:420px;margin:12px 0 0 auto;row-gap:8px;font-size:15px}.lw .xsum span{text-align:right;color:#3A3A3A}.lw .xsum b{text-align:right;font-weight:500}
.lw .xsum .T{font-size:24px;font-weight:700;color:#1F1F1F;border-top:2px solid #3A3A3A;padding-top:10px}
.lw .xbtn{display:flex;align-items:center;margin-top:16px;gap:12px;border-top:1px solid #EEF0F3;padding-top:14px}
.lw .xbtn span{border-radius:4px;padding:10px 26px;font-size:16px;font-weight:650}
.lw .xsave{background:#2F8FD6;color:#fff}.lw .xapp{margin-left:auto;background:#6CC21F;color:#fff}.lw .xapp.hot{box-shadow:0 0 0 4px rgba(108,194,31,.25)}.lw .xcan{background:#B5B8BC;color:#1F1F1F}
`;
