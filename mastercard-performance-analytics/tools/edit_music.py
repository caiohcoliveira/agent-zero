"""Remonta as faixas da v7 para a nova linha do tempo (musica/ fica fora do Git).

funk  ("Vintage Film Funk", 111 BPM) → musica/funk-edit.mp3 · play 2 (estações 01–03)
    A frase A de 16 compassos se repete uma vez: a estação 02 começa exatamente
    no recomeço da frase, a 03 começa no break e a síntese cai na saída da música.
tech  ("Technology", 108 BPM, compasso = 2,2222 s) → musica/tech-edit.mp3 · play 3
    Cada case tem 27 compassos (60 s): parte calma 11 → construção 5 → parte cheia 11,
    com o drop exatamente na SOLUÇÃO (35,56 s). No case de relatórios a construção
    perde os agudos ("retira elementos"), corta seco no interruptor (33,33 s), fica
    um compasso em silêncio e volta cheia no drop. No de agentes a construção dura
    11 compassos e o drop cai na ESCALA (48,89 s), depois que o ciclo foi explicado.
Os cortes caem em começos de compasso e são emendados com crossfade curto.
Uso: python3 tools/edit_music.py   (precisa de ffmpeg, numpy e scipy)
"""
import pathlib
import subprocess

import numpy as np
from scipy.signal import butter, sosfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 44100
XF = .06  # crossfade (s)

# (cena, início, fim[, opções]) em segundos da faixa original · ('cena', 'silence', duração)
FUNK = [
    ('s01', 0.0, 46.98),                     # intro + frase A (16 compassos)
    ('s02', 11.92, 55.56),                   # a frase A de novo, até o break
    ('s03', 55.56, 119.484),                 # break → parte B → saída (a síntese)
]
Q, QT, BT = (20.058, 37.836), (31.169, 37.836), (44.503, 55.614)   # calma (8) · fim da calma (3) · fim da construção (5)
TECH = [
    ('s04', 2.279, 13.390),
    ('banana', *Q), ('banana', *QT), ('banana', *BT), ('banana', 55.614, 80.058),
    ('manga', *Q), ('manga', *QT), ('manga', *BT), ('manga', 73.392, 97.836),
    ('lightsoff', *Q), ('lightsoff', *QT), ('lightsoff', 44.503, 53.392, {'sweep': True}),
    ('lightsoff', 'silence', 2.2222), ('lightsoff', 91.169, 115.614),
    ('insight', *Q), ('insight', *QT), ('insight', 37.836, 44.503), ('insight', 37.836, 55.614), ('insight', 108.947, 128.947),
    ('s05', 128.947, 148.951),
    ('s06', 148.951, 168.934), ('s06', 'silence', 4.461),
]
JOBS = {'funk': ('funk.mp3', 'funk-edit.mp3', FUNK), 'tech': ('tech.mp3', 'tech-edit.mp3', TECH)}


def load(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'musica' / name), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def save(x, name):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-b:a', '192k',
                    str(ROOT / 'musica' / name)], input=x.astype(np.float32).tobytes(), check=True)


def sweep(seg):
    """tira os agudos aos poucos e baixa o volume: a trilha 'esvazia' antes do interruptor"""
    lp = sosfilt(butter(4, 260, 'low', fs=SR, output='sos'), seg, axis=0).astype(np.float32)
    k = np.linspace(0, 1, len(seg), dtype=np.float32)[:, None] ** 1.3
    return (seg * (1 - k) + lp * k) * (1 - .45 * k)


def build(src, arr):
    x = load(src)
    n_xf = int(XF * SR)
    out = np.zeros((0, 2), dtype=np.float32)
    durs, cut, prev_sil = {}, False, False
    for item in arr:
        scene = item[0]
        if item[1] == 'silence':
            seg = np.zeros((int(round(item[2] * SR)) + n_xf, 2), dtype=np.float32)
            dur = item[2]
        else:
            a, b = item[1], item[2]
            opt = item[3] if len(item) > 3 else {}
            seg = x[int(round(a * SR)):int(round(b * SR)) + n_xf].copy()
            if len(seg) < int(round((b - a) * SR)) + n_xf:   # fim da faixa: completa com silêncio
                seg = np.vstack([seg, np.zeros((int(round((b - a) * SR)) + n_xf - len(seg), 2), dtype=np.float32)])
            if opt.get('sweep'):
                seg = sweep(seg)
                cut = True
            dur = b - a
        if len(out):
            if cut and item[1] == 'silence':      # corte seco: sem crossfade para o silêncio
                out[-n_xf:] *= np.linspace(1, 0, n_xf, dtype=np.float32)[:, None] ** 4
                seg = seg[n_xf:]
                cut = False
            elif prev_sil:                        # depois do silêncio a faixa entra inteira (o drop não amolece)
                out[-n_xf:] = seg[:n_xf]
                seg = seg[n_xf:]
            else:
                ramp = np.linspace(0, 1, n_xf, dtype=np.float32)[:, None]
                out[-n_xf:] = out[-n_xf:] * np.sqrt(1 - ramp) + seg[:n_xf] * np.sqrt(ramp)
                seg = seg[n_xf:]
        out = np.vstack([out, seg])
        prev_sil = item[1] == 'silence'
        durs[scene] = durs.get(scene, 0) + dur
    out = out[:-n_xf] if len(out) > n_xf else out
    tail = int(1.2 * SR)
    out[-tail:] *= np.linspace(1, 0, tail, dtype=np.float32)[:, None]
    return out, durs


def main():
    for job, (src, dst, arr) in JOBS.items():
        out, durs = build(src, arr)
        save(out, dst)
        print(f'OK → musica/{dst} ({len(out) / SR:.3f}s)')
        acc = 0
        for k, v in durs.items():
            print(f'  {k}: {v:.3f}s  (começa em {acc:.3f}s)')
            acc += v


if __name__ == '__main__':
    main()
