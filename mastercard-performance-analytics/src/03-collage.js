/* ============================================================================
   2b. COLLAGE — linguagem visual retrô-moderna com identidade Mastercard
   Papel com fibras, recortes com contorno de tinta, sombras chapadas (sem blur),
   meio-tom, fita adesiva, stickers, tiras de fórmula — e a camada FUTURISTA
   (grid neon em perspectiva, sol listrado, scanlines, painéis holográficos)
   usada quando o assunto é modelo.
   ========================================================================== */
const INK = '#1A1714', PAPER = '#F3EBDD';

function makeCanvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; }

/** textura de papel pré-renderizada (uma vez) */
function paperTexture(base, fiber, dots, dotA, vig, seed) {
  return makeCanvas(W, H, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const img = g.getImageData(0, 0, w, h), d = img.data, r = rng(seed);
    for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 16; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    g.putImageData(img, 0, 0);
    const r2 = rng(seed + 1); g.lineWidth = 1;
    for (let k = 0; k < 1500; k++) { const x = r2() * w, y = r2() * h, a = r2() * TAU, l = 6 + r2() * 24;
      g.strokeStyle = rgba(fiber, .04 + r2() * .06); g.beginPath(); g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(a + .7) * l * .5, y + Math.sin(a + .7) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    g.fillStyle = rgba(dots, dotA);
    [[0, 0, 640], [w, h, 640], [w, 0, 360]].forEach(([cx, cy, R]) => {
      for (let y = 0; y < h; y += 14) for (let x = (y / 14) % 2 ? 7 : 0; x < w; x += 14) {
        const dd = Math.hypot(x - cx, y - cy); if (dd > R) continue; g.beginPath(); g.arc(x, y, (1 - dd / R) * 5, 0, TAU); g.fill(); } });
    const gr = g.createRadialGradient(w / 2, h / 2, h * .35, w / 2, h / 2, w * .72);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(40,20,0,${vig})`); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
}
const TEX = {
  light: paperTexture(PAPER, '#7A5C3A', INK, .075, .16, 909),
  dark: paperTexture('#16130F', '#E8D9BF', '#4A3D30', .55, .5, 919)
};
/** sombreamento em meio-tom (pontos crescem na diagonal) — desenhado recortado dentro das formas */
const SHADE = makeCanvas(400, 400, (g, w, h) => { g.fillStyle = '#000';
  for (let y = 0; y < h; y += 11) for (let x = (y / 11) % 2 ? 5.5 : 0; x < w; x += 11) { const k = clamp((x + y) / (w + h) * 1.7 - .5); if (k <= 0) continue; g.beginPath(); g.arc(x, y, k * 4.8, 0, TAU); g.fill(); } });
const SCAN = makeCanvas(4, 4, g => { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, 0, 4, 1); });
let _scanPat = null;
function scanlines(ctx, a = .25) {
  if (QUALITY.low) return; if (a <= 0) return; if (!_scanPat) _scanPat = ctx.createPattern(SCAN, 'repeat'); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = _scanPat; ctx.fillRect(0, 0, W, H); ctx.restore(); }

/** retângulo de papel rasgado (bordas irregulares determinísticas) */
function tornRect(ctx, x, y, w, h, seed = 1, amp = 2.5, step = 16) {
  ctx.beginPath(); let i = 0; const j = () => (hash(seed * 97 + i++) - .5) * 2 * amp;
  for (let px = x; px < x + w; px += step) ctx.lineTo(px, y + j());
  for (let py = y; py < y + h; py += step) ctx.lineTo(x + w + j(), py);
  for (let px = x + w; px > x; px -= step) ctx.lineTo(px, y + h + j());
  for (let py = y + h; py > y; py -= step) ctx.lineTo(x + j(), py);
  ctx.closePath();
}
function tape(ctx, x, y, w = 90, h = 30, rot = 0, seed = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); tornRect(ctx, -w / 2, -h / 2, w, h, seed + 50, 1.6, 6);
  ctx.fillStyle = 'rgba(238,224,188,.8)'; ctx.fill(); ctx.strokeStyle = 'rgba(120,100,70,.25)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
/**
 * pedaço de papel recortado: sombra chapada + preenchimento + meio-tom + contorno de tinta
 * o: { fill, r, torn, seed, amp, shadow, shadowColor, outline (false = sem), lw, halftone (0..1), tape: [[fx, fy, rot]] }
 */
function paper(ctx, x, y, w, h, o = {}) {
  const sh = o.shadow == null ? 8 : o.shadow;
  const path = () => (o.torn ? tornRect(ctx, x, y, w, h, o.seed || 1, o.amp || 2.5) : rr(ctx, x, y, w, h, o.r == null ? 10 : o.r));
  if (sh) { ctx.save(); ctx.translate(sh, sh * 1.15); path(); ctx.fillStyle = o.shadowColor || rgba(INK, .9); ctx.fill(); ctx.restore(); }
  path(); ctx.fillStyle = o.fill || '#FFFDF8'; ctx.fill();
  if (o.halftone) { ctx.save(); path(); ctx.clip(); ctx.globalAlpha *= o.halftone; ctx.drawImage(SHADE, x, y, w, h); ctx.restore(); }
  if (o.outline !== false) { path(); ctx.strokeStyle = o.outline || INK; ctx.lineWidth = o.lw || 3; ctx.lineJoin = 'round'; ctx.stroke(); }
  if (o.tape) o.tape.forEach(([fx, fy, rot], k) => tape(ctx, x + fx * w, y + fy * h, 90, 28, rot, (o.seed || 1) + k));
}
/** texto de pôster retrô: sombra deslocada + contorno + preenchimento */
function retroText(ctx, str, x, y, o = {}) {
  const size = o.size || 96, weight = o.weight || 900, d = o.depth == null ? size * .07 : o.depth, lw = o.lw == null ? Math.max(2, size * .045) : o.lw;
  ctx.save(); ctx.font = font(size, weight, o.mono ? F.mono : F.sans); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) ctx.letterSpacing = (o.ls || 0) + 'px'; ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.lineJoin = 'round';
  if (d) { ctx.fillStyle = ctx.strokeStyle = o.shadow || INK; ctx.lineWidth = lw * 2; if (lw) ctx.strokeText(str, x + d, y + d); ctx.fillText(str, x + d, y + d); }
  if (lw) { ctx.strokeStyle = o.outline || INK; ctx.lineWidth = lw * 2; ctx.strokeText(str, x, y); }
  ctx.fillStyle = o.color || '#FFF'; ctx.fillText(str, x, y); ctx.restore();
}
/** texto neon (camada futurista) */
function neonText(ctx, str, x, y, o = {}) {
  ctx.save(); ctx.font = font(o.size || 40, o.weight || 700, o.mono ? F.mono : F.sans); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) ctx.letterSpacing = (o.ls || 0) + 'px'; ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
  ctx.shadowColor = o.glow || C.orange; ctx.shadowBlur = o.blur || 16; ctx.fillStyle = o.color || '#FFE9D6'; ctx.fillText(str, x, y); ctx.shadowBlur = 0; ctx.fillText(str, x, y); ctx.restore();
}
/** tira de fórmula (easter egg técnico): papel rasgado com fita, ou etiqueta neon */
function formula(ctx, str, x, y, o = {}) {
  const size = o.size || 22, w = measure(ctx, str, size, 600, true) + size * 1.5, h = size * 2.1, s = o.scale == null ? 1 : o.scale;
  if ((o.alpha == null ? 1 : o.alpha) <= 0 || s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
  if (o.neon) { holo(ctx, -w / 2, -h / 2, w, h, { color: o.color || C.orange, corners: false }); neonText(ctx, str, 0, 1, { size, weight: 600, mono: true, align: 'center', glow: o.color || C.orange }); }
  else { paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: o.seed || 3, fill: o.fill || '#FFFDF6', shadow: 5, lw: 2 });
    text(ctx, str, 0, 1, { size, weight: 600, mono: true, color: INK, align: 'center' }); if (o.tape !== false) tape(ctx, -w / 2 + 14, -h / 2 + 2, 44, 16, -.55, (o.seed || 3) + 9); }
  ctx.restore();
}

// ---------- decoração de colagem (recortes nas bordas, deriva lenta) ----------
function scrap(ctx, kind, s, col, dark, seed) {
  const out = dark ? '#000' : INK, sh = dark ? 'rgba(0,0,0,.65)' : rgba(INK, .85);
  const shape = (pathFn, fill) => { ctx.save(); ctx.translate(7, 8); pathFn(); ctx.fillStyle = sh; ctx.fill(); ctx.restore(); pathFn(); ctx.fillStyle = fill; ctx.fill();
    ctx.save(); pathFn(); ctx.clip(); ctx.globalAlpha *= .25; ctx.drawImage(SHADE, -s, -s, s * 2, s * 2); ctx.restore(); pathFn(); ctx.strokeStyle = out; ctx.lineWidth = 3; ctx.stroke(); };
  switch (kind) {
    case 0: shape(() => { ctx.beginPath(); ctx.arc(0, 0, s * .5, 0, TAU); }, col); break;
    case 1: shape(() => { ctx.beginPath(); ctx.arc(0, 0, s * .55, Math.PI, 0); ctx.closePath(); }, col); break;
    case 2: ctx.beginPath(); ctx.arc(0, 0, s * .42, 0, TAU); ctx.strokeStyle = out; ctx.lineWidth = s * .16; ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = s * .1; ctx.stroke(); break;
    case 3: shape(() => tornRect(ctx, -s * .8, -s * .15, s * 1.6, s * .3, seed, 2.5), col);
      ctx.save(); tornRect(ctx, -s * .8, -s * .15, s * 1.6, s * .3, seed, 2.5); ctx.clip(); ctx.strokeStyle = rgba(INK, .35); ctx.lineWidth = 3;
      for (let i = -s; i < s; i += 12) { ctx.beginPath(); ctx.moveTo(i, -s * .2); ctx.lineTo(i + s * .3, s * .2); ctx.stroke(); } ctx.restore(); break;
    case 4: ctx.fillStyle = dark ? 'rgba(243,235,221,.45)' : rgba(INK, .5); for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.arc((i - 2) * s * .16, (j - 2) * s * .16, s * .035, 0, TAU); ctx.fill(); } break;
    case 5: shape(() => { ctx.beginPath(); ctx.moveTo(0, -s * .5); ctx.lineTo(s * .45, s * .35); ctx.lineTo(-s * .45, s * .35); ctx.closePath(); }, col); break;
  }
}
/** o: { seed, n, theme, alpha, rect: zona central a evitar } */
function collage(ctx, t, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return;
  const r = rng(o.seed || 1), n = o.n || 7, dark = o.theme === 'dark', cols = [C.red, C.yellow, C.orange, dark ? '#3A3027' : PAPER];
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const side = k % 4, u = r(), kind = Math.floor(r() * 6), col = cols[Math.floor(r() * cols.length)], s = 70 + r() * 130, rot0 = r() * TAU, sp = (r() - .5) * .22, ph = r() * TAU;
    let x = side === 0 ? -30 + r() * 150 : side === 1 ? W - 120 + r() * 150 : 160 + u * (W - 320);
    let y = side >= 2 ? (side === 2 ? -30 + r() * 110 : H - 80 + r() * 110) : 140 + u * (H - 280);
    x += Math.sin(t * .3 + ph) * 16; y += Math.cos(t * .27 + ph) * 12;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot0 + t * sp); scrap(ctx, kind, s, col, dark, k + (o.seed || 1) * 13); ctx.restore();
  }
  ctx.restore();
}

// ---------- camada futurista ----------
/** sol retrô listrado (o círculo Mastercard em versão synthwave) */
function sun(ctx, x, y, R, t) {
  glow(ctx, x, y - R * .3, R * 1.7, C.orange, .35);
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, Math.PI, 0); ctx.closePath(); ctx.clip();
  const g = ctx.createLinearGradient(0, y - R, 0, y); g.addColorStop(0, C.yellow); g.addColorStop(.55, C.orange); g.addColorStop(1, C.red); ctx.fillStyle = g; ctx.fillRect(x - R, y - R, R * 2, R);
  ctx.fillStyle = '#0B0807'; const st = R * .09; for (let k = 0; k < 7; k++) { const yy = y - R * .5 + k * st + ((t * 14) % st); ctx.fillRect(x - R, yy, R * 2, 1.5 + k * 1.9); }
  ctx.restore();
}
/** grid neon em perspectiva (chão synthwave) */
function neonGrid(ctx, t, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return;
  const hz = o.horizon || 640, col = o.color || C.orange;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, hz - 280, 0, hz + 4); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, .3)); ctx.fillStyle = g; ctx.fillRect(0, hz - 280, W, 284);
  if (o.sun) sun(ctx, W / 2, hz, o.sun, t);
  ctx.save(); ctx.beginPath(); ctx.rect(0, hz, W, H - hz); ctx.clip(); ctx.fillStyle = 'rgba(9,6,5,.88)'; ctx.fillRect(0, hz, W, H - hz);
  ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.beginPath();
  for (let i = -26; i <= 26; i++) { ctx.moveTo(W / 2 + i * 24, hz); ctx.lineTo(W / 2 + i * 300, H + 60); }
  const sp = (t * (o.speed || .7)) % 1; for (let k = 0; k < 16; k++) { const y = hz + (H - hz) * Math.pow((k + 1 - sp) / 16, 2.3); ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke(); ctx.restore();
  const f = ctx.createLinearGradient(0, hz, 0, hz + 140); f.addColorStop(0, 'rgba(9,6,5,.95)'); f.addColorStop(1, 'rgba(9,6,5,0)'); ctx.fillStyle = f; ctx.fillRect(0, hz, W, 140);
  line(ctx, 0, hz, W, hz, rgba('#FFD9B0', .8), 2);
  ctx.restore();
}
/** painel holográfico: vidro escuro, borda neon, cantoneiras, scanlines */
function holo(ctx, x, y, w, h, o = {}) {
  const col = o.color || C.orange, a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  rr(ctx, x, y, w, h, 10); ctx.fillStyle = o.fill || 'rgba(14,10,8,.8)'; ctx.fill();
  ctx.save(); rr(ctx, x, y, w, h, 10); ctx.clip(); const gr = ctx.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, rgba(col, .14)); gr.addColorStop(1, rgba(C.yellow, .02)); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(255,255,255,.035)'; for (let yy = y; yy < y + h; yy += 4) ctx.fillRect(x, yy, w, 1); ctx.restore();
  ctx.shadowColor = col; ctx.shadowBlur = 14; rr(ctx, x, y, w, h, 10); ctx.strokeStyle = rgba(col, .95); ctx.lineWidth = 2; ctx.stroke(); ctx.shadowBlur = 0;
  if (o.corners !== false) { const c = 16; ctx.strokeStyle = '#FFE2C4'; ctx.lineWidth = 3;
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => { ctx.beginPath(); ctx.moveTo(cx + sx * c, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * c); ctx.stroke(); }); }
  if (o.title) text(ctx, o.title, x + 18, y + 22, { size: 15, weight: 700, mono: true, color: col, ls: 2 });
  ctx.restore();
}
