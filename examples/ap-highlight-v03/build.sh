#!/bin/sh
# AI Accounts Payable Assistant — Highlight v03 (light, no mascot). One command rebuilds everything:  sh build.sh
set -e
LIB=${LIB:-$HOME/lemo-opuscar}
HERE=$(cd "$(dirname "$0")" && pwd)
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
cd "$LIB"
node core/render/events.mjs "$HERE"                                            # every click, key, jump, pop → events.json
"$LIB/.venv/bin/python" "$HERE/sound.py"                                       # score + foley → out/mix.wav
node core/render/video.mjs "$HERE" --fps 30 --workers 5 --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/ap-assistant-highlight-v03.mp4" 30 0
node core/render/still.mjs "$HERE" 26.4 --prefix po_ --out "$HERE/out" && cp "$HERE/out/po_26.4.jpg" "$HERE/poster.jpg"
echo "built $HERE/ap-assistant-highlight-v03.mp4"
