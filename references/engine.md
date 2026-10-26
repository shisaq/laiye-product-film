# 引擎：起步工程怎么用

渲染用 Lemo-Opuscar 的 core（`$LIB`，`scripts/setup.sh` 准备好并打印路径）：网页按时间逐帧画，无头浏览器逐帧截图，Python 合成配乐和拟音，ffmpeg 混音并把响度标准化到 −14 LUFS。命令全集见 `$LIB/core/README.md`。

## 工程里的文件

`sh scripts/new_film.sh <目录> --style … --lang …` 生成：

| 文件 | 管什么 | 改不改 |
|---|---|---|
| `film.js` | **整部片子**：关键时刻 `T`、镜头、光标、产品界面、MG、片尾。示例时间线写完 TREATMENT 后整段替换 | 主要写这里 |
| `kit.js` | 机制：`ev` 事件、`Camera`、`anchors` 锚点、`Cursor`、`ring` 高亮框、`place` 定位、`visibleTexts` 文字登记、`endCard` 片尾定版 | 需要新机制时加 |
| `main.js` | 页面约定：`render(t)`、`DUR`、`EV`、`TEXTS`、`READY`，字体和图片预加载 | 一般不改 |
| `index.html` | 三层容器：`#world`（产品界面和场景，跟镜头）、`#mg`（世界空间 MG，跟镜头）、`#hud`（屏幕空间，不跟镜头）；`data-lang`、`data-style` | 一般不改 |
| `sound.py` | 配乐 + 拟音，时间全部来自 `events.json` | 按 cue map 重写 |
| `build.sh` | 一条命令出片 | 改 FPS、workers |
| `brand/` | 品牌字体、logo、`brand.css`、`tokens.json` | 不改（从 skill 同步） |
| `BRIEF.md` `FACTS.md` `TREATMENT.md` `CREDITS` | 简报、事实、方案、版权 | 要写 |

## film.js 的约定

```js
export const DUR = 50, FPS = 30;
export const ASSETS = ['brand/logos/laiye-worker.png', …];     // 预加载的图片
export const T = { add: 3.2, setup: 7.4, … };                    // 关键时刻，一处定义，到处引用
ev(T.add, 'click');                                              // 声音事件，sound.py 读
export const cam = new Camera(on('card', 2.2))                   // 起始机位：对准锚点 card，缩放 2.2
  .move(3.5, .8, on('chat', 1.6, .5, .3), 'whip')               // 甩镜（自动记一个 whoosh 事件）
  .move(12.8, 1.2, [960, 540, 1], 'ss');                         // 拉回全景
export function frame(t) {
  return {
    world: app(t),                    // 产品界面 HTML（根元素加 data-layer="product"）
    mg: (A, cam) => overlays(t, A, cam[2]),   // 高亮框、标注、单据卡、光标；A(key, fx, fy) 是锚点
    hud: title(t) + endCard(t, T.end, {...}), // 全片主张、片尾定版
  };
}
```

- **锚点**：要对准的元素加 `data-a="key"`。`A('key', fx, fy)` 返回元素内 (fx, fy) 处的世界坐标 `{x, y, l, t, w, h}`。镜头目标、光标目标、MG 位置都用它。
- **镜头**：`Camera(start, { minZoom: 1, drift })`；`move(t0, 时长, 目标, 缓动)`，缓动有 `eio` `ss` `eo` `ei` `lin` `whip`。目标可以是 `[cx, cy, z]` 或 `on('key', z, fx, fy, dx, dy)`。缩放 ≥ 1 时画面不会拉出世界外。
- **光标**：`new Cursor().show(t0, t1).move(…)…click(t)`。第一个 `move` 是起始位置；`at('key', fx, fy, dx, dy)` 指向锚点。`cursor.svg(cursor.eval(t, A), z)` 画在 MG 层里，屏幕上的大小恒定。
- **MG 字号**：MG 层跟着镜头缩放，要让字落到屏幕上是 34px，就写 `font-size: ${34 / z}px`（z = 镜头缩放）。
- **要读的字**加 `data-t="唯一 id"`（打字机效果再加 `data-full="完整文字"`），readcheck 按它查停留时长。产品界面里大段的聊天记录不用加。
- **片尾**：`endCard(t, t0, { icon, name, line, cta, theme })`，按品牌规范逐行入场后停住，不淡出。
- **竖版**：渲染时加 `--size 1080x1920`（still / video / events / readcheck 都要加），布局从 `innerWidth` / `innerHeight` 算（`kit.js` 的 `W` `H`）。

## 必须遵守

- **画面只由 t 决定**：不用 `Date.now()`，不用不带种子的 `Math.random()`（用 `/core/lib.js` 的 `mulberry`、`hash`），不在帧之间保留状态。任何一帧都能单独、乱序、由任何进程渲染。
- **不用 CSS transition / animation**：它们不受时间轴控制，渲染出来是静止的或乱跳的。所有动画都从 t 算。
- 页面里引用引擎的文件用绝对路径（`/core/lib.js`）；脚本和 `build.sh` 里用 `$LIB`。
- 工程路径不要有 `#` 和 `?`。

## 常用命令（在 `$LIB` 里运行）

```sh
node core/render/still.mjs <工程> 1.5 12 30 --out <工程>/stills    # 看几帧
node core/render/still.mjs <工程> --range 20:22:0.2                 # 关键动作的 0.2 s 帧条
node core/render/readcheck.mjs <工程>                                # 文字停留时长
sh <工程>/build.sh                                                   # 出片（--silent 只出画面）
```

skill 自带：

```sh
node <skill>/scripts/check.mjs <工程>          # 字体 / 品牌色 / 事实
sh <skill>/scripts/review.sh <工程> 1          # 每秒一帧的联系表 + 末帧
sh <skill>/scripts/recsheet.sh <录屏> 8 <目录>  # 录屏联系表
```

## 参考实现

`examples/ap-highlight-v03/`（AP Highlight v03）：Laiye Worker 浅色界面重绘（`ui.js`）、50 秒时间线（`film.js`）、DOM 锚点和甩镜模糊（`main.js`）、合成科技配乐（`sound.py`）。写完 TREATMENT 后再看，只借技术。它早于本 skill，没有 `data-layer` 标记，部分颜色不合品牌规范，别照抄这两点。

## 做不了的

- **透明叠层**（带 alpha 的 ProRes 4444，给剪辑软件叠在别的视频上）：本引擎只出 H.264。需要叠层时用 laiye-video-mg（Remotion）或 HyperFrames。
- **真实录屏素材直接入片**：本流程不贴录屏。确实要用（比如证明是真实运行）时，作为 `<video>` 帧序列另行处理，并在 TREATMENT 里说明。
