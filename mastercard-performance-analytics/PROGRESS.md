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

- [x] **S1. Storyline v3 (proposta):** 7 estações, 3 blocos, 2 paradas, dados fictícios. **Aguardando validação do usuário.**
- [ ] **S2. Config v3:**
  - cenas, tempos e textos;
  - `CONFIG.data` com todos os números fictícios;
  - paradas (`autoPause`);
  - nova narração.
- [ ] **S3. Player:**
  - pausa automática com quadro vivo;
  - marcas de estação e parada na barra;
  - teclas 1–7.
- [ ] **S4. Componentes:**
  - letreiro de estação (split-flap);
  - mapa da linha e mini-mapa;
  - régua do caso;
  - comprovante de impacto.
- [ ] **S5. Bloco 1:**
  - abertura com o trem;
  - mapa;
  - estações 01, 02 e 03 (tracks + tipos de projeto + 3 ondas → ∞);
  - parada 1.
- [ ] **S6. Estação 04:** abertura + casos 1–3 com a moldura Problema → Insight → Entrega → Impacto.
- [ ] **S7. Estação 05:** multiagentes + GPU + escala + esteira de inovação.
- [ ] **S8. Estação 06 · Prática:** placeholders até chegarem os materiais da Nat. Depois, parada 2.
- [ ] **S9. Estação 07 + clímax + fechamento split-flap.**
- [ ] **S10. QA completo + README.**

## Como retomar numa nova sessão

1. Faça checkout da branch `claude/mastercard-analytics-video-4cof1t`.
2. Leia este arquivo e o `STORYLINE.md` (v3).
3. Continue a partir do primeiro item não marcado. Os parâmetros ficam em `src/01-config.js`.
4. Rode `./build.sh` e faça a verificação: o render da duração inteira deve sair sem exceções.
5. Faça commit e push, e marque o item aqui.
