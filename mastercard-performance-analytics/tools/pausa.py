"""Música das conversas (v7.16): escolhe o trecho que se repete e instala a faixa em musica/pausa.mp3.

A faixa é uma das gerações da ElevenLabs no fluxo "A Linha · Música das conversas" (balada pop original com
violino no lugar da voz; fica fora do Git, em musica/elevenlabs/pausa/). Ela não é editada: o player repete o
trecho [início, fim) com uma transição curta entre as voltas (CONFIG.audio.pause, src/08-music.js).

O trecho é escolhido na grade de tempos da faixa (andamento fixo da geração):
- começa depois da introdução e termina antes do final (que tem fade);
- tem um número inteiro de frases (múltiplo de 16 tempos) e pelo menos 60 s, para a repetição não chamar atenção;
- as duas pontas se parecem (harmonia e timbre dos 8 tempos antes e dos 8 tempos depois de cada ponta) e têm o
  mesmo nível, então a volta soa como a música seguindo.

Uso: python tools/pausa.py [musica/elevenlabs/pausa/take4.mp3]   (precisa de librosa)
     → copia a faixa para musica/pausa.mp3 e imprime o loop para colar em CONFIG.audio.pause.loop
"""
import pathlib
import shutil
import sys

import librosa
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEFAULT = ROOT / 'musica' / 'elevenlabs' / 'pausa' / 'take4.mp3'


def loop_points(path):
    y, sr = librosa.load(path, sr=22050, mono=True)
    hop, dur = 512, len(y) / 22050
    onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    _, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=hop, tightness=400)
    bt = librosa.frames_to_time(beats, sr=sr, hop_length=hop)
    i = np.arange(len(bt))
    per, b0 = np.polyfit(i, bt, 1)                       # grade regular: a geração tem andamento fixo
    grid = b0 + per * i
    frames = np.clip(librosa.time_to_frames(grid, sr=sr, hop_length=hop), 0, None)
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, hop_length=hop, n_mfcc=13)[1:]
    mfcc = (mfcc - mfcc.mean(1, keepdims=True)) / (mfcc.std(1, keepdims=True) + 1e-9)
    rms = librosa.util.sync(librosa.feature.rms(y=y, hop_length=hop), frames)[0]
    unit = lambda m: m / (np.linalg.norm(m, axis=0, keepdims=True) + 1e-9)
    feat = unit(np.vstack([unit(librosa.util.sync(chroma, frames)), .35 * unit(librosa.util.sync(mfcc, frames))]))
    n, best = feat.shape[1], None
    at = lambda k: float(b0 + per * k)
    for length in range(16, n, 16):
        if length * per < 60:
            continue
        for s in range(8, n - length - 8):
            e = s + length
            if at(s) < 8 or at(e) > dur - 10:
                continue
            before = float(np.mean(np.sum(feat[:, s - 8:s] * feat[:, e - 8:e], 0)))
            after = float(np.mean(np.sum(feat[:, s:s + 8] * feat[:, e:e + 8], 0)))
            jump = abs(20 * np.log10((rms[e - 2:e + 2].mean() + 1e-9) / (rms[s - 2:s + 2].mean() + 1e-9)))
            score = before + after - .02 * jump + .0015 * length * per / 10
            if best is None or score > best[0]:
                best = (score, at(s), at(e), before, after, jump, length)
    _, s, e, before, after, jump, length = best
    return {'bpm': round(float(60 / per), 2), 'loop': [round(s, 3), round(e, 3)], 'beats': length,
            'similarity': [round(before, 3), round(after, 3)], 'level_jump_db': round(float(jump), 1), 'duration': round(dur, 3)}


def main():
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    info = loop_points(src)
    shutil.copyfile(src, ROOT / 'musica' / 'pausa.mp3')
    print(f'{src.name} → musica/pausa.mp3 · {info}')
    print(f"CONFIG.audio.pause.loop = [{info['loop'][0]}, {info['loop'][1]}]")


if __name__ == '__main__':
    main()
