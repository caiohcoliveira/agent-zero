"""Monta performance-analytics.html, um arquivo único e offline.

Junta src/00-head.html + JSON de dados + músicas + src/[0-9][0-9]-*.js + src/99-tail.html.
- Dados: data/presentation.json (ou o caminho passado como argumento), embutido e editável no topo.
- Músicas: musica/<id>.mp3 (fora do Git), recodificadas a 128 kbps e embutidas em base64.
  Sem a pasta musica/, reaproveita as músicas que já estão no HTML atual.
Uso: python3 tools/build.py [dados.json]
"""
import base64
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'performance-analytics.html'
MUSIC_IDS = ['funk', 'tech', 'piano']


def data_block(path):
    data = json.loads(pathlib.Path(path).read_text(encoding='utf-8'))  # falha aqui se o JSON estiver inválido
    return json.dumps(data, ensure_ascii=False, indent=2).replace('</', '<\\/').replace('<!--', '<\\u0021--')


def music_blocks(prev):
    out = []
    for mid in MUSIC_IDS:
        # versão animada (tools/remix.py) → remontagem (tools/edit_music.py) → faixa original
        src = next((ROOT / 'musica' / f for f in (f'{mid}-mix.mp3', f'{mid}-edit.mp3', f'{mid}.mp3') if (ROOT / 'musica' / f).exists()), ROOT / 'musica' / f'{mid}.mp3')
        if src.exists():
            mp3 = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(src), '-map_metadata', '-1', '-ac', '2',
                                  '-b:a', '128k', '-f', 'mp3', '-'], capture_output=True, check=True).stdout
            b64 = base64.b64encode(mp3).decode()
        else:
            m = re.search(rf'<script type="text/plain" id="music-{mid}">([A-Za-z0-9+/=]*)</script>', prev)
            if not m:
                print(f'aviso: sem musica/{mid}.mp3 e sem música no HTML anterior; o trecho usa a trilha sintetizada')
                continue
            b64 = m.group(1)
        out.append(f'<script type="text/plain" id="music-{mid}">{b64}</script>')
    return '\n'.join(out)


def main():
    data_path = sys.argv[1] if len(sys.argv) > 1 else ROOT / 'data/presentation.json'
    prev = OUT.read_text(encoding='utf-8') if OUT.exists() else ''
    head = (ROOT / 'src/00-head.html').read_text(encoding='utf-8')
    head = head.replace('/*PA_DATA*/', data_block(data_path)).replace('<!--PA_MUSIC-->', music_blocks(prev))
    parts = [head]
    for f in sorted((ROOT / 'src').glob('[0-9][0-9]-*.js')):
        parts.append(f'\n/* ===== {f.name} ===== */\n' + f.read_text(encoding='utf-8'))
    parts.append((ROOT / 'src/99-tail.html').read_text(encoding='utf-8'))
    OUT.write_text(''.join(parts), encoding='utf-8')
    print(f'OK → {OUT.name} ({OUT.stat().st_size} bytes) · dados: {data_path}')


if __name__ == '__main__':
    main()
