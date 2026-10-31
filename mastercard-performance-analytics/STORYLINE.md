# A Linha — Storyline v3

**Vídeo:** Performance Analytics · Mastercard · ~5:45 sem contar as paradas · 1920×1080 · HTML único offline
**Estrutura:** 7 estações em 3 blocos, com 2 paradas automáticas para conversa ao vivo
**Status:** **proposta para validação**. Nada da v3 foi implementado. O HTML atual ainda é a v2, cujo roteiro está no histórico (commit `20e1d96`).

Marcadores usados no texto:
- **[v2]** reaproveita uma cena da v2, com ajustes;
- **[nova]** cena nova;
- **[fictício]** número inventado, que deve ser trocado;
- **[a confirmar]** depende de material ou de confirmação de vocês.

---

## O que muda da v2 para a v3

1. **Estrutura:** 7 tópicos em 3 blocos.
   - Há uma parada automática depois do tópico 3 e outra depois do 6.
   - Na parada, o vídeo congela num quadro vivo e em silêncio, para quem apresenta conversar com a plateia.
   - ▶ ou espaço segue o vídeo.
2. **Fio condutor:** a track vira uma linha de metrô.
   - Cada tópico é uma estação, anunciada pelo letreiro split-flap.
   - O letreiro do final deixa de ser uma novidade solta e vira o payoff do vídeo inteiro.
3. **Conteúdo novo:**
   - o papel estratégico de analytics (01);
   - a evolução e os números da track (02);
   - o portfólio e a sinergia com as demais tracks (03);
   - a Prática (06);
   - o futuro (07).
4. **Cases:** cada um segue a moldura Problema → Insight → Entrega → Impacto e fecha num "comprovante de impacto" impresso como cupom de maquininha.
5. **Mantido da v2:**
   - abertura com os 5 desafios;
   - reports automatizados antes dos insights em escala;
   - transformers em GPU, com o dado que nunca sai;
   - easter eggs técnicos;
   - as 3 ondas de modelos, sem verbalizar;
   - final em split-flap;
   - voz desligada por padrão.
6. **Sai da v2:**
   - a cena das 4 perguntas e os chips 01–04. As perguntas viram post-its na estação 01, e cada case abre com o próprio problema;
   - "Possibilidades" como cena isolada. As ondas passam para a estação 03.
7. **Duração:** passa de 4:00 para ~5:45. Há uma opção de corte para ~5:00 no fim deste documento.

---

## Fio condutor: a linha (proposta)

- **Mapa da linha (agenda):**
  - pôster retrô de metrô em papel recortado;
  - uma linha grossa em 3 trechos de cor: **vermelho** (bloco 1), **laranja** (bloco 2) e **amarelo** (bloco 3);
  - 7 estações. As 2 paradas são estações de baldeação desenhadas como os **dois círculos entrelaçados** da Mastercard.
- **Letreiro de estação:**
  - cada tópico abre com o split-flap virando para "0X · NOME CURTO", com o título completo numa tira de papel embaixo;
  - toca o "plim-plom" de metrô;
  - fica sobreposto aos primeiros 2–3s da cena, sem custo de tempo.
- **Mini-mapa:**
  - fica no canto da tela e mostra a estação atual, com o trem (ponto laranja);
  - substitui os chips 01–04 da v2;
  - na estação 04, ganha três marquinhas, uma para cada caso.
- **Alternativa sem metáfora:** se preferir, as estações viram capítulos numerados com o mesmo letreiro. O resto do roteiro não muda.

---

## Visão geral

| # | Cena | Tempo | Dur. |
|---|------|-------|------|
| | **Bloco 1 · trecho vermelho — quem somos** | | |
| 1 | Abertura — o nosso desafio hoje | 0:00–0:16 | 16s |
| 2 | A linha (agenda) | 0:16–0:26 | 10s |
| 3 | 01 · Analytics as a Strategic Consulting Capability | 0:26–0:50 | 24s |
| 4 | 02 · Our Evolution & Business Impact | 0:50–1:18 | 28s |
| 5 | 03 · What We Bring to the Market | 1:18–1:56 | 38s |
| P1 | **Parada 1** | 1:56–2:00 | 4s + espera |
| | **Bloco 2 · trecho laranja — o que fazemos e como escalamos** | | |
| 6 | 04 · Analytics in Action: From Data to Impact (abertura) | 2:00–2:05 | 5s |
| 7 | Caso 1 · Varejo — recomendação (ALS) | 2:05–2:37 | 32s |
| 8 | Caso 2 · Issuer — principalidade (embeddings) | 2:37–3:07 | 30s |
| 9 | Caso 3 · Fraude — lights-off reporting | 3:07–3:33 | 26s |
| 10 | 05 · Scaling Our Impact Through Data, AI & Innovation | 3:33–4:13 | 40s |
| 11 | 06 · A Prática | 4:13–4:39 | 26s |
| P2 | **Parada 2** | 4:39–4:43 | 4s + espera |
| | **Bloco 3 · trecho amarelo — para onde vamos** | | |
| 12 | 07 · The Future of Analytics | 4:43–5:11 | 28s |
| 13 | Clímax | 5:11–5:27 | 16s |
| 14 | Fechamento — split-flap | 5:27–5:43 | 16s |

Tempo de vídeo por bloco: **2:00 + 2:43 + 1:00 = 5:43**, sem contar o tempo de conversa nas paradas.

---

## Storyboard e narração

Os tempos de narração estão em segundos **locais** da cena. A narração continua opcional e desligada por padrão. O texto também serve de roteiro para quem apresenta.

### Bloco 1 · Trecho vermelho — quem somos

#### 1 · Abertura — o nosso desafio hoje (16s) [v2]
- **Visual:** como na v2, mais enxuta:
  1. o ponto laranja pulsa;
  2. uma tempestade de recortes de dados;
  3. o sticker "O NOSSO DESAFIO HOJE";
  4. as 5 tiras coladas uma a uma;
  5. o pôster, com "Gerar valor" circulado em laranja.
- **Novo:** o círculo laranja encolhe e vira o trem, que parte para o mapa.
- **Na tela:** Eficiência operacional · Automação e escala · Ciência de dados · Inteligência artificial · Gerar valor
- **Narração:**
  - `2.6` Hoje, o nosso desafio tem cinco nomes.
  - `5.4` Eficiência operacional.
  - `6.8` Automação e escala.
  - `8.2` Ciência de dados.
  - `9.6` Inteligência artificial.
  - `11.2` E, acima de tudo: gerar valor.

#### 2 · A linha (10s) [nova]
- **Visual:**
  - o mapa da linha se monta em colagem: trilho, estações e rótulos;
  - o letreiro vira para "LINHA PERFORMANCE ANALYTICS";
  - o trem parte, e a câmera desliza pelo trilho até a estação 01.
- **Na tela:** 01 Strategic Capability · 02 Evolution & Impact · 03 What We Bring · ◎ Parada · 04 Analytics in Action · 05 Scaling Our Impact · 06 A Prática · ◎ Parada · 07 Future of Analytics
- **Narração:**
  - `0.8` A nossa track é uma linha com sete estações…
  - `4.6` …e duas paradas para conversar.

#### 3 · Estação 01 — Analytics as a Strategic Consulting Capability (24s) [v2: cenas 2–3 reescritas]
- **Visual:**
  - post-its com perguntas de negócio se acumulam num quadro de cortiça: "Por que caiu?", "Quem priorizar?", "Onde investir?", "Qual o risco?", "E se…?";
  - os círculos Mastercard em meio-tom, **Negócio** (vermelho) e **Dados** (amarelo), colidem. A interseção laranja acende: "Performance Analytics";
  - a cadeia **Dados → Decisões → Impacto → Valor** é carimbada elo a elo;
  - um fio vermelho, estilo quadro de investigação, amarra cada post-it à cadeia: toda pergunta termina em valor.
- **Na tela:** sticker "do diagnóstico à mensuração".
- **Narração:**
  - `0.6` Próxima estação: analytics como capacidade estratégica da consultoria.
  - `5.0` Todo projeto começa com uma pergunta de negócio.
  - `10.0` E é no encontro entre a pergunta e o dado que a gente atua.
  - `16.0` Transformamos dados em decisões, decisões em impacto… e impacto em valor para o cliente.

#### 4 · Estação 02 — Our Evolution & Business Impact (28s) [nova] [fictício]
- **Visual:**
  - a linha do tempo é um trilho de 2022 a 2026, e o trem passa por 5 estações-ano. Em cada uma:
    - um selo postal com o marco do ano;
    - bonequinhos recortados empilhados com o tamanho do time: 4 → 7 → 11 → 16 → 23;
  - por cima, uma linha neon de receita sobe;
  - um placar split-flap vira 4 números: **23** pessoas · **140+** projetos · **62%** dos engagements · **US$ 12,4 mi** de receita;
  - numa fileira de 10 cards de engagement, 6 ganham o sticker laranja de analytics ("eram 15% em 2022").
- **Marcos** [a confirmar]:
  - 2022: a track nasce, com 4 pessoas, e o primeiro modelo de fraude entra em produção;
  - 2023: primeiro recomendador no varejo;
  - 2024: índice de principalidade com embeddings;
  - 2025: reports lights-off para o board;
  - 2026: agentes de insights e transformers privados em GPU.
- **Easter egg:** `CAGR = (12,4 / 2,1)^(1/4) − 1 ≈ 56%`
- **Narração:**
  - `0.6` Próxima estação: a nossa evolução.
  - `3.4` Em quatro anos, o time foi de quatro para vinte e três pessoas…
  - `8.6` …e cada ano deixou um marco, do primeiro modelo em produção aos agentes de IA.
  - `15.6` Mais de cento e quarenta projetos entregues — e uma receita seis vezes maior.
  - `21.8` Hoje, analytics está em seis de cada dez engagements.

#### 5 · Estação 03 — What We Bring to the Market (38s) [nova + v2: cena 8]
- **(a) Analytics × as demais tracks (≈9s):**
  - analytics fica no centro, e as outras tracks ficam em volta, como círculos em meio-tom;
  - cada sobreposição acende uma lente laranja com a oferta conjunta [a confirmar os nomes das tracks]:
    - Estratégia ∩ Analytics → business case com dados
    - Marketing & Fidelidade ∩ Analytics → segmentação e recomendação
    - Risco & Fraude ∩ Analytics → modelos de fraude e crédito
    - Digital & Pagamentos ∩ Analytics → personalização em tempo real
    - Operações ∩ Analytics → automação lights-off
- **(b) Tipos de projeto (≈5s):** 5 bilhetes de embarque carimbados:
  - Diagnóstico & sizing
  - Modelos preditivos
  - Segmentação & personalização
  - Test & learn / incrementalidade
  - Automação & IA
- **(c) Portfólio em 3 ondas (≈21s, mostrado e não verbalizado):** as ondas da v2, agora com rótulos.
  - **PRODUTOS:** os painéis Issuer e Acquirer;
  - **CAPABILITIES:** os stickers analíticos;
  - **FRONTEIRA:** as tags neon do estado da arte e as fórmulas soltas.

  No fim, tudo vira um tile do mosaico infinito (∞).
- **Narração:**
  - `0.6` Próxima estação: o que levamos ao mercado.
  - `3.6` Analytics não joga sozinha: complementa e potencializa cada track da consultoria.
  - `11.8` Do diagnóstico à automação, entregamos projetos de ponta a ponta…
  - `16.4` …com um portfólio de produtos e capabilities que não para de crescer.
  - As ondas e o ∞ ficam sem voz.

#### P1 · Parada 1 (4s + espera) [nova]
- **Visual:**
  - o ∞ encolhe e vira a baldeação do mapa (os dois círculos), e o trem para;
  - o letreiro mostra "PARADA" e depois "PRÓXIMA PARTIDA: 04 · ANALYTICS IN ACTION";
  - uma tira de papel diz: "hora de conversar · ▶ seguir viagem".
- **Comportamento:**
  - o player pausa sozinho e a trilha some;
  - o quadro continua vivo: o relógio do letreiro anda e o meio-tom "respira";
  - ▶ ou espaço retoma o vídeo, com um apito e o drop da trilha.

### Bloco 2 · Trecho laranja — o que fazemos e como escalamos

#### 6 · Estação 04 — Analytics in Action: From Data to Impact (5s) [nova]
- **Visual:** três fichas de caso se abrem em leque (VAREJO · ISSUER · FRAUDE), com a régua que guia todos eles: **PROBLEMA → INSIGHT → ENTREGA → IMPACTO**.
- **Narração:**
  - `0.4` Próxima estação: analytics em ação.
  - `2.8` Do problema ao impacto.

**Moldura de caso** (vale para os casos 1, 2 e 3):
- **Régua no topo:** avança PROBLEMA ● INSIGHT ○ ENTREGA ○ IMPACTO ○.
- **Abertura:** o problema na língua do cliente, num post-it grande com o número da dor.
- **Miolo:** a parte técnica da v2, com os easter eggs. É o caminho até o insight e a entrega.
- **Fecho:** o **comprovante de impacto**, um cupom de maquininha impresso na hora (é Mastercard, afinal). Traz os números do impacto e o carimbo ✓.
- **Parceria:** cada caso ganha um sticker "com a track de …" [a confirmar].

#### 7 · Caso 1 · Varejo — recomendação (32s) [v2: caso 01 encurtado] [fictício]
- **Problema:** "12 milhões de clientes, 1 folheto para todos". O mesmo folheto aparece fotocopiado sobre uma multidão recortada, e a conversão de campanha é de 1,8%.
- **Miolo (v2):**
  1. matriz cliente×SKU esparsa;
  2. R ≈ U·Vᵀ;
  3. alternância do ALS, com a curva de erro caindo;
  4. as lacunas viram propensões;
  5. espaço latente.
- **Insight:** clientes parecidos montam cestas parecidas.
- **Entrega:** top-3 SKUs por cliente, toda semana, no app e no CRM.
- **Comprovante:**
  - ticket médio +14%;
  - conversão de 1,8% para 4,3%;
  - +R$ 48 mi/ano de receita incremental.
- **Easter eggs:** os da v2: `uᵢ = (VᵀV + λI)⁻¹Vᵀrᵢ`, `c = 1 + α·r`, `k = 64`, `score = uᵀv`, `top-k`.
- **Narração:**
  - `0.6` Caso um, no varejo: doze milhões de clientes… e o mesmo folheto para todos.
  - `6.4` Cada linha, um cliente; cada coluna, um produto. E quase tudo… vazio.
  - `11.6` Com fatoração de matrizes — o ALS — as lacunas viram propensões.
  - `18.6` O insight: clientes parecidos montam cestas parecidas. Cada um recebe a sua.
  - `26.4` Resultado: ticket médio catorze por cento maior.

#### 8 · Caso 2 · Issuer — principalidade (30s) [v2: caso 02 encurtado] [fictício]
- **Problema:** "4 em cada 10 clientes recebem o salário em outro banco". Quem nos tem como banco principal?
- **Miolo (v2):**
  1. prateleira de 24 produtos financeiros;
  2. cada produto vira um vetor;
  3. gradiente descendente;
  4. espaço neon 3D;
  5. clusters: Dia a dia, Investimentos, Crédito, Proteção;
  6. distância do cosseno.
- **Insight:** existe uma trilha até a principalidade: conta digital → Pix → cartão de crédito → cashback → CDB → previdência. É a mesma trilha que já aparece na cena da v2.
- **Entrega:** índice de principalidade e próximo melhor produto para cada cliente.
- **Comprovante:**
  - +11 p.p. de clientes principais em 6 meses;
  - +R$ 320 mi em captação;
  - churn −18%.
- **Narração:**
  - `0.6` Caso dois, num issuer: quem nos tem como banco principal?
  - `5.4` Com embeddings, cada produto financeiro vira um vetor…
  - `10.6` …e a distância do cosseno revela afinidades que ninguém via.
  - `17.0` O insight: existe uma trilha até a principalidade — e dá para guiar o cliente por ela.
  - `24.6` Em seis meses, onze pontos a mais de clientes principais.

#### 9 · Caso 3 · Fraude — lights-off reporting (26s) [v2: caso 03] [fictício]
- **Problema:** "10 dias de fechamento manual, 2 analistas, todo mês". Aparece o "antes" caricato da v2: planilhas, Ctrl+C/Ctrl+V, cafés e "Gerando report… 87%".
- **Insight:** 9 de cada 10 passos se repetiam todo mês.
- **Entrega:** CLICK — as luzes apagam e um pipeline neon leva do dado ao board.
- **Comprovante:**
  - de 10 dias para 15 minutos;
  - ~1.900 h/ano devolvidas à análise;
  - zero toque manual.
- **Fecho (v2):** o nó Insights pulsa com um "?" e a câmera mergulha nele, o que leva à estação 05.
- **Easter eggs:** os da v2: `SQL · parquet`, `z = (x − μ)/σ`, `DAG ⟳`, `cron 0 7 * * 1`.
- **Narração:**
  - `0.6` Caso três: o report de fraude para o board. Dez dias de fechamento manual, todo mês.
  - `7.0` O insight: nove de cada dez passos se repetiam.
  - `11.4` Então apagamos as luzes: automação lights-off, do dado ao board.
  - `17.4` De dez dias para quinze minutos.
  - `22.0` Mas quem escreve os destaques do report?

#### 10 · Estação 05 — Scaling Our Impact Through Data, AI & Innovation (40s) [v2: caso 04 + nova]
- **IA (v2, ≈18s):**
  1. Analista, Business e C-Level escrevem o insight;
  2. o Validador reprova, manda refazer e aprova;
  3. o Embalador entrega o título, que vai para o report, o dashboard e qualquer processo.
- **Por baixo do capô (v2, futurista, ≈9s):**
  - transformer com o mapa de atenção;
  - a GPU acende;
  - vários modelos: LLM, Embeddings, Reranker, Classificador, Guardrails;
  - o perímetro "Ambiente Mastercard": pacotes batem na borda e voltam;
  - easter egg novo: `egress: 0 B`.
- **Escala (≈4s)** [fictício]: o mesmo motor aparece plugado em vários processos, com o contador "12.480 insights/mês".
- **Inovação (≈7s)** [nova]:
  - uma esteira retrô de fábrica: LAB → PILOTO → PRODUTO → ESCALA, com itens andando;
  - os itens [a confirmar]: RL para pricing (lab) · graph fraud (piloto) · uplift modeling (produto) · agentes de insights (escala).
- **Narração:**
  - `0.6` Próxima estação: escalar o impacto, com dados, IA e inovação.
  - `5.2` Três agentes — analista, business e C-level — escrevem o insight.
  - `9.8` Um validador confere; se não estiver bom, manda refazer.
  - `13.8` Um embalador entrega o título: no report, no dashboard, em qualquer processo.
  - `19.6` Por trás, transformers puros em GPU, com vários modelos trabalhando juntos…
  - `24.6` …e o dado nunca sai da Mastercard.
  - `27.6` Insights em escala, conectáveis a qualquer processo.
  - `31.0` E a esteira não para: do laboratório ao piloto, do produto à escala.

#### 11 · Estação 06 — A Prática (26s) [nova] [a confirmar: materiais da Nat]
- **Pilares (≈8s):**
  - 4 colunas clássicas de papel recortado sobem do chão, com estética de gravura antiga em meio-tom, cada uma com um pilar;
  - o frontão "A PRÁTICA" cai por cima com um baque;
  - os pilares: Pessoas & formação · Método & qualidade · Ferramentas & aceleradores · Comunidade & conhecimento.
- **Entregas relevantes (≈8s):** cards carimbados "ENTREGUE" são pregados no mural:
  - playbook de modelagem
  - biblioteca de código reutilizável
  - trilha de formação em IA
  - governança de modelos
  - guilda mensal de analytics
- **Evoluções (≈8s):** um changelog em terminal neon, como easter egg de `git log`:
  ```
  v4.0  2026  agentes + avaliação de LLMs
  v3.0  2025  MLOps + monitoramento
  v2.0  2024  biblioteca de features
  v1.0  2023  playbook de modelagem
  ```
- **Narração:**
  - `0.6` Próxima estação: a Prática.
  - `3.0` Quatro pilares: pessoas, método, ferramentas e comunidade.
  - `10.0` Entregas que ficam: playbooks, bibliotecas, formação.
  - `17.6` E uma prática que evolui como software: versão após versão.

#### P2 · Parada 2 (4s + espera) [nova]
- Igual à parada 1, com o letreiro em "PRÓXIMA PARTIDA: 07 · FUTURE OF ANALYTICS".

### Bloco 3 · Trecho amarelo — para onde vamos

#### 12 · Estação 07 — The Future of Analytics (28s) [nova]
- **Visual:** o trilho passa da última estação e segue para um horizonte neon, com sol synthwave e grid. Aparecem três placas de "próximas paradas", cada uma com uma imagem:
  1. **Mais conectados às decisões estratégicas dos clientes:** uma mesa de board recortada, em que uma cadeira vazia ganha o sticker laranja "Analytics". É o lugar na mesa.
  2. **Mais integrados às demais tracks:** os círculos da estação 03 voltam e se aproximam até as lentes laranjas se fundirem.
  3. **Soluções cada vez mais escaláveis e diferenciadas:** um tile vira mosaico, num eco do ∞, e um deles brilha em neon. É o diferencial.
- **Narração:**
  - `0.6` Última estação: o futuro de analytics.
  - `3.8` Mais perto das decisões estratégicas dos clientes: com lugar na mesa.
  - `10.6` Mais integrados a cada track da consultoria.
  - `17.4` Com soluções cada vez mais escaláveis… e diferenciadas.
  - `23.4` É esse o papel que queremos ocupar.

#### 13 · Clímax (16s) [v2: encurtado]
- **Visual:**
  - 12 cortes no beat, cada um com uma fórmula colada: Estatística · Regressão · Classificação · Árvores · Ensembles · Clusters · Anomalias · Otimização · Embeddings · Transformers · Agentes · Automação;
  - depois vêm o eixo simples ●──● complexo, o anel e "Nossa especialidade é analytics".
- **Narração:**
  - uma palavra por corte, a cada 0,8s;
  - `9.6` Dos problemas mais simples aos mais complexos…
  - `12.8` …nossa especialidade é analytics.

#### 14 · Fechamento — split-flap (16s) [v2]
- **Visual:** o letreiro que anunciou cada estação vira pela última vez, sob o cabeçalho "PRÓXIMA PARADA":
  1. WELCOME TO THE FUTURE
  2. WELCOME TO **AI**
  3. WELCOME TO **ANALYTICS**
  4. PERFORMANCE **ANALYTICS**

  Termina no ponto laranja da abertura.
- **Narração:**
  - `0.8` Se o desafio pede eficiência, escala e valor, a resposta passa por Performance Analytics.
  - Depois disso, o letreiro fica sem voz.

---

## Player: paradas e navegação

- **Paradas automáticas:** o vídeo para sozinho no fim das estações 03 e 06 (`autoPause: true`). Dá para desligar e rodar direto, por exemplo para mandar por e-mail.
- **Durante a parada:**
  - o quadro continua vivo e a trilha fica em silêncio (há a opção de um pad baixinho);
  - ▶ ou espaço segue viagem.
- **Navegação:**
  - as teclas 1–7 pulam para a estação correspondente, o que ajuda a voltar a um ponto durante as perguntas;
  - a barra de progresso mostra as estações e as paradas.
- **Voz e legenda:** iguais à v2, desligadas por padrão (teclas V e C).
- **Dados centralizados:** todos os números fictícios ficam juntos em `CONFIG.data`, para trocar num lugar só.
- **Aviso opcional:** uma notinha "dados ilustrativos" nas telas com número, enquanto os dados reais não chegam.

---

## Dados fictícios (para trocar pelos reais)

| Onde | Indicador | Valor fictício |
|------|-----------|----------------|
| 02 | Tamanho do time, 2022 → 2026 | 4 · 7 · 11 · 16 · 23 |
| 02 | Projetos entregues | 140+ |
| 02 | Engagements com analytics | 15% (2022) → 62% (2026) |
| 02 | Receita de projetos com analytics | US$ 2,1 mi → US$ 12,4 mi (×6) |
| Caso 1 | Base de clientes | 12 mi |
| Caso 1 | Conversão de campanha | 1,8% → 4,3% |
| Caso 1 | Ticket médio | +14% |
| Caso 1 | Receita incremental | +R$ 48 mi/ano |
| Caso 2 | Clientes multibancarizados | 40% |
| Caso 2 | Clientes principais | +11 p.p. em 6 meses |
| Caso 2 | Captação | +R$ 320 mi |
| Caso 2 | Churn | −18% |
| Caso 3 | Fechamento do report | 10 dias → 15 min |
| Caso 3 | Esforço repetível | 9 de cada 10 passos |
| Caso 3 | Horas devolvidas à análise | ~1.900 h/ano |
| 05 | Volume do motor de insights | 12.480 insights/mês |

Moedas: US$ para os números internos da track e R$ para o impacto no cliente. Dá para trocar fácil.

---

## O que preciso de vocês

1. **Estação 06 · Prática:** os materiais da Nat (pilares, entregas relevantes e evoluções). Até eles chegarem, a cena usa os placeholders acima.
2. **Demais tracks da consultoria:** os nomes e a oferta conjunta de cada uma com analytics. Isso entra na estação 03 e no sticker de parceria dos casos.
3. **Estação 02:** os marcos reais da track e os números, quando puderem.
4. **Esteira de inovação (estação 05):** o que está hoje em lab, em piloto, em produto e em escala.

---

## Opção de corte (~5:00)

Se 5:45 ficar longo, estes cortes somam cerca de 40s:
- casos com o miolo técnico mais curto: −6s cada (−18s);
- estação 04 sem abertura própria, com a régua aparecendo direto no caso 1 (−5s);
- clímax com 8 cortes (−5s);
- estação 03 sem os tipos de projeto (−5s);
- mapa da linha fundido ao fim da abertura (−6s).

---

## Direção visual

- **Base:** a direção da v2 continua.
  - **Paleta:** vermelho `#EB001B`, laranja `#FF5F00`, amarelo `#F79E1B`, tinta `#1A1714`, papel `#F3EBDD`.
  - **Colagem:** papel com fibras e granulação, recortes com contorno de tinta, sombras chapadas sem blur, meio-tom, fita adesiva e stickers.
  - **Futurista** quando o assunto é modelo: neon, grid em perspectiva, scanlines, etiquetas holográficas.
- **Elementos recorrentes novos:**
  - letreiro split-flap de estação;
  - mapa da linha e mini-mapa;
  - régua do caso;
  - comprovante de impacto;
  - colunas clássicas em gravura de meio-tom;
  - esteira de fábrica;
  - mesa de board recortada.
- **Trilha:**
  - um arranjo por trecho: vermelho com mais groove, laranja mais pulsante, amarelo mais épico;
  - "plim-plom" de metrô a cada estação;
  - silêncio nas paradas.
- **Números de tela:** fictícios até a troca. As fórmulas são reais e servem de easter eggs para o público técnico.
