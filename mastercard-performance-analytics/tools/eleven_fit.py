"""Encaixa as músicas geradas na ElevenLabs nos tempos do filme (v7.4).

A ElevenLabs respeita o estilo e o andamento pedidos, mas não os tempos internos (onde cai o drop, a quebra
etc.). Aqui a música é encaixada no filme com cortes e repetições de compassos, filtros e as camadas de
tools/remix.py (riser, impacto, prato).

Fontes, fora do Git (musica/elevenlabs/):
  parte1-bruta.mp3     fluxo "A Linha · Parte 1", versão 2 (funk cinematográfico, 111 BPM)
  parte2-bruta.mp3     fluxo "A Linha · Partes 2 e 3", peça contínua, versão 2 (108 BPM)
  parte3-sem-coro.wav  fluxo "A Linha · Partes 2 e 3", final épico opção A, sem o coro:
                       python -m demucs --two-stems=vocals -n htdemucs_ft parte3-bruta-A.mp3 → no_vocals.wav
Saídas (o build embute no HTML): musica/parte1.mp3 · musica/parte2.mp3 · musica/parte3.mp3

Parte 1 (estações 01–03, 154,544 s): andamento ajustado 0,95% para a grade das cenas (110 BPM); o drop da
  música cai na parte B (as viradas de estação 46,98 · 90,62 · 143,0 ficam em começos de compasso); intro
  abafada até o tema; low só com médios de 90,62 até a pausa; riser, impacto e pratos.
Parte 2 (04, cases, 05, 06: 304,45 s, 108 BPM, grade a partir de 0): uma peça só, montada com trechos dela mesma
  (PARTE2_MAPA, v7.5): antes de cada solução, um trecho leve da própria música e a banda voltando (drops naturais,
  sem filtros); a automação para seco no interruptor (164,444 → 166,667); a IA leva o trecho mais forte; 05/06
  terminam com o final da própria peça.
Parte 3 (07, disciplinas, letreiro: 72,0 s, 100 BPM): a opção A tocada inteira, sem cortes (v7.5): a gravação
  original até pouco antes do coro e a versão sem coro depois; o filme acerta o letreiro no acento da música.

Uso: python3 tools/eleven_fit.py [parte1|parte2|parte3|todas] [pasta_de_saida]
"""
import importlib.util
import json
import pathlib
import subprocess
import sys

import numpy as np
from scipy.signal import fftconvolve, sosfiltfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'musica' / 'elevenlabs'
_spec = importlib.util.spec_from_file_location('remix', ROOT / 'tools' / 'remix.py')
R = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(R)
SR = R.SR


# ---------------------------------------------------------------- utilidades
def load(path, tempo=None):
    af = ['-af', f'rubberband=tempo={tempo:.6f}'] if tempo and abs(tempo - 1) > 1e-4 else []
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), *af, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def save(y, out):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-b:a', '192k', str(out)],
                   input=y.astype(np.float32).tobytes(), check=True)


def bpm_near(x, expect):
    """andamento preciso perto do esperado: período da batida (±20%) e refinamento em 8 batidas"""
    import librosa
    m = x.mean(1)[int(6 * SR):int((len(x) / SR - 3) * SR)]
    oe = librosa.onset.onset_strength(y=m, sr=SR, hop_length=128); oe = oe - oe.mean(); fr = SR / 128
    ac = np.correlate(oe, oe, 'full')[len(oe) - 1:]

    def peak(lo, hi):
        i0, i1 = max(2, int(lo * fr)), int(hi * fr); k = i0 + np.argmax(ac[i0:i1]); y0, y1, y2 = ac[k - 1], ac[k], ac[k + 1]
        return (k + .5 * (y0 - y2) / (y0 - 2 * y1 + y2)) / fr
    t1 = peak(60 / expect / 1.2, 60 / expect * 1.2)
    return 60 * 8 / peak(8 * t1 * .985, 8 * t1 * 1.015)


def env(x, w=.05):
    m = x.mean(1) if x.ndim == 2 else x; hop = int(w * SR); n = len(m) // hop
    r = np.sqrt(np.mean(m[:n * hop].reshape(n, hop) ** 2, axis=1)); return np.arange(n) * hop / SR, 20 * np.log10(np.maximum(r, 1e-7))


def seg(x, a, b): return x[int(a * SR):int(b * SR)]


def xcat(parts, xf=.05):
    out = parts[0]
    for p in parts[1:]:
        n = min(int(xf * SR), len(out), len(p)); w = np.linspace(0, 1, n)[:, None]
        out = np.concatenate([out[:len(out) - n], out[len(out) - n:] * (1 - w) + p[:n] * w, p[n:]])
    return out


def fit_len(x, dur): return np.concatenate([x, np.zeros((max(0, int(dur * SR) - len(x)), 2), np.float32)])[:int(dur * SR)]


def bar_phase(x, bar, lo=4.0):
    """fase do tempo forte: ataques de grave (<150 Hz) dobrados no período do compasso"""
    m = sosfiltfilt(R.sos('low', 150), x.mean(1)); hop = 256; n = len(m) // hop
    e = np.sqrt(np.mean(m[:n * hop].reshape(n, hop) ** 2, axis=1)); f = np.maximum(0, np.diff(e, prepend=e[0]))
    t = np.arange(n) * hop / SR; sel = (t > lo) & (t < t[-1] - 2)
    return (np.angle(np.sum(f[sel] ** 2 * np.exp(2j * np.pi * t[sel] / bar))) / (2 * np.pi) * bar) % bar


def music_end(x, after=10.0):
    t, db = env(x, .1); ref = np.median(db[t > 3]); ok = np.where((db > ref - 14) & (t > after))[0]
    return float(t[ok[-1]]) + .1 if len(ok) else len(x) / SR


def find_rise(x, lo, hi):
    """maior subida sustentada (3 s depois − 3 s antes) entre lo e hi; o instante é o 1º ataque de grave dela"""
    t, db = env(x); best, bt = -1e9, None
    for i in np.where((t > lo) & (t < hi))[0]:
        a = db[(t >= t[i] - 3) & (t < t[i])]; b = db[(t >= t[i]) & (t < t[i] + 3)]
        if len(a) and len(b) and b.mean() - a.mean() > best: best, bt = b.mean() - a.mean(), t[i]
    t5, d5 = env(x, .005); w = (t5 > bt - .3) & (t5 < bt + .3)
    at = float(t5[w][np.argmax(np.diff(d5[w], prepend=d5[w][0]))])
    lo_ = sosfiltfilt(R.sos('low', 150), x.mean(1)[int((at - .2) * SR):int((at + .3) * SR)]); hop = 64; n = len(lo_) // hop
    e = np.sqrt(np.mean(lo_[:n * hop].reshape(n, hop) ** 2, axis=1)); f = np.maximum(0, np.diff(e, prepend=e[0]))
    if f.max() > 0: at = at - .2 + int(np.argmax(f > .5 * f.max())) * hop / SR
    return at, float(best)


def lowpass_open(x, t0, t1, f0=500, f1=1800, gain_db=-4):
    """trecho abafado que abre até t1 (passa-baixa f0 → f1 → aberto)"""
    i0, i1 = int(t0 * SR), int(t1 * SR); s = x[i0:i1]
    l1, l2 = sosfiltfilt(R.sos('low', f0), s, axis=0), sosfiltfilt(R.sos('low', f1), s, axis=0)
    u = np.linspace(0, 1, len(s))[:, None]
    a = np.clip(1 - u / .55, 0, 1); b = np.clip(1 - np.abs(u - .55) / .45, 0, 1); c = np.clip((u - .55) / .45, 0, 1)
    x[i0:i1] = (l1 * a + l2 * b + s * c) * (10 ** (gain_db / 20) + (1 - 10 ** (gain_db / 20)) * u ** 2)


def soften(x, t0, t1, fc=2800, gain_db=-4.5, ramp=.4):
    """parte calma: mais escura e mais baixa, com rampas nas bordas"""
    i0, i1 = int(t0 * SR), int(t1 * SR); s = x[i0:i1]; n = len(s)
    lp = sosfiltfilt(R.sos('low', fc), s, axis=0) * 10 ** (gain_db / 20); r = min(int(ramp * SR), n // 2)
    k = np.ones(n); k[:r] = np.linspace(0, 1, r); k[n - r:] = np.linspace(1, 0, r)
    x[i0:i1] = s * (1 - k[:, None]) + lp * k[:, None]


# ---------------------------------------------------------------- parte 1 · estações 01–03
def parte1(src=SRC / 'parte1-bruta.mp3'):
    DUR, T_A, T_A2, T_LOW, T_DROP, T_OUT, GRID = 154.544, 11.92, 46.98, 90.62, 106.04, 143.0, 110.0
    x0 = load(src); bpm = bpm_near(x0, 111); tempo = GRID / bpm; x = load(src, tempo)
    t, db = env(x)
    ref = np.median(db[(t > 60) & (t < 100)])
    q = np.where((t > 95) & (t < 120) & (db < ref - 15))[0]          # a pausa antes do drop
    runs = np.split(q, np.where(np.diff(q) > 2)[0] + 1); run = max(runs, key=len)
    g0, k = t[run[0]], run[-1]
    while db[k] < ref - 8: k += 1
    t5, d5 = env(x, .005); w = (t5 > t[k] - .25) & (t5 < t[k] + .15)
    drop_src = t5[w][np.argmax(np.diff(d5[w], prepend=d5[w][0]))]
    # o drop é tempo forte: escolhe o instante dele (perto de 106,04) que põe as viradas de estação em começos de compasso
    BAR = 4 * 60 / GRID
    cands = np.linspace(T_DROP - BAR / 2, T_DROP + BAR / 2, 4001)
    err = [np.sum((((np.array([T_A2, T_LOW, T_OUT]) - c) + BAR / 2) % BAR - BAR / 2) ** 2) for c in cands]
    D = float(cands[int(np.argmin(err))]); T_A = D - round((D - T_A) / BAR) * BAR
    off = drop_src - D
    x = x[int(off * SR):] if off > 0 else np.concatenate([np.zeros((int(-off * SR), 2), np.float32), x])
    x = fit_len(x, DUR); gap0 = g0 - off
    # intro abafada (400 Hz → 1,6 kHz → aberto) até o tema
    lowpass_open(x, 0, T_A, f0=400, f1=1600)
    # low: de 90,62 até a pausa, só os médios (sem bumbo e sem grave)
    j0, j1 = int(T_LOW * SR), int(gap0 * SR); s = x[j0:j1]
    bp = sosfiltfilt(R.sos('low', 3400), sosfiltfilt(R.sos('high', 210), s, axis=0), axis=0) * 10 ** (1.5 / 20)
    fade = np.clip(np.arange(len(s)) / (.35 * SR), 0, 1)[:, None]; x[j0:j1] = s * (1 - fade) + bp * fade
    L = R.loud_rms(x); fx = np.zeros_like(x)
    R.place(fx, R.riser(4.36), D - 4.36, L * 1.4); R.place(fx, R.boom(), D, L * 2.4); R.place(fx, R.crash(), D, L * 1.0)
    for tc in (T_A2, T_LOW, T_OUT): R.place(fx, R.crash(2.2), tc, L * .75)
    y = R.presence(R.low_boost(x, 4.0), 1.5) + fx
    k0 = int((DUR - 1.2) * SR); y[k0:] *= np.linspace(1, 0, len(y) - k0)[:, None]
    info = {'bpm_da_versao': round(bpm, 2), 'ajuste_de_andamento': round(tempo, 5), 'drop': round(D, 3), 'tema_entra': round(float(T_A), 3),
            'pausa_antes_do_drop': [round(float(gap0), 2), round(D, 3)], 'grade': [GRID, round(D, 3)]}
    return R.master(y, -11.5), info


# ---------------------------------------------------------------- parte 2 · 04, cases, 05, 06
# (compasso do filme → compassos da versão): só trechos da própria música, cortes em começos de compasso
# (quase sempre de frase) e nenhum filtro. Leve = sem baixo nem bateria cheia; D1/D2 = onde a banda volta.
#   versão: compassos 0–8 introdução leve → D1 no 8 · 8–80 groove · 80–88 quebra leve → D2 no 88 · 88–136 groove
#   (o trecho mais forte começa no 108) e o final da própria peça no 136
PARTE2_MAPA = [            # (início no filme, fim no filme, início na versão), em compassos
    (0, 5, 3),             # estação 04: fim da introdução leve, crescendo…
    (5, 13, 8),            # case 1 começa com a banda entrando (D1)
    (13, 21, 80),          # a quebra leve da própria música (como fizemos)…
    (21, 41, 88),          # …e a banda volta na SOLUÇÃO do case 1 (D2)
    (41, 48, 1),           # case 2: textura leve da introdução…
    (48, 52, 8),           # …a banda volta na SOLUÇÃO (D1)
    (52, 68, 28),          # automação: groove
    (68, 75, 1),           # textura leve; o último compasso vira silêncio (o interruptor)
    (75, 79, 8),           # a banda volta no neon (D1)
    (79, 103, 44),         # IA: groove
    (103, 108, 83),        # a quebra leve…
    (108, 112, 88),        # …a banda volta na ESCALA (D2)…
    (112, 117, 108),       # …e o trecho mais forte da peça (o pico da apresentação)
    (117, 137, 116),       # 05/06: os últimos 20 compassos, com o final da própria peça (transição de 1 compasso)
]


def parte2(src=SRC / 'parte2-bruta.mp3'):
    BAR = 4 * 60 / 108.0; DUR = 304.45
    x = load(src); bpm = bpm_near(x, 108); info = {'bpm': round(bpm, 2)}
    if abs(bpm / 108 - 1) > .002: x = load(src, 108 / bpm); info['ajuste_de_andamento'] = round(108 / bpm, 4)
    d1, r1 = find_rise(x, 12, 24); d2, r2 = find_rise(x, 188, 200)
    ph = d1 - 8 * BAR                                     # a peça começa num tempo forte: D1 é o compasso 8
    info.update(fase=round(ph, 3), D1=round(d1, 3), D2=round(d2, 3), D2_no_compasso=round((d2 - ph) / BAR, 2))
    S = lambda b: ph + b * BAR                            # compasso da versão → segundos
    # trechos contíguos na versão viram um trecho só (sem emenda onde a música já é contínua)
    mapa = []
    for f0, f1, s0 in PARTE2_MAPA:
        if mapa and mapa[-1][2] + (mapa[-1][1] - mapa[-1][0]) == s0: mapa[-1] = (mapa[-1][0], f1, mapa[-1][2])
        else: mapa.append((f0, f1, s0))
    info['emendas'] = [f0 for f0, _, _ in mapa[1:]]
    y = np.zeros((int(DUR * SR) + SR, 2), np.float32)
    for k, (f0, f1, s0) in enumerate(mapa):
        # emenda curta: cruzamento linear de 30 ms (soma 1, sem salto); para a 05/06, 1 compasso de potência igual
        xi = (BAR if f0 == 117 else .03) if k else 0.0
        xo = (BAR if k + 1 < len(mapa) and mapa[k + 1][0] == 117 else .03) if k < len(mapa) - 1 else 0.0
        a, b = S(s0) - xi / 2, S(s0 + f1 - f0) + xo / 2
        seg_ = seg(x, a, b).copy(); n = len(seg_)
        if xi: m = int(xi * SR); u = np.linspace(0, 1, m); seg_[:m] *= (np.sin(u * np.pi / 2) if xi > .1 else u)[:, None]
        if xo: m = int(xo * SR); u = np.linspace(0, 1, m); seg_[n - m:] *= (np.cos(u * np.pi / 2) if xo > .1 else 1 - u)[:, None]
        i0 = int((f0 * BAR - xi / 2) * SR); y[i0:i0 + n] += seg_[:len(y) - i0]
    y = y[:int(DUR * SR)]
    # o interruptor: corta seco no compasso 74 e a banda volta no 75 (a música da automação)
    i0, i1 = int(74 * BAR * SR), int(75 * BAR * SR); f = int(.012 * SR)
    y[i0:i0 + f] *= np.linspace(1, 0, f)[:, None]; y[i0 + f:i1] = 0
    # um pouco mais de presença no pico (IA) e menos no fim, em rampas lentas (mixagem, não efeito)
    g = np.ones(len(y)); P = [(0, 0.0), (108 * BAR, 1.0), (117 * BAR, -.5)]
    for (ta, ga), (tb, _) in zip(P, P[1:] + [(DUR, 0)]): g[int(ta * SR):int(tb * SR)] = 10 ** (ga / 20)
    g = np.convolve(g, np.ones(int(2 * SR)) / int(2 * SR), 'same'); y *= g[:, None]
    k0 = int((DUR - .3) * SR); y[k0:] *= np.linspace(1, 0, len(y) - k0)[:, None]
    info['grade'] = [108.0, 0.0]
    return R.master(y, -11.5), info


# ---------------------------------------------------------------- parte 3 · 07, disciplinas, letreiro
def parte3(dur=72.0):
    """a opção A tocada inteira, do jeito que foi composta (sem cortes, repetições ou cauda): a gravação original
    até pouco antes do coro e, dali em diante, a versão sem coro (Demucs), alinhada à amostra e cruzada em 1 s"""
    import librosa
    o = load(SRC / 'parte3-bruta-A.mp3'); n = load(SRC / 'parte3-sem-coro.wav')
    a, b = o[int(30 * SR):int(44 * SR)].mean(1), n[int(29.9 * SR):int(44.1 * SR)].mean(1)
    lag = int(np.argmax(fftconvolve(b, a[::-1], 'valid'))) - int(.1 * SR)          # o Demucs devolve ~23 ms atrasado
    n = n[lag:]; m = min(len(o), len(n)); o, n = o[:m], n[:m]
    # onde o coro entra: a diferença entre original e sem coro passa de −12 dB do sinal
    t, do = env(o, .5); _, dd = env(o - n, .5); onset = float(t[np.where((t > 20) & (dd - do > -12))[0][0]])
    t1 = onset - .5; t0 = t1 - 1.0; i0, i1 = int(t0 * SR), int(t1 * SR)
    w = np.sin(np.linspace(0, np.pi / 2, i1 - i0))[:, None]
    y = np.concatenate([o[:i0], o[i0:i1] * w[::-1] + n[i0:i1] * w, n[i1:]])
    y = fit_len(y, dur); k0 = int((dur - .5) * SR); y[k0:] *= np.linspace(1, 0, len(y) - k0)[:, None]
    # para a sincronia do filme: a entrada da orquestra, a fase da batida e o acento mais forte perto do letreiro
    E, rise = find_rise(y, 22, 34)
    oe = librosa.onset.onset_strength(y=y.mean(1), sr=SR, hop_length=128); to = np.arange(len(oe)) * 128 / SR
    sel = (to > 26) & (to < 45); z = np.sum(oe[sel] ** 2 * np.exp(2j * np.pi * to[sel] / .6)); ph = (np.angle(z) / (2 * np.pi) * .6) % .6
    anchor = ph + round((E - ph) / .6) * .6
    pk = librosa.util.peak_pick(oe, pre_max=40, post_max=40, pre_avg=150, post_avg=150, delta=oe.std(), wait=60)
    near = [p for p in pk if 57.5 < to[p] < 62.5]; acc = float(to[max(near, key=lambda p: oe[p])]) if near else 59.68
    info = {'atraso_do_sem_coro_amostras': lag, 'coro_entra': round(onset, 2), 'troca_para_sem_coro': [round(t0, 2), round(t1, 2)],
            'entrada_da_orquestra': round(E, 2), 'subida_db': round(rise, 1), 'grade': [100.0, round(anchor, 3)], 'acento_do_letreiro': round(acc, 2)}
    return R.master(y, -11.0), info


def main():
    which = sys.argv[1] if len(sys.argv) > 1 else 'todas'
    out_dir = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / 'musica'
    jobs = {'parte1': parte1, 'parte2': parte2, 'parte3': parte3}
    for name, fn in jobs.items():
        if which not in ('todas', name):
            continue
        y, info = fn(); save(y, out_dir / f'{name}.mp3')
        print(name, json.dumps(info, ensure_ascii=False))


if __name__ == '__main__':
    main()
