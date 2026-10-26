# 经验库

用户每次的修改意见，能推广到以后片子的，都记在这里，并落实到具体文件（风格、品牌规范、导演指南、检查脚本）。**只记会反复出现的规则**，一次性的改动（这条片子的某个镜头太长）不记。

做法：用户提完意见、你改完片子之后，判断哪些意见是通用的 → 在下表加一行 → 改对应文件 → 告诉用户"这条以后都会照做"。如果新意见和旧规则冲突，以新意见为准，改掉旧规则，并在旧行的"落在哪里"一栏注明"已被 YYYY-MM-DD 取代"。

| 日期 | 片子 | 意见 | 沉淀成的规则 | 落在哪里 |
|---|---|---|---|---|
| 2026-10-26 | 用户提供 Revor AI 片作参考 | 背景信息（文字、图片、要求）充分时，不用任何 skill 直接做也很好；不要给模型过多限制，其他模型另当别论，要测试 | 上下文比规则重要：用户给了分镜就以它为准，跳过三个结构和故事线审批；简报阶段的目标是把上下文凑齐，不是走流程 | `SKILL.md` 第 3 步；`references/brief.md` §1 |
| 2026-10-26 | Mega Showcase 开场片 v1 成片 | 品牌只在最后出现，前面只是一堆动效在动，跟产品没关系，产品交互逻辑完全没有；制作精良但不及格 | 这是产品 MG 的 skill：默认主角就是产品（重绘的真实界面和交互）；Keynote 不再是"不画真实界面"，而是把界面拿到暗场上做特写；故事线加"观众看到的产品"一栏，冷读要说出产品长什么样、怎么用。不加"产品在场"的硬性检查，靠素材（录屏、截图）和故事来保证 | `SKILL.md`；`styles/laiye-keynote` §1、§2；`templates/故事线.md`；`references/storyline.md` §5 |
| 2026-10-26 | Mega Showcase 开场片（故事线审批时） | 5212 按三单匹配结果算（合计 258.33），录屏里那组对不上的数字都是干扰项，不要展示 | 画面上只放支撑关键信息的数字；有争议、互相矛盾或与主线无关的数字，即使有出处也不上画面 | `references/directing.md` §1 |
| 2026-10-26 | Mega Showcase 开场片（故事线审批时） | 担心规则太多是在给模型设限；之前"许愿式"直接做也能出好片 | 规则只做验收，不做模板；问题链的顺序可以打破，只检查每段是否回答了观众此刻的问题。新增规则前先问：它拦住的是讲错 / 看不懂 / 违反品牌，还是只是在规定做法？后者不加 | `SKILL.md` 开头；`references/storyline.md` §2 |
| 2026-10-26 | Mega Showcase 开场片（简报阶段） | — | 录屏里 AI 说 5212 的生菜单价是 2.57、合计 262.96，但原始 PDF 是 2.50，且 262.96 本身算错。录屏里的数字要和原始单据交叉核对，对不上的交用户确认 | `references/brief.md` §1；`brand/products/ap-assistant/card.md` |
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
