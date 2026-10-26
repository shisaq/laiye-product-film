#!/bin/sh
# 准备渲染引擎（Lemo-Opuscar core）和字体，最后一行打印 LIB=<路径>。
#   sh setup.sh          找到或下载引擎，装依赖（第一次几分钟），检查字体和系统工具
# 引擎位置：$LEMO_OPUSCAR_HOME，默认 ~/lemo-opuscar（和 lemo-opuscar 插件共用同一份）。
set -e
HERE=$(cd "$(dirname "$0")/.." && pwd)
SKILL=$HERE

# 0. skill 本身是 git 克隆的：先快进更新到最新（离线、有本地改动时跳过）。设 LAIYE_FILM_NO_UPDATE=1 可关闭
if [ -d "$HERE/.git" ] && [ -z "$LAIYE_FILM_NO_UPDATE" ]; then
  before=$(git -C "$HERE" rev-parse --short HEAD 2>/dev/null || echo none)
  if git -C "$HERE" -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=10 pull --ff-only --quiet 2>/dev/null; then
    after=$(git -C "$HERE" rev-parse --short HEAD)
    [ "$before" != "$after" ] && echo "↑ skill 已更新 $before → $after。重新读一遍 SKILL.md，按新版流程做。"
  else
    echo "! skill 没能自动更新（离线或有本地改动），继续用本地版本"
  fi
fi
TESTED=413a6bd6d78ebd3bdd5abaec9538a26867f890df     # 本 skill 测试过的引擎版本（2026-10-24）
REPO=https://github.com/lemomo-ai/lemo-opuscar.git
LIB=${LEMO_OPUSCAR_HOME:-$HOME/lemo-opuscar}
OSETUP="$LIB/plugin/skills/lemo-opuscar/scripts/setup.sh"

# 1. 引擎：没有就下载（只取指南、core 和风格说明，不取示例影片）
if [ ! -f "$OSETUP" ]; then
  [ -e "$LIB" ] && [ -n "$(ls -A "$LIB" 2>/dev/null)" ] && { echo "✗ $LIB 已存在但不是 Lemo-Opuscar 库。设置 LEMO_OPUSCAR_HOME 指向别的文件夹。"; exit 1; }
  command -v git >/dev/null || { echo "✗ 需要 git"; exit 1; }
  echo "↓ 下载渲染引擎到 $LIB"
  git clone --quiet --depth 1 --filter=blob:none --sparse --branch main "$REPO" "$LIB" || { rm -rf "$LIB"; echo "✗ 下载失败（网络？）"; exit 1; }
  git -C "$LIB" sparse-checkout set --no-cone '/*' '!/styles/*/demo/' '!/styleboard/' '!/docs/frames/' '!/styles/*/poster.jpg' 2>/dev/null || true
  # 尽量停在测试过的版本；拿不到就用 main
  git -C "$LIB" fetch --quiet --depth 1 origin "$TESTED" 2>/dev/null && git -C "$LIB" checkout --quiet "$TESTED" 2>/dev/null || true
fi

# 2. 依赖：交给引擎自己的安装脚本（npm 包、无头浏览器、Python venv）。
#    注意：如果引擎是 lemo-opuscar 插件装的（lemo.managed=true），它的脚本会先把引擎更新到最新 main。
out=$(LEMO_OPUSCAR_HOME="$LIB" sh "$OSETUP" deps 2>&1) || { printf '%s\n' "$out"; echo "✗ 引擎依赖安装失败（上面是安装脚本的输出）"; exit 1; }
printf '%s\n' "$out" | grep -v '^LIB=' || true

# 3. 版本
NOW=$(git -C "$LIB" rev-parse HEAD 2>/dev/null || echo unknown)
if [ "$NOW" != "$TESTED" ]; then
  echo "! 引擎版本 $(echo $NOW | cut -c1-7)，本 skill 测试过的是 $(echo $TESTED | cut -c1-7)。一般没问题；渲染或检查脚本出错时，先看 $LIB 的更新记录。"
fi

# 4. 字体
. "$HERE/scripts/fonts.sh"
for f in $BRAND_FONTS; do
  font_path "$f" >/dev/null || echo "! 缺品牌字体 $f：从 $FONT_URL 下载（需来也科技账号），装到系统字体或设 LAIYE_FONTS=<字体目录>，再重跑本脚本"
done
han=$(font_path SourceHanSansSC-Regular.otf || true)
[ -n "$han" ] && echo "✓ 思源黑体：$(dirname "$han")" || echo "! 没找到思源黑体（中文片的正文字体）。下载 https://github.com/adobe-fonts/source-han-sans/releases 的 SourceHanSansSC 装到系统字体"
command -v ffmpeg >/dev/null || echo "! 没有 ffmpeg：brew install ffmpeg"
echo "LIB=$LIB"
