# AI Accounts Payable Assistant

## 名称和定位

- 写法：**AI Accounts Payable Assistant**（画面上写全称；口播和配文可以说 AP assistant）。
- 主宣传语：**Your 24/7 AI employee for accounts payable.**
- 是什么：Laiye Worker 上的一位 AI 员工。接收供应商发票，关联采购单（PO）和送货单（DO），查重，做三单匹配，维护 AP 台账，在会计系统里准备草稿。**只建草稿，审批和付款留给人。**
- 图标：`ap-assistant-icon.png`（256px，Marketplace 卡片和片尾用）；`ap-assistant-avatar.png`（440px 头像）。
- 官网页：laiye.com/en/ai-accounts-payable-assistant（2026-10 Highlight 片尾所用）。
- 推广目标（2026-10）：海外受众（LinkedIn / X / YouTube），引导下载 Laiye Worker 试用，或加入 Discord 社群。

## 可以上画面的事实

来源：2026-10-23 录屏 `新增素材/20261023115347_rec_.mp4`、`AP Ledger20261023.xlsx`、`邮件附件/*.pdf`。文案是录屏原文。

- Marketplace：Worker 标签，Featured 深色卡片 "AI Accounts Payable Assistant — Receive supplier invoices, link purchase orders and delivery notes, check duplicates, reconcile the three…"，黄色 **+ Add**，**Details →**。
- 打招呼："I'm your accounts payable colleague: I receive supplier invoices, reconcile them with POs and delivery notes, maintain the AP ledger, and prepare accounting drafts."
- 配置卡（原文）：
  - *How will you provide documents?* → B Fetch from Gmail
  - *Where should the AP ledger be kept?* → A Use Google Sheets
  - *Should I create a new AP ledger, or use an existing spreadsheet?* → A Create a new AP ledger spreadsheet
  - *Where should accounting drafts be prepared?* → B Xero Accounting（"Xero is connected and I confirmed the organization: LAIYE PTE, base currency SGD."）
  - *How should invoice variances be handled?* → A Default: up to 1% price gap passes（"Saved: unit-price gaps up to 1% pass automatically when quantities match."）
- 取件："I found the accounting mailbox: one email … carrying six PDFs — two invoices (INV-2026-5211, INV-2026-5212), two purchase orders (PO-2026-0518, PO-2026-0519) and two delivery orders (DO-2026-3302, DO-2026-3303)."
- 六步清单（原文）：Retrieve the six PDF attachments from the Gmail message · Read and classify each PDF (invoice / PO / delivery note) and extract facts · Duplicate control for INV-2026-5211 and INV-2026-5212 · Create AP cases in the ledger and link invoices to PO/delivery notes · Three-way audit against 1% tolerance · Prepare draft previews (no Xero write without confirmation)。结束状态 "Checklist has open items · 5/6 marked complete"。
- 结果：AP-2026-0001 / INV-2026-5211 逐行一致，零差异，258.33 SGD，可以建草稿。
- **待确认**：录屏里 AI 说 AP-2026-0002 / INV-2026-5212 的 Iceberg Lettuce 发票单价是 2.57/kg（PO 和 DO 是 2.50），差 2.80%，超过 1% 容差，不建草稿、等人决定。但 `邮件附件/Sample_Invoice_INV-2026-5212.pdf` 上是 2.50，三张单完全一致；AI 说的合计 262.96 也算错了（按 2.57 应为 260.62）。确认邮箱里实际发出的是哪一版之前，这组数字不要上画面（2026-10-26 发现）。
- 样例单据：供应商 FreshFarm Produce Pte Ltd，买方 Little Red Dot Kitchen Pte Ltd（餐饮），三行菜品 Fresh Pak Choi 50 kg × 1.80、Iceberg Lettuce 30 kg × 2.50、Tomatoes (Cherry) 20 kg × 3.60，合计 258.33 SGD（含 9% GST）。
- 选项（原文）：A Create the Xero draft for INV-2026-5211 (Recommended) · B Hold both cases for now · C Only decide INV-2026-5212 variance first。
- 回复（原文节选）："The Xero draft for INV-2026-5211 is created and verified. … I read it back from Xero and every field matches the preview. It is a draft only — nothing has been approved, posted or paid."
- Xero *Edit Bill INV-2026-5211*：Draft · From FreshFarm Produce Pte Ltd · 24 Aug 2026 · due 23 Sep 2026 · Tax Exclusive · PM-001 Fresh Pak Choi kg 50 × 1.80，VG-204 Iceberg Lettuce kg 30 × 2.50，VG-118 Tomatoes (Cherry) kg 20 × 3.60 · 300 - Purchase · Standard-Rated Purchases (9%) · Subtotal 237.00 · Total Tax 9.00% 21.33 · TOTAL 258.33。
- AP 台账（Google Sheets，工作表 AP Cases）：AP-2026-0001、AP-2026-0002 两行，含供应商、发票号、日期、SGD、金额 258.33 / 262.96、PO、送货单。
- 云端 24/7 运行，电脑合上也继续（产品方说明）。

## 不能说

- AI 员工审批、过账或付款。
- 录屏里没有的集成（Gmail、Google Sheets、Xero 之外的系统，除非有新录屏）。
- 处理量、节省时长之类的数字（目前没有出处）。

## 已有的片子

- `examples/ap-highlight-v03/`（skill 根目录下）：Highlight v03（50 秒，英文，无旁白，浅色界面，无吉祥物）。用户审过的版本，是 Laiye Screencast 风格的参考片。修改意见见 `../../../references/lessons.md`。
