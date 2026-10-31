/* ============================================================================
   22. TRECHO 2 ("Technology") — estação 04: os 4 cases
   Cada case: PROBLEMA → SOLUÇÃO ANALÍTICA → INSIGHT/DECISÃO → IMPACTO, com um
   número-manchete do JSON. Batidas e compassos vêm de grid(id).
   ========================================================================== */
const CASEKIT = {
  /** cabeçalho do case: etiqueta + título pintado */
  header(ctx, t, tag, title, o = {}) {
    const p = P(t, o.at || 0, .5); if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= 1 - P(t, o.out == null ? 1e9 : o.out, .4);
    const tw = measure(ctx, tag, 20, 800, true, 3) + 40; ctx.save(); ctx.translate(120 + tw / 2, 120); ctx.rotate(-.02); ctx.scale(E.outBack(p), E.outBack(p));
    paper(ctx, -tw / 2, -20, tw, 40, { r: 4, fill: C.orange, shadow: 4, shadowColor: '#000', lw: 2.5 }); text(ctx, tag, 0, 1, { size: 20, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 3 }); ctx.restore();
    paintTitle(ctx, title, 110, 190, { size: o.size || 58, align: 'left', bg: o.bg || C.red, seed: o.seed || 3, p: clamp(p * 1.2), splat: false });
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
  /** número-manchete: estoura no drop com respingo e linhas de foco */
  headline(ctx, t, at, x, y, str, label, o = {}) {
    const p = P(t, at, .32); if (p <= 0) return;
    const s = lerp(2.2, 1, E.outExpo(p)) * (1 + .06 * BT.beat), size = o.size || 170;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || -.04); ctx.scale(s, s);
    splat(ctx, 0, -10, size * .9, o.col || C.orange, o.seed || 5, 1, .95);
    retroText(ctx, str, 0, 0, { size, weight: 900, color: '#FFF', align: 'center', depth: 8, lw: 6 });
    if (label) text(ctx, label, 0, size * .72, { size: 30, weight: 800, color: '#FFF', align: 'center' });
    ctx.restore();
  }
};
/** quebra de texto por largura (usa a fonte do texto) */
function wrapText(ctx, str, maxW, size, weight = 800) {
  ctx.save(); ctx.font = font(size, weight); const out = []; let cur = '';
  String(str).split(' ').forEach(w => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
  if (cur) out.push(cur); ctx.restore(); return out;
}
const headlineFor = re => { const h = (DATA.headline_numbers_for_slides || []).find(x => re.test(x.meaning || '')); return h ? FMT.headline(h) : null; };

/* ---------- abertura da 04 + case Cliente Banana (cestas) ---------- */
(() => {
  const id = 's04', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const T_FAN = bt(0) + .3, T_PROB = bt(2), T_DC = [bt(5), bt(6), bt(7)], T_MAT = bt(8), T_BM = bt(10), T_ALS = bt(11), T_CES = bt(13), T_TENSE = bt(15), T_DROP = bt(16);
  const FAN = [['BANANA', C.yellow], ['MANGA', C.orange], ['LIGHTS-OFF', '#F3EBDD'], ['INSIGHT AGENT', C.red]];
  const DC = ['só compras, sem preferência declarada', 'sacola e pão dominavam o sinal', 'mesmo produto, nomes diferentes'];
  const BASK = [['Café + chocolate', ['cup', 'box']], ['Churrasco', ['can', 'carton']], ['Destilados', ['bottle', 'jar']]];
  FAN.forEach((_, i) => cue(id, T_FAN + i * .27, 'pop', { p: .8 + i * .15, v: .16 }));
  T_DC.forEach(t0 => cue(id, t0, 'buzz'));
  cue(id, T_MAT, 'shimmer', { dur: 1.5 }); cue(id, T_ALS, 'whoosh', { dur: .6, v: .3 }); cue(id, T_CES, 'chime', { f: 1046, up: 7 });
  cue(id, T_TENSE, 'riser', { dur: T_DROP - T_TENSE, v: .25 }); cue(id, T_DROP, 'impact', { size: 1.1 }); cue(id, T_DROP + .4, 'type', { n: 26, gap: .03 });
  const CS = () => CASE('Cliente Banana');
  const R = rng(5), CELLS = Array.from({ length: 14 * 24 }, () => R());

  function matrix(ctx, t, x, y) {
    const cols = 24, rows = 14, cw = 30, ch = 30, mp = P(t, T_MAT, 1.6), bm = P(t, T_BM, .8), als = E.inOutCubic(P(t, T_ALS, 1.2)), out = P(t, T_CES, .8);
    if (mp <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    // matriz CPF × SKU esparsa, com colunas de baixo valor (sacola, pão) apagadas pelo BM25
    const mx = lerp(x, x - 260, als), mw = cols * cw;
    paper(ctx, mx - 20, y - 20, mw + 40, rows * ch + 40, { r: 10, fill: 'rgba(20,16,13,.85)', outline: '#F3EBDD', lw: 2, shadow: 8, shadowColor: '#000' });
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = CELLS[r * cols + c], filled = v < .16 || c < 2 && v < .85, appear = clamp(mp * 1.6 - (c + r) / 40), low = c < 2;
      if (!filled || appear <= 0) continue;
      const a = appear * (low ? 1 - .8 * bm : 1), pulse = 1 + .3 * BT.kick * (r % 3 === BT.i % 3 ? 1 : 0);
      circle(ctx, mx + c * cw + cw / 2, y + r * ch + ch / 2, 6 * pulse * (1 - als * .4), rgba(low ? '#8A8378' : C.orange, a));
    }
    text(ctx, '24 meses · CPF × SKU', mx + mw / 2, y - 48, { size: 24, weight: 800, mono: true, color: '#F3EBDD', align: 'center', alpha: mp });
    if (bm > 0) { text(ctx, 'sacola · pão', mx + cw, y + rows * ch + 46, { size: 20, weight: 800, mono: true, color: '#8A8378', align: 'center', alpha: bm });
      formula(ctx, 'BM25 = idf · tf(k₁+1) / (tf + k₁·(1−b+b·|d|/avgdl))', mx + mw / 2, y + rows * ch + 110, { size: 18, neon: true, alpha: bm }); }
    // fatores U e Vᵀ
    if (als > 0) { const ux = mx + mw + 90, a = als;
      ctx.save(); ctx.globalAlpha *= a;
      text(ctx, '≈', ux, y + rows * ch / 2, { size: 80, weight: 900, color: '#FFF', align: 'center' });
      rr(ctx, ux + 60, y, 70, rows * ch, 8); ctx.fillStyle = BT.i % 2 ? C.orange : '#5A3A22'; ctx.fill(); inkRect(ctx, ux + 60, y, 70, rows * ch, 8, 3, 3);
      rr(ctx, ux + 160, y + rows * ch / 2 - 35, 300, 70, 8); ctx.fillStyle = BT.i % 2 ? '#5A3A22' : C.yellow; ctx.fill(); inkRect(ctx, ux + 160, y + rows * ch / 2 - 35, 300, 70, 8, 3, 4);
      text(ctx, 'U', ux + 95, y - 30, { size: 30, weight: 900, color: '#FFF', align: 'center' }); text(ctx, 'Vᵀ', ux + 310, y + rows * ch / 2 - 60, { size: 30, weight: 900, color: '#FFF', align: 'center' });
      formula(ctx, 'R ≈ U·Vᵀ  ·  ALS', ux + 260, y + rows * ch + 40, { size: 20, rot: .02, seed: 8 });
      ctx.restore(); }
    ctx.restore();
  }
  function baskets(ctx, t) {
    const p0 = P(t, T_CES, .5), out = P(t, T_DROP - .3, .4); if (p0 <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    BASK.forEach(([name, ics], i) => {
      const p = E.outBack(P(t, T_CES + i * .55, .45)); if (p <= 0) return;
      const x = 480 + i * 480, y = 600 + Math.sin(t * 3 + i) * 6 * (1 + BT.low), sh = T_TENSE < t ? (hash(Math.floor(t * 24) + i) - .5) * 10 : 0;
      ctx.save(); ctx.translate(x + sh, y); ctx.scale(p, p); ctx.rotate([-.04, .03, -.02][i]);
      // sacola de colagem com os produtos da cesta
      paper(ctx, -150, -120, 300, 260, { r: 18, fill: [C.yellow, C.orange, C.red][i], shadow: 10, shadowColor: '#000', lw: 4, halftone: .18 });
      ctx.beginPath(); ctx.arc(0, -120, 70, Math.PI, 0); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.stroke();
      ics.forEach((ic, j) => { circle(ctx, -55 + j * 110, -20, 48, '#FFF8EE', INK, 3); icon(ctx, ic, -55 + j * 110, -20, 56, INK, 9); });
      text(ctx, name, 0, 84, { size: 30, weight: 900, color: i === 0 ? INK : '#FFF', align: 'center' });
      ctx.restore();
      formula(ctx, 'cos θ = a·b / ‖a‖‖b‖', 960, 330, { size: 20, alpha: P(t, T_CES, .4), rot: -.02, seed: 12 });
    });
    const ip = P(t, T_CES + 2.2, .5); if (ip > 0) CASEKIT.note(ctx, W / 2, 880, 1000, 'Insight: cestas temáticas viram mecânicas de campanha nos testes da Mesa de Performance.', ip, { fill: '#F6EEDF', size: 26, label: 'INSIGHT' });
    ctx.restore();
  }
  function impact(ctx, t) {
    const p = P(t, T_DROP, .4); if (p <= 0) return;
    const conv = dget(CS(), 'business_results.conversion_by_mechanic', {}), rows = Object.entries(conv), mx = Math.max(...rows.map(r => parseFloat(r[1]) || 0), 1);
    // ranking de conversão por mecânica (cestas em laranja)
    rows.forEach(([k, v], i) => { const val = parseFloat(v) || 0, bp = E.outCubic(P(t, T_DROP + i * .08, .5)), y = 330 + i * 70, w = 560 * val / mx * bp, cesta = /cesta/i.test(k);
      text(ctx, k.replace(' (cesta)', ''), 300, y, { size: 24, weight: 800, color: cesta ? '#FFF' : '#BFB3A3', align: 'right' });
      rr(ctx, 320, y - 20, Math.max(4, w), 40, 6); ctx.fillStyle = cesta ? C.orange : '#5E5850'; ctx.fill(); inkRect(ctx, 320, y - 20, Math.max(4, w), 40, 6, 2.5, i);
      text(ctx, FMT.auto(v), 340 + w, y, { size: 22, weight: 900, color: '#FFF', alpha: bp }); });
    CASEKIT.headline(ctx, t, T_DROP + .05, 1230, 440, headlineFor(/Banana conversion/i) || '—', 'conversão vs. 2ª melhor campanha', { col: C.orange });
    const br = dget(CS(), 'business_results', {}), ms = dget(CS(), 'analytics_solution.model_scale', {});
    receipt(ctx, 1500, 610, { w: 520, p: P(t, T_DROP + .4, 2.2), rot: .02, lines: [
      ['receita incremental (Café)', FMT.auto(br.incremental_revenue_cafe)], ['Café em BU não principal', FMT.rel(br.cafe_revenue_growth_non_primary_bu)],
      ['clientes modelados', FMT.mm(ms.customers_modeled)], ['interações', FMT.mm(ms.interactions)], ['subgrupos de SKU', FMT.num(ms.sku_subgroups || 0, 0)]] });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .85, center: '#26170E' });
      neonGrid(ctx, t, { horizon: 900, alpha: .35 + .3 * P(t, T_MAT, 2), speed: .4 + BT.level });
      collage(ctx, t, { seed: 61, n: 5, theme: 'dark', alpha: .45 });
      // leque com os 4 cases; o BANANA cresce e vira o cabeçalho
      FAN.forEach(([l, col], i) => { const p = E.outBack(P(t, T_FAN + i * .27, .4)), out = E.inCubic(P(t, T_PROB - .5, .5)); if (p <= 0 || out >= 1) return;
        const ang = (i - 1.5) * .22, x = W / 2 + Math.sin(ang) * 500, y = 620 - Math.cos(ang) * 120;
        ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(x, y + out * 400 * (i ? 1 : -1)); ctx.rotate(ang); ctx.scale(p, p);
        paper(ctx, -170, -220, 340, 440, { r: 16, fill: col, shadow: 12, shadowColor: '#000', lw: 4, halftone: .12 }); retroText(ctx, '0' + (i + 1), 0, -80, { size: 110, weight: 900, color: '#FFF', align: 'center', depth: 5, lw: 4 });
        text(ctx, l, 0, 70, { size: 32, weight: 900, color: col === C.red ? '#FFF' : INK, align: 'center' }); ctx.restore(); });
      const ruler = P(t, T_PROB, .5);
      CASEKIT.header(ctx, t, 'CASE 1 / 4 · MERCHANTS', 'Cliente Banana · cestas de produtos', { at: T_PROB, seed: 4 });
      // problema + desafios do dado
      const probOut = P(t, T_MAT - .3, .5);
      if (probOut < 1) { ctx.save(); ctx.globalAlpha *= 1 - probOut;
        CASEKIT.note(ctx, 640, 520, 900, CS().business_problem || '', P(t, T_PROB + .4, 4.5), { size: 30, label: 'PROBLEMA' });
        DC.forEach((d, i) => { const p = P(t, T_DC[i], .4); if (p <= 0) return; const x = 1450, y = 360 + i * 200;
          ctx.save(); ctx.translate(x, y); ctx.rotate([.03, -.02, .025][i]); ctx.scale(E.outBack(p), E.outBack(p));
          paper(ctx, -230, -70, 460, 140, { fill: '#F6EEDF', shadow: 8, shadowColor: '#000', lw: 3 }); text(ctx, twoLines(d), 0, 0, { size: 28, weight: 800, color: INK, align: 'center', lh: 1.1 });
          scribble(ctx, 'x', 170, -30, 70, C.red, 50 + i, clamp(p * 2 - .6)); ctx.restore(); });
        ctx.restore(); }
      matrix(ctx, t, 330, 380);
      baskets(ctx, t);
      impact(ctx, t);
      const step = t < T_MAT ? 0 : t < T_CES + 2.2 ? 1 : t < T_DROP ? 2 : 3;
      caseRuler(ctx, step, 0, { alpha: ruler });
      scanlines(ctx, .05);
    }
  };
})();

/* ---------- case Cliente Manga (motor de principalidade) ---------- */
(() => {
  const id = 'manga', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const T_UMAP = bt(1), T_KM = bt(3), T_ALS = bt(5), T_DP = bt(6) + 1.1, T_INS = bt(7), T_IMP = bt(8);
  const CL = 8, R = rng(23), CEN = Array.from({ length: CL }, (_, k) => [Math.cos(k / CL * TAU + .3) * (.55 + .2 * (k % 2)), Math.sin(k / CL * TAU + .3) * (.5 + .15 * (k % 3 === 0))]);
  const PTS = Array.from({ length: 220 }, (_, i) => { const c = i % CL, g = () => (R() + R() + R() - 1.5) * .18; return { c, sx: R() * 2 - 1, sy: R() * 2 - 1, x: CEN[c][0] + g(), y: CEN[c][1] + g() }; });
  const CCOL = [C.red, C.orange, C.yellow, '#FF8A5C', '#E94F64', '#FFC56E', '#FF6A2A', '#F2B04A'];
  const PROD = ['Cartão de crédito', 'Investimentos', 'Seguro de vida', 'Consórcio', 'Previdência'], ORDER = [2, 0, 4, 1, 3];
  cue(id, 0, 'whoosh', { dur: .5, v: .3 }); cue(id, T_UMAP, 'shimmer', { dur: 2 });
  for (let k = 0; k < CL; k++) cue(id, T_KM + k * (G.beats[1] - G.beats[0]), 'ping', { f: 988 * Math.pow(2, (k % 5) * 2 / 12) });
  cue(id, T_DP, 'stab', { i: 2 }); cue(id, T_IMP, 'impact', { size: 1 }); cue(id, T_IMP + .4, 'type', { n: 24, gap: .03 });
  const CS = () => CASE('Cliente Manga');

  function umap(ctx, t, cx, cy, sc) {
    const p = E.inOutCubic(P(t, T_UMAP, 3.2)), km = P(t, T_KM, 3), out = P(t, T_ALS - .3, .6); if (p <= 0 && t < T_UMAP || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    holo(ctx, cx - sc * 1.15, cy - sc * .95, sc * 2.3, sc * 1.9, { title: 'UMAP · K-MEANS · 8 SEGMENTOS', color: C.orange });
    PTS.forEach((q, i) => { const x = cx + lerp(q.sx, q.x, p) * sc, y = cy + lerp(q.sy, q.y, p) * sc * .8, col = p > .4 ? CCOL[q.c] : '#BFB3A3', pul = 1 + .5 * BT.kick * (q.c === BT.i % CL ? 1 : 0);
      circle(ctx, x, y, 5 * pul, col); });
    CEN.forEach(([x, y], k) => { const a = P(t, T_KM + k * (G.beats[1] - G.beats[0]), .3); if (a <= 0) return; const px = cx + x * sc, py = cy + y * sc * .8, s = 14 * E.outBack(a);
      glow(ctx, px, py, 60, CCOL[k], .5 * a); line(ctx, px - s, py - s, px + s, py + s, '#FFF', 5); line(ctx, px - s, py + s, px + s, py - s, '#FFF', 5);
      text(ctx, 'Seg ' + 'ABCDEFGH'[k], px, py + 30, { size: 16, weight: 800, mono: true, color: '#FFF', align: 'center', alpha: a }); });
    const q = dget(CS(), 'analytics_solution.segmentation_quality', {}), eggs = [[`trustworthiness ${FMT.auto(q.umap_trustworthiness)}`, 300, 300], [`silhouette ${FMT.auto(q.silhouette)}`, 1620, 300], [`Davies-Bouldin ${FMT.auto(q.davies_bouldin)}`, 300, 820], [`Calinski-Harabasz ${FMT.num(q.calinski_harabasz || 0, 0)}`, 1620, 820], [`mesmo cluster: ${FMT.auto(q.same_cluster_after_3_months)} (3m) · ${FMT.auto(q.same_cluster_after_6_months)} (6m)`, 960, 930]];
    eggs.forEach(([s, x, y], i) => formula(ctx, s, x, y, { size: 19, neon: i % 2 === 1, alpha: P(t, T_KM + i * .5, .4), rot: (i % 2 ? .03 : -.03), seed: 20 + i }));
    ctx.restore();
  }
  function lists(ctx, t) {
    const p = P(t, T_ALS, .5), out = P(t, T_IMP - .4, .5); if (p <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= p * (1 - out);
    [['cross-sell', 520], ['upsell', 1000]].forEach(([l, x], j) => text(ctx, l.toUpperCase(), x, 300, { size: 26, weight: 900, mono: true, color: C.yellow, align: 'center', ls: 4 }));
    const dp = E.inOutCubic(P(t, T_DP, 1.4));
    PROD.forEach((nm, i) => [520, 1000].forEach((x, j) => {
      const from = i, to = ORDER.indexOf(i), y = 370 + lerp(from, to, dp) * 96 + (j ? 0 : 0), arc = Math.sin(dp * Math.PI) * (to - from) * 30;
      ctx.save(); ctx.translate(x + arc, y); const top = to < 3 && dp > .9;
      paper(ctx, -200, -36, 400, 72, { r: 10, fill: top ? C.orange : '#F6EEDF', shadow: 6, shadowColor: '#000', lw: 3 });
      text(ctx, nm, -170, 1, { size: 24, weight: 800, color: top ? '#FFF' : INK }); if (dp > .5) pill(ctx, 140, 0, `ΔP ${['+', '+', '+', '·', '·'][to]}`, { size: 16, fill: to < 3 ? C.yellow : '#BFB3A3', weight: 900, alpha: dp });
      ctx.restore(); }));
    if (dp > 0) formula(ctx, 'score = afinidade · conversão · ΔP', 1500, 420, { size: 20, rot: .03, alpha: dp, seed: 9 });
    const pts = dget(CS(), 'business_results.principality_points_top3', ''); if (pts) formula(ctx, pts.replace('with principality layer', 'com ΔP').replace('pure MF', 'MF pura'), 1500, 520, { size: 17, neon: true, alpha: dp, rot: -.02 });
    const ip = P(t, T_INS, .5); if (ip > 0) CASEKIT.note(ctx, W / 2 + 330, 850, 760, 'Insight: lista curta, reordenada pelo ganho de principalidade, rende mais que a lista "pura" de afinidade.', ip, { fill: '#F6EEDF', size: 24, label: 'INSIGHT' });
    ctx.restore();
  }
  function impact(ctx, t) {
    const p = P(t, T_IMP, .4); if (p <= 0) return;
    CASEKIT.headline(ctx, t, T_IMP, 560, 470, headlineFor(/principality gain/i) || '—', 'principalidade vs. controle (backtest)', { col: C.red, seed: 13 });
    const br = dget(CS(), 'business_results', {});
    Object.entries(br.by_subsegment || {}).forEach(([k, v], i) => pill(ctx, 300 + i * 175, 780, `${k} ${FMT.auto(v)}`, { size: 22, fill: [C.yellow, C.orange, C.yellow, '#F6EEDF'][i], weight: 900, scale: E.outBack(P(t, T_IMP + .6 + i * .15, .35)), alpha: P(t, T_IMP + .6 + i * .15, .2) }));
    if (br.best_cluster) pill(ctx, 560, 860, 'melhor segmento · ' + FMT.auto(br.best_cluster.replace('Segmento', 'Seg.')), { size: 24, fill: C.red, color: '#FFF', weight: 900, alpha: P(t, T_IMP + 1.4, .4) });
    const op = dget(CS(), 'operationalization', {});
    receipt(ctx, 1450, 300, { w: 540, p: P(t, T_IMP + .4, 2.4), rot: .015, title: 'PRODUTIZADO', lines: [
      ['associados analisados', FMT.mm(br.associates_analyzed)], ['top-3 · grupo 1', FMT.auto(dget(br, 'top3.group_1_share', '—'))], ['top-5 · grupo 1', FMT.auto(dget(br, 'top5.group_1_share', '—'))],
      ['retreino', 'semestral'], ['pipeline', 'mensal'], ['ajuste', 'diário'], ['métricas', (op.assets || []).some(a => /MLflow/.test(a)) ? 'MLflow' : '—']] });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#1E1410' });
      neonGrid(ctx, t, { horizon: 960, alpha: .3, speed: .4 + BT.level });
      CASEKIT.header(ctx, t, 'CASE 2 / 4 · EMISSORES', 'Cliente Manga · motor de principalidade', { at: 0, seed: 8, bg: C.orange });
      CASEKIT.note(ctx, W / 2, 540, 1100, CS().business_problem || '', P(t, .3, 2.2) * (1 - P(t, T_UMAP - .2, .4)), { size: 30, label: 'PROBLEMA' });
      umap(ctx, t, W / 2, 580, 340);
      lists(ctx, t);
      impact(ctx, t);
      caseRuler(ctx, t < T_UMAP ? 0 : t < T_INS ? 1 : t < T_IMP ? 2 : 3, 0);
      scanlines(ctx, .06);
    }
  };
})();

/* ---------- case Lights-off Fraud Reporting ---------- */
(() => {
  const id = 'lightsoff', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const T_CLICK = bt(2), T_PIPE = bt(2) + .4, T_INS = bt(5), T_BOARD = bt(6), T_DIVE = bt(7);
  const NODES = [['Dados', 'db'], ['Validação', 'check'], ['Processamento', 'gear'], ['Insights', 'ai'], ['Report', 'doc'], ['Board', 'board']];
  const EGG = ['SQL · parquet', 'z = (x − μ)/σ', 'DAG ⟳ · idempotente', '? destaques', 'PDF · PPT', 'cron 0 7 * * 1'];
  cue(id, .2, 'type', { n: 16, gap: .06 }); cue(id, T_CLICK, 'click', { v: 1 }); cue(id, T_CLICK + .1, 'impact', { size: .9 });
  NODES.forEach((_, i) => cue(id, T_PIPE + i * .35, 'ping', { f: 880 * Math.pow(2, i * 2 / 12) })); cue(id, T_BOARD, 'ding'); cue(id, T_DIVE, 'whoosh', { dur: 1.4, dir: 'down', v: .45 });
  const CS = () => CASE('Lights-off');
  const nx = i => 230 + i * 292, NY = 560;

  SCENES[id] = {
    themeAt: t => t < T_CLICK ? 'light' : 'dark',
    draw(ctx, t) {
      const dark = P(t, T_CLICK, .15), dive = E.inCubic(P(t, T_DIVE, bt(7) < 15 ? 2.4 : 2));
      ctx.save();
      if (dive > 0) { const n = nx(3); ctx.translate(n, NY); ctx.scale(1 + dive * 14, 1 + dive * 14); ctx.translate(-n, -NY); }
      bgLight(ctx, t); if (dark > 0) { ctx.save(); ctx.globalAlpha = dark; bgDark(ctx, t, { centerA: .7, center: '#1A120C' }); ctx.restore(); }
      // antes: papelada manual (some no clique)
      if (dark < 1) { ctx.save(); ctx.globalAlpha *= 1 - dark; collage(ctx, t, { seed: 71, n: 6, theme: 'light' });
        for (let k = 0; k < 9; k++) { const p = E.outBack(P(t, .1 + k * .22, .3)), x = 300 + (k % 3) * 560 + Math.sin(k * 3) * 60, y = 470 + Math.floor(k / 3) * 150;
          if (p <= 0) continue; ctx.save(); ctx.translate(x, y); ctx.rotate((hash(k) - .5) * .3); ctx.scale(p, p); paper(ctx, -130, -80, 260, 160, { fill: '#FFFDF8', shadow: 6, lw: 3 });
          for (let l = 0; l < 5; l++) line(ctx, -100, -50 + l * 24, 90 - (l % 3) * 30, -50 + l * 24, '#BFB3A3', 4); ctx.restore(); }
        ['Ctrl+C', 'Ctrl+V', 'conferir', 'repetir'].forEach((s, i) => pill(ctx, 380 + i * 400, 900, s, { size: 30, fill: [C.yellow, C.orange, '#F6EEDF', C.red][i], color: i === 3 ? '#FFF' : INK, weight: 900, rot: (i % 2 ? .05 : -.05), scale: E.outBack(P(t, .6 + i * .25, .3)) }));
        CASEKIT.note(ctx, W / 2, 330, 1200, CS().business_problem || 'Report de fraude para o board, montado à mão todo mês.', P(t, .2, 1.4), { size: 32, label: 'PROBLEMA', fill: C.yellow, minH: 110 });
        ctx.restore(); }
      // clique: luzes apagam → pipeline neon do dado ao board
      if (dark > 0) {
        NODES.forEach(([nm, ic], i) => { const p = E.outBack(P(t, T_PIPE + i * .35, .35)); if (p <= 0) return; const x = nx(i), hot = i === 3 && t > T_INS;
          if (i) { const lp = P(t, T_PIPE + (i - .5) * .35, .3); ctx.save(); ctx.shadowColor = C.orange; ctx.shadowBlur = 12; line(ctx, nx(i - 1) + 70, NY, lerp(nx(i - 1) + 70, x - 70, lp), NY, C.orange, 5); ctx.restore(); }
          holo(ctx, x - 90, NY - 90, 180, 180, { color: hot ? C.yellow : C.orange, corners: hot });
          ctx.save(); ctx.translate(x, NY - 10); ctx.scale(p * (hot ? 1 + .12 * BT.beat : 1), p * (hot ? 1 + .12 * BT.beat : 1)); icon(ctx, ic, 0, 0, 70, '#FFE9D6', 8); ctx.restore();
          if (hot) { glow(ctx, x, NY, 160 + 40 * BT.level, C.yellow, .5); neonText(ctx, '?', x + 60, NY - 90, { size: 70, weight: 900, glow: C.yellow }); }
          neonText(ctx, nm, x, NY + 120, { size: 26, weight: 800, align: 'center' }); formula(ctx, EGG[i], x, NY + 190, { size: 16, neon: true, alpha: P(t, T_PIPE + i * .35 + .4, .4), rot: (i % 2 ? .03 : -.03) }); });
        // pacotes correndo no tempo da música
        if (t > T_PIPE + 2) for (let k = 0; k < 6; k++) { const u = ((t - T_PIPE) * .5 + k / 6) % 1, x = lerp(nx(0), nx(5), u); circle(ctx, x, NY, 8 + 4 * BT.beat, C.yellow); }
        const sb = P(t, T_BOARD, .4); if (sb > 0) stamp(ctx, W / 2, 300, CS().business_results && CS().business_results.headline ? CS().business_results.headline : 'Automated Reporting', sb, { theme: 'dark' });
        const qp = P(t, T_INS + .4, .5); if (qp > 0) { ctx.save(); ctx.globalAlpha *= qp * (1 - dive); rich(ctx, 'Mas quem escreve os *destaques*?', W / 2, 880, { size: 54, weight: 900, color: '#FFF', retro: true }); ctx.restore(); }
      }
      ctx.restore();
      if (dive > .6) flash(ctx, (dive - .6) / .4, C.orange);
      CASEKIT.header(ctx, t, 'CASE 3 / 4 · AUTOMATED REPORTING', 'Lights-off Fraud Reporting', { at: 0, seed: 11, out: T_DIVE, bg: t < T_CLICK ? C.red : C.orange });
      caseRuler(ctx, t < T_CLICK ? 0 : t < T_INS ? 1 : t < T_BOARD ? 2 : 3, 0, { alpha: 1 - dive });
      if (dark > 0) scanlines(ctx, .06 * dark);
    }
  };
})();

/* ---------- case Insight Agent (Market Share & Share of Wallet) ---------- */
(() => {
  const id = 'insight', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const T_GEN = bt(2), T_JUD = bt(3) + .6, T_REJ = bt(4), T_FIX = bt(4) + 1.1, T_OK = bt(5) + .4, T_GPU = bt(5), T_IMP = bt(6);
  cue(id, 0, 'impact', { size: .6 }); cue(id, T_GEN, 'type', { n: 18, gap: .05 }); cue(id, T_REJ, 'buzz'); cue(id, T_FIX, 'type', { n: 10, gap: .05 }); cue(id, T_OK, 'ding');
  cue(id, T_GPU, 'shimmer', { dur: 2 }); cue(id, T_IMP, 'impact', { size: 1 }); for (let k = 0; k < 8; k++) cue(id, T_IMP + .5 + k * .12, 'pop', { p: 1 + k * .05, v: .12 });
  const CS = () => CASE('Insight Agent');
  const AX = [260, 480, 700], JX = 1020, FX_ = 1300, DX = 1620, AY = 480;

  function circuit(ctx, t) {
    const out = P(t, T_IMP - .4, .5); if (out >= 1 || t < T_GEN - .5) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    // perímetro Mastercard com GPU e cadeado: o dado nunca sai
    const pa = P(t, T_GEN - .5, .6), pulse = .5 + .5 * BT.level;
    ctx.save(); ctx.globalAlpha *= pa; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 30; rr(ctx, 120, 270, 1680, 560, 30); ctx.strokeStyle = rgba(C.yellow, .6 + .4 * pulse); ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
    text(ctx, TX.perimeter, 160, 300, { size: 22, weight: 900, mono: true, color: C.yellow, ls: 4, alpha: pa }); icon(ctx, 'shield', 1760, 300, 40, C.yellow, 6);
    for (let k = 0; k < 4; k++) { const u = ((t * .6 + k / 4) % 1), y = 330 + k * 130, x = lerp(1600, 1800, u < .5 ? u * 2 : 2 - u * 2); circle(ctx, x, y, 7, C.red); }
    formula(ctx, 'egress: 0 B', 1690, 870, { size: 18, neon: true, alpha: pa, rot: .03 });
    // geradores
    TX.agents.gen.forEach((g, i) => { const p = E.outBack(P(t, T_GEN + i * .2, .4)); if (p <= 0) return;
      agent(ctx, AX[i], AY, 58 * p, { role: g.role, t: t + i, seed: i, look: Math.sin(t * 2 + i), squash: BT.kick * .3 });
      text(ctx, g.name, AX[i], AY + 90, { size: 22, weight: 800, color: '#FFF', align: 'center' });
      const dp = P(t, T_GEN + .6 + i * .3, .6); if (dp > 0) { const ux = lerp(AX[i] + 40, JX - 120, P(t, T_JUD - .6 + i * .15, .6, E.inOutCubic)), uy = lerp(AY - 120, AY - 40 + i * 30, P(t, T_JUD - .6 + i * .15, .6));
        ctx.save(); ctx.translate(ux, uy); ctx.rotate(-.05 + i * .04); paper(ctx, -70, -40, 140, 80, { fill: '#FFFDF8', shadow: 5, shadowColor: '#000', lw: 2 }); for (let l = 0; l < 3; l++) line(ctx, -50, -18 + l * 18, 40 - l * 14, -18 + l * 18, '#8A8378', 4); ctx.restore(); } });
    // guardrails
    [['Regex', 880], ['BERT', 1160]].forEach(([g, x], i) => { const a = P(t, T_JUD - .3 + i * .2, .4); if (a <= 0) return; holo(ctx, x - 50, AY - 170, 100, 340, { color: C.yellow, alpha: a * .8, corners: false }); neonText(ctx, g, x, AY - 200, { size: 22, weight: 800, align: 'center', glow: C.yellow, alpha: a }); });
    // julgadores → corretores → insight validado
    const jp = E.outBack(P(t, T_JUD, .4)); if (jp > 0) { agent(ctx, JX, AY, 60 * jp, { role: 'validador', t, seed: 9, verdict: t > T_REJ && t < T_FIX ? 'no' : t > T_OK ? 'ok' : null }); text(ctx, TX.agents.judges, JX, AY + 92, { size: 22, weight: 800, color: '#FFF', align: 'center' }); }
    if (t > T_REJ && t < T_FIX + .4) { ctx.save(); ctx.globalAlpha *= 1 - P(t, T_FIX, .4); scribble(ctx, 'x', JX + 80, AY - 110, 90, C.red, 3, P(t, T_REJ, .3), { glow: true }); text(ctx, 'refazer', JX + 80, AY - 170, { size: 22, weight: 900, mono: true, color: C.red, align: 'center' }); ctx.restore(); }
    const fp = E.outBack(P(t, T_FIX - .3, .4)); if (fp > 0) { agent(ctx, FX_, AY, 60 * fp, { role: 'embalador', t: t + 2, seed: 4, look: Math.sin(t * 3) }); text(ctx, TX.agents.fixers, FX_, AY + 92, { size: 22, weight: 800, color: '#FFF', align: 'center' }); }
    const ok = P(t, T_OK, .4); if (ok > 0) { stamp(ctx, DX, AY - 20, TX.agents.done, ok, { theme: 'dark' }); }
    // score de qualidade (Random Forest) e GPU
    const sol = dget(CS(), 'analytics_solution.innovation_2', {}), gp = P(t, T_GPU, .5);
    if (gp > 0) { holo(ctx, 760, 690, 400, 110, { title: 'GPU · IA LOCAL', color: C.orange, alpha: gp });
      for (let k = 0; k < 16; k++) { const on = (k + Math.floor(t * 8)) % 5 === 0; rr(ctx, 780 + k * 23, 740, 18, 40, 3); ctx.fillStyle = on ? C.yellow : rgba(C.orange, .5 + .5 * BT.kick); ctx.fill(); }
      formula(ctx, `${sol.algorithm || 'Random Forest'} · ${sol.nlp_features || '—'} features NLP · MAE OOT ${FMT.auto(sol.out_of_time_mae)}`, 1390, 740, { size: 17, neon: true, alpha: gp, rot: -.02 });
      formula(ctx, 'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V', 470, 740, { size: 17, alpha: gp, rot: .02, seed: 6 }); }
    ctx.restore();
  }
  function impact(ctx, t) {
    const p = P(t, T_IMP, .4); if (p <= 0) return;
    const pl = dget(CS(), 'business_results.pipeline', {}), n = pl.acquirers || 30, act = pl.active_relationships || 0;
    for (let k = 0; k < n; k++) { const c = k % 10, r = Math.floor(k / 10), x = 960 + c * 86, y = 330 + r * 110, a = E.outBack(P(t, T_IMP + .2 + k * .03, .3)); if (a <= 0) continue;
      const on = k < act, blink = !on && Math.floor(t * 4 + k) % 3 === 0;
      ctx.save(); ctx.translate(x, y); ctx.scale(a * (on ? 1 + .1 * BT.beat : 1), a * (on ? 1 + .1 * BT.beat : 1));
      circle(ctx, 0, 0, 34, on ? C.orange : blink ? '#5A3A22' : '#2E2620', on ? INK : rgba(C.orange, .6), 3); icon(ctx, 'store', 0, 0, 40, on ? '#FFF' : rgba('#FFFFFF', .5), 6); ctx.restore(); }
    text(ctx, `${act} ativos · ${pl.to_conquer || 0} a conquistar · ${pl.note || ''}`, 1350, 700, { size: 26, weight: 800, color: '#FFF', align: 'center', alpha: P(t, T_IMP + 1.4, .4) });
    CASEKIT.headline(ctx, t, T_IMP + .05, 460, 470, headlineFor(/Acquirers in Insight Agent pipeline/i) || String(n), 'adquirentes no pipeline', { col: C.red, seed: 19, size: 200 });
    const up = dget(CS(), 'business_results.user_pay_projects', {});
    receipt(ctx, 1350, 770, { w: 760, p: P(t, T_IMP + 1, 2), rot: -.01, title: 'IMPACTO', lines: [
      ['clientes + PoCs', headlineFor(/clients \+ PoCs/i) || '—'], ['projetos user-pay', `${up.total || '—'} (${up.composition || ''})`], ['Cliente Laranja', FMT.auto(up.cliente_laranja || '—')]] });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      const em = E.outCubic(P(t, 0, 1.2));
      ctx.save(); const z = lerp(4, 1, em); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      bgDark(ctx, t, { centerA: .9, center: '#241508' });
      neonGrid(ctx, t, { horizon: 950, alpha: .35, speed: .5 + BT.level });
      circuit(ctx, t);
      impact(ctx, t);
      ctx.restore();
      if (em < 1) flash(ctx, 1 - em, C.orange);
      CASEKIT.header(ctx, t, 'CASE 4 / 4 · ADQUIRENTES', 'Insight Agent · Market Share & SoW', { at: .3, seed: 15, bg: C.red });
      const bp = CS().business_problem || {}, pp = P(t, .6, 1.4) * (1 - P(t, T_GEN - .4, .4));
      if (pp > 0) { CASEKIT.note(ctx, 700, 560, 900, bp.bottleneck || '', pp, { size: 28, label: 'PROBLEMA' }); CASEKIT.note(ctx, 1420, 600, 620, bp.constraint || '', P(t, 1.2, 1.4) * (1 - P(t, T_GEN - .4, .4)), { size: 24, label: 'RESTRIÇÃO', fill: '#F6EEDF', rot: .02 }); }
      caseRuler(ctx, t < T_GEN ? 0 : t < T_OK ? 1 : t < T_IMP ? 2 : 3, 0);
      scanlines(ctx, .06);
    }
  };
})();

/* cartaz da estação 04: os 4 cases com o número-manchete de cada um */
POSTERS[4] = (ctx, w, h, tl) => {
  const items = [['Cliente Banana', headlineFor(/Banana conversion/i) || '—', 'conversão vs. 2ª melhor', C.yellow], ['Cliente Manga', headlineFor(/principality gain/i) || '—', 'principalidade', C.orange],
    ['Lights-off', '✓', 'reporting automatizado', '#F3EBDD'], ['Insight Agent', headlineFor(/Acquirers in Insight Agent pipeline/i) || '—', 'adquirentes no pipeline', C.red]];
  items.forEach(([n, v, l, col], i) => { const x = (i % 2 ? 1 : -1) * w / 4, y = -h / 2 + 130 + Math.floor(i / 2) * 230, s = 1 + .05 * Math.sin(tl * 2 + i);
    paper(ctx, x - 110, y - 95, 220, 200, { r: 12, fill: col, shadow: 6, lw: 3 });
    text(ctx, n, x, y - 62, { size: 18, weight: 900, color: col === C.red ? '#FFF' : INK, align: 'center' });
    ctx.save(); ctx.translate(x, y + 6); ctx.scale(s, s); retroText(ctx, v, 0, 0, { size: 54, weight: 900, color: '#FFF', align: 'center', depth: 3, lw: 3 }); ctx.restore();
    text(ctx, l, x, y + 68, { size: 15, weight: 700, color: col === C.red ? '#FFF' : '#3A332C', align: 'center' }); });
};
