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
Parte 2 (04, cases, 05, 06: 304,45 s, 108 BPM, grade a partir de 0): uma peça só. O trecho mais intenso vai
  para o drop da IA (240,0); cada case tem parte calma, construção e impacto na solução; a automação para
  seco no interruptor (164,444 → 166,667); 05/06 voltam ao groove de abertura da própria peça (transição de
  1 compasso) e terminam na cadência dela.
Parte 3 (07, disciplinas, letreiro: 72,0 s, 100 BPM): a entrada da orquestra cai na frase-chave (40,78)
  repetindo compassos da introdução; compassos tirados do meio levam o acorde final para perto do letreiro;
  o acorde soa até o fim com uma cauda de reverberação.

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
def parte2(src=SRC / 'parte2-bruta.mp3'):
    BAR = 4 * 60 / 108.0; PHR = 4 * BAR; DUR = 304.45
    CASES = [(11.111, 46.667, 71.111), (71.111, 106.667, 131.111), (131.111, 166.667, 191.112), (191.112, 240.0, 260.001)]
    x = load(src); bpm = bpm_near(x, 108); info = {'bpm': round(bpm, 2)}
    if abs(bpm / 108 - 1) > .002: x = load(src, 108 / bpm); info['ajuste_de_andamento'] = round(108 / bpm, 4)
    ph = bar_phase(x, BAR); x = x[int(ph * SR):]; end = music_end(x, 60); B0, end0 = x.copy(), end
    # clímax: o trecho de 20 s mais intenso (energia + brilho) depois de 150 s, se for claramente mais intenso
    t, db = env(x, .1); hp = sosfiltfilt(R.sos('high', 2500), x.mean(1)); _, dh = env(hp, .1)
    nwin = int(20 / .1); s = np.convolve(db + .5 * dh[:len(db)], np.ones(nwin) / nwin, 'valid'); t = t[:len(s)]
    ok = (t > 150) & (t < end - 25); c = round(float(t[ok][np.argmax(s[ok])]) / BAR) * BAR
    contrast = float(s[ok].max() - np.median(s[(t > 5) & (t < end - 25)]))
    d_bars = int(round((240.0 - c) / BAR)) if contrast >= 1.5 else 0
    if d_bars > 0:                                    # clímax cedo: repete compassos antes dele
        a = c - 2 * PHR; x = xcat([seg(x, 0, a), seg(x, a - d_bars * BAR, a), seg(x, a, len(x) / SR)], .04)
    elif d_bars < 0:                                  # clímax tarde: tira compassos antes dele
        a = c - 2 * PHR + d_bars * BAR; x = xcat([seg(x, 0, a), seg(x, a - d_bars * BAR, len(x) / SR)], .04)
    info.update(climax_na_versao=round(c, 2), contraste_db=round(contrast, 2), compassos_movidos=d_bars)
    # 05/06: 2 compassos depois do clímax, 1 compasso de transição de volta ao groove de abertura da peça, cadência final dela
    a = 118 * BAR; head = x[:int((a + BAR) * SR)]
    last = np.floor(end0 / BAR) * BAR; tail_ = seg(B0, last - 2 * BAR, min(end0, last + 1.6))
    n = int(round((DUR - a - 2 * BAR - 1.6) / BAR)); rep = seg(B0, 5 * BAR, (5 + n) * BAR)
    k = int(BAR * SR); w = np.sin(np.linspace(0, np.pi / 2, k))[:, None]
    x = xcat([np.concatenate([head[:-k], head[-k:] * w[::-1] + rep[:k] * w, rep[k:]]), tail_], .05)
    x = fit_len(x, DUR); info['reprise_compassos'] = n
    # dinâmica do filme dentro da mesma música
    lowpass_open(x, 0, 11.111)
    for i, (s0, drop, e) in enumerate(CASES):
        soften(x, s0 + .2, drop - 11.1, fc=3200, gain_db=-3.5)
        R.hp_sweep(x, drop - 7.0 if i != 2 else s0 + 24.444, drop - .1 if i != 2 else 164.444, .6)
    R.gap(x, 166.667, 2.222)                          # automação: o interruptor corta seco
    R.gap(x, 240.0, .27)                              # IA: respiro curto antes do clímax
    i0, i1 = int(258.0 * SR), int(DUR * SR); s_ = x[i0:i1]   # 05/06 assentam (2 compassos de transição)
    lp = sosfiltfilt(R.sos('low', 5000), s_, axis=0) * 10 ** (-2.5 / 20)
    w = np.clip((np.arange(len(s_)) / SR) / (2 * BAR), 0, 1)[:, None]; x[i0:i1] = s_ * (1 - w) + lp * w
    g = np.ones(len(x)); P = [(0, -1.2), (71.111, -.6), (131.111, 0), (191.112, .8), (260.001, -1.0)]   # sobe até a IA e assenta
    for (ta, ga), (tb, _) in zip(P, P[1:] + [(DUR, 0)]): g[int(ta * SR):int(tb * SR)] = 10 ** (ga / 20)
    g = np.convolve(g, np.ones(int(.8 * SR)) / int(.8 * SR), 'same'); x *= g[:, None]
    L = R.loud_rms(x); fx = np.zeros_like(x)
    for i, (s0, drop, e) in enumerate(CASES):
        R.place(fx, R.riser(4.4), (164.444 if i == 2 else drop) - 4.4, L * (1.1 if i < 3 else 1.3))
        R.place(fx, R.boom(), drop, L * (1.6 if i < 3 else 2.0)); R.place(fx, R.crash(), drop, L * .8)
        if i: R.place(fx, R.crash(2.2), s0, L * .45)
    y = R.presence(R.low_boost(x, 1.5), .8) + fx
    tt, dd = env(x, .1); fade = 1.0 if dd[tt > DUR - 3].mean() < np.median(dd[tt > 5]) - 8 else 4.0
    k0 = int((DUR - fade) * SR); y[k0:] *= (np.linspace(1, 0, len(y) - k0) ** 1.5)[:, None]
    info['grade'] = [108.0, 0.0]
    return R.master(y, -11.5), info


# ---------------------------------------------------------------- parte 3 · 07, disciplinas, letreiro
def parte3(src=SRC / 'parte3-sem-coro.wav', dur=72.0, hit=40.78, chord=59.68):
    import librosa
    BAR = 4 * 60 / 100.0; x = load(src)
    E, rise = find_rise(x, 22, 34); end = music_end(x, 40)
    oe = librosa.onset.onset_strength(y=x.mean(1), sr=SR, hop_length=441); to = np.arange(len(oe)) * .01
    pk = [p for p in librosa.util.peak_pick(oe, pre_max=10, post_max=10, pre_avg=50, post_avg=50, delta=oe.std(), wait=30) if end - 8 < to[p] < end]
    C = float(to[max(pk, key=lambda p: oe[p])]) if pk else end - 4
    # a entrada da orquestra na frase-chave: repete compassos da introdução e apara o início
    n_in = int(np.ceil((hit - E) / BAR)); j = E % BAR + 2 * BAR
    x = xcat([seg(x, 0, j + n_in * BAR), seg(x, j, len(x) / SR)]); trim = E + n_in * BAR - hit
    x = x[int(trim * SR):]; Cx, endx = C + n_in * BAR - trim, end + n_in * BAR - trim
    # o acorde final perto do letreiro: tira compassos inteiros do meio (cai no alvo ou até 1 compasso depois)
    n_cut = max(0, int(np.floor((Cx - chord) / BAR)))
    if n_cut:
        a = hit + 4 * BAR; x = xcat([seg(x, 0, a), seg(x, a + n_cut * BAR, len(x) / SR)], .08); Cx -= n_cut * BAR; endx -= n_cut * BAR
    # o acorde soa até o fim: reverberação longa do próprio acorde, no nível dele
    x = x[:int(min(endx, dur - .5) * SR)]
    n_ir = int(10.0 * SR); ir = np.random.default_rng(7).standard_normal(n_ir) * np.exp(-np.arange(n_ir) / SR * .5)
    src_c = seg(x, Cx, min(Cx + 1.6, len(x) / SR))
    wet = np.stack([fftconvolve(src_c[:, c], ir)[:int((dur - Cx) * SR)] for c in (0, 1)], 1)
    i0, a1, b1 = int(Cx * SR), int(1.2 * SR), int(1.8 * SR)
    lvl = np.sqrt(np.mean(x[i0 + a1:i0 + b1] ** 2)) + 1e-9; wet *= .8 * lvl / (np.sqrt(np.mean(wet[a1:b1] ** 2)) + 1e-9)
    y = fit_len(x, dur); m = min(len(wet), len(y) - i0); ramp = np.clip((np.arange(m) - a1) / (1.5 * SR), 0, 1)[:, None]
    y[i0:i0 + m] = y[i0:i0 + m] * (1 - .5 * ramp) + wet[:m] * ramp
    k0 = int((dur - 2.0) * SR); y[k0:] *= np.linspace(1, 0, len(y) - k0)[:, None] ** 1.5
    info = {'entrada_da_orquestra_na_versao': round(E, 2), 'subida_db': round(rise, 1), 'compassos_repetidos_na_intro': n_in,
            'apara_inicio': round(trim, 2), 'compassos_tirados_do_meio': n_cut, 'acorde_final': round(Cx, 2), 'grade': [100.0, hit]}
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
