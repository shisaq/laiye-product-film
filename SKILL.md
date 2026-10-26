---
name: laiye-product-film
description: 来也产品 MG 片生产线。把来也产品（Laiye Worker 和上面的 AI 员工，如 AI Accounts Payable Assistant；APA、ADP、ACX）的录屏、截图、数据和文档，做成用代码重绘界面、带运镜和 MG 的产品片，比如发布 Highlight、功能演示、产品介绍、能力概念片、活动开场，15–90 秒，中英文均可。内置来也品牌资产包（汉仪雅酷黑 / TT Supermolot Neue / 来也黄 / 各版 logo / 产品卡）、两种来也风格（Laiye Screencast 实机录屏感、Laiye Keynote 暗场发布）、简报、事实与故事线模板（故事线默认交用户审批），以及品牌、事实、可读性验收脚本。用户要给来也产品做"产品视频""发布视频""Highlight""功能演示动画""产品 MG""不录屏的产品片""产品宣传短片""活动开场片"时使用。不适用于：口播视频剪辑（laiye-video-produce）、给已剪好的视频加 MG 叠层（laiye-video-mg）、纯文字快闪（laiye-flash-video）、非来也产品的视频（lemo-opuscar、hyperframes）。
model: opus
effort: high
---

# 来也产品片

用代码做来也产品片：产品界面重画、镜头可以推到任何位置、每个字可控、每个数字有出处。
这是做**产品 MG** 的 skill：默认主角就是产品本身，观众要看到产品长什么样、人怎么和它交互、它做出了什么。这条 skill 把四件事分开管。规则大多是**验收**（事后检查做得对不对），不是**模板**（事先规定怎么做）：故事怎么讲、画面怎么设计，由你在每条片子里重新想；检查只拦住讲错、看不懂、违反品牌的东西。

| 层 | 管什么 | 怎么管 |
|---|---|---|
| **硬约束** | 品牌（颜色、字体、logo、产品名）和事实（画面上每个数字有出处） | `brand/BRAND.md` 写清楚，`scripts/check.mjs` 自动查 |
| **故事** | 观众看完知道、相信、去做什么；每段讲什么；观众视角下逻辑通不通 | 观众问题链 + 冷读，**交用户审批**（`references/storyline.md`） |
| **风格** | 外观和镜头语法：只有两种，`styles/` | 固定外观，不固定故事 |
| **导演** | 镜头、节奏、声音、转场 | 你来定，最后用检查脚本和看片验收 |

## 目录

```
brand/       BRAND.md 品牌规范 · tokens.json · brand.css · fonts/ · logos/ · products/（产品卡、Laiye Worker 界面参考与取色）
styles/      laiye-screencast（实机录屏感）· laiye-keynote（暗场发布）：STYLE.md + CHANGES.md
references/  brief.md 简报 · storyline.md 故事线 · directing.md 导演 · ui-rebuild.md 重绘界面 · engine.md 引擎 · checks.md 验收 · lessons.md 经验库
templates/   BRIEF.md · FACTS.md · 故事线.md · TREATMENT.md · starter/（起步工程）
examples/    参考片的源码和文档（ap-highlight-v03：Laiye Screencast；ap-product-mg-v3：Laiye Keynote）
scripts/     setup.sh · new_film.sh · check.mjs · review.sh · recsheet.sh · sample_colors.py
```

下文 `<skill>` 指本文件所在目录。

## 流程

### 0. 准备（后台跑，不等它）

`sh <skill>/scripts/setup.sh`：skill 是 git 克隆的就先自动更新；然后准备渲染引擎（Lemo-Opuscar core，第一次几分钟），检查字体和 ffmpeg，最后一行打印 `LIB=<路径>`。缺 Node 20+、ffmpeg、Python 3.11+ 或品牌字体时，在第 1 步的那轮提问里告诉用户，不要自己装系统软件。

### 1. 简报：先挖素材，再一次问完

读 `references/brief.md` 照做。要点：

1. 自己先读完用户给的所有东西（策划文档、录屏、截图、数据表、PDF），以及 `brand/products/` 里对应的产品卡。录屏用 `scripts/recsheet.sh` 出联系表找关键状态。
2. 边读边写 `FACTS.md`，原文照抄，写明出处。
3. 起草 `BRIEF.md`，能定的填默认值；一定写出"看完以后知道 / 相信 / 去做""观众已知""误读风险"。
4. 用 `AskUserQuestion` **一次问完**（≤ 4 个问题，每个给推荐项），只问素材里查不到、又不该替用户决定的事。
5. 用 3–5 行复述简报，接着写故事线。

建工程：`sh <skill>/scripts/new_film.sh <工程目录> --style <风格> --lang <en|zh> --title "<片名>"`。工程目录放在用户的项目文件夹里（例如 `视频制作/<片名>/`），路径里不要有 `#` `?`。

### 2. 选风格

这是产品 MG：两种风格展示的都是产品本身（重绘的真实界面和交互），区别只在舞台和镜头，一条片子里也可以混用。

- **Laiye Screencast**：桌面上一段连续的录屏感，窗口浮在壁纸上，镜头跟着操作走。
- **Laiye Keynote**：产品窗口浮在暗场上，镜头推近做特写、配大字，更像发布会。界面不能脱离它所在的窗口单独漂着。

读完所选风格的 `STYLE.md` 全文。风格固定外观，故事由你决定。

### 3. 故事线

**用户已经给了分镜脚本或故事线**（逐镜写明画面、动效、文字、配音、音效，比如 Revor AI 那条），就以它为准：不再自己出三个结构，也不再走第 4 步审批，直接进 TREATMENT。上下文越充分，越不需要流程；这一步是为了在上下文不够时把它补齐。

读 `references/storyline.md`，按 `templates/故事线.md` 写：想三个在核心画面上不同的结构，选一个（另外两个各留一句）→ 按观众的问题链排段落，每段一个关键信息，写清"关掉声音能读到什么"→ 列误读风险 → **冷读**（不带上下文的子代理只看每段的画面和文字，说出它的理解）→ 按冷读结果修改。

### 4. 故事线审批：停下等用户

把故事线交给用户：文件路径、段落表、"需要你拍板"的判断（附建议和理由）。**等用户确认后才往下做。** 用户提出修改就改，版本号加一，并在版本记录里逐条回应，然后再请用户确认。
只有用户在简报阶段明确说过"不用审，直接做完"（已写进 BRIEF.md）才跳过这一步。

### 5. TREATMENT

故事线确认后，读 `references/directing.md`，按 `templates/TREATMENT.md` 写制作方案：对标、镜头表、节拍表（每拍的唯一视觉重心和承接）、配乐提示、声音设计、画面文字清单。
**写完 TREATMENT 之前不看参考片代码**（`examples/`、opuscar 的 demo）；写完之后只借技术，不借结构。

### 6. 定调

用真实绘制代码渲染 2–3 张风格帧（其中一张是招牌镜头），对照 `STYLE.md` 和 `brand/BRAND.md` 自查，跑一次 `check.mjs --only fonts,brand`。不合格就改，改一次。不用停下来给用户看。

### 7. 分镜（只在用户要求时）

渲染 6–9 个关键镜头拼成一张，**停下等用户确认**。用户没要求就不停。

### 8. 制作

- 重绘界面：`references/ui-rebuild.md`。
- 时间线、镜头、锚点、光标、MG、片尾：`references/engine.md`，改写 `film.js`（示例整段替换）。
- 声音：按配乐提示表重写 `sound.py`。
- 出片：`sh <工程>/build.sh`。
- 制作中发现某段讲不清：关键信息不变就自己调整画面；要改关键信息或段落顺序，再找用户。

### 9. 验收

按 `references/checks.md` 做：`check.mjs` 和 `readcheck` 全部通过 → 两遍联系表（`review.sh`），逐段对照已审批的故事线 → 关键动作的 0.2 s 帧条 → 关掉声音看一遍 → 带声音全速看一遍。**发现的问题一轮修完**，再查一遍。

### 10. 交付和沉淀

交付清单见 `references/checks.md` §4。告诉用户成片位置、创作角度、检查结果，然后问修改意见。

用户给了意见：改片子；再判断哪些意见以后也适用，写进 `references/lessons.md`，并改到对应的风格、品牌、故事线或导演文件里，告诉用户"这条以后都会照做"。**这一步让 skill 越用越准，不要跳过。**

## 底线

- 故事线没确认，不开始制作（用户明确授权跳过的除外）。
- 画面上每个数字、单号、百分比都在 FACTS.md 里有出处；不编功能，不写产品没说过的话。
- 不出现真实客户名、第三方 logo、录屏里的真实邮箱和人名。
- MG 层只用品牌字体和品牌色；浅色底上不放黄字；同一时刻只有一样东西是来也黄。
- 结尾不淡出。
- 渲染只由时间 t 决定（不用 `Date.now()`、不带种子的随机数、CSS 动画）。
