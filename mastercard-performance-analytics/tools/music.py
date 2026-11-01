"""Analisa as faixas de musica/ e gera src/07-beats.js.

O arquivo gerado tem, para cada faixa:
- a grade de batidas (beats) e de compassos (down);
- envelopes a 50 Hz de grave (kick), ataque médio/agudo (snare), nível do grave (low) e nível geral (level),
  quantizados em 0–255 e codificados em base64;
- os picos mais fortes (hits) e as mudanças de seção (sections).

O vídeo usa esses dados para a câmera, as cores e os elementos reagirem à música.
Requer librosa (rode com um Python que tenha librosa instalado):
    python tools/music.py
"""
import base64
import json
import pathlib

import librosa
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
TRACKS = {'funk': 'musica/funk.mp3', 'tech': 'musica/tech-edit.mp3', 'piano': 'musica/piano.mp3'}
SR, FPS = 22050, 50
HOP = SR // FPS  # 441 amostras = 20 ms


def norm(v, pct=97):
    v = np.maximum(v, 0)
    top = np.percentile(v, pct) or 1.0
    return np.clip(v / top, 0, 1)


def b64(v):
    return base64.b64encode(np.round(np.clip(v, 0, 1) * 255).astype(np.uint8).tobytes()).decode()


def band(S, freqs, lo, hi):
    return S[(freqs >= lo) & (freqs < hi)].sum(axis=0)


def analyze(path):
    y, sr = librosa.load(path, sr=SR, mono=True)
    dur = len(y) / sr
    onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=HOP)
    tempo, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=HOP, units='frames')
    bt = librosa.frames_to_time(beats, sr=sr, hop_length=HOP)
    # grade regular quando o andamento é estável (sem tremor de detecção na animação)
    i = np.arange(len(bt))
    a, b = np.polyfit(i, bt, 1)
    if np.std(bt - (a * i + b)) < .03:
        bt = a * i + b
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=HOP))
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
    low = np.log1p(band(S, freqs, 30, 150))
    mid = np.log1p(band(S, freqs, 150, 2500))
    high = np.log1p(band(S, freqs, 2500, 9000))
    flux = lambda v: np.maximum(np.diff(v, prepend=v[0]), 0)
    kick = norm(flux(low))
    snare = norm(flux(mid) * .6 + flux(high) * .4)
    lowlvl = norm(low - np.percentile(low, 5), 99)
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=HOP)[0]
    level = norm(rms, 99)
    # compasso: fase (0–3) com mais grave nos tempos
    bf = np.clip(librosa.time_to_frames(bt, sr=sr, hop_length=HOP), 0, len(low) - 1)
    phase = int(np.argmax([low[bf[p::4]].mean() if len(bf[p::4]) else 0 for p in range(4)]))
    down = bt[phase::4]
    # picos fortes (hits) com espaçamento mínimo de 0,25 s
    on = norm(onset)
    peaks = librosa.util.peak_pick(on, pre_max=6, post_max=6, pre_avg=12, post_avg=12, delta=.18, wait=12)
    hits = [[round(float(librosa.frames_to_time(p, sr=sr, hop_length=HOP)), 3), round(float(on[p]), 2)] for p in peaks if on[p] > .45]
    # mudanças de seção (para viradas de cor e de câmera)
    dbf = np.clip(librosa.time_to_frames(down, sr=sr, hop_length=HOP), 0, S.shape[1] - 1)
    mf = librosa.feature.mfcc(y=y, sr=sr, hop_length=HOP, n_mfcc=13)
    ch = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=HOP)
    feat = np.vstack([librosa.util.sync(mf, dbf), librosa.util.sync(ch, dbf)])
    k = int(np.clip(round(dur / 25), 4, 9))
    sections = sorted({round(float(down[min(x, len(down) - 1)]), 3) for x in librosa.segment.agglomerative(feat, k)})
    return {
        'dur': round(dur, 3), 'bpm': round(float(60 / np.median(np.diff(bt))), 2), 'fps': FPS,
        'beats': [round(float(t), 3) for t in bt], 'down': [round(float(t), 3) for t in down],
        'hits': hits, 'sections': sections,
        'env': {'kick': b64(kick), 'snare': b64(snare), 'low': b64(lowlvl), 'level': b64(level)},
    }


def main():
    out = {k: analyze(ROOT / p) for k, p in TRACKS.items()}
    js = ('/* ============================================================================\n'
          '   7. BATIDAS — gerado por tools/music.py a partir de musica/ (não editar à mão)\n'
          '   Grade de batidas e compassos, envelopes a 50 Hz (base64, 0–255), picos e seções.\n'
          '   ========================================================================== */\n'
          'const BEATS = ' + json.dumps(out, separators=(',', ':')) + ';\n')
    (ROOT / 'src/07-beats.js').write_text(js, encoding='utf-8')
    for k, v in out.items():
        print(f"{k}: {v['dur']}s · {v['bpm']} BPM · {len(v['beats'])} batidas · {len(v['hits'])} picos · seções {v['sections']}")


if __name__ == '__main__':
    main()
