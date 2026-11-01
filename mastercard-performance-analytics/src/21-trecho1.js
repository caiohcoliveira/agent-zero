/* ============================================================================
   21. PLAY 2 ("Vintage Film Funk" remontada) — estações 01, 02 e 03 + Conversa 1
   ----------------------------------------------------------------------------
   v7: cada estação tem contexto, explicação, visual com rótulos e conclusão.
   01 · o mundo das perguntas encontra uma ponte (os 4 serviços são os vãos da ponte)
   02 · o crescimento ganha forma e uma régua (gráficos com eixo, unidade e base)
   03 · capabilities: onde aplicamos, o que entregamos, antecipar × escolher
   ========================================================================== */
const barsOf = (id, per = 2.18) => { const B = grid(id).bars; return k => (B[k] != null ? B[k] : (B[B.length - 1] || 0) + (k - B.length + 1) * per); };

/* ---------- 01 · Papel estratégico: o mundo das perguntas encontra uma ponte ---------- */
(() => {
  const id = 's01', bt = barsOf(id);
  // compassos: bt(5) = 11,92 (entra a frase A) … bt(20) = 44,78
  const T_Q = [4.3, 5.5, 6.7], T_REV = bt(5) + .2, T_CABLE = bt(5) + 1.1, T_SEG = [bt(9), bt(10) + 1.1, bt(12), bt(13) + 1.1];
  const T_CROSS0 = bt(14) - .3, T_CROSS1 = bt(16) + .7, T_RES = bt(16) - .1, T_CONC = bt(19) - .2, T_RUN = bt(20) - .6;
  const QS = TX.postits.slice(0, 3), SVC = TX.engagement.map(e => e[0]), SCOL = [C.red, C.orange, C.yellow, '#FFD9A8'];
  const DEF = ['entender o problema', 'definir o caminho', 'construir a solução', 'verificar o resultado'];
  const GY = 760, BX0 = 1150, BX1 = 2050, SEGW = (BX1 - BX0) / 4, POSTS = [400, 740, 1080];
  const RPATH = [[2120, 700], [2330, 640], [2600, 600], [2860, 640], [3120, 600], [3400, 640], [3900, 610]];
  const RST = [['Dados', 'db', .04], ['Decisão', 'tree', .21], ['Ação', 'bolt', .38], ['Resultado', 'trend', .55]];
  const CAM = [[0, 800, 560, 1.25], [11.6, 900, 560, 1.25], [T_REV + 1.7, 1600, 590, .78], [T_CROSS0, 1600, 590, .78], [T_CROSS1 - 1.2, 2120, 600, .9],
    [T_RES + 1.4, 2660, 590, 1.0], [T_RUN, 2660, 590, 1.0], [T_RUN + 3.4, 2980, 590, 1.0]];
  T_Q.forEach((t0, i) => cue(id, t0, 'pop', { p: 1 + i * .1, v: .2 })); cue(id, T_REV, 'whoosh', { dur: 1.2, v: .3 }); cue(id, T_CABLE, 'whoosh', { dur: .5, v: .25 });
  T_SEG.forEach((t0, i) => { cue(id, t0, 'impact', { size: .35 }); cue(id, t0 + .05, 'ping', { f: 659 * Math.pow(2, i * 3 / 12) }); });
  RST.forEach((r, i) => cue(id, T_RES + .3 + i * .55, 'pop', { p: 1 + i * .08, v: .18 })); cue(id, T_CONC, 'chime', { f: 784, up: 7 });

  const SCRIPT = SAY.reg(id, [
    [3.9, 12.4, 'title', 'Decisões difíceis começam com *perguntas*', { visual: true }],
    [12.6, 37.5, 'title', 'O papel da área'],
    [12.8, 20.4, 'body', 'Conectamos *perguntas de negócio* aos *dados* necessários para respondê-las.', { visual: true }],
    [T_SEG[0] - .1, 37.5, 'list', SVC.map((s, i) => `*${s}*: ${DEF[i]}.`), { at: T_SEG.map(x => x - .1), label: 'OS 4 SERVIÇOS', cols: SCOL, visual: true }],
    [37.4, 47, 'title', 'Do diagnóstico à mensuração'],
    [37.6, 47, 'body', 'Atuamos do *diagnóstico* à *mensuração* para gerar *valor* para o cliente.', { visual: true }],
    [T_CONC, 47.2, 'concl', 'Analytics é uma *capacidade estratégica* da consultoria.']
  ]);
  const dawnAt = t => E.inOutSine(P(t, T_CROSS0, 6.5));
  function sky(ctx, t) {
    const d = dawnAt(t), g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mix('#1C1230', '#3E2350', d)); g.addColorStop(.55, mix('#7A2E3A', '#E07A3A', d)); g.addColorStop(.72, mix('#C8552A', '#FFC266', d)); g.addColorStop(1, '#24120C');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    glow(ctx, 1180, 690, 520, mix('#FF8A3D', '#FFE2A0', d), .55 + .2 * d);
    vball(ctx, 1180, 700 - 40 * d, 120, mix('#FF9A50', '#FFE7B0', d), { ink: false, rim: false });
    for (let k = 0; k < 40; k++) { const x = hash(k * 3.1) * W, y = hash(k * 7.7) * 380; circle(ctx, x, y, 1.4 + hash(k) * 1.6, rgba('#FFF4DC', (.6 - .5 * d) * (.5 + .5 * Math.sin(t * 2 + k)))); }
  }
  function mountains(ctx) {
    [['#3A1A2C', 640, 11], ['#2A1422', 700, 23]].forEach(([col, base, seed]) => { const r = rng(seed); ctx.beginPath(); ctx.moveTo(-600, H + 200); let x = -600;
      while (x < 4200) { ctx.lineTo(x, base - 80 - r() * 200); x += 120 + r() * 200; } ctx.lineTo(4200, H + 200); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); });
  }
  function cliffs(ctx, t) {
    const edge = (x0, dir, seed) => { const r = rng(seed), pts = []; for (let y = GY; y <= H + 500; y += 40) pts.push([x0 + dir * (r() * 40 + (y - GY) * .06), y]); return pts; };
    // margem esquerda (Negócio) e direita (Dados)
    [[-800, BX0, 1, '#6A3426', '#3A1C14', 31], [BX1, 4400, -1, '#2C3448', '#151A26', 47]].forEach(([xa, xb, dir, c1, c2, seed]) => {
      const e = edge(dir > 0 ? xb : xa, dir, seed); ctx.beginPath(); ctx.moveTo(xa, GY); ctx.lineTo(xb, GY); if (dir > 0) e.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(dir > 0 ? xa : xb, H + 500); if (dir < 0) e.slice().reverse().forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath();
      const g = ctx.createLinearGradient(0, GY, 0, H + 300); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
      line(ctx, xa, GY + 4, xb, GY + 4, rgba('#FFE2C0', .35), 6);
      ctx.save(); ctx.clip(); hatch(ctx, () => { ctx.rect(xa, GY + 40, xb - xa, 800); }, xa, GY + 40, xb - xa, 800, { alpha: .18, gap: 14, color: '#000' }); ctx.restore();
    });
    // capim e pedras na borda
    const r = rng(5); for (let k = 0; k < 90; k++) { const x = r() < .5 ? -600 + r() * (BX0 + 560) : BX1 + r() * 2200, h = 10 + r() * 22; line(ctx, x, GY, x + (r() - .5) * 10 + Math.sin(t * 1.5 + k) * 3, GY - h, k % 3 ? '#3C5A2A' : '#5E7A34', 3); }
  }
  function fog(ctx, t) {
    for (let k = 0; k < 6; k++) { const y = GY + 60 + k * 50, x = BX0 - 200 + ((t * (14 + k * 4) + k * 300) % 1200), g = ctx.createRadialGradient(x, y, 20, x, y, 420);
      g.addColorStop(0, 'rgba(255,214,180,.16)'); g.addColorStop(1, 'rgba(255,214,180,0)'); ctx.fillStyle = g; ctx.fillRect(x - 420, y - 200, 840, 400); }
  }
  /** a cidade das perguntas (margem do negócio) */
  function cityOfQuestions(ctx, t) {
    const r = rng(77); for (let k = 0; k < 9; k++) { const x = -420 + k * 170 + r() * 40, w = 110 + r() * 50, h = 120 + r() * 180, col = ['#7A3A2A', '#8A4A30', '#6A2E22'][k % 3];
      vslab(ctx, x, GY - h, w, h, 22, col, { lw: 3 });
      for (let wy = GY - h + 20; wy < GY - 30; wy += 42) for (let wx = x + 16; wx < x + w - 20; wx += 34) { rr(ctx, wx, wy, 20, 26, 3); ctx.fillStyle = hash(wx + wy) > .55 ? rgba('#FFD08A', .85) : '#3A1C14'; ctx.fill(); }
      if (k % 2 === 0) text(ctx, '?', x + w / 2, GY - h - 30, { size: 46, weight: 900, color: C.yellow, align: 'center', alpha: .8 + .2 * Math.sin(t * 2 + k) }); }
  }
  /** postes com os cartões de pergunta pendurados */
  function questionPosts(ctx, t) {
    POSTS.forEach((x, i) => {
      line(ctx, x + 6, GY, x + 6, 380, '#000', 14); line(ctx, x, GY, x, 380, '#2A1E18', 14); line(ctx, x, 380, x + 60, 380, '#2A1E18', 10);
      vball(ctx, x + 64, 392, 16, '#FFE6B0', { lw: 3, rim: false }); lightCone(ctx, x + 64, 398, 30, 260, GY - 398, '#FFC98A', .55);
      const p = P(t, T_Q[i], .5); if (p <= 0) return; const sw = Math.sin(t * 1.6 + i) * .04 * (1 - P(t, T_REV, 1)), s = E.outBack(p);
      ctx.save(); ctx.translate(x - 120, 410); ctx.rotate(sw); ctx.scale(s, s);
      line(ctx, -80, -30, -80, 36, '#C9B79C', 3); line(ctx, 80, -30, 80, 36, '#C9B79C', 3);
      paper(ctx, -160, 36, 320, 130, { torn: true, seed: 90 + i, fill: [C.yellow, '#FFE9A8', '#FFD9C0'][i], shadow: 8, shadowColor: '#000', lw: 3.5, halftone: .05 });
      late(ctx, c => text(c, QS[i], 0, 102, { size: 40, weight: 900, color: INK, align: 'center' }));
      ctx.restore();
    });
  }
  /** a ponte: cabo (a linha laranja) + 4 vãos, um por serviço */
  function bridge(ctx, t) {
    const cp = E.inOutCubic(P(t, T_CABLE, 1.1)); if (cp <= 0) return;
    const sag = u => GY - 150 + Math.sin(u * Math.PI) * 70;
    const cable = Array.from({ length: 9 }, (_, i) => [BX0 - 20 + i / 8 * (BX1 - BX0 + 40), sag(i / 8)]);
    // pilares das cabeceiras
    [BX0 - 20, BX1 + 20].forEach(x => { vslab(ctx, x - 16, GY - 190, 32, 190, 10, '#3A2A22', { lw: 3 }); circle(ctx, x, GY - 196, 14, C.orange, INK, 3); });
    T_SEG.forEach((t0, i) => {
      const p = P(t, t0 - .25, .45), x = BX0 + i * SEGW; if (p <= 0) return;
      const drop = (1 - E.outBack(p)) * -260, lit = P(t, t0 + .1, .4);
      ctx.save(); ctx.translate(0, drop);
      // tirantes até o cabo
      for (let k = 0; k <= 3; k++) { const xx = x + k * SEGW / 3, u = (xx - BX0 + 20) / (BX1 - BX0 + 40); line(ctx, xx, GY - 8, xx, sag(u), rgba('#E9DCC8', .8), 3); }
      vslab(ctx, x + 2, GY - 22, SEGW - 4, 26, 12, lit > 0 ? mix('#7A5A40', SCOL[i], .55 * lit) : '#7A5A40', { lw: 3 });
      for (let k = 1; k < 6; k++) line(ctx, x + k * SEGW / 6, GY - 20, x + k * SEGW / 6, GY + 2, 'rgba(0,0,0,.35)', 2);
      if (lit > 0) { glow(ctx, x + SEGW / 2, GY - 10, 160, SCOL[i], .4 * lit); line(ctx, x + 8, GY - 30, x + SEGW - 8, GY - 30, SCOL[i], 6); }
      ctx.restore();
      if (lit > 0) { pin(ctx, x + SEGW / 2, GY + 40, c => { c.globalAlpha *= lit; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 10; text(c, SVC[i], 0, 26, { size: 28, weight: 900, color: '#FFF', align: 'center' }); });
        pin(ctx, x + SEGW / 2, GY - 60, c => { c.globalAlpha *= lit; circle(c, 0, 0, 20, SCOL[i], INK, 3); text(c, `${i + 1}`, 0, 1, { size: 24, weight: 900, color: i === 3 ? INK : '#FFF', align: 'center' }); }); }
    });
    LINE.draw(ctx, cable, cp, { w: 14, head: cp < .99 });
  }
  function dataTowers(ctx, t) {
    const d = dawnAt(t), r = rng(91);
    for (let k = 0; k < 7; k++) { const x = 2230 + k * 190 + r() * 30, h = 200 + r() * 200, on = clamp(d * 8 - k);
      vslab(ctx, x, GY - h, 120, h, 26, mix('#26304A', '#3A4A6A', on), { lw: 3 });
      for (let wy = GY - h + 18; wy < GY - 20; wy += 22) for (let wx = x + 14; wx < x + 106; wx += 18) { const v = hash(wx * 1.3 + wy * .7); circle(ctx, wx, wy, 4, v < .45 * (.25 + on) ? rgba(C.yellow, .5 + .5 * Math.sin(t * 6 + v * 40)) : 'rgba(0,0,0,.4)'); }
      if (on > 0) { const u = (t * .8 + k * .3) % 1; circle(ctx, x + 60, GY - u * h, 5, rgba('#FFE7B0', on)); } }
  }
  function resultLine(ctx, t) {
    const p = E.inOutSine(P(t, T_RES, 2.6)), run = E.inCubic(P(t, T_RUN, 3.4)); if (p <= 0) return;
    const u1 = lerp(.0, .66, p) + run * .34;
    LINE.draw(ctx, [[BX1 + 20, GY - 150], ...RPATH], u1, { w: 20, head: true, glow: 12 });
    LINE.stations(ctx, [[BX1 + 20, GY - 150], ...RPATH], RST.map(([l, ic, u], i) => ({ u: u + .04, label: l, icon: ic, side: 1, r: 30, fill: i === 3 ? C.yellow : '#FFF8EE' })), u1);
    RST.slice(0, 3).forEach(([, , u], i) => { const a = P(t, T_RES + .6 + i * .55, .4); if (a <= 0) return; const [x1, y1] = LINE.at([[BX1 + 20, GY - 150], ...RPATH], u + .04), [x2, y2] = LINE.at([[BX1 + 20, GY - 150], ...RPATH], RST[i + 1][2] + .04);
      late(ctx, c => { c.globalAlpha *= a; text(c, '›', (x1 + x2) / 2, (y1 + y2) / 2 - 46, { size: 54, weight: 900, color: C.yellow, align: 'center' }); }); });
  }
  function girl(ctx, t) {
    let x, pose, dir = 1, mood = 'calm';
    if (t < 11.5) { const u = clamp(t / 11.5); x = lerp(40, 1040, E.inOutSine(u)); pose = PEOPLE.walk(t * 15); }
    else if (t < T_CROSS0) { x = 1040; pose = PEOPLE.mixPose(PEOPLE.walk(11.5 * 15), PEOPLE.POSE.stand, clamp((t - 11.5) / .4)); if (t > T_SEG[0] && t < T_SEG[3] + 1) pose = PEOPLE.point(E.outCubic(clamp((t - T_SEG[0]) / .5)) * (1 - P(t, T_SEG[3] + .4, .5)), pose); }
    else if (t < T_CROSS1) { x = lerp(1040, 2260, E.inOutSine((t - T_CROSS0) / (T_CROSS1 - T_CROSS0))); pose = PEOPLE.walk(t * 15); mood = 'happy'; }
    else { x = 2260; pose = PEOPLE.wave(t, E.outCubic(P(t, T_CROSS1, .4)) * (1 - P(t, T_CROSS1 + 2.4, .5))); mood = 'happy'; }
    PEOPLE.draw(ctx, x, GY + 2, .78, pose, { dir, t, phones: 'neck', mood });
  }
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT,
    peaks: [[T_SEG[0] - .1, T_SEG[0] + .6, .4], [T_SEG[3] - .1, T_SEG[3] + .8, .5], [T_CONC - .1, T_CONC + 1, .5]],
    draw(ctx, t) {
      const cam = camKey(t, CAM);
      layer(ctx, cam, 0, () => sky(ctx, t));
      layer(ctx, cam, .25, () => mountains(ctx));
      layer(ctx, cam, .55, () => fog(ctx, t));
      layer(ctx, cam, .8, () => cityOfQuestions(ctx, t));
      layer(ctx, cam, 1, () => {
        cliffs(ctx, t); fog(ctx, t * 1.3 + 7);
        dataTowers(ctx, t);
        // rótulos das margens
        const ma = P(t, T_REV + .8, .5);
        if (ma > 0) [['NEGÓCIO', 760, C.red], ['DADOS', 2460, C.yellow]].forEach(([l, x, c]) => pin(ctx, x, GY + 120, cc => { cc.globalAlpha *= ma; cc.rotate(-.02);
          const w = measure(cc, l, 44, 900, false, 6) + 60; rr(cc, -w / 2, -36, w, 72, 10); cc.fillStyle = c; cc.fill(); cc.strokeStyle = INK; cc.lineWidth = 4; cc.stroke();
          text(cc, l, 0, 2, { size: 44, weight: 900, color: c === C.yellow ? INK : '#FFF', align: 'center', ls: 6 }); }));
        questionPosts(ctx, t);
        bridge(ctx, t);
        resultLine(ctx, t);
        girl(ctx, t);
      });
      layer(ctx, cam, 1.35, () => { const r = rng(12); ctx.beginPath(); ctx.moveTo(-900, H + 300); for (let x = -900; x <= 4800; x += 70) ctx.lineTo(x, H + 30 - r() * 70 - (Math.sin(x * .004) + 1) * 30); ctx.lineTo(4800, H + 300); ctx.closePath(); ctx.fillStyle = '#100906'; ctx.fill();
        for (let k = 0; k < 60; k++) { const x = -900 + k * 95, h = 30 + r() * 50; line(ctx, x, H + 10, x + (r() - .5) * 26 + Math.sin(t * 1.3 + k) * 6, H - h, '#1E140C', 5); } });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- 02 · Evolução e impacto: o crescimento ganha forma e uma régua ---------- */
(() => {
  const id = 's02', sec = () => SEC(2), BR = sec().brazil_2023_milestone || {};
  const ROWS = Object.entries(sec().revenue_performance_analytics_usd_millions || {}), VALS = ROWS.map(r => +r[1] || 0), MAXV = Math.max(...VALS, 1e-9);
  const isF = k => /forecast|previs/i.test(k), yr = k => k.replace(/_?forecast/i, '');
  const MULT = VALS.length > 2 && VALS[0] ? VALS[2] / VALS[0] : null;
  const UNIT = (() => { const m = MAXV * 1e6; return m >= 1e6 ? ['US$ mi', 1e6] : m >= 1e3 ? ['US$ mil', 1e3] : ['US$', 1]; })(), toU = v => v * 1e6 / UNIT[1];
  const niceStep = mx => { const raw = mx / 4, p = Math.pow(10, Math.floor(Math.log10(raw || 1))), f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };
  const STEP = niceStep(toU(MAXV)), TOP = Math.ceil(toU(MAXV) * 1.08 / STEP) * STEP;
  const PREV = +BR.actuals_2022_usd_millions || 0, BUD = +BR.budget_2023_usd_millions || 0, ACT = +BR.actuals_2023_usd_millions || 0;
  const VS_PREV = PREV ? ACT / PREV : null, VS_BUD = BUD ? ACT / BUD : null;
  const QS = Object.entries(BR.quarterly_usd_millions || {}), QUP = QS.filter(([, q]) => q.actuals_2023 > q.budget_2023).length;
  const qLabel = k => (k.match(/(\d)/) ? 'T' + k.match(/(\d)/)[1] : k) + (/prelim/i.test(k) ? ' (prel.)' : '');
  const T_BAR = ROWS.map((_, i) => 1.0 + i * 1.15), T_TREND = 5.6, T_READ = 12.2, T_BR = 20.4, T_CMP = [21.9, 23.3], T_Q = 30.6, T_CONC = 38.4;
  const CX = [430, 680, 930, 1180], BASE = 820, HH = 500, X0 = 250, BW = 160;
  const CAM = [[0, 960, 560, 1.05], [3.6, 960, 540, 1], [T_BR - .2, 960, 540, 1], [T_BR + 1.3, 3160, 540, 1], [43.7, 3160, 540, 1]];
  const hY = v => BASE - toU(v) / TOP * HH;
  T_BAR.forEach((t0, i) => cue(id, t0, 'pop', { p: .9 + i * .1, v: .2 })); cue(id, T_TREND, 'shimmer', { dur: 1.2 }); cue(id, T_READ, 'chime', { f: 784, up: 7 });
  cue(id, T_BR, 'whoosh', { dur: 1, v: .3 }); T_CMP.forEach(t0 => cue(id, t0, 'impact', { size: .5 })); cue(id, T_Q, 'whoosh', { dur: .7, v: .25 }); cue(id, T_CONC, 'chime', { f: 659, up: 7 });
  const growTxt = MULT ? `Entre *${yr(ROWS[0][0])}* e *${yr(ROWS[2][0])}*, o faturamento passou a *${FMT.num(MULT, 1)} vez* o valor inicial.` : 'O faturamento cresceu ano a ano.';
  const qTxt = QS.length ? (QUP === QS.length ? 'O realizado superou o orçamento em *todos os trimestres*.' : `O realizado superou o orçamento em *${QUP} de ${QS.length} trimestres*.`) : '';
  const SCRIPT = SAY.reg(id, [
    [3.9, T_BR - .1, 'title', 'Evolução do faturamento da track'],
    [4.1, T_BR - .1, 'note', `faturamento anual, em ${UNIT[0]} · base zero`, { x: LAY.x, y: 196, align: 'left', size: 28, visual: true }],
    [T_READ, T_BR - .1, 'body', growTxt, { x: 1380, y: 300, w: 470 }],
    [T_BR + .9, 43.8, 'title', 'Faturamento do *Brasil*'],
    [T_BR + 1.0, 43.8, 'note', 'período de referência · estimativa de fechamento', { x: LAY.x, y: 196, align: 'left', size: 28 }],
    [T_Q + .3, 43.8, 'body', qTxt, { x: 1380, y: 300, w: 470, visual: true }],
    [T_CONC, 43.9, 'concl', 'Crescimento *consistente*, acima do *planejado*.']
  ]);
  function axis(ctx, a) {
    ctx.save(); ctx.globalAlpha *= a;
    line(ctx, X0, BASE, CX[CX.length - 1] + 150, BASE, '#F3E6D6', 4); line(ctx, X0, BASE, X0, BASE - HH - 30, '#F3E6D6', 4);
    for (let v = 0; v <= TOP + 1e-9; v += STEP) { const y = BASE - v / TOP * HH; line(ctx, X0, y, CX[CX.length - 1] + 150, y, 'rgba(243,230,214,.14)', 2, [8, 10]); line(ctx, X0 - 12, y, X0, y, '#F3E6D6', 3);
      late(ctx, c => text(c, FMT.num(v, 1), X0 - 20, y, { size: 26, weight: 800, color: '#F3E6D6', align: 'right' })); }
    late(ctx, c => text(c, UNIT[0], X0, BASE - HH - 60, { size: 26, weight: 900, mono: true, color: C.yellow, align: 'center' }));
    const src = 'Fonte: ' + (sec().source || 'dados internos da track');
    late(ctx, c => text(c, src, X0, BASE + 110, { size: 22, weight: 700, mono: true, color: '#BFB3A3' }));
    ctx.restore();
  }
  function bars(ctx, t) {
    const read = P(t, T_READ, .6);
    ROWS.forEach(([k, v], i) => {
      const p = E.outBack(P(t, T_BAR[i], .7)), x = CX[i] - BW / 2, y = hY(+v), hgt = (BASE - y) * Math.min(1, p), f = isF(k);
      const hi = i === 0 || i === 2, dim = read * (hi ? 0 : .55);
      if (p <= 0) return;
      ctx.save(); ctx.globalAlpha *= 1 - dim;
      if (f) { ctx.save(); ctx.setLineDash([12, 10]); rr(ctx, x, BASE - hgt, BW, hgt, 6); ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); hatch(ctx, () => rr(ctx, x, BASE - hgt, BW, hgt, 6), x, BASE - hgt, BW, hgt, { color: C.yellow, alpha: .35, gap: 14 }); }
      else { vslab(ctx, x, BASE - hgt, BW, hgt, 30, mix(C.red, C.orange, i / 2), { lw: 4 }); brush(ctx, x + 10, BASE - hgt + 14, BW - 20, 18, '#FFFFFF', 30 + i, .5); }
      if (hi && read > 0) glow(ctx, CX[i], BASE - hgt / 2, 220, C.yellow, .35 * read);
      ctx.restore();
      const la = clamp(p) * (1 - dim * .6);
      late(ctx, c => { c.globalAlpha *= la; text(c, FMT.usdMM(+v), CX[i] + 10, BASE - hgt - 34, { size: 30, weight: 900, color: '#FFF', align: 'center' });
        text(c, yr(k), CX[i] + 10, BASE + 36, { size: 30, weight: 900, color: f ? C.yellow : '#FFF', align: 'center' });
        if (f) text(c, '(previsão)', CX[i] + 10, BASE + 70, { size: 24, weight: 800, color: C.yellow, align: 'center' }); });
    });
    // a linha laranja liga os topos (a tendência)
    const tp = E.inOutSine(P(t, T_TREND, 1.4)); if (tp > 0) { const pts = ROWS.slice(0, 3).map(([k, v], i) => [CX[i] + 10, hY(+v) - 76]); LINE.draw(ctx, pts, tp, { w: 10, head: tp < .99, alpha: 1 - read * .5 }); }
    // a régua: 2023 → 2025
    if (read > 0 && MULT) { const xa = CX[0] + BW / 2 + 40, y0 = hY(VALS[0]), y2 = hY(VALS[2]), xr = CX[2] + BW / 2 + 70, g = E.outCubic(read);
      ctx.save(); ctx.globalAlpha *= g;
      line(ctx, CX[0] - BW / 2, y0, xr + 30, y0, rgba(C.yellow, .8), 3, [10, 8]);
      line(ctx, xr, y0, xr, lerp(y0, y2, g), C.yellow, 8); for (let k = 0; k <= 6; k++) line(ctx, xr - 14, lerp(y0, y2, k / 6), xr, lerp(y0, y2, k / 6), C.yellow, 4);
      arrowHead(ctx, xr, lerp(y0, y2, g) - 6, -Math.PI / 2, 22, C.yellow); ctx.restore();
      late(ctx, c => { c.globalAlpha *= g; retroText(c, '×' + FMT.num(MULT, 1), xr + 34, (y0 + y2) / 2, { size: 64, weight: 900, color: C.yellow, depth: 4, lw: 3 }); }); }
  }
  function brazil(ctx, t) {
    const a = P(t, T_BR, .8) * (1 - P(t, T_Q - .3, .5)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const B0 = 860, HB = 300, M = Math.max(PREV, BUD, ACT, 1e-9), hb = v => v / M * HB, UB = (M * 1e6 >= 1e6 ? ['mi', 1e6] : M * 1e6 >= 1e3 ? ['mil', 1e3] : ['', 1]), fu = v => `US$ ${FMT.num(v * 1e6 / UB[1], 2)}${UB[0] ? ' ' + UB[0] : ''}`;
    [[2560, PREV, 'período anterior', VS_PREV, 'o período anterior'], [3420, BUD, 'orçamento', VS_BUD, 'o orçamento']].forEach(([cx, ref, refL, mult, cap], g) => {
      const p = E.outBack(P(t, T_CMP[g], .6)); if (p <= 0) return;
      line(ctx, cx - 260, B0, cx + 260, B0, '#F3E6D6', 4);
      [[ref, refL, g ? null : '#8A8378', g === 1], [ACT, 'realizado', C.orange, false]].forEach(([v, l, col, dash], j) => {
        const x = cx - 190 + j * 220, hh = hb(v) * Math.min(1, p);
        if (dash) { ctx.save(); ctx.setLineDash([12, 10]); rr(ctx, x, B0 - hh, 160, hh, 6); ctx.strokeStyle = '#F3E6D6'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
        else vslab(ctx, x, B0 - hh, 160, hh, 24, col, { lw: 4 });
        late(ctx, c => { c.globalAlpha *= clamp(p); text(c, fu(v), x + 80, B0 - hh - 30, { size: 28, weight: 900, color: '#FFF', align: 'center' }); text(c, l, x + 80, B0 + 36, { size: 28, weight: 800, color: j ? C.orange : '#F3E6D6', align: 'center' }); });
      });
      late(ctx, c => { c.globalAlpha *= clamp(p); c.translate(cx, B0 - HB - 215); const s = lerp(1.6, 1, E.outExpo(clamp(p))); c.scale(s, s);
        splat(c, 0, -6, 110, g ? C.yellow : C.orange, 60 + g, 1, .9);
        retroText(c, mult ? FMT.mult(mult) : '—', 0, 0, { size: 96, weight: 900, color: '#FFF', align: 'center', depth: 6, lw: 5 });
        text(c, cap, 0, 82, { size: 32, weight: 900, color: '#FFF', align: 'center' }); });
    });
    late(ctx, c => text(c, 'Fonte: ' + (BR.source || 'dados internos'), 2260, 940, { size: 22, weight: 700, mono: true, color: '#BFB3A3' }));
    ctx.restore();
  }
  function quarters(ctx, t) {
    const a = P(t, T_Q, .7); if (a <= 0 || !QS.length) return;
    ctx.save(); ctx.globalAlpha *= a;
    const B0 = 800, HQ = 420, M = Math.max(...QS.flatMap(([, q]) => [q.actuals_2022, q.budget_2023, q.actuals_2023]), 1e-9), gx = i => 2300 + i * 240;
    line(ctx, 2210, B0, 3240, B0, '#F3E6D6', 4);
    QS.forEach(([k, q], i) => {
      [[q.actuals_2022, '#8A8378', 0], [q.budget_2023, null, 1], [q.actuals_2023, C.orange, 2]].forEach(([v, col, j]) => {
        const p = E.outCubic(P(t, T_Q + .3 + i * .25 + j * .08, .5)), x = gx(i) + j * 56, hh = v / M * HQ * p;
        if (col) vslab(ctx, x, B0 - hh, 46, hh, 12, col, { lw: 3 }); else { ctx.save(); ctx.setLineDash([9, 7]); rr(ctx, x, B0 - hh, 46, hh, 4); ctx.strokeStyle = '#F3E6D6'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
      });
      const up = q.actuals_2023 > q.budget_2023, la = P(t, T_Q + .9 + i * .25, .4);
      late(ctx, c => { c.globalAlpha *= la; text(c, qLabel(k), gx(i) + 74, B0 + 36, { size: 30, weight: 900, color: '#FFF', align: 'center' }); if (up) icon(c, 'check', gx(i) + 130, B0 - Math.max(q.actuals_2023, q.budget_2023) / M * HQ - 40, 36, C.yellow, 10); });
    });
    // legenda fixa
    late(ctx, c => { [['anterior', '#8A8378', 0], ['orçamento', null, 1], ['realizado', C.orange, 2]].forEach(([l, col, j]) => { const x = 2240 + j * 300, y = 300;
      if (col) { rr(c, x, y - 16, 34, 32, 4); c.fillStyle = col; c.fill(); c.strokeStyle = INK; c.lineWidth = 2; c.stroke(); } else { c.save(); c.setLineDash([6, 5]); rr(c, x, y - 16, 34, 32, 4); c.strokeStyle = '#F3E6D6'; c.lineWidth = 3; c.stroke(); c.restore(); }
      text(c, l, x + 48, y, { size: 28, weight: 800, color: '#FFF' }); }); text(c, `${UNIT[0]} · por trimestre`, 2240, 356, { size: 24, weight: 700, mono: true, color: '#BFB3A3' }); });
    ctx.restore();
  }
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT,
    peaks: [[T_CMP[0] - .1, T_CMP[0] + .7, .45], [T_CMP[1] - .1, T_CMP[1] + .7, .45], [T_CONC - .1, T_CONC + 1, .4]],
    draw(ctx, t) {
      const cam = camKey(t, CAM);
      bgDark(ctx, t, { centerA: .9, center: '#2E1A0E' });
      layer(ctx, cam, .25, () => skyline(ctx, t, { y: 980, h: 360, seed: 14, col: '#1A1216', lit: .4 }));
      layer(ctx, cam, .6, () => neonGrid(ctx, t, { horizon: 860, alpha: .3, speed: .4 }));
      layer(ctx, cam, 1, () => {
        // chão da galeria com reflexo
        const g = ctx.createLinearGradient(0, 820, 0, H + 80); g.addColorStop(0, 'rgba(60,32,18,.9)'); g.addColorStop(1, 'rgba(12,8,6,.95)'); ctx.fillStyle = g; ctx.fillRect(-400, 822, 4600, 400);
        axis(ctx, P(t, .3, .6) * (1 - P(t, T_BR + .4, .6))); bars(ctx, t);
        brazil(ctx, t); quarters(ctx, t);
        // a linha segue para a próxima estação
        const run = E.inCubic(P(t, T_CONC + 1.6, 3)); if (run > 0) LINE.draw(ctx, [[2200, 960], [3400, 960], [4300, 960]], run, { w: 16, head: true });
      });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- 03 · O que levamos ao mercado: capabilities explicadas no próprio filme ---------- */
(() => {
  const id = 's03';
  // música: break 0–15,4 · parte B 15,4–52,36 · saída 52,36 → síntese
  const T_CLI = [4.4, 5.5, 6.6], T_CAP = 16.0, T_INT = 25.6, T_PRED = 34.4, T_PRESC = 44.2, T_SYN = 52.3;
  const ctype = SEC(3).client_types || ['Emissores', 'Adquirentes', 'Merchants'], nm = s => /merchant/i.test(s) ? 'Varejo' : s;
  const TYPES = [[nm(ctype[0] || 'Emissores'), 'bank', 'Principalidade', 'decidir qual produto oferecer', C.red], [nm(ctype[1] || 'Adquirentes'), 'card', 'Market share', 'decidir onde crescer', C.orange],
    [nm(ctype[2] || 'Varejo'), 'basket', 'Cestas de produtos', 'decidir o que promover', C.yellow]];
  const CAPS = [['Segmentação', 'identificar públicos', 'nodes'], ['Recomendação', 'priorizar ofertas', 'chart'], ['Automação', 'executar rotinas', 'gear']];
  const PRED = [['risco de fraude', 'shield'], ['chance de saída', 'user'], ['previsão de gastos', 'coin']], PRESC = [['próxima oferta', 'card'], ['alocação de campanhas', 'chart'], ['recomendação de incentivo', 'spark']];
  const Z = [960, 3160, 5360, 7560, 9760], GY = 800;
  const CAM = [[0, Z[0], 560, 1.04], [3.8, Z[0], 540, 1], [T_CAP - 1.2, Z[0], 540, 1], [T_CAP, Z[1], 540, 1], [T_INT - 1.2, Z[1], 540, 1], [T_INT, Z[2], 540, 1],
    [T_PRED - 1.2, Z[2], 540, 1], [T_PRED, Z[3], 540, 1], [T_PRESC - 1.2, Z[3], 540, 1], [T_PRESC, Z[4], 540, 1], [T_SYN - .6, Z[4], 540, 1], [T_SYN + 1.2, 8660, 600, .55], [64, 8660, 600, .53]];
  T_CLI.forEach((t0, i) => cue(id, t0, 'pop', { p: 1 + i * .1, v: .2 })); [T_CAP, T_INT, T_PRED, T_PRESC].forEach(t0 => cue(id, t0 - 1.2, 'whoosh', { dur: 1.1, v: .3 }));
  cue(id, T_INT + 2.2, 'shimmer', { dur: 1.5 }); cue(id, T_PRESC + 3.2, 'ding'); cue(id, T_SYN, 'whoosh', { dur: 1.4, v: .3 }); cue(id, T_SYN + 1.4, 'chime', { f: 784, up: 7 });
  const SCRIPT = SAY.reg(id, [
    [3.8, T_CAP - .9, 'title', 'Onde aplicamos *analytics*', { visual: true }],
    [T_CAP + .1, T_INT - .9, 'title', 'O que entregamos em cada projeto', { visual: true }],
    [T_INT + .1, T_PRED - .9, 'title', 'Com as outras tracks'],
    [T_INT + .3, T_PRED - .9, 'body', 'Combinamos analytics com as *demais tracks* para ampliar o *impacto* dos projetos.', { y: 250, visual: true }],
    [T_PRED + .1, T_PRESC - .9, 'title', 'Modelos *preditivos* antecipam resultados', { visual: true }],
    [T_PRESC + .1, T_SYN - .5, 'title', 'Modelos *prescritivos* ajudam a escolher ações', { visual: true }],
    [T_SYN + 1.0, 64.2, 'title', 'Antecipar o que vem. *Escolher como agir.*'],
    [T_SYN + 1.6, 64.2, 'concl', 'A escolha do modelo depende do *problema* e da *decisão de negócio*.']
  ]);
  const streetSet = ctx => {
    const g = ctx.createLinearGradient(0, GY, 0, H + 200); g.addColorStop(0, '#2A1C14'); g.addColorStop(1, '#0E0907'); ctx.fillStyle = g; ctx.fillRect(-1600, GY, 13000, 600);
    line(ctx, -1600, GY, 11400, GY, INK, 6); for (let x = -1600; x < 11400; x += 160) line(ctx, x, GY + 120, x + 80, GY + 120, 'rgba(255,214,160,.18)', 6);
  };
  /** zona 1: os três tipos de cliente, cada um com uma aplicação e a decisão que ela apoia */
  function clients(ctx, t) {
    TYPES.forEach(([name, ic, app, dec, col], i) => {
      const x = Z[0] - 560 + i * 560, p = E.outBack(P(t, T_CLI[i], .6)); if (p <= 0) return;
      ctx.save(); ctx.translate(x, GY); ctx.scale(1, p);
      // fachada
      vslab(ctx, -170, -330, 340, 330, 40, mix('#3A2A24', col, .25), { lw: 4 });
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { rr(ctx, -140 + c * 72, -300 + r * 74, 46, 52, 4); ctx.fillStyle = hash(i * 31 + r * 7 + c) > .4 ? rgba('#FFD08A', .9) : '#2A1E18'; ctx.fill(); }
      if (i === 0) { ctx.beginPath(); ctx.moveTo(-190, -330); ctx.lineTo(0, -410); ctx.lineTo(190, -330); ctx.closePath(); ctx.fillStyle = mix('#5A3A30', col, .3); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); for (let k = 0; k < 5; k++) vslab(ctx, -150 + k * 66, -80, 22, 80, 6, '#E9DCC8', { lw: 2 }); }
      if (i === 2) { for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-180 + k * 60, -120); ctx.lineTo(-150 + k * 60, -80); ctx.lineTo(-120 + k * 60, -120); ctx.closePath(); ctx.fillStyle = k % 2 ? C.yellow : C.red; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke(); } }
      ctx.restore();
      if (p > .2) { vball(ctx, x, GY - 400 - (i === 0 ? 40 : 0), 58, col, { lw: 4 }); icon(ctx, ic, x, GY - 400 - (i === 0 ? 40 : 0), 60, col === C.yellow ? INK : '#FFF', 7); }
      const la = P(t, T_CLI[i] + .3, .5);
      late(ctx, c => { c.globalAlpha *= la; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12;
        text(c, name, x, GY - 490 - (i === 0 ? 40 : 0), { size: 40, weight: 900, color: '#FFF', align: 'center' }); c.shadowBlur = 0;
        c.translate(x, GY + 120); paper(c, -230, -54, 460, 132, { r: 14, fill: '#F6EEDF', shadow: 8, shadowColor: '#000', lw: 3 });
        text(c, app, 0, -16, { size: 32, weight: 900, color: INK, align: 'center' }); text(c, dec, 0, 30, { size: 26, weight: 700, color: '#4A4038', align: 'center' }); });
    });
  }
  /** zona 2: as capabilities como máquinas, três de cada vez */
  function capabilities(ctx, t) {
    CAPS.forEach(([name, sub, ic], i) => {
      const x = Z[1] - 620 + i * 620, y = 520, p = E.outBack(P(t, T_CAP + .3 + i * .5, .5)); if (p <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p);
      holo(ctx, -250, -190, 500, 380, { color: [C.red, C.orange, C.yellow][i] });
      const lt = t - T_CAP - i * .5;
      if (i === 0) { for (let k = 0; k < 36; k++) { const g = k % 3, a = hash(k * 7) * TAU, r0 = 150 * hash(k * 3), cxs = [-120, 0, 120][g], tx = cxs + Math.cos(a) * 46 * hash(k + 1), ty = Math.sin(a) * 46 * hash(k + 2) + 10, e = E.inOutCubic(clamp(lt / 2.4));
          circle(ctx, lerp(Math.cos(a * 3) * r0, tx, e), lerp(Math.sin(a * 2) * r0 * .6, ty, e), 9, e > .5 ? [C.red, C.orange, C.yellow][g] : '#BFB3A3', INK, 2); } }
      if (i === 1) { const ord = [2, 0, 3, 1], e = E.inOutCubic(clamp((lt - .8) / 1.6)); for (let k = 0; k < 4; k++) { const to = ord.indexOf(k), yy = -120 + lerp(k, to, e) * 70;
          rr(ctx, -170, yy - 26, 340, 52, 10); ctx.fillStyle = to === 0 && e > .9 ? C.orange : '#F6EEDF'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
          rr(ctx, -150, yy - 8, 160 - k * 26, 16, 8); ctx.fillStyle = to === 0 && e > .9 ? '#FFF' : '#BFB3A3'; ctx.fill(); text(ctx, String(lerp(k, to, e) < .5 ? 1 : Math.round(lerp(k, to, e)) + 1), 140, yy, { size: 26, weight: 900, color: INK, align: 'center' }); } }
      if (i === 2) { for (let k = 0; k < 3; k++) { ctx.save(); ctx.translate(-120 + k * 120, -40); ctx.rotate(t * (k % 2 ? -1.6 : 1.6)); icon(ctx, 'gear', 0, 0, 100, [C.red, C.orange, C.yellow][k], 9); ctx.restore(); }
        for (let k = 0; k < 4; k++) { const d = (t * .5 + k / 4) % 1, xx = lerp(-210, 210, d); paper(ctx, xx - 18, 80, 36, 46, { r: 3, fill: d > .5 ? '#F6EEDF' : '#FFD9CF', shadow: 2, lw: 2, volume: false }); if (d > .5) icon(ctx, 'check', xx, 103, 26, '#D9890B', 7); } }
      ctx.restore();
      const la = P(t, T_CAP + .6 + i * .5, .5);
      late(ctx, c => { c.globalAlpha *= la; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12; text(c, name, x, y - 240, { size: 40, weight: 900, color: '#FFF', align: 'center' }); text(c, sub, x, y + 240, { size: 32, weight: 800, color: C.yellow, align: 'center' }); });
    });
  }
  /** zona 3: as tracks se encontram na mesma decisão (baldeação) */
  function integration(ctx, t) {
    const a = P(t, T_INT - .8, .6); if (a <= 0) return; const cx = Z[2], cy = 600, lt = t - T_INT;
    const LINES = [[[cx - 980, GY - 40], [cx - 500, 720], [cx - 150, cy + 30], [cx, cy]], [[cx - 700, 160], [cx - 360, 330], [cx - 90, 520], [cx, cy]], [[cx + 760, 140], [cx + 420, 320], [cx + 110, 520], [cx, cy]], [[cx + 980, GY - 20], [cx + 520, 740], [cx + 160, cy + 40], [cx, cy]]];
    const COL = [C.orange, C.red, C.yellow, '#E9DCC8'];
    LINES.forEach((pts, k) => { const p = E.inOutSine(clamp((lt - k * .35) / 1.6)); LINE.draw(ctx, pts, p, { w: k ? 14 : 20, col: COL[k], head: p > 0 && p < .99, glow: k ? 0 : 12 }); });
    const sp = E.outBack(P(t, T_INT + 2.0, .5)); if (sp > 0) { glow(ctx, cx, cy, 260, C.orange, .5 * sp); ctx.save(); ctx.translate(cx, cy); ctx.scale(sp, sp); circle(ctx, 0, 0, 70, '#FFF8EE', INK, 6); icon(ctx, 'board', 0, 0, 74, INK, 7); ctx.restore(); }
    late(ctx, c => { c.globalAlpha *= P(t, T_INT + 2.2, .5); c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12;
      text(c, 'a decisão do cliente', cx, cy + 116, { size: 34, weight: 900, color: '#FFF', align: 'center' });
      text(c, 'analytics', cx - 640, GY - 92, { size: 30, weight: 900, color: C.orange, align: 'center' });
      text(c, 'outras tracks', cx - 560, 330, { size: 30, weight: 900, color: C.yellow, align: 'center' }); });
  }
  /** zona 4: previsão como cenário (faixa de incerteza), não certeza */
  function predictive(ctx, t) {
    const a = P(t, T_PRED - .9, .6); if (a <= 0) return; const lt = t - T_PRED, x0 = Z[3] - 760, x1 = Z[3] + 560, xn = Z[3] + 40, yb = 760, yt = 340;
    ctx.save(); ctx.globalAlpha *= a;
    holo(ctx, x0 - 60, yt - 70, x1 - x0 + 120, yb - yt + 150, { color: C.orange });
    line(ctx, x0, yb, x1, yb, 'rgba(255,233,214,.5)', 3); line(ctx, x0, yb, x0, yt, 'rgba(255,233,214,.5)', 3);
    const f = x => 590 - 110 * Math.sin((x - x0) / 180) - (x - x0) * .12, hist = E.outCubic(clamp(lt / 1.2)), fut = E.outCubic(clamp((lt - 1.1) / 1.6));
    ctx.beginPath(); for (let x = x0; x <= lerp(x0, xn, hist); x += 8) { x === x0 ? ctx.moveTo(x, f(x)) : ctx.lineTo(x, f(x)); } ctx.strokeStyle = '#F6EEDF'; ctx.lineWidth = 6; ctx.stroke();
    if (fut > 0) { const xe = lerp(xn, x1, fut), y0 = f(xn); [[.9, .18], [.5, .32]].forEach(([w, al]) => { ctx.beginPath(); ctx.moveTo(xn, y0);
        for (let x = xn; x <= xe; x += 8) ctx.lineTo(x, y0 - (x - xn) * .32 - (x - xn) * w * .55); for (let x = xe; x >= xn; x -= 8) ctx.lineTo(x, y0 - (x - xn) * .32 + (x - xn) * w * .55); ctx.closePath(); ctx.fillStyle = rgba(C.orange, al); ctx.fill(); });
      ctx.save(); ctx.setLineDash([16, 12]); line(ctx, xn, y0, xe, y0 - (xe - xn) * .32, C.yellow, 6); ctx.restore(); }
    line(ctx, xn, yt - 20, xn, yb, 'rgba(255,233,214,.6)', 3, [8, 8]);
    ctx.restore();
    late(ctx, c => { c.globalAlpha *= a; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 10;
      text(c, 'histórico', x0 + 200, yb + 40, { size: 28, weight: 800, color: '#F6EEDF', align: 'center' }); text(c, 'hoje', xn, yb + 40, { size: 28, weight: 800, color: '#FFF', align: 'center' });
      c.globalAlpha *= clamp((lt - 1.6) / .5); text(c, 'cenário provável', x1 - 120, f(xn) - (x1 - xn) * .32 - 30, { size: 28, weight: 900, color: C.yellow, align: 'center' });
      text(c, 'faixa de incerteza', x1 - 150, f(xn) - (x1 - xn) * .32 + 170, { size: 26, weight: 800, color: '#FFB58A', align: 'center' });
      text(c, 'previsão é cenário, não certeza', Z[3], yt - 40, { size: 26, weight: 700, mono: true, color: '#E9DCC8', align: 'center' }); });
    PRED.forEach(([l, ic], i) => { const p = E.outBack(P(t, T_PRED + 1.0 + i * .45, .45)); if (p <= 0) return; const x = Z[3] - 500 + i * 500;
      late(ctx, c => { c.translate(x, 960); c.scale(p, p); circle(c, -tagW(c, l) / 2 - 10, 0, 30, C.orange, INK, 3); icon(c, ic, -tagW(c, l) / 2 - 10, 0, 34, '#FFF', 7); tag(c, 24, 0, l, { size: 30 }); }); });
  }
  const tagW = (c, l) => measure(c, l, 30, 800) + 39;
  /** zona 5: escolher uma ação com o objetivo escrito */
  function prescriptive(ctx, t) {
    const a = P(t, T_PRESC - .9, .6); if (a <= 0) return; const lt = t - T_PRESC, jx = Z[4] - 520, jy = 560, OUT = [[Z[4] + 380, 330, .55], [Z[4] + 380, 560, .86], [Z[4] + 380, 790, .38]];
    ctx.save(); ctx.globalAlpha *= a;
    LINE.draw(ctx, [[Z[4] - 1100, jy], [jx, jy]], E.inOutSine(clamp(lt / 1)), { w: 20, head: lt < 1 });
    OUT.forEach(([x, y, v], k) => { const p = E.inOutSine(clamp((lt - .8 - k * .2) / 1.2)), best = k === 1, lit = best ? P(t, T_PRESC + 3.2, .5) : 0;
      LINE.draw(ctx, [[jx, jy], [jx + 260, lerp(jy, y, .6)], [x - 150, y]], p, { w: best ? 18 : 12, col: best ? mix('#8A8378', C.orange, lit) : '#8A8378', head: best && lit > 0 && lit < 1, alpha: best ? 1 : 1 - .45 * lit });
      if (p > .95) { const bw = 260 * v * E.outCubic(clamp((lt - 2 - k * .15) / .8)); rr(ctx, x - 120, y - 20, 300, 40, 10); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fill(); rr(ctx, x - 120, y - 20, bw, 40, 10); ctx.fillStyle = best ? C.yellow : '#8A8378'; ctx.fill(); }
      late(ctx, c => { c.globalAlpha *= clamp(p * 2) * (best ? 1 : 1 - .4 * lit); text(c, `ação ${'ABC'[k]}`, x - 150, y - 50, { size: 30, weight: 900, color: best && lit > .5 ? C.yellow : '#FFF' }); }); });
    circle(ctx, jx, jy, 26, '#FFF8EE', INK, 5);
    ctx.restore();
    late(ctx, c => { c.globalAlpha *= a * P(t, T_PRESC + 1.4, .5); c.translate(jx - 40, jy - 140); c.rotate(-.03); tag(c, 0, 0, 'objetivo: maior conversão', { size: 30, fill: C.red, color: '#FFF' });
      c.setTransform(c.getTransform()); });
    late(ctx, c => { c.globalAlpha *= a * P(t, T_PRESC + 2.0, .5); text(c, 'resultado estimado (ilustrativo)', Z[4] + 530, 220, { size: 24, weight: 700, mono: true, color: '#E9DCC8', align: 'center' }); });
    PRESC.forEach(([l, ic], i) => { const p = E.outBack(P(t, T_PRESC + 1.0 + i * .45, .45)); if (p <= 0) return; const x = Z[4] - 560 + i * 560;
      late(ctx, c => { c.translate(x, 960); c.scale(p, p); circle(c, -tagW(c, l) / 2 - 10, 0, 30, C.red, INK, 3); icon(c, ic, -tagW(c, l) / 2 - 10, 0, 34, '#FFF', 7); tag(c, 24, 0, l, { size: 30 }); }); });
  }
  function synthesis(ctx, t) {
    const a = P(t, T_SYN + .4, .7); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = .72 * a; ctx.fillStyle = '#0C0806'; ctx.fillRect(0, 0, W, H); ctx.restore();
    [[520, 'PREDITIVOS', 'Antecipar o que', 'pode acontecer', C.orange, 0], [1400, 'PRESCRITIVOS', 'Recomendar', 'como agir', C.red, 1]].forEach(([x, k, s1, s2, col, i]) => {
      const p = E.outBack(P(t, T_SYN + .7 + i * .35, .55)); if (p <= 0) return;
      hud(ctx, c => { c.translate(x, 560); c.scale(p, p); c.rotate(i ? .012 : -.012);
        paper(c, -380, -250, 760, 500, { r: 22, fill: '#F6EEDF', shadow: 14, shadowColor: '#000', lw: 4 });
        tag(c, 0, -250, k, { size: 34, fill: col, color: '#FFF' });
        text(c, s1, 0, -150, { size: 60, weight: 900, color: INK, align: 'center' }); text(c, s2, 0, -82, { size: 60, weight: 900, color: col, align: 'center' });
        c.save(); c.translate(0, 90);
        if (!i) { line(c, -260, 60, -40, 0, INK, 7); c.beginPath(); c.moveTo(-40, 0); c.lineTo(260, -110); c.lineTo(260, 110); c.closePath(); c.fillStyle = rgba(C.orange, .35); c.fill(); c.setLineDash([14, 10]); line(c, -40, 0, 260, 0, C.orange, 6); c.setLineDash([]); circle(c, -40, 0, 12, '#FFF', INK, 3); }
        else { line(c, -260, 0, -60, 0, INK, 8); [[-110], [0], [110]].forEach(([dy], j) => line(c, -60, 0, 240, dy, j === 1 ? C.red : '#BFB3A3', j === 1 ? 9 : 5)); circle(c, -60, 0, 14, '#FFF', INK, 3); circle(c, 240, 0, 16, C.red, INK, 3); }
        c.restore();
        text(c, i ? 'próxima oferta · campanhas · incentivos' : 'fraude · saída · gastos', 0, 210, { size: 28, weight: 800, color: '#4A4038', align: 'center' }); }, a);
    });
  }
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT,
    peaks: [[T_INT + 2, T_INT + 2.8, .45], [T_PRESC + 3.1, T_PRESC + 3.9, .5], [T_SYN, T_SYN + 1.2, .4]],
    draw(ctx, t) {
      const cam = camKey(t, CAM), pan = [T_CAP, T_INT, T_PRED, T_PRESC].some(t0 => t > t0 - 1.2 && t < t0);
      bgDark(ctx, t, { centerA: .9, center: '#2A1A10' });
      layer(ctx, cam, .2, () => skyline(ctx, t, { y: 900, h: 460, seed: 33, col: '#1E1418', lit: .5 }));
      layer(ctx, cam, .45, () => skyline(ctx, t, { y: 980, h: 300, seed: 41, col: '#120C0E', lit: .3, x: 1200 }));
      layer(ctx, cam, 1, () => {
        streetSet(ctx);
        LINE.draw(ctx, [[-1200, GY + 60], [11200, GY + 60]], 1, { w: 14, alpha: .55, shadow: false });
        clients(ctx, t); capabilities(ctx, t); integration(ctx, t); predictive(ctx, t); prescriptive(ctx, t); synthesis(ctx, t);
      });
      if (pan) { const r = rng(Math.floor(t * 3)); ctx.save(); ctx.globalAlpha = .35; for (let k = 0; k < 16; k++) { const y = r() * H, x = r() * W; line(ctx, x, y, x + 400 + r() * 500, y, k % 3 ? 'rgba(255,240,220,.5)' : rgba(C.orange, .6), 2 + r() * 4); } ctx.restore(); }
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- Conversa 1: o que já foi explicado, legível sem fala (cartazes 01, 02, 03 + lupa) ---------- */
POSTERS[1] = (ctx, w, h, tl) => {
  const SV = TX.engagement.map(e => e[0]), DEF = ['entender o problema', 'definir o caminho', 'construir a solução', 'verificar o resultado'], COL = [C.red, C.orange, C.yellow, '#FFD9A8'];
  late(ctx, c => para(c, 'Conectamos *perguntas de negócio*, dados, implementação e mensuração.', 0, -246, 420, { size: 26, weight: 900, color: INK, accent: C.red, align: 'center', lh: 1.15 }));
  SV.forEach((sv, i) => { const y = -90 + i * 86, on = Math.floor(tl / 2) % 4 === i; rr(ctx, -210, y - 36, 420, 72, 10); ctx.fillStyle = on ? COL[i] : '#FFFDF8'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
    late(ctx, c => { circle(c, -178, y, 16, COL[i], INK, 2.5); text(c, String(i + 1), -178, y + 1, { size: 18, weight: 900, color: i === 3 ? INK : '#FFF', align: 'center' });
      text(c, sv, -150, y - 13, { size: 24, weight: 900, color: INK }); text(c, DEF[i], -150, y + 16, { size: 20, weight: 700, color: '#3A332C' }); }); });
  late(ctx, c => text(c, 'Dados → Decisão → Ação → Resultado', 0, 262, { size: 20, weight: 900, mono: true, color: '#8A6A48', align: 'center' }));
};
POSTERS[2] = (ctx, w, h, tl) => {
  const sec = SEC(2), R = Object.entries(sec.revenue_performance_analytics_usd_millions || {}), V = R.map(r => +r[1] || 0), mx = Math.max(...V, 1e-9), BR = sec.brazil_2023_milestone || {};
  const isF = k => /forecast/i.test(k);
  line(ctx, -200, 30, 200, 30, INK, 3);
  R.forEach(([k, v], i) => { const x = -170 + i * 110, hh = (+v || 0) / mx * 190; if (isF(k)) { ctx.save(); ctx.setLineDash([7, 6]); rr(ctx, x, 30 - hh, 70, hh, 4); ctx.strokeStyle = '#C98A1A'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); } else vslab(ctx, x, 30 - hh, 70, hh, 12, mix(C.red, C.orange, i / 2), { lw: 2.5 });
    late(ctx, c => { text(c, FMT.usdMM(+v), x + 35, 30 - hh - 18, { size: 17, weight: 900, color: INK, align: 'center' }); text(c, k.replace(/_?forecast/i, '') + (isF(k) ? '*' : ''), x + 35, 50, { size: 18, weight: 900, color: INK, align: 'center' }); }); });
  const mult = V.length > 2 && V[0] ? V[2] / V[0] : null, vp = BR.actuals_2022_usd_millions ? BR.actuals_2023_usd_millions / BR.actuals_2022_usd_millions : null, vb = BR.budget_2023_usd_millions ? BR.actuals_2023_usd_millions / BR.budget_2023_usd_millions : null;
  late(ctx, c => { text(c, 'faturamento anual · base zero · * previsão', 0, -244, { size: 18, weight: 800, color: '#6A6056', align: 'center' });
    if (mult) para(c, `De ${R[0][0]} a ${R[2][0]}: *${FMT.num(mult, 1)}×* o valor inicial`, 0, 84, 420, { size: 22, weight: 900, color: INK, accent: C.red, align: 'center' });
    para(c, `Brasil (estimativa): *${vp ? FMT.mult(vp) : '—'}* o período anterior · *${vb ? FMT.mult(vb) : '—'}* o orçamento`, 0, 150, 420, { size: 22, weight: 800, color: INK, accent: C.red, align: 'center' });
    text(c, 'Crescimento consistente, acima do planejado.', 0, 246, { size: 20, weight: 900, color: C.red, align: 'center' }); });
};
POSTERS[3] = (ctx, w, h, tl) => {
  late(ctx, c => { [['PREDITIVOS', 'antecipam resultados', 'fraude · saída · gastos', C.orange, -150], ['PRESCRITIVOS', 'ajudam a escolher ações', 'oferta · campanhas · incentivos', C.red, 40]].forEach(([k, s1, s2, col, y]) => {
      tag(c, 0, y - 60, k, { size: 22, fill: col, color: '#FFF' }); text(c, s1, 0, y - 6, { size: 28, weight: 900, color: INK, align: 'center' }); text(c, s2, 0, y + 34, { size: 21, weight: 700, color: '#3A332C', align: 'center' }); });
    text(c, 'Emissores · Adquirentes · Varejo', 0, -238, { size: 22, weight: 900, color: '#8A6A48', align: 'center' });
    para(c, 'A escolha do modelo depende do *problema* e da *decisão de negócio*.', 0, 160, 420, { size: 22, weight: 800, color: INK, accent: C.red, align: 'center' });
    text(c, 'lupa: catálogo com 20 modelos', 0, 252, { size: 18, weight: 800, mono: true, color: '#8A6A48', align: 'center' }); });
};
/** lupa da estação 03: o catálogo completo de modelos (preditivos × prescritivos) */
SLIDE_SCREENS.catalog = (c, t) => {
  bgDark(c, t, { centerA: .9, center: '#2A1A10' });
  text(c, 'Modelos que levamos a *bancos e fintechs*'.replace(/\*/g, ''), LAY.x, 110, { size: 52, weight: 900, color: '#FFF' });
  text(c, 'caso de uso em português · técnica em inglês', LAY.x, 168, { size: 26, weight: 700, color: '#E9DCC8' });
  [['PREDITIVOS · antecipam o que vai acontecer', TX.ml.pred, C.orange, 96], ['PRESCRITIVOS · recomendam o que fazer', TX.ml.presc, C.red, 990]].forEach(([h, list, col, x]) => {
    tag(c, x + 300, 236, h, { size: 26, fill: col, color: '#FFF' });
    list.forEach(([uc, tech], i) => { const y = 300 + i * 74; rr(c, x, y, 834, 62, 10); c.fillStyle = i % 2 ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.11)'; c.fill();
      text(c, uc, x + 20, y + 31, { size: 28, weight: 800, color: '#FFF' }); text(c, tech, x + 814, y + 31, { size: 22, weight: 700, mono: true, color: C.yellow, align: 'right' }); });
  });
  para(c, TX.ml.frontier, W / 2, 1050 - 40, 1700, { size: 26, weight: 700, color: '#E9DCC8', accent: C.yellow, align: 'center' });
};
STOPSCN.stop1 = recapScene({ posters: [1, 2, 3], sign: 'PARADA 1 · CONVERSA', from: CONFIG.sceneById.s03.end, call: 'ONDE ISSO ENCONTRA O SEU CLIENTE?',
  banner: 'A seguir: *quatro cases*, do problema à solução e ao resultado.', doodles: [['star', 120, 250, 70, C.yellow], ['arrow', 1800, 230, 90, C.orange]] });
