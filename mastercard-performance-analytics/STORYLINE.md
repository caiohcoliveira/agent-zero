# A Linha — Storyline v3.2

**Sessão:** 20 min, sendo ~9 min de vídeo e 11 min de fala das apresentadoras, em 4 paradas
**Vídeo:** HTML único offline, 1920×1080, em **modo apresentação**: trechos de vídeo e paradas em loop, controlados pelo teclado ou pelo passador de slides
**Status:** **proposta em validação**. As cenas da v3 ainda não foram implementadas; o HTML já carrega o bloco de dados. O vídeo atual ainda é a v2, cujo roteiro está no histórico (commit `20e1d96`).

Marcadores usados no texto:
- **[v2]** reaproveita uma cena da v2, com ajustes;
- **[nova]** cena nova;
- **[a confirmar]** depende de material ou de confirmação de vocês;
- **[dados]** número ou resultado que vem de `data/presentation.json` (ver a seção "Dados").

---

## Ajustes desta rodada (v3.1 → v3.2): dados reais

1. **Fonte única dos números:** tudo que é número ou resultado vem de `data/presentation.json`.
   - O build injeta o arquivo num bloco JSON no topo do HTML. Para trocar uma informação, basta editar o bloco e salvar.
   - O arquivo real fica fora do Git, porque o repositório é público. O repositório guarda só um exemplo com a mesma estrutura.
2. **Estação 02:**
   - a evolução da receita por período vira o visual dominante;
   - o marco do Brasil entra como destaque;
   - as provas de escala complementam.
3. **Estação 03:** um mapa de capabilities por tipo de cliente (Emissores, Adquirentes, Merchants), com cada capability ligada a um case.
4. **Estação 04:** quatro cases, cada um com a moldura Problema → Solução analítica → Insight/Decisão → Impacto e **um** número-manchete.
   - Cliente Banana (cestas);
   - Cliente Manga (principalidade);
   - Lights-off;
   - Insight Agent.
5. **Estação 05:** a progressão Análise manual → Analytics avançado → Motores produtizados → Ativos de IA escaláveis, com o indicador de escala de cada exemplo.
6. **Os valores não aparecem neste documento:** ele aponta os campos do JSON, para não publicar dados internos.

## Ajustes da rodada anterior (v3 → v3.1)

1. **Paradas = pausas para as apresentadoras falarem.** O vídeo não congela: a animação continua em loop infinito pelo tempo que for preciso.
2. **Parada 0 no mapa do metrô**, para apresentar o roteiro (por onde vamos passar).
3. **Paradas 1 e 2 com retomada:** a apresentadora revisita cada estação percorrida, com um "slide" animado por estação contendo a informação mais importante. Os slides avançam com a seta do teclado ou com o passador.
4. **Tudo contínuo e imersivo:**
   - as paradas acontecem na plataforma da estação, e os slides são cartazes de colagem na parede;
   - a câmera passeia pelo mesmo mundo, sem tela preta e sem corte para "pausa".
5. **Tempo:** a sessão inteira tem 20 min. O vídeo passa de ~5:45 para ~9:00, então cada estação ganha mais fôlego.
6. **Trilha:** os dois trechos longos ganham música-tema (opções na seção "Trilha").

## O que muda da v2 para a v3 (resumo)

1. **Estrutura:**
   - 7 estações em 3 trechos;
   - a track vira uma **linha de metrô**;
   - o letreiro split-flap anuncia cada estação e vira o payoff no final.
2. **Conteúdo novo:**
   - papel estratégico de analytics (01);
   - evolução e números (02);
   - portfólio e sinergia com as demais tracks (03);
   - a Prática (06);
   - o futuro (07).
3. **Cases:** seguem a moldura Problema → Insight → Entrega → Impacto e fecham num "comprovante de impacto" impresso como cupom de maquininha.
4. **Mantido da v2:**
   - os 5 desafios na abertura;
   - reports antes de insights;
   - transformers em GPU, com o dado que nunca sai;
   - easter eggs;
   - 3 ondas de modelos, sem verbalizar;
   - final em split-flap;
   - voz desligada por padrão.
5. **Sai da v2:**
   - a cena das 4 perguntas e os chips 01–04;
   - "Possibilidades" como cena isolada, porque as ondas vão para a estação 03.

---

## A sessão de 20 minutos

| Momento | O que acontece | Vídeo | Fala |
|---|---|---|---|
| Pré-show (opcional) | loop de espera enquanto a plateia chega | — | — |
| **Abertura** | os 5 desafios → chegada ao mapa da linha | 0:30 | |
| **Parada 0 · roteiro** | mapa em loop; → destaca cada estação | | 2:00 |
| **Trecho 1** · tema A | estações 01, 02 e 03 | 3:30 | |
| **Parada 1 · retomada** | cartazes das estações 01, 02 e 03 | | 3:30 |
| **Trecho 2** · tema B | estação 04 (3 casos), 05 e 06 | 3:50 | |
| **Parada 2 · retomada** | cartazes das estações 04, 05 e 06 | | 3:30 |
| **Trecho 3** (curto) | estação 07, clímax e letreiro final | 1:10 | |
| **Encerramento** | letreiro "Performance Analytics" em loop | | 2:00 |
| **Total** | | **9:00** | **11:00** |

Os tempos de fala somam 11 min (2 + 3,5 + 3,5 + 2). Por isso o vídeo fica com ~9 min, para a sessão fechar em 20. Se a fala final cair para 1 min, o vídeo pode ir a 10. A duração exata de cada trecho vai acompanhar a edição da música escolhida.

---

## Fio condutor: a linha

- **Mapa da linha:**
  - pôster retrô de metrô em papel recortado;
  - uma linha grossa em 3 trechos: **vermelho** (trecho 1), **laranja** (trecho 2) e **amarelo** (trecho 3);
  - 7 estações. As paradas são estações de baldeação, desenhadas como os **dois círculos entrelaçados** da Mastercard.
- **Letreiro de estação:**
  - cada estação abre com o split-flap virando para "0X · NOME CURTO", com o título completo numa tira de papel embaixo;
  - toca o "plim-plom" de metrô.
- **Mini-mapa:** fica no canto da tela durante os trechos e mostra onde o trem está. Na estação 04, ganha três marquinhas, uma por caso.
- **Plataforma:** é o cenário de todas as paradas.
  - parede de azulejo em meio-tom;
  - cartazes de colagem;
  - letreiro da plataforma e luz que "respira".
- **Alternativa sem metáfora:** as estações viram capítulos numerados com o mesmo letreiro, e as paradas viram um mural. O resto não muda.

---

## As paradas

**Regras comuns:**
- **Imersão:** o trem para e a câmera entra na plataforma. Nada de tela de pausa.
- **Loop:** tudo se mexe em ciclos que fecham sem emenda — meio-tom respirando, letreiro com relógio, papel tremulando de leve, neon piscando. Pode ficar 30 s ou 10 min.
- **Som:** a trilha sai e a parada fica em silêncio, para não competir com a fala. Há a opção de uma ambiência bem baixa.
- **Navegação:**
  - → (ou PageDown no passador) leva a câmera ao próximo cartaz, e ← (ou PageUp) volta;
  - → depois do último cartaz é o embarque: o trem chega, as portas fecham, soa o apito e o próximo trecho começa com a música-tema.

### Parada 0 · roteiro (2:00 de fala)
- **Cena:** o mapa da linha ocupa a parede da plataforma inicial, com o trem parado na estação de partida.
- **Navegação:** cada → destaca uma estação. A câmera desliza até ela, a estação acende e mostra uma frase:
  1. 01 · Strategic Capability — o papel de analytics na consultoria
  2. 02 · Evolution & Impact — como a track cresceu e o que entregou
  3. 03 · What We Bring — portfólio e sinergia com as tracks
  4. ◎ Parada — hora de conversar
  5. 04 · Analytics in Action — cases, do problema ao impacto
  6. 05 · Scaling Our Impact — IA, automação e inovação
  7. 06 · A Prática — pilares, entregas e evoluções
  8. ◎ Parada — hora de conversar
  9. 07 · Future of Analytics — onde queremos estar
- **Saída:** depois da 07, → embarca no trecho 1.

### Parada 1 · retomada do trecho 1 (3:30 de fala)
- **Cena:** o ∞ do fim da estação 03 encolhe e vira a baldeação. O trem para, e a câmera entra na plataforma, que tem 3 cartazes na parede, um por estação percorrida.
- **Cartaz 01:** "Da pergunta de negócio ao valor medido". A cadeia Dados → Decisões → Impacto → Valor pulsa elo a elo.
- **Cartaz 02:** a curva de receita por período, com o multiplicador do período e o selo do marco do Brasil (vs. período anterior e vs. budget) [dados].
- **Cartaz 03:** o mapa de capabilities por tipo de cliente, com as ligações para os cases acendendo em sequência.

### Parada 2 · retomada do trecho 2 (3:30 de fala)
- **Cartaz 04:** os 4 cards de case lado a lado, cada um com o seu número-manchete [dados], balançando como papel pendurado.
- **Cartaz 05:** a escada Manual → Avançado → Produtizado → IA escalável, com o pipeline do Insight Agent em destaque e o perímetro "o dado nunca sai" pulsando [dados].
- **Cartaz 06:** as 4 colunas da Prática, com o selo "v4.0".

### Encerramento (2:00 de fala)
- O letreiro "PERFORMANCE ANALYTICS" fica vivo em loop: o brilho laranja respira e uma plaqueta ou outra re-vira.
- **Opcional:** → abre o cartaz 07 (as 3 direções do futuro), e ← volta ao letreiro.

---

## Os trechos

As frases de "Narração opcional" valem como texto de apoio. A voz do navegador continua desligada por padrão. Os tempos finos de cada frase serão definidos na implementação, sincronizados à música escolhida.

### Abertura (0:30)

#### Pré-show (opcional) [nova]
- Loop de espera antes de começar: o ponto laranja pulsando sobre o papel e o letreiro "PERFORMANCE ANALYTICS · EMBARQUE EM INSTANTES".
- → começa a abertura.

#### Os 5 desafios (18s) [v2]
- **Visual:** como na v2:
  1. o ponto laranja vira uma tempestade de recortes de dados;
  2. aparece o sticker "O NOSSO DESAFIO HOJE";
  3. as 5 tiras são coladas uma a uma;
  4. tudo vira um pôster, com "Gerar valor" circulado em laranja.
- **Na tela:** Eficiência operacional · Automação e escala · Ciência de dados · Inteligência artificial · Gerar valor
- **Narração opcional:** "Hoje, o nosso desafio tem cinco nomes." + os 5 nomes.

#### Chegada ao mapa (12s) [nova]
- O círculo de "Gerar valor" encolhe e vira o trem.
- O mapa se monta em colagem, e o letreiro vira para "LINHA PERFORMANCE ANALYTICS".
- O trem para na estação de partida, o que abre a **Parada 0**.
- **Narração opcional:** "A nossa track é uma linha com sete estações… e duas paradas para conversar."

### Trecho 1 · vermelho · tema A (3:30)

#### Estação 01 — Analytics as a Strategic Consulting Capability (60s) [v2 reescrita + nova]
1. **Chegada (4s):** o letreiro vira para "01 · STRATEGIC CAPABILITY".
2. **Perguntas de negócio (10s):** post-its se acumulam num quadro de cortiça: "Por que caiu?", "Quem priorizar?", "Onde investir?", "Qual o risco?", "E se…?".
3. **Negócio × Dados (10s):** os círculos Mastercard em meio-tom colidem, e a interseção laranja acende: "Performance Analytics".
4. **O papel no engagement (18s)** [nova]:
   - uma régua de consultoria: Diagnóstico → Estratégia → Implementação → Mensuração;
   - em cada fase, analytics carimba o que entrega: **dimensionar** a oportunidade → **explicar** o porquê → **construir** a solução → **provar** o impacto;
   - um fio vermelho atravessa todas as fases.
5. **Cadeia (12s):** Dados → Decisões → Impacto → Valor, carimbada elo a elo. O fio amarra os post-its à cadeia: toda pergunta termina em valor.
6. **Fecho (6s):** a tagline "Da pergunta de negócio ao valor medido." e o trem parte.

**Narração opcional:**
- Próxima estação: analytics como capacidade estratégica da consultoria.
- Todo projeto começa com uma pergunta de negócio.
- E é no encontro entre a pergunta e o dado que a gente atua.
- Do diagnóstico à mensuração: dimensionamos, explicamos, construímos e provamos.
- Transformamos dados em decisões, decisões em impacto… e impacto em valor para o cliente.

#### Estação 02 — Our Evolution & Business Impact (70s) [nova] [dados]
1. **Chegada (4s).**
2. **Receita por período (o visual dominante, ~30s):**
   - um gráfico de barras em papel recortado, uma barra por período (`revenue_performance_analytics_usd_millions`), subindo uma a uma no tempo da música;
   - a projeção do período seguinte aparece tracejada, como "forecast";
   - um selo mostra o multiplicador do período (número-manchete da seção 2) e as variações ano a ano (`revenue_growth`);
   - easter egg: a fórmula do crescimento composto colada ao lado da curva.
3. **Marco do Brasil (o destaque, ~16s):**
   - um carimbo grande com os dois multiplicadores: vs. período anterior e vs. budget (`brazil_2023_milestone`);
   - por baixo, as barras por trimestre, comparando realizado do período anterior, budget e realizado;
   - os motivadores (`drivers`) entram como notas de rodapé, se vocês quiserem mostrá-los [a confirmar].
4. **Provas de escala (~16s):** três fichas de colagem, uma por iniciativa (`scale_proof_points`):
   - Cliente Banana: clientes modelados, subgrupos de SKU e interações;
   - Cliente Manga: associados PF, clusters look-alike e tempo de desenvolvimento;
   - Insight Agent: adquirentes no pipeline, clientes + PoCs e projetos user-pay.
5. **Saída (4s).**

**Narração opcional:**
- Próxima estação: a nossa evolução.
- A receita cresceu período após período…
- …e o Brasil fechou acima do período anterior e acima do budget.
- Com escala de verdade, nos três exemplos.

#### Estação 03 — What We Bring to the Market (80s) [nova + v2] [dados]
1. **Chegada (4s).**
2. **Analytics × as demais tracks (12s):** o Venn com analytics no centro e as outras tracks em volta, mais curto que na v3.1 [a confirmar os nomes].
3. **Mapa de capabilities (~30s):**
   - três colunas, uma por tipo de cliente (`client_types`), como plataformas de uma estação;
   - cada capability (`capabilities_demonstrated_in_cases`) vira um sticker, com os métodos em letra miúda como easter eggs: UMAP, K-Means, ALS, BM25, cosseno, LLMs locais…;
   - um fio liga cada capability ao case em que ela aparece, e o case acende. É a prévia da estação 04;
   - a coluna de cada capability depende do case [a confirmar]: Cliente Manga → Emissores; Insight Agent → Adquirentes; Cliente Banana → Merchants; Lights-off → ?
4. **Portfólio em 3 ondas (~22s, sem voz) [a confirmar se fica]:** as ondas da v2 (produtos Issuer/Acquirer → capabilities → fronteira), terminando no ∞.
5. **Saída (4s):** o ∞ (ou o mapa) vira a baldeação e abre a **Parada 1**.

**Narração opcional:**
- Próxima estação: o que levamos ao mercado.
- Analytics não joga sozinha: complementa e potencializa cada track da consultoria.
- Para emissores, adquirentes e merchants, cada capability já tem um case para mostrar.

### Trecho 2 · laranja · tema B (3:50)

#### Estação 04 — Analytics in Action: From Data to Impact (5s de abertura) [nova]
- **Visual:** quatro fichas de case se abrem em leque (BANANA · MANGA · LIGHTS-OFF · INSIGHT AGENT), com a régua **PROBLEMA → SOLUÇÃO ANALÍTICA → INSIGHT/DECISÃO → IMPACTO** (`case_structure`).

**Moldura de caso:**
- **Régua no topo:** avança de etapa em etapa.
- **Problema:** o desafio de negócio em uma frase, num post-it grande (`business_problem`).
- **Solução analítica:** a parte técnica, com os métodos do case como easter eggs (`analytics_solution`).
- **Insight/Decisão:** o que a análise mostrou e o que mudou na decisão.
- **Impacto:** o card fecha com **um** número-manchete, impresso como comprovante de maquininha, com o carimbo ✓. O número vem do item da seção 4 em `headline_numbers_for_slides` ou, na falta dele, do `headline` do case.

#### Caso Cliente Banana · cestas de produtos [v2 adaptado] [dados]
- **Problema:** aumentar a transversalidade entre Cliente Banana, Cliente Maçã e Cliente Pera: quais cestas de SKUs estratégicos, para quais clientes, com quais produtos que motivam a visita.
- **Desafios de dado** (3 post-its riscados):
  - só compras registradas, sem preferência declarada;
  - itens onipresentes de baixo valor (sacola, pão) dominando o sinal;
  - o mesmo produto com nomes diferentes entre BUs.
- **Solução** (miolo da v2, ajustado):
  1. 24 meses de compras CPF × SKU numa matriz esparsa;
  2. o BM25 pondera a relevância e "apaga" a sacola e o pão;
  3. o ALS fatoriza a matriz em vetores de clientes e de produtos;
  4. o cosseno produto × produto forma as cestas, e o cosseno cliente × cesta escolhe o público;
  5. as três cestas temáticas aparecem como sacolas de colagem: Café + chocolate · Churrasco · Destilados.
- **Insight/Decisão:** as cestas temáticas viram mecânicas de campanha nos testes da Mesa de Performance.
- **Impacto:**
  - o número-manchete da conversão contra a 2ª melhor campanha;
  - o ranking de conversão por mecânica como gráfico de barras (`conversion_by_mechanic`), com as cestas em laranja.
- **Easter eggs:** a fórmula do BM25, `R ≈ U·Vᵀ`, `cos θ = a·b / ‖a‖‖b‖` e a escala do modelo (`model_scale`).

#### Caso Cliente Manga · motor de principalidade [v2 adaptado] [dados]
- **Problema:** recomendar produtos olhando não só afinidade e conversão, mas também o impacto esperado de cada recomendação na principalidade.
- **Solução:**
  1. segmentação look-alike: o UMAP projeta os associados e o K-Means forma 8 segmentos. O espaço 3D neon da v2 vira o UMAP;
  2. fatoração de matrizes (ALS), com cross-sell e upsell em paralelo;
  3. uma camada ΔP reprioriza a lista pelo ganho esperado de principalidade.
- **Insight/Decisão:** uma lista curta, reordenada por ΔP, rende mais principalidade do que a lista "pura" de afinidade.
- **Impacto:**
  - o número-manchete do ganho teórico de principalidade contra o controle (backtest);
  - o destaque do melhor segmento;
  - o selo "produtizado" no ambiente do cliente, com retreino semestral, pipeline mensal e ajuste diário.
- **Easter eggs:**
  - as métricas de qualidade da segmentação como fórmulas coladas: trustworthiness do UMAP, silhouette, Calinski-Harabasz, Davies-Bouldin e estabilidade dos clusters em 3 e 6 meses;
  - MLflow.

#### Caso Lights-off Fraud Reporting [v2] [a confirmar: o JSON só traz o nome]
- **Cena da v2 mantida:** o "antes" manual, o CLICK das luzes apagando e o pipeline do dado ao board.
- **Sem número por enquanto:** fica assim até chegarem problema, solução e impacto. Os números fictícios da v3.1 saem.

#### Caso Insight Agent · insights de Market Share e Share of Wallet [v2 adaptado] [dados]
- **Problema:**
  - o produto de Market Share e Share of Wallet para adquirentes dependia de insights escritos à mão;
  - os dados não podem sair do ambiente Mastercard, o que exclui APIs externas de IA.
- **Solução** (miolo da v2, ajustado ao circuito real):
  1. um circuito multiagente com IA local em GPU: **geradores → julgadores → corretores → insights validados** [a confirmar como ficam os nomes da v2: Analista, Business e C-Level, Validador, Embalador];
  2. dois modelos locais e guardrails (Regex e BERT);
  3. um score de qualidade do insight, com Random Forest sobre features de NLP.
- **Insight/Decisão:** com a qualidade medida automaticamente, dá para atender o pipeline inteiro sem crescer o time.
- **Impacto:**
  - o número-manchete do pipeline de adquirentes;
  - clientes, PoCs e projetos user-pay como fichas.
- **Easter eggs:**
  - o MAE do score, inclusive fora do tempo;
  - `Attention(Q,K,V)`;
  - `egress: 0 B`.

#### Estação 05 — Scaling Our Impact Through Data, AI & Innovation (62s) [v2 + nova] [dados]
1. **A escada (~30s):** quatro degraus de colagem, cada um mais neon que o anterior. Cada degrau mostra o indicador de escala do exemplo (`innovation_examples[].scale_indicator`).
   - **Análise manual:** planilhas, o "antes" da v2;
   - **Analytics avançado:** Cliente Banana (espaço latente: BM25 + ALS + cosseno);
   - **Motores produtizados:** Cliente Manga (jobs semestral, mensal e diário) e Lights-off (reporting automatizado);
   - **Ativos de IA escaláveis:** Insight Agent (IA local multiagente + score de qualidade).
2. **Por baixo do capô (~16s, v2, futurista):**
   - a GPU acende;
   - os modelos locais e os guardrails;
   - o perímetro "Ambiente Mastercard", com pacotes que batem na borda e voltam.
3. **Escala (~10s):** o mesmo motor plugado nos adquirentes do pipeline. Os já ativos acendem e os que faltam conquistar piscam: "sem crescer o time".
4. **Transições (6s).**

**Narração opcional:**
- Próxima estação: escalar o impacto, com dados, IA e inovação.
- Da análise manual ao analytics avançado, dos motores produtizados aos ativos de IA.
- IA rodando localmente: o dado nunca sai da Mastercard.
- Escala, sem crescer o time.

#### Estação 06 — A Prática (44s) [nova] [a confirmar: materiais da Nat]
1. **Pilares (12s):**
   - 4 colunas clássicas de papel recortado, com estética de gravura em meio-tom, sobem do chão;
   - o frontão "A PRÁTICA" cai por cima com um baque;
   - os pilares: Pessoas & formação · Método & qualidade · Ferramentas & aceleradores · Comunidade & conhecimento.
2. **Entregas relevantes (12s):** cards carimbados "ENTREGUE" são pregados no mural:
   - playbook de modelagem
   - biblioteca de código reutilizável
   - trilha de formação em IA
   - governança de modelos
   - guilda mensal
3. **Evoluções (12s):** um changelog em terminal neon (easter egg de `git log`): v1.0 playbook → v2.0 biblioteca de features → v3.0 MLOps → v4.0 agentes + avaliação de LLMs.
4. **Transições (8s):** o trem chega à baldeação, o que abre a **Parada 2**.

**Narração opcional:**
- Próxima estação: a Prática.
- Quatro pilares: pessoas, método, ferramentas e comunidade.
- Entregas que ficam: playbooks, bibliotecas, formação.
- E uma prática que evolui como software: versão após versão.

### Trecho 3 · amarelo · curto (1:10)

#### Estação 07 — The Future of Analytics (36s) [nova]
O trilho passa da última estação e segue para um horizonte neon, com sol synthwave e grid. Aparecem três placas de "próximas paradas":
1. **Mais conectados às decisões estratégicas dos clientes:** uma mesa de board recortada, em que uma cadeira vazia ganha o sticker laranja "Analytics". É o lugar na mesa.
2. **Mais integrados às demais tracks:** os círculos da estação 03 se aproximam até as lentes laranjas se fundirem.
3. **Soluções cada vez mais escaláveis e diferenciadas:** um tile vira mosaico, e um deles brilha em neon. É o diferencial.

**Narração opcional:**
- Última estação: o futuro de analytics.
- Mais perto das decisões estratégicas dos clientes, mais integrados a cada track…
- …e com soluções cada vez mais escaláveis e diferenciadas. É esse o papel que queremos ocupar.

#### Clímax (16s) [v2]
- 12 cortes no beat, cada um com uma fórmula: Estatística · Regressão · Classificação · Árvores · Ensembles · Clusters · Anomalias · Otimização · Embeddings · Transformers · Agentes · Automação.
- Fecha com "Nossa especialidade é analytics".

#### Letreiro final — split-flap (18s) [v2]
- Sob o cabeçalho "PRÓXIMA PARADA", o letreiro vira: WELCOME TO THE FUTURE → WELCOME TO **AI** → WELCOME TO **ANALYTICS** → PERFORMANCE **ANALYTICS**.
- Em seguida, vira o **Encerramento** em loop.

---

## Trilha (escolhida)

As faixas foram escolhidas por vocês na Pixabay. A licença da Pixabay libera uso e edição sem crédito obrigatório. Os arquivos MP3 **não** entram no repositório, que é público.

| Trecho | Faixa | Duração | Andamento | Tom |
|---|---|---|---|---|
| 1 · estações 01–03 | berrydeep — "Vintage Film Funk" | 1:59 | ~144 BPM (compasso de 1,66 s) | Lá maior |
| 2 · estações 04–06 | kulakovka — "Technology" | 2:49 | ~108 BPM (compasso de 2,22 s) | Fá# menor |
| 3 · final | twisterium — "Epic Piano Background" | 1:15 | ~99 BPM (compasso de 2,42 s) | Ré maior |

**Estrutura de energia de cada faixa:**
- **Vintage Film Funk:**
  - intro, de 0:00 a 0:11;
  - groove, de 0:11 a 0:55;
  - respiro, de 0:55 a 1:12;
  - groove forte, de 1:12 a 1:47;
  - fade até 1:59.
- **Technology:**
  - intro suave, de 0:00 a 0:38;
  - construção, de 0:38 a 0:56;
  - parte principal, de 0:56 a 2:27;
  - saída, de 2:27 a 2:49.
- **Epic Piano Background:**
  - piano suave, de 0:00 a 0:08;
  - crescendo, de 0:08 a 0:40;
  - parte mais cheia, de 0:40 a 1:02;
  - último acorde e decaimento, de 1:03 a 1:15.

**Volume:** as faixas estão masterizadas em −10, −12 e −10 LUFS e serão equalizadas entre si.

**Encaixe proposto (se o vídeo seguir a música):**
- **Trecho 1:**
  - intro → chegada e letreiro da 01;
  - groove → estações 01 e 02;
  - respiro → placar da 02;
  - groove forte → estação 03 com as ondas, e o ∞ no último tempo forte;
  - fade → Parada 1.
- **Trecho 2:**
  - intro suave → abertura da 04 e problema do caso 1;
  - construção → miolo do ALS;
  - parte principal → casos 2 e 3 e estação 05 (GPU, neon);
  - saída → estação 06, chegando à Parada 2.
- **Trecho 3:**
  - piano e crescendo → estação 07;
  - parte mais cheia → clímax;
  - último acorde → "PERFORMANCE ANALYTICS";
  - decaimento → encerramento.

**Em aberto (perguntas feitas ao usuário):**
1. **Duração:** as faixas somam ~6:03, contra 8:30 de trechos planejados. Opções:
   - o vídeo segue a música e fica com ~6:35 (recomendado);
   - as faixas são esticadas até 9:00;
   - meio-termo, com ~7:45.
2. **Abertura:** fica com o som sintetizado atual ou com o começo do funk?
3. **Clímax:** pode seguir o ritmo do piano, ficando mais épico e menos frenético?
4. **Efeitos sonoros por cima das faixas:** manter só o essencial, mais baixo?
5. **Paradas e encerramento:** silêncio total ou ambiência baixa?
6. **Repositório:** o HTML com música embutida pode ir para o repositório público, ou fica só uma versão local?

---

## Player: modo apresentação

- **Estrutura:** trechos lineares de vídeo intercalados com paradas em loop. Esse é o modo padrão (`mode: 'show'`).
- **Modo alternativo:** `'reel'` roda tudo direto, sem paradas, para mandar por e-mail.
- **Controles** (compatíveis com passador de slides):
  - → / PageDown / espaço avançam;
  - ← / PageUp voltam;
  - durante os trechos de vídeo, as setas não pulam nada, para evitar pulo acidental;
  - P pausa ou retoma em emergência;
  - 1–7 levam à estação (atalhos para quem opera).
- **Transições:** a câmera viaja no mesmo mundo. Não há tela preta.
- **Loops:** as animações das paradas são cíclicas, com período fixo, e rodam indefinidamente sem "pulo".
- **Áudio:**
  - tema A no trecho 1 e tema B no trecho 2;
  - paradas em silêncio;
  - SFX de metrô nas transições: plim-plom, portas e apito.
- **Voz e legenda:** desligadas por padrão (teclas V e C).
- **Dados:** todos os números vêm de `data/presentation.json`, embutido no topo do HTML (bloco `pa-data`). Ver a seção "Dados".
- **Aviso opcional:** uma notinha "dados ilustrativos" nas telas com número.

---

## Dados

- **Onde ficam:** em `data/presentation.json`, fora do Git porque o repositório é público. O build injeta o arquivo num bloco `<script type="application/json" id="pa-data">` no topo do HTML.
- **Para trocar um número:** edite o JSON (ou o bloco no HTML pronto) e salve. Um item de `headline_numbers_for_slides` aceita um campo `display`, que fixa o texto exato de tela.
- **Formatação:** os números saem em pt-BR automaticamente:
  - multiplicadores com 2 casas (`1,5×`);
  - "MM" vira mil ou mi;
  - o ponto decimal vira vírgula.
- **Repositório:**
  - guarda `data/presentation.sample.json`, com a mesma estrutura e números fictícios;
  - o `performance-analytics.html` do repositório é montado com esse exemplo;
  - a versão com os dados reais sai em `dist/performance-analytics.html`, só local.

| Estação | O que aparece | Campo do JSON (dentro de `presentation_structure`, pela seção) |
|---|---|---|
| 02 | receita por período e projeção | `revenue_performance_analytics_usd_millions` |
| 02 | variações ano a ano | `revenue_growth` |
| 02 | marco do Brasil e trimestres | `brazil_2023_milestone` |
| 02 | provas de escala | `scale_proof_points` |
| 03 | tipos de cliente e capabilities | `client_types`, `capabilities_demonstrated_in_cases` |
| 04 | os 4 cases | `cases[]` |
| 05 | progressão e indicadores | `innovation_examples[]` |
| 02, 04, 05 | números-manchete | `headline_numbers_for_slides[]` (na raiz, filtrado por `section`) |
| todas | contexto e títulos | `presentation_context` e `title` de cada seção |

---

## O que preciso de vocês

1. **Publicação dos dados:** o JSON traz números internos, mesmo mascarados. Ele pode ir para o repositório público? A recomendação é um repositório privado, porque um fork não pode virar privado.
2. **Inconsistências no JSON:**
   - clientes + PoCs do Insight Agent;
   - associados recomendados contra a população do Cliente Manga;
   - projeção do período seguinte igual à do período atual.
3. **Lights-off:** problema, solução e impacto.
4. **Mapa de capabilities:** em que tipo de cliente entra cada case, principalmente o Lights-off.
5. **Insight Agent:** os nomes dos agentes no vídeo, considerando o fluxo real e os nomes da v2.
6. **Estação 03:** as 3 ondas de modelos continuam depois do mapa?
7. **Estação 02:** time e presença nos engagements saíram, porque não estão no JSON. Querem mandar esses números?
8. **Trilha:** as 6 perguntas sobre duração e encaixe das músicas (seção "Trilha").
9. **Estação 06 · Prática:** os materiais da Nat.
10. **Demais tracks:** os nomes e a oferta conjunta (estação 03).
11. **Pré-show:** querem o loop de espera antes de começar?

---

## Direção visual

- **Base:** a direção da v2 continua.
  - **Paleta:** vermelho `#EB001B`, laranja `#FF5F00`, amarelo `#F79E1B`, tinta `#1A1714`, papel `#F3EBDD`.
  - **Colagem:** papel com fibras, recortes com contorno de tinta, sombras chapadas sem blur, meio-tom, fita adesiva e stickers.
  - **Futurista** quando o assunto é modelo: neon, grid em perspectiva, scanlines.
- **Elementos novos:**
  - letreiro split-flap de estação;
  - mapa e mini-mapa da linha;
  - **plataforma com cartazes** (paradas);
  - régua do caso e comprovante de impacto;
  - colunas clássicas em gravura de meio-tom;
  - esteira de fábrica;
  - mesa de board recortada.
- **Números de tela:** vêm do JSON de dados (seção "Dados"). As fórmulas são reais e servem de easter eggs para o público técnico.
