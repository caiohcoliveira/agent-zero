/* ============================================================================
   8. MÚSICA — faixas embutidas tocando em sincronia com a linha do tempo,
   e leitura das batidas (BEAT) para câmera, cores e elementos.
   ----------------------------------------------------------------------------
   • As faixas ficam em <script type="text/plain" id="music-<id>"> (base64),
     gerados pelo build a partir de musica/ (fora do Git).
   • BEAT.at(T) é função pura do tempo: seek e pausa continuam exatos.
   ========================================================================== */
const TRACKS = (() => {
  const bytes = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const out = {};
  for (const id in BEATS) {
    const d = BEATS[id], env = {};
    for (const k in d.env) env[k] = bytes(d.env[k]);
    out[id] = { id, data: d, env, hitT: d.hits.map(h => h[0]), buf: null, embedded: !!document.getElementById('music-' + id) };
  }
  return out;
})();

const TRACK = {
  gain: null, srcs: [],
  ready(id) { return !!(TRACKS[id] && TRACKS[id].buf); },
  embedded(id) { return !!(TRACKS[id] && TRACKS[id].embedded); },
  bus() {
    if (!this.gain) { this.gain = AUDIO.ctx.createGain(); this.gain.gain.value = 0; this.gain.connect(AUDIO.master); }
    this.apply(); return this.gain;
  },
  apply() {
    if (!this.gain) return; const a = CONFIG.audio;
    this.gain.gain.setTargetAtTime(a.music ? a.trackVolume * AUDIO.duck : 0, AUDIO.ctx.currentTime, .06);
  },
  /** agenda as faixas dos plays a partir do instante T da linha do tempo (o AUDIO já marcou t0v/t0c) */
  schedule(T) {
    this.stopAll(); const ctx = AUDIO.ctx; if (!ctx) return;
    CONFIG.plays.forEach(p => {
      if (!p.track || p.end <= T + .02 || !this.ready(p.track)) return;
      const s = Math.max(T, p.start), when = AUDIO.ctxTime(s), late = Math.max(0, ctx.currentTime - when);
      const src = ctx.createBufferSource(), g = ctx.createGain();
      src.buffer = TRACKS[p.track].buf; g.gain.value = (CONFIG.audio.tracks[p.track] || {}).gain || 1;
      src.connect(g); g.connect(this.bus());
      src.start(when + late, p.from + (s - p.start) + late, Math.max(.01, p.end - s - late));
      this.srcs.push(src);
    });
  },
  stopAll() { this.srcs.forEach(s => { try { s.stop(); } catch (e) {} }); this.srcs = []; },
  /** quando uma faixa termina de decodificar com o vídeo já tocando, entra no ponto certo */
  onReady() { if (AUDIO.playing && AUDIO.ctx) this.schedule(AUDIO.t0v + (AUDIO.ctx.currentTime - AUDIO.t0c)); }
};

/* decodifica as faixas logo no carregamento (contexto offline: não precisa de gesto do usuário) */
(function decodeTracks() {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!OAC) return;
  const oac = new OAC(2, 44100, 44100);
  Object.values(TRACKS).forEach(tr => {
    const el = document.getElementById('music-' + tr.id); if (!el) return;
    const raw = atob(el.textContent.trim()), buf = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
    oac.decodeAudioData(buf.buffer).then(b => { tr.buf = b; TRACK.onReady(); })
      .catch(e => console.warn('[música] não deu para decodificar', tr.id, e));
  });
})();

/* ---------------------------------------------------------------------------
   BEAT — estado da música no instante T (0–1 em tudo):
   beat  pulso no tempo (1 na batida, cai rápido) · down  idem no 1º tempo do compasso
   kick/snare  ataques de grave e de caixa/chimbal · low/level  nível do grave e geral
   hit   picos fortes · drop  virada de seção · phase/bar  posição no tempo/compasso
   i/di  índice da batida/do compasso (para alternar efeitos)
   --------------------------------------------------------------------------- */
const BEAT = (() => {
  const idx = (arr, x) => { let lo = 0, hi = arr.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (arr[m] <= x) { r = m; lo = m + 1; } else hi = m - 1; } return r; };
  function env(tr, k, x) {
    const a = tr.env[k], f = x * tr.data.fps, i = Math.floor(f);
    return i < 0 || i + 1 >= a.length ? 0 : lerp(a[i], a[i + 1], f - i) / 255;
  }
  function fromTrack(id, x) {
    const tr = TRACKS[id], d = tr.data, per = 60 / d.bpm;
    const bi = idx(d.beats, x), b0 = bi >= 0 ? d.beats[bi] : x - 1e3, b1 = bi + 1 < d.beats.length ? d.beats[bi + 1] : b0 + per;
    const di = idx(d.down, x), d0 = di >= 0 ? d.down[di] : x - 1e3, d1 = di + 1 < d.down.length ? d.down[di + 1] : d0 + per * 4;
    let hit = 0;
    for (let k = idx(tr.hitT, x); k >= 0 && x - tr.hitT[k] < .5; k--) hit = Math.max(hit, d.hits[k][1] * Math.exp(-(x - tr.hitT[k]) * 10));
    let drop = 0; const si = idx(d.sections, x);
    if (si >= 0 && x - d.sections[si] < 2.5) drop = Math.exp(-(x - d.sections[si]) * 2.2);
    return {
      kick: env(tr, 'kick', x), snare: env(tr, 'snare', x), low: env(tr, 'low', x), level: env(tr, 'level', x),
      beat: Math.exp(-(x - b0) * 7), down: Math.exp(-(x - d0) * 4),
      phase: clamp((x - b0) / (b1 - b0)), bar: clamp((x - d0) / (d1 - d0)), i: bi, di, hit, drop, bpm: d.bpm, on: true
    };
  }
  /** abertura com trilha sintetizada (120 BPM a partir do início da cena) */
  function synth(x) {
    const per = 60 / CONFIG.bpm, full = x >= 4.5, bi = Math.floor(x / per), db = Math.floor(x / (per * 4));
    const sb = x - bi * per, sd = x - db * per * 4, k = full ? Math.exp(-sb * 10) : 0;
    return { kick: k * .9, snare: full && bi % 2 ? Math.exp(-sb * 12) * .7 : 0, low: full ? .7 : .25, level: full ? .75 : .3,
      beat: full ? Math.exp(-sb * 7) : 0, down: full ? Math.exp(-sd * 4) : 0, phase: sb / per, bar: sd / (per * 4), i: bi, di: db,
      hit: 0, drop: Math.abs(x - 4.5) < 2.5 && x >= 4.5 ? Math.exp(-(x - 4.5) * 2.2) : 0, bpm: CONFIG.bpm, on: full };
  }
  const QUIET = { kick: 0, snare: 0, low: 0, level: 0, beat: 0, down: 0, phase: 0, bar: 0, i: 0, di: 0, hit: 0, drop: 0, bpm: 0, on: false, I: 0 };
  /** intensidade da batida no instante T: base contida e picos nos clímax (SCENES[id].peaks = [[t0, t1], …] em tempo local) */
  function intensity(sc, t) {
    const base = CONFIG.motion.beatBase == null ? .15 : CONFIG.motion.beatBase, pk = (SCENES[sc.id] && SCENES[sc.id].peaks) || [];
    let I = 0; pk.forEach(([a, b, amt = 1]) => { I = Math.max(I, amt * Math.min(clamp((t - a) / .35 + 1), clamp((b - t) / .6))); });
    return base + (1 - base) * I;
  }
  /** aplica a intensidade: os ataques (soco, cor, RGB, inversão) só aparecem inteiros nos picos; o nível segue respirando */
  function shape(r, I) {
    ['kick', 'snare', 'beat', 'down', 'hit', 'drop'].forEach(k => { r[k] *= I; });
    r.low *= .35 + .65 * I; r.level *= .35 + .65 * I; r.I = I; return r;
  }
  return {
    /** estado da música no instante T da linha do tempo */
    at(T) {
      const sc = sceneAt(T), p = CONFIG.playById[sc.play], I = intensity(sc, T - sc.start);
      if (!p || !p.track) return shape(synth(T - (p ? p.start : 0)), I);
      return shape(fromTrack(p.track, p.from + (T - p.start)), I);
    },
    intensity,
    /** paradas: sem música, só uma respiração lenta para os loops */
    idle(tl) { return { ...QUIET, breath: .5 + .5 * Math.sin(tl * TAU / 4) }; },
    quiet: QUIET
  };
})();
/** estado da música no quadro atual (o player atualiza a cada render) */
let BT = BEAT.quiet;
