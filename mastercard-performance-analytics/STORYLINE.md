# A Interseção — Storyline v2

**Vídeo:** Performance Analytics · Mastercard · 4:00 · 1920×1080 · HTML único offline
**Status:** v2 com os ajustes da revisão do vídeo v1 (ver "O que mudou")

---

## O que mudou da v1 para a v2

1. **Narração:** continua sendo a voz do navegador, mas vem **desligada por padrão** (botão "Voz" ou tecla V).
2. **Abertura:** as frases passam a ser o desafio principal de hoje — **Eficiência operacional · Automação e escala · Ciência de dados · Inteligência artificial · Gerar valor**.
3. **Nova ordem dos casos:**
   1. Recomendação (ALS)
   2. Principalidade (embeddings)
   3. Lights-off reporting
   4. **Insights em escala**

   Os insights vêm depois dos reports porque os reports automatizados usam os insights em escala, e esses insights se conectam a qualquer processo.
4. **Insights em escala:** a cena mostra transformers puros rodando em **GPU**, com **vários modelos** por trás, num **perímetro fechado: o dado nunca sai da Mastercard**.
5. **Easter eggs técnicos:**
   - distância do cosseno;
   - gradiente descendente;
   - atualização fechada do ALS;
   - atenção dos transformers;
   - Gini, z-score, InfoNCE, uplift, Bellman e message passing.

   Aparecem como fórmulas coladas na cena, sem explicação.
6. **"Outras formas de colaborar":** três ondas de modelos, mostradas sem verbalizar, para passar a ideia de possibilidades infinitas.
   - Issuer / Acquirer;
   - capacidades analíticas;
   - estado da arte.
7. **Visual:** retrô-moderno com a identidade Mastercard.
   - colagem de papel recortado, contornos fortes, sombras chapadas, meio-tom, fita adesiva e stickers;
   - elementos **futuristas** (neon, grid em perspectiva, scanlines) quando o assunto é modelo.
8. **Final:** sai o "Use mais esta track". Entra um letreiro de **split-flap** (letras virando) com a sequência:
   - Welcome to the future
   - Welcome to AI
   - Welcome to analytics
   - **Performance Analytics**

---

## Visão geral

| # | Cena | Tempo | Dur. | Clima |
|---|------|-------|------|-------|
| 1 | Hook — os 5 desafios | 0:00–0:18 | 18s | colagem escura → pôster |
| 2 | O problema (4 perguntas) | 0:18–0:36 | 18s | papel claro |
| 3 | Quem somos (a interseção) | 0:36–0:56 | 20s | escuro, drop |
| 4 | Caso 01 · Recomendação (ALS) | 0:56–1:30 | 34s | escuro + futurista |
| 5 | Caso 02 · Principalidade (embeddings) | 1:30–2:00 | 30s | papel → espaço neon |
| 6 | Caso 03 · Lights-off reporting (fraude) | 2:00–2:26 | 26s | papel → apagão → neon |
| 7 | Caso 04 · Insights em escala (multiagentes) | 2:26–3:00 | 34s | neon + colagem |
| 8 | Possibilidades (3 ondas de modelos) | 3:00–3:22 | 22s | colagem → futurista → ∞ |
| 9 | Clímax | 3:22–3:42 | 20s | cortes no beat |
| 10 | Fechamento — split-flap | 3:42–4:00 | 18s | letreiro retrô |

---

## Storyboard e narração

Tempos de narração em segundos **locais** da cena (igual a `src/01-config.js`).

### 1 · Hook (18s)
- **Visual:** ponto laranja pulsando, que explode numa tempestade de recortes de dados. Os 5 desafios são colados um a um como tiras de papel com contorno e sombra chapada. No fim, as tiras viram um pôster de colagem, com "Gerar valor" em laranja.
- **Narração:**
  - `3.4` Hoje, o nosso desafio tem cinco nomes.
  - `6.5` Eficiência operacional.
  - `8.0` Automação e escala.
  - `9.5` Ciência de dados.
  - `11.0` Inteligência artificial.
  - `12.6` E, acima de tudo: gerar valor.

### 2 · O problema (18s)
- **Visual:** clientes recortados no topo e 4 cards-pergunta na nova ordem. Post-its se acumulam até que um ímã puxa tudo, e os cards viram os chips 01–04.
- **Narração:**
  - `0.3` Em cada cliente, em cada contexto, a pergunta muda.
  - `4.0` Como recomendar melhor?
  - `6.0` Como medir principalidade?
  - `8.0` Como ganhar eficiência?
  - `10.0` Como gerar insights em escala?
  - `12.4` Mas a necessidade é sempre a mesma: transformar complexidade em decisão.

### 3 · Quem somos (20s)
- **Visual:**
  - círculos Negócio e Dados em meio-tom com contorno colidem, e a interseção acende;
  - surge o hub "Performance Analytics", com satélites, a cadeia Dados → Insights → Decisão → Impacto e os chips em anel;
  - mergulho no chip 01.
- **Narração:**
  - `1.0` É exatamente aqui que entra a track de Performance Analytics da Mastercard.
  - `7.2` No encontro entre dados e negócio, conectamos modelos, tecnologia e estratégia…
  - `12.8` …para transformar dados em insights, insights em decisões — e decisões em impacto real.

### 4 · Caso 01 · Recomendação / ALS (34s)
- **Visual:** a sequência é matriz cliente×SKU esparsa → R ≈ U·Vᵀ → alternância do ALS com a curva de erro caindo → recombinação (as lacunas viram propensões) → espaço latente → cesta entregue.
- **Easter eggs:**
  - `uᵢ = (VᵀV + λI)⁻¹ Vᵀ rᵢ`
  - `c = 1 + α·r` (implicit feedback)
  - `k = 64`
  - `score = uᵀv`
  - `top-k`
- **Narração:**
  - `1.0` Primeiro desafio: recomendação. Num cliente do varejo: quais SKUs e cestas recomendar para cada cliente?
  - `7.2` Cada linha é um cliente. Cada coluna, um produto. E quase toda a matriz… está vazia.
  - `12.9` Com fatoração de matrizes — o ALS — decompomos a matriz em fatores ocultos, alternando o ajuste entre clientes e produtos até o padrão emergir.
  - `23.0` As lacunas viram propensões.
  - `26.6` E, no espaço latente, cada cliente se aproxima da cesta certa.

### 5 · Caso 02 · Principalidade / Embeddings (30s)
- **Visual:**
  - prateleira de 24 produtos financeiros do issuer → cada produto vira um vetor;
  - treino com **gradiente descendente** (contornos de erro com a bola descendo);
  - decolagem para o espaço 3D neon → clusters (Dia a dia, Investimentos, Crédito, Proteção);
  - **distância do cosseno** → trilha até o núcleo de principalidade.
- **Easter eggs:**
  - `e = f(produto) ∈ ℝ¹²⁸`
  - `θ ← θ − η∇L(θ)`
  - InfoNCE
  - `cos θ = a·b / ‖a‖‖b‖`
  - `d = 1 − cos θ`
  - UMAP
- **Narração:**
  - `1.0` Segundo desafio: principalidade — entender como os produtos financeiros se relacionam.
  - `7.0` Com embeddings, deixamos de olhar itens isolados: cada produto vira um vetor, num espaço de muitas dimensões.
  - `15.0` Ali, proximidade — medida pela distância do cosseno — significa afinidade. Produtos parecidos se agrupam…
  - `22.0` …e padrões invisíveis viram um mapa claro para decisões de principalidade.

### 6 · Caso 03 · Lights-off reporting (26s)
- **Visual:**
  - "antes" caricato (planilhas, Ctrl+C/Ctrl+V, cafés, 87%);
  - **CLICK**: as luzes apagam e um pipeline neon leva do dado ao board;
  - o report chega todo mês, seguido do antes × depois e do carimbo;
  - o nó **Insights** pulsa com um "?" e a câmera mergulha nele, o que leva ao caso 04.
- **Easter eggs:**
  - `SQL · parquet`
  - `z = (x − μ)/σ`
  - `score > τ → alerta`
  - `DAG ⟳`
  - `cron`
- **Narração:**
  - `1.0` Terceiro desafio: eficiência. O report de fraude para o board exigia trabalho manual: extrair, conferir, formatar… repetir.
  - `9.6` Então criamos uma automação lights-off.
  - `14.0` Os dados chegam, são validados, processados… e o report é publicado sozinho, do dado ao board.
  - `22.2` Mas quem escreve os destaques do report?

### 7 · Caso 04 · Insights em escala (34s)
- **Visual:**
  - dentro do nó Insights: os 3 geradores (Analista, Business, C-Level) → Validador (reprova, manda refazer, aprova) → Embalador;
  - o título pronto vai para o **report**, para o **dashboard** e para **qualquer processo** (CRM, e-mail, app, API, alertas, slides);
  - **por baixo do capô** (futurista):
    - bloco transformer com o mapa de atenção;
    - placa de **GPU** acendendo;
    - **vários modelos** (LLM, Embeddings, Reranker, Classificador, Guardrails);
    - tudo dentro do **perímetro "Ambiente Mastercard"**, com o cadeado. Pacotes batem na borda e voltam: o dado nunca sai;
  - escala e carimbo.
- **Easter eggs:**
  - `Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V`
  - `CUDA · FP16 · batch`
  - `self-hosted`
- **Narração:**
  - `0.8` Quarto desafio: insights em escala.
  - `3.4` Três agentes geradores — analista, business e C-level — escrevem o insight.
  - `8.6` Um validador confere — e, se não estiver bom, manda refazer.
  - `12.8` Um embalador entrega o título pronto: no report, no dashboard, em qualquer processo.
  - `18.8` Por trás, transformers puros rodando em GPU, com vários modelos trabalhando juntos…
  - `24.2` …e o dado nunca sai da Mastercard.
  - `27.4` Insights em escala, conectáveis a qualquer processo.

### 8 · Possibilidades (22s) — mostrado, não verbalizado
- **Onda 1:** dois painéis de colagem.
  - **Issuer:** Fraud · Credit Risk · Authorization · AML · Collections
  - **Acquirer:** Fraud · Merchant Risk · Authorization Optimization · Smart Routing · Chargeback
- **Onda 2:** stickers — embeddings · anomaly detection · spend forecasting · customer similarity · merchant similarity · product affinity · share of wallet · incrementality · attribution · assortment optimization.
- **Onda 3:** tags neon sobre grid futurista — causal ML · uplift modeling · reinforcement learning · graph fraud · graph embeddings · deep recommenders · dynamic pricing · real-time personalization · multi-objective optimization. Fórmulas soltas: uplift τ(x), Q-learning e GNN.
- **Fecho:** tudo vira um tile de um mosaico que se repete ao infinito (∞).
- **Narração:**
  - `1.0` E esses são só alguns exemplos.
  - `8.0` Do issuer ao acquirer… do clássico ao estado da arte.

### 9 · Clímax (20s)
- **Visual:** 12 cortes no beat, cada um com uma fórmula colada:
  - Estatística
  - Regressão
  - Classificação
  - Árvores
  - Ensembles
  - Clusters
  - Anomalias
  - Otimização (gradiente descendente)
  - Embeddings
  - Transformers
  - Agentes
  - Automação

  Depois: eixo simples ●──● complexo → anel → "Nossa especialidade é analytics".
- **Narração:**
  - uma palavra por corte;
  - `10.4` Não importa o desafio. Dos problemas mais simples aos mais complexos…
  - `15.4` …nossa especialidade é resolver com analytics, criatividade e escala.

### 10 · Fechamento — split-flap (18s)
- **Visual:**
  - a interseção volta;
  - um letreiro retrô de placas vira letra por letra:
    - WELCOME TO THE FUTURE
    - WELCOME TO **AI**
    - WELCOME TO **ANALYTICS**
    - PERFORMANCE **ANALYTICS**
  - termina no ponto laranja da abertura.
- **Narração:**
  - `1.0` Se o desafio pede eficiência, escala e valor, a resposta passa por Performance Analytics.
  - O letreiro fica sem voz, só com os golpes da trilha.

---

## Direção visual v2 — retrô-moderno, identidade Mastercard

- **Paleta:** vermelho `#EB001B`, laranja `#FF5F00`, amarelo `#F79E1B`, tinta `#1A1714`, papel `#F3EBDD`.
- **Colagem:**
  - papel com fibras e granulação;
  - recortes com contorno de tinta;
  - sombras chapadas deslocadas (sem blur);
  - meio-tom (halftone);
  - fita adesiva, stickers e tiras de texto recortadas.
- **Futurista** (quando o assunto é modelo): grid em perspectiva neon, scanlines, brilho e etiquetas holográficas.
- **Círculos Mastercard** em meio-tom com contorno, como motivo central.
- **Números de tela** são ilustrativos. As fórmulas são reais e servem de easter eggs para o público técnico.
