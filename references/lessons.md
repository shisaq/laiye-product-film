# 经验库

用户每次的修改意见，能推广到以后片子的，都记在这里，并落实到具体文件（风格、品牌规范、导演指南、检查脚本）。**只记会反复出现的规则**，一次性的改动（这条片子的某个镜头太长）不记。

做法：用户提完意见、你改完片子之后，判断哪些意见是通用的 → 在下表加一行 → 改对应文件 → 告诉用户"这条以后都会照做"。如果新意见和旧规则冲突，以新意见为准，改掉旧规则，并在旧行的"落在哪里"一栏注明"已被 YYYY-MM-DD 取代"。

| 日期 | 片子 | 意见 | 沉淀成的规则 | 落在哪里 |
|---|---|---|---|---|
| 2026-10-26 | AP Highlight v01 → v03 复盘 | 产品 MG 最花时间的是理解目标、捋顺故事线和每段重点、检查观众视角的逻辑；v1→v3 的返工几乎都在故事层 | 故事线是默认审批点：观众问题链、每段一个关键信息、误读风险、冷读，用户确认后才制作 | `references/storyline.md`；`templates/故事线.md`；`SKILL.md` 第 4 步 |
| 2026-10-23 | AP Highlight v02 → v03 | 吉祥物太卡通，不适合 B2B | 不放吉祥物表演；AI 员工的工作由 MG 层演出 | `styles/laiye-screencast` §1、§9；`brand/BRAND.md` §5 |
| 2026-10-23 | AP Highlight v03 | 按新录屏用浅色界面 | 产品界面跟着产品当前的主题画，不自行换主题 | `styles/laiye-screencast` §2 |
| 2026-10-23 | AP Highlight v03 | Gmail / Sheets / Xero 要画成界面，不直接用录屏 | 第三方系统简化重绘，名字放中性色块，不用 logo | `references/ui-rebuild.md` §4；`brand/BRAND.md` §4 |
| 2026-10-23 | AP Highlight v03 | 配置要放在前面，演成一次性的，免得被理解成"每封邮件都要手动设置" | 配置演成开头的一次性步骤，之后不再出现 | `styles/laiye-screencast` §9 |
| 2026-10-23 | AP Highlight v03 第二轮 | 画面信息太散 | 每个时刻只有一个视觉重心；默认不分屏 | `styles/laiye-screencast` §6；`references/directing.md` §3 |
| 2026-10-23 | AP Highlight v03 第二轮 | 去掉底部字幕、章节标签、加速标签 | 默认不加；文字只以特写处的标注出现；关掉字幕也要能看懂 | `styles/laiye-screencast` §4 |
| 2026-10-23 | AP Highlight v03 第二轮 | MG 和片尾文字用 TT Supermolot Neue，产品界面保留 Inter | MG 层用品牌字体，产品界面层用产品字体；分层检查 | `brand/BRAND.md` §2；`scripts/check.mjs` |
| 2026-10-23 | AP Highlight v03 第二轮 | 配乐改成全合成器科技风 | Laiye Screencast 默认全合成科技配乐 | `styles/laiye-screencast` §7 |
| 2026-10-23 | AP Highlight v03 第二轮 | LAIYE logo 白字 + `#FFE600` 横条；结尾不淡出 | 深色底片尾用 `laiye-en-white.png`；定版停住 | `brand/BRAND.md` §3；`kit.js` `endCard` |
| 2026-10-23 | AP Highlight v03 | 只讲一张三单匹配通过的发票，异常单留给别的片子 | 一条片子一个案例；可信靠核对、查重、回读这些细节，不靠堆异常 | `references/directing.md` §1 |
| 2026-10-26 | AP Highlight v03（check.mjs 复查） | — | v03 用紫色 `#7B57D1` 表示采购单，违反品牌规范"禁用紫色"。类别色只从品牌延伸色板取 | `styles/laiye-screencast` §3 |
| 2026-08-21 | APA 企业版宣传 MG | 冷静、克制，强调资产而不是炫技 | 禁用霓虹、玻璃拟态、光晕、粒子、3D 金属、无意义旋转、bounce、glitch | `brand/BRAND.md` §5；`styles/laiye-keynote` §9 |
| 2026-08-21 | APA 企业版宣传 MG | 辅助文字和主标题说的是一回事 | 辅助文字必须带来新信息 | `styles/laiye-keynote` §4；`references/directing.md` §3 |
| 2026-08-21 | APA 企业版宣传 MG | 同一份文档跨镜头要保持身份 | 共享组件、同样的末帧状态，换场景时变身份不换外观 | `styles/laiye-keynote` §2、§8 |
| 2026-08-21 | APA 企业版宣传 MG | 中文片里的英文副题和装饰字 | 中文片画面文案统一中文，只留必要缩写 | `styles/laiye-keynote` §4 |
| 2026-09-23 | 智单通参赛片 | 口径以申报书为准 | 测算数字标"示例测算"；不写"100% 端到端自动化"；客户匿名；缩写首次出现带全称 | `brand/BRAND.md` §4 |
| 2026-09 | laiye-video-mg 实践 | 删除线太细、箭头太短看不见 | 删除线 ≥ 8px；箭头至少 50px，放不下就改用进度条或顺序点亮 | `references/checks.md` §2 |
