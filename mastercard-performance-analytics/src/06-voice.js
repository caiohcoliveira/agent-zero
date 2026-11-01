/* ============================================================================
   6. VOICE — narração com Web Speech API (speechSynthesis)
   ----------------------------------------------------------------------------
   • Cada frase dispara no seu cue (CONFIG.narration) → sincronia por frase.
   • Prefere voz feminina pt-BR; aplica grafia fonética aos termos em inglês.
   • Para trocar por locução gravada: desligue a voz (CONFIG.audio.voice=false)
     e use os mesmos tempos de CONFIG.narration como guia de edição.
   ========================================================================== */
const VOICE = {
  supported: 'speechSynthesis' in window, voice: null, idx: 0, active: 0, bad: new Set(), current: null,

  init(onPick) {
    if (!this.supported) { onPick && onPick(null); return; }
    const pick = () => { this.voice = this.choose(); onPick && onPick(this.voice); };
    pick(); speechSynthesis.onvoiceschanged = pick;
  },
  choose() {
    const vs = speechSynthesis.getVoices().filter(v => !this.bad.has(v.name)); if (!vs.length) return null;
    const A = CONFIG.audio, score = v => {
      let s = 0; const lang = (v.lang || '').toLowerCase().replace('_', '-'), nm = v.name;
      if (lang === 'pt-br') s += 100; else if (lang.startsWith('pt')) s += 40; else return -1;
      const pi = A.preferredVoices.findIndex(p => nm.includes(p)); if (pi >= 0) s += 50 - pi;
      if (A.avoidVoices.some(p => nm.includes(p))) s -= 80;
      if (/natural|neural|online/i.test(nm)) s += 12;
      return s;
    };
    return vs.map(v => [score(v), v]).filter(a => a[0] > 0).sort((a, b) => b[0] - a[0]).map(a => a[1])[0] || null;
  },
  spoken(str) { let s = str; CONFIG.phonetics.forEach(([re, rep]) => { s = s.replace(re, rep); }); return s; },

  /** reposiciona após seek/pause */
  reset(T) {
    if (this.supported) speechSynthesis.cancel();
    this.active = 0; AUDIO.setDuck && AUDIO.ready && AUDIO.setDuck(false);
    this.idx = CONFIG.narration.findIndex(n => n.t >= T - .05); if (this.idx < 0) this.idx = CONFIG.narration.length;
  },
  update(T, playing) {
    const N = CONFIG.narration;
    while (this.idx < N.length && N[this.idx].t <= T) {
      const n = N[this.idx++];
      if (playing && CONFIG.audio.voice && this.supported && T - n.t < .8) this.speak(n);
    }
  },
  speak(n) {
    const u = new SpeechSynthesisUtterance(this.spoken(n.text));
    u.lang = 'pt-BR'; if (this.voice) u.voice = this.voice;
    u.rate = CONFIG.audio.voiceRate * (n.rate || 1); u.pitch = CONFIG.audio.voicePitch; u.volume = 1;
    u.onstart = () => { this.active++; AUDIO.ready && AUDIO.setDuck(true); };
    const end = () => { this.active = Math.max(0, this.active - 1); if (!this.active && AUDIO.ready) AUDIO.setDuck(false); };
    u.onend = end;
    u.onerror = (e) => { end(); if (this.voice && e.error && e.error !== 'interrupted' && e.error !== 'canceled') { this.bad.add(this.voice.name); this.voice = this.choose(); } };
    speechSynthesis.speak(u);
  },
  pause() { if (this.supported) speechSynthesis.cancel(); this.active = 0; },

  /** legenda atual (texto da frase em curso) */
  caption(T) {
    const N = CONFIG.narration; let cur = null;
    for (let i = 0; i < N.length; i++) { if (N[i].t <= T) cur = N[i]; else break; }
    if (!cur) return null; const next = N[N.indexOf(cur) + 1];
    const end = Math.min(next ? next.t : Infinity, cur.t + Math.max(1.6, cur.text.length * .068));
    return T < end ? cur.text : null;
  }
};
