# Performance Analytics — "A Linha" (v7, experimento)

> **Branch experimental** (`claude/mastercard-analytics-video-experimento`). A v5.4 continua intacta na branch `claude/mastercard-analytics-video-4cof1t`. Esta versão segue o roteiro criativo v7 ("cada tela se explica sozinha"), com quatro escolhas da v5.4 mantidas a pedido:
> - relatórios de fraude em versão híbrida: a explosão acende só o fluxo e a placa LIGHTS OFF RPA;
> - as 8 disciplinas acumulando no clímax;
> - o letreiro WELCOME TO… no final;
> - a estação viva atrás das conversas.

Vídeo executivo animado para a reunião da área. A track vira uma linha de metrô com 7 estações em 4 plays. Entre os plays há **conversas**, telas em loop para as apresentadoras falarem.

O visual é uma animação híbrida 2D/3D com acabamento pintado, no espírito de Arcane, e o texto fica **sempre nítido por cima da pintura**.

**Teste do roteiro v7:** assistir sem som e sem ajuda precisa bastar. Em qualquer pausa dá para reconhecer o problema, o método, o resultado e a base da comparação.

- **Arquivo final:** [`performance-analytics.html`](performance-analytics.html), um único HTML 1920×1080, 100% offline, com dados e músicas embutidos.
- **Roteiro:** [`STORYLINE.md`](STORYLINE.md) (v7).
- **Checkpoint de retomada:** [`PROGRESS.md`](PROGRESS.md).

## O contrato de cada tela

| Camada | Onde | Tamanho |
|---|---|---|
| Etiqueta de contexto + etapa (cases) | topo à esquerda | 22 px |
| Título: qual assunto ou etapa estamos vendo | topo à esquerda | 56 px |
| Explicação: o que foi feito e por quê | painel junto ao visual | 36 px |
| Rótulos dos gráficos e diagramas | no visual | 28 px ou mais |
| Conclusão: o que guardar | faixa embaixo | 40 px |

- **Leitura:** a câmera anda na apresentação da ideia e para durante a leitura.
- **Gráficos:** sempre com métrica, unidade, período, categorias e base da comparação.
- **Desenhos ilustrativos:** são identificados como ilustrativos.
- **Tempo de leitura:** `tools/read_check.js` mede o tempo que cada texto fica parado na tela contra o roteiro v7: até 2,5 palavras/s, mais 2,5 s para cada visual novo. Hoje: **72 telas, 0 curtas**.

## Como apresentar

1. Abra `performance-analytics.html` no Chrome ou no Edge e tecle **F** para tela cheia.
2. A tela começa no **pré-show**, um loop de espera. A primeira tecla libera o áudio, por regra do navegador.
3. Com → (ou o passador de slides) a sessão anda assim:

| Momento | O que acontece | Duração |
|---|---|---|
| Pré-show | loop de espera, com a missão escrita | até a primeira tecla |
| Play 1 · embarque | identidade → propósito → percurso (mapa com 3 capítulos) | 0:20 |
| **Conversa 0** · mapa | missão + mapa; **clique numa estação** para ver o detalhe; → embarca | fala |
| Play 2 · estações 01–03 | "Vintage Film Funk" remontada | 2:35 |
| **Conversa 1** | cartazes 01, 02, 03 legíveis, chamada "Onde isso encontra o seu cliente?", "A seguir: quatro cases…" | fala |
| Play 3 · estações 04–06 | "Technology" remontada: drop na solução de cada case | 5:04 |
| **Conversa 2** | cartazes 04, 05, 06, chamada "Qual desafio pode virar o próximo case?" | fala |
| Play 4 · 07, disciplinas e letreiro | "Epic Piano" a partir do 2º compasso | 1:12 |
| **Encerramento** | letreiro vivo; clique ou → abre o cartaz 07 | fala |

São **9:11 de vídeo**. Com as conversas, a sessão cabe em 20 minutos.

**Nas conversas, com o mouse:**
- **Conversa 0:**
  - clique numa estação para aproximar e ver o cartão com o que ela mostra;
  - clique fora, Esc ou uma seta para voltar.
- **Conversas 1, 2 e encerramento:**
  - os cartazes já trazem o resumo completo, legível sem clicar;
  - clique num cartaz para dar zoom: embaixo aparecem as **cenas montadas** da estação;
  - clique numa miniatura para abrir a cena num **popup**, com a animação daquela etapa rodando em loop. Na estação 03 há uma tela extra, o **catálogo com os 20 modelos**;
  - para fechar, use ✕, Esc ou clique fora; para trocar de cena, use ‹ › ou as setas.

| Tecla | Na conversa | Durante o vídeo |
|---|---|---|
| → · PageDown · espaço · Enter | próximo cartaz; no último, embarca no próximo play (com popup aberto: próxima cena) | só espaço/Enter: pausa |
| ← · PageUp | cartaz anterior (com popup aberto: cena anterior) | — (setas não pulam o vídeo) |
| Esc | fecha o popup, o cartão ou o zoom | — |
| P | — | pausa/retoma (emergência) |
| 1 a 7 | vai para a estação | vai para a estação |
| Home ou R / End | volta ao pré-show / vai ao encerramento | idem |
| F · M · V · C | tela cheia · som · narração · legendas | idem |
| Q | qualidade: automática → leve → máxima | idem |

O modo `CONFIG.mode = 'reel'` roda tudo direto, sem conversas, para mandar por e-mail.

## Dados do vídeo

Os números e resultados vêm de um JSON embutido no topo do HTML, no bloco `<script type="application/json" id="pa-data">`.

- **No HTML pronto:** abra o arquivo num editor de texto, mude o valor no bloco `pa-data` e salve. É assim que os números mascarados podem ser trocados pelos originais.
- **No projeto:** a fonte é `data/presentation.json`. Rode `./build.sh` para gerar o HTML com ele.
- **Repositório público:** troque pelos números originais só na cópia local do HTML. Não suba essa cópia para o Git.
- **Formatação:** automática em pt-BR (`1.5x` → `1,5×`, `0.25MM` → `250 mil`, `+0.1875 relative` → `+18,8%`).
  - A unidade da receita se ajusta ao valor: o mesmo gráfico mostra "US$ mil" ou "US$ mi".
  - Dentro de um mesmo gráfico, a unidade é uma só.
- **Frases calculadas a partir dos dados:**
  - "o realizado superou o orçamento em todos os trimestres" só aparece se a série confirmar; senão vira "em N de 4 trimestres";
  - o índice das cestas é calculado: 2ª melhor campanha = 100 → Destilados = 118,8;
  - agentes: ativos + oportunidades = universo, vindos de `business_results.pipeline`.
- **Prática (estação 06):** em `presentation_structure` → seção 6 → `pillars`:
  ```json
  "pillars": [
    { "pillar": "Nome do pilar", "contribution": "uma contribuição de 6 a 8 palavras", "highlights": ["entrega 1", "entrega 2"] }
  ]
  ```
  - `contribution` é **novo na v7**: a frase curta que aparece na estação 06 e no cartaz 06.
  - Sem esse campo, a cena usa o primeiro item de `highlights`.
  - A contagem "N entregas" vem do tamanho de `highlights`.
- **Exemplos ilustrativos do case de agentes:** o objeto `EX`, no início do case 4 em `src/22-cases.js`, traz:
  - o mesmo fato em três versões (Analista, Business, C-Level);
  - uma revisão típica: um rascunho, o motivo da reprovação e o texto corrigido.

  O filme rotula esses textos como exemplos. Troque por um exemplo real do tipo de revisão quando puder.
- **Ambiente seguro:** os nomes do repositório estão sanitizados (pilares "Cenoura", "Brócolis"…, clientes "Banana", "Manga"…). Para trocar pelos reais:
  1. Abra uma **cópia local** de `performance-analytics.html` num editor de texto.
  2. Procure `id="pa-data"`.
  3. Edite dentro do bloco e salve. Não é preciso rodar build. Se o JSON ficar inválido, o vídeo abre sem dados em vez de quebrar.

## Música e batidas

- **Faixas (Pixabay):** berrydeep "Vintage Film Funk", kulakovka "Technology" e twisterium "Epic Piano Background". Entram embutidas no HTML, recodificadas a 128 kbps. Os MP3 avulsos ficam em `musica/`, fora do Git, porque a licença não permite redistribuir a faixa solta.
- **Remontagem** (`tools/edit_music.py`, cortes nos compassos com crossfade):
  - **Funk (2:35):** a frase A de 16 compassos se repete. A estação 02 começa no recomeço da frase, a 03 começa no break e a síntese cai na saída da música.
  - **Technology (5:04):** cada case tem 27 compassos (60 s): calma 11 → construção 5 → cheia 11, com o drop na **solução**.
    - **Relatórios:** a construção perde os agudos, corta seco no interruptor e fica um compasso em silêncio antes do drop.
    - **Agentes:** a construção é longa e o drop cai na **escala**, depois que o ciclo foi explicado.
- **Sincronia:** `tools/music.py` (librosa) gera `src/07-beats.js`.
  - As cenas marcam eventos nos compassos (`grid(id).bars`).
  - O estado da música fica em `BT`.
  - A batida mexe pouco (`CONFIG.motion.beatBase` = 0,15) e só cresce nos picos declarados em `SCENES[id].peaks`.

## Arquitetura

```
src/
  00-head.html     HTML + CSS, bloco de dados (pa-data) e blocos de música
  01-config.js     ★ CONFIG: plays, cenas casadas aos compassos, conversas, textos (estações, capítulos, missão, futuro, disciplinas)
  01-data.js       ★ DADOS: lê o JSON, acessos seguros (SEC, CASE, HEADLINES) e formatação pt-BR (FMT)
  02-core.js · 03-collage.js · 03-components.js · 04-viz.js   primitivas, papel, ícones, agentes, visualizações
  05-audio.js      trilha sintetizada do embarque + SFX + cues
  07-beats.js      gerado por tools/music.py · 08-music.js toca as faixas e expõe BT
  09-fx.js         câmera e pós-processamento guiados pela música; tinta, respingos, pinceladas
  10-ui.js         split-flap, mapa, mini-mapa (canto superior direito), plataforma viva, cartazes, slides + popup, telas extras (SLIDE_SCREENS)
  11-station.js    vagão, trem que passa, painel "próxima estação", bilhete
  12-paint.js      acabamento pintado, luz volumétrica, volume
  13-people.js     a analista (poses: digitar, andar, alcançar, dançar, segurar, acenar, apontar; posição da mão)
  14-v7.js         ★ v7: TY/LAY (tipografia e grade), HUD (texto nítido), SAY (roteiro de tela), LINE (a linha laranja),
                   camKey/layer (câmera 2.5D), flowRow (diagramas nomeados), skyline, balão de pergunta
  20-open.js       pré-show, embarque e Conversa 0
  21-trecho1.js    estações 01, 02, 03, cartazes 01–03, catálogo de modelos e Conversa 1
  22-cases.js      estação 04 e os 4 cases
  23-scale.js      estações 05 e 06, cartazes 04–06 e Conversa 2
  24-final.js      estação 07, disciplinas, letreiro final, cartaz 07 e encerramento
  90-player.js     modo apresentação (HUD depois da pintura; interface das conversas por cima, sem pintura)
data/presentation.json
tools/build.py       monta o HTML (python3; ffmpeg para as músicas)
tools/edit_music.py  remonta funk e Technology (numpy, scipy e ffmpeg)
tools/music.py       analisa as músicas (librosa)
tools/read_check.js  medidor de leitura (node + Playwright)
build.sh             atalho para tools/build.py
```

- **Para montar:** depois de editar `src/` ou `data/`, rode `./build.sh`.
  - Sem a pasta `musica/`, o build reaproveita as músicas que já estão no HTML.
  - Ao mudar a remontagem, rode `tools/edit_music.py` → `tools/music.py` → `./build.sh` e confira os `dur` das cenas.
- **Para conferir a leitura:** `node tools/read_check.js`.

**Decisões principais:**
- **Render puro em função do tempo.** Seek exato, resultado sempre igual.
- **Texto nítido.**
  - Cada cena desenha o visual normalmente e põe os textos numa fila (`late`, `pin`, `hud`, `SAY`), desenhada depois do acabamento pintado.
  - `pin` mantém o tamanho do texto mesmo quando a câmera aproxima ou afasta.
- **Roteiro de tela por cena.** `SCENES[id].script` lista cada texto com o tempo em que entra e sai. É a fonte do medidor de leitura.
- **Qualidade adaptativa:**
  - se a máquina não segurar ~30 qps, o player tira o acabamento pintado e os efeitos caros;
  - texto, gráficos e rótulos ficam iguais;
  - a tecla Q força o modo leve ou o máximo.

## Parâmetros úteis

| Onde | Parâmetro | Efeito |
|---|---|---|
| `src/01-config.js` | `mode` | `'show'` (conversas em loop) ou `'reel'` (direto) |
| | `scenes[].dur` | duração de cada cena; casada com os compassos da faixa |
| | `text.mission`, `text.chapters`, `text.stations` | missão, capítulos do mapa e textos das estações |
| | `text.future`, `text.climaxWords`, `text.climaxSub` | direções do futuro e as 8 disciplinas |
| | `motion.beatBase`, `motion.paint` | batida fora dos clímax; acabamento pintado (0 desliga) |
| `src/14-v7.js` | `TY`, `LAY` | tamanhos de texto e posições do contrato de tela |
| arquivos de cena | `SCENES[id].script` | o roteiro de tela: título, explicação, conclusão e os tempos |
| `src/10-ui.js` | `SLIDES` | quais trechos viram cenas montadas (em loop) nas conversas |
