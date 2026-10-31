/* ============================================================================
   12. PINTURA, LUZ E VOLUME — acabamento "painterly" no espírito de Arcane
   ----------------------------------------------------------------------------
   • PAINT.post: pinceladas sobre o quadro inteiro, gradação de cor (luz quente
     no alto, sombra fria embaixo) e bloom dos pontos de luz. Roda depois da cena
     e antes das legendas, que ficam nítidas.
   • atmos: luz volumétrica e poeira no ar (eventos contínuos em paralelo).
   • vball / vlimb / vslab: formas com volume (luz do alto à esquerda, luz de
     recorte laranja do lado oposto) para personagens e objetos 2.5D.
   Tudo é função do tempo; no modo leve (QUALITY.low) o acabamento é pulado.
   ========================================================================== */
const PAINT = (() => {
  // textura de pinceladas em tons médios (aplicada em overlay: o cinza médio não altera, o resto "pinta")
  const STROKES = makeCanvas(1024, 1024, g => {
    const r = rng(31);
    for (let k = 0; k < 3200; k++) {
      const x = r() * 1024, y = r() * 1024, a = -.5 + (r() - .5) * .7, l = 18 + r() * 80, w = 3 + r() * 10, v = Math.floor(70 + r() * 116);
      for (const [dx, dy] of [[0, 0], [1024, 0], [-1024, 0], [0, 1024], [0, -1024]]) {
        if (Math.abs(x + dx - 512) > 512 + l || Math.abs(y + dy - 512) > 512 + l) continue;
        g.save(); g.translate(x + dx, y + dy); g.rotate(a); g.globalAlpha = .06 + r() * .12; g.fillStyle = `rgb(${v},${v},${v})`;
        g.beginPath(); g.ellipse(0, 0, l, w, 0, 0, TAU); g.fill(); g.restore();
      }
    }
  });
  const SM = makeCanvas(240, 135, () => {}), sg = SM.getContext('2d');
  let pat = null;
  return {
    STROKES,
    /** acabamento pintado do quadro inteiro (o: { bloom, strokes, grade }) */
    post(ctx, o = {}) {
      if (QUALITY.low || CONFIG.motion.paint === 0) return;
      const k = CONFIG.motion.paint == null ? 1 : CONFIG.motion.paint;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
      // bloom: o quadro reduzido, "elevado ao cubo" (só o que é claro sobrevive), somado de volta borrado
      sg.globalCompositeOperation = 'copy'; sg.drawImage(ctx.canvas, 0, 0, 240, 135);
      sg.globalCompositeOperation = 'multiply'; sg.drawImage(SM, 0, 0); sg.drawImage(SM, 0, 0);
      ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = (o.bloom == null ? .55 : o.bloom) * k; ctx.imageSmoothingEnabled = true; ctx.drawImage(SM, 0, 0, W, H);
      // gradação: luz quente no alto à esquerda, sombra fria embaixo à direita
      ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = (o.grade == null ? .38 : o.grade) * k;
      const g = ctx.createLinearGradient(0, 0, W * .7, H * 1.1); g.addColorStop(0, '#FFB878'); g.addColorStop(.5, '#808080'); g.addColorStop(1, '#25415E');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // pinceladas
      if (!pat) pat = ctx.createPattern(STROKES, 'repeat');
      ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = (o.strokes == null ? .55 : o.strokes) * k; ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  };
})();

/** atmosfera: fachos de luz volumétrica e poeira flutuando (o: { light: 'warm'|'cool', shafts, dust, alpha, from }) */
function atmos(ctx, t, o = {}) {
  const A = o.alpha == null ? 1 : o.alpha; if (A <= 0) return;
  const warm = o.light !== 'cool', col = warm ? '#FFC98A' : '#9FD0FF', fx = o.from == null ? 260 : o.from;
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  // fachos: trapézios do alto à esquerda, respirando devagar
  const n = o.shafts == null ? 3 : o.shafts;
  for (let k = 0; k < n; k++) {
    const x0 = fx + k * 230, w0 = 60 + k * 30, ang = .55 + k * .08, len = 1500, br = .5 + .5 * Math.sin(t * .35 + k * 1.7);
    const x1 = x0 + Math.tan(ang) * len, w1 = w0 * 4.5;
    const g = ctx.createLinearGradient(x0, 0, x1, len); g.addColorStop(0, rgba(col, (.16 + .06 * br) * A)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - w0 / 2, -10); ctx.lineTo(x0 + w0 / 2, -10); ctx.lineTo(x1 + w1 / 2, len); ctx.lineTo(x1 - w1 / 2, len); ctx.closePath(); ctx.fill();
  }
  // poeira: partículas iluminadas subindo devagar (mais brilhantes dentro dos fachos)
  const d = o.dust == null ? 46 : o.dust;
  for (let k = 0; k < d; k++) {
    const sx = hash(k * 3.7), sy = hash(k * 9.1), sp = .006 + hash(k * 1.3) * .012, z = .4 + hash(k * 5.5) * .9;
    const x = ((sx * W + Math.sin(t * .3 + k) * 40 + t * 8 * z) % (W + 40) + W + 40) % (W + 40) - 20, y = ((sy - t * sp) % 1 + 1) % 1 * H;
    const tw = .5 + .5 * Math.sin(t * (1 + hash(k) * 2) + k * 2.1);
    ctx.fillStyle = rgba(col, (.25 + .45 * tw) * A); ctx.beginPath(); ctx.arc(x, y, 1.2 + 2.2 * z, 0, TAU); ctx.fill();
  }
  // bokeh: discos grandes fora de foco
  for (let k = 0; k < (o.bokeh == null ? 5 : o.bokeh); k++) {
    const x = hash(k * 11.3) * W + Math.sin(t * .2 + k) * 30, y = hash(k * 4.9) * H * .8, r = 40 + hash(k * 2.2) * 70, a = (.05 + .05 * Math.sin(t * .5 + k)) * A;
    const g = ctx.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(.85, rgba(col, a * .7)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

/* ---------- volume: luz principal do alto à esquerda, recorte laranja do lado oposto ---------- */
const LIGHT = { hi: '#FFF3DE', lo: '#140B07', rim: '#FF8A3D' };
/** esfera pintada */
function vball(ctx, x, y, r, col, o = {}) {
  const g = ctx.createRadialGradient(x - r * .38, y - r * .42, r * .08, x, y, r * 1.02);
  g.addColorStop(0, mix(col, LIGHT.hi, .5)); g.addColorStop(.5, col); g.addColorStop(1, mix(col, LIGHT.lo, .55));
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = g; ctx.fill();
  if (o.rim !== false) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r - Math.max(1.5, r * .05), .1, 1.5); ctx.strokeStyle = rgba(o.rimCol || LIGHT.rim, .75); ctx.lineWidth = Math.max(2, r * .1); ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  if (o.ink !== false) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.strokeStyle = INK; ctx.lineWidth = o.lw || Math.max(2, r * .07); ctx.stroke(); }
}
/** membro cilíndrico: traço grosso com sombra, realce do lado da luz e contorno */
function vlimb(ctx, x1, y1, x2, y2, w, col, o = {}) {
  ctx.save(); ctx.lineCap = 'round';
  if (o.ink !== false) { ctx.strokeStyle = INK; ctx.lineWidth = w + (o.lw || 5); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  ctx.strokeStyle = mix(col, LIGHT.lo, .3); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L, s = (nx + ny < 0 ? 1 : -1) * w * .2;
  ctx.strokeStyle = mix(col, LIGHT.hi, .22); ctx.lineWidth = w * .5; ctx.beginPath(); ctx.moveTo(x1 + nx * s, y1 + ny * s); ctx.lineTo(x2 + nx * s, y2 + ny * s); ctx.stroke();
  ctx.restore();
}
/** bloco 2.5D: face da frente + topo e lateral em perspectiva (d = profundidade) */
function vslab(ctx, x, y, w, h, d, col, o = {}) {
  const dx = d * .7, dy = -d * .5;
  ctx.save(); ctx.lineJoin = 'round';
  const face = (pts, c) => { ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = o.lw || 3; ctx.stroke(); };
  face([[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]], mix(col, LIGHT.hi, .3));
  face([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]], mix(col, LIGHT.lo, .35));
  const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, mix(col, LIGHT.hi, .12)); g.addColorStop(1, mix(col, LIGHT.lo, .15));
  face([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], g);
  ctx.restore();
}
/** cone de luz de uma lâmpada (aditivo) */
function lightCone(ctx, x, y, w0, w1, len, col, a) {
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'screen';
  const g = ctx.createLinearGradient(x, y, x, y + len); g.addColorStop(0, rgba(col, .45 * a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w0 / 2, y); ctx.lineTo(x + w0 / 2, y); ctx.lineTo(x + w1 / 2, y + len); ctx.lineTo(x - w1 / 2, y + len); ctx.closePath(); ctx.fill();
  ctx.restore();
}
