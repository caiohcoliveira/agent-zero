"""Remonta a faixa "Technology" (musica/tech.mp3) para a estação 04.

Cada case ganha: parte calma (problema e dados) → construção (como fizemos)
→ parte cheia (a solução entra no "drop" e o impacto fica no clímax).
Os cortes caem em começos de compasso (108 BPM, compasso = 2,2222 s) e são
emendados com crossfade. Saída: musica/tech-edit.mp3 (fora do Git).
Uso: <python com numpy> tools/edit_tech.py
"""
import pathlib
import subprocess

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 44100
Q = (20.058, 37.836)      # parte calma (8 compassos)
B = (37.836, 55.614)      # construção (8 compassos)
ARR = [                    # (cena, início, fim) em segundos da faixa original
    ('s04', 2.279, 11.168),
    ('banana', *Q), ('banana', *B), ('banana', 55.614, 73.392),
    ('manga', *Q), ('manga', *B), ('manga', 73.392, 91.169),
    ('lightsoff', *Q), ('lightsoff', *B), ('lightsoff', 91.169, 108.947),
    ('insight', *Q), ('insight', *B), ('insight', 108.947, 135.614),
    ('s05', 135.614, 148.951),
    ('s06', 148.951, 168.934),
]
XF = .06  # crossfade (s)


def main():
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'musica/tech.mp3'), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
    n_xf = int(XF * SR)
    out = np.zeros((0, 2), dtype=np.float32)
    durs = {}
    for scene, a, b in ARR:
        seg = x[int(a * SR):int(b * SR) + n_xf].copy()
        if len(out):
            ramp = np.linspace(0, 1, n_xf, dtype=np.float32)[:, None]
            out[-n_xf:] = out[-n_xf:] * np.sqrt(1 - ramp) + seg[:n_xf] * np.sqrt(ramp)
            seg = seg[n_xf:]
        out = np.vstack([out, seg])
        durs[scene] = durs.get(scene, 0) + (b - a)
    out = out[:-n_xf] if len(out) > n_xf else out
    tail = int(1.5 * SR)
    out[-tail:] *= np.linspace(1, 0, tail, dtype=np.float32)[:, None]
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-b:a', '192k',
                    str(ROOT / 'musica/tech-edit.mp3')], input=out.tobytes(), check=True)
    print(f'OK → musica/tech-edit.mp3 ({len(out) / SR:.3f}s)')
    for k, v in durs.items():
        print(f'  {k}: {v:.3f}s')


if __name__ == '__main__':
    main()
