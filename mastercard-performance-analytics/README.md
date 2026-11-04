# Performance Analytics — "A Linha" (v7.13, experimento)

> **Branch experimental** (`claude/mastercard-analytics-video-experimento`). A v5.4 continua intacta na branch `claude/mastercard-analytics-video-4cof1t`. Esta versão segue o roteiro criativo v7 ("cada tela se explica sozinha"), com quatro escolhas da v5.4 mantidas a pedido:
> - relatórios de fraude em versão híbrida: a explosão acende só o fluxo e a placa LIGHTS OFF RPA;
> - o clímax com cards nos tempos fortes da música (v7.11: 5 cases que viram para mostrar as técnicas);
> - o letreiro WELCOME TO… no final;
> - a estação atrás das conversas (v7.11: futurista, arejada e verde).
>
> **v7.11:**
> - **estação das conversas:** saiu o metrô subterrâneo (azulejos, ratinho, pombo, goteira, grafites). Agora é uma estação ao ar livre, com cobertura de nervuras brancas e vidro, parede de vidro com a cidade clara e um viaduto onde um trem bala passa ao longe, jardins verticais, árvores e floreiras, e painéis brancos pendurados no lugar dos cartazes de papel. Referências: Oculus (WTC), Zaragoza-Delicias, West Kowloon, "Train Station in the Forest" (MAD), Jönköping e o jardim de Atocha;
> - **trem bala:** o vagão antigo virou um trem bala de dois vagões (nariz aerodinâmico, faixa contínua de janelas, saia lisa e as cores da Mastercard), no embarque, na ponte, no viaduto, na 07, na passagem entre estações e ao fundo da estação;
> - **telas com gráfico minimalistas:** sem fachos de luz, poeira, partículas, objetos flutuando, fitas 3D, grade neon, rastros de velocidade e prédios ao fundo. A cidade só aparece onde o trem passa (ponte da 01, viaduto da 06 e cidade da 07);
> - **barras chapadas** (sem volume 3D nem brilho) e números-manchete sem respingo;
> - **cases:** os clusters 3D da v5 na principalidade e a resolução de erros da v5 no case de IA;
> - **clímax:** 5 cases que entram nos compassos e viram (frente: case e método; verso: técnicas).
>
> **v7.12:**
> - **sem "próxima parada"** (o letreiro final e o aviso antes das conversas) e **sem "linha" no nome**: "Performance Analytics" no bilhete, no pré-show e no painel da estação;
> - **sem tinta:** títulos em faixa lisa (sem pincelada, respingo ou contorno), sem respingos no letreiro e sem a textura de pinceladas por cima do quadro (`motion.strokes` = 0);
> - **clímax:** a frase final é "Tudo se resume a *Analytics*." e volta o eixo da v5: 12 técnicas, do mais simples ao mais complexo, acesas por uma varredura até o último tempo forte;
> - **relatórios automatizados:** os painéis saem do monitor e se empilham no canto inferior esquerdo, com o contador, sem cobrir a animação da automação; o ANTES × DEPOIS fica ao lado;
> - **ajustes:** as linhas da 07 correm alinhadas à linha laranja; o leque da 05 sai da borda do ativo reutilizável; o painel 07 do encerramento fica reto; o case de IA volta ao painel desenhado da v5.
>
> **v7.2:**
> - **sem personagem:** cada aparição virou outra solução visual (o bilhete sozinho, um trem que cruza a ponte, a equipe em ícones planos, a tela e o interruptor contando a fraude, um trem que segue pela cidade);
> - **espaço 3D:** campo de partículas com constelações, curvas 3D em fita e objetos flutuando (cubos, octaedros, anéis, orbes) atrás do conteúdo, girando com a câmera;
> - **correções:** entrada das conversas sem textos misturados, barras do faturamento sem a "sujeira" no topo, ícones planos em "Onde aplicamos analytics" e embeddings imersivos (sem moldura).

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
| Play 1 · embarque | identidade → propósito (o bilhete "DE dados → PARA valor" carimbado) → percurso (mapa com 3 capítulos) | 0:20 |
| **Conversa 0** · mapa | missão + mapa; **clique numa estação** para ver o detalhe; → embarca | fala |
| Play 2 · estações 01–03 | funk cinematográfico (ElevenLabs), encaixado | 2:35 |
| **Conversa 1** | cartazes 01, 02, 03 legíveis, chamada "Onde isso encontra o seu cliente?", "A seguir: quatro cases…" | fala |
| Play 3 · estações 04–06 | opção A (ElevenLabs): uma versão por case, como foi composta; as cenas seguem a música | 4:42 |
| **Conversa 2** | cartazes 04, 05, 06, chamada "Qual desafio pode virar o próximo case?" | fala |
| Play 4 · 07, clímax e letreiro | final orquestral (ElevenLabs), inteiro; termina com o vídeo | 1:11 |
| **Encerramento** | letreiro vivo; clique ou → abre o cartaz 07 | fala |

São **8:48 de vídeo**. Com as conversas, a sessão cabe em 20 minutos.

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
- **No projeto:** a fonte é `data/presentation.json`. Rode `python3 tools/build.py` para gerar o HTML com ele (`python3 tools/build.py outro.json saida.html` monta uma cópia com outro JSON, sem mexer no HTML do projeto).
- **Guia no próprio HTML (v7.13):** o topo do arquivo traz um LEIA-ME com o passo a passo, as regras do JSON e o mapa "campo → tela", logo acima do bloco de dados. Quem pegar o processo só precisa trocar o JSON e a imagem do dashboard.
- **Repositório público:** troque pelos números originais só na cópia local do HTML. Não suba essa cópia para o Git.
- **Formatação:** automática em pt-BR (`1.5x` → `1,5×`, `0.25MM` → `250 mil`, `+0.1875 relative` → `+18,8%`).
  - A unidade da receita se ajusta ao valor: o mesmo gráfico mostra "US$ mil" ou "US$ mi".
  - Dentro de um mesmo gráfico, a unidade é uma só.
- **Estação 02 (v7.13):** em `presentation_structure` → seção 2 (o ano vem do nome da chave; vale o mais recente):
  - `revenue_performance_analytics_usd_millions`: receita por ano, em milhões de US$ (`"2026_forecast"` = previsão);
  - `business_scale_2026.projects_delivered`: o número de projetos (um `projects_delivered_display` curto, como `"+30"`, substitui o número na tela);
  - `revenue_contribution_by_project_type_2026`: `project_type`, `revenue_share` (`"21%"`) e `delivery_model` (`"Track"` = só a track; `"Track + Outra"` = com outra track; `"Not specified"`);
  - `revenue_contribution_summary_2026`: `pa_only_revenue_share`, `cross_track_revenue_share`, `unspecified_delivery_model_revenue_share` e `cross_track_revenue_breakdown`;
  - `project_mix_2026.projects_with_other_tracks_approx`: % de projetos com outras tracks (base de projetos, mostrada separada da base de receita);
  - `team_structure_2026`: `levels` (`level`, `current_internal_positions`, `current_contractors`) e os totais `current_internal_positions`, `current_contractors`, `current_total_including_contractors`.
- **Versão mascarada (v7.13):** para circular, os nomes de clientes, tracks, tipos de projeto e **pilares da prática** viram frutas e verduras (no JSON público os pilares são Cenoura, Brócolis, Abobrinha, Beterraba e Couve). Sem o campo `contribution`, o pilar mostra o primeiro item de `highlights`.
- **Cases pela posição (v7.13):** o vídeo acha cada case pelo começo do nome ("Cliente Banana", "Cliente Manga", "Lights-off", "Insight Agent"); se o JSON usar outros nomes, vale a posição na lista (1º cestas, 2º principalidade, 3º relatórios, 4º agentes).
- **Frases calculadas a partir dos dados:**
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
- **Exemplos ilustrativos do case de agentes:** os objetos `AGX`, `WHY` e `SHORT`, no case 4 em `src/22-cases.js`, trazem:
  - os rascunhos de cada gerador (Analista, Business, C-Level), na versão 1 e na versão 2;
  - o motivo da reprovação e o título aprovado.

  O filme rotula esses textos como exemplos. Troque por um exemplo real do tipo de revisão quando puder.
- **Ambiente seguro:** os nomes do repositório estão sanitizados (pilares "Cenoura", "Brócolis"…, clientes "Banana", "Manga"…).
  - **Lorem ipsum (v7.3):** as informações da prática estão em lorem ipsum: contribuições e entregas dos pilares. Mantêm a mesma quantidade de entregas por pilar.
  - **Outros dados mascarados:** as fontes internas, os motivos do Brasil, os nomes das mecânicas de campanha ("Mecânica Lorem"…) e as ferramentas do case Manga.

  Para trocar pelos reais:
  1. Abra uma **cópia local** de `performance-analytics.html` num editor de texto.
  2. Procure `id="pa-data"`.
  3. Edite dentro do bloco e salve. Não é preciso rodar build. Se o JSON ficar inválido, o vídeo abre sem dados em vez de quebrar.
- **Dashboard real (case de relatórios automatizados):** depois da automação, um popup mostra o dashboard enviado ao board.
  - A imagem é o arquivo **`dashboard-fraude.png`**, na mesma pasta do HTML. No Git ela é ilustrativa.
  - Para usar o real, troque esse arquivo pela imagem do dashboard real, **com o mesmo nome** (qualquer tamanho; ela se ajusta à janela). Outra extensão (JPG, WEBP): mude o campo `dashboard_image` do case de relatórios no JSON. Sem o campo, o vídeo procura `dashboard-fraude.png`; com o campo vazio (`""`), não usa imagem.
  - Ao enviar o vídeo, mande o HTML e a imagem juntos, na mesma pasta. Sem a imagem, o popup mostra o dashboard desenhado, marcado como ilustrativo.
  - A imagem real fica só na cópia local: não suba para o Git (o repositório é público).
- **Aviso de versão mockada:** `presentation_context.disclaimer` aparece no canto inferior esquerdo de todas as telas, inclusive nas conversas ("Este vídeo é a versão mockada, com dados sanitizados."). Na cópia local com os dados reais, deixe o campo vazio (`""`) e o aviso some.

## Música e batidas

- **Faixas (v7.4–v7.7, ElevenLabs Music):** as três partes foram geradas na conta ElevenLabs do usuário, como instrumentais, e encaixadas nos tempos do filme. Entram embutidas no HTML, recodificadas a 128 kbps.
  - **Parte 1 · estações 01–03 (2:34,5):** funk cinematográfico, 110 BPM.
    - Intro abafada que abre no tema e as viradas de estação no tempo forte.
    - Low só com médios antes da parte B, pausa, riser e drop na estação 03.
  - **Parte 2 · estação 04, os 4 cases, 05 e 06 (4:42):** a **opção A** (v7.7): funk corporativo, 108 BPM, uma versão por case, cada uma **tocada como foi composta**, sem filtros, efeitos, compassos repetidos ou silêncios. A música não é editada: as cenas é que foram reajustadas a ela.
    - **04 e case 1:** a versão começa no 3º compasso dela, e os blocos de 8 compassos entram no começo do case e na solução. A gravação acaba tocando, então some no último compasso.
    - **Case 2:** a versão toca inteira; a subida dela cai na solução, e o acorde final soa até a porta.
    - **Automação:** a pausa de 2 tempos composta na própria música é o interruptor, e o drop dela acende o neon. O acorde final soa no mergulho.
    - **IA:** a cena começa com o crescendo de 16 compassos da versão; o maior drop da parte cai na escala, e o acorde final soa até a 05.
    - **05 e 06:** 16 compassos de groove, e o acorde final cai na conclusão da 06.
  - **Parte 3 · 07, clímax e letreiro (1:11):** final orquestral, 100 BPM, **sem o coro**, tocado **inteiro, do jeito que foi composto** (v7.5).
    - Toca a gravação original até pouco antes do coro e, depois, a versão sem coro, alinhada à amostra.
    - O filme se ajusta à música (v7.7):
      - os 5 cards do clímax entram um por compasso desde que a batida começa (30,0 s) e viram 2 tempos depois (v7.11);
      - a frase-chave aparece no grande ataque da orquestra (46,8 s);
      - o letreiro acende no prato da cadência final (67,2 s);
      - o vídeo termina com a cauda desse acorde (71,4 s).
- **Encaixe** (`tools/eleven_fit.py`): a ElevenLabs respeita estilo e andamento, mas não os tempos internos.
  - **Parte 1:** cortes de compassos, intro abafada, a quebra "rádio" (só médios) antes da parte B, riser, impacto e pratos (camadas de `tools/remix.py`). Tem o andamento ajustado (0,95%, rubberband) para a grade de 110 BPM das cenas.
  - **Partes 2 e 3:** nada além do nível; cada versão só é deslocada inteira (`PARTE2_A`), e o filme acompanha (a grade e as seções saem delas).
- **Arquivos (fora do Git):**
  - versões brutas em `musica/elevenlabs/`: `parte1-bruta.mp3`, `parte2-A/p2-1-A.mp3` … `p2-5-A.mp3` (opção A da parte 2), `parte3-bruta-A.mp3` e `parte3-sem-coro.wav`;
  - mixes finais em `musica/parte1.mp3`, `musica/parte2.mp3` e `musica/parte3.mp3`.
  - **Sem coro:** `parte3-sem-coro.wav` sai do Demucs: `python -m demucs --two-stems=vocals -n htdemucs_ft parte3-bruta-A.mp3`, arquivo `no_vocals.wav`. Precisa de torch e demucs num ambiente à parte.
- **Ordem:** `python3 tools/eleven_fit.py todas` → `python3 tools/music.py` → `./build.sh`.
  - O build usa `musica/parteN.mp3` quando existe.
  - Sem esses arquivos, cai na trilha Pixabay anterior (`tools/edit_music.py` → `tools/remix.py`, arquivos `<faixa>-mix.mp3`).
  - Os ids internos das faixas (`funk`, `tech`, `piano`) continuam os mesmos.
- **Volume:** `CONFIG.tracks` (0,81 · 0,75 · 0,66) mantém o mesmo nível efetivo da trilha anterior (≈ −13,9 · −15,2 · −13,4 LUFS), equilibrado com os efeitos.
- **Uso:** confira os termos do plano da conta ElevenLabs para uso das músicas geradas no evento.
- **Sincronia:** `tools/music.py` gera `src/07-beats.js`.
  - Para as três faixas, a grade é **exata** (`GRID`: andamento, um tempo forte conhecido e as seções), em vez de detectada.
  - Assim as cenas acertam a batida mesmo em intros filtradas.
  - As cenas marcam eventos nos compassos (`grid(id).bars`) e encaixam as entradas nas batidas (`onBeat`, `beatsFrom`).
  - O estado da música fica em `BT`.
  - A batida mexe pouco (`CONFIG.motion.beatBase` = 0,15) e só cresce nos picos declarados em `SCENES[id].peaks`.

## Arquitetura

```
src/
  00-head.html     HTML + CSS, bloco de dados (pa-data) e blocos de música
  01-config.js     ★ CONFIG: plays, cenas casadas aos compassos, conversas, textos (estações, capítulos, missão, futuro, cases do clímax)
  01-data.js       ★ DADOS: lê o JSON, acessos seguros (SEC, CASE, HEADLINES) e formatação pt-BR (FMT)
  02-core.js · 03-collage.js · 03-components.js · 04-viz.js   primitivas, papel, ícones, agentes, visualizações
  05-audio.js      trilha sintetizada do embarque + SFX + cues
  07-beats.js      gerado por tools/music.py · 08-music.js toca as faixas e expõe BT
  09-fx.js         câmera e pós-processamento guiados pela música; tinta, respingos, pinceladas
  10-ui.js         grade musical por cena (grid, onBeat, beatsFrom: entradas no tempo da música), split-flap, mapa, mini-mapa,
                   estação das conversas (v7.11: futurista, arejada e verde), painéis, slides + popup, telas extras (SLIDE_SCREENS)
  11-station.js    trem bala (v7.11; trainCar/sideTrain/trainLen), trem que passa, painel "próxima estação", bilhete
  12-paint.js      acabamento pintado, luz volumétrica, volume
  13-people.js     personagens antigos (ratinho, pombo e o rig): ficam no arquivo, mas não são usados desde a v7.11
  14-v7.js         ★ v7: TY/LAY (tipografia e grade), HUD (texto nítido), SAY (roteiro de tela), LINE (a linha laranja),
                   camKey/layer (câmera 2.5D), flowRow (diagramas nomeados), skyline, balão de pergunta,
                   SPACE (v7.2: campo de partículas, curva 3D em fita e objetos flutuando; v7.11: fora das telas com gráfico),
                   fbar (v7.11: barras chapadas dos gráficos),
                   mockBadge (aviso de versão mockada)
  20-open.js       pré-show, embarque e Conversa 0
  21-trecho1.js    estações 01, 02, 03, cartazes 01–03, catálogo de modelos e Conversa 1
  22-cases.js      estação 04 e os 4 cases
  23-scale.js      estações 05 e 06, cartazes 04–06 e Conversa 2
  24-final.js      estação 07, clímax (5 cases que viram), letreiro final, cartaz 07 e encerramento
  90-player.js     modo apresentação (HUD depois da pintura; interface das conversas por cima, sem pintura)
data/presentation.json
tools/build.py       monta o HTML (python3; ffmpeg para as músicas)
tools/edit_music.py  remonta funk e Technology (numpy, scipy e ffmpeg)
tools/remix.py       versão animada das 3 faixas: bateria, risers, drops, sidechain, graves (numpy, scipy e ffmpeg)
tools/music.py       analisa as músicas (librosa)
tools/read_check.js  medidor de leitura (node + Playwright)
build.sh             atalho para tools/build.py
```

- **Para montar:** depois de editar `src/` ou `data/`, rode `./build.sh`.
  - Sem a pasta `musica/`, o build reaproveita as músicas que já estão no HTML.
  - Ao mudar a remontagem ou o remix, rode `tools/edit_music.py` → `tools/remix.py` → `tools/music.py` → `./build.sh` e confira os `dur` das cenas.
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
| | `text.future`, `text.climaxCases` | direções do futuro e os 5 cases do clímax (case, método, técnicas; `etc` acrescenta "e outras técnicas") |
| | `motion.beatBase`, `motion.paint` | batida fora dos clímax; acabamento pintado (0 desliga) |
| `src/14-v7.js` | `TY`, `LAY` | tamanhos de texto e posições do contrato de tela |
| arquivos de cena | `SCENES[id].script` | o roteiro de tela: título, explicação, conclusão e os tempos |
| `src/10-ui.js` | `SLIDES` | quais trechos viram cenas montadas (em loop) nas conversas |
