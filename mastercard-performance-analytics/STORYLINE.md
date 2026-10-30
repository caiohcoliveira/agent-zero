# A Interseção — Storyline v1

**Vídeo:** Performance Analytics · Mastercard · ~4:00 · 1920×1080 · HTML único
**Status:** validado (v1.1, com os ajustes do multiagente e dos produtos de principalidade) · HTML implementado em `performance-analytics.html`

---

## 1. Conceito

**A ideia central é "A Interseção".** Dois círculos: o vermelho é o **Negócio** (a pergunta) e o amarelo são os **Dados**. Onde eles se encontram, acende o laranja. É ali que nasce a decisão, e é ali que vive Performance Analytics. A imagem lembra a Mastercard sem copiar a marca e volta ao longo do filme inteiro.

**Por que isto é uma história, e não uma sequência de telas:**

- **Cada pergunta é respondida.** Na cena 2, quatro perguntas aparecem. Elas viram capítulos (chips 01–04 no canto da tela), e cada caso responde uma delas. O público sempre sabe onde está e vê o progresso a cada ✓.
- **Todo caso segue o mesmo ritmo:** pergunta → analytics em ação → resultado carimbado. A repetição deixa claro para quem não é técnico, e cada fechamento dá uma pequena recompensa.
- **Os Agentes são personagens.** São pequenos bots circulares com um visor que pisca, em vermelho, amarelo e laranja. Aparecem no caso 01, voltam no caso 04, entram no clímax e orbitam o final. É o toque caricato, na dose certa.
- **Uma virada que fica na memória.** No caso de fraude, as luzes se apagam de verdade, e o trabalho segue sozinho, brilhando no escuro.
- **O fim retoma o começo.** O filme abre e fecha com o mesmo ponto laranja pulsando.

**As cores têm significado fixo no filme todo:**
- **Vermelho:** negócio, pressão, alerta, fraude.
- **Amarelo:** dados e sinais.
- **Laranja:** interseção, insight, solução. É sempre a cor da resposta.

---

## 2. Visão geral

| # | Cena | Tempo | Dur. | Fundo | Energia |
|---|------|-------|------|-------|---------|
| 1 | Hook | 0:00–0:16 | 16s | escuro | ▲▲▲ |
| 2 | O problema | 0:16–0:34 | 18s | claro | ▲▲ tensão |
| 3 | Quem somos | 0:34–0:56 | 22s | escuro | ▲▲▲ drop |
| 4 | Caso 01 · Insights em escala | 0:56–1:26 | 30s | claro | ▲▲ |
| 5 | Caso 02 · Recomendação (ALS) ★ | 1:26–2:02 | 36s | escuro | ▲▲▲ |
| 6 | Caso 03 · Principalidade (Embeddings) ★ | 2:02–2:32 | 30s | claro → espaço | ▲▲ fascínio |
| 7 | Caso 04 · Lights-off · Fraude ★ | 2:32–3:00 | 28s | claro → apagão | ▲ → ▲▲▲ |
| 8 | Capacidades | 3:00–3:22 | 22s | escuro | ▲▲ build |
| 9 | Clímax | 3:22–3:44 | 22s | alternado | ▲▲▲▲ |
| 10 | Fechamento | 3:44–4:00 | 16s | escuro quente | ▲▲▲ resolução |

**Arco em três atos:**
- **Ato I — Tensão** (cenas 1–3): o mundo acelera, as perguntas se acumulam e surge Performance Analytics.
- **Ato II — Prova** (cenas 4–7): quatro casos reais.
- **Ato III — Amplitude e chamada** (cenas 8–10).

A trilha é a 120 BPM, então 1 compasso dura 2s. Todas as cenas começam e terminam no compasso.

---

## 3. Storyboard por cena

### CENA 1 — HOOK · 0:00–0:16 · escuro

**Visual**
- **0:00–0:02** Tela preta. Um único ponto laranja pulsa no centro, como um batimento.
- **0:02–0:05** O ponto explode num ecossistema vivo em 2.5D: rastros de transações, notificações, mini-gráficos, KPIs girando e alertas passam pela câmera em parallax.
- **0:05–0:09** Três frases batem na tela no ritmo da música, cada uma com um zoom rápido: **Mais dados.** / **Mais velocidade.** / **Mais decisões.**
- **0:09–0:16** O fluxo acelera, com rastros e números subindo. Em 0:15 a imagem congela por um frame, como em stop motion.

**Texto em tela:** "Mais dados. Mais velocidade. Mais decisões."

**Narração**
- `0:05` Mais dados. / Mais velocidade. / Mais decisões.
- `0:10` Hoje, decidir bem exige muito mais do que informação. / Exige **contexto**, **precisão**… e **inteligência**.

**Som:** riser de 0:00 a 0:05, drop com kick em 0:05 e um impacto em cada frase.

**Saída:** os elementos congelados caem como cartas sobre uma mesa clara.

> Ajuste proposto: na segunda frase troquei "velocidade" por "precisão", para não repetir a palavra que acabou de aparecer na tela.

---

### CENA 2 — O PROBLEMA · 0:16–0:34 · claro (off-white)

**Visual**
- **0:16–0:20** Fundo claro com um grid suave. Os elementos da cena 1 estão espalhados.
- **0:20–0:26** Quatro cards de pergunta entram, cada um no instante em que a narradora o lê:
  - 01 · *Como gerar insights em escala?* (ícone: dashboard)
  - 02 · *Como recomendar melhor?* (ícone: cesta)
  - 03 · *Como medir principalidade?* (ícone: órbita/alvo)
  - 04 · *Como ganhar eficiência?* (ícone: relógio/raio)
- **0:26–0:29** Em volta, perguntas menores se acumulam como post-its: "Por que caiu?", "Quem priorizar?", "E se…?". A pilha cresce e a câmera treme de leve: é a pressão.
- **0:29–0:34** Tudo é puxado para o centro, como por um ímã, exatamente em "transformar complexidade em decisão". Sobram os 4 cards, que encolhem e viram os **chips 01–04** no canto superior esquerdo. Eles marcam os capítulos até o fim do filme.

**Texto em tela:** as 4 perguntas · "complexidade → decisão"

**Narração**
- `0:16` Em cada cliente, em cada contexto, a pergunta muda.
- `0:20` Como gerar insights em escala? / Como recomendar melhor? / Como medir principalidade? / Como ganhar eficiência?
- `0:29` Mas a necessidade é sempre a mesma: **transformar complexidade em decisão**.

**Som:** groove abafado (filtrado), estalo de papel e tick a cada card, prato reverso crescendo em 0:32.

**Saída:** tudo é sugado para um ponto e a tela fica preta.

---

### CENA 3 — QUEM SOMOS · 0:34–0:56 · escuro → revelação

**Visual**
- **0:34–0:38** No preto, um círculo vermelho (**Negócio**) entra pela esquerda e um amarelo (**Dados**) pela direita. Eles se aproximam em câmera lenta.
- **0:38–0:41** **Momento-assinatura do filme.** Os círculos se sobrepõem, a interseção acende em laranja com flash e lens flare, e entra o **drop** da trilha. No centro surge **Performance Analytics**, escrito por um scan de luz.
- **0:41–0:48** A câmera abre e a interseção vira um **hub**. Três satélites aparecem quando são citados: *Modelos · Tecnologia · Estratégia*. Os chips 01–04 entram em órbita.
- **0:48–0:54** A cadeia **Dados → Insights → Decisão → Impacto** acende nó a nó, junto com a narração, e partículas correm pelas trilhas.
- **0:54–0:56** A câmera mergulha no chip 01.

**Texto em tela:** "Performance Analytics" · "Dados → Insights → Decisão → Impacto"

**Narração**
- `0:36` É exatamente aqui que entra a track de **Performance Analytics** da Mastercard. *(o nome coincide com o flash)*
- `0:42` No encontro entre **dados** e **negócio**, conectamos modelos, tecnologia e estratégia…
- `0:48` …para transformar dados em insights, insights em decisões — e decisões em **impacto real**.

**Som:** drop completo em 0:39 e um chime de confirmação em cada nó.

**Saída:** a câmera atravessa o chip 01.

---

### CENA 4 — CASO 01 · INSIGHTS EM ESCALA · 0:56–1:26 · claro (interface de dashboard)

**Visual**
- **0:56–1:00** O chip 01 abre o card *Como gerar insights em escala?*, que gira e vira um **dashboard** com KPIs, linha, barras e mapa.
- **1:00–1:05** Os gráficos se mexem, mas o dashboard não diz nada. Na tela: **o quê ✓ · o porquê ?**
- **1:05–1:12** O dashboard desliza para a esquerda. O título dele (no header) está vazio, só um placeholder. À direita, três **agentes geradores** caem do alto, achatando e esticando no pouso. Cada um lê o dashboard com um olhar diferente e escreve um rascunho de insight:
  - **Analista** (amarelo, óculos): *"Volume −8% no Sul, concentrado no e-commerce"*
  - **Business** (vermelho, gravata): *"Queda no Sul coloca a meta do trimestre em risco"*
  - **C-Level** (grafite, coroa discreta): *"Sul exige ação: revisar campanha digital"*
  - Os textos são ilustrativos.
- **1:12–1:17** Os três rascunhos voam para o **Validador**. Na primeira rodada ele **reprova ✕**: o card treme e uma seta de "refazer" leva tudo de volta aos geradores. Eles refinam, mandam de novo, e ele **aprova ✓**.
- **1:17–1:21** O **Embalador** (laranja) recebe o insight aprovado, embala em uma faixa de título e encaixa no **header do dashboard**: o insight vira o título.
- **1:21–1:24** **Escala.** A câmera abre e mostra que aquele dashboard é um entre 24, numa parede 6×4. Os títulos se preenchem em cascata, como pipoca, cada um num tom mais agudo.
- **1:24–1:26** Carimbo **Dashboards que explicam ✓**. O chip 01 recebe o check.

**Texto em tela:** "Insights em escala" · "Multiagentes para dashboards" · "o quê → o porquê" · rótulos dos agentes

**Narração**
- `0:57` Primeiro desafio: gerar **insights em escala**.
- `1:01` Um dashboard mostra **o quê**. Mas quem explica **o porquê**?
- `1:05` Criamos três agentes geradores, com olhares diferentes — **analista**, **business** e **C-level**.
- `1:12` Um **validador** confere tudo — e, se não estiver bom, manda refazer.
- `1:17` Por fim, um agente **embala** o insight, que vira o título do dashboard. Em escala.

**Som:** o groove volta; ticks de digitação nos geradores, um "bup-bup" grave na reprovação, um chime na aprovação e pops subindo de tom na cascata.

**Saída:** a parede de dashboards vira um grid de células, que se transforma na matriz da cena 5 (corte por continuidade).

---

### CENA 5 — CASO 02 · RECOMENDAÇÃO / ALS ★ · 1:26–2:02 · escuro, luminoso

*É o ponto alto didático do vídeo.*

**Visual**
- **1:26–1:30** Card *Como recomendar melhor?* com a tag **Varejo**. O card se estilhaça e vira o grid.
- **1:30–1:39** **A matriz.** Cada linha é um cliente (avatares à esquerda) e cada coluna é um SKU (ícones minimalistas no topo). As compras acendem como pontos, num tick-tick ritmado. Depois, as células vazias mostram um "?" fraco: a maior parte da matriz está vazia.
- **1:39–1:48** **Fatoração.** A matriz se abre como um zíper em duas matrizes finas: **U** (clientes × fatores) e **Vᵀ** (fatores × produtos), com **≈** e **×** entre elas. Os fatores latentes aparecem como colunas coloridas, com a legenda *"gostos ocultos"*.
  - **A alternância do ALS:** U acende ("fixa V, resolve U"), depois Vᵀ acende ("fixa U, resolve V"). São 4 rodadas de vai e vem, cada vez mais rápidas.
  - No canto, uma pequena curva de erro cai a cada rodada.
  - Ao fundo, em marca d'água: `R ≈ U·Vᵀ` · `min Σ(r − uᵀv)² + λ(‖u‖² + ‖v‖²)`
- **1:48–1:53** **Recombinação.** U e Vᵀ voltam e se multiplicam. Uma faixa de luz atravessa a matriz e cada célula vazia ganha cor, do escuro ao amarelo, ao laranja e ao vermelho. As maiores de cada cliente recebem uma estrela: **propensão**.
- **1:53–1:58** **Espaço latente.** A matriz inclina em 2.5D e se desfaz. Cada cliente e cada produto vira um ponto, posicionado pelos seus fatores. Produtos parecidos ficam perto uns dos outros. Um cliente acende e se liga aos produtos mais próximos.
- **1:58–2:02** **A cesta.** Os produtos mais próximos voam para uma cesta, que se monta e é entregue ao cliente com um *ding*. Carimbo **Recomendação inteligente ✓**. O chip 02 recebe o check.

**Texto em tela:** "Recomendação inteligente" · "ALS · Fatoração de Matrizes" · "R ≈ U·Vᵀ" · "fatores latentes" · "propensão"

**Narração**
- `1:27` Segundo desafio: **recomendação**. Num cliente do varejo: quais SKUs e cestas recomendar para cada cliente?
- `1:33` Cada linha é um cliente. Cada coluna, um produto. E quase toda a matriz… está **vazia**.
- `1:39` Com fatoração de matrizes — o **ALS** — decompomos a matriz em fatores ocultos, alternando o ajuste entre clientes e produtos até o padrão emergir.
- `1:49` As lacunas viram **propensões**.
- `1:53` E, no espaço latente, cada cliente se aproxima da **cesta certa**.

**Som:** groove mais escuro com arpejo dedilhado, um tick por compra, tic-tac acelerando na alternância, brilho sonoro na recombinação e *ding* na entrega.

**Saída:** um círculo se abre sobre a imagem (o motivo da interseção) e leva para uma cena clara.

---

### CENA 6 — CASO 03 · PRINCIPALIDADE / EMBEDDINGS ★ · 2:02–2:32 · claro → espaço profundo

*A cena tem uma única decolagem, do plano para o espaço. Ela não repete o espaço latente da cena 5: aqui é uma nebulosa 3D só de produtos, com vetores e clusters.*

**Visual**
- **2:02–2:06** Card *Como medir principalidade?* com a tag **Issuer**. O card se desdobra numa prateleira limpa de 24 produtos financeiros em tiles separados, sobre fundo claro: *itens isolados*. Os produtos vêm em quatro famílias, que depois viram os clusters:
  - **Dia a dia:** Conta digital, Conta salário, Pix, Cartão de débito, Cartão de crédito, Débito automático, Cashback
  - **Investimentos:** CDB, LCI, LCA, Tesouro Direto, Poupança, Fundos, Previdência
  - **Crédito:** Crédito pessoal, Consignado, Cheque especial, Financiamento imobiliário, Financiamento de veículo, Consórcio
  - **Proteção:** Seguro de vida, Seguro residencial, Seguro cartão, Capitalização
- **2:06–2:11** Cada tile vira. No verso aparece um vetor em fonte mono, com números se embaralhando: `[0.82, −0.14, 0.33, 0.07, …]`. Na tela: **produto → vetor**.
- **2:11–2:16** **Decolagem.** O fundo escurece até um grafite azulado profundo. Os tiles viram pontos de luz e decolam para um espaço 3D, deixando rastros, num whoosh crescente.
  - A câmera começa uma órbita lenta, com profundidade de campo: pontos distantes ficam menores e desfocados.
  - Eixos fracos marcam `dim 1 … dim 128`.
- **2:16–2:23** **Afinidade.** Os pontos se acomodam em clusters, e halos de nebulosa nas cores da marca acendem em volta de cada grupo. Dois pontos próximos se ligam por uma linha com o arco `cos θ = 0.94`; um ponto distante mostra `0.12`. Na tela: **proximidade = afinidade**.
- **2:23–2:29** **Principalidade.** Uma trilha luminosa passa pelos produtos que um cliente usa (Conta digital → Pix → Cartão de crédito → CDB → Previdência) e converge para uma região central brilhante, o *núcleo de principalidade*. A constelação se simplifica num mapa limpo, com rótulos elegantes nos clusters.
- **2:29–2:32** Carimbo **Afinidade mapeada ✓**. O chip 03 recebe o check.

**Texto em tela:** "Embeddings" · "produto → vetor" · "proximidade = afinidade" · "Mapeando relações entre produtos"

**Narração**
- `2:03` Terceiro desafio: **principalidade** — entender como os produtos financeiros se relacionam.
- `2:09` Com **embeddings**, deixamos de olhar itens isolados: cada produto vira um vetor, num espaço de muitas dimensões.
- `2:17` Ali, **proximidade significa afinidade**. Produtos parecidos se agrupam, regiões se formam…
- `2:24` …e padrões invisíveis viram um **mapa claro** para decisões de principalidade.

**Som:** pad aéreo com timbres de vidro, whoosh na decolagem, *ping* suave no cosseno e chime no carimbo.

**Saída:** o núcleo cresce até ficar branco, e há um corte seco para um escritório claro.

---

### CENA 7 — CASO 04 · LIGHTS-OFF REPORTING · FRAUDE ★ · 2:32–3:00 · claro → apagão → neon

**Visual**
- **2:32–2:35** Card *Como ganhar eficiência?* com a tag **Fraude · Board**.
- **2:35–2:42** **Antes.** Fundo claro, levemente dessaturado, em 2D flat e com tom caricato:
  - planilhas se empilham;
  - janelas abrem, com setas de copiar e colar;
  - um analista desenhado com formas geométricas corre entre as telas;
  - um relógio gira rápido e as xícaras de café se acumulam (☕×4);
  - uma barra de progresso trava em 87%.
  
  Os rótulos piscam: *extrair · conferir · formatar · repetir*.
- **2:42–2:45** **A virada.** Um interruptor gigante desliza para a tela. *CLICK.* Tudo apaga. Um beat de silêncio.
- **2:45–2:54** No escuro, um **pipeline neon** acende trecho por trecho, cada um com uma batida da trilha:
  1. **Ingestão:** pacotes de dados entram.
  2. **Validação:** portões com ✓; um pacote vermelho é barrado.
  3. **Processamento:** engrenagens transformam os dados.
  4. **Insights:** os **Agentes do caso 01 voltam**: os geradores leem o report, o Validador aprova e o Embalador coloca o destaque no título do report ("↑ alerta", "novo padrão").
  5. **Publicação:** o report se monta sozinho, com capa, KPIs e gráficos.
  6. **Board:** uma sala executiva minimalista recebe o report, que se ilumina.
  
  O ciclo se repete no ritmo da música (mês 1, mês 2, mês 3…), para mostrar consistência. O relógio agora está calmo.
- **2:54–3:00** Tela dividida em antes e depois: *Manual · fragmentado · lento*, em cinza, contra *Automático · consistente · escalável*, iluminado. Carimbo **Lights-off reporting ✓**. O chip 04 recebe o check e os **4 de 4** fecham com um som de "combo".

**Texto em tela:** "Lights-off reporting" · "Fraude" · "Do dado ao board"

**Narração**
- `2:33` Quarto desafio: **eficiência**. O report de fraude para o board exigia trabalho manual: extrair, conferir, formatar… repetir.
- `2:42` Então criamos uma automação **lights-off**. *(o CLICK vem logo depois)*
- `2:46` Os dados chegam, são validados, processados… e o report é publicado sozinho. E os agentes de insight destacam **o que importa**.
- `2:55` Do dado ao board — com **velocidade, consistência e escala**.

**Som:**
- **Antes:** ticks frenéticos, tique-taque e pops levemente cômicos.
- **Apagão:** um click alto, depois silêncio total.
- **Pipeline:** a trilha volta com o baixo a cada trecho, um chime marca a publicação e um acorde de "combo" fecha o 4 de 4.

**Saída:** a câmera recua e o pipeline vira um ponto de uma constelação.

---

### CENA 8 — CAPACIDADES · 3:00–3:22 · escuro (constelação)

**Visual**
- **3:00–3:04** A câmera recua bastante: os 4 casos são 4 pontos acesos numa rede de tiles conectados ao redor do hub.
- **3:04–3:16** Cinco novos pontos acendem, cerca de 2,5s cada, cada um no momento em que é citado. A câmera dá um zoom rápido em cada um e segura 2 frames, como em stop motion:
  - **Crédito:** o ponteiro de um score oscila. Duas distribuições se sobrepõem (bons e maus pagadores) e uma linha de corte desliza.
  - **Machine Learning:** uma árvore de decisão cresce galho a galho, e as folhas acendem.
  - **Advanced Analytics:** a regressão se ajusta aos pontos e um cone de previsão avança para o futuro.
  - **Ciência de Dados:** os pontos se organizam sozinhos em clusters, com os centros se movendo.
  - **IA:** um prompt vira um grafo de raciocínio e depois uma resposta, com agentes passando o bastão.
- **3:16–3:22** Os 9 pontos acesos pulsam juntos. A câmera recua cada vez mais rápido, rumo ao clímax.

**Texto em tela:** "Crédito" · "Machine Learning" · "Advanced Analytics" · "Ciência de Dados" · "IA"

**Narração**
- `3:01` E esses são só alguns exemplos.
- `3:04` Nossa atuação vai de **crédito**… a **machine learning**… de **advanced analytics**… a **ciência de dados**… e **inteligência artificial**… *(cada termo acende seu ponto)*
- `3:16` …sempre aplicados a problemas reais de negócio.

**Som:** a trilha vai crescendo; cada ponto toca uma nota numa escala ascendente (sensação de progresso), e um riser sobe de 3:16 a 3:22.

---

### CENA 9 — CLÍMAX · 3:22–3:44 · claro e escuro alternando no beat

*É o ápice emocional e visual do vídeo.*

**Visual**
- **3:22–3:33** **Montagem no ritmo da música.** São cerca de 1s por imagem, com corte seco, um giro rápido de câmera, fundo alternando claro e escuro e uma palavra gigante batendo na tela:
  1. **Estatística:** uma curva gaussiana se preenche, com as marcas de σ.
  2. **Regressão:** a linha atravessa os pontos.
  3. **Classificação:** uma fronteira curva separa pontos vermelhos e amarelos.
  4. **Árvores:** a árvore explode em galhos.
  5. **Ensembles:** várias árvores votam e viram uma resposta.
  6. **Clusters:** os pontos se encaixam em 3 grupos.
  7. **Anomalias:** um ponto pulsa em vermelho, fora da multidão.
  8. **Embeddings:** a nuvem 3D gira.
  9. **Recomendação:** a matriz se enche de calor.
  10. **Agentes:** bots conectados trocam sinais.
  11. **Automação:** pacotes cruzam o pipeline.
- **3:33–3:39** As 11 imagens viram tiles enfileirados num eixo **simples ●────● complexo**, com gaussiana e regressão à esquerda e agentes e automação à direita. Um slider de luz varre da esquerda para a direita e acende tudo. Na tela: **Dos problemas mais simples aos mais complexos**.
- **3:39–3:44** Os tiles formam um anel e convergem para o centro. Em letras enormes: **Nossa especialidade é analytics.** Impacto e flash.

**Narração**
- `3:22` Estatística. Regressão. Classificação. Árvores. Ensembles. Clusters. Anomalias. Embeddings. Recomendação. Agentes. Automação. *(uma palavra por corte)*
- `3:33` Não importa o desafio. **Dos problemas mais simples aos mais complexos**…
- `3:39` …nossa especialidade é resolver com **analytics, criatividade e escala**.

**Som:** o drop no máximo; cada corte com kick, whoosh e uma batida na tipografia; um sweep ascendente no slider; impacto final e prato reverso entrando na cena 10.

---

### CENA 10 — FECHAMENTO · 3:44–4:00 · escuro com brilho quente

**Visual**
- **3:44–3:51** Um respiro. Os dois círculos voltam e se sobrepõem, a interseção laranja acende e a assinatura **Performance Analytics** aparece no centro, junto com a narração. Em órbita giram ícones do filme inteiro: dashboard, matriz, vetor, pipeline, score e árvore. Os Agentes acenam.
- **3:51–3:55** **O futuro da decisão é orientado por analytics.** As palavras aparecem uma a uma, junto com a voz, com uma faixa de luz passando.
- **3:55–4:00** A órbita se acomoda. No card final, em destaque laranja: **Use mais esta track.** Embaixo, menor: *Traga seu próximo desafio.* O último golpe da trilha cai em 3:56 e o reverb se estende. A imagem escurece e só resta o ponto laranja pulsando, o mesmo da abertura.

**Narração**
- `3:45` Se o desafio pede **inteligência, escala e impacto**, a resposta passa por **Performance Analytics**.
- `3:51` O futuro da decisão… é orientado por analytics.
- *O CTA final fica sem voz, só com a tipografia e o golpe musical. Assim ele bate mais forte.*

---

## 4. Direção de voz

- **Voz:** feminina, pt-BR, calorosa e segura, com sorriso na voz.
- **Ritmo:** cerca de 150 palavras por minuto. Mais acelerada nos casos, mais lenta na frase final do clímax e no fechamento.
- **Volume de texto:** cerca de 395 palavras, ou 2:45 de fala. Sobra cerca de 1:15 para respiros musicais, como o drop da cena 3, o apagão e a montagem.
- **Marcações no roteiro:** **negrito** indica ênfase, `/` indica pausa curta e `…` indica suspensão.
- **Pronúncia dos termos em inglês** (no TTS, uso grafia fonética):

  | Termo | Pronúncia |
  |---|---|
  | insights | "ínsaits" |
  | machine learning | "machín lérning" |
  | ALS | "á-éle-ésse" |
  | embeddings | "imbédings" |
  | lights-off | "laits-óf" |
  | board | "bórd" |
  | track | "tréc" |

---

## 5. Direção visual e de movimento

- **Paleta:** Vermelho `#EB001B` · Laranja `#FF5F00` · Amarelo `#F79E1B` · Grafite `#141414` / `#1E1E1E` · Off-white quente `#F5F1EA` · Neutros `#D9D3CA` / `#8A8378`.
- **Tipografia** (offline, com fontes do sistema): sans pesada (800) para as frases de impacto, leve (300) para os textos de apoio e mono para os detalhes técnicos.
- **Movimento — entrar rápido e assentar:**
  - os elementos entram rápido, passam um pouco do ponto e voltam;
  - a câmera virtual faz zoom, pan e rotação, com uma tremida leve nos impactos;
  - os elementos animam a 12 fps sobre uma câmera fluida a 30 fps, o que dá textura de stop motion sem perder o acabamento premium;
  - parallax em 3 camadas.
- **Transições-assinatura:**
  - um círculo que se abre sobre a imagem (o motivo da interseção);
  - cortes por continuidade (a parede de dashboards vira a matriz; o pipeline vira a constelação);
  - a câmera atravessando um ponto para entrar na cena seguinte;
  - um congelamento de 1 frame antes dos grandes cortes.
- **Fixos na tela:** os chips 01–04 no canto superior esquerdo, marcando o progresso, e um selo discreto "Performance Analytics".

---

## 6. Trilha e sound design (Web Audio, 100% sintetizado)

**Trilha:** eletrônica corporativa a 120 BPM, com kick, clap, hats, baixo synth, arpejo dedilhado e pad. As seções acompanham o filme:
- intro com riser e drop em 0:05;
- groove abafado na cena 2;
- drop completo em "Performance Analytics" (0:39);
- uma camada nova a cada caso;
- **silêncio total no apagão (2:43)** e volta com o baixo;
- crescendo na cena 8;
- energia máxima na cena 9, com cortes picotados na batida;
- acorde de resolução e reverb longo na cena 10.

**SFX:** whoosh (ruído filtrado), tick, click do interruptor, impacto (grave com ruído), riser, pop, digitação, chime de confirmação em duas notas, *ding* de entrega e acorde de "combo".

---

## 7. Pontos para validar

1. **Resultados reais.** Não inventei métricas. Se houver números aprovados para divulgação (horas economizadas no report, ganho na recomendação etc.), eles entram nos carimbos ✓ e deixam o vídeo bem mais forte.
2. ~~**Multiagente.**~~ **Validado:** 3 geradores (Analista, Business, C-Level) → Validador (pode reprovar e mandar refazer) → Embalador (o insight vira o título do dashboard ou slide).
3. ~~**Principalidade.**~~ **Validado:** produtos financeiros de um issuer, com nomes brasileiros.
4. ~~**Anonimização.**~~ **Validado.**
5. **CTA final.** "Use mais esta track." + "Traga seu próximo desafio." O público é interno (quem aciona a track)? Prefere outro fechamento?
6. **Voz.** A voz nativa do navegador funciona offline, mas a qualidade depende do sistema (Windows "Maria", macOS "Luciana") e pode soar robótica.
   - Minha proposta: deixar o TTS como padrão, sincronizado frase a frase, com os cues prontos para trocar por uma locução gravada embutida no próprio HTML.

---

## 8. Próximo passo (após validação)

- HTML único em 1920×1080, com play, pause, restart e barra de progresso.
- Parâmetros configuráveis no topo do código: duração, cores, textos, timing das cenas, intensidade de movimento e áudio liga/desliga.
- Documentação da estratégia de animação e da arquitetura técnica.
