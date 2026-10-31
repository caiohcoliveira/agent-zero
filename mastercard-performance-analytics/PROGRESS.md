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
- [ ] **S8. QA completo + README:** varredura de render, navegação com passador, loops; README e roteiro atualizados.

## Como retomar numa nova sessão

1. Faça checkout da branch `claude/mastercard-analytics-video-4cof1t`.
2. Leia este arquivo, o `README.md` (arquitetura v3) e o `STORYLINE.md` (v3.3).
3. Continue a partir do primeiro item não marcado. Os parâmetros ficam em `src/01-config.js`.
4. Rode `./build.sh` e faça a verificação: o render da duração inteira deve sair sem exceções. Os MP3 das músicas não estão no Git (`musica/`): se não estiverem na máquina, peça os arquivos ao usuário ou extraia-os do HTML publicado.
5. Faça commit e push, e marque o item aqui.
