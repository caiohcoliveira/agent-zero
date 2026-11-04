# Progresso / checkpoint

Arquivo de retomada. Cada etapa concluída é commitada e enviada para a branch `claude/mastercard-analytics-video-4cof1t` (PR #1). Se a conexão cair, retome a partir do primeiro item não marcado.

## v1 (concluída)

- [x] Storyline v1 + validação (multiagente; produtos do issuer)
- [x] HTML v1 (`d5fa1df`) + README + checkpoint

## v2 — ajustes da revisão (ver "O que mudou" no `STORYLINE.md`)

- [x] **E1. Storyline v2 + este plano**
- [x] **E2. Sistema visual retrô-moderno / colagem:**
  - papel, contornos, sombras chapadas, meio-tom, stickers, fita;
  - camada futurista (neon, grid, scanlines);
  - aplicado aos componentes.
- [x] **E3. Config v2:**
  - voz desligada por padrão;
  - nova ordem dos casos e novos tempos;
  - nova narração;
  - trilha por cena;
  - hook com os 5 desafios.
- [x] **E4. Easter eggs no ALS e nos embeddings:** atualização do ALS, cosseno, gradiente descendente, InfoNCE.
- [x] **E5. Lights-off:** sem agentes, com easter eggs e mergulho no nó Insights.
- [x] **E6. Insights em escala:**
  - destinos (report, dashboard, qualquer processo);
  - transformers + GPU + vários modelos + perímetro "o dado nunca sai".
- [x] **E7. Cena "Possibilidades":** 3 ondas de modelos → ∞.
- [x] **E8. Clímax** (fórmulas, Otimização, Transformers) **+ fechamento split-flap** (Welcome to…).
- [x] **E9. QA completo + README atualizado.**

**v2 concluída** (`20e1d96`). O roteiro da v2 está no histórico desse commit.

## v3 — reestruturação em 7 tópicos (ver `STORYLINE.md`)

- [x] **S1. Storyline v3 + v3.1:**
  - sessão de 20 min (~9 min de vídeo + 11 min de fala);
  - 4 paradas em loop com cartazes de retomada;
  - temas musicais A e B.

  **Aguardando validação do usuário (estrutura e músicas).**
- [x] **S1b. Dados (v3.2):**
  - bloco JSON `pa-data` no topo do HTML, lido por `src/01-data.js` (acessos seguros e formatação pt-BR);
  - `data/presentation.json` no Git, com os números mascarados.
- [x] **S1c. Respostas (v3.3):**
  - duração por play: abertura ~15s, 2:00, ~2:30, ~1:00;
  - padrões assumidos e campos para completar no JSON (Prática, Lights-off, `other_tracks`).

  Ver "Decisões desta rodada (v3.3)" no `STORYLINE.md`. **Sem perguntas em aberto.**
- [x] **S2. Linha do tempo v3 + músicas:**
  - `src/01-config.js` com 4 plays, 13 cenas casadas aos compassos e 5 paradas;
  - `tools/music.py` gera `src/07-beats.js` (batidas, compassos, envelopes, picos, seções);
  - `src/08-music.js` toca as faixas em sincronia e expõe `BEAT`/`BT` para os visuais;
  - `tools/build.py` embute as músicas (MP3 em `musica/`, fora do Git; sem a pasta, reaproveita as do HTML atual).
- [x] **S3. Player em modo apresentação** (`src/90-player.js`):
  - pré-show, paradas em loop com itens, embarque e setas ignoradas durante o vídeo;
  - teclas 1–7, P, Home/End e barra com estações e paradas;
  - cenas antigas da v2 movidas para `src/legacy/` (referência; fora do build).
- [x] **S4. Camada de batida + estilo + componentes** (`src/09-fx.js`, `src/10-ui.js`):
  - câmera, cores, RGB, linhas de foco e quadros invertidos guiados pela música;
  - traço de tinta fervendo, respingos, grafites e pinceladas;
  - split-flap, mapa, mini-mapa, letreiro de estação, plataforma e cartazes, régua e comprovante.
- [x] **S5. Abertura + Parada 0 + trecho 1** (`src/20-open.js`, `src/21-trecho1.js`): estações 01–03 e Parada 1.
- [x] **S6. Trecho 2** (`src/22-cases.js`, `src/23-scale.js`): 4 cases, estações 05 e 06 e Parada 2.
- [x] **S7. Trecho 3** (`src/24-final.js`): estação 07, clímax, letreiro final e encerramento.
- [x] **S8. QA completo + README:**
  - render de 0–350 s e de todas as paradas e itens, sem exceções e com o console limpo;
  - navegação testada: pré-show → abertura → Parada 0 (10 itens, ←) → embarque, setas ignoradas no vídeo, teclas 1–7, End;
  - corrigido um brilho que travava a abertura;
  - qualidade adaptativa para máquinas sem aceleração de vídeo.

**v3 concluída.** Próximo passo: revisão do usuário. Os materiais pendentes (Practice, Lights-off, demais tracks) entram pelo JSON.

## v4 — revisão do usuário (ver "O que mudou" no `STORYLINE.md`)

Ordem pensada para não haver retrabalho: primeiro o que muda os tempos (a música), depois o que todas as cenas usam, depois cada play, e por último os slides das paradas, que dependem das cenas prontas.

- [x] **E1. Música da estação 04 + linha do tempo:**
  - "Technology" remontada (`tools/edit_tech.py`), com calma → construção → drop por case;
  - cases de 53 a 62 s;
  - abertura de 10 s.
- [x] **E2. Fundações:**
  - batida contida, com picos por cena;
  - legendas de tela e cartões de conexão;
  - textos em português;
  - vagão, trem entre estações e painel "próxima estação".
- [x] **E3. Embarque + Parada 0 clicável.** O player trata clique, ponteiro e teclas nas paradas.
- [x] **E4. Estações 01–03:**
  - pergunta e conclusão na 01;
  - título do gráfico e cartão de conexão na 02;
  - projetos e ML preditivo/prescritivo na 03.
- [x] **E5. Os 4 cases reescritos + estações 05/06** (problema → dados → estratégia → como → solução no drop → impacto).
- [x] **E6. Estação 07, clímax e encerramento** com legendas.
- [x] **E7. Paradas clicáveis:**
  - zoom no cartaz;
  - miniaturas das cenas montadas;
  - popup que fecha.
- [x] **E8. QA:**
  - render de 0 a 461 s e de todas as paradas, sem exceções;
  - testes de clique (mapa, cartaz, miniatura, popup, Esc, setas) e de navegação;
  - README, STORYLINE e PROGRESS atualizados.

**v4 concluída.** Próximo passo: revisão do usuário.

## v5 — riqueza visual e ajustes dos cases (ver "O que mudou" no `STORYLINE.md`)

Ordem: primeiro a base que todas as cenas usam (pintura e luz), depois a personagem e a estação, depois o conteúdo.

- [x] **F1. Acabamento pintado, luz volumétrica, poeira e volume** (`src/12-paint.js`).
- [x] **F2. Personagem 2.5D, ratinho e pombo** (`src/13-people.js`).
- [x] **F3. Estação viva:** plataforma com eventos em paralelo nas paradas, na abertura e no pré-show.
- [x] **F4. Cases:**
  - respiro entre os cases;
  - matriz esparsa → ALS → cosseno nas cestas;
  - embeddings 3D na Manga;
  - analista no Lights-off;
  - Agentes sem restrição nem GPU.
- [x] **F5. Clímax por disciplinas** → "Analytics & Advanced Analytics".
- [x] **F6. QA:**
  - render de 0 a 461 s e de todas as paradas, sem exceções;
  - testes de navegação e de clique;
  - documentação atualizada.

**v5 concluída.** Próximo passo: revisão do usuário.

## v7 — experimento: "cada tela se explica sozinha" (branch `claude/mastercard-analytics-video-experimento`)

Base: roteiro criativo v7, com 4 escolhas da v5.4 mantidas:
- fraude híbrida;
- 8 disciplinas acumulando;
- letreiro WELCOME TO…;
- estação viva nas conversas.

A v5.4 continua intacta em `claude/mastercard-analytics-video-4cof1t`.

- [x] **E1. Base:**
  - música remontada para 9:11 (`tools/edit_music.py`) e batidas reanalisadas;
  - texto nítido depois da pintura (HUD) e roteiro de tela por cena (SAY);
  - linha laranja (LINE), câmera com paralaxe, diagramas nomeados (`src/14-v7.js`);
  - mini-mapa e painel de LED no canto direito.
- [x] **E2. Play 1, Conversa 0 e estações 01–03:**
  - embarque com o bilhete, missão e mapa com 3 capítulos;
  - ponte dos 4 serviços;
  - gráficos com eixo, unidade e base;
  - capabilities, preditivos × prescritivos.
- [x] **E3. Estação 04, os 4 cases, 05 e 06:**
  - explicação por etapa e base da comparação;
  - fraude híbrida;
  - ciclo dos agentes;
  - reuso;
  - pilares-viaduto com `contribution`.
- [x] **E4. Play 4 e conversas:**
  - cidade conectada, disciplinas acumulando, letreiro da v5.4;
  - cartazes legíveis com chamada e "A seguir…";
  - lupa com cenas em loop e catálogo de 20 modelos.
- [x] **E5. QA:**
  - medidor de leitura (`tools/read_check.js`): 72 telas, 0 curtas;
  - render de 0 a 551 s e de todas as conversas, sem exceções;
  - testes de navegação e de clique;
  - documentação reescrita para a v7.

**v7 concluída.**

### v7.1 — pedidos da revisão

- [x] **Músicas mais animadas** (`tools/remix.py`):
  - Technology com bateria, construções, drops com impacto, sidechain e graves;
  - funk e piano com graves, impactos e risers;
  - piano com percussão no clímax.
- [x] **Embarque:** o bilhete grande "DE dados → PARA valor" carimbado volta, como na v5.4, no lugar da linha de trem.
- [x] **QA e folhas de cenas:**
  - varredura sem erros e medidor de leitura (0 curtas);
  - folhas com as fotos de todas as cenas e conversas enviadas ao usuário.

### v7.2 — pedidos da revisão

- [x] **Sem personagem** (com soluções no lugar):
  - embarque com o bilhete sozinho;
  - um trem cruza a ponte da 01 e segue pela cidade da 07;
  - equipe da 05 em ícones planos;
  - fraude contada pela tela, pelo cursor e pelo interruptor, que desliga sozinho. Na festa, a cadeira vazia gira no foco de luz;
  - nenhum `PEOPLE.draw` no filme.
- [x] **Espaço 3D** (`SPACE` em `src/14-v7.js`):
  - campo de partículas com constelações, curva 3D em fita e objetos flutuando;
  - aplicado no mapa do embarque, 01, 02, 03, 04, cases, 05, 06, 07 e clímax;
  - gira com a câmera.
- [x] **Correções:**
  - entrada das conversas em "mergulho no escuro" (sem textos misturados; HUD com transformação/alfa de base);
  - faturamento sem a pincelada e sem o traço sobre os topos (agora um brilho);
  - ícones planos em "Onde aplicamos analytics";
  - embeddings sem moldura, com "um associado" sempre na tela;
  - fluxo da fraude sem rótulos encostando na tela;
  - "rodando sozinha" no lugar do contador de execuções;
  - painéis do clímax recuam na frase-chave.
- [x] **QA:**
  - varredura 0–551 s e conversas sem exceções;
  - medidor de leitura: 72 telas, 0 curtas;
  - navegação e clique ok;
  - folhas de fotos enviadas.

### v7.3 — dados mais anonimizados, aviso e entradas no tempo da música

- [x] **Prática em lorem ipsum:**
  - contribuições e entregas dos pilares;
  - também mascarados: fontes internas, motivos do Brasil, mecânicas de campanha, ferramentas do case Manga e "Mesa de Performance".
- [x] **Aviso de versão mockada:** fica no canto inferior esquerdo, vem de `presentation_context.disclaimer` e some com o campo vazio.
- [x] **Entradas no tempo da música** (`onBeat`, `beatsFrom` em `src/10-ui.js`):
  - **06:** um pilar por batida; grupos de cartões no começo do compasso e um cartão por batida;
  - **05:** nós no começo do compasso e um projeto por batida;
  - **07 e clímax:** painéis e disciplinas nas batidas;
  - **02 e 03:** barras e fachadas nas batidas;
  - a grade cobre a cena inteira, mesmo onde o detector parou.

### v7.4 — trilha da ElevenLabs

- [x] **Parte 1:** funk cinematográfico (versão 2) encaixado: drop em 105,897 s e viradas de estação no tempo forte.
- [x] **Parte 2:** depois do retorno do usuário ("o final muda o ritmo", "não pode mudar de sentido", "eletrônica demais para um evento"):
  - virou uma peça contínua;
  - clímax na IA, 05/06 voltam ao groove de abertura da peça.
- [x] **Parte 3:** final orquestral, opção A sem o coro (Demucs `htdemucs_ft`), com letreiro no acento de 59,81 s.
- [x] **Pipeline:**
  - `tools/eleven_fit.py` encaixa; `tools/music.py` usa a grade exata (`GRID`);
  - `tools/build.py` prefere `musica/parteN.mp3`;
  - o volume é o mesmo da trilha anterior.
- [x] **QA:**
  - varredura 0–551 s sem exceções;
  - medidor de leitura: 72 telas, 0 curtas;
  - navegação, clique e console limpos.

Próximo passo: o usuário compara com a v5.4 e decide qual linha seguir.

## Como retomar numa nova sessão

1. Faça checkout da branch: `claude/mastercard-analytics-video-experimento` (v7) ou `claude/mastercard-analytics-video-4cof1t` (v5.4).
2. Leia este arquivo, o `README.md` (arquitetura e contrato de tela) e o `STORYLINE.md`.
3. Continue a partir do primeiro item não marcado. Os parâmetros ficam em `src/01-config.js`; o kit de tela, em `src/14-v7.js`.
4. Rode `./build.sh`, depois `node tools/read_check.js`, e verifique o render da duração inteira sem exceções.
   - Os MP3 não estão no Git (`musica/`). Se não estiverem na máquina, peça os arquivos ao usuário ou extraia-os do HTML publicado.
   - As remontagens saem de `tools/edit_music.py`.
5. Faça commit e push, e marque o item aqui.

### v7.5 — drops naturais

- [x] **Parte 2:** depois do retorno do usuário ("várias vezes esse tipo de interferência"), refeita sem filtros.
  - Nova peça com dinâmica própria: introdução leve, quebra e volta da banda.
  - Montada só com trechos dela (`PARTE2_MAPA`): antes de cada solução, um trecho leve e a banda voltando.
  - Emendas em começo de compasso, sem cliques; trechos contíguos não têm emenda.
- [x] **Parte 3:** "sem fazer o DJ".
  - A opção A toca inteira: original até o coro e, depois, a versão sem coro.
  - Sem cortes, repetições ou cauda; o letreiro acende no acento de 59,97 s.
- [x] **Parte 1:** mantida (a quebra "rádio" antes da parte B funcionou).
- [x] **QA:**
  - varredura sem exceções;
  - medidor de leitura: 72 telas, 0 curtas;
  - navegação, clique e console limpos.

### v7.6 — parte 2 tocada inteira

- [x] **Parte 2:** depois do retorno do usuário ("evite ao máximo as edições artificiais"), a versão B toca inteira, do jeito que foi composta.
  - Sem cortes, repetições, filtros ou silêncios; só o nível (master) e 0,3 s de fade na cauda do acorde final.
  - A tentativa de gerar a parte em 5 trechos com os drops no lugar parou: os créditos da conta acabaram no meio da geração (voltaram 3 de 14 versões), e a versão do case 1 que voltou pôs o drop em 17 s, não em 47 s.
  - A grade (108 BPM, fase 0,01 s) e as seções do arquivo de batidas (17,8 · 195,6 · 240 s) saem da própria peça.
  - O interruptor da automação ficou só com o clique (sem os batimentos do antigo silêncio).
  - `tools/eleven_fit.py`: sem o `PARTE2_MAPA` e sem as funções que ficaram sem uso.
- [x] **Partes 1 e 3:** mantidas.
- [x] **QA:**
  - varredura sem exceções;
  - medidor de leitura: 72 telas, 0 curtas;
  - navegação, clique e console limpos.

### v7.7 — parte 2 com a opção A e parte 3 terminando junto com o vídeo

- [x] **Parte 2:** a opção A, como o usuário pediu, sem nada artificial na música.
  - As 5 versões por trecho tocam como foram compostas (`PARTE2_A` em `tools/eleven_fit.py`). A prévia antiga tinha abafamentos, filtros, pausas inseridas, riser e impacto, compassos repetidos e cortes secos; nada disso ficou.
  - Na música, só o deslocamento de cada versão inteira e o nível por versão. A versão do case 1 termina tocando e some no último compasso.
  - O filme foi reajustado à música:
    - case 1 com 53 s, com a solução no bloco novo da versão;
    - case 2 igual, com a subida na solução;
    - automação com 58 s: o interruptor na pausa composta (36,67) e o neon no drop (37,78);
    - IA com 56 s: a cena começa com o crescendo, o maior drop cai na escala (35,56), e as animações de AVALIAR e QUALIDADE ficaram ~20% mais rápidas;
    - 06: a conclusão no acorde final.
  - Parte 2: 4:42 (antes 5:04).
- [x] **Parte 3:** a música continua inteira; o filme se ajusta a ela.
  - Clímax com 26,4 s: as disciplinas em duas frases da orquestra e a frase-chave no grande prato (48,0 s).
  - Letreiro com 18,6 s: acende no prato da cadência final (67,2 s), e o vídeo termina com a cauda do acorde (71,4 s). Antes ficavam ~3 s de silêncio no fim.
- [x] **QA:**
  - varredura 0–528 s sem exceções;
  - medidor de leitura: 74 telas, 0 curtas;
  - navegação, clique e console limpos;
  - folhas de fotos das cenas reajustadas conferidas;
  - emendas da parte 2 sem cliques e sem silêncio no meio.

### v7.8 — tempos da música e correções visuais

- [x] **Disciplinas (clímax):** entram nos tempos fortes da parte 3, sem mudar a música.
  - Antes, as duas primeiras caíam no crescendo de entrada da orquestra, que não tem ataque.
  - Agora a fileira de cima entra uma por compasso a partir do compasso em que a batida começa (30,0 s), e a de baixo acelera, uma a cada 2 tempos.
  - A frase-chave entra no grande ataque (46,77 s, 1º tempo); antes caía 2 tempos depois, no prato sustentado.
- [x] **Pilares (06):** um cartão a cada 2 tempos (1º e 3º tempos do compasso), os 5 no mesmo ritmo; antes o 5º vinha depois de uma pausa.
- [x] **Principalidade:** o rótulo de um cartão de trás ("outro banco") é recortado pelos cartões da frente; antes aparecia por cima deles.
- [x] **Relatórios automatizados:** a caixa ANTES/DEPOIS mede as etiquetas e cresce para caber "montar o relatório".
- [x] **Para onde a linha segue (07):** o ponto que acompanhava a câmera e parecia preso virou um trem de dois vagões, que puxa a linha laranja pela cidade e freia na estação "?".
- [x] **QA:**
  - varredura sem exceções;
  - medidor de leitura: 77 telas, 0 curtas;
  - navegação, clique e console limpos;
  - folhas de fotos dos pontos corrigidos conferidas.

### v7.9 — ajustes de texto, dashboard real e trens

- [x] **Ponte (01):** "Implementação" virou "Execução" nos vãos, na lista dos 4 serviços, na descrição da estação e no cartaz da Conversa 1. A abertura ("negócio, analytics e implementação") ficou como estava.
- [x] **Relatórios automatizados:** no RESULTADO, um popup sai do monitor com o dashboard enviado ao board e volta para ele no fim.
  - A imagem é o arquivo `dashboard-fraude.png`, ao lado do HTML (campo `dashboard_image` do case "Lights-off"). No Git ela é ilustrativa; na cópia local, basta trocar o arquivo pelo real com o mesmo nome (v7.9.1: arquivo de imagem em vez de embutido no HTML, para a troca ser simples).
  - SOLUÇÃO, RESULTADO e PRÓXIMO PASSO foram redistribuídos para o popup ter ~5 s.
- [x] **Para onde a linha segue (07):** "Automatizar rotinas" vem antes de "Eficiência operacional · e ganho de escala" (que substituiu "Reutilizar ativos"); a grade que cresce virou a arte do ganho de escala.
- [x] **Trens:** o mesmo trem de dois vagões (`sideTrain`) atravessa a ponte e para do lado dos dados, e passa como monotrilho em cima do viaduto dos pilares.
- [x] **QA:**
  - varredura sem exceções;
  - medidor de leitura: 77 telas, 0 curtas;
  - navegação, clique e console limpos;
  - fotos dos trens, do popup (com o arquivo ilustrativo, com outra imagem no lugar e sem arquivo) e da 07 conferidas.

### v7.10 — perguntas da ponte e a recomendação passo a passo

- [x] **Ponte (01):** as perguntas dos cartões viraram "Como recomendar melhor?", "Como medir principalidade?" e "Como ganhar eficiência?" (uma para cada case), em até duas linhas.
- [x] **Cestas de produtos (case 1):** volta a explicação da recomendação da v5 (`src/legacy/13-scene-als.js`, na branch da v5.4), sem mudar nenhum tempo do case.
  - **DADOS:**
    - a matriz clientes × produtos (SKU), esparsa, com ícones;
    - as compras do histórico acendem;
    - a linha de um cliente e a coluna de um produto mostram o que é cada eixo;
    - nas células vazias aparecem "?": sem compra, o sinal é desconhecido;
    - as fichas com os números do histórico ficam ao lado.
  - **COMO FIZEMOS:**
    - R ≈ U · Vᵀ, com os fatores latentes;
    - o BM25 tira peso dos dois produtos mais comprados;
    - o ALS alterna "fixa V → resolve U" e "fixa U → resolve V", com a fórmula e o erro caindo até convergir;
    - resolvida, a matriz inicial volta completa ("lacunas → propensões").
  - **SOLUÇÃO:** no drop, as estrelas das recomendações; em seguida, as cestas e os públicos (entram ~1,6 s depois).
  - Saíram os recibos, a matriz anterior e a similaridade de cosseno.
- [x] **QA:**
  - varredura sem exceções;
  - medidor de leitura: 77 telas, 0 curtas;
  - navegação, clique e console limpos;
  - fotos de cada passo conferidas.

### v7.11 — clusters 3D, agentes e clímax da v5; estação futurista, trem bala e telas mais sóbrias

- [x] **Principalidade (case 2):** os clusters 3D da v5 (`src/legacy/14-scene-embed.js`) no COMO FIZEMOS, nos mesmos tempos:
  - produtos soltos → UMAP (eixos dim 1/2/3 … dim 128) → K-Means com as 4 famílias;
  - "proximidade = afinidade", cos θ alto (CDB e LCI) e baixo (Cashback e Consignado), d_cos;
  - um associado percorre a trilha até o núcleo de principalidade.
- [x] **Agentes de IA (case 4):** GERAR e AVALIAR E CORRIGIR com a animação da v5 (`src/legacy/12-scene-insights.js`):
  - geradores leem o relatório e os painéis e escrevem;
  - o Validador reprova (✕ e o motivo) e os rascunhos voltam pela seta "refazer";
  - saem as versões 2 e o Validador aprova;
  - o Embalador fecha o título, que entra no DESTAQUE do relatório e como faixa no painel;
  - no canto inferior esquerdo fica a pilha de painéis gerados pela automação (a imagem `dashboard_image`, com o contador).
- [x] **Clímax:** 5 cases (Mesa de performance, Prevenção a fraude, Segmentação / Recomendação, Forecast, Pricing / dimensionamento):
  - entram um por compasso e viram 2 tempos depois (frente: case e método; verso: técnicas);
  - a frase-chave segue no grande ataque.
- [x] **Estação das conversas:**
  - futurista, arejada e verde, ao ar livre (cobertura de nervuras brancas e vidro, cidade clara, jardins, árvores, painéis brancos);
  - um trem bala passa ao longe;
  - saíram ratinho, pombo, goteira, luz piscando, papéis voando e grafites.
- [x] **Trem bala:** dois vagões com nariz aerodinâmico em todas as cenas com trem.
- [x] **Telas com gráfico minimalistas:**
  - sem fachos de luz, poeira, partículas, objetos flutuando, fitas 3D, grade neon, rastros e prédios;
  - a cidade só aparece onde o trem passa;
  - barras chapadas e números-manchete sem respingo.
- [x] **Tempos e música:** nenhum tempo de cena mudou; as músicas embutidas são idênticas às da v7.10.
- [x] **QA:**
  - varredura sem exceções (528,14 s);
  - medidor de leitura: 79 telas, 0 curtas;
  - navegação, clique e console limpos;
  - fotos de cada cena, das paradas e dos trens conferidas.

### v7.12 — textos, sem tinta, o eixo da v5 no clímax e ajustes de layout

- [x] **Textos:**
  - saem o "PRÓXIMA PARADA" do letreiro final e o aviso de LED antes das conversas;
  - "Linha Performance Analytics" vira "Performance Analytics" no bilhete, no pré-show e no painel da estação;
  - a frase final vira "Tudo se resume a *Analytics*.".
- [x] **Sem tinta:**
  - os títulos em pincelada viraram faixas lisas;
  - saíram os respingos do letreiro;
  - saiu a textura de pinceladas sobre o quadro (`motion.strokes` = 0; a gradação e o brilho ficam);
  - a coroa da carteira é uma forma limpa.
- [x] **Clímax:** volta o eixo da v5 (`src/legacy/17-scenes-end.js`), escolhido para o grande ataque, junto da frase:
  - 12 técnicas do mais simples ao mais complexo;
  - uma varredura acende cada técnica até o último tempo forte (25,17 s);
  - a música não muda.
- [x] **Relatórios automatizados:** a imagem do dashboard sai do centro.
  - Os painéis saem do monitor e se empilham no canto inferior esquerdo, com o contador.
  - O ANTES × DEPOIS fica compacto, ao lado.
  - A tela não escurece, e o equalizador saiu.
- [x] **Case de IA:** volta o dashboard desenhado da v5 (a imagem fica no case de relatórios).
- [x] **07:** as outras linhas correm alinhadas, paralelas à linha laranja, e sobem a 45° até a estação; o painel 07 do encerramento fica reto.
- [x] **05:** o leque de linhas sai da borda direita do ativo reutilizável, sem passar por cima do ícone.
- [x] **QA:**
  - varredura sem exceções (528,14 s);
  - medidor de leitura: 79 telas, 0 curtas;
  - navegação, clique e console limpos;
  - músicas idênticas às da v7.11.
