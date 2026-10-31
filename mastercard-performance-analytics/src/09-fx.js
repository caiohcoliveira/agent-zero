/* ============================================================================
   9. FX + ESTILO — a música mexe na câmera, nas cores e nos elementos;
   traço de tinta "fervendo", respingos, grafites e pinceladas (pegada Arcane/Fortiche)
   ----------------------------------------------------------------------------
   Tudo é função do tempo: BT (estado da música) e NOW (relógio da animação),
   atualizados pelo player a cada quadro.
   ========================================================================== */
let NOW = 0;
const BX = () => CONFIG.motion.beat;

/* ---------- utilitários de cena (texto rico, pílula, círculos Mastercard) ---------- */
function rich(ctx, str, x, y, o = {}) {
  const size = o.size || 120, weight = o.weight || 800, ls = o.ls == null ? -size * .025 : o.ls;
  const parts = str.split(/(\*[^*]+\*)/).filter(Boolean).map(p => ({ s: p.replace(/\*/g, ''), hi: p[0] === '*' }));
  const ws = parts.map(p => measure(ctx, p.s, size, weight, false, ls)), total = ws.reduce((a, b) => a + b, 0);
  let cx = o.align === 'left' ? x : o.align === 'right' ? x - total : x - total / 2;
  parts.forEach((p, i) => {
    const op = { size, weight, ls, color: p.hi ? (o.accent || C.orange) : (o.color || C.white), alpha: o.alpha };
    if (o.retro) retroText(ctx, p.s, cx, y, { ...op, shadow: o.shadow, depth: o.depth, lw: o.lw }); else text(ctx, p.s, cx, y, op);
    cx += ws[i];
  });
  return total;
}
function pill(ctx, x, y, label, o = {}) {
  const size = o.size || 22, w = measure(ctx, label, size, o.weight || 700) + size * 1.6, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha); ctx.translate(x, y); ctx.scale(o.scale || 1, o.scale || 1); ctx.rotate(o.rot || 0);
  if (o.fill && !o.flat) { ctx.save(); ctx.translate(3, 4); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = rgba(INK, .85); ctx.fill(); ctx.restore(); }
  rr(ctx, -w / 2, -h / 2, w, h, h / 2); if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
  const st = o.stroke || (o.fill && !o.flat ? INK : null); if (st) { ctx.strokeStyle = st; ctx.lineWidth = o.lw || 2.5; ctx.stroke(); }
  text(ctx, label, 0, 1, { size, weight: o.weight || 700, color: o.color || C.ink, align: 'center' }); ctx.restore(); return w;
}
/** os dois círculos da Mastercard (Negócio × Dados); d = distância entre centros */
function intersection(ctx, cx, cy, R, d, o = {}) {
  const ax = cx - d / 2, bx = cx + d / 2, hot = o.hot || 0, A = o.alpha == null ? 1 : o.alpha;
  glow(ctx, ax, cy, R * 1.5, C.red, .25 * A); glow(ctx, bx, cy, R * 1.5, C.yellow, .2 * A);
  ctx.save(); ctx.globalAlpha *= A;
  const gA = ctx.createRadialGradient(ax - R * .3, cy - R * .3, R * .1, ax, cy, R); gA.addColorStop(0, '#FF3347'); gA.addColorStop(1, C.red);
  const gB = ctx.createRadialGradient(bx - R * .3, cy - R * .3, R * .1, bx, cy, R); gB.addColorStop(0, '#FFC25A'); gB.addColorStop(1, C.yellow);
  const sd = Math.max(5, R * .05); ctx.save(); ctx.translate(sd, sd * 1.15); ctx.beginPath(); ctx.arc(ax, cy, R, 0, TAU); ctx.moveTo(bx + R, cy); ctx.arc(bx, cy, R, 0, TAU); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fill('nonzero'); ctx.restore();
  circle(ctx, ax, cy, R, gA); circle(ctx, bx, cy, R, gB);
  if (d < 2 * R) { ctx.save(); ctx.beginPath(); ctx.arc(ax, cy, R, 0, TAU); ctx.clip(); circle(ctx, bx, cy, R, mix(C.orange, '#FFE6C7', hot * .6)); ctx.restore(); }
  [ax, bx].forEach(c0 => { ctx.save(); ctx.beginPath(); ctx.arc(c0, cy, R, 0, TAU); ctx.clip(); ctx.globalAlpha *= .22; ctx.drawImage(SHADE, c0 - R, cy - R, R * 2, R * 2); ctx.restore(); });
  const lw = Math.max(2.5, R * .03); inkCircle(ctx, ax, cy, R, lw, 1); inkCircle(ctx, bx, cy, R, lw, 2);
  if (hot > 0 && d < 2 * R) glow(ctx, cx, cy, R * 1.1, '#FFF2E0', hot * .7);
  if (o.labels) {
    const ls = Math.max(18, R * .15), la = o.labelA == null ? 1 : o.labelA;
    text(ctx, o.labels[0], ax - R * .42, cy, { size: ls, weight: 800, align: 'center', color: '#FFF', alpha: la });
    text(ctx, o.labels[1], bx + R * .42, cy, { size: ls, weight: 800, align: 'center', color: C.ink, alpha: la });
  }
  ctx.restore();
}

/* ---------- traço de tinta "fervendo" (line boil a 12 qps, mais forte nas caixas) ---------- */
function boil(seed, amp = 1.6) {
  const f = Math.floor(NOW * 12), a = amp * (1 + 1.6 * BT.snare * BX());
  return [(hash(f * 13 + seed * 7.1) - .5) * a, (hash(f * 17 + seed * 3.3 + 9) - .5) * a];
}
/** contorno de tinta sobre um caminho já definido por pathFn: traço cheio + traço solto deslocado */
function ink(ctx, pathFn, lw = 3, seed = 1, color = INK) {
  ctx.save(); ctx.lineJoin = ctx.lineCap = 'round'; ctx.strokeStyle = color;
  pathFn(); ctx.lineWidth = lw; ctx.stroke();
  const [dx, dy] = boil(seed); ctx.translate(dx, dy); pathFn(); ctx.lineWidth = lw * .45; ctx.globalAlpha *= .75; ctx.stroke();
  ctx.restore();
}
function inkCircle(ctx, x, y, r, lw = 3, seed = 1, color = INK) { ink(ctx, () => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }, lw, seed, color); }
function inkRect(ctx, x, y, w, h, r = 8, lw = 3, seed = 1, color = INK) { ink(ctx, () => rr(ctx, x, y, w, h, r), lw, seed, color); }

/** respingo de tinta (spray/splat): bolha irregular + gotas + escorridos; p = revelação */
function splat(ctx, x, y, r, col, seed = 1, p = 1, a = 1) {
  if (p <= 0 || a <= 0) return;
  const R = rng(seed);
  ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.globalAlpha *= a; ctx.fillStyle = col;
  ctx.beginPath(); const n = 16;
  for (let k = 0; k <= n; k++) { const ang = k / n * TAU, rad = r * (.62 + .5 * R()); const px = Math.cos(ang) * rad, py = Math.sin(ang) * rad; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.closePath(); ctx.fill();
  for (let k = 0; k < 14; k++) { const ang = R() * TAU, dd = r * (1.05 + R() * 1.3), rs = r * (.04 + R() * .12); circle(ctx, Math.cos(ang) * dd, Math.sin(ang) * dd, rs, col); }
  for (let k = 0; k < 3; k++) { const dx = (R() - .5) * r * 1.1, len = r * (.5 + R() * 1.2) * p, w = r * (.08 + R() * .07);
    rr(ctx, dx - w / 2, 0, w, r * .5 + len, w / 2); ctx.fill(); circle(ctx, dx, r * .5 + len, w * .9, col); }
  ctx.restore();
}
/** grafite rabiscado (estilo pichação da Jinx), revelado pelo traço; kind: star arrow crown spiral zigzag circle heart bang x */
function scribble(ctx, kind, x, y, s, col, seed = 1, p = 1, o = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
  ctx.lineCap = ctx.lineJoin = 'round'; ctx.strokeStyle = col; ctx.lineWidth = s * (o.lw || .09);
  if (o.glow) { ctx.shadowColor = col; ctx.shadowBlur = s * .25; }
  const L = s * 12; ctx.setLineDash([L * p, L]); const [jx, jy] = boil(seed, 1.2);
  ctx.translate(jx, jy); ctx.beginPath();
  if (kind === 'star') { for (let k = 0; k <= 10; k++) { const a = -Math.PI / 2 + k * TAU / 10, rad = k % 2 ? s * .22 : s * .5; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); } }
  else if (kind === 'arrow') { ctx.moveTo(-s * .5, s * .15); ctx.quadraticCurveTo(-s * .1, -s * .35, s * .45, -s * .1); ctx.moveTo(s * .2, -s * .3); ctx.lineTo(s * .45, -s * .1); ctx.lineTo(s * .22, s * .12); }
  else if (kind === 'crown') { ctx.moveTo(-s * .45, s * .25); ctx.lineTo(-s * .45, -s * .2); ctx.lineTo(-s * .2, s * .02); ctx.lineTo(0, -s * .32); ctx.lineTo(s * .2, s * .02); ctx.lineTo(s * .45, -s * .2); ctx.lineTo(s * .45, s * .25); ctx.closePath(); }
  else if (kind === 'spiral') { for (let k = 0; k < 60; k++) { const a = k * .32, rad = s * .02 + k * s * .008; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); } }
  else if (kind === 'zigzag') { for (let k = 0; k <= 6; k++) ctx.lineTo(-s * .5 + k * s / 6, (k % 2 ? -1 : 1) * s * .14); }
  else if (kind === 'circle') { for (let k = 0; k <= 46; k++) { const a = k / 40 * TAU, rad = s * .48 * (1 + .06 * Math.sin(k * 1.7)); ctx.lineTo(Math.cos(a) * rad * 1.15, Math.sin(a) * rad * .78); } }
  else if (kind === 'heart') { ctx.moveTo(0, s * .32); ctx.bezierCurveTo(-s * .55, -s * .05, -s * .3, -s * .48, 0, -s * .18); ctx.bezierCurveTo(s * .3, -s * .48, s * .55, -s * .05, 0, s * .32); }
  else if (kind === 'bang') { ctx.moveTo(0, -s * .45); ctx.lineTo(0, s * .15); ctx.moveTo(0, s * .34); ctx.lineTo(0, s * .36); }
  else { ctx.moveTo(-s * .35, -s * .35); ctx.lineTo(s * .35, s * .35); ctx.moveTo(s * .35, -s * .35); ctx.lineTo(-s * .35, s * .35); }
  ctx.stroke(); ctx.restore();
}
/** pincelada pintada (fundo de títulos/cartões): faixas sobrepostas com borda irregular */
function brush(ctx, x, y, w, h, col, seed = 1, p = 1) {
  if (p <= 0) return;
  const R = rng(seed), n = 5, A0 = ctx.globalAlpha;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 20, y - 30, (w + 40) * p, h + 60); ctx.clip();
  for (let k = 0; k < n; k++) {
    const yy = y + k * h / n - h * .05, hh = h / n * 1.5, c = mix(col, k % 2 ? '#000000' : '#FFFFFF', .06 + R() * .06);
    ctx.beginPath(); ctx.moveTo(x - 10 + R() * 14, yy + R() * 6);
    for (let s = 1; s <= 12; s++) ctx.lineTo(x + w * s / 12, yy + (R() - .5) * 7);
    for (let s = 12; s >= 0; s--) ctx.lineTo(x + w * s / 12 + (s === 0 ? R() * 16 : 0), yy + hh + (R() - .5) * 7);
    ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = A0 * .92; ctx.fill();
  }
  ctx.globalAlpha = A0 * .18; for (let k = 0; k < 26; k++) { const yy = y + R() * h; line(ctx, x + R() * w * .2, yy, x + w * (.6 + R() * .4), yy + (R() - .5) * 3, '#000', 1); }
  ctx.restore();
}
/** hachura (sombra desenhada) dentro do caminho */
function hatch(ctx, pathFn, x, y, w, h, o = {}) {
  ctx.save(); pathFn(); ctx.clip(); ctx.strokeStyle = o.color || INK; ctx.globalAlpha *= o.alpha == null ? .35 : o.alpha; ctx.lineWidth = o.lw || 1.6;
  const g = o.gap || 9, a = o.angle == null ? .8 : o.angle; ctx.beginPath();
  for (let k = -h; k < w + h; k += g) { ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h * a, y); }
  if (o.cross) for (let k = -h; k < w + h; k += g * 1.4) { ctx.moveTo(x + k, y); ctx.lineTo(x + k + h * a, y + h); }
  ctx.stroke(); ctx.restore();
}
/** título pintado: pincelada + letras com contorno de tinta e sombra chapada + respingos */
function paintTitle(ctx, str, x, y, o = {}) {
  const size = o.size || 96, w = measure(ctx, str, size, 900) + size * .8, p = o.p == null ? 1 : o.p;
  const bx = o.align === 'left' ? x - size * .3 : x - w / 2;
  brush(ctx, bx, y - size * .62, w, size * 1.24, o.bg || C.orange, o.seed || 3, E.outCubic(clamp(p * 1.4)));
  if (o.splat !== false) splat(ctx, bx + w - size * .2, y - size * .45, size * .32, o.splatCol || C.yellow, (o.seed || 3) + 5, E.outBack(clamp(p * 2 - .6)), .9);
  const ap = clamp(p * 2 - .4); if (ap <= 0) return;
  ctx.save(); ctx.globalAlpha *= ap;
  retroText(ctx, str, o.align === 'left' ? x : x, y + (1 - E.outBack(ap)) * size * .3, { size, weight: 900, color: o.color || '#FFF', align: o.align || 'center', ls: o.ls || 0 });
  ctx.restore();
}

/* ---------- FX de batida: câmera e pós-processamento ---------- */
const FX = (() => {
  const R = makeCanvas(W, H, () => {}), rc = R.getContext('2d'), CY = makeCanvas(W, H, () => {}), cc = CY.getContext('2d');
  function chroma(ctx, d) {
    const cv = ctx.canvas;
    rc.globalCompositeOperation = 'copy'; rc.drawImage(cv, 0, 0); rc.globalCompositeOperation = 'multiply'; rc.fillStyle = '#FF0000'; rc.fillRect(0, 0, W, H);
    cc.globalCompositeOperation = 'copy'; cc.drawImage(cv, 0, 0); cc.globalCompositeOperation = 'multiply'; cc.fillStyle = '#00FFFF'; cc.fillRect(0, 0, W, H);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'copy'; ctx.drawImage(R, -d, 0); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(CY, d * .6, d * .25); ctx.restore();
  }
  function focusLines(ctx, a, seed) {
    const r = rng(seed * 7 + 3); ctx.save(); ctx.globalAlpha = clamp(a) * .55; ctx.fillStyle = '#FFF4E8';
    for (let k = 0; k < 46; k++) { const ang = r() * TAU, w = .006 + r() * .012, r0 = 420 + r() * 260;
      ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(ang) * r0, H / 2 + Math.sin(ang) * r0);
      ctx.lineTo(W / 2 + Math.cos(ang - w) * 1500, H / 2 + Math.sin(ang - w) * 1500); ctx.lineTo(W / 2 + Math.cos(ang + w) * 1500, H / 2 + Math.sin(ang + w) * 1500); ctx.fill(); }
    ctx.restore();
  }
  const cfgOf = s => (SCENES[s.id] && SCENES[s.id].fx) || {};
  return {
    /** soco de zoom no tempo forte, balanço no compasso, tranco e inclinação nos picos */
    camera(ctx, T, s) {
      const b = BT, m = BX() * (cfgOf(s).camera == null ? 1 : cfgOf(s).camera); if (!m || !b.on) return;
      const z = 1 + m * (.014 * b.beat * (.4 + .6 * b.low) + .03 * b.down * b.level + .045 * b.drop + .018 * b.hit);
      const rot = m * (.005 * Math.sin(b.bar * TAU) * b.level + .012 * b.hit * (b.i % 2 ? 1 : -1));
      ctx.translate(m * 9 * b.hit * Math.sin(b.i * 1.7), m * 7 * b.snare * Math.cos(b.i * 2.3)); ctx.rotate(rot); ctx.scale(z, z);
    },
    /** cor: calor no 1º tempo, linhas de foco e RGB nos picos, inversão (impact frame) nas viradas */
    post(ctx, T, s) {
      const b = BT, m = BX(), cfg = cfgOf(s); if (!m || !b.on) { vignette(ctx, .2); return; }
      if (b.down > .05) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .3 * b.down * b.level * m; ctx.fillStyle = C.orange; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      if (cfg.lines !== false && b.hit > .6) focusLines(ctx, (b.hit - .6) / .4 * m, b.i);
      const ab = m * (6 * b.hit + 3.5 * b.snare * b.level + 16 * b.drop) * (cfg.chroma == null ? 1 : cfg.chroma);
      if (ab > 1.6) chroma(ctx, Math.min(ab, 22));
      if (cfg.invert !== false && (b.drop > .82 || (b.hit > .93 && b.down > .9 && b.di % 4 === 0))) {
        ctx.save(); ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = b.di % 2 ? '#FFFFFF' : '#FFE0B8'; ctx.fillRect(0, 0, W, H); ctx.restore();
      }
      vignette(ctx, .16 + .2 * b.low * m);
    },
    chroma, focusLines
  };
})();
