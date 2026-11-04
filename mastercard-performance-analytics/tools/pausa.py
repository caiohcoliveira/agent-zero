"""Música das conversas (v7.16–v7.17): prepara a faixa que toca na abertura e nas paradas, com o laço e o volume dela.

Uso:
  python tools/pausa.py ORIGEM [DESTINO] [--inteira]
    ORIGEM   qualquer arquivo de áudio ou vídeo que o ffmpeg lê (mp3, m4a, mp4, wav…)
    DESTINO  padrão musica/pausa.mp3 (fora do Git); ao lado fica DESTINO.json com o laço e o volume
    --inteira  o laço é a música inteira (do fim volta ao começo, como "repetir" num player).
               É o certo para uma música conhecida; sem a opção, o laço é um trecho de frases inteiras
               escolhido pela semelhança das duas pontas (música ambiente, sem forma de canção).

O build embute a faixa como <script id="music-pausa" data-loop data-xfade data-gain data-open-gain>.
A variável PA_PAUSA troca a faixa do build sem mexer em musica/pausa.mp3:
  PA_PAUSA=musica/pausa-usuario.mp3 python3 tools/build.py dados.json saida.html

Volume: a faixa é medida em LUFS. "gain" deixa a música ≈ 10 dB abaixo do filme nas paradas (fundo para a fala),
e "openGain" deixa no nível do filme na abertura (a parte zero, que emenda com a Conversa 0).
Precisa de ffmpeg e librosa.
"""
import json
import pathlib
import re
import subprocess
import sys
import tempfile

import librosa
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / 'musica' / 'pausa.mp3'
FILM_LUFS, PAUSE_LUFS = -14.0, -23.7     # nível efetivo das faixas do filme e da música de fundo nas paradas


def lufs(path):
    log = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=framelog=quiet', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', log)[-1])


def phrase_loop(y, sr):
    """trecho de frases inteiras (múltiplo de 16 tempos, ≥ 60 s) com as duas pontas parecidas e no mesmo nível"""
    hop, dur = 512, len(y) / sr
    onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    _, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=hop, tightness=400)
    bt = librosa.frames_to_time(beats, sr=sr, hop_length=hop)
    i = np.arange(len(bt))
    per, b0 = np.polyfit(i, bt, 1)                       # grade regular: andamento fixo
    frames = np.clip(librosa.time_to_frames(b0 + per * i, sr=sr, hop_length=hop), 0, None)
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
                best = (score, at(s), at(e), before, after, float(jump), length)
    _, s, e, before, after, jump, length = best
    return {'loop': [round(s, 3), round(e, 3)], 'xfade': .3, 'bpm': round(float(60 / per), 2), 'beats': length,
            'similarity': [round(before, 3), round(after, 3)], 'level_jump_db': round(jump, 1)}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    whole = '--inteira' in sys.argv
    src = pathlib.Path(args[0]) if args else ROOT / 'musica' / 'elevenlabs' / 'pausa' / 'take4.mp3'
    out = pathlib.Path(args[1]) if len(args) > 1 else DEFAULT_OUT
    with tempfile.TemporaryDirectory() as tmp:
        wav = pathlib.Path(tmp) / 'a.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-vn', '-ac', '2', '-ar', '44100', str(wav)], check=True)
        y, sr = librosa.load(wav, sr=22050, mono=True)
        level = lufs(wav)
        info = {'duration': round(len(y) / sr, 3)}
        info.update({'loop': [0, info['duration']], 'xfade': 0} if whole else phrase_loop(y, sr))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-map_metadata', '-1', '-b:a', '192k', str(out)], check=True)
    info.update({'source': src.name, 'lufs': level,
                 'gain': round(10 ** ((PAUSE_LUFS - level) / 20), 3),
                 'openGain': round(min(1.0, 10 ** ((FILM_LUFS - level) / 20)), 3)})
    out.with_suffix('.json').write_text(json.dumps(info, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{src.name} → {out.relative_to(ROOT) if out.is_relative_to(ROOT) else out} · {info}')


if __name__ == '__main__':
    main()
