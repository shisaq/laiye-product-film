# 产品卡索引

做片前先读这里，确认产品名怎么写、能说什么。详细功能介绍不在这里重复，指向 laiye-slides 的产品知识库（`~/.claude/skills/laiye-slides/references/products/`，git.laiye.com/laiye-projects/laiye-slides）。

| 产品 | 片中写法 | 全称 / 一句话 | 图标 | 详情 |
|---|---|---|---|---|
| Laiye Worker | **Laiye Worker**（中文语境可写"来也 Worker"） | 桌面端 AI 员工平台：从 Marketplace 添加 AI 员工，用一次对话配置好，之后它跨系统干活 | `../logos/laiye-worker.png` | [laiye-worker/card.md](laiye-worker/card.md) |
| AI Accounts Payable Assistant | **AI Accounts Payable Assistant**（不缩写成 AP Assistant 上画面，口播可以） | Your 24/7 AI employee for accounts payable. | `ap-assistant/ap-assistant-icon.png` | [ap-assistant/card.md](ap-assistant/card.md) |
| APA | **APA**，首次出现带全称 | Agentic Process Automation · 智能体流程自动化 · 打通系统、替代重复操作 | `../logos/apa.svg` | laiye-slides `products/apa/index.md` |
| ADP | **ADP**，首次出现带全称 | Agentic Document Processing · 智能体文档处理 · 读懂文档、自动驱动业务 | `../logos/adp-*.svg` | laiye-slides `products/adp/index.md` |
| ACX | **ACX**，首次出现带全称 | Agentic Customer Experience · 智能体客户体验 · 连接客户、提供专业高效服务 | 无 | laiye-slides `products/acx/index.md` |

## 新增一个产品

做完一条新产品的片子后，在这里加一行，并建 `<产品>/card.md`，内容照 `laiye-worker/card.md` 的结构：

1. 名称和写法、一句话定位、图标文件。
2. 可以上画面的事实（带出处和日期）。
3. 不能说的话。
4. 界面结构和 `ui-tokens.json`（从录屏取色），`reference/` 放几张关键状态的截图。

`通用素材/产品logo/` 里是旧版 RPA 产品线的图标（流程创造者、机器人指挥官等），新片不再使用。
