/* ============================================================================
   5. AUDIO — trilha + SFX 100% sintetizados (Web Audio API)
   ----------------------------------------------------------------------------
   • A trilha é uma função do tempo do vídeo: um scheduler com lookahead
     agenda notas em semicolcheias (16ths) → seek/pause sempre em sincronia.
   • Seções (MUSIC) definem quais instrumentos tocam e o filtro do mix.
   • SFX são cues da timeline: cue('cena', tLocal, 'tipo', {opções}).
   ========================================================================== */
const CUES = [];
function cue(sceneId, at, type, opt = {}) {
  const t = CONFIG.sceneById[sceneId].start + at;
  CUES.push({ t, type, opt });
  if (type === 'impact') IMPACTS.push({ t, size: opt.size == null ? 1 : opt.size });
}

// Trilha sintetizada: só na abertura. Nos plays com faixa embutida (src/08-music.js) ela fica muda;
// se a faixa não estiver no HTML, entra um groove de reserva.
// Flags: kick hat hat16 clap bass arp pad pluck comic roll big soft minor arpOct rise (filtro sobe até o fim da seção)
const FULL = { kick: 1, hat: 1, clap: 1, bass: 1, arp: 1, pad: 1 };
const MUSIC_SPEC = {
  open: [[0, { pad: 1, f: 700 }], [2.5, { pad: 1, kick: 1, soft: 1, f: 1200, rise: 1 }], [4.5, { ...FULL, f: 14000 }], [9, { pad: 1, f: 1400 }]]
};
const FALLBACK_SPEC = [[0, { kick: 1, hat: 1, bass: 1, arp: 1, pad: 1, f: 6000 }]], SILENT_SPEC = [[0, { f: 3000 }]];
const MUSIC = (() => {
  const out = [], hasTrack = sc => { const p = CONFIG.playById[sc.play]; return !!(p && p.track && document.getElementById('music-' + p.track)); };
  CONFIG.scenes.forEach(sc => { const spec = MUSIC_SPEC[sc.id] || (hasTrack(sc) ? SILENT_SPEC : FALLBACK_SPEC);
    spec.forEach(([at, f], i) => out.push([sc.start + at, sc.start + (i + 1 < spec.length ? spec[i + 1][0] : sc.dur), f])); });
  out.push([CONFIG.duration, CONFIG.duration + 1, { f: 3000 }]);
  return out;
})();
const PROG = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];       // Am F C G (vi–IV–I–V)
const PROG_MIN = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]];   // Am F Dm E (mais tenso)
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

const AUDIO = {
  ctx: null, ready: false, master: null, music: null, sfx: null, filter: null, verb: null, noiseBuf: null,
  playing: false, t0v: 0, t0c: 0, nextStep: 0, cueIdx: 0, timer: null, duck: 1,

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ctx = this.ctx = new AC();
    this.master = ctx.createGain(); this.master.gain.value = .9;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3.5; comp.attack.value = .004; comp.release.value = .2;
    this.master.connect(comp); comp.connect(ctx.destination);
    this.filter = ctx.createBiquadFilter(); this.filter.type = 'lowpass'; this.filter.frequency.value = 800; this.filter.Q.value = .8;
    this.music = ctx.createGain(); this.music.gain.value = CONFIG.audio.musicVolume;
    this.filter.connect(this.music); this.music.connect(this.master);
    this.sfx = ctx.createGain(); this.sfx.gain.value = CONFIG.audio.sfxVolume; this.sfx.connect(this.master);
    // reverb (resposta ao impulso gerada)
    this.verb = ctx.createConvolver(); const len = ctx.sampleRate * 2.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    this.verb.buffer = ir; const vg = ctx.createGain(); vg.gain.value = .32; this.verb.connect(vg); vg.connect(this.master);
    this.send = ctx.createGain(); this.send.connect(this.verb);
    this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = this.noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.ready = true; this.applyToggles();
  },
  applyToggles() {
    if (!this.ready) return; const n = this.ctx.currentTime;
    this.music.gain.setTargetAtTime(CONFIG.audio.music ? CONFIG.audio.musicVolume * this.duck : 0, n, .08);
    this.sfx.gain.setTargetAtTime(CONFIG.audio.sfx ? CONFIG.audio.sfxVolume : 0, n, .05);
    TRACK.apply();
  },
  setDuck(on) { this.duck = on ? CONFIG.audio.duckDuringVoice : 1; this.applyToggles(); },

  // ---------- transporte ----------
  start(videoT) {
    this.init(); if (!this.ready) return;
    this.ctx.resume(); this.playing = true;
    this.t0v = videoT; this.t0c = this.ctx.currentTime + .06;
    const step = 60 / CONFIG.bpm / 4; this.nextStep = Math.ceil(videoT / step);
    this.cueIdx = CUES.findIndex(c => c.t >= videoT - .02); if (this.cueIdx < 0) this.cueIdx = CUES.length;
    const sec = this.section(videoT), f0 = sec[2].rise ? lerp(sec[2].f, 14000, inv(sec[0], sec[1], videoT)) : sec[2].f;
    this.filter.frequency.setValueAtTime(f0, this.ctx.currentTime);
    if (sec[2].rise) this.filter.frequency.exponentialRampToValueAtTime(14000, this.ctxTime(sec[1]));
    clearInterval(this.timer); this.timer = setInterval(() => this.pump(), 25); this.pump();
    TRACK.schedule(videoT);
  },
  stop() {
    this.playing = false; clearInterval(this.timer); TRACK.stopAll();
    if (this.ready) { this.music.gain.cancelScheduledValues(0); this.sfx.gain.cancelScheduledValues(0); this.ctx.suspend(); this.rebuildBuses(); }
  },
  /** ao pausar/seek, descarta notas já agendadas recriando os buses */
  rebuildBuses() {
    const ctx = this.ctx; try { this.filter.disconnect(); this.sfx.disconnect(); this.send.disconnect(); } catch (e) {}
    this.send = ctx.createGain(); this.send.connect(this.verb);
    this.filter = ctx.createBiquadFilter(); this.filter.type = 'lowpass'; this.filter.Q.value = .8; this.filter.frequency.value = 800;
    this.music = ctx.createGain(); this.filter.connect(this.music); this.music.connect(this.master);
    this.sfx = ctx.createGain(); this.sfx.connect(this.master); this.applyToggles();
  },
  ctxTime(videoT) { return this.t0c + (videoT - this.t0v); },
  pump() {
    if (!this.playing) return;
    const ctx = this.ctx, vnow = this.t0v + (ctx.currentTime - this.t0c), horizon = vnow + .16, step = 60 / CONFIG.bpm / 4;
    while (this.nextStep * step < horizon) { const vt = this.nextStep * step; if (vt >= 0 && vt < CONFIG.duration) this.musicStep(this.nextStep, vt); this.nextStep++; }
    while (this.cueIdx < CUES.length && CUES[this.cueIdx].t < horizon) { const c = CUES[this.cueIdx++]; if (c.t >= vnow - .05) this.play(c.type, this.ctxTime(c.t), c.opt); }
  },

  // ---------- trilha ----------
  section(vt) { for (const s of MUSIC) if (vt >= s[0] && vt < s[1]) return s; return MUSIC[MUSIC.length - 1]; },
  musicStep(n, vt) {
    const sec = this.section(vt), f = sec[2], at = this.ctxTime(vt), sib = n % 16, bar = Math.floor(n / 16);
    if (Math.abs(vt - sec[0]) < .01) {
      this.filter.frequency.cancelScheduledValues(at);
      if (f.rise) { this.filter.frequency.setValueAtTime(f.f, at); this.filter.frequency.exponentialRampToValueAtTime(14000, this.ctxTime(sec[1])); }
      else this.filter.frequency.setTargetAtTime(f.f, at, .12);
    }
    const prog = (f.minor ? PROG_MIN : PROG)[bar % 4];
    if (f.kick && (sib % 4 === 0)) this.kick(at, f.soft ? .5 : 1);
    if (f.roll && sib % 2 === 0) this.snare(at, .25 + .6 * ((vt - sec[0]) / (sec[1] - sec[0])));
    if (f.clap && (sib === 4 || sib === 12)) this.snare(at, .55);
    if (f.hat && sib % 4 === 2) this.hat(at, .22);
    if (f.hat16 && sib % 2 === 1) this.hat(at, .08);
    if (f.bass && sib % 4 === 2) this.bass(at, mtof(prog[0] - 24), .24);
    if (f.bass && f.big && sib % 4 === 0) this.bass(at, mtof(prog[0] - 24), .14);
    if (f.arp && sib % (f.soft ? 2 : 1) === 0) {
      const seq = [0, 1, 2, 1, 2, 0, 2, 1], note = prog[seq[sib % 8]] + 12 + (f.arpOct && sib % 8 > 5 ? 12 : 0);
      this.pluck(at, mtof(note), f.soft ? .05 : .065, f.soft ? .35 : .18);
    }
    if (f.pluck && [0, 3, 6, 10].includes(sib)) this.pluck(at, mtof(prog[(sib / 3) % 3 | 0] + 24), .07, .08);
    if (f.comic && sib % 4 === 0) this.tick(at, 3200, .05);
    if (f.pad && sib === 0) prog.forEach(m => this.pad(at, mtof(m), 60 / CONFIG.bpm * 4 + .3, f.soft ? .035 : .045));
  },

  // ---------- instrumentos ----------
  env(g, at, a, peak, d, sustain = 0) { g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(peak, at + a); g.gain.exponentialRampToValueAtTime(Math.max(.0001, sustain || .0001), at + a + d); },
  osc(type, freq, at, dur, dest) { const o = this.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, at); o.connect(dest); o.start(at); o.stop(at + dur + .05); return o; },
  noise(at, dur, dest) { const s = this.ctx.createBufferSource(); s.buffer = this.noiseBuf; s.connect(dest); s.start(at, Math.random() * 1.5, dur + .05); return s; },
  gain(dest, v = 1) { const g = this.ctx.createGain(); g.gain.value = v; g.connect(dest); return g; },
  kick(at, v = 1) { const g = this.gain(this.filter, 0); this.env(g, at, .002, .9 * v, .32); const o = this.osc('sine', 150, at, .4, g); o.frequency.exponentialRampToValueAtTime(42, at + .12); },
  snare(at, v = .5) { const g = this.gain(this.filter, 0); this.env(g, at, .002, v * .5, .16); const hp = this.ctx.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 1800; hp.Q.value = .7; hp.connect(g); this.noise(at, .2, hp); },
  hat(at, v) { const g = this.gain(this.filter, 0); this.env(g, at, .001, v, .05); const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7500; hp.connect(g); this.noise(at, .06, hp); },
  bass(at, f, v) { const g = this.gain(this.filter, 0); this.env(g, at, .006, v, .22); const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, at); lp.frequency.exponentialRampToValueAtTime(180, at + .2); lp.connect(g); this.osc('sawtooth', f, at, .26, lp); this.osc('sine', f / 2, at, .26, g); },
  pluck(at, f, v, d) { const g = this.gain(this.filter, 0); this.env(g, at, .003, v, d); const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(4200, at); lp.frequency.exponentialRampToValueAtTime(700, at + d); lp.connect(g); g.connect(this.send); this.osc('square', f, at, d, lp); this.osc('triangle', f * 2, at, d, g); },
  pad(at, f, dur, v) { const g = this.gain(this.filter, 0); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + .5); g.gain.setValueAtTime(v, at + dur - .5); g.gain.linearRampToValueAtTime(0, at + dur); g.connect(this.send);
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800; lp.connect(g); [-7, 7].forEach(dt => { const o = this.osc('sawtooth', f, at, dur, lp); o.detune.value = dt; }); },

  // ---------- SFX ----------
  play(type, at, o) {
    const s = this.sfx, fn = this['sfx_' + type]; if (fn) fn.call(this, at, o, s);
  },
  tick(at, f = 2600, v = .12, dest) { const g = this.gain(dest || this.sfx, 0); this.env(g, at, .001, v, .04); this.osc('triangle', f, at, .05, g); },
  sfx_tick(at, o) { this.tick(at, o.f || 2600, o.v || .14); },
  sfx_pop(at, o) { const g = this.gain(this.sfx, 0); this.env(g, at, .002, (o.v || .22), .09); const os = this.osc('sine', 700 * (o.p || 1), at, .12, g); os.frequency.exponentialRampToValueAtTime(1500 * (o.p || 1), at + .05); g.connect(this.send); },
  sfx_whoosh(at, o) {
    const d = o.dur || .6, g = this.gain(this.sfx, 0), bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4; bp.connect(g);
    const up = o.dir !== 'down'; bp.frequency.setValueAtTime(up ? 300 : 3500, at); bp.frequency.exponentialRampToValueAtTime(up ? 3800 : 260, at + d);
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime((o.v || .4), at + d * .7); g.gain.linearRampToValueAtTime(0, at + d); this.noise(at, d, bp);
  },
  sfx_impact(at, o) {
    const sz = o.size == null ? 1 : o.size, g = this.gain(this.sfx, 0); this.env(g, at, .002, .9 * sz, .7);
    const os = this.osc('sine', 110, at, .8, g); os.frequency.exponentialRampToValueAtTime(34, at + .5);
    const g2 = this.gain(this.sfx, 0); this.env(g2, at, .001, .45 * sz, .25); const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.connect(g2); this.noise(at, .3, lp); g2.connect(this.send);
  },
  sfx_riser(at, o) {
    const d = o.dur || 2, g = this.gain(this.sfx, 0), bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3; bp.connect(g);
    bp.frequency.setValueAtTime(400, at); bp.frequency.exponentialRampToValueAtTime(6000, at + d);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(o.v || .3, at + d); g.gain.linearRampToValueAtTime(0, at + d + .03); this.noise(at, d, bp);
    const g3 = this.gain(this.sfx, 0); g3.gain.setValueAtTime(0, at); g3.gain.linearRampToValueAtTime(.05, at + d); g3.gain.linearRampToValueAtTime(0, at + d + .03);
    const os = this.osc('sawtooth', 110, at, d, g3); os.frequency.exponentialRampToValueAtTime(880, at + d);
  },
  sfx_swell(at, o) { const d = o.dur || 1.5, g = this.gain(this.sfx, 0), hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 4000; hp.connect(g); g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(.35, at + d); g.gain.linearRampToValueAtTime(0, at + d + .02); this.noise(at, d, hp); },
  sfx_chime(at, o) { const base = o.f || 1046.5; [0, o.up == null ? 7 : o.up].forEach((st, i) => { const g = this.gain(this.sfx, 0); this.env(g, at + i * .07, .003, .13, .7); g.connect(this.send); this.osc('triangle', base * Math.pow(2, st / 12), at + i * .07, .8, g); }); },
  sfx_ding(at, o) { [1, 2.76, 5.4].forEach((m, i) => { const g = this.gain(this.sfx, 0); this.env(g, at, .002, .16 / (i + 1), 1.4 / (i + 1)); g.connect(this.send); this.osc('sine', (o.f || 1318.5) * m, at, 1.5, g); }); },
  sfx_ping(at, o) { const g = this.gain(this.sfx, 0); this.env(g, at, .002, .12, .5); g.connect(this.send); this.osc('sine', o.f || 1760, at, .6, g); },
  sfx_click(at, o) { this.tick(at, 4200, .3); const g = this.gain(this.sfx, 0); this.env(g, at + .01, .001, .5 * (o.v || 1), .09); const os = this.osc('square', 180, at + .01, .1, g); os.frequency.exponentialRampToValueAtTime(60, at + .08); },
  sfx_heart(at) { [0, .22].forEach((d, i) => { const g = this.gain(this.sfx, 0); this.env(g, at + d, .004, i ? .35 : .5, .22); const os = this.osc('sine', 80, at + d, .3, g); os.frequency.exponentialRampToValueAtTime(40, at + d + .2); }); },
  sfx_type(at, o) { const n = o.n || 8; for (let i = 0; i < n; i++) this.tick(at + i * (o.gap || .055) + Math.random() * .015, 1800 + Math.random() * 1600, .06); },
  sfx_buzz(at) { [0, .16].forEach(d => { const g = this.gain(this.sfx, 0); this.env(g, at + d, .005, .12, .12); const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(g); this.osc('square', 150, at + d, .14, lp); }); },
  sfx_combo(at) { [0, 4, 7, 12, 16].forEach((st, i) => { const g = this.gain(this.sfx, 0); this.env(g, at + i * .06, .003, .12, .9); g.connect(this.send); this.osc('triangle', 523.25 * Math.pow(2, st / 12), at + i * .06, 1, g); }); },
  sfx_stab(at, o) { const ch = PROG[(o.i || 0) % 4]; ch.forEach(m => { const g = this.gain(this.sfx, 0); this.env(g, at, .004, .07, .35); const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.connect(g); g.connect(this.send); this.osc('sawtooth', mtof(m + 12), at, .4, lp); }); },
  sfx_shimmer(at, o) { const d = o.dur || 1.2; [2093, 2637, 3136].forEach((f, i) => { const g = this.gain(this.sfx, 0); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.04, at + d * .3); g.gain.linearRampToValueAtTime(0, at + d); g.connect(this.send); this.osc('sine', f, at + i * .03, d, g); }); },
  sfx_glitch(at) { for (let i = 0; i < 4; i++) { const g = this.gain(this.sfx, 0); this.env(g, at + i * .03, .001, .12, .02); const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000 + i * 1500; hp.connect(g); this.noise(at + i * .03, .03, hp); } },
  sfx_hit(at, o) { this.kick(at, 1); this.sfx_impact(at, { size: o.size == null ? .7 : o.size }); }
};
