"""Monta a apresentação: o HTML (código + dados) e o sources.js (músicas e grades de batida), na mesma pasta.

v7.19: o base64 saiu do HTML. O HTML fica só com o guia, o JSON de dados, os estilos e o código, fácil de editar à mão
ou por outra IA; as músicas (MP3 em base64) e as grades de batida (src/07-beats.js) vão para sources.js, que o HTML
carrega com <script src="sources.js">. Os dois arquivos (e a imagem do dashboard) precisam ficar na mesma pasta.

Junta src/00-head.html + JSON de dados + src/[0-9][0-9]-*.js (menos 07-beats.js, que vai para o sources.js) + src/99-tail.html.
- Dados: data/presentation.json (ou o caminho passado como argumento), embutido e editável no topo do HTML.
- Músicas: musica/parte1.mp3, parte2.mp3, parte3.mp3 (ElevenLabs, tools/eleven_fit.py; fora do Git), recodificadas a
  128 kbps. Sem elas, usa a trilha Pixabay (musica/<id>-mix.mp3); sem a pasta musica/, reaproveita as do sources.js atual.
- Música das conversas: só quando pedida (PA_PAUSA=arquivo, ou musica/pausa.mp3 existindo); nunca é reaproveitada.
Uso: python3 tools/build.py [dados.json] [saida.html]   (sem saída: performance-analytics.html na pasta do projeto)
     O sources.js sai na mesma pasta do HTML.
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
SOURCES = 'sources.js'
MUSIC_IDS = ['funk', 'tech', 'piano', 'pausa']
ELEVEN = {'funk': 'parte1.mp3', 'tech': 'parte2.mp3', 'piano': 'parte3.mp3',   # v7.4: músicas geradas na ElevenLabs
          'pausa': 'pausa.mp3'}                                              # v7.16: música das conversas (loop nas paradas)


def data_block(path):
    data = json.loads(pathlib.Path(path).read_text(encoding='utf-8'))  # falha aqui se o JSON estiver inválido
    return json.dumps(data, ensure_ascii=False, indent=2).replace('</', '<\\/').replace('<!--', '<\\u0021--')


def pause_attrs(src):
    """v7.17–v7.18: o laço, o volume e o 1º drop da música das conversas viajam com ela (DESTINO.json de tools/pausa.py)"""
    side = pathlib.Path(src).with_suffix('.json')
    if not side.exists():
        return {}
    info = json.loads(side.read_text(encoding='utf-8'))
    attrs = {'loop': info.get('loop') or [0, info.get('duration', 0)], 'xfade': info.get('xfade', .3),
             'gain': info.get('gain', .4), 'openGain': info.get('openGain', 1)}
    if info.get('drop') and info.get('beat'):
        attrs.update({'drop': info['drop'], 'beat0': info.get('beat0', info['drop']), 'beat': info['beat']})
    return attrs


def previous_music(path):
    """as músicas do sources.js anterior (para montar sem a pasta musica/)"""
    if not path.exists():
        return {}
    m = re.search(r'^var PA_MUSIC = (\{.*\});$', path.read_text(encoding='utf-8'), re.M)
    return json.loads(m.group(1)) if m else {}


def music(prev):
    out = {}
    for mid in MUSIC_IDS:
        # ElevenLabs encaixada (tools/eleven_fit.py) → trilha Pixabay: versão animada (remix) → remontagem → original
        src = next((ROOT / 'musica' / f for f in (ELEVEN[mid], f'{mid}-mix.mp3', f'{mid}-edit.mp3', f'{mid}.mp3') if (ROOT / 'musica' / f).exists()), ROOT / 'musica' / f'{mid}.mp3')
        if mid == 'pausa':
            # v7.17: a música das conversas só entra quando é pedida (PA_PAUSA=arquivo, ou musica/pausa.mp3 existindo) e nunca é
            # reaproveitada da montagem anterior: a cópia do repositório (público) sai sem ela, e as de apresentação usam PA_PAUSA
            pa = os.environ.get('PA_PAUSA', '').strip()
            src = None if pa.lower() == 'none' else (pathlib.Path(pa).resolve() if pa else ROOT / 'musica' / 'pausa.mp3')
            if not src or not src.exists():
                print('aviso: sem música das conversas neste build (a abertura usa a trilha sintetizada e as paradas ficam sem música)')
                continue
        if src.exists():
            mp3 = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(src), '-map_metadata', '-1', '-ac', '2',
                                  '-b:a', '128k', '-f', 'mp3', '-'], capture_output=True, check=True).stdout
            out[mid] = {'attrs': pause_attrs(src) if mid == 'pausa' else {}, 'data': base64.b64encode(mp3).decode()}
        elif mid in prev:
            out[mid] = prev[mid]
        else:
            print(f'aviso: sem musica/{ELEVEN.get(mid, mid + ".mp3")} e sem música no sources.js anterior; o trecho usa a trilha sintetizada')
    return out


def sources_js(tracks):
    beats = re.search(r'const BEATS = (\{.*?\});\n', (ROOT / 'src/07-beats.js').read_text(encoding='utf-8'), re.S).group(1)
    names = ', '.join(tracks) or 'nenhuma'
    return ('/* ============================================================================\n'
            '   Performance Analytics — fontes da apresentação (gerado por tools/build.py; não editar à mão)\n'
            '   Fica NA MESMA PASTA do HTML, que o carrega com <script src="sources.js">.\n'
            f'   BEATS: grades de batida e envelopes das faixas (src/07-beats.js) · PA_MUSIC: músicas em MP3/base64 ({names})\n'
            '   ========================================================================== */\n'
            f'var BEATS = {beats};\n'
            f'var PA_MUSIC = {json.dumps(tracks, separators=(",", ":"))};\n')


def main():
    data_path = sys.argv[1] if len(sys.argv) > 1 else ROOT / 'data/presentation.json'
    out = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else OUT
    src_out = out.parent / SOURCES
    prev = previous_music(src_out) or previous_music(OUT.parent / SOURCES)
    tracks = music(prev)
    head = (ROOT / 'src/00-head.html').read_text(encoding='utf-8')
    head = head.replace('/*PA_DATA*/', data_block(data_path)).replace('<!--PA_MUSIC-->', f'<script src="{SOURCES}"></script>')
    parts = [head]
    for f in sorted((ROOT / 'src').glob('[0-9][0-9]-*.js')):
        if f.name == '07-beats.js':   # vai para o sources.js
            continue
        parts.append(f'\n/* ===== {f.name} ===== */\n' + f.read_text(encoding='utf-8'))
    parts.append((ROOT / 'src/99-tail.html').read_text(encoding='utf-8'))
    out.write_text(''.join(parts), encoding='utf-8')
    src_out.write_text(sources_js(tracks), encoding='utf-8')
    print(f'OK → {out} ({out.stat().st_size} bytes) + {src_out.name} ({src_out.stat().st_size} bytes: {", ".join(tracks) or "sem músicas"}) · dados: {data_path}')


if __name__ == '__main__':
    main()
