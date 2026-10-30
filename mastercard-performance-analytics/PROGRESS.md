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
- [ ] **E3. Config v2:**
  - voz desligada por padrão;
  - nova ordem dos casos e novos tempos;
  - nova narração;
  - trilha por cena;
  - hook com os 5 desafios.
- [ ] **E4. Easter eggs no ALS e nos embeddings:** atualização do ALS, cosseno, gradiente descendente, InfoNCE.
- [ ] **E5. Lights-off:** sem agentes, com easter eggs e mergulho no nó Insights.
- [ ] **E6. Insights em escala:**
  - destinos (report, dashboard, qualquer processo);
  - transformers + GPU + vários modelos + perímetro "o dado nunca sai".
- [ ] **E7. Cena "Possibilidades":** 3 ondas de modelos → ∞.
- [ ] **E8. Clímax** (fórmulas, Otimização, Transformers) **+ fechamento split-flap** (Welcome to…).
- [ ] **E9. QA completo + README atualizado.**

## Como retomar numa nova sessão

1. Faça checkout da branch `claude/mastercard-analytics-video-4cof1t`.
2. Leia este arquivo e o `STORYLINE.md` (v2).
3. Continue a partir do primeiro item não marcado. Os parâmetros ficam em `src/01-config.js`.
4. Rode `./build.sh` e faça a verificação: o render de 0–240 s deve sair sem exceções.
5. Faça commit e push, e marque o item aqui.
