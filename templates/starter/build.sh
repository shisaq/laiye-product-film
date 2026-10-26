#!/bin/sh
# 一条命令重建整条片子：sh build.sh        只出画面不出声：sh build.sh --silent
set -e
LIB=__LIB__
HERE=$(cd "$(dirname "$0")" && pwd)
NAME=$(basename "$HERE")
FPS=30
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "LIB 指向的不是 Lemo-Opuscar 库：$LIB（运行 laiye-product-film/scripts/setup.sh）"; exit 1; }
cd "$LIB"
node core/render/events.mjs "$HERE"                                   # 每次点击、甩镜、落定 → events.json
node core/render/video.mjs "$HERE" --fps $FPS --workers 4 --out "$HERE/out/video.mp4"
if [ "$1" = "--silent" ]; then echo "built $HERE/out/video.mp4 (no sound)"; exit 0; fi
"$LIB/.venv/bin/python" "$HERE/sound.py"                              # 配乐 + 拟音 → out/mix.wav
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 0
echo "built $HERE/$NAME.mp4"
