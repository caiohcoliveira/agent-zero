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
  /** número-manchete (v7.11: limpo, sem respingo nem volume — só o número na cor do case e um traço embaixo) */
  headline(ctx, p, x, y, str, label, o = {}) {
    if (p <= 0) return;
    late(ctx, c => { const e = E.outCubic(clamp(p)), s = lerp(1.25, 1, e), size = o.size || 150, col = o.col || C.orange; c.translate(x, y); c.scale(s, s); c.globalAlpha *= clamp(p * 3);
      text(c, str, 0, 0, { size, weight: 900, color: col, align: 'center' });
      const w = measure(c, str, size, 900) * .5 * e; rr(c, -w / 2, size * .5, w, 8, 4); c.fillStyle = col; c.fill();
      if (label) para(c, label, 0, size * .62, 620, { size: 30, weight: 800, color: '#FFF', align: 'center' }); });
  }
};

/** maior tamanho de fonte (até `size`) em que `str` cabe em `maxW` */
const fitSize = (ctx, str, size, maxW, weight = 800) => Math.min(size, size * maxW / Math.max(1, measure(ctx, str, size, weight)));
/** a imagem do dashboard (case de relatórios): o arquivo dashboard_image do JSON, na mesma pasta do HTML (dashboard-fraude.png: troque
 *  pelo real, com o mesmo nome). Usada no popup do case de relatórios e na pilha de painéis do case de agentes. Sem o arquivo: null */
const DASHIMG = (() => { let src = null, img = null; return () => {
  const s = String(dget(CASE('Lights-off'), 'dashboard_image', 'dashboard-fraude.png') || ''); if (!s) return null;   // sem o campo: o arquivo padrão; campo vazio: sem imagem
  if (s !== src) { src = s; img = new Image(); img.src = s; } return img.complete && img.naturalWidth ? img : null; }; })();
DASHIMG();   // começa a carregar a imagem já na abertura da página
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
  const T0 = 2.4, T_DATA = 12.6, T_HOW = bt(11), T_BM = T_HOW + 2.2, T_ALS = T_HOW + 3.6, T_COS = bt(15), T_DROP = bt(16), T_RES = 44.4, T_CONC = 48.9;
  const ms = () => dget(CS(), 'analytics_solution.model_scale', {}), STORES = [['Cliente Banana', C.yellow], ['Cliente Maçã', C.red], ['Cliente Pera', C.orange]];
  const BASK = (dget(CS(), 'analytics_solution.baskets', null) || ['Café + chocolate', 'Churrasco', 'Destilados']).slice(0, 3), BICON = [['cup', 'box'], ['can', 'carton'], ['bottle', 'jar']];
  const MONTHS = (String(dget(CS(), 'analytics_solution.lookback', '')).match(/(\d+)\s*meses/) || [])[1] || '24';
  const CONV = Object.entries(dget(CS(), 'business_results.conversion_by_mechanic', {})).map(([k, v]) => [k, parseFloat(v) || 0]).sort((a, b) => b[1] - a[1]);
  const BEST = CONV.length ? CONV[0] : ['Destilados (cesta)', 1], SECOND = CONV.length > 1 ? CONV[1] : ['2ª melhor', 1];
  // o ganho vem do headline ("+0.1875 relative" ou "+18.75% …"); sem ele, da conversão (1ª ÷ 2ª − 1), arredondado para não mostrar 18,7 por erro de ponto flutuante
  const LIFT_HL = String(dget(CS(), 'business_results.headline', '')), LIFT_M = LIFT_HL.match(/([+-]?\d+(?:\.\d+)?)\s*relative/i), LIFT_P = LIFT_HL.match(/([+-]?\d+(?:[.,](\d+))?)\s*%/);
  const LIFT = LIFT_M ? parseFloat(LIFT_M[1]) : LIFT_P ? parseFloat(LIFT_P[1].replace(',', '.')) / 100 : (BEST[1] && SECOND[1] ? Math.round((BEST[1] / SECOND[1] - 1) * 1e6) / 1e6 : .1875);
  const LIFT_D = LIFT_P && LIFT_P[2] ? Math.min(2, LIFT_P[2].length) : 1;
  const IDX = 100 * (1 + LIFT), BEST_NAME = BEST[0].replace(/\s*\(cesta\)/i, '');
  const SPARSE = (() => { const m = ms(), c = parseFloat(m.customers_modeled) * 1e6, s = +m.sku_subgroups, it = parseFloat(m.interactions) * 1e6; return c && s && it ? 1 - it / (c * s) : .95; })();
  // recomendação (v5): matriz cliente × produto com fatores latentes de verdade (3 "gostos") e o passo a passo dentro das fases
  const NR = 8, NC = 12, K = 3, PITCH = 56, CELL = 48, X0 = 210, Y0 = 470, FC = [C.red, C.orange, C.yellow];
  const SKU = ['bottle', 'box', 'can', 'cup', 'bag', 'jar', 'carton', 'tube', 'bottle', 'box', 'can', 'cup'];
  const RA = rng(505), grp = i => (i < 3 ? 0 : i < 6 ? 1 : 2), pgrp = j => Math.floor(j / 4);
  const Uf = Array.from({ length: NR }, (_, i) => Array.from({ length: K }, (_, k) => clamp((k === grp(i) ? .82 : .12) + (RA() - .5) * .3, .02, 1)));
  const Vf = Array.from({ length: NC }, (_, j) => Array.from({ length: K }, (_, k) => clamp((k === pgrp(j) ? .85 : .1) + (RA() - .5) * .3, .02, 1)));
  const U0 = Uf.map(row => row.map(() => RA())), V0 = Vf.map(row => row.map(() => RA()));
  const SS = Uf.map(u => Vf.map(v => u.reduce((acc, x, k) => acc + x * v[k], 0))), smax = Math.max(...SS.flat()), SN = SS.map(row => row.map(v => v / smax));
  const OBS = SN.map((row, i) => row.map((v, j) => (v > .5 && hash(i * 31 + j * 7) < .5) || hash(i * 13 + j * 17 + 3) < .06));
  const OBS_LIST = []; OBS.forEach((row, i) => row.forEach((o, j) => { if (o) OBS_LIST.push([i, j]); })); OBS_LIST.sort((q, w) => hash(q[0] * 12 + q[1]) - hash(w[0] * 12 + w[1]));
  const STARS = SN.map((row, i) => row.map((v, j) => [v, j]).filter(([, j]) => !OBS[i][j]).sort((q, w) => w[0] - q[0]).slice(0, 2).map(q => q[1]));
  const COMMON = Array.from({ length: NC }, (_, j) => [OBS.reduce((n, row) => n + (row[j] ? 1 : 0), 0), j]).sort((q, w) => w[0] - q[0]).slice(0, 2).map(q => q[1]);   // os 2 mais comprados (BM25)
  // DADOS: a grade, as compras, a linha (cliente), a coluna (produto) e as lacunas · COMO FIZEMOS: R ≈ U·Vᵀ, BM25, ALS em 8 meias-rodadas,
  // a volta da matriz e as propensões · no drop (SOLUÇÃO): as estrelas das recomendações; depois a matriz sai para as cestas
  const T_GRID = T_DATA + 1.3, T_BUY = T_DATA + 2.3, T_ROW = T_DATA + 5.8, T_COL = T_DATA + 7.2, T_Q = T_DATA + 8.6, T_SPLIT = T_HOW;
  const T_BACK = T_COS, T_SWEEP = T_COS + .5, T_STAR = T_DROP, T_OUT = T_DROP + 1.6;
  const HALF = [.9, .9, .7, .7, .5, .5, .4, .4], HT = HALF.reduce((acc, d, n) => (acc.push(n ? acc[n - 1] + HALF[n - 1] : T_ALS), acc), []);
  const win = (t, a0, a1, fi = .3, fo = .3) => P(t, a0, fi) * (1 - P(t, a1 - fo, fo));
  const cellRect = (i, j, Rr) => ({ x: Rr.x + j * PITCH * Rr.s + (PITCH - CELL) / 2 * Rr.s, y: Rr.y + i * PITCH * Rr.s + (PITCH - CELL) / 2 * Rr.s, w: CELL * Rr.s, h: CELL * Rr.s });
  /** valores de U/V durante a alternância: convergem a cada meia-rodada em que são ajustados */
  function factorVals(t, isU) { let k = 0; HT.forEach((ht, h) => { if (t >= ht + HALF[h] * .5 && (h % 2 === 0) === isU) k++; });
    const conv = 1 - Math.pow(.42, k), A0 = isU ? U0 : V0, B0 = isU ? Uf : Vf; return A0.map((row, i) => row.map((v, q) => lerp(v, B0[i][q], conv))); }
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 });
  OBS_LIST.forEach((_, k) => { if (k % 2 === 0) cue(id, T_BUY + k * .1, 'tick', { f: 2400 + (k % 5) * 160, v: .12 }); }); [0, 1, 2, 3].forEach(i => cue(id, T_DATA + 1.0 + i * .7, 'pop', { p: .9 + i * .1, v: .18 }));
  cue(id, T_ROW, 'whoosh', { dur: .4, v: .2 }); cue(id, T_COL, 'whoosh', { dur: .4, v: .2 }); cue(id, T_Q + .2, 'glitch');
  cue(id, T_HOW, 'chime', { f: 784, up: 7 }); cue(id, T_SPLIT + .1, 'whoosh', { dur: 1.2, v: .4 }); HT.forEach((ht, h) => cue(id, ht, 'tick', { f: h % 2 ? 1500 : 2100, v: .25 }));
  cue(id, T_COS, 'shimmer', { dur: 1.5 }); cue(id, T_COS + .2, 'riser', { dur: T_DROP - T_COS - .2, v: .25 }); cue(id, T_DROP, 'impact', { size: 1.1 }); STARS.forEach((_, i) => cue(id, T_STAR + i * .1, 'pop', { p: 1 + i * .1, v: .18 })); cue(id, T_RES, 'impact', { size: .8 }); cue(id, T_RES + .6, 'ding');
  const SCRIPT = CASEKIT.script(id, 1, 'CASE 1 DE 4 · CLIENTE BANANA · VAREJO', C.yellow, 'Cestas de produtos', [
    [T0, T_DATA, 'PROBLEMA', 'Como incentivar clientes a comprar em *outras empresas do mesmo grupo*?', { y: 250 }],
    [T_DATA, T_HOW, 'DADOS', 'Analisamos o *histórico de compras* para aprender afinidades entre clientes e produtos.', { y: 250 }],
    [T_HOW, T_DROP, 'COMO FIZEMOS', '*BM25* reduz o destaque de itens muito comuns. *ALS* aprende padrões entre clientes e produtos.', { y: 236 }],
    [T_DROP, T_RES, 'SOLUÇÃO', 'Produtos com afinidade formam *cestas*. O modelo prioriza os clientes com maior *potencial de compra*.', { y: 236 }],
    [T_RES, 53.5, 'RESULTADO', `*${BEST_NAME}* teve conversão *${FMT.rel(LIFT, LIFT_D)} maior* que a segunda melhor campanha.`, { y: 250 }]
  ], [[T_CONC, 53.5, 'concl', 'O histórico de compras orienta *cestas* e *públicos*.']]);

  /** as três empresas do grupo e um cliente que hoje compra só em uma */
  function stores(ctx, t) {
    const a = P(t, T0, .5) * (1 - P(t, T_DATA + .8, .5)); if (a <= 0) return;
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
  /** os números do histórico de compras, ao lado da matriz */
  function data(ctx, t) {
    const a = P(t, T_DATA, .5) * (1 - P(t, T_HOW - .3, .5)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const m = ms(), TL = [[`${MONTHS} meses`, 'de compras por cliente e produto', 'clock'], [FMT.mm(m.customers_modeled), 'clientes', 'user'], [FMT.num(m.sku_subgroups || 0, 0), 'subgrupos de produtos', 'grid'], [FMT.mm(m.interactions), 'interações (compras)', 'basket']];
    TL.forEach(([big, l, ic], i) => CASEKIT.tile(ctx, 1190 + (i % 2) * 380, 560 + Math.floor(i / 2) * 250, 350, 220, big, l, P(t, T_DATA + 1.0 + i * .7, .5), { seed: 10 + i, rot: [-.02, .015, .01, -.015][i], icon: ic }));
    ctx.restore();
  }
  /** a recomendação passo a passo (da v5): a matriz cliente × produto esparsa, com ícones; o que é cada eixo; as lacunas
   *  (sem compra, o sinal é desconhecido); R ≈ U·Vᵀ; o BM25; o ALS alternando (fixa V → resolve U, fixa U → resolve V) com o
   *  erro caindo; resolvida, a matriz volta completa: as lacunas viram propensões e as estrelas são as recomendações (no drop) */
  function als(ctx, t) {
    if (t < T_GRID || t > T_OUT + .7) return;
    const out = P(t, T_OUT, .6), split = P(t, T_SPLIT, 1.4, E.inOutCubic), back = P(t, T_BACK, .8, E.inOutCubic), mergeK = split * (1 - back);
    const RS = { x: lerp(X0, 90, mergeK), y: lerp(Y0, 590 - NR * PITCH * .55 / 2, mergeK), s: lerp(1, .55, mergeK) };
    const UP = { x: 590, y: 590 - NR * 46 / 2, p: 46 }, VP = { x: 830, y: 590 - K * 46 / 2, p: 46 }, dimJ = j => COMMON.includes(j) ? 1 - .6 * win(t, T_BM, T_BACK, .5, .5) : 1;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    // ---------- matriz R: células, compras observadas, propensões e recomendações ----------
    for (let i = 0; i < NR; i++) for (let j = 0; j < NC; j++) {
      const ap = P(t, T_GRID + (i + j) * .035, .3); if (ap <= 0) continue; const c = cellRect(i, j, RS);
      const sweep = clamp((t - T_SWEEP) * 1.6 - (i + j) / (NR + NC) * 1.4);
      ctx.save(); ctx.globalAlpha *= (1 - mergeK * .45) * ap;
      rr(ctx, c.x, c.y, c.w, c.h, 8 * RS.s); ctx.fillStyle = sweep > 0 ? heat(SN[i][j] * E.outCubic(sweep)) : '#262220'; ctx.fill();
      const k = OBS_LIST.findIndex(q => q[0] === i && q[1] === j), b0 = T_BUY + k * .1;
      if (OBS[i][j] && t > b0) { const bp = E.outBack(P(t, b0, .3)); ctx.save(); ctx.globalAlpha *= dimJ(j);
        circle(ctx, c.x + c.w / 2, c.y + c.h / 2, c.w * .22 * bp, sweep > 0 ? null : C.yellow, sweep > 0 ? '#FFF' : null, 3); if (sweep <= 0) glow(ctx, c.x + c.w / 2, c.y + c.h / 2, c.w * .7, C.yellow, .35 * (1 - P(t, b0, 1))); ctx.restore(); }
      if (STARS[i].includes(j) && t > T_STAR) { const sp = E.outBack(P(t, T_STAR + i * .1, .4)); glow(ctx, c.x + c.w / 2, c.y + c.h / 2, c.w, '#FFF', .4 * sp); icon(ctx, 'spark', c.x + c.w / 2, c.y + c.h / 2, c.w * .6 * sp, '#FFF'); }
      ctx.restore();
    }
    // clientes (linhas) e produtos (colunas)
    for (let i = 0; i < NR; i++) { const ap = E.outBack(P(t, T_GRID + .2 + i * .06, .35)); if (ap <= 0) continue; const x = RS.x - 34 * RS.s - 8, y = RS.y + (i + .5) * PITCH * RS.s, rad = 20 * RS.s * ap;
      circle(ctx, x, y, rad, '#3A3532', rgba(C.cream, .5), 2); icon(ctx, 'user', x, y, rad * 1.3, C.cream, 9); }
    for (let j = 0; j < NC; j++) { const ap = E.outBack(P(t, T_GRID + .3 + j * .05, .35)); if (ap <= 0) continue;
      ctx.save(); ctx.globalAlpha *= dimJ(j); icon(ctx, SKU[j], RS.x + (j + .5) * PITCH * RS.s, RS.y - 30 * RS.s - 6, 34 * RS.s * ap, C.sand, 8); ctx.restore(); }
    // o que é cada eixo: uma linha (cliente) e uma coluna (produto)
    const rowA = win(t, T_ROW, T_COL + .4, .3, .4), colA = win(t, T_COL, T_Q + .2, .3, .4), qa = win(t, T_Q, T_SPLIT + .4, .4, .4), ba = win(t, T_BUY, T_ROW + .2, .4, .4);
    if (rowA > 0) { rr(ctx, RS.x - 6, RS.y + 2 * PITCH * RS.s - 2, NC * PITCH * RS.s + 6, PITCH * RS.s, 12); ctx.strokeStyle = rgba(C.orange, rowA); ctx.lineWidth = 4; ctx.stroke(); }
    if (colA > 0) { rr(ctx, RS.x + 5 * PITCH * RS.s + 2, RS.y - 6, PITCH * RS.s - 4, NR * PITCH * RS.s + 6, 12); ctx.strokeStyle = rgba(C.yellow, colA); ctx.lineWidth = 4; ctx.stroke(); }
    late(ctx, c => { const by = RS.y + NR * PITCH * RS.s + 40, cx = RS.x + NC * PITCH * RS.s / 2;
      if (ba > 0) { circle(c, cx - 150, by, 10, C.yellow); text(c, 'compra no histórico', cx - 128, by, { size: 28, weight: 800, color: '#FFF', alpha: ba }); }
      if (rowA > 0) text(c, 'cliente', RS.x + NC * PITCH * RS.s + 20, RS.y + 2.5 * PITCH * RS.s, { size: 32, weight: 900, color: C.orange, alpha: rowA });
      if (colA > 0) text(c, 'produto (SKU)', RS.x + 5.5 * PITCH * RS.s, by, { size: 32, weight: 900, color: C.yellow, align: 'center', alpha: colA });
      if (qa > 0) { for (let i = 0; i < NR; i++) for (let j = 0; j < NC; j++) { if (OBS[i][j]) continue; const r = cellRect(i, j, RS), fl = .3 + .35 * (hash(i * 12 + j + Math.floor(t * 4)) > .5);
          text(c, '?', r.x + r.w / 2, r.y + r.h / 2 + 2, { size: 28 * RS.s, weight: 800, color: C.sand, align: 'center', alpha: fl * qa }); }
        text(c, `sem compra, o sinal é desconhecido · ${FMT.num(SPARSE * 100, 1)}% das combinações`, cx, by, { size: 28, weight: 800, color: '#FFB0A0', align: 'center', alpha: qa * (1 - mergeK) }); } });
    // ---------- R ≈ U · Vᵀ e o ALS ----------
    if (mergeK > 0) {
      const Uv = factorVals(t, true), Vv = factorVals(t, false), fa = clamp(split * 1.6) * (1 - back);
      const h = HT.findIndex((ht, n) => t >= ht && t < ht + HALF[n]), active = t >= T_ALS && h >= 0 ? (h % 2 === 0 ? 'U' : 'V') : null, done = t >= HT[7] + HALF[7];
      ctx.save(); ctx.globalAlpha *= fa;
      for (let i = 0; i < NR; i++) for (let k = 0; k < K; k++) { const from = cellRect(i, k * 4 + 1.5, { x: X0, y: Y0, s: 1 }), x = lerp(from.x, UP.x + k * UP.p, split), y = lerp(from.y, UP.y + i * UP.p, split), sz = lerp(CELL, UP.p - 6, split);
        rr(ctx, x, y, sz, sz, 7); ctx.fillStyle = mix('#262220', FC[k], clamp(Uv[i][k])); ctx.fill(); }
      for (let k = 0; k < K; k++) for (let j = 0; j < NC; j++) { const from = cellRect(k * 2.5 + 1.5, j, { x: X0, y: Y0, s: 1 }), x = lerp(from.x, VP.x + j * VP.p, split), y = lerp(from.y, VP.y + k * VP.p, split), sz = lerp(CELL, VP.p - 6, split);
        rr(ctx, x, y, sz, sz, 7); ctx.fillStyle = mix('#262220', FC[k], clamp(Vv[j][k])); ctx.fill(); }
      if (active) { const isU = active === 'U', bx = isU ? UP.x - 10 : VP.x - 10, by = isU ? UP.y - 10 : VP.y - 10, bw = isU ? K * UP.p + 14 : NC * VP.p + 14, bh = isU ? NR * UP.p + 14 : K * VP.p + 14;
        glow(ctx, bx + bw / 2, by + bh / 2, Math.max(bw, bh) * .8, C.orange, .25 * (1 - P(t, HT[h], HALF[h]))); rr(ctx, bx, by, bw, bh, 14); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.stroke(); }
      if (t >= T_ALS) { const lx = 1500, ly = 770, lw = 300, lh = 150, n = HT.filter(ht => t >= ht).length;   // o erro cai a cada meia-rodada
        line(ctx, lx, ly + lh, lx + lw, ly + lh, rgba(C.cream, .25), 2); line(ctx, lx, ly, lx, ly + lh, rgba(C.cream, .25), 2);
        ctx.beginPath(); for (let q = 0; q <= n; q++) ctx.lineTo(lx + q / HALF.length * lw, ly + lh - lh * Math.pow(.62, q) * .95); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.stroke();
        circle(ctx, lx + n / HALF.length * lw, ly + lh - lh * Math.pow(.62, n) * .95, 7, C.yellow); }
      ctx.restore();
      const bm = win(t, T_BM, T_ALS + 1.4, .4, .4);
      late(ctx, c => { c.globalAlpha *= fa;
        if (bm > 0) tag(c, 290, 815, 'BM25: itens muito comuns pesam menos', { size: 24, fill: C.red, color: '#FFF', alpha: bm });
        c.save(); c.globalAlpha *= P(t, T_SPLIT + 1, .5);
        text(c, '≈', 528, 590, { size: 80, weight: 300, color: C.cream, align: 'center' }); text(c, '×', 790, 590, { size: 64, weight: 300, color: C.cream, align: 'center' });
        text(c, 'R', 90 + NC * PITCH * .55 / 2, 590 + NR * PITCH * .55 / 2 + 46, { size: 32, weight: 900, mono: true, color: C.sand, align: 'center' });
        text(c, 'U', UP.x + K * UP.p / 2, UP.y + NR * UP.p + 34, { size: 32, weight: 900, mono: true, color: active === 'U' ? C.orange : C.sand, align: 'center' });
        text(c, 'clientes × fatores', UP.x + K * UP.p / 2, UP.y + NR * UP.p + 70, { size: 24, weight: 700, color: C.stone, align: 'center' });
        text(c, 'Vᵀ', VP.x + NC * VP.p / 2, VP.y - 34, { size: 32, weight: 900, mono: true, color: active === 'V' ? C.orange : C.sand, align: 'center' });
        text(c, 'fatores × produtos', VP.x + NC * VP.p / 2, VP.y + K * VP.p + 36, { size: 24, weight: 700, color: C.stone, align: 'center' });
        text(c, 'fatores latentes · "gostos ocultos"', UP.x - 6, UP.y - 40, { size: 26, weight: 800, color: C.yellow });
        if (t >= T_ALS) text(c, 'erro', 1500, 748, { size: 22, weight: 800, mono: true, color: C.stone });
        formula(c, 'R ≈ U · Vᵀ', 1085, 296, { size: 30, rot: .03, seed: 5, scale: E.outBack(P(t, T_SPLIT + .8, .4)) });
        formula(c, 'c = 1 + α·r  · implicit feedback', 330, 880, { size: 22, rot: -.03, seed: 7, scale: E.outBack(P(t, T_SPLIT + 1.5, .4)) });
        formula(c, 'rank k = 64', 260, 950, { size: 22, rot: .03, seed: 9, scale: E.outBack(P(t, T_SPLIT + 1.8, .4)) });
        c.restore();
        const pl = done ? 'convergiu ✓' : active === 'U' ? 'fixa V  →  resolve U' : active === 'V' ? 'fixa U  →  resolve V' : null;
        if (pl) pill(c, 1130, 830, pl, { size: 28, fill: done ? C.yellow : C.orange, color: done ? INK : '#FFF' });
        if (active) formula(c, active === 'U' ? 'uᵢ = (VᵀV + λI)⁻¹ Vᵀ rᵢ' : 'vⱼ = (UᵀU + λI)⁻¹ Uᵀ rⱼ', 1130, 915, { neon: true, size: 24 }); });
    }
    // ---------- resolvida: a matriz inicial, completa ----------
    const sa = win(t, T_SWEEP, T_OUT + .6, .4, .6);
    if (sa > 0) late(ctx, c => { c.globalAlpha *= sa;
      text(c, 'lacunas → propensões', X0 + NC * PITCH / 2, Y0 + NR * PITCH + 46, { size: 34, weight: 900, color: C.orange, align: 'center' });
      formula(c, 'r̂ᵢⱼ = uᵢᵀ vⱼ', X0 + NC * PITCH + 150, Y0 + 70, { size: 26, rot: .04, seed: 12, scale: E.outBack(P(t, T_SWEEP, .4)) });
      const st = P(t, T_STAR, .4); if (st > 0) { c.globalAlpha *= st; icon(c, 'spark', X0 + NC * PITCH + 70, Y0 + 300, 34, C.yellow); text(c, 'recomendação: maior propensão', X0 + NC * PITCH + 100, Y0 + 290, { size: 26, weight: 800, color: '#FFF' });
        text(c, 'entre o que o cliente ainda não comprou', X0 + NC * PITCH + 100, Y0 + 326, { size: 24, weight: 700, color: C.sand }); } });
    ctx.restore();
  }
  /** a solução: afinidades → cestas → públicos → campanhas; cada cesta encontra o seu público */
  function solution(ctx, t) {
    const p0 = P(t, T_DROP, .4), out = P(t, T_RES - .3, .4); if (p0 <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    flowRow(ctx, 110, 300, 1130, [{ label: 'afinidades', icon: 'nodes' }, { label: 'cestas', icon: 'basket' }, { label: 'públicos', icon: 'user' }, { label: 'campanhas', icon: 'spark' }], E.inOutSine(P(t, T_DROP + 1.8, 2.2)), { bw: 210, bh: 130 });
    const tgt = ms().target_customers_mechanic_b;
    BASK.forEach((name, i) => {
      const p = E.outBack(P(t, T_DROP + 2.6 + i * .35, .45)); if (p <= 0) return;
      const x = 230 + i * 400, y = 600 + Math.sin(t * 2 + i) * 4;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.rotate([-.04, .03, -.02][i]);
      paper(ctx, -140, -100, 280, 220, { r: 18, fill: [C.yellow, C.orange, C.red][i], shadow: 10, shadowColor: '#000', lw: 4, halftone: .16 });
      ctx.beginPath(); ctx.arc(0, -100, 64, Math.PI, 0); ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = '#F6EEDF'; ctx.lineWidth = 8; ctx.stroke();
      BICON[i].forEach((ic, j) => { vball(ctx, -52 + j * 104, -10, 44, '#FFF8EE', { lw: 3 }); icon(ctx, ic, -52 + j * 104, -10, 52, INK, 9); });
      late(ctx, c => text(c, name, 0, 76, { size: 30, weight: 900, color: i === 0 ? INK : '#FFF', align: 'center' }));
      ctx.restore();
      const cp = P(t, T_DROP + 3.8 + i * .3, .5); if (cp > 0) { ctx.save(); ctx.globalAlpha *= cp;
        for (let k = 0; k < 5; k++) { const ux = x - 112 + k * 56, uy = 800; vball(ctx, ux, uy, 24, k < 3 ? '#F6EEDF' : '#8A8378', { lw: 3, rim: false }); icon(ctx, 'user', ux, uy + 2, 28, INK, 7); }
        ctx.restore(); late(ctx, c => { c.globalAlpha *= cp; text(c, 'público com maior potencial', x, 856, { size: 24, weight: 800, color: '#F6EEDF', align: 'center' }); }); }
    });
    const dp = P(t, T_DROP + 4.8, .5); if (dp > 0) hud(ctx, c => { c.globalAlpha *= dp; c.translate(1560, 740); c.rotate(-.015);
      paper(c, -300, -100, 600, 200, { torn: true, seed: 33, fill: '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3.5, tape: [[.5, 0, .05]] });
      tag(c, -170, -64, 'DECISÃO', { size: 22, fill: C.red, color: '#FFF' });
      para(c, `As cestas viraram *mecânicas de campanha* nos testes do cliente${tgt ? ` (mecânica B: ${FMT.num(tgt, 0)} clientes)` : ''}.`, -270, -30, 540, { size: 28, weight: 800, color: INK, accent: C.red }); });
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
      fbar(ctx, x, B0 - h, 220, h, i ? C.orange : '#8A8378');
      late(ctx, c => { c.globalAlpha *= clamp(bp * 2); retroText(c, FMT.num(v, 1), X[i] + 10, B0 - h - 50, { size: 64, weight: 900, color: i ? C.yellow : '#FFF', align: 'center', depth: 4, lw: 3 });
        text(c, lab[i], X[i] + 10, B0 + 40, { size: 30, weight: 900, color: '#FFF', align: 'center' }); }); });
    late(ctx, c => { text(c, 'base = 100', 1160, y100 - 22, { size: 24, weight: 800, color: '#E9DCC8', align: 'right' });
      text(c, 'índice de conversão: 2ª melhor campanha = 100 (não é taxa absoluta)', 250, B0 + 104, { size: 26, weight: 700, color: '#E9DCC8' }); });
    const hp = P(t, T_RES + 1.1, .4); CASEKIT.headline(ctx, hp, 1510, 640, FMT.rel(LIFT, LIFT_D), 'em conversão vs. a 2ª melhor campanha', { size: 150, col: C.orange, seed: 9 });
    ctx.restore();
  }
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT,
    peaks: [[T_DROP - .1, T_DROP + 2, 1], [T_RES - .1, T_RES + 1.4, .7]],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#2E1C10' });
      stores(ctx, t); data(ctx, t); als(ctx, t); solution(ctx, t); result(ctx, t);
      CASEKIT.interstitial(ctx, t, 1, '*Cestas de produtos*', 'Cliente Banana · varejo', C.yellow);
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- case 2 · Principalidade (Cliente Manga) ---------- */
(() => {
  const id = 'manga', CS = () => CASE('Cliente Manga'), bt = k => k * 2.2222;
  const T0 = 2.4, T_DATA = 12.6, T_HOW = bt(11), T_KM = T_HOW + 1.8, T_ALS = T_HOW + 4.4, T_EMB = T_HOW + 6.1, T_DROP = bt(16), T_RES = 46.8, T_CONC = 55.6;
  // v7.11: os clusters em 3D da v5 — cada produto é um vetor; o UMAP leva os vetores para 3D, o K-Means agrupa as famílias,
  // a distância do cosseno mede a afinidade (alta e baixa) e um associado percorre a trilha até o núcleo de principalidade
  const T_COS1 = T_ALS, T_COS2 = T_EMB, T_TRAIL = bt(14.5), T_STEP = .3, T_CORE = T_TRAIL + 6 * T_STEP;
  const PROD = ['Cartão de crédito', 'Investimentos', 'Seguro de vida', 'Consórcio', 'Previdência'], ORDER = [2, 0, 4, 1, 3];
  const FAM = [
    { name: 'Dia a dia', col: C.yellow, ink: true, c: [-1.0, -.25, .25], items: ['Conta digital', 'Conta salário', 'Pix', 'Cartão de débito', 'Cartão de crédito', 'Débito automático', 'Cashback'] },
    { name: 'Investimentos', col: C.orange, c: [1.0, -.4, -.25], items: ['CDB', 'LCI', 'LCA', 'Tesouro Direto', 'Poupança', 'Fundos', 'Previdência'] },
    { name: 'Crédito', col: C.red, c: [.25, .85, .55], items: ['Crédito pessoal', 'Consignado', 'Cheque especial', 'Financ. imobiliário', 'Financ. de veículo', 'Consórcio'] },
    { name: 'Proteção', col: '#E9DCC8', ink: true, c: [-.55, .55, -.95], items: ['Seguro de vida', 'Seguro residencial', 'Seguro cartão', 'Capitalização'] }];
  // mesmas posições da v5 (semente 606); s0 = posição solta antes do UMAP
  const EP = (() => { const r = rng(606), g = () => { let s = 0; for (let i = 0; i < 4; i++) s += r(); return (s - 2) / .58; }, out = [];
    FAM.forEach((f, fi) => f.items.forEach(name => { out.push({ name, fi, col: f.col, p: [f.c[0] + g() * .26, f.c[1] + g() * .22, f.c[2] + g() * .26] }); for (let k = 0; k < 4; k++) r(); }));
    out.forEach((q, i) => { q.s0 = [(hash(i * 3 + 1) * 2 - 1) * 1.5, (hash(i * 3 + 2) * 2 - 1) * .9, (hash(i * 3 + 3) * 2 - 1) * 1.5]; });
    return out; })();
  const byName = n => EP.findIndex(q => q.name === n);
  const TRAIL = ['Conta digital', 'Pix', 'Cartão de crédito', 'Cashback', 'CDB', 'Previdência'].map(byName), CORE = [.05, -.32, 0];
  const COS = [[T_COS1, byName('CDB'), byName('LCI'), 'cos θ = 0.94 · alta afinidade'], [T_COS2, byName('Cashback'), byName('Consignado'), 'cos θ = 0.12 · baixa afinidade']];
  const SX = 830, SY = 575, SS = 420, FX = 1582;
  /** giro do espaço: mais rápido enquanto os grupos se formam, devagar durante as medidas (fica longe do quadro de texto) */
  const ang = t => 1.0 + .2 * clamp(t - T_HOW, 0, 4.4) + .07 * Math.max(0, t - T_HOW - 4.4);
  function proj(p, t) { const a = ang(t), b = .32, x = p[0] * Math.cos(a) - p[2] * Math.sin(a), z = p[0] * Math.sin(a) + p[2] * Math.cos(a);
    const y = p[1] * Math.cos(b) - z * Math.sin(b), z2 = p[1] * Math.sin(b) + z * Math.cos(b), s = 3.4 / (z2 + 4.4); return { x: SX + x * s * SS, y: SY + y * s * SS, s, z: z2 }; }
  const POPN = FMT.mm(String(dget(CS(), 'analytics_solution.population', '0.092MM')).split(' ')[0]), SUBS = Object.entries(dget(CS(), 'business_results.by_subsegment', {}));
  const HL = FMT.auto(dget(CS(), 'business_results.top3.incremental_gain', '') || '+4 p.p.');
  const HLN = parseFloat(String(HL).replace(',', '.').replace(/[^\d.+-]/g, '')) || 4;
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 }); cue(id, T0 + 2.4, 'ding');
  [0, 1, 2, 3].forEach(i => cue(id, T_DATA + 1.6 + i * .8, 'pop', { p: .9 + i * .1, v: .18 })); cue(id, T_HOW, 'chime', { f: 784, up: 7 }); cue(id, T_HOW + .3, 'shimmer', { dur: 2 });
  cue(id, T_HOW + .5, 'whoosh', { dur: 1.6, v: .35 }); FAM.forEach((_, k) => cue(id, T_KM + .1 + k * .3, 'chime', { f: 1046 + k * 120, up: 4 }));
  COS.forEach(([t0], k) => cue(id, t0 + .5, 'ping', { f: k ? 988 : 1760 })); TRAIL.forEach((_, k) => cue(id, T_TRAIL + (k + 1) * T_STEP, 'ping', { f: 1046 * Math.pow(2, k * 2 / 12), v: .5 }));
  cue(id, T_CORE, 'ding'); cue(id, bt(15), 'riser', { dur: T_DROP - bt(15), v: .25 });
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
    const MC = [];   // transformação de cada cartão: o rótulo de um cartão de trás não aparece por cima dos da frente
    [[C.red, -.5, -70, 'outro banco'], [C.yellow, -.15, -30, 'outro banco'], [C.orange, .2, 10, 'o banco']].forEach(([c, r, dx, l], i) => { ctx.save(); ctx.rotate(r * .3); ctx.translate(dx, -130 - i * 8 - (i === 2 ? up * 120 : 0)); MC[i] = ctx.getTransform();
      vslab(ctx, -170, -105, 340, 210, 16, c, { lw: 4 }); rr(ctx, -120, -50, 64, 48, 6); ctx.fillStyle = '#F3D9A0'; ctx.fill();
      late(ctx, cc => { cc.save(); const mi = cc.getTransform();
        for (let j = i + 1; j < 3; j++) { cc.beginPath(); cc.setTransform(1, 0, 0, 1, 0, 0); cc.rect(-1e5, -1e5, 2e5, 2e5); cc.setTransform(MC[j]); cc.rect(-170, -105, 340, 210); cc.clip('evenodd'); }
        cc.setTransform(mi); text(cc, l, 0, 50, { size: 28, weight: 900, color: i === 1 ? INK : '#FFF', align: 'center' }); cc.restore(); }); ctx.restore(); });
    vslab(ctx, -260, -40, 520, 240, 28, '#5A3A22', { lw: 5 });
    late(ctx, c => text(c, 'a carteira do cliente', 0, 100, { size: 30, weight: 800, color: '#F3E6D6', align: 'center' }));
    const cp = P(t, T0 + 2.0, .5); if (cp > 0) { { const s = 120 * E.outBack(cp); ctx.save(); ctx.translate(40, -420); ctx.beginPath(); ctx.moveTo(-s * .45, s * .25); ctx.lineTo(-s * .45, -s * .2); ctx.lineTo(-s * .2, s * .02); ctx.lineTo(0, -s * .32); ctx.lineTo(s * .2, s * .02); ctx.lineTo(s * .45, -s * .2); ctx.lineTo(s * .45, s * .25); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); } late(ctx, c => { c.globalAlpha *= cp; tag(c, 230, -420, 'o banco principal', { size: 30, fill: C.yellow }); }); }
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
  /** o espaço dos embeddings (da v5): pontos soltos → UMAP (3D) → K-Means (famílias) → cos θ → trilha de um associado → núcleo */
  function space3d(ctx, t) {
    const A = P(t, T_HOW - .1, .6) * (1 - P(t, T_DROP - .3, .4)); if (A <= 0) return;
    ctx.save(); ctx.globalAlpha *= A;
    const o = proj([0, 0, 0], t), ax = P(t, T_HOW + .8, .8);
    if (ax > 0) { [[1.4, 0, 0, 'dim 1'], [0, -1.1, 0, 'dim 2'], [0, 0, 1.4, 'dim 3']].forEach(([a, b, c, lb]) => { const e = proj([a * ax, b * ax, c * ax], t);
        line(ctx, o.x, o.y, e.x, e.y, rgba(C.cream, .22), 2); late(ctx, cc => text(cc, lb, e.x + 10, e.y, { size: 20, weight: 700, mono: true, color: '#BFB3A3', alpha: ax })); });
      late(ctx, cc => text(cc, '… dim 128', W - 80, H - 96, { size: 22, weight: 700, mono: true, color: '#BFB3A3', align: 'right', alpha: ax })); }
    // K-Means: halo e nome de cada família
    const cl = P(t, T_KM, 1.2);
    if (cl > 0) FAM.forEach((f, k) => { const q = proj(f.c, t); glow(ctx, q.x, q.y, 280 * q.s, f.col, .3 * cl);
      const la = P(t, T_KM + .1 + k * .3, .4); if (la > 0) late(ctx, cc => { cc.globalAlpha *= la; const s = E.outBack(la); cc.translate(q.x, q.y - 140 * q.s); cc.scale(s, s); tag(cc, 0, 0, f.name, { size: 26, fill: f.col, color: f.ink ? INK : '#FFF' }); }); });
    // produtos: soltos → UMAP → no lugar; nomes com a profundidade (os de trás mais apagados)
    const hi = EP.map(() => 0); COS.forEach(([t0, a, b]) => { const v = win(t, t0, t0 + 1.95, .45, .4); hi[a] = Math.max(hi[a], v); hi[b] = Math.max(hi[b], v); });
    const pts = EP.map((q, i) => { const c = E.inOutCubic(P(t, T_HOW + .5 + (i % 7) * .06, 1.5)), pp = [0, 1, 2].map(k => lerp(q.s0[k], q.p[k], c)); return { q, i, c, pr: proj(pp, t), pop: E.outBack(P(t, T_HOW + i * .025, .35)) }; });
    // rótulos sem sobreposição: da frente para trás, cada nome perde opacidade conforme encosta num já colocado
    const placed = (cl > 0 ? FAM.map(f => { const q = proj(f.c, t), w = measure(ctx, f.name, 26, 800) + 40; return [q.x - w / 2, q.y - 140 * q.s - 24, w, 48]; }) : []).concat([[1340, 500, 500, 420]]), LBL = [];
    COS.forEach(([t0, , , label]) => { if (win(t, t0, t0 + 1.95, .45, .4) > 0) { const w = measure(ctx, label, 24, 800) + 40; placed.push([o.x - w / 2, o.y + 92 - 24, w, 48]); } });
    pts.slice().sort((A2, B2) => A2.pr.z - B2.pr.z).forEach(({ q, i, pr, pop }) => { const sz = 11.5 * pr.s * pop, lw = measure(ctx, q.name, 18, 700), r0 = [pr.x + sz + 8, pr.y - sz - 16, lw, 24];
      let ov = 0; placed.forEach(r1 => { const ix = Math.max(0, Math.min(r0[0] + r0[2], r1[0] + r1[2]) - Math.max(r0[0], r1[0])), iy = Math.max(0, Math.min(r0[1] + r0[3], r1[1] + r1[3]) - Math.max(r0[1], r1[1])); ov = Math.max(ov, ix * iy / (r0[2] * r0[3])); });
      LBL[i] = clamp(1 - ov * 4); if (LBL[i] > .5) placed.push(r0); });
    pts.slice().sort((A2, B2) => B2.pr.z - A2.pr.z).forEach(({ q, i, c, pr, pop }) => { if (pop <= 0) return;
      const col = c < 1 ? mix('#BFB3A3', q.col, c) : q.col, sz = 11.5 * pr.s * pop, al = clamp(.4 + (pr.s - .55) * 1.4);
      glow(ctx, pr.x, pr.y, sz * 4, col, .45 * al); circle(ctx, pr.x, pr.y, sz, rgba(col, Math.max(al, .55)));
      const lx = pr.x + sz + 8, ly = pr.y - sz - 4, lw = measure(ctx, q.name, 18, 700), la = P(t, T_KM + .4 + (i % 7) * .08, .5) * Math.max(al * LBL[i], hi[i]);
      const ef = clamp((W - 50 - lx - lw) / 60) * clamp((ly - 200) / 60) * clamp((1000 - ly) / 40) * (lx + lw > 1170 && ly < 470 ? 0 : 1);
      if (la * ef > .01) late(ctx, cc => { const h = hi[i]; cc.globalAlpha *= la * ef;   // o par medido pelo cos θ ganha etiqueta
        if (h > 0) { cc.save(); cc.globalAlpha *= h; tag(cc, lx + lw / 2 + 6, ly, q.name, { size: 20, fill: '#FFF' }); cc.restore(); }
        if (h < 1) { cc.globalAlpha *= 1 - h; cc.shadowColor = '#000'; cc.shadowBlur = 6; text(cc, q.name, lx, ly, { size: 18, weight: 700, color: '#F3E6D6' }); } });
    });
    // cos θ: alta afinidade (mesma família) e baixa (famílias distantes)
    COS.forEach(([t0, a, b, label]) => { const v = win(t, t0, t0 + 1.95, .45, .4); if (v <= 0) return; const pa = pts[a].pr, pb = pts[b].pr, k = P(t, t0, .5, E.outCubic);
      [pa, pb].forEach(pp => line(ctx, o.x, o.y, lerp(o.x, pp.x, k), lerp(o.y, pp.y, k), rgba(C.cream, .85 * v), 3));
      const a1 = Math.atan2(pa.y - o.y, pa.x - o.x); let d = Math.atan2(pb.y - o.y, pb.x - o.x) - a1; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
      ctx.beginPath(); ctx.arc(o.x, o.y, 70, a1, a1 + d * P(t, t0 + .3, .4), d < 0); ctx.strokeStyle = rgba(C.yellow, v); ctx.lineWidth = 4; ctx.stroke(); circle(ctx, o.x, o.y, 6, rgba(C.cream, v));
      late(ctx, cc => { cc.globalAlpha *= v; tag(cc, o.x, o.y + 92, label, { size: 24, fill: '#1E1712', stroke: C.yellow, color: C.yellow }); }); });
    // trilha de um associado pelos produtos → núcleo de principalidade
    if (t > T_TRAIL) {
      const nodes = TRAIL.map(i => pts[i].pr).concat([proj(CORE, t)]), prog = (t - T_TRAIL) / T_STEP, seg = Math.floor(prog);
      ctx.save(); ctx.beginPath(); nodes.forEach((n, k) => { if (k <= prog) ctx.lineTo(n.x, n.y); });
      if (seg < nodes.length - 1) { const f = prog - seg; ctx.lineTo(lerp(nodes[seg].x, nodes[seg + 1].x, f), lerp(nodes[seg].y, nodes[seg + 1].y, f)); }
      ctx.strokeStyle = rgba(C.orange, .95); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
      nodes.forEach((n, k) => { if (k < prog && k < nodes.length - 1) circle(ctx, n.x, n.y, 12, null, C.orange, 3); });
      const hk = Math.min(prog, nodes.length - 1), hs = Math.floor(hk), hf = hk - hs, hx = hs < nodes.length - 1 ? lerp(nodes[hs].x, nodes[hs + 1].x, hf) : nodes[hs].x, hy = hs < nodes.length - 1 ? lerp(nodes[hs].y, nodes[hs + 1].y, hf) : nodes[hs].y;
      glow(ctx, hx, hy, 60, '#FFF', .8); circle(ctx, hx, hy, 16, C.cream); icon(ctx, 'user', hx, hy, 20, C.ink, 9);
      const ua = win(t, T_TRAIL, T_CORE - .2, .3, .3); if (ua > 0) late(ctx, cc => { cc.globalAlpha *= ua; tag(cc, hx, hy - 44, 'um associado', { size: 22, fill: '#FFF' }); });
    }
    const cp = P(t, T_CORE, .6);
    if (cp > 0) { const q = proj(CORE, t), pu = (t * 1.2) % 1; glow(ctx, q.x, q.y, 220 * cp, C.orange, .8); circle(ctx, q.x, q.y, 18 * E.outBack(cp), '#FFF2E0');
      circle(ctx, q.x, q.y, 30 + pu * 90, null, rgba(C.orange, (1 - pu) * cp), 3);
      late(ctx, cc => { cc.globalAlpha *= cp; const s = E.outBack(cp); cc.translate(q.x, q.y + 74); cc.scale(s, s); tag(cc, 0, 0, 'núcleo de principalidade', { size: 26, fill: C.orange, color: '#FFF' }); }); }
    // a coluna técnica (embaixo do quadro de texto): vetor → UMAP → K-Means → distância do cosseno → proximidade = afinidade
    late(ctx, cc => {
      formula(cc, 'e = f(produto) ∈ ℝ¹²⁸', FX, 548, { size: 20, rot: .02, seed: 8, scale: E.outBack(P(t, T_HOW + .5, .4)) });
      formula(cc, 'UMAP · 128D → 3D', FX, 628, { neon: true, size: 20, alpha: P(t, T_HOW + 1.2, .4) });
      formula(cc, 'K-Means · k = 4', FX, 700, { neon: true, size: 20, alpha: P(t, T_KM + .3, .4) });
      formula(cc, 'd_cos(a,b) = 1 − a·b / (‖a‖ ‖b‖)', FX, 784, { neon: true, size: 20, color: C.yellow, alpha: P(t, T_COS1 + .3, .4) });
      if (t > T_KM + .6) kinetic(cc, 'proximidade = *afinidade*', FX, 884, t - T_KM - .6, { size: 46, color: '#FFF', accent: C.orange });
    });
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
      fbar(ctx, x, B0 - h, 110, h, main ? C.orange : '#C98A4A');
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
      wallet(ctx, t); data(ctx, t); space3d(ctx, t); rankings(ctx, t); result(ctx, t);
      CASEKIT.interstitial(ctx, t, 2, '*Principalidade*', 'Cliente Manga · emissor', C.orange);
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- case 3 · Relatórios de fraude automatizados: a automação apaga a luz, o processo continua ---------- */
(() => {
  const id = 'lightsoff', bt = k => k * 2.2222;
  const T0 = 2.4, T_COST = 12.0, T_IDEA = 20.4, T_PIPE = 21.3, T_SIG = 31.0, T_OFF = bt(16.5), T_DROP = bt(17);
  const T_RESULT = 43.0, T_PARTY = 44.0, T_NEXT = 50.8, T_DIVE = 55.4, T_DASH = T_RESULT + 1.4;   // T_DASH: abre o dashboard
  const NODES = [['Entrada dos dados', 'db'], ['Validação', 'check'], ['Processamento', 'gear'], ['Relatório', 'doc'], ['Envio ao board', 'board']];
  const GEST = [['1', 'extrair os dados', 3.6], ['2', 'conferir', 5.8], ['3', 'copiar e colar', 8.0], ['4', 'montar o relatório', 10.0]];
  const FLOOR = 880, SEAT = 470, SW_X = 1800, SW_Y = 650, nx = i => 520 + i * 180, NY = 306, IAX = 1180, IAY = 570, BOD = { x: 1330, w: 500 };
  const MON = { x: 850, y: 520, w: 330, h: 206 }, SX = MON.x - MON.w / 2, SY = MON.y - MON.h / 2;
  const CAM = [[0, 850, 520, 1.55], [T_COST - .4, 850, 520, 1.55], [T_COST + .9, W / 2, H / 2, 1], [99, W / 2, H / 2, 1]];
  const CABLE = [[nx(4) + 58, NY], [1560, NY], [1680, NY + 20], [1720, 420], [1720, SW_Y - 150], [SW_X, SW_Y - 150]];
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, T0 - .6, 'whoosh', { dur: .6, v: .3 });
  GEST.forEach(g => cue(id, g[2], 'tick', {})); for (let k = 0; k < 12; k++) cue(id, T_COST + .4 + k * .62, 'click', { v: .25 });
  cue(id, T_IDEA, 'chime', { f: 784, up: 7 }); for (let k = 0; k < 10; k++) cue(id, T_PIPE + k * .55, 'type', { n: 5, gap: .04 }); NODES.forEach((_, i) => cue(id, T_PIPE + i * 1.1, 'pop', { p: .8 + i * .1, v: .18 }));
  // no interruptor a música segue tocando (v7.6): só o clique; sem os batimentos do antigo silêncio
  cue(id, T_SIG, 'whoosh', { dur: 4, v: .15 }); cue(id, T_OFF, 'click', { v: 1 }); cue(id, T_DROP, 'impact', { size: 1.3 }); cue(id, T_DROP + .02, 'shimmer', { dur: 2 });
  NODES.forEach((_, i) => cue(id, T_DROP + .5 + i * .3, 'ping', { f: 880 * Math.pow(2, i * 2 / 12) })); cue(id, T_RESULT, 'ding'); cue(id, T_DASH, 'pop', { p: 1.15, v: .22 }); for (let k = 1; k < 5; k++) cue(id, T_DASH + k * .28, 'pop', { p: 1.15 + k * .08, v: .12 }); cue(id, T_NEXT - .55, 'whoosh', { dur: .5, v: .15 }); cue(id, T_NEXT, 'chime', { f: 659, up: 7 }); cue(id, T_DIVE, 'whoosh', { dur: 1.4, dir: 'down', v: .45 });
  const SCRIPT = CASEKIT.script(id, 3, 'CASE 3 DE 4 · RELATÓRIOS DE FRAUDE', '#F3EBDD', 'Relatórios automatizados', [
    [T0, T_COST, 'ANTES', 'Cada relatório de fraude para o board era *montado manualmente*.', { y: 236, ...BOD }],
    [T_COST, T_IDEA, 'PROBLEMA', 'O trabalho *se repetia* a cada relatório e consumia *tempo da equipe*.', { y: 236, ...BOD }],
    [T_IDEA, T_OFF, 'COMO FIZEMOS', '*Automatizamos* o fluxo de dados até a geração e o envio do relatório.', { y: 236, ...BOD }],
    [T_OFF + .2, T_RESULT, 'SOLUÇÃO', '*Lights Off*: a rotina continua funcionando *sem montagem manual*.', { y: 236, theme: 'dark', ...BOD }],
    [T_RESULT, T_NEXT, 'RESULTADO', 'Relatórios gerados *automaticamente*, no formato do board.', { y: 236, theme: 'dark', ...BOD }],
    [T_NEXT, 57.98, 'PRÓXIMO PASSO', 'Próxima possibilidade: integrar *agentes* para automatizar também a escrita de *insights*.', { y: 236, theme: 'dark', ...BOD }]
  ]);
  /** fase do trabalho manual na tela: uma volta lenta (ANTES) e depois voltas cada vez mais rápidas (PROBLEMA) */
  function manualState(t) {
    if (t < T_COST) { const k = GEST.findIndex((g, i) => t < (GEST[i + 1] ? GEST[i + 1][2] : T_COST)); const i = Math.max(0, k), t0 = GEST[i][2], t1 = GEST[i + 1] ? GEST[i + 1][2] - .2 : T_COST - .2;
      return { ph: t < GEST[0][2] ? -1 : i, k: clamp((t - t0) / (t1 - t0)), n: 1 }; }
    const lt = t - T_COST, cyc = 2.2, acc = .14; let u = 0, n = 0, d = cyc; while (u + d < lt && n < 60) { u += d; n++; d = Math.max(.7, cyc - acc * n * 1.4); }
    const k = (lt - u) / d; return { ph: Math.floor(k * 4), k: (k * 4) % 1, n: n + 2 };
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
  /** cadeira de escritório (vazia); ang gira em torno do eixo vertical (ilusão 3D) */
  function chair(ctx, x, y, ang = 0, neon = 0) {
    const sq = Math.cos(ang), side = Math.sin(ang);
    ctx.save(); ctx.translate(x, y);
    line(ctx, -60, 0, 60, 0, '#2A1E18', 9); circle(ctx, -60, 4, 7, '#1A1410'); circle(ctx, 60, 4, 7, '#1A1410'); circle(ctx, 0, 4, 7, '#1A1410');
    line(ctx, 0, 0, 0, -86, '#2A1E18', 10);
    ctx.save(); ctx.scale(Math.max(.15, Math.abs(sq)), 1); vslab(ctx, -74, -110, 148, 22, 26, '#3A2A22', { lw: 3 }); ctx.restore();
    ctx.save(); ctx.translate(-70 * sq, 0); ctx.scale(Math.max(.18, Math.abs(side) * .8 + .2), 1); rr(ctx, -16, -300, 32, 196, 10); ctx.fillStyle = '#3A2A22'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    if (neon > 0) { ctx.globalAlpha *= neon; ctx.shadowColor = C.orange; ctx.shadowBlur = QUALITY.low ? 0 : 16; ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.strokeRect(-74 * Math.abs(sq), -110, 148 * Math.abs(sq), 22); line(ctx, 0, -88, 0, -2, '#FFD8A8', 3); ctx.shadowBlur = 0; }
    ctx.restore();
  }
  function desk(ctx, t) {
    vslab(ctx, 560, 650, 600, 26, 46, '#8A5634', { lw: 4 }); [575, 1135].forEach(lx => vslab(ctx, lx, 676, 18, FLOOR - 676, 10, '#6A4026', { lw: 3 }));
    const n = Math.floor(clamp((t - T0) / (T_IDEA - T0 - 1)) * 26);
    for (let k = 0; k < n; k++) { const y = 650 - 8 - k * 8, dx = (hash(k * 3) - .5) * 10; paper(ctx, 1045 + dx, y, 86, 9, { r: 2, fill: k % 5 === 4 ? '#F6E2B8' : '#FFFDF8', shadow: 2, lw: 1.5, volume: false }); }
    const m = Math.floor(clamp((t - T_COST) / (T_IDEA - T_COST)) * 54);
    for (let k = 0; k < m; k++) { const st = k % 3, j = Math.floor(k / 3), x = 1190 + st * 105 + (hash(k) - .5) * 12, y = FLOOR - 9 - j * 9; paper(ctx, x, y, 92, 10, { r: 2, fill: '#FFFDF8', shadow: 2, lw: 1.5, volume: false }); }
    vslab(ctx, 760, 636, 170, 10, 20, '#3A3640', { lw: 2.5 });   // teclado
  }
  /** o monitor de frente: o trabalho manual, a ideia, o código e, no escuro, só um brilho */
  function monitor(ctx, t) {
    line(ctx, MON.x, SY + MON.h + 10, MON.x, 646, '#2A221C', 16); vslab(ctx, MON.x - 60, 640, 120, 10, 14, '#2A221C', { lw: 2.5 });
    rr(ctx, SX - 14, SY - 14, MON.w + 28, MON.h + 28, 14); ctx.fillStyle = '#1C1A22'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.save(); rr(ctx, SX, SY, MON.w, MON.h, 6); ctx.clip(); ctx.fillStyle = '#1E2A3A'; ctx.fillRect(SX, SY, MON.w, MON.h);
    if (t < T_IDEA) {
      const st = manualState(t), L = { x: SX + 10, y: SY + 12, w: 150, h: 184 }, Rw = { x: SX + 170, y: SY + 12, w: 150, h: 184 };
      [[L, '#2E8B57', 'dados.xlsx'], [Rw, C.orange, 'board.pptx']].forEach(([r, c, nm]) => { rr(ctx, r.x, r.y, r.w, r.h, 4); ctx.fillStyle = '#F4F1EA'; ctx.fill(); rr(ctx, r.x, r.y, r.w, 18, 4); ctx.fillStyle = c; ctx.fill(); text(ctx, nm, r.x + 8, r.y + 9, { size: 11, weight: 800, mono: true, color: '#FFF' }); });
      for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) { ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1; ctx.strokeRect(L.x + 6 + c * 35, L.y + 26 + r * 21, 35, 21); }
      const sel = st.ph === 0 ? st.k : st.ph > 0 ? 1 : 0; if (sel > 0) { ctx.fillStyle = 'rgba(46,139,87,.28)'; ctx.fillRect(L.x + 6, L.y + 26, 140 * sel, 21 * 5); ctx.strokeStyle = '#2E8B57'; ctx.lineWidth = 2; ctx.strokeRect(L.x + 6, L.y + 26, 140 * sel, 21 * 5); }
      const chk = st.ph === 1 ? Math.floor(st.k * 5.99) : st.ph > 1 ? 5 : 0; for (let r = 0; r < chk; r++) icon(ctx, 'check', L.x + 132, L.y + 37 + r * 21, 14, C.orange, 4);
      const asm = st.ph === 3 ? st.k : 0, copied = st.ph >= 2;
      if (copied) { rr(ctx, Rw.x + 10, Rw.y + 28, 130, 10, 3); ctx.fillStyle = '#3A3640'; ctx.fill(); }
      if (st.ph === 3) { for (let b = 0; b < 4; b++) { const bh = 50 * (.4 + hash(b + st.n) * .6) * clamp(asm * 2 - b * .2); ctx.fillStyle = b === 3 ? C.orange : '#8A8378'; ctx.fillRect(Rw.x + 18 + b * 28, Rw.y + 120 - bh, 18, bh); }
        for (let l = 0; l < 3; l++) { const w = 120 * clamp(asm * 2 - 1 - l * .2); ctx.fillStyle = '#B8B0A4'; ctx.fillRect(Rw.x + 12, Rw.y + 138 + l * 13, w, 6); } }
      // cursor
      const C0 = [L.x + 20, L.y + 40], C1 = [L.x + 140, L.y + 125], C2 = [Rw.x + 60, Rw.y + 70], C3 = [Rw.x + 100, Rw.y + 140];
      const cp = st.ph < 0 ? C0 : st.ph === 0 ? [lerp(C0[0], C1[0], st.k), lerp(C0[1], C1[1], st.k)] : st.ph === 1 ? [L.x + 132, L.y + 37 + st.k * 100] : st.ph === 2 ? [lerp(C1[0], C2[0], E.inOutSine(st.k)), lerp(C1[1], C2[1], E.inOutSine(st.k)) - Math.sin(st.k * Math.PI) * 40] : [lerp(C2[0], C3[0], st.k), lerp(C2[1], C3[1], st.k)];
      if (st.ph === 2) { ctx.save(); ctx.globalAlpha = .6; ctx.fillStyle = 'rgba(46,139,87,.5)'; ctx.fillRect(cp[0] - 30, cp[1] - 18, 60, 30); ctx.restore(); text(ctx, st.k < .5 ? 'Ctrl+C' : 'Ctrl+V', cp[0] + 16, cp[1] - 26, { size: 13, weight: 900, mono: true, color: C.yellow }); }
      ctx.save(); ctx.translate(cp[0], cp[1]); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 18); ctx.lineTo(5, 13); ctx.lineTo(9, 21); ctx.lineTo(12, 19); ctx.lineTo(8, 12); ctx.lineTo(14, 12); ctx.closePath(); ctx.fillStyle = '#FFF'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    } else if (t < T_PIPE) {
      const k = E.outBack(P(t, T_IDEA, .5)); glow(ctx, MON.x, MON.y, 160, '#FFE27A', .6 * k);
      ctx.save(); ctx.translate(MON.x, MON.y - 8); ctx.scale(k * 1.1, k * 1.1); vball(ctx, 0, -6, 40, '#FFE680', { lw: 4, rimCol: '#FFF6C0' }); rr(ctx, -16, 30, 32, 24, 5); ctx.fillStyle = '#8A8378'; ctx.fill(); inkRect(ctx, -16, 30, 32, 24, 5, 3, 3);
      for (let r = 0; r < 10; r++) { const a = r / 10 * TAU + t * 2; line(ctx, Math.cos(a) * 52, Math.sin(a) * 52 - 6, Math.cos(a) * 70, Math.sin(a) * 70 - 6, '#FFD23A', 4); } ctx.restore();
    } else {
      const lt = t - T_PIPE, n = Math.min(11, Math.floor(lt * 1.6) + 1);
      for (let l = 0; l < n; l++) { const w = 60 + hash(l * 7) * 200, cur = l === n - 1; ctx.fillStyle = [C.orange, '#7FD1A8', C.yellow, '#9FC3FF'][l % 4]; ctx.fillRect(SX + 16 + (l % 3) * 14, SY + 16 + l * 15, cur ? w * ((lt * 1.6) % 1) : w, 7); }
      const pg = clamp((t - T_PIPE) / (T_SIG - T_PIPE)); rr(ctx, SX + 16, SY + MON.h - 26, MON.w - 32, 12, 6); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill(); rr(ctx, SX + 16, SY + MON.h - 26, (MON.w - 32) * pg, 12, 6); ctx.fillStyle = C.orange; ctx.fill();
      text(ctx, pg >= 1 ? 'automação pronta ✓' : `automação ${Math.round(pg * 100)}%`, SX + 16, SY + MON.h - 40, { size: 13, weight: 900, mono: true, color: pg >= 1 ? C.yellow : '#FFE9D6' });
    }
    ctx.restore();
    glow(ctx, MON.x, MON.y, 260, '#BFD8FF', .12);
  }
  /** ANTES: cada gesto escrito ao lado da tela (tamanho fixo, mesmo com a câmera perto) */
  function gestures(ctx, t) {
    const a = P(t, T0 + .8, .4) * (1 - P(t, T_COST - .2, .4)); if (a <= 0) return;
    GEST.forEach(([n, l, t0], i) => { const p = P(t, t0, .35); if (p <= 0) return; const cur = t >= t0 && (i === GEST.length - 1 || t < GEST[i + 1][2]);
      pin(ctx, SX - 34, SY + 30 + i * 52, c => { c.globalAlpha *= a * clamp(p * 2); const w = measure(c, l, 28, 900) + 80, s = E.outBack(p); c.scale(s, s);
        rr(c, -w, -28, w, 56, 28); c.fillStyle = cur ? C.red : '#F6EEDF'; c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
        circle(c, -w + 30, 0, 20, cur ? '#FFF' : C.red, INK, 2.5); text(c, n, -w + 30, 1, { size: 22, weight: 900, color: cur ? C.red : '#FFF', align: 'center' }); text(c, l, -w + 62, 1, { size: 28, weight: 900, color: cur ? '#FFF' : INK }); }); });
  }
  function repeatBadge(ctx, t) {
    const a = P(t, T_COST + .9, .4) * (1 - P(t, T_IDEA - .3, .3)); if (a <= 0) return; const st = manualState(t);
    pin(ctx, MON.x, SY - 54, c => { c.globalAlpha *= a; tag(c, 0, 0, `↻ de novo · relatório ${st.n}`, { size: 28, fill: C.red, color: '#FFF' }); });
  }
  function pipeline(ctx, t, lit) {
    if (t < T_PIPE - .2) return;
    const hush = t > T_OFF && t < T_DROP ? .06 : 1; ctx.save(); ctx.globalAlpha *= hush;
    const la = P(t, T_PIPE - .2, .5);
    late(ctx, c => { c.globalAlpha *= la; text(c, 'FLUXO AUTOMÁTICO', nx(0) - 58, NY - 86, { size: 22, weight: 900, mono: true, color: lit > .5 ? C.orange : '#6A4A30', ls: 3 }); });
    NODES.forEach(([nm, ic], i) => { const t0 = T_PIPE + i * 1.1, p = E.outBack(P(t, t0, .4)), x = nx(i);
      // faísca saindo da tela até o nó que nasce
      const sp = P(t, t0 - .5, .5); if (sp > 0 && sp < 1) { const sx = lerp(MON.x, x, E.inOutSine(sp)), sy = lerp(SY, NY, E.inOutSine(sp)) - Math.sin(sp * Math.PI) * 60; glow(ctx, sx, sy, 34, C.yellow, .8); circle(ctx, sx, sy, 6, '#FFF1C8'); }
      if (p <= 0) return;
      if (i) { const lp = P(t, t0 - .44, .5); if (lit > 0) { ctx.save(); ctx.shadowColor = C.orange; ctx.shadowBlur = QUALITY.low ? 0 : 14 * lit; line(ctx, nx(i - 1) + 58, NY, lerp(nx(i - 1) + 58, x - 58, lp), NY, C.orange, 6); ctx.restore(); } else line(ctx, nx(i - 1) + 58, NY, lerp(nx(i - 1) + 58, x - 58, lp), NY, INK, 5); }
      if (lit > 0) { ctx.save(); ctx.globalAlpha *= lit; holo(ctx, x - 58, NY - 58, 116, 116, { color: C.orange, corners: false }); ctx.restore(); }
      if (lit < 1) { ctx.save(); ctx.globalAlpha *= 1 - lit; paper(ctx, x - 58, NY - 58, 116, 116, { r: 12, fill: '#FFFDF8', shadow: 7, lw: 3.5 }); ctx.restore(); }
      ctx.save(); ctx.translate(x, NY - 4); ctx.scale(p * .78, p * .78); icon(ctx, ic, 0, 0, 66, lit > .5 ? '#FFE9D6' : INK, 8); ctx.restore();
      late(ctx, c => { c.globalAlpha *= clamp(p); para(c, nm, x, NY + 64, 170, { size: 24, weight: 900, color: lit > .5 ? '#FFE9D6' : INK, align: 'center', lh: 1.05 }); }); });
    if (t > T_DROP) { const rt = t - T_DROP, sp = .55 + Math.min(1.6, rt * .12);
      for (let k = 0; k < 9; k++) { const u = (rt * sp + k / 9) % 1, x = lerp(nx(0), nx(4), u); glow(ctx, x, NY, 30, C.orange, .7); vball(ctx, x, NY, 8, '#FFD8A8', { rim: false, lw: 2 }); }
      // no escuro, a tela segue trabalhando: "rodando sozinha" (sem contador numérico, para não parecer métrica)
      const ra = P(t, T_DROP + .3, .5) * (1 - P(t, T_NEXT - .4, .5));
      if (ra > 0) late(ctx, c => { c.globalAlpha *= ra; c.translate(MON.x, MON.y);
        rr(c, -MON.w / 2, -MON.h / 2, MON.w, MON.h, 6); c.fillStyle = 'rgba(14,18,30,.94)'; c.fill(); c.strokeStyle = rgba(C.orange, .75); c.lineWidth = 3; c.stroke();
        const a0 = t * 4.2; c.lineCap = 'round'; c.lineWidth = 9; c.strokeStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(-104, -16, 32, 0, TAU); c.stroke();
        c.strokeStyle = C.orange; c.beginPath(); c.arc(-104, -16, 32, a0, a0 + 4.2); c.stroke();
        text(c, 'rodando', -54, -34, { size: 34, weight: 900, color: '#FFF' }); text(c, 'sozinha', -54, 4, { size: 34, weight: 900, color: C.orange });
        const fl = 1 - ((rt * .5) % 1); c.globalAlpha *= .55 + .45 * fl; text(c, '✓ enviado ao board', 0, 70, { size: 24, weight: 900, color: C.yellow, align: 'center' }); }); }
    ctx.restore();
  }
  /** a automação manda o sinal pelo cabo e apaga a luz sozinha */
  function signal(ctx, t, lit) {
    const p = E.inOutSine(P(t, T_SIG, T_OFF - .1 - T_SIG)); if (t < T_SIG - .3) return;
    const ca = P(t, T_SIG - .3, .4) * (t > T_OFF && t < T_DROP ? .15 : 1);
    ctx.save(); ctx.globalAlpha *= ca; LINE.draw(ctx, CABLE, 1, { w: 6, col: lit > 0 ? C.orange : '#5A4A40', shadow: false, glow: lit > 0 ? 10 : 0 }); ctx.restore();
    if (p > 0 && p < 1) { const [x, y] = LINE.at(CABLE, p); glow(ctx, x, y, 60, C.yellow, .9); circle(ctx, x, y, 9, '#FFF6D0'); }
    const k = t - T_OFF; if (k > -.05 && k < .45) { const a = 1 - clamp(k / .45); for (let s = 0; s < 10; s++) { const ang = s / 10 * TAU; line(ctx, SW_X + Math.cos(ang) * 20, SW_Y - 40 + Math.sin(ang) * 20, SW_X + Math.cos(ang) * (40 + 60 * (1 - a)), SW_Y - 40 + Math.sin(ang) * (40 + 60 * (1 - a)), rgba(C.yellow, a), 4); } }
  }
  function lightSwitch(ctx, on) {
    ctx.save(); ctx.translate(SW_X, SW_Y); ctx.scale(.8, .8);
    vslab(ctx, -90, -150, 180, 300, 14, '#F3EBDD', { lw: 5 }); circle(ctx, 0, -120, 7, '#BFB3A3', INK, 2); circle(ctx, 0, 120, 7, '#BFB3A3', INK, 2);
    rr(ctx, -40, -80, 80, 160, 14); ctx.fillStyle = '#2A221C'; ctx.fill(); inkRect(ctx, -40, -80, 80, 160, 14, 3, 2);
    const ty = lerp(36, -36, on); rr(ctx, -32, ty - 40, 64, 80, 12); const g = ctx.createLinearGradient(0, ty - 40, 0, ty + 40); g.addColorStop(0, '#FFFDF8'); g.addColorStop(1, '#D9CFC0'); ctx.fillStyle = g; ctx.fill(); inkRect(ctx, -32, ty - 40, 64, 80, 12, 3, 4);
    ctx.restore();
    late(ctx, c => tag(c, SW_X, SW_Y + 150, on > .5 ? 'luz acesa' : 'luz apagada', { size: 24, fill: on > .5 ? C.yellow : C.orange }));
  }
  function sign(ctx, t) {
    const sa = P(t, T_DROP + .5, .4) * (t < T_DROP + 1.2 ? (hash(Math.floor(t * 14) + 3) > .3 ? 1 : .3) : 1) * (1 - P(t, T_NEXT - .2, .5)); if (sa <= 0) return;
    ctx.save(); ctx.globalAlpha *= sa; ctx.translate(1250, 578); ctx.rotate(-.03); if (!QUALITY.low) { ctx.shadowColor = '#FF5FA2'; ctx.shadowBlur = 26; }
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
  /** a sala vazia comemora: a cadeira gira no holofote, o equalizador de neon pulsa e os relatórios voam */
  function party(ctx, t) {
    const a = P(t, T_PARTY - .4, .6) * (1 - P(t, T_NEXT - .4, .6)); if (a <= 0) return; const lt = t - T_PARTY;
    ctx.save(); ctx.globalAlpha *= a;
    lightCone(ctx, SEAT, 110, 70, 420, FLOOR - 110, '#FFB070', .55); glow(ctx, SEAT, FLOOR - 160, 240, C.orange, .25);
    chair(ctx, SEAT, FLOOR - 6, lt * 3.4, 1);
    for (let k = 0; k < 14; k++) { const d = ((lt * .5 + k / 14) % 1), ang = hash(k * 3.3) * 1.6 - .8 - Math.PI / 2, dist = d * 620, x = nx(4) + Math.cos(ang) * dist, y = NY + Math.sin(ang) * dist + d * d * 520;
      ctx.save(); ctx.globalAlpha *= 1 - d; ctx.translate(x, y); ctx.rotate(d * 9 + k); ctx.scale(Math.cos(d * 12 + k) * .8 + .2, 1); paper(ctx, -16, -21, 32, 42, { r: 3, fill: '#FFF6E8', shadow: 2, lw: 2, volume: false }); icon(ctx, 'check', 0, 0, 20, C.orange, 6); ctx.restore(); }
    ctx.restore();
  }
  function nextStep(ctx, t) {
    const a = P(t, T_NEXT, .6); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 40;
    const lp = E.inOutSine(P(t, T_NEXT + .2, 1)); line(ctx, nx(4), NY + 60, lerp(nx(4), IAX - 120, lp), lerp(NY + 60, IAY - 40, lp), C.yellow, 6);
    rr(ctx, IAX - 190, IAY - 70, 380, 140, 18); ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.stroke(); ctx.setLineDash([]);
    glow(ctx, IAX, IAY, 220, C.yellow, .18 + .1 * Math.sin(t * 3));
    ctx.restore();
    late(ctx, c => { c.globalAlpha *= a * P(t, T_NEXT + .8, .5); icon(c, 'ai', IAX - 120, IAY, 60, C.yellow, 7); text(c, 'Insight Agent', IAX - 70, IAY - 18, { size: 32, weight: 900, color: '#FFF' }); text(c, 'integração possível', IAX - 70, IAY + 24, { size: 26, weight: 800, color: C.yellow }); });
  }
  /** a imagem do dashboard: o arquivo dashboard_image do JSON, na mesma pasta do HTML (dashboard-fraude.png: troque pelo real,
   *  com o mesmo nome). Sem o arquivo (ou com o campo vazio), o popup mostra o dashboard desenhado, marcado como ilustrativo */
  const DASH = DASHIMG;
  /** v7.12: com a rotina automatizada, os painéis saem do monitor um atrás do outro e se empilham no canto inferior esquerdo,
   *  sem cobrir a animação da automação: a automação gera vários painéis, muito mais rápido. O da frente mostra a imagem
   *  dashboard_image (ou o dashboard desenhado, marcado como ilustrativo) */
  const DN = 5, DPW = 540, DPH = 330, DX0 = 70, DY0 = 650;
  function dashPopup(ctx, t) {
    const a = P(t, T_DASH, .25) * (1 - P(t, T_NEXT - .45, .45)); if (a <= 0) return;
    const img = DASH();
    hud(ctx, c => {
      for (let k = DN - 1; k >= 0; k--) {
        const f = E.inOutCubic(P(t, T_DASH + (DN - 1 - k) * .28, .55)); if (f <= 0) continue;          // o de trás sai primeiro; o da frente por último
        const tx = DX0 + k * 16, ty = DY0 - k * 16, s = lerp(.22, 1, f), cx = lerp(MON.x, tx + DPW / 2, f), cy = lerp(MON.y, ty + DPH / 2, f);
        c.save(); c.translate(cx, cy); c.scale(s, s); c.translate(-DPW / 2, -DPH / 2);
        rr(c, 6, 8, DPW, DPH, 14); c.fillStyle = 'rgba(0,0,0,.45)'; c.fill();
        rr(c, 0, 0, DPW, DPH, 14); c.fillStyle = '#14100D'; c.fill(); c.strokeStyle = k ? 'rgba(243,230,214,.35)' : C.yellow; c.lineWidth = 3; c.stroke();
        [C.red, C.yellow, '#9BD27A'].forEach((col, i) => circle(c, 22 + i * 18, 20, 5, col));
        if (!k) text(c, 'Dashboard de fraude · board', 84, 21, { size: 17, weight: 800, mono: true, color: '#F3E6D6' });
        const X = 12, Y = 38, IW = DPW - 24, IH = DPH - 50;
        if (img) { const q = Math.min(IW / img.naturalWidth, IH / img.naturalHeight), w = img.naturalWidth * q, h = img.naturalHeight * q; rr(c, X, Y, IW, IH, 8); c.fillStyle = '#FFF'; c.fill(); c.drawImage(img, X + (IW - w) / 2, Y + (IH - h) / 2, w, h); }
        else { dashboard(c, X, Y, IW, IH, { t: t - T_DASH, seed: 9 + k, mini: true }); if (!k) tag(c, X + IW - 90, Y + 24, 'ilustrativo', { size: 15, fill: '#E9DCC8' }); }
        c.restore();
      }
      const n = Math.min(DN, Math.floor(Math.max(0, t - T_DASH) / .28) + 1), cnt = n + Math.floor(clamp((t - T_DASH - .5) / 4) * 120);
      c.globalAlpha *= P(t, T_DASH + .3, .3);
      tag(c, DX0 + 150, DY0 - 104, 'gerado automaticamente', { size: 19, fill: C.yellow });
      tag(c, DX0 + DPW - 90, DY0 - 104, `painéis: ${cnt}`, { size: 19, fill: '#F6EEDF' });
    }, a);
  }
  function beforeAfter(ctx, t) {
    const a = P(t, T_RESULT + .3, .5) * (1 - P(t, T_NEXT - .3, .5)); if (a <= 0) return;
    hud(ctx, c => { c.translate(690, 726); const PW = GEST.reduce((s, [, l]) => s + measure(c, l, 22, 800) + 36, 150) + 18; panel(c, 0, 0, PW, 206, { dark: true });   // v7.12: compacto, à direita da pilha de painéis
      text(c, 'ANTES', 36, 56, { size: 22, weight: 900, mono: true, color: C.red, ls: 3 });
      let x = 150; GEST.forEach(([n, l]) => { const w = measure(c, l, 22, 800) + 26; rr(c, x, 36, w, 40, 20); c.fillStyle = '#3A1A16'; c.fill(); c.strokeStyle = C.red; c.lineWidth = 2.5; c.stroke(); text(c, l, x + 13, 57, { size: 22, weight: 800, color: '#FFD9CF' }); x += w + 10; });
      text(c, 'DEPOIS', 36, 148, { size: 22, weight: 900, mono: true, color: C.yellow, ls: 3 });
      const l2 = 'automático, do dado ao board'; rr(c, 150, 124, measure(c, l2, 26, 900) + 36, 48, 24); c.fillStyle = C.orange; c.fill(); c.strokeStyle = '#FFF'; c.lineWidth = 2.5; c.stroke(); text(c, l2, 168, 149, { size: 26, weight: 900, color: '#FFF' });
      icon(c, 'check', 150 + measure(c, l2, 26, 900) + 72, 148, 40, C.yellow, 10); }, a);
  }
  SCENES[id] = {
    themeAt: t => t < T_OFF ? 'light' : 'dark', fx: { invert: true }, script: SCRIPT,
    peaks: [[T_DROP - .1, T_DROP + 2.4], [T_PARTY, T_NEXT - .5, .4]],
    draw(ctx, t) {
      const dark = P(t, T_OFF, .12), lit = P(t, T_DROP, .25), dive = E.inCubic(P(t, T_DIVE, 2.2)), sw = 1 - P(t, T_OFF - .05, .1), cam = camKey(t, CAM);
      ctx.save();
      if (dive > 0) { ctx.translate(IAX, IAY); ctx.scale(1 + dive * 14, 1 + dive * 14); ctx.translate(-IAX, -IAY); }
      layer(ctx, cam, 1, () => {
        bgLight(ctx, t, { atmos: false }); ctx.fillStyle = '#D6C4A6'; ctx.fillRect(-400, 560, W + 800, FLOOR - 560); line(ctx, -400, 560, W + 400, 560, '#8A6A48', 8);
        const fl = ctx.createLinearGradient(0, FLOOR, 0, H + 200); fl.addColorStop(0, '#8A5A3A'); fl.addColorStop(1, '#4A2E1E'); ctx.fillStyle = fl; ctx.fillRect(-400, FLOOR, W + 800, H - FLOOR + 400);
        for (let k = 0; k < 12; k++) line(ctx, -400, FLOOR + 12 + k * 22, W + 400, FLOOR + 12 + k * 22, 'rgba(40,20,10,.35)', 2);
        windowView(ctx, t); clock(ctx, t, 1560, 500);
        if (t < T_PARTY - .4) chair(ctx, SEAT, FLOOR - 6, 0, 0);
        desk(ctx, t); monitor(ctx, t);
        if (dark > 0) { ctx.save(); ctx.globalAlpha = dark * .96; ctx.fillStyle = '#05060E'; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore(); glow(ctx, 200, 400, 300, '#5A6AA0', .14 * dark); if (lit > 0) glow(ctx, MON.x, MON.y, 200, '#7FA8FF', .12 * lit); }
        // no mergulho final só o Insight Agent cresce; o fluxo e os rótulos dele se apagam (não cruzam o título)
        const da = 1 - P(t, T_DIVE, .45); ctx.save(); ctx.globalAlpha *= da; pipeline(ctx, t, lit); signal(ctx, t, lit); sign(ctx, t); ctx.restore(); nextStep(ctx, t);
        const swA = P(t, T_IDEA + .6, .5) * (1 - P(t, T_RESULT + 2, .6)); if (swA > 0) { ctx.save(); ctx.globalAlpha *= swA; lightSwitch(ctx, sw); ctx.restore(); }
        party(ctx, t); boom(ctx, t);
        gestures(ctx, t); repeatBadge(ctx, t);
      });
      ctx.restore();
      if (dive > .6) flash(ctx, (dive - .6) / .4, C.yellow);
      beforeAfter(ctx, t); dashPopup(ctx, t);
      CASEKIT.interstitial(ctx, t, 3, '*Relatórios* automatizados', 'relatórios de fraude para o board', '#F3EBDD');
      if (dark > 0) scanlines(ctx, .04 * dark);
      SAY.draw(ctx, t, SCRIPT, t < T_OFF ? 'light' : 'dark');
    }
  };
})();

/* ---------- case 4 · Agentes de IA que escrevem, avaliam e corrigem insights (Insight Agent) ---------- */
(() => {
  const id = 'insight', CS = () => CASE('Insight Agent'), bt = k => k * 2.2222;
  const T0 = 3.4, T_GEN = 11.8, T_LOOP = 18.6, T_QUAL = 27.6, T_DROP = bt(16), T_SIT = bt(21);   // o crescendo da música começa com a cena
  const PL = dget(CS(), 'business_results.pipeline', {}), N_ACQ = PL.acquirers || 30, N_ACT = PL.active_relationships || 0, N_OPP = PL.to_conquer != null ? PL.to_conquer : Math.max(0, N_ACQ - N_ACT);
  const SOL = dget(CS(), 'analytics_solution.innovation_2', {}), GR = dget(CS(), 'analytics_solution.guardrails', ['Regex', 'BERT']);
  cue(id, .05, 'chime', { f: 987.8, up: -4 }); cue(id, .3, 'impact', { size: .7 }); cue(id, T0 + 1, 'type', { n: 16, gap: .06 });
  // v7.11: GERAR → AVALIAR E CORRIGIR com a animação da v5 (geradores → Validador reprova → refazer → v2 → aprova → Embalador → destaque)
  const T_G = [12.4, 12.8, 13.2], T_SCAN = 13.6, T_DR = [14.4, 15.2, 16.0], T_TOVAL = 18.8, T_NO = 19.6, T_BACK = 20.0, T_DR2 = 21.6, T_TOVAL2 = 22.6,
    T_OK = 23.4, T_TOPACK = 23.8, T_WRAP = 24.5, T_REP = 24.9, T_DSH = 25.8;
  T_G.forEach((t0, i) => { cue(id, t0 - .25, 'whoosh', { dur: .25, dir: 'down', v: .2 }); cue(id, t0, 'pop', { p: .7 + i * .15, v: .3 }); });
  [0, 1, 2].forEach(i => cue(id, T_SCAN + i * .35, 'ping', { f: 1400 + i * 200 })); T_DR.forEach(t0 => cue(id, t0, 'type', { n: 10 }));
  cue(id, T_TOVAL, 'whoosh', { dur: .6, v: .3 }); cue(id, T_NO, 'buzz'); cue(id, T_BACK, 'whoosh', { dur: .6, dir: 'down', v: .25 });
  cue(id, T_DR2, 'type', { n: 8, gap: .04 }); cue(id, T_TOVAL2, 'whoosh', { dur: .5, v: .3 }); cue(id, T_OK, 'chime', { f: 1175, up: 7 });
  cue(id, T_WRAP, 'pop', { p: 1.5 }); cue(id, T_REP, 'whoosh', { dur: .7, v: .4 }); cue(id, T_REP + .75, 'ding'); cue(id, T_DSH, 'whoosh', { dur: .7, v: .35 }); cue(id, T_DSH + .75, 'ding', { f: 1568 });
  [0, 1, 2].forEach(i => cue(id, T_QUAL + 1 + i * 1.2, 'pop', { p: 1 + i * .1, v: .2 })); cue(id, T_QUAL + 5.0, 'shimmer', { dur: 1.5 }); cue(id, T_DROP - 5, 'riser', { dur: 5, v: .25 });
  cue(id, T_DROP, 'impact', { size: 1.2 }); for (let k = 0; k < 10; k++) cue(id, T_DROP + .4 + k * .25, 'pop', { p: 1 + k * .05, v: .1 }); cue(id, T_SIT, 'impact', { size: .8 });
  const SCRIPT = CASEKIT.script(id, 4, 'CASE 4 DE 4 · INSIGHT AGENT · ADQUIRENTES', C.red, 'Agentes de IA para insights', [
    [T0, T_GEN, 'PROBLEMA', 'A escrita manual de insights *não acompanhava* o volume de páginas e painéis.', { y: 236 }],
    [T_GEN, T_LOOP, 'GERAR', 'Agentes *geradores* produzem versões de insights para *diferentes públicos*.', { y: 236 }],
    [T_LOOP, T_QUAL, 'AVALIAR E CORRIGIR', 'Agentes *avaliam* os textos e encaminham os *reprovados* para correção.', { y: 236 }],
    [T_QUAL, T_DROP, 'QUALIDADE', '*Regras* e *modelos* avaliam critérios de qualidade do texto.', { y: 236 }],
    [T_DROP, T_SIT, 'ESCALA', 'O mesmo processo se repete em *milhares* de páginas e painéis.', { y: 236 }],
    [T_SIT, 55.76, 'SITUAÇÃO', `*${N_ACT}* adquirentes ativos. *${N_OPP}* oportunidades adicionais. Universo apresentado: *${N_ACQ}*.`, { y: 236 }]
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
  // ---- palco da v5: relatório (em cima) e a pilha de painéis gerados pela automação (embaixo, à esquerda) ----
  const REP = { x: 70, y: 262, w: 470, h: 250 }, DSH = { x: 70, y: 600, w: 470, h: 290 };
  const GX = 660, GY = [330, 520, 710], CX = 730, CW = 420, CH = 116, VX = 1330, VY = 560, PX = 1650, PY = 690;
  // exemplos ilustrativos (edite aqui): o primeiro rascunho de cada gerador, a revisão e o título aprovado
  const AGX = [
    { role: 'analista', name: 'Analista', v1: 'Fraude subiu no e-commerce.', v2: 'Fraude no e-commerce +18% vs. o mês anterior, em 3 MCCs.' },
    { role: 'business', name: 'Business', v1: 'E-commerce com mais fraude.', v2: 'E-commerce +18% em 3 MCCs: revisar as regras de fraude.' },
    { role: 'clevel', name: 'C-Level', v1: 'Atenção à fraude no e-commerce.', v2: 'Fraude +18% no e-commerce: regras de 3 MCCs em revisão.' }];
  const WHY = 'reprovado: sem período de comparação', SHORT = 'E-commerce +18% em 3 MCCs → revisar regras';
  /** rascunho de um gerador (v5): papel com a cor do papel do agente, etiqueta e texto sendo digitado */
  function draft(ctx, x, y, role, txt, p, o = {}) {
    if (p <= 0) return; const s = o.scale == null ? 1 : o.scale;
    ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha) * clamp(p * 4); ctx.translate(x, y); ctx.scale(s, s);
    paper(ctx, 0, -CH / 2, CW, CH, { r: 12, fill: '#FFFDF8', shadow: 6, shadowColor: '#000', outline: o.ok ? C.orange : INK, lw: o.ok ? 4 : 2.5 });
    ctx.save(); rr(ctx, 0, -CH / 2, CW, CH, 12); ctx.clip(); ctx.fillStyle = role === 'validador' ? C.orange : AGENT_STYLE[role].body; ctx.fillRect(0, -CH / 2, 10, CH); ctx.restore();
    if (s > .5) late(ctx, c => { text(c, (o.tag || AGENT_STYLE[role].label).toUpperCase(), 26, -CH / 2 + 22, { size: 16, weight: 800, mono: true, color: '#6A6056', ls: 1.5 });
      para(c, txt.slice(0, Math.ceil(txt.length * clamp(p * 1.25))), 26, -CH / 2 + 38, CW - 44, { size: 22, weight: 800, color: INK, lh: 1.16 }); });
    ctx.restore();
  }
  /** o relatório que vai ao board: o espaço DESTAQUE espera o insight (v5) */
  function miniReport(ctx, t, head) {
    const R = REP; paper(ctx, R.x, R.y, R.w, R.h, { r: 12, fill: '#FFFDF8', shadow: 7, shadowColor: '#000', lw: 3 });
    rr(ctx, R.x + 14, R.y + 14, R.w - 28, 42, 9);
    if (head > 0) { ctx.fillStyle = C.orange; ctx.fill(); } else { ctx.save(); ctx.setLineDash([7, 6]); ctx.strokeStyle = C.orange; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore(); }
    ['0,08%', '−12%', '3 alertas'].forEach((v, i) => { const bx = R.x + 18 + i * (R.w - 36) / 3; rr(ctx, bx, R.y + 104, (R.w - 36) / 3 - 12, 52, 7); ctx.fillStyle = '#F3EEE7'; ctx.fill(); });
    ctx.beginPath(); for (let k = 0; k < 10; k++) ctx.lineTo(R.x + 26 + k * (R.w - 52) / 9, R.y + R.h - 30 - Math.sin(k * .9) * 16 - (k > 6 ? 24 : 0)); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.stroke();
    late(ctx, c => {
      if (head > 0) text(c, SHORT.slice(0, Math.ceil(SHORT.length * clamp(head * 1.2))), R.x + 28, R.y + 36, { size: fitSize(c, SHORT, 19, R.w - 60), weight: 800, color: '#FFF' });
      else text(c, 'DESTAQUE: ?', R.x + 28, R.y + 36, { size: 19, weight: 800, mono: true, color: C.orange, alpha: .6 + .4 * Math.sin(t * 7) });
      text(c, 'REPORT DE FRAUDE · BOARD', R.x + 18, R.y + 80, { size: 16, weight: 800, mono: true, color: '#6A6056', ls: 1.5 });
      ['0,08%', '−12%', '3 alertas'].forEach((v, i) => { const bx = R.x + 18 + i * (R.w - 36) / 3; text(c, v, bx + 12, R.y + 131, { size: 21, weight: 900, color: INK }); }); });
  }
  /** o dashboard (v5): a faixa do insight entra no topo */
  function panels(ctx, t, banner) {
    const D = DSH, a = E.outBack(P(t, T_GEN + .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.translate(D.x + D.w / 2, D.y + D.h / 2); ctx.scale(a, a); ctx.translate(-D.w / 2, -D.h / 2);
    dashboard(ctx, 0, 0, D.w, D.h, { t, seed: 3, mini: true });
    if (banner > 0) { rr(ctx, 8, 10, (D.w - 16) * clamp(banner * 1.4), 44, 8); ctx.fillStyle = C.orange; ctx.fill(); }
    ctx.restore();
    if (banner > 0) late(ctx, c => { c.globalAlpha *= clamp(banner * 2); text(c, SHORT, D.x + 22, D.y + 32, { size: fitSize(c, SHORT, 18, D.w - 44), weight: 800, color: '#FFF' }); });
  }
  function stage(ctx, t) {
    const a = P(t, T_GEN - .2, .5) * (1 - P(t, T_QUAL - .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const head = P(t, T_REP + .75, .9), banner = P(t, T_DSH + .75, .6);
    miniReport(ctx, t, head); panels(ctx, t, banner);
    late(ctx, c => { [[REP, 'relatório', C.red, '#FFF'], [DSH, 'dashboard', C.yellow, INK]].forEach(([R, lb, f, col], k) => { c.save(); c.translate(R.x + R.w - 60, R.y - 8); c.rotate(.04); tag(c, 0, 0, lb, { size: 20, fill: f, color: col }); c.restore(); }); });
    // "refazer": a seta tracejada vermelha volta do Validador para os geradores (por baixo dos rascunhos)
    const loopP = P(t, T_NO + .2, .6, E.inOutCubic) * (1 - P(t, T_DR2, .4));
    if (loopP > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(VX - 30, VY + 86); ctx.bezierCurveTo(VX - 80, 960, GX + 220, 975, GX + 8, GY[2] + 80);
      ctx.setLineDash([14, 11]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = rgba(C.red, loopP); ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
      arrowHead(ctx, GX + 8, GY[2] + 76, -Math.PI * .58, 22, rgba(C.red, loopP));
      late(ctx, c => { c.globalAlpha *= loopP; c.translate(1010, 942); c.rotate(-.03); tag(c, 0, 0, 'refazer', { size: 28, fill: C.red, color: '#FFF' }); }); }
    if (t > T_G[2]) { const ca = P(t, T_G[2], .5) * .6; GY.forEach(gy => line(ctx, CX + CW + 8, gy, VX - 66, VY, rgba(C.cream, ca * .4), 2, [4, 8])); line(ctx, VX + 66, VY, PX - 56, PY, rgba(C.orange, ca), 3, [4, 8]); }
    // os três geradores caem no palco, leem o relatório e os painéis (feixes) e escrevem
    AGX.forEach((g, i) => { const p = P(t, T_G[i] - .25, .25, E.inQuad); if (p <= 0) return;
      const land = P(t, T_G[i], .35), sq = land < 1 ? Math.sin(land * Math.PI) * (1 - land) * 1.6 : 0, y = lerp(GY[i] - 380, GY[i], p);
      const scanning = t > T_SCAN + i * .35 && t < T_TOVAL, think = t > T_BACK + .4 && t < T_DR2;
      if (scanning) { const tg = [[REP.x + REP.w, REP.y + 120], [DSH.x + DSH.w, DSH.y + 130], [REP.x + REP.w, REP.y + 40]][i], bp = P(t, T_SCAN + i * .35, .3), col = i === 2 ? C.cream : AGENT_STYLE[g.role].body;
        ctx.save(); const gr = ctx.createLinearGradient(GX, y, tg[0], tg[1]); gr.addColorStop(0, rgba(col, 0)); gr.addColorStop(1, rgba(col, .3 * bp)); ctx.beginPath(); ctx.moveTo(GX - 34, y - 10); ctx.lineTo(tg[0], tg[1] - 34); ctx.lineTo(tg[0], tg[1] + 34); ctx.lineTo(GX - 34, y + 10); ctx.closePath(); ctx.fillStyle = gr; ctx.fill(); ctx.restore(); }
      agent(ctx, GX, y, 44, { role: g.role, t: t + i, seed: i, squash: sq, look: scanning ? -1 : 0, think, theme: 'dark' });
      late(ctx, c => { c.globalAlpha *= clamp(p); text(c, g.name, GX, y + 76, { size: 22, weight: 900, color: '#FFF', align: 'center' }); }); });
    // rascunhos: vão ao Validador; reprovados voltam (pontos vermelhos); saem as versões 2
    AGX.forEach((g, i) => { const go1 = P(t, T_TOVAL + i * .08, .6, E.inOutCubic), back = P(t, T_BACK + i * .06, .6, E.inOutCubic);
      if (t < T_BACK) draft(ctx, lerp(CX, VX - 40, go1), lerp(GY[i], VY, go1), g.role, g.v1, P(t, T_DR[i], .9), { scale: lerp(1, .3, go1) });
      else if (t < T_DR2) circle(ctx, lerp(VX - 40, CX, back) + 20, lerp(VY, GY[i], back), 11, rgba(C.red, 1 - back));
      else { const go2 = P(t, T_TOVAL2 + i * .06, .55, E.inOutCubic); if (go2 < 1) draft(ctx, lerp(CX, VX - 40, go2), lerp(GY[i], VY, go2), g.role, g.v2, P(t, T_DR2, .5), { scale: lerp(1, .3, go2), tag: g.name + ' · v2', alpha: 1 - P(t, T_TOVAL2 + .45, .15) }); } });
    // Validador (reprova, depois aprova) e Embalador
    const vin = E.outBack(P(t, T_G[2] + .3, .4));
    if (vin > 0) { const verdict = t > T_NO && t < T_BACK + .7 ? 'no' : t > T_OK ? 'ok' : null, shake = t > T_NO && t < T_NO + .45 ? Math.sin(t * 70) * 6 : 0;
      if (verdict === 'no') glow(ctx, VX, VY, 150, C.red, .5 * (1 - P(t, T_NO, .8))); if (verdict === 'ok') glow(ctx, VX, VY, 150, C.yellow, .55 * (1 - P(t, T_OK, 1.2)));
      agent(ctx, VX + shake, VY, 56 * vin, { role: 'validador', t: t + 7, seed: 5, verdict, theme: 'dark' });
      late(ctx, c => { c.globalAlpha *= clamp(vin); text(c, 'Validador', VX, VY + 96, { size: 24, weight: 900, color: '#FFF', align: 'center' });
        const wa = win(t, T_NO + .1, T_DR2, .3, .3); if (wa > 0) { c.globalAlpha *= wa; tag(c, VX, VY + 146, WHY, { size: 22, fill: C.red, color: '#FFF' }); } }); }
    const pin = E.outBack(P(t, T_G[2] + .5, .4));
    if (pin > 0) { agent(ctx, PX, PY, 50 * pin, { role: 'embalador', t: t + 3, seed: 9, theme: 'dark', squash: t > T_WRAP && t < T_WRAP + .4 ? Math.sin(P(t, T_WRAP, .4) * Math.PI) * .5 : 0 });
      late(ctx, c => { c.globalAlpha *= clamp(pin); text(c, 'Embalador', PX, PY + 88, { size: 24, weight: 900, color: '#FFF', align: 'center' }); }); }
    // insight aprovado → Embalador → faixas de título no relatório (DESTAQUE) e no painel
    if (t > T_OK && t < T_WRAP) { const toP = P(t, T_TOPACK, .6, E.inOutCubic); draft(ctx, lerp(VX - 170, PX - 170, toP), lerp(VY + 190, PY + 170, toP), 'validador', SHORT, 1, { tag: 'insight aprovado', ok: true, scale: .82, alpha: P(t, T_OK, .3) }); }
    [[T_REP, REP.x + 14, REP.y + 35, REP.w - 28, 42], [T_DSH, DSH.x + 8, DSH.y + 32, DSH.w - 16, 44]].forEach(([t0, hx, hy, hw, hh]) => {
      if (t < T_WRAP || t > t0 + .8) return; const fly = P(t, t0, .75, E.inOutCubic), sw = lerp(300, hw, fly), sh = lerp(60, hh, fly);
      const sx = lerp(PX - 150, hx, fly), sy = lerp(PY + 160, hy, fly) - Math.sin(fly * Math.PI) * 200;
      ctx.save(); ctx.globalAlpha *= clamp(P(t, T_WRAP, .3) * 3) * (1 - P(t, t0 + .7, .1)); paper(ctx, sx, sy - sh / 2, sw, sh, { r: sh / 2, fill: C.orange, shadow: 5, shadowColor: '#000', lw: 2.5 });
      late(ctx, c => text(c, SHORT, sx + 20, sy + 1, { size: fitSize(c, SHORT, 18, sw - 40), weight: 800, color: '#FFF' })); ctx.restore(); });
    late(ctx, c => { c.globalAlpha *= P(t, T_GEN + 1, .5); text(c, 'exemplo ilustrativo', W - 96, 1000, { size: 20, weight: 700, mono: true, color: '#BFB3A3', align: 'right' }); });
    ctx.restore();
  }
  function quality(ctx, t) {
    const a = P(t, T_QUAL - .2, .5) * (1 - P(t, T_DROP - .3, .4)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const J = [[GR[0] || 'Regex', 'regras textuais', 'doc'], [GR[1] || 'BERT', 'modelo de linguagem', 'ai'], [SOL.algorithm || 'Random Forest', `nota de qualidade · ${SOL.nlp_features || 164} características do texto`, 'tree']];
    flowRow(ctx, 160, 560, 1760, J.map(([l, s, ic]) => ({ label: l, sub: s, icon: ic })), E.inOutSine(P(t, T_QUAL + .5, 3.2)), { bw: 300, bh: 170 });
    // o rascunho passa pelos avaliadores
    const u = clamp((t - T_QUAL - .7) / 4.2), x = lerp(160, 1700, E.inOutSine(u));
    if (u > 0 && u < 1) { ctx.save(); ctx.translate(x, 430 + Math.sin(t * 6) * 6); paper(ctx, -60, -40, 120, 80, { r: 6, fill: '#FFFDF8', shadow: 5, lw: 2.5 }); for (let l = 0; l < 3; l++) line(ctx, -40, -18 + l * 18, 30 - l * 12, -18 + l * 18, '#8A8378', 4); ctx.restore(); }
    // a nota (avaliação, não garantia)
    const g = E.outCubic(P(t, T_QUAL + 5.0, 1.2)); if (g > 0) hud(ctx, c => { c.translate(560, 830); panel(c, 0, 0, 800, 150, { dark: true });
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
      problem(ctx, t); stage(ctx, t); quality(ctx, t); wall(ctx, t); situation(ctx, t);
      CASEKIT.interstitial(ctx, t, 4, 'Um case de *agentes de IA*', 'que escrevem, avaliam e corrigem insights em escala', C.yellow, 2.6, { kicker: 'CASE 4 DE 4 · INSIGHT AGENT' });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();
