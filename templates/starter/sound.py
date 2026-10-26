"""配乐 + 拟音 → out/mix.wav，时间全部来自 events.json（和画面同一份时间线）。
示例：120 BPM 的合成 pad + 拨弦铺底，click / whoosh / tick / land 事件各配一个声音。
真片子按 TREATMENT 的 cue map 重写：段落、静音、重音都对齐 film.js 里的 T。"""
import os, json, numpy as np, soundfile as sf, sys
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio.sfx import SR, click, whoosh, thump, pop, ding, add, lp, limit

HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, 'events.json'))); EV, DUR = E['ev'], E['dur']
N = int((DUR + .5) * SR); mix = np.zeros((N, 2), np.float32)
BEAT = .5
def tt(d): return np.arange(int(round(d * SR))) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)

def pad(f, d, v=.08):
    t = tt(d); x = sum(np.sin(2 * np.pi * f * k * (1 + det) * t) / k ** 1.6 for k in range(1, 7) for det in (-.003, .003))
    return (x * np.minimum(1, t / .6) * np.clip((d - t) / .8, 0, 1) * v).astype(np.float32)
def pluck(f, d=.3, v=.12):
    t = tt(d); x = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (6 + 2 * k)) / k for k in range(1, 9))
    return (x * np.minimum(1, t / .003) * v).astype(np.float32)

# 和弦进行：Fmaj7 – Dm9 – Bbmaj7 – C6，每两小节换一次
CH = [[53, 57, 60, 64], [50, 57, 60, 64], [46, 53, 57, 62], [48, 55, 57, 64]]
end_t = next((e['t'] for e in EV if e['type'] == 'land'), DUR)
for i, t0 in enumerate(np.arange(0, DUR, 4 * BEAT * 2)):
    for m in CH[i % 4]: add(mix, pad(hz(m), 4 * BEAT * 2 + .8), t0, .5, (m % 5 - 2) * .15)
for j, t0 in enumerate(np.arange(0, DUR, BEAT / 2)):
    if t0 > end_t + 1.5: break
    ch = CH[int(t0 // (4 * BEAT * 2)) % 4]
    add(mix, pluck(hz(ch[j % 4] + 12)), t0, .55 if j % 2 == 0 else .35, (-.3, .3)[j % 2])

FX = {'click': lambda e: (click(1.3, .5), .5), 'whoosh': lambda e: (whoosh(max(.25, e.get('d', .35)), .5), .45),
      'tick': lambda e: (pop(.6), .35), 'land': lambda e: (thump(.9, 60), .9)}
for e in EV:
    if e['type'] in FX:
        x, g = FX[e['type']](e); add(mix, x, e['t'], g)
if any(e['type'] == 'land' for e in EV): add(mix, ding(.6), end_t + .05, .25)

for c in range(2): mix[:, c] = limit(mix[:, c], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR, subtype='FLOAT')
print('mix', round(DUR, 2), 's →', os.path.join(HERE, 'out', 'mix.wav'))
