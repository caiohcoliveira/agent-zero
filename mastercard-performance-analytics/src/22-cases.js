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
  }  ,
  /** respiro entre cases: cartão de plataforma com o número do case; as portas do vagão abrem para o case (0 → d) */
  interstitial(ctx, t, n, name, topic, col, d = 2.6, o = {}) {
    if (t > d) return;
    const open = E.inOutCubic(P(t, d - .6, .6)), a = P(t, 0, .25);
    ctx.save();
    const half = (side) => { ctx.save(); ctx.translate(side * open * W / 2, 0); ctx.beginPath(); ctx.rect(side < 0 ? 0 : W / 2, 0, W / 2, H); ctx.clip();
      ctx.fillStyle = '#120E0B'; ctx.fillRect(0, 0, W, H); ctx.drawImage(TEX.dark, 0, 0); ctx.globalAlpha = .9; glow(ctx, W / 2, H / 2, 900, col, .22); ctx.globalAlpha = 1;
      // a "porta" do vagão: borda de borracha e janela
      rr(ctx, side < 0 ? W / 2 - 26 : W / 2, 0, 26, H, 0); ctx.fillStyle = '#0A0806'; ctx.fill();
      ctx.save(); ctx.globalAlpha = a; ctx.translate(W / 2, H / 2);
      pill(ctx, 0, -230, o.kicker || `CASE ${n} DE 4`, { size: 28, fill: C.red, color: '#FFF', weight: 900 });
      retroText(ctx, '0' + n, 0, -90, { size: 170, weight: 900, color: col, align: 'center', depth: 8, lw: 6 });
      rich(ctx, name, 0, 60, { size: 92, weight: 900, color: '#FFF', accent: col, retro: true, depth: 5, lw: 4 });
      text(ctx, topic, 0, 150, { size: 40, weight: 800, color: '#F3E6D6', align: 'center' });
      // os 4 cases como estações: o atual aceso
      for (let k = 1; k <= 4; k++) { const x = (k - 2.5) * 180; if (k < 4) line(ctx, x, 260, x + 180, 260, k < n ? col : 'rgba(255,255,255,.25)', 8); circle(ctx, x, 260, k === n ? 22 : 15, k === n ? col : k < n ? '#F3EBDD' : '#3A322B', INK, 4); }
      ctx.restore(); ctx.restore(); };
    half(-1); half(1);
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
  const T0 = 2.6, PH = [0, bt(4), bt(8), bt(16), bt(20)], T_TILE = [bt(4) + .3, bt(4) + 1, bt(5) + .2, bt(5) + .9], T_DC = [bt(6), bt(6) + 1.1, bt(7) + .2];
  const T_MAT = bt(10), T_BM = bt(11), T_ALS = bt(12), T_COS = bt(14) + 1.1, T_TENSE = bt(15), T_DROP = bt(16), T_INS = bt(18), T_IMP = bt(20), T_END = bt(22) + .6;
  const BASK = [['Café + chocolate', ['cup', 'box']], ['Churrasco', ['can', 'carton']], ['Destilados', ['bottle', 'jar']]];
  const ms = () => dget(CS(), 'analytics_solution.model_scale', {}), STORES = [['Cliente Banana', C.yellow], ['Cliente Maçã', C.red], ['Cliente Pera', C.orange]];
  const MONTHS = (String(dget(CS(), 'analytics_solution.lookback', '')).match(/(\d+)\s*meses/) || [])[1] || '24';
  const conv0 = Object.entries(dget(CS(), 'business_results.conversion_by_mechanic', {})), BEST = conv0.length ? conv0[0][0].replace(/\s*\(cesta\)/, '') : 'Destilados', HL = headlineFor(/Banana conversion/i) || '—';
  // esparsidade real da matriz cliente × produto: 1 − interações / (clientes × subgrupos)
  const SPARSE = (() => { const m = ms(), c = parseFloat(m.customers_modeled) * 1e6, s = +m.sku_subgroups, it = parseFloat(m.interactions) * 1e6; return c && s && it ? 1 - it / (c * s) : .95; })(), SPTXT = FMT.num(SPARSE * 100, 1) + '%';
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 });
  T_TILE.forEach((t0, i) => cue(id, t0, 'pop', { p: .9 + i * .1, v: .18 })); T_DC.forEach(t0 => cue(id, t0, 'buzz'));
  cue(id, PH[2], 'chime', { f: 784, up: 7 }); cue(id, T_MAT, 'shimmer', { dur: 1.5 }); for (let k = 0; k < 8; k++) cue(id, T_ALS + .3 + k * (T_COS - .6 - T_ALS) / 8, 'tick', {}); cue(id, T_COS, 'shimmer', { dur: 1.5 });
  cue(id, T_TENSE, 'riser', { dur: T_DROP - T_TENSE, v: .25 }); cue(id, T_DROP, 'impact', { size: 1.1 }); cue(id, T_IMP, 'impact', { size: .8 }); cue(id, T_IMP + .4, 'type', { n: 26, gap: .03 });
  const R = rng(5), ROWS = 12, COLS = 20, CELLS = Array.from({ length: ROWS * COLS }, () => R());
  const PR = Array.from({ length: 36 }, (_, i) => ({ b: i % 3, sx: R() * 2 - 1, sy: R() * 2 - 1, ox: (R() - .5) * .5, oy: (R() - .5) * .5 }));

  function stores(ctx, t, a) {
    if (a <= 0) return; const pos = [[1460, 420], [1300, 700], [1640, 700]];
    ctx.save(); ctx.globalAlpha *= a;
    pos.forEach(([x, y], i) => { const [x2, y2] = pos[(i + 1) % 3], u = (t * .5 + i / 3) % 1;
      ctx.save(); ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 30; line(ctx, x, y, x2, y2, rgba('#FFFFFF', .5), 4); ctx.restore();
      circle(ctx, lerp(x, x2, u), lerp(y, y2, u), 9, C.yellow); });
    pos.forEach(([x, y], i) => { const p = E.outBack(P(t, T0 + .4 + i * .3, .4)); if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p);
      vball(ctx, 0, 0, 74, STORES[i][1], { lw: 4 }); icon(ctx, 'store', 0, -6, 70, i === 1 ? '#FFF' : INK, 7);
      pill(ctx, 0, 98, STORES[i][0], { size: 20, fill: '#F6EEDF', weight: 900 }); ctx.restore(); });
    text(ctx, '3 empresas (BUs) · um só grupo', 1470, 860, { size: 24, weight: 800, mono: true, color: '#F3E6D6', align: 'center' });
    ctx.restore();
  }
  /** matriz esparsa → ALS: U e Vᵀ se ajustam em turnos, o erro cai e R̂ = U·Vᵀ preenche os vazios */
  function als(ctx, t) {
    const a = P(t, T_MAT, .6) * (1 - P(t, T_COS - .35, .45)); if (a <= 0) return;
    const cs = 28, K = 3, RX = 330, RY = 476, rw = COLS * cs, rh = ROWS * cs, UX = RX - 26 - K * cs, VY = RY - 22 - K * cs;
    const mp = P(t, T_MAT, 1.4), bm = P(t, T_BM, .8), ap = P(t, T_ALS, .5), it = clamp((t - T_ALS - .3) / (T_COS - .7 - T_ALS)) * 4, ph = Math.floor(it * 2) % 2;
    ctx.save(); ctx.globalAlpha *= a;
    paper(ctx, RX - 16, RY - 16, rw + 32, rh + 32, { r: 10, fill: 'rgba(20,16,13,.9)', outline: '#F3EBDD', lw: 2, shadow: 8, shadowColor: '#000', volume: false });
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const v = CELLS[r * COLS + c], known = v < .16 || c < 2 && v < .85, low = c < 2, x = RX + c * cs, y = RY + r * cs, appear = clamp(mp * 1.6 - (c + r) / 36);
      if (appear <= 0) continue;
      if (known) { circle(ctx, x + cs / 2, y + cs / 2, 8, rgba(low ? '#8A8378' : C.orange, appear * (low ? 1 - .75 * bm : 1))); continue; }
      ctx.strokeStyle = rgba('#FFFFFF', .07 * appear); ctx.lineWidth = 1; ctx.strokeRect(x + 3, y + 3, cs - 6, cs - 6);
      const f = clamp(it / 4 * 1.35 - hash(r * 31 + c * 7) * .35); if (f > 0) { const pv = hash(r * 7 + c * 13); rr(ctx, x + 5, y + 5, cs - 10, cs - 10, 4); ctx.fillStyle = rgba(mix('#5A3A22', C.yellow, pv), .85 * f); ctx.fill(); }
    }
    text(ctx, 'R · clientes × produtos', RX + rw / 2, RY + rh + 40, { size: 22, weight: 800, mono: true, color: '#F3EBDD', align: 'center', alpha: mp });
    // selo de esparsidade → vira "densa" quando o ALS termina
    const dense = P(t, T_ALS + (T_COS - T_ALS) * .7, .5);
    ctx.save(); ctx.translate(RX + rw - 90, RY + rh + 86); ctx.rotate(-.04); pill(ctx, 0, 0, dense > .5 ? 'densa: R̂ = U·Vᵀ' : `esparsa: ${SPTXT} vazia`, { size: 22, fill: dense > .5 ? C.yellow : C.red, color: dense > .5 ? INK : '#FFF', weight: 900, alpha: mp }); ctx.restore();
    if (bm > 0) { ctx.save(); ctx.globalAlpha *= bm * (1 - ap); rr(ctx, RX - 6, RY - 8, cs * 2 + 12, rh + 16, 8); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.stroke();
      text(ctx, 'sacola · pão: peso reduzido (BM25)', RX, RY + rh + 86, { size: 20, weight: 800, mono: true, color: '#FFB0A0' }); ctx.restore(); }
    // fatores U (clientes) e Vᵀ (produtos): o lado que está sendo ajustado brilha
    if (ap > 0) { ctx.save(); ctx.globalAlpha *= ap;
      const cell = (x, y, seed, hot) => { const v = hash(seed + Math.floor(it * 2) * 3.1), c = mix('#7A3A12', C.orange, v); rr(ctx, x + 3, y + 3, cs - 6, cs - 6, 4); ctx.fillStyle = hot ? mix(c, '#FFF1D6', .25 + .25 * Math.sin(t * 12 + seed)) : c; ctx.fill(); };
      for (let r = 0; r < ROWS; r++) for (let k = 0; k < K; k++) cell(UX + k * cs, RY + r * cs, r * 9 + k, ph === 0);
      for (let c = 0; c < COLS; c++) for (let k = 0; k < K; k++) cell(RX + c * cs, VY + k * cs, c * 5 + k + 300, ph === 1);
      inkRect(ctx, UX - 2, RY - 2, K * cs + 4, rh + 4, 6, ph === 0 ? 5 : 3, 4, ph === 0 ? C.yellow : '#F3EBDD'); inkRect(ctx, RX - 2, VY - 2, rw + 4, K * cs + 4, 6, ph === 1 ? 5 : 3, 5, ph === 1 ? C.yellow : '#F3EBDD');
      text(ctx, 'U', UX + K * cs / 2, RY - 26, { size: 30, weight: 900, color: '#FFF', align: 'center' }); text(ctx, 'clientes', UX + K * cs / 2, RY + rh + 40, { size: 18, weight: 800, mono: true, color: '#F3EBDD', align: 'center' });
      text(ctx, 'Vᵀ · produtos', RX - 20, VY + K * cs / 2, { size: 22, weight: 900, color: '#FFF', align: 'right' });
      // painel do erro
      holo(ctx, 1020, 400, 760, 400, { title: 'ALS · ERRO (RMSE) A CADA ITERAÇÃO', color: C.orange });
      const ex = 1080, ey = 460, ew = 640, eh = 220, err = i => .85 * Math.exp(-1.15 * i) + .1;
      line(ctx, ex, ey + eh, ex + ew, ey + eh, rgba('#FFFFFF', .3), 2); line(ctx, ex, ey, ex, ey + eh, rgba('#FFFFFF', .3), 2);
      ctx.beginPath(); for (let s = 0; s <= 60; s++) { const i = s / 60 * it; const x = ex + i / 4 * ew, y = ey + eh - err(i) / .95 * eh; s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.stroke();
      for (let i = 0; i <= Math.floor(it); i++) circle(ctx, ex + i / 4 * ew, ey + eh - err(i) / .95 * eh, 8, C.orange, INK, 2.5);
      text(ctx, 'iterações', ex + ew, ey + eh + 26, { size: 16, weight: 700, mono: true, color: '#BFB3A3', align: 'right' });
      const lab = it >= 4 ? 'convergiu ✓' : ph === 0 ? 'fixa V  →  ajusta U' : 'fixa U  →  ajusta V';
      neonText(ctx, lab, ex + ew / 2, ey + eh + 70, { size: 34, weight: 900, align: 'center', glow: it >= 4 ? C.yellow : C.orange });
      ctx.restore();
      formula(ctx, 'min Σ (r − uᵀv)² + λ(‖u‖² + ‖v‖²)', 1400, 860, { size: 20, rot: -.02, seed: 8, alpha: ap }); }
    ctx.restore();
  }
  /** espaço dos produtos: com os vetores prontos, o cosseno junta produtos em 3 cestas */
  function cosine(ctx, t) {
    const p = P(t, T_COS, .5), g = E.inOutCubic(P(t, T_COS + .3, 1.6)), out = P(t, T_DROP - .25, .3); if (p <= 0 || out >= 1) return;
    const cx = W / 2, cy = 640, CEN = [[-.62, .1], [0, -.25], [.62, .1]], col = [C.yellow, C.orange, C.red];
    ctx.save(); ctx.globalAlpha *= p * (1 - out);
    holo(ctx, cx - 640, cy - 270, 1280, 520, { title: 'ESPAÇO DOS PRODUTOS (VETORES DE Vᵀ)', color: C.orange });
    PR.forEach((q, i) => { const tx = CEN[q.b][0] + q.ox * .5, ty = CEN[q.b][1] + q.oy * .6, x = cx + lerp(q.sx, tx, g) * 560, y = cy + lerp(q.sy * .7, ty, g) * 380;
      vball(ctx, x, y, 10, g > .5 ? col[q.b] : '#BFB3A3', { lw: 2, rim: false }); });
    CEN.forEach(([x, y], k) => { const la = P(t, T_COS + 1.4 + k * .25, .4); if (la <= 0) return; const px = cx + x * 560, py = cy + y * 380;
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
      ctx.beginPath(); ctx.arc(0, -120, 70, Math.PI, 0); ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = '#F6EEDF'; ctx.lineWidth = 8; ctx.stroke();
      ics.forEach((ic, j) => { vball(ctx, -55 + j * 110, -20, 48, '#FFF8EE', { lw: 3 }); icon(ctx, ic, -55 + j * 110, -20, 56, INK, 9); });
      text(ctx, name, 0, 84, { size: 30, weight: 900, color: i === 0 ? INK : '#FFF', align: 'center' });
      ctx.restore();
      const cp = P(t, T_DROP + 1.2 + i * .3, .5); if (cp > 0) { ctx.save(); ctx.globalAlpha *= cp;
        for (let k = 0; k < 5; k++) { const ux = x - 120 + k * 60, uy = 760; vball(ctx, ux, uy, 26, '#F6EEDF', { lw: 3, rim: false }); icon(ctx, 'user', ux, uy + 2, 30, INK, 7); }
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
      vslab(ctx, 350, y - 18, Math.max(4, w), 36, 10, cesta ? C.orange : '#5E5850', { lw: 2.5 });
      text(ctx, FMT.auto(v) + (cesta ? '  · cesta' : ''), 376 + w, y, { size: 22, weight: 900, color: cesta ? C.yellow : '#FFF', alpha: bp }); });
    CASEKIT.headline(ctx, t, T_IMP + .05, 1300, 420, HL, 'conversão vs. 2ª melhor campanha', { col: C.orange });
    const br = dget(CS(), 'business_results', {});
    receipt(ctx, 1460, 620, { w: 560, p: P(t, T_IMP + 1.2, 2.2), rot: .02, lines: [
      ['receita incremental (Café)', FMT.auto(br.incremental_revenue_cafe)], ['Café em BU não principal', FMT.rel(br.cafe_revenue_growth_non_primary_bu)],
      ['clientes modelados', FMT.mm(ms().customers_modeled)], ['interações', FMT.mm(ms().interactions)], ['subgrupos de produto', FMT.num(ms().sku_subgroups || 0, 0)]] });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_DROP - .15, T_DROP + 1.8], [T_IMP - .1, T_IMP + 1.4, .8]],
    caps: [[T0 + .2, 5.4, 'O desafio: fazer o cliente de uma das empresas do grupo (BUs) *comprar também nas outras*', 'PROBLEMA'],
      [5.6, PH[1] - .2, 'Para isso: achar *cestas de produtos estratégicos* e quem tem mais chance de comprá-las', 'PROBLEMA'],
      [PH[1] + .2, T_DC[0] - .2, `O que o cliente tinha: *${MONTHS} meses de compras*, por cliente (CPF) e produto (SKU)`, 'DADOS'],
      [T_DC[0] + .1, PH[2] - .2, 'Mas o dado era difícil: *só compras*, itens que dominam o sinal e nomes diferentes', 'DADOS'],
      [PH[2] + .2, T_MAT - .2, 'Nossa estratégia: *gerar cestas de produtos* e achar o público certo para cada uma', 'ESTRATÉGIA'],
      [T_MAT + .1, T_BM - .1, `1 · As compras viram uma *matriz cliente × produto*: ${SPTXT} vazia (esparsa)`, 'COMO FIZEMOS'],
      [T_BM + .1, T_ALS - .2, '2 · *BM25* tira o peso dos itens que todo mundo compra, como sacola e pão', 'COMO FIZEMOS'],
      [T_ALS + .1, T_ALS + 2.4, '3 · *ALS* resolve a matriz esparsa: um vetor para cada cliente (U) e cada produto (V)', 'COMO FIZEMOS'],
      [T_ALS + 2.5, T_COS - .2, 'Em turnos — fixa V e ajusta U, fixa U e ajusta V — *o erro cai* e a matriz fica *densa*', 'COMO FIZEMOS'],
      [T_COS + .1, T_DROP - .2, '4 · Com os vetores prontos, a *similaridade de cosseno* junta produtos parecidos em cestas', 'COMO FIZEMOS'],
      [T_DROP + .2, T_INS - .1, `*Cestas temáticas* com seus clientes-alvo: ${BASK.map(b => b[0].toLowerCase()).join(', ')}`, 'SOLUÇÃO'],
      [T_INS + .1, T_IMP - .2, 'As cestas viraram *mecânicas de campanha* nos testes da Mesa de Performance', 'DECISÃO'],
      [T_IMP + .2, T_END - .1, `${BEST} bateu recorde: *${HL}* a conversão da 2ª melhor campanha`, 'IMPACTO'],
      [T_END, 53.4, `De ${MONTHS} meses de compras a *cestas que convertem mais*`, 'CONCLUSÃO']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .85, center: '#26170E' });
      neonGrid(ctx, t, { horizon: 900, alpha: .25 + .3 * P(t, T_MAT, 2), speed: .4 + BT.level });
      collage(ctx, t, { seed: 61, n: 5, theme: 'dark', alpha: .4 * (1 - P(t, T_MAT, 1)) });
      CASEKIT.header(ctx, t, 'CASE 1 DE 4 · VAREJO', 'Cliente Banana · cestas de produtos', { at: T0 - .2, seed: 4 });
      const q1 = 1 - P(t, PH[1] - .3, .4);
      if (q1 > 0) { ctx.save(); ctx.globalAlpha *= q1; CASEKIT.note(ctx, 640, 560, 940, CS().business_problem || '', P(t, T0 + .3, 4), { size: 30, label: 'PROBLEMA' }); stores(ctx, t, P(t, T0 + .3, .6)); ctx.restore(); }
      const q2 = P(t, PH[1] - .1, .3) * (1 - P(t, PH[2] - .3, .4));
      if (q2 > 0) { ctx.save(); ctx.globalAlpha *= q2;
        text(ctx, 'O QUE O CLIENTE TINHA', 560, 300, { size: 26, weight: 900, mono: true, color: C.yellow, align: 'center', ls: 4 });
        [[`${MONTHS} meses`, 'de compras por CPF × SKU'], [FMT.mm(ms().customers_modeled), 'clientes'], [FMT.num(ms().sku_subgroups || 0, 0), 'subgrupos de produto'], [FMT.mm(ms().interactions), 'interações cliente × produto']]
          .forEach(([b, l], i) => CASEKIT.tile(ctx, 350 + (i % 2) * 420, 440 + Math.floor(i / 2) * 250, 390, 220, b, l, P(t, T_TILE[i], .4), { seed: 20 + i, rot: [-.02, .015, .01, -.015][i] }));
        text(ctx, 'O QUE DIFICULTAVA', 1440, 300, { size: 26, weight: 900, mono: true, color: '#FFB0A0', align: 'center', ls: 4, alpha: P(t, T_DC[0] - .3, .3) });
        (CS().data_challenges || []).slice(0, 3).forEach((d, i) => CASEKIT.hurdle(ctx, 1440, 410 + i * 170, d, P(t, T_DC[i], .4), i));
        ctx.restore(); }
      CASEKIT.strategy(ctx, t, PH[2], T_MAT, 'Gerar *cestas de produtos*', 'e encontrar os clientes com mais chance de comprar cada uma', { seed: 21 });
      const how = P(t, T_MAT - .2, .4) * (1 - P(t, T_IMP - .4, .4));
      CASEKIT.chips(ctx, t, ['Matriz esparsa', 'BM25', 'ALS', 'Cosine similarity', 'Cestas'], [T_MAT, T_BM, T_ALS, T_COS, T_DROP], how, 292);
      als(ctx, t);
      cosine(ctx, t);
      baskets(ctx, t);
      impact(ctx, t);
      CASEKIT.ruler(ctx, t, PH, null, P(t, T0 - .2, .4));
      CASEKIT.interstitial(ctx, t, 1, '*Cliente Banana*', 'cestas de produtos · varejo', C.yellow);
      if (t > 52.7) flash(ctx, (t - 52.7) / .63 * .85, '#0A0706');
      scanlines(ctx, .05);
    }
  };
})();

/* ---------- case 2 · Cliente Manga (motor de principalidade) ---------- */
(() => {
  const id = 'manga', bt = caseBars(id), CS = () => CASE('Cliente Manga');
  const T0 = 2.6, PH = [0, bt(4), bt(8), bt(16), bt(20)], T_TILE = [bt(4) + .3, bt(4) + 1, bt(5) + .2, bt(5) + .9];
  const T_UMAP = bt(10), T_KM = bt(10) + 1.6, T_ALS = bt(12), T_EMB = bt(13), T_DROP = bt(16), T_DP = bt(16) + 1.6, T_INS = bt(18), T_IMP = bt(20), T_PROD = bt(22);
  const CL = 8, R = rng(23), CEN = Array.from({ length: CL }, (_, k) => [Math.cos(k / CL * TAU + .3) * (.55 + .2 * (k % 2)), Math.sin(k / CL * TAU + .3) * (.5 + .15 * (k % 3 === 0))]);
  const PTS = Array.from({ length: 220 }, (_, i) => { const c = i % CL, g = () => (R() + R() + R() - 1.5) * .18; return { c, sx: R() * 2 - 1, sy: R() * 2 - 1, x: CEN[c][0] + g(), y: CEN[c][1] + g() }; });
  // embeddings em 3D: 8 segmentos de clientes + 5 produtos no mesmo espaço
  const C3 = Array.from({ length: CL }, (_, k) => [Math.cos(k / CL * TAU) * .62, (k % 2 ? .38 : -.34) + (k % 3 === 0 ? .12 : 0), Math.sin(k / CL * TAU) * .62]);
  const P3 = Array.from({ length: 180 }, (_, i) => { const c = i % CL, g = () => (R() + R() + R() - 1.5) * .16; return { c, x: C3[c][0] + g(), y: C3[c][1] + g(), z: C3[c][2] + g() }; });
  const CCOL = [C.red, C.orange, C.yellow, '#FF8A5C', '#E94F64', '#FFC56E', '#FF6A2A', '#F2B04A'];
  const PROD = ['Cartão de crédito', 'Investimentos', 'Seguro de vida', 'Consórcio', 'Previdência'], ORDER = [2, 0, 4, 1, 3];
  const PV3 = [[-.25, -.7, .3], [.75, -.2, -.3], [.45, .55, .55], [-.75, .3, -.4], [.05, .7, -.65]];
  const POP = FMT.mm(String(dget(CS(), 'analytics_solution.population', '0.092MM')).split(' ')[0]), SUBS = Object.keys(dget(CS(), 'business_results.by_subsegment', {}));
  const HL = headlineFor(/principality gain/i) || '—';
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 });
  T_TILE.forEach((t0, i) => cue(id, t0, 'pop', { p: .9 + i * .1, v: .18 })); cue(id, PH[2], 'chime', { f: 784, up: 7 });
  cue(id, T_UMAP, 'shimmer', { dur: 2 }); for (let k = 0; k < CL; k++) cue(id, T_KM + k * .27, 'ping', { f: 988 * Math.pow(2, (k % 5) * 2 / 12) });
  cue(id, T_ALS, 'whoosh', { dur: .6, v: .25 }); cue(id, T_EMB, 'shimmer', { dur: 2.5 }); cue(id, bt(15), 'riser', { dur: T_DROP - bt(15), v: .25 });
  cue(id, T_DROP, 'impact', { size: 1 }); cue(id, T_DP, 'stab', { i: 2 }); cue(id, T_IMP, 'impact', { size: .9 }); cue(id, T_IMP + .4, 'type', { n: 24, gap: .03 }); cue(id, T_PROD, 'ding');

  function wallet(ctx, t, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(1450, 640); ctx.rotate(-.04);
    [[C.red, -.5, -60], [C.yellow, -.15, -30], [C.orange, .2, 0]].forEach(([c, r, dx], i) => { ctx.save(); ctx.rotate(r * .3); ctx.translate(dx, -120 - i * 6);
      vslab(ctx, -150, -95, 300, 190, 14, c, { lw: 4 }); rr(ctx, -110, -40, 60, 44, 6); ctx.fillStyle = '#F3D9A0'; ctx.fill(); ctx.restore(); });
    vslab(ctx, -230, -40, 460, 220, 26, '#5A3A22', { lw: 5 });
    text(ctx, 'carteira do cliente', 0, 80, { size: 28, weight: 800, color: '#F3E6D6', align: 'center' });
    const cp = P(t, T0 + 2.4, .5); if (cp > 0) { scribble(ctx, 'crown', 40, -300, 120, C.yellow, 4, cp, { glow: true }); pill(ctx, 40, -380, 'banco principal?', { size: 24, fill: C.yellow, weight: 900, alpha: cp }); }
    ctx.restore();
  }
  function umap(ctx, t, cx, cy, sc) {
    const p = E.inOutCubic(P(t, T_UMAP, 2.2)), out = P(t, T_ALS - .3, .5); if (t < T_UMAP - .2 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= P(t, T_UMAP - .2, .4) * (1 - out);
    holo(ctx, cx - sc * 1.25, cy - sc * .95, sc * 2.5, sc * 1.9, { title: 'UMAP · K-MEANS · 8 SEGMENTOS LOOK-ALIKE', color: C.orange });
    PTS.forEach(q => circle(ctx, cx + lerp(q.sx, q.x, p) * sc, cy + lerp(q.sy, q.y, p) * sc * .8, 5, p > .4 ? CCOL[q.c] : '#BFB3A3'));
    CEN.forEach(([x, y], k) => { const a = P(t, T_KM + k * .27, .3); if (a <= 0) return; const px = cx + x * sc, py = cy + y * sc * .8, s = 14 * E.outBack(a);
      glow(ctx, px, py, 60, CCOL[k], .5 * a); line(ctx, px - s, py - s, px + s, py + s, '#FFF', 5); line(ctx, px - s, py + s, px + s, py - s, '#FFF', 5);
      text(ctx, 'Seg ' + 'ABCDEFGH'[k], px, py + 30, { size: 16, weight: 800, mono: true, color: '#FFF', align: 'center', alpha: a }); });
    const q = dget(CS(), 'analytics_solution.segmentation_quality', {}), eggs = [[`trustworthiness ${FMT.auto(q.umap_trustworthiness)}`, 260, 330], [`silhouette ${FMT.auto(q.silhouette)}`, 1660, 330], [`Davies-Bouldin ${FMT.auto(q.davies_bouldin)}`, 260, 860], [`Calinski-Harabasz ${FMT.num(q.calinski_harabasz || 0, 0)}`, 1660, 860]];
    eggs.forEach(([s, x, y], i) => formula(ctx, s, x, y, { size: 18, neon: i % 2 === 1, alpha: P(t, T_KM + i * .5, .4), rot: (i % 2 ? .03 : -.03), seed: 20 + i }));
    ctx.restore();
  }
  /** ALS em miniatura (mesmo processo das cestas) → os vetores viram pontos */
  function alsMini(ctx, t) {
    const a = P(t, T_ALS, .4) * (1 - P(t, T_EMB - .1, .5)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(W / 2, 600);
    const cs = 22; for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) { const v = hash(r * 13 + c * 5); rr(ctx, -380 + c * cs, -90 + r * cs, cs - 4, cs - 4, 3); ctx.fillStyle = v < .2 ? C.orange : rgba(C.yellow, .2 + .6 * P(t, T_ALS + .3, 1.2) * hash(r + c * 3)); ctx.fill(); }
    text(ctx, '≈', 20, 0, { size: 70, weight: 900, color: '#FFF', align: 'center' });
    for (let r = 0; r < 8; r++) for (let k = 0; k < 3; k++) { rr(ctx, 80 + k * cs, -90 + r * cs, cs - 4, cs - 4, 3); ctx.fillStyle = mix('#7A3A12', C.orange, hash(r * 3 + k)); ctx.fill(); }
    text(ctx, '·', 170, 0, { size: 70, weight: 900, color: '#FFF', align: 'center' });
    for (let k = 0; k < 3; k++) for (let c = 0; c < 12; c++) { rr(ctx, 210 + c * cs, -40 + k * cs, cs - 4, cs - 4, 3); ctx.fillStyle = mix('#7A3A12', C.yellow, hash(c * 5 + k)); ctx.fill(); }
    pill(ctx, 0, -160, 'ALS · o mesmo processo das cestas', { size: 24, fill: C.yellow, weight: 900 });
    text(ctx, 'clientes (U)', 113, 110, { size: 20, weight: 800, mono: true, color: '#F3EBDD', align: 'center' }); text(ctx, 'produtos (V)', 342, 50, { size: 20, weight: 800, mono: true, color: '#F3EBDD', align: 'center' });
    ctx.restore();
  }
  /** embeddings em 3D: o espaço gira; perto = afinidade */
  function emb3d(ctx, t, cx, cy, Rr) {
    const a = P(t, T_EMB - .2, .6) * (1 - P(t, T_DROP - .3, .4)); if (a <= 0) return;
    const rot = (t - T_EMB) * .5 + .4, tilt = .42, ca = Math.cos(rot), sa = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt), grow = E.outCubic(P(t, T_EMB - .2, 1.2));
    const pr = (x, y, z) => { x *= grow; y *= grow; z *= grow; const X = x * ca + z * sa, Z0 = -x * sa + z * ca, Y = y * ct - Z0 * st, Z = y * st + Z0 * ct, f = 3 / (3 + Z); return [cx + X * Rr * f, cy + Y * Rr * f, Z, f]; };
    ctx.save(); ctx.globalAlpha *= a;
    holo(ctx, cx - Rr * 1.5, cy - Rr * 1.12, Rr * 3, Rr * 2.24, { title: 'EMBEDDINGS · CLIENTES E PRODUTOS EM 3D', color: C.orange });
    // caixa de referência
    const V = [-1, 1], edges = []; V.forEach(x => V.forEach(y => { edges.push([[x, y, -1], [x, y, 1]]); edges.push([[x, -1, y], [x, 1, y]]); edges.push([[-1, x, y], [1, x, y]]); }));
    edges.forEach(([p1, p2]) => { const A = pr(...p1), B = pr(...p2); line(ctx, A[0], A[1], B[0], B[1], rgba('#FFE2C4', .12), 1.5); });
    const items = P3.map(q => ({ k: 'c', q, p: pr(q.x, q.y, q.z) })).concat(PV3.map((v, i) => ({ k: 'p', i, p: pr(...v) })));
    items.sort((A, B) => B.p[2] - A.p[2]);
    const hl = P3[17], hp = pr(hl.x, hl.y, hl.z), near = PV3.map((v, i) => [i, (v[0] - hl.x) ** 2 + (v[1] - hl.y) ** 2 + (v[2] - hl.z) ** 2]).sort((A, B) => A[1] - B[1]).slice(0, 3), la = P(t, T_EMB + 2.4, .6);
    if (la > 0) near.forEach(([i], j) => { const q = pr(...PV3[i]); ctx.save(); ctx.globalAlpha *= la; ctx.setLineDash([10, 8]); line(ctx, hp[0], hp[1], q[0], q[1], j ? rgba(C.yellow, .7) : C.yellow, j ? 3 : 5); ctx.restore(); });
    items.forEach(it => { const [x, y, z, f] = it.p, dof = clamp(1 - (z + 1) * .25);
      if (it.k === 'c') { ctx.globalAlpha = a * (.45 + .55 * dof); circle(ctx, x, y, 4.5 * f, CCOL[it.q.c]); }
      else { ctx.globalAlpha = a; const s = 18 * f; vslab(ctx, x - s / 2, y - s / 2, s, s, s * .5, C.yellow, { lw: 2.5 }); pill(ctx, x, y - 28 * f, PROD[it.i], { size: Math.round(15 * f), fill: '#F6EEDF', weight: 900 }); } });
    ctx.globalAlpha = a; if (la > 0) { circle(ctx, hp[0], hp[1], 14, null, '#FFF', 3); pill(ctx, hp[0], hp[1] + 34, 'um associado', { size: 16, fill: '#FFF', weight: 900, alpha: la }); }
    formula(ctx, 'afinidade(u, p) = u · p', cx + Rr * 1.2, cy + Rr * 1.05, { size: 20, rot: -.02, seed: 7, alpha: a });
    ctx.restore();
  }
  function lists(ctx, t) {
    const p = P(t, T_DROP, .5), out = P(t, T_IMP - .4, .5); if (p <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= p * (1 - out);
    [['cross-sell · produtos novos', 560], ['upsell · subir de nível', 1060]].forEach(([l, x]) => text(ctx, l.toUpperCase(), x, 380, { size: 22, weight: 900, mono: true, color: C.yellow, align: 'center', ls: 3 }));
    const dp = E.inOutCubic(P(t, T_DP, 1.4));
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
    caps: [[T0 + .2, 5.6, 'O desafio: recomendar produtos que façam o cliente *escolher o banco como principal*', 'PROBLEMA'],
      [5.8, PH[1] - .2, 'Até então a recomendação olhava *só afinidade e conversão*', 'PROBLEMA'],
      [PH[1] + .2, PH[2] - .2, `O que o cliente tinha: *${POP} associados pessoa física*, seus produtos e a principalidade de cada um`, 'DADOS'],
      [PH[2] + .2, T_UMAP - .2, 'Nossa estratégia: um *motor de recomendação* que prioriza o que aumenta a principalidade', 'ESTRATÉGIA'],
      [T_UMAP + .1, T_ALS - .2, '1 · *UMAP + K-Means* agrupam associados parecidos em 8 segmentos look-alike', 'COMO FIZEMOS'],
      [T_ALS + .1, T_EMB - .1, '2 · *ALS*, o mesmo processo das cestas, gera um vetor para cada cliente e produto', 'COMO FIZEMOS'],
      [T_EMB + .1, T_DROP - .2, '3 · O resultado são os *embeddings*: clientes e produtos no mesmo espaço — perto = afinidade', 'COMO FIZEMOS'],
      [T_DROP + .2, T_DP + 1.6, 'Saem as listas de cross-sell e upsell por afinidade…', 'SOLUÇÃO'],
      [T_DP + 1.7, T_INS - .1, '…e a camada *ΔP* reordena cada lista pelo ganho esperado de principalidade', 'SOLUÇÃO'],
      [T_INS + .1, T_IMP - .2, 'Cada associado recebe uma *lista curta* com o que mais aumenta a principalidade', 'DECISÃO'],
      [T_IMP + .2, T_PROD - .2, `*${HL}* de principalidade vs. controle no backtest da lista curta`, 'IMPACTO'],
      [T_PROD, 53.4, 'E o motor está *produtizado*: retreino semestral, pipeline mensal e ajuste diário', 'IMPACTO']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#1E1410' });
      neonGrid(ctx, t, { horizon: 960, alpha: .3, speed: .4 + BT.level });
      CASEKIT.header(ctx, t, 'CASE 2 DE 4 · EMISSORES', 'Cliente Manga · motor de principalidade', { at: T0 - .2, seed: 8, bg: C.orange });
      const q1 = 1 - P(t, PH[1] - .3, .4);
      if (q1 > 0) { ctx.save(); ctx.globalAlpha *= q1; CASEKIT.note(ctx, 640, 560, 940, CS().business_problem || '', P(t, T0 + .3, 3), { size: 32, label: 'PROBLEMA' }); wallet(ctx, t, P(t, T0 + .3, .6)); ctx.restore(); }
      const q2 = P(t, PH[1] - .1, .3) * (1 - P(t, PH[2] - .3, .4));
      if (q2 > 0) { ctx.save(); ctx.globalAlpha *= q2;
        text(ctx, 'O QUE O CLIENTE TINHA', W / 2, 300, { size: 26, weight: 900, mono: true, color: C.yellow, align: 'center', ls: 4 });
        [[POP, 'associados pessoa física'], [String(SUBS.length || 4), `subsegmentos: ${SUBS.join(', ') || 'PF I a IV+'}`], ['produtos', 'que cada associado já tem'], ['principalidade', 'o indicador atual de cada um']]
          .forEach(([b, l], i) => CASEKIT.tile(ctx, 300 + i * 440, 560, 400, 260, b, l, P(t, T_TILE[i], .4), { seed: 30 + i, rot: [-.02, .015, -.01, .02][i], size: 72 }));
        ctx.restore(); }
      CASEKIT.strategy(ctx, t, PH[2], T_UMAP, 'Um *motor de recomendação*', 'que prioriza os produtos que mais aumentam a principalidade', { seed: 23 });
      const how = P(t, T_UMAP - .2, .4) * (1 - P(t, T_IMP - .4, .4));
      CASEKIT.chips(ctx, t, ['UMAP + K-Means', 'ALS', 'Embeddings 3D', 'Camada ΔP'], [T_UMAP, T_ALS, T_EMB, T_DROP], how, 292);
      umap(ctx, t, W / 2, 620, 300);
      alsMini(ctx, t);
      emb3d(ctx, t, W / 2, 630, 280);
      lists(ctx, t);
      impact(ctx, t);
      CASEKIT.ruler(ctx, t, PH, null, P(t, T0 - .2, .4));
      CASEKIT.interstitial(ctx, t, 2, '*Cliente Manga*', 'motor de principalidade · emissores', C.orange);
      if (t > 52.7) flash(ctx, (t - 52.7) / .63 * .85, '#0A0706');
      scanlines(ctx, .06);
    }
  };
})();

/* ---------- case 3 · Lights-off (relatórios de fraude automáticos) ----------
   Uma analista monta os relatórios à mão (a pilha cresce, o relógio corre, o dia vira noite);
   o pipeline é montado na parede; ela levanta, vai até o interruptor, apaga a luz no drop
   e sai dançando de fones no ritmo da música. */
(() => {
  const id = 'lightsoff', bt = caseBars(id), CS = () => CASE('Lights-off'), G = grid(id);
  const T0 = 2.6, PH = [0, bt(4), bt(8), bt(16), bt(20)], T_STRAT = bt(8), T_PIPE = bt(10), T_UP = bt(13) + .9, T_WALK = T_UP + 1, T_REACH = T_WALK + 2.9, T_DROP = bt(16);
  const T_IDEA = bt(7) + .6, T_PHONES = T_DROP + .7, T_DANCE = T_DROP + 1, T_STAMP = bt(18), T_IMP = bt(20), T_Q = bt(22), T_DIVE = bt(23);
  const NODES = [['Dados', 'db'], ['Validação', 'check'], ['Processamento', 'gear'], ['Insights', 'ai'], ['Relatório', 'doc'], ['Board', 'board']];
  const CYCLE = ['Extrair os dados', 'Conferir', 'Copiar e colar', 'Escrever insights', 'Revisar', 'Enviar ao board'];
  const EGG = ['SQL · parquet', 'z = (x − μ)/σ', 'DAG ⟳ · idempotente', '? insights', 'PDF · PPT', 'cron 0 7 * * 1'];
  const LABELS = ['PROBLEMA', 'TRABALHO MANUAL', 'ESTRATÉGIA', 'SOLUÇÃO', 'IMPACTO'];
  const FLOOR = 880, GS = 1.6, LIFT = -34, SEAT = 470, SW_X = 1790, STAND = 1660, nx = i => 470 + i * 190, NY = 330;
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 });
  for (let k = 0; k < 14; k++) cue(id, T0 + .5 + k * 1.05, 'type', { n: 6, gap: .05 });
  cue(id, T_STRAT, 'chime', { f: 784, up: 7 }); NODES.forEach((_, i) => cue(id, T_PIPE + i * 1.6, 'pop', { p: .8 + i * .1, v: .18 }));
  cue(id, T_REACH, 'riser', { dur: T_DROP - T_REACH, v: .25 }); cue(id, T_DROP, 'click', { v: 1 }); cue(id, T_DROP + .05, 'impact', { size: 1.1 });
  NODES.forEach((_, i) => cue(id, T_DROP + .6 + i * .3, 'ping', { f: 880 * Math.pow(2, i * 2 / 12) })); cue(id, T_STAMP, 'ding'); cue(id, T_IMP, 'impact', { size: .8 }); cue(id, T_DIVE, 'whoosh', { dur: 1.4, dir: 'down', v: .45 });

  const beatAt = t => { const b = G.beats; let i = 0; while (i + 1 < b.length && b[i + 1] <= t) i++; const per = (b[i + 1] || b[i] + .555) - b[i]; return { ph: clamp((t - b[i]) / per), i }; };
  /** onde está e o que faz a analista em cada instante */
  function girlAt(t) {
    const P_ = PEOPLE, tired = t < T_DROP;
    if (t < T_UP) return { x: SEAT, y: LIFT, pose: P_.typing(t * (t > T_IDEA ? 1.4 : 1)), dir: 1, phones: 'neck', mood: t > T_IDEA ? 'happy' : 'tired' };
    if (t < T_WALK) { const k = E.inOutCubic((t - T_UP) / (T_WALK - T_UP)); return { x: SEAT + 30 * k, y: LIFT * (1 - k), pose: P_.mixPose(P_.typing(t), P_.POSE.stand, k), dir: 1, phones: 'neck', mood: 'happy' }; }
    if (t < T_REACH) { const u = (t - T_WALK) / (T_REACH - T_WALK); return { x: lerp(SEAT + 30, STAND, E.inOutSine(u)), pose: P_.walk((t - T_WALK) * 17), dir: 1, phones: 'neck', mood: 'calm' }; }
    if (t < T_DROP + .4) return { x: STAND, pose: P_.reach(E.outCubic(clamp((t - T_REACH) / 1.2))), dir: 1, phones: 'neck', mood: 'calm' };
    const { ph, i } = beatAt(t), d = P_.dance(t, 1 - ph, i), on = t > T_PHONES ? 'on' : 'neck';
    if (t < T_DANCE) return { x: STAND, pose: P_.mixPose(P_.reach(1), P_.POSE.stand, (t - T_DROP - .4) / (T_DANCE - T_DROP - .4)), dir: -1, phones: on, mood: 'happy' };
    if (t < T_IMP) return { x: STAND - 40 * Math.sin((t - T_DANCE) * 1.3), pose: d, dir: -1, phones: 'on', mood: 'happy' };
    const u = clamp((t - T_IMP) / 3.2); return { x: lerp(STAND, W + 300, u), pose: P_.mixPose(d, P_.walk((t - T_IMP) * 15), .5), dir: 1, phones: 'on', mood: 'happy', gone: u >= 1 };
  }
  function lightSwitch(ctx, x, y, s, on, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    vslab(ctx, -90, -150, 180, 300, 14, '#F3EBDD', { lw: 5 });
    circle(ctx, 0, -120, 7, '#BFB3A3', INK, 2); circle(ctx, 0, 120, 7, '#BFB3A3', INK, 2);
    rr(ctx, -40, -80, 80, 160, 14); ctx.fillStyle = '#2A221C'; ctx.fill(); inkRect(ctx, -40, -80, 80, 160, 14, 3, 2);
    const ty = lerp(36, -36, on); rr(ctx, -32, ty - 40, 64, 80, 12); const g = ctx.createLinearGradient(0, ty - 40, 0, ty + 40); g.addColorStop(0, '#FFFDF8'); g.addColorStop(1, '#D9CFC0'); ctx.fillStyle = g; ctx.fill(); inkRect(ctx, -32, ty - 40, 64, 80, 12, 3, 4);
    text(ctx, 'LIGA', 0, -108, { size: 16, weight: 900, mono: true, color: on > .5 ? C.red : '#8A8378', align: 'center' }); text(ctx, 'DESLIGA', 0, 108, { size: 16, weight: 900, mono: true, color: on > .5 ? '#8A8378' : C.orange, align: 'center' });
    if (o.label) pill(ctx, 0, 196, o.label, { size: 20, fill: on > .5 ? C.yellow : C.orange, weight: 900 });
    ctx.restore();
  }
  /** janela: o dia vira noite enquanto ela trabalha */
  function windowView(ctx, t) {
    const x = 70, y = 250, w = 270, h = 310, k = clamp((t - T0) / (PH[2] - T0)), day = '#9FD3F0', dusk = '#F28C38', night = '#101632';
    const sky = k < .55 ? mix(day, dusk, k / .55) : mix(dusk, night, (k - .55) / .45);
    vslab(ctx, x - 16, y - 16, w + 32, h + 32, 18, '#6A4A30', { lw: 4 });
    ctx.save(); rr(ctx, x, y, w, h, 6); ctx.clip(); const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, sky); g.addColorStop(1, mix(sky, '#FFE2B0', .3 * (1 - k))); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const sy = lerp(y + 60, y + h + 40, clamp(k * 1.4)); vball(ctx, x + w * .65, sy, 34, k < .6 ? '#FFE07A' : '#FF8A3D', { ink: false, rim: false });
    if (k > .7) { const a = (k - .7) / .3; for (let s = 0; s < 18; s++) circle(ctx, x + hash(s) * w, y + hash(s + 9) * h * .7, 1.6 + hash(s + 3) * 1.6, rgba('#FFF6DC', a * (.5 + .5 * Math.sin(t * 3 + s)))); vball(ctx, x + w * .3, y + 70, 24, '#F3EBDD', { ink: false, rim: false }); }
    for (let b = 0; b < 6; b++) { const bh = 60 + hash(b * 3) * 110, bx = x + b * 48; ctx.fillStyle = mix('#2A2030', night, k * .5); ctx.fillRect(bx, y + h - bh, 44, bh);
      if (k > .5) for (let wv = 0; wv < 6; wv++) if (hash(b * 17 + wv) > .5) { ctx.fillStyle = rgba('#FFD27A', (k - .5) * 1.6); ctx.fillRect(bx + 8 + (wv % 2) * 18, y + h - bh + 12 + Math.floor(wv / 2) * 22, 9, 12); } }
    ctx.restore(); line(ctx, x + w / 2, y, x + w / 2, y + h, '#6A4A30', 10); line(ctx, x, y + h / 2, x + w, y + h / 2, '#6A4A30', 10);
  }
  function clock(ctx, t, x, y) {
    const spin = t < T_DROP ? (t - T0) * 3.2 : (T_DROP - T0) * 3.2 + (t - T_DROP) * .2;
    vball(ctx, x, y, 66, '#F3EBDD', { lw: 5 }); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(ctx, x + Math.cos(a) * 50, y + Math.sin(a) * 50, x + Math.cos(a) * 58, y + Math.sin(a) * 58, INK, 4); }
    line(ctx, x, y, x + Math.sin(spin) * 48, y - Math.cos(spin) * 48, INK, 5); line(ctx, x, y, x + Math.sin(spin / 12) * 32, y - Math.cos(spin / 12) * 32, INK, 8); circle(ctx, x, y, 6, C.red);
    if (t < T_DROP && t > T0) for (let k = 0; k < 3; k++) { const a = spin + k * .4; ctx.save(); ctx.globalAlpha = .25 - k * .07; line(ctx, x, y, x + Math.sin(a - .3) * 48, y - Math.cos(a - .3) * 48, INK, 4); ctx.restore(); }
  }
  /** mesa, monitor e as pilhas de relatórios que só crescem */
  function desk(ctx, t) {
    const n = Math.floor(clamp((t - T0) / (PH[2] - T0 - 1)) * 24);
    // cadeira
    const sy = FLOOR + LIFT - 60 * GS + 6; vslab(ctx, SEAT - 70, sy, 140, 18, 30, '#3A2A22', { lw: 3 }); line(ctx, SEAT - 6, sy + 18, SEAT - 6, FLOOR - 10, '#2A1E18', 10); line(ctx, SEAT - 60, FLOOR - 8, SEAT + 50, FLOOR - 8, '#2A1E18', 8);
    vslab(ctx, SEAT - 96, sy - 190, 22, 190, 14, '#3A2A22', { lw: 3 });
    // mesa
    vslab(ctx, 560, 650, 470, 26, 46, '#8A5634', { lw: 4 }); [575, 1005].forEach(lx => vslab(ctx, lx, 676, 18, FLOOR - 676, 10, '#6A4026', { lw: 3 }));
    // pilha de relatórios na mesa
    for (let k = 0; k < n; k++) { const y = 650 - 8 - k * 8, dx = (hash(k * 3) - .5) * 10; paper(ctx, 935 + dx, y, 86, 9, { r: 2, fill: k % 5 === 4 ? '#F6E2B8' : '#FFFDF8', shadow: 2, lw: 1.5, volume: false }); }
    // pilhas no chão (depois de alguns ciclos)
    const m = Math.floor(clamp((t - PH[1]) / (PH[2] - PH[1])) * 54);
    for (let k = 0; k < m; k++) { const st = k % 3, j = Math.floor(k / 3), x = 1080 + st * 110 + (hash(k) - .5) * 12, y = FLOOR - 9 - j * 9; paper(ctx, x, y, 92, 10, { r: 2, fill: '#FFFDF8', shadow: 2, lw: 1.5, volume: false }); }
    // monitor (de frente para ela) e teclado
    line(ctx, 880, 650, 880, 600, '#2A221C', 12); vslab(ctx, 845, 640, 70, 10, 14, '#2A221C', { lw: 2.5 });
    ctx.save(); ctx.beginPath(); ctx.moveTo(820, 470); ctx.lineTo(905, 452); ctx.lineTo(905, 612); ctx.lineTo(820, 600); ctx.closePath(); ctx.fillStyle = '#1C1A22'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(826, 478); ctx.lineTo(899, 462); ctx.lineTo(899, 602); ctx.lineTo(826, 592); ctx.closePath(); const sg = ctx.createLinearGradient(826, 470, 899, 600); sg.addColorStop(0, '#DDEBFF'); sg.addColorStop(1, '#8AA8D8'); ctx.fillStyle = sg; ctx.fill(); ctx.restore();
    for (let l = 0; l < 7; l++) line(ctx, 832, 486 + l * 15, 832 + 20 + hash(l + Math.floor(t * 2)) * 40, 484 + l * 15, '#4A5A7A', 3);
    vslab(ctx, 690, 640, 120, 8, 22, '#3A3640', { lw: 2.5 });
    glow(ctx, 760, 520, 160, '#BFD8FF', .22);
  }
  function bubble(ctx, t) {
    const a = P(t, PH[1], .4) * (1 - P(t, T_IDEA - .3, .3)); if (a <= 0) return;
    const sp = t - PH[1], step = Math.floor(sp * (1 + sp * .12)) % CYCLE.length, cx = 520, cy = 300;
    ctx.save(); ctx.globalAlpha *= a;
    [[SEAT + 60, 418, 10], [SEAT + 74, 388, 15]].forEach(([x, y, r]) => vball(ctx, x, y, r, '#FFFDF8', { rim: false, lw: 3 }));
    ctx.beginPath(); for (let k = 0; k < 9; k++) { const ang = k / 9 * TAU, rx = 230 + 14 * Math.sin(k * 2.3), ry = 70 + 10 * Math.cos(k * 1.7); ctx.arc(cx + Math.cos(ang) * rx * .8, cy + Math.sin(ang) * ry * .8, 52, 0, TAU); }
    ctx.fillStyle = '#FFFDF8'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, 230, 76, 0, 0, TAU); ctx.fillStyle = '#FFFDF8'; ctx.fill();
    text(ctx, CYCLE[step], cx, cy - 8, { size: 34, weight: 900, color: INK, align: 'center' });
    text(ctx, `passo ${step + 1} de ${CYCLE.length}  ·  e de novo… ↻`, cx, cy + 34, { size: 18, weight: 800, mono: true, color: C.red, align: 'center' });
    ctx.restore();
  }
  function pipeline(ctx, t, dark) {
    if (t < T_PIPE - .2) return;
    const out = P(t, T_DIVE + 1.2, .5); ctx.save(); ctx.globalAlpha *= 1 - out;
    const la = P(t, T_PIPE - .2, .5); text(ctx, 'PIPELINE AUTOMÁTICO', nx(0) - 80, NY - 110, { size: 18, weight: 900, mono: true, color: dark > .5 ? C.orange : '#6A4A30', ls: 3, alpha: la });
    NODES.forEach(([nm, ic], i) => { const p = E.outBack(P(t, T_PIPE + i * 1.6, .4)); if (p <= 0) return; const x = nx(i), hot = i === 3 && t > T_IMP;
      if (i) { const lp = P(t, T_PIPE + (i - .4) * 1.6, .5); if (dark > 0) { ctx.save(); ctx.shadowColor = C.orange; ctx.shadowBlur = 12 * dark; line(ctx, nx(i - 1) + 62, NY, lerp(nx(i - 1) + 62, x - 62, lp), NY, C.orange, 5); ctx.restore(); } else line(ctx, nx(i - 1) + 62, NY, lerp(nx(i - 1) + 62, x - 62, lp), NY, INK, 5); }
      if (dark > 0) { ctx.save(); ctx.globalAlpha *= dark; holo(ctx, x - 62, NY - 62, 124, 124, { color: hot ? C.yellow : C.orange, corners: hot }); ctx.restore(); }
      if (dark < 1) { ctx.save(); ctx.globalAlpha *= 1 - dark; paper(ctx, x - 62, NY - 62, 124, 124, { r: 12, fill: '#FFFDF8', shadow: 7, lw: 3.5 }); ctx.restore(); }
      ctx.save(); ctx.translate(x, NY - 4); ctx.scale(p * .82, p * .82); icon(ctx, ic, 0, 0, 66, dark > .5 ? '#FFE9D6' : INK, 8); ctx.restore();
      if (hot) { glow(ctx, x, NY, 150, C.yellow, .5); neonText(ctx, '?', x + 52, NY - 76, { size: 64, weight: 900, glow: C.yellow }); }
      if (dark > .5) neonText(ctx, nm, x, NY + 90, { size: 22, weight: 800, align: 'center' }); else text(ctx, nm, x, NY + 90, { size: 22, weight: 900, color: INK, align: 'center' });
      if (dark > .5) formula(ctx, EGG[i], x, NY + 136, { size: 14, neon: true, alpha: P(t, T_DROP + .6 + i * .3, .4) * (1 - P(t, T_IMP - .3, .3)), rot: (i % 2 ? .03 : -.03) }); });
    if (t > T_DROP + .6) for (let k = 0; k < 6; k++) { const u = ((t - T_DROP) * .45 + k / 6) % 1; circle(ctx, lerp(nx(0), nx(5), u), NY, 8, C.yellow); }
    ctx.restore();
  }
  /** a ideia: lâmpada acende sobre a cabeça dela */
  function idea(ctx, t) {
    const a = P(t, T_IDEA, .35) * (1 - P(t, PH[2] + .1, .4)); if (a <= 0) return;
    const x = SEAT + 30, y = 360, s = E.outBack(P(t, T_IDEA, .45)) * (1 + .05 * Math.sin(t * 9));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
    glow(ctx, 0, 0, 170, '#FFE27A', .7);
    for (let k = 0; k < 10; k++) { const ang = k / 10 * TAU + t; line(ctx, Math.cos(ang) * 64, Math.sin(ang) * 64, Math.cos(ang) * 92, Math.sin(ang) * 92, '#FFD23A', 6); }
    vball(ctx, 0, -6, 46, '#FFE680', { lw: 4.5, rimCol: '#FFF6C0' }); rr(ctx, -20, 34, 40, 30, 6); ctx.fillStyle = '#8A8378'; ctx.fill(); inkRect(ctx, -20, 34, 40, 30, 6, 4, 3);
    line(ctx, -16, 45, 16, 45, INK, 3); line(ctx, -16, 54, 16, 54, INK, 3); ctx.beginPath(); ctx.moveTo(-12, 10); ctx.lineTo(-4, -12); ctx.lineTo(4, 6); ctx.lineTo(12, -12); ctx.strokeStyle = '#E08A00'; ctx.lineWidth = 4; ctx.stroke();
    ctx.restore();
  }
  /** feliz automatizando: faíscas e corações saindo do teclado */
  function joy(ctx, t, g) {
    if (t < T_PIPE - .3 || t > T_UP) return;
    for (let k = 0; k < 6; k++) { const d = (t * .9 + k / 6) % 1, x = g.x + 90 + Math.sin(k * 2.1 + t) * 50, y = 640 - d * 220; ctx.save(); ctx.globalAlpha = (1 - d) * .9;
      if (k % 2) scribble(ctx, 'heart', x, y, 34, C.red, 60 + k, 1, { glow: true }); else scribble(ctx, 'star', x, y, 30, C.yellow, 70 + k, 1, { glow: true }); ctx.restore(); }
  }
  /** luz apagada: a sala vira contornos de neon — tudo automatizado */
  function neonRoom(ctx, t) {
    const on = P(t, T_DROP + .1, .5); if (on <= 0) return;
    const fl = t < T_DROP + .8 ? (hash(Math.floor(t * 20)) > .35 ? 1 : .2) : 1, a = on * fl * (1 - P(t, T_DIVE + .4, .6)), sy = FLOOR + LIFT - 60 * GS + 6;
    ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const neon = (col, w, fn) => { ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.strokeStyle = col; ctx.lineWidth = w; fn(); ctx.stroke(); ctx.shadowBlur = 0; ctx.strokeStyle = '#FFF4E4'; ctx.lineWidth = w * .35; fn(); ctx.stroke(); };
    neon(C.orange, 5, () => { ctx.beginPath(); ctx.rect(54, 234, 302, 342); ctx.moveTo(205, 234); ctx.lineTo(205, 576); ctx.moveTo(54, 405); ctx.lineTo(356, 405); });
    neon(C.yellow, 5, () => { ctx.beginPath(); ctx.rect(560, 650, 470, 26); ctx.rect(575, 676, 18, FLOOR - 676); ctx.rect(1005, 676, 18, FLOOR - 676); });
    neon('#FF5FA2', 5, () => { ctx.beginPath(); ctx.moveTo(820, 470); ctx.lineTo(905, 452); ctx.lineTo(905, 612); ctx.lineTo(820, 600); ctx.closePath(); ctx.moveTo(880, 612); ctx.lineTo(880, 650); });
    neon(C.orange, 4, () => { ctx.beginPath(); ctx.rect(SEAT - 70, sy, 140, 18); ctx.rect(SEAT - 96, sy - 190, 22, 190); ctx.moveTo(SEAT - 6, sy + 18); ctx.lineTo(SEAT - 6, FLOOR - 10); });
    neon(C.yellow, 5, () => { ctx.beginPath(); ctx.arc(1640, 300, 66, 0, TAU); });
    neon(C.red, 4, () => { ctx.beginPath(); ctx.moveTo(0, 560); ctx.lineTo(W, 560); ctx.moveTo(0, FLOOR); ctx.lineTo(W, FLOOR); });
    neon('#FF5FA2', 3, () => { ctx.beginPath(); for (let st = 0; st < 3; st++) ctx.rect(1076 + st * 110, FLOOR - 170, 100, 168); ctx.rect(931, 650 - 24 * 8 - 4, 94, 24 * 8 + 4); });
    const sa = P(t, T_DROP + .5, .4) * (t < T_DROP + 1.2 ? (hash(Math.floor(t * 14) + 3) > .3 ? 1 : .3) : 1);
    if (sa > 0) { ctx.globalAlpha = a * sa; ctx.save(); ctx.translate(1250, 500); ctx.rotate(-.03); ctx.shadowColor = '#FF5FA2'; ctx.shadowBlur = 24; ctx.font = font(46, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#FF5FA2'; ctx.lineWidth = 6; ctx.strokeText('TUDO AUTOMATIZADO', 0, 0); ctx.shadowBlur = 0; ctx.fillStyle = '#FFF0F6'; ctx.fillText('TUDO AUTOMATIZADO', 0, 0); ctx.restore(); }
    ctx.restore();
  }
  SCENES[id] = {
    themeAt: t => t < T_DROP ? 'light' : 'dark', fx: { invert: true },
    peaks: [[T_DROP - .15, T_DROP + 1.8], [T_DANCE, T_IMP, .35], [T_IMP - .1, T_IMP + 1.2, .7]],
    caps: [[T0 + .2, 5.6, 'Antes: cada relatório de fraude para o board era *montado à mão*', 'PROBLEMA'],
      [5.8, PH[1] - .2, 'Relatório após relatório, *a pilha só crescia* — e o relógio não parava', 'PROBLEMA'],
      [PH[1] + .2, 13.2, 'Extrair, conferir, copiar, colar, escrever insights, revisar… *tudo à mão*', 'TRABALHO MANUAL'],
      [13.4, T_IDEA - .2, 'O dia vira noite e o ciclo recomeça: *muito tempo* gasto em cada relatório', 'TRABALHO MANUAL'],
      [T_IDEA, PH[2] - .2, 'Até que ela tem uma *ideia*…', 'A IDEIA'],
      [PH[2] + .2, T_PIPE - .2, 'Nossa estratégia: *automatizar de ponta a ponta* — para poder apagar as luzes', 'ESTRATÉGIA'],
      [T_PIPE + .1, T_PIPE + 4.6, '1 · Feliz, ela monta a automação: os *dados* entram sozinhos e passam por *validação*', 'COMO FIZEMOS'],
      [T_PIPE + 4.8, T_UP - .1, '2 · O *processamento* calcula os indicadores e monta os *insights* e o *relatório*', 'COMO FIZEMOS'],
      [T_UP, T_DROP - .1, '3 · Com o pipeline pronto, ela levanta e vai até o interruptor…', 'COMO FIZEMOS'],
      [T_DROP + .2, T_STAMP - .1, '*Lights-off*: ela apaga as luzes e tudo segue rodando sozinho, em neon', 'SOLUÇÃO'],
      [T_STAMP + .1, T_IMP - .2, 'Do dado ao board, *sem ninguém copiar e colar* — e ela sai dançando', 'SOLUÇÃO'],
      [T_IMP + .2, T_Q - .2, 'Resultado: relatórios para o board *sem trabalho manual* — o time volta a analisar', 'IMPACTO'],
      [T_Q, 53.4, 'Mas quem escreve os *insights* em escala? É o próximo case', 'E AGORA?']],
    draw(ctx, t) {
      const dark = P(t, T_DROP, .15), dive = E.inCubic(P(t, T_DIVE, 2.2)), sw = 1 - P(t, T_DROP - .05, .1), g = girlAt(t);
      ctx.save();
      if (dive > 0) { const n = nx(3); ctx.translate(n, NY); ctx.scale(1 + dive * 14, 1 + dive * 14); ctx.translate(-n, -NY); }
      // sala: parede, lambri e piso de madeira
      bgLight(ctx, t, { atmos: false }); ctx.fillStyle = '#D6C4A6'; ctx.fillRect(0, 560, W, FLOOR - 560); line(ctx, 0, 560, W, 560, '#8A6A48', 8);
      const fl = ctx.createLinearGradient(0, FLOOR, 0, H); fl.addColorStop(0, '#8A5A3A'); fl.addColorStop(1, '#4A2E1E'); ctx.fillStyle = fl; ctx.fillRect(0, FLOOR, W, H - FLOOR);
      for (let k = 0; k < 9; k++) line(ctx, 0, FLOOR + 12 + k * 22, W, FLOOR + 12 + k * 22, 'rgba(40,20,10,.35)', 2);
      windowView(ctx, t); clock(ctx, t, 1640, 300);
      atmos(ctx, t, { alpha: .6 * (1 - dark), from: 120, bokeh: 2, dust: 26 });
      desk(ctx, t);
      // luz apagada: a sala escurece, sobra a luz da janela, do monitor e do neon
      if (dark > 0) { ctx.save(); ctx.globalAlpha = dark * .86; ctx.fillStyle = '#080A18'; ctx.fillRect(0, 0, W, H); ctx.restore(); glow(ctx, 200, 400, 300, '#5A6AA0', .25 * dark); }
      neonRoom(ctx, t);
      pipeline(ctx, t, dark);
      bubble(ctx, t);
      const swA = P(t, T_STRAT + .3, .5) * (1 - P(t, T_IMP, .6)); if (swA > 0) { ctx.save(); ctx.globalAlpha *= swA; lightSwitch(ctx, SW_X, 600, .8, sw, { label: sw > .5 ? 'luz acesa · trabalho manual' : 'lights-off' }); ctx.restore(); }
      const sb = P(t, T_STAMP, .4); if (sb > 0) stamp(ctx, 1000, 560, dget(CS(), 'business_results.headline', '') || 'Relatório automatizado', sb * (1 - P(t, T_IMP - .3, .3)), { theme: 'dark' });
      const ip = P(t, T_IMP, .5) * (1 - P(t, T_DIVE, .5)); if (ip > 0) { ctx.save(); ctx.globalAlpha *= ip;
        [['ANTES', 'montado à mão, relatório por relatório', C.red, 'doc'], ['DEPOIS', 'gerado sozinho, no formato do board', C.orange, 'check']].forEach(([h, l, c, ic], i) => {
          const x = i ? 1300 : 620, s = E.outBack(P(t, T_IMP + i * .4, .4)); ctx.save(); ctx.translate(x, 630); ctx.scale(s, s); ctx.rotate(i ? .02 : -.02);
          paper(ctx, -300, -80, 600, 160, { torn: true, seed: 50 + i, fill: '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3.5 });
          pill(ctx, -200, -50, h, { size: 20, fill: c, color: '#FFF', weight: 900 }); icon(ctx, ic, 230, 10, 70, c, 9);
          text(ctx, twoLines(l), -40, 20, { size: 28, weight: 800, color: INK, align: 'center', lh: 1.1 }); ctx.restore(); });
        if (t > T_Q) rich(ctx, 'Mas quem escreve os *insights*?', W / 2, 470, { size: 56, weight: 900, color: '#FFF', retro: true, alpha: P(t, T_Q, .5) * (1 - dive) });
        ctx.restore(); }
      joy(ctx, t, g); idea(ctx, t);
      if (!g.gone) { if (t < T_DROP) glow(ctx, g.x + 90, 560, 150, '#BFD8FF', .18 * (1 - dark));
        if (dark > 0) { glow(ctx, g.x, FLOOR - 240, 300, C.orange, .22 * dark); lightCone(ctx, g.x, 120, 80, 520, FLOOR - 120, '#FFB070', .5 * dark); }
        PEOPLE.draw(ctx, g.x, FLOOR + (g.y || 0), GS, g.pose, { dir: g.dir, t, phones: g.phones, mood: g.mood, dark: dark * .45 });
        if (t > PH[1] && t < T_UP) [[-70, 470], [70, 450]].forEach(([dx, yy], k) => { const d = (t * 1.5 + k * .5) % 1; vball(ctx, g.x + dx, yy + d * 50, 8 * (1 - d) + 2, '#9FD3F0', { rim: false, lw: 2 }); });
        if (t > T_DANCE) for (let k = 0; k < 3; k++) { const d = (t * .8 + k / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - d) * dark; text(ctx, k % 2 ? '♪' : '♫', g.x + (k - 1) * 60 + Math.sin(t * 3 + k) * 20, FLOOR - 480 - d * 160, { size: 46, weight: 900, color: C.yellow, align: 'center' }); ctx.restore(); } }
      if (dark > 0 && dark < 1) flash(ctx, 1 - dark, '#000000');
      ctx.restore();
      if (dive > .6) flash(ctx, (dive - .6) / .4, C.orange);
      CASEKIT.header(ctx, t, 'CASE 3 DE 4 · RELATÓRIOS', 'Lights-off · relatórios de fraude', { at: T0 - .2, seed: 11, out: T_DIVE, bg: t < T_DROP ? C.red : C.orange });
      CASEKIT.ruler(ctx, t, PH, LABELS, P(t, T0 - .2, .4) * (1 - dive));
      CASEKIT.interstitial(ctx, t, 3, '*Lights-off*', 'relatórios de fraude automáticos', '#F3EBDD');
      if (dark > 0) scanlines(ctx, .05 * dark);
    }
  };
})();

/* ---------- case 4 · Insight Agent (agentes de IA: insights em escala) ---------- */
(() => {
  const id = 'insight', bt = caseBars(id), CS = () => CASE('Insight Agent');
  const PH = [0, bt(4), bt(8), bt(16), bt(22)], LABELS = ['PROBLEMA', 'ESCALA', 'ESTRATÉGIA', 'SOLUÇÃO', 'IMPACTO'];
  const T_BAN = .2, T_STRAT = bt(8), T_GEN = bt(10), T_JUD = bt(12), T_REJ = bt(13), T_FIX = bt(13) + 1.1, T_SC = bt(14), T_OK = bt(15), T_DROP = bt(16), T_WALL2 = bt(20), T_IMP = bt(22), T_IMP2 = bt(25);
  const AX = [250, 480, 710], JX = 1010, FX_ = 1300, DX = 1620, AY = 540;
  const N_ACQ = dget(CS(), 'business_results.pipeline.acquirers', 30);
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T_BAN, 'impact', { size: .8 }); cue(id, 3.0, 'whoosh', { dur: .6, v: .3 }); cue(id, PH[1], 'buzz'); cue(id, T_STRAT, 'chime', { f: 784, up: 7 });
  cue(id, T_GEN, 'type', { n: 18, gap: .05 }); cue(id, T_REJ, 'buzz'); cue(id, T_FIX, 'type', { n: 10, gap: .05 }); cue(id, T_SC, 'shimmer', { dur: 1.5 }); cue(id, T_OK, 'ding');
  cue(id, T_OK + .4, 'riser', { dur: T_DROP - T_OK - .4, v: .25 }); cue(id, T_DROP, 'impact', { size: 1.2 }); for (let k = 0; k < 10; k++) cue(id, T_DROP + .4 + k * .25, 'pop', { p: 1 + k * .05, v: .1 });
  cue(id, T_WALL2, 'impact', { size: .9 }); cue(id, T_IMP, 'impact', { size: 1 });

  function banner(ctx, t) {
    CASEKIT.interstitial(ctx, t, 4, 'Um case de *agentes de IA*', 'que escala a geração de insights para milhares de páginas e painéis', C.yellow, 3.6, { kicker: 'CASE 4 DE 4 · INSIGHT AGENT' });
    const a = 0; if (a <= 0) return;
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
    const typed = 'Insights: o market share caiu no…'.slice(0, Math.floor(clamp((t - 4.5) / 4) * 22)); text(ctx, typed + (Math.floor(t * 3) % 2 ? '|' : ''), 260, 800, { size: 26, weight: 800, color: INK });
    pill(ctx, 610, 300, 'escrito à mão, página a página', { size: 22, fill: C.red, color: '#FFF', weight: 900, rot: -.03 });
    text(ctx, `${N_ACQ} adquirentes esperando`, 1450, 300, { size: 28, weight: 900, color: '#FFF', align: 'center' });
    for (let k = 0; k < N_ACQ; k++) { const x = 1240 + (k % 6) * 84, y = 380 + Math.floor(k / 6) * 92, p = E.outBack(P(t, 4 + k * .05, .3)); if (p <= 0) continue;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p); circle(ctx, 0, 0, 32, '#2E2620', rgba(C.orange, .6), 3); icon(ctx, 'store', 0, 0, 36, rgba('#FFFFFF', .7), 6); ctx.restore(); }
    ctx.restore();
  }
  /** a escala do problema: cada adquirente tem suas páginas e painéis, e todos precisam de insights */
  function scale(ctx, t) {
    const a = P(t, PH[1] - .1, .4) * (1 - P(t, PH[2] - .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const ct = t - PH[1], pile = Math.min(60, Math.floor(ct * 7));
    for (let k = 0; k < N_ACQ; k++) { const x = 230 + (k % 10) * 82, y = 360 + Math.floor(k / 10) * 92; vball(ctx, x, y, 30, k < 8 ? C.orange : '#3A2E26', { lw: 3, rim: false }); icon(ctx, 'store', x, y, 34, '#FFF', 6);
      const f = ((ct * .9 + k * .137) % 1), tx = lerp(x, 1390, f), ty = lerp(y, 640, f) - Math.sin(f * Math.PI) * 120; if (ct > .4) { ctx.save(); ctx.translate(tx, ty); ctx.rotate(f * 3 + k); paper(ctx, -16, -20, 32, 40, { r: 3, fill: k % 3 ? '#FFFDF8' : '#F6E2B8', shadow: 2, lw: 1.5, volume: false }); line(ctx, -9, -8, 8, -8, '#8A8378', 2); line(ctx, -9, 0, 4, 0, '#8A8378', 2); ctx.restore(); } }
    text(ctx, `${N_ACQ} adquirentes`, 640, 300, { size: 30, weight: 900, color: '#FFF', align: 'center' });
    text(ctx, 'cada um com suas páginas e painéis', 640, 680, { size: 26, weight: 800, color: '#F3E6D6', align: 'center' });
    for (let k = 0; k < pile; k++) { const x = 1310 + (k % 4) * 52 + (hash(k) - .5) * 14, y = 820 - Math.floor(k / 4) * 22; ctx.save(); ctx.translate(x, y); ctx.rotate((hash(k * 3) - .5) * .4); paper(ctx, -26, -14, 52, 28, { r: 3, fill: '#FFFDF8', shadow: 2, lw: 1.5, volume: false }); ctx.restore(); }
    agent(ctx, 1650, 760, 70, { role: 'analista', t, seed: 3, look: Math.sin(t * 7), squash: .12 * Math.sin(t * 14) });
    text(ctx, 'um analista escrevendo', 1650, 870, { size: 24, weight: 800, color: '#FFF', align: 'center' }); pill(ctx, 1650, 650, 'não dá conta!', { size: 22, fill: C.red, color: '#FFF', weight: 900, rot: .05, alpha: P(t, PH[1] + 3, .4) });
    ctx.restore();
  }
  function restriction(ctx, t) {
    const a = 0; if (a <= 0) return;
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
    text(ctx, 'CIRCUITO DE AGENTES', 140, 390, { size: 20, weight: 900, mono: true, color: C.yellow, ls: 4 });
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
    if (sp > 0) { ctx.save(); ctx.globalAlpha *= sp; holo(ctx, 560, 690, 800, 150, { title: 'NOTA DE QUALIDADE DO INSIGHT', color: C.orange });
      text(ctx, `${sol.algorithm || 'Random Forest'} com ${sol.nlp_features || '—'} features de NLP dá uma nota a cada insight`, 960, 745, { size: 24, weight: 800, color: '#FFE9D6', align: 'center' });
      const g = E.outCubic(P(t, T_SC + .4, 1.2)); rr(ctx, 620, 782, 520, 24, 12); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill(); rr(ctx, 620, 782, 520 * .82 * g, 24, 12); ctx.fillStyle = C.yellow; ctx.fill();
      text(ctx, g > .95 ? 'aprovado ✓' : 'avaliando…', 1170, 794, { size: 22, weight: 900, color: g > .95 ? C.yellow : '#BFB3A3' }); ctx.restore(); }
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
      [6.6, PH[1] - .2, 'Escritos à mão, um por um, os insights *não acompanhavam* o volume de páginas', 'PROBLEMA'],
      [PH[1] + .2, PH[2] - .2, `Cada um dos *${N_ACQ} adquirentes* tem suas páginas e painéis — e todos precisam de insights`, 'ESCALA'],
      [PH[2] + .2, T_GEN - .2, 'Nossa estratégia: um *time de agentes de IA* que escreve, julga e corrige os insights', 'ESTRATÉGIA'],
      [T_GEN + .1, T_JUD - .2, '1 · *Agentes geradores* escrevem insights com o olhar de analista, negócio e C-Level', 'COMO FIZEMOS'],
      [T_JUD + .1, T_FIX - .2, '2 · *Agentes julgadores*, com guardrails (Regex, BERT), checam cada insight', 'COMO FIZEMOS'],
      [T_FIX, T_SC - .2, '3 · Reprovou? *Agentes corretores* reescrevem até passar', 'COMO FIZEMOS'],
      [T_SC + .1, T_DROP - .2, '4 · Um *Random Forest* com features de NLP dá a nota de qualidade de cada insight', 'COMO FIZEMOS'],
      [T_DROP + .3, T_WALL2 - .2, 'Os agentes escalam a geração de insights para *milhares de páginas e painéis*', 'SOLUÇÃO'],
      [T_WALL2, T_IMP - .2, 'Cada insight passa por *geração, julgamento e correção* antes de ir para a página', 'SOLUÇÃO'],
      [T_IMP + .2, T_IMP2 - .2, `*${N_ACQ} adquirentes* no pipeline — e os novos chegam *sem crescer o time*`, 'IMPACTO'],
      [T_IMP2, 62.3, `${headlineFor(/clients \+ PoCs/i) || ''} clientes + PoCs e *projetos user-pay* já rodando`, 'IMPACTO']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#241508' });
      neonGrid(ctx, t, { horizon: 950, alpha: .35, speed: .5 + BT.level });
      problem(ctx, t); scale(ctx, t);
      CASEKIT.strategy(ctx, t, T_STRAT, T_GEN, 'Um *time de agentes de IA*', 'que escrevem, julgam e corrigem insights — em escala', { seed: 27 });
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
