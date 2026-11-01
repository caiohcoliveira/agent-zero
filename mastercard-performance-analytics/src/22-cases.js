/* ============================================================================
   22. PLAY 3 ("Technology" remontada) — estação 04: a abertura e os 4 cases
   ----------------------------------------------------------------------------
   v7: texto explica, animação revela, gráfico prova. Cada case (60 s; agentes, 69 s):
     PROBLEMA → DADOS → COMO FIZEMOS → SOLUÇÃO (drop da música) → RESULTADO → CONCLUSÃO
   etiqueta do case + etapa no topo, título fixo, explicação junto ao visual,
   rótulos nos gráficos e a base da comparação sempre escrita no mesmo quadro.
   Música (27 compassos de 2,22 s): calma 0–24,4 · construção 24,4–35,6 · cheia 35,6–60.
   ========================================================================== */
/** quebra de texto por largura (usa a fonte do texto) */
function wrapText(ctx, str, maxW, size, weight = 800) {
  ctx.save(); ctx.font = font(size, weight); const out = []; let cur = '';
  String(str).split(' ').forEach(w => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
  if (cur) out.push(cur); ctx.restore(); return out;
}
const headlineFor = re => { const h = (DATA.headline_numbers_for_slides || []).find(x => re.test(x.meaning || '')); return h ? FMT.headline(h) : null; };
const CASES = [['Cestas de produtos', 'Cliente Banana', C.yellow, 'cart'], ['Principalidade', 'Cliente Manga', C.orange, 'card'],
  ['Relatórios automatizados', 'relatórios de fraude', '#F3EBDD', 'doc'], ['Agentes de insights', 'Insight Agent', C.red, 'ai']];

const CASEKIT = {
  /** roteiro de tela do case: etiqueta + etapa + título fixo + explicações (steps: [t0, t1, ETAPA, explicação, opções]) */
  script(id, n, kicker, kcol, title, steps, extra = []) {
    const end = CONFIG.sceneById[id].dur + .2, r = [[2.3, end, 'kicker', kicker, { col: kcol, ink: kcol === C.yellow || kcol === '#F3EBDD' }], [2.4, end, 'title', title]];
    steps.forEach(([t0, t1, st, body, o]) => { r.push([t0, t1, 'step', st, { col: o && o.stepCol }]); if (body) r.push([t0 + .1, t1, 'body', body, { visual: true, ...(o || {}) }]); });
    return SAY.reg(id, r.concat(extra));
  },
  /** respiro entre cases: a porta do vagão com o número do case abre para o case (0 → d) */
  interstitial(ctx, t, n, name, topic, col, d = 2.4, o = {}) {
    if (t > d) return;
    const open = E.inOutCubic(P(t, d - .6, .6)), a = P(t, 0, .25);
    const half = side => { ctx.save(); ctx.translate(side * open * W / 2, 0); ctx.beginPath(); ctx.rect(side < 0 ? 0 : W / 2, 0, W / 2, H); ctx.clip();
      ctx.fillStyle = '#120E0B'; ctx.fillRect(0, 0, W, H); ctx.drawImage(TEX.dark, 0, 0); glow(ctx, W / 2, H / 2, 900, col, .22);
      rr(ctx, side < 0 ? W / 2 - 26 : W / 2, 0, 26, H, 0); ctx.fillStyle = '#0A0806'; ctx.fill();
      ctx.save(); ctx.globalAlpha = a; ctx.translate(W / 2, H / 2);
      pill(ctx, 0, -240, o.kicker || `CASE ${n} DE 4`, { size: 30, fill: C.red, color: '#FFF', weight: 900 });
      retroText(ctx, '0' + n, 0, -100, { size: 170, weight: 900, color: col, align: 'center', depth: 8, lw: 6 });
      rich(ctx, name, 0, 50, { size: 92, weight: 900, color: '#FFF', accent: col, retro: true, depth: 5, lw: 4 });
      text(ctx, topic, 0, 140, { size: 40, weight: 800, color: '#F3E6D6', align: 'center' });
      for (let k = 1; k <= 4; k++) { const x = (k - 2.5) * 180; if (k < 4) line(ctx, x, 250, x + 180, 250, k < n ? col : 'rgba(255,255,255,.25)', 8); circle(ctx, x, 250, k === n ? 22 : 15, k === n ? col : k < n ? '#F3EBDD' : '#3A322B', INK, 4); }
      ctx.restore(); ctx.restore(); };
    half(-1); half(1);
  },
  /** ficha de dado: número grande + rótulo (texto nítido) */
  tile(ctx, x, y, w, h, big, label, p, o = {}) {
    if (p <= 0) return; const s = E.outBack(p);
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
    paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: o.seed || 1, fill: o.fill || '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3.5 });
    if (o.icon) icon(ctx, o.icon, -w / 2 + 52, -h / 2 + 50, 50, o.col || C.orange, 7);
    late(ctx, c => { const bs = Math.min(o.size || 76, (w - 40) / Math.max(1, measure(c, big, 76, 900)) * 76);
      retroText(c, big, 0, -h * .1, { size: bs, weight: 900, color: o.col || C.orange, align: 'center', depth: 4, lw: 3 });
      para(c, label, 0, h * .16, w - 36, { size: 28, weight: 800, color: '#3A332C', align: 'center', lh: 1.1 }); });
    ctx.restore();
  },
  /** número-manchete com respingo (nítido) */
  headline(ctx, p, x, y, str, label, o = {}) {
    if (p <= 0) return;
    late(ctx, c => { const s = lerp(2.1, 1, E.outExpo(clamp(p))), size = o.size || 150; c.translate(x, y); c.rotate(o.rot || -.03); c.scale(s, s); c.globalAlpha *= clamp(p * 3);
      splat(c, 0, -10, size * .85, o.col || C.orange, o.seed || 5, 1, .95);
      retroText(c, str, 0, 0, { size, weight: 900, color: '#FFF', align: 'center', depth: 8, lw: 6 });
      if (label) para(c, label, 0, size * .62, 620, { size: 30, weight: 800, color: '#FFF', align: 'center' }); });
  }
};

/* ---------- abertura da 04: analytics em ação · os 4 cases ---------- */
(() => {
  const id = 's04', PATH = [[150, 640], [560, 600], [960, 650], [1360, 600], [1780, 640]], U = [.12, .37, .63, .88];
  const T_T = 1.1, T_LINE = 4.0;
  cue(id, T_T, 'impact', { size: .7 }); U.forEach((u, i) => cue(id, T_LINE + u * 3.4, 'ping', { f: 659 * Math.pow(2, i * 3 / 12) })); cue(id, 9.9, 'whoosh', { dur: 1, v: .3 });
  const SCRIPT = SAY.reg(id, [[T_LINE + 3.6, 11.3, 'note', 'Do *problema* ao *resultado*.', { y: 860, size: 44, weight: 900 }]]);
  SAY.reg(id, CASES.map((c, i) => [T_LINE + U[i] * 3.4, 11.3, 'label', c[0]]));
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT, peaks: [[T_T - .1, T_T + .9, .6]],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .95, center: '#3A2210' });
      skyline(ctx, t, { y: 980, h: 320, seed: 55, col: '#1C1216', lit: .45 });
      const tp = P(t, T_T, .6);
      if (tp > 0) { ctx.save(); ctx.translate(W / 2, 330); const s = lerp(1.6, 1, E.outExpo(tp)); ctx.scale(s, s); paintTitle(ctx, 'ANALYTICS EM AÇÃO', 0, 0, { size: 110, bg: C.orange, seed: 21, p: tp }); ctx.restore(); }
      const lp = E.inOutSine(P(t, T_LINE, 3.4)), run = E.inCubic(P(t, 9.6, 1.6));
      LINE.draw(ctx, PATH.concat(run > 0 ? [[2400, 640]] : []), run > 0 ? lerp(.82, 1, run) : lp * .999, { w: 22, head: true, glow: 14 });
      CASES.forEach(([name, sub, col, ic], i) => { const k = clamp((lp - U[i]) * 10 + .3); if (k <= 0) return; const [x, y] = LINE.at(PATH, U[i]), s = E.outBack(clamp(k));
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(ctx, 0, 0, 120, col, .35); circle(ctx, 0, 0, 46, col, INK, 6); icon(ctx, ic === 'cart' ? 'basket' : ic, 0, 0, 52, col === C.yellow || col === '#F3EBDD' ? INK : '#FFF', 7); ctx.restore();
        hud(ctx, c => { c.globalAlpha *= clamp(k * 1.5); c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12;
          text(c, `CASE ${i + 1}`, x, y - 84, { size: 22, weight: 800, mono: true, color: col, align: 'center', ls: 3 });
          para(c, name, x, y + 64, 360, { size: 36, weight: 900, color: '#FFF', align: 'center', lh: 1.05 });
          text(c, sub, x, y + 150, { size: 26, weight: 700, color: '#E9DCC8', align: 'center' }); }); });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- case 1 · Cestas de produtos (Cliente Banana) ---------- */
(() => {
  const id = 'banana', CS = () => CASE('Cliente Banana'), bt = k => k * 2.2222;
  const T0 = 2.4, T_DATA = 12.6, T_HOW = bt(11), T_BM = T_HOW + 2.2, T_ALS = T_HOW + 3.6, T_COS = bt(15), T_DROP = bt(16), T_RES = 47.6, T_CONC = 56;
  const ms = () => dget(CS(), 'analytics_solution.model_scale', {}), STORES = [['Cliente Banana', C.yellow], ['Cliente Maçã', C.red], ['Cliente Pera', C.orange]];
  const BASK = (dget(CS(), 'analytics_solution.baskets', null) || ['Café + chocolate', 'Churrasco', 'Destilados']).slice(0, 3), BICON = [['cup', 'box'], ['can', 'carton'], ['bottle', 'jar']];
  const MONTHS = (String(dget(CS(), 'analytics_solution.lookback', '')).match(/(\d+)\s*meses/) || [])[1] || '24';
  const CONV = Object.entries(dget(CS(), 'business_results.conversion_by_mechanic', {})).map(([k, v]) => [k, parseFloat(v) || 0]).sort((a, b) => b[1] - a[1]);
  const BEST = CONV.length ? CONV[0] : ['Destilados (cesta)', 1], SECOND = CONV.length > 1 ? CONV[1] : ['2ª melhor', 1];
  const LIFT = (() => { const h = String(dget(CS(), 'business_results.headline', '')); const m = h.match(/([+-]?\d+(?:\.\d+)?)\s*relative/i); return m ? parseFloat(m[1]) : (BEST[1] && SECOND[1] ? BEST[1] / SECOND[1] - 1 : .1875); })();
  const IDX = 100 * (1 + LIFT), BEST_NAME = BEST[0].replace(/\s*\(cesta\)/i, '');
  const SPARSE = (() => { const m = ms(), c = parseFloat(m.customers_modeled) * 1e6, s = +m.sku_subgroups, it = parseFloat(m.interactions) * 1e6; return c && s && it ? 1 - it / (c * s) : .95; })();
  const R = rng(5), ROWS = 10, COLS = 18, CELLS = Array.from({ length: ROWS * COLS }, () => R());
  const PR = Array.from({ length: 36 }, (_, i) => ({ b: i % 3, sx: R() * 2 - 1, sy: R() * 2 - 1, ox: (R() - .5) * .5, oy: (R() - .5) * .5 }));
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 });
  for (let k = 0; k < 10; k++) cue(id, T_DATA + .4 + k * .32, 'tick', {}); [0, 1, 2, 3].forEach(i => cue(id, T_DATA + 2.4 + i * .9, 'pop', { p: .9 + i * .1, v: .18 }));
  cue(id, T_HOW, 'chime', { f: 784, up: 7 }); cue(id, T_HOW + .4, 'shimmer', { dur: 1.5 }); for (let k = 0; k < 8; k++) cue(id, T_ALS + .3 + k * .55, 'tick', {});
  cue(id, T_COS, 'shimmer', { dur: 1.5 }); cue(id, T_COS + .2, 'riser', { dur: T_DROP - T_COS - .2, v: .25 }); cue(id, T_DROP, 'impact', { size: 1.1 }); cue(id, T_RES, 'impact', { size: .8 }); cue(id, T_RES + .6, 'ding');
  const SCRIPT = CASEKIT.script(id, 1, 'CASE 1 DE 4 · CLIENTE BANANA · VAREJO', C.yellow, 'Cestas de produtos', [
    [T0, T_DATA, 'PROBLEMA', 'Como incentivar clientes a comprar em *outras empresas do mesmo grupo*?', { y: 250 }],
    [T_DATA, T_HOW, 'DADOS', 'Analisamos o *histórico de compras* para aprender afinidades entre clientes e produtos.', { y: 250 }],
    [T_HOW, T_DROP, 'COMO FIZEMOS', '*BM25* reduz o destaque de itens muito comuns. *ALS* aprende padrões entre clientes e produtos.', { y: 236 }],
    [T_DROP, T_RES, 'SOLUÇÃO', 'Produtos com afinidade formam *cestas*. O modelo prioriza os clientes com maior *potencial de compra*.', { y: 236 }],
    [T_RES, 60.2, 'RESULTADO', `*${BEST_NAME}* teve conversão *${FMT.rel(LIFT)} maior* que a segunda melhor campanha.`, { y: 250 }]
  ], [[T_CONC, 60.2, 'concl', 'O histórico de compras orienta *cestas* e *públicos*.']]);

  /** as três empresas do grupo e um cliente que hoje compra só em uma */
  function stores(ctx, t) {
    const a = P(t, T0, .5) * (1 - P(t, T_DATA + 1.4, .6)); if (a <= 0) return;
    const sl = E.inOutCubic(P(t, T_DATA - .2, 1.2)), GYs = 820;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(-260 * sl, 60 * sl); ctx.scale(1 - .25 * sl, 1 - .25 * sl);
    line(ctx, 0, GYs, 1200, GYs, INK, 6);
    STORES.forEach(([nm, col], i) => { const x = 250 + i * 330, p = E.outBack(P(t, T0 + .3 + i * .3, .5)); if (p <= 0) return;
      ctx.save(); ctx.translate(x, GYs); ctx.scale(1, p);
      vslab(ctx, -130, -250, 260, 250, 34, mix('#3A2A24', col, .35), { lw: 4 });
      for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-140 + k * 47, -200); ctx.lineTo(-117 + k * 47, -168); ctx.lineTo(-94 + k * 47, -200); ctx.closePath(); ctx.fillStyle = k % 2 ? col : '#F6EEDF'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke(); }
      rr(ctx, -100, -140, 90, 140, 6); ctx.fillStyle = '#2A1E18'; ctx.fill(); rr(ctx, 10, -140, 90, 80, 6); ctx.fillStyle = rgba('#FFD08A', .85); ctx.fill();
      ctx.restore();
      late(ctx, c => { c.globalAlpha *= clamp(p); c.translate(x, GYs - 300); const w = measure(c, nm, 28, 900) + 40; rr(c, -w / 2, -24, w, 48, 10); c.fillStyle = col; c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
        text(c, nm, 0, 1, { size: 28, weight: 900, color: col === C.yellow ? INK : '#FFF', align: 'center' }); }); });
    // o cliente: compra só na primeira empresa (recibos saindo dela)
    const cx = 250 + 30 * Math.sin(t * 1.4), cp = P(t, T0 + 1.4, .5);
    if (cp > 0) { ctx.save(); ctx.globalAlpha *= cp; vball(ctx, cx, GYs + 70, 34, '#F6EEDF', { lw: 4 }); icon(ctx, 'user', cx, GYs + 72, 40, INK, 7); icon(ctx, 'bag', cx + 52, GYs + 86, 34, C.yellow, 6);
      for (let k = 0; k < 3; k++) { const d = (t * .7 + k / 3) % 1; ctx.save(); ctx.globalAlpha *= 1 - d; ctx.translate(250 + 10, GYs - 60 - d * 110); ctx.rotate(d); paper(ctx, -14, -18, 28, 36, { r: 2, fill: '#FFF', shadow: 2, lw: 1.5, volume: false }); ctx.restore(); }
      [1, 2].forEach(i => { ctx.save(); ctx.setLineDash([10, 10]); line(ctx, cx + 40, GYs + 40, 250 + i * 330, GYs - 40, rgba('#FFFFFF', .35), 3); ctx.restore(); late(ctx, c => text(c, '?', 250 + i * 330 + 70, GYs - 60, { size: 54, weight: 900, color: C.yellow, align: 'center', alpha: .7 + .3 * Math.sin(t * 3 + i) })); });
      ctx.restore();
      late(ctx, c => { c.globalAlpha *= cp; text(c, 'hoje: compra em uma empresa só', 580, GYs + 150, { size: 28, weight: 800, color: '#F6EEDF', align: 'center' }); }); }
    ctx.restore();
  }
  /** os dados: recibos viram fichas com os números do JSON */
  function data(ctx, t) {
    const a = P(t, T_DATA, .5) * (1 - P(t, T_HOW - .3, .5)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    // recibos voando para o "scanner"
    for (let k = 0; k < 10; k++) { const d = clamp((t - T_DATA - k * .32) / 1.1); if (d <= 0 || d >= 1) continue; const x = lerp(60, 470, E.inOutSine(d)), y = lerp(900, 640, d) - Math.sin(d * Math.PI) * 160;
      ctx.save(); ctx.translate(x, y); ctx.rotate(d * 4 + k); paper(ctx, -18, -24, 36, 48, { r: 3, fill: '#FFFDF8', shadow: 2, lw: 1.5, volume: false }); line(ctx, -10, -10, 10, -10, '#8A8378', 2); line(ctx, -10, 0, 6, 0, '#8A8378', 2); ctx.restore(); }
    vslab(ctx, 420, 600, 150, 110, 26, '#3A3640', { lw: 4 }); glow(ctx, 495, 600, 90, C.orange, .4 + .3 * Math.sin(t * 8)); line(ctx, 430, 600 + 50 * ((t * 2) % 1), 560, 600 + 50 * ((t * 2) % 1), C.orange, 3);
    const m = ms(), TL = [[`${MONTHS} meses`, 'de compras por cliente e produto', 'clock'], [FMT.mm(m.customers_modeled), 'clientes', 'user'], [FMT.num(m.sku_subgroups || 0, 0), 'subgrupos de produtos', 'grid'], [FMT.mm(m.interactions), 'interações (compras)', 'basket']];
    TL.forEach(([big, l, ic], i) => CASEKIT.tile(ctx, 790 + (i % 2) * 380, 560 + Math.floor(i / 2) * 260, 350, 230, big, l, P(t, T_DATA + 2.4 + i * .9, .5), { seed: 10 + i, rot: [-.02, .015, .01, -.015][i], icon: ic }));
    ctx.restore();
  }
  /** matriz cliente × produto: compras observadas × scores estimados; BM25; ALS com o erro caindo */
  function matrix(ctx, t) {
    const a = P(t, T_HOW, .6) * (1 - P(t, T_COS - .3, .45)); if (a <= 0) return;
    const cs = 34, K = 3, RX = 300, RY = 520, rw = COLS * cs, rh = ROWS * cs, UX = RX - 26 - K * cs, VY = RY - 22 - K * cs;
    const mp = P(t, T_HOW, 1.4), bm = P(t, T_BM, .8), ap = P(t, T_ALS, .5), it = clamp((t - T_ALS - .3) / (T_COS - .6 - T_ALS)) * 4, ph = Math.floor(it * 2) % 2;
    ctx.save(); ctx.globalAlpha *= a;
    paper(ctx, RX - 16, RY - 16, rw + 32, rh + 32, { r: 10, fill: 'rgba(20,16,13,.92)', outline: '#F3EBDD', lw: 2, shadow: 8, shadowColor: '#000', volume: false });
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const v = CELLS[r * COLS + c], known = v < .16 || (c < 2 && v < .85), low = c < 2, x = RX + c * cs, y = RY + r * cs, appear = clamp(mp * 1.6 - (c + r) / 30);
      if (appear <= 0) continue;
      if (known) { circle(ctx, x + cs / 2, y + cs / 2, 9, rgba(low ? '#8A8378' : C.orange, appear * (low ? 1 - .7 * bm : 1))); continue; }
      ctx.strokeStyle = rgba('#FFFFFF', .08 * appear); ctx.lineWidth = 1; ctx.strokeRect(x + 3, y + 3, cs - 6, cs - 6);
      const f = clamp(it / 4 * 1.35 - hash(r * 31 + c * 7) * .35); if (f > 0) { const pv = hash(r * 7 + c * 13); rr(ctx, x + 6, y + 6, cs - 12, cs - 12, 4); ctx.fillStyle = rgba(mix('#5A3A22', C.yellow, pv), .85 * f); ctx.fill(); }
    }
    late(ctx, c => { c.globalAlpha *= mp; text(c, 'clientes × produtos', RX + rw / 2, RY + rh + 44, { size: 28, weight: 900, color: '#F3EBDD', align: 'center' });
      // legenda: o que é dado observado e o que é estimativa
      const ly = RY + rh + 96; circle(c, RX + 10, ly, 10, C.orange); text(c, 'compra observada', RX + 30, ly, { size: 26, weight: 800, color: '#FFF' });
      rr(c, RX + 290, ly - 11, 22, 22, 4); c.fillStyle = C.yellow; c.fill(); text(c, 'score estimado pelo modelo', RX + 324, ly, { size: 26, weight: 800, color: '#FFF', alpha: clamp(it) });
      c.globalAlpha *= 1; text(c, `${FMT.num(SPARSE * 100, 1)}% das combinações sem compra`, RX, RY - 34 - (ap > 0 ? K * cs + 24 : 0), { size: 26, weight: 800, color: '#FFB0A0', alpha: 1 - clamp(it / 2) }); });
    if (bm > 0) { ctx.save(); ctx.globalAlpha *= bm * (1 - ap * .6); rr(ctx, RX - 6, RY - 8, cs * 2 + 12, rh + 16, 8); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
      late(ctx, c => { c.globalAlpha *= bm * (1 - P(t, T_ALS + 1.4, .5)); tag(c, RX + 170, RY - 40, 'itens muito comuns (sacola, pão): peso menor', { size: 24, fill: C.red, color: '#FFF' }); line(c, RX + cs, RY - 18, RX + cs, RY - 6, C.red, 4); }); }
    if (ap > 0) { ctx.save(); ctx.globalAlpha *= ap;
      const cell = (x, y, seed, hot) => { const v = hash(seed + Math.floor(it * 2) * 3.1), col = mix('#7A3A12', C.orange, v); rr(ctx, x + 4, y + 4, cs - 8, cs - 8, 4); ctx.fillStyle = hot ? mix(col, '#FFF1D6', .25 + .25 * Math.sin(t * 12 + seed)) : col; ctx.fill(); };
      for (let r = 0; r < ROWS; r++) for (let k = 0; k < K; k++) cell(UX + k * cs, RY + r * cs, r * 9 + k, ph === 0);
      for (let c = 0; c < COLS; c++) for (let k = 0; k < K; k++) cell(RX + c * cs, VY + k * cs, c * 5 + k + 300, ph === 1);
      inkRect(ctx, UX - 2, RY - 2, K * cs + 4, rh + 4, 6, ph === 0 ? 5 : 3, 4, ph === 0 ? C.yellow : '#F3EBDD'); inkRect(ctx, RX - 2, VY - 2, rw + 4, K * cs + 4, 6, ph === 1 ? 5 : 3, 5, ph === 1 ? C.yellow : '#F3EBDD');
      late(ctx, c => { text(c, 'clientes', UX + K * cs / 2, RY + rh + 44, { size: 24, weight: 800, color: '#F3EBDD', align: 'center' }); text(c, 'produtos', RX + rw + 14, VY + K * cs / 2, { size: 24, weight: 800, color: '#F3EBDD' }); });
      // painel do erro de reconstrução (ilustrativo)
      const ex = 1110, ey = 560, ew = 600, eh = 220, err = i => .85 * Math.exp(-1.15 * i) + .1;
      holo(ctx, ex - 50, ey - 80, ew + 100, eh + 200, { color: C.orange });
      line(ctx, ex, ey + eh, ex + ew, ey + eh, rgba('#FFFFFF', .35), 2); line(ctx, ex, ey, ex, ey + eh, rgba('#FFFFFF', .35), 2);
      ctx.beginPath(); for (let s = 0; s <= 60; s++) { const i = s / 60 * it, x = ex + i / 4 * ew, y = ey + eh - err(i) / .95 * eh; s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.stroke();
      for (let i = 0; i <= Math.floor(it); i++) circle(ctx, ex + i / 4 * ew, ey + eh - err(i) / .95 * eh, 8, C.orange, INK, 2.5);
      late(ctx, c => { text(c, 'erro de reconstrução', ex, ey - 40, { size: 28, weight: 900, color: '#FFF' }); text(c, '(ilustrativo)', ex + 300, ey - 40, { size: 24, weight: 700, color: '#E9DCC8' });
        text(c, 'iterações →', ex + ew, ey + eh + 34, { size: 24, weight: 700, color: '#E9DCC8', align: 'right' });
        text(c, it >= 4 ? 'convergiu ✓' : ph === 0 ? 'ajusta clientes' : 'ajusta produtos', ex + ew / 2, ey + eh + 84, { size: 32, weight: 900, color: it >= 4 ? C.yellow : C.orange, align: 'center' }); });
      ctx.restore(); }
    ctx.restore();
  }
  /** cosseno: produtos parecidos se aproximam e formam as 3 cestas */
  function cosine(ctx, t) {
    const p = P(t, T_COS, .5), g = E.inOutCubic(P(t, T_COS + .2, 1.6)), out = P(t, T_DROP - .2, .3); if (p <= 0 || out >= 1) return;
    const cx = W / 2, cy = 640, CEN = [[-.62, .1], [0, -.2], [.62, .1]], col = [C.yellow, C.orange, C.red];
    ctx.save(); ctx.globalAlpha *= p * (1 - out);
    holo(ctx, cx - 660, cy - 250, 1320, 500, { color: C.orange });
    PR.forEach(q => { const tx = CEN[q.b][0] + q.ox * .5, ty = CEN[q.b][1] + q.oy * .6, x = cx + lerp(q.sx, tx, g) * 560, y = cy + lerp(q.sy * .7, ty, g) * 360; vball(ctx, x, y, 11, g > .5 ? col[q.b] : '#BFB3A3', { lw: 2, rim: false }); });
    late(ctx, c => { c.globalAlpha *= p; text(c, 'similaridade de cosseno: produtos parecidos se aproximam', cx, cy - 210, { size: 28, weight: 900, color: '#FFF', align: 'center' }); });
    ctx.restore();
  }
  /** a solução: afinidades → cestas → públicos → campanhas; cada cesta encontra o seu público */
  function solution(ctx, t) {
    const p0 = P(t, T_DROP, .4), out = P(t, T_RES - .3, .4); if (p0 <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    flowRow(ctx, 110, 300, 1130, [{ label: 'afinidades', icon: 'nodes' }, { label: 'cestas', icon: 'basket' }, { label: 'públicos', icon: 'user' }, { label: 'campanhas', icon: 'spark' }], E.inOutSine(P(t, T_DROP + .2, 2.2)), { bw: 210, bh: 130 });
    const tgt = ms().target_customers_mechanic_b;
    BASK.forEach((name, i) => {
      const p = E.outBack(P(t, T_DROP + 1.2 + i * .35, .45)); if (p <= 0) return;
      const x = 230 + i * 400, y = 600 + Math.sin(t * 2 + i) * 4;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.rotate([-.04, .03, -.02][i]);
      paper(ctx, -140, -100, 280, 220, { r: 18, fill: [C.yellow, C.orange, C.red][i], shadow: 10, shadowColor: '#000', lw: 4, halftone: .16 });
      ctx.beginPath(); ctx.arc(0, -100, 64, Math.PI, 0); ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = '#F6EEDF'; ctx.lineWidth = 8; ctx.stroke();
      BICON[i].forEach((ic, j) => { vball(ctx, -52 + j * 104, -10, 44, '#FFF8EE', { lw: 3 }); icon(ctx, ic, -52 + j * 104, -10, 52, INK, 9); });
      late(ctx, c => text(c, name, 0, 76, { size: 30, weight: 900, color: i === 0 ? INK : '#FFF', align: 'center' }));
      ctx.restore();
      const cp = P(t, T_DROP + 2.4 + i * .3, .5); if (cp > 0) { ctx.save(); ctx.globalAlpha *= cp;
        for (let k = 0; k < 5; k++) { const ux = x - 112 + k * 56, uy = 800; vball(ctx, ux, uy, 24, k < 3 ? '#F6EEDF' : '#8A8378', { lw: 3, rim: false }); icon(ctx, 'user', ux, uy + 2, 28, INK, 7); }
        ctx.restore(); late(ctx, c => { c.globalAlpha *= cp; text(c, 'público com maior potencial', x, 856, { size: 24, weight: 800, color: '#F6EEDF', align: 'center' }); }); }
    });
    const dp = P(t, T_DROP + 4.2, .5); if (dp > 0) hud(ctx, c => { c.globalAlpha *= dp; c.translate(1560, 740); c.rotate(-.015);
      paper(c, -300, -100, 600, 200, { torn: true, seed: 33, fill: '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3.5, tape: [[.5, 0, .05]] });
      tag(c, -170, -64, 'DECISÃO', { size: 22, fill: C.red, color: '#FFF' });
      para(c, `As cestas viraram *mecânicas de campanha* nos testes da Mesa de Performance${tgt ? ` (mecânica B: ${FMT.num(tgt, 0)} clientes)` : ''}.`, -270, -30, 540, { size: 28, weight: 800, color: INK, accent: C.red }); });
    ctx.restore();
  }
  /** o resultado: índice com base explícita (2ª melhor = 100) */
  function result(ctx, t) {
    const p = P(t, T_RES, .5); if (p <= 0) return;
    const B0 = 830, HMAX = 470, X = [470, 900], vals = [100, IDX], max = Math.max(...vals) * 1.08, lab = ['2ª melhor campanha', `${BEST_NAME} (cesta)`];
    ctx.save(); ctx.globalAlpha *= p;
    line(ctx, 250, B0, 1150, B0, '#F3E6D6', 4);
    const y100 = B0 - 100 / max * HMAX; line(ctx, 250, y100, 1150, y100, rgba('#F3E6D6', .5), 3, [12, 10]);
    vals.forEach((v, i) => { const bp = E.outCubic(P(t, T_RES + .2 + i * .35, .7)), h = v / max * HMAX * bp, x = X[i] - 110;
      vslab(ctx, x, B0 - h, 220, h, 34, i ? C.orange : '#8A8378', { lw: 4 }); if (i) glow(ctx, X[i], B0 - h / 2, 260, C.orange, .25 * bp);
      late(ctx, c => { c.globalAlpha *= clamp(bp * 2); retroText(c, FMT.num(v, 1), X[i] + 10, B0 - h - 50, { size: 64, weight: 900, color: i ? C.yellow : '#FFF', align: 'center', depth: 4, lw: 3 });
        text(c, lab[i], X[i] + 10, B0 + 40, { size: 30, weight: 900, color: '#FFF', align: 'center' }); }); });
    late(ctx, c => { text(c, 'base = 100', 1160, y100 - 22, { size: 24, weight: 800, color: '#E9DCC8', align: 'right' });
      text(c, 'índice de conversão: 2ª melhor campanha = 100 (não é taxa absoluta)', 250, B0 + 104, { size: 26, weight: 700, color: '#E9DCC8' }); });
    const hp = P(t, T_RES + 1.1, .4); CASEKIT.headline(ctx, hp, 1510, 640, FMT.rel(LIFT), 'em conversão vs. a 2ª melhor campanha', { size: 150, col: C.orange, seed: 9 });
    ctx.restore();
  }
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT,
    peaks: [[T_DROP - .1, T_DROP + 2, 1], [T_RES - .1, T_RES + 1.4, .7]],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#2E1C10' });
      skyline(ctx, t, { y: 1000, h: 300, seed: 61, col: '#1A1216', lit: .35, alpha: .8 });
      stores(ctx, t); data(ctx, t); matrix(ctx, t); cosine(ctx, t); solution(ctx, t); result(ctx, t);
      CASEKIT.interstitial(ctx, t, 1, '*Cestas de produtos*', 'Cliente Banana · varejo', C.yellow);
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- case 2 · Principalidade (Cliente Manga) ---------- */
(() => {
  const id = 'manga', CS = () => CASE('Cliente Manga'), bt = k => k * 2.2222;
  const T0 = 2.4, T_DATA = 12.6, T_HOW = bt(11), T_KM = T_HOW + 1.8, T_ALS = T_HOW + 4.4, T_EMB = T_HOW + 6.1, T_DROP = bt(16), T_RES = 46.8, T_CONC = 55.6;
  const CL = 8, R = rng(23), CEN = Array.from({ length: CL }, (_, k) => [Math.cos(k / CL * TAU + .3) * (.55 + .2 * (k % 2)), Math.sin(k / CL * TAU + .3) * (.5 + .15 * (k % 3 === 0))]);
  const PTS = Array.from({ length: 200 }, (_, i) => { const c = i % CL, g = () => (R() + R() + R() - 1.5) * .18; return { c, sx: R() * 2 - 1, sy: R() * 2 - 1, x: CEN[c][0] + g(), y: CEN[c][1] + g() }; });
  const C3 = Array.from({ length: CL }, (_, k) => [Math.cos(k / CL * TAU) * .62, (k % 2 ? .38 : -.34) + (k % 3 === 0 ? .12 : 0), Math.sin(k / CL * TAU) * .62]);
  const P3 = Array.from({ length: 170 }, (_, i) => { const c = i % CL, g = () => (R() + R() + R() - 1.5) * .16; return { c, x: C3[c][0] + g(), y: C3[c][1] + g(), z: C3[c][2] + g() }; });
  const CCOL = [C.red, C.orange, C.yellow, '#FF8A5C', '#E94F64', '#FFC56E', '#FF6A2A', '#F2B04A'];
  const PROD = ['Cartão de crédito', 'Investimentos', 'Seguro de vida', 'Consórcio', 'Previdência'], ORDER = [2, 0, 4, 1, 3];
  const PV3 = [[-.25, -.7, .3], [.75, -.2, -.3], [.45, .55, .55], [-.75, .3, -.4], [.05, .7, -.65]];
  const POPN = FMT.mm(String(dget(CS(), 'analytics_solution.population', '0.092MM')).split(' ')[0]), SUBS = Object.entries(dget(CS(), 'business_results.by_subsegment', {}));
  const HL = FMT.auto(dget(CS(), 'business_results.top3.incremental_gain', '') || '+4 p.p.');
  const HLN = parseFloat(String(HL).replace(',', '.').replace(/[^\d.+-]/g, '')) || 4;
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 }); cue(id, T0 + 2.4, 'ding');
  [0, 1, 2, 3].forEach(i => cue(id, T_DATA + 1.6 + i * .8, 'pop', { p: .9 + i * .1, v: .18 })); cue(id, T_HOW, 'chime', { f: 784, up: 7 }); cue(id, T_HOW + .3, 'shimmer', { dur: 2 });
  for (let k = 0; k < CL; k++) cue(id, T_KM + k * .2, 'ping', { f: 988 * Math.pow(2, (k % 5) * 2 / 12) }); cue(id, T_EMB, 'shimmer', { dur: 2.5 }); cue(id, bt(15), 'riser', { dur: T_DROP - bt(15), v: .25 });
  cue(id, T_DROP, 'impact', { size: 1 }); cue(id, T_DROP + .5, 'stab', { i: 2 }); cue(id, T_RES, 'impact', { size: .9 }); cue(id, T_RES + .5, 'ding');
  const SCRIPT = CASEKIT.script(id, 2, 'CASE 2 DE 4 · CLIENTE MANGA · EMISSOR', C.orange, 'Principalidade', [
    [T0, T_DATA, 'OBJETIVO', '*Principalidade* é tornar o banco a *principal escolha* do cliente.', { y: 250 }],
    [T_DATA, T_HOW, 'DADOS', `Analisamos *${POPN} associados*, seus produtos e sua principalidade atual.`, { y: 250 }],
    [T_HOW, T_DROP, 'COMO FIZEMOS', '*UMAP* e *K-Means* organizam perfis. *ALS* estima afinidades entre associados e produtos.', { y: 236 }],
    [T_DROP, T_RES, 'SOLUÇÃO', 'A recomendação combina *afinidade*, *conversão* e potencial de ganho de *principalidade*.', { y: 236 }],
    [T_RES, 60.2, 'RESULTADO', `*${HL} de principalidade* versus controle, em backtest.`, { y: 250 }]
  ], [[T0 + 2.2, T_DATA, 'note', 'Quais produtos ajudam a *fortalecer esse relacionamento*?', { x: 1510, y: 520, w: 620, size: 34, weight: 900 }],
    [T_RES + .9, 60.2, 'note', 'backtest: avaliação retrospectiva com dados históricos · ganho teórico · Top 3', { x: 1500, y: 690, w: 600, size: 28 }],
    [T_CONC, 60.2, 'concl', 'O motor prioriza produtos pelo *objetivo de relacionamento* do banco.']]);
  function wallet(ctx, t) {
    const a = P(t, T0, .5) * (1 - P(t, T_DATA - .3, .5)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(700, 790); ctx.rotate(-.04);
    const up = E.outBack(P(t, T0 + 1.4, .7));
    [[C.red, -.5, -70, 'outro banco'], [C.yellow, -.15, -30, 'outro banco'], [C.orange, .2, 10, 'o banco']].forEach(([c, r, dx, l], i) => { ctx.save(); ctx.rotate(r * .3); ctx.translate(dx, -130 - i * 8 - (i === 2 ? up * 120 : 0));
      vslab(ctx, -170, -105, 340, 210, 16, c, { lw: 4 }); rr(ctx, -120, -50, 64, 48, 6); ctx.fillStyle = '#F3D9A0'; ctx.fill();
      late(ctx, cc => text(cc, l, 0, 50, { size: 28, weight: 900, color: i === 1 ? INK : '#FFF', align: 'center' })); ctx.restore(); });
    vslab(ctx, -260, -40, 520, 240, 28, '#5A3A22', { lw: 5 });
    late(ctx, c => text(c, 'a carteira do cliente', 0, 100, { size: 30, weight: 800, color: '#F3E6D6', align: 'center' }));
    const cp = P(t, T0 + 2.0, .5); if (cp > 0) { scribble(ctx, 'crown', 40, -420, 120, C.yellow, 4, cp, { glow: true }); late(ctx, c => { c.globalAlpha *= cp; tag(c, 230, -420, 'o banco principal', { size: 30, fill: C.yellow }); }); }
    ctx.restore();
  }
  function data(ctx, t) {
    const a = P(t, T_DATA, .5) * (1 - P(t, T_HOW - .3, .5)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const TL = [[POPN, 'associados pessoa física', 'user'], [String(SUBS.length || 4), `subsegmentos (${SUBS.length ? SUBS[0][0] + ' a ' + SUBS[SUBS.length - 1][0] : 'PF I a IV+'})`, 'grid'], ['produtos', 'que cada associado já tem', 'card'], ['principalidade', 'atual de cada um', 'gauge']];
    TL.forEach(([big, l, ic], i) => CASEKIT.tile(ctx, 330 + (i % 2) * 400, 470 + Math.floor(i / 2) * 260, 370, 230, big, l, P(t, T_DATA + 1.6 + i * .8, .5), { seed: 20 + i, rot: [-.02, .015, .01, -.015][i], icon: ic, col: i < 2 ? C.orange : C.yellow, size: i < 2 ? 76 : 50 }));
    // uma pessoa representa a recomendação individual
    const pp = P(t, T_DATA + 5.2, .5); if (pp > 0) { ctx.save(); ctx.globalAlpha *= pp; const x = 1240, y = 660; glow(ctx, x, y, 160, C.yellow, .4); vball(ctx, x, y, 70, '#F6EEDF', { lw: 4 }); icon(ctx, 'user', x, y + 4, 80, INK, 8); ctx.restore();
      late(ctx, c => { c.globalAlpha *= pp; para(c, 'cada associado recebe a *sua* recomendação', x, y + 100, 380, { size: 28, weight: 800, color: '#FFF', align: 'center', lh: 1.15 }); }); }
    ctx.restore();
  }
  function umap(ctx, t, cx, cy, sc) {
    const p = E.inOutCubic(P(t, T_HOW + .2, 1.6)), out = P(t, T_ALS - .3, .4); if (t < T_HOW || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= P(t, T_HOW, .4) * (1 - out);
    holo(ctx, cx - sc * 1.3, cy - sc * .95, sc * 2.6, sc * 1.9, { color: C.orange });
    PTS.forEach(q => circle(ctx, cx + lerp(q.sx, q.x, p) * sc, cy + lerp(q.sy, q.y, p) * sc * .8, 6, p > .4 ? CCOL[q.c] : '#BFB3A3'));
    const names = dget(CS(), 'analytics_solution.clusters', []) || [];
    CEN.forEach(([x, y], k) => { const a = P(t, T_KM + k * .2, .3); if (a <= 0) return; const px = cx + x * sc, py = cy + y * sc * .8, s = 13 * E.outBack(a);
      glow(ctx, px, py, 56, CCOL[k], .5 * a); line(ctx, px - s, py - s, px + s, py + s, '#FFF', 5); line(ctx, px - s, py + s, px + s, py - s, '#FFF', 5);
      if (k % 2 === 0 && names[k]) late(ctx, c => { c.globalAlpha *= a; c.shadowColor = '#000'; c.shadowBlur = 8; text(c, names[k], px, py + 36, { size: 24, weight: 800, color: '#FFF', align: 'center' }); }); });
    late(ctx, c => { c.globalAlpha *= p; text(c, 'UMAP + K-Means: 8 perfis parecidos', cx, cy - sc * .95 + 40, { size: 28, weight: 900, color: C.yellow, align: 'center' }); });
    ctx.restore();
  }
  function emb3d(ctx, t, cx, cy, Rr) {
    const a = P(t, T_ALS - .2, .6) * (1 - P(t, T_DROP - .3, .4)); if (a <= 0) return;
    const rot = (t - T_ALS) * .5 + .4, tilt = .42, ca = Math.cos(rot), sa = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt), grow = E.outCubic(P(t, T_ALS - .2, 1.2));
    const pr = (x, y, z) => { x *= grow; y *= grow; z *= grow; const X = x * ca + z * sa, Z0 = -x * sa + z * ca, Y = y * ct - Z0 * st, Z = y * st + Z0 * ct, f = 3 / (3 + Z); return [cx + X * Rr * f, cy + Y * Rr * f, Z, f]; };
    ctx.save(); ctx.globalAlpha *= a;
    holo(ctx, cx - Rr * 1.55, cy - Rr * 1.1, Rr * 3.1, Rr * 2.2, { color: C.orange });
    const V = [-1, 1], edges = []; V.forEach(x => V.forEach(y => { edges.push([[x, y, -1], [x, y, 1]]); edges.push([[x, -1, y], [x, 1, y]]); edges.push([[-1, x, y], [1, x, y]]); }));
    edges.forEach(([p1, p2]) => { const A = pr(...p1), B = pr(...p2); line(ctx, A[0], A[1], B[0], B[1], rgba('#FFE2C4', .12), 1.5); });
    const items = P3.map(q => ({ k: 'c', q, p: pr(q.x, q.y, q.z) })).concat(PV3.map((v, i) => ({ k: 'p', i, p: pr(...v) }))); items.sort((A, B) => B.p[2] - A.p[2]);
    const hl = P3[17], hp = pr(hl.x, hl.y, hl.z), near = PV3.map((v, i) => [i, (v[0] - hl.x) ** 2 + (v[1] - hl.y) ** 2 + (v[2] - hl.z) ** 2]).sort((A, B) => A[1] - B[1]).slice(0, 3), la = P(t, T_EMB, .6);
    if (la > 0) near.forEach(([i], j) => { const q = pr(...PV3[i]); ctx.save(); ctx.globalAlpha *= la; ctx.setLineDash([10, 8]); line(ctx, hp[0], hp[1], q[0], q[1], j ? rgba(C.yellow, .7) : C.yellow, j ? 3 : 5); ctx.restore(); });
    items.forEach(it => { const [x, y, z, f] = it.p, dof = clamp(1 - (z + 1) * .25);
      if (it.k === 'c') { ctx.globalAlpha = a * (.45 + .55 * dof); circle(ctx, x, y, 4.5 * f, CCOL[it.q.c]); }
      else { ctx.globalAlpha = a; const s = 20 * f; vslab(ctx, x - s / 2, y - s / 2, s, s, s * .5, C.yellow, { lw: 2.5 }); const nm = PROD[it.i]; late(ctx, c => tag(c, x, y - 32 * f, nm, { size: 22 })); } });
    ctx.globalAlpha = a; if (la > 0) { circle(ctx, hp[0], hp[1], 15, null, '#FFF', 3); late(ctx, c => { c.globalAlpha *= la; tag(c, hp[0], hp[1] + 40, 'um associado', { size: 22, fill: '#FFF' }); }); }
    late(ctx, c => { c.globalAlpha *= a; text(c, 'embeddings = representações numéricas · perto = afinidade', cx, cy - Rr * 1.1 + 40, { size: 26, weight: 900, color: C.yellow, align: 'center' });
      text(c, 'projeção ilustrativa em 3D', cx, cy + Rr * 1.1 - 30, { size: 24, weight: 700, color: '#E9DCC8', align: 'center' }); });
    ctx.restore();
  }
  /** ANTES (só afinidade) × DEPOIS (critérios combinados): os produtos mudam de posição */
  function rankings(ctx, t) {
    const p = P(t, T_DROP - .2, .5), out = P(t, T_RES - .3, .5); if (p <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= p * (1 - out);
    const dp = E.inOutCubic(P(t, T_DROP + 1.4, 1.6)), XL = 360, XR = 960, Y0 = 440, DY = 92;
    [[XL, 'ANTES', 'ordenado só por afinidade', '#8A8378'], [XR, 'DEPOIS', 'afinidade · conversão · ganho', C.orange]].forEach(([x, h, s, col], j) => late(ctx, c => { c.globalAlpha *= j ? clamp(dp * 2) : 1;
      tag(c, x, Y0 - 120, h, { size: 28, fill: col, color: '#FFF' }); text(c, s, x, Y0 - 70, { size: 26, weight: 800, color: '#F3E6D6', align: 'center' }); }));
    PROD.forEach((nm, i) => { const to = ORDER.indexOf(i), yl = Y0 + i * DY, yr = Y0 + to * DY;
      ctx.save(); ctx.translate(XL, yl); paper(ctx, -240, -34, 480, 68, { r: 10, fill: '#F6EEDF', shadow: 6, shadowColor: '#000', lw: 3 }); ctx.restore();
      late(ctx, c => text(c, `${i + 1}. ${nm}`, XL - 214, yl + 1, { size: 28, weight: 800, color: INK }));
      if (dp > 0) { const x = lerp(XL, XR, dp), y = lerp(yl, yr, dp) - Math.sin(dp * Math.PI) * 60, top = to < 3 && dp > .9;
        ctx.save(); ctx.translate(x, y); paper(ctx, -240, -34, 480, 68, { r: 10, fill: top ? C.orange : '#F6EEDF', shadow: 6, shadowColor: '#000', lw: 3 }); ctx.restore();
        late(ctx, c => { text(c, `${(dp > .5 ? to : i) + 1}. ${nm}`, x - 214, y + 1, { size: 28, weight: 800, color: top ? '#FFF' : INK }); if (dp > .9 && to < 3) tag(c, x + 180, y, ['+++', '++', '+'][to], { size: 22, fill: C.yellow }); }); }
    });
    if (dp > .5) late(ctx, c => { c.globalAlpha *= clamp(dp * 2 - 1); text(c, '+++ = maior ganho esperado de principalidade', XR, Y0 + 5 * DY - 10, { size: 24, weight: 800, color: C.yellow, align: 'center' }); });
    const pts = dget(CS(), 'business_results.principality_points_top3', ''), m = String(pts).match(/([\d.]+)\s*pts.*?([\d.]+)\s*pts/), cp = P(t, T_DROP + 3.6, .5);
    if (m && cp > 0) hud(ctx, c => { c.globalAlpha *= cp; c.translate(1540, 760); paper(c, -270, -96, 540, 192, { torn: true, seed: 31, fill: '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3.5 });
      tag(c, 0, -96, 'PONTOS DE PRINCIPALIDADE · TOP 3', { size: 20, fill: C.red, color: '#FFF' });
      text(c, `com a camada: ${FMT.auto(m[1])} pts`, 0, -14, { size: 30, weight: 900, color: INK, align: 'center' }); text(c, `só afinidade: ${FMT.auto(m[2])} pts`, 0, 40, { size: 28, weight: 700, color: '#6A6056', align: 'center' }); });
    ctx.restore();
  }
  /** o resultado: ganho em pontos percentuais sobre o controle (controle = 0), geral e por subsegmento — só números do JSON */
  function result(ctx, t) {
    const p = P(t, T_RES, .5); if (p <= 0) return;
    const bars = [['geral · Top 3', HLN, true]].concat(SUBS.map(([k, v]) => [k, parseFloat(String(v).replace(',', '.')) || 0, false]));
    const B0 = 820, HM = 440, X0 = 230, DX = 170, top = Math.max(6, Math.ceil(Math.max(...bars.map(b => b[1])) + 1)), y = v => B0 - v / top * HM;
    ctx.save(); ctx.globalAlpha *= p;
    line(ctx, X0 - 30, B0, X0 + DX * bars.length, B0, '#F3E6D6', 5); line(ctx, X0 - 30, B0, X0 - 30, y(top), '#F3E6D6', 3);
    for (let v = 0; v <= top; v += 2) { line(ctx, X0 - 42, y(v), X0 - 30, y(v), '#F3E6D6', 3); late(ctx, c => text(c, (v ? '+' : '') + v, X0 - 50, y(v), { size: 26, weight: 800, color: '#F3E6D6', align: 'right' })); }
    bars.forEach(([k, v, main], i) => { const bp = E.outCubic(P(t, T_RES + .2 + i * .2, .6)), x = X0 + i * DX, h = (B0 - y(v)) * bp;
      vslab(ctx, x, B0 - h, 110, h, 22, main ? C.orange : '#C98A4A', { lw: 3.5 }); if (main) glow(ctx, x + 55, B0 - h / 2, 200, C.orange, .25 * bp);
      late(ctx, c => { c.globalAlpha *= clamp(bp * 2); text(c, '+' + FMT.num(v, 1), x + 60, B0 - h - 30, { size: 30, weight: 900, color: main ? C.yellow : '#FFF', align: 'center' }); text(c, k, x + 60, B0 + 36, { size: main ? 26 : 26, weight: 900, color: main ? C.yellow : '#FFF', align: 'center' }); }); });
    late(ctx, c => { text(c, 'p.p. de principalidade', X0 - 30, y(top) - 36, { size: 26, weight: 900, mono: true, color: C.yellow });
      text(c, 'controle = 0', X0 + DX * bars.length - 10, B0 - 24, { size: 24, weight: 800, color: '#E9DCC8', align: 'right' }); });
    const bc = dget(CS(), 'business_results.best_cluster', ''); if (bc) late(ctx, c => { c.globalAlpha *= P(t, T_RES + 2.2, .4); tag(c, 1500, 880, 'melhor perfil · ' + FMT.auto(bc), { size: 26, fill: C.yellow }); });
    CASEKIT.headline(ctx, P(t, T_RES + .8, .4), 1500, 540, HL, null, { size: 120, col: C.orange, seed: 13 });
    ctx.restore();
  }
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT,
    peaks: [[T_DROP - .1, T_DROP + 2, 1], [T_RES - .1, T_RES + 1.4, .7]],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#2E1A0E' });
      skyline(ctx, t, { y: 1000, h: 300, seed: 71, col: '#1A1216', lit: .35, alpha: .8 });
      wallet(ctx, t); data(ctx, t); umap(ctx, t, 760, 620, 420); emb3d(ctx, t, 760, 620, 300); rankings(ctx, t); result(ctx, t);
      CASEKIT.interstitial(ctx, t, 2, '*Principalidade*', 'Cliente Manga · emissor', C.orange);
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- case 3 · Relatórios de fraude automatizados: ela apaga a luz, o processo continua ---------- */
(() => {
  const id = 'lightsoff', G = grid(id), bt = k => k * 2.2222;
  const T0 = 2.4, T_COST = 12.0, T_IDEA = 20.4, T_PIPE = 21.3, T_UP = 28.4, T_WALK = 29.2, T_REACH = 32.0, T_OFF = bt(15), T_DROP = bt(16);
  const T_RESULT = 40.0, T_PHONES = 40.6, T_DANCE = 41.0, T_EXIT = 46.6, T_NEXT = 50.0, T_DIVE = 57.6;
  const NODES = [['Entrada dos dados', 'db'], ['Validação', 'check'], ['Processamento', 'gear'], ['Relatório', 'doc'], ['Envio ao board', 'board']];
  const GEST = [['1', 'extrair os dados', 3.6], ['2', 'conferir', 5.8], ['3', 'copiar e colar', 8.0], ['4', 'montar o relatório', 10.0]];
  const CYCLE = ['Extrair', 'Conferir', 'Copiar', 'Montar', 'Revisar', 'Enviar'];
  const FLOOR = 880, GS = 1.6, LIFT = -34, SEAT = 470, SW_X = 1800, SW_Y = 650, STAND = 1680, nx = i => 600 + i * 165, NY = 320, IAX = 1180, IAY = 570, BOD = { x: 1330, w: 500 };
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 });
  for (let k = 0; k < 16; k++) cue(id, T0 + .5 + k * 1.05, 'type', { n: 6, gap: .05 }); GEST.forEach(g => cue(id, g[2], 'tick', {}));
  cue(id, T_IDEA, 'chime', { f: 784, up: 7 }); NODES.forEach((_, i) => cue(id, T_PIPE + i * 1.1, 'pop', { p: .8 + i * .1, v: .18 }));
  cue(id, T_OFF, 'click', { v: 1 }); cue(id, T_OFF + .55, 'heart', {}); cue(id, T_OFF + 1.35, 'heart', {}); cue(id, T_DROP, 'impact', { size: 1.3 }); cue(id, T_DROP + .02, 'shimmer', { dur: 2 });
  NODES.forEach((_, i) => cue(id, T_DROP + .5 + i * .3, 'ping', { f: 880 * Math.pow(2, i * 2 / 12) })); cue(id, T_RESULT, 'ding'); cue(id, T_NEXT, 'chime', { f: 659, up: 7 }); cue(id, T_DIVE, 'whoosh', { dur: 1.4, dir: 'down', v: .45 });
  const SCRIPT = CASEKIT.script(id, 3, 'CASE 3 DE 4 · RELATÓRIOS DE FRAUDE', '#F3EBDD', 'Relatórios automatizados', [
    [T0, T_COST, 'ANTES', 'Cada relatório de fraude para o board era *montado manualmente*.', { y: 236, ...BOD }],
    [T_COST, T_IDEA, 'PROBLEMA', 'O trabalho *se repetia* a cada relatório e consumia *tempo da equipe*.', { y: 236, ...BOD }],
    [T_IDEA, T_OFF, 'COMO FIZEMOS', '*Automatizamos* o fluxo de dados até a geração e o envio do relatório.', { y: 236, ...BOD }],
    [T_OFF + .2, T_RESULT, 'SOLUÇÃO', '*Lights Off*: a rotina continua funcionando *sem montagem manual*.', { y: 236, theme: 'dark', ...BOD }],
    [T_RESULT, T_NEXT, 'RESULTADO', 'Relatórios gerados *automaticamente*, no formato do board.', { y: 236, theme: 'dark', ...BOD }],
    [T_NEXT, 60.2, 'PRÓXIMO PASSO', 'Próxima possibilidade: integrar *agentes* para automatizar também a escrita de *insights*.', { y: 236, theme: 'dark', ...BOD }]
  ]);
  const beatAt = t => { const b = G.beats; let i = 0; while (i + 1 < b.length && b[i + 1] <= t) i++; const per = (b[i + 1] || b[i] + .555) - b[i]; return { ph: clamp((t - b[i]) / per), i }; };
  function girlAt(t) {
    const PP = PEOPLE;
    if (t < T_UP) return { x: SEAT, y: LIFT, pose: PP.typing(t * (t > T_IDEA ? 1.4 : 1)), dir: 1, phones: 'neck', mood: t > T_IDEA ? 'happy' : 'tired' };
    if (t < T_WALK) { const k = E.inOutCubic((t - T_UP) / (T_WALK - T_UP)); return { x: SEAT + 30 * k, y: LIFT * (1 - k), pose: PP.mixPose(PP.typing(t), PP.POSE.stand, k), dir: 1, phones: 'neck', mood: 'happy' }; }
    if (t < T_REACH) { const u = (t - T_WALK) / (T_REACH - T_WALK); return { x: lerp(SEAT + 30, STAND, E.inOutSine(u)), pose: PP.walk((t - T_WALK) * 17), dir: 1, phones: 'neck', mood: 'calm' }; }
    if (t < T_DROP + .4) return { x: STAND, pose: PP.reach(E.outCubic(clamp((t - T_REACH) / 1.2))), dir: 1, phones: 'neck', mood: 'calm' };
    if (t < T_DANCE) return { x: STAND, pose: PP.mixPose(PP.reach(1), PP.POSE.stand, clamp((t - T_DROP - .4) / .8)), dir: -1, phones: t > T_PHONES ? 'on' : 'neck', mood: 'happy' };
    const { ph, i } = beatAt(t), d = PP.dance(t, 1 - ph, i);
    if (t < T_EXIT) return { x: STAND - 40 * Math.sin((t - T_DANCE) * 1.3), pose: d, dir: -1, phones: 'on', mood: 'happy' };
    const u = clamp((t - T_EXIT) / 3); return { x: lerp(STAND, W + 300, u), pose: PP.mixPose(d, PP.walk((t - T_EXIT) * 15), .5), dir: 1, phones: 'on', mood: 'happy', gone: u >= 1 };
  }
  function lightSwitch(ctx, on) {
    ctx.save(); ctx.translate(SW_X, SW_Y); ctx.scale(.8, .8);
    vslab(ctx, -90, -150, 180, 300, 14, '#F3EBDD', { lw: 5 }); circle(ctx, 0, -120, 7, '#BFB3A3', INK, 2); circle(ctx, 0, 120, 7, '#BFB3A3', INK, 2);
    rr(ctx, -40, -80, 80, 160, 14); ctx.fillStyle = '#2A221C'; ctx.fill(); inkRect(ctx, -40, -80, 80, 160, 14, 3, 2);
    const ty = lerp(36, -36, on); rr(ctx, -32, ty - 40, 64, 80, 12); const g = ctx.createLinearGradient(0, ty - 40, 0, ty + 40); g.addColorStop(0, '#FFFDF8'); g.addColorStop(1, '#D9CFC0'); ctx.fillStyle = g; ctx.fill(); inkRect(ctx, -32, ty - 40, 64, 80, 12, 3, 4);
    ctx.restore();
    late(ctx, c => tag(c, SW_X, SW_Y + 150, on > .5 ? 'luz acesa' : 'luz apagada', { size: 24, fill: on > .5 ? C.yellow : C.orange }));
  }
  function windowView(ctx, t) {
    const x = 70, y = 250, w = 270, h = 310, k = clamp((t - T0) / (T_IDEA - T0)), day = '#9FD3F0', dusk = '#F28C38', night = '#101632';
    const sky = k < .55 ? mix(day, dusk, k / .55) : mix(dusk, night, (k - .55) / .45);
    vslab(ctx, x - 16, y - 16, w + 32, h + 32, 18, '#6A4A30', { lw: 4 });
    ctx.save(); rr(ctx, x, y, w, h, 6); ctx.clip(); const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, sky); g.addColorStop(1, mix(sky, '#FFE2B0', .3 * (1 - k))); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    vball(ctx, x + w * .65, lerp(y + 60, y + h + 40, clamp(k * 1.4)), 34, k < .6 ? '#FFE07A' : '#FF8A3D', { ink: false, rim: false });
    if (k > .7) { const a = (k - .7) / .3; for (let s = 0; s < 18; s++) circle(ctx, x + hash(s) * w, y + hash(s + 9) * h * .7, 1.6 + hash(s + 3) * 1.6, rgba('#FFF6DC', a * (.5 + .5 * Math.sin(t * 3 + s)))); vball(ctx, x + w * .3, y + 70, 24, '#F3EBDD', { ink: false, rim: false }); }
    for (let b = 0; b < 6; b++) { const bh = 60 + hash(b * 3) * 110, bx = x + b * 48; ctx.fillStyle = mix('#2A2030', night, k * .5); ctx.fillRect(bx, y + h - bh, 44, bh);
      if (k > .5) for (let wv = 0; wv < 6; wv++) if (hash(b * 17 + wv) > .5) { ctx.fillStyle = rgba('#FFD27A', (k - .5) * 1.6); ctx.fillRect(bx + 8 + (wv % 2) * 18, y + h - bh + 12 + Math.floor(wv / 2) * 22, 9, 12); } }
    ctx.restore(); line(ctx, x + w / 2, y, x + w / 2, y + h, '#6A4A30', 10); line(ctx, x, y + h / 2, x + w, y + h / 2, '#6A4A30', 10);
  }
  function clock(ctx, t, x, y) {
    const spin = t < T_DROP ? (t - T0) * 3.2 : (T_DROP - T0) * 3.2 + (t - T_DROP) * .2;
    vball(ctx, x, y, 62, '#F3EBDD', { lw: 5 }); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(ctx, x + Math.cos(a) * 46, y + Math.sin(a) * 46, x + Math.cos(a) * 54, y + Math.sin(a) * 54, INK, 4); }
    line(ctx, x, y, x + Math.sin(spin) * 44, y - Math.cos(spin) * 44, INK, 5); line(ctx, x, y, x + Math.sin(spin / 12) * 30, y - Math.cos(spin / 12) * 30, INK, 8); circle(ctx, x, y, 6, C.red);
    if (t < T_DROP && t > T_COST) for (let k = 0; k < 3; k++) { const a = spin + k * .4; ctx.save(); ctx.globalAlpha = .25 - k * .07; line(ctx, x, y, x + Math.sin(a - .3) * 44, y - Math.cos(a - .3) * 44, INK, 4); ctx.restore(); }
  }
  function desk(ctx, t) {
    const n = Math.floor(clamp((t - T0) / (T_IDEA - T0 - 1)) * 24);
    const sy = FLOOR + LIFT - 60 * GS + 6; vslab(ctx, SEAT - 70, sy, 140, 18, 30, '#3A2A22', { lw: 3 }); line(ctx, SEAT - 6, sy + 18, SEAT - 6, FLOOR - 10, '#2A1E18', 10); line(ctx, SEAT - 60, FLOOR - 8, SEAT + 50, FLOOR - 8, '#2A1E18', 8);
    vslab(ctx, SEAT - 96, sy - 190, 22, 190, 14, '#3A2A22', { lw: 3 });
    vslab(ctx, 560, 650, 470, 26, 46, '#8A5634', { lw: 4 }); [575, 1005].forEach(lx => vslab(ctx, lx, 676, 18, FLOOR - 676, 10, '#6A4026', { lw: 3 }));
    for (let k = 0; k < n; k++) { const y = 650 - 8 - k * 8, dx = (hash(k * 3) - .5) * 10; paper(ctx, 935 + dx, y, 86, 9, { r: 2, fill: k % 5 === 4 ? '#F6E2B8' : '#FFFDF8', shadow: 2, lw: 1.5, volume: false }); }
    const m = Math.floor(clamp((t - T_COST) / (T_IDEA - T_COST)) * 54);
    for (let k = 0; k < m; k++) { const st = k % 3, j = Math.floor(k / 3), x = 1080 + st * 110 + (hash(k) - .5) * 12, y = FLOOR - 9 - j * 9; paper(ctx, x, y, 92, 10, { r: 2, fill: '#FFFDF8', shadow: 2, lw: 1.5, volume: false }); }
    line(ctx, 880, 650, 880, 600, '#2A221C', 12); vslab(ctx, 845, 640, 70, 10, 14, '#2A221C', { lw: 2.5 });
    ctx.save(); ctx.beginPath(); ctx.moveTo(820, 470); ctx.lineTo(905, 452); ctx.lineTo(905, 612); ctx.lineTo(820, 600); ctx.closePath(); ctx.fillStyle = '#1C1A22'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(826, 478); ctx.lineTo(899, 462); ctx.lineTo(899, 602); ctx.lineTo(826, 592); ctx.closePath(); const sg = ctx.createLinearGradient(826, 470, 899, 600); sg.addColorStop(0, '#DDEBFF'); sg.addColorStop(1, '#8AA8D8'); ctx.fillStyle = sg; ctx.fill(); ctx.restore();
    for (let l = 0; l < 7; l++) line(ctx, 832, 486 + l * 15, 832 + 20 + hash(l + Math.floor(t * 2)) * 40, 484 + l * 15, '#4A5A7A', 3);
    vslab(ctx, 690, 640, 120, 8, 22, '#3A3640', { lw: 2.5 }); glow(ctx, 760, 520, 160, '#BFD8FF', .22);
  }
  /** ANTES: cada gesto escrito junto do gesto (uma execução basta) */
  function gestures(ctx, t) {
    const a = P(t, T0 + .8, .4) * (1 - P(t, T_COST - .2, .4)); if (a <= 0) return;
    GEST.forEach(([n, l, t0], i) => { const p = P(t, t0, .35); if (p <= 0) return; const cur = t >= t0 && (i === GEST.length - 1 || t < GEST[i + 1][2]);
      late(ctx, c => { c.globalAlpha *= a * clamp(p * 2); c.translate(950, 300 + i * 74); c.scale(E.outBack(p), E.outBack(p));
        const w = measure(c, l, 28, 900) + 80; rr(c, -14, -28, w, 56, 28); c.fillStyle = cur ? C.red : '#F6EEDF'; c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
        circle(c, 16, 0, 20, cur ? '#FFF' : C.red, INK, 2.5); text(c, n, 16, 1, { size: 22, weight: 900, color: cur ? C.red : '#FFF', align: 'center' }); text(c, l, 48, 1, { size: 28, weight: 900, color: cur ? '#FFF' : INK }); }); });
  }
  function bubble(ctx, t) {
    const a = P(t, T_COST, .4) * (1 - P(t, T_IDEA - .3, .3)); if (a <= 0) return;
    const sp = t - T_COST, step = Math.floor(sp * (1 + sp * .12)) % CYCLE.length, cx = 560, cy = 330;
    ctx.save(); ctx.globalAlpha *= a;
    [[SEAT + 60, 418, 10], [SEAT + 74, 388, 15]].forEach(([x, y, r]) => vball(ctx, x, y, r, '#FFFDF8', { rim: false, lw: 3 }));
    ctx.beginPath(); for (let k = 0; k < 9; k++) { const ang = k / 9 * TAU, rx = 210 + 14 * Math.sin(k * 2.3), ry = 64 + 10 * Math.cos(k * 1.7); ctx.arc(cx + Math.cos(ang) * rx * .8, cy + Math.sin(ang) * ry * .8, 50, 0, TAU); }
    ctx.fillStyle = '#FFFDF8'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, 210, 70, 0, 0, TAU); ctx.fillStyle = '#FFFDF8'; ctx.fill();
    late(ctx, c => { text(c, CYCLE[step], cx, cy - 12, { size: 36, weight: 900, color: INK, align: 'center' }); text(c, 'e de novo… ↻', cx, cy + 30, { size: 26, weight: 800, color: C.red, align: 'center' }); });
    ctx.restore();
  }
  function idea(ctx, t) {
    const a = P(t, T_IDEA, .35) * (1 - P(t, T_UP, .4)); if (a <= 0) return;
    const x = SEAT - 20, y = 372, s = E.outBack(P(t, T_IDEA, .45)) * (1 + .05 * Math.sin(t * 9));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
    glow(ctx, 0, 0, 170, '#FFE27A', .7);
    for (let k = 0; k < 10; k++) { const ang = k / 10 * TAU + t; line(ctx, Math.cos(ang) * 64, Math.sin(ang) * 64, Math.cos(ang) * 92, Math.sin(ang) * 92, '#FFD23A', 6); }
    vball(ctx, 0, -6, 46, '#FFE680', { lw: 4.5, rimCol: '#FFF6C0' }); rr(ctx, -20, 34, 40, 30, 6); ctx.fillStyle = '#8A8378'; ctx.fill(); inkRect(ctx, -20, 34, 40, 30, 6, 4, 3);
    ctx.beginPath(); ctx.moveTo(-12, 10); ctx.lineTo(-4, -12); ctx.lineTo(4, 6); ctx.lineTo(12, -12); ctx.strokeStyle = '#E08A00'; ctx.lineWidth = 4; ctx.stroke();
    ctx.restore();
  }
  function joy(ctx, t, g) {
    if (t < T_PIPE - .3 || t > T_UP) return;
    for (let k = 0; k < 6; k++) { const d = (t * .9 + k / 6) % 1, x = g.x + 90 + Math.sin(k * 2.1 + t) * 50, y = 640 - d * 220; ctx.save(); ctx.globalAlpha = (1 - d) * .9;
      if (k % 2) scribble(ctx, 'heart', x, y, 34, C.red, 60 + k, 1, { glow: true }); else scribble(ctx, 'star', x, y, 30, C.yellow, 70 + k, 1, { glow: true }); ctx.restore(); }
  }
  /** o fluxo nomeado; depois da luz apagada, só ele acende (neon) e roda sozinho */
  function pipeline(ctx, t, lit) {
    if (t < T_PIPE - .2) return;
    const hush = t > T_OFF && t < T_DROP ? .06 : 1; ctx.save(); ctx.globalAlpha *= hush;
    const la = P(t, T_PIPE - .2, .5);
    late(ctx, c => { c.globalAlpha *= la; text(c, 'FLUXO AUTOMÁTICO', nx(0) - 62, NY - 96, { size: 22, weight: 900, mono: true, color: lit > .5 ? C.orange : '#6A4A30', ls: 3 }); });
    NODES.forEach(([nm, ic], i) => { const p = E.outBack(P(t, T_PIPE + i * 1.1, .4)); if (p <= 0) return; const x = nx(i);
      if (i) { const lp = P(t, T_PIPE + (i - .4) * 1.1, .5); if (lit > 0) { ctx.save(); ctx.shadowColor = C.orange; ctx.shadowBlur = QUALITY.low ? 0 : 14 * lit; line(ctx, nx(i - 1) + 58, NY, lerp(nx(i - 1) + 58, x - 58, lp), NY, C.orange, 6); ctx.restore(); } else line(ctx, nx(i - 1) + 58, NY, lerp(nx(i - 1) + 58, x - 58, lp), NY, INK, 5); }
      if (lit > 0) { ctx.save(); ctx.globalAlpha *= lit; holo(ctx, x - 58, NY - 58, 116, 116, { color: C.orange, corners: false }); ctx.restore(); }
      if (lit < 1) { ctx.save(); ctx.globalAlpha *= 1 - lit; paper(ctx, x - 58, NY - 58, 116, 116, { r: 12, fill: '#FFFDF8', shadow: 7, lw: 3.5 }); ctx.restore(); }
      ctx.save(); ctx.translate(x, NY - 4); ctx.scale(p * .78, p * .78); icon(ctx, ic, 0, 0, 66, lit > .5 ? '#FFE9D6' : INK, 8); ctx.restore();
      late(ctx, c => { c.globalAlpha *= clamp(p); para(c, nm, x, NY + 66, 170, { size: 24, weight: 900, color: lit > .5 ? '#FFE9D6' : INK, align: 'center', lh: 1.05 }); }); });
    if (t > T_DROP) { const rt = t - T_DROP, sp = .55 + Math.min(1.6, rt * .12);
      for (let k = 0; k < 9; k++) { const u = (rt * sp + k / 9) % 1, x = lerp(nx(0), nx(4), u); glow(ctx, x, NY, 30, C.orange, .7); vball(ctx, x, NY, 8, '#FFD8A8', { rim: false, lw: 2 }); }
      for (let k = 0; k < 5; k++) { const d = (rt * sp * 2 + k / 5) % 1; ctx.save(); ctx.globalAlpha *= 1 - d; ctx.translate(nx(4) + 40 + d * 120, NY - 40 - d * 110); ctx.rotate(d * 2); paper(ctx, -16, -20, 32, 40, { r: 3, fill: '#FFF6E8', shadow: 2, lw: 2, volume: false }); icon(ctx, 'check', 0, 0, 22, C.orange, 6); ctx.restore(); }
      const runs = Math.floor(rt * 7.3 * (1 + rt * .08));
      late(ctx, c => { c.translate(nx(2), NY - 140); holo(c, -150, -26, 300, 52, { color: C.yellow, corners: false }); text(c, `execuções: ${String(runs).padStart(4, '0')}`, 0, 1, { size: 26, weight: 900, mono: true, color: '#FFF3C4', align: 'center' }); }); }
    ctx.restore();
  }
  /** a placa de neon (só ela e o fluxo acendem) */
  function sign(ctx, t) {
    const sa = P(t, T_DROP + .5, .4) * (t < T_DROP + 1.2 ? (hash(Math.floor(t * 14) + 3) > .3 ? 1 : .3) : 1) * (1 - P(t, T_NEXT - .2, .5)); if (sa <= 0) return;
    ctx.save(); ctx.globalAlpha *= sa; ctx.translate(1200, 570); ctx.rotate(-.03); if (!QUALITY.low) { ctx.shadowColor = '#FF5FA2'; ctx.shadowBlur = 26; }
    ctx.font = font(48, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeStyle = '#FF5FA2'; ctx.lineWidth = 6; ctx.strokeText('LIGHTS OFF RPA', 0, 0); ctx.shadowBlur = 0; ctx.fillStyle = '#FFF0F6'; ctx.fillText('LIGHTS OFF RPA', 0, 0);
    ctx.restore();
  }
  function boom(ctx, t) {
    const k = t - T_DROP; if (k < 0 || k > 2) return;
    if (k < .25) flash(ctx, (1 - k / .25) * .85, '#FFE2C0');
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    [[0, C.orange], [.12, '#FF5FA2'], [.24, C.yellow]].forEach(([d, c]) => { const q = k - d; if (q < 0) return; const r = q * 1500, a = Math.max(0, 1 - q / 1.4);
      ctx.beginPath(); ctx.arc(SW_X - 40, SW_Y, r, 0, TAU); ctx.strokeStyle = rgba(c, .8 * a); ctx.lineWidth = 26 * a + 4; ctx.stroke(); });
    for (let s = 0; s < 70; s++) { const ang = hash(s * 3.1) * TAU, sp = 500 + hash(s * 7.7) * 1300, d = sp * k * (1 - k * .25), x = SW_X - 40 + Math.cos(ang) * d, y = SW_Y + Math.sin(ang) * d + k * k * 160, a = Math.max(0, 1 - k / 1.6);
      const c = [C.orange, C.yellow, '#FF5FA2', '#FFF4E4'][s % 4]; line(ctx, x, y, x - Math.cos(ang) * 40 * a, y - Math.sin(ang) * 40 * a, rgba(c, a), 4); circle(ctx, x, y, 4 * a + 1, rgba(c, a)); }
    ctx.restore();
  }
  /** a próxima possibilidade, ainda tracejada: agentes escrevendo os insights */
  function nextStep(ctx, t) {
    const a = P(t, T_NEXT, .6); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 40;
    const lp = E.inOutSine(P(t, T_NEXT + .2, 1)); line(ctx, nx(4), NY + 60, lerp(nx(4), IAX - 120, lp), lerp(NY + 60, IAY - 40, lp), C.yellow, 6);
    rr(ctx, IAX - 190, IAY - 70, 380, 140, 18); ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.stroke(); ctx.setLineDash([]);
    glow(ctx, IAX, IAY, 220, C.yellow, .18 + .1 * Math.sin(t * 3));
    ctx.restore();
    late(ctx, c => { c.globalAlpha *= a * P(t, T_NEXT + .8, .5); icon(c, 'ai', IAX - 120, IAY, 60, C.yellow, 7); text(c, 'Insight Agent', IAX - 70, IAY - 18, { size: 32, weight: 900, color: '#FFF' }); text(c, 'integração possível', IAX - 70, IAY + 24, { size: 26, weight: 800, color: C.yellow }); });
  }
  /** antes × depois, por etapas (evidência qualitativa, sem tempo inventado) */
  function beforeAfter(ctx, t) {
    const a = P(t, T_RESULT + .3, .5) * (1 - P(t, T_NEXT - .3, .5)); if (a <= 0) return;
    hud(ctx, c => { c.translate(96, 700); panel(c, 0, 0, 980, 250, { dark: true });
      text(c, 'ANTES', 40, 60, { size: 26, weight: 900, mono: true, color: C.red, ls: 3 });
      let x = 190; GEST.forEach(([n, l], i) => { const w = measure(c, l, 26, 800) + 30; rr(c, x, 38, w, 46, 23); c.fillStyle = '#3A1A16'; c.fill(); c.strokeStyle = C.red; c.lineWidth = 2.5; c.stroke(); text(c, l, x + 15, 62, { size: 26, weight: 800, color: '#FFD9CF' }); x += w + 14; });
      text(c, 'DEPOIS', 40, 170, { size: 26, weight: 900, mono: true, color: C.yellow, ls: 3 });
      const l2 = 'automático, do dado ao board'; rr(c, 190, 146, measure(c, l2, 30, 900) + 40, 52, 26); c.fillStyle = C.orange; c.fill(); c.strokeStyle = '#FFF'; c.lineWidth = 2.5; c.stroke(); text(c, l2, 210, 173, { size: 30, weight: 900, color: '#FFF' });
      icon(c, 'check', 190 + measure(c, l2, 30, 900) + 80, 172, 44, C.yellow, 10); }, a);
  }
  SCENES[id] = {
    themeAt: t => t < T_OFF ? 'light' : 'dark', fx: { invert: true }, script: SCRIPT,
    peaks: [[T_DROP - .1, T_DROP + 2.4], [T_DANCE, T_EXIT, .35]],
    draw(ctx, t) {
      const dark = P(t, T_OFF, .12), lit = P(t, T_DROP, .25), dive = E.inCubic(P(t, T_DIVE, 2.2)), sw = 1 - P(t, T_OFF - .05, .1), g = girlAt(t);
      ctx.save();
      if (dive > 0) { ctx.translate(IAX, IAY); ctx.scale(1 + dive * 14, 1 + dive * 14); ctx.translate(-IAX, -IAY); }
      bgLight(ctx, t, { atmos: false }); ctx.fillStyle = '#D6C4A6'; ctx.fillRect(0, 560, W, FLOOR - 560); line(ctx, 0, 560, W, 560, '#8A6A48', 8);
      const fl = ctx.createLinearGradient(0, FLOOR, 0, H); fl.addColorStop(0, '#8A5A3A'); fl.addColorStop(1, '#4A2E1E'); ctx.fillStyle = fl; ctx.fillRect(0, FLOOR, W, H - FLOOR);
      for (let k = 0; k < 9; k++) line(ctx, 0, FLOOR + 12 + k * 22, W, FLOOR + 12 + k * 22, 'rgba(40,20,10,.35)', 2);
      windowView(ctx, t); clock(ctx, t, 1560, 500);
      atmos(ctx, t, { alpha: .55 * (1 - dark), from: 120, bokeh: 2, dust: 26 });
      desk(ctx, t);
      if (dark > 0) { ctx.save(); ctx.globalAlpha = dark * .96; ctx.fillStyle = '#05060E'; ctx.fillRect(0, 0, W, H); ctx.restore(); glow(ctx, 200, 400, 300, '#5A6AA0', .14 * dark); }
      pipeline(ctx, t, lit); sign(ctx, t); nextStep(ctx, t);
      gestures(ctx, t); bubble(ctx, t);
      const swA = P(t, T_IDEA + .6, .5) * (1 - P(t, T_RESULT + 2, .6)); if (swA > 0) { ctx.save(); ctx.globalAlpha *= swA; lightSwitch(ctx, sw); ctx.restore(); }
      joy(ctx, t, g); idea(ctx, t);
      if (!g.gone) { if (t < T_DROP) glow(ctx, g.x + 90, 560, 150, '#BFD8FF', .18 * (1 - dark));
        if (t > T_DANCE) { glow(ctx, g.x, FLOOR - 240, 300, C.orange, .22 * lit); lightCone(ctx, g.x, 120, 80, 520, FLOOR - 120, '#FFB070', .45 * lit); }
        PEOPLE.draw(ctx, g.x, FLOOR + (g.y || 0), GS, g.pose, { dir: g.dir, t, phones: g.phones, mood: g.mood, dark: dark * (t > T_DANCE ? .5 : .88) });
        if (t > T_COST && t < T_IDEA) [[-70, 470], [70, 450]].forEach(([dx, yy], k) => { const d = (t * 1.5 + k * .5) % 1; vball(ctx, g.x + dx, yy + d * 50, 8 * (1 - d) + 2, '#9FD3F0', { rim: false, lw: 2 }); });
        if (t > T_DANCE) for (let k = 0; k < 3; k++) { const d = (t * .8 + k / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - d) * dark; text(ctx, k % 2 ? '♪' : '♫', g.x + (k - 1) * 60 + Math.sin(t * 3 + k) * 20, FLOOR - 480 - d * 160, { size: 46, weight: 900, color: C.yellow, align: 'center' }); ctx.restore(); } }
      boom(ctx, t);
      ctx.restore();
      if (dive > .6) flash(ctx, (dive - .6) / .4, C.yellow);
      beforeAfter(ctx, t);
      CASEKIT.interstitial(ctx, t, 3, '*Relatórios* automatizados', 'relatórios de fraude para o board', '#F3EBDD');
      if (dark > 0) scanlines(ctx, .04 * dark);
      SAY.draw(ctx, t, SCRIPT, t < T_OFF ? 'light' : 'dark');
    }
  };
})();

/* ---------- case 4 · Agentes de IA que escrevem, avaliam e corrigem insights (Insight Agent) ---------- */
(() => {
  const id = 'insight', CS = () => CASE('Insight Agent'), bt = k => k * 2.2222;
  const T0 = 2.6, T_GEN = 12.4, T_LOOP = bt(11), T_QUAL = 36.4, T_DROP = bt(22), T_SIT = 60.4;
  const PL = dget(CS(), 'business_results.pipeline', {}), N_ACQ = PL.acquirers || 30, N_ACT = PL.active_relationships || 0, N_OPP = PL.to_conquer != null ? PL.to_conquer : Math.max(0, N_ACQ - N_ACT);
  const SOL = dget(CS(), 'analytics_solution.innovation_2', {}), GR = dget(CS(), 'analytics_solution.guardrails', ['Regex', 'BERT']);
  // exemplos ilustrativos (edite aqui): o mesmo fato em três versões e uma revisão típica
  const EX = { fact: 'o mesmo fato: queda de share no Sul',
    versions: [['Analista', 'analista', 'Share caiu 2,1 p.p. no Sul vs. o mês anterior, puxado por débito.'], ['Business', 'business', 'Sul perdeu share em débito: priorizar ação comercial.'], ['C-Level', 'clevel', 'Queda de share no Sul; ação proposta em débito.']],
    draft: 'Share caiu no Sul.', why: 'falta o período de comparação', fixed: 'Share caiu 2,1 p.p. no Sul vs. o mês anterior.' };
  const LOOPN = { gen: [330, 600], ev: [740, 600], fix: [740, 850], ok: [1130, 600] };
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, .3, 'impact', { size: .7 }); cue(id, T0 + 1, 'type', { n: 16, gap: .06 });
  EX.versions.forEach((_, i) => cue(id, T_GEN + 1.2 + i * 1.3, 'type', { n: 10, gap: .04 })); cue(id, T_LOOP, 'chime', { f: 784, up: 7 }); cue(id, T_LOOP + 3.4, 'buzz'); cue(id, T_LOOP + 6.2, 'type', { n: 10, gap: .05 }); cue(id, T_LOOP + 8.6, 'ding');
  [0, 1, 2].forEach(i => cue(id, T_QUAL + 1 + i * 1.6, 'pop', { p: 1 + i * .1, v: .2 })); cue(id, T_QUAL + 6.4, 'shimmer', { dur: 1.5 }); cue(id, T_DROP - 5, 'riser', { dur: 5, v: .25 });
  cue(id, T_DROP, 'impact', { size: 1.2 }); for (let k = 0; k < 10; k++) cue(id, T_DROP + .4 + k * .25, 'pop', { p: 1 + k * .05, v: .1 }); cue(id, T_SIT, 'impact', { size: .8 });
  const SCRIPT = CASEKIT.script(id, 4, 'CASE 4 DE 4 · INSIGHT AGENT · ADQUIRENTES', C.red, 'Agentes de IA para insights', [
    [T0, T_GEN, 'PROBLEMA', 'A escrita manual de insights *não acompanhava* o volume de páginas e painéis.', { y: 236 }],
    [T_GEN, T_LOOP, 'GERAR', 'Agentes *geradores* produzem versões de insights para *diferentes públicos*.', { y: 236 }],
    [T_LOOP, T_QUAL, 'AVALIAR E CORRIGIR', 'Agentes *avaliam* os textos e encaminham os *reprovados* para correção.', { y: 236 }],
    [T_QUAL, T_DROP, 'QUALIDADE', '*Regras* e *modelos* avaliam critérios de qualidade do texto.', { y: 236 }],
    [T_DROP, T_SIT, 'ESCALA', 'O mesmo processo se repete em *milhares* de páginas e painéis.', { y: 236 }],
    [T_SIT, 69.1, 'SITUAÇÃO', `*${N_ACT}* adquirentes ativos. *${N_OPP}* oportunidades adicionais. Universo apresentado: *${N_ACQ}*.`, { y: 236 }]
  ]);
  function problem(ctx, t) {
    const a = P(t, T0, .5) * (1 - P(t, T_GEN - .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    dashboard(ctx, 110, 300, 900, 480, { t: t - T0, seed: 4 });
    late(ctx, c => { text(c, 'Market share e share of wallet · adquirentes', 130, 270, { size: 28, weight: 900, color: '#FFF' }); });
    rr(ctx, 160, 810, 800, 80, 10); ctx.fillStyle = '#FFF8E8'; ctx.fill(); ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    const typed = 'Insight: o market share caiu no…'.slice(0, Math.floor(clamp((t - T0 - 1) / 4) * 32));
    late(ctx, c => { text(c, typed + (Math.floor(t * 3) % 2 ? '|' : ''), 190, 850, { size: 28, weight: 800, color: INK }); c.translate(820, 790); c.rotate(-.03); tag(c, 0, 0, 'escrito à mão, página a página', { size: 24, fill: C.red, color: '#FFF' }); });
    // a fila de páginas crescendo
    const n = Math.min(44, Math.floor((t - T0) * 5));
    for (let k = 0; k < n; k++) { const x = 1330 + (k % 4) * 100 + (hash(k) - .5) * 14, y = 860 - Math.floor(k / 4) * 34; ctx.save(); ctx.translate(x, y); ctx.rotate((hash(k * 3) - .5) * .3); paper(ctx, -40, -24, 80, 48, { r: 3, fill: k % 5 ? '#FFFDF8' : '#F6E2B8', shadow: 3, lw: 2, volume: false }); line(ctx, -26, -8, 22, -8, '#8A8378', 3); line(ctx, -26, 6, 10, 6, '#8A8378', 3); ctx.restore(); }
    late(ctx, c => { c.shadowColor = '#000'; c.shadowBlur = 10; text(c, `páginas na fila: ${n * 25}`, 1480, 940, { size: 30, weight: 900, color: '#FFF', align: 'center' }); });
    ctx.restore();
  }
  function generators(ctx, t) {
    const a = P(t, T_GEN - .2, .5) * (1 - P(t, T_LOOP - .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    late(ctx, c => { c.globalAlpha *= P(t, T_GEN + .2, .4); tag(c, 760, 380, EX.fact, { size: 28, fill: C.yellow }); });
    EX.versions.forEach(([lab, role, txt], i) => { const x = 330 + i * 430, p = E.outBack(P(t, T_GEN + .3 + i * .3, .45)); if (p <= 0) return;
      line(ctx, 760, 410, x, 500, rgba('#FFE9D6', .35), 3, [8, 8]);
      agent(ctx, x, 560, 60 * p, { role, t: t + i, seed: i, look: Math.sin(t * 2 + i) });
      const cp = P(t, T_GEN + 1.2 + i * 1.3, .5); if (cp > 0) { ctx.save(); ctx.translate(x, 790 + (1 - E.outBack(cp)) * 40); ctx.rotate([-.02, .015, -.01][i]); paper(ctx, -195, -96, 390, 192, { r: 12, fill: '#FFFDF8', shadow: 8, shadowColor: '#000', lw: 3 }); ctx.restore(); }
      late(ctx, c => { c.globalAlpha *= clamp(p); text(c, lab, x, 650, { size: 30, weight: 900, color: '#FFF', align: 'center' });
        if (cp > 0) { c.globalAlpha *= cp; c.translate(x, 790); tag(c, -80, -96, 'para: ' + lab, { size: 22, fill: [C.yellow, C.red, '#3A3532'][i], color: i ? '#FFF' : INK }); para(c, txt, -170, -54, 340, { size: 26, weight: 800, color: INK, lh: 1.18 }); } }); });
    late(ctx, c => { c.globalAlpha *= P(t, T_GEN + 5, .5); text(c, 'exemplos ilustrativos', 1290, 940, { size: 22, weight: 700, mono: true, color: '#BFB3A3', align: 'right' }); });
    ctx.restore();
  }
  /** gerar → avaliar → (reprovado) corrigir → avaliar de novo → aprovado */
  function loop(ctx, t) {
    const a = P(t, T_LOOP - .2, .5) * (1 - P(t, T_QUAL - .3, .4)); if (a <= 0) return;
    const lt = t - T_LOOP, N = LOOPN; ctx.save(); ctx.globalAlpha *= a;
    const seg = (pts, t0, d, col, w) => { const p = E.inOutSine(clamp((lt - t0) / d)); LINE.draw(ctx, pts, p, { w, col, head: p > 0 && p < 1 }); };
    seg([N.gen, N.ev], .3, 1.2, C.orange, 16);
    seg([N.ev, [N.ev[0] + 40, 720], N.fix], 2.8, 1, C.red, 12);
    seg([N.fix, [N.ev[0] - 120, 760], [N.ev[0] - 70, 650], N.ev], 5.4, 1.3, C.yellow, 12);
    seg([N.ev, N.ok], 7.8, 1, C.orange, 16);
    [['gerar', N.gen, 'ai', 0], ['avaliar', N.ev, 'check', .9], ['corrigir', N.fix, 'gear', 3.6], ['aprovado', N.ok, 'spark', 8.6]].forEach(([l, [x, y], ic, t0]) => { const p = E.outBack(P(t, T_LOOP + t0, .45)); if (p <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p); circle(ctx, 0, 0, 52, l === 'aprovado' ? C.yellow : '#FFF8EE', INK, 6); icon(ctx, ic, 0, 0, 56, INK, 7); ctx.restore();
      late(ctx, c => { c.globalAlpha *= clamp(p); c.shadowColor = '#000'; c.shadowBlur = 10; text(c, l, x, y - 82, { size: 32, weight: 900, color: '#FFF', align: 'center' }); }); });
    late(ctx, c => { c.globalAlpha *= P(t, T_LOOP + 3.2, .4); text(c, 'reprovado', N.ev[0] + 70, 730, { size: 26, weight: 900, color: '#FF8A7A' }); c.globalAlpha = a * P(t, T_LOOP + 5.6, .4); text(c, 'avaliar de novo', N.ev[0] - 240, 820, { size: 26, weight: 900, color: C.yellow, align: 'center' }); });
    // o exemplo da revisão
    const ex = P(t, T_LOOP + .6, .5); if (ex > 0) hud(ctx, c => { c.translate(1290, 470); panel(c, 0, 0, 540, 470, { dark: true, accent: C.yellow });
      text(c, 'EXEMPLO DE REVISÃO', 40, 44, { size: 21, weight: 900, mono: true, color: C.yellow, ls: 3 });
      const s1 = P(t, T_LOOP + 1, .4), s2 = P(t, T_LOOP + 3.4, .4), s3 = P(t, T_LOOP + 6.2, .4), s4 = P(t, T_LOOP + 8.6, .4);
      c.globalAlpha *= s1; para(c, `“${EX.draft}”`, 40, 76, 460, { size: 30, weight: 800, color: '#FFF' });
      c.globalAlpha = a * ex * s2; tag(c, 210, 170, 'reprovado: ' + EX.why, { size: 22, fill: C.red, color: '#FFF' });
      c.globalAlpha = a * ex * s3; para(c, `“${EX.fixed}”`, 40, 222, 460, { size: 30, weight: 800, color: '#FFF', accent: C.yellow });
      c.globalAlpha = a * ex * s4; tag(c, 150, 410, 'aprovado na reavaliação ✓', { size: 24, fill: C.yellow }); }, a);
    ctx.restore();
  }
  function quality(ctx, t) {
    const a = P(t, T_QUAL - .2, .5) * (1 - P(t, T_DROP - .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const J = [[GR[0] || 'Regex', 'regras textuais', 'doc'], [GR[1] || 'BERT', 'modelo de linguagem', 'ai'], [SOL.algorithm || 'Random Forest', `nota de qualidade · ${SOL.nlp_features || 164} características do texto`, 'tree']];
    flowRow(ctx, 160, 560, 1760, J.map(([l, s, ic]) => ({ label: l, sub: s, icon: ic })), E.inOutSine(P(t, T_QUAL + .6, 4)), { bw: 300, bh: 170 });
    // o rascunho passa pelos avaliadores
    const u = clamp((t - T_QUAL - .8) / 5.2), x = lerp(160, 1700, E.inOutSine(u));
    if (u > 0 && u < 1) { ctx.save(); ctx.translate(x, 430 + Math.sin(t * 6) * 6); paper(ctx, -60, -40, 120, 80, { r: 6, fill: '#FFFDF8', shadow: 5, lw: 2.5 }); for (let l = 0; l < 3; l++) line(ctx, -40, -18 + l * 18, 30 - l * 12, -18 + l * 18, '#8A8378', 4); ctx.restore(); }
    // a nota (avaliação, não garantia)
    const g = E.outCubic(P(t, T_QUAL + 6.4, 1.4)); if (g > 0) hud(ctx, c => { c.translate(560, 830); panel(c, 0, 0, 800, 150, { dark: true });
      text(c, 'nota de qualidade do insight', 40, 44, { size: 28, weight: 900, color: '#FFF' });
      rr(c, 40, 78, 560, 28, 14); c.fillStyle = 'rgba(255,255,255,.12)'; c.fill(); rr(c, 40, 78, 560 * .82 * g, 28, 14); c.fillStyle = C.yellow; c.fill();
      text(c, FMT.num(.82 * g * 10, 1) + ' / 10', 630, 92, { size: 30, weight: 900, color: C.yellow });
      text(c, 'é uma avaliação do sistema, não uma garantia de exatidão', 40, 128, { size: 22, weight: 700, color: '#E9DCC8' }); }, a * clamp(g * 3));
    ctx.restore();
  }
  /** o drop: milhares de páginas e painéis; uma janela ampliada mostra o ciclo */
  function wall(ctx, t) {
    const a = P(t, T_DROP - .1, .3) * (1 - P(t, T_SIT - .4, .5)); if (a <= 0) return;
    const z = lerp(1, .16, E.inOutCubic(P(t, T_DROP, 8))), pw = 300 * z, ph = 190 * z, gx = pw * 1.18, gy = ph * 1.22;
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
    // a janela ampliada: o mesmo ciclo, em cada página
    const wa = P(t, T_DROP + 1.4, .5) * a; if (wa > 0) hud(ctx, c => { c.translate(W / 2 - 330, 560); panel(c, 0, 0, 660, 300, { dark: true, accent: C.yellow });
      text(c, 'EM CADA PÁGINA', 44, 44, { size: 22, weight: 900, mono: true, color: C.yellow, ls: 3 });
      const st = ['gerar', 'avaliar', 'corrigir', 'aprovar'], k = Math.floor((t * 1.6) % 4);
      st.forEach((s, i) => { const x = 90 + i * 160; circle(c, x, 150, 34, i === k ? C.orange : '#F6EEDF', INK, 4); text(c, s, x, 220, { size: 26, weight: 900, color: i === k ? C.yellow : '#FFF', align: 'center' }); if (i < 3) arrowHead(c, x + 80, 150, 0, 18, '#FFE9D6'); });
      text(c, '↻', 600, 150, { size: 46, weight: 900, color: C.yellow, align: 'center' }); }, wa);
    const ta = P(t, T_DROP + 2.6, .5); if (ta > 0) hud(ctx, c => { c.shadowColor = '#000'; c.shadowBlur = 20; retroText(c, 'milhares de páginas e painéis', W / 2, 470, { size: 72, weight: 900, color: '#FFF', align: 'center', depth: 5, lw: 4 }); }, ta * a);
  }
  /** a situação: 30 marcas — ativos × oportunidades */
  function situation(ctx, t) {
    const p = P(t, T_SIT, .4); if (p <= 0) return;
    for (let k = 0; k < N_ACQ; k++) { const c = k % 6, r = Math.floor(k / 6), x = 300 + c * 140, y = 330 + r * 120, a = E.outBack(P(t, T_SIT + .2 + k * .03, .3)); if (a <= 0) continue;
      const on = k < N_ACT; ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
      if (on) { glow(ctx, 0, 0, 80, C.orange, .45); vball(ctx, 0, 0, 44, C.orange, { lw: 4 }); icon(ctx, 'store', 0, -2, 50, '#FFF', 7); }
      else { ctx.save(); ctx.setLineDash([8, 7]); circle(ctx, 0, 0, 44, 'rgba(255,255,255,.04)', '#E9DCC8', 3); ctx.restore(); icon(ctx, 'store', 0, -2, 46, '#BFB3A3', 6); }
      ctx.restore(); }
    hud(ctx, c => { c.globalAlpha *= P(t, T_SIT + 1.4, .5); c.translate(1220, 520); panel(c, 0, 0, 560, 300, { dark: true });
      vball(c, 70, 80, 30, C.orange, { lw: 3 }); text(c, `${N_ACT} ativos`, 120, 80, { size: 40, weight: 900, color: '#FFF' });
      c.save(); c.setLineDash([7, 6]); circle(c, 70, 170, 30, null, '#E9DCC8', 3); c.restore(); text(c, `${N_OPP} oportunidades`, 120, 170, { size: 40, weight: 900, color: '#FFF' });
      text(c, `universo apresentado: ${N_ACQ} adquirentes`, 40, 250, { size: 26, weight: 800, color: '#E9DCC8' }); });
  }
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT,
    peaks: [[T_DROP - .1, T_DROP + 2.6, 1], [T_SIT - .1, T_SIT + 1, .6]],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#2A1A10' });
      problem(ctx, t); generators(ctx, t); loop(ctx, t); quality(ctx, t); wall(ctx, t); situation(ctx, t);
      CASEKIT.interstitial(ctx, t, 4, 'Um case de *agentes de IA*', 'que escrevem, avaliam e corrigem insights em escala', C.yellow, 2.6, { kicker: 'CASE 4 DE 4 · INSIGHT AGENT' });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();
