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
# 按时间数值排序（t_10 不能排在 t_2 前面），每 24 帧拼一张；路径可以带空格
"$LIB/.venv/bin/python" -I - "$LIB" "$DIR/review" <<'EOF2'
import sys, glob, os, subprocess
lib, out = sys.argv[1], sys.argv[2]
fr = sorted(glob.glob(os.path.join(out, 'frames', 't_*.jpg')), key=lambda p: float(os.path.basename(p)[2:-4]))
fr += sorted(glob.glob(os.path.join(out, 'frames', 'z_last_*.jpg')))
for n, i in enumerate(range(0, len(fr), 24), 1):
    o = os.path.join(out, f'sheet-{n:02d}.jpg')
    subprocess.run([os.path.join(lib, '.venv/bin/python'), os.path.join(lib, 'core/render/sheet.py'), o, *fr[i:i + 24], '--cols', '6', '--w', '480'], check=True, stdout=subprocess.DEVNULL)
    print(o)
EOF2
