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

/* ---------- 06 · Practice ---------- */
(() => {
  const id = 's06', G = grid(id), B = G.bars, bt = k => (B[k] != null ? B[k] : B[B.length - 1] + (k - B.length + 1) * 2.22);
  const T_COL = [bt(0) + .3, bt(1), bt(2), bt(3)], T_PED = bt(4), T_DEL = bt(4) + 1.4, T_LOG = bt(4) + 4.2, T_BOARD = 16.2;
  const CAPS = [[1, T_PED - .2, 'Os *pilares* que sustentam a prática de analytics', 'A PRÁTICA'], [T_PED + .2, T_LOG - .2, 'O que a prática já *entregou*', 'ENTREGAS'],
    [T_LOG, T_BOARD - .3, 'E como a prática *evoluiu*, versão a versão', 'EVOLUÇÕES'], [T_BOARD, 20, 'Segunda parada: conversa sobre as estações *04, 05 e 06*', 'PARADA 2']];
  T_COL.forEach((t0, i) => cue(id, t0, 'pop', { p: .7 + i * .12, v: .2 })); cue(id, T_PED, 'impact', { size: .8 });
  for (let k = 0; k < 5; k++) cue(id, T_DEL + k * .45, 'hit', { size: .25 }); cue(id, T_LOG, 'type', { n: 40, gap: .05 }); cue(id, T_BOARD, 'type', { n: 22, gap: .025 });
  const S = () => SEC(6);

  function column(ctx, x, yb, h, label, p, i) {
    if (p <= 0) return; const w = 120, hh = h * E.outBack(p);
    ctx.save(); ctx.translate(x, yb);
    rr(ctx, -w / 2 - 22, -24, w + 44, 24, 3); ctx.fillStyle = '#E9DFCF'; ctx.fill(); inkRect(ctx, -w / 2 - 22, -24, w + 44, 24, 3, 3, i);
    rr(ctx, -w / 2, -24 - hh, w, hh, 2); ctx.fillStyle = '#F3EBDD'; ctx.fill();
    hatch(ctx, () => rr(ctx, -w / 2, -24 - hh, w, hh, 2), -w / 2, -24 - hh, w * .35, hh, { alpha: .25, gap: 7, angle: 0 });
    for (let k = 1; k < 5; k++) line(ctx, -w / 2 + k * w / 5, -30, -w / 2 + k * w / 5, -18 - hh, rgba(INK, .35), 2);
    inkRect(ctx, -w / 2, -24 - hh, w, hh, 2, 3.5, i + 4);
    rr(ctx, -w / 2 - 18, -48 - hh, w + 36, 28, 4); ctx.fillStyle = '#E9DFCF'; ctx.fill(); inkRect(ctx, -w / 2 - 18, -48 - hh, w + 36, 28, 4, 3, i + 8);
    ctx.save(); ctx.translate(0, -24 - hh / 2); ctx.rotate(-Math.PI / 2); text(ctx, label, 0, 0, { size: 26, weight: 900, color: INK, align: 'center', alpha: clamp(p * 2 - .6) }); ctx.restore();
    ctx.restore();
  }

  SCENES[id] = {
    themeAt: () => 'light', fx: { invert: false, chroma: .5 }, caps: CAPS,
    draw(ctx, t) {
      bgLight(ctx, t); collage(ctx, t, { seed: 97, n: 6, theme: 'light', alpha: .7 });
      const pil = S().pillars || [], cx = 560, yb = 900, gap = 190, colH = 430;
      pil.slice(0, 4).forEach((l, i) => column(ctx, cx - 1.5 * gap + i * gap, yb, colH, l, P(t, T_COL[i], .5), i));
      const pp = P(t, T_PED - .25, .25, E.inQuad); if (pp > 0) { const y = lerp(-300, yb - colH - 60, pp);
        ctx.save(); ctx.translate(cx, y); ctx.beginPath(); ctx.moveTo(-430, 30); ctx.lineTo(0, -110); ctx.lineTo(430, 30); ctx.closePath(); ctx.fillStyle = '#F3EBDD'; ctx.fill(); ink(ctx, () => { ctx.beginPath(); ctx.moveTo(-430, 30); ctx.lineTo(0, -110); ctx.lineTo(430, 30); ctx.closePath(); }, 4, 7);
        rr(ctx, -450, 30, 900, 44, 4); ctx.fillStyle = '#E9DFCF'; ctx.fill(); inkRect(ctx, -450, 30, 900, 44, 4, 4, 9);
        retroText(ctx, 'A PRÁTICA', 0, -16, { size: 52, weight: 900, color: C.orange, align: 'center', depth: 3, lw: 3, ls: 8 }); ctx.restore(); }
      // entregas carimbadas
      (S().deliveries || []).slice(0, 5).forEach((d, i) => { const p = E.outBack(P(t, T_DEL + i * .45, .35)); if (p <= 0) return;
        const x = 1230 + (i % 2) * 330, y = 250 + Math.floor(i / 2) * 150 + (i % 2) * 40;
        ctx.save(); ctx.translate(x, y); ctx.rotate((hash(i * 5) - .5) * .12); ctx.scale(p, p);
        paper(ctx, -150, -55, 300, 110, { torn: true, seed: 160 + i, fill: '#FFFDF8', shadow: 7, lw: 3 }); text(ctx, twoLines(d), 0, -4, { size: 22, weight: 800, color: INK, align: 'center', lh: 1.08 });
        ctx.save(); ctx.translate(90, 30); ctx.rotate(-.25); rr(ctx, -58, -16, 116, 32, 4); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.stroke(); text(ctx, 'ENTREGUE', 0, 1, { size: 15, weight: 900, mono: true, color: C.red, align: 'center', ls: 2 }); ctx.restore();
        ctx.restore(); });
      // changelog estilo git log
      const lp = P(t, T_LOG - .3, .4); if (lp > 0) { const ev = S().evolutions || [], x = 1180, y = 720;
        ctx.save(); ctx.globalAlpha *= lp; holo(ctx, x - 20, y - 50, 660, 60 + ev.length * 42, { title: '$ git log --oneline', color: C.orange });
        ev.slice().reverse().forEach((e, i) => { const n = Math.floor(clamp((t - T_LOG - i * .6) / .6) * 40); if (n <= 0) return;
          const s = `${e.version}  ${e.year}  ${e.text}`.slice(0, n); text(ctx, s, x, y + 6 + i * 42, { size: 22, weight: 700, mono: true, color: i === 0 ? C.yellow : '#FFE9D6' }); });
        ctx.restore(); }
      if (S().placeholder) { ctx.save(); ctx.translate(140, 980); ctx.rotate(-.04); pill(ctx, 0, 0, 'rascunho · aguardando materiais', { size: 16, fill: '#FFF', color: C.red, stroke: C.red, flat: true }); ctx.restore(); }
      // chegada à Parada 2
      const bp = P(t, T_BOARD - .5, .6); if (bp > 0) { ctx.save(); ctx.globalAlpha *= bp; ctx.fillStyle = rgba('#120E0B', .75 * bp); ctx.fillRect(0, 0, W, H);
        FLAP.board(ctx, W / 2, H / 2, ['PARADA 2 · BALDEAÇÃO'], [T_BOARD], t, { tw: 56, th: 82, hiFrom: [10], header: TX.stop.label, headerCol: C.orange }); ctx.restore(); }
      scanlines(ctx, .03);
    }
  };
  POSTERS[6] = (ctx, w, h, tl) => {
    const pil = (SEC(6).pillars || []).slice(0, 4);
    pil.forEach((l, i) => { const x = -w / 2 + 60 + i * (w - 120) / 3, s = 1 + .03 * Math.sin(tl * 2 + i);
      rr(ctx, x - 30, -h / 2 + 90, 60, 230 * s, 2); ctx.fillStyle = '#F3EBDD'; ctx.fill(); inkRect(ctx, x - 30, -h / 2 + 90, 60, 230 * s, 2, 2.5, i);
      ctx.save(); ctx.translate(x, -h / 2 + 205); ctx.rotate(-Math.PI / 2); text(ctx, l, 0, 0, { size: 15, weight: 900, color: INK, align: 'center' }); ctx.restore(); });
    const ev = (SEC(6).evolutions || []).slice(-1)[0]; if (ev) { retroText(ctx, ev.version, 0, 160, { size: 70, weight: 900, color: C.orange, align: 'center', depth: 3, lw: 3 }); text(ctx, ev.text, 0, 214, { size: 20, weight: 800, color: INK, align: 'center' }); }
    if (SEC(6).placeholder) text(ctx, 'rascunho', 0, 262, { size: 16, weight: 800, mono: true, color: C.red, align: 'center' });
  };
})();

/* ---------- Parada 2: retomada do trecho 2 ---------- */
STOPSCN.stop2 = recapScene({ posters: [4, 5, 6], sign: 'PARADA 2 · BALDEAÇÃO', from: CONFIG.sceneById.s06.end,
  doodles: [['bang', 120, 300, 70, C.yellow], ['star', 1800, 280, 80, C.orange], ['heart', 1810, 820, 70, C.red], ['zigzag', 120, 820, 90, C.orange]] });
