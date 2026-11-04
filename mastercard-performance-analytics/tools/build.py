"""Monta performance-analytics.html, um arquivo único e offline.

Junta src/00-head.html + JSON de dados + músicas + src/[0-9][0-9]-*.js + src/99-tail.html.
- Dados: data/presentation.json (ou o caminho passado como argumento), embutido e editável no topo.
- Músicas: musica/parte1.mp3, parte2.mp3, parte3.mp3 (ElevenLabs, tools/eleven_fit.py; fora do Git), recodificadas a
  128 kbps e embutidas em base64. Sem elas, usa a trilha Pixabay (musica/<id>-mix.mp3).
  Sem a pasta musica/, reaproveita as músicas que já estão no HTML atual.
Uso: python3 tools/build.py [dados.json] [saida.html]   (sem saída: performance-analytics.html na pasta do projeto)
"""
import base64
import os
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'performance-analytics.html'
MUSIC_IDS = ['funk', 'tech', 'piano', 'pausa']
ELEVEN = {'funk': 'parte1.mp3', 'tech': 'parte2.mp3', 'piano': 'parte3.mp3',   # v7.4: músicas geradas na ElevenLabs
          'pausa': 'pausa.mp3'}                                              # v7.16: música das conversas (loop nas paradas)


def data_block(path):
    data = json.loads(pathlib.Path(path).read_text(encoding='utf-8'))  # falha aqui se o JSON estiver inválido
    return json.dumps(data, ensure_ascii=False, indent=2).replace('</', '<\\/').replace('<!--', '<\\u0021--')


def pause_attrs(src):
    """v7.17: o laço e o volume da música das conversas viajam com ela (DESTINO.json de tools/pausa.py)"""
    side = pathlib.Path(src).with_suffix('.json')
    if not side.exists():
        return ''
    info = json.loads(side.read_text(encoding='utf-8'))
    loop = info.get('loop') or [0, info.get('duration', 0)]
    drop = (f' data-drop="{info["drop"]}" data-beat0="{info.get("beat0", info["drop"])}" data-beat="{info["beat"]}"'
            if info.get('drop') and info.get('beat') else '')   # v7.18: o 1º drop e a grade de tempos (abertura nas portas do trem)
    return (f' data-loop="{loop[0]},{loop[1]}" data-xfade="{info.get("xfade", .3)}"'
            f' data-gain="{info.get("gain", .4)}" data-open-gain="{info.get("openGain", 1)}"' + drop)


def music_blocks(prev):
    out = []
    for mid in MUSIC_IDS:
        # ElevenLabs encaixada (tools/eleven_fit.py) → trilha Pixabay: versão animada (remix) → remontagem → original
        src = next((ROOT / 'musica' / f for f in (ELEVEN[mid], f'{mid}-mix.mp3', f'{mid}-edit.mp3', f'{mid}.mp3') if (ROOT / 'musica' / f).exists()), ROOT / 'musica' / f'{mid}.mp3')
        if mid == 'pausa':
            # v7.17: a música das conversas só entra quando é pedida (PA_PAUSA=arquivo, ou musica/pausa.mp3 existindo) e nunca é
            # reaproveitada do HTML anterior: o HTML do repositório (público) sai sem ela, e as cópias de apresentação usam PA_PAUSA
            pa = os.environ.get('PA_PAUSA', '').strip()
            src = None if pa.lower() == 'none' else (pathlib.Path(pa).resolve() if pa else ROOT / 'musica' / 'pausa.mp3')
            if not src or not src.exists():
                print('aviso: sem música das conversas neste build (a abertura usa a trilha sintetizada e as paradas ficam sem música)')
                continue
        attrs = pause_attrs(src) if mid == 'pausa' else ''
        if src.exists():
            mp3 = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(src), '-map_metadata', '-1', '-ac', '2',
                                  '-b:a', '128k', '-f', 'mp3', '-'], capture_output=True, check=True).stdout
            b64 = base64.b64encode(mp3).decode()
        else:
            m = re.search(rf'<script type="text/plain" id="music-{mid}"([^>]*)>([A-Za-z0-9+/=]*)</script>', prev)
            if not m:
                print(f'aviso: sem musica/{ELEVEN.get(mid, mid + ".mp3")} e sem música no HTML anterior; ' + ('as conversas ficam sem música' if mid == 'pausa' else 'o trecho usa a trilha sintetizada'))
                continue
            attrs, b64 = attrs or m.group(1), m.group(2)
        out.append(f'<script type="text/plain" id="music-{mid}"{attrs}>{b64}</script>')
    return '\n'.join(out)


def main():
    data_path = sys.argv[1] if len(sys.argv) > 1 else ROOT / 'data/presentation.json'
    out = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else OUT
    prev = OUT.read_text(encoding='utf-8') if OUT.exists() else ''
    head = (ROOT / 'src/00-head.html').read_text(encoding='utf-8')
    head = head.replace('/*PA_DATA*/', data_block(data_path)).replace('<!--PA_MUSIC-->', music_blocks(prev))
    parts = [head]
    for f in sorted((ROOT / 'src').glob('[0-9][0-9]-*.js')):
        parts.append(f'\n/* ===== {f.name} ===== */\n' + f.read_text(encoding='utf-8'))
    parts.append((ROOT / 'src/99-tail.html').read_text(encoding='utf-8'))
    out.write_text(''.join(parts), encoding='utf-8')
    print(f'OK → {out} ({out.stat().st_size} bytes) · dados: {data_path}')


if __name__ == '__main__':
    main()
