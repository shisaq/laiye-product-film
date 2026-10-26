#!/bin/sh
# 成片自查用的联系表：每隔 step 秒截一帧，每 24 帧拼一张（6×4）
#   sh review.sh <片子工程> [step=1] [起点=0]     → <工程>/review/sheet-01.jpg …
set -e
DIR=$(cd "$1" && pwd); STEP=${2:-1}; FROM=${3:-0}
[ -f "$DIR/index.html" ] || { echo "用法：sh review.sh <片子工程> [step=1] [起点=0]"; exit 2; }
LIB=${LIB:-$(sed -n 's/^LIB=//p' "$DIR/build.sh" 2>/dev/null | head -1)}; LIB=${LIB:-$HOME/lemo-opuscar}
cd "$LIB"
node core/render/events.mjs "$DIR" >/dev/null
DUR=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1])).dur)" "$DIR/events.json")
END=$(node -e "console.log(Math.max(+process.argv[2], +process.argv[1] - 1/30).toFixed(2))" "$DUR" "$FROM")
rm -rf "$DIR/review"; mkdir -p "$DIR/review/frames"
node core/render/still.mjs "$DIR" --range "$FROM:$END:$STEP" --out "$DIR/review/frames" >/dev/null
# 末帧单独截一张：确认片尾停住、没有淡出
node core/render/still.mjs "$DIR" "$END" --prefix z_last_ --out "$DIR/review/frames" >/dev/null
set -- "$DIR"/review/frames/t_*.jpg "$DIR"/review/frames/z_last_*.jpg
i=0; n=1
while [ $# -gt 0 ]; do
  batch=""; c=0
  while [ $# -gt 0 ] && [ $c -lt 24 ]; do batch="$batch $1"; shift; c=$((c + 1)); done
  "$LIB/.venv/bin/python" core/render/sheet.py "$DIR/review/sheet-$(printf %02d $n).jpg" $batch --cols 6 --w 480 >/dev/null
  echo "$DIR/review/sheet-$(printf %02d $n).jpg"; n=$((n + 1))
done
