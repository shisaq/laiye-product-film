# 参考片：AP Highlight v03（Laiye Screencast）

AI Accounts Payable Assistant 的发布 Highlight。50 秒，英文画面，只有音乐和音效，浅色 Laiye Worker 界面，不用吉祥物。2026-10-23 经用户两轮修改后定稿，10-26 发布。

**看的顺序**：先读 `故事线.md`（用户审批过的版本，含 v2 → v3 → v4 每一轮的修改理由），再读 `TREATMENT.md`。代码要等你自己的 TREATMENT 写完再看，**只借技术，不借结构和镜头**。

| 文件 | 可以学什么 |
|---|---|
| `ui.js` | Laiye Worker 浅色界面的重绘：侧栏、对话、选项卡、清单、Marketplace；Gmail、Sheets、Xero 的简化界面 |
| `film.js` | 50 秒时间线：关键时刻表 `T`、镜头关键帧（含甩镜）、光标、时钟和壁纸的时间流逝、MG 状态 |
| `main.js` | 每帧从 DOM 量锚点、镜头变换、由镜头速度算出的甩镜模糊、单据卡、核验卡、高亮框 |
| `sound.py` | 全合成科技配乐（四四拍电子鼓、sub bass、琶音、侧链 pad、FM 铃音）和拟音，全部按 `events.json` 对齐 |

**它早于本 skill 的规范，有两处别照抄**：

1. 没有给产品界面加 `data-layer="product"`，`check.mjs` 会把界面文字全部算成 MG 文字。
2. 采购单的类别色用了紫色 `#7B57D1`，品牌规范禁用紫色；其余几种色板外的颜色也没登记理由。

## 自己渲染一遍

```sh
cp ../../brand/fonts/{Inter.ttf,JetBrainsMono.ttf,TTSupermolotNeue-DemiBold.otf,TTSupermolotNeue-Bold.otf} fonts/
sh build.sh        # 引擎默认在 ~/lemo-opuscar，别处就先 export LIB=<路径>
```
