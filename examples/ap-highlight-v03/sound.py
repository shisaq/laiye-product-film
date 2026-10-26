"""Score + foley → out/mix.wav, all timed from events.json (one source with the picture).
An all-synth, tech score: four-on-the-floor electronic kit, sub bass, 16th-note pluck arpeggio, side-chained pad, FM bells,
risers and impacts. 120 BPM, D minor / F major colours (Dm9 – Bbmaj7 – Fmaj7 – C6). Setup groove → the lid closes (pad and
sub only) → night shift in the cloud (half-time kick, dark plucks, builds at the match) → riser, silence, impact at morning →
roll and impact on the Xero draft → night outro."""
import sys, os, json, numpy as np, soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, noise, add, compress, limit, click as sclick
from core.audio import sampler as S
HERE = os.path.dirname(os.path.abspath(__file__))
EVJ = json.load(open(os.path.join(HERE, 'events.json'))); E = EVJ['ev']; DUR = EVJ['dur']
rng = np.random.default_rng(11); S.seed(11)
NS = int((DUR + 1.0) * SR); B = .5; BAR = 2.0
def tt(d): return np.arange(int(round(d * SR))) / SR
def db(x): return 10 ** (x / 20)
MK = {e['k']: e['t'] for e in E if e['type'] == 'mark'}
def all_(tp): return [e for e in E if e['type'] == tp]
hz = S.hz

# ───────── pixel voice
def pulse(f, d, duty=.25, vol=1., att=.003, rel=.05, slide=None):
    t = tt(d); fr = np.full(len(t), float(f)) if slide is None else f * (slide ** (t / d))
    ph = np.cumsum(fr) / SR; x = np.zeros(len(t))
    for k in range(1, 24):
        m = fr * k < 16000; x += m * (np.sin(np.pi * k * duty) / k) * np.cos(2 * np.pi * k * (ph - duty / 2))
    e = np.minimum(1, t / att) * np.minimum(1, (d - t) / rel).clip(0)
    return (x * e * vol * .5).astype(np.float32)
def crush(x, bits=5): q = 2 ** bits; return (np.round(x * q) / q).astype(np.float32)
def nz(d, lo, hi, vol=1., tau=None):
    x = bp(rng.standard_normal(int(d * SR)), lo, hi) * vol
    if tau: x *= np.exp(-tt(d)[:len(x)] / tau)
    return x.astype(np.float32)

# ═════════ score (synthesised)
M = MK; EVN = []
L = NS
music = np.zeros((L, 2), np.float32); drums = np.zeros((L, 2), np.float32); bassb = np.zeros((L, 2), np.float32)
def harm(f, d, nh=14, decay=None, roll=1.0, det=0.0, att=.004, rel=.06):
    t = tt(d); x = np.zeros(len(t))
    for k in range(1, nh + 1):
        if f * k > 15000: break
        a = 1 / k ** roll; e = np.exp(-t * decay * (1 + .35 * k)) if decay else 1
        x += a * np.sin(2 * np.pi * f * k * (1 + det) * t + k) * e
    env = np.minimum(1, t / att) * np.clip((d - t) / rel, 0, 1)
    return (x * env).astype(np.float32)
def pluck(f, d=.24, v=.3, bright=1.0): return harm(f, d, 16, decay=7 / bright, roll=1.0) * v
def padv(f, d, v=.12): return (harm(f, d, 8, roll=1.5, det=-.004, att=.35, rel=.5) + harm(f, d, 8, roll=1.5, det=.004, att=.35, rel=.5)) * v
def sub(f, d, v=.5): t = tt(d); return ((np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t)) * np.minimum(1, t / .006) * np.clip((d - t) / .05, 0, 1) * v).astype(np.float32)
def kick(v=1.):
    t = tt(.45); f = 48 + 110 * np.exp(-t * 28); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16)
    return ((x + nz(.45, 2000, 8000, .25, .004)[:len(t)]) * v).astype(np.float32)
def clapf(v=.5):
    x = np.zeros(int(.3 * SR), np.float32)
    for k, o in enumerate((0, .011, .023)): seg_ = nz(.3 - o, 1100, 5200, v * (.8 if k < 2 else 1), .012 if k < 2 else .07); x[int(o * SR):int(o * SR) + len(seg_)] += seg_
    return x
def hat(v=.2, open_=False): return nz(.22 if open_ else .05, 7000, 15000, v, .07 if open_ else .012)
def bell(f, d=.9, v=.3):
    t = tt(d); m = np.sin(2 * np.pi * f * 3.5 * t) * 2.2 * np.exp(-t * 6); x = np.sin(2 * np.pi * f * t + m) * np.exp(-t * 3.2)
    return (x * np.minimum(1, t / .002) * v).astype(np.float32)
def riser(d, v=.3):
    t = tt(d); k = t / d; x = rng.standard_normal(len(t)); y = np.zeros(len(t))
    for i0 in range(0, len(t), 2048): c = 600 + 9000 * k[i0] ** 2; y[i0:i0 + 2048] = bp(x[i0:i0 + 2048 + 512], c * .5, min(c * 1.6, 18000))[:len(y[i0:i0 + 2048])]
    s_ = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * k)) / SR) * .3
    return ((y * .8 + s_) * k ** 2 * v).astype(np.float32)
def impact(v=.6):
    t = tt(1.6); f = 30 + 90 * np.exp(-t * 6); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .5)
    return ((x + nz(1.6, 200, 6000, .5, .25)[:len(t)]) * v).astype(np.float32)

CH = [('D2', ['D4', 'F4', 'A4', 'C5', 'E5']), ('Bb1', ['D4', 'F4', 'A4', 'Bb4', 'D5']), ('F2', ['C4', 'F4', 'A4', 'C5', 'E5']), ('C2', ['C4', 'E4', 'G4', 'A4', 'C5'])]
chord = lambda t: CH[int(t // BAR) % 4]
ARP = [0, 2, 1, 3, 2, 4, 3, 1]
KICKS = []
def section(t0, t1, kick_='four', clap_=True, hats='off', arp=.22, bright=1.0, bass='off8', pad=.1):
    t0 = round(t0 / (B / 4)) * (B / 4)
    n0, n1 = int(round(t0 / (B / 4))), int(round(t1 / (B / 4)))
    for n in range(n0, n1):
        t = n * B / 4; q = n % 16; root, ns = chord(t + 1e-3)
        if kick_ == 'four' and q % 4 == 0: add(drums, kick(.9), t, 1, 0); KICKS.append(t)
        if kick_ == 'half' and q in (0, 10): add(drums, kick(.75), t, 1, 0); KICKS.append(t)
        if clap_ and q in (4, 12): add(drums, clapf(.35), t, 1, .05)
        if hats == 'off' and q % 4 == 2: add(drums, hat(.16, True), t, 1, .3)
        if hats in ('16', 'off') and q % 2 == 1: add(drums, hat(.07), t, 1, -.3)
        if hats == '16' and q % 2 == 0: add(drums, hat(.05), t, 1, -.25)
        if arp: add(music, pluck(hz(ns[ARP[q % 8]]) * (2 if q % 8 in (5,) else 1), .22, arp, bright), t, 1, (-.35, .35)[q % 2])
        if bass == 'off8' and q % 4 == 2: add(bassb, sub(hz(root), .22, .55), t, 1, 0)
        if bass == 'root' and q % 8 == 0: add(bassb, sub(hz(root), .95, .5), t, 1, 0)
        if pad and q == 0: [add(music, padv(hz(p), BAR + .1, pad), t, 1, -.3 + j * .15) for j, p in enumerate(ns[:4])]
# intro: pad + soft arp, hats with the first click
section(0, M['land0'], kick_=None, clap_=False, hats=None, arp=.12, bright=.6)
for t in np.arange(.6, M['land0'] - .01, B / 2): add(drums, hat(.05), t, 1, .3)
add(music, impact(.45), M['land0'], 1, 0)
# setup groove (brighter while the cards are answered)
section(M['land0'], M['q0'], arp=.18, bright=.9)
section(M['q0'], M['conn'], arp=.24, bright=1.3)
section(M['conn'], M['lid'], arp=.22, bright=1.1, hats='16')
# the lid closes: pad + sub drone only
for t in np.arange(M['lid'], M['quiet'], BAR): root, ns = chord(t + 1e-3); add(bassb, sub(hz(root), BAR, .35), t, 1, 0); [add(music, padv(hz(p), BAR + .2, .1), t, 1, -.3 + j * .2) for j, p in enumerate(ns[:4])]
add(music, impact(.35), M['lid'] + .1, 1, 0)
# night shift: half-time kick, dark plucks; builds at the match
section(M['stage'], M['audit'], kick_='half', clap_=False, hats='16', arp=.2, bright=.55, bass='root', pad=.08)
section(M['audit'], M['morn0'], kick_='half', clap_=True, hats='16', arp=.24, bright=.9, bass='off8', pad=.08)
# morning: riser → silence → impact, then the full groove
add(music, riser(M['hush'] - M['morn0'], .35), M['morn0'], 1, 0)
for t in np.arange(M['morn0'], M['hush'], BAR): root, ns = chord(t + 1e-3); [add(music, padv(hz(p), BAR + .2, .1), t, 1, -.3 + j * .2) for j, p in enumerate(ns[:4])]
add(music, impact(.7), M['wake'], 1, 0)
section(M['wake'], M['submit'], arp=.24, bright=1.3, hats='off')
# confirm → snare roll + riser → impact on the draft
nroll = int((M['badge'] - M['submit']) / (B / 4))
for k in range(nroll): add(drums, clapf(.08 + .3 * k / nroll), M['submit'] + k * B / 4, 1, .1)
add(music, riser(M['badge'] - M['submit'], .25), M['submit'], 1, 0)
add(music, impact(.7), M['badge'], 1, 0)
for j, p in enumerate(['D6', 'F6', 'A6', 'C7', 'E7']): add(music, bell(hz(p), 1.0, .14), M['badge'] + .05 + j * B / 4, 1, .25)
section(M['badge'], M['eve0'], arp=.24, bright=1.3, hats='off')
# outro: night again, pad + slow arp, final Dm9 rings out
tE = M['endLand'] + 1.4
section(M['eve0'], tE, kick_=None, clap_=False, hats=None, arp=.16, bright=.7, bass='root', pad=.1)
add(bassb, sub(hz('D2'), 3.6, .5), tE, 1, 0)
for j, p in enumerate(['D4', 'F4', 'A4', 'C5', 'E5']): add(music, padv(hz(p), 3.8, .12), tE, 1, -.3 + j * .15); add(music, bell(hz(p) * 2, 2.5, .05), tE + j * .06, 1, -.2 + j * .1)
# the assistant's motif (FM bells) on the Added moment and the end card
for k, p in enumerate(['A5', 'C6', 'D6', 'F6', 'E6']): add(music, bell(hz(p), .8, .12), M['land0'] + .1 + k * B / 4, 1, .2); add(music, bell(hz(p), .8, .1), M['endLand'] + .1 + k * B / 4, 1, .2)
# side-chain: pad, plucks and bass duck under every kick
tn = np.arange(L) / SR
duck = np.ones(L)
for k in KICKS:
    i0 = int(k * SR); n = int(.32 * SR); seg_ = 1 - .55 * np.exp(-np.arange(n) / SR / .09)
    duck[i0:i0 + n] = np.minimum(duck[i0:i0 + n], seg_[:len(duck[i0:i0 + n])])
music = music * duck[:, None] + hp(bassb[:, 0], 35)[:, None].repeat(2, 1).astype(np.float32) * .55 * duck[:, None] + drums * np.array([.8, .8], np.float32)
def ramp(t, a, b): return np.clip((t - a) / (b - a), 0, 1)
night = ramp(tn, M['lid'], M['quiet']) * (1 - ramp(tn, M['morn0'], M['wake'])) + .55 * ramp(tn, M['eve0'], M['endLand'])
music = S.room(music, size=.4, mix=.12)
# silences: a near-silence before the night shift, a full one before morning
gate = 1 - .9 * ramp(tn, M['quiet'] - .25, M['quiet']) * (1 - ramp(tn, M['stage'], M['stage'] + .05))
gate *= 1 - .95 * ramp(tn, M['hush'] - .1, M['hush']) * (1 - ramp(tn, M['wake'], M['wake'] + .02))
music *= gate[:, None]
EVN = KICKS

# ═════════ foley
fx = np.zeros((NS, 2), np.float32)
def key(v=.8, heavy=False):
    d = .09; t = tt(d); th = np.sin(2 * np.pi * (170 + rng.uniform(-20, 20)) * t) * np.exp(-t / .018) * .5
    ck = nz(d, 2500, 7000, .5, .006) + nz(d, 900, 2200, .3, .012); return ((th + ck[:len(th)]) * v * (1.5 if heavy else 1)).astype(np.float32)
def tick(v=.5, f=2600): t = tt(.05); return (np.sin(2 * np.pi * f * t) * np.exp(-t / .008) * v + nz(.05, 3000, 8000, .15 * v, .004)[:len(t)]).astype(np.float32)
def pop(v=.6, f0=520, f1=980): t = tt(.12); f = f0 * (f1 / f0) ** np.minimum(1, t / .05); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .035) * v).astype(np.float32)
def swish(d=.35, v=.5, lo=400, hi=4000):
    x = rng.standard_normal(int(d * SR)); t = tt(d)[:len(x)]; e = np.sin(np.pi * t / d) ** 2; return (bp(x, lo, hi) * e * v).astype(np.float32)
def boom(v=1., f0=90, d=.9): v *= .45; t = tt(d); f = f0 * np.exp(-t * 2.2) + 32; return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .3) * v).astype(np.float32)
def scan(d=.45, v=.25):
    t = tt(d); f = 900 + 2400 * t / d; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2 * v * .35
    return (x + nz(d, 3000, 9000, v * .25)[:len(t)] * np.sin(np.pi * t / d)).astype(np.float32)
for e in E:
    t0, tp = e['t'], e['type']
    if tp == 'key': add(fx, key(e.get('v', .7) * .6), t0, .5, -.05 + rng.uniform(-.1, .1))
    elif tp == "click": add(fx, lp(sclick(1.1, .8), 6000).astype(np.float32), t0, .5, .1)
    elif tp == 'pop': add(fx, pop(.3), t0, 1, 0)
    elif tp == 'tick': add(fx, tick(.18 * e.get('v', .5), 3400), t0, 1, .4)
    elif tp == 'tick2': add(fx, bell(hz(['D6', 'E6', 'F6', 'A6', 'C7', 'D7'][e['i'] % 6]), .5, .3), t0, 1, .2); add(fx, tick(.25, 2800), t0, 1, -.1)
    elif tp == 'chip': add(fx, pop(.32, 700, 1300), t0, 1, .35); add(fx, bell(hz('A6'), .4, .2), t0 + .08, 1, .35)
    elif tp == 'scan': add(fx, scan(), t0, 1, (e['i'] - 1) * .3)
    elif tp == 'link': [add(fx, tick(.3, 2200 + k * 400), t0 + k * .17, 1, (k - 1) * .3) for k in range(3)]
    elif tp == 'pulse': add(fx, swish(.5, .18, 1200, 7000), t0, 1, .3); add(fx, pop(.22, 900, 1500), t0 + .5, 1, .3)
    elif tp == 'stamp':
        add(fx, boom(.5, 120, .25), t0, 1, 0); add(fx, nz(.05, 400, 3000, .25, .02), t0, 1, 0)
        add(fx, bell(hz(['F6', 'A6', 'C7', 'D7', 'D7'][e['i']]), .6, .25), t0 + .04, 1, .2)
    elif tp == 'whoosh': add(fx, swish(.45 if e.get('d') else .7, .32, 300, 3800), t0 - .12, 1, 0)
    elif tp == 'pane': add(fx, swish(.4, .22, 400, 4000), t0 - .1, 1, .2)
    elif tp == 'send': add(fx, swish(.45, .22, 700, 6000), t0, 1, -.3)
    elif tp == 'chime':
        for k, p in enumerate(['E6', 'B6']): add(fx, bell(hz(p), .9, .3), t0 + k * .11, 1, -.4)
    elif tp == 'lid': add(fx, boom(.6, 80, .5), t0 + .1, 1, 0); add(fx, swish(.5, .2, 200, 1500), t0, 1, 0)
    elif tp == 'wake': add(fx, swish(.6, .25, 500, 5000), t0 - .2, 1, 0)
    elif tp == 'morph': pass
# ambience: room tone by day, a lower night air at night (always present, so silences are never digital zero)
def bed(lo, hi, v): x = noise(NS / SR); return np.stack([bp(x, lo, hi) * v] * 2, 1).astype(np.float32)[:NS]
amb = bed(120, 900, .006) * (1 - night[:, None] * .6) + bed(300, 2500, .004) * night[:, None]

# ═════════ mix
music = music / (np.abs(music).max() + 1e-9) * .55
fx = np.stack([compress(fx[:, c], .08, 4.0, .001, .06) for c in (0, 1)], 1)   # foley clicks are short spikes: flatten them first
fx = fx / (np.abs(fx).max() + 1e-9) * .4
mix = music * db(float(os.environ.get('GM', 0))) + fx * db(float(os.environ.get('GF', 0))) + amb
fade = np.ones(NS); fo = int(.05 * SR); end = int(DUR * SR); fade[end - fo:end] = np.linspace(1, 0, fo); fade[end:] = 0
mix = mix * fade[:, None] * db(11.5)             # drive into the limiter: peak-to-loudness ≤ 12.8 dB so −14 LUFS fits under −1.2 dBTP
mix = np.stack([limit(compress(mix[:, c], .22, 2.5, .003, .12), .8) for c in (0, 1)], 1) * .88   # tame transients per channel so the −14 LUFS master keeps true peak under −1.2 dB
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix[:int((DUR + .05) * SR)], SR)
print('out/mix.wav', round(DUR, 2), 's; notes', len(EVN))
