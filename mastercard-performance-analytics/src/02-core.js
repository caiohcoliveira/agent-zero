/* ============================================================================
   2. CORE — matemática, easing, cores, primitivas de desenho, câmera, fundos
   ========================================================================== */
const C = CONFIG.colors, F = CONFIG.fonts, M = CONFIG.motion;
const TAU = Math.PI * 2;

// ---------- matemática ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, v) => (b === a ? 0 : (v - a) / (b - a));
/** progresso 0..1 de `t` dentro de [start, start+dur], com easing opcional */
const P = (t, start, dur, ease) => { const p = clamp((t - start) / dur); return ease ? ease(p) : p; };
/** janela: sobe em [a, a+fi], fica 1, desce em [b-fo, b] */
const win = (t, a, b, fi = 0.3, fo = 0.3) => Math.min(P(t, a, fi, E.outCubic), 1 - P(t, b - fo, fo, E.inCubic));
const twos = t => (M.onTwos ? Math.floor(t * CONFIG.fps / 2) / (CONFIG.fps / 2) : t);

const E = {
  linear: x => x,
  inQuad: x => x * x, outQuad: x => 1 - (1 - x) * (1 - x),
  inCubic: x => x * x * x, outCubic: x => 1 - Math.pow(1 - x, 3),
  inOutCubic: x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outQuart: x => 1 - Math.pow(1 - x, 4),
  inExpo: x => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
  outExpo: x => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inOutExpo: x => (x === 0 ? 0 : x === 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
  outBack: x => { if (x <= 0) return 0; if (x >= 1) return 1; const c1 = 1.70158 * M.intensity, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outElastic: x => (x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (TAU / 3)) + 1),
  smooth: x => x * x * (3 - 2 * x)
};

// ---------- aleatoriedade determinística (seek perfeito) ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const noise1 = (x) => { const i = Math.floor(x), f = x - i; return lerp(hash(i), hash(i + 1), E.smooth(f)) * 2 - 1; };

// ---------- cores ----------
const _rgbCache = {};
function rgb(hex) {
  if (_rgbCache[hex]) return _rgbCache[hex];
  if (hex.startsWith('rgb')) { const m = hex.match(/[\d.]+/g).map(Number); return (_rgbCache[hex] = [m[0], m[1], m[2]]); }
  const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return (_rgbCache[hex] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]);
}
const rgba = (hex, a = 1) => { const [r, g, b] = rgb(hex); return `rgba(${r},${g},${b},${a})`; };
function mix(h1, h2, t) {
  const a = rgb(h1), b = rgb(h2);
  return `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
}
/** rampa de calor (propensão): grafite → amarelo → laranja → vermelho */
function heat(v) {
  v = clamp(v);
  if (v < .35) return mix('#2A2622', C.yellow, v / .35);
  if (v < .7) return mix(C.yellow, C.orange, (v - .35) / .35);
  return mix(C.orange, C.red, (v - .7) / .3);
}

// ---------- primitivas ----------
function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2); ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function circle(ctx, x, y, r, fill, stroke, lw = 2) {
  ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
function line(ctx, x1, y1, x2, y2, color, lw = 2, dash) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = lw;
  if (dash) ctx.setLineDash(dash); ctx.stroke(); if (dash) ctx.setLineDash([]);
}
/** brilho suave (gradiente radial — muito mais barato que shadowBlur) */
function glow(ctx, x, y, r, color, a = 1) {
  if (a <= 0 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(.35, rgba(color, a * .35)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function shadowed(ctx, blur, color, oy, fn) {
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy; fn(); ctx.restore();
}
/** curva por pontos (Catmull-Rom → Bézier) */
function smoothPath(ctx, pts) {
  if (pts.length < 2) return; ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
}
function arrowHead(ctx, x, y, ang, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-s, -s * .55); ctx.lineTo(-s, s * .55); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}

// ---------- texto ----------
function font(size, weight = 700, fam = F.sans) { return `${weight} ${size}px ${fam}`; }
function text(ctx, str, x, y, o = {}) {
  ctx.save();
  ctx.font = font(o.size || 32, o.weight || 700, o.mono ? F.mono : F.sans);
  ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
  if ('letterSpacing' in ctx) ctx.letterSpacing = (o.ls || 0) + 'px';
  ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha); ctx.fillStyle = o.color || C.white;
  const lines = String(str).split('\n'), lh = (o.size || 32) * (o.lh || 1.18);
  const y0 = y - (lines.length - 1) * lh / 2 * (o.base === 'top' ? 0 : 1);
  lines.forEach((l, i) => ctx.fillText(l, x, y0 + i * lh));
  ctx.restore();
}
function measure(ctx, str, size, weight = 700, mono = false, ls = 0) {
  ctx.save(); ctx.font = font(size, weight, mono ? F.mono : F.sans);
  if ('letterSpacing' in ctx) ctx.letterSpacing = ls + 'px';
  const w = ctx.measureText(str).width; ctx.restore(); return w;
}
/**
 * Texto cinético: palavras sobem com fade e leve escala, escalonadas.
 * `*palavra*` usa a cor de destaque. Retorna a largura total.
 */
function kinetic(ctx, str, x, y, t, o = {}) {
  const size = o.size || 96, weight = o.weight || 800, stag = o.stagger == null ? .07 : o.stagger;
  const dur = o.dur || .55, color = o.color || C.white, accent = o.accent || C.orange, ls = o.ls == null ? -size * .02 : o.ls;
  const words = str.split(' ').map(w => { const hi = /\*/.test(w); return { w: w.replace(/\*/g, ''), hi }; });
  const sp = measure(ctx, ' ', size, weight, false, ls);
  const widths = words.map(w => measure(ctx, w.w, size, weight, false, ls));
  const total = widths.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let cx = o.align === 'left' ? x : o.align === 'right' ? x - total : x - total / 2;
  const out = o.out == null ? Infinity : o.out;
  words.forEach((wd, i) => {
    const p = P(t, i * stag, dur, E.outExpo), q = P(t, out + i * stag * .5, .35, E.inCubic);
    const a = p * (1 - q);
    if (a > 0.001) {
      ctx.save(); ctx.globalAlpha *= a;
      const dy = (1 - p) * size * .45 - q * size * .3, s = lerp(.92, 1, p);
      ctx.translate(cx + widths[i] / 2, y + dy); ctx.scale(s, s);
      (o.retro ? retroText : text)(ctx, wd.w, 0, 0, { size, weight, color: wd.hi ? accent : color, align: 'center', ls, shadow: o.shadow, depth: o.depth, lw: o.lw });
      ctx.restore();
    }
    cx += widths[i] + sp;
  });
  return total;
}
/** revela texto com uma varredura de luz da esquerda para a direita */
function scanText(ctx, str, x, y, p, o = {}) {
  const size = o.size || 96, w = measure(ctx, str, size, o.weight || 800, false, o.ls || 0);
  const x0 = x - w / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 20, y - size, (w + 40) * clamp(p), size * 2); ctx.clip();
  text(ctx, str, x, y, { ...o, size, align: 'center' }); ctx.restore();
  if (p > 0 && p < 1) { const sx = x0 + (w + 40) * p - 20; glow(ctx, sx, y, size * 1.1, o.scan || C.orange, .9); line(ctx, sx, y - size * .6, sx, y + size * .6, rgba('#fff', .9), 3); }
}

// ---------- câmera ----------
/** cam = { x, y, z (zoom), r (rotação) } — (x,y) é o ponto do mundo no centro da tela */
function camera(ctx, cam, fn) {
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam.z || 1, cam.z || 1); ctx.rotate(cam.r || 0);
  ctx.translate(-(cam.x == null ? W / 2 : cam.x), -(cam.y == null ? H / 2 : cam.y)); fn(); ctx.restore();
}
const IMPACTS = []; // preenchido pelos cues 'impact' (tremor de câmera)
function shakeAt(T) {
  let x = 0, y = 0, r = 0;
  for (const im of IMPACTS) {
    const d = T - im.t; if (d < 0 || d > .6) continue;
    const a = im.size * 14 * M.shake * M.intensity * Math.pow(1 - d / .6, 2);
    x += noise1(T * 38 + im.t) * a; y += noise1(T * 41 + im.t + 9) * a; r += noise1(T * 30 + im.t + 3) * a * .0009;
  }
  return { x, y, r };
}

// ---------- fundos ----------
function bgDark(ctx, t, o = {}) {
  ctx.drawImage(TEX.dark, 0, 0);
  if (o.base && o.base !== C.ink) { ctx.save(); ctx.globalAlpha = o.baseA == null ? .72 : o.baseA; ctx.fillStyle = o.base; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const g = ctx.createRadialGradient(W / 2, H * .45, 50, W / 2, H / 2, W * .75);
  g.addColorStop(0, rgba(o.center || '#2B2622', o.centerA == null ? .9 : o.centerA * .85)); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (o.grid) dotGrid(ctx, t, rgba('#FFFFFF', .05), o.drift);
}
function bgLight(ctx, t, o = {}) {
  ctx.drawImage(TEX.light, 0, 0);
  if (o.base) { ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = o.base; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  if (o.grid) {
    ctx.save(); ctx.strokeStyle = 'rgba(26,23,20,0.05)'; ctx.lineWidth = 1; const s = 80, off = ((o.drift || 0) * t) % s;
    ctx.beginPath(); for (let x = -s + off; x < W + s; x += s) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = 0; y < H; y += s) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke(); ctx.restore();
  }
}
function dotGrid(ctx, t, color, drift = 6) {
  ctx.save(); ctx.fillStyle = color; const s = 48, off = (t * drift) % s;
  for (let y = (off % s) - s; y < H + s; y += s) for (let x = -s + off; x < W + s; x += s) ctx.fillRect(x, y, 2, 2);
  ctx.restore();
}
/** granulação de filme pré-renderizada (premium, barata) */
const GRAIN = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
  const img = g.createImageData(256, 256), r = rng(7);
  for (let i = 0; i < img.data.length; i += 4) { const v = r() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0); return cv;
})();
function grain(ctx, T) {
  if (!M.grain) return;
  ctx.save(); ctx.globalAlpha = M.grain; ctx.globalCompositeOperation = 'overlay';
  const ox = Math.floor(hash(Math.floor(T * 15)) * 256), oy = Math.floor(hash(Math.floor(T * 15) + 5) * 256);
  ctx.translate(-ox, -oy); ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.fillRect(0, 0, W + 256, H + 256); ctx.restore();
}
function vignette(ctx, a = .35) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function flash(ctx, a, color = '#FFFFFF') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore(); }
