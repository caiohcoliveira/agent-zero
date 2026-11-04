"""v7.1 · Deixa as faixas mais animadas: camadas sintetizadas no tempo da música.

Technology (play 3, 108 BPM, batida quantizada: desvio < 1 ms)
  • calma (problema e dados): bumbo nos tempos 1 e 3, chimbal e shaker leves
  • construção: bumbo em todos os tempos, caixa acelerando (colcheia → semicolcheia → fusa),
    riser de ruído + tom subindo, o grave da faixa vai sumindo (passa-alta) e meio tempo de
    silêncio antes do drop
  • drop (solução): impacto (sub que despenca + prato), bateria cheia — bumbo 4/4 afinado,
    palmas no 2 e no 4, chimbal aberto no contratempo, semicolcheias — sidechain na faixa
    (o "bombear" da música eletrônica), graves reforçados e virada a cada 4 compassos
  • relatórios de fraude: a construção esvazia (só um drone grave), silêncio, e o drop explode
Funk (play 2) e piano (play 4): tempo humano, então nada de bateria contínua no funk;
  graves e brilho reforçados, impactos e risers nos pontos-chave; no piano, percussão épica
  no clímax das disciplinas (o piano é regular ali), rufar + riser até "Tudo se resume…".
Entrada: musica/tech-edit.mp3, musica/funk-edit.mp3 (tools/edit_music.py) e musica/piano.mp3
Saída: musica/tech-mix.mp3, funk-mix.mp3, piano-mix.mp3 (o build usa as -mix quando existem)
Uso: python3 tools/remix.py   (numpy, scipy e ffmpeg)
"""
import pathlib
import subprocess

import numpy as np
from scipy.signal import butter, sosfilt, sosfiltfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 44100
RNG = np.random.default_rng(7)


def load(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'musica' / name), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def save(x, name):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-b:a', '192k',
                    str(ROOT / 'musica' / name)], input=x.astype(np.float32).tobytes(), check=True)


def sos(kind, f, order=2):
    return butter(order, f, kind, fs=SR, output='sos')


# ---------------------------------------------------------------- instrumentos
def tt(d):
    return np.arange(int(d * SR)) / SR


def noise(d, decay, band=None, kind='band', order=2):
    t = tt(d)
    n = RNG.standard_normal(len(t))
    if band is not None:
        n = sosfilt(sos(kind, band, order), n)
    n = n * np.exp(-t / decay)
    return (n / (np.abs(n).max() + 1e-9)).astype(np.float32)


def kick(f1=50., f0=175., decay=.2, d=.5):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t / .032)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / decay)
    body = np.tanh(body * 2.2) / np.tanh(2.2)
    click = noise(d, .003, 1800, 'high') * .3
    k = body + click
    return (k / np.abs(k).max()).astype(np.float32)


def clap():
    out = np.zeros(int(.4 * SR), np.float32)
    for k, dl in enumerate([0, .010, .021]):
        h = noise(.03, .006, [900, 3800])
        i = int(dl * SR)
        out[i:i + len(h)] += h * (.7 if k < 2 else 1)
    tail = noise(.36, .1, [1000, 4500])
    i = int(.021 * SR)
    out[i:i + len(tail)] += tail * .6
    return out / np.abs(out).max()


def hat(open_=False):
    return noise(.32 if open_ else .07, .12 if open_ else .022, 7500, 'high')


def shaker():
    return noise(.08, .03, [5000, 11000])


def snare():
    t = tt(.24)
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t / .05)
    s = tone * .55 + noise(.24, .075, [1800, 7000])
    return (s / np.abs(s).max()).astype(np.float32)


def tom(f=95.):
    t = tt(.6)
    ff = f * .62 + f * .38 * np.exp(-t / .08)
    s = np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t / .22) + noise(.6, .03, [300, 2500]) * .25
    return (s / np.abs(s).max()).astype(np.float32)


def crash(d=2.6):
    return noise(d, .85, 4200, 'high')


def boom(d=2.2, f0=95., f1=30.):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t / .3)
    b = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .8)
    b = np.tanh(b * 2.4) / np.tanh(2.4)
    return b.astype(np.float32)


def riser(d, tone=True):
    """ruído com passa-alta subindo (cruzando versões filtradas) + tom subindo; volume cresce"""
    n = int(d * SR)
    t = np.arange(n) / SR
    w = RNG.standard_normal(n).astype(np.float32)
    cuts = [250, 500, 1000, 2000, 4000, 8000]
    bands = [sosfilt(sos('high', c), w) for c in cuts]
    pos = (t / d) * (len(cuts) - 1)
    out = np.zeros(n, np.float32)
    for k in range(len(cuts)):
        wk = np.clip(1 - np.abs(pos - k), 0, 1)
        out += bands[k] * wk
    out /= np.abs(out).max() + 1e-9
    env = (t / d) ** 2.2
    y = out * env * .7
    if tone:
        f = 160 * (10 ** (t / d))
        y += np.sin(2 * np.pi * np.cumsum(f) / SR) * .22 * (t / d) ** 3
    return y.astype(np.float32)


def drone(d, f=46.):
    t = np.arange(int(d * SR)) / SR
    env = np.clip(t / d, 0, 1) ** 1.5
    s = (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.01 * t)) * env
    return (s / np.abs(s).max()).astype(np.float32)


# ---------------------------------------------------------------- mixagem
def place(buf, s, t, gain=1., pan=0.):
    i = int(round(t * SR))
    if i >= len(buf) or i + len(s) <= 0:
        return
    a = max(0, -i)
    j = min(len(buf), i + len(s))
    seg = s[a:j - i] * gain
    L, R = np.cos((pan + 1) * np.pi / 4) * 1.4142, np.sin((pan + 1) * np.pi / 4) * 1.4142
    buf[i + a:j, 0] += seg * L
    buf[i + a:j, 1] += seg * R


def sidechain_env(n, kicks, depth=.42, rel=.13):
    g = np.ones(n, np.float32)
    L = int(.45 * SR)
    t = np.arange(L) / SR
    e = 1 - depth * np.where(t < .005, t / .005, np.exp(-(t - .005) / rel))
    for tk in kicks:
        i = int(tk * SR)
        j = min(n, i + L)
        if i < n:
            g[i:j] = np.minimum(g[i:j], e[:j - i])
    return g


def low_boost(x, db, fc=115):
    lp = sosfiltfilt(sos('low', fc), x, axis=0)
    g = 10 ** (db / 20) - 1
    return x + lp * g * .75 + np.tanh(lp * 3) / 3 * g * .5


def presence(x, db, fc=3500):
    hp = sosfiltfilt(sos('high', fc), x, axis=0)
    return x + hp * (10 ** (db / 20) - 1)


def hp_sweep(x, t0, t1, kmax=.85, fc=700):
    i0, i1 = int(t0 * SR), int(t1 * SR)
    seg = x[i0:i1]
    hp = sosfiltfilt(sos('high', fc), seg, axis=0)
    k = (np.linspace(0, 1, i1 - i0) ** 1.6 * kmax)[:, None].astype(np.float32)
    x[i0:i1] = seg * (1 - k) + hp * k


def gap(x, t, d):
    """silêncio curto antes do drop (a música 'segura o fôlego')"""
    i0, i1 = int((t - d) * SR), int(t * SR)
    r = np.linspace(1, .04, max(1, int(.03 * SR)))[:, None]
    x[i0:i0 + len(r)] *= r
    x[i0 + len(r):i1] *= .04


def short_rms(x, w_s=.4):
    """RMS em janelas de 0,4 s (média móvel por soma acumulada)"""
    w = int(w_s * SR)
    m = x.mean(axis=1).astype(np.float64) ** 2
    c = np.cumsum(np.concatenate([[0.], m]))
    v = (c[w:] - c[:-w]) / w
    return np.sqrt(v[::441] + 1e-12)


def softknee(y, knee=.72):
    """só os picos acima do joelho são arredondados; o corpo da música fica intacto"""
    a = np.abs(y)
    over = a > knee
    out = y.copy()
    out[over] = np.sign(y[over]) * (knee + (1 - knee) * np.tanh((a[over] - knee) / (1 - knee)))
    return out


def master(x, loud_db=-11.0):
    """nível pelo trecho mais forte (RMS de 0,4 s, percentil 95) + limitador de joelho suave"""
    for _ in range(3):
        ref = np.percentile(short_rms(x), 95)
        x = softknee(x * (10 ** (loud_db / 20) / ref))
    pk = np.abs(x).max()
    return (x / pk * .97 if pk > .97 else x).astype(np.float32)


def loud_rms(x):
    return float(np.percentile(short_rms(x), 95))


# ---------------------------------------------------------------- Technology (play 3)
BEAT = .5555625
PH = -.005            # fase da grade na faixa remontada (grade do librosa − 7 ms: o bumbo novo cai sobre o bumbo da faixa)
BAR = BEAT * 4
beat_t = lambda k: PH + k * BEAT
CASES = [  # (início do case, drop, fim, tipo)
    (11.111, 46.667, 71.111, 'case'), (71.111, 106.667, 131.111, 'case'),
    (131.111, 166.667, 191.112, 'lights'), (191.112, 240.0, 260.002, 'long')]


def beats_in(t0, t1):
    k0 = int(np.ceil((t0 - PH) / BEAT - 1e-6))
    k1 = int(np.floor((t1 - PH) / BEAT - 1e-6))
    return [(k, beat_t(k)) for k in range(k0, k1 + 1) if t0 - 1e-6 <= beat_t(k) < t1 - 1e-6]


def tech():
    x = load('tech-edit.mp3')
    n = len(x)
    R = loud_rms(x)
    K, KD, CL, HO, HC, SH, SN, CR, BO = kick(52), kick(48, 190, .26), clap(), hat(True), hat(), shaker(), snare(), crash(), boom()
    drums = np.zeros_like(x)
    kicks = []        # para o sidechain (só nos drops)

    def groove_calm(t0, t1):
        for k, t in beats_in(t0, t1):
            b = k % 4
            if b in (0, 2):
                place(drums, K, t, R * 1.15)
            place(drums, HC, t + BEAT / 2, R * .16, .25)
            for s in range(4):
                place(drums, SH, t + s * BEAT / 4, R * (.07 if s % 2 else .1), -.3)

    def groove_drop(t0, t1, energy=1.):
        for k, t in beats_in(t0, t1):
            b = k % 4
            place(drums, KD, t, R * 2.3 * energy)
            kicks.append(t)
            if b in (1, 3):
                place(drums, CL, t, R * 1.15 * energy, .05)
            place(drums, HO, t + BEAT / 2, R * .42 * energy, .3)
            for s in (1, 3):
                place(drums, HC, t + s * BEAT / 4, R * .2 * energy, -.25)
            # virada a cada 4 compassos: semicolcheias de caixa no último tempo
            if (k % 16) == 15:
                for s in range(4):
                    place(drums, SN, t + s * BEAT / 4, R * (.35 + .12 * s) * energy, .1)

    def build(t0, t1, roll_from=None):
        """bumbo em todos os tempos, caixa acelerando, riser, a faixa perde o grave"""
        roll_from = t0 if roll_from is None else roll_from
        for k, t in beats_in(t0, t1 - BAR + 1e-6):
            place(drums, K, t, R * 1.6)
            place(drums, HC, t + BEAT / 2, R * .2, .25)
        span = t1 - roll_from
        t = roll_from
        while t < t1 - BEAT / 2 - 1e-3:
            u = (t - roll_from) / span
            sub = 2 if u < .35 else 4 if u < .7 else 8
            place(drums, SN, t, R * (.25 + .9 * u ** 1.4), .1 * np.sin(t * 7))
            t += BEAT / sub
        place(drums, riser(min(span, BAR * 4)), t1 - min(span, BAR * 4), R * 2.0)
        place(drums, crash(1.6)[::-1] * np.linspace(0, 1, int(1.6 * SR)) ** 2, t1 - 1.6, R * .9)
        hp_sweep(x, t0, t1, .82)
        gap(x, t1, BEAT / 2)

    def drop_hit(t, big=1.):
        place(drums, BO, t, R * 2.8 * big)
        place(drums, CR, t, R * 1.1 * big, -.2)
        place(drums, CR, t + .012, R * .8 * big, .3)

    # estação 04: abertura que já embala, riser até a porta do case 1
    for k, t in beats_in(2.22, 11.111):
        if k % 2 == 0:
            place(drums, K, t, R * 1.3)
        place(drums, HC, t + BEAT / 2, R * .16)
    place(drums, riser(BAR * 2), 11.111 - BAR * 2, R * 1.6)
    for S, D, Z, kind in CASES:
        place(drums, CR, S, R * .9)                                    # a porta do case abre
        if kind == 'long':                                             # agentes: groove calmo → groove → construção longa
            groove_calm(S + 2.222, S + 24.444)
            for k, t in beats_in(S + 24.444, S + 24.444 + BAR * 5):
                place(drums, K, t, R * 1.5)
                if k % 4 in (1, 3):
                    place(drums, CL, t, R * .7, .05)
                place(drums, HO, t + BEAT / 2, R * .25, .3)
            build(S + 24.444 + BAR * 5, D, S + 24.444 + BAR * 5)
        elif kind == 'lights':                                         # a construção esvazia: só um drone; corte seco; silêncio
            groove_calm(S + 2.222, S + 20.0)
            place(drums, drone(D - BAR - (S + 24.444), 46.), S + 24.444, R * 1.2)
        else:
            groove_calm(S + 2.222, S + 24.444)
            build(S + 24.444, D)
        drop_hit(D, 1.25 if kind != 'case' else 1.)
        groove_drop(D, Z - BEAT * 2, 1.08 if kind == 'long' else 1.)
        place(drums, riser(BAR * 1.5, tone=False), Z - BAR * 1.5, R * .9)   # puxa para o próximo case
    # 05: mantém o pico; 06: a faixa termina, a bateria sai aos poucos
    place(drums, CR, 260.002, R * .9)
    groove_drop(260.002, 280.0, 1.)
    for k, t in beats_in(280.006, 294.0):
        if k % 4 in (0, 2):
            place(drums, K, t, R * 1.1 * (1 - (t - 280) / 16))
    y = x * sidechain_env(n, kicks)[:, None]
    y = low_boost(y, 4.5)
    y = presence(y, 2.0)
    return master(y + drums, -11.0)


# ---------------------------------------------------------------- funk (play 2)
def funk():
    x = load('funk-edit.mp3')
    R = loud_rms(x)
    fx = np.zeros_like(x)
    # o break antes da parte B (estação 03): riser, o grave some e volta com impacto
    B = 106.02
    place(fx, riser(4.36), B - 4.36, R * 1.4)
    hp_sweep(x, B - 4.36, B, .7)
    gap(x, B, .27)
    place(fx, boom(), B, R * 2.4)
    place(fx, crash(), B, R * 1.0)
    for t in (46.98, 90.62, 142.98):          # viradas de estação e a saída da música
        place(fx, crash(2.2), t, R * .75)
    y = low_boost(x, 4.0)
    y = presence(y, 1.5)
    return master(y + fx, -11.5)


# ---------------------------------------------------------------- piano (play 4)
def piano():
    x = load('piano.mp3')
    R = loud_rms(x)
    fx = np.zeros_like(x)
    BTS = [27.28, 27.88, 28.48, 29.08, 29.68, 30.28, 30.88, 31.5, 32.1, 32.68, 33.28, 33.88, 34.48, 35.1, 35.7, 36.28, 36.88, 37.48, 38.1, 38.7,
           39.28, 39.9, 40.48, 41.08, 41.68, 42.28, 42.9, 43.48, 44.08, 44.68, 45.3, 45.9, 46.48, 47.08, 47.7, 48.28]
    DOWN = [7.48, 9.86, 12.28, 14.68, 17.08, 19.48, 21.86, 24.3, 26.68, 29.08]
    T, K = tom(), kick(46, 150, .3)
    # 07: a cidade — pulso épico nos compassos depois do primeiro impacto
    place(fx, boom(), 7.48, R * 2.2)
    place(fx, crash(), 7.48, R * .8)
    for t in DOWN[1:]:
        place(fx, K, t, R * 1.3)
        place(fx, T, t + .6 * 2, R * .6, .2)
    # clímax: as disciplinas entram a cada 2 tempos — bumbo em todos os tempos, tom em cada entrada
    for i, t in enumerate(BTS):
        if 29.08 <= t < 43.48:
            place(fx, K, t, R * (1.5 + .5 * (t - 29) / 14))
        if 29.6 <= t < 38.2 and abs(((t - 29.68) / 1.2) - round((t - 29.68) / 1.2)) < .05:
            place(fx, T, t, R * 1.2, -.2 + .4 * ((t - 29.68) / 8.4))
    # rufar + riser até "Tudo se resume a…" (43,48)
    t = 38.7
    while t < 43.48 - .15:
        u = (t - 38.7) / 4.78
        place(fx, snare(), t, R * (.3 + .9 * u ** 1.5), .1)
        t += .6 / (2 if u < .4 else 4 if u < .75 else 8)
    place(fx, riser(4.78), 43.48 - 4.78, R * 1.8)
    place(fx, boom(), 43.48, R * 2.8)
    place(fx, crash(), 43.48, R * 1.1)
    for t in [43.48, 44.68, 45.9, 47.08]:
        place(fx, K, t, R * 1.8)
    # o acorde final do letreiro
    place(fx, riser(3.4, tone=False), 62.36 - 3.4, R * 1.2)
    place(fx, boom(2.8), 62.36, R * 2.6)
    place(fx, crash(3.2), 62.36, R * 1.0)
    y = low_boost(x, 3.0)
    return master(y + fx, -12.0)


def main():
    out = {}
    for name, fn in (('tech', tech), ('funk', funk), ('piano', piano)):
        y = fn()
        save(y, f'{name}-mix.mp3')
        out[name] = loud_rms(y)
        print(f'OK → musica/{name}-mix.mp3 ({len(y) / SR:.2f}s, pico {np.abs(y).max():.2f}, nível forte {20 * np.log10(out[name]):.1f} dBFS)')


if __name__ == '__main__':
    main()
