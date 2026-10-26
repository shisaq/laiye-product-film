#!/bin/sh
# 录屏联系表：简报阶段快速看完一段长录屏，找到关键状态的时间点
#   sh recsheet.sh <录屏> [step=8] [输出目录=./recsheet]
# 每张 6×6 = 36 格，按行从左到右；第 k 张（从 1 数）第 i 格（从 0 数）的时间 = ((k-1)×36 + i) × step 秒。
# 找到时间点后截全分辨率的一帧：ffmpeg -ss <秒> -i <录屏> -frames:v 1 -q:v 3 out.jpg
set -e
V=$1; STEP=${2:-8}; OUT=${3:-./recsheet}
[ -f "$V" ] || { echo "用法：sh recsheet.sh <录屏> [step=8] [输出目录]"; exit 2; }
mkdir -p "$OUT"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
N=$(awk -v d="$DUR" -v s="$STEP" 'BEGIN{n=int(d/s/36)+1; print n}')
ffmpeg -v error -y -i "$V" -vf "fps=1/$STEP,scale=384:-2,tile=6x6" -frames:v "$N" "$OUT/sheet_%02d.jpg"
echo "录屏 ${DUR}s，每 ${STEP}s 一格，共 $N 张 → $OUT/"
ls "$OUT"/sheet_*.jpg
