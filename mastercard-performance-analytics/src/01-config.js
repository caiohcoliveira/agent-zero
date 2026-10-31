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
    beat: 1.0              // quanto a música mexe na câmera, nas cores e nos elementos (0 desliga)
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
    { id: 3, track: 'tech', from: 20.058 },    // "Technology" a partir do compasso de 0:20 (2:29)
    { id: 4, track: 'piano', from: 7.48 }      // "Epic Piano" a partir do primeiro impacto (1:07)
  ],

  // ---------------------------------------------------------------- CENAS (ordem = ordem do filme)
  // dur casado com os compassos da faixa do play; station = estação da linha (1–7)
  scenes: [
    { id: 'open',      play: 1, dur: 15,     theme: 'dark' },
    { id: 's01',       play: 2, dur: 33.88,  station: 1, theme: 'light' },
    { id: 's02',       play: 2, dur: 37.08,  station: 2, theme: 'dark' },
    { id: 's03',       play: 2, dur: 48.524, station: 3, theme: 'dark' },   // ∞ em 36.96 (saída da música)
    { id: 's04',       play: 3, dur: 40.001, station: 4, theme: 'dark' },   // abertura da 04 + Cliente Banana; impacto no drop (35.56)
    { id: 'manga',     play: 3, dur: 26.668, station: 4, theme: 'dark' },
    { id: 'lightsoff', play: 3, dur: 17.778, station: 4, theme: 'light' },
    { id: 'insight',   play: 3, dur: 26.668, station: 4, theme: 'dark' },
    { id: 's05',       play: 3, dur: 17.778, station: 5, theme: 'dark' },
    { id: 's06',       play: 3, dur: 19.983, station: 6, theme: 'light' },  // saída suave da música
    { id: 's07',       play: 4, dur: 28.8,   station: 7, theme: 'dark' },
    { id: 'climax',    play: 4, dur: 12,     theme: 'dark' },
    { id: 'close',     play: 4, dur: 26.378, theme: 'dark' }                // último acorde em 14.08
  ],

  // ---------------------------------------------------------------- PARADAS (loop + itens navegáveis)
  // after = cena depois da qual o vídeo para · items = quantos passos o → percorre antes do embarque
  stops: [
    { id: 'preshow', after: null,    items: 1 },
    { id: 'stop0',   after: 'open',  items: 10 },  // mapa: visão geral + 9 destaques (7 estações e 2 paradas)
    { id: 'stop1',   after: 's03',   items: 4 },   // plataforma + cartazes 01, 02, 03
    { id: 'stop2',   after: 's06',   items: 4 },   // plataforma + cartazes 04, 05, 06
    { id: 'end',     after: 'close', items: 2 }    // letreiro final + cartaz 07
  ],

  // ---------------------------------------------------------------- TEXTOS-CHAVE
  text: {
    hookKicker: 'O NOSSO DESAFIO HOJE',
    hook: ['Eficiência operacional', 'Automação e escala', 'Ciência de dados', 'Inteligência artificial', 'Gerar valor'],
    line: 'LINHA PERFORMANCE ANALYTICS',
    stations: [
      { n: '01', short: 'STRATEGIC CAPABILITY', teaser: 'o papel de analytics na consultoria' },
      { n: '02', short: 'EVOLUTION & IMPACT',   teaser: 'como a track cresceu e o que entregou' },
      { n: '03', short: 'WHAT WE BRING',        teaser: 'capabilities para emissores, adquirentes e merchants' },
      { n: '04', short: 'ANALYTICS IN ACTION',  teaser: 'cases, do problema ao impacto' },
      { n: '05', short: 'SCALING OUR IMPACT',   teaser: 'dados, IA e inovação em escala' },
      { n: '06', short: 'PRACTICE',             teaser: 'pilares, entregas e evoluções' },
      { n: '07', short: 'FUTURE OF ANALYTICS',  teaser: 'onde queremos estar' }
    ],
    stop: { label: 'PARADA', next: 'PRÓXIMA PARTIDA', talk: 'hora de conversar', go: '→  seguir viagem', preshow: 'EMBARQUE EM INSTANTES', talkStop: 'parada para conversa' },
    postits: ['Por que caiu?', 'Quem priorizar?', 'Onde investir?', 'Qual o risco?', 'E se…?', 'Vale a pena?', 'O que mudou?', 'Qual canal?'],
    circleA: 'Negócio', circleB: 'Dados',
    chain: ['Dados', 'Decisões', 'Impacto', 'Valor'],
    engagement: [['Diagnóstico', 'dimensionar'], ['Estratégia', 'explicar'], ['Implementação', 'construir'], ['Mensuração', 'provar']],
    tagline: 'Da pergunta de negócio ao *valor medido*.',
    caseSteps: ['PROBLEMA', 'SOLUÇÃO ANALÍTICA', 'INSIGHT / DECISÃO', 'IMPACTO'],
    agents: {
      gen: [{ role: 'analista', name: 'Analista' }, { role: 'business', name: 'Business' }, { role: 'clevel', name: 'C-Level' }],
      judges: 'Julgadores', fixers: 'Corretores', done: 'Insight validado'
    },
    progression: ['Análise manual', 'Analytics avançado', 'Motores produtizados', 'Ativos de IA escaláveis'],
    perimeter: 'AMBIENTE MASTERCARD', never: 'o dado nunca sai',
    waves: {
      issuer: ['Fraud', 'Credit Risk', 'Authorization', 'AML', 'Collections'],
      acquirer: ['Fraud', 'Merchant Risk', 'Authorization Optimization', 'Smart Routing', 'Chargeback'],
      analytics: ['embeddings', 'anomaly detection', 'spend forecasting', 'customer similarity', 'merchant similarity',
        'product affinity', 'share of wallet', 'incrementality', 'attribution', 'assortment optimization'],
      frontier: ['causal ML', 'uplift modeling', 'reinforcement learning', 'graph fraud', 'graph embeddings',
        'deep recommenders', 'dynamic pricing', 'real-time personalization', 'multi-objective optimization']
    },
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
    { scene: 'open', at: 1.2, text: 'Hoje, o nosso desafio tem cinco nomes.' },
    { scene: 'open', at: 11.0, text: 'E, acima de tudo: gerar valor.' },
    { scene: 's01', at: 1.0, text: 'Próxima estação: analytics como capacidade estratégica da consultoria.' },
    { scene: 's01', at: 8.0, text: 'Todo projeto começa com uma pergunta de negócio.' },
    { scene: 's01', at: 22.0, text: 'Transformamos dados em decisões, decisões em impacto… e impacto em valor.' },
    { scene: 's02', at: 1.0, text: 'Próxima estação: a nossa evolução.' },
    { scene: 's02', at: 22.5, text: 'E o Brasil fechou acima do período anterior e acima do budget.' },
    { scene: 's03', at: 1.0, text: 'Próxima estação: o que levamos ao mercado.' },
    { scene: 's03', at: 10.0, text: 'Para emissores, adquirentes e merchants, cada capability já tem um case para mostrar.' },
    { scene: 's04', at: 1.0, text: 'Próxima estação: analytics em ação. Do problema ao impacto.' },
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
/** cenas dos trechos (draw(ctx, t, T)) e das paradas (draw(ctx, tl, item, prevItem, p)) — registradas pelos arquivos de cena */
const SCENES = {}, STOPSCN = {};
