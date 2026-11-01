/* ============================================================================
   23. ESTAÇÕES 05 e 06 + Conversa 2 (cartazes 04, 05, 06)
   ----------------------------------------------------------------------------
   05 · a mesma equipe, um alcance maior: Equipe → Motor produtizado → Ativo
        reutilizável → Projetos (o mecanismo do reuso, sem métricas inventadas)
   06 · os pilares viram a infraestrutura da viagem: a linha corre sobre eles;
        cada pilar traz o nome e uma contribuição curta (campo "contribution" do JSON)
   ========================================================================== */
const PILLARS = (SEC(6).pillars || []).slice(0, 6).map(p => typeof p === 'string' ? { name: p, items: [], contrib: '' }
  : { name: p.pillar || p.name || '', items: p.highlights || p.items || [], contrib: p.contribution || (p.highlights || [])[0] || '' });
const NUMW = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito'];

/* ---------- 05 · Escalando o impacto: a mesma equipe, mais alcance ---------- */
(() => {
  const id = 's05', GYc = 600;
  const N = { team: [270, GYc], motor: [700, GYc], asset: [1110, GYc] }, PROJ = [[1600, 300, 'bank'], [1680, 450, 'store'], [1720, 600, 'card'], [1680, 750, 'basket'], [1600, 900, 'chart']];
  const T_TEAM = .6, T_MOTOR = 2.2, T_ASSET = 4.2, T_PROJ = 6.4, T_CONC = 12.4;
  cue(id, T_MOTOR, 'pop', { p: 1, v: .2 }); cue(id, T_ASSET, 'impact', { size: .6 }); PROJ.forEach((_, i) => cue(id, T_PROJ + i * .55, 'ping', { f: 784 * Math.pow(2, i * 2 / 12) })); cue(id, T_CONC, 'chime', { f: 784, up: 7 });
  const SCRIPT = SAY.reg(id, [
    [3.8, 20.3, 'title', 'A mesma equipe, *um alcance maior*'],
    [4.2, T_CONC + .2, 'body', '*Automação*, *padronização* e *reutilização* ampliam o alcance das entregas.', { x: LAY.x, y: 812, w: 860, visual: true }],
    [T_CONC, 20.3, 'concl', 'Um *ativo reutilizável* permite aplicar capacidades em *novos projetos*.']
  ]);
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT, peaks: [[T_ASSET - .1, T_ASSET + .8, .5]],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#2A1A10' });
      neonGrid(ctx, t, { horizon: 820, alpha: .35, speed: .6 });
      // a equipe (fica na origem)
      const tp = E.outBack(P(t, T_TEAM, .5));
      if (tp > 0) { ctx.save(); ctx.translate(...N.team); ctx.scale(tp, tp); holo(ctx, -150, -120, 300, 240, { color: C.yellow, corners: false });
        [-70, 0, 70].forEach((dx, k) => PEOPLE.draw(ctx, dx, 90, .42, PEOPLE.wave(t + k, k === 1 ? .6 : 0), { dir: k ? -1 : 1, t: t + k, phones: 'neck', mood: 'happy' })); ctx.restore(); }
      // a linha: equipe → motor → ativo
      const lp = E.inOutSine(P(t, T_TEAM + .4, T_ASSET - T_TEAM));
      LINE.draw(ctx, [N.team, N.motor, N.asset], lp, { w: 20, head: lp < .99, glow: 12 });
      const mp = E.outBack(P(t, T_MOTOR, .5));
      if (mp > 0) { ctx.save(); ctx.translate(...N.motor); ctx.scale(mp, mp); vslab(ctx, -110, -90, 220, 180, 34, '#3A3640', { lw: 4 }); for (let k = 0; k < 2; k++) { ctx.save(); ctx.translate(-40 + k * 80, -10); ctx.rotate(t * (k ? -2 : 2)); icon(ctx, 'gear', 0, 0, 74, C.orange, 9); ctx.restore(); } ctx.restore(); }
      const ap = E.outBack(P(t, T_ASSET, .6));
      if (ap > 0) { glow(ctx, ...N.asset, 260, C.yellow, .45 * ap + .1 * BT.level); ctx.save(); ctx.translate(...N.asset); ctx.scale(ap, ap); ctx.rotate(Math.sin(t * .8) * .05);
        holo(ctx, -110, -110, 220, 220, { color: C.yellow }); icon(ctx, 'grid', 0, 0, 120, C.yellow, 9); ctx.restore(); }
      // projetos em contextos diferentes, ligados ao mesmo ativo
      PROJ.forEach(([x, y, ic], i) => { const p = E.inOutSine(P(t, T_PROJ + i * .55, .7)); if (p <= 0) return;
        LINE.draw(ctx, [N.asset, [lerp(N.asset[0], x, .5), lerp(N.asset[1], y, .2)], [x - 60, y]], p, { w: 10, col: [C.red, C.orange, C.yellow, C.orange, C.red][i], head: p < .99, shadow: false });
        if (p > .95) for (let k = 0; k < 2; k++) { const u = (t * .5 + k * .5 + i * .13) % 1, [px, py] = LINE.at([N.asset, [lerp(N.asset[0], x, .5), lerp(N.asset[1], y, .2)], [x - 60, y]], u); circle(ctx, px, py, 6, '#FFE7B0'); }
        const s = E.outBack(P(t, T_PROJ + i * .55 + .5, .4)); if (s > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); vball(ctx, 0, 0, 44, '#F6EEDF', { lw: 4 }); icon(ctx, ic, 0, 0, 52, INK, 7); ctx.restore(); } });
      // rótulos obrigatórios
      const la = k => clamp(P(t, [T_TEAM, T_MOTOR, T_ASSET, T_PROJ + 1][k] + .3, .4));
      hud(ctx, c => { c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12;
        [['Equipe', N.team, 0], ['Motor produtizado', N.motor, 1], ['Ativo reutilizável', N.asset, 2]].forEach(([l, [x, y], k]) => { c.globalAlpha = la(k); text(c, l, x, y + 160, { size: 32, weight: 900, color: k === 2 ? C.yellow : '#FFF', align: 'center' }); });
        c.globalAlpha = la(3); text(c, 'Projetos', 1784, 600, { size: 32, weight: 900, color: '#FFF' }); text(c, 'contextos', 1784, 640, { size: 24, weight: 700, color: '#E9DCC8' }); text(c, 'diferentes', 1784, 670, { size: 24, weight: 700, color: '#E9DCC8' }); });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- 06 · A Prática: os pilares sustentam a linha ---------- */
(() => {
  const id = 's06', N = Math.max(1, PILLARS.length), GYp = 900, TOPY = 430, X = i => W / 2 + (i - (N - 1) / 2) * Math.min(350, 1700 / N);
  const T_COL = PILLARS.map((_, i) => .5 + i * .45), T_LINE = 2.4, G1 = Math.ceil(N / 2) + (N > 4 ? 1 : 0), T_G1 = 5.6, T_G2 = 12.6, T_CONC = 19.4;
  T_COL.forEach((t0, i) => cue(id, t0, 'impact', { size: .3 })); cue(id, T_LINE, 'whoosh', { dur: 1.6, v: .3 }); cue(id, T_G1, 'pop', { p: 1, v: .2 }); cue(id, T_G2, 'pop', { p: 1.1, v: .2 }); cue(id, T_CONC, 'chime', { f: 659, up: 7 });
  const SCRIPT = SAY.reg(id, [
    [3.8, 24.6, 'title', `Os *${NUMW[N] || N} pilares* da prática`],
    [4.0, T_G1 + 3, 'note', 'Capacidades complementares sustentam nossas entregas.', { x: LAY.x, y: 214, align: 'left', size: 30, weight: 800 }],
    [T_CONC, 24.6, 'concl', 'A combinação dessas capacidades permite *executar os projetos*.']
  ]);
  SAY.reg(id, PILLARS.map((p, i) => [i < G1 ? T_G1 : T_G2, 24.4, 'body', p.name + ': ' + p.contrib]));
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT, peaks: [[T_LINE - .1, T_LINE + 1, .4]],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#2E1C10' });
      skyline(ctx, t, { y: 960, h: 320, seed: 88, col: '#1A1216', lit: .4 });
      const g = ctx.createLinearGradient(0, GYp, 0, H); g.addColorStop(0, '#2A1C14'); g.addColorStop(1, '#0E0907'); ctx.fillStyle = g; ctx.fillRect(0, GYp, W, H - GYp); line(ctx, 0, GYp, W, GYp, INK, 6);
      // pilares (colunas de viaduto) sobem
      PILLARS.forEach((p, i) => { const k = E.outBack(P(t, T_COL[i], .7)), x = X(i), h = (GYp - TOPY) * Math.min(1, k); if (k <= 0) return;
        vslab(ctx, x - 52, GYp - h, 104, h, 26, mix('#5A4A40', [C.red, C.orange, C.yellow, '#E8822A', C.red, C.orange][i], .35), { lw: 4 });
        hatch(ctx, () => rr(ctx, x - 52, GYp - h, 104, h, 0), x - 52, GYp - h, 104, h, { alpha: .18, gap: 12 });
        vslab(ctx, x - 74, GYp - h - 26, 148, 26, 18, '#6A5A50', { lw: 3.5 });
        pin(ctx, x, GYp - h / 2, c => { c.globalAlpha *= clamp(k); c.rotate(-Math.PI / 2); text(c, p.name.toUpperCase(), 0, 0, { size: 28, weight: 900, color: '#FFF', align: 'center', ls: 3 }); }); });
      // a linha corre por cima dos pilares
      const lp = E.inOutSine(P(t, T_LINE, 2.4)), deck = [[-120, TOPY - 40], [W + 120, TOPY - 40]];
      if (lp > 0) { vslab(ctx, -100, TOPY - 26, (W + 200) * lp, 22, 16, '#4A3A30', { lw: 3 }); LINE.draw(ctx, deck, lp, { w: 20, head: true, glow: 12 }); }
      if (t > T_LINE + 2.4) { const u = ((t - T_LINE - 2.4) * .12) % 1; LINE.head(ctx, lerp(-120, W + 120, u), TOPY - 40, 0, 18); }
      // contribuições: dois grupos, cada descrição fica na tela até o fim
      PILLARS.forEach((p, i) => { const t0 = i < G1 ? T_G1 : T_G2, a = P(t, t0 + (i % G1) * .25, .5); if (a <= 0) return; const x = X(i), w = Math.min(330, 1700 / N - 18);
        hud(ctx, c => { c.translate(x, 640 + (1 - E.outCubic(a)) * 20); c.globalAlpha *= a;
          paper(c, -w / 2, -110, w, 220, { r: 14, fill: '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3.5 });
          rr(c, -w / 2, -110, w, 50, 14); c.fillStyle = [C.red, C.orange, C.yellow, '#E8822A', C.red, C.orange][i]; c.fill();
          text(c, p.name, 0, -84, { size: 28, weight: 900, color: i === 2 ? INK : '#FFF', align: 'center' });
          para(c, p.contrib, -w / 2 + 18, -46, w - 36, { size: 26, weight: 800, color: INK, lh: 1.16 });
          if (p.items.length) text(c, `${p.items.length} entregas`, w / 2 - 16, 90, { size: 20, weight: 800, mono: true, color: '#8A6A48', align: 'right' }); }); });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- Conversa 2: as quatro provas, a escala e os pilares (cartazes 04, 05, 06) ---------- */
POSTERS[4] = (ctx, w, h, tl) => {
  const B = CASE('Cliente Banana'), M = CASE('Cliente Manga'), I = CASE('Insight Agent'), pl = dget(I, 'business_results.pipeline', {});
  const lift = (String(dget(B, 'business_results.headline', '')).match(/([+-]?\d+(?:\.\d+)?)\s*relative/i) || [])[1];
  const rows = [['Cestas', lift ? FMT.rel(+lift) : '—', 'conversão vs. 2ª melhor campanha', C.yellow], ['Principalidade', FMT.auto(dget(M, 'business_results.top3.incremental_gain', '+4 p.p.')), 'vs. controle · backtest', C.orange],
    ['Relatórios', 'automáticos', 'do dado ao board', '#F3EBDD'], ['Agentes', `${pl.active_relationships || 0} + ${pl.to_conquer || 0}`, `ativos + oportunidades (${pl.acquirers || 30})`, C.red]];
  rows.forEach(([n, big, sub, col], i) => { const x = (i % 2 - .5) * 220, y = -150 + Math.floor(i / 2) * 230;
    rr(ctx, x - 104, y - 92, 208, 196, 12); ctx.fillStyle = '#FFFDF8'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); rr(ctx, x - 104, y - 92, 208, 40, 12); ctx.fillStyle = col; ctx.fill();
    late(ctx, c => { text(c, n, x, y - 72, { size: 22, weight: 900, color: col === C.yellow || col === '#F3EBDD' ? INK : '#FFF', align: 'center' });
      text(c, big, x, y - 6, { size: Math.min(40, 190 / Math.max(1, measure(c, big, 40, 900)) * 40), weight: 900, color: C.orange, align: 'center' });
      para(c, sub, x, y + 34, 190, { size: 18, weight: 800, color: '#3A332C', align: 'center', lh: 1.1 }); }); });
};
POSTERS[5] = (ctx, w, h, tl) => {
  late(ctx, c => { para(c, 'A mesma equipe, *um alcance maior*', 0, -240, 420, { size: 30, weight: 900, color: INK, accent: C.red, align: 'center' }); });
  const pts = [[-170, -40], [-40, -40], [80, -40]]; LINE.draw(ctx, pts, 1, { w: 12, shadow: false });
  [['Equipe', 'user'], ['Motor', 'gear'], ['Ativo', 'grid']].forEach(([l, ic], i) => { circle(ctx, pts[i][0], -40, 30, i === 2 ? C.yellow : '#FFF8EE', INK, 4); icon(ctx, ic, pts[i][0], -40, 34, INK, 6); late(ctx, c => text(c, l, pts[i][0], 10, { size: 20, weight: 900, color: INK, align: 'center' })); });
  for (let k = 0; k < 4; k++) { const y = -130 + k * 60; line(ctx, 110, -40, 180, y, C.orange, 5); circle(ctx, 190, y, 16, '#F6EEDF', INK, 3); }
  late(ctx, c => { text(c, 'projetos', 190, 120, { size: 20, weight: 900, color: INK, align: 'center' });
    para(c, 'Automação, padronização e reutilização ampliam o alcance das entregas.', 0, 150, 420, { size: 22, weight: 800, color: '#3A332C', align: 'center' }); });
};
POSTERS[6] = (ctx, w, h, tl) => {
  const hi = Math.floor(tl / 2.5) % Math.max(1, PILLARS.length);
  PILLARS.forEach((p, i) => { const y = -220 + i * 96, on = i === hi; rr(ctx, -210, y - 40, 420, 84, 10); ctx.fillStyle = on ? C.orange : '#FFFDF8'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
    late(ctx, c => { text(c, p.name, -190, y - 14, { size: 22, weight: 900, color: on ? '#FFF' : INK }); text(c, p.items.length ? `${p.items.length} entregas` : '', 190, y - 14, { size: 16, weight: 800, mono: true, color: on ? '#FFF' : '#8A6A48', align: 'right' });
      text(c, p.contrib.length > 46 ? p.contrib.slice(0, 44) + '…' : p.contrib, -190, y + 16, { size: 17, weight: 700, color: on ? '#FFF' : '#3A332C' }); }); });
};
STOPSCN.stop2 = recapScene({ posters: [4, 5, 6], sign: 'PARADA 2 · CONVERSA', from: CONFIG.sceneById.s06.end, call: 'QUAL DESAFIO PODE VIRAR O PRÓXIMO CASE?',
  doodles: [['crown', 1840, 240, 80, C.yellow], ['spiral', 80, 260, 70, C.orange]] });
