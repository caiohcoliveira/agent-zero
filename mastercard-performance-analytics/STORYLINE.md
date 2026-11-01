# A Linha — Storyline v7 (experimento)

**Decisões que movem o negócio.** Esta versão aplica o roteiro criativo v7: o filme contém o contexto, o mecanismo e a conclusão de cada assunto. As apresentadoras aprofundam, mas assistir em silêncio basta.

- **Branch:** `claude/mastercard-analytics-video-experimento`.
- **Histórico das versões anteriores:** fica na branch `claude/mastercard-analytics-video-4cof1t` (v5.4).

## O que mudou da v5.4 para a v7

**Mudanças estruturais**
- **Contrato de cada tela:** etiqueta e título no topo, explicação junto ao visual, rótulos nos gráficos e conclusão embaixo.
  - O texto é desenhado depois da pintura e fica nítido.
  - Os tamanhos são fixos: 56 / 36 / 28 / 40 px.
  - A câmera para na leitura.
- **Tempo de leitura medido:** `tools/read_check.js` mede o tempo de cada texto (2,5 palavras/s + 2,5 s por visual novo). Resultado: 72 telas, 0 curtas.
- **Filme:** 7:41 → **9:11**, com as músicas remontadas para dar tempo de ler.
- **A linha laranja** vira o fio do filme: a pergunta ligada ao valor, a ponte, a tendência do gráfico, a cidade das capabilities, o fluxo da automação, o ciclo dos agentes e o viaduto dos pilares.
- **A analista reaparece** no embarque (com o bilhete), atravessando a ponte na 01, nas equipes da 05 e caminhando pela cidade da 07.

**Dados e qualificadores**
- **Números com qualificador:**
  - Brasil marcado como *estimativa de fechamento*, T4 como *preliminar*;
  - cestas como **índice** (2ª melhor = 100 → 118,8, "não é taxa absoluta");
  - principalidade em **p.p. sobre o controle, backtest, ganho teórico, Top 3**;
  - agentes como **8 ativos + 22 oportunidades = universo de 30**. O "15" da manchete antiga sai do filme;
  - "4 cases" em vez de "4 clientes".
- **Relatórios de fraude:** o fluxo não tem mais o nó "Insights". A ligação com o Insight Agent aparece tracejada como **integração possível**.

**Mantido da v5.4, por escolha**
- explosão de neon só no fluxo e na placa;
- as 8 disciplinas acumulando;
- o letreiro WELCOME TO…;
- a estação viva nas conversas.

## A sessão (até 20 min)

| Momento | Modo | Filme |
|---|---|---|
| Play 1 · embarque | vídeo | 0:00–0:20 |
| Conversa 0 | fala | — |
| Play 2 · estações 01–03 | vídeo | 0:20–2:55 |
| Conversa 1 | fala | — |
| Play 3 · estação 04 (4 cases), 05, 06 | vídeo | 2:55–7:59 |
| Conversa 2 | fala | — |
| Play 4 · 07, disciplinas, letreiro | vídeo | 7:59–9:11 |
| Encerramento | fala | — |

## Play 1 · embarque (20 s, trilha sintetizada)

1. **Identidade (0–6 s)**
   - As luzes da plataforma acendem.
   - O painel de partidas vira as placas até **PERFORMANCE ANALYTICS**.
   - Embaixo, a missão escrita: "Transformamos *dados* em *decisões* e soluções de negócio."
   - A analista chega com o bilhete na mão; o trem encosta vindo da esquerda, com o farol varrendo a plataforma; o bilhete é carimbado.
2. **Propósito (6–14 s)**
   - As portas abrem no tempo cheio da música e o painel apaga.
   - Título "Da *pergunta* ao *valor*" e explicação "Combinamos conhecimento de negócio, analytics e implementação para orientar decisões."
   - Ela embarca e a câmera mergulha pela porta.
   - Do outro lado, uma cidade pintada: a linha laranja sai de um balão "?" ("uma pergunta de negócio"), passa pelas estações Negócio, Analytics e Implementação e chega ao **Valor**, que acende.
3. **Percurso (14–20 s)**
   - A câmera recua e a linha vira o mapa completo.
   - Três capítulos escritos: **Onde atuamos** (01–03), **Cases e resultados** (04–06) e **O que vem pela frente** (07).
   - Título "O percurso" e a frase "Uma viagem pelas capacidades da nossa área, em três capítulos."

## Conversa 0

- **Tela:** a estação viva ao fundo, a missão escrita no topo e o mapa com os 3 capítulos.
- **Interação:** clique numa estação para aproximar e ver o cartão (título, o que mostra, tópicos); → embarca.

## Play 2 · estações 01–03 ("Vintage Film Funk" remontada, 2:35)

### 01 · Papel estratégico (47 s) — o mundo das perguntas encontra uma ponte

1. **Perguntas:** a analista atravessa o corredor das perguntas. Há postes com cartões pendurados ("Por que caiu?", "Quem priorizar?", "Onde investir?") e a cidade das perguntas ao fundo.
   - Título "Decisões difíceis começam com perguntas".
2. **A ponte:** a câmera recua e mostra dois penhascos com etiquetas **NEGÓCIO** e **DADOS**.
   - "O papel da área": "Conectamos perguntas de negócio aos dados necessários para respondê-las."
   - O cabo da ponte é a linha laranja.
3. **Os 4 serviços:** os quatro vãos da ponte caem um por um, numerados e rotulados.
   - A lista "OS 4 SERVIÇOS" cresce junto: *Diagnóstico*: entender o problema · *Estratégia*: definir o caminho · *Implementação*: construir a solução · *Mensuração*: verificar o resultado.
   - Ela atravessa e o lado dos dados amanhece: as torres acendem.
4. **Do diagnóstico à mensuração:** a linha segue pelas estações Dados → Decisão → Ação → Resultado.
   - "Atuamos do diagnóstico à mensuração para gerar valor para o cliente."
5. **Conclusão:** "Analytics é uma *capacidade estratégica* da consultoria."

### 02 · Evolução e impacto (44 s) — o crescimento ganha forma e uma régua

1. **Faturamento anual da track:** gráfico com eixo de base zero, unidade (US$ mil, conforme o JSON) e marcas.
   - Valor em cima de cada barra, anos embaixo, 2026 hachurado como "(previsão)" e a fonte.
   - A linha laranja liga os topos.
2. **Leitura:** 2023 e 2025 acendem e uma régua mede "×1,8".
   - "Entre 2023 e 2025, o faturamento passou a 1,8 vez o valor inicial."
3. **Brasil:** "período de referência · estimativa de fechamento". Dois comparadores separados, na mesma unidade:
   - **1,74×** o período anterior;
   - **1,65×** o orçamento.
4. **Trimestres:** barras agrupadas (anterior · orçamento · realizado), com legenda fixa e T4 marcado "(prel.)".
   - A frase é calculada: "O realizado superou o orçamento em *todos os trimestres*."
5. **Conclusão:** "Crescimento *consistente*, acima do *planejado*."

### 03 · O que levamos ao mercado (64 s) — capabilities explicadas no próprio filme

A câmera viaja por uma avenida noturna, com a linha no chão.

1. **Onde aplicamos analytics:** três fachadas, cada uma com uma aplicação e a decisão que ela apoia.
   - Emissores · *Principalidade* · decidir qual produto oferecer.
   - Adquirentes · *Market share* · decidir onde crescer.
   - Varejo · *Cestas de produtos* · decidir o que promover.
2. **O que entregamos:** três máquinas, só três de cada vez.
   - Segmentação · identificar públicos.
   - Recomendação · priorizar ofertas.
   - Automação · executar rotinas.
3. **Com as outras tracks:** linhas coloridas convergem na mesma baldeação, "a decisão do cliente".
4. **Modelos preditivos antecipam resultados:**
   - histórico → "hoje" → cenário provável com faixa de incerteza ("previsão é cenário, não certeza");
   - exemplos: risco de fraude, chance de saída, previsão de gastos.
5. **Modelos prescritivos ajudam a escolher ações:**
   - a linha chega a uma bifurcação com três ações e "objetivo: maior conversão";
   - o resultado estimado aparece como ilustrativo e a melhor ação acende;
   - exemplos: próxima oferta, alocação de campanhas, recomendação de incentivo.
6. **Síntese:** dois cartões, "Antecipar o que pode acontecer" × "Recomendar como agir".
   - "A escolha do modelo depende do *problema* e da *decisão de negócio*."

## Conversa 1

- **Tela:** a estação viva e a chamada no topo, "ONDE ISSO ENCONTRA O SEU CLIENTE?".
- **Cartazes legíveis sem clicar:**
  - **01:** os 4 serviços com definição;
  - **02:** gráfico de faturamento, 1,8×, Brasil (estimativa) e conclusão;
  - **03:** preditivos × prescritivos, com exemplos.
- **Faixa:** "A seguir: *quatro cases*, do problema à solução e ao resultado."
- **Lupa:** cenas em loop. Na 03, o **catálogo com os 20 modelos** (caso de uso em português · técnica em inglês).

## Play 3 · estações 04–06 ("Technology" remontada, 5:04)

### 04 · Analytics em ação (11 s)

- "ANALYTICS EM AÇÃO" pintado.
- Os 4 cases surgem como estações na linha: Cestas de produtos · Principalidade · Relatórios automatizados · Agentes de insights.
- "Do *problema* ao *resultado*."

**Estrutura de cada case:**
- Respiro: a porta do vagão com "CASE N DE 4".
- Etiqueta + etapa no topo (PROBLEMA, DADOS, COMO FIZEMOS, SOLUÇÃO, RESULTADO…), título fixo e explicação no painel.
- O drop da música cai na solução.

### Case 1 · Cestas de produtos (Cliente Banana · varejo, 60 s)

| Etapa | Texto | Visual |
|---|---|---|
| Problema | Como incentivar clientes a comprar em *outras empresas do mesmo grupo*? | as três empresas e um cliente que hoje compra em uma só |
| Dados | Analisamos o histórico de compras para aprender afinidades… | recibos entram no scanner e viram fichas: 24 meses · 101 mil clientes · 894 subgrupos · 3,8 mi interações |
| Como fizemos | *BM25* reduz o destaque de itens muito comuns. *ALS* aprende padrões… | matriz clientes × produtos com legenda **compra observada × score estimado**; sacola e pão com peso menor; o ALS ajusta clientes e produtos em turnos e o **erro de reconstrução (ilustrativo)** cai; similaridade de cosseno junta os produtos |
| Solução (drop) | Produtos com afinidade formam *cestas*… | afinidades → cestas → públicos → campanhas; as 3 cestas e o público de cada uma; DECISÃO: mecânicas de campanha |
| Resultado | Destilados teve conversão *+18,8% maior* que a 2ª melhor campanha. | índice: 2ª melhor = 100, Destilados = 118,8 ("não é taxa absoluta") |
| Conclusão | O histórico de compras orienta *cestas* e *públicos*. | — |

### Case 2 · Principalidade (Cliente Manga · emissor, 60 s)

| Etapa | Texto | Visual |
|---|---|---|
| Objetivo | *Principalidade* é tornar o banco a *principal escolha* do cliente. + "Quais produtos ajudam a fortalecer esse relacionamento?" | a carteira; o cartão do banco sobe com a coroa "o banco principal" |
| Dados | Analisamos 92 mil associados, seus produtos e sua principalidade atual. | fichas e "cada associado recebe a sua recomendação" |
| Como fizemos | *UMAP* e *K-Means* organizam perfis. *ALS* estima afinidades… | 8 perfis com nomes do JSON; embeddings 3D ("representações numéricas · perto = afinidade · projeção ilustrativa") |
| Solução (drop) | A recomendação combina afinidade, conversão e ganho de principalidade. | ranking **ANTES** (só afinidade) × **DEPOIS** (critérios combinados); pontos de principalidade do Top 3 |
| Resultado | *+4 p.p. de principalidade* versus controle, em backtest. | ganho em p.p. sobre o controle (= 0), geral e por subsegmento (PF I–IV+); "backtest: avaliação retrospectiva · ganho teórico · Top 3"; melhor perfil |
| Conclusão | O motor prioriza produtos pelo *objetivo de relacionamento* do banco. | — |

### Case 3 · Relatórios automatizados (fraude, 60 s) — ela apaga a luz, o processo continua

| Etapa | Texto | Visual |
|---|---|---|
| Antes | Cada relatório de fraude para o board era *montado manualmente*. | ela digita cansada; cada gesto escrito ao lado: 1 extrair os dados · 2 conferir · 3 copiar e colar · 4 montar o relatório |
| Problema | O trabalho *se repetia*… e consumia *tempo da equipe*. | relógio acelerado, pilhas crescendo, o dia vira noite, "e de novo… ↻" (sem contador de horas inventado) |
| Como fizemos | *Automatizamos* o fluxo de dados até a geração e o envio do relatório. | a lâmpada da ideia; o fluxo nomeado se monta: Entrada dos dados → Validação → Processamento → Relatório → Envio ao board |
| Solução | *Lights Off*: a rotina continua funcionando *sem montagem manual*. | ela vai ao interruptor; a trilha esvazia; clique seco, escuro e silêncio; no drop só o fluxo acende em neon, com a placa **LIGHTS OFF RPA**, e o dado corre sozinho com "execuções: NNNN"; o escritório fica escuro |
| Resultado | Relatórios gerados *automaticamente*, no formato do board. | ANTES (4 etapas manuais) × DEPOIS (automático, do dado ao board); ela põe os fones, dança e sai |
| Próximo passo | Próxima possibilidade: integrar *agentes* para automatizar também a escrita de *insights*. | ligação tracejada para "Insight Agent · integração possível"; a câmera mergulha nela |

### Case 4 · Agentes de IA para insights (Insight Agent · adquirentes, 69 s)

| Etapa | Texto | Visual |
|---|---|---|
| Problema | A escrita manual de insights *não acompanhava* o volume… | painel "Market share e share of wallet · adquirentes", insight escrito à mão, fila de páginas |
| Gerar | Agentes *geradores* produzem versões… para *diferentes públicos*. | o mesmo fato vira três versões, "para: Analista / Business / C-Level" (exemplos ilustrativos) |
| Avaliar e corrigir | Agentes *avaliam* os textos e encaminham os *reprovados*… | ciclo gerar → avaliar → (reprovado) corrigir → avaliar de novo → aprovado; exemplo de revisão |
| Qualidade | *Regras* e *modelos* avaliam critérios de qualidade do texto. | Regex · regras textuais; BERT · modelo de linguagem; Random Forest · nota de qualidade (164 características); "é uma avaliação do sistema, não uma garantia" |
| Escala (drop) | O mesmo processo se repete em *milhares* de páginas e painéis. | a parede de páginas se abre; uma janela ampliada mostra o ciclo em cada página |
| Situação | 8 adquirentes ativos. 22 oportunidades adicionais. Universo apresentado: 30. | 30 marcas: 8 acesas e 22 tracejadas, com legenda |

### 05 · Escalando o impacto (20 s) — a mesma equipe, um alcance maior

- **Diagrama nomeado:** **Equipe** (a analista e colegas) → **Motor produtizado** → **Ativo reutilizável**.
- **Projetos:** cinco contextos diferentes ligados ao mesmo ativo; a equipe fica na origem.
- **Texto:** "*Automação*, *padronização* e *reutilização* ampliam o alcance das entregas."
- **Conclusão:** "Um *ativo reutilizável* permite aplicar capacidades em *novos projetos*."

### 06 · A Prática (24 s) — os pilares viram a infraestrutura da viagem

- **Visual:** os pilares sobem como colunas de viaduto com os nomes, e a linha corre por cima.
- **Contribuições:** cada pilar ganha um cartão com uma contribuição curta (campo `contribution` do JSON) e "N entregas", em dois grupos que ficam até o fim.
- **Conclusão:** "A combinação dessas capacidades permite *executar os projetos*."

## Conversa 2

- **Tela:** a estação viva e a chamada "QUAL DESAFIO PODE VIRAR O PRÓXIMO CASE?".
- **Cartazes:**
  - **04:** as quatro provas lado a lado (+18,8% · +4 p.p. · automáticos · 8 + 22);
  - **05:** o diagrama do reuso;
  - **06:** os pilares com a contribuição de cada um.
- **Lupa:** 12 cenas em loop dos cases, mais a 05 e a 06.

## Play 4 · final ("Epic Piano", 1:12)

1. **07 · Para onde a linha segue (26 s):** uma cidade noturna conectada.
   - Cada direção tem painel ilustrado, título e subtítulo, em três grupos:
     - Apoiar decisões estratégicas · dos clientes (sala do board) e Combinar analytics · com as demais tracks;
     - Reutilizar ativos · para ampliar o alcance e Automatizar rotinas · para ganhar eficiência (robôs);
     - Ampliar projetos User-Pay · com Advanced Analytics + "Entregas analíticas com *contratação definida* para cada projeto."
   - As outras linhas chegam à cidade e a analista caminha junto da linha.
   - No fim, uma estação tracejada "?": a próxima estação.
2. **Disciplinas (19 s):** "Por trás de tudo, *disciplinas*". As 8 entram uma a uma num painel 4 × 2 e **ficam na tela**, cada uma com visualização, nome e subtítulo:
   - Estatística · setup de projetos de marketing e estratégia
   - Otimização & PO · modelos para tomada de decisão
   - Supervisionados
   - Não supervisionados
   - NLP
   - Redes neurais (MLP)
   - Deep learning (transformer)
   - IA (agentes)

   No fecho, "Tudo se resume a *Analytics & Advanced Analytics*."
3. **Letreiro (26 s, como na v5.4):** WELCOME TO THE FUTURE → AI → ANALYTICS → PERFORMANCE ANALYTICS, com legendas em português; o acorde final acende o letreiro.

## Encerramento

O letreiro fica aceso sobre a estação viva. O cartaz 07 lista as 5 direções e a base. As cenas montadas abrem em loop.

## Pendências de validação (do roteiro v7)

- **Receita:** confirmar unidade, período do Brasil e o valor da previsão 2026. Os valores do repositório estão mascarados.
- **Agentes:** confirmar universo (30), ativos (8) e oportunidades (22) e o que está em produção.
- **Cases e métricas:**
  - cestas: confirmar campanha e comparação;
  - principalidade: confirmar a metodologia do backtest e a base do controle;
  - status "produtizado" (está no JSON).
- **Agentes:** trocar os exemplos ilustrativos (objeto `EX` em `src/22-cases.js`) por um exemplo real do tipo de revisão.
- **Pilares:** nomes reais e contribuições finais (`contribution`) para os 5 pilares.
- **User-Pay:** confirmar a definição comercial.
