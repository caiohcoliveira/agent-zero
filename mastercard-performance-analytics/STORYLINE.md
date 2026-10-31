# A Linha — Storyline v3.1

**Sessão:** 20 min, sendo ~9 min de vídeo e 11 min de fala das apresentadoras, em 4 paradas
**Vídeo:** HTML único offline, 1920×1080, em **modo apresentação**: trechos de vídeo e paradas em loop, controlados pelo teclado ou pelo passador de slides
**Status:** **proposta em validação**. Nada da v3 foi implementado. O HTML atual ainda é a v2, cujo roteiro está no histórico (commit `20e1d96`).

Marcadores usados no texto:
- **[v2]** reaproveita uma cena da v2, com ajustes;
- **[nova]** cena nova;
- **[fictício]** número inventado, que deve ser trocado;
- **[a confirmar]** depende de material ou de confirmação de vocês.

---

## Ajustes desta rodada (v3 → v3.1)

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
- **Cartaz 02:** o placar **23** pessoas · **140+** projetos · **62%** dos engagements · receita **×6**. De vez em quando, uma plaqueta re-vira.
- **Cartaz 03:** o Venn de analytics com as tracks. As lentes laranjas acendem em sequência, com a faixa "portfólio em 3 ondas".

### Parada 2 · retomada do trecho 2 (3:30 de fala)
- **Cartaz 04:** os 3 comprovantes de impacto lado a lado (ticket +14% · +11 p.p. de clientes principais · 10 dias → 15 min), balançando como papel pendurado.
- **Cartaz 05:** "Insights em escala · transformers em GPU · o dado nunca sai". Os agentes passam o título de mão em mão, em loop, e o perímetro pulsa.
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

#### Estação 02 — Our Evolution & Business Impact (70s) [nova] [fictício]
1. **Chegada (4s).**
2. **Linha do tempo 2022 → 2026 (32s):** um trilho com 5 estações-ano. Em cada uma:
   - um selo postal com o marco;
   - bonequinhos recortados empilhando o time: 4 → 7 → 11 → 16 → 23;
   - um contador de engagements com analytics subindo de 15% para 62%;
   - por cima, uma linha neon de receita sobe.
3. **Placar split-flap (10s):** **23** pessoas · **140+** projetos · **62%** dos engagements · **US$ 12,4 mi** de receita.
4. **Relevância (8s):** numa fileira de 10 cards de engagement, 6 ganham o sticker laranja de analytics.
5. **Onde atuamos (12s)** [nova]: colagem com os segmentos atendidos e a contagem de clientes de cada um: issuers 18 · adquirentes 6 · varejo 9 · fintechs 5 · outros 3.
6. **Saída (4s).**

**Marcos** [a confirmar]:
- 2022: a track nasce, com 4 pessoas, e o 1º modelo de fraude entra em produção;
- 2023: 1º recomendador no varejo;
- 2024: índice de principalidade;
- 2025: reports lights-off para o board;
- 2026: agentes de insights e transformers privados em GPU.

**Easter egg:** `CAGR = (12,4 / 2,1)^(1/4) − 1 ≈ 56%`

**Narração opcional:**
- Próxima estação: a nossa evolução.
- Em quatro anos, o time foi de quatro para vinte e três pessoas…
- …e cada ano deixou um marco, do primeiro modelo em produção aos agentes de IA.
- Mais de cento e quarenta projetos entregues — e uma receita seis vezes maior.
- Hoje, analytics está em seis de cada dez engagements.

#### Estação 03 — What We Bring to the Market (80s) [nova + v2]
1. **Chegada (4s).**
2. **Analytics × as demais tracks (16s):** analytics no centro e as outras tracks em volta, como círculos em meio-tom. Cada sobreposição acende uma lente laranja com a oferta conjunta [a confirmar os nomes]:
   - Estratégia ∩ Analytics → business case com dados
   - Marketing & Fidelidade ∩ Analytics → segmentação e recomendação
   - Risco & Fraude ∩ Analytics → modelos de fraude e crédito
   - Digital & Pagamentos ∩ Analytics → personalização em tempo real
   - Operações ∩ Analytics → automação lights-off
3. **Tipos de projeto (12s):** 5 bilhetes de embarque carimbados:
   - Diagnóstico & sizing
   - Modelos preditivos
   - Segmentação & personalização
   - Test & learn / incrementalidade
   - Automação & IA
4. **Portfólio em 3 ondas (36s, mostrado e não verbalizado):**
   - **PRODUTOS:** painéis Issuer e Acquirer;
   - **CAPABILITIES:** stickers analíticos;
   - **FRONTEIRA:** tags neon do estado da arte e fórmulas soltas.
5. **Mosaico infinito ∞ (8s).**
6. **Saída (4s):** o ∞ encolhe e vira a baldeação, o que abre a **Parada 1**.

**Narração opcional:**
- Próxima estação: o que levamos ao mercado.
- Analytics não joga sozinha: complementa e potencializa cada track da consultoria.
- Do diagnóstico à automação, entregamos projetos de ponta a ponta…
- …com um portfólio de produtos e capabilities que não para de crescer.

### Trecho 2 · laranja · tema B (3:50)

#### Estação 04 — Analytics in Action: From Data to Impact (6s de abertura) [nova]
- **Visual:** três fichas de caso se abrem em leque (VAREJO · ISSUER · FRAUDE), com a régua **PROBLEMA → INSIGHT → ENTREGA → IMPACTO**.

**Moldura de caso:**
- **Régua no topo:** avança de etapa em etapa.
- **Abertura:** o problema na língua do cliente, num post-it grande.
- **Miolo:** a parte técnica da v2, com os easter eggs.
- **Fecho:** o **comprovante de impacto**, impresso como cupom de maquininha (é Mastercard, afinal), com o carimbo ✓.
- **Parceria:** cada caso ganha um sticker "com a track de …" [a confirmar].

#### Caso 1 · Varejo — recomendação (42s) [v2] [fictício]
- **Problema:** "12 milhões de clientes, 1 folheto para todos". A conversão de campanha é de 1,8%.
- **Miolo (v2):**
  1. matriz cliente×SKU esparsa;
  2. R ≈ U·Vᵀ;
  3. alternância do ALS;
  4. as lacunas viram propensões;
  5. espaço latente.
- **Insight:** clientes parecidos montam cestas parecidas.
- **Entrega:** top-3 SKUs por cliente, toda semana, no app e no CRM.
- **Comprovante:**
  - ticket médio +14%;
  - conversão de 1,8% para 4,3%;
  - +R$ 48 mi/ano de receita incremental.
- **Easter eggs:** `uᵢ = (VᵀV + λI)⁻¹Vᵀrᵢ` · `c = 1 + α·r` · `k = 64` · `score = uᵀv` · `top-k`

#### Caso 2 · Issuer — principalidade (40s) [v2] [fictício]
- **Problema:** "4 em cada 10 clientes recebem o salário em outro banco". Quem nos tem como banco principal?
- **Miolo (v2):**
  1. prateleira de 24 produtos financeiros;
  2. cada produto vira um vetor;
  3. gradiente descendente;
  4. espaço neon 3D;
  5. clusters;
  6. distância do cosseno.
- **Insight:** existe uma trilha até a principalidade: conta digital → Pix → cartão de crédito → cashback → CDB → previdência.
- **Entrega:** índice de principalidade e próximo melhor produto para cada cliente.
- **Comprovante:**
  - +11 p.p. de clientes principais em 6 meses;
  - +R$ 320 mi em captação;
  - churn −18%.

#### Caso 3 · Fraude — lights-off reporting (36s) [v2] [fictício]
- **Problema:** "10 dias de fechamento manual, 2 analistas, todo mês". Aparece o "antes" caricato da v2.
- **Insight:** 9 de cada 10 passos se repetiam todo mês.
- **Entrega:** CLICK — as luzes apagam e um pipeline neon leva do dado ao board.
- **Comprovante:**
  - de 10 dias para 15 minutos;
  - ~1.900 h/ano devolvidas à análise;
  - zero toque manual.
- **Fecho (v2):** o nó Insights pulsa com um "?" ("Mas quem escreve os destaques?") e a câmera mergulha nele.

**Narração opcional dos casos:**
- Caso um, no varejo: doze milhões de clientes… e o mesmo folheto para todos.
- Com fatoração de matrizes — o ALS — as lacunas viram propensões.
- Resultado: ticket médio catorze por cento maior.
- Caso dois, num issuer: quem nos tem como banco principal?
- Com embeddings e a distância do cosseno, aparece uma trilha até a principalidade.
- Em seis meses, onze pontos a mais de clientes principais.
- Caso três: o report de fraude para o board. Dez dias de trabalho manual, todo mês.
- Apagamos as luzes: de dez dias para quinze minutos.
- Mas quem escreve os destaques do report?

#### Estação 05 — Scaling Our Impact Through Data, AI & Innovation (62s) [v2 + nova]
1. **IA (20s, v2):**
   - Analista, Business e C-Level escrevem o insight;
   - o Validador reprova, manda refazer e aprova;
   - o Embalador entrega o título, que vai para o report, o dashboard e qualquer processo.
2. **Por baixo do capô (12s, v2, futurista):**
   - transformer com mapa de atenção;
   - a GPU acende;
   - vários modelos;
   - o perímetro "Ambiente Mastercard", com pacotes que batem na borda e voltam;
   - easter egg novo: `egress: 0 B`.
3. **Escala (8s)** [fictício]: o mesmo motor aparece plugado em vários processos, com o contador "12.480 insights/mês".
4. **Inovação (14s)** [nova]:
   - uma esteira retrô de fábrica: LAB → PILOTO → PRODUTO → ESCALA;
   - os itens [a confirmar]: RL para pricing (lab) · graph fraud (piloto) · uplift modeling (produto) · agentes de insights (escala).
5. **Transições (8s).**

**Narração opcional:**
- Próxima estação: escalar o impacto, com dados, IA e inovação.
- Três agentes — analista, business e C-level — escrevem o insight. Um validador confere; um embalador entrega.
- Por trás, transformers puros em GPU, com vários modelos trabalhando juntos… e o dado nunca sai da Mastercard.
- E a esteira não para: do laboratório ao piloto, do produto à escala.

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

## Trilha (para validar)

| Trecho | Clima | Recomendação | Alternativas |
|---|---|---|---|
| **1** · estações 01–03 | partida, papel e colagem | Banda Black Rio — "Maria Fumaça" (1977) | Tim Maia — "Descobridor dos Sete Mares" (1983) · Kraftwerk — "Trans-Europe Express" (1977) · Daft Punk — "Harder, Better, Faster, Stronger" (2001) |
| **2** · estações 04–06 | cases, IA e neon | Giorgio Moroder — "Chase" (1978) | M83 — "Midnight City" (2011) · Daft Punk — "The Grid" / "Derezzed" (TRON: Legacy, 2010) · Kraftwerk — "Numbers" (1981) · Marcos Valle — "Estrelar" (1983) |
| **3** · final curto | chegada ao futuro | Lulu Santos — "Tempos Modernos" (1982) | reprise do tema A · assinatura sonora da Mastercard no último quadro (se a Marca liberar) |

**Lógica da recomendação:**
- O vídeo vai do papel ao neon, e a trilha acompanha: groove brasileiro retrô no trecho 1, sintetizador retrô-futurista no trecho 2.
- As duas faixas recomendadas são instrumentais, então não competem com o texto na tela.

**Antes de escolher:**
- **Licença:** música comercial num evento corporativo envolve dois direitos.
  - Execução pública: ECAD, geralmente resolvido pelo local ou pela organização do evento.
  - Sincronização: a faixa fica "colada" às imagens do vídeo, o que exige licença da editora e da gravadora.

  Vale validar com Jurídico e Marca da Mastercard.
- **Alternativa sem licença:** um tema original sintetizado (como a trilha atual) no espírito da referência escolhida, sem copiar melodia.
- **Sincronia:** se a escolha for uma faixa real, vocês passam o arquivo e eu sincronizo os cortes ao BPM e às partes da música. A duração do trecho acompanha a edição.
- **Fallback:** a trilha sintetizada continua no HTML, para o caso de o arquivo não estar disponível.

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
- **Dados:** todos os números fictícios ficam em `CONFIG.data`, para trocar num lugar só.
- **Aviso opcional:** uma notinha "dados ilustrativos" nas telas com número.

---

## Dados fictícios (para trocar pelos reais)

| Onde | Indicador | Valor fictício |
|------|-----------|----------------|
| 02 | Tamanho do time, 2022 → 2026 | 4 · 7 · 11 · 16 · 23 |
| 02 | Projetos entregues | 140+ |
| 02 | Engagements com analytics | 15% (2022) → 62% (2026) |
| 02 | Receita de projetos com analytics | US$ 2,1 mi → US$ 12,4 mi (×6) |
| 02 | Clientes por segmento | issuers 18 · adquirentes 6 · varejo 9 · fintechs 5 · outros 3 |
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

Moedas: US$ para os números internos da track e R$ para o impacto no cliente.

---

## O que preciso de vocês

1. **Trilha:** a escolha dos temas A e B (faixa real ou tema original).
2. **Estação 06 · Prática:** os materiais da Nat (pilares, entregas relevantes e evoluções).
3. **Demais tracks da consultoria:** os nomes e a oferta conjunta de cada uma com analytics (estação 03).
4. **Estação 02:** os marcos e números reais, quando puderem.
5. **Esteira de inovação (05):** o que está hoje em lab, em piloto, em produto e em escala.
6. **Pré-show:** se querem o loop de espera antes de começar.

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
- **Números de tela:** fictícios até a troca. As fórmulas são reais e servem de easter eggs para o público técnico.
