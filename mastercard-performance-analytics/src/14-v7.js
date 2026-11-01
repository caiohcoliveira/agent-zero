/* ============================================================================
   14. V7 · CADA TELA SE EXPLICA SOZINHA
   ----------------------------------------------------------------------------
   • TY / LAY: tipografia e grade fixas (título 58 px, explicação 36, rótulos 28).
   • HUD: o texto é desenhado DEPOIS do acabamento pintado, então fica nítido;
     a pintura fica nas superfícies. late() prende o texto ao visual (mesma câmera);
     hud() desenha em coordenadas de tela (parado durante a leitura).
   • SAY: o roteiro de tela de cada cena: etiqueta + título no topo, explicação
     junto ao visual, conclusão embaixo. Tudo fica registrado para o medidor de
     leitura (tools/read_check.js: até 2,5 palavras/s + tempo para ler cada visual).
   • LINE: a linha laranja, o trilho pintado que atravessa as cenas, com o trem na ponta.
   • camKey / layer: câmera 2.5D por quadros-chave, com paralaxe por profundidade.
   ========================================================================== */
const TY = { kicker: 22, title: 56, body: 36, label: 28, concl: 40, note: 26 };
const LAY = { x: 96, kickerY: 84, titleY: 150, conclY: 992, bodyX: 1196, bodyY: 300, bodyW: 628 };

/* ---------- texto nítido: fila desenhada depois do acabamento pintado ---------- */
const HUD = {
  st: [],
  begin() { this.st.push([]); },
  add(ctx, fn) { const q = this.st[this.st.length - 1]; if (q) q.push(fn); else { ctx.save(); fn(ctx); ctx.restore(); } },
  flush(ctx) {
    const q = this.st.pop() || [];
    for (const fn of q) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; fn(ctx); ctx.restore(); }
  },
  reset() { this.st = []; }
};
/** desenha depois do acabamento, preso ao visual (mesma transformação e opacidade de agora) */
function late(ctx, fn) { const m = ctx.getTransform(), a = ctx.globalAlpha; HUD.add(ctx, c => { c.setTransform(m); c.globalAlpha = a; fn(c); }); }
/** desenha depois do acabamento na posição de tela do ponto (x, y) do mundo, sem a escala da câmera (texto sempre do mesmo tamanho) */
function pin(ctx, x, y, fn) { const p = ctx.getTransform().transformPoint(new DOMPoint(x, y)), a = ctx.globalAlpha; HUD.add(ctx, c => { c.setTransform(1, 0, 0, 1, p.x, p.y); c.globalAlpha = a; fn(c); }); }
const camScale = ctx => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b); };
/** desenha depois do acabamento, em coordenadas de tela */
function hud(ctx, fn, a = 1) { HUD.add(ctx, c => { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a; fn(c); }); }

/* ---------- parágrafos com *destaques* (quebra por largura, com cache) ---------- */
const _wrapCache = new Map();
function wrapRich(ctx, str, maxW, size, weight = 700) {
  const key = str + '|' + size + '|' + weight + '|' + Math.round(maxW);
  let L = _wrapCache.get(key); if (L) return L;
  ctx.save(); ctx.font = font(size, weight); if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  const words = []; let hi = false, segs = [], buf = '';
  const seg = () => { if (buf) { segs.push({ s: buf, hi }); buf = ''; } };
  const word = br => { seg(); if (segs.length) words.push({ segs, br }); else if (br && words.length) words[words.length - 1].br = true; segs = []; };
  for (const ch of String(str)) { if (ch === '*') { seg(); hi = !hi; } else if (ch === ' ') word(false); else if (ch === '\n') word(true); else buf += ch; }
  word(false);
  const sp = ctx.measureText(' ').width;
  words.forEach(w => { w.segs.forEach(s => { s.w = ctx.measureText(s.s).width; }); w.w = w.segs.reduce((a, s) => a + s.w, 0); });
  const lines = []; let cur = [], cw = 0;
  words.forEach(w => {
    const nw = cur.length ? cw + sp + w.w : w.w;
    if (cur.length && nw > maxW) { lines.push({ words: cur, w: cw }); cur = [w]; cw = w.w; } else { cur.push(w); cw = nw; }
    if (w.br) { lines.push({ words: cur, w: cw }); cur = []; cw = 0; }
  });
  if (cur.length) lines.push({ words: cur, w: cw });
  ctx.restore();
  L = { lines, sp, w: Math.max(0, ...lines.map(l => l.w)) };
  if (_wrapCache.size > 900) _wrapCache.clear();
  _wrapCache.set(key, L); return L;
}
/** parágrafo: (x, y) = canto de cima; devolve a altura usada. o: { size, weight, color, accent, align, lh } */
function para(ctx, str, x, y, maxW, o = {}) {
  const size = o.size || TY.body, weight = o.weight || 700, lh = size * (o.lh || 1.24), L = wrapRich(ctx, str, maxW, size, weight);
  ctx.save(); ctx.font = font(size, weight); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  L.lines.forEach((ln, i) => {
    let cx = o.align === 'center' ? x - ln.w / 2 : o.align === 'right' ? x - ln.w : x; const cy = y + lh * (i + .5);
    ln.words.forEach(w => { w.segs.forEach(s => { ctx.fillStyle = s.hi ? (o.accent || C.yellow) : (o.color || '#FFF'); ctx.fillText(s.s, cx, cy); cx += s.w; }); cx += L.sp; });
  });
  ctx.restore(); return L.lines.length * lh;
}
const wordCount = s => String(s || '').replace(/\*/g, '').split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;

/* ---------- painel de explicação e etiquetas legíveis ---------- */
function panel(ctx, x, y, w, h, o = {}) {
  const dark = o.dark !== false;
  rr(ctx, x + 8, y + 10, w, h, 18); ctx.fillStyle = 'rgba(0,0,0,.42)'; ctx.fill();
  rr(ctx, x, y, w, h, 18); ctx.fillStyle = dark ? 'rgba(17,13,11,.93)' : 'rgba(255,252,246,.97)'; ctx.fill();
  ctx.strokeStyle = dark ? 'rgba(255,233,214,.3)' : INK; ctx.lineWidth = 3; ctx.stroke();
  rr(ctx, x + 12, y + 20, 7, h - 40, 4); ctx.fillStyle = o.accent || C.orange; ctx.fill();
}
/** etiqueta (pílula) com texto legível, centrada em (x, y) */
function tag(ctx, x, y, s, o = {}) {
  const size = o.size || 26, w = measure(ctx, s, size, o.weight || 800) + size * 1.3, h = size * 1.72;
  ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
  if (o.shadow !== false) { rr(ctx, x - w / 2 + 3, y - h / 2 + 4, w, h, h / 2); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill(); }
  rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = o.fill || '#F6EEDF'; ctx.fill(); ctx.strokeStyle = o.stroke || INK; ctx.lineWidth = 2.5; ctx.stroke();
  text(ctx, s, x, y + 1, { size, weight: o.weight || 800, color: o.color || INK, align: 'center' }); ctx.restore(); return w;
}

/* ---------- SAY: o roteiro de tela ----------
   Cada entrada: [t0, t1, tipo, texto, opções] em tempo LOCAL da cena.
   tipos: kicker (etiqueta de contexto) · step (etapa do case) · title · body (explicação
   junto ao visual) · concl (conclusão embaixo) · big (frase central) · note (apoio pequeno)
   opções: { x, y, w, anchor: 'top'|'middle'|'bottom', label, visual: true (há um visual novo para ler) } */
const SAY = {
  all: [], _kx: null,
  reg(id, script) {
    script.forEach(r => { const o = r[4] || {};
      if (Array.isArray(r[3])) r[3].forEach((s, i) => this.all.push({ scene: id, t0: (o.at || [])[i] == null ? r[0] : o.at[i], t1: r[1], kind: r[2], text: s, visual: !!o.visual }));
      else this.all.push({ scene: id, t0: r[0], t1: r[1], kind: r[2], text: typeof r[3] === 'function' ? r[3]() : r[3], visual: !!o.visual }); });
    return script;
  },
  draw(ctx, t, script, theme = 'dark') {
    script.forEach(r => {
      const [t0, t1, kind, str, o = {}] = r, a = win(t, t0, t1, .35, .3); if (a <= 0 || !SAY[kind]) return;
      const dark = (o.theme || theme) !== 'light', e = E.outCubic(clamp((t - t0) / .45));
      hud(ctx, c => SAY[kind](c, typeof str === 'function' ? str() : str, o, dark, e, t), a);
    });
  },
  kicker(c, s, o, dark, e) {
    const w = measure(c, s, TY.kicker, 800, true, 3) + 40, x = o.x == null ? LAY.x : o.x, y = (o.y == null ? LAY.kickerY : o.y) - (1 - e) * 10;
    rr(c, x + 4, y - 14, w, 38, 6); c.fillStyle = 'rgba(0,0,0,.42)'; c.fill();
    rr(c, x, y - 19, w, 38, 6); c.fillStyle = o.col || C.red; c.fill();
    text(c, s, x + 20, y + 1, { size: TY.kicker, weight: 800, mono: true, color: o.ink ? INK : '#FFF', ls: 3 });
    SAY._kx = x + w + 14;
  },
  step(c, s, o, dark, e) {
    const w = measure(c, s, TY.kicker, 900, true, 3) + 44, x = (SAY._kx || LAY.x) + w / 2, y = LAY.kickerY, k = lerp(1.25, 1, E.outBack(e));
    c.translate(x, y); c.scale(k, k);
    rr(c, -w / 2 + 3, -15, w, 38, 19); c.fillStyle = 'rgba(0,0,0,.42)'; c.fill();
    rr(c, -w / 2, -19, w, 38, 19); c.fillStyle = o.col || C.orange; c.fill(); c.strokeStyle = '#FFF'; c.lineWidth = 2.5; c.stroke();
    text(c, s, 0, 1, { size: TY.kicker, weight: 900, mono: true, color: o.ink ? INK : '#FFF', align: 'center', ls: 3 });
  },
  title(c, s, o, dark, e) {
    const size = o.size || TY.title, maxW = o.w || 1250, x = o.x == null ? LAY.x : o.x, lh = size * 1.1, y = (o.y == null ? LAY.titleY : o.y) - lh / 2 + (1 - e) * 16;
    c.shadowColor = dark ? 'rgba(0,0,0,.8)' : 'rgba(255,250,240,.9)'; c.shadowBlur = 16;
    para(c, s, x, y, maxW, { size, weight: 900, color: dark ? '#FFF' : INK, accent: dark ? C.yellow : C.red, lh: 1.1, align: o.align });
    c.shadowBlur = 0;
    if (o.under !== false && o.align !== 'center') { const L = wrapRich(c, s, maxW, size, 900); c.fillStyle = o.ucol || C.orange; rr(c, x, y + L.lines.length * lh + 6, Math.min(L.w, 220) * e, 7, 4); c.fill(); }
  },
  body(c, s, o, dark, e) {
    const size = o.size || TY.body, w = o.w || LAY.bodyW, pad = 30, inner = w - pad * 2 - 12, L = wrapRich(c, s, inner, size, 700), lh = size * 1.24;
    const hh = (o.label ? 50 : 0) + L.lines.length * lh + pad * 2, x = o.x == null ? LAY.bodyX : o.x, y0 = (o.y == null ? LAY.bodyY : o.y) + (1 - e) * 18;
    const y = o.anchor === 'bottom' ? y0 - hh : o.anchor === 'middle' ? y0 - hh / 2 : y0;
    panel(c, x, y, w, hh, { dark, accent: o.accent });
    if (o.label) text(c, o.label, x + pad + 12, y + pad + 14, { size: 21, weight: 900, mono: true, color: o.labelCol || (dark ? C.orange : C.red), ls: 3 });
    para(c, s, x + pad + 12, y + pad + (o.label ? 50 : 0), inner, { size, weight: 700, color: dark ? '#FFF' : INK, accent: dark ? C.yellow : C.red });
  },
  concl(c, s, o, dark, e) {
    const size = TY.concl, maxW = 1580, L = wrapRich(c, s, maxW, size, 800), lh = size * 1.2, h = L.lines.length * lh + 40, w = Math.min(1780, L.w + 170), x = W / 2 - w / 2, y = LAY.conclY - h / 2 + (1 - e) * 22;
    rr(c, x + 6, y + 9, w, h, 16); c.fillStyle = 'rgba(0,0,0,.5)'; c.fill();
    rr(c, x, y, w, h, 16); c.fillStyle = 'rgba(15,11,9,.95)'; c.fill(); c.strokeStyle = 'rgba(255,233,214,.28)'; c.lineWidth = 3; c.stroke();
    c.fillStyle = C.orange; rr(c, x + 26, y - 4, (w - 52) * e, 8, 4); c.fill();
    circle(c, x + 52, y + h / 2, 24, C.orange, INK, 3); icon(c, 'check', x + 52, y + h / 2 + 1, 30, '#FFF', 8);
    para(c, s, x + 100, y + 20, maxW, { size, weight: 800, color: '#FFF', accent: C.yellow, lh: 1.2 });
  },
  big(c, s, o, dark, e) {
    const size = o.size || 84, maxW = o.w || 1600, L = wrapRich(c, s, maxW, size, 900), lh = size * 1.08, y = (o.y == null ? H / 2 : o.y) - L.lines.length * lh / 2, k = lerp(1.12, 1, E.outExpo(e));
    c.translate(W / 2, y + L.lines.length * lh / 2); c.scale(k, k); c.translate(-W / 2, -(y + L.lines.length * lh / 2));
    if (o.band) { c.fillStyle = 'rgba(12,9,7,.78)'; c.fillRect(0, y - 40, W, L.lines.length * lh + 80 + (o.sub ? 60 : 0)); }
    c.shadowColor = dark ? 'rgba(0,0,0,.85)' : 'rgba(255,250,240,.9)'; c.shadowBlur = 20;
    para(c, s, W / 2, y, maxW, { size, weight: 900, color: dark ? '#FFF' : INK, accent: o.accent || (dark ? C.yellow : C.red), align: 'center', lh: 1.08 });
    c.shadowBlur = 0;
    if (o.sub) para(c, o.sub, W / 2, y + L.lines.length * lh + 18, maxW, { size: 34, weight: 700, color: dark ? '#F3E6D6' : '#3A332C', align: 'center' });
  },
  /** lista que cresce: itens aparecem nos tempos o.at (um painel só) */
  list(c, items, o, dark, e, t) {
    const size = o.size || 34, w = o.w || LAY.bodyW, pad = 28, lh = size * 1.3, inner = w - pad * 2 - 12, x = o.x == null ? LAY.bodyX : o.x, y = o.y == null ? LAY.bodyY : o.y;
    const vis = items.map((s, i) => clamp((t - ((o.at || [])[i] == null ? -1 : o.at[i])) / .4)), n = vis.filter(v => v > 0).length; if (!n) return;
    const rows = items.map(s => wrapRich(c, s, inner - 34, size, 700).lines.length), hh = (o.label ? 50 : 0) + pad * 2 + rows.reduce((a, r, i) => a + (vis[i] > 0 ? r * lh + 8 : 0), 0);
    panel(c, x, y, w, hh, { dark, accent: o.accent });
    if (o.label) text(c, o.label, x + pad + 12, y + pad + 14, { size: 21, weight: 900, mono: true, color: dark ? C.orange : C.red, ls: 3 });
    let yy = y + pad + (o.label ? 50 : 0);
    items.forEach((s, i) => { if (vis[i] <= 0) return; c.save(); c.globalAlpha *= vis[i];
      circle(c, x + pad + 26, yy + lh / 2, 10, (o.cols || [])[i] || C.orange, dark ? '#000' : INK, 2.5);
      para(c, s, x + pad + 46 + (1 - E.outCubic(vis[i])) * 20, yy, inner - 34, { size, weight: 700, color: dark ? '#FFF' : INK, accent: dark ? C.yellow : C.red, lh: 1.3 });
      c.restore(); yy += rows[i] * lh + 8; });
  },
  note(c, s, o, dark, e) {
    c.shadowColor = dark ? 'rgba(0,0,0,.8)' : 'rgba(255,250,240,.9)'; c.shadowBlur = 10;
    para(c, s, o.x == null ? W / 2 : o.x, o.y == null ? 900 : o.y, o.w || 1400, { size: o.size || TY.note, weight: o.weight || 700, color: o.color || (dark ? '#F3E6D6' : '#3A332C'), accent: dark ? C.yellow : C.red, align: o.align || 'center' });
  }
};
window.__read = () => SAY.all.map(r => ({ ...r, words: wordCount(r.text), start: (CONFIG.sceneById[r.scene] || {}).start }));

/* ---------- A LINHA: o trilho laranja pintado, com o trem na ponta ---------- */
const LINE = (() => {
  const cache = new Map();
  function build(pts) {
    const key = pts.map(p => Math.round(p[0]) + ',' + Math.round(p[1])).join(';'); let c = cache.get(key); if (c) return c;
    const S = [], n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      const steps = Math.max(6, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 12));
      for (let s = 0; s < steps; s++) {
        const u = s / steps, u2 = u * u, u3 = u2 * u, cr = k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3);
        S.push([cr(0), cr(1)]);
      }
    }
    S.push(pts[n - 1].slice());
    const Lc = [0]; for (let i = 1; i < S.length; i++) Lc.push(Lc[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
    c = { S, Lc, L: Lc[Lc.length - 1] || 1 }; if (cache.size > 300) cache.clear(); cache.set(key, c); return c;
  }
  function pointAt(c, d) {
    let lo = 0, hi = c.Lc.length - 1; d = clamp(d, 0, c.L);
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c.Lc[m] < d) lo = m; else hi = m; }
    const f = (d - c.Lc[lo]) / Math.max(1e-6, c.Lc[hi] - c.Lc[lo]), A = c.S[lo], B = c.S[hi];
    return [lerp(A[0], B[0], f), lerp(A[1], B[1], f), Math.atan2(B[1] - A[1], B[0] - A[0])];
  }
  const at = (pts, u) => { const c = build(pts); return pointAt(c, clamp(u) * c.L); };
  function trace(ctx, c, u0, u1) {
    const d0 = u0 * c.L, d1 = u1 * c.L, p0 = pointAt(c, d0); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]);
    for (let i = 0; i < c.S.length; i++) { const d = c.Lc[i]; if (d <= d0) continue; if (d >= d1) break; ctx.lineTo(c.S[i][0], c.S[i][1]); }
    const p1 = pointAt(c, d1); ctx.lineTo(p1[0], p1[1]);
  }
  /** o trem visto de cima: cápsula com farol e rastro de luz */
  function head(ctx, x, y, a, w, o = {}) {
    glow(ctx, x, y, w * 4.6, o.headCol || C.orange, .55);
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    const g = ctx.createLinearGradient(-w * 10, 0, 0, 0); g.addColorStop(0, 'rgba(255,200,140,0)'); g.addColorStop(1, 'rgba(255,232,196,.9)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-w * 10, -w * .22); ctx.lineTo(-w * .4, -w * .62); ctx.lineTo(-w * .4, w * .62); ctx.lineTo(-w * 10, w * .22); ctx.closePath(); ctx.fill();
    rr(ctx, -w * 1.7, -w * .9, w * 2.8, w * 1.8, w * .9); ctx.fillStyle = '#FFF4E6'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = Math.max(3, w * .2); ctx.stroke();
    rr(ctx, -w * 1.25, -w * .52, w * 1.55, w * 1.04, w * .5); ctx.fillStyle = C.orange; ctx.fill();
    circle(ctx, w * .72, 0, w * .32, '#FFFBEA'); glow(ctx, w * 1.4, 0, w * 2.6, '#FFF2C8', .65);
    ctx.restore();
  }
  /** desenha a linha até u1 (0–1 do comprimento). o: { from, w, col, head, glow, dash, shadow, alpha } */
  function draw(ctx, pts, u1 = 1, o = {}) {
    if (u1 <= 0 || pts.length < 2) return; const c = build(pts), u0 = o.from || 0, w = o.w || 22, col = o.col || C.orange;
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (o.shadow !== false) { ctx.save(); ctx.translate(7, 9); trace(ctx, c, u0, u1); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = w + 14; ctx.stroke(); ctx.restore(); }
    trace(ctx, c, u0, u1); ctx.strokeStyle = o.ink || INK; ctx.lineWidth = w + 14; ctx.stroke();
    if (o.glow && !QUALITY.low) { ctx.shadowColor = col; ctx.shadowBlur = o.glow; }
    ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.save(); ctx.translate(-w * .12, -w * .2); trace(ctx, c, u0, u1); ctx.strokeStyle = rgba('#FFE9CC', .5); ctx.lineWidth = w * .26; ctx.stroke(); ctx.restore();
    if (o.dash) { trace(ctx, c, u0, u1); ctx.setLineDash(o.dash); ctx.lineDashOffset = -(o.t == null ? NOW : o.t) * 70; ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = w * .22; ctx.stroke(); ctx.setLineDash([]); }
    if (o.head) { const p = pointAt(c, u1 * c.L); head(ctx, p[0], p[1], p[2], w * .9, o); }
    ctx.restore();
  }
  /** estações sobre a linha: [{ u, label, sub, fill, icon, side: -1 acima | 1 abaixo }] — rótulos nítidos */
  function stations(ctx, pts, list, u1, o = {}) {
    list.forEach((s, i) => {
      const k = clamp((u1 - s.u) * 12 + .25); if (k <= 0) return;
      const [x, y] = at(pts, s.u), r = (s.r || o.r || 24) * E.outBack(clamp(k * 1.4));
      circle(ctx, x + 4, y + 5, r, 'rgba(0,0,0,.5)'); circle(ctx, x, y, r, s.fill || '#FFF8EE'); inkCircle(ctx, x, y, r, 6, i + 3);
      if (s.icon) icon(ctx, s.icon, x, y, r * 1.05, s.iconCol || INK, 6);
      if (s.label) {
        const side = s.side || o.side || -1, la = clamp(k * 1.5), dark = o.dark !== false, sc = camScale(ctx);
        pin(ctx, x, y, c => { c.globalAlpha *= la; const ly = side * (r * sc + 30);
          c.shadowColor = dark ? 'rgba(0,0,0,.85)' : 'rgba(255,250,240,.9)'; c.shadowBlur = 10;
          text(c, s.label, 0, ly, { size: s.size || TY.label, weight: 900, color: s.col || (dark ? '#FFF' : INK), align: 'center' });
          if (s.sub) text(c, s.sub, 0, ly + side * 36, { size: s.subSize || 24, weight: 700, color: dark ? '#EDE2D2' : '#4A4038', align: 'center' }); });
      }
    });
  }
  return { draw, at, stations, build, head };
})();

/* ---------- câmera 2.5D ---------- */
/** câmera por quadros-chave [[t, x, y, z], …]: anda entre as chaves (inOutCubic) e fica parada nelas */
function camKey(t, K) {
  if (t <= K[0][0]) return { x: K[0][1], y: K[0][2], z: K[0][3] };
  for (let i = 1; i < K.length; i++) if (t < K[i][0]) { const a = K[i - 1], b = K[i], e = E.inOutCubic((t - a[0]) / Math.max(1e-6, b[0] - a[0])); return { x: lerp(a[1], b[1], e), y: lerp(a[2], b[2], e), z: lerp(a[3], b[3], e) }; }
  const L = K[K.length - 1]; return { x: L[1], y: L[2], z: L[3] };
}
/** camada de paralaxe: k = profundidade (0 = fundo parado · 1 = plano principal · > 1 primeiro plano) */
function layer(ctx, cam, k, fn) {
  ctx.save(); const z = 1 + (cam.z - 1) * k;
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-(W / 2 + (cam.x - W / 2) * k), -(H / 2 + (cam.y - H / 2) * k));
  fn(); ctx.restore();
}

/* ---------- diagramas nomeados ---------- */
/** etapas em linha, ligadas pela linha laranja · nodes: [{ label, sub, icon, col, fill }] · p: 0–1 (acendem em ordem) */
function flowRow(ctx, x0, y, x1, nodes, p, o = {}) {
  const n = nodes.length, bw = o.bw || Math.min(300, (x1 - x0) / n - 36), bh = o.bh || 150, dx = n > 1 ? (x1 - x0 - bw) / (n - 1) : 0, dark = o.dark !== false;
  LINE.draw(ctx, [[x0 + bw / 2 - (o.lead || 0), y], [x1 - bw / 2 + (o.tail || 0), y]], clamp(p * 1.04), { w: o.lw || 16, head: o.head !== false && p < .99 });
  nodes.forEach((nd, i) => {
    const cx = x0 + bw / 2 + i * dx, k = clamp(p * n * 1.04 - i); if (k <= 0) return; const s = E.outBack(clamp(k * 1.6)), hot = o.hot === i;
    ctx.save(); ctx.translate(cx, y); ctx.scale(s, s);
    if (hot) glow(ctx, 0, 0, bw * .9, C.orange, .5);
    paper(ctx, -bw / 2, -bh / 2, bw, bh, { r: 16, fill: nd.fill || (hot ? C.orange : '#F6EEDF'), shadow: 9, shadowColor: '#000', lw: 3.5, dash: nd.dash });
    if (nd.icon) icon(ctx, nd.icon, 0, -bh * .17, bh * .36, nd.col || (hot ? '#FFF' : C.orange), 7);
    ctx.restore();
    const la = clamp(k * 2);
    late(ctx, c => { c.globalAlpha *= la;
      text(c, nd.label, cx, y + (nd.icon ? bh * .22 : 0), { size: nd.size || Math.min(TY.label, (bw - 24) / Math.max(1, measure(c, nd.label, TY.label, 900)) * TY.label), weight: 900, color: hot ? '#FFF' : INK, align: 'center' });
      if (nd.sub) { c.shadowColor = dark ? 'rgba(0,0,0,.85)' : 'rgba(255,250,240,.9)'; c.shadowBlur = 8; para(c, nd.sub, cx, y + bh / 2 + 16, bw + 30, { size: 24, weight: 700, color: dark ? '#EDE2D2' : '#3A332C', align: 'center', lh: 1.15 }); } });
  });
  return { bw, bh, dx, cx: i => x0 + bw / 2 + i * dx };
}
/** seta pintada de (x1,y1) a (x2,y2) */
function paintArrow(ctx, x1, y1, x2, y2, col = C.orange, w = 8, p = 1) {
  if (p <= 0) return; const x = lerp(x1, x2, p), y = lerp(y1, y2, p), a = Math.atan2(y2 - y1, x2 - x1);
  line(ctx, x1, y1, x, y, INK, w + 6); line(ctx, x1, y1, x, y, col, w); arrowHead(ctx, x + Math.cos(a) * 4, y + Math.sin(a) * 4, a, w * 2.6, INK); arrowHead(ctx, x, y, a, w * 2, col);
}

/* ---------- cenários pintados reutilizáveis ---------- */
const _skyCache = new Map();
/** silhueta de cidade com janelas acesas (cacheada) · o: { y: base, h: altura máx., seed, col, lit (0–1), alpha, foot } */
function skyline(ctx, t, o = {}) {
  const key = [o.y || 820, o.h || 360, o.seed || 7, o.col || '#1B1420', o.lit == null ? .5 : o.lit, o.win || '#FFB862'].join('|');
  let cv = _skyCache.get(key);
  if (!cv) {
    cv = makeCanvas(W + 400, H + 200, g => {
      const r = rng(o.seed || 7), base = (o.y || 820) + 100, lit = o.lit == null ? .5 : o.lit; let x = 0;
      while (x < W + 400) {
        const w = 60 + r() * 130, h = (o.h || 360) * (.3 + r() * .7);
        g.fillStyle = o.col || '#1B1420'; g.fillRect(x, base - h, w, H + 200 - (base - h));
        if (r() > .55) { g.fillRect(x + w * .42, base - h - 34, 6, 34); }
        if (r() > .7) { g.beginPath(); g.moveTo(x, base - h); g.lineTo(x + w / 2, base - h - 26 - r() * 30); g.lineTo(x + w, base - h); g.fill(); }
        for (let wy = base - h + 16; wy < base - 8; wy += 26) for (let wx = x + 10; wx < x + w - 14; wx += 20) {
          const hv = hash(wx * .37 + wy * 1.7 + (o.seed || 7)); if (hv < lit * .55) { g.fillStyle = rgba(hv < .06 ? '#FFF0C8' : (o.win || '#FFB862'), .3 + .5 * hv / .55); g.fillRect(wx, wy, 9, 13); }
        }
        x += w + 4 + r() * 18;
      }
    });
    if (_skyCache.size > 12) _skyCache.clear(); _skyCache.set(key, cv);
  }
  ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.drawImage(cv, (o.x || 0) - 200, -100); ctx.restore();
  // luzes de topo piscando (antenas)
  const r = rng((o.seed || 7) + 99); for (let k = 0; k < 7; k++) { const x = r() * W, y = (o.y || 820) - (o.h || 360) * (.75 + r() * .3); glow(ctx, x + (o.x || 0), y, 14, C.red, .4 + .4 * Math.sin(t * 2.2 + k * 1.7)); }
}
/** balão de pergunta pintado */
function qBubble(ctx, x, y, r, p, o = {}) {
  if (p <= 0) return; const s = E.outBack(clamp(p));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  ctx.beginPath(); ctx.moveTo(-r * .3, r * .72); ctx.lineTo(-r * .8, r * 1.28); ctx.lineTo(r * .12, r * .86); ctx.closePath(); ctx.fillStyle = o.fill || '#FFF8EE'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
  vball(ctx, 0, 0, r, o.fill || '#FFF8EE', { lw: 5 });
  retroText(ctx, o.mark || '?', 0, 4, { size: r * 1.15, weight: 900, color: o.col || C.red, align: 'center', depth: 5, lw: 4 });
  ctx.restore();
}
