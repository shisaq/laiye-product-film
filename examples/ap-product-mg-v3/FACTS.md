# FACTS · AI Accounts Payable Assistant · Product MG

## 产品事实（来自真实素材）

| 事实 / 原文 | 出处 |
|---|---|
| Marketplace：Worker 标签，Featured 卡片 "AI Accounts Payable Assistant — Receive supplier invoices, link purchase orders and delivery notes, check duplicates, reconcile the three…"，+ Add，Details → | 录屏 0:00 |
| "I'm your accounts payable colleague: I receive supplier invoices, reconcile them with POs and delivery notes, maintain the AP ledger, and prepare accounting drafts." | 录屏（打招呼原文） |
| How will you provide documents? A Drop files into this chat (Recommended) · B Fetch from Gmail → 选 B | 录屏（配置卡原文） |
| Where should the AP ledger be kept? A Use Google Sheets (Recommended) · B Use a local Excel file · C Handle everything in this chat → 选 A | 录屏 |
| Where should accounting drafts be prepared? → B Xero Accounting | 录屏 |
| How should invoice variances be handled? A Default: up to 1% price gap passes (Recommended) · B Ask me about every difference · C Set a custom tolerance → 选 A | 录屏 |
| 六步清单：Retrieve the six PDF attachments from the Gmail message · Read and classify each PDF (invoice / PO / delivery note) and extract facts · Duplicate control for INV-2026-5211 and INV-2026-5212 · Create AP cases in the ledger and link invoices to PO/delivery notes · Three-way audit against 1% tolerance · Prepare draft previews (no Xero write without confirmation)；"On step 1 of 6"；"Checklist has open items · 5/6 marked complete" | 录屏 14:20、16:20 |
| INV-2026-5211 ↔ PO-2026-0518 ↔ DO-2026-3302；FreshFarm Produce Pte Ltd → Little Red Dot Kitchen Pte Ltd；24 Aug 2026；SGD | 三份 PDF |
| Fresh Pak Choi 50 kg × 1.80 · Iceberg Lettuce 30 kg × 2.50 · Tomatoes (Cherry) 20 kg × 3.60；Subtotal 237.00 · GST 9% 21.33 · Total 258.33 | 三份 PDF 一致；Xero 草稿 |
| "Audit passed with zero variance"（INV-2026-5211） | 录屏 16:20 |
| How should I proceed? A Create the Xero draft for INV-2026-5211 (Recommended) | 录屏 16:20 |
| "The Xero draft for INV-2026-5211 is created and verified." "It is a draft only — nothing has been approved, posted or paid." | 录屏（AI 回复原文） |
| Xero：Edit Bill INV-2026-5211 · Draft · From FreshFarm Produce Pte Ltd · Due 23 Sep 2026 · TOTAL 258.33 · Save / Approve | 录屏（Xero 页面） |
| laiye.com/en/ai-accounts-payable-assistant | 推广策划；用户指定 |
| Xero Edit Bill 页面（按录屏 24:55 重绘）：LAIYE PTE · Purchases overview › Bills to pay › · Edit Bill INV-2026-5211 · Draft · Print PDF · Bill Options · From FreshFarm Produce Pte Ltd · Date 24 Aug 2026 · Due Date 23 Sep 2026 · Reference INV-2026-5211 · Total 258.33 · SGD Singapore Dollar · Amounts are Tax Exclusive · PM-001 Fresh Pak Choi kg 50.00 × 1.80 = 90.00 · VG-204 Iceberg Lettuce kg 30.00 × 2.50 = 75.00 · VG-118 Tomatoes (Cherry) kg 20.00 × 3.60 = 72.00 · 300 - Purchase · Standard-Rated Purchases (9%) · Subtotal 237.00 · Total Tax 9.00% 21.33 · TOTAL 258.33 · Save / Approve / Cancel | 录屏 24:55 |
| Gmail 邮件页（按录屏 26:35 重绘）：6 Attachments · Scanned by Gmail · Add all to Drive · Sample_Purchase… / Sample_Delivery… / Sample_Invoice_… 附件卡片 · Reply / Forward · 1 of 1；正文是来也 logo 图片 | 录屏 26:35；`新增素材/邮件.png` |
| "I found the accounting mailbox: one email … carrying six PDFs" → 片中节选为 `I found the accounting mailbox: one email carrying six PDFs.` | 录屏 14:20 |
| "Setup is done: Gmail for documents, Google Sheets ledger (…), Xero Accounting for drafts (LAIYE PTE, SGD), 1% price tolerance, …" → 片中节选 | 录屏 14:20 |
| 空状态 `Add a worker from the Marketplace to get started.` | 沿用 03（已审） |

## 产品方说明

| 说法 | 来源 |
|---|---|
| AI 员工在云端 24/7 运行 → 片中 `Runs in the cloud.` | 产品方说明（AP Highlight 简报，2026-10） |

## 戏剧化处理

| 内容 | 为什么 |
|---|---|
| 时钟 17:40（配置）、02:14（夜里执行）、02:31 → 09:03（早上决定） | 表现 24/7；录屏里是配置后立刻手动运行（与 03 一致） |
| Gmail 那封邮件的标题 `Invoices, POs and delivery orders`、发件人 `FreshFarm Produce`、时间 `2:14 AM` | 录屏里发件人是内部同事、标题是内部测试命名（隐私），改为供应商；Xero 右上角头像缩写改为 AP |
| 头像（向导）在窗口之间移动 | 表现 AI 员工在哪里干活；实际是后台调用 Gmail / Xero |

动画中间值：
忽略正则：`^\d{2}:\d{2}$`（时钟翻动时的中间读数）

## 替换掉的隐私数据

| 原始 | 片中 |
|---|---|
| 录屏里的账号和发件人 | 不出现 |

## 省略和简化

- "How should I proceed?" 只显示选项 A（同 03；B、C 涉及 INV-2026-5212，不展示）。
- 配置卡只显示问题和选中项附近的选项；授权页面、Google Sheets 界面省略。
- Gmail、Xero 按录屏重绘，加简化的浏览器标签栏和地址栏；不用对方 logo 图片，名称用文字；Gmail 右侧应用栏、Xero 的 Item 列和 Permit Number 字段省略。
