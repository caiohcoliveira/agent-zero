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
    onTwos: true,          // elementos animados a 15 fps sobre câmera fluida (textura stop motion)
    grain: 0.06            // granulação de filme (0 desliga)
  },

  audio: {
    music: true, sfx: true, voice: true,
    musicVolume: 0.42, sfxVolume: 0.62,
    duckDuringVoice: 0.55, // multiplica a trilha enquanto a narração fala
    voiceRate: 1.07, voicePitch: 1.02,
    // ordem de preferência de vozes pt-BR femininas (Windows/Edge, macOS, Chrome, Android)
    preferredVoices: ['Francisca', 'Thalita', 'Brenda', 'Giovanna', 'Leila', 'Manuela', 'Yara',
      'Elza', 'Luciana', 'Fernanda', 'Vitória', 'Vitoria', 'Maria', 'Google português do Brasil'],
    avoidVoices: ['Antonio', 'Daniel', 'Donato', 'Fabio', 'Felipe', 'Humberto', 'Julio', 'Nicolau', 'Valerio']
  },

  captions: false,         // legenda completa da narração (tecla C)

  // ---------------------------------------------------------------- CENAS
  scenes: [
    { id: 'hook',      dur: 16, theme: 'dark'  },
    { id: 'problem',   dur: 18, theme: 'light' },
    { id: 'hub',       dur: 22, theme: 'dark'  },
    { id: 'insights',  dur: 30, theme: 'light' },
    { id: 'als',       dur: 36, theme: 'dark'  },
    { id: 'embed',     dur: 30, theme: 'light', transitionIn: { type: 'iris', dur: 0.9 } },
    { id: 'lightsoff', dur: 28, theme: 'light' },
    { id: 'skills',    dur: 22, theme: 'dark'  },
    { id: 'climax',    dur: 22, theme: 'dark'  },
    { id: 'close',     dur: 16, theme: 'dark'  }
  ],

  // ---------------------------------------------------------------- TEXTOS-CHAVE
  text: {
    hook: ['Mais *dados*.', 'Mais *velocidade*.', 'Mais *decisões*.'],
    hookWords: ['contexto', 'precisão', 'inteligência'],
    questions: [
      { n: '01', q: 'Como gerar insights\nem escala?', icon: 'dashboard', short: 'Insights' },
      { n: '02', q: 'Como recomendar\nmelhor?', icon: 'basket', short: 'Recomendação' },
      { n: '03', q: 'Como medir\nprincipalidade?', icon: 'orbit', short: 'Principalidade' },
      { n: '04', q: 'Como ganhar\neficiência?', icon: 'bolt', short: 'Eficiência' }
    ],
    postits: ['Por que caiu?', 'Quem priorizar?', 'E se…?', 'Qual o risco?', 'Onde investir?',
      'Vale a pena?', 'Quanto custa?', 'Qual canal?', 'Para quando?', 'Quem compra?', 'O que mudou?', 'E agora?'],
    problemKey: 'complexidade → *decisão*',
    brand: 'Performance Analytics',
    circleA: 'Negócio', circleB: 'Dados',
    satellites: ['Modelos', 'Tecnologia', 'Estratégia'],
    chain: ['Dados', 'Insights', 'Decisão', 'Impacto'],
    case1: { tag: 'CASO 01', title: 'Insights em escala', sub: 'Multiagentes para dashboards', stamp: 'Dashboards que explicam' },
    case2: { tag: 'CASO 02 · VAREJO', title: 'Recomendação inteligente', sub: 'ALS · Fatoração de Matrizes', stamp: 'Recomendação inteligente' },
    case3: { tag: 'CASO 03 · ISSUER', title: 'Embeddings', sub: 'Mapeando relações entre produtos', stamp: 'Afinidade mapeada' },
    case4: { tag: 'CASO 04 · FRAUDE', title: 'Lights-off reporting', sub: 'Do dado ao board', stamp: 'Lights-off reporting' },
    agents: {
      gen: [
        { role: 'analista', name: 'Analista', draft: 'Volume −8% no Sul,\nconcentrado no e-commerce' },
        { role: 'business', name: 'Business', draft: 'Queda no Sul coloca a\nmeta do trimestre em risco' },
        { role: 'clevel',   name: 'C-Level',  draft: 'Sul exige ação: revisar\na campanha digital' }
      ],
      validator: 'Validador', packer: 'Embalador',
      headline: 'Sul −8%: e-commerce puxa a queda — revisar campanha digital'
    },
    skills: ['Crédito', 'Machine Learning', 'Advanced Analytics', 'Ciência de Dados', 'IA'],
    climaxWords: ['Estatística', 'Regressão', 'Classificação', 'Árvores', 'Ensembles', 'Clusters',
      'Anomalias', 'Embeddings', 'Recomendação', 'Agentes', 'Automação'],
    climaxLine: 'Dos problemas mais simples aos mais complexos',
    climaxKey: 'Nossa especialidade é *analytics*.',
    climaxSub: 'analytics · criatividade · escala',
    future: 'O futuro da decisão é orientado por *analytics*.',
    cta: 'Use mais esta *track*.',
    ctaSub: 'Traga seu próximo desafio.'
  },

  // ---------------------------------------------------------------- NARRAÇÃO
  // at = segundos desde o início da cena · text = como aparece na legenda
  narration: [
    { scene: 'hook', at: 4.0,  text: 'Mais dados.' },
    { scene: 'hook', at: 5.5,  text: 'Mais velocidade.' },
    { scene: 'hook', at: 7.0,  text: 'Mais decisões.' },
    { scene: 'hook', at: 9.4,  text: 'Hoje, decidir bem exige muito mais do que informação. Exige contexto, precisão… e inteligência.' },

    { scene: 'problem', at: 0.3,  text: 'Em cada cliente, em cada contexto, a pergunta muda.' },
    { scene: 'problem', at: 4.0,  text: 'Como gerar insights em escala?' },
    { scene: 'problem', at: 6.0,  text: 'Como recomendar melhor?' },
    { scene: 'problem', at: 8.0,  text: 'Como medir principalidade?' },
    { scene: 'problem', at: 10.0, text: 'Como ganhar eficiência?' },
    { scene: 'problem', at: 12.4, text: 'Mas a necessidade é sempre a mesma: transformar complexidade em decisão.' },

    { scene: 'hub', at: 1.0,  text: 'É exatamente aqui que entra a track de Performance Analytics da Mastercard.' },
    { scene: 'hub', at: 7.6,  text: 'No encontro entre dados e negócio, conectamos modelos, tecnologia e estratégia…' },
    { scene: 'hub', at: 13.6, text: '…para transformar dados em insights, insights em decisões — e decisões em impacto real.' },

    { scene: 'insights', at: 1.0,  text: 'Primeiro desafio: gerar insights em escala.' },
    { scene: 'insights', at: 4.6,  text: 'Um dashboard mostra o quê. Mas quem explica o porquê?' },
    { scene: 'insights', at: 9.0,  text: 'Criamos três agentes geradores, com olhares diferentes — analista, business e C-level.' },
    { scene: 'insights', at: 16.2, text: 'Um validador confere tudo — e, se não estiver bom, manda refazer.' },
    { scene: 'insights', at: 21.0, text: 'Por fim, um agente embala o insight, que vira o título do dashboard. Em escala.' },

    { scene: 'als', at: 1.0,  text: 'Segundo desafio: recomendação. Num cliente do varejo: quais SKUs e cestas recomendar para cada cliente?' },
    { scene: 'als', at: 7.2,  text: 'Cada linha é um cliente. Cada coluna, um produto. E quase toda a matriz… está vazia.' },
    { scene: 'als', at: 12.9, text: 'Com fatoração de matrizes — o ALS — decompomos a matriz em fatores ocultos, alternando o ajuste entre clientes e produtos até o padrão emergir.' },
    { scene: 'als', at: 23.0, text: 'As lacunas viram propensões.' },
    { scene: 'als', at: 27.0, text: 'E, no espaço latente, cada cliente se aproxima da cesta certa.' },

    { scene: 'embed', at: 1.0,  text: 'Terceiro desafio: principalidade — entender como os produtos financeiros se relacionam.' },
    { scene: 'embed', at: 7.0,  text: 'Com embeddings, deixamos de olhar itens isolados: cada produto vira um vetor, num espaço de muitas dimensões.' },
    { scene: 'embed', at: 15.0, text: 'Ali, proximidade significa afinidade. Produtos parecidos se agrupam, regiões se formam…' },
    { scene: 'embed', at: 22.0, text: '…e padrões invisíveis viram um mapa claro para decisões de principalidade.' },

    { scene: 'lightsoff', at: 1.0,  text: 'Quarto desafio: eficiência. O report de fraude para o board exigia trabalho manual: extrair, conferir, formatar… repetir.' },
    { scene: 'lightsoff', at: 9.6,  text: 'Então criamos uma automação lights-off.' },
    { scene: 'lightsoff', at: 14.2, text: 'Os dados chegam, são validados, processados… e o report é publicado sozinho. E os agentes de insight destacam o que importa.' },
    { scene: 'lightsoff', at: 23.0, text: 'Do dado ao board — com velocidade, consistência e escala.' },

    { scene: 'skills', at: 1.0,  text: 'E esses são só alguns exemplos.' },
    { scene: 'skills', at: 4.0,  text: 'Nossa atuação vai de crédito…' },
    { scene: 'skills', at: 6.4,  text: 'a machine learning…' },
    { scene: 'skills', at: 8.8,  text: 'de advanced analytics…' },
    { scene: 'skills', at: 11.2, text: 'a ciência de dados…' },
    { scene: 'skills', at: 13.6, text: 'e inteligência artificial…' },
    { scene: 'skills', at: 16.0, text: 'sempre aplicados a problemas reais de negócio.' },

    ...['Estatística.', 'Regressão.', 'Classificação.', 'Árvores.', 'Ensembles.', 'Clusters.',
        'Anomalias.', 'Embeddings.', 'Recomendação.', 'Agentes.', 'Automação.']
      .map((w, i) => ({ scene: 'climax', at: i * 1.0 + 0.05, text: w, rate: 1.15 })),
    { scene: 'climax', at: 11.2, text: 'Não importa o desafio. Dos problemas mais simples aos mais complexos…' },
    { scene: 'climax', at: 16.8, text: '…nossa especialidade é resolver com analytics, criatividade e escala.' },

    { scene: 'close', at: 1.0, text: 'Se o desafio pede inteligência, escala e impacto, a resposta passa por Performance Analytics.' },
    { scene: 'close', at: 7.2, text: 'O futuro da decisão… é orientado por analytics.', rate: 0.95 }
  ],

  // Grafia fonética para o TTS pt-BR ler bem os termos em inglês (ajuste à voz do seu sistema)
  phonetics: [
    [/Performance Analytics/g, 'Perfórmance Anâlitics'],
    [/\banalytics\b/gi, 'anâlitics'],
    [/\binsights?\b/gi, 'ínsaits'],
    [/\btrack\b/gi, 'tréc'],
    [/\bdashboards?\b/gi, 'déshbórd'],
    [/\bmachine learning\b/gi, 'machín lérning'],
    [/\badvanced\b/gi, 'advénsd'],
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
