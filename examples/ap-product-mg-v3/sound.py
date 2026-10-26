"""配乐 + 拟音 → out/mix.wav，时间全部来自 events.json（和画面同一份时间线）。
120 BPM，全合成，四章：开场（图标落定的重音 + pad）→ 配置（轻律动，每次点选一声）→ 夜里（鼓退出，pad + 脉冲 + 打勾；
合计前抽空，逐位锁定的玻璃音，印章重拍）→ 早晨（上升音进明亮律动，点击、回复）→ 定版重拍，和弦自然延音。
所有打勾、落定、锁定都在 D 小调五声音阶里，是同一个声音家族。"""
import os, sys, json, numpy as np, soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio.sfx import SR, add, lp, hp, bp, noise, whoosh, click, limit

HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, 'events.json'))); EV, DUR = E['ev'], E['dur']
MK = {e['k']: e['t'] for e in EV if e['type'] == 'mark'}
N = int((DUR + .6) * SR)
music = np.zeros((N, 2), np.float32); drums = np.zeros((N, 2), np.float32); fx = np.zeros((N, 2), np.float32)
B = .5
rng = np.random.default_rng(5)
def tt(d): return np.arange(int(round(d * SR))) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def env(d, a=.005, r=.08):
    t = tt(d); return np.minimum(1, t / a) * np.clip((d - t) / r, 0, 1)

# ───────── 音色
def pad(f, d, v=.05, bright=1.0):
    t = tt(d); x = np.zeros(len(t))
    for k in range(1, 9):
        if f * k > 9000: break
        for det in (-.004, .004): x += np.sin(2 * np.pi * f * k * (1 + det) * t + k) / k ** (1.9 - .4 * bright)
    return (x * env(d, .8, 1.2) * v).astype(np.float32)
def marimba(f, d=.6, v=.12):
    t = tt(d); x = np.sin(2 * np.pi * f * t) * np.exp(-t * 7) + .35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 22)
    return (x * env(d, .002, .05) * v).astype(np.float32)
def glass(f, d=.9, v=.12):   # FM 玻璃铃
    t = tt(d); m = 1.4 * np.sin(2 * np.pi * f * 3.5 * t) * np.exp(-t * 8)
    return (np.sin(2 * np.pi * f * t + m) * np.exp(-t * 4.5) * env(d, .001, .05) * v).astype(np.float32)
def pluck(f, d=.3, v=.1):
    t = tt(d); x = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (7 + 3 * k)) / k for k in range(1, 8))
    return (x * env(d, .002, .04) * v).astype(np.float32)
def sub(f, d, v=.3):
    t = tt(d); return ((np.sin(2 * np.pi * f * t) + .2 * np.sin(4 * np.pi * f * t)) * env(d, .008, .06) * v).astype(np.float32)
def kick(v=.8):
    t = tt(.4); f = 45 + 95 * np.exp(-t * 30); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .13) * v).astype(np.float32)
def hat(v=.08): x = hp(noise(.05), 8000) * np.exp(-tt(.05)[:int(.05 * SR)] / .012); return (x * v).astype(np.float32)
def thump(v=1.):
    t = tt(.7); f = 38 + 60 * np.exp(-t * 18); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .25) * v).astype(np.float32)
def shimmer(d=.8, v=.05):
    x = bp(noise(d), 5000, 11000) * np.sin(np.pi * tt(d)[:int(round(d * SR))] / d) ** 2; return (x * v).astype(np.float32)
def grains(d, rate=22, v=.04):
    x = np.zeros(int(d * SR), np.float32)
    for k in range(int(d * rate)):
        s = int((k + rng.random() * .5) / rate * SR); g = hp(noise(.012), 3000) * np.exp(-tt(.012)[:int(.012 * SR)] / .003)
        x[s:s + len(g)] += (g * v * (.5 + rng.random())).astype(np.float32)[:len(x) - s]
    return x
def riser(d, v=.08):
    t = tt(d); x = bp(noise(d), 800, 9000) * (t / d) ** 2.5; return (x * v).astype(np.float32)

PENTA = [62, 65, 67, 69, 72, 74, 77, 79, 81, 84, 86, 89, 91, 93, 96]   # D 小调五声，高到低排好
NIGHT = [[50, 53, 57, 60, 64], [46, 50, 53, 57], [53, 57, 60, 64], [48, 52, 55, 57]]   # Dm9 Bbmaj7 Fmaj7 C6
DAY = [[53, 57, 60, 64], [52, 55, 60, 67], [46, 53, 57, 62], [53, 57, 60, 65]]       # Fmaj7 C/E Bbmaj7 F
def chord_at(t, prog): return prog[int(t // 4) % 4]


intro, groove, night, hush, stamp, morning, end = (MK[k] for k in ['intro', 'groove', 'night', 'hush', 'stamp', 'morning', 'end'])

# ───────── 开场：pad + 低频脉冲
for m in NIGHT[2]: add(music, pad(hz(m), groove + .4, .045, 1.2), 0, 1, (m % 5 - 2) * .15)
for t0 in np.arange(.3, groove - .05, B): add(music, sub(hz(41), .3, .12), t0, 1)

# ───────── 配置段和早晨：律动
def groove_section(a, b, prog, bright, kv):
    for t0 in np.arange(a, b, 4.0):
        for m in chord_at(t0 - a, prog): add(music, pad(hz(m), min(4.5, b - t0 + .3), .04, bright), t0, 1, (m % 5 - 2) * .15)
    for j, t0 in enumerate(np.arange(a, b - 1e-6, B)):
        add(drums, kick(kv), t0, 1); add(drums, hat(.045), t0 + B / 2, 1, .3)
        root = chord_at(t0 - a, prog)[0]; add(music, sub(hz(root - 12), .42, .2), t0, 1)
    for j, t0 in enumerate(np.arange(a, b - 1e-6, B / 2)):
        ch = chord_at(t0 - a, prog); add(music, pluck(hz(ch[(j * 3) % len(ch)] + (24 if bright > 1.2 else 12)), .3, .05 * bright), t0, 1, (-.4, .4)[j % 2])
groove_section(groove, night, DAY, 1.1, .5)
add(fx, riser(1.4, .06), morning - 1.4, 1)
groove_section(morning, end, DAY, 1.4, .68)

# ───────── 夜里：pad + 脉冲 + 稀疏马林巴，没有鼓
for t0 in np.arange(night, morning, 4.0):
    d = min(4.6, morning - t0 + .3)
    for m in chord_at(t0 - night, NIGHT): add(music, pad(hz(m), d, .045), t0, 1, (m % 5 - 2) * .15)
for t0 in np.arange(night + .5, morning - .05, B): add(music, sub(hz(38), .35, .14), t0, 1)
for j, t0 in enumerate(np.arange(night + 1.0, morning - .2, B / 2)):
    if j % 3 == 2: continue
    ch = chord_at(t0 - night, NIGHT); add(music, marimba(hz(ch[j % len(ch)] + 24), .5, .06), t0, 1, (-.35, .35)[j % 2])
room = lp(noise(DUR + .5), 300) * .004
music[:len(room), 0] += room[:N]; music[:len(room), 1] += room[:N]

# ───────── 定版：重拍 + 钢片琴琶音 + 延音和弦
add(drums, thump(1.0), end + .1, 1); add(drums, kick(.9), end + .1, 1)
for m in [53, 57, 60, 64, 69]: add(music, pad(hz(m), DUR - end + .4, .06, 1.4), end + .1, 1, (m % 5 - 2) * .15)
add(music, sub(hz(41), 2.5, .3), end + .1, 1)
for i, m in enumerate([77, 81, 84, 88, 89, 93]): add(music, glass(hz(m), 1.6, .08), end + .35 + i * B / 2, 1, (-.3, .3)[i % 2])

# ───────── 拟音
for e in EV:
    t, k = e['t'], e['type']
    if k == 'land': add(fx, thump(.7), t, 1); add(fx, glass(hz(81), 1.2, .1), t + .02, 1)
    elif k == 'sweep': add(fx, shimmer(e['d'], .05), t, 1)
    elif k == 'whoosh': add(fx, whoosh(max(.3, e['d']), .2), t, 1)
    elif k == 'click': add(fx, click(1.4, .3), t, 1)
    elif k == 'added': add(fx, glass(hz(86), .8, .1), t, 1); add(fx, glass(hz(93), .8, .07), t + .12, 1)
    elif k == 'pop': add(fx, glass(hz(PENTA[e['i'] % len(PENTA)] + 12), .35, .06), t, 1, (e['i'] % 3 - 1) * .3)
    elif k == 'tick': add(fx, glass(hz(PENTA[e['n'] % len(PENTA)] + 12), .5, .07), t, 1, (e['n'] % 3 - 1) * .3)
    elif k == 'arp':
        for i, m in enumerate([74, 81, 86]): add(fx, glass(hz(m), .9, .08), t + i * .18, 1)
    elif k == 'check': add(fx, click(1.6, .16), t, 1); add(fx, glass(hz(84 + e['n'] * 2), .5, .06), t + .01, 1)
    elif k == 'lock': add(fx, glass(hz(PENTA[e['n'] % len(PENTA)] + 12), .45, .09), t, 1, ((e['n'] // 5) - 1) * .4)
    elif k == 'stamp':
        add(fx, thump(1.0), t, 1); add(fx, (lp(noise(.5), 3000) * np.exp(-tt(.5)[:int(.5 * SR)] / .12) * .2).astype(np.float32), t, 1)
        for m in [38, 50, 57, 62, 65, 69, 76]: add(music, pad(hz(m), 2.6, .06, 1.2), t, 1, (m % 5 - 2) * .1)
    elif k == 'retract': add(fx, glass(hz(74), .25, .05), t, 1)
    elif k == 'seal': add(fx, thump(.4), t, 1); add(fx, glass(hz(81), .6, .07), t + .02, 1)
    elif k == 'flip': add(fx, click(.7, .25), t, 1); add(fx, whoosh(.4, .15), t, 1)
    elif k == 'roll':   # 时钟飞转：越来越密的轻响
        n = 14
        for i in range(n): add(fx, click(1.8 + .4 * i / n, .1), t + e['d'] * (i / n) ** .7, 1)
    elif k == 'chime': add(fx, glass(hz(88), 1.0, .1), t, 1); add(fx, glass(hz(93), .9, .08), t + .15, 1)
locks = [e['t'] for e in EV if e['type'] == 'lock']
add(fx, grains(max(locks) - hush - .5, 24, .035), hush + .5, 1)

# ───────── 合计前抽空
def gate(buf, a, b, fade=.08):
    i0, i1, f = int(a * SR), int(b * SR), int(fade * SR)
    w = np.ones(len(buf)); w[i0:i1] = 0; w[max(0, i0 - f):i0] = np.linspace(1, 0, min(f, i0))
    buf *= w[:, None].astype(np.float32)
gate(music, hush, hush + .5)

mix = music + drums * .9 + fx
for c in range(2): mix[:, c] = limit(mix[:, c], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR, subtype='FLOAT')
print('mix', round(DUR, 2), 's →', os.path.join(HERE, 'out', 'mix.wav'))
