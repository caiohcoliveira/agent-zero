/* ============================================================================
   9. PLAYER — modo apresentação
   ----------------------------------------------------------------------------
   • Plays: trechos de vídeo lineares (render puro em função de T).
   • Paradas: loop infinito enquanto as apresentadoras falam; → / PageDown /
     espaço / clique avançam os itens (cartazes) e, no último, embarcam no
     próximo trecho. ← / PageUp voltam. Durante o vídeo, as setas não pulam nada.
   • Operador: P pausa · 1–7 vão para a estação · Home volta ao pré-show ·
     End vai ao encerramento · barra de progresso navega.
   ========================================================================== */
const PLAYER = (() => {
  const cv = document.getElementById('c'), ctx = cv.getContext('2d');
  const stage = document.getElementById('stage'), intro = document.getElementById('intro'), ui = document.getElementById('ui');
  const $ = id => document.getElementById(id);
  const bar = $('bar'), fill = bar.querySelector('.fill'), knob = bar.querySelector('.knob'), tip = bar.querySelector('.tip');
  const DUR = CONFIG.duration, SHOW = CONFIG.mode !== 'reel', STOPS = CONFIG.stops, ITEM_DUR = 1.1;
  const st = { T: 0, playing: false, startPerf: 0, startT: 0, ended: false,
    mode: SHOW ? 'stop' : 'play', stop: 0, item: 0, prevItem: 0, itemAt: performance.now(), stopAt: performance.now(), next: null };
  // estado interativo das paradas: seleção (zoom), popup de slide e alvo sob o ponteiro
  const UI = { sel: null, prevSel: null, selAt: 0, selP: 1, pop: null, prevPop: null, popAt: 0, popP: 1, hover: null };
  const resetUI = () => Object.assign(UI, { sel: null, prevSel: null, selAt: 0, selP: 1, pop: null, prevPop: null, popAt: 0, popP: 1, hover: null });
  const CTL = {
    select(v) { if (v === UI.sel) return; UI.prevSel = UI.sel; UI.sel = v; UI.selAt = performance.now(); poke(); },
    popup(v) { if (v === UI.pop) return; UI.prevPop = UI.pop; UI.pop = v; UI.popAt = performance.now(); poke(); },
    next: () => next(), depart: () => depart(), setItem: k => setItem(k)
  };
  const NAME = s => s.station ? `${TX.stations[s.station - 1].n} · ${TX.stations[s.station - 1].short}` : ({ open: 'Abertura', climax: 'Clímax', close: 'Letreiro final' })[s.id] || s.id;
  const STOP_NAME = { preshow: 'Pré-show', stop0: 'Parada 0 · roteiro', stop1: 'Parada 1 · retomada', stop2: 'Parada 2 · retomada', end: 'Encerramento' };

  // ---------- render ----------
  function drawScene(s, t, T) {
    const impl = SCENES[s.id];
    if (!impl) { bgDark(ctx, t); text(ctx, NAME(s), W / 2, H / 2, { size: 64, align: 'center', color: C.stone }); return; }
    impl.draw(ctx, t, T);
  }
  function themeOf(s, t) { const impl = SCENES[s.id]; return impl && impl.themeAt ? impl.themeAt(t) : s.theme; }
  /** desenha o quadro do trecho no instante T, sem sobreposições (as paradas usam para emendar) */
  function frameAt(c, T) { const s = sceneAt(T), keep = [BT, NOW]; BT = BEAT.at(T); NOW = T; (SCENES[s.id] || { draw: () => bgDark(c, 0) }).draw(c, T - s.start, T); [BT, NOW] = keep; }
  /** slide "montado" para as paradas: o quadro do trecho sem batida, com a legenda daquele momento */
  function slideAt(c, T) { const s = sceneAt(T), keep = [BT, NOW]; BT = { ...BEAT.quiet, level: .3, low: .3 }; NOW = T; c.save(); (SCENES[s.id] || { draw: () => bgDark(c, 0) }).draw(c, T - s.start, T); c.restore(); PAINT.post(c); captionStrip(c, s, T - s.start); [BT, NOW] = keep; }

  function renderPlay(T) {
    T = clamp(T, 0, DUR - 1e-3); BT = BEAT.at(T); NOW = T;
    const s = sceneAt(T), t = T - s.start, sh = shakeAt(T), fx = typeof FX !== 'undefined';
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.translate(sh.x, sh.y); ctx.translate(W / 2, H / 2); ctx.rotate(sh.r);
    if (fx) FX.camera(ctx, T, s);
    ctx.translate(-W / 2, -H / 2);
    drawScene(s, t, T);
    ctx.restore();
    if (fx) FX.post(ctx, T, s);
    PAINT.post(ctx);
    if (typeof overlayPlay === 'function') overlayPlay(ctx, T, s, themeOf(s, t));
    if (CONFIG.captions) caption(VOICE.caption(T));
    grain(ctx, T);
  }
  function renderStop(id, tl, item, prevItem, p) {
    BT = BEAT.idle(tl); NOW = tl;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const impl = STOPSCN[id], now = performance.now();
    UI.selP = clamp((now - UI.selAt) / 1000 / .9); UI.popP = clamp((now - UI.popAt) / 1000 / .35);
    if (impl) impl.draw(ctx, tl, item, prevItem, p, UI);
    if (!(impl && impl.noPaint)) PAINT.post(ctx);
    else { bgDark(ctx, tl); text(ctx, `${STOP_NAME[id]} · item ${item + 1}`, W / 2, H / 2, { size: 56, align: 'center', color: C.stone }); }
    grain(ctx, tl * 30);
  }
  function render() {
    if (st.mode === 'stop') {
      const now = performance.now();
      renderStop(STOPS[st.stop].id, (now - st.stopAt) / 1000, st.item, st.prevItem, clamp((now - st.itemAt) / 1000 / ITEM_DUR));
    } else renderPlay(st.T);
  }
  function caption(cap) {
    if (!cap) return;
    ctx.save(); ctx.font = font(34, 600); const lines = wrap(cap, 1400), lh = 46, h = lines.length * lh + 30, w = Math.min(1500, Math.max(...lines.map(l => ctx.measureText(l).width)) + 60);
    rr(ctx, W / 2 - w / 2, H - 70 - h, w, h, 18); ctx.fillStyle = 'rgba(10,10,10,.72)'; ctx.fill();
    lines.forEach((l, i) => text(ctx, l, W / 2, H - 70 - h + 15 + lh / 2 + i * lh, { size: 34, weight: 600, color: '#FFF', align: 'center' })); ctx.restore();
  }
  function wrap(str, maxW) {
    const words = str.split(' '), out = []; let cur = '';
    words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (ctx.measureText(tst).width > maxW && cur) { out.push(cur); cur = w; } else cur = tst; });
    if (cur) out.push(cur); return out;
  }

  // ---------- transporte ----------
  const nextStop = T => SHOW ? STOPS.find(s => s.T > T + 1e-3) || null : null;
  function now() { return st.playing ? st.startT + (performance.now() - st.startPerf) / 1000 : st.T; }
  function play() {
    if (st.T >= DUR - .05) st.T = 0;
    st.mode = 'play'; st.playing = true; st.ended = false; st.startT = st.T; st.startPerf = performance.now(); st.next = nextStop(st.T);
    if (CONFIG.audio.music || CONFIG.audio.sfx) AUDIO.start(st.T); else AUDIO.init();
    VOICE.reset(st.T); intro.classList.add('hidden'); syncUI(); poke();
  }
  function pause() { st.T = now(); st.playing = false; AUDIO.stop(); VOICE.pause(); syncUI(); poke(); }
  function seek(T) {
    const was = st.playing && st.mode === 'play'; if (was) pause();
    st.mode = 'play'; st.T = clamp(T, 0, DUR); st.next = nextStop(st.T);
    if (was) play(); else { VOICE.reset(st.T); syncUI(); }
  }
  function toggle() { if (st.mode === 'stop') return next(); st.playing ? pause() : play(); }
  function enterStop(i) {
    if (st.playing) { st.playing = false; AUDIO.stop(); VOICE.pause(); }
    st.mode = 'stop'; st.stop = i; st.T = STOPS[i].T; st.item = st.prevItem = 0; st.itemAt = st.stopAt = performance.now(); st.next = null; resetUI();
    syncUI(); poke();
  }
  function setItem(k) { st.prevItem = st.item; st.item = k; st.itemAt = performance.now(); UI.pop = UI.prevPop = null; poke(); }
  function next() {
    if (st.mode !== 'stop') return;
    const s = STOPS[st.stop];
    if (st.item < s.items - 1) setItem(st.item + 1);
    else if (s.id !== 'end') depart();
  }
  function prev() { if (st.mode === 'stop' && st.item > 0) setItem(st.item - 1); }
  function depart() {
    st.T = STOPS[st.stop].T; play();
    if (AUDIO.ready && CONFIG.audio.sfx) { const n = AUDIO.ctx.currentTime + .03; AUDIO.play('chime', n, { f: 659.3, up: 4 }); AUDIO.play('whoosh', n + .1, { dur: .7, v: .3 }); }
  }
  function gotoStop(i) { if (st.playing) pause(); enterStop(i); }
  function jumpStation(k) { const T = CONFIG.stationStart[k]; if (T == null) return; if (st.playing) pause(); st.mode = 'play'; st.T = T; play(); }

  // qualidade adaptativa: média móvel do intervalo entre quadros; abaixo de ~30 qps desliga os efeitos caros
  let lastF = 0, ema = 16, slow = 0, fast = 0;
  function governor(now) {
    if (lastF) { const dt = Math.min(200, now - lastF); ema = ema * .9 + dt * .1; }
    lastF = now; if (QUALITY.forced != null) { QUALITY.low = QUALITY.forced; return; }
    if (ema > 33) { if (++slow > 45) { QUALITY.low = true; slow = fast = 0; } } else slow = 0;
    if (QUALITY.low && ema < 15) { if (++fast > 240) { QUALITY.low = false; fast = 0; } } else fast = 0;
  }
  function loop(ts) {
    governor(ts || performance.now());
    if (st.mode === 'play' && st.playing) {
      const T = now();
      if (st.next && T >= st.next.T) enterStop(st.next.index);
      else if (T >= DUR) { st.T = DUR; pause(); st.ended = true; }
      else st.T = T;
      if (st.mode === 'play') VOICE.update(st.T, st.playing);
    }
    render(); syncProgress(); requestAnimationFrame(loop);
  }

  // ---------- UI ----------
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function syncProgress() {
    const p = st.T / DUR * 100; fill.style.width = p + '%'; knob.style.left = p + '%';
    $('time').textContent = st.mode === 'stop' ? `${STOP_NAME[STOPS[st.stop].id]} · ${st.item + 1}/${STOPS[st.stop].items}` : `${fmt(st.T)} / ${fmt(DUR)}`;
  }
  function syncUI() {
    $('bPlay').textContent = st.mode === 'stop' ? '→' : st.playing ? '❚❚' : (st.ended ? '↻' : '▶');
    $('bSound').classList.toggle('off', !(CONFIG.audio.music || CONFIG.audio.sfx));
    $('bVoice').classList.toggle('off', !CONFIG.audio.voice); $('bCC').classList.toggle('off', !CONFIG.captions);
  }
  for (let k = 1; k <= 7; k++) { const T = CONFIG.stationStart[k]; if (T == null) continue; const m = document.createElement('div'); m.className = 'tick'; m.style.left = (T / DUR * 100) + '%'; bar.appendChild(m); }
  if (SHOW) STOPS.forEach(s => { if (!s.after) return; const m = document.createElement('div'); m.className = 'stop'; m.style.left = (s.T / DUR * 100) + '%'; m.title = STOP_NAME[s.id]; bar.appendChild(m); });
  const tAt = e => { const r = bar.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width) * DUR; };
  let drag = false;
  bar.addEventListener('pointerdown', e => { drag = true; bar.setPointerCapture(e.pointerId); seek(tAt(e)); });
  bar.addEventListener('pointermove', e => { const T = tAt(e); tip.textContent = `${fmt(T)} · ${NAME(sceneAt(T))}`; tip.style.left = (T / DUR * 100) + '%'; if (drag) { st.mode = 'play'; st.T = T; } });
  bar.addEventListener('pointerup', e => { if (drag) { drag = false; seek(tAt(e)); } });
  $('bPlay').onclick = toggle; $('bRestart').onclick = () => gotoStop(0);
  $('bSound').onclick = () => { const on = !(CONFIG.audio.music || CONFIG.audio.sfx); CONFIG.audio.music = CONFIG.audio.sfx = on; AUDIO.applyToggles(); if (on && st.playing && !AUDIO.playing) AUDIO.start(st.T); syncUI(); };
  $('bVoice').onclick = () => { CONFIG.audio.voice = !CONFIG.audio.voice; if (!CONFIG.audio.voice) VOICE.pause(); syncUI(); };
  $('bCC').onclick = () => { CONFIG.captions = !CONFIG.captions; syncUI(); };
  $('bFull').onclick = () => { const el = document.documentElement; document.fullscreenElement ? document.exitFullscreen() : (el.requestFullscreen && el.requestFullscreen()); };
  intro.onclick = () => play();
  // clique e ponteiro nas paradas: a cena da parada decide o alvo (hit) e a ação (click); sem alvo, o clique segue viagem
  const stagePt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  const stopImpl = () => st.mode === 'stop' ? STOPSCN[STOPS[st.stop].id] : null;
  cv.addEventListener('click', e => {
    if (st.mode !== 'stop') return; const impl = stopImpl();
    if (impl && impl.hit) { const [x, y] = stagePt(e), tg = impl.hit(x, y, UI); if (impl.click(tg, UI, CTL)) return; }
    next();
  });
  cv.addEventListener('pointermove', e => {
    const impl = stopImpl(); if (!impl || !impl.hit) { if (UI.hover != null) UI.hover = null; cv.style.cursor = ''; return; }
    const [x, y] = stagePt(e), h = UI.hover = impl.hit(x, y, UI);
    cv.style.cursor = h == null || h.back || h.pop === 'inside' ? '' : 'pointer';
  });
  window.addEventListener('keydown', e => {
    const k = e.key, impl = stopImpl();
    if (impl && impl.key && impl.key(k, UI, CTL)) { e.preventDefault(); return; }
    if (k === 'ArrowRight' || k === 'PageDown' || k === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      if (st.mode === 'stop') next(); else if (e.code === 'Space' || k === 'Enter') { if (!intro.classList.contains('hidden')) play(); else toggle(); }
    }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === 'p' || k === 'P') { if (st.mode === 'play') toggle(); }
    else if (/^[1-7]$/.test(k)) jumpStation(+k);
    else if (k === 'Home' || k === 'r' || k === 'R') gotoStop(0);
    else if (k === 'End') gotoStop(STOPS.length - 1);
    else if (k === 'f' || k === 'F') $('bFull').onclick();
    else if (k === 'm' || k === 'M') $('bSound').onclick();
    else if (k === 'v' || k === 'V') $('bVoice').onclick();
    else if (k === 'c' || k === 'C') $('bCC').onclick();
    else if (k === 'q' || k === 'Q') { QUALITY.forced = QUALITY.forced == null ? !QUALITY.low : QUALITY.forced ? false : null; $('voiceinfo').textContent = QUALITY.forced == null ? 'Qualidade: automática' : QUALITY.forced ? 'Qualidade: leve' : 'Qualidade: máxima'; }
  });
  let idleT = 0; function poke() { ui.classList.remove('idle'); document.body.style.cursor = ''; clearTimeout(idleT);
    idleT = setTimeout(() => { if (st.playing || st.mode === 'stop') { ui.classList.add('idle'); document.body.style.cursor = 'none'; } }, 2600); }
  window.addEventListener('pointermove', poke);
  function fit() { const s = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `scale(${s})`; }
  window.addEventListener('resize', fit); fit();

  VOICE.init(v => { $('voiceinfo').textContent = v ? `Voz: ${v.name}` : (VOICE.supported ? 'Voz: padrão do sistema' : 'Voz indisponível'); });
  if (SHOW) intro.classList.add('hidden'); else { st.T = 40; renderPlay(st.T); st.T = 0; }
  syncUI(); poke(); requestAnimationFrame(() => { requestAnimationFrame(loop); });

  // ganchos para testes e exportação
  window.__render = T => renderPlay(T);
  window.__renderStop = (id, tl, item = 0, prevItem = item, p = 1, ui) => { const keep = { ...UI }; if (ui) Object.assign(UI, { selAt: -1e9, popAt: -1e9 }, ui); renderStop(id, tl, item, prevItem, p); Object.assign(UI, keep); };
  window.__ui = UI; window.__ctl = CTL;
  window.__seek = seek; window.__state = st; window.__next = next; window.__prev = prev; window.__gotoStop = gotoStop; window.__jump = jumpStation;
  return { play, pause, seek, frameAt, slideAt, next, prev };
})();
