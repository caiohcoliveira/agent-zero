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
  // a grade cobre a cena inteira: onde o detector parou (fim de faixa, trecho filtrado) ela segue no mesmo período
  const med = a => { const d2 = a.slice(1).map((x, i) => x - a[i]).sort((u, v) => u - v); return d2.length ? d2[d2.length >> 1] : 0; };
  const ext = (a, per) => { if (!a.length || !(per > .1)) return a; const o = a.slice();
    while (o[o.length - 1] + per < s.dur + per) o.push(+(o[o.length - 1] + per).toFixed(3));
    while (o[0] - per > -1e-3) o.unshift(+(o[0] - per).toFixed(3)); return o; };
  const B = loc(d.beats), D = loc(d.down), pb = med(B) || 60 / (d.bpm || 110);
  return GRIDS[id] = { beats: ext(B, pb), bars: ext(D, med(D) || pb * 4) };
}
/** encaixa um tempo LOCAL da cena na batida ('beat') ou no começo de compasso ('bar') mais próximo da faixa do play */
function onBeat(id, t, unit = 'beat') {
  const a = unit === 'bar' ? grid(id).bars : grid(id).beats; if (!a.length) return t;
  let b = a[0]; for (const x of a) if (Math.abs(x - t) < Math.abs(b - t)) b = x; return b;
}
/** a n-ésima batida depois da batida mais próxima de t (para entradas em sequência, uma por batida) */
function beatsFrom(id, t, n = 0) {
  const a = grid(id).beats; if (!a.length) return t + n * .5;
  let i = 0; for (let k = 0; k < a.length; k++) if (Math.abs(a[k] - t) < Math.abs(a[i] - t)) i = k;
  const per = a.length > 1 ? (a[a.length - 1] - a[0]) / (a.length - 1) : .5;
  return a[i + n] != null ? a[i + n] : a[a.length - 1] + (i + n - a.length + 1) * per;
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
  const seq = [1, 2, 3, 'p1', 4, 5, 6, 'p2', 7], x0 = W - 520, x1 = W - 98, y = 58, dx = (x1 - x0) / (seq.length - 1);   // v7: canto superior direito (o título fica à esquerda)
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
  if (k) { const lb = `${TX.stations[k - 1].n} · ${TX.stations[k - 1].short}`, lw = measure(ctx, lb, 17, 800, true, 2) + 30;
    rr(ctx, x1 + 34 - lw, y + 36, lw, 32, 16); ctx.fillStyle = 'rgba(14,11,9,.7)'; ctx.fill();
    text(ctx, lb, x1 + 34 - lw / 2, y + 53, { size: 17, weight: 800, mono: true, color: '#FFF', ls: 2, align: 'center', alpha: .92 }); }
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

/* ---------- plataforma das paradas (v7.11): estação futurista, arejada e verde ----------
   Referências: estações com cobertura de nervuras brancas e vidro (Oculus/WTC, Zaragoza-Delicias, Liège), muita luz natural,
   jardins e árvores no lugar de paredes fechadas (West Kowloon, "Train Station in the Forest" do MAD, Jönköping, Atocha).
   Camadas: céu (fundo) → nuvens → cidade clara e morros verdes atrás do vidro, com o viaduto onde um trem bala passa ao longe
   → parede de vidro com montantes brancos, jardins verticais e floreiras → cobertura de nervuras → via limpa e plataforma clara.
   Sem ratos, goteira, grafites ou luz piscando: a vida da estação é o céu, as plantas, o painel digital e os trens. */
const PLAT = { wall: 830, pit: 950, PY: 518 };
/** vento do trem que passa (0–1) — mantido para compatibilidade: na estação nova os painéis não balançam */
function platformWind(tl) { return 0; }
const STN = (() => {
  const GREENS = ['#2F6B4A', '#3E8558', '#4F9A66', '#6BB27A', '#8CC58E'];
  /** folhagem: tufos de folhas elípticas em vários verdes, dentro do retângulo */
  const foliage = (g, x, y, w, h, seed, dens = 1) => { const r = rng(seed); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.fillStyle = '#24543B'; g.fillRect(x, y, w, h);
    for (let k = 0; k < w * h / 260 * dens; k++) { const lx = x + r() * w, ly = y + r() * h, s = 9 + r() * 16, a = r() * TAU;
      g.save(); g.translate(lx, ly); g.rotate(a); g.fillStyle = GREENS[Math.floor(r() * GREENS.length)]; g.beginPath(); g.ellipse(0, 0, s, s * .42, 0, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(20,50,32,.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-s * .8, 0); g.lineTo(s * .8, 0); g.stroke(); g.restore(); }
    g.restore(); };
  /** copa de árvore: nuvem de círculos verdes com luz do alto */
  const crown = (g, cx, cy, rad, seed) => { const r = rng(seed); for (let k = 0; k < 26; k++) { const a = r() * TAU, d = r() * rad * .75, rr0 = rad * (.28 + r() * .3), x = cx + Math.cos(a) * d * 1.15, y = cy + Math.sin(a) * d * .8;
      const gg = g.createRadialGradient(x - rr0 * .3, y - rr0 * .4, rr0 * .1, x, y, rr0); gg.addColorStop(0, '#8CC58E'); gg.addColorStop(1, GREENS[Math.floor(r() * 3)]); g.fillStyle = gg; g.beginPath(); g.arc(x, y, rr0, 0, TAU); g.fill(); } };
  // 1) céu claro
  const SKY = makeCanvas(W, PLAT.wall, (g, w, h) => { const s = g.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#B9DCE6'); s.addColorStop(.55, '#DDEEEB'); s.addColorStop(1, '#F3EFE4'); g.fillStyle = s; g.fillRect(0, 0, w, h); });
  // 2) cidade clara, morros verdes e o viaduto distante (atrás do vidro)
  const MID = makeCanvas(W, PLAT.wall, (g, w) => {
    const r = rng(41);
    [[640, '#C9D6D9', 70, 300], [700, '#B4C6CA', 50, 200]].forEach(([base, col, hmin, hvar], L) => { g.fillStyle = col;
      for (let x = -20; x < w + 40;) { const bw = 50 + r() * 90, bh = hmin + r() * hvar; rr(g, x, base - bh, bw, bh + 200, L ? 4 : 10); g.fill();
        if (!L && r() < .35) { g.fillRect(x + bw * .45, base - bh - 40, 4, 40); } x += bw + 6 + r() * 26; } });
    // janelas discretas (dia): faixas horizontais claras
    g.fillStyle = 'rgba(255,255,255,.35)'; for (let k = 0; k < 160; k++) { const x = r() * w, y = 420 + r() * 260; g.fillRect(x, y, 14 + r() * 20, 3); }
    // morros e árvores
    g.fillStyle = '#9CC7A0'; g.beginPath(); g.moveTo(0, 720); for (let x = 0; x <= w; x += 40) g.lineTo(x, 700 - 34 * Math.sin(x / 260) - 18 * Math.sin(x / 97)); g.lineTo(w, 830); g.lineTo(0, 830); g.closePath(); g.fill();
    for (let x = 10; x < w; x += 46 + r() * 40) crown(g, x, 716 + r() * 30, 26 + r() * 22, 100 + x);
    // viaduto ao longe: tabuleiro fino e pilares
    g.fillStyle = '#E6EAE8'; g.fillRect(0, 586, w, 12); g.fillStyle = '#CDD4D3'; g.fillRect(0, 598, w, 5);
    for (let x = 60; x < w; x += 190) { g.fillStyle = '#D9DFDE'; g.fillRect(x, 603, 10, 110); }
  });
  // 3) frente: vidro, montantes, jardins, floreiras, cobertura, via e plataforma
  const FRONT = makeCanvas(W, H, (g, w, h) => {
    const WALL = PLAT.wall, PIT = PLAT.pit, r = rng(77);
    // reflexo suave no vidro
    const gl = g.createLinearGradient(0, 120, w, WALL); gl.addColorStop(0, 'rgba(255,255,255,.18)'); gl.addColorStop(.5, 'rgba(210,235,240,.08)'); gl.addColorStop(1, 'rgba(255,255,255,.14)'); g.fillStyle = gl; g.fillRect(0, 120, w, WALL - 120);
    for (let k = 0; k < 7; k++) { const x = k * 320 + 60; g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.moveTo(x, 120); g.lineTo(x + 90, 120); g.lineTo(x - 140, WALL); g.lineTo(x - 230, WALL); g.closePath(); g.fill(); }
    // montantes e travessas brancas
    for (let x = 0; x <= w; x += 240) { g.fillStyle = 'rgba(40,60,64,.12)'; g.fillRect(x + 6, 120, 4, WALL - 120); g.fillStyle = '#FBFBF8'; g.fillRect(x - 4, 120, 10, WALL - 120); }
    [400, 640].forEach(y => { g.fillStyle = '#FBFBF8'; g.fillRect(0, y - 3, w, 7); g.fillStyle = 'rgba(40,60,64,.1)'; g.fillRect(0, y + 4, w, 3); });
    // jardins verticais nas laterais e floreiras ao pé do vidro
    [[0, 96], [w - 96, 96]].forEach(([x, ww], i) => { foliage(g, x, 150, ww, WALL - 150, 11 + i, 1.4); g.fillStyle = '#FBFBF8'; g.fillRect(i ? x - 8 : x + ww, 150, 8, WALL - 150); });
    rr(g, 0, WALL - 64, w, 64, 0); g.fillStyle = '#E7E4DC'; g.fill(); g.fillStyle = '#CFCAC0'; g.fillRect(0, WALL - 64, w, 6);
    for (let x = 0; x < w; x += 34) { const hh = 34 + r() * 30; foliage(g, x - 6, WALL - 64 - hh + 10, 48, hh, 300 + x, 1.6); }
    // árvores esguias nos vãos entre os painéis
    [660, 1260].forEach((x, i) => { g.fillStyle = '#6B5640'; g.fillRect(x - 5, 420, 10, WALL - 64 - 420); crown(g, x, 380, 92, 500 + i); crown(g, x - 30, 450, 60, 520 + i); crown(g, x + 34, 440, 64, 540 + i);
      rr(g, x - 46, WALL - 96, 92, 40, 8); g.fillStyle = '#F4F2EC'; g.fill(); g.strokeStyle = '#CFCAC0'; g.lineWidth = 3; g.stroke(); });
    // cobertura: nervuras brancas convergindo, vidro entre elas e a viga de borda
    const cg = g.createLinearGradient(0, 0, 0, 132); cg.addColorStop(0, '#E8F2F3'); cg.addColorStop(1, '#F7F8F5'); g.fillStyle = cg; g.fillRect(0, 0, w, 132);
    for (let k = -8; k <= 8; k++) { const xb = w / 2 + k * 150, xt = w / 2 + k * 60; g.strokeStyle = '#FFFFFF'; g.lineWidth = 12; g.beginPath(); g.moveTo(xt, -10); g.lineTo(xb, 132); g.stroke();
      g.strokeStyle = 'rgba(40,60,64,.12)'; g.lineWidth = 3; g.beginPath(); g.moveTo(xt + 7, -10); g.lineTo(xb + 9, 132); g.stroke(); }
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 120, w, 22); g.fillStyle = 'rgba(30,50,55,.16)'; g.fillRect(0, 142, w, 8);
    // via: laje clara, dois trilhos e a guia de LED verde
    const tg = g.createLinearGradient(0, WALL, 0, PIT); tg.addColorStop(0, '#D3D0C8'); tg.addColorStop(1, '#C4C0B7'); g.fillStyle = tg; g.fillRect(0, WALL, w, PIT - WALL);
    g.fillStyle = '#F6F4EE'; g.fillRect(0, WALL, w, 8);
    [884, 922].forEach(y => { g.fillStyle = '#8E979B'; g.fillRect(0, y - 4, w, 8); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(0, y - 4, w, 2); });
    g.fillStyle = 'rgba(63,191,160,.75)'; g.fillRect(0, 902, w, 3);
    // plataforma clara: faixa tátil, borda e juntas em perspectiva
    const fg = g.createLinearGradient(0, PIT, 0, h); fg.addColorStop(0, '#EEEBE4'); fg.addColorStop(1, '#E1DDD4'); g.fillStyle = fg; g.fillRect(0, PIT, w, h - PIT);
    g.fillStyle = '#FFFFFF'; g.fillRect(0, PIT, w, 6); g.fillStyle = '#F0C43A'; g.fillRect(0, PIT + 12, w, 16);
    g.fillStyle = 'rgba(160,120,20,.35)'; for (let x = 6; x < w; x += 16) { g.beginPath(); g.arc(x, PIT + 20, 2.6, 0, TAU); g.fill(); }
    g.strokeStyle = 'rgba(150,140,125,.35)'; g.lineWidth = 2; for (let k = -14; k <= 14; k++) { g.beginPath(); g.moveTo(w / 2 + k * 70, PIT + 32); g.lineTo(w / 2 + k * 190, h + 10); g.stroke(); }
    [1000, 1046].forEach(y => { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); });
  });
  return { SKY, MID, FRONT };
})();
function platform(ctx, tl, o = {}) {
  ctx.fillStyle = '#EEEBE4'; ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.drawImage(STN.SKY, 0, 0);
  // nuvens passando devagar
  for (let k = 0; k < 5; k++) { const sp = 6 + k * 2.2, x = ((hash(k * 7) * (W + 600) + tl * sp) % (W + 600)) - 300, y = 190 + hash(k * 3) * 260, s = .7 + hash(k * 5) * .8;
    ctx.save(); ctx.globalAlpha = .75; ctx.fillStyle = '#FFFFFF'; [[0, 0, 90], [70, 12, 70], [-70, 16, 64], [30, -26, 60]].forEach(([dx, dy, rr0]) => { ctx.beginPath(); ctx.ellipse(x + dx * s, y + dy * s, rr0 * s, rr0 * s * .55, 0, 0, TAU); ctx.fill(); }); ctx.restore(); }
  ctx.drawImage(STN.MID, 0, 0);
  // um trem bala cruza o viaduto lá longe a cada 17 s
  { const c = (tl + 6) % 17, d = 6; if (c < d) { const u = c / d; sideTrain(ctx, lerp(-200, W + 420, E.inOutSine(u)), 586, { s: .07 }); } }
  ctx.drawImage(STN.FRONT, 0, 0);
  // placa da parada pendurada na cobertura
  if (o.sign) { const sw = measure(ctx, o.sign, 24, 900, false, 4) + 150, x0 = W / 2 - sw / 2;
    rr(ctx, x0 + 4, 154, sw, 40, 10); ctx.fillStyle = 'rgba(20,30,34,.18)'; ctx.fill();
    rr(ctx, x0, 150, sw, 40, 10); ctx.fillStyle = '#1F2B30'; ctx.fill();
    intersection(ctx, x0 + 44, 170, 11, 14);
    text(ctx, o.sign, W / 2 + 26, 171, { size: 22, weight: 900, color: '#FFFFFF', align: 'center', ls: 4 }); }
  // painel digital de partidas e relógio
  if (o.led !== false) { const msg = '   PRÓXIMO TREM · 2 MIN   ·   LINHA PERFORMANCE ANALYTICS   ·   EMBARQUE PELA FAIXA AMARELA   ', lx = 120, lw = 300, ly = 150;
    rr(ctx, lx, ly, lw, 40, 10); ctx.fillStyle = '#1F2B30'; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(lx + 10, ly + 3, lw - 20, 34); ctx.clip(); ctx.font = font(18, 800, F.mono); const mw = ctx.measureText(msg).width, off = (tl * 60) % mw;
    ctx.fillStyle = '#7FE0C4'; ctx.textBaseline = 'middle'; ctx.fillText(msg + msg, lx + 10 - off, ly + 21); ctx.restore();
    const cx = W - 160, cy = 172; circle(ctx, cx + 3, cy + 4, 24, 'rgba(20,30,34,.18)'); circle(ctx, cx, cy, 24, '#FFFFFF', '#1F2B30', 4);
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(ctx, cx + Math.cos(a) * 17, cy + Math.sin(a) * 17, cx + Math.cos(a) * 21, cy + Math.sin(a) * 21, '#1F2B30', k % 3 ? 1.5 : 3); }
    const sec = tl % 60, mn = 37 + tl / 60; [[mn / 60 * TAU, 16, 3, '#1F2B30'], [((9 + mn / 60) / 12) * TAU, 11, 4, '#1F2B30'], [sec / 60 * TAU, 19, 1.5, C.orange]].forEach(([a, l, w, c]) => line(ctx, cx, cy, cx + Math.sin(a) * l, cy - Math.cos(a) * l, c, w));
    circle(ctx, cx, cy, 4, C.orange); }
}
/** compatibilidade: a vida da estação já está em platform() */
function platformLife() {}
/** painel da estação (v7.11): caixa de luz branca pendurada na cobertura, cabeçalho com o número da estação e conteúdo */
const POSTERS = {};  // n → (ctx, w, h, tl) desenha o conteúdo no espaço local do cartaz
function poster(ctx, x, y, w, h, n, tl, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  if (o.cables !== false) [-1, 1].forEach(sd => line(ctx, sd * (w / 2 - 70), -h / 2, sd * (w / 2 - 70), -h / 2 - 380, 'rgba(70,82,86,.55)', 3));
  rr(ctx, -w / 2 + 8, -h / 2 + 14, w, h, 22); ctx.fillStyle = 'rgba(20,30,34,.16)'; ctx.fill();
  rr(ctx, -w / 2, -h / 2, w, h, 22); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = '#C9D1D3'; ctx.lineWidth = 3; ctx.stroke();
  const st = TX.stations[n - 1], col = n <= 3 ? C.red : n <= 6 ? C.orange : C.yellow;
  rr(ctx, -w / 2 + 22, -h / 2 + 24, w - 44, 74, 14); ctx.fillStyle = col; ctx.fill();
  text(ctx, st.n, -w / 2 + 62, -h / 2 + 62, { size: 44, weight: 900, color: n <= 6 ? '#FFF' : INK, align: 'center' });
  text(ctx, st.short, -w / 2 + 112, -h / 2 + 62, { size: Math.min(26, 26 * (w - 160) / measure(ctx, st.short, 26, 900, false, 1)), weight: 900, color: n <= 6 ? '#FFF' : INK, ls: 1 });
  ctx.save(); ctx.translate(0, 40); ctx.beginPath(); ctx.rect(-w / 2 + 20, -h / 2 + 70, w - 40, h - 120); ctx.clip();
  if (POSTERS[n]) POSTERS[n](ctx, w - 40, h - 120, tl); else text(ctx, st.title, 0, 0, { size: 28, weight: 800, color: INK, align: 'center' });
  ctx.restore(); ctx.restore();
}
/* ---------- slides montados: miniaturas e popup das paradas ----------
   Cada estação lista os momentos em que a cena está "montada" (cena, tempo local, título).
   A miniatura é renderizada sob demanda (uma por quadro) e guardada; o popup renderiza em tela cheia. */
// [cena, instante montado (miniatura), título, início do loop, fim do loop] — o popup roda a animação em loop nesse trecho
const SLIDES = {
  1: [['s01', 11.6, 'As perguntas de negócio', 3.9, 12.2], ['s01', 35.0, 'A ponte: os 4 serviços', 19.8, 35.6], ['s01', 46.0, 'Do diagnóstico à mensuração', 35.8, 46.9]],
  2: [['s02', 19.5, 'Faturamento da track', 3.9, 20.2], ['s02', 29.5, 'Brasil: anterior e orçamento', 20.6, 30.3], ['s02', 38.0, 'Brasil por trimestre', 30.8, 43.4]],
  3: [['s03', 15.0, 'Onde aplicamos', 3.8, 15.2], ['s03', 25.0, 'O que entregamos', 16.1, 25.2], ['s03', 33.5, 'Junto com as outras tracks', 26.1, 33.4],
    ['s03', 43.5, 'Modelos preditivos', 34.5, 43.4], ['s03', 51.5, 'Modelos prescritivos', 44.3, 51.6], ['@catalog', 0, 'Catálogo: 20 modelos', 0, 6]],
  4: [['banana', 23.5, 'Cestas · os dados', 12.6, 24.2], ['banana', 31.5, 'Cestas · como fizemos (ALS)', 24.5, 35.4], ['banana', 52.5, 'Cestas · solução e resultado', 35.6, 53.1],
    ['manga', 34.5, 'Principalidade · como fizemos', 24.5, 35.4], ['manga', 45.5, 'Principalidade · reordenação', 35.6, 46.6], ['manga', 58.5, 'Principalidade · resultado', 46.8, 59.8],
    ['lightsoff', 11, 'Relatórios · antes', 2.4, 11.9], ['lightsoff', 35.5, 'Relatórios · como fizemos', 20.4, 36.5], ['lightsoff', 49.6, 'Relatórios · luz apagada, resultado e dashboard', 36.6, 50.6],
    ['insight', 26.8, 'Agentes · avaliar e corrigir', 18.6, 27.4], ['insight', 45.6, 'Agentes · escala', 35.6, 46.5], ['insight', 54.6, 'Agentes · situação', 46.7, 55.4]],
  5: [['s05', 19.5, 'A mesma equipe, mais alcance', 3.8, 19.8]],
  6: [['s06', 24.0, 'Pilares e contribuições', 3.8, 24.3]],
  7: [['s07', 9.0, 'Decisões e integração', .6, 9.3], ['s07', 17.8, 'Automação, eficiência e escala', 9.4, 18.1], ['s07', 26, 'User-Pay', 18.2, 26.3], ['climax', 19.5, 'Por trás de tudo · métodos e técnicas', 0, 26.3]]
};
/** telas extras das paradas (lupa) que não são cenas do filme: SLIDES com nome '@tela' */
const SLIDE_SCREENS = {};
const SLIDE = (() => {
  const cache = {}, queue = [], big = { key: null, cv: null }, scratch = makeCanvas(W, H, () => {});
  const key = sl => sl[0] + '@' + sl[1];
  const render = (c, sl) => { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    if (sl[0][0] === '@') { HUD.begin(c); try { (SLIDE_SCREENS[sl[0].slice(1)] || (g => { bgDark(g, 0); }))(c, sl[1]); } finally { HUD.flush(c); } return; }
    PLAYER.slideAt(c, CONFIG.sceneById[sl[0]].start + sl[1]); };
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
      ctx.fillStyle = '#EEEBE4'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(vs, vs); ctx.translate(-vx, -vy);
      platform(ctx, tl, { sign: o.sign });
      N.forEach((n, i) => { const hov = !item && ui.hover && ui.hover.poster === i, py = PLAT.PY - (hov ? 12 : 0); poster(ctx, px(i), py, 500, 640, n, tl);
        if (hov) { rr(ctx, px(i) - 258, py - 328, 516, 656, 28); ctx.strokeStyle = C.orange; ctx.lineWidth = 6; ctx.stroke(); } });
      ctx.restore();
    },
    /** interface por cima da pintura: chamada, passagem, miniaturas, popup e dicas */
    ui(ctx, tl, item, prevItem, p, ui) {
      ui = ui || { hover: null, pop: null, prevPop: null, popP: 1 };
      const e = E.inOutCubic(p), sa = item ? (prevItem ? 1 : e) : (prevItem ? 1 - e : 0), sn = curN(item) || curN(prevItem);
      // transição em "mergulho no escuro": o último quadro do vídeo some em zoom enquanto um véu escuro (com o rastro
      // de luz de um trem passando) cobre a estação; o véu só abre depois que o quadro antigo sumiu, então os textos
      // das duas telas nunca aparecem juntos
      if (o.from != null && tl < 1.5) {
        const veil = tl < .55 ? E.outCubic(tl / .55) : 1 - E.inOutCubic(clamp((tl - .55) / .9)), old = 1 - E.inOutCubic(clamp(tl / .7));
        if (veil > 0) { ctx.save(); ctx.fillStyle = rgba('#0B0807', veil); ctx.fillRect(0, 0, W, H);
          const sp = clamp((tl - .15) / 1.1); if (sp > 0 && sp < 1) { ctx.globalCompositeOperation = 'lighter'; const r = rng(77), x0 = lerp(-900, W + 200, E.inOutSine(sp));
            for (let k = 0; k < 14; k++) { const y = 140 + r() * (H - 280), len = 500 + r() * 900, x = x0 + r() * 500 - 250; ctx.globalAlpha = veil * (.25 + r() * .35) * Math.sin(sp * Math.PI);
              const g = ctx.createLinearGradient(x, 0, x + len, 0); g.addColorStop(0, 'rgba(255,95,0,0)'); g.addColorStop(.8, k % 3 ? 'rgba(255,214,160,.9)' : 'rgba(255,95,0,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, len, 2 + r() * 5); } }
          ctx.restore(); }
        if (old > 0) { ctx.save(); ctx.globalAlpha = old; const z = 1 + tl * .3; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
          const snap = PLAYER.snapshot(o.from); if (snap) ctx.drawImage(snap, 0, 0); else PLAYER.frameAt(ctx, o.from - 1e-3); ctx.restore(); } }
      const ov = (item ? (prevItem ? 0 : 1 - e) : (prevItem ? e : 1)) * clamp((tl - .9) / .6);
      if (o.call && ov > 0) { ctx.save(); ctx.globalAlpha *= ov; const w = measure(ctx, o.call, 34, 900, true, 3) + 90;
        rr(ctx, W / 2 - w / 2, 22, w, 74, 12); ctx.fillStyle = '#0A0807'; ctx.fill(); ctx.strokeStyle = '#3A2A1E'; ctx.lineWidth = 3; ctx.stroke();
        ctx.shadowColor = C.orange; ctx.shadowBlur = 12; text(ctx, o.call, W / 2, 60, { size: 34, weight: 900, mono: true, color: C.orange, align: 'center', ls: 3 }); ctx.restore(); }
      if (o.banner && ov > 0) { ctx.save(); ctx.globalAlpha *= ov; ctx.fillStyle = 'rgba(12,9,7,.86)'; ctx.fillRect(0, H - 150, W, 76); line(ctx, 0, H - 150, W, H - 150, C.orange, 4);
        para(ctx, o.banner, W / 2, H - 134, 1700, { size: 34, weight: 800, color: '#FFF', accent: C.yellow, align: 'center' }); ctx.restore(); }
      if (sn) slideStrip(ctx, sn, sa, ui);
      SLIDE.pump();
      if (!item) uiNote(ctx, 'clique num painel para abrir a estação', W / 2, H - 40, clamp((tl - .9) / .6), tl);
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
/** dica discreta para quem apresenta (canto inferior direito), numa pílula escura: legível na estação clara e no escuro */
function hint(ctx, tl, label, item) {
  const a = .6 + .2 * Math.sin(tl * 2.4), w = measure(ctx, label, 20, 700, true, 2) + 40;
  ctx.save(); ctx.globalAlpha *= a; rr(ctx, W - 40 - w, H - 68, w, 44, 22); ctx.fillStyle = 'rgba(20,28,32,.78)'; ctx.fill();
  text(ctx, label, W - 60, H - 46, { size: 20, weight: 700, mono: true, color: '#FFF', align: 'right', ls: 2 }); ctx.restore();
}
/** aviso centralizado numa pílula escura (instruções das paradas) */
function uiNote(ctx, str, x, y, a = 1, tl = 0) {
  if (a <= 0) return; const w = measure(ctx, str, 22, 700, true, 2) + 56;
  ctx.save(); ctx.globalAlpha *= a * (.8 + .2 * Math.sin(tl * 2.4)); rr(ctx, x - w / 2, y - 24, w, 48, 24); ctx.fillStyle = 'rgba(20,28,32,.8)'; ctx.fill();
  text(ctx, str, x, y + 1, { size: 22, weight: 700, mono: true, color: '#FFF', align: 'center', ls: 2 }); ctx.restore();
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
