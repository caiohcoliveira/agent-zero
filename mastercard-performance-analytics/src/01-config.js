/* ============================================================================
   1. CONFIG — tudo que costuma ser ajustado fica aqui.
   ----------------------------------------------------------------------------
   • A linha do tempo tem 4 plays (trechos de vídeo) separados por paradas.
     Nas paradas o vídeo fica em loop e as apresentadoras falam; → segue.
   • Os tempos das cenas casam com os compassos das músicas (src/07-beats.js).
   • Narração e cues sonoros usam o tempo LOCAL da cena.
   • Números e resultados vêm do JSON de dados (bloco "pa-data", src/01-data.js).
   ========================================================================== */
const W = 1920, H = 1080;

const CONFIG = {
  fps: 30,                 // referência visual (render usa rAF; "on twos" = fps/2)
  bpm: 120,                // trilha sintetizada da abertura: 1 compasso = 2s
  mode: 'show',            // 'show' = paradas em loop para as apresentadoras · 'reel' = roda tudo direto

  colors: {
    red: '#EB001B', orange: '#FF5F00', yellow: '#F79E1B',
    ink: '#141414', ink2: '#1E1E1E', ink3: '#2A2A2A', night: '#0C0F17',
    cream: '#F5F1EA', paper: '#FBF8F3', sand: '#D9D3CA', stone: '#8A8378', mute: '#5E5850',
    white: '#FFFFFF', ok: '#F79E1B', bad: '#EB001B'
  },

  fonts: {
    sans: '"Segoe UI", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
    mono: '"SF Mono", "Cascadia Mono", Consolas, Menlo, "Courier New", monospace'
  },

  motion: {
    intensity: 1.0,        // 0.5 = sóbrio · 1 = padrão · 1.4 = mais enérgico
    shake: 1.0,            // tremor de câmera nos impactos
    onTwos: true,          // snaps "em dois" (textura stop motion)
    grain: 0.06,           // granulação de filme (0 desliga)
    beat: 1.0,             // quanto a música mexe na câmera, nas cores e nos elementos (0 desliga)
    paint: 1.0,            // acabamento pintado: pinceladas, gradação de cor e brilho (0 desliga)
    beatBase: 0.15         // fora dos clímax a batida fica contida nesse nível (os picos de cada cena ficam em SCENES[id].peaks)
  },

  audio: {
    music: true, sfx: true,
    voice: false,          // narração do navegador: DESLIGADA por padrão (botão "Voz" / tecla V)
    musicVolume: 0.42, sfxVolume: 0.5,
    trackVolume: 1.0,      // volume geral das faixas (funk, technology, piano)
    tracks: { funk: { gain: .63 }, tech: { gain: .79 }, piano: { gain: .62 } },  // equaliza o loudness (~−14 LUFS)
    duckDuringVoice: 0.55,
    voiceRate: 1.07, voicePitch: 1.02,
    preferredVoices: ['Francisca', 'Thalita', 'Brenda', 'Giovanna', 'Leila', 'Manuela', 'Yara',
      'Elza', 'Luciana', 'Fernanda', 'Vitória', 'Vitoria', 'Maria', 'Google português do Brasil'],
    avoidVoices: ['Antonio', 'Daniel', 'Donato', 'Fabio', 'Felipe', 'Humberto', 'Julio', 'Nicolau', 'Valerio']
  },

  captions: false,

  // ---------------------------------------------------------------- PLAYS (trechos de vídeo)
  // track = faixa embutida (src/07-beats.js) · from = de onde a faixa começa (s)
  plays: [
    { id: 1, track: null },                    // abertura: trilha sintetizada
    { id: 2, track: 'funk', from: 0 },         // "Vintage Film Funk" inteira (1:59)
    { id: 3, track: 'tech', from: 0 },         // "Technology" remontada para os cases (tools/edit_tech.py, 4:24)
    { id: 4, track: 'piano', from: 7.48 }      // "Epic Piano" a partir do primeiro impacto (1:07)
  ],

  // ---------------------------------------------------------------- CENAS (ordem = ordem do filme)
  // dur casado com os compassos da faixa do play; station = estação da linha (1–7)
  scenes: [
    { id: 'open',      play: 1, dur: 10,     theme: 'dark' },                   // plataforma → trem → embarque → mapa
    { id: 's01',       play: 2, dur: 33.88,  station: 1, theme: 'light' },
    { id: 's02',       play: 2, dur: 37.08,  station: 2, theme: 'dark' },
    { id: 's03',       play: 2, dur: 48.524, station: 3, theme: 'dark' },   // ∞ em 36.96 (saída da música)
    // estação 04: cada case tem parte calma (problema e dados) → construção (como fizemos) → drop (solução e impacto)
    { id: 's04',       play: 3, dur: 8.889,  station: 4, theme: 'dark' },   // título da seção + "os cases de impacto"
    { id: 'banana',    play: 3, dur: 53.333, station: 4, theme: 'dark' },   // drop em 35.56
    { id: 'manga',     play: 3, dur: 53.333, station: 4, theme: 'dark' },   // drop em 35.56
    { id: 'lightsoff', play: 3, dur: 53.334, station: 4, theme: 'light' },  // drop em 35.56 (o interruptor)
    { id: 'insight',   play: 3, dur: 62.222, station: 4, theme: 'dark' },   // drop em 35.56 (milhares de páginas)
    { id: 's05',       play: 3, dur: 13.337, station: 5, theme: 'dark' },
    { id: 's06',       play: 3, dur: 19.93,  station: 6, theme: 'light' },  // saída suave da música
    { id: 's07',       play: 4, dur: 28.8,   station: 7, theme: 'dark' },
    { id: 'climax',    play: 4, dur: 12,     theme: 'dark' },
    { id: 'close',     play: 4, dur: 26.378, theme: 'dark' }                // último acorde em 14.08
  ],

  // ---------------------------------------------------------------- PARADAS (loop + itens navegáveis)
  // after = cena depois da qual o vídeo para · items = quantos passos o → percorre antes do embarque
  stops: [
    { id: 'preshow', after: null,    items: 1 },
    { id: 'stop0',   after: 'open',  items: 1 },   // mapa interativo: clique numa estação para ver o detalhe; → embarca
    { id: 'stop1',   after: 's03',   items: 4 },   // plataforma + cartazes 01, 02, 03
    { id: 'stop2',   after: 's06',   items: 4 },   // plataforma + cartazes 04, 05, 06
    { id: 'end',     after: 'close', items: 2 }    // letreiro final + cartaz 07
  ],

  // ---------------------------------------------------------------- TEXTOS-CHAVE
  text: {
    line: 'LINHA PERFORMANCE ANALYTICS',
    // short = placa da estação (mapa, letreiro, mini-mapa) · title = nome completo · teaser = o que a estação mostra
    stations: [
      { n: '01', short: 'PAPEL ESTRATÉGICO',        title: 'Analytics como capacidade estratégica da consultoria', teaser: 'como transformamos dados em decisões, impacto e valor',
        see: ['As perguntas de negócio que chegam até nós', 'Negócio × Dados: onde analytics entra', 'Diagnóstico → Estratégia → Implementação → Mensuração'] },
      { n: '02', short: 'EVOLUÇÃO E IMPACTO',       title: 'Nossa evolução e o impacto no negócio',                teaser: 'quanto a track cresceu e o marco do Brasil',
        see: ['Evolução do faturamento da track, ano a ano', 'Brasil: acima do período anterior e do orçamento'] },
      { n: '03', short: 'O QUE LEVAMOS AO MERCADO', title: 'O que levamos ao mercado',                             teaser: 'projetos recentes e os modelos que bancos e fintechs usam',
        see: ['Alguns de nossos últimos projetos, por tipo de cliente', 'Modelos preditivos e prescritivos que levamos a bancos e fintechs'] },
      { n: '04', short: 'ANALYTICS EM AÇÃO',        title: 'Analytics em ação: do dado ao impacto',                teaser: '4 cases, do problema ao resultado medido',
        see: ['Cliente Banana · cestas de produtos', 'Cliente Manga · motor de principalidade', 'Lights-off · relatórios de fraude sem trabalho manual', 'Insight Agent · agentes de IA que escrevem insights'] },
      { n: '05', short: 'ESCALANDO O IMPACTO',      title: 'Escalando o impacto com dados, IA e inovação',         teaser: 'do trabalho manual aos ativos de IA escaláveis',
        see: ['A escada: manual → avançado → produtizado → IA escalável', 'IA local: o dado nunca sai da Mastercard'] },
      { n: '06', short: 'A PRÁTICA',                title: 'A Prática: pilares, entregas e evoluções',             teaser: 'como nos organizamos para entregar',
        see: ['Os pilares da prática', 'Entregas e evoluções'] },
      { n: '07', short: 'O FUTURO DE ANALYTICS',    title: 'O futuro de analytics',                                teaser: 'onde queremos estar',
        see: ['Mais perto das decisões estratégicas', 'Mais integrados às demais tracks', 'Mais escaláveis e diferenciados'] }
    ],
    stopInfo: { p1: ['Parada 1 · conversa', 'retomamos as estações 01, 02 e 03'], p2: ['Parada 2 · conversa', 'retomamos as estações 04, 05 e 06'] },
    stop: { label: 'PARADA', next: 'PRÓXIMA PARTIDA', talk: 'hora de conversar', go: '→  seguir viagem', preshow: 'EMBARQUE EM INSTANTES', talkStop: 'parada para conversa' },
    postits: ['Por que caiu?', 'Quem priorizar?', 'Onde investir?', 'Qual o risco?', 'E se…?', 'Vale a pena?', 'O que mudou?', 'Qual canal?'],
    circleA: 'Negócio', circleB: 'Dados',
    chain: ['Dados', 'Decisões', 'Impacto', 'Valor'],
    engagement: [['Diagnóstico', 'dimensionar'], ['Estratégia', 'explicar'], ['Implementação', 'construir'], ['Mensuração', 'provar']],
    question: 'Quem pode resolver esse problema?',
    tagline: 'Esse é o nosso *papel estratégico*.',
    caseSteps: ['PROBLEMA', 'DADOS', 'ESTRATÉGIA', 'SOLUÇÃO', 'IMPACTO'],
    agents: {
      gen: [{ role: 'analista', name: 'Analista' }, { role: 'business', name: 'Business' }, { role: 'clevel', name: 'C-Level' }],
      judges: 'Julgadores', fixers: 'Corretores', done: 'Insight validado'
    },
    progression: ['Análise manual', 'Analytics avançado', 'Motores produtizados', 'Ativos de IA escaláveis'],
    perimeter: 'AMBIENTE MASTERCARD', never: 'o dado nunca sai',
    // estação 03: casos de machine learning que bancos e fintechs usam (nome em pt · técnica em inglês)
    ml: {
      pred: [['Prevenção a fraude', 'gradient boosting · graph ML'], ['Score de risco de crédito', 'logistic regression · XGBoost'], ['Propensão a churn', 'survival analysis'],
        ['Propensão de compra', 'collaborative filtering'], ['Lifetime value do cliente', 'BG/NBD · regression'], ['Previsão de gastos e demanda', 'time series forecasting'],
        ['Risco de inadimplência', 'roll rates · Markov chains'], ['Lavagem de dinheiro (AML)', 'anomaly detection'], ['Aprovação de transações', 'real-time classification'], ['Previsão de chargeback', 'classification · NLP']],
      presc: [['Próxima melhor oferta', 'recommender systems'], ['Limite de crédito ótimo', 'constrained optimization'], ['Preço e taxas (MDR)', 'price elasticity'],
        ['Régua de cobrança', 'uplift modeling'], ['Retenção com o incentivo certo', 'causal ML'], ['Alocação de campanhas e verba', 'multi-objective optimization'],
        ['Roteamento de transações', 'reinforcement learning'], ['Cashback e benefícios', 'causal inference'], ['Personalização em tempo real', 'contextual bandits'], ['Equilíbrio aprovação × fraude', 'threshold optimization']],
      frontier: 'Na fronteira: *graph neural networks, causal ML, reinforcement learning* e agentes de LLM'
    },
    // nomes das capabilities (JSON em inglês) → tela em pt; técnicas ficam em inglês
    capPT: { 'Customer Segmentation & Look-Alike Modeling': 'Segmentação de clientes e look-alike', 'Recommendation / Next Best Product': 'Recomendação do próximo produto',
      'Product Affinity & Basket Analytics': 'Afinidade de produtos e cestas', 'Customer Relationship / Principality Optimization': 'Relacionamento e principalidade',
      'Market Share & Share of Wallet Analytics': 'Market share e share of wallet', 'AI-powered Insight Generation': 'Insights gerados por IA', 'Automated Reporting': 'Relatórios automatizados' },
    methodPT: { 'cluster characterization': 'caracterização dos clusters', 'cross-sell ranking': 'ranking de cross-sell', 'upsell ranking': 'ranking de upsell', 'cosine similarity': 'cosine similarity',
      'product affinity': 'afinidade de produto', 'expected principality uplift': 'ganho esperado de principalidade', 'local LLMs': 'LLMs locais', 'multi-agent architecture': 'arquitetura multiagente', 'ML quality scoring': 'score de qualidade com ML' },
    future: [
      { title: 'Mais perto das decisões', sub: 'estratégicas dos clientes', icon: 'chair' },
      { title: 'Mais integrados', sub: 'às demais tracks', icon: 'link' },
      { title: 'Mais escaláveis', sub: 'e diferenciados', icon: 'grid' }
    ],
    futureKey: 'É esse o papel que queremos ocupar.',
    climaxWords: ['Estatística', 'Regressão', 'Classificação', 'Clusters', 'Embeddings', 'Otimização', 'Transformers', 'Agentes'],
    climaxKey: 'Nossa especialidade é *analytics*.',
    flap: ['WELCOME TO THE FUTURE', 'WELCOME TO AI', 'WELCOME TO ANALYTICS', 'PERFORMANCE ANALYTICS']
  },

  // ---------------------------------------------------------------- NARRAÇÃO (opcional, desligada por padrão)
  // at = segundos desde o início da cena · também serve de roteiro para quem apresenta
  narration: [
    { scene: 'open', at: 1.0, text: 'Bem-vindos à linha Performance Analytics.' },
    { scene: 's01', at: 1.0, text: 'Próxima estação: analytics como capacidade estratégica da consultoria.' },
    { scene: 's01', at: 8.0, text: 'Todo projeto começa com uma pergunta de negócio.' },
    { scene: 's01', at: 22.0, text: 'Transformamos dados em decisões, decisões em impacto… e impacto em valor.' },
    { scene: 's02', at: 1.0, text: 'Próxima estação: a nossa evolução.' },
    { scene: 's02', at: 22.5, text: 'E o Brasil fechou acima do período anterior e acima do budget.' },
    { scene: 's03', at: 1.0, text: 'Próxima estação: o que levamos ao mercado.' },
    { scene: 's03', at: 10.0, text: 'Para emissores, adquirentes e merchants, cada capability já tem um case para mostrar.' },
    { scene: 's04', at: 1.0, text: 'Próxima estação: analytics em ação. Agora, os cases de impacto.' },
    { scene: 'banana', at: 1.0, text: 'Case um: cestas de produtos para o Cliente Banana.' },
    { scene: 'manga', at: 1.0, text: 'Recomendar olhando também a principalidade.' },
    { scene: 'lightsoff', at: 1.0, text: 'O report de fraude para o board, agora lights-off.' },
    { scene: 'insight', at: 1.0, text: 'Insights em escala, com IA local: o dado nunca sai da Mastercard.' },
    { scene: 's05', at: 1.0, text: 'Próxima estação: escalar o impacto, com dados, IA e inovação.' },
    { scene: 's06', at: 1.0, text: 'Próxima estação: a Prática.' },
    { scene: 's07', at: 1.0, text: 'Última estação: o futuro de analytics.' },
    { scene: 'climax', at: 8.5, text: 'Nossa especialidade é analytics.' },
    { scene: 'close', at: 1.0, text: 'Se o desafio pede eficiência, escala e valor, a resposta passa por Performance Analytics.' }
  ],

  // Grafia fonética para o TTS pt-BR ler bem os termos em inglês (ajuste à voz do seu sistema)
  phonetics: [
    [/Performance Analytics/g, 'Perfórmance Anâlitics'],
    [/\banalytics\b/gi, 'anâlitics'],
    [/\binsights?\b/gi, 'ínsaits'],
    [/\btrack\b/gi, 'tréc'],
    [/\bboard\b/gi, 'bórd'],
    [/\blights-off\b/gi, 'láits óf'],
    [/\bcapability\b/gi, 'keipabíliti'],
    [/\bbudget\b/gi, 'bâdjet'],
    [/\bmerchants\b/gi, 'mêrtchants'],
    [/\breport\b/gi, 'ripórt'],
    [/\bMastercard\b/g, 'Másterkard']
  ]
};

/* Linha do tempo derivada (não editar) */
(function buildTimeline() {
  let t = 0;
  const plays = Object.fromEntries(CONFIG.plays.map(p => [p.id, p]));
  CONFIG.scenes.forEach((s, i) => {
    s.index = i; s.start = t; s.end = t + s.dur; t += s.dur;
    const p = plays[s.play]; if (p.start == null) p.start = s.start; p.end = s.end;
  });
  CONFIG.duration = t;
  CONFIG.playById = plays;
  CONFIG.sceneById = Object.fromEntries(CONFIG.scenes.map(s => [s.id, s]));
  CONFIG.stops.forEach((st, i) => { st.index = i; st.T = st.after ? CONFIG.sceneById[st.after].end : 0; });
  CONFIG.stationStart = [];
  CONFIG.scenes.forEach(s => { if (s.station && CONFIG.stationStart[s.station] == null) CONFIG.stationStart[s.station] = s.start; });
  CONFIG.narration.forEach(n => { n.t = CONFIG.sceneById[n.scene].start + n.at; });
  CONFIG.narration.sort((a, b) => a.t - b.t);
})();
/** cena no instante T da linha do tempo */
function sceneAt(T) { const S = CONFIG.scenes; for (let i = S.length - 1; i >= 0; i--) if (T >= S[i].start) return S[i]; return S[0]; }
/** estação (1–7) no instante T; 0 antes da primeira */
function stationAt(T) { for (let k = 7; k >= 1; k--) if (CONFIG.stationStart[k] != null && T >= CONFIG.stationStart[k]) return k; return 0; }
const TX = CONFIG.text;
/** qualidade adaptativa: o player liga `low` se a máquina não segurar ~30 qps (tira RGB, granulação e scanlines) */
const QUALITY = { low: false, forced: null };
/** cenas dos trechos (draw(ctx, t, T)) e das paradas (draw(ctx, tl, item, prevItem, p)) — registradas pelos arquivos de cena */
const SCENES = {}, STOPSCN = {};
