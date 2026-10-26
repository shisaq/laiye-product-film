#!/bin/sh
# 新建一条片子的工程：起步代码 + 品牌资产 + 简报 / 事实 / TREATMENT 模板 + 填好 LIB 的 build.sh
#   sh new_film.sh <工程目录> --style laiye-screencast|laiye-keynote --lang en|zh [--title "片名"] [--lib <引擎路径>]
# 已有 index.html 的目录不覆盖代码，只补齐缺的模板和品牌文件。
set -e
SKILL=$(cd "$(dirname "$0")/.." && pwd)
DIR=$1; shift || true
[ -n "$DIR" ] && case "$DIR" in --*) false ;; esac || { echo "用法：sh new_film.sh <工程目录> --style laiye-screencast|laiye-keynote --lang en|zh [--title 片名]"; exit 2; }
STYLE=laiye-screencast; LANG_=en; TITLE=""; LIB=${LEMO_OPUSCAR_HOME:-$HOME/lemo-opuscar}
while [ $# -gt 0 ]; do
  case $1 in
    --style) STYLE=$2; shift 2 ;;
    --lang) LANG_=$2; shift 2 ;;
    --title) TITLE=$2; shift 2 ;;
    --lib) LIB=$2; shift 2 ;;
    *) echo "不认识的参数：$1"; exit 2 ;;
  esac
done
[ -f "$SKILL/styles/$STYLE/STYLE.md" ] || { echo "没有这个风格：$STYLE（可选：$(ls "$SKILL/styles" | tr '\n' ' ')）"; exit 2; }
case $LANG_ in en|zh) ;; *) echo "--lang 只能是 en 或 zh"; exit 2 ;; esac
case "$DIR" in *'#'*|*'?'*) echo "工程路径里不要有 # 或 ?（静态服务器会截断 URL）"; exit 2 ;; esac
[ -f "$LIB/core/render/video.mjs" ] || echo "! $LIB 不是渲染引擎，先运行 sh $SKILL/scripts/setup.sh；build.sh 里的 LIB 之后可以手改"
mkdir -p "$DIR/out" "$DIR/assets"
DIR=$(cd "$DIR" && pwd)
[ -n "$TITLE" ] || TITLE=$(basename "$DIR")

# 代码（不覆盖已有的）
esc() { printf '%s' "$1" | sed 's/[&/\]/\\&/g'; }
if [ ! -f "$DIR/index.html" ]; then
  for f in kit.js film.js main.js sound.py; do cp "$SKILL/templates/starter/$f" "$DIR/$f"; done
  sed -e "s/__TITLE__/$(esc "$TITLE")/" -e "s/__LANG__/$LANG_/" -e "s/__STYLE__/$STYLE/" "$SKILL/templates/starter/index.html" > "$DIR/index.html"
  sed -e "s|__LIB__|$LIB|" "$SKILL/templates/starter/build.sh" > "$DIR/build.sh"
  echo "✓ 起步代码（示例时间线在 film.js，写完 TREATMENT 后整段替换）"
else
  echo "· 已有 index.html，代码不动"
fi
# 文档模板（不覆盖已有的）
for f in BRIEF.md FACTS.md 故事线.md TREATMENT.md; do [ -f "$DIR/$f" ] || sed -e "s/__TITLE__/$(esc "$TITLE")/g" -e "s/__STYLE__/$STYLE/g" -e "s/__LANG__/$LANG_/g" "$SKILL/templates/$f" > "$DIR/$f"; done

# 品牌资产（每次都同步成最新）
mkdir -p "$DIR/brand/fonts" "$DIR/brand/logos"
cp "$SKILL/brand/brand.css" "$SKILL/brand/tokens.json" "$DIR/brand/"
cp "$SKILL/brand/logos/"* "$DIR/brand/logos/"
cp "$SKILL"/brand/fonts/OFL-*.txt "$DIR/brand/fonts/" 2>/dev/null || true
. "$SKILL/scripts/fonts.sh"
for f in $BRAND_FONTS; do
  if p=$(font_path "$f"); then cp "$p" "$DIR/brand/fonts/$f"
  else echo "! 缺品牌字体 $f：装到系统字体或设 LAIYE_FONTS=<字体目录> 后重跑本脚本（公司授权字体在「通用素材/字体-公司版权」）"; fi
done
# 思源黑体太大（每个字重约 17MB），不拷进工程，brand.css 用 local() 读系统里装的
if [ "$LANG_" = zh ] && ! font_path SourceHanSansSC-Regular.otf >/dev/null; then
  echo "! 系统里没装思源黑体，中文正文会回退。装到系统字体，或把 SourceHanSansSC-Regular/Medium/Bold.otf 放进 $DIR/brand/fonts/"
fi
# 产品界面色（Screencast 风格重绘界面时用）
[ "$STYLE" = laiye-screencast ] && cp "$SKILL/brand/products/laiye-worker/ui-tokens.json" "$DIR/brand/laiye-worker-ui-tokens.json"
[ -f "$DIR/CREDITS" ] || cat > "$DIR/CREDITS" <<EOF
$TITLE

字体：汉仪雅酷黑 85W、TT Supermolot Neue（TypeType）——来也公司授权；Inter（Rasmus Andersson）、JetBrains Mono（JetBrains）、思源黑体（Adobe）——SIL OFL 1.1。
品牌素材：来也 logo、产品图标为来也科技自有。
音乐与音效：sound.py 程序合成，无第三方采样。
EOF
echo "✓ $DIR  风格 $STYLE  语言 $LANG_"
echo "  预览一帧：cd \"$LIB\" && node core/render/still.mjs \"$DIR\" 3"
