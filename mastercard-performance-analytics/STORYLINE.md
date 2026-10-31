# A Linha — Storyline v4

**Sessão:** até 20 min. São ~7:40 de vídeo em 4 plays, e o resto é fala das apresentadoras nas 4 paradas.

**Vídeo:** HTML único offline, 1920×1080, em **modo apresentação**. Ele intercala trechos de vídeo com paradas em loop e é controlado pelo teclado, pelo passador de slides ou pelo mouse nas paradas.

**Sem narrador:** cada cena se explica sozinha. Uma faixa de legenda na base da tela diz o que está acontecendo, e cada estação fecha com uma conclusão escrita.

**Status:** implementado no `performance-analytics.html`. O roteiro da v3 está no histórico do Git (commit `62b1d98`).

---

## O que mudou da v3 para a v4

Esta rodada atendeu à revisão de vocês.

**Batidas:**
- Fora dos clímax, câmera, cores e elementos reagem só 15% à batida.
- A reação inteira aparece só nos picos de cada cena: o drop de cada case, o marco do Brasil, o ∞, o clímax e o acorde final.

**Português:**
- Todos os textos estão em português.
- As técnicas de analytics ficam em inglês: BM25, Matrix Factorization (ALS), UMAP, embeddings, Random Forest etc.
- A exceção é o letreiro final em inglês ("WELCOME TO…"), como vocês pediram antes. Uma legenda em português acompanha.

**Sem narrador:**
- Legendas por cena.
- Títulos de gráfico e conclusões escritas.
- Cartões de conexão entre estações.

**Estação de trem:**
- A abertura acontece numa plataforma: painel de partidas, o trem chega, as portas abrem e o bilhete é validado.
- Um trem passa na frente da câmera na chegada de cada estação.
- Um painel de LED avisa a "próxima estação".

**Abertura:** saiu "O nosso desafio hoje". O vídeo começa direto na Linha Performance Analytics.

**Mapa (Parada 0):** ficou clicável. Clique numa estação para ver o detalhe dela, sem apertar → várias vezes.

**Estações 01 a 03:**
- **01:** fecha as perguntas com "Quem pode resolver esse problema?" e termina em "Esse é o nosso papel estratégico".
- **02:**
  - o gráfico ganhou título: "Evolução do faturamento da track";
  - saiu "Escala de verdade";
  - um cartão de conexão pergunta "E o que levamos para o mercado?".
- **03:**
  - abre com "Alguns de nossos últimos projetos";
  - em seguida, 20 casos de machine learning preditivo e prescritivo que bancos e fintechs usam.

**Estação 04:**
- Abre com o título da seção e "agora, os cases de impacto".
- Cada case ganhou ~53 s (o de agentes, ~62 s). O vídeo ficou mais longo só por isso.
- Cada case segue a ordem problema → dados → estratégia → como fizemos → solução → impacto.
- A música da estação 04 foi remontada para o drop cair na solução de cada case.

**Paradas de retomada:**
- Clique num cartaz para dar zoom na estação.
- As cenas montadas da estação aparecem embaixo, em miniaturas.
- Clique numa miniatura para abrir a cena num popup que fecha com ✕, Esc ou clique fora.

---

## A sessão

| Momento | O que acontece | Duração |
|---|---|---|
| Pré-show | letreiro em loop | até a primeira tecla |
| Play 1 · embarque | plataforma → trem → bilhete → mapa | 0:10 |
| **Parada 0** · mapa | mapa clicável; as apresentadoras contam o roteiro | fala |
| Play 2 · estações 01–03 | "Vintage Film Funk" | 1:59 |
| **Parada 1** | plataforma com os cartazes 01, 02 e 03 | fala |
| Play 3 · estações 04–06 | "Technology" remontada | 4:24 |
| **Parada 2** | cartazes 04, 05 e 06 | fala |
| Play 4 · 07, clímax e letreiro | "Epic Piano" | 1:07 |
| **Encerramento** | letreiro vivo; clique abre o cartaz 07 | fala |

Total de vídeo: **7:41**.

---

## Play 1 · embarque (10 s)

1. **0–4,5 s.** Plataforma 1 à noite.
   - O painel de partidas vira para "LINHA PERFORMANCE ANALYTICS" e o trem chega da direita, freando.
   - *Legenda:* "Bem-vindos à Linha Performance Analytics".
2. **4,5 s.** As portas abrem (drop da trilha) e o bilhete aparece com "de dados → para valor".
   - O carimbo "EMBARQUE" bate.
   - *Legenda:* "Bilhete validado…".
3. **7–10 s.**
   - A câmera entra pela porta e o mapa da linha se desenha com o letreiro.
   - *Legenda:* "7 estações e 2 paradas para conversa".

## Parada 0 · o mapa (interativo)

- **Mapa:** completo, com o letreiro no topo.
- **Clique numa estação:** a câmera aproxima e abre um cartão com:
  - o número e o nome completo da estação;
  - o que ela mostra;
  - os tópicos que aparecem nela.
- **Paradas 1 e 2 no mapa:** também são clicáveis.
- **Para voltar ao mapa:** clique fora do cartão, use Esc ou uma seta.
- **→ (sem cartão aberto):** embarca no play 2.

---

## Play 2 · estações 01–03 ("Vintage Film Funk", 1:59)

Cada estação começa com o trem passando na frente da câmera e o letreiro split-flap da estação. Nos últimos segundos, o painel de LED avisa a próxima.

### 01 · Papel estratégico (34 s)

1. **Mural de cortiça.** Post-its com perguntas de negócio.
   - *Legenda:* "Todo dia, nossos clientes chegam com perguntas de negócio".
2. **A pergunta.** "Quem pode resolver esse problema?" é pintada sobre o mural.
3. **A resposta (pico).** Os círculos Negócio × Dados batem e formam "Performance Analytics".
4. **Nossos serviços:** Diagnóstico, Estratégia, Implementação e Mensuração.
5. **O caminho do valor:** Dados → Decisões → Impacto → Valor.
6. **Conclusão:** **"Esse é o nosso papel estratégico."**

### 02 · Evolução e impacto (37 s)

1. **O gráfico.**
   - Título: "Evolução do faturamento da track", com o subtítulo "receita anual em US$".
   - As barras sobem ano a ano.
   - O ano de 2026 aparece como previsão.
2. **Crescimento.** Selo "1,8× em 2 anos".
   - A legenda é montada a partir do JSON.
3. **Brasil (pico).** 1,74× o período anterior e 1,65× o orçamento.
   - Em seguida, os trimestres.
   - A legenda conta quantos trimestres ficaram acima do orçamento, a partir do JSON.
4. **Conclusão:** "Crescimento consistente, acima do planejado."
5. **Cartão de conexão:** **"E o que levamos para o mercado?"**

### 03 · O que levamos ao mercado (49 s)

1. **Projetos recentes.** "Alguns de nossos últimos projetos", em três colunas: Emissores, Adquirentes e Varejo.
   - Cada capability aparece em português, com as técnicas em inglês e a etiqueta do case.
2. **Os cases em destaque.** As etiquetas pulsam.
   - *Legenda:* "os 4 em destaque são os cases da estação 04".
3. **Com as outras tracks.** "Analytics complementa e potencializa as demais tracks".
4. **Machine learning para bancos e fintechs.**
   - **10 preditivos:** fraude, risco de crédito, churn, propensão de compra, LTV, previsão de gastos, inadimplência, AML, aprovação e chargeback.
   - **10 prescritivos:** próxima melhor oferta, limite ótimo, preço e MDR, régua de cobrança, retenção, alocação de verba, roteamento, cashback, personalização e aprovação × fraude.
   - Cada um vem com a técnica em inglês.
   - A legenda mostra a fronteira: graph neural networks, causal ML, reinforcement learning e agentes de LLM.
5. **∞ (pico).** "Com dados, as possibilidades são infinitas".
6. **Letreiro:** "PARADA 1 · BALDEAÇÃO / HORA DA CONVERSA".

## Parada 1

- **Cena:** plataforma com os cartazes 01, 02 e 03.
- **Clique num cartaz:** dá zoom e mostra as cenas montadas da estação.
- **Clique numa cena:** abre o popup.
- **→:** percorre os cartazes e embarca.

---

## Play 3 · estações 04–06 ("Technology" remontada, 4:24)

**A música.** A faixa foi remontada com cortes nos compassos (`tools/edit_tech.py`).
- **Como cada case é montado:**
  - 8 compassos da parte calma;
  - 8 compassos da construção;
  - a parte cheia da faixa.
- **Onde cai o drop:** sempre em 35,6 s do case, que é a hora da **solução**. O **impacto** vem 8,9 s depois.

**Os compassos de cada case:**

| Compassos | Etapa |
|---|---|
| 0–4 | Problema |
| 4–8 | Dados do cliente (ou o trabalho manual, ou a restrição) |
| 8–10 | Estratégia |
| 10–16 | Como fizemos, passo a passo |
| 16–20 | Solução, no drop |
| 20 em diante | Impacto |

A régua no canto superior direito acende a etapa atual. A fileira de passos mostra em que ponto do "como fizemos" o case está.

### 04 · Abertura (9 s)

- "ANALYTICS EM AÇÃO · do dado ao impacto · agora, os cases de impacto".
- Os 4 cases aparecem como cartões.

### Case 1 · Cliente Banana · cestas de produtos (53 s)

1. **Problema.** O texto do JSON e as três bandeiras ligadas.
   - "fazer o cliente de uma bandeira comprar também nas outras".
2. **Dados.**
   - O que o cliente tinha: 24 meses de compras por CPF × SKU, 101 mil clientes, 894 subgrupos e 3,8 mi interações.
   - O que dificultava: os 3 desafios do JSON.
3. **Estratégia:** **"Gerar cestas de produtos"** e achar o público de cada uma.
4. **Como fizemos.**
   1. BM25 apaga sacola e pão.
   2. ALS fatora em clientes × produtos.
   3. A similaridade de cosseno junta os produtos em 3 cestas.
5. **Solução (drop).** As cestas e os clientes-alvo.
   - Decisão: "as cestas viraram mecânicas de campanha".
6. **Impacto.** Ranking de conversão, 1,19× e o comprovante.

### Case 2 · Cliente Manga · motor de principalidade (53 s)

1. **Problema.** Recomendar o que faz o cliente escolher o banco como principal.
   - O visual é a carteira com a coroa.
2. **Dados.** 92 mil associados PF, 4 subsegmentos, produtos e principalidade.
3. **Estratégia:** um motor de recomendação que prioriza a principalidade.
4. **Como fizemos.**
   1. UMAP + K-Means, com 8 segmentos look-alike.
   2. **Embeddings**: clientes e produtos no mesmo espaço.
   3. **ALS**: listas de cross-sell e upsell.
5. **Solução (drop).** A camada ΔP reordena as listas: 3,336 pts contra 2,112 pts.
6. **Impacto.** +4 p.p., os subsegmentos e o melhor segmento.
   - Depois, o comprovante "produtizado".

### Case 3 · Lights-off · relatórios de fraude (53 s)

1. **Problema.** Os relatórios para o board eram montados à mão: papelada crescendo e relógio.
2. **Trabalho manual.** O ciclo extrair → conferir → copiar e colar → escrever destaques → revisar → enviar gira cada vez mais rápido.
   - O analista sua: "de novo… e de novo".
3. **Estratégia.** "Automatizar de ponta a ponta".
   - O **interruptor** aparece, ligado, com a etiqueta "trabalho manual".
4. **Como fizemos.** O pipeline se monta nó a nó com a luz acesa.
   - A mão chega no interruptor.
5. **Solução (drop).**
   - **Clique: as luzes apagam.**
   - O pipeline acende em neon e roda sozinho, e o carimbo marca "Relatório automatizado".
6. **Impacto.** Antes × depois.
   - Em seguida, "Mas quem escreve os destaques?" e o mergulho no nó Destaques, que leva ao case 4.

### Case 4 · Insight Agent · agentes de IA (62 s)

1. **Abertura.** **"Um case de agentes de IA"**, que escala a geração de insights para milhares de páginas e painéis.
2. **Problema.** O painel de market share com os destaques escritos à mão e 30 adquirentes esperando.
3. **Restrição.** O dado não pode sair do ambiente Mastercard. A API externa de IA aparece riscada.
4. **Estratégia.** Um time de agentes de IA rodando localmente, em GPU.
5. **Como fizemos.**
   1. Geradores: analista, negócio e C-Level.
   2. Julgadores com guardrails (Regex e BERT).
   3. Corretores.
   4. Nota de qualidade com Random Forest, com as 164 features e o MAE.
   - Fecha com o carimbo "Insight validado".
6. **Solução (drop).** Uma parede de páginas e painéis se escreve sozinha enquanto a câmera se afasta.
   - Texto na tela: **"Milhares de páginas e painéis"**.
   - Segunda onda: IA local, o dado nunca sai.
7. **Impacto.** 30 adquirentes: 8 ativos, 22 a conquistar sem crescer o time.
   - Depois, 12 + 4 clientes e PoCs e os projetos user-pay.

### 05 · Escalando o impacto (13 s)

- A escada vai do manual à IA escalável, com os exemplos dos cases.
- *Legenda:* "Cada degrau leva o mesmo time a mais clientes".

### 06 · A Prática (20 s)

- Mostra pilares, entregas e evoluções.
- O conteúdo ainda é um rascunho no JSON, à espera do material da Nat.
- Fecha com o letreiro "PARADA 2 · BALDEAÇÃO".

## Parada 2

- **Cena:** cartazes 04, 05 e 06. A estação 04 tem 11 cenas montadas, divididas em duas fileiras de miniaturas.

---

## Play 4 · final ("Epic Piano", 1:07)

1. **07 · O futuro de analytics.**
   - As três placas:
     - mais perto das decisões;
     - mais integrados às demais tracks;
     - mais escaláveis e diferenciados.
   - Cada placa entra com a sua legenda.
   - Fecha com "É esse o papel que queremos ocupar".
2. **Clímax.** Oito cortes rápidos, da estatística aos agentes.
   - Legenda no topo: "Tudo o que vimos se apoia em ciência de dados".
   - Fecha com "Nossa especialidade é analytics".
3. **Letreiro final.**
   - O split-flap mostra "WELCOME TO THE FUTURE / AI / ANALYTICS / PERFORMANCE ANALYTICS", com legendas em português.
   - Depois vem "Obrigado! Agora a conversa é com vocês".

## Encerramento

- **Cena:** o letreiro fica vivo.
- **Clique ou →:** abre o cartaz 07 com as cenas embaixo.

---

## Trilha

| Play | Faixa (Pixabay) | Uso |
|---|---|---|
| 1 | trilha sintetizada a 120 BPM | drop quando as portas abrem |
| 2 | berrydeep — "Vintage Film Funk" | inteira (1:59) |
| 3 | kulakovka — "Technology" | remontada em 4:24 (`tools/edit_tech.py`): abertura + 4 × (calma → construção → drop) + saída |
| 4 | twisterium — "Epic Piano Background" | a partir de 0:07 (1:07) |

- **Os MP3:** ficam em `musica/`, fora do Git. O build embute as faixas no HTML.
- **Picos de cada cena:** ficam em `SCENES[id].peaks`.
- **Intensidade fora dos picos:** é `CONFIG.motion.beatBase`, hoje em 0,15.

---

## Dados

- **Onde ficam:** os números vêm de `data/presentation.json`, embutido no topo do HTML no bloco `pa-data`.
- **Legendas:** as que citam números também são montadas a partir dele.
- **Para completar depois:**
  - a seção 6 (Prática);
  - os campos vazios do Lights-off: se `business_results.headline` for preenchido, ele aparece no carimbo;
  - `other_tracks`, na seção 3.

---

## Direção visual

- **Paleta Mastercard:** vermelho `#EB001B`, laranja `#FF5F00` e amarelo `#F79E1B`, sobre tinta e papel.
- **Colagem com traço de tinta:** contornos marcados, sombras chapadas e respingos, no estilo Fortiche/Arcane.
- **Futurista quando o assunto é modelo:** neon, grid em perspectiva e scanlines.
- **Elementos de metrô:**
  - plataforma, painel de partidas e vagão com a faixa vermelho-laranja-amarelo;
  - bilhete, letreiro split-flap e painel de LED "próxima estação";
  - mapa da linha e cartazes das paradas.
