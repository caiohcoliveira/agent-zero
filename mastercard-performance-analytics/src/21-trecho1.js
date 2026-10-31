/* ============================================================================
   21. TRECHO 1 ("Vintage Film Funk") — estações 01, 02, 03 + Parada 1
   Tudo marcado nos compassos da faixa: grid('s01').bars[n]
   ========================================================================== */

/* ---------- 01 · Analytics as a Strategic Consulting Capability ---------- */
(() => {
  const id = 's01', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const T_Q = bt(4) - .2, T_CIRC = bt(5), T_ENG = bt(7), T_CHAIN = bt(11), T_TAG = bt(13), T_INK = bt(14) + 1.2;
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
    if (tp > 0) { ctx.save(); ctx.translate(W / 2, 820); ctx.rotate(-.015); ctx.scale(lerp(1.3, 1, E.outExpo(tp)), lerp(1.3, 1, E.outExpo(tp))); brush(ctx, -720, -64, 1440, 128, INK, 61, E.outCubic(clamp(tp * 1.5)));
      rich(ctx, TX.tagline, 0, 2, { size: 76, weight: 900, color: '#FFF', accent: C.orange, alpha: clamp(tp * 2 - .3) }); ctx.restore(); }
    if (out > 0) { ctx.save(); ctx.fillStyle = '#120E0B'; ctx.beginPath(); ctx.arc(x0 + 3 * dx, y, E.inCubic(out) * 2400, 0, TAU); ctx.fill(); ctx.restore(); }
  }

  SCENES[id] = {
    themeAt: t => t > T_INK + .5 ? 'dark' : 'light', fx: { invert: true },
    peaks: [[T_CIRC - .2, T_CIRC + 1.6], [T_TAG - .1, T_TAG + 1.4]],
    caps: [[1.2, T_Q - .2, 'Todo dia, nossos clientes chegam com *perguntas de negócio* como estas', 'O PONTO DE PARTIDA'],
      [T_CIRC + .4, T_ENG - .3, 'A resposta: quem une o *negócio* aos *dados* — Performance Analytics', 'A RESPOSTA'],
      [T_ENG + .2, T_CHAIN - .5, 'Nossos serviços cobrem o ciclo todo: *diagnóstico, estratégia, implementação e mensuração*', 'NOSSOS SERVIÇOS'],
      [T_CHAIN + .2, T_TAG - .2, 'O caminho até o valor: *dados* viram decisões, decisões viram impacto, impacto vira *valor*', 'O CAMINHO DO VALOR']],
    draw(ctx, t) {
      bgLight(ctx, t);
      collage(ctx, t, { seed: 41, n: 7, theme: 'light', alpha: .8 });
      const blow = E.inCubic(P(t, T_CIRC - .1, .7));
      cork(ctx, 1 - blow);
      thread(ctx, t, blow);
      POST.forEach((p, i) => postit(ctx, p, i, t, blow));
      // a pergunta que fecha o mural
      const qa = P(t, T_Q, .5) * (1 - P(t, T_CIRC - .25, .2));
      if (qa > 0) { ctx.save(); ctx.fillStyle = rgba('#120E0B', .45 * qa); ctx.fillRect(0, 0, W, H); ctx.translate(W / 2, H / 2 - 10); ctx.rotate(-.02); const s = lerp(1.4, 1, E.outExpo(qa)); ctx.scale(s, s);
        paintTitle(ctx, TX.question, 0, 0, { size: 92, bg: C.red, seed: 19, p: qa }); ctx.restore(); }
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

/* ---------- 02 · Nossa evolução e o impacto no negócio ---------- */
(() => {
  const id = 's02', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const sec = () => SEC(2), REV = () => Object.entries(sec().revenue_performance_analytics_usd_millions || {});
  const T_BAR = [bt(1), bt(3), bt(5), bt(7)], T_HEAD = bt(8), T_BR = bt(10), T_BR2 = bt(11), T_Q = bt(12), T_CONC = bt(13) + .2, T_BRIDGE = bt(15) - .4;
  T_BAR.forEach((t0, i) => { cue(id, t0, 'pop', { p: .8 + i * .15, v: .2 }); cue(id, t0, 'riser', { dur: .4, v: .12 }); });
  cue(id, T_HEAD, 'impact', { size: .8 }); cue(id, T_BR, 'hit', { size: .8 }); cue(id, T_BR2, 'hit', { size: .8 });
  cue(id, T_CONC, 'chime', { f: 784, up: 7 }); cue(id, T_BRIDGE, 'whoosh', { dur: .8, v: .3 });
  // números de tela tirados do JSON (as legendas acompanham o que estiver lá)
  const rows0 = REV(), MULT = rows0.length > 2 ? rows0[2][1] / rows0[0][1] : null, BR = sec().brazil_2023_milestone || {};
  const VS_PREV = BR.actuals_2022_usd_millions ? BR.actuals_2023_usd_millions / BR.actuals_2022_usd_millions : null, VS_BUD = BR.budget_2023_usd_millions ? BR.actuals_2023_usd_millions / BR.budget_2023_usd_millions : null;
  const QS = Object.values(BR.quarterly_usd_millions || {}), QUP = QS.filter(q => q.actuals_2023 > q.budget_2023).length;
  const yr = k => /forecast/i.test(k) ? k.replace(/_forecast/i, '') + ' (previsão)' : k;

  function revenueChart(ctx, t, x, y, w, h, o = {}) {
    const rows = REV(); if (!rows.length) return;
    const max = Math.max(...rows.map(r => r[1])) * 1.15, bw = w / rows.length * .56, gap = w / rows.length;
    const growth = Object.values(sec().revenue_growth || {});
    rows.forEach(([k, v], i) => {
      const p = o.static ? 1 : E.outBack(P(t, T_BAR[i] || T_BAR[3], .5)); if (p <= 0) return;
      const fc = /forecast/i.test(k), bh = h * (v / max) * p, bx = x + i * gap + (gap - bw) / 2, by = y + h - bh;
      if (fc) { ctx.save(); ctx.setLineDash([12, 10]); rr(ctx, bx, by, bw, bh, 6); ctx.strokeStyle = C.yellow; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
        hatch(ctx, () => rr(ctx, bx, by, bw, bh, 6), bx, by, bw, bh, { color: C.yellow, alpha: .35, gap: 14 }); }
      else { brush(ctx, bx, by, bw, bh, i === rows.length - 2 ? C.orange : mix(C.red, C.orange, i / 3), 80 + i, 1); inkRect(ctx, bx, by, bw, bh, 4, 4, i); }
      text(ctx, FMT.usdMM(v), bx + bw / 2, by - 30, { size: o.small ? 22 : 34, weight: 900, color: o.small ? INK : '#FFF', align: 'center' });
      text(ctx, yr(k), bx + bw / 2, y + h + 34, { size: o.small ? 17 : 26, weight: 800, mono: true, color: fc ? (o.small ? '#B07A00' : C.yellow) : (o.small ? '#4A4038' : '#E9DDCC'), align: 'center' });
      if (i && growth[i - 1] && !fc && !o.small) { const gp = P(t, T_BAR[i] + .3, .4); if (gp > 0) pill(ctx, bx - gap / 2 + bw / 2, by - 90, FMT.rel(growth[i - 1]) + ' no ano', { size: 22, fill: C.yellow, weight: 900, alpha: gp, scale: E.outBack(gp), rot: -.04 }); }
    });
    line(ctx, x - 20, y + h, x + w + 20, y + h, o.small ? INK : '#FFF', 4);
  }
  function chartTitle(ctx, t) {
    const p = P(t, .3, .6); if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= p; ctx.translate(W / 2, 175 + (1 - E.outBack(p)) * -30);
    paintTitle(ctx, 'Evolução do faturamento da track', 0, 0, { size: 62, bg: C.red, seed: 31, p, splat: false });
    text(ctx, 'Performance Analytics · receita anual em US$', 0, 70, { size: 28, weight: 800, mono: true, color: '#F3E6D6', align: 'center', ls: 2 });
    ctx.restore();
  }
  function brazil(ctx, t, x, y) {
    const a = P(t, T_BR - .2, .4); if (a <= 0 || !VS_PREV) return;
    ctx.save(); ctx.globalAlpha *= a;
    paintTitle(ctx, 'BRASIL', x, y - 220, { size: 76, bg: C.red, seed: 21, p: P(t, T_BR - .2, .6) });
    text(ctx, 'faturamento do período de referência', x, y - 150, { size: 24, weight: 800, mono: true, color: '#F3E6D6', align: 'center' });
    [[VS_PREV, 'o período anterior', T_BR], [VS_BUD, 'o orçamento', T_BR2]].forEach(([v, l, t0], i) => {
      const p = P(t, t0, .3); if (p <= 0 || !v) return; const s = lerp(1.8, 1, E.outExpo(p));
      ctx.save(); ctx.translate(x + (i ? 250 : -250), y - 20); ctx.scale(s, s); ctx.rotate(i ? .03 : -.03);
      splat(ctx, 0, -10, 120, i ? C.yellow : C.orange, 90 + i, 1, .9);
      retroText(ctx, FMT.mult(v), 0, -12, { size: 110, weight: 900, color: '#FFF', align: 'center', depth: 6, lw: 5 });
      text(ctx, l, 0, 74, { size: 28, weight: 800, color: '#FFF', align: 'center' }); ctx.restore();
    });
    // trimestres: realizado anterior × orçamento × realizado
    const q = BR.quarterly_usd_millions || {}, qp = P(t, T_Q, 1.2); if (qp > 0) {
      const keys = Object.keys(q), mx = Math.max(...keys.flatMap(k => Object.values(q[k]))), qw = 140, qx = x - keys.length * qw / 2, qy = y + 300;
      keys.forEach((k, i) => { const v = q[k], vals = [['actuals_2022', '#8A8378'], ['budget_2023', null], ['actuals_2023', C.orange]];
        vals.forEach(([kk, col], j) => { const hh = 150 * (v[kk] / mx) * E.outCubic(clamp(qp * 2 - i * .2)), bx = qx + i * qw + j * 34 + 18, by = qy - hh;
          if (col) { rr(ctx, bx, by, 28, hh, 3); ctx.fillStyle = col; ctx.fill(); } else { ctx.save(); ctx.setLineDash([5, 5]); rr(ctx, bx, by, 28, hh, 3); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); } });
        text(ctx, k.replace('_preliminary', '*'), qx + i * qw + 70, qy + 26, { size: 20, weight: 800, mono: true, color: '#E9DDCC', align: 'center' }); });
      text(ctx, '■ realizado anterior   ▢ orçamento   ■ realizado', x, qy + 62, { size: 18, weight: 700, mono: true, color: '#BFB3A3', align: 'center', alpha: qp });
    }
    ctx.restore();
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_HEAD - .1, T_HEAD + 1.2], [T_BR - .1, T_BR2 + 1.4]],
    caps: [[.8, T_HEAD - .2, 'Cada barra é o *faturamento anual* da track Performance Analytics, em US$', 'O GRÁFICO'],
      [T_HEAD + .2, T_BR - .8, MULT ? `De ${rows0[0][0]} a ${rows0[2][0]} o faturamento *cresceu ${FMT.mult(MULT)}* · ${yr(rows0[rows0.length - 1][0])}` : 'O faturamento da track cresceu ano a ano', 'CRESCIMENTO'],
      [T_BR + .1, T_Q - .1, VS_PREV ? `Brasil: *${FMT.mult(VS_PREV)}* o período anterior e *${FMT.mult(VS_BUD)}* o orçamento` : 'Brasil: acima do período anterior e do orçamento', 'MARCO DO BRASIL'],
      [T_Q + .1, T_CONC - .2, QS.length ? (QUP === QS.length ? 'Em *todos os trimestres* o realizado superou o orçamento' : `Em *${QUP} de ${QS.length} trimestres* o realizado superou o orçamento`) : 'Trimestre a trimestre', 'TRIMESTRES']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .85, center: '#2B1A10' });
      const toBR = E.inOutCubic(P(t, T_BR - .7, .8)), conc = P(t, T_CONC, .6), bridge = P(t, T_BRIDGE, .7);
      neonGrid(ctx, t, { horizon: 860, alpha: .5, speed: .5 + .5 * BT.level });
      collage(ctx, t, { seed: 47, n: 6, theme: 'dark', alpha: .55 });
      // receita: visual dominante com título; depois encolhe para a esquerda e o Brasil entra
      ctx.save(); ctx.translate(lerp(0, -560, toBR), lerp(0, 60, toBR)); ctx.translate(W / 2, H / 2); ctx.scale(lerp(1, .62, toBR), lerp(1, .62, toBR)); ctx.translate(-W / 2, -H / 2);
      chartTitle(ctx, t);
      revenueChart(ctx, t, 420, 330, 1080, 520);
      const hp = P(t, T_HEAD, .4);
      if (hp > 0 && MULT) { ctx.save(); ctx.globalAlpha *= 1 - toBR; ctx.translate(250, 470); ctx.rotate(-.05); const s = lerp(2, 1, E.outExpo(hp)); ctx.scale(s, s);
        splat(ctx, 0, -6, 105, C.yellow, 33, 1, .95); retroText(ctx, FMT.mult(MULT), 0, -10, { size: 100, weight: 900, color: '#FFF', align: 'center', depth: 6, lw: 5 });
        text(ctx, 'em 2 anos', 0, 66, { size: 28, weight: 800, color: '#FFF', align: 'center' }); text(ctx, `${rows0[0][0]} → ${rows0[2][0]}`, 0, 100, { size: 22, weight: 800, mono: true, color: '#FFE9D6', align: 'center' }); ctx.restore(); }
      ctx.restore();
      brazil(ctx, t, 1290, 440);
      // conclusão da estação
      if (conc > 0) { ctx.save(); ctx.fillStyle = rgba('#120E0B', .72 * conc); ctx.fillRect(0, 0, W, H); ctx.globalAlpha *= conc; ctx.translate(W / 2, H / 2); ctx.rotate(-.015);
        const s = lerp(1.3, 1, E.outExpo(conc)); ctx.scale(s, s); brush(ctx, -820, -150, 1640, 300, '#2A1E15', 77, E.outCubic(clamp(conc * 1.5)));
        rich(ctx, 'Crescimento *consistente*,', 0, -50, { size: 84, weight: 900, color: '#FFF', accent: C.orange, retro: true, depth: 5, lw: 4 });
        rich(ctx, 'acima do *planejado*.', 0, 60, { size: 84, weight: 900, color: '#FFF', accent: C.yellow, retro: true, depth: 5, lw: 4 }); ctx.restore(); }
      // conexão com a estação 03
      bridgeCard(ctx, bridge, 'PRÓXIMA ESTAÇÃO · 03', 'E o que levamos para o *mercado*?', { t, sub: 'projetos, capabilities e modelos para nossos clientes' });
      scanlines(ctx, .05);
    }
  };
  POSTERS[2] = (ctx, w, h, tl) => {
    text(ctx, 'Faturamento anual da track (US$)', 0, -h / 2 + 50, { size: 22, weight: 900, color: INK, align: 'center' });
    revenueChart(ctx, 99, -w / 2 + 40, -h / 2 + 110, w - 80, 200, { static: true, small: true });
    if (VS_PREV) { text(ctx, 'BRASIL', 0, 130, { size: 30, weight: 900, color: C.red, align: 'center', ls: 6 });
      [[VS_PREV, 'vs. anterior'], [VS_BUD, 'vs. orçamento']].forEach(([v, l], i) => {
        const x = i ? 110 : -110, s = 1 + .05 * Math.sin(tl * 2.4 + i * 1.5);
        ctx.save(); ctx.translate(x, 200); ctx.scale(s, s); retroText(ctx, FMT.mult(v), 0, 0, { size: 62, weight: 900, color: C.orange, align: 'center', depth: 3, lw: 3 }); ctx.restore();
        text(ctx, l, x, 252, { size: 20, weight: 700, color: '#4A4038', align: 'center' }); }); }
  };
})();

/* ---------- 03 · O que levamos ao mercado ---------- */
(() => {
  const id = 's03', G = grid(id), B = G.bars, beats = G.beats, bt = k => B[Math.min(k, B.length - 1)], BEAT_S = beats[1] - beats[0];
  const T_CAP = bt(1), T_HEAD = 4.3, T_TIX = bt(6), T_TRK = bt(9), T_WAVE = bt(10), T_INF = bt(17), T_FLAP = bt(17) + 1.6;
  const COLS = ['Emissores', 'Adquirentes', 'Varejo'], COL_X = [400, 960, 1520];
  const CASE_OF = ex => /Manga/i.test(ex) ? 'Cliente Manga' : /Banana/i.test(ex) ? 'Cliente Banana' : /Insight/i.test(ex) ? 'Insight Agent' : /Lights/i.test(ex) ? 'Lights-off' : ex;
  const TICK = [['Cliente Banana', 'BANANA', C.yellow], ['Cliente Manga', 'MANGA', C.orange], ['Lights-off', 'LIGHTS-OFF', '#F3EBDD'], ['Insight Agent', 'INSIGHT AGENT', C.red]];
  const colOf = cname => { const c = CASE(cname === 'Lights-off' ? 'Lights-off' : cname); const ct = (c.client_type || '').toLowerCase();
    if (ct) { const j = COLS.findIndex(x => x.toLowerCase().startsWith(ct.slice(0, 4))); if (j >= 0) return j; if (/merch|varej/.test(ct)) return 2; }
    return { 'Cliente Manga': 0, 'Insight Agent': 1, 'Cliente Banana': 2 }[cname] ?? -1; };
  const ML = TX.ml, ML_ALL = [...ML.pred.map((r, i) => [r, 0, i]), ...ML.presc.map((r, i) => [r, 1, i])].sort((a, b) => a[2] - b[2] || a[1] - b[1]);
  cue(id, 0, 'impact', { size: .7 });
  for (let k = 0; k < 7; k++) cue(id, T_CAP + k * BEAT_S, 'pop', { p: .9 + k * .06, v: .16 });
  cue(id, T_TIX, 'chime', { f: 1046, up: 5 }); cue(id, T_WAVE, 'riser', { dur: 3, v: .18 }); ML_ALL.forEach((_, k) => { if (k % 2 === 0) cue(id, T_WAVE + .3 + k * BEAT_S / 2, 'tick', {}); });
  cue(id, T_INF, 'chime', { f: 784, up: 12 }); cue(id, T_FLAP, 'type', { n: 24, gap: .025 }); cue(id, T_FLAP + 4.2, 'type', { n: 24, gap: .025 });

  function capLayout() {
    const caps = (SEC(3).capabilities_demonstrated_in_cases || []), per = [[], [], []], band = [];
    caps.forEach(c => { const cn = CASE_OF(c.example || ''), col = colOf(cn); (col >= 0 ? per[col] : band).push({ ...c, cn }); });
    return { per, band };
  }
  const capName = c => TX.capPT[c.capability] || c.capability, meth = c => (c.methods || []).map(m => TX.methodPT[m] || m).join(' · ');
  function signBoard(ctx, x, y, label, a) {
    if (a <= 0) return; const w = 400;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + (1 - E.outBack(a)) * -80);
    paper(ctx, -w / 2, -40, w, 80, { r: 14, fill: '#F3EBDD', shadow: 8, shadowColor: '#000', lw: 4 });
    intersection(ctx, -w / 2 + 50, 0, 18, 22); text(ctx, label.toUpperCase(), 24, 2, { size: 34, weight: 900, color: INK, align: 'center', ls: 4 });
    ctx.restore();
  }
  function capCard(ctx, c, x, y, a, i, wide, hot) {
    if (a <= 0) return; const w = wide ? 1500 : 520, h = wide ? 92 : 150, tk = TICK.find(k => k[0] === c.cn) || TICK[0];
    ctx.save(); ctx.translate(x, y); ctx.rotate(wide ? .004 : [-.02, .015, -.01, .02][i % 4]); const s = E.outBack(a); ctx.scale(s, s);
    paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: 140 + i, fill: wide ? '#2A221C' : '#F6EEDF', shadow: 9, shadowColor: '#000', lw: 3 });
    const col = wide ? '#FFF' : INK, nm = capName(c), name = wide ? nm : (measure(ctx, nm, 26, 900) > w - 40 ? twoLines(nm) : nm), two = name.includes('\n');
    text(ctx, name, wide ? -w / 2 + 40 : 0, wide ? -10 : (two ? -32 : -22), { size: wide ? 30 : 26, weight: 900, color: col, align: wide ? 'left' : 'center', lh: 1.08 });
    const mt = meth(c); if (mt) { const ms = Math.min(17, (w - 40) / mt.length * 1.75); text(ctx, mt, wide ? -w / 2 + 40 : 0, wide ? 24 : 22, { size: wide ? 18 : ms, weight: 600, mono: true, color: wide ? '#D8C9B6' : '#5A4F45', align: wide ? 'left' : 'center' }); }
    const hs = 1 + (hot ? .18 * Math.max(0, Math.sin(NOW * 5)) : 0); if (hot) glow(ctx, wide ? w / 2 - 150 : 0, wide ? 0 : 52, 80, tk[2], .5);
    pill(ctx, wide ? w / 2 - 150 : 0, wide ? 0 : 52, 'case · ' + tk[1], { size: 17, fill: tk[2], color: tk[2] === C.red ? '#FFF' : INK, weight: 900, scale: hs });
    ctx.restore();
  }
  /** grade de casos de ML: preditivos × prescritivos (bancos e fintechs) */
  function mlGrid(ctx, t) {
    const conv = E.inCubic(P(t, T_INF - 1.2, 1.2)); if (t < T_WAVE - .3 || conv >= 1) return;
    const head = P(t, T_WAVE - .3, .5);
    ctx.save(); ctx.globalAlpha *= 1 - conv;
    ctx.save(); ctx.globalAlpha *= head; ctx.translate(W / 2, 150); ctx.rotate(-.01); brush(ctx, -700, -50, 1400, 100, '#2A1E15', 88, E.outCubic(head));
    rich(ctx, 'Modelos que levamos a *bancos e fintechs*', 0, 2, { size: 56, weight: 900, color: '#FFF', accent: C.orange }); ctx.restore();
    [[0, 'PREDITIVOS', 'antecipam o que vai acontecer', C.red], [1, 'PRESCRITIVOS', 'recomendam o que fazer', C.orange]].forEach(([k, lab, sub, col]) => {
      const x0 = k ? 990 : 110, pa = P(t, T_WAVE + k * .2, .5); if (pa <= 0) return;
      ctx.save(); ctx.globalAlpha *= pa; ctx.translate(lerp(W / 2, x0, E.outCubic(pa)) - x0, 0);
      paper(ctx, x0, 225, 820, 70, { r: 10, fill: col, shadow: 6, shadowColor: '#000', lw: 3 });
      text(ctx, lab, x0 + 30, 261, { size: 34, weight: 900, color: '#FFF', ls: 3 }); text(ctx, sub, x0 + 790, 262, { size: 24, weight: 700, color: '#FFF', align: 'right' });
      ctx.restore(); });
    ML_ALL.forEach(([r, k, i], n) => {
      const p = P(t, T_WAVE + .3 + n * BEAT_S / 2, .3); if (p <= 0) return;
      const x0 = k ? 990 : 110, y = 335 + i * 61, ix = lerp(W / 2, x0 + 410, E.outBack(p)) - (x0 + 410), cx = W / 2 + Math.cos(n) * 60, cy = H / 2 + Math.sin(n) * 40;
      ctx.save(); ctx.translate(lerp(x0 + 410 + ix, cx, conv), lerp(y, cy, conv)); ctx.scale(1 - conv * .8, 1 - conv * .8); ctx.rotate((hash(n * 3) - .5) * .02);
      paper(ctx, -410, -26, 820, 52, { r: 8, fill: '#F6EEDF', shadow: 5, shadowColor: '#000', lw: 2.5 });
      text(ctx, r[0], -385, 1, { size: 25, weight: 800, color: INK });
      const tw = measure(ctx, r[1], 16, 700, true) + 24; rr(ctx, 395 - tw, -15, tw, 30, 15); ctx.fillStyle = k ? rgba(C.orange, .2) : rgba(C.red, .16); ctx.fill();
      text(ctx, r[1], 395 - tw / 2, 1, { size: 16, weight: 700, mono: true, color: k ? '#9A4A10' : '#9A1020', align: 'center' });
      ctx.restore(); });
    ctx.restore();
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_WAVE - .1, T_WAVE + 1, .6], [T_INF - .1, T_INF + 1.8]],
    caps: [[T_HEAD + .1, T_TIX - .2, 'Alguns de nossos *últimos projetos*, por tipo de cliente: emissores, adquirentes e varejo', 'PROJETOS RECENTES'],
      [T_TIX + .1, T_TRK - .2, 'Cada projeto prova uma *capability* — os 4 em destaque são os cases da estação 04', 'CAPABILITIES'],
      [T_TRK + .1, T_WAVE - .2, 'Analytics *complementa e potencializa* as demais tracks', 'COM AS OUTRAS TRACKS'],
      [T_WAVE + .4, T_WAVE + 7.4, '*Preditivos* antecipam o que vai acontecer · *prescritivos* recomendam o que fazer', 'MACHINE LEARNING'],
      [T_WAVE + 7.6, T_INF - .3, ML.frontier, 'FRONTEIRA'],
      [T_INF + .2, T_FLAP - .3, 'Com dados, as possibilidades são *infinitas*', 'POSSIBILIDADES'],
      [T_FLAP + .4, 48.6, 'Primeira parada: conversa sobre as estações *01, 02 e 03*', 'PARADA 1']],
    draw(ctx, t) {
      const neon = P(t, T_WAVE - .3, 1.2, E.inOutCubic), wave = P(t, T_WAVE - .3, .6), inf = P(t, T_INF, .9, E.outCubic), flap = P(t, T_FLAP - .6, .8, E.inOutCubic);
      bgDark(ctx, t, { centerA: .85, center: '#2A1A10' });
      neonGrid(ctx, t, { horizon: 640, sun: 210, alpha: neon * (1 - flap) * .6, speed: .5 + BT.level });
      collage(ctx, t, { seed: 53, n: 6, theme: 'dark', alpha: .5 * (1 - neon) });
      // mapa de projetos por tipo de cliente
      const mapA = 1 - E.inCubic(wave);
      if (mapA > 0) {
        ctx.save(); ctx.globalAlpha *= mapA;
        const hp = P(t, T_HEAD, .6); if (hp > 0) paintTitle(ctx, 'Alguns de nossos últimos projetos', W / 2, 150, { size: 60, bg: C.red, seed: 61, p: hp });
        const L = capLayout(); let k = 0, hot = t > T_TIX;
        COLS.forEach((c, i) => { signBoard(ctx, COL_X[i], 270, c, P(t, .2 + i * .25, .5)); line(ctx, COL_X[i], 312, COL_X[i], 840, rgba('#FFFFFF', .12), 4, [8, 10]); });
        L.per.forEach((list, ci) => list.forEach((c, j) => { const at = T_CAP + (k++) * BEAT_S; capCard(ctx, c, COL_X[ci], 400 + j * 168, P(t, at, .35), k, false, hot); }));
        L.band.forEach((c, j) => { const at = T_CAP + (k++) * BEAT_S; capCard(ctx, c, W / 2, 893 - j * 100, P(t, at, .35), k, true, hot); });
        const tr = P(t, T_TRK, .5), others = SEC(3).other_tracks || [];
        if (tr > 0) { ctx.save(); ctx.globalAlpha *= tr; ctx.fillStyle = rgba('#120E0B', .55); ctx.fillRect(0, 0, W, H); ctx.translate(W / 2, H / 2); ctx.rotate(-.01); const label = others.length ? 'Analytics × ' + others.join(' · ') : 'Analytics complementa e potencializa as demais tracks';
          const s = lerp(1.3, 1, E.outExpo(tr)); ctx.scale(s, s); const w = measure(ctx, label, 46, 900) + 160; brush(ctx, -w / 2, -48, w, 96, C.red, 300, E.outCubic(tr)); intersection(ctx, -w / 2 + 60, 0, 22, 26); text(ctx, label, 34, 2, { size: 46, weight: 900, color: '#FFF', align: 'center' }); ctx.restore(); }
        ctx.restore();
      }
      mlGrid(ctx, t);
      // ∞ neon na saída da música → vira a baldeação e o letreiro da parada
      if (inf > 0) { const sh = E.inOutCubic(P(t, T_FLAP - .8, 1)), cy = lerp(H / 2, 300, sh), sz = lerp(lerp(160, 320, inf), 150, sh);
        ctx.save(); ctx.globalAlpha *= inf; glow(ctx, W / 2, cy, 520, C.orange, .5 + .2 * BT.level);
        if (sh < .6) neonText(ctx, '∞', W / 2, cy - 10, { size: sz, weight: 300, align: 'center', blur: 30 }); else intersection(ctx, W / 2, cy, 70, 90, { hot: .5 });
        ctx.restore(); }
      if (flap > 0) { ctx.save(); ctx.globalAlpha *= flap; FLAP.board(ctx, W / 2, 640, ['PARADA 1 · BALDEAÇÃO', 'HORA DA CONVERSA      '], [T_FLAP, T_FLAP + 4.2], t, { tw: 52, th: 76, hiFrom: [10, 0], header: TX.stop.label, headerCol: C.orange }); ctx.restore(); }
      scanlines(ctx, .05 + .05 * neon);
    }
  };
  POSTERS[3] = (ctx, w, h, tl) => {
    const L = capLayout();
    text(ctx, 'Projetos recentes por cliente', 0, -h / 2 + 40, { size: 22, weight: 900, color: INK, align: 'center' });
    COLS.forEach((c, i) => { const x = -w / 2 + 75 + i * (w - 150) / 2, n = L.per[i].length;
      text(ctx, c, x, -h / 2 + 90, { size: 22, weight: 900, color: INK, align: 'center' });
      const s = 1 + .08 * Math.sin(tl * 2 + i); ctx.save(); ctx.translate(x, -h / 2 + 165); ctx.scale(s, s); splat(ctx, 0, 0, 44, [C.red, C.orange, C.yellow][i], 9 + i, 1, .9);
      retroText(ctx, String(n), 0, 0, { size: 58, weight: 900, color: '#FFF', align: 'center', depth: 3, lw: 3 }); ctx.restore();
      text(ctx, n === 1 ? 'capability' : 'capabilities', x, -h / 2 + 230, { size: 16, weight: 700, color: '#4A4038', align: 'center' }); });
    text(ctx, 'Machine learning para bancos e fintechs', 0, -h / 2 + 300, { size: 20, weight: 900, color: INK, align: 'center' });
    [['PREDITIVOS', ML.pred.length, C.red], ['PRESCRITIVOS', ML.presc.length, C.orange]].forEach(([l, n, col], i) => { const x = i ? 110 : -110;
      pill(ctx, x, -h / 2 + 350, l, { size: 16, fill: col, color: '#FFF', weight: 900 }); retroText(ctx, String(n), x, -h / 2 + 410, { size: 50, weight: 900, color: col, align: 'center', depth: 3, lw: 3 }); text(ctx, 'casos de uso', x, -h / 2 + 452, { size: 15, weight: 700, color: '#4A4038', align: 'center' }); });
  };
})();

/* ---------- Parada 1: retomada do trecho 1 ---------- */
STOPSCN.stop1 = recapScene({ posters: [1, 2, 3], sign: 'PARADA 1 · BALDEAÇÃO', from: CONFIG.sceneById.s03.end,
  doodles: [['star', 120, 300, 70, C.yellow], ['arrow', 1800, 280, 90, C.orange], ['crown', 1810, 820, 80, C.yellow], ['spiral', 110, 820, 70, C.red]] });
