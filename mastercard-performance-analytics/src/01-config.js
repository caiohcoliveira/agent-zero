/* ============================================================================
   1. CONFIG — tudo que costuma ser ajustado fica aqui.
   ----------------------------------------------------------------------------
   • Tempos de cena: altere `dur`; o início de cada cena é recalculado.
   • Narração / cues sonoros usam tempo LOCAL da cena (segundos desde o início).
   • Textos-chave em CONFIG.text — *palavra* = destaque laranja.
   ========================================================================== */
const W = 1920, H = 1080;

const CONFIG = {
  fps: 30,                 // referência visual (render usa rAF; "on twos" = fps/2)
  bpm: 120,                // trilha: 1 compasso = 2s

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
    grain: 0.06            // granulação de filme (0 desliga)
  },

  audio: {
    music: true, sfx: true,
    voice: false,          // narração do navegador: DESLIGADA por padrão (botão "Voz" / tecla V)
    musicVolume: 0.42, sfxVolume: 0.62,
    duckDuringVoice: 0.55, // multiplica a trilha enquanto a narração fala
    voiceRate: 1.07, voicePitch: 1.02,
    // ordem de preferência de vozes pt-BR femininas (Windows/Edge, macOS, Chrome, Android)
    preferredVoices: ['Francisca', 'Thalita', 'Brenda', 'Giovanna', 'Leila', 'Manuela', 'Yara',
      'Elza', 'Luciana', 'Fernanda', 'Vitória', 'Vitoria', 'Maria', 'Google português do Brasil'],
    avoidVoices: ['Antonio', 'Daniel', 'Donato', 'Fabio', 'Felipe', 'Humberto', 'Julio', 'Nicolau', 'Valerio']
  },

  captions: false,         // legenda completa da narração (tecla C)

  // ---------------------------------------------------------------- CENAS (ordem = ordem do filme)
  scenes: [
    { id: 'hook',      dur: 18, theme: 'dark'  },
    { id: 'problem',   dur: 18, theme: 'light' },
    { id: 'hub',       dur: 20, theme: 'dark'  },
    { id: 'als',       dur: 34, theme: 'dark'  },   // caso 01
    { id: 'embed',     dur: 30, theme: 'light', transitionIn: { type: 'iris', dur: 0.9 } },   // caso 02
    { id: 'lightsoff', dur: 26, theme: 'light' },   // caso 03
    { id: 'insights',  dur: 34, theme: 'dark'  },   // caso 04 (alimenta os reports automatizados)
    { id: 'skills',    dur: 22, theme: 'dark'  },   // possibilidades (ondas de modelos → ∞)
    { id: 'climax',    dur: 20, theme: 'dark'  },
    { id: 'close',     dur: 18, theme: 'dark'  }
  ],
  // momento (local) do carimbo ✓ de cada caso — sincroniza cena e chips de capítulo
  caseDone: { als: 32.2, embed: 27.0, lightsoff: 21.4, insights: 31.4 },

  // ---------------------------------------------------------------- TEXTOS-CHAVE
  text: {
    hookKicker: 'O NOSSO DESAFIO HOJE',
    hook: ['Eficiência operacional', 'Automação e escala', 'Ciência de dados', 'Inteligência artificial', 'Gerar valor'],
    questions: [
      { id: 'als',       n: '01', q: 'Como recomendar\nmelhor?', icon: 'basket', short: 'Recomendação' },
      { id: 'embed',     n: '02', q: 'Como medir\nprincipalidade?', icon: 'orbit', short: 'Principalidade' },
      { id: 'lightsoff', n: '03', q: 'Como ganhar\neficiência?', icon: 'bolt', short: 'Eficiência' },
      { id: 'insights',  n: '04', q: 'Como gerar insights\nem escala?', icon: 'dashboard', short: 'Insights' }
    ],
    postits: ['Por que caiu?', 'Quem priorizar?', 'E se…?', 'Qual o risco?', 'Onde investir?',
      'Vale a pena?', 'Quanto custa?', 'Qual canal?', 'Para quando?', 'Quem compra?', 'O que mudou?', 'E agora?'],
    brand: 'Performance Analytics',
    circleA: 'Negócio', circleB: 'Dados',
    satellites: ['Modelos', 'Tecnologia', 'Estratégia'],
    chain: ['Dados', 'Insights', 'Decisão', 'Impacto'],
    cases: {
      als:       { tag: 'CASO 01 · VAREJO', title: 'Recomendação inteligente', sub: 'ALS · Fatoração de Matrizes', stamp: 'Recomendação inteligente' },
      embed:     { tag: 'CASO 02 · ISSUER', title: 'Embeddings', sub: 'Mapeando relações entre produtos', stamp: 'Afinidade mapeada' },
      lightsoff: { tag: 'CASO 03 · FRAUDE', title: 'Lights-off reporting', sub: 'Do dado ao board', stamp: 'Lights-off reporting' },
      insights:  { tag: 'CASO 04 · IA', title: 'Insights em escala', sub: 'Multiagentes · transformers em GPU', stamp: 'Insights em escala' }
    },
    agents: {
      gen: [
        { role: 'analista', name: 'Analista', draft: 'Fraude +18% no e-commerce,\nconcentrada em 3 MCCs' },
        { role: 'business', name: 'Business', draft: 'Alta em e-commerce pressiona\nperdas do trimestre' },
        { role: 'clevel',   name: 'C-Level',  draft: 'E-commerce pede ação:\nrevisar regras de risco' }
      ],
      validator: 'Validador', packer: 'Embalador',
      headline: 'Fraude: e-commerce +18% em 3 MCCs — revisar regras de risco',
      processes: [['CRM', 'user'], ['E-mail', 'doc'], ['App', 'card'], ['API', 'nodes'], ['Alertas', 'bolt'], ['Slides', 'chart']]
    },
    stack: {
      models: ['LLM', 'Embeddings', 'Reranker', 'Classificador', 'Guardrails'],
      perimeter: 'AMBIENTE MASTERCARD', never: 'o dado nunca sai', external: 'APIs externas'
    },
    waves: {
      issuer: ['Fraud', 'Credit Risk', 'Authorization', 'AML', 'Collections'],
      acquirer: ['Fraud', 'Merchant Risk', 'Authorization Optimization', 'Smart Routing', 'Chargeback'],
      analytics: ['embeddings', 'anomaly detection', 'spend forecasting', 'customer similarity', 'merchant similarity',
        'product affinity', 'share of wallet', 'incrementality', 'attribution', 'assortment optimization'],
      frontier: ['causal ML', 'uplift modeling', 'reinforcement learning', 'graph fraud', 'graph embeddings',
        'deep recommenders', 'dynamic pricing', 'real-time personalization', 'multi-objective optimization']
    },
    climaxWords: ['Estatística', 'Regressão', 'Classificação', 'Árvores', 'Ensembles', 'Clusters',
      'Anomalias', 'Otimização', 'Embeddings', 'Transformers', 'Agentes', 'Automação'],
    climaxLine: 'Dos problemas mais simples aos mais complexos',
    climaxKey: 'Nossa especialidade é *analytics*.',
    climaxSub: 'analytics · criatividade · escala',
    flap: ['WELCOME TO THE FUTURE', 'WELCOME TO AI', 'WELCOME TO ANALYTICS', 'PERFORMANCE ANALYTICS']
  },

  // ---------------------------------------------------------------- NARRAÇÃO
  // at = segundos desde o início da cena · text = como aparece na legenda
  narration: [
    { scene: 'hook', at: 3.4,  text: 'Hoje, o nosso desafio tem cinco nomes.' },
    { scene: 'hook', at: 6.5,  text: 'Eficiência operacional.' },
    { scene: 'hook', at: 8.0,  text: 'Automação e escala.' },
    { scene: 'hook', at: 9.5,  text: 'Ciência de dados.' },
    { scene: 'hook', at: 11.0, text: 'Inteligência artificial.' },
    { scene: 'hook', at: 12.6, text: 'E, acima de tudo: gerar valor.' },

    { scene: 'problem', at: 0.3,  text: 'Em cada cliente, em cada contexto, a pergunta muda.' },
    { scene: 'problem', at: 4.0,  text: 'Como recomendar melhor?' },
    { scene: 'problem', at: 6.0,  text: 'Como medir principalidade?' },
    { scene: 'problem', at: 8.0,  text: 'Como ganhar eficiência?' },
    { scene: 'problem', at: 10.0, text: 'Como gerar insights em escala?' },
    { scene: 'problem', at: 12.4, text: 'Mas a necessidade é sempre a mesma: transformar complexidade em decisão.' },

    { scene: 'hub', at: 1.0,  text: 'É exatamente aqui que entra a track de Performance Analytics da Mastercard.' },
    { scene: 'hub', at: 7.2,  text: 'No encontro entre dados e negócio, conectamos modelos, tecnologia e estratégia…' },
    { scene: 'hub', at: 12.8, text: '…para transformar dados em insights, insights em decisões — e decisões em impacto real.' },

    { scene: 'als', at: 1.0,  text: 'Primeiro desafio: recomendação. Num cliente do varejo: quais SKUs e cestas recomendar para cada cliente?' },
    { scene: 'als', at: 7.2,  text: 'Cada linha é um cliente. Cada coluna, um produto. E quase toda a matriz… está vazia.' },
    { scene: 'als', at: 12.9, text: 'Com fatoração de matrizes — o ALS — decompomos a matriz em fatores ocultos, alternando o ajuste entre clientes e produtos até o padrão emergir.' },
    { scene: 'als', at: 23.0, text: 'As lacunas viram propensões.' },
    { scene: 'als', at: 26.6, text: 'E, no espaço latente, cada cliente se aproxima da cesta certa.' },

    { scene: 'embed', at: 1.0,  text: 'Segundo desafio: principalidade — entender como os produtos financeiros se relacionam.' },
    { scene: 'embed', at: 7.0,  text: 'Com embeddings, deixamos de olhar itens isolados: cada produto vira um vetor, num espaço de muitas dimensões.' },
    { scene: 'embed', at: 15.0, text: 'Ali, proximidade — medida pela distância do cosseno — significa afinidade. Produtos parecidos se agrupam…' },
    { scene: 'embed', at: 22.0, text: '…e padrões invisíveis viram um mapa claro para decisões de principalidade.' },

    { scene: 'lightsoff', at: 1.0,  text: 'Terceiro desafio: eficiência. O report de fraude para o board exigia trabalho manual: extrair, conferir, formatar… repetir.' },
    { scene: 'lightsoff', at: 9.6,  text: 'Então criamos uma automação lights-off.' },
    { scene: 'lightsoff', at: 14.0, text: 'Os dados chegam, são validados, processados… e o report é publicado sozinho, do dado ao board.' },
    { scene: 'lightsoff', at: 22.2, text: 'Mas quem escreve os destaques do report?' },

    { scene: 'insights', at: 0.8,  text: 'Quarto desafio: insights em escala.' },
    { scene: 'insights', at: 3.4,  text: 'Três agentes geradores — analista, business e C-level — escrevem o insight.' },
    { scene: 'insights', at: 8.6,  text: 'Um validador confere — e, se não estiver bom, manda refazer.' },
    { scene: 'insights', at: 12.8, text: 'Um embalador entrega o título pronto: no report, no dashboard, em qualquer processo.' },
    { scene: 'insights', at: 18.8, text: 'Por trás, transformers puros rodando em GPU, com vários modelos trabalhando juntos…' },
    { scene: 'insights', at: 24.2, text: '…e o dado nunca sai da Mastercard.' },
    { scene: 'insights', at: 27.4, text: 'Insights em escala, conectáveis a qualquer processo.' },

    { scene: 'skills', at: 1.0, text: 'E esses são só alguns exemplos.' },
    { scene: 'skills', at: 8.0, text: 'Do issuer ao acquirer… do clássico ao estado da arte.' },

    ...['Estatística.', 'Regressão.', 'Classificação.', 'Árvores.', 'Ensembles.', 'Clusters.',
        'Anomalias.', 'Otimização.', 'Embeddings.', 'Transformers.', 'Agentes.', 'Automação.']
      .map((w, i) => ({ scene: 'climax', at: i * 0.85 + 0.05, text: w, rate: 1.2 })),
    { scene: 'climax', at: 10.4, text: 'Não importa o desafio. Dos problemas mais simples aos mais complexos…' },
    { scene: 'climax', at: 15.4, text: '…nossa especialidade é resolver com analytics, criatividade e escala.' },

    { scene: 'close', at: 1.0, text: 'Se o desafio pede eficiência, escala e valor, a resposta passa por Performance Analytics.' }
  ],

  // Grafia fonética para o TTS pt-BR ler bem os termos em inglês (ajuste à voz do seu sistema)
  phonetics: [
    [/Performance Analytics/g, 'Perfórmance Anâlitics'],
    [/\banalytics\b/gi, 'anâlitics'],
    [/\binsights?\b/gi, 'ínsaits'],
    [/\btrack\b/gi, 'tréc'],
    [/\bdashboards?\b/gi, 'déshbórd'],
    [/\bboard\b/gi, 'bórd'],
    [/\blights-off\b/gi, 'láits óf'],
    [/\bALS\b/g, 'á éle ésse'],
    [/\bSKUs\b/g, 'ésse cá ús'],
    [/\bembeddings\b/gi, 'imbédings'],
    [/\bClusters\b/g, 'Clâsters'],
    [/\bEnsembles\b/g, 'Ansâmbous'],
    [/\bC-level\b/gi, 'ci lével'],
    [/\bbusiness\b/gi, 'bízness'],
    [/\breports\b/gi, 'ripórts'],
    [/\breport\b/gi, 'ripórt'],
    [/\btransformers\b/gi, 'transfórmers'],
    [/\bGPU\b/g, 'gê pê ú'],
    [/\bissuer\b/gi, 'íxuer'],
    [/\bacquirer\b/gi, 'akuáirer'],
    [/\bMastercard\b/g, 'Másterkard']
  ]
};

/* Linha do tempo derivada (não editar) */
(function buildTimeline() {
  let t = 0;
  CONFIG.scenes.forEach((s, i) => { s.index = i; s.start = t; s.end = t + s.dur; t += s.dur; });
  CONFIG.duration = t;
  CONFIG.sceneById = Object.fromEntries(CONFIG.scenes.map(s => [s.id, s]));
  CONFIG.narration.forEach(n => { n.t = CONFIG.sceneById[n.scene].start + n.at; });
  CONFIG.narration.sort((a, b) => a.t - b.t);
})();
/** pergunta/capítulo pelo id do caso */
const Q = id => CONFIG.text.questions.find(q => q.id === id);
