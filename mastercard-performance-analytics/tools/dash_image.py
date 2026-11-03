"""Põe a imagem do dashboard real do case de relatórios automatizados (Lights-off) numa CÓPIA LOCAL do vídeo.

O repositório é público e os dados dele são mascarados: a imagem real nunca vai para o Git. Use numa cópia local:
  python3 tools/dash_image.py minha-copia.html dashboard.png    embute a imagem (PNG, JPG ou WEBP)
  python3 tools/dash_image.py minha-copia.html --limpar         volta ao dashboard ilustrativo
O campo é dashboard_image, no case "Lights-off" do bloco de dados (id="pa-data"). A imagem vira um data URL, então o
HTML continua sendo um arquivo só e funciona offline. Ela aparece no popup que abre depois da automação (RESULTADO).
"""
import base64
import json
import mimetypes
import pathlib
import re
import sys

TAG = re.compile(r'(<script type="application/json" id="pa-data">)(.*?)(</script>)', re.S)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    html_p, arg = pathlib.Path(sys.argv[1]), sys.argv[2]
    html = html_p.read_text(encoding='utf-8')
    m = TAG.search(html)
    if not m:
        sys.exit('bloco id="pa-data" não encontrado: o arquivo é o performance-analytics.html?')
    data = json.loads(m.group(2))
    if arg == '--limpar':
        url = ''
    else:
        img = pathlib.Path(arg)
        mime = mimetypes.guess_type(img.name)[0]
        if mime not in ('image/png', 'image/jpeg', 'image/webp'):
            sys.exit('use uma imagem PNG, JPG ou WEBP')
        url = f'data:{mime};base64,' + base64.b64encode(img.read_bytes()).decode('ascii')
    sec4 = next((s for s in data.get('presentation_structure', []) if s.get('section') == 4), None)
    case = next((c for c in (sec4 or {}).get('cases', []) if str(c.get('case_name', '')).startswith('Lights-off')), None)
    if case is None:
        sys.exit('case "Lights-off" não encontrado na seção 4 do JSON')
    case['dashboard_image'] = url
    block = json.dumps(data, ensure_ascii=False, indent=2).replace('</', '<\\/').replace('<!--', '<\\u0021--')
    html_p.write_text(html[:m.start(2)] + block + html[m.end(2):], encoding='utf-8')
    print('dashboard ilustrativo de volta' if not url else f'imagem embutida ({len(url) // 1024} KB) em {html_p}')


if __name__ == '__main__':
    main()
