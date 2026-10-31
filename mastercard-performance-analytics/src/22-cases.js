/* ============================================================================
   22. TRECHO 2 ("Technology" remontada) — estação 04: a abertura e os 4 cases
   ----------------------------------------------------------------------------
   Cada case tem 24 compassos (o Insight Agent, 28) e segue a música:
     parte calma   0–8   PROBLEMA (0–4) · DADOS do cliente (4–8)
     construção    8–16  ESTRATÉGIA (8–10) · COMO FIZEMOS, passo a passo (10–16)
     drop          16–   SOLUÇÃO (16–20) · IMPACTO (20–)
   As legendas (caps) explicam cada etapa; a batida só cresce no drop e no impacto.
   ========================================================================== */
const CASEKIT = {
  /** cabeçalho do case: etiqueta + título pintado */
  header(ctx, t, tag, title, o = {}) {
    const p = P(t, o.at || 0, .5); if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= 1 - P(t, o.out == null ? 1e9 : o.out, .4);
    const tw = measure(ctx, tag, 20, 800, true, 3) + 40; ctx.save(); ctx.translate(120 + tw / 2, 128); ctx.rotate(-.02); ctx.scale(E.outBack(p), E.outBack(p));
    paper(ctx, -tw / 2, -20, tw, 40, { r: 4, fill: o.tagCol || C.orange, shadow: 4, shadowColor: '#000', lw: 2.5 }); text(ctx, tag, 0, 1, { size: 20, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 3 }); ctx.restore();
    paintTitle(ctx, title, 110, 196, { size: o.size || 56, align: 'left', bg: o.bg || C.red, seed: o.seed || 3, p: clamp(p * 1.2), splat: false });
    ctx.restore();
  },
  /** post-it grande com texto digitado aos poucos */
  note(ctx, x, y, w, str, p, o = {}) {
    if (p <= 0) return; const n = Math.floor(str.length * clamp(p * 1.3)), lines = wrapText(ctx, str.slice(0, n), w - 60, o.size || 30);
    const h = Math.max(o.minH || 0, lines.length * (o.size || 30) * 1.25 + 70);
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || -.015); ctx.scale(E.outBack(clamp(p * 3)), E.outBack(clamp(p * 3)));
    paper(ctx, -w / 2, -h / 2, w, h, { fill: o.fill || C.yellow, shadow: 10, shadowColor: '#000', lw: 3.5, halftone: .06, tape: [[.5, 0, .1]] });
    if (o.label) pill(ctx, -w / 2 + 90, -h / 2 + 4, o.label, { size: 16, fill: INK, color: '#FFF', weight: 800, flat: true });
    lines.forEach((l, i) => text(ctx, l, -w / 2 + 30, -h / 2 + 50 + i * (o.size || 30) * 1.25, { size: o.size || 30, weight: 800, color: INK }));
    ctx.restore();
  },
  /** número-manchete: estoura com respingo */
  headline(ctx, t, at, x, y, str, label, o = {}) {
    const p = P(t, at, .32); if (p <= 0) return;
    const s = lerp(2.2, 1, E.outExpo(p)), size = o.size || 170;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || -.04); ctx.scale(s, s);
    splat(ctx, 0, -10, size * .9, o.col || C.orange, o.seed || 5, 1, .95);
    retroText(ctx, str, 0, 0, { size, weight: 900, color: '#FFF', align: 'center', depth: 8, lw: 6 });
    if (label) text(ctx, label, 0, size * .72, { size: 30, weight: 800, color: '#FFF', align: 'center' });
    ctx.restore();
  },
  /** régua das 5 etapas (PH = inícios das etapas) */
  ruler(ctx, t, PH, labels, a = 1) { let k = 0; PH.forEach((t0, i) => { if (t >= t0) k = i; }); caseRuler(ctx, k, 0, { labels, alpha: a }); },
  /** cartão da estratégia: etiqueta + frase grande + linha de apoio */
  strategy(ctx, t, t0, t1, big, sub, o = {}) {
    const a = P(t, t0, .5) * (1 - P(t, t1 - .45, .45)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(a * 1.5); ctx.translate(W / 2, o.y || 590); ctx.rotate(-.012); const s = lerp(1.25, 1, E.outExpo(a)); ctx.scale(s, s);
    paper(ctx, -760, -170, 1520, 340, { torn: true, seed: o.seed || 9, fill: '#F6EEDF', shadow: 16, shadowColor: '#000', lw: 4, tape: [[.15, 0, -.3], [.85, 0, .3]] });
    pill(ctx, 0, -112, 'NOSSA ESTRATÉGIA', { size: 22, fill: C.red, color: '#FFF', weight: 900 });
    rich(ctx, big, 0, -10, { size: 80, weight: 900, color: INK, accent: C.orange });
    text(ctx, sub, 0, 90, { size: 32, weight: 700, color: '#4A4038', align: 'center' });
    ctx.restore();
  },
  /** fileira de passos do "como fizemos" (aceso conforme o tempo) */
  chips(ctx, t, list, times, a, y = 300) {
    if (a <= 0) return;
    const ws = list.map(l => measure(ctx, l, 22, 800) + 74), gap = 46, tot = ws.reduce((s, w) => s + w, 0) + gap * (list.length - 1);
    let x = W / 2 - tot / 2; ctx.save(); ctx.globalAlpha *= a;
    list.forEach((l, i) => { const on = t >= times[i], cur = on && (i === list.length - 1 || t < times[i + 1]), w = ws[i];
      rr(ctx, x, y - 25, w, 50, 25); ctx.fillStyle = cur ? C.orange : on ? '#F6EEDF' : 'rgba(30,24,20,.85)'; ctx.fill(); ctx.strokeStyle = cur ? '#FFF' : on ? INK : 'rgba(255,255,255,.25)'; ctx.lineWidth = 2.5; ctx.stroke();
      circle(ctx, x + 26, y, 17, cur ? '#FFF' : on ? C.orange : '#3A322B'); text(ctx, String(i + 1), x + 26, y + 1, { size: 18, weight: 900, color: cur ? C.orange : '#FFF', align: 'center' });
      text(ctx, l, x + 52, y + 1, { size: 22, weight: 800, color: cur ? '#FFF' : on ? INK : '#BFB3A3' });
      if (i < list.length - 1) arrowHead(ctx, x + w + gap / 2 + 6, y, 0, 14, on ? C.orange : 'rgba(255,255,255,.3)');
      x += w + gap; });
    ctx.restore();
  },
  /** ficha de dado: número grande + rótulo */
  tile(ctx, x, y, w, h, big, label, p, o = {}) {
    if (p <= 0) return; const s = E.outBack(p);
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
    paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: o.seed || 1, fill: o.fill || '#F6EEDF', shadow: 9, shadowColor: '#000', lw: 3.5 });
    const bs = Math.min(o.size || 78, (w - 40) / Math.max(1, measure(ctx, big, 78, 900)) * 78);
    retroText(ctx, big, 0, -h * .14, { size: bs, weight: 900, color: o.col || C.orange, align: 'center', depth: 4, lw: 3 });
    const ls = measure(ctx, label, 24, 700) > w - 30 ? twoLines(label) : label;
    text(ctx, ls, 0, h * .3, { size: 24, weight: 700, color: '#4A4038', align: 'center', lh: 1.1 });
    ctx.restore();
  },
  /** cartão de desafio riscado com X vermelho */
  hurdle(ctx, x, y, str, p, i) {
    if (p <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate([.03, -.02, .025][i % 3]); ctx.scale(E.outBack(p), E.outBack(p));
    paper(ctx, -250, -66, 500, 132, { fill: '#F6EEDF', shadow: 8, shadowColor: '#000', lw: 3 });
    text(ctx, measure(ctx, str, 27, 800) > 400 ? twoLines(str) : str, -20, 0, { size: 27, weight: 800, color: INK, align: 'center', lh: 1.1 });
    scribble(ctx, 'x', 196, -26, 70, C.red, 50 + i, clamp(p * 2 - .6)); ctx.restore();
  }
};
/** quebra de texto por largura (usa a fonte do texto) */
function wrapText(ctx, str, maxW, size, weight = 800) {
  ctx.save(); ctx.font = font(size, weight); const out = []; let cur = '';
  String(str).split(' ').forEach(w => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
  if (cur) out.push(cur); ctx.restore(); return out;
}
const headlineFor = re => { const h = (DATA.headline_numbers_for_slides || []).find(x => re.test(x.meaning || '')); return h ? FMT.headline(h) : null; };
/** compassos de 2,22 s da faixa remontada (grade da cena, com reserva) */
const caseBars = id => { const G = grid(id); return k => (G.bars[k] != null ? G.bars[k] : k * 2.2222); };
const CASES = [['Cliente Banana', 'cestas de produtos', C.yellow, 'VAREJO'], ['Cliente Manga', 'motor de principalidade', C.orange, 'EMISSORES'],
  ['Lights-off', 'relatórios de fraude automáticos', '#F3EBDD', 'RELATÓRIOS'], ['Insight Agent', 'agentes de IA para insights', C.red, 'ADQUIRENTES']];

/* ---------- abertura da 04: título da seção + "agora, os cases de impacto" ---------- */
(() => {
  const id = 's04', T_T = 1.0, T_SUB = 1.8, T_CON = 2.8, T_FAN = 4.45, T_GO = 8.1;
  cue(id, T_T, 'impact', { size: .6 }); CASES.forEach((_, i) => cue(id, T_FAN + i * .3, 'pop', { p: .8 + i * .15, v: .16 })); cue(id, T_GO, 'whoosh', { dur: .7, v: .3 });
  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_FAN - .1, T_FAN + 1.2, .6]],
    caps: [[T_CON + .2, 8.9, 'Agora, os *cases de impacto*: 4 clientes, do problema ao resultado medido', 'ESTAÇÃO 04']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .85, center: '#26170E' });
      neonGrid(ctx, t, { horizon: 900, alpha: .35, speed: .4 + BT.level });
      collage(ctx, t, { seed: 61, n: 5, theme: 'dark', alpha: .45 });
      const go = E.inCubic(P(t, T_GO, .8));
      ctx.save(); ctx.globalAlpha *= 1 - go;
      const tp = P(t, T_T, .6); if (tp > 0) { ctx.save(); ctx.translate(W / 2, 330); const s = lerp(1.4, 1, E.outExpo(tp)); ctx.scale(s, s); paintTitle(ctx, 'ANALYTICS EM AÇÃO', 0, 0, { size: 110, bg: C.orange, seed: 14, p: tp }); ctx.restore(); }
      const sp = P(t, T_SUB, .5); if (sp > 0) rich(ctx, 'do *dado* ao *impacto*', W / 2, 455, { size: 54, weight: 900, color: '#FFF', accent: C.yellow, alpha: sp });
      const cp = P(t, T_CON, .5); if (cp > 0) { ctx.save(); ctx.globalAlpha *= cp; ctx.translate(W / 2, 560); ctx.rotate(-.01); brush(ctx, -560, -36, 1120, 72, C.red, 71, E.outCubic(cp)); text(ctx, 'agora, os cases de impacto', 0, 2, { size: 44, weight: 900, color: '#FFF', align: 'center' }); ctx.restore(); }
      CASES.forEach(([n, d, col], i) => { const p = E.outBack(P(t, T_FAN + i * .3, .45)); if (p <= 0) return;
        const x = 330 + i * 420, y = 790 + (1 - p) * 300;
        ctx.save(); ctx.translate(x, y); ctx.rotate([-.04, .02, -.02, .035][i]); ctx.scale(p, p);
        paper(ctx, -185, -95, 370, 190, { r: 16, fill: col, shadow: 10, shadowColor: '#000', lw: 4, halftone: .1 });
        retroText(ctx, '0' + (i + 1), -160, -40, { size: 52, weight: 900, color: '#FFF', depth: 3, lw: 3 });
        const dk = col === C.red ? '#FFF' : INK; text(ctx, n, -92, -40, { size: 30, weight: 900, color: dk });
        text(ctx, twoLines(d), 0, 40, { size: 26, weight: 800, color: dk, align: 'center', lh: 1.1 }); ctx.restore(); });
      ctx.restore();
      if (go > .6) flash(ctx, (go - .6) / .4 * .8, C.yellow);
      scanlines(ctx, .05);
    }
  };
})();

/* ---------- case 1 · Cliente Banana (cestas de produtos) ---------- */
(() => {
  const id = 'banana', bt = caseBars(id), CS = () => CASE('Cliente Banana');
  const PH = [0, bt(4), bt(8), bt(16), bt(20)], T_TILE = [bt(4) + .3, bt(4) + 1, bt(5) + .2, bt(5) + .9], T_DC = [bt(6), bt(6) + 1.1, bt(7) + .2];
  const T_MAT = bt(10), T_BM = bt(10) + 1.4, T_ALS = bt(12), T_COS = bt(14), T_TENSE = bt(15), T_DROP = bt(16), T_INS = bt(18), T_IMP = bt(20), T_END = bt(22) + .6;
  const BASK = [['Café + chocolate', ['cup', 'box']], ['Churrasco', ['can', 'carton']], ['Destilados', ['bottle', 'jar']]];
  const ms = () => dget(CS(), 'analytics_solution.model_scale', {}), STORES = [['Cliente Banana', C.yellow], ['Cliente Maçã', C.red], ['Cliente Pera', C.orange]];
  const MONTHS = (String(dget(CS(), 'analytics_solution.lookback', '')).match(/(\d+)\s*meses/) || [])[1] || '24';
  const conv0 = Object.entries(dget(CS(), 'business_results.conversion_by_mechanic', {})), BEST = conv0.length ? conv0[0][0].replace(/\s*\(cesta\)/, '') : 'Destilados', HL = headlineFor(/Banana conversion/i) || '—';
  cue(id, .1, 'whoosh', { dur: .5, v: .3 }); T_TILE.forEach((t0, i) => cue(id, t0, 'pop', { p: .9 + i * .1, v: .18 })); T_DC.forEach(t0 => cue(id, t0, 'buzz'));
  cue(id, PH[2], 'chime', { f: 784, up: 7 }); cue(id, T_MAT, 'shimmer', { dur: 1.5 }); cue(id, T_ALS, 'whoosh', { dur: .6, v: .3 }); cue(id, T_COS, 'shimmer', { dur: 1.5 });
  cue(id, T_TENSE, 'riser', { dur: T_DROP - T_TENSE, v: .25 }); cue(id, T_DROP, 'impact', { size: 1.1 }); cue(id, T_IMP, 'impact', { size: .8 }); cue(id, T_IMP + .4, 'type', { n: 26, gap: .03 });
  const R = rng(5), CELLS = Array.from({ length: 14 * 24 }, () => R());
  const PR = Array.from({ length: 36 }, (_, i) => ({ b: i % 3, sx: R() * 2 - 1, sy: R() * 2 - 1, ox: (R() - .5) * .5, oy: (R() - .5) * .5 }));

  function stores(ctx, t, a) {
    if (a <= 0) return; const pos = [[1460, 420], [1300, 700], [1640, 700]];
    ctx.save(); ctx.globalAlpha *= a;
    pos.forEach(([x, y], i) => { const [x2, y2] = pos[(i + 1) % 3], u = (t * .5 + i / 3) % 1;
      ctx.save(); ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 30; line(ctx, x, y, x2, y2, rgba('#FFFFFF', .5), 4); ctx.restore();
      circle(ctx, lerp(x, x2, u), lerp(y, y2, u), 9, C.yellow); });
    pos.forEach(([x, y], i) => { const p = E.outBack(P(t, 1 + i * .3, .4)); if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p);
      circle(ctx, 0, 0, 74, STORES[i][1], INK, 4); icon(ctx, 'store', 0, -6, 70, i === 1 ? '#FFF' : INK, 7);
      pill(ctx, 0, 98, STORES[i][0], { size: 20, fill: '#F6EEDF', weight: 900 }); ctx.restore(); });
    text(ctx, '3 bandeiras · um só cliente', 1470, 860, { size: 24, weight: 800, mono: true, color: '#F3E6D6', align: 'center' });
    ctx.restore();
  }
  function matrix(ctx, t, x, y) {
    const cols = 24, rows = 14, cw = 30, ch = 30, mp = P(t, T_MAT, 1.6), bm = P(t, T_BM, .8), als = E.inOutCubic(P(t, T_ALS, 1.2)), out = P(t, T_COS - .2, .6);
    if (mp <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    const mx = lerp(x, x - 160, als), mw = cols * cw;
    paper(ctx, mx - 20, y - 20, mw + 40, rows * ch + 40, { r: 10, fill: 'rgba(20,16,13,.85)', outline: '#F3EBDD', lw: 2, shadow: 8, shadowColor: '#000' });
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = CELLS[r * cols + c], filled = v < .16 || c < 2 && v < .85, appear = clamp(mp * 1.6 - (c + r) / 40), low = c < 2;
      if (!filled || appear <= 0) continue;
      circle(ctx, mx + c * cw + cw / 2, y + r * ch + ch / 2, 6 * (1 - als * .4), rgba(low ? '#8A8378' : C.orange, appear * (low ? 1 - .8 * bm : 1)));
    }
    text(ctx, 'clientes (CPF)  ×  produtos (SKU)', mx + mw / 2, y - 48, { size: 24, weight: 800, mono: true, color: '#F3EBDD', align: 'center', alpha: mp });
    if (bm > 0) { ctx.save(); ctx.globalAlpha *= bm; rr(ctx, mx - 6, y - 8, cw * 2 + 12, rows * ch + 16, 8); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
      text(ctx, '↑ sacola · pão: peso reduzido', mx, y + rows * ch + 46, { size: 22, weight: 800, mono: true, color: '#FFB0A0', alpha: bm });
      formula(ctx, 'BM25 = idf · tf(k₁+1) / (tf + k₁·(1−b+b·|d|/avgdl))', mx + mw / 2, y + rows * ch + 110, { size: 18, neon: true, alpha: bm * (1 - als) }); }
    if (als > 0) { const ux = mx + mw + 90;
      ctx.save(); ctx.globalAlpha *= als;
      text(ctx, '≈', ux, y + rows * ch / 2, { size: 80, weight: 900, color: '#FFF', align: 'center' });
      rr(ctx, ux + 60, y, 70, rows * ch, 8); ctx.fillStyle = C.orange; ctx.fill(); inkRect(ctx, ux + 60, y, 70, rows * ch, 8, 3, 3);
      rr(ctx, ux + 160, y + rows * ch / 2 - 35, 300, 70, 8); ctx.fillStyle = C.yellow; ctx.fill(); inkRect(ctx, ux + 160, y + rows * ch / 2 - 35, 300, 70, 8, 3, 4);
      text(ctx, 'clientes', ux + 95, y - 30, { size: 24, weight: 900, color: '#FFF', align: 'center' }); text(ctx, 'produtos', ux + 310, y + rows * ch / 2 - 60, { size: 24, weight: 900, color: '#FFF', align: 'center' });
      text(ctx, 'U', ux + 95, y + rows * ch / 2, { size: 30, weight: 900, color: INK, align: 'center' }); text(ctx, 'Vᵀ', ux + 310, y + rows * ch / 2, { size: 30, weight: 900, color: INK, align: 'center' });
      formula(ctx, 'R ≈ U·Vᵀ  ·  ALS', ux + 300, y + rows * ch + 40, { size: 20, rot: .02, seed: 8 });
      ctx.restore(); }
    ctx.restore();
  }
  /** espaço dos produtos: pontos se juntam em 3 cestas pela similaridade de cosseno */
  function cosine(ctx, t) {
    const p = P(t, T_COS, .5), g = E.inOutCubic(P(t, T_COS + .4, 2.6)), out = P(t, T_DROP - .25, .3); if (p <= 0 || out >= 1) return;
    const cx = W / 2, cy = 640, CEN = [[-.62, .1], [0, -.25], [.62, .1]], col = [C.yellow, C.orange, C.red];
    ctx.save(); ctx.globalAlpha *= p * (1 - out);
    holo(ctx, cx - 640, cy - 270, 1280, 520, { title: 'ESPAÇO DOS PRODUTOS (VETORES DO ALS)', color: C.orange });
    PR.forEach((q, i) => { const tx = CEN[q.b][0] + q.ox * .5, ty = CEN[q.b][1] + q.oy * .6, x = cx + lerp(q.sx, tx, g) * 560, y = cy + lerp(q.sy * .7, ty, g) * 380;
      const sh = t > T_TENSE ? (hash(Math.floor(t * 24) + i) - .5) * 6 : 0; circle(ctx, x + sh, y, 10, g > .5 ? col[q.b] : '#BFB3A3', INK, 2); });
    CEN.forEach(([x, y], k) => { const la = P(t, T_COS + 2.4 + k * .3, .4); if (la <= 0) return; const px = cx + x * 560, py = cy + y * 380;
      ctx.save(); ctx.globalAlpha *= la; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.ellipse(px, py, 150, 110, 0, 0, TAU); ctx.strokeStyle = col[k]; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      pill(ctx, px, py - 135, BASK[k][0], { size: 20, fill: col[k], color: k === 2 ? '#FFF' : INK, weight: 900, alpha: la }); });
    formula(ctx, 'cos θ = a·b / ‖a‖‖b‖', cx + 470, cy - 200, { size: 22, rot: .03, seed: 12, alpha: p });
    ctx.restore();
  }
  function baskets(ctx, t) {
    const p0 = P(t, T_DROP, .4), out = P(t, T_IMP - .3, .4); if (p0 <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    const tgt = ms().target_customers_mechanic_b;
    BASK.forEach(([name, ics], i) => {
      const p = E.outBack(P(t, T_DROP + i * .35, .45)); if (p <= 0) return;
      const x = 480 + i * 480, y = 520 + Math.sin(t * 2 + i) * 4;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.rotate([-.04, .03, -.02][i]);
      paper(ctx, -150, -120, 300, 260, { r: 18, fill: [C.yellow, C.orange, C.red][i], shadow: 10, shadowColor: '#000', lw: 4, halftone: .18 });
      ctx.beginPath(); ctx.arc(0, -120, 70, Math.PI, 0); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.stroke();
      ics.forEach((ic, j) => { circle(ctx, -55 + j * 110, -20, 48, '#FFF8EE', INK, 3); icon(ctx, ic, -55 + j * 110, -20, 56, INK, 9); });
      text(ctx, name, 0, 84, { size: 30, weight: 900, color: i === 0 ? INK : '#FFF', align: 'center' });
      ctx.restore();
      // clientes-alvo de cada cesta
      const cp = P(t, T_DROP + 1.2 + i * .3, .5); if (cp > 0) { ctx.save(); ctx.globalAlpha *= cp;
        for (let k = 0; k < 5; k++) { const ux = x - 120 + k * 60, uy = 760; circle(ctx, ux, uy, 26, '#F6EEDF', INK, 3); icon(ctx, 'user', ux, uy + 2, 30, INK, 7); }
        text(ctx, 'clientes-alvo', x, 812, { size: 22, weight: 800, mono: true, color: '#F3E6D6', align: 'center' }); ctx.restore(); }
    });
    if (tgt) formula(ctx, `público-alvo da mecânica B: ${FMT.num(tgt, 0)} clientes`, 1600, 222, { size: 16, neon: true, rot: .03, alpha: P(t, T_DROP + 2, .5) });
    const ip = P(t, T_INS, .5); if (ip > 0) CASEKIT.note(ctx, W / 2, 880, 1100, 'As cestas viraram mecânicas de campanha nos testes da Mesa de Performance.', ip, { fill: '#F6EEDF', size: 26, label: 'DECISÃO' });
    ctx.restore();
  }
  function impact(ctx, t) {
    const p = P(t, T_IMP, .4); if (p <= 0) return;
    const conv = conv0, mx = Math.max(...conv.map(r => parseFloat(r[1]) || 0), 1);
    text(ctx, 'Conversão por mecânica de campanha', 120, 300, { size: 26, weight: 900, color: '#FFF', alpha: p });
    conv.forEach(([k, v], i) => { const val = parseFloat(v) || 0, bp = E.outCubic(P(t, T_IMP + i * .08, .5)), y = 360 + i * 66, w = 520 * val / mx * bp, cesta = /cesta/i.test(k);
      text(ctx, k.replace(' (cesta)', ''), 330, y, { size: 24, weight: 800, color: cesta ? '#FFF' : '#BFB3A3', align: 'right' });
      rr(ctx, 350, y - 20, Math.max(4, w), 40, 6); ctx.fillStyle = cesta ? C.orange : '#5E5850'; ctx.fill(); inkRect(ctx, 350, y - 20, Math.max(4, w), 40, 6, 2.5, i);
      text(ctx, FMT.auto(v) + (cesta ? '  · cesta' : ''), 370 + w, y, { size: 22, weight: 900, color: cesta ? C.yellow : '#FFF', alpha: bp }); });
    CASEKIT.headline(ctx, t, T_IMP + .05, 1300, 420, HL, 'conversão vs. 2ª melhor campanha', { col: C.orange });
    const br = dget(CS(), 'business_results', {});
    receipt(ctx, 1460, 620, { w: 560, p: P(t, T_IMP + 1.2, 2.2), rot: .02, lines: [
      ['receita incremental (Café)', FMT.auto(br.incremental_revenue_cafe)], ['Café em bandeira não principal', FMT.rel(br.cafe_revenue_growth_non_primary_bu)],
      ['clientes modelados', FMT.mm(ms().customers_modeled)], ['interações', FMT.mm(ms().interactions)], ['subgrupos de produto', FMT.num(ms().sku_subgroups || 0, 0)]] });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_DROP - .15, T_DROP + 1.8], [T_IMP - .1, T_IMP + 1.4, .8]],
    caps: [[.6, 4.3, 'O desafio: fazer o cliente de uma bandeira *comprar também nas outras*', 'PROBLEMA'],
      [4.5, PH[1] - .2, 'Para isso: achar *cestas de produtos estratégicos* e quem tem mais chance de comprá-las', 'PROBLEMA'],
      [PH[1] + .2, T_DC[0] - .2, `O que o cliente tinha: *${MONTHS} meses de compras*, por cliente (CPF) e produto (SKU)`, 'DADOS'],
      [T_DC[0] + .1, PH[2] - .2, 'Mas o dado era difícil: *só compras*, itens que dominam o sinal e nomes diferentes', 'DADOS'],
      [PH[2] + .2, T_MAT - .2, 'Nossa estratégia: *gerar cestas de produtos* e achar o público certo para cada uma', 'ESTRATÉGIA'],
      [T_MAT + .1, T_ALS - .2, '1 · *BM25* tira o peso dos itens que todo mundo compra, como sacola e pão', 'COMO FIZEMOS'],
      [T_ALS + .1, T_COS - .2, '2 · *Matrix Factorization (ALS)* cria um vetor para cada cliente e cada produto', 'COMO FIZEMOS'],
      [T_COS + .1, T_DROP - .2, '3 · *Cosine similarity* junta produtos parecidos em cestas e acha os clientes de cada uma', 'COMO FIZEMOS'],
      [T_DROP + .2, T_INS - .1, `*Cestas temáticas* com seus clientes-alvo: ${BASK.map(b => b[0].toLowerCase()).join(', ')}`, 'SOLUÇÃO'],
      [T_INS + .1, T_IMP - .2, 'As cestas viraram *mecânicas de campanha* nos testes da Mesa de Performance', 'DECISÃO'],
      [T_IMP + .2, T_END - .1, `${BEST} bateu recorde: *${HL}* a conversão da 2ª melhor campanha`, 'IMPACTO'],
      [T_END, 53.4, `De ${MONTHS} meses de compras a *cestas que convertem mais*`, 'CONCLUSÃO']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .85, center: '#26170E' });
      neonGrid(ctx, t, { horizon: 900, alpha: .25 + .3 * P(t, T_MAT, 2), speed: .4 + BT.level });
      collage(ctx, t, { seed: 61, n: 5, theme: 'dark', alpha: .4 * (1 - P(t, T_MAT, 1)) });
      CASEKIT.header(ctx, t, 'CASE 1 DE 4 · VAREJO', 'Cliente Banana · cestas de produtos', { at: .1, seed: 4 });
      // PROBLEMA
      const q1 = 1 - P(t, PH[1] - .3, .4);
      if (q1 > 0) { ctx.save(); ctx.globalAlpha *= q1; CASEKIT.note(ctx, 640, 560, 940, CS().business_problem || '', P(t, .5, 5), { size: 30, label: 'PROBLEMA' }); stores(ctx, t, P(t, .8, .6)); ctx.restore(); }
      // DADOS: o que o cliente tinha + o que dificultava
      const q2 = P(t, PH[1] - .1, .3) * (1 - P(t, PH[2] - .3, .4));
      if (q2 > 0) { ctx.save(); ctx.globalAlpha *= q2;
        text(ctx, 'O QUE O CLIENTE TINHA', 560, 300, { size: 26, weight: 900, mono: true, color: C.yellow, align: 'center', ls: 4 });
        [[`${MONTHS} meses`, 'de compras por CPF × SKU'], [FMT.mm(ms().customers_modeled), 'clientes'], [FMT.num(ms().sku_subgroups || 0, 0), 'subgrupos de produto'], [FMT.mm(ms().interactions), 'interações cliente × produto']]
          .forEach(([b, l], i) => CASEKIT.tile(ctx, 350 + (i % 2) * 420, 440 + Math.floor(i / 2) * 250, 390, 220, b, l, P(t, T_TILE[i], .4), { seed: 20 + i, rot: [-.02, .015, .01, -.015][i] }));
        text(ctx, 'O QUE DIFICULTAVA', 1440, 300, { size: 26, weight: 900, mono: true, color: '#FFB0A0', align: 'center', ls: 4, alpha: P(t, T_DC[0] - .3, .3) });
        (CS().data_challenges || []).slice(0, 3).forEach((d, i) => CASEKIT.hurdle(ctx, 1440, 410 + i * 170, d, P(t, T_DC[i], .4), i));
        ctx.restore(); }
      // ESTRATÉGIA
      CASEKIT.strategy(ctx, t, PH[2], T_MAT, 'Gerar *cestas de produtos*', 'e encontrar os clientes com mais chance de comprar cada uma', { seed: 21 });
      // COMO FIZEMOS
      const how = P(t, T_MAT - .2, .4) * (1 - P(t, T_IMP - .4, .4));
      CASEKIT.chips(ctx, t, ['BM25', 'Matrix Factorization (ALS)', 'Cosine similarity', 'Cestas + público'], [T_MAT, T_ALS, T_COS, T_DROP], how, 292);
      matrix(ctx, t, 300, 400);
      cosine(ctx, t);
      baskets(ctx, t);
      impact(ctx, t);
      CASEKIT.ruler(ctx, t, PH);
      scanlines(ctx, .05);
    }
  };
})();

/* ---------- case 2 · Cliente Manga (motor de principalidade) ---------- */
(() => {
  const id = 'manga', bt = caseBars(id), CS = () => CASE('Cliente Manga');
  const PH = [0, bt(4), bt(8), bt(16), bt(20)], T_TILE = [bt(4) + .3, bt(4) + 1, bt(5) + .2, bt(5) + .9];
  const T_UMAP = bt(10), T_KM = bt(10) + 1.6, T_EMB = bt(12), T_ALS = bt(14), T_DROP = bt(16), T_INS = bt(18), T_IMP = bt(20), T_PROD = bt(22);
  const CL = 8, R = rng(23), CEN = Array.from({ length: CL }, (_, k) => [Math.cos(k / CL * TAU + .3) * (.55 + .2 * (k % 2)), Math.sin(k / CL * TAU + .3) * (.5 + .15 * (k % 3 === 0))]);
  const PTS = Array.from({ length: 220 }, (_, i) => { const c = i % CL, g = () => (R() + R() + R() - 1.5) * .18; return { c, sx: R() * 2 - 1, sy: R() * 2 - 1, x: CEN[c][0] + g(), y: CEN[c][1] + g() }; });
  const CCOL = [C.red, C.orange, C.yellow, '#FF8A5C', '#E94F64', '#FFC56E', '#FF6A2A', '#F2B04A'];
  const PROD = ['Cartão de crédito', 'Investimentos', 'Seguro de vida', 'Consórcio', 'Previdência'], ORDER = [2, 0, 4, 1, 3], PV = [[-.2, -.55], [.45, -.3], [.6, .35], [-.55, .4], [.1, .6]];
  const POP = FMT.mm(String(dget(CS(), 'analytics_solution.population', '0.092MM')).split(' ')[0]), SUBS = Object.keys(dget(CS(), 'business_results.by_subsegment', {}));
  const HL = headlineFor(/principality gain/i) || '—';
  cue(id, .1, 'whoosh', { dur: .5, v: .3 }); T_TILE.forEach((t0, i) => cue(id, t0, 'pop', { p: .9 + i * .1, v: .18 })); cue(id, PH[2], 'chime', { f: 784, up: 7 });
  cue(id, T_UMAP, 'shimmer', { dur: 2 }); for (let k = 0; k < CL; k++) cue(id, T_KM + k * .27, 'ping', { f: 988 * Math.pow(2, (k % 5) * 2 / 12) });
  cue(id, T_EMB, 'whoosh', { dur: .6, v: .25 }); cue(id, T_ALS, 'stab', { i: 1 }); cue(id, bt(15), 'riser', { dur: T_DROP - bt(15), v: .25 });
  cue(id, T_DROP, 'impact', { size: 1 }); cue(id, T_IMP, 'impact', { size: .9 }); cue(id, T_IMP + .4, 'type', { n: 24, gap: .03 }); cue(id, T_PROD, 'ding');

  function wallet(ctx, t, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(1450, 640); ctx.rotate(-.04);
    [[C.red, -.5, -60], [C.yellow, -.15, -30], [C.orange, .2, 0]].forEach(([c, r, dx], i) => { ctx.save(); ctx.rotate(r * .3); ctx.translate(dx, -120 - i * 6);
      rr(ctx, -150, -95, 300, 190, 18); ctx.fillStyle = c; ctx.fill(); inkRect(ctx, -150, -95, 300, 190, 18, 4, i); rr(ctx, -110, -40, 60, 44, 6); ctx.fillStyle = '#F3D9A0'; ctx.fill(); ctx.restore(); });
    rr(ctx, -230, -40, 460, 220, 26); ctx.fillStyle = '#5A3A22'; ctx.fill(); inkRect(ctx, -230, -40, 460, 220, 26, 5, 9);
    text(ctx, 'carteira do cliente', 0, 80, { size: 28, weight: 800, color: '#F3E6D6', align: 'center' });
    const cp = P(t, 3, .5); if (cp > 0) { scribble(ctx, 'crown', 40, -300, 120, C.yellow, 4, cp, { glow: true }); pill(ctx, 40, -380, 'banco principal?', { size: 24, fill: C.yellow, weight: 900, alpha: cp }); }
    ctx.restore();
  }
  function umap(ctx, t, cx, cy, sc) {
    const p = E.inOutCubic(P(t, T_UMAP, 2.2)), emb = E.inOutCubic(P(t, T_EMB, 1.4)), out = P(t, T_ALS - .3, .6); if (t < T_UMAP - .2 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= P(t, T_UMAP - .2, .4) * (1 - out);
    holo(ctx, cx - sc * 1.25, cy - sc * .95, sc * 2.5, sc * 1.9, { title: emb > .5 ? 'EMBEDDINGS · CLIENTES E PRODUTOS NO MESMO ESPAÇO' : 'UMAP · K-MEANS · 8 SEGMENTOS LOOK-ALIKE', color: C.orange });
    PTS.forEach((q, i) => { const x = cx + lerp(q.sx, q.x, p) * sc, y = cy + lerp(q.sy, q.y, p) * sc * .8, col = p > .4 ? CCOL[q.c] : '#BFB3A3';
      if (emb > 0 && i % 9 === 0) { ctx.save(); ctx.globalAlpha *= emb * .8; line(ctx, cx, cy, x, y, rgba(col, .8), 2); ctx.restore(); }
      circle(ctx, x, y, 5, col); });
    CEN.forEach(([x, y], k) => { const a = P(t, T_KM + k * .27, .3) * (1 - emb * .7); if (a <= 0) return; const px = cx + x * sc, py = cy + y * sc * .8, s = 14 * E.outBack(a);
      glow(ctx, px, py, 60, CCOL[k], .5 * a); line(ctx, px - s, py - s, px + s, py + s, '#FFF', 5); line(ctx, px - s, py + s, px + s, py - s, '#FFF', 5);
      text(ctx, 'Seg ' + 'ABCDEFGH'[k], px, py + 30, { size: 16, weight: 800, mono: true, color: '#FFF', align: 'center', alpha: a }); });
    if (emb > 0) { circle(ctx, cx, cy, 8, '#FFF'); PROD.forEach((nm, k) => { const a = P(t, T_EMB + .5 + k * .2, .4); if (a <= 0) return; const px = cx + PV[k][0] * sc * 1.1, py = cy + PV[k][1] * sc * .8;
        ctx.save(); ctx.globalAlpha *= a; line(ctx, cx, cy, px, py, C.yellow, 4); arrowHead(ctx, px, py, Math.atan2(py - cy, px - cx), 16, C.yellow);
        rr(ctx, px - 14, py - 14, 28, 28, 5); ctx.fillStyle = C.yellow; ctx.fill(); inkRect(ctx, px - 14, py - 14, 28, 28, 5, 2.5, k); pill(ctx, px, py - 34, nm, { size: 16, fill: '#F6EEDF', weight: 900 }); ctx.restore(); });
      formula(ctx, 'afinidade(u, p) = u · p', cx + sc * 1.05, cy + sc * .95 + 20, { size: 20, rot: -.02, seed: 7, alpha: emb }); }
    const q = dget(CS(), 'analytics_solution.segmentation_quality', {}), eggs = [[`trustworthiness ${FMT.auto(q.umap_trustworthiness)}`, 260, 330], [`silhouette ${FMT.auto(q.silhouette)}`, 1660, 330], [`Davies-Bouldin ${FMT.auto(q.davies_bouldin)}`, 260, 860], [`Calinski-Harabasz ${FMT.num(q.calinski_harabasz || 0, 0)}`, 1660, 860]];
    eggs.forEach(([s, x, y], i) => formula(ctx, s, x, y, { size: 18, neon: i % 2 === 1, alpha: P(t, T_KM + i * .5, .4) * (1 - emb), rot: (i % 2 ? .03 : -.03), seed: 20 + i }));
    ctx.restore();
  }
  function lists(ctx, t) {
    const p = P(t, T_ALS, .5), out = P(t, T_IMP - .4, .5); if (p <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= p * (1 - out);
    [['cross-sell · produtos novos', 560], ['upsell · subir de nível', 1060]].forEach(([l, x]) => text(ctx, l.toUpperCase(), x, 380, { size: 22, weight: 900, mono: true, color: C.yellow, align: 'center', ls: 3 }));
    const dp = E.inOutCubic(P(t, T_DROP, 1.4));
    PROD.forEach((nm, i) => [560, 1060].forEach(x => {
      const to = ORDER.indexOf(i), y = 450 + lerp(i, to, dp) * 86, arc = Math.sin(dp * Math.PI) * (to - i) * 30, top = to < 3 && dp > .9;
      ctx.save(); ctx.translate(x + arc, y);
      paper(ctx, -210, -34, 420, 68, { r: 10, fill: top ? C.orange : '#F6EEDF', shadow: 6, shadowColor: '#000', lw: 3 });
      text(ctx, `${(dp > .5 ? to : i) + 1}. ${nm}`, -184, 1, { size: 24, weight: 800, color: top ? '#FFF' : INK }); if (dp > .5) pill(ctx, 150, 0, `ΔP ${['+++', '++', '+', '·', '·'][to]}`, { size: 16, fill: to < 3 ? C.yellow : '#BFB3A3', weight: 900, alpha: dp });
      ctx.restore(); }));
    if (dp > 0) { ctx.save(); ctx.globalAlpha *= dp; ctx.translate(1560, 560); ctx.rotate(.02);
      paper(ctx, -230, -150, 460, 300, { torn: true, seed: 31, fill: '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3.5 });
      pill(ctx, 0, -118, 'CAMADA ΔP', { size: 20, fill: C.red, color: '#FFF', weight: 900 });
      text(ctx, 'score =', 0, -60, { size: 26, weight: 800, mono: true, color: INK, align: 'center' });
      text(ctx, 'afinidade · conversão · ΔP', 0, -22, { size: 21, weight: 900, mono: true, color: C.orange, align: 'center' });
      const pts = dget(CS(), 'business_results.principality_points_top3', ''), m = String(pts).match(/([\d.]+)\s*pts.*?([\d.]+)\s*pts/);
      if (m) { text(ctx, `top-3 com ΔP: ${FMT.auto(m[1])} pts`, 0, 40, { size: 24, weight: 900, color: INK, align: 'center' }); text(ctx, `só afinidade: ${FMT.auto(m[2])} pts`, 0, 80, { size: 22, weight: 700, color: '#6A6056', align: 'center' }); }
      ctx.restore(); }
    const ip = P(t, T_INS, .5); if (ip > 0) CASEKIT.note(ctx, W / 2, 900, 1200, 'A lista curta, reordenada pelo ganho de principalidade, vira a recomendação de cada associado.', ip, { fill: '#F6EEDF', size: 25, label: 'DECISÃO' });
    ctx.restore();
  }
  function impact(ctx, t) {
    const p = P(t, T_IMP, .4); if (p <= 0) return;
    CASEKIT.headline(ctx, t, T_IMP, 520, 470, HL, 'de principalidade vs. controle (backtest)', { col: C.red, seed: 13 });
    const br = dget(CS(), 'business_results', {});
    Object.entries(br.by_subsegment || {}).forEach(([k, v], i) => pill(ctx, 230 + i * 195, 760, `${k} ${FMT.auto(v)}`, { size: 22, fill: [C.yellow, C.orange, C.yellow, '#F6EEDF'][i], weight: 900, scale: E.outBack(P(t, T_IMP + .6 + i * .15, .35)), alpha: P(t, T_IMP + .6 + i * .15, .2) }));
    if (br.best_cluster) pill(ctx, 520, 840, 'melhor segmento · ' + FMT.auto(br.best_cluster.replace('Segmento', 'Seg.')), { size: 24, fill: C.red, color: '#FFF', weight: 900, alpha: P(t, T_IMP + 1.4, .4) });
    receipt(ctx, 1420, 300, { w: 580, p: P(t, T_PROD - .4, 2.4), rot: .015, title: 'PRODUTIZADO NO CLIENTE', lines: [
      ['associados analisados', FMT.mm(br.associates_analyzed)], ['top-3 · grupo 1', FMT.auto(dget(br, 'top3.group_1_share', '—'))], ['top-5 · grupo 1', FMT.auto(dget(br, 'top5.group_1_share', '—'))],
      ['retreino', 'semestral'], ['pipeline', 'mensal'], ['ajuste da recomendação', 'diário'], ['métricas', (dget(CS(), 'operationalization.assets', []) || []).some(a => /MLflow/.test(a)) ? 'MLflow' : '—']] });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_DROP - .15, T_DROP + 1.8], [T_IMP - .1, T_IMP + 1.4, .8]],
    caps: [[.6, 4.3, 'O desafio: recomendar produtos que façam o cliente *escolher o banco como principal*', 'PROBLEMA'],
      [4.5, PH[1] - .2, 'Até então a recomendação olhava *só afinidade e conversão*', 'PROBLEMA'],
      [PH[1] + .2, PH[2] - .2, `O que o cliente tinha: *${POP} associados pessoa física*, seus produtos e a principalidade de cada um`, 'DADOS'],
      [PH[2] + .2, T_UMAP - .2, 'Nossa estratégia: um *motor de recomendação* que prioriza o que aumenta a principalidade', 'ESTRATÉGIA'],
      [T_UMAP + .1, T_EMB - .2, '1 · *UMAP + K-Means* agrupam associados parecidos em 8 segmentos look-alike', 'COMO FIZEMOS'],
      [T_EMB + .1, T_ALS - .2, '2 · *Embeddings* colocam clientes e produtos no mesmo espaço: perto = afinidade', 'COMO FIZEMOS'],
      [T_ALS + .1, T_DROP - .2, '3 · *Matrix Factorization (ALS)* gera as listas de cross-sell e upsell em paralelo', 'COMO FIZEMOS'],
      [T_DROP + .2, T_INS - .1, '4 · A camada *ΔP* reordena cada lista pelo ganho esperado de principalidade', 'SOLUÇÃO'],
      [T_INS + .1, T_IMP - .2, 'Cada associado recebe uma *lista curta* com o que mais aumenta a principalidade', 'DECISÃO'],
      [T_IMP + .2, T_PROD - .2, `*${HL}* de principalidade vs. controle no backtest da lista curta`, 'IMPACTO'],
      [T_PROD, 53.4, 'E o motor está *produtizado*: retreino semestral, pipeline mensal e ajuste diário', 'IMPACTO']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#1E1410' });
      neonGrid(ctx, t, { horizon: 960, alpha: .3, speed: .4 + BT.level });
      CASEKIT.header(ctx, t, 'CASE 2 DE 4 · EMISSORES', 'Cliente Manga · motor de principalidade', { at: .1, seed: 8, bg: C.orange });
      const q1 = 1 - P(t, PH[1] - .3, .4);
      if (q1 > 0) { ctx.save(); ctx.globalAlpha *= q1; CASEKIT.note(ctx, 640, 560, 940, CS().business_problem || '', P(t, .5, 3.6), { size: 32, label: 'PROBLEMA' }); wallet(ctx, t, P(t, .8, .6)); ctx.restore(); }
      const q2 = P(t, PH[1] - .1, .3) * (1 - P(t, PH[2] - .3, .4));
      if (q2 > 0) { ctx.save(); ctx.globalAlpha *= q2;
        text(ctx, 'O QUE O CLIENTE TINHA', W / 2, 300, { size: 26, weight: 900, mono: true, color: C.yellow, align: 'center', ls: 4 });
        [[POP, 'associados pessoa física'], [String(SUBS.length || 4), `subsegmentos: ${SUBS.join(', ') || 'PF I a IV+'}`], ['produtos', 'que cada associado já tem'], ['principalidade', 'o indicador atual de cada um']]
          .forEach(([b, l], i) => CASEKIT.tile(ctx, 300 + i * 440, 560, 400, 260, b, l, P(t, T_TILE[i], .4), { seed: 30 + i, rot: [-.02, .015, -.01, .02][i], size: 72 }));
        ctx.restore(); }
      CASEKIT.strategy(ctx, t, PH[2], T_UMAP, 'Um *motor de recomendação*', 'que prioriza os produtos que mais aumentam a principalidade', { seed: 23 });
      const how = P(t, T_UMAP - .2, .4) * (1 - P(t, T_IMP - .4, .4));
      CASEKIT.chips(ctx, t, ['UMAP + K-Means', 'Embeddings', 'Matrix Factorization (ALS)', 'Camada ΔP'], [T_UMAP, T_EMB, T_ALS, T_DROP], how, 292);
      umap(ctx, t, W / 2, 620, 300);
      lists(ctx, t);
      impact(ctx, t);
      CASEKIT.ruler(ctx, t, PH);
      scanlines(ctx, .06);
    }
  };
})();

/* ---------- case 3 · Lights-off (relatórios de fraude automáticos) ---------- */
(() => {
  const id = 'lightsoff', bt = caseBars(id), CS = () => CASE('Lights-off');
  const PH = [0, bt(4), bt(8), bt(16), bt(20)], T_STRAT = bt(8), T_PIPE = bt(10), T_HAND = bt(15), T_DROP = bt(16), T_RUN = bt(16) + .6, T_STAMP = bt(18), T_IMP = bt(20), T_Q = bt(22), T_DIVE = bt(23);
  const NODES = [['Dados', 'db'], ['Validação', 'check'], ['Processamento', 'gear'], ['Destaques', 'ai'], ['Relatório', 'doc'], ['Board', 'board']];
  const CYCLE = ['Extrair os dados', 'Conferir', 'Copiar e colar', 'Escrever destaques', 'Revisar', 'Enviar ao board'];
  const EGG = ['SQL · parquet', 'z = (x − μ)/σ', 'DAG ⟳ · idempotente', '? destaques', 'PDF · PPT', 'cron 0 7 * * 1'];
  const LABELS = ['PROBLEMA', 'TRABALHO MANUAL', 'ESTRATÉGIA', 'SOLUÇÃO', 'IMPACTO'];
  const nx = i => 220 + i * 262, NY = 560;
  cue(id, .1, 'whoosh', { dur: .5, v: .3 }); for (let k = 0; k < 6; k++) cue(id, PH[1] + k * 1.4, 'tick', {}); cue(id, T_STRAT, 'chime', { f: 784, up: 7 });
  NODES.forEach((_, i) => cue(id, T_PIPE + i * 1.6, 'pop', { p: .8 + i * .1, v: .18 })); cue(id, T_HAND, 'riser', { dur: T_DROP - T_HAND, v: .25 });
  cue(id, T_DROP, 'click', { v: 1 }); cue(id, T_DROP + .05, 'impact', { size: 1.1 }); NODES.forEach((_, i) => cue(id, T_RUN + i * .3, 'ping', { f: 880 * Math.pow(2, i * 2 / 12) }));
  cue(id, T_STAMP, 'ding'); cue(id, T_IMP, 'impact', { size: .8 }); cue(id, T_DIVE, 'whoosh', { dur: 1.4, dir: 'down', v: .45 });
  const PAPERS = Array.from({ length: 40 }, (_, k) => ({ x: (hash(k * 3.1) - .5) * 1500, r: (hash(k * 7.7) - .5) * .5, at: k * .42 }));

  /** interruptor de parede: on = 1 (luz acesa), 0 = apagada */
  function lightSwitch(ctx, x, y, s, on, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    paper(ctx, -90, -150, 180, 300, { r: 26, fill: '#F3EBDD', shadow: 12, shadowColor: '#000', lw: 5 });
    circle(ctx, 0, -120, 7, '#BFB3A3', INK, 2); circle(ctx, 0, 120, 7, '#BFB3A3', INK, 2);
    rr(ctx, -40, -80, 80, 160, 14); ctx.fillStyle = '#2A221C'; ctx.fill(); inkRect(ctx, -40, -80, 80, 160, 14, 3, 2);
    const ty = lerp(36, -36, on); rr(ctx, -32, ty - 40, 64, 80, 12); const g = ctx.createLinearGradient(0, ty - 40, 0, ty + 40); g.addColorStop(0, '#FFFDF8'); g.addColorStop(1, '#D9CFC0'); ctx.fillStyle = g; ctx.fill(); inkRect(ctx, -32, ty - 40, 64, 80, 12, 3, 4);
    text(ctx, 'LIGA', 0, -108, { size: 16, weight: 900, mono: true, color: on > .5 ? C.red : '#8A8378', align: 'center' }); text(ctx, 'DESLIGA', 0, 108, { size: 16, weight: 900, mono: true, color: on > .5 ? '#8A8378' : C.orange, align: 'center' });
    if (o.label) pill(ctx, 0, 196, o.label, { size: 20, fill: on > .5 ? C.yellow : C.orange, weight: 900 });
    ctx.restore();
  }
  function hand(ctx, x, y, p) {
    if (p <= 0) return; const e = E.outCubic(p); ctx.save(); ctx.translate(x + (1 - e) * 420, y + (1 - e) * 420); ctx.rotate(.75); ctx.scale(1.2, 1.2);
    rr(ctx, 0, -34, 420, 68, 30); ctx.fillStyle = '#F2C9A0'; ctx.fill(); inkRect(ctx, 0, -34, 420, 68, 30, 4, 7);
    rr(ctx, -60, -20, 90, 38, 18); ctx.fillStyle = '#F2C9A0'; ctx.fill(); inkRect(ctx, -60, -20, 90, 38, 18, 4, 8);
    rr(ctx, 300, -44, 180, 88, 20); ctx.fillStyle = C.red; ctx.fill(); inkRect(ctx, 300, -44, 180, 88, 20, 4, 9);
    ctx.restore();
  }
  SCENES[id] = {
    themeAt: t => t < T_DROP ? 'light' : 'dark', fx: { invert: true },
    peaks: [[T_DROP - .15, T_DROP + 1.8], [T_IMP - .1, T_IMP + 1.2, .7]],
    caps: [[.6, 4.3, 'Antes: cada relatório de fraude para o board era *montado à mão*', 'PROBLEMA'],
      [4.5, PH[1] - .2, 'Muitos relatórios, todo ciclo: *muito trabalho* e pouco tempo para analisar', 'PROBLEMA'],
      [PH[1] + .2, PH[2] - .2, 'Extrair, conferir, copiar, colar, revisar… *relatório após relatório*, todo ciclo', 'TRABALHO MANUAL'],
      [PH[2] + .2, T_PIPE - .2, 'Nossa estratégia: *automatizar de ponta a ponta* — para poder apagar as luzes', 'ESTRATÉGIA'],
      [T_PIPE + .1, T_PIPE + 4.6, '1 · Os *dados* entram sozinhos e passam por *validação*', 'COMO FIZEMOS'],
      [T_PIPE + 4.8, T_HAND - .2, '2 · O *processamento* calcula os indicadores e monta os *destaques*', 'COMO FIZEMOS'],
      [T_HAND, T_DROP - .1, '3 · O *relatório* sai no formato do board… falta só uma coisa', 'COMO FIZEMOS'],
      [T_DROP + .2, T_STAMP - .1, '*Lights-off*: apagamos as luzes e o relatório roda sozinho', 'SOLUÇÃO'],
      [T_STAMP + .1, T_IMP - .2, 'Do dado ao board, *sem ninguém copiar e colar*', 'SOLUÇÃO'],
      [T_IMP + .2, T_Q - .2, 'Resultado: relatórios para o board *sem trabalho manual* — o time volta a analisar', 'IMPACTO'],
      [T_Q, 53.4, 'Mas quem escreve os *destaques* em escala? É o próximo case', 'E AGORA?']],
    draw(ctx, t) {
      const dark = P(t, T_DROP, .15), dive = E.inCubic(P(t, T_DIVE, 2.2)), sw = 1 - P(t, T_DROP - .05, .1);
      ctx.save();
      if (dive > 0) { const n = nx(3); ctx.translate(n, NY); ctx.scale(1 + dive * 14, 1 + dive * 14); ctx.translate(-n, -NY); }
      bgLight(ctx, t); if (dark > 0) { ctx.save(); ctx.globalAlpha = dark; bgDark(ctx, t, { centerA: .7, center: '#1A120C' }); ctx.restore(); }
      // PROBLEMA + TRABALHO MANUAL: papelada que só cresce
      const man = 1 - P(t, PH[2] - .3, .5);
      if (man > 0) { ctx.save(); ctx.globalAlpha *= man; collage(ctx, t, { seed: 71, n: 6, theme: 'light' });
        PAPERS.forEach((q, k) => { const p = E.outBack(P(t, .3 + q.at, .3)); if (p <= 0) return; const stack = k % 4, x = 260 + stack * 460 + q.x * .05, y = 880 - Math.floor(k / 4) * 26;
          ctx.save(); ctx.translate(x, y); ctx.rotate(q.r * .2); ctx.scale(p, p); paper(ctx, -150, -16, 300, 32, { fill: '#FFFDF8', shadow: 3, lw: 2.5 }); line(ctx, -120, 0, 80, 0, '#BFB3A3', 3); ctx.restore(); });
        const cy = 560, cx = 960;
        if (t < PH[1]) { CASEKIT.note(ctx, cx, 420, 1200, CS().business_problem || 'Os relatórios de fraude para o board eram montados à mão, um a um, a cada ciclo.', P(t, .4, 2.4), { size: 34, label: 'PROBLEMA', fill: C.yellow, minH: 120 });
          ctx.save(); ctx.translate(1600, 640); icon(ctx, 'clock', 0, 0, 120, INK, 8); ctx.restore(); }
        else { const sp = t - PH[1], ang = sp * (1.2 + sp * .25);
          CYCLE.forEach((c, i) => { const a = i / CYCLE.length * TAU - Math.PI / 2, x = cx + Math.cos(a) * 470, y = cy - 40 + Math.sin(a) * 230, on = Math.floor(ang / TAU * CYCLE.length) % CYCLE.length === i;
            const p = E.outBack(P(t, PH[1] + i * .25, .35)); if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p * (on ? 1.1 : 1), p * (on ? 1.1 : 1));
            paper(ctx, -150, -36, 300, 72, { r: 12, fill: on ? C.orange : '#FFFDF8', shadow: 6, lw: 3 }); text(ctx, c, 0, 1, { size: 26, weight: 900, color: on ? '#FFF' : INK, align: 'center' }); ctx.restore(); });
          agent(ctx, cx, cy - 40, 70, { role: 'analista', t, seed: 2, look: Math.sin(t * 6), squash: .1 * Math.sin(t * 12) });
          [[-80, -70], [80, -80]].forEach(([dx, dy], k) => { const d = (t * 1.6 + k * .5) % 1; circle(ctx, cx + dx, cy - 40 + dy + d * 60, 9 * (1 - d), '#7FC8FF'); });
          pill(ctx, cx, cy + 90, 'de novo… e de novo', { size: 22, fill: C.red, color: '#FFF', weight: 900, rot: -.04 });
          ctx.save(); ctx.translate(1700, 300); icon(ctx, 'clock', 0, 0, 100, INK, 8); ctx.restore(); }
        ctx.restore(); }
      // ESTRATÉGIA
      CASEKIT.strategy(ctx, t, T_STRAT, T_PIPE, 'Automatizar *de ponta a ponta*', 'e apagar as luzes: o relatório passa a rodar sozinho', { seed: 25, y: 560 });
      // o pipeline nasce ainda com a luz acesa e acende em neon quando a luz apaga
      if (t > T_PIPE - .2) {
        NODES.forEach(([nm, ic], i) => { const p = E.outBack(P(t, T_PIPE + i * 1.6, .4)); if (p <= 0) return; const x = nx(i), hot = i === 3 && t > T_IMP;
          if (i) { const lp = P(t, T_PIPE + (i - .4) * 1.6, .5); if (dark > 0) { ctx.save(); ctx.shadowColor = C.orange; ctx.shadowBlur = 12 * dark; line(ctx, nx(i - 1) + 72, NY, lerp(nx(i - 1) + 72, x - 72, lp), NY, C.orange, 5); ctx.restore(); } else line(ctx, nx(i - 1) + 72, NY, lerp(nx(i - 1) + 72, x - 72, lp), NY, INK, 5); }
          if (dark > 0) { ctx.save(); ctx.globalAlpha *= dark; holo(ctx, x - 80, NY - 80, 160, 160, { color: hot ? C.yellow : C.orange, corners: hot }); ctx.restore(); }
          if (dark < 1) { ctx.save(); ctx.globalAlpha *= 1 - dark; paper(ctx, x - 80, NY - 80, 160, 160, { r: 14, fill: '#FFFDF8', shadow: 8, lw: 3.5 }); ctx.restore(); }
          ctx.save(); ctx.translate(x, NY - 6); ctx.scale(p, p); icon(ctx, ic, 0, 0, 66, dark > .5 ? '#FFE9D6' : INK, 8); ctx.restore();
          if (hot) { glow(ctx, x, NY, 160, C.yellow, .5); neonText(ctx, '?', x + 56, NY - 86, { size: 70, weight: 900, glow: C.yellow }); }
          if (dark > .5) neonText(ctx, nm, x, NY + 116, { size: 26, weight: 800, align: 'center' }); else text(ctx, nm, x, NY + 116, { size: 26, weight: 900, color: INK, align: 'center' });
          if (dark > .5) formula(ctx, EGG[i], x, NY + 176, { size: 15, neon: true, alpha: P(t, T_RUN + i * .3, .4) * (1 - P(t, T_IMP - .3, .3)), rot: (i % 2 ? .03 : -.03) }); });
        if (t > T_RUN) for (let k = 0; k < 6; k++) { const u = ((t - T_RUN) * .45 + k / 6) % 1, x = lerp(nx(0), nx(5), u); circle(ctx, x, NY, 9, C.yellow); }
      }
      // o interruptor
      const swA = P(t, T_STRAT + .3, .5) * (1 - P(t, T_STAMP, .5)); if (swA > 0) { ctx.save(); ctx.globalAlpha *= swA; lightSwitch(ctx, 1808, 560, .82, sw, { label: sw > .5 ? 'trabalho manual' : 'lights-off' }); ctx.restore();
        hand(ctx, 1830, 600, P(t, T_HAND, T_DROP - T_HAND - .1) * (1 - P(t, T_DROP + .3, .5))); }
      if (dark > 0 && dark < 1) flash(ctx, 1 - dark, '#000000');
      const sb = P(t, T_STAMP, .4); if (sb > 0) stamp(ctx, W / 2, 330, dget(CS(), 'business_results.headline', '') || 'Relatório automatizado', sb * (1 - P(t, T_IMP - .3, .3)), { theme: 'dark' });
      // IMPACTO: antes × depois
      const ip = P(t, T_IMP, .5) * (1 - P(t, T_DIVE, .5)); if (ip > 0) { ctx.save(); ctx.globalAlpha *= ip;
        [['ANTES', 'montado à mão, relatório por relatório', C.red, 'doc'], ['DEPOIS', 'gerado sozinho, no formato do board', C.orange, 'check']].forEach(([h, l, c, ic], i) => {
          const x = i ? 1300 : 620, s = E.outBack(P(t, T_IMP + i * .4, .4)); ctx.save(); ctx.translate(x, 340); ctx.scale(s, s); ctx.rotate(i ? .02 : -.02);
          paper(ctx, -300, -80, 600, 160, { torn: true, seed: 50 + i, fill: '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3.5 });
          pill(ctx, -200, -50, h, { size: 20, fill: c, color: '#FFF', weight: 900 }); icon(ctx, ic, 230, 10, 70, c, 9);
          text(ctx, twoLines(l), -40, 20, { size: 28, weight: 800, color: INK, align: 'center', lh: 1.1 }); ctx.restore(); });
        if (t > T_Q) rich(ctx, 'Mas quem escreve os *destaques*?', W / 2, 860, { size: 56, weight: 900, color: '#FFF', retro: true, alpha: P(t, T_Q, .5) * (1 - dive) });
        ctx.restore(); }
      ctx.restore();
      if (dive > .6) flash(ctx, (dive - .6) / .4, C.orange);
      CASEKIT.header(ctx, t, 'CASE 3 DE 4 · RELATÓRIOS', 'Lights-off · relatórios de fraude', { at: .1, seed: 11, out: T_DIVE, bg: t < T_DROP ? C.red : C.orange });
      CASEKIT.ruler(ctx, t, PH, LABELS, 1 - dive);
      if (dark > 0) scanlines(ctx, .06 * dark);
    }
  };
})();

/* ---------- case 4 · Insight Agent (agentes de IA: insights em escala) ---------- */
(() => {
  const id = 'insight', bt = caseBars(id), CS = () => CASE('Insight Agent');
  const PH = [0, bt(4), bt(8), bt(16), bt(22)], LABELS = ['PROBLEMA', 'RESTRIÇÃO', 'ESTRATÉGIA', 'SOLUÇÃO', 'IMPACTO'];
  const T_BAN = .2, T_STRAT = bt(8), T_GEN = bt(10), T_JUD = bt(12), T_REJ = bt(13), T_FIX = bt(13) + 1.1, T_SC = bt(14), T_OK = bt(15), T_DROP = bt(16), T_WALL2 = bt(20), T_IMP = bt(22), T_IMP2 = bt(25);
  const AX = [250, 480, 710], JX = 1010, FX_ = 1300, DX = 1620, AY = 540;
  const N_ACQ = dget(CS(), 'business_results.pipeline.acquirers', 30);
  cue(id, T_BAN, 'impact', { size: .8 }); cue(id, PH[1], 'buzz'); cue(id, T_STRAT, 'chime', { f: 784, up: 7 });
  cue(id, T_GEN, 'type', { n: 18, gap: .05 }); cue(id, T_REJ, 'buzz'); cue(id, T_FIX, 'type', { n: 10, gap: .05 }); cue(id, T_SC, 'shimmer', { dur: 1.5 }); cue(id, T_OK, 'ding');
  cue(id, T_OK + .4, 'riser', { dur: T_DROP - T_OK - .4, v: .25 }); cue(id, T_DROP, 'impact', { size: 1.2 }); for (let k = 0; k < 10; k++) cue(id, T_DROP + .4 + k * .25, 'pop', { p: 1 + k * .05, v: .1 });
  cue(id, T_WALL2, 'impact', { size: .9 }); cue(id, T_IMP, 'impact', { size: 1 });

  function banner(ctx, t) {
    const a = P(t, T_BAN, .4) * (1 - P(t, 3.6, .5)); if (a <= 0) return;
    ctx.save(); ctx.fillStyle = rgba('#0C0806', .8 * a); ctx.fillRect(0, 0, W, H); ctx.globalAlpha *= a; ctx.translate(W / 2, H / 2 - 20); const s = lerp(1.6, 1, E.outExpo(a)); ctx.scale(s, s);
    glow(ctx, 0, 0, 700, C.yellow, .3);
    pill(ctx, 0, -150, 'CASE 4 DE 4', { size: 26, fill: C.red, color: '#FFF', weight: 900 });
    rich(ctx, 'Um case de *agentes de IA*', 0, -30, { size: 110, weight: 900, color: '#FFF', accent: C.yellow, retro: true, depth: 7, lw: 5 });
    text(ctx, 'que escala a geração de insights para milhares de páginas e painéis', 0, 80, { size: 36, weight: 800, color: '#FFE9D6', align: 'center' });
    ctx.restore();
  }
  function problem(ctx, t) {
    const a = P(t, 3.4, .5) * (1 - P(t, PH[1] - .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    dashboard(ctx, 170, 300, 880, 560, { t: t - 3.4, seed: 4 });
    rr(ctx, 230, 760, 760, 80, 10); ctx.fillStyle = '#FFF8E8'; ctx.fill(); ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    const typed = 'Destaques: o market share caiu no…'.slice(0, Math.floor(clamp((t - 4.5) / 4) * 22)); text(ctx, typed + (Math.floor(t * 3) % 2 ? '|' : ''), 260, 800, { size: 26, weight: 800, color: INK });
    pill(ctx, 610, 300, 'escrito à mão, página a página', { size: 22, fill: C.red, color: '#FFF', weight: 900, rot: -.03 });
    text(ctx, `${N_ACQ} adquirentes esperando`, 1450, 300, { size: 28, weight: 900, color: '#FFF', align: 'center' });
    for (let k = 0; k < N_ACQ; k++) { const x = 1240 + (k % 6) * 84, y = 380 + Math.floor(k / 6) * 92, p = E.outBack(P(t, 4 + k * .05, .3)); if (p <= 0) continue;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p); circle(ctx, 0, 0, 32, '#2E2620', rgba(C.orange, .6), 3); icon(ctx, 'store', 0, 0, 36, rgba('#FFFFFF', .7), 6); ctx.restore(); }
    ctx.restore();
  }
  function restriction(ctx, t) {
    const a = P(t, PH[1] - .1, .4) * (1 - P(t, PH[2] - .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.save(); ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 30; rr(ctx, 160, 290, 1000, 600, 30); ctx.strokeStyle = C.yellow; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
    text(ctx, TX.perimeter, 200, 324, { size: 26, weight: 900, mono: true, color: C.yellow, ls: 4 });
    icon(ctx, 'db', 480, 600, 150, '#FFE9D6', 9); icon(ctx, 'shield', 860, 600, 150, C.yellow, 9);
    text(ctx, 'dados de transações', 480, 740, { size: 28, weight: 800, color: '#FFF', align: 'center' }); text(ctx, 'privacidade Mastercard', 860, 740, { size: 28, weight: 800, color: '#FFF', align: 'center' });
    const cp = P(t, PH[1] + 2.5, .5); if (cp > 0) { ctx.save(); ctx.globalAlpha *= cp; ctx.translate(1520, 560);
      [[-70, 10, 80], [0, -30, 100], [80, 10, 80]].forEach(([x, y, r]) => circle(ctx, x, y, r, '#3A322B', '#8A8378', 4));
      text(ctx, 'API externa', 0, 10, { size: 32, weight: 900, color: '#BFB3A3', align: 'center' }); text(ctx, 'de IA', 0, 50, { size: 32, weight: 900, color: '#BFB3A3', align: 'center' });
      scribble(ctx, 'x', 0, 0, 260, C.red, 9, P(t, PH[1] + 3, .5), { glow: true }); ctx.restore();
      ctx.save(); ctx.globalAlpha *= cp; line(ctx, 1170, 560, 1330, 560, C.red, 6, [12, 10]); arrowHead(ctx, 1330, 560, 0, 20, C.red); ctx.restore(); }
    ctx.restore();
  }
  function circuit(ctx, t) {
    const out = P(t, T_DROP - .3, .4); if (out >= 1 || t < T_GEN - .5) return;
    ctx.save(); ctx.globalAlpha *= (1 - out) * P(t, T_GEN - .5, .5);
    ctx.save(); ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 30; rr(ctx, 100, 360, 1720, 520, 30); ctx.strokeStyle = rgba(C.yellow, .7); ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
    text(ctx, TX.perimeter + ' · IA LOCAL EM GPU', 140, 390, { size: 20, weight: 900, mono: true, color: C.yellow, ls: 4 });
    TX.agents.gen.forEach((g, i) => { const p = E.outBack(P(t, T_GEN + i * .25, .4)); if (p <= 0) return;
      agent(ctx, AX[i], AY, 58 * p, { role: g.role, t: t + i, seed: i, look: Math.sin(t * 2 + i) });
      text(ctx, g.name, AX[i], AY + 92, { size: 22, weight: 800, color: '#FFF', align: 'center' });
      const dp = P(t, T_GEN + .8 + i * .3, .6); if (dp > 0) { const m = P(t, T_JUD - .6 + i * .15, .6, E.inOutCubic), ux = lerp(AX[i] + 40, JX - 120, m), uy = lerp(AY - 120, AY - 40 + i * 30, m);
        ctx.save(); ctx.translate(ux, uy); ctx.rotate(-.05 + i * .04); paper(ctx, -70, -40, 140, 80, { fill: '#FFFDF8', shadow: 5, shadowColor: '#000', lw: 2 }); for (let l = 0; l < 3; l++) line(ctx, -50, -18 + l * 18, 40 - l * 14, -18 + l * 18, '#8A8378', 4); ctx.restore(); } });
    text(ctx, 'GERADORES', 470, AY + 140, { size: 20, weight: 900, mono: true, color: C.yellow, align: 'center', ls: 3, alpha: P(t, T_GEN, .4) });
    [['Regex', 860], ['BERT', 1140]].forEach(([g, x], i) => { const a = P(t, T_JUD - .3 + i * .2, .4); if (a <= 0) return; holo(ctx, x - 46, AY - 150, 92, 300, { color: C.yellow, alpha: a * .8, corners: false }); neonText(ctx, g, x, AY - 180, { size: 22, weight: 800, align: 'center', glow: C.yellow, alpha: a }); });
    const jp = E.outBack(P(t, T_JUD, .4)); if (jp > 0) { agent(ctx, JX, AY, 62 * jp, { role: 'validador', t, seed: 9, verdict: t > T_REJ && t < T_FIX ? 'no' : t > T_OK ? 'ok' : null }); text(ctx, TX.agents.judges, JX, AY + 94, { size: 22, weight: 800, color: '#FFF', align: 'center' }); }
    if (t > T_REJ && t < T_FIX + .4) { ctx.save(); ctx.globalAlpha *= 1 - P(t, T_FIX, .4); scribble(ctx, 'x', JX + 80, AY - 110, 90, C.red, 3, P(t, T_REJ, .3), { glow: true }); text(ctx, 'reprovado', JX + 80, AY - 170, { size: 22, weight: 900, mono: true, color: C.red, align: 'center' }); ctx.restore(); }
    const fp = E.outBack(P(t, T_FIX - .3, .4)); if (fp > 0) { agent(ctx, FX_, AY, 62 * fp, { role: 'embalador', t: t + 2, seed: 4, look: Math.sin(t * 3) }); text(ctx, TX.agents.fixers, FX_, AY + 94, { size: 22, weight: 800, color: '#FFF', align: 'center' }); }
    const sol = dget(CS(), 'analytics_solution.innovation_2', {}), sp = P(t, T_SC, .5);
    if (sp > 0) { holo(ctx, 640, 700, 640, 120, { title: 'NOTA DE QUALIDADE DO INSIGHT', color: C.orange, alpha: sp });
      text(ctx, `${sol.algorithm || 'Random Forest'} · ${sol.nlp_features || '—'} features de NLP · MAE fora do tempo ${FMT.auto(sol.out_of_time_mae)}`, 960, 772, { size: 22, weight: 800, mono: true, color: '#FFE9D6', align: 'center', alpha: sp });
      for (let k = 0; k < 10; k++) { rr(ctx, 1300 + k * 22, 740, 16, 50, 3); ctx.fillStyle = k < 8 ? C.yellow : rgba(C.orange, .4); ctx.fill(); } }
    const ok = P(t, T_OK, .4); if (ok > 0) stamp(ctx, DX, AY - 20, TX.agents.done, ok, { theme: 'dark' });
    ctx.restore();
  }
  /** o drop: milhares de páginas e painéis sendo escritos pelos agentes (a câmera se afasta) */
  function wall(ctx, t) {
    const a = P(t, T_DROP - .1, .3) * (1 - P(t, T_IMP - .4, .5)); if (a <= 0) return;
    const z = lerp(1, .16, E.inOutCubic(P(t, T_DROP, 8))) * lerp(1, .55, E.inOutCubic(P(t, T_WALL2, 2.5))), pw = 300 * z, ph = 190 * z, gx = pw * 1.18, gy = ph * 1.22;
    const cols = Math.ceil(W / gx) + 2, rows = Math.ceil(H / gy) + 2, ox = W / 2 - Math.floor(cols / 2) * gx - pw / 2, oy = H / 2 - Math.floor(rows / 2) * gy - ph / 2, ct = t - T_DROP;
    ctx.save(); ctx.globalAlpha *= a;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = ox + c * gx, y = oy + r * gy, d = Math.hypot(c - cols / 2, r - rows / 2), born = d * .08 / Math.max(.2, z * 3), p = clamp((ct - born) * 3); if (p <= 0) continue;
      const k = r * 131 + c * 17, dash = k % 3 === 0;
      ctx.fillStyle = dash ? '#1E1814' : '#F6EEDF'; ctx.fillRect(x, y, pw, ph * p);
      if (pw < 26) { ctx.fillStyle = C.yellow; ctx.fillRect(x, y + ph * .7, pw * clamp((ct - born - .2) * 2), Math.max(1, ph * .12)); continue; }
      ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1, 3 * z); ctx.strokeRect(x, y, pw, ph * p);
      ctx.fillStyle = dash ? C.orange : C.red; ctx.fillRect(x, y, pw, ph * .12);
      if (dash) { for (let b = 0; b < 4; b++) { const bh = ph * .35 * (.4 + hash(k + b) * .6); ctx.fillStyle = b === 2 ? C.yellow : '#8A8378'; ctx.fillRect(x + pw * (.08 + b * .13), y + ph * .62 - bh, pw * .09, bh); } }
      else { ctx.strokeStyle = C.orange; ctx.lineWidth = Math.max(1, 3 * z); ctx.beginPath(); for (let q = 0; q < 6; q++) { const px = x + pw * (.08 + q * .1), py = y + ph * (.5 - .2 * hash(k + q)); q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
      const wp = clamp((ct - born - .3) * 1.5); ctx.fillStyle = rgba(C.yellow, .9); ctx.fillRect(x + pw * .62, y + ph * .25, pw * .32 * wp, Math.max(1, ph * .07)); ctx.fillRect(x + pw * .62, y + ph * .4, pw * .25 * wp, Math.max(1, ph * .07));
    }
    ctx.restore();
    const ta = P(t, T_DROP + 1.6, .5); if (ta > 0) { ctx.save(); ctx.fillStyle = rgba('#0C0806', .55 * ta); ctx.fillRect(0, H / 2 - 150, W, 300); ctx.globalAlpha *= ta; ctx.translate(W / 2, H / 2 - 10); const s = lerp(1.4, 1, E.outExpo(ta)); ctx.scale(s, s);
      rich(ctx, '*Milhares* de páginas e painéis', 0, -26, { size: 96, weight: 900, color: '#FFF', accent: C.yellow, retro: true, depth: 6, lw: 5 });
      text(ctx, 'com insights escritos, julgados e validados por agentes', 0, 70, { size: 36, weight: 800, color: '#FFE9D6', align: 'center' }); ctx.restore(); }
  }
  function impact(ctx, t) {
    const p = P(t, T_IMP, .4); if (p <= 0) return;
    const pl = dget(CS(), 'business_results.pipeline', {}), n = pl.acquirers || 30, act = pl.active_relationships || 0;
    for (let k = 0; k < n; k++) { const c = k % 10, r = Math.floor(k / 10), x = 960 + c * 86, y = 340 + r * 110, a = E.outBack(P(t, T_IMP + .2 + k * .03, .3)); if (a <= 0) continue;
      const on = k < act; ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
      circle(ctx, 0, 0, 34, on ? C.orange : '#2E2620', on ? INK : rgba(C.orange, .6), 3); icon(ctx, 'store', 0, 0, 40, on ? '#FFF' : rgba('#FFFFFF', .5), 6); ctx.restore(); }
    text(ctx, `${act} ativos · ${pl.to_conquer || 0} a conquistar · ${pl.note || ''}`, 1350, 690, { size: 28, weight: 800, color: '#FFF', align: 'center', alpha: P(t, T_IMP + 1.4, .4) });
    CASEKIT.headline(ctx, t, T_IMP + .05, 470, 480, String(n), 'adquirentes no pipeline', { col: C.red, seed: 19, size: 200 });
    const up = dget(CS(), 'business_results.user_pay_projects', {});
    receipt(ctx, 1350, 740, { w: 820, p: P(t, T_IMP2 - .4, 2), rot: -.01, title: 'IMPACTO', lines: [
      ['clientes + PoCs', headlineFor(/clients \+ PoCs/i) || '—'], ['projetos user-pay', `${up.total || '—'} (${String(up.composition || '').replace('merchants', 'varejistas')})`]] });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_BAN - .1, T_BAN + 1.2, .6], [T_DROP - .15, T_DROP + 2.2], [T_WALL2 - .1, T_WALL2 + 1.4, .8], [T_IMP - .1, T_IMP + 1.4, .8]],
    caps: [[3.8, 6.4, 'Nosso produto de *market share e share of wallet* para adquirentes precisa de insights escritos', 'PROBLEMA'],
      [6.6, PH[1] - .2, `Escritos à mão, os insights *limitavam a escala* para os ${N_ACQ} adquirentes do pipeline`, 'PROBLEMA'],
      [PH[1] + .2, PH[2] - .2, 'Restrição: os dados *não podem sair* do ambiente Mastercard — nada de IA externa', 'RESTRIÇÃO'],
      [PH[2] + .2, T_GEN - .2, 'Nossa estratégia: um *time de agentes de IA* rodando *localmente*, em GPU', 'ESTRATÉGIA'],
      [T_GEN + .1, T_JUD - .2, '1 · *Agentes geradores* escrevem insights com o olhar de analista, negócio e C-Level', 'COMO FIZEMOS'],
      [T_JUD + .1, T_FIX - .2, '2 · *Agentes julgadores*, com guardrails (Regex, BERT), checam cada insight', 'COMO FIZEMOS'],
      [T_FIX, T_SC - .2, '3 · Reprovou? *Agentes corretores* reescrevem até passar', 'COMO FIZEMOS'],
      [T_SC + .1, T_DROP - .2, '4 · Um *Random Forest* com features de NLP dá a nota de qualidade de cada insight', 'COMO FIZEMOS'],
      [T_DROP + .3, T_WALL2 - .2, 'Os agentes escalam a geração de insights para *milhares de páginas e painéis*', 'SOLUÇÃO'],
      [T_WALL2, T_IMP - .2, 'Tudo com *IA local*, em GPU: o dado nunca sai da Mastercard', 'SOLUÇÃO'],
      [T_IMP + .2, T_IMP2 - .2, `*${N_ACQ} adquirentes* no pipeline — e os novos chegam *sem crescer o time*`, 'IMPACTO'],
      [T_IMP2, 62.3, `${headlineFor(/clients \+ PoCs/i) || ''} clientes + PoCs e *projetos user-pay* já rodando`, 'IMPACTO']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#241508' });
      neonGrid(ctx, t, { horizon: 950, alpha: .35, speed: .5 + BT.level });
      problem(ctx, t); restriction(ctx, t);
      CASEKIT.strategy(ctx, t, T_STRAT, T_GEN, 'Um *time de agentes de IA*', 'rodando localmente, em GPU, dentro do ambiente Mastercard', { seed: 27 });
      const how = P(t, T_GEN - .2, .4) * (1 - P(t, T_DROP - .3, .4));
      CASEKIT.chips(ctx, t, ['Geradores', 'Julgadores', 'Corretores', 'Nota de qualidade'], [T_GEN, T_JUD, T_FIX, T_SC], how, 300);
      circuit(ctx, t);
      wall(ctx, t);
      impact(ctx, t);
      CASEKIT.header(ctx, t, 'CASE 4 DE 4 · ADQUIRENTES', 'Insight Agent · agentes de IA', { at: 3.6, seed: 15, bg: C.red, tagCol: C.red });
      CASEKIT.ruler(ctx, t, PH, LABELS, P(t, 3.6, .5));
      banner(ctx, t);
      scanlines(ctx, .06);
    }
  };
})();

/* cartaz da estação 04: os 4 cases com o número-manchete de cada um */
POSTERS[4] = (ctx, w, h, tl) => {
  const items = [['Cliente Banana', headlineFor(/Banana conversion/i) || '—', 'conversão vs. 2ª melhor', C.yellow], ['Cliente Manga', headlineFor(/principality gain/i) || '—', 'principalidade', C.orange],
    ['Lights-off', '✓', 'relatórios sem trabalho manual', '#F3EBDD'], ['Insight Agent', headlineFor(/Acquirers in Insight Agent pipeline/i) || '—', 'adquirentes · agentes de IA', C.red]];
  items.forEach(([n, v, l, col], i) => { const x = (i % 2 ? 1 : -1) * w / 4, y = -h / 2 + 130 + Math.floor(i / 2) * 230, s = 1 + .05 * Math.sin(tl * 2 + i);
    paper(ctx, x - 110, y - 95, 220, 200, { r: 12, fill: col, shadow: 6, lw: 3 });
    text(ctx, n, x, y - 62, { size: 18, weight: 900, color: col === C.red ? '#FFF' : INK, align: 'center' });
    ctx.save(); ctx.translate(x, y + 6); ctx.scale(s, s); retroText(ctx, v, 0, 0, { size: 54, weight: 900, color: '#FFF', align: 'center', depth: 3, lw: 3 }); ctx.restore();
    text(ctx, l, x, y + 68, { size: 14, weight: 700, color: col === C.red ? '#FFF' : '#3A332C', align: 'center' }); });
};
