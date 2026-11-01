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
  - embarque com a analista e o bilhete, missão e mapa com 3 capítulos;
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

**v7 concluída.** Próximo passo: o usuário compara com a v5.4 e decide qual linha seguir.

## Como retomar numa nova sessão

1. Faça checkout da branch: `claude/mastercard-analytics-video-experimento` (v7) ou `claude/mastercard-analytics-video-4cof1t` (v5.4).
2. Leia este arquivo, o `README.md` (arquitetura e contrato de tela) e o `STORYLINE.md`.
3. Continue a partir do primeiro item não marcado. Os parâmetros ficam em `src/01-config.js`; o kit de tela, em `src/14-v7.js`.
4. Rode `./build.sh`, depois `node tools/read_check.js`, e verifique o render da duração inteira sem exceções.
   - Os MP3 não estão no Git (`musica/`). Se não estiverem na máquina, peça os arquivos ao usuário ou extraia-os do HTML publicado.
   - As remontagens saem de `tools/edit_music.py`.
5. Faça commit e push, e marque o item aqui.
