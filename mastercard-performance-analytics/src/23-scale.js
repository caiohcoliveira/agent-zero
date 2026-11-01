/* ============================================================================
   23. TRECHO 2 (fim) — estação 05 (escada da escala), estação 06 (Practice)
   e a Parada 2
   ========================================================================== */
/** indicadores de escala do JSON (em inglês) → texto de tela em pt-BR */
function ptScale(s) {
  return String(s || '').replace(/(\d+(?:\.\d+)?)MM/g, (_, n) => FMT.mm(n)).replace(/\binteractions\b/g, 'interações').replace(/\bcustomers\b/g, 'clientes')
    .replace(/PF associates/g, 'associados PF').replace(/acquirers in pipeline/g, 'adquirentes no pipeline').replace(/to conquer without growing the team/g, 'a conquistar sem crescer o time');
}

/* ---------- 05 · Scaling Our Impact Through Data, AI & Innovation ---------- */
(() => {
  const id = 's05', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const T_STEP = [.5, bt(1), bt(2), bt(3)], T_GLOW = bt(4), T_KEY = bt(4) + .7;
  const EX = () => {
    const ex = SEC(5).innovation_examples || [], f = re => ex.find(e => re.test(e.example || '')) || {};
    return [[{ name: 'planilhas · retrabalho', ind: 'insights escritos à mão' }], [{ name: 'Cliente Banana', ind: ptScale(f(/Banana/).scale_indicator) }],
      [{ name: 'Cliente Manga', ind: ptScale(f(/Manga/).scale_indicator) }, { name: 'Lights-off', ind: 'reporting automatizado' }], [{ name: 'Insight Agent', ind: ptScale(f(/Insight/).scale_indicator) }]];
  };
  T_STEP.forEach((t0, i) => { cue(id, t0, 'stab', { i }); cue(id, t0, 'pop', { p: .8 + i * .2, v: .2 }); });
  cue(id, T_GLOW, 'shimmer', { dur: 2 }); cue(id, T_KEY, 'chime', { f: 1046, up: 7 });

  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_GLOW - .1, T_GLOW + 1.2, .6]],
    caps: [[.8, T_GLOW - .2, 'Como escalamos: do trabalho manual a *ativos de IA* que rodam sozinhos', 'ESCALA'],
      [T_GLOW + .1, 13.4, 'Cada degrau leva o mesmo time a *mais clientes* — com o dado protegido', 'ESCALA']],
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .85, center: '#2A170C' });
      const gl = P(t, T_GLOW, 1);
      neonGrid(ctx, t, { horizon: 980, sun: 0, alpha: .3 + .5 * gl, speed: .5 + BT.level });
      collage(ctx, t, { seed: 83, n: 5, theme: 'dark', alpha: .5 * (1 - gl) });
      const ex = EX(), sw = 400, sh = 150, x0 = 170, y0 = 900;
      TX.progression.forEach((label, i) => {
        const p = E.outBack(P(t, T_STEP[i], .45)); if (p <= 0) return;
        const x = x0 + i * (sw + 30), y = y0 - (i + 1) * sh, h = (i + 1) * sh, neon = i === 3 || gl > 0;
        ctx.save(); ctx.translate(0, (1 - p) * 300);
        if (i === 3) { holo(ctx, x, y, sw, h, { color: C.orange, corners: true }); glow(ctx, x + sw / 2, y + 40, 260, C.orange, .35 + .25 * BT.level); }
        else { brush(ctx, x, y, sw, h, [C.red, C.orange, C.yellow][i], 120 + i, 1); inkRect(ctx, x, y, sw, h, 6, 4, i); if (gl > 0) { ctx.save(); ctx.globalAlpha *= gl * .8; ctx.shadowColor = C.orange; ctx.shadowBlur = 24; rr(ctx, x, y, sw, h, 6); ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); } }
        const dark = i === 2 && !neon ? INK : '#FFF';
        retroText(ctx, '0' + (i + 1), x + 30, y + 44, { size: 44, weight: 900, color: '#FFF', depth: 3, lw: 3 });
        text(ctx, twoLines(label), x + sw / 2, y + 110, { size: 30, weight: 900, color: i === 2 ? INK : '#FFF', align: 'center', lh: 1.05 });
        ex[i].forEach((e, j) => { const ey = y - 76 - j * 96, ea = P(t, T_STEP[i] + .5 + j * .3, .4); if (ea <= 0) return;
          ctx.save(); ctx.globalAlpha *= ea; ctx.translate(x + sw / 2, ey); ctx.rotate([-.02, .02][j] || 0);
          const ind = measure(ctx, e.ind, 18, 600) > 380 ? twoLines(e.ind) : e.ind, two = ind.includes('\n'), w = Math.min(420, Math.max(measure(ctx, e.name, 24, 900), ...ind.split('\n').map(l => measure(ctx, l, 18, 600))) + 50), hh = two ? 86 : 64;
          paper(ctx, -w / 2, -hh / 2, w, hh, { r: 8, fill: '#F6EEDF', shadow: 6, shadowColor: '#000', lw: 2.5 });
          text(ctx, e.name, 0, -hh / 2 + 22, { size: 24, weight: 900, color: INK, align: 'center' }); text(ctx, ind, 0, two ? 14 : 16, { size: 18, weight: 600, color: '#4A4038', align: 'center', lh: 1.1 }); ctx.restore(); });
        ctx.restore();
      });
      // o trem sobe a escada pulando no tempo
      const k = T_STEP.filter(t0 => t >= t0).length - 1;
      if (k >= 0) { const hop = 1 - Math.pow(2 * clamp(BT.phase) - 1, 2), tx = x0 + k * (sw + 30) + 46, ty = y0 - (k + 1) * sh - 22 - hop * 30;
        glow(ctx, tx, ty, 70, C.orange, .6); circle(ctx, tx, ty, 18, C.orange); inkCircle(ctx, tx, ty, 18, 4, 77); }
      // IA local: escudo e GPU no último degrau
      const sp = P(t, T_STEP[3] + .6, .5); if (sp > 0) { const sx = x0 + 3 * (sw + 30) + sw / 2, sy = y0 - 4 * sh + 300;
        ctx.save(); ctx.globalAlpha *= sp; icon(ctx, 'shield', sx - 90, sy, 70, C.yellow, 7); neonText(ctx, TX.never, sx + 40, sy, { size: 26, weight: 800, align: 'center', glow: C.yellow });
        formula(ctx, 'IA local · GPU · egress: 0 B', sx, sy + 70, { size: 16, neon: true }); ctx.restore(); }
      const kp = P(t, T_KEY, .5); if (kp > 0) paintTitle(ctx, 'Do manual à IA escalável', 560, 190, { size: 64, bg: C.red, seed: 33, p: kp });
      scanlines(ctx, .05 + .04 * gl);
    }
  };
  POSTERS[5] = (ctx, w, h, tl) => {
    TX.progression.forEach((l, i) => { const sw = (w - 60) / 4, x = -w / 2 + 20 + i * (sw + 7), hh = 60 + i * 50, y = 120 - hh, on = Math.floor(tl * 1.2) % 4 === i;
      rr(ctx, x, y, sw, hh, 4); ctx.fillStyle = on ? C.orange : [C.red, '#E8822A', C.yellow, '#2A221C'][i]; ctx.fill(); inkRect(ctx, x, y, sw, hh, 4, 2.5, i);
      text(ctx, twoLines(l), x + sw / 2, 160, { size: 14, weight: 900, color: INK, align: 'center', lh: 1.05 }); });
    text(ctx, 'IA local', 0, 240, { size: 40, weight: 900, color: C.orange, align: 'center' });
    text(ctx, TX.never, 0, 286, { size: 24, weight: 800, color: INK, align: 'center' });
  };
})();

/* ---------- 06 · A Prática ----------
   Tudo vem do JSON (seção 6): "pillars" = [{ pillar, highlights: [...] }, …]. A cena se ajusta à
   quantidade de pilares (até 6) e ao tamanho dos textos (a fonte diminui para caber no cartão).
   Também aceita pilares como texto simples ("Pessoas", …). */
(() => {
  const id = 's06', G = grid(id), B = G.bars, bt = k => (B[k] != null ? B[k] : B[B.length - 1] + (k - B.length + 1) * 2.22);
  const PIL = (() => (SEC(6).pillars || []).slice(0, 6).map(p => typeof p === 'string' ? { name: p, items: [] } : { name: p.pillar || p.name || '', items: p.highlights || p.items || [] }))();
  const N = Math.max(1, PIL.length), T_COL = PIL.map((_, i) => .3 + i * Math.min(1.6, 7.8 / N)), T_PED = bt(4), T_CARDS = bt(4) + 1.1, T_BOARD = 16.2;
  const COLS = [C.red, C.orange, C.yellow, '#E8822A', C.red, C.orange];
  const CAPS = [[1, T_PED - .2, `Os *${N} pilares* que sustentam a prática de analytics`, 'A PRÁTICA'], [T_PED + .2, T_BOARD - .3, 'Cada pilar e suas *principais entregas*', 'ENTREGAS'],
    [T_BOARD, 20, 'Segunda parada: conversa sobre as estações *04, 05 e 06*', 'PARADA 2']];
  T_COL.forEach((t0, i) => cue(id, t0, 'pop', { p: .7 + i * .1, v: .2 })); cue(id, T_PED, 'impact', { size: .8 });
  PIL.forEach((_, i) => cue(id, T_CARDS + i * .25, 'hit', { size: .25 })); cue(id, T_BOARD, 'type', { n: 22, gap: .025 });
  // layout dos cartões calculado uma vez (texto quebrado e fonte que cabe)
  const CW = Math.min(360, (W - 120 - (N - 1) * 20) / N), CH = 600, PAD = 22;
  let LAY = null;
  const layout = ctx => {
    if (LAY) return LAY;
    LAY = PIL.map(p => { for (let fs = 22; fs >= 12; fs--) { const lines = p.items.map(it => wrapText(ctx, it, CW - PAD * 2 - 22, fs, 700)), h = lines.reduce((s, l) => s + l.length * fs * 1.22 + fs * .55, 0);
      if (h <= CH - 130 || fs === 12) return { fs, lines }; } });
    return LAY;
  };

  function column(ctx, x, yb, h, label, p, i, w) {
    if (p <= 0) return; const hh = h * E.outBack(p);
    ctx.save(); ctx.translate(x, yb);
    rr(ctx, -w / 2 - 20, -24, w + 40, 24, 3); ctx.fillStyle = '#E9DFCF'; ctx.fill(); inkRect(ctx, -w / 2 - 20, -24, w + 40, 24, 3, 3, i);
    rr(ctx, -w / 2, -24 - hh, w, hh, 2); ctx.fillStyle = '#F3EBDD'; ctx.fill();
    hatch(ctx, () => rr(ctx, -w / 2, -24 - hh, w, hh, 2), -w / 2, -24 - hh, w * .35, hh, { alpha: .25, gap: 7, angle: 0 });
    for (let k = 1; k < 5; k++) line(ctx, -w / 2 + k * w / 5, -30, -w / 2 + k * w / 5, -18 - hh, rgba(INK, .35), 2);
    inkRect(ctx, -w / 2, -24 - hh, w, hh, 2, 3.5, i + 4);
    rr(ctx, -w / 2 - 16, -48 - hh, w + 32, 28, 4); ctx.fillStyle = '#E9DFCF'; ctx.fill(); inkRect(ctx, -w / 2 - 16, -48 - hh, w + 32, 28, 4, 3, i + 8);
    ctx.save(); ctx.translate(0, -24 - hh / 2); ctx.rotate(-Math.PI / 2); const fs = Math.min(28, (hh - 30) / Math.max(1, measure(ctx, label, 28, 900)) * 28);
    text(ctx, label, 0, 0, { size: fs, weight: 900, color: INK, align: 'center', alpha: clamp(p * 2 - .6) }); ctx.restore();
    ctx.restore();
  }
  function card(ctx, k, x, y, p, L) {
    if (p <= 0) return; const pl = PIL[k], col = COLS[k % COLS.length], s = E.outBack(p);
    ctx.save(); ctx.translate(x + CW / 2, y + CH / 2 + (1 - s) * 80); ctx.scale(s, s); ctx.rotate([-.012, .01, -.008, .012, -.01, .008][k]);
    paper(ctx, -CW / 2, -CH / 2, CW, CH, { torn: true, seed: 210 + k, fill: '#FFFDF8', shadow: 10, lw: 3.5, tape: [[.5, 0, .1]] });
    rr(ctx, -CW / 2 + 14, -CH / 2 + 16, CW - 28, 62, 10); ctx.fillStyle = col; ctx.fill(); inkRect(ctx, -CW / 2 + 14, -CH / 2 + 16, CW - 28, 62, 10, 3, k);
    const ns = Math.min(30, (CW - 60) / Math.max(1, measure(ctx, pl.name, 30, 900)) * 30);
    text(ctx, pl.name, 0, -CH / 2 + 48, { size: ns, weight: 900, color: col === C.yellow ? INK : '#FFF', align: 'center' });
    text(ctx, `${pl.items.length} ${pl.items.length === 1 ? 'entrega' : 'entregas'}`, 0, -CH / 2 + 100, { size: 16, weight: 800, mono: true, color: '#8A6A48', align: 'center', ls: 2 });
    let yy = -CH / 2 + 132; const fs = L.fs;
    L.lines.forEach((ls, j) => { const a = P(NOW, T_CARDS + k * .25 + .3 + j * .12, .3); circle(ctx, -CW / 2 + PAD + 6, yy + fs * .5, 5, col);
      ls.forEach((l, q) => text(ctx, l, -CW / 2 + PAD + 20, yy + fs * .5 + q * fs * 1.22, { size: fs, weight: 700, color: INK, alpha: a }));
      yy += ls.length * fs * 1.22 + fs * .55; });
    ctx.restore();
  }

  SCENES[id] = {
    themeAt: () => 'light', fx: { invert: false, chroma: .5 }, caps: CAPS,
    draw(ctx, t) {
      bgLight(ctx, t); collage(ctx, t, { seed: 97, n: 6, theme: 'light', alpha: .7 });
      // o templo: um pilar por coluna, depois o frontão "A PRÁTICA"
      const tA = 1 - E.inCubic(P(t, T_CARDS - .2, .6)), cx = 960, yb = 900, colH = 430, gap = Math.min(220, 1300 / N), cw = Math.min(120, gap * .62);
      if (tA > 0) { ctx.save(); ctx.globalAlpha *= tA;
        PIL.forEach((pl, i) => column(ctx, cx + (i - (N - 1) / 2) * gap, yb, colH, pl.name, P(t, T_COL[i], .5), i, cw));
        const pp = P(t, T_PED - .25, .25, E.inQuad), hw = (N - 1) * gap / 2 + cw + 60; if (pp > 0) { const y = lerp(-300, yb - colH - 60, pp);
          ctx.save(); ctx.translate(cx, y); const tri = () => { ctx.beginPath(); ctx.moveTo(-hw, 30); ctx.lineTo(0, -110); ctx.lineTo(hw, 30); ctx.closePath(); }; tri(); ctx.fillStyle = '#F3EBDD'; ctx.fill(); ink(ctx, tri, 4, 7);
          rr(ctx, -hw - 20, 30, hw * 2 + 40, 44, 4); ctx.fillStyle = '#E9DFCF'; ctx.fill(); inkRect(ctx, -hw - 20, 30, hw * 2 + 40, 44, 4, 4, 9);
          retroText(ctx, 'A PRÁTICA', 0, -16, { size: 52, weight: 900, color: C.orange, align: 'center', depth: 3, lw: 3, ls: 8 }); ctx.restore(); }
        ctx.restore(); }
      // os cartões: cada pilar com suas entregas (texto do JSON)
      if (t > T_CARDS - .2) { const L = layout(ctx), x0 = W / 2 - (N * CW + (N - 1) * 20) / 2;
        paintTitle(ctx, 'A PRÁTICA', W / 2, 225, { size: 58, bg: C.orange, seed: 44, p: P(t, T_CARDS - .2, .6), splat: false });
        PIL.forEach((_, k) => card(ctx, k, x0 + k * (CW + 20), 300, P(t, T_CARDS + k * .25, .45), L[k])); }
      // chegada à Parada 2
      const bp = P(t, T_BOARD - .5, .6); if (bp > 0) { ctx.save(); ctx.globalAlpha *= bp; ctx.fillStyle = rgba('#120E0B', .75 * bp); ctx.fillRect(0, 0, W, H);
        FLAP.board(ctx, W / 2, H / 2, ['PARADA 2 · BALDEAÇÃO'], [T_BOARD], t, { tw: 56, th: 82, hiFrom: [10], header: TX.stop.label, headerCol: C.orange }); ctx.restore(); }
      scanlines(ctx, .03);
    }
  };
  POSTERS[6] = (ctx, w, h, tl) => {
    text(ctx, 'Pilares da prática', 0, -h / 2 + 50, { size: 26, weight: 900, color: INK, align: 'center' });
    const rowH = Math.min(84, (h - 130) / N);
    PIL.forEach((pl, i) => { const y = -h / 2 + 110 + i * rowH, col = COLS[i % COLS.length], on = Math.floor(tl * .8) % N === i;
      rr(ctx, -w / 2 + 30, y, w - 60, rowH - 12, 10); ctx.fillStyle = on ? col : '#F3EBDD'; ctx.fill(); inkRect(ctx, -w / 2 + 30, y, w - 60, rowH - 12, 10, 2.5, i);
      text(ctx, pl.name, -w / 2 + 52, y + (rowH - 12) / 2, { size: 24, weight: 900, color: on && col !== C.yellow ? '#FFF' : INK });
      pill(ctx, w / 2 - 110, y + (rowH - 12) / 2, `${pl.items.length} entregas`, { size: 15, fill: '#FFFDF8', weight: 900 }); });
  };
})();

/* ---------- Parada 2: retomada do trecho 2 ---------- */
STOPSCN.stop2 = recapScene({ posters: [4, 5, 6], sign: 'PARADA 2 · BALDEAÇÃO', from: CONFIG.sceneById.s06.end,
  doodles: [['bang', 120, 300, 70, C.yellow], ['star', 1800, 280, 80, C.orange], ['heart', 1810, 820, 70, C.red], ['zigzag', 120, 820, 90, C.orange]] });
