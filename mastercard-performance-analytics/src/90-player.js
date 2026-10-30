/* ============================================================================
   8. PLAYER — render, transições, loop, controles
   ========================================================================== */
const PLAYER = (() => {
  const cv = document.getElementById('c'), ctx = cv.getContext('2d');
  const stage = document.getElementById('stage'), intro = document.getElementById('intro'), ui = document.getElementById('ui');
  const $ = id => document.getElementById(id);
  const bar = $('bar'), fill = bar.querySelector('.fill'), knob = bar.querySelector('.knob'), tip = bar.querySelector('.tip');
  const st = { T: 0, playing: false, startPerf: 0, startT: 0, ended: false };
  const DUR = CONFIG.duration;
  const NAMES = { hook: 'Abertura', problem: 'O problema', hub: 'Performance Analytics', insights: 'Caso 01 · Insights em escala', als: 'Caso 02 · Recomendação (ALS)',
    embed: 'Caso 03 · Embeddings', lightsoff: 'Caso 04 · Lights-off', skills: 'Possibilidades', climax: 'Clímax', close: 'Fechamento' };

  function sceneAt(T) { const S = CONFIG.scenes; for (let i = S.length - 1; i >= 0; i--) if (T >= S[i].start) return S[i]; return S[0]; }
  function drawScene(s, t, T) {
    const impl = SCENES[s.id];
    if (!impl) { bgDark(ctx, t); text(ctx, s.id, W / 2, H / 2, { size: 60, align: 'center', color: C.stone }); return; }
    impl.draw(ctx, t, T);
  }
  function themeOf(s, t) { const impl = SCENES[s.id]; return impl && impl.themeAt ? impl.themeAt(t) : s.theme; }

  function render(T) {
    T = clamp(T, 0, DUR - 1e-3);
    const s = sceneAt(T), t = T - s.start, sh = shakeAt(T);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.translate(sh.x, sh.y); ctx.translate(W / 2, H / 2); ctx.rotate(sh.r); ctx.translate(-W / 2, -H / 2);
    const tr = s.transitionIn;
    if (tr && t < tr.dur && s.index > 0) {
      const prev = CONFIG.scenes[s.index - 1]; drawScene(prev, prev.dur - 1e-3, s.start - 1e-3);
      const p = E.inOutCubic(t / tr.dur); ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H / 2, lerp(0, 1180, p), 0, TAU); ctx.clip(); drawScene(s, t, T); ctx.restore();
      ctx.beginPath(); ctx.arc(W / 2, H / 2, lerp(0, 1180, p), 0, TAU); ctx.strokeStyle = rgba(C.orange, 1 - p); ctx.lineWidth = 10; ctx.stroke();
    } else drawScene(s, t, T);
    ctx.restore();
    chips(ctx, T, themeOf(s, t));
    if (CONFIG.captions) { const cap = VOICE.caption(T); if (cap) {
      ctx.save(); ctx.font = font(34, 600); const lines = wrap(cap, 1400), lh = 46, h = lines.length * lh + 30, w = Math.min(1500, Math.max(...lines.map(l => ctx.measureText(l).width)) + 60);
      rr(ctx, W / 2 - w / 2, H - 70 - h, w, h, 18); ctx.fillStyle = 'rgba(10,10,10,.72)'; ctx.fill();
      lines.forEach((l, i) => text(ctx, l, W / 2, H - 70 - h + 15 + lh / 2 + i * lh, { size: 34, weight: 600, color: '#FFF', align: 'center' })); ctx.restore(); } }
    grain(ctx, T);
  }
  function wrap(str, maxW) {
    const words = str.split(' '), out = []; let cur = '';
    words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (ctx.measureText(tst).width > maxW && cur) { out.push(cur); cur = w; } else cur = tst; });
    if (cur) out.push(cur); return out;
  }

  // ---------- transporte ----------
  function now() { return st.playing ? st.startT + (performance.now() - st.startPerf) / 1000 : st.T; }
  function play() {
    if (st.T >= DUR - .05) st.T = 0;
    st.playing = true; st.ended = false; st.startT = st.T; st.startPerf = performance.now();
    if (CONFIG.audio.music || CONFIG.audio.sfx) AUDIO.start(st.T); else AUDIO.init();
    VOICE.reset(st.T); intro.classList.add('hidden'); syncUI(); poke();
  }
  function pause() { st.T = now(); st.playing = false; AUDIO.stop(); VOICE.pause(); syncUI(); poke(); }
  function seek(T) { const was = st.playing; if (was) pause(); st.T = clamp(T, 0, DUR); if (was) play(); else { VOICE.reset(st.T); render(st.T); syncUI(); } }
  function toggle() { st.playing ? pause() : play(); }

  function loop() {
    if (st.playing) { st.T = now(); if (st.T >= DUR) { st.T = DUR; pause(); st.ended = true; } VOICE.update(st.T, st.playing); }
    render(st.T); syncProgress(); requestAnimationFrame(loop);
  }

  // ---------- UI ----------
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function syncProgress() { const p = st.T / DUR * 100; fill.style.width = p + '%'; knob.style.left = p + '%'; $('time').textContent = `${fmt(st.T)} / ${fmt(DUR)}`; }
  function syncUI() {
    $('bPlay').textContent = st.playing ? '❚❚' : (st.ended ? '↻' : '▶');
    $('bSound').classList.toggle('off', !(CONFIG.audio.music || CONFIG.audio.sfx));
    $('bVoice').classList.toggle('off', !CONFIG.audio.voice); $('bCC').classList.toggle('off', !CONFIG.captions);
  }
  CONFIG.scenes.forEach(s => { if (!s.start) return; const k = document.createElement('div'); k.className = 'tick'; k.style.left = (s.start / DUR * 100) + '%'; bar.appendChild(k); });
  const tAt = e => { const r = bar.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width) * DUR; };
  let drag = false;
  bar.addEventListener('pointerdown', e => { drag = true; bar.setPointerCapture(e.pointerId); seek(tAt(e)); });
  bar.addEventListener('pointermove', e => { const T = tAt(e); tip.textContent = `${fmt(T)} · ${NAMES[sceneAt(T).id]}`; tip.style.left = (T / DUR * 100) + '%'; if (drag) { st.T = T; if (!st.playing) render(T); } });
  bar.addEventListener('pointerup', e => { if (drag) { drag = false; seek(tAt(e)); } });
  $('bPlay').onclick = toggle; $('bRestart').onclick = () => { seek(0); if (!st.playing) play(); };
  $('bSound').onclick = () => { const on = !(CONFIG.audio.music || CONFIG.audio.sfx); CONFIG.audio.music = CONFIG.audio.sfx = on; AUDIO.applyToggles(); if (on && st.playing && !AUDIO.playing) AUDIO.start(st.T); syncUI(); };
  $('bVoice').onclick = () => { CONFIG.audio.voice = !CONFIG.audio.voice; if (!CONFIG.audio.voice) VOICE.pause(); syncUI(); };
  $('bCC').onclick = () => { CONFIG.captions = !CONFIG.captions; syncUI(); };
  $('bFull').onclick = () => { const el = document.documentElement; document.fullscreenElement ? document.exitFullscreen() : (el.requestFullscreen && el.requestFullscreen()); };
  intro.onclick = () => play();
  window.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); intro.classList.contains('hidden') ? toggle() : play(); }
    else if (e.key === 'r' || e.key === 'R') { seek(0); if (!st.playing) play(); }
    else if (e.key === 'ArrowRight') seek(now() + 5); else if (e.key === 'ArrowLeft') seek(now() - 5);
    else if (e.key === 'f' || e.key === 'F') $('bFull').onclick();
    else if (e.key === 'm' || e.key === 'M') $('bSound').onclick();
    else if (e.key === 'v' || e.key === 'V') $('bVoice').onclick();
    else if (e.key === 'c' || e.key === 'C') $('bCC').onclick();
  });
  let idleT = 0; function poke() { ui.classList.remove('idle'); document.body.style.cursor = ''; clearTimeout(idleT);
    idleT = setTimeout(() => { if (st.playing) { ui.classList.add('idle'); document.body.style.cursor = 'none'; } }, 2600); }
  window.addEventListener('pointermove', poke);
  function fit() { const s = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `scale(${s})`; }
  window.addEventListener('resize', fit); fit();

  VOICE.init(v => { $('voiceinfo').textContent = v ? `Voz: ${v.name}` : (VOICE.supported ? 'Voz: padrão do sistema' : 'Voz indisponível'); });
  st.T = 39.5; render(st.T); st.T = 0; // pôster atrás do overlay inicial
  syncUI(); requestAnimationFrame(() => { requestAnimationFrame(loop); });

  // ganchos para testes/exportação
  window.__render = T => render(T); window.__seek = seek; window.__state = st;
  return { play, pause, seek, render };
})();
