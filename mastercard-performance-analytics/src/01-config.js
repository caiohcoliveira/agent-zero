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

const C_RED = '#EB001B', C_ORANGE = '#FF5F00', C_YELLOW = '#F79E1B';
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
    { id: 1, track: null },                    // embarque: trilha sintetizada (src/05-audio.js)
    { id: 2, track: 'funk', from: 0 },         // "Vintage Film Funk" remontada (tools/edit_music.py, 2:34)
    { id: 3, track: 'tech', from: 0 },         // "Technology" remontada para os cases (tools/edit_music.py, 5:04)
    { id: 4, track: 'piano', from: 2.7 }       // "Epic Piano" do 2º compasso: o acorde final cai no letreiro (14,06 s)
  ],

  // ---------------------------------------------------------------- CENAS (ordem = ordem do filme)
  // dur casado com os compassos da faixa do play; station = estação da linha (1–7)
  // v7: cada tela traz contexto, explicação, visual com rótulos e conclusão (sem narrador)
  scenes: [
    { id: 'open',      play: 1, dur: 20,     theme: 'dark' },                   // identidade → propósito → percurso
    { id: 's01',       play: 2, dur: 46.98,  station: 1, theme: 'dark' },   // a ponte entre negócio e dados (frase A de 16 compassos)
    { id: 's02',       play: 2, dur: 43.64,  station: 2, theme: 'dark' },   // a frase A de novo, até o break
    { id: 's03',       play: 2, dur: 63.924, station: 3, theme: 'dark' },   // break → parte B → saída (síntese em 52,4)
    // estação 04: cada case tem 27 compassos: calma 11 (problema, dados) → construção 5 (como fizemos) → cheia 11 (solução, resultado)
    { id: 's04',       play: 3, dur: 11.111, station: 4, theme: 'dark' },   // analytics em ação: os 4 cases
    { id: 'banana',    play: 3, dur: 60,     station: 4, theme: 'dark' },   // drop na solução: 35,56
    { id: 'manga',     play: 3, dur: 60,     station: 4, theme: 'dark' },   // drop na reordenação: 35,56
    { id: 'lightsoff', play: 3, dur: 60.001, station: 4, theme: 'light' },  // interruptor 33,33 · silêncio · drop 35,56
    { id: 'insight',   play: 3, dur: 68.89,  station: 4, theme: 'dark' },   // construção longa; drop na escala: 48,89
    { id: 's05',       play: 3, dur: 20.004, station: 5, theme: 'dark' },
    { id: 's06',       play: 3, dur: 24.444, station: 6, theme: 'dark' },   // a faixa termina em 20 s; silêncio até a parada
    { id: 's07',       play: 4, dur: 26.4,   station: 7, theme: 'dark' },   // 11 compassos de piano
    { id: 'climax',    play: 4, dur: 19.2,   theme: 'dark' },                   // as 8 disciplinas, acumulando (8 compassos)
    { id: 'close',     play: 4, dur: 26.378, theme: 'dark' }                // último acorde em 14,06
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
      { n: '01', short: 'PAPEL ESTRATÉGICO',        title: 'Analytics como capacidade estratégica da consultoria', teaser: 'conectamos perguntas de negócio aos dados, do diagnóstico à mensuração',
        see: ['Decisões difíceis começam com perguntas', 'A ponte entre negócio e dados', 'Diagnóstico, estratégia, implementação e mensuração'] },
      { n: '02', short: 'EVOLUÇÃO E IMPACTO',       title: 'Nossa evolução e o impacto no negócio',                teaser: 'o faturamento da track e o resultado do Brasil',
        see: ['Faturamento anual da track, com base zero', 'Brasil: comparado ao período anterior e ao orçamento', 'Trimestres: anterior × orçamento × realizado'] },
      { n: '03', short: 'O QUE LEVAMOS AO MERCADO', title: 'Onde aplicamos analytics',                             teaser: 'tipos de cliente, capabilities e modelos',
        see: ['Emissores, adquirentes e varejo', 'Segmentação, recomendação e automação', 'Modelos que antecipam e modelos que recomendam'] },
      { n: '04', short: 'ANALYTICS EM AÇÃO',        title: 'Analytics em ação: do problema ao resultado',          teaser: '4 cases, do problema à solução e ao resultado',
        see: ['Cestas de produtos · Cliente Banana', 'Principalidade · Cliente Manga', 'Relatórios de fraude automatizados', 'Agentes de IA para insights'] },
      { n: '05', short: 'ESCALANDO O IMPACTO',      title: 'A mesma equipe, um alcance maior',                     teaser: 'automação, padronização e reutilização',
        see: ['Equipe → ativo reutilizável → aplicações', 'O mesmo ativo serve a novos projetos'] },
      { n: '06', short: 'A PRÁTICA',                title: 'A Prática: os pilares que sustentam a linha',          teaser: 'os pilares e o que cada um entrega',
        see: ['Os pilares da prática', 'Uma contribuição por pilar'] },
      { n: '07', short: 'O FUTURO DE ANALYTICS',    title: 'O futuro de analytics',                                teaser: 'para onde a linha segue',
        see: ['Decisões estratégicas e integração', 'Reuso de ativos e eficiência', 'Projetos User-Pay com Advanced Analytics'] }
    ],
    // os 3 capítulos da viagem (mapa da abertura e da Conversa 0)
    chapters: [['Onde atuamos', [1, 2, 3], C_RED], ['Cases e resultados', [4, 5, 6], C_ORANGE], ['O que vem pela frente', [7], C_YELLOW]],
    mission: 'Transformamos dados em decisões e soluções de negócio.',
    stopInfo: { p1: ['Conversa 1', 'perguntas sobre as estações 01, 02 e 03'], p2: ['Conversa 2', 'aplicações e aprofundamento dos cases'] },
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
      { title: 'Apoiar decisões estratégicas', sub: 'dos clientes', icon: 'chair' },
      { title: 'Combinar analytics', sub: 'com as demais tracks', icon: 'link' },
      { title: 'Reutilizar ativos', sub: 'para ampliar o alcance', icon: 'grid' },
      { title: 'Automatizar rotinas', sub: 'para ganhar eficiência', icon: 'robots' },
      { title: 'Ampliar projetos User-Pay', sub: 'com Advanced Analytics', icon: 'userpay' }
    ],
    futureKey: 'É esse o papel que queremos ocupar.',
    // clímax: as disciplinas por trás de tudo (não técnicas soltas)
    climaxWords: ['Estatística', 'Otimização & Pesquisa operacional', 'Modelos supervisionados', 'Modelos não supervisionados', 'NLP', 'Redes neurais', 'Deep learning', 'Inteligência artificial'],
    climaxSub: ['setup de projetos de marketing e estratégia', 'modelos para tomada de decisão', 'aprendem com exemplos rotulados', 'encontram padrões sozinhos', 'entendem a linguagem natural', 'perceptron multicamadas (MLP)', 'transformers e atenção', 'agentes que percebem, raciocinam e agem'],
    climaxKey: 'Tudo se resume a *Analytics & Advanced Analytics*.',
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
    { scene: 'lightsoff', at: 1.0, text: 'O relatório de fraude para o board, agora automatizado.' },
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
