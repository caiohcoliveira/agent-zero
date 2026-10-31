/* ============================================================================
   21. TRECHO 1 ("Vintage Film Funk") — estações 01, 02, 03 + Parada 1
   Tudo marcado nos compassos da faixa: grid('s01').bars[n]
   ========================================================================== */

/* ---------- 01 · Analytics as a Strategic Consulting Capability ---------- */
(() => {
  const id = 's01', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const T_CIRC = bt(5), T_ENG = bt(7), T_CHAIN = bt(11), T_TAG = bt(13), T_INK = bt(14) + 1.2;
  const POST = TX.postits.map((q, i) => ({ q, x: 330 + (i % 4) * 420 + (i > 3 ? 160 : 0), y: i < 4 ? 330 : 640, rot: (hash(i * 3) - .5) * .16, col: [C.yellow, '#FFE9A8', C.orange, '#F6EEDF'][i % 4], at: bt(0) + i * (60 / BEATS.funk.bpm) }));
  const CHAIN_T = [T_CHAIN, T_CHAIN + (bt(12) - bt(11)) / 2, bt(12), bt(12) + (bt(13) - bt(12)) / 2];
  POST.forEach((p, i) => cue(id, p.at, 'pop', { p: .9 + i * .05, v: .14 }));
  cue(id, T_CIRC - .5, 'whoosh', { dur: .5, v: .35 }); cue(id, T_CIRC, 'impact', { size: .9 });
  TX.engagement.forEach((_, i) => cue(id, bt(7 + i), 'stab', { i }));
  CHAIN_T.forEach((t0, i) => cue(id, t0, 'hit', { size: .35 + i * .1 })); cue(id, T_TAG, 'chime', { f: 784, up: 7 });

  function cork(ctx, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    paper(ctx, 120, 190, W - 240, 760, { r: 18, fill: '#C49A6C', shadow: 14, lw: 5, halftone: .22 });
    const r = rng(9); ctx.fillStyle = 'rgba(70,40,15,.35)'; for (let k = 0; k < 900; k++) ctx.fillRect(130 + r() * (W - 260), 200 + r() * 740, 2, 2);
    inkRect(ctx, 120, 190, W - 240, 760, 18, 5, 4); ctx.restore();
  }
  function postit(ctx, p, i, t, blow) {
    const a = E.outBack(P(t, p.at, .35)); if (a <= 0) return;
    const bx = p.x + blow * (p.x - W / 2) * 1.6, by = p.y + blow * (p.y - H / 2) * 1.8 - blow * 200, rot = p.rot + blow * (i % 2 ? 2 : -2.4) + .03 * BT.snare * Math.sin(i + t * 8);
    ctx.save(); ctx.globalAlpha *= 1 - clamp(blow * 1.4); ctx.translate(bx, by); ctx.rotate(rot); ctx.scale(a, a);
    paper(ctx, -150, -95, 300, 190, { fill: p.col, shadow: 8, lw: 3, halftone: .08 });
    text(ctx, p.q, 0, 8, { size: 38, weight: 900, color: INK, align: 'center' });
    circle(ctx, 0, -78, 13, C.red); inkCircle(ctx, 0, -78, 13, 3, i); circle(ctx, -4, -82, 4, '#FFB4A8');
    ctx.restore();
  }
  function thread(ctx, t, blow) {
    const p = P(t, bt(2), bt(4) - bt(2)); if (p <= 0 || blow > .5) return;
    ctx.save(); ctx.globalAlpha *= 1 - blow * 2; ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.lineCap = 'round';
    const pts = [0, 1, 2, 3, 7, 6, 5, 4].map(i => [POST[i].x, POST[i].y - 78]), n = (pts.length - 1) * p;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k <= Math.ceil(n); k++) { const f = Math.min(1, n - (k - 1)), [x0, y0] = pts[k - 1], [x1, y1] = pts[k], mx = lerp(x0, x1, f), my = lerp(y0, y1, f);
      ctx.quadraticCurveTo((x0 + mx) / 2, Math.max(y0, my) + 60 * f, mx, my); }
    ctx.stroke(); ctx.restore();
  }
  function engagement(ctx, t, cy) {
    const n = TX.engagement.length, x0 = 330, dx = (W - 660) / (n - 1);
    const lp = P(t, T_ENG, bt(10) - T_ENG + 1.6); if (lp <= 0) return;
    const out = E.inCubic(P(t, T_CHAIN - .4, .6)); if (out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    // fio vermelho atravessando as fases
    ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 - 120, cy + 40);
    for (let x = x0 - 120; x <= lerp(x0 - 120, x0 + dx * (n - 1) + 120, lp); x += 12) ctx.lineTo(x, cy + 40 + Math.sin(x * .02 + t * 3) * 10);
    ctx.stroke(); ctx.restore();
    TX.engagement.forEach(([ph, verb], i) => {
      const a = E.outBack(P(t, bt(7 + i), .4)); if (a <= 0) return;
      const x = x0 + i * dx, s = a * (1 + .05 * BT.beat * (BT.i % 4 === i ? 1 : 0));
      ctx.save(); ctx.translate(x, cy); ctx.rotate([-.03, .02, -.015, .025][i]); ctx.scale(s, s);
      paper(ctx, -170, -80, 340, 160, { torn: true, seed: 20 + i, fill: '#F6EEDF', shadow: 10, lw: 3.5, tape: [[.5, 0, .1]] });
      text(ctx, ph, 0, -22, { size: 38, weight: 900, color: INK, align: 'center' });
      pill(ctx, 0, 36, verb, { size: 26, fill: [C.red, C.orange, C.yellow, C.red][i], color: i === 2 ? INK : '#FFF', weight: 800 });
      ctx.restore();
    });
    ctx.restore();
  }
  function chain(ctx, t) {
    const out = P(t, T_INK, .9); if (t < T_CHAIN) return;
    const words = TX.chain, x0 = 300, dx = (W - 600) / (words.length - 1), y = 560;
    words.forEach((w, i) => {
      const p = P(t, CHAIN_T[i], .3); if (p <= 0) return;
      const x = x0 + i * dx, s = lerp(1.8, 1, E.outExpo(p)) * (1 + .06 * BT.beat);
      if (i) { const ap = P(t, CHAIN_T[i] - .15, .3); line(ctx, x - dx + 150, y, lerp(x - dx + 150, x - 150, ap), y, INK, 8); if (ap > .9) arrowHead(ctx, x - 150, y, 0, 26, INK); }
      ctx.save(); ctx.translate(x, y); ctx.rotate([-.04, .03, -.02, .04][i]); ctx.scale(s, s);
      splat(ctx, 0, 0, 120, [C.red, C.orange, '#D98A00', C.red][i], 30 + i, E.outBack(p), .9);
      retroText(ctx, w, 0, 0, { size: 64, weight: 900, color: '#FFF', align: 'center', depth: 4, lw: 4 });
      ctx.restore();
    });
    const tp = P(t, T_TAG, .6);
    if (tp > 0) { ctx.save(); ctx.translate(W / 2, 830); ctx.rotate(-.015); brush(ctx, -640, -50, 1280, 100, INK, 61, E.outCubic(clamp(tp * 1.5)));
      rich(ctx, TX.tagline, 0, 2, { size: 52, weight: 900, color: '#FFF', accent: C.orange, alpha: clamp(tp * 2 - .3) }); ctx.restore(); }
    if (out > 0) { ctx.save(); ctx.fillStyle = '#120E0B'; ctx.beginPath(); ctx.arc(x0 + 3 * dx, y, E.inCubic(out) * 2400, 0, TAU); ctx.fill(); ctx.restore(); }
  }

  SCENES[id] = {
    themeAt: t => t > T_INK + .5 ? 'dark' : 'light', fx: { invert: true },
    draw(ctx, t) {
      bgLight(ctx, t);
      collage(ctx, t, { seed: 41, n: 7, theme: 'light', alpha: .8 });
      const blow = E.inCubic(P(t, T_CIRC - .1, .7));
      cork(ctx, 1 - blow);
      thread(ctx, t, blow);
      POST.forEach((p, i) => postit(ctx, p, i, t, blow));
      // círculos Negócio × Dados batem no drop e sobem para virar o selo
      const cp = P(t, T_CIRC - .45, .45, E.inQuad);
      if (cp > 0) {
        const up = E.inOutCubic(P(t, T_ENG - .6, .9)), R = lerp(250, 110, up), cy = lerp(H / 2 + 20, 200, up), d = lerp(2400, R * 1.25, cp) * (1 + .03 * BT.beat);
        if (t > T_CIRC) [[W / 2 - 360, cy + 80, 150, C.red], [W / 2 + 380, cy - 60, 170, C.yellow], [W / 2, cy + 220, 110, C.orange]]
          .forEach(([x, y, r, c], i) => splat(ctx, x, y, r * lerp(1, .5, up), c, 70 + i, E.outBack(P(t, T_CIRC + i * .05, .3)), .85 * (1 - P(t, T_CHAIN, .5))));
        const ca = 1 - P(t, T_CHAIN - .4, .5);
        intersection(ctx, W / 2, cy, R, d, { hot: Math.exp(-Math.max(0, t - T_CIRC) * 2.2) * (t > T_CIRC), labels: [TX.circleA, TX.circleB], labelA: P(t, T_CIRC + .3, .4) * (1 - up), alpha: ca });
        const la = P(t, T_CIRC + .5, .4) * (1 - up) * ca;
        if (la > 0) paintTitle(ctx, 'PERFORMANCE ANALYTICS', W / 2, cy + R + 90, { size: 64, p: la, seed: 12 });
      }
      engagement(ctx, t, 560);
      chain(ctx, t);
      scanlines(ctx, .03);
    }
  };
  POSTERS[1] = (ctx, w, h, tl) => {
    intersection(ctx, 0, -h / 2 + 90, 54, 70, { hot: .3 + .3 * Math.sin(tl * 2) });
    text(ctx, 'Da pergunta de negócio\nao valor medido.', 0, -h / 2 + 210, { size: 38, weight: 900, color: INK, align: 'center', lh: 1.15 });
    TX.chain.forEach((w, i) => { const y = -h / 2 + 310 + i * 64, on = Math.floor(tl * 1.2) % 4 === i;
      pill(ctx, 0, y, w, { size: 28, fill: on ? C.orange : '#FFF8EE', color: on ? '#FFF' : INK, weight: 900, scale: on ? 1.1 : 1 });
      if (i < 3) arrowHead(ctx, 0, y + 38, Math.PI / 2, 14, INK); });
  };
})();

/* ---------- 02 · Our Evolution & Business Impact ---------- */
(() => {
  const id = 's02', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const sec = () => SEC(2), REV = () => Object.entries(sec().revenue_performance_analytics_usd_millions || {});
  const T_BAR = [bt(1), bt(3), bt(5), bt(7)], T_HEAD = bt(8), T_BR = bt(10), T_BR2 = bt(11), T_Q = bt(12), T_PROOF = [bt(13), bt(13) + (bt(14) - bt(13)) / 2, bt(14)];
  T_BAR.forEach((t0, i) => { cue(id, t0, 'pop', { p: .8 + i * .15, v: .2 }); cue(id, t0, 'riser', { dur: .4, v: .12 }); });
  cue(id, T_HEAD, 'impact', { size: .8 }); cue(id, T_BR, 'hit', { size: .8 }); cue(id, T_BR2, 'hit', { size: .8 });
  T_PROOF.forEach((t0, i) => cue(id, t0, 'whoosh', { dur: .35, v: .25 }));

  function revenueChart(ctx, t, x, y, w, h, o = {}) {
    const rows = REV(); if (!rows.length) return;
    const max = Math.max(...rows.map(r => r[1])) * 1.15, bw = w / rows.length * .56, gap = w / rows.length;
    const growth = Object.values(sec().revenue_growth || {});
    rows.forEach(([k, v], i) => {
      const p = o.static ? 1 : E.outBack(P(t, T_BAR[i] || T_BAR[3], .5)); if (p <= 0) return;
      const fc = /forecast/i.test(k), bh = h * (v / max) * p * (1 + (o.static ? 0 : .025 * BT.beat)), bx = x + i * gap + (gap - bw) / 2, by = y + h - bh;
      if (fc) { ctx.save(); ctx.setLineDash([12, 10]); rr(ctx, bx, by, bw, bh, 6); ctx.strokeStyle = C.yellow; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
        hatch(ctx, () => rr(ctx, bx, by, bw, bh, 6), bx, by, bw, bh, { color: C.yellow, alpha: .35, gap: 14 }); }
      else { brush(ctx, bx, by, bw, bh, i === rows.length - 2 ? C.orange : mix(C.red, C.orange, i / 3), 80 + i, 1); inkRect(ctx, bx, by, bw, bh, 4, 4, i); }
      text(ctx, FMT.usdMM(v), bx + bw / 2, by - 30, { size: o.small ? 22 : 34, weight: 900, color: '#FFF', align: 'center' });
      text(ctx, fc ? k.replace('_forecast', ' (forecast)') : k, bx + bw / 2, y + h + 34, { size: o.small ? 18 : 26, weight: 800, mono: true, color: fc ? C.yellow : '#E9DDCC', align: 'center' });
      if (i && growth[i - 1] && !fc && !o.small) { const gp = P(t, T_BAR[i] + .3, .4); if (gp > 0) pill(ctx, bx - gap / 2 + bw / 2, by - 90, FMT.rel(growth[i - 1]), { size: 24, fill: C.yellow, weight: 900, alpha: gp, scale: E.outBack(gp), rot: -.04 }); }
    });
    line(ctx, x - 20, y + h, x + w + 20, y + h, '#FFF', 4);
  }
  function brazil(ctx, t, x, y) {
    const m = sec().brazil_2023_milestone || {}, a = P(t, T_BR - .2, .4); if (a <= 0 || !m.actuals_2023_usd_millions) return;
    const vsPrev = m.actuals_2023_usd_millions / m.actuals_2022_usd_millions, vsBud = m.actuals_2023_usd_millions / m.budget_2023_usd_millions;
    ctx.save(); ctx.globalAlpha *= a;
    paintTitle(ctx, 'BRASIL', x, y - 210, { size: 76, bg: C.red, seed: 21, p: P(t, T_BR - .2, .6) });
    [[vsPrev, 'vs. período anterior', T_BR], [vsBud, 'vs. budget', T_BR2]].forEach(([v, l, t0], i) => {
      const p = P(t, t0, .3); if (p <= 0) return; const s = lerp(1.8, 1, E.outExpo(p)) * (1 + .05 * BT.beat);
      ctx.save(); ctx.translate(x + (i ? 250 : -250), y - 40); ctx.scale(s, s); ctx.rotate(i ? .03 : -.03);
      splat(ctx, 0, -10, 120, i ? C.yellow : C.orange, 90 + i, 1, .9);
      retroText(ctx, FMT.mult(v), 0, -12, { size: 110, weight: 900, color: '#FFF', align: 'center', depth: 6, lw: 5 });
      text(ctx, l, 0, 74, { size: 28, weight: 800, color: '#FFF', align: 'center' }); ctx.restore();
    });
    // trimestres: realizado anterior × budget × realizado
    const q = m.quarterly_usd_millions || {}, qp = P(t, T_Q, 1.2); if (qp > 0) {
      const keys = Object.keys(q), mx = Math.max(...keys.flatMap(k => Object.values(q[k]))), qw = 140, qx = x - keys.length * qw / 2, qy = y + 300;
      keys.forEach((k, i) => { const v = q[k], vals = [['actuals_2022', '#8A8378'], ['budget_2023', null], ['actuals_2023', C.orange]];
        vals.forEach(([kk, col], j) => { const hh = 150 * (v[kk] / mx) * E.outCubic(clamp(qp * 2 - i * .2)), bx = qx + i * qw + j * 34 + 18, by = qy - hh;
          if (col) { rr(ctx, bx, by, 28, hh, 3); ctx.fillStyle = col; ctx.fill(); } else { ctx.save(); ctx.setLineDash([5, 5]); rr(ctx, bx, by, 28, hh, 3); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); } });
        text(ctx, k.replace('_preliminary', '*'), qx + i * qw + 70, qy + 26, { size: 20, weight: 800, mono: true, color: '#E9DDCC', align: 'center' }); });
      text(ctx, '■ realizado anterior   ▢ budget   ■ realizado', x, qy + 62, { size: 18, weight: 700, mono: true, color: '#BFB3A3', align: 'center', alpha: qp });
    }
    ctx.restore();
  }
  function proofs(ctx, t) {
    const sp = sec().scale_proof_points || {}, cards = [
      ['CLIENTE BANANA', C.yellow, [['clientes modelados', FMT.mm(dget(sp, 'cliente_banana_product_baskets.customers_modeled'))], ['subgrupos de SKU', FMT.num(dget(sp, 'cliente_banana_product_baskets.sku_subgroups', 0), 0)], ['interações', FMT.mm(dget(sp, 'cliente_banana_product_baskets.interactions'))]]],
      ['CLIENTE MANGA', C.orange, [['associados PF', FMT.mm(dget(sp, 'cliente_manga_principality.pf_associates'))], ['clusters look-alike', dget(sp, 'cliente_manga_principality.look_alike_clusters', '—')], ['desenvolvimento', String(dget(sp, 'cliente_manga_principality.development_duration', '—')).replace('weeks', 'semanas')]]],
      ['INSIGHT AGENT', C.red, [['adquirentes no pipeline', dget(sp, 'insight_agent.acquirers_pipeline', '—')], ['clientes + PoCs', dget(sp, 'insight_agent.clients_plus_pocs', '—')], ['projetos user-pay', dget(sp, 'insight_agent.user_pay_projects', '—')]]]
    ];
    cards.forEach(([title, col, rows], i) => {
      const p = E.outBack(P(t, T_PROOF[i], .45)); if (p <= 0) return;
      const x = 360 + i * 600, y = 640 + (1 - p) * 500;
      ctx.save(); ctx.translate(x, y); ctx.rotate([-.02, .015, -.01][i]);
      paper(ctx, -250, -200, 500, 400, { torn: true, seed: 100 + i, fill: '#F6EEDF', shadow: 12, shadowColor: '#000', lw: 4, tape: [[.2, 0, -.3], [.8, 0, .3]] });
      rr(ctx, -226, -176, 452, 64, 8); ctx.fillStyle = col; ctx.fill(); inkRect(ctx, -226, -176, 452, 64, 8, 3, i);
      text(ctx, title, 0, -143, { size: 30, weight: 900, color: col === C.yellow ? INK : '#FFF', align: 'center', ls: 2 });
      rows.forEach(([l, v], j) => { const yy = -60 + j * 100; retroText(ctx, String(v), 0, yy, { size: 54, weight: 900, color: C.orange, align: 'center', depth: 3, lw: 3 }); text(ctx, l, 0, yy + 42, { size: 22, weight: 700, color: '#4A4038', align: 'center' }); });
      ctx.restore();
    });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .85, center: '#2B1A10' });
      const toBR = E.inOutCubic(P(t, T_BR - .7, .8)), toProof = E.inOutCubic(P(t, T_PROOF[0] - .6, .7));
      neonGrid(ctx, t, { horizon: 860, alpha: .5 * (1 - toProof), speed: .5 + .5 * BT.level });
      collage(ctx, t, { seed: 47, n: 6, theme: 'dark', alpha: .55 });
      // receita: visual dominante, depois encolhe para a esquerda
      ctx.save(); ctx.globalAlpha *= 1 - toProof; ctx.translate(lerp(0, -560, toBR), lerp(0, 60, toBR)); ctx.translate(W / 2, H / 2); ctx.scale(lerp(1, .62, toBR), lerp(1, .62, toBR)); ctx.translate(-W / 2, -H / 2);
      revenueChart(ctx, t, 420, 330, 1080, 520);
      const hp = P(t, T_HEAD, .4);
      if (hp > 0) { const hl = HEADLINES(2)[0], rows = REV(), mult = rows.length > 2 ? rows[2][1] / rows[0][1] : null;
        ctx.save(); ctx.translate(W / 2, 205); ctx.scale(lerp(1.6, 1, E.outExpo(hp)), lerp(1.6, 1, E.outExpo(hp)));
        paintTitle(ctx, hl ? FMT.headline(hl) : '', 0, 0, { size: 66, bg: C.red, seed: 31, p: hp });
        if (mult) { const mp = P(t, T_HEAD + .5, .3); pill(ctx, 470, -50, FMT.mult(mult), { size: 44, fill: C.yellow, weight: 900, scale: E.outBack(mp), alpha: mp, rot: .06 }); }
        ctx.restore();
        if (mult) formula(ctx, `CAGR = (${FMT.num(rows[2][1] * 1e6, 0)} / ${FMT.num(rows[0][1] * 1e6, 0)})^(1/2) − 1 ≈ ${FMT.num((Math.sqrt(mult) - 1) * 100, 0)}%`, 1560, 930, { size: 18, rot: -.03, alpha: P(t, T_HEAD + 1, .5), seed: 5 }); }
      ctx.restore();
      ctx.save(); ctx.globalAlpha *= 1 - toProof; brazil(ctx, t, 1290, 440); ctx.restore();
      const ph = P(t, T_PROOF[0] - .3, .5); if (ph > 0) paintTitle(ctx, 'Escala de verdade', W / 2, 250, { size: 74, bg: C.red, seed: 44, p: ph });
      proofs(ctx, t);
      scanlines(ctx, .05);
    }
  };
  POSTERS[2] = (ctx, w, h, tl) => {
    revenueChart(ctx, 99, -w / 2 + 40, -h / 2 + 70, w - 80, 220, { static: true, small: true });
    const m = SEC(2).brazil_2023_milestone || {};
    if (m.actuals_2023_usd_millions) { text(ctx, 'BRASIL', 0, 120, { size: 30, weight: 900, color: C.red, align: 'center', ls: 6 });
      [[m.actuals_2023_usd_millions / m.actuals_2022_usd_millions, 'vs. anterior'], [m.actuals_2023_usd_millions / m.budget_2023_usd_millions, 'vs. budget']].forEach(([v, l], i) => {
        const x = i ? 110 : -110, s = 1 + .05 * Math.sin(tl * 2.4 + i * 1.5);
        ctx.save(); ctx.translate(x, 196); ctx.scale(s, s); retroText(ctx, FMT.mult(v), 0, 0, { size: 62, weight: 900, color: C.orange, align: 'center', depth: 3, lw: 3 }); ctx.restore();
        text(ctx, l, x, 248, { size: 20, weight: 700, color: '#4A4038', align: 'center' }); }); }
  };
})();

/* ---------- 03 · What We Bring to the Market ---------- */
(() => {
  const id = 's03', G = grid(id), B = G.bars, beats = G.beats, bt = k => B[Math.min(k, B.length - 1)];
  const T_CAP = bt(1), T_TIX = bt(6), T_TRK = bt(9), T_WAVE = bt(10), T_NEON = bt(12), T_INF = bt(17), T_FLAP = bt(17) + 1.6;
  const COLS = ['Emissores', 'Adquirentes', 'Merchants'], COL_X = [400, 960, 1520];
  const CASE_OF = ex => /Manga/i.test(ex) ? 'Cliente Manga' : /Banana/i.test(ex) ? 'Cliente Banana' : /Insight/i.test(ex) ? 'Insight Agent' : /Lights/i.test(ex) ? 'Lights-off' : ex;
  const TICK = [['Cliente Banana', 'BANANA', C.yellow], ['Cliente Manga', 'MANGA', C.orange], ['Lights-off', 'LIGHTS-OFF', '#F3EBDD'], ['Insight Agent', 'INSIGHT AGENT', C.red]];
  const colOf = cname => { const c = CASE(cname === 'Lights-off' ? 'Lights-off' : cname); const ct = (c.client_type || '').toLowerCase();
    if (ct) return COLS.findIndex(x => x.toLowerCase().startsWith(ct.slice(0, 4))); return { 'Cliente Manga': 0, 'Insight Agent': 1, 'Cliente Banana': 2 }[cname] ?? -1; };
  const WAVES = () => [...TX.waves.issuer.map(s => [s, 0]), ...TX.waves.acquirer.map(s => [s, 0]), ...TX.waves.analytics.map(s => [s, 1]), ...TX.waves.frontier.map(s => [s, 2])];
  cue(id, 0, 'impact', { size: 1.0 });
  for (let k = 0; k < 7; k++) cue(id, T_CAP + k * (beats[1] - beats[0]), 'pop', { p: .9 + k * .06, v: .16 });
  cue(id, T_TIX, 'whoosh', { dur: .5, v: .3 }); cue(id, T_WAVE, 'riser', { dur: 3, v: .2 }); cue(id, T_NEON, 'shimmer', { dur: 2 });
  cue(id, T_INF, 'chime', { f: 784, up: 12 }); cue(id, T_FLAP, 'type', { n: 24, gap: .025 }); cue(id, T_FLAP + 4.2, 'type', { n: 24, gap: .025 });

  function capLayout() {
    const caps = (SEC(3).capabilities_demonstrated_in_cases || []), per = [[], [], []], band = [];
    caps.forEach(c => { const cn = CASE_OF(c.example || ''), col = colOf(cn); (col >= 0 ? per[col] : band).push({ ...c, cn }); });
    return { per, band };
  }
  function signBoard(ctx, x, y, label, a) {
    if (a <= 0) return; const w = 400;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + (1 - E.outBack(a)) * -80);
    paper(ctx, -w / 2, -40, w, 80, { r: 14, fill: '#F3EBDD', shadow: 8, shadowColor: '#000', lw: 4 });
    intersection(ctx, -w / 2 + 50, 0, 18, 22); text(ctx, label.toUpperCase(), 24, 2, { size: 34, weight: 900, color: INK, align: 'center', ls: 4 });
    ctx.restore();
  }
  function capCard(ctx, c, x, y, a, i, wide) {
    if (a <= 0) return; const w = wide ? 1500 : 520, h = wide ? 92 : 160, tk = TICK.find(k => k[0] === c.cn) || TICK[0];
    ctx.save(); ctx.translate(x, y); ctx.rotate(wide ? .004 : [-.02, .015, -.01, .02][i % 4]); const s = E.outBack(a) * (1 + .035 * BT.beat * (BT.i % 7 === i ? 1 : 0)); ctx.scale(s, s);
    paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: 140 + i, fill: wide ? '#2A221C' : '#F6EEDF', shadow: 9, shadowColor: '#000', lw: 3 });
    const col = wide ? '#FFF' : INK;
    const name = wide ? c.capability : twoLines(c.capability), two = name.includes('\n');
    text(ctx, name, wide ? -w / 2 + 40 : 0, wide ? -10 : (two ? -36 : -26), { size: wide ? 30 : 26, weight: 900, color: col, align: wide ? 'left' : 'center', lh: 1.08 });
    if (c.methods) { const mt = c.methods.join(' · '), ms = Math.min(17, (w - 40) / mt.length * 1.75); text(ctx, mt, wide ? -w / 2 + 40 : 0, wide ? 24 : 22, { size: wide ? 18 : ms, weight: 600, mono: true, color: wide ? '#D8C9B6' : '#5A4F45', align: wide ? 'left' : 'center' }); }
    pill(ctx, wide ? w / 2 - 150 : 0, wide ? 0 : 56, tk[1], { size: 17, fill: tk[2], color: tk[2] === C.red ? '#FFF' : INK, weight: 900 });
    ctx.restore();
  }
  function tickets(ctx, t, a) {
    if (a <= 0) return;
    TICK.forEach(([cn, label, col], i) => { const x = 300 + i * 440, y = 1000, p = E.outBack(P(t, T_TIX + i * .15, .4)) * a; if (p <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.rotate([-.03, .02, -.02, .03][i]);
      paper(ctx, -170, -34, 340, 68, { r: 8, fill: col, shadow: 6, shadowColor: '#000', lw: 3 }); ctx.save(); ctx.setLineDash([6, 6]); line(ctx, 100, -30, 100, 30, INK, 2); ctx.restore();
      text(ctx, label, -30, 2, { size: 26, weight: 900, color: col === C.red ? '#FFF' : INK, align: 'center', ls: 2 }); icon(ctx, 'check', 136, 0, 26, col === C.red ? '#FFF' : INK, 8); ctx.restore(); });
  }
  function waves(ctx, t) {
    const list = WAVES(), step = (beats[1] - beats[0]) / 2, r = rng(77);
    list.forEach(([s, kind], i) => {
      const t0 = T_WAVE + i * step, p = P(t, t0, .25); if (p <= 0) return;
      const x = 140 + r() * (W - 280), y = 160 + r() * (H - 320), rot = (r() - .5) * .3, sz = kind === 2 ? 30 : 34;
      const conv = E.inCubic(P(t, T_INF - 1.2, 1.2)), cx = lerp(x, W / 2 + Math.cos(i) * 60, conv), cy = lerp(y, H / 2 + Math.sin(i) * 40, conv);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot * (1 - conv)); ctx.scale(E.outBack(p) * (1 - conv * .8), E.outBack(p) * (1 - conv * .8)); ctx.globalAlpha *= 1 - conv;
      const w = measure(ctx, s, sz, 900) + 60;
      if (kind === 2) { holo(ctx, -w / 2, -32, w, 64, { color: i % 2 ? C.yellow : C.orange, corners: false }); neonText(ctx, s, 0, 1, { size: sz, weight: 800, align: 'center', glow: i % 2 ? C.yellow : C.orange }); }
      else if (kind === 1) { brush(ctx, -w / 2, -30, w, 60, [C.orange, C.yellow, C.red][i % 3], 200 + i, 1); text(ctx, s, 0, 2, { size: sz, weight: 900, color: i % 3 === 1 ? INK : '#FFF', align: 'center' }); }
      else { paper(ctx, -w / 2, -30, w, 60, { r: 6, fill: '#F6EEDF', shadow: 6, shadowColor: '#000', lw: 3 }); text(ctx, s, 0, 2, { size: sz, weight: 900, color: INK, align: 'center' }); }
      ctx.restore();
    });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      const neon = P(t, T_NEON, 1.2, E.inOutCubic), wave = P(t, T_WAVE - .3, .6), inf = P(t, T_INF, .9, E.outCubic), flap = P(t, T_FLAP - .6, .8, E.inOutCubic);
      bgDark(ctx, t, { centerA: .85, center: '#2A1A10' });
      neonGrid(ctx, t, { horizon: 640, sun: 210, alpha: neon * (1 - flap), speed: .5 + BT.level });
      collage(ctx, t, { seed: 53, n: 6, theme: 'dark', alpha: .5 * (1 - neon) });
      // mapa de capabilities por tipo de cliente
      const mapA = 1 - E.inCubic(wave);
      if (mapA > 0) {
        ctx.save(); ctx.globalAlpha *= mapA;
        const L = capLayout(); let k = 0;
        COLS.forEach((c, i) => { signBoard(ctx, COL_X[i], 220, c, P(t, .2 + i * .25, .5)); line(ctx, COL_X[i], 262, COL_X[i], 800, rgba('#FFFFFF', .12), 4, [8, 10]); });
        L.per.forEach((list, ci) => list.forEach((c, j) => { const at = T_CAP + (k++) * (beats[1] - beats[0]); capCard(ctx, c, COL_X[ci], 370 + j * 178, P(t, at, .35), k); }));
        L.band.forEach((c, j) => { const at = T_CAP + (k++) * (beats[1] - beats[0]); capCard(ctx, c, W / 2, 900 - j * 100, P(t, at, .35), k, true); });
        tickets(ctx, t, 1);
        const tr = P(t, T_TRK, .5), others = SEC(3).other_tracks || [];
        if (tr > 0) { ctx.save(); ctx.translate(W / 2, 128); ctx.rotate(-.01); const label = others.length ? 'Analytics × ' + others.join(' · ') : 'Analytics complementa e potencializa as demais tracks';
          const w = measure(ctx, label, 26, 800) + 120; ctx.globalAlpha *= tr; brush(ctx, -w / 2, -26, w, 52, C.red, 300, E.outCubic(tr)); intersection(ctx, -w / 2 + 40, 0, 14, 17); text(ctx, label, 24, 2, { size: 26, weight: 800, color: '#FFF', align: 'center' }); ctx.restore(); }
        ctx.restore();
      }
      waves(ctx, t);
      // ∞ neon na saída da música → vira a baldeação e o letreiro da parada
      if (inf > 0) { const sh = E.inOutCubic(P(t, T_FLAP - .8, 1)), cy = lerp(H / 2, 300, sh), sz = lerp(lerp(160, 320, inf), 150, sh);
        ctx.save(); ctx.globalAlpha *= inf; glow(ctx, W / 2, cy, 520, C.orange, .5 + .2 * BT.level);
        if (sh < .6) neonText(ctx, '∞', W / 2, cy - 10, { size: sz, weight: 300, align: 'center', blur: 30 }); else intersection(ctx, W / 2, cy, 70, 90, { hot: .5 });
        ctx.restore(); }
      if (flap > 0) { ctx.save(); ctx.globalAlpha *= flap; FLAP.board(ctx, W / 2, 640, ['PARADA 1 · BALDEAÇÃO', 'PRÓXIMA PARTIDA · 04'], [T_FLAP, T_FLAP + 4.2], t, { tw: 52, th: 76, hiFrom: [10, 18], header: TX.stop.label, headerCol: C.orange }); ctx.restore(); }
      scanlines(ctx, .05 + .05 * neon);
    }
  };
  POSTERS[3] = (ctx, w, h, tl) => {
    const L = capLayout();
    COLS.forEach((c, i) => { const x = -w / 2 + 75 + i * (w - 150) / 2, n = L.per[i].length;
      text(ctx, c, x, -h / 2 + 90, { size: 22, weight: 900, color: INK, align: 'center' });
      const s = 1 + .08 * Math.sin(tl * 2 + i); ctx.save(); ctx.translate(x, -h / 2 + 170); ctx.scale(s, s); splat(ctx, 0, 0, 46, [C.red, C.orange, C.yellow][i], 9 + i, 1, .9);
      retroText(ctx, String(n), 0, 0, { size: 60, weight: 900, color: '#FFF', align: 'center', depth: 3, lw: 3 }); ctx.restore();
      text(ctx, n === 1 ? 'capability' : 'capabilities', x, -h / 2 + 240, { size: 16, weight: 700, color: '#4A4038', align: 'center' }); });
    if (L.band.length) text(ctx, '+ ' + L.band.map(c => c.capability).join(' · '), 0, -h / 2 + 300, { size: 20, weight: 800, color: INK, align: 'center' });
    text(ctx, '4 cases', 0, -h / 2 + 380, { size: 44, weight: 900, color: C.orange, align: 'center' });
    TICK.forEach(([, l, col], i) => pill(ctx, -w / 2 + 80 + i * (w - 160) / 3, -h / 2 + 450, l, { size: 14, fill: col, color: col === C.red ? '#FFF' : INK, weight: 900 }));
  };
})();

/* ---------- Parada 1: retomada do trecho 1 ---------- */
STOPSCN.stop1 = {
  draw(ctx, tl, item, prevItem, p) {
    recapStop(ctx, tl, item, prevItem, p, { posters: [1, 2, 3], sign: 'PARADA 1 · BALDEAÇÃO', from: CONFIG.sceneById.s03.end,
      doodles: [['star', 120, 300, 70, C.yellow], ['arrow', 1800, 280, 90, C.orange], ['crown', 1810, 820, 80, C.yellow], ['spiral', 110, 820, 70, C.red]] });
  }
};
