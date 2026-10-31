# Performance Analytics — "A Linha" (v3)

Vídeo executivo animado para a reunião da área. A track vira uma linha de metrô com 7 estações em 4 plays. Entre os plays há paradas em loop, para as apresentadoras falarem. O visual é retrô-moderno, de colagem, com traço de tinta no espírito de Arcane. A câmera, as cores e os elementos reagem às batidas das músicas.

- **Arquivo final:** [`performance-analytics.html`](performance-analytics.html), um único HTML 1920×1080, 100% offline, com dados e músicas embutidos.
- **Roteiro:** [`STORYLINE.md`](STORYLINE.md) (v3.3).
- **Checkpoint de retomada:** [`PROGRESS.md`](PROGRESS.md).

## Como apresentar

1. Abra `performance-analytics.html` no Chrome ou no Edge e tecle **F** para tela cheia.
2. A tela começa no **pré-show**, um loop de espera. A primeira tecla libera o áudio, por regra do navegador.
3. Com → (ou o passador de slides) a sessão anda assim:

| Momento | O que acontece | Duração |
|---|---|---|
| Pré-show | loop de espera | até a primeira tecla |
| Play 1 · abertura | os 5 desafios → o mapa da linha (trilha sintetizada) | 0:15 |
| **Parada 0** · roteiro | o mapa em loop; cada → destaca uma estação | fala |
| Play 2 · estações 01–03 | "Vintage Film Funk" | 1:59 |
| **Parada 1** · retomada | plataforma com os cartazes 01, 02 e 03 | fala |
| Play 3 · estações 04–06 | "Technology" (a partir de 0:20) | 2:29 |
| **Parada 2** · retomada | cartazes 04, 05 e 06 | fala |
| Play 4 · 07, clímax e letreiro | "Epic Piano" (a partir de 0:07) | 1:07 |
| **Encerramento** | letreiro "Performance Analytics" vivo; → mostra o cartaz 07 | fala |

São ~5:50 de vídeo no total.

| Tecla | Na parada | Durante o vídeo |
|---|---|---|
| → · PageDown · espaço · Enter · clique | próximo cartaz; no último, embarca no próximo play | só espaço/Enter: pausa |
| ← · PageUp | cartaz anterior | — (setas não pulam o vídeo) |
| P | — | pausa/retoma (emergência) |
| 1 a 7 | vai para a estação | vai para a estação |
| Home ou R / End | volta ao pré-show / vai ao encerramento | idem |
| F · M · V · C | tela cheia · som · narração · legendas | idem |

A barra de progresso mostra as estações (traços) e as paradas (losangos). Ela aceita clique e arraste, para quem opera. Os controles somem sozinhos durante as paradas e o vídeo e voltam ao mover o mouse.

O modo `CONFIG.mode = 'reel'` roda tudo direto, sem paradas, para mandar por e-mail.

## Dados do vídeo

Os números e resultados das cenas vêm de um JSON embutido no topo do HTML, no bloco `<script type="application/json" id="pa-data">`.

- **No HTML pronto:** abra o arquivo num editor de texto, mude o valor no bloco `pa-data` e salve. É assim que os números mascarados podem ser trocados pelos originais.
- **No projeto:** a fonte é `data/presentation.json`. Rode `./build.sh` para gerar o HTML com ele.
- **Repositório público:**
  - troque pelos números originais só na cópia local do HTML;
  - edições feitas direto no HTML não voltam para o `data/presentation.json`. Para levar uma mudança adiante, atualize o JSON.
- **Formatação:** automática em pt-BR (`1.5x` → `1,5×`, `0.25MM` → `250 mil`). Um item de `headline_numbers_for_slides` aceita `display` para fixar o texto exato de tela.
- **Campo faltando:** a cena mostra "—" ou a versão sem número, em vez de quebrar.
- **Para completar depois:**
  - `other_tracks` (seção 3): nomes das demais tracks no faixa da estação 03;
  - campos vazios do case Lights-off (seção 4): `business_problem`, `business_results.headline`, `client_type`;
  - Practice (seção 6): `pillars`, `deliveries`, `evolutions`. Hoje é um rascunho; apague `placeholder` para tirar a etiqueta "rascunho".

## Música e batidas

- **Faixas (Pixabay):** berrydeep "Vintage Film Funk", kulakovka "Technology" e twisterium "Epic Piano Background".
  - Entram embutidas no HTML, recodificadas a 128 kbps, como parte do vídeo.
  - Os MP3 avulsos ficam em `musica/`, fora do Git, porque a licença não permite redistribuir a faixa solta.
- **Sincronia:** `tools/music.py` analisa as faixas e gera `src/07-beats.js`, com batidas, compassos, envelopes de grave e caixa, picos e mudanças de seção.
  - As cenas marcam os eventos nos compassos: `grid(id).bars`.
  - O estado da música no quadro fica em `BT`: `beat`, `down`, `kick`, `snare`, `level`, `hit` e `drop`.
- **O que reage à música** (`src/09-fx.js`):
  - **câmera:** soco de zoom nos tempos fortes, balanço no compasso e tranco nos picos;
  - **cores:** calor no 1º tempo, separação RGB nas caixas e picos, linhas de foco e quadros invertidos (*impact frames*) nas viradas de seção;
  - **elementos:** pulsam com o grave, e o traço de tinta "ferve" mais forte nas caixas.
- **Intensidade:** `CONFIG.motion.beat` (0 desliga).
- **Paradas:** ficam em silêncio. A abertura usa a trilha sintetizada a 120 BPM. Se uma faixa faltar no HTML, o play correspondente usa um groove sintetizado de reserva.

## Arquitetura

```
src/
  00-head.html     HTML + CSS, bloco de dados (pa-data) e blocos de música
  01-config.js     ★ CONFIG: plays, cenas casadas aos compassos, paradas, textos, narração, áudio
  01-data.js       ★ DADOS: lê o JSON, acessos seguros (SEC, CASE, HEADLINES) e formatação pt-BR (FMT)
  02-core.js       easing, cores, primitivas, texto, câmera, fundos, granulação
  03-collage.js    papel, contornos, meio-tom, fita, stickers, fórmulas; camada futurista (grid, sol, holo)
  03-components.js ícones, agentes, cards, carimbo ✓, dashboard
  04-viz.js        visualizações de modelos (gaussiana, regressão, classificação, clusters, embeddings…)
  05-audio.js      trilha sintetizada da abertura + SFX + sistema de cues
  06-voice.js      narração (speechSynthesis) e legendas
  07-beats.js      gerado por tools/music.py: batidas e envelopes das faixas
  08-music.js      toca as faixas em sincronia e expõe BEAT/BT
  09-fx.js         câmera e pós-processamento guiados pela música; traço de tinta, respingos, grafites, pinceladas
  10-ui.js         split-flap, mapa do metrô, mini-mapa, letreiro de estação, plataforma, cartazes, régua e comprovante
  20-open.js       pré-show, abertura e Parada 0
  21-trecho1.js    estações 01, 02, 03 e Parada 1
  22-cases.js      estação 04: Banana, Manga, Lights-off, Insight Agent
  23-scale.js      estações 05 e 06 e Parada 2
  24-final.js      estação 07, clímax, letreiro final e encerramento
  90-player.js     modo apresentação: plays, paradas em loop, navegação, controles
  99-tail.html
  legacy/          cenas da v2 (só referência; fora do build)
data/presentation.json
tools/build.py     monta o HTML (python3; ffmpeg para as músicas)
tools/music.py     analisa as músicas (requer librosa)
build.sh           atalho para tools/build.py
```

- **Para montar:** depois de editar `src/` ou `data/`, rode `./build.sh`.
  - Sem a pasta `musica/`, o build reaproveita as músicas que já estão no HTML.
  - Ao trocar uma faixa, rode `tools/music.py` antes, e ajuste os `dur` das cenas em `src/01-config.js` aos novos compassos.

**Decisões principais:**
- **Render puro em função do tempo.** Cada cena é `draw(ctx, t)` sem estado, e a música vira dados (`BT`) também em função do tempo. Por isso o seek é exato e o resultado é sempre igual.
- **Paradas com relógio próprio.** O loop usa o tempo desde a entrada na parada, e a transição entre cartazes é uma câmera que viaja na plataforma, sem corte.
- **Leveza:** brilhos com gradiente radial e granulação pré-renderizada. A separação RGB só roda nos quadros em que a música pede.

## Parâmetros úteis (`src/01-config.js`)

| Parâmetro | Efeito |
|---|---|
| `mode` | `'show'` (paradas em loop) ou `'reel'` (direto) |
| `plays[].from` | de onde cada faixa começa |
| `scenes[].dur` | duração de cada cena; casada com os compassos da faixa |
| `stops[].items` | quantos passos o → percorre em cada parada |
| `text` | todos os textos fixos (estações, desafios, rótulos) |
| `motion.beat`, `motion.intensity`, `motion.grain` | quanto a música mexe nos visuais, energia, granulação |
| `audio.tracks.*.gain`, `audio.trackVolume` | volume das faixas (já equalizadas) |
| `audio.voice`, `captions` | narração e legendas (desligadas por padrão) |
