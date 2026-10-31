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
- [ ] **S2. Config v3:**
  - cenas, tempos e textos;
  - `CONFIG.data` com os números fictícios;
  - trechos e paradas;
  - narração opcional.
- [ ] **S3. Player em modo apresentação:**
  - trechos lineares + paradas em loop;
  - cartazes navegáveis com setas ou passador;
  - transições contínuas;
  - `mode: 'show' | 'reel'`;
  - atalhos de operador.
- [ ] **S4. Componentes:**
  - letreiro de estação;
  - mapa e mini-mapa;
  - plataforma com cartazes;
  - régua do caso;
  - comprovante de impacto.
- [ ] **S5. Trilha:**
  - temas A e B (faixa escolhida ou tema original);
  - SFX de metrô;
  - silêncio nas paradas.
- [ ] **S6. Abertura + Parada 0:** mapa navegável, com o pré-show opcional.
- [ ] **S7. Trecho 1:** estações 01–03 + Parada 1 (3 cartazes).
- [ ] **S8. Trecho 2:**
  - estação 04 (casos 1–3);
  - estação 05;
  - estação 06 (placeholders até os materiais da Nat);
  - Parada 2 (3 cartazes).
- [ ] **S9. Trecho 3:** estação 07, clímax, split-flap e encerramento em loop.
- [ ] **S10. QA completo + README:** inclui loops sem emenda e navegação com passador.

## Como retomar numa nova sessão

1. Faça checkout da branch `claude/mastercard-analytics-video-4cof1t`.
2. Leia este arquivo e o `STORYLINE.md` (v3).
3. Continue a partir do primeiro item não marcado. Os parâmetros ficam em `src/01-config.js`.
4. Rode `./build.sh` e faça a verificação: o render da duração inteira deve sair sem exceções.
5. Faça commit e push, e marque o item aqui.
