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

/* ---------- plataforma das paradas ---------- */
function platform(ctx, tl, o = {}) {
  ctx.fillStyle = '#17120F'; ctx.fillRect(0, 0, W, H);
  // azulejos de metrô (tijolinho) pintados à mão
  const r = rng(o.seed || 5), tw = 120, th = 58;
  for (let row = 0; row * th < 860; row++) for (let c = -1; c * tw < W + tw; c++) {
    const x = c * tw + (row % 2 ? tw / 2 : 0), y = row * th + 40, v = r();
    rr(ctx, x + 3, y + 3, tw - 6, th - 6, 6); ctx.fillStyle = v < .08 ? '#3A2A1E' : v < .16 ? '#2B2420' : '#231D19'; ctx.fill();
  }
  ctx.save(); ctx.globalAlpha = .18; ctx.drawImage(SHADE, 0, 0, W, 900); ctx.restore();
  // faixa de neon que respira
  const br = BT.breath == null ? .5 : BT.breath;
  ctx.save(); ctx.shadowColor = C.orange; ctx.shadowBlur = 30 + 20 * br; line(ctx, 60, 70, W - 60, 70, rgba('#FFB070', .75 + .25 * br), 6); ctx.restore();
  // placa esmaltada com o nome da parada
  if (o.sign) { const sw = measure(ctx, o.sign, 34, 900, false, 4) + 180;
    paper(ctx, W / 2 - sw / 2, 104, sw, 76, { r: 14, fill: '#F3EBDD', shadow: 8, shadowColor: '#000', lw: 4 });
    intersection(ctx, W / 2 - sw / 2 + 62, 142, 20, 24);
    text(ctx, o.sign, W / 2 + 34, 143, { size: 34, weight: 900, color: INK, align: 'center', ls: 4 }); }
  // chão da plataforma com a faixa amarela de segurança
  const fy = 900; ctx.fillStyle = '#0F0C0A'; ctx.fillRect(0, fy, W, H - fy);
  ctx.fillStyle = C.yellow; for (let x = 0; x < W; x += 60) { ctx.save(); ctx.translate(x, fy + 16); ctx.transform(1, 0, -.5, 1, 0, 0); ctx.fillRect(0, 0, 36, 22); ctx.restore(); }
  line(ctx, 0, fy, W, fy, INK, 6);
  // grafites que respiram nas paredes
  (o.doodles || []).forEach((d, i) => scribble(ctx, d[0], d[1], d[2], d[3], d[4] || C.orange, 300 + i, 1, { rot: d[5] || 0, alpha: .55 + .2 * Math.sin(tl * 1.3 + i), glow: true }));
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
/** parada de retomada: plataforma + 3 cartazes; item 0 = visão geral, item k = zoom no cartaz k */
function recapStop(ctx, tl, item, prevItem, p, o) {
  const views = [{ x: W / 2, y: H / 2, s: 1 }, ...o.posters.map((n, i) => ({ x: 360 + i * 600, y: 540, s: 1.52 }))];
  const e = E.inOutCubic(p), a = views[Math.min(prevItem, views.length - 1)], b = views[Math.min(item, views.length - 1)];
  const vx = lerp(a.x, b.x, e), vy = lerp(a.y, b.y, e), vs = lerp(a.s, b.s, e) * (1 + .006 * Math.sin(tl * .7));
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(vs, vs); ctx.translate(-vx, -vy);
  platform(ctx, tl, { sign: o.sign, doodles: o.doodles });
  o.posters.forEach((n, i) => poster(ctx, 360 + i * 600, 560, 500, 640, n, tl, { rot: [-.02, .012, -.01][i] }));
  ctx.restore();
  // entrada: o último quadro do trecho se dissolve na plataforma
  if (o.from != null && tl < 1.4) { ctx.save(); ctx.globalAlpha = 1 - E.inOutCubic(tl / 1.4); const z = 1 + tl * .25; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); PLAYER.frameAt(ctx, o.from - 1e-3); ctx.restore(); }
  hint(ctx, tl, item === views.length - 1 ? TX.stop.go : '→', item);
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
