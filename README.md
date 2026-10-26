# laiye-product-film · 来也产品片

给来也产品做 MG 产品片的 agent skill：产品界面用代码重画，配上运镜、MG、合成配乐，内置来也的品牌规范、故事线审批流程和验收脚本。

## 安装

让你的 agent 执行（或自己在终端执行）：

```sh
git clone https://github.com/shisaq/laiye-product-film.git ~/.claude/skills/laiye-product-film
sh ~/.claude/skills/laiye-product-film/scripts/setup.sh
```

- 每次使用时 `setup.sh` 都会先 `git pull` 自动更新 skill，然后准备渲染引擎（Lemo-Opuscar，第一次几分钟）。
- 需要：git、Node 20+、ffmpeg、Python 3.11+（或 uv）。
- **字体**：汉仪雅酷黑 85W、TT Supermolot Neue 是来也公司授权字体，**不在仓库里**。从来也视频组「通用素材/字体-公司版权」装到系统字体即可；或者把字体文件放在一个目录里，设 `LAIYE_FONTS=<目录>`。中文片还需要系统装有思源黑体（Source Han Sans SC）。`setup.sh` 会告诉你缺什么。

## 模型

skill 的 frontmatter 锁定了 `model: opus`、`effort: high`，触发后会切到 Opus。视频质量主要看模型，不建议换成更小的模型。想要更深的推理，把 `effort` 改成 `xhigh`。

## 用法

在 Claude Code 里直接说要做什么，例如：

> 给 AI Accounts Payable Assistant 做一条 30 秒的 POV 短片，素材在 `新增素材/`

流程：读素材、写事实表 → 一次问完缺的信息 → 写故事线并做冷读 → **你审批故事线** → 写制作方案 → 制作 → 跑检查 → 交付 → 把你的修改意见记进经验库。

## 里面有什么

| 目录 | 内容 |
|---|---|
| `brand/` | 品牌规范（BRAND.md）、色板和字体 token、logo、产品卡、Laiye Worker 界面参考截图（已打码）和取色 |
| `styles/` | Laiye Screencast（实机录屏感）、Laiye Keynote（暗场发布） |
| `references/` | 简报、故事线、导演、界面重绘、引擎、验收、经验库 |
| `templates/` | BRIEF / FACTS / 故事线 / TREATMENT 模板，起步工程 |
| `examples/` | 参考片源码（AP Highlight v03） |
| `scripts/` | 环境准备、新建工程、品牌与事实检查、联系表、取色 |

## 维护

- **品牌规则变了**：同时改 `brand/BRAND.md`、`brand/tokens.json`、`brand/brand.css`。
- **新产品**：在 `brand/products/` 加产品卡（见 `brand/products/README.md`）。
- **用户的修改意见**：skill 会自己写进 `references/lessons.md`；定期翻一下，把过时的规则清掉。改完推到 GitHub，同事下次使用时自动拿到。
- **渲染引擎**：Lemo-Opuscar（github.com/lemomo-ai/lemo-opuscar，MIT），默认放在 `~/lemo-opuscar`。本 skill 在 413a6bd（2026-10-24）上测试过；`setup.sh` 发现版本不同时会提示。

## 版权

两种风格和部分导演指南改写自 Lemo-Opuscar（MIT，© 2026 LemoLab），见 `NOTICE`。汉仪雅酷黑、TT Supermolot Neue 为来也公司授权字体，不随本仓库分发；Inter、JetBrains Mono 为 SIL OFL 1.1。来也 logo、产品图标和产品资料属于来也科技。
