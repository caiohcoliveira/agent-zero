/* ============================================================================
   10. UI DA LINHA — letreiro split-flap, mapa do metrô, mini-mapa, plataforma
   e cartazes das paradas, régua e comprovante dos cases, sobreposição dos trechos
   ========================================================================== */

/* ---------- grade musical da cena ---------- */
const GRIDS = {};
/** tempos LOCAIS (s) das batidas e compassos da cena, tirados da faixa do play (ou de 120 BPM na abertura) */
function grid(id) {
  if (GRIDS[id]) return GRIDS[id];
  const s = CONFIG.sceneById[id], p = CONFIG.playById[s.play];
  if (!p.track) { const per = 60 / CONFIG.bpm, n = Math.ceil(s.dur / per); return GRIDS[id] = { beats: Array.from({ length: n }, (_, i) => i * per), bars: Array.from({ length: Math.ceil(n / 4) }, (_, i) => i * per * 4) }; }
  const d = BEATS[p.track], off = p.from + (s.start - p.start), loc = arr => arr.map(x => +(x - off).toFixed(3)).filter(x => x >= -1e-3 && x < s.dur);
  return GRIDS[id] = { beats: loc(d.beats), bars: loc(d.down) };
}

/* ---------- split-flap ---------- */
const FLAP = {
  CH: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  /** estado da placa i no instante t: frases (já com o mesmo comprimento) trocam nos tempos `times` */
  state(i, t, phrases, times, step = .055) {
    let k = -1; times.forEach((t0, j) => { if (t >= t0) k = j; });
    if (k < 0) return { cur: ' ', nxt: ' ', q: 0, k };
    const target = phrases[k][i] || ' ', prev = k <= 0 ? ' ' : (phrases[k - 1][i] || ' ');
    const start = times[k] + i * .03, dur = prev === target ? 0 : .25 + hash(i * 7 + k) * .4;
    if (t < start) return { cur: prev, nxt: prev, q: 0, k: k - 1 };
    if (t >= start + dur) return { cur: target, nxt: target, q: 0, k };
    const f = (t - start) / step, n = Math.floor(f), last = Math.floor(dur / step);
    const rc = m => (m <= 0 ? prev : m >= last ? target : FLAP.CH[Math.floor(hash(i * 31 + k * 7 + m) * FLAP.CH.length)]);
    return { cur: rc(n), nxt: rc(n + 1), q: f - n, k };
  },
  tile(ctx, x, y, w, h, st, hi, glowA = 0) {
    const mid = y + h / 2, col = hi ? C.orange : '#F6EDDD', fnt = font(h * .66, 900);
    paper(ctx, x, y, w, h, { r: Math.max(3, h * .07), fill: '#1F1A15', outline: '#000', shadow: Math.max(2, h * .045), shadowColor: '#000', lw: Math.max(1.5, h * .018) });
    if (glowA > 0 && hi) glow(ctx, x + w / 2, mid, w * 1.2, C.orange, .35 * glowA);
    const ch = (c, top) => { ctx.save(); ctx.beginPath(); ctx.rect(x, top ? y : mid, w, h / 2); ctx.clip(); ctx.font = fnt; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(c, x + w / 2, mid + h * .03); ctx.restore(); };
    ch(st.nxt, true); ch(st.cur, false);
    if (st.q > 0 && st.cur !== st.nxt) {
      ctx.save(); ctx.translate(0, mid);
      if (st.q < .5) { ctx.scale(1, 1 - st.q * 2); ctx.translate(0, -mid); ctx.fillStyle = '#26201A'; ctx.fillRect(x + 2, y + 2, w - 4, h / 2 - 2); ch(st.cur, true); }
      else { ctx.scale(1, (st.q - .5) * 2); ctx.translate(0, -mid); ctx.fillStyle = '#26201A'; ctx.fillRect(x + 2, mid, w - 4, h / 2 - 2); ch(st.nxt, false); }
      ctx.restore();
    }
    line(ctx, x + 2, mid, x + w - 2, mid, 'rgba(0,0,0,.85)', Math.max(1.5, h * .025));
  },
  /** letreiro inteiro: frases trocando nos tempos `times`, a partir da placa `hiFrom[k]` em laranja */
  board(ctx, cx, cy, phrases, times, t, o = {}) {
    const len = Math.max(...phrases.map(s => s.length)), ph = phrases.map(s => s.padEnd(len, ' '));
    const tw = o.tw || 60, th = o.th || tw * 1.45, gap = o.gap == null ? tw * .1 : o.gap, bw = len * (tw + gap) - gap, bx = cx - bw / 2, pad = tw * .4;
    paper(ctx, bx - pad, cy - th / 2 - pad - (o.header ? th * .45 : 0), bw + pad * 2, th + pad * 2 + (o.header ? th * .45 : 0), { r: tw * .25, fill: '#14110E', outline: '#000', shadow: tw * .15, shadowColor: '#000', lw: 3 });
    if (o.header) { ctx.save(); ctx.translate(bx + o.header.length * th * .11 + 10, cy - th / 2 - th * .3); ctx.rotate(-.015);
      const hw = measure(ctx, o.header, th * .2, 800, true, 3) + th * .4; paper(ctx, -hw / 2, -th * .16, hw, th * .32, { r: 4, fill: o.headerCol || C.red, shadow: 3, shadowColor: '#000', lw: 2 });
      text(ctx, o.header, 0, 1, { size: th * .2, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 3 }); ctx.restore(); }
    for (let i = 0; i < len; i++) { const s = FLAP.state(i, t, ph, times), k = Math.max(0, s.k); FLAP.tile(ctx, bx + i * (tw + gap), cy - th / 2, tw, th, s, o.hiFrom ? i >= o.hiFrom[k] && s.cur !== ' ' : false, o.glowA || 0); }
    return { x: bx - pad, y: cy - th / 2 - pad, w: bw + pad * 2, h: th + pad * 2 };
  }
};

/* ---------- mapa do metrô ---------- */
/** quebra um rótulo em duas linhas no espaço mais perto do meio */
function twoLines(s) { const sp = [...s].map((c, i) => c === ' ' ? i : -1).filter(i => i > 0); if (!sp.length) return s; const m = sp.reduce((a, b) => Math.abs(b - s.length / 2) < Math.abs(a - s.length / 2) ? b : a); return s.slice(0, m) + '\n' + s.slice(m + 1); }
// nós: partida, 01, 02, 03, parada 1, 04, 05, 06, parada 2, 07, e a linha seguindo para o futuro
const MAP = (() => {
  const nodes = [
    { k: 'start', x: 170, y: 300 }, { k: 1, x: 430, y: 300 }, { k: 2, x: 700, y: 300 }, { k: 3, x: 970, y: 300 }, { k: 'p1', x: 1290, y: 300 },
    { k: 4, x: 1290, y: 600 }, { k: 5, x: 1000, y: 600 }, { k: 6, x: 710, y: 600 }, { k: 'p2', x: 420, y: 600 },
    { k: 7, x: 560, y: 880 }, { k: 'end', x: 980, y: 880 }
  ];
  // caminho: retas entre nós + curvas nas viradas
  const path = [[170, 300], [1290, 300], [1560, 300], [1660, 380], [1660, 520], [1560, 600], [420, 600], [260, 600], [180, 680], [180, 800], [260, 880], [980, 880]];
  const seg = []; let L = 0;
  for (let i = 1; i < path.length; i++) { const [x0, y0] = path[i - 1], [x1, y1] = path[i], l = Math.hypot(x1 - x0, y1 - y0); seg.push({ x0, y0, x1, y1, l, a: L }); L += l; }
  const at = u => { const d = clamp(u) * L; for (const s of seg) if (d <= s.a + s.l) { const f = (d - s.a) / s.l; return [lerp(s.x0, s.x1, f), lerp(s.y0, s.y1, f)]; } const s = seg[seg.length - 1]; return [s.x1, s.y1]; };
  const uOf = (x, y) => { let best = 0, bd = 1e9; for (const s of seg) for (let f = 0; f <= 1; f += .02) { const px = lerp(s.x0, s.x1, f), py = lerp(s.y0, s.y1, f), d = Math.hypot(px - x, py - y); if (d < bd) { bd = d; best = (s.a + f * s.l) / L; } } return best; };
  nodes.forEach(n => { n.u = uOf(n.x, n.y); });
  const colAt = u => u < nodes[4].u ? C.red : u < nodes[8].u ? C.orange : C.yellow;
  return { nodes, path, L, at, colAt, node: k => nodes.find(n => n.k === k) };
})();

/** mapa completo: reveal = quanto da linha já foi traçada (0–1) · hi = nó em destaque · train = posição do trem (0–1) */
function metroMap(ctx, t, o = {}) {
  const rev = o.reveal == null ? 1 : o.reveal, hi = o.hi, A = o.alpha == null ? 1 : o.alpha; if (A <= 0) return;
  ctx.save(); ctx.globalAlpha *= A;
  // linha: contorno de tinta + cor do trecho, desenhada até `rev`
  const drawLine = (lw, colFn) => {
    const steps = 220; let prev = MAP.at(0);
    for (let s = 1; s <= steps; s++) { const u = s / steps; if (u > rev + 1e-6) break; const p = MAP.at(u);
      ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.strokeStyle = colFn(u); ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke(); prev = p; }
  };
  ctx.save(); ctx.translate(6, 8); drawLine(38, () => 'rgba(0,0,0,.55)'); ctx.restore();
  drawLine(38, () => INK); drawLine(24, u => MAP.colAt(u));
  // trecho final pontilhado rumo ao futuro
  if (rev >= .999 && o.future !== false) { ctx.save(); ctx.setLineDash([16, 18]); ctx.lineDashOffset = -t * 40; line(ctx, 1010, 880, 1760, 880, rgba(C.yellow, .8), 10); ctx.restore();
    text(ctx, 'FUTURO →', 1700, 840, { size: 22, weight: 800, mono: true, color: C.yellow, align: 'right', ls: 3, alpha: .9 }); }
  // estações e baldeações
  MAP.nodes.forEach(n => {
    if (n.k === 'start' || n.k === 'end') return;
    const show = E.outBack(clamp((rev - n.u) * 14 + .3)); if (show <= 0) return;
    const isHi = hi === n.k, pulse = isHi ? 1 + .08 * Math.sin(t * 5) : 1;
    ctx.save(); ctx.translate(n.x, n.y); ctx.scale(show * pulse, show * pulse);
    if (typeof n.k === 'string') intersection(ctx, 0, 0, 30, 36, { hot: isHi ? .6 : 0 });
    else { circle(ctx, 4, 5, 26, 'rgba(0,0,0,.6)'); circle(ctx, 0, 0, 26, isHi ? C.yellow : '#FFF8EE'); inkCircle(ctx, 0, 0, 26, 6, n.k);
      text(ctx, TX.stations[n.k - 1].n, 0, 1, { size: 20, weight: 900, color: INK, align: 'center' }); }
    ctx.restore();
    if (isHi) glow(ctx, n.x, n.y, 120, C.orange, .45);
    // rótulo
    const la = clamp((rev - n.u) * 10); if (la <= 0) return;
    const above = n.y < 450 ? -1 : 1, ly = n.y + above * (typeof n.k === 'string' ? 56 : 74);
    if (typeof n.k === 'string') text(ctx, TX.stop.label, n.x, ly, { size: 22, weight: 800, mono: true, color: C.yellow, align: 'center', ls: 3, alpha: la });
    else { const st = TX.stations[n.k - 1]; text(ctx, twoLines(st.short), n.x, ly, { size: isHi ? 26 : 22, weight: 900, color: isHi ? '#FFF' : '#EBDFCF', align: 'center', ls: .5, alpha: la, lh: 1.05 }); }
  });
  // trem (ponto laranja com brilho)
  if (o.train != null) { const [x, y] = MAP.at(o.train); glow(ctx, x, y, 90, C.orange, .6); circle(ctx, x, y, 16, C.orange); inkCircle(ctx, x, y, 16, 4, 77); circle(ctx, x - 5, y - 5, 4, '#FFE0C0'); }
  ctx.restore();
}

/** mini-mapa no canto durante os trechos: 7 estações + 2 baldeações, trem andando */
function miniMap(ctx, T, a = 1) {
  if (a <= 0) return;
  const seq = [1, 2, 3, 'p1', 4, 5, 6, 'p2', 7], x0 = 64, x1 = 520, y = 62, dx = (x1 - x0) / (seq.length - 1);
  const k = stationAt(T), s = sceneAt(T);
  // posição do trem: índice da estação atual + progresso na estação
  const order = seq.indexOf(k), ks = CONFIG.stationStart[k] || 0, ke = k < 7 ? (CONFIG.stationStart[k + 1] || CONFIG.duration) : CONFIG.duration;
  const prog = clamp((T - ks) / (ke - ks)), pos = order < 0 ? 0 : order + prog * (k === 3 || k === 6 ? 1 : (k === 7 ? .9 : 1));
  ctx.save(); ctx.globalAlpha *= a;
  rr(ctx, x0 - 34, y - 30, x1 - x0 + 68, 60, 30); ctx.fillStyle = 'rgba(14,11,9,.62)'; ctx.fill();
  for (let i = 0; i < seq.length - 1; i++) line(ctx, x0 + i * dx, y, x0 + (i + 1) * dx, y, i < 3 ? C.red : i < 7 ? C.orange : C.yellow, 8);
  seq.forEach((n, i) => { const x = x0 + i * dx;
    if (typeof n === 'string') { circle(ctx, x - 5, y, 9, C.red, INK, 2); circle(ctx, x + 5, y, 9, C.yellow, INK, 2); }
    else { const cur = n === k; circle(ctx, x, y, cur ? 13 : 9, cur ? C.yellow : '#FFF8EE', INK, 2.5); if (cur) text(ctx, TX.stations[n - 1].n, x, y + 1, { size: 12, weight: 900, color: INK, align: 'center' }); } });
  const tx = x0 + pos * dx; glow(ctx, tx, y, 40, C.orange, .55 + .3 * BT.beat); circle(ctx, tx, y, 7 + 2 * BT.beat, C.orange, '#FFF', 2);
  if (k) text(ctx, TX.stations[k - 1].short, x1 + 48, y + 1, { size: 15, weight: 800, mono: true, color: '#FFF', ls: 2, alpha: .9 });
  ctx.restore();
}

/** letreiro da estação: desce no início de cada estação, vira as placas e sobe para o mini-mapa */
function stationBoard(ctx, T) {
  for (let k = 1; k <= 7; k++) {
    const Ts = CONFIG.stationStart[k]; if (Ts == null || T < Ts || T > Ts + 4) continue;
    const t = T - Ts - .35, st = TX.stations[k - 1], ph = [`${st.n} ${st.short}`]; if (t < 0) continue;
    const din = E.outBack(P(t, 0, .5)), dout = E.inCubic(P(t, 3.3, .6));
    const y = lerp(-120, 118, din) - 200 * dout, s = lerp(1, .5, dout);
    ctx.save(); ctx.globalAlpha *= 1 - dout; ctx.translate(W / 2, y); ctx.scale(s, s);
    FLAP.board(ctx, 0, 0, ph, [.15], t, { tw: 40, th: 58, hiFrom: [3], header: `ESTAÇÃO ${st.n}`, headerCol: C.red });
    const title = st.title, pa = P(t, .9, .4);
    if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; ctx.translate(0, 70 + (1 - E.outBack(pa)) * 20); ctx.rotate(-.01);
      const tw = measure(ctx, title, 26, 800) + 60; paper(ctx, -tw / 2, -22, tw, 44, { torn: true, seed: 40 + k, fill: PAPER, shadow: 5, shadowColor: '#000', lw: 2.5 });
      text(ctx, title, 0, 1, { size: 26, weight: 800, color: INK, align: 'center' }); ctx.restore(); }
    ctx.restore();
  }
}
// "plim-plom" de metrô e o tac-tac das placas a cada estação
CONFIG.scenes.forEach(s => {
  if (!s.station || CONFIG.stationStart[s.station] !== s.start) return;
  cue(s.id, 0, 'chime', { f: 987.8, up: -4 }); cue(s.id, .18, 'type', { n: 14, gap: .028 });
});

/** sobreposição dos trechos: mini-mapa (depois da abertura) + letreiro de estação */
function overlayPlay(ctx, T, s) {
  const t = T - s.start;
  if (s.play > 1) { miniMap(ctx, T, P(T, CONFIG.playById[2].start, .6) * (SCENES[s.id] && SCENES[s.id].hideMap ? .0 : 1)); nextStationLED(ctx, T); }
  captionStrip(ctx, s, t);
  stationBoard(ctx, T);
  TRAIN_PASS.draw(ctx, T);
}

/* ---------- plataforma das paradas: estação viva ----------
   Teto com luminárias e cones de luz, parede de azulejos pintados, fosso dos trilhos e a
   plataforma. Eventos em paralelo, em ciclos próprios (tudo função do tempo da parada):
   luminária que pisca, ratinho nos trilhos, goteira, pombo bicando, passageiro passando,
   farol de um trem que cruza a estação (com vento nos cartazes), relógio e painel de LED. */
const PLAT = { wall: 830, pit: 950, PY: 518 };
/** vento do trem que passa (0–1) — os cartazes balançam */
function platformWind(tl) { const c = (tl + 9) % 29; return c < 3.2 ? Math.sin(c / 3.2 * Math.PI) : 0; }
const TILES = makeCanvas(W, PLAT.wall, (g, w, h) => {
  g.fillStyle = '#1C1612'; g.fillRect(0, 0, w, h);
  const r = rng(5), tw = 96, th = 48;
  for (let row = 0; row * th < h; row++) for (let c = -1; c * tw < w + tw; c++) {
    const x = c * tw + (row % 2 ? tw / 2 : 0), y = row * th, v = r(), base = v < .06 ? '#4A3424' : v < .14 ? '#3A2E26' : v < .5 ? '#2F2620' : '#2A221D';
    const gr = g.createLinearGradient(x, y, x + tw * .4, y + th); gr.addColorStop(0, mix(base, '#FFE6C8', .1)); gr.addColorStop(1, mix(base, '#000000', .25));
    rr(g, x + 3, y + 3, tw - 6, th - 6, 7); g.fillStyle = gr; g.fill();
    g.fillStyle = 'rgba(255,240,220,.08)'; rr(g, x + 7, y + 6, tw * .5, 5, 3); g.fill();
  }
  // faixa Mastercard na parede
  [[C.red, 236], [C.orange, 252], [C.yellow, 268]].forEach(([c, y]) => { g.fillStyle = mix(c, '#000000', .35); g.fillRect(0, y, w, 16); });
  // manchas de umidade
  const r2 = rng(9); for (let k = 0; k < 14; k++) { const x = r2() * w, y = 300 + r2() * 480, rad = 40 + r2() * 120, gr = g.createRadialGradient(x, y, 4, x, y, rad); gr.addColorStop(0, 'rgba(10,6,4,.35)'); gr.addColorStop(1, 'rgba(10,6,4,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
});
function platform(ctx, tl, o = {}) {
  const br = BT.breath == null ? .5 : BT.breath, WALL = PLAT.wall, PIT = PLAT.pit;
  ctx.fillStyle = '#0E0B09'; ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.drawImage(TILES, 0, 0);
  // teto abobadado
  const cg = ctx.createLinearGradient(0, 0, 0, 120); cg.addColorStop(0, '#0B0908'); cg.addColorStop(1, '#2A211B'); ctx.fillStyle = cg; ctx.fillRect(0, 0, W, 110);
  line(ctx, 0, 110, W, 110, INK, 6);
  // luminárias: a 3ª pisca de tempos em tempos
  const LAMPS = [200, 620, 1040, 1460, 1840];
  LAMPS.forEach((x, k) => {
    let on = .85 + .15 * br; if (k === 2) { const c = tl % 11; if (c < 1.1) on = hash(Math.floor(tl * 16)) > .45 ? 1 : .08; }
    if (k === 4) { const c = (tl + 5) % 23; if (c < .6) on = hash(Math.floor(tl * 20) + 7) > .5 ? 1 : .1; }
    rr(ctx, x - 90, 78, 180, 22, 8); ctx.fillStyle = '#2E2620'; ctx.fill(); inkRect(ctx, x - 90, 78, 180, 22, 8, 3, k);
    rr(ctx, x - 80, 92, 160, 10, 5); ctx.fillStyle = mix('#3A3028', '#FFF1D6', on); ctx.fill();
    if (on > .3) { glow(ctx, x, 100, 160, '#FFD9A0', .35 * on); lightCone(ctx, x, 100, 160, 620, 860, '#FFD9A0', .5 * on); }
  });
  // placa esmaltada com o nome da parada
  if (o.sign) { const sw = measure(ctx, o.sign, 34, 900, false, 4) + 180;
    paper(ctx, W / 2 - sw / 2, 120, sw, 60, { r: 12, fill: '#F3EBDD', shadow: 7, shadowColor: '#000', lw: 4 });
    intersection(ctx, W / 2 - sw / 2 + 60, 150, 17, 21);
    text(ctx, o.sign, W / 2 + 34, 151, { size: 30, weight: 900, color: INK, align: 'center', ls: 4 }); }
  // painel de LED rolando e relógio de estação
  if (o.led !== false) { const msg = '   PRÓXIMO TREM · 2 MIN   ·   LINHA PERFORMANCE ANALYTICS   ·   MANTENHA-SE ATRÁS DA FAIXA AMARELA   ', lx = 40, lw = 330;
    rr(ctx, lx, 120, lw, 52, 8); ctx.fillStyle = '#080605'; ctx.fill(); inkRect(ctx, lx, 120, lw, 52, 8, 3, 3);
    ctx.save(); ctx.beginPath(); ctx.rect(lx + 8, 124, lw - 16, 44); ctx.clip(); ctx.font = font(22, 800, F.mono); const mw = ctx.measureText(msg).width, off = (tl * 90) % mw;
    ctx.shadowColor = C.orange; ctx.shadowBlur = 8; ctx.fillStyle = C.orange; ctx.textBaseline = 'middle'; ctx.fillText(msg + msg, lx + 8 - off, 147); ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,.4)'; for (let k = 0; k < 9; k++) ctx.fillRect(lx + 6, 124 + k * 5, lw - 12, 1.5);
    const cx = W - 52, cy = 150; circle(ctx, cx + 4, cy + 5, 44, 'rgba(0,0,0,.6)'); vball(ctx, cx, cy, 44, '#F3EBDD', { rim: false, lw: 4 });
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(ctx, cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, cx + Math.cos(a) * 39, cy + Math.sin(a) * 39, INK, 3); }
    const sec = tl % 60, mn = 37 + tl / 60; [[mn / 60 * TAU, 30, 4, INK], [((9 + mn / 60) / 12) * TAU, 20, 6, INK], [sec / 60 * TAU, 34, 2, C.red]].forEach(([a, l, w, c]) => line(ctx, cx, cy, cx + Math.sin(a) * l, cy - Math.cos(a) * l, c, w));
    circle(ctx, cx, cy, 4, C.red); }
  // rodapé, fosso dos trilhos e trilhos
  ctx.fillStyle = '#120E0C'; ctx.fillRect(0, WALL, W, PIT - WALL); line(ctx, 0, WALL, W, WALL, INK, 5);
  for (let x = -40; x < W + 40; x += 70) { ctx.fillStyle = '#2A1F18'; ctx.beginPath(); ctx.moveTo(x, 900); ctx.lineTo(x + 46, 900); ctx.lineTo(x + 56, 940); ctx.lineTo(x - 8, 940); ctx.closePath(); ctx.fill(); }
  [886, 926].forEach((y, k) => { line(ctx, 0, y, W, y, '#5A5048', 9); line(ctx, 0, y - 3, W, y - 3, rgba('#FFE2BC', .45 + .2 * br), 2); });
  // poça da goteira
  ctx.save(); ctx.globalAlpha = .55; ctx.beginPath(); ctx.ellipse(1480, 912, 90, 12, 0, 0, TAU); ctx.fillStyle = '#2A3440'; ctx.fill(); ctx.restore();
  // plataforma: faixa tátil amarela e piso com reflexo das luminárias
  ctx.fillStyle = '#17120F'; ctx.fillRect(0, PIT, W, H - PIT + 200);
  ctx.fillStyle = C.yellow; for (let x = 0; x < W; x += 60) { ctx.save(); ctx.translate(x, PIT + 12); ctx.transform(1, 0, -.5, 1, 0, 0); ctx.fillRect(0, 0, 36, 20); ctx.restore(); }
  line(ctx, 0, PIT, W, PIT, INK, 6);
  LAMPS.forEach(x => { const g = ctx.createRadialGradient(x, PIT + 80, 4, x, PIT + 80, 170); g.addColorStop(0, 'rgba(255,214,160,.16)'); g.addColorStop(1, 'rgba(255,214,160,0)'); ctx.fillStyle = g; ctx.fillRect(x - 170, PIT + 30, 340, 120); });
  // grafites que respiram nas paredes
  (o.doodles || []).forEach((d, i) => scribble(ctx, d[0], d[1], d[2], d[3], d[4] || C.orange, 300 + i, 1, { rot: d[5] || 0, alpha: .5 + .2 * Math.sin(tl * 1.3 + i), glow: true }));
  platformLife(ctx, tl, o);
}
/** os eventos da estação (desenhados por cima da parede, atrás dos cartazes só o que é de fundo) */
function platformLife(ctx, tl, o = {}) {
  const PIT = PLAT.pit;
  // goteira: a gota cai do teto e abre um anel na poça
  { const c = tl % 5.3, fall = .9; if (c < fall) { const y = lerp(112, 905, (c / fall) ** 2); ctx.fillStyle = 'rgba(170,210,240,.85)'; ctx.beginPath(); ctx.ellipse(1480, y, 4, 7, 0, 0, TAU); ctx.fill(); }
    else if (c < fall + .8) { const k = (c - fall) / .8; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = 'rgba(190,220,250,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(1480, 910, 10 + 70 * k, 2 + 8 * k, 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
  // ratinho atravessando os trilhos (com uma parada para farejar)
  { const c = (tl + 4) % 17, d = 3.6; if (c < d) { let u = c / d; const stop = u > .42 && u < .58; u = u < .42 ? u : u > .58 ? u - .16 : .42; const x = lerp(-80, W + 80, u / .84);
      PEOPLE.mouse(ctx, x, 924, .9, 1, stop ? 0 : tl * 30); } }
  // pombo na plataforma: bica, anda um pouco, bica de novo
  { const c = tl % 13, walk = c > 8 && c < 10, x = 250 + (c > 10 ? 70 : walk ? (c - 8) * 35 : 0), peck = walk ? 0 : Math.max(0, Math.sin(tl * 6)) ** 3;
    PEOPLE.pigeon(ctx, x, PIT + 105, 1, 1, peck); }
  // farol de trem cruzando a estação (luz varre a parede da esquerda para a direita)
  { const c = (tl + 9) % 29; if (c < 3.2) { const u = c / 3.2, x = lerp(-600, W + 600, u); ctx.save(); ctx.globalCompositeOperation = 'screen';
      const g = ctx.createRadialGradient(x, 560, 20, x, 560, 700); g.addColorStop(0, 'rgba(255,236,200,.35)'); g.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, PIT); ctx.restore();
      for (let k = 0; k < 14; k++) { const yy = 130 + hash(k * 7) * 760, xx = ((x + hash(k * 3) * 900) % (W + 200)) - 100; line(ctx, xx, yy, xx + 160, yy, 'rgba(255,240,220,.18)', 2); } } }
  // passageiro passando em primeiro plano (silhueta desfocada)
  { const c = (tl + 2) % 23, d = 7; if (c < d && o.people !== false) { const u = c / d, x = lerp(W + 120, -120, u); ctx.save(); ctx.globalAlpha = .9; PEOPLE.draw(ctx, x, H + 10, .95, PEOPLE.walk(tl * 13), { dir: -1, sil: true, t: tl }); ctx.restore(); } }
}
/** cartaz colado na parede: moldura de papel, fita, cabeçalho com o número da estação e conteúdo */
const POSTERS = {};  // n → (ctx, w, h, tl) desenha o conteúdo no espaço local do cartaz
function poster(ctx, x, y, w, h, n, tl, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: 60 + n, amp: 3, fill: '#F6EEDF', shadow: 14, shadowColor: '#000', lw: 4, halftone: .05, tape: [[.15, 0, -.4], [.85, 0, .35]] });
  const st = TX.stations[n - 1];
  rr(ctx, -w / 2 + 24, -h / 2 + 26, w - 48, 74, 8); ctx.fillStyle = n <= 3 ? C.red : n <= 6 ? C.orange : C.yellow; ctx.fill(); inkRect(ctx, -w / 2 + 24, -h / 2 + 26, w - 48, 74, 8, 3, n);
  retroText(ctx, st.n, -w / 2 + 54, -h / 2 + 63, { size: 46, weight: 900, color: '#FFF', depth: 3, lw: 3 });
  text(ctx, st.short, -w / 2 + 120, -h / 2 + 63, { size: Math.min(26, (w - 170) / st.short.length * 1.7), weight: 900, color: n <= 6 ? '#FFF' : INK, ls: 1 });
  ctx.save(); ctx.translate(0, 40); ctx.beginPath(); ctx.rect(-w / 2 + 20, -h / 2 + 70, w - 40, h - 120); ctx.clip();
  if (POSTERS[n]) POSTERS[n](ctx, w - 40, h - 120, tl); else text(ctx, st.title, 0, 0, { size: 28, weight: 800, color: INK, align: 'center' });
  ctx.restore(); ctx.restore();
}
/* ---------- slides montados: miniaturas e popup das paradas ----------
   Cada estação lista os momentos em que a cena está "montada" (cena, tempo local, título).
   A miniatura é renderizada sob demanda (uma por quadro) e guardada; o popup renderiza em tela cheia. */
// [cena, instante montado (miniatura), título, início do loop, fim do loop] — o popup roda a animação em loop nesse trecho
const SLIDES = {
  1: [['s01', 10.6, 'As perguntas de negócio', .8, 11.6], ['s01', 13.8, 'Negócio × Dados', 11.6, 15.8], ['s01', 24.3, 'Nossos serviços', 15.6, 24.6], ['s01', 31.2, 'O caminho do valor', 24.8, 32.2]],
  2: [['s02', 16.9, 'Faturamento da track', .6, 20.8], ['s02', 27.6, 'O marco do Brasil', 21, 28.2], ['s02', 31.8, 'Conclusão', 28.2, 32.4]],
  3: [['s03', 18.8, 'Projetos por tipo de cliente', 2.2, 21.2], ['s03', 34.8, 'ML para bancos e fintechs', 21.6, 35.4]],
  4: [['banana', 16.8, 'Banana · os dados', 8.9, 17.6], ['banana', 31.8, 'Banana · matriz esparsa e ALS', 22.2, 32.4], ['banana', 34.8, 'Banana · cosseno', 32.4, 35.4], ['banana', 52.4, 'Banana · solução e impacto', 35.6, 53.1],
    ['manga', 34.6, 'Manga · clusters e embeddings 3D', 22.2, 35.3], ['manga', 43.6, 'Manga · camada ΔP', 35.6, 44.2], ['manga', 52.6, 'Manga · impacto', 44.4, 53.1],
    ['lightsoff', 16.8, 'Fraude · o trabalho manual', 2.6, 17.4], ['lightsoff', 42, 'Fraude · automação, luz apagada e neon', 26.4, 44.2],
    ['insight', 34.8, 'Agentes · o circuito', 22.2, 35.4], ['insight', 47.6, 'Agentes · milhares de páginas', 35.6, 48.6], ['insight', 61.6, 'Agentes · impacto', 48.9, 62.1]],
  5: [['s05', 12.8, 'Do manual à IA escalável', .3, 13.2]],
  6: [['s06', 15.3, 'Pilares e entregas', .3, 15.6]],
  7: [['s07', 27.6, 'Onde queremos estar', .5, 28.6], ['climax', 11.6, 'Analytics & Advanced Analytics', 0, 11.9]]
};
const SLIDE = (() => {
  const cache = {}, queue = [], big = { key: null, cv: null }, scratch = makeCanvas(W, H, () => {});
  const key = sl => sl[0] + '@' + sl[1];
  const render = (c, sl) => { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; PLAYER.slideAt(c, CONFIG.sceneById[sl[0]].start + sl[1]); };
  return {
    thumb(sl) { const k = key(sl); if (cache[k]) return cache[k]; if (!queue.includes(k)) queue.push(k); return null; },
    /** renderiza uma miniatura pendente por quadro */
    pump() { const k = queue.shift(); if (!k) return; const i = k.lastIndexOf('@'); render(scratch.getContext('2d'), [k.slice(0, i), +k.slice(i + 1)]); cache[k] = makeCanvas(480, 270, g => g.drawImage(scratch, 0, 0, 480, 270)); },
    full(sl) { const k = key(sl); if (big.key !== k) { big.cv = big.cv || makeCanvas(W, H, () => {}); render(big.cv.getContext('2d'), sl); big.key = k; } return big.cv; },
    /** a cena rodando em loop no trecho [a, b] do slide (el = segundos desde que o popup abriu) */
    live(sl, el) { big.cv = big.cv || makeCanvas(W, H, () => {}); big.key = null; const a = sl[3] == null ? sl[1] - 6 : sl[3], b = sl[4] == null ? sl[1] + .5 : sl[4], d = Math.max(1, b - a), u = (el % (d + .6));
      const loc = Math.min(b, a + u); render(big.cv.getContext('2d'), [sl[0], loc]); return { cv: big.cv, fade: Math.min(1, u / .3, Math.max(0, (d + .6 - u) / .3)) }; }
  };
})();
/** posições das miniaturas da estação n (faixa de baixo; 2 fileiras se forem muitas) */
function slideRects(n) {
  const list = SLIDES[n] || [], k = list.length, rows = k > 5 ? 2 : 1, per = Math.ceil(k / rows), th = rows > 1 ? 128 : 160, tw = th * 16 / 9, gap = 26, lab = 34;
  const top = H - 22 - rows * (th + lab + 10);
  return { top, rects: list.map((sl, i) => { const r = Math.floor(i / per), c = i % per, cnt = Math.min(per, k - r * per), x0 = W / 2 - (cnt * tw + (cnt - 1) * gap) / 2;
    return { x: x0 + c * (tw + gap), y: top + r * (th + lab + 10), w: tw, h: th, sl, i }; }) };
}
function slideStrip(ctx, n, a, ui) {
  if (a <= 0 || !SLIDES[n]) return; const L = slideRects(n);
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, L.top - 90, 0, L.top + 10); g.addColorStop(0, 'rgba(12,9,7,0)'); g.addColorStop(1, 'rgba(12,9,7,.92)'); ctx.fillStyle = g; ctx.fillRect(0, L.top - 90, W, H - L.top + 90);
  text(ctx, `CENAS DA ESTAÇÃO ${TX.stations[n - 1].n}  ·  clique para abrir`, W / 2, L.top - 28, { size: 20, weight: 800, mono: true, color: C.yellow, align: 'center', ls: 3 });
  L.rects.forEach(r => { const th = SLIDE.thumb(r.sl), hov = ui && ui.hover && ui.hover.thumb === r.i;
    ctx.save(); if (hov) { ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.scale(1.06, 1.06); ctx.translate(-r.x - r.w / 2, -r.y - r.h / 2); }
    rr(ctx, r.x - 4, r.y - 4, r.w + 8, r.h + 8, 8); ctx.fillStyle = hov ? C.orange : '#F3EBDD'; ctx.fill();
    if (th) ctx.drawImage(th, r.x, r.y, r.w, r.h); else { ctx.fillStyle = '#2A221C'; ctx.fillRect(r.x, r.y, r.w, r.h); text(ctx, '…', r.x + r.w / 2, r.y + r.h / 2, { size: 30, weight: 900, color: '#8A8378', align: 'center' }); }
    text(ctx, r.sl[2], r.x + r.w / 2, r.y + r.h + 20, { size: 17, weight: 800, color: hov ? C.yellow : '#F3E6D6', align: 'center' });
    ctx.restore(); });
  ctx.restore();
}
const POP = { x: W / 2 - 790, y: 130, w: 1580, h: 889 };
/** popup com o slide montado: fundo escuro, título, fechar e setas */
function slidePopup(ctx, n, ui) {
  const open = ui.pop != null, idx = open ? ui.pop : ui.prevPop, a = open ? E.outCubic(ui.popP) : 1 - E.outCubic(ui.popP); if (idx == null || a <= 0 || !SLIDES[n] || !SLIDES[n][idx]) return;
  const list = SLIDES[n], sl = list[idx];
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(8,6,5,.86)'; ctx.fillRect(0, 0, W, H);
  ctx.translate(W / 2, H / 2); const s = lerp(.92, 1, a); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
  paper(ctx, POP.x - 12, POP.y - 12, POP.w + 24, POP.h + 24, { r: 14, fill: '#F3EBDD', shadow: 14, shadowColor: '#000', lw: 4 });
  const lv = SLIDE.live(sl, ui.popT || 0); ctx.fillStyle = '#0A0706'; ctx.fillRect(POP.x, POP.y, POP.w, POP.h);
  ctx.save(); ctx.globalAlpha *= lv.fade; ctx.drawImage(lv.cv, POP.x, POP.y, POP.w, POP.h); ctx.restore();
  text(ctx, '⟳ animação em loop', POP.x + POP.w - 20, POP.y + POP.h + 26, { size: 16, weight: 800, mono: true, color: '#BFB3A3', align: 'right' });
  pill(ctx, POP.x + 130, POP.y - 52, `ESTAÇÃO ${TX.stations[n - 1].n}`, { size: 20, fill: C.red, color: '#FFF', weight: 900 });
  text(ctx, sl[2], POP.x + 250, POP.y - 52, { size: 30, weight: 900, color: '#FFF' });
  if (list.length > 1) text(ctx, `${idx + 1} / ${list.length}`, POP.x + POP.w - 110, POP.y - 52, { size: 22, weight: 800, mono: true, color: '#BFB3A3', align: 'right' });
  const hv = k => ui.hover && ui.hover.pop === k;
  circle(ctx, POP.x + POP.w - 30, POP.y - 52, 30, hv('close') ? C.orange : C.red, INK, 3); text(ctx, '✕', POP.x + POP.w - 30, POP.y - 50, { size: 30, weight: 900, color: '#FFF', align: 'center' });
  if (idx > 0) { circle(ctx, 44, H / 2, 34, hv('prev') ? C.orange : 'rgba(243,235,221,.9)', INK, 3); text(ctx, '‹', 42, H / 2 - 4, { size: 52, weight: 900, color: INK, align: 'center' }); }
  if (idx < list.length - 1) { circle(ctx, W - 44, H / 2, 34, hv('next') ? C.orange : 'rgba(243,235,221,.9)', INK, 3); text(ctx, '›', W - 42, H / 2 - 4, { size: 52, weight: 900, color: INK, align: 'center' }); }
  text(ctx, 'Esc ou ✕ fecha  ·  ← → trocam de cena', W / 2, H - 26, { size: 18, weight: 700, mono: true, color: '#BFB3A3', align: 'center' });
  ctx.restore();
}
function popupHit(n, x, y, ui) {
  const list = SLIDES[n] || [];
  if (Math.hypot(x - (POP.x + POP.w - 30), y - (POP.y - 52)) < 40) return { pop: 'close' };
  if (ui.pop > 0 && Math.hypot(x - 44, y - H / 2) < 46) return { pop: 'prev' };
  if (ui.pop < list.length - 1 && Math.hypot(x - (W - 44), y - H / 2) < 46) return { pop: 'next' };
  if (x > POP.x && x < POP.x + POP.w && y > POP.y && y < POP.y + POP.h) return { pop: 'inside' };
  return { pop: 'close' };
}
function popupAct(n, tg, ui, ctl) {
  const list = SLIDES[n] || [];
  if (tg.pop === 'close') ctl.popup(null); else if (tg.pop === 'prev') ctl.popup(Math.max(0, ui.pop - 1)); else if (tg.pop === 'next') ctl.popup(Math.min(list.length - 1, ui.pop + 1));
  return true;
}
function popupKey(n, k, ui, ctl) {
  if (ui.pop == null) return false; const list = SLIDES[n] || [];
  if (k === 'Escape') ctl.popup(null);
  else if (k === 'ArrowRight' || k === 'PageDown') { if (ui.pop < list.length - 1) ctl.popup(ui.pop + 1); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { if (ui.pop > 0) ctl.popup(ui.pop - 1); }
  else return k !== 'f' && k !== 'F' && k !== 'm' && k !== 'M';
  return true;
}
/** parada de retomada: plataforma + cartazes. item 0 = visão geral; item k = zoom no cartaz k com as cenas embaixo.
 *  Clique num cartaz → zoom · clique numa miniatura → popup · clique fora → volta · → segue (cartazes e embarque) */
function recapScene(o) {
  const N = o.posters, px = i => 360 + i * 600;
  const viewOf = k => { if (!k) return { x: W / 2, y: H / 2, s: 1 }; const L = slideRects(N[k - 1]), avail = L.top - 80, s = avail / 650; return { x: px(k - 1), y: PLAT.PY - ((40 + avail / 2) - H / 2) / s, s }; };
  const curN = item => (item ? N[item - 1] : null);
  return {
    draw(ctx, tl, item, prevItem, p, ui) {
      ui = ui || { hover: null, pop: null, prevPop: null, popP: 1 };
      const e = E.inOutCubic(p), a = viewOf(Math.min(prevItem, N.length)), b = viewOf(Math.min(item, N.length));
      const vx = lerp(a.x, b.x, e), vy = lerp(a.y, b.y, e), vs = lerp(a.s, b.s, e) * (1 + .004 * Math.sin(tl * .7));
      ctx.fillStyle = '#17120F'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(vs, vs); ctx.translate(-vx, -vy);
      platform(ctx, tl, { sign: o.sign, doodles: o.doodles });
      const wind = platformWind(tl);
      N.forEach((n, i) => { const hov = !item && ui.hover && ui.hover.poster === i; poster(ctx, px(i), PLAT.PY - (hov ? 12 : 0), 500, 640, n, tl, { rot: [-.02, .012, -.01][i] + wind * .025 * Math.sin(tl * 9 + i * 2) }); if (hov) glow(ctx, px(i), PLAT.PY, 380, C.orange, .18); });
      ctx.restore();
      if (o.from != null && tl < 1.4) { ctx.save(); ctx.globalAlpha = 1 - E.inOutCubic(tl / 1.4); const z = 1 + tl * .25; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); PLAYER.frameAt(ctx, o.from - 1e-3); ctx.restore(); }
      const sa = item ? (prevItem ? 1 : e) : (prevItem ? 1 - e : 0), sn = curN(item) || curN(prevItem);
      if (sn) slideStrip(ctx, sn, sa * (item ? 1 : 1), ui);
      SLIDE.pump();
      if (!item) text(ctx, 'clique num cartaz para abrir a estação', W / 2, H - 46, { size: 22, weight: 700, mono: true, color: '#FFF', align: 'center', ls: 2, alpha: .5 + .2 * Math.sin(tl * 2.4) });
      if (item && sn) slidePopup(ctx, sn, ui);
      hint(ctx, tl, item === N.length ? TX.stop.go : '→', item);
    },
    hit(x, y, ui) {
      const item = window.__state ? __state.item : 0, n = curN(item);
      if (n && (ui.pop != null)) return popupHit(n, x, y, ui);
      if (!item) { for (let i = 0; i < N.length; i++) if (Math.abs(x - px(i)) < 250 && Math.abs(y - PLAT.PY) < 320) return { poster: i }; return null; }
      const L = slideRects(n); for (const r of L.rects) if (x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h + 30) return { thumb: r.i };
      return { back: true };
    },
    click(tg, ui, ctl) {
      const item = __state.item, n = curN(item);
      if (tg && tg.pop) return popupAct(n, tg, ui, ctl);
      if (tg && tg.poster != null) { ctl.setItem(tg.poster + 1); return true; }
      if (tg && tg.thumb != null) { ctl.popup(tg.thumb); return true; }
      if (tg && tg.back) { ctl.setItem(0); return true; }
      return true;
    },
    key(k, ui, ctl) { const item = __state.item, n = curN(item); if (n && popupKey(n, k, ui, ctl)) return true; if (k === 'Escape' && item) { ctl.setItem(0); return true; } return false; }
  };
}
/** dica discreta para quem apresenta (canto inferior direito) */
function hint(ctx, tl, label, item) {
  const a = .35 + .25 * Math.sin(tl * 2.4); text(ctx, label, W - 60, H - 46, { size: 20, weight: 700, mono: true, color: '#FFF', align: 'right', ls: 2, alpha: a });
}

/* ---------- cases: régua, comprovante ---------- */
/** régua das etapas do case (canto superior direito); step = etapa atual, p = progresso da etapa */
function caseRuler(ctx, step, p, o = {}) {
  const labels = o.labels || TX.caseSteps, x0 = o.x == null ? W - 700 : o.x, w = o.w || 600, y = o.y || 58, dx = w / (labels.length - 1), A = o.alpha == null ? 1 : o.alpha;
  if (A <= 0) return;
  ctx.save(); ctx.globalAlpha *= A;
  line(ctx, x0, y, x0 + w, y, 'rgba(255,255,255,.25)', 6); line(ctx, x0, y, x0 + dx * clamp(step + p, 0, labels.length - 1), y, C.orange, 6);
  labels.forEach((l, i) => { const x = x0 + i * dx, done = i < step, cur = i === Math.floor(step);
    circle(ctx, x, y, cur ? 15 : 11, done ? C.yellow : cur ? C.orange : '#3A322B', INK, 3);
    if (done) icon(ctx, 'check', x, y, 16, INK, 6);
    const lw = measure(ctx, l, cur ? 17 : 14, 800, true, 1) + 16; rr(ctx, x - lw / 2, y + 20, lw, 28, 6); ctx.fillStyle = cur ? C.orange : 'rgba(14,11,9,.7)'; ctx.fill();
    text(ctx, l, x, y + 35, { size: cur ? 17 : 14, weight: 800, mono: true, color: cur ? '#FFF' : '#D8CCBC', align: 'center', ls: 1 }); });
  ctx.restore();
}
/** comprovante de maquininha: linhas impressas de cima para baixo + número-manchete e carimbo ✓ */
function receipt(ctx, x, y, o) {
  const w = o.w || 400, lines = o.lines || [], lh = 30, h = 120 + lines.length * lh + (o.headline ? 150 : 0), p = clamp(o.p == null ? 1 : o.p);
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  const vis = h * p; ctx.beginPath(); ctx.rect(-w / 2 - 20, -30, w + 40, vis + 40); ctx.clip();
  // papel térmico com borda serrilhada
  const tooth = 14; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2, h);
  for (let k = 0; k <= w / tooth; k++) ctx.lineTo(w / 2 - k * tooth, h + (k % 2 ? 0 : 10)); ctx.closePath();
  ctx.save(); ctx.translate(8, 10); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fill(); ctx.restore(); ctx.fillStyle = '#FBF7EF'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
  text(ctx, o.title || 'COMPROVANTE DE IMPACTO', 0, 34, { size: 18, weight: 800, mono: true, color: INK, align: 'center', ls: 3 });
  line(ctx, -w / 2 + 20, 56, w / 2 - 20, 56, INK, 2, [6, 6]);
  lines.forEach((l, i) => { const ly = 80 + i * lh; text(ctx, l[0], -w / 2 + 24, ly, { size: 17, weight: 600, mono: true, color: '#3A332C' }); if (l[1] != null) text(ctx, l[1], w / 2 - 24, ly, { size: 17, weight: 800, mono: true, color: INK, align: 'right' }); });
  if (o.headline) { const hy = 96 + lines.length * lh; line(ctx, -w / 2 + 20, hy, w / 2 - 20, hy, INK, 2, [6, 6]);
    retroText(ctx, o.headline, 0, hy + 62, { size: o.hlSize || 64, weight: 900, color: C.orange, align: 'center', depth: 4, lw: 3 });
    if (o.hlLabel) text(ctx, o.hlLabel, 0, hy + 116, { size: 16, weight: 700, mono: true, color: '#3A332C', align: 'center' }); }
  ctx.restore();
}
