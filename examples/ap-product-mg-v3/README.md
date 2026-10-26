# 参考片：AP Product MG v3（Laiye Keynote）

AI Accounts Payable Assistant 的产品 MG。60 秒，英文画面，只有音乐和音效；暗场上浮着真实的产品窗口，左边 Laiye Worker，右边浏览器里的 Gmail / Xero。2026-10-27 用户定为标杆。

和 `ap-highlight-v03` 不同，这条是**用本 skill 做的**（简报 → 故事线 → 冷读 → TREATMENT → 制作 → 验收），改了三版才合格：

| 版本 | 用户意见 | 改法 |
|---|---|---|
| v1 抽象开场片 | 品牌只在最后出现，前面全是和产品无关的动效，没有交互逻辑，不及格 | 改成以产品为主角 |
| v2 界面拆成卡片 | 像 PPT：看不出每张卡在哪个窗口、AI 员工和 Laiye Worker 什么关系、发票是不是邮件附件；角落里的时钟没人注意 | 改成一段 journey，界面都留在自己的窗口里，加向导，时间流逝居中单独一拍 |
| v3 第一版 | Gmail、Xero 是凭印象画的，录屏里明明有 | 按录屏帧重绘 |

每条意见都已写进 `references/lessons.md` 和对应的规范文件。注意：它是在一个上下文很长的会话里做出来的（同一个会话里还写了这个 skill），不是一次干净的冷启动。它展示的是"做到什么程度算合格"，不保证一次就能做到。

**看的顺序**：先读 `故事线.md`（journey、向导、冷读结果、版本记录），再读 `TREATMENT.md`（空间、两个行动者、节拍表），`FACTS.md` 看画面上每个数字的出处。代码要等你自己的 TREATMENT 写完再看，**只借技术，不借结构和镜头**。

| 文件 | 可以学什么 |
|---|---|
| `ui.js` | Laiye Worker 浅色窗口（侧栏、会话列表、Marketplace 弹窗、对话、选项卡、执行清单）；简化的浏览器框；按录屏帧重绘的 Gmail 邮件页和 Xero Edit Bill 页（不用对方 logo 图片）。产品界面都标了 `data-layer="product"`，镜头和向导要去的地方都有 `data-a` 锚点 |
| `film.js` | 横向世界（镜头 `bounds` 限在 3840×1080 里）和换系统时的甩镜；向导（AI 员工头像）用 `Cursor` 沿锚点走、干活时发黄光，附件跟在它后面；光标代表"你"；对话自动滚到最新一条，镜头跟着最新一条（`layout` 钩子 + `tail`）；居中大时钟；三单对照条的数字乱跳后锁定；`endCard` 片尾 |
| `main.js` / `kit.js` | 起步工程的版本（带 `layout` 钩子） |
| `sound.py` | 按 `events.json` 对齐的配乐和拟音：夜里鼓退出、合计锁定前抽空、印章重拍、早上明亮律动 |

## 几个做法

- **向导是线索**：头像从 Marketplace 卡片上诞生 → 落进会话列表 → 并入对话顶部；夜里去 Gmail 取附件带回对话，沿清单一步步往下走；早上把草稿送进 Xero，停在 Approve 下方等你。观众跟着它走就不会迷路。光标是你，头像是它；片尾不放光标，免得被误认为 AI 要点 Approve。
- **先交代地方再推近**：每个界面都在自己的窗口里出场，先全景再推到正在发生的那一块；换系统时镜头跟着向导甩过去。
- **一个时刻只有一个视觉重心**：大字只在章节交界、窗口压暗时出现；两次时间流逝都是居中的大时钟，单独占一拍。
- **数字**：合计按三单匹配结果，都是 258.33（用户拍板）；INV-2026-5212 的价差数字不展示。

## 自己渲染一遍

字体不随仓库分发（`brand/fonts/` 里只有 OFL 许可证），先从 skill 或系统里拷过来，再出片：

```sh
cd examples/ap-product-mg-v3
SKILL=../..; . "$SKILL/scripts/fonts.sh"
for f in HYYakuHei-85W.ttf TTSupermolotNeue-Bold.otf TTSupermolotNeue-DemiBold.otf Inter.ttf JetBrainsMono.ttf; do p=$(font_path "$f") && cp "$p" "brand/fonts/$f"; done
sh build.sh            # 引擎默认在 ~/lemo-opuscar，别处就先 export LIB=<路径>；只出画面：sh build.sh --silent
```

`BRIEF.md` 里 `../../新增素材/…` 指的是原项目文件夹里的录屏和样例 PDF，不随仓库分发。
