# 来也品牌规范（视频版）

这一页是硬约束：颜色、字体、logo、产品名、口径。它不规定故事、版式和镜头，那些归风格（`styles/`）和导演（`references/directing.md`）。
机器可读的版本在 `tokens.json`，`scripts/check.mjs` 按它检查成片。改规则时三处一起改：本页、`tokens.json`、`brand.css`。

画面分两层，规则不一样：

| 层 | 是什么 | 颜色和字体听谁的 |
|---|---|---|
| **产品界面层**（`data-layer="product"`） | 重绘的产品界面：Laiye Worker 窗口、第三方系统的简化界面 | 听产品本身（`products/<产品>/ui-tokens.json`），越像真的越好 |
| **MG 层**（其余所有元素） | 标题、标注、高亮框、连线、数据卡、片头片尾 | 听本页 |

## 1. 颜色

| 角色 | 色值 | 用法 |
|---|---|---|
| 来也黄 | `#FFE600` | **唯一强调色**。留给产品本身、关键动作、结论、CTA。同一画面两处都是黄，就有一处错了 |
| 黑 | `#000000` | 深色舞台、黄底上的字 |
| 白 | `#FFFFFF` | 深色底上的主文字 |
| 专色金 / 银 | `#BF9C46` / `#B5B5B6` | 极少用：荣誉、奖项类 |
| 蓝色系 | `#87C5ED` `#0080CA` `#1A439B` `#2249C0` `#002E5A` `#04163A`，图表蓝 `#5187E4` | 只做类别区分（几种单据、几条数据流）和图表对比，不做强调 |
| 黄橙色系 | `#FFFFB8` `#FFF27C` `#D0B87D` `#FFF200` `#FF7F00` `#F26401` | 黄的深浅变化、警示的过渡色 |
| 语义色 | 深底：通过 `#3DDC84` 异常 `#FF4D3D`；浅底：通过 `#2FA55A` 异常 `#D9483B` | 只在"通过 / 异常"真的发生时出现，面积小；问题解决后异常色不再出现 |

中性阶（舞台、卡片、分隔线、次要文字）：

- 深色：`#0B0B0C` 底 · `#17171A` / `#202024` 卡片 · `#2A2A2E` 线 · `#8A8A8F` 次要字 · `#F5F5F0` 主文字。中性色略偏暖或纯中性，**不要偏蓝**（偏蓝的冷灰会把来也黄衬脏）。
- 浅色：`#F8F9FA` 底 · `#FFFFFF` 卡片 · `#E6E6E6` 线 · `#8A8A8A` 次要字 · `#1A1A1A` 主文字。

**铁律：黄色不能当浅色底上的文字色**（白底黄字对比度只有 1.4:1）。浅色底上要强调，用这三种之一：
黑字 + 黄色荧光笔底（`box-shadow: inset 0 -.35em 0 #FFE600`）、黄底黑字色块、黑底黄字色块。

## 2. 字体

| 角色 | CSS 字体族 | 字体 | 用在哪 |
|---|---|---|---|
| 中文标题 | `LY Display ZH` | 汉仪雅酷黑 85W | 中文片的标题、大字、数字、产品名。字库自带西文，"来也 Worker"整句用它，不用切字体 |
| 英文标题 | `LY Display EN` | TT Supermolot Neue（只有 600 / 700 两个字重） | 英文片的标题、MG 标签、片尾。别用 400/500，会被浏览器假粗或回退 |
| 中文正文 | `LY Sans ZH` | 思源黑体 Regular / Medium / Bold | 中文说明、标签、小字 |
| 英文正文 | `LY Sans EN` | Inter | 英文说明、标签、小字 |
| 等宽 | `LY Mono` | JetBrains Mono | 单号、金额、代码、状态码（开 `tabular-nums`） |

- 用 CSS 变量：`var(--ly-display-zh)` / `var(--ly-display-en)` / `var(--ly-sans-zh)` / `var(--ly-sans-en)` / `var(--ly-mono)`（`brand.css`）。
- **中英混排对齐**：两套标题字体的字高不同（雅酷黑 I .305 / A .713；TT Supermolot Bold I .28 / A .61，单位 em），同一行混排时英文要放大约 1.17 倍才和中文等高。
- **字体是否真的加载了**：雅酷黑是超粗体，截图里看到细字就是没加载上。`check.mjs` 会查这一项。
- **字号下限**：观众最终在屏幕上看到的字号 = CSS 字号 × 镜头缩放。MG 文字落到屏幕上不小于 26px（1080p），产品界面里被镜头"点名"的字也一样。
- 产品界面层的字体跟产品走：Laiye Worker 英文界面用 Inter 代替系统字体，中文界面用思源黑体代替苹方。

## 3. Logo

文件在 `logos/`，完整列表和用途在 `tokens.json` 的 `logos` 里。

| 背景 | 用哪个 |
|---|---|
| 深色 | `laiye-en-white.png`：白字 + 黄横条（**片尾首选**） |
| 浅色 | `laiye-en-black.png`：黑字 + 黄横条 |
| 来也黄 | `laiye-en-mono-black.png`：纯黑 |
| 照片、视频、彩色 | `laiye-en-mono-white.png`：纯白 |
| 中文片要带"来也"方块 | `laiye-zh-en-white.png` / `laiye-zh-en-black.png`（原图 773px 宽，高度别超过 120px） |

- 只设高度，宽度按比例走。片尾 logo 高 56–96px；画面角标 32–48px。
- 不改色、不拉伸、不加描边、发光、投影、倾斜；不放在会吃掉横条的黄色或花底上。
- 产品图标：Laiye Worker `laiye-worker.png`；APA、ADP 见 `logos/`；AI Accounts Payable Assistant 见 `products/ap-assistant/`。
- 片尾：logo 稳稳停住，**结尾不淡出**，最后一帧就是定版。

## 4. 名称与口径

- 公司：中文"来也科技"或"来也"；英文 **Laiye**（不写 LAIYE、LaiYe）。
- 产品名以 `products/README.md` 为准：Laiye Worker（中文语境可写"来也 Worker"）、AI Accounts Payable Assistant、APA、ADP、ACX。缩写首次出现时带全称：APA · Agentic Process Automation · 智能体流程自动化；ADP · Agentic Document Processing · 智能体文档处理；ACX · Agentic Customer Experience · 智能体客户体验。
- 口号：让智能体助力每个人 / AI Agents for Everyone。
- **画面上每个数字、单号、百分比都要有出处**，写在片子的 `FACTS.md` 里；`check.mjs` 会核对。测算数字标"示例测算"或 *Illustrative*。
- 不说产品没说过的话：不写"100% 端到端自动化"、不承诺审批或付款由 AI 完成（AI 员工只建草稿，批准权在人）。
- 不出现真实客户名称和 logo，除非简报里写明已获授权；用"某电子元器件分销商"这类说法。
- 第三方产品（Gmail、Google Sheets、Xero、飞书……）可以按名字出现、简化重绘界面，**不用对方 logo**：名字放在中性色块上。
- 录屏里的真实邮箱、姓名、账号一律换成虚构的（如 `ap.team@yourco.com`），并在 TREATMENT 里写明。

## 5. 不要做的

- 霓虹、赛博朋克、蓝紫渐变、玻璃拟态、镜头光晕、粒子堆砌、3D 金属反光、渐变文字、无意义旋转、故障风（glitch）。
- B2B 片里不放卡通吉祥物表演（2026-10 AP Highlight 用户意见：太卡通）；产品自己的头像图标可以作为图标出现。
- 结尾淡出到黑。
- 装饰性的连线和碎片：连线必须连着真实节点，并且讲明一件事（取件、比对、写回）。

---

来源：`laiye-slides/references/core/brand_guidelines.md`（色板、口号、logo 用法）；`laiye-flash-video`（字体组合与字高实测）；HyperFrames 项目 `20260811 APA 企业版宣传视频 MG`、`20260923 智单通` 的 frame.md / BRIEF.md（中性阶、语义色、禁用清单、口径）；`20261022 AP Highlight v03` 的修改意见（logo 配色、不淡出、不放吉祥物、第三方不用 logo）。
