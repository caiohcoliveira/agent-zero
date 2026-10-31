/* ============================================================================
   24. TRECHO 3 ("Epic Piano") — estação 07, clímax, letreiro final + encerramento
   ========================================================================== */

/* ---------- desenhos das 3 direções do futuro ---------- */
const FUTURE_ART = {
  // um lugar na mesa de decisão
  chair(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s);
    ctx.beginPath(); ctx.ellipse(0, 40, 260, 80, 0, 0, TAU); ctx.fillStyle = '#5A3A22'; ctx.fill(); ink(ctx, () => { ctx.beginPath(); ctx.ellipse(0, 40, 260, 80, 0, 0, TAU); }, 5, 3);
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + .2, x = Math.cos(a) * 300, y = 40 + Math.sin(a) * 110, me = k === 2, z = Math.sin(a) > 0;
      if (!z && !me) { rr(ctx, x - 30, y - 70, 60, 70, 8); ctx.fillStyle = '#3A2A1E'; ctx.fill(); inkRect(ctx, x - 30, y - 70, 60, 70, 8, 3, k); } }
    const ax = Math.cos(2 / 8 * TAU + .2) * 300, ay = 40 + Math.sin(2 / 8 * TAU + .2) * 110, a = E.outBack(p);
    glow(ctx, ax, ay - 40, 160, C.orange, .6 * a + .2 * BT.level);
    ctx.save(); ctx.translate(ax, ay); ctx.scale(a, a); rr(ctx, -40, -100, 80, 100, 10); ctx.fillStyle = C.orange; ctx.fill(); inkRect(ctx, -40, -100, 80, 100, 10, 4, 9);
    pill(ctx, 0, -130, 'Analytics', { size: 22, fill: C.yellow, weight: 900, rot: -.05 }); ctx.restore();
    ctx.restore();
  },
  // as tracks se aproximam até as lentes se fundirem
  merge(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s); const d = lerp(260, 120, E.inOutCubic(p)), cols = [C.red, C.yellow, '#F3EBDD', C.orange];
    cols.forEach((c, k) => { const a = k / 4 * TAU + t * .15, x = Math.cos(a) * d, y = Math.sin(a) * d * .7; ctx.save(); ctx.globalAlpha *= .85; circle(ctx, x, y, 150, c); ctx.restore(); inkCircle(ctx, x, y, 150, 4, k); });
    glow(ctx, 0, 0, 200, C.orange, .5 * p + .2 * BT.level); retroText(ctx, 'Analytics', 0, 0, { size: 44, weight: 900, color: '#FFF', align: 'center', depth: 3, lw: 3 });
    ctx.restore();
  },
  // um tile vira mosaico; um deles brilha (o diferencial)
  tiles(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s); const n = Math.max(1, Math.round(lerp(1, 25, E.inCubic(p)))), g = 5, sz = 90;
    for (let k = 0; k < n; k++) { const c = k % g, r = Math.floor(k / g), x = (c - 2) * (sz + 12), y = (r - 2) * (sz + 12), hot = k === 12;
      if (hot) { holo(ctx, x - sz / 2, y - sz / 2, sz, sz, { color: C.orange }); glow(ctx, x, y, 120, C.orange, .5 + .3 * BT.level); }
      else { rr(ctx, x - sz / 2, y - sz / 2, sz, sz, 8); ctx.fillStyle = ['#3A2A1E', '#4A3426', '#2E241D'][k % 3]; ctx.fill(); inkRect(ctx, x - sz / 2, y - sz / 2, sz, sz, 8, 2.5, k); } }
    ctx.restore();
  }
};

/* ---------- 07 · The Future of Analytics ---------- */
(() => {
  const id = 's07', G = grid(id), B = G.bars, bt = k => B[Math.min(k, B.length - 1)];
  const T_SIGN = [bt(2), bt(5), bt(8)], T_ROW = bt(10) - .4, T_KEY = bt(10) + .4, ART = ['chair', 'merge', 'tiles'];
  T_SIGN.forEach(t0 => { cue(id, t0, 'chime', { f: 784, up: 5 }); cue(id, t0, 'whoosh', { dur: .5, v: .25 }); }); cue(id, T_KEY, 'swell', { dur: 2 });

  function sign(ctx, x, y, s, k, t, p) {
    const f = TX.future[k], w = 820, h = 640;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate([-.015, .01, -.01][k]);
    paper(ctx, -w / 2, -h / 2, w, h, { r: 22, fill: '#1B1511', shadow: 16, shadowColor: '#000', lw: 5, outline: '#000' });
    rr(ctx, -w / 2 + 20, -h / 2 + 20, w - 40, 120, 14); ctx.fillStyle = [C.red, C.orange, C.yellow][k]; ctx.fill(); inkRect(ctx, -w / 2 + 20, -h / 2 + 20, w - 40, 120, 14, 4, k);
    text(ctx, f.title, 0, -h / 2 + 62, { size: 44, weight: 900, color: k === 2 ? INK : '#FFF', align: 'center' });
    text(ctx, f.sub, 0, -h / 2 + 108, { size: 28, weight: 700, color: k === 2 ? INK : '#FFE9D6', align: 'center' });
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2 + 20, -h / 2 + 150, w - 40, h - 170); ctx.clip(); ctx.translate(0, 90);
    FUTURE_ART[ART[k]](ctx, .95, t, p); ctx.restore();
    ctx.restore();
  }

  SCENES[id] = {
    themeAt: () => 'dark', fx: { invert: false },
    peaks: [[T_KEY - .1, T_KEY + 1.6, .7]],
    caps: [[1, T_SIGN[0] - .2, 'Última estação: *onde queremos estar*', 'O FUTURO'],
      [T_SIGN[0] + .3, T_SIGN[1] - .3, '*Mais perto das decisões* estratégicas dos clientes: um lugar na mesa', 'DIREÇÃO 1'],
      [T_SIGN[1] + .3, T_SIGN[2] - .3, '*Mais integrados* às demais tracks: analytics conectando as soluções', 'DIREÇÃO 2'],
      [T_SIGN[2] + .3, T_ROW, '*Mais escaláveis e diferenciados*: soluções que se replicam e se destacam', 'DIREÇÃO 3']],
    draw(ctx, t) {
      const rise = E.outCubic(P(t, 0, 8)), row = E.inOutCubic(P(t, T_ROW, 1.4));
      bgDark(ctx, t, { centerA: .9, center: '#2B1408' });
      neonGrid(ctx, t, { horizon: lerp(900, 700, rise), sun: lerp(120, 300, rise), alpha: .9, speed: .5 + .6 * BT.level });
      // o trilho segue para o horizonte e o trem corre para o sol
      ctx.save(); ctx.globalAlpha *= 1 - row * .7; const hz = lerp(900, 700, rise);
      [[-1, C.red], [1, C.yellow]].forEach(([sd, c]) => { ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 16; line(ctx, W / 2 + sd * 40, hz, W / 2 + sd * 420, H, c, 8); ctx.restore(); });
      const u = (t * .12) % 1, ty = lerp(H - 40, hz + 10, u), tx = W / 2, ts = lerp(1, .2, u);
      glow(ctx, tx, ty, 90 * ts, C.orange, .7); circle(ctx, tx, ty, 26 * ts, C.orange); ctx.restore();
      // as 3 placas: cada uma no centro por alguns compassos, depois em fila
      T_SIGN.forEach((t0, k) => {
        const p = P(t, t0, .8), ap = E.outBack(P(t, t0, .5)); if (ap <= 0) return;
        const next = k < 2 ? E.inOutCubic(P(t, T_SIGN[k + 1] - .5, .8)) : 0, gone = k < 2 ? next * (1 - row) : 0;
        const cx = lerp(W / 2, -600, gone), cy = 560, rx = 340 + k * 620, ry = 520;
        const x = lerp(cx, rx, row), y = lerp(cy, ry, row), s = lerp(ap, .68, row) * (1 + .01 * BT.beat);
        if (gone < 1 || row > 0) sign(ctx, x, y, s, k, t, clamp(p * 1.4));
      });
      const kp = P(t, T_KEY, .6); if (kp > 0) paintTitle(ctx, TX.futureKey, W / 2, 880, { size: 64, bg: C.red, seed: 51, p: kp });
      scanlines(ctx, .05);
    }
  };
  POSTERS[7] = (ctx, w, h, tl) => {
    TX.future.forEach((f, k) => { const y = -h / 2 + 100 + k * 150;
      ctx.save(); ctx.translate(-w / 2 + 90, y + 10); FUTURE_ART[ART[k]](ctx, .16, tl, 1); ctx.restore();
      text(ctx, f.title, -w / 2 + 170, y - 6, { size: 26, weight: 900, color: INK }); text(ctx, f.sub, -w / 2 + 170, y + 26, { size: 20, weight: 700, color: '#4A4038' }); });
    rich(ctx, 'É esse o *papel*', 0, h / 2 - 90, { size: 34, weight: 900, color: INK }); rich(ctx, 'que queremos ocupar.', 0, h / 2 - 50, { size: 34, weight: 900, color: INK });
  };
})();

/* ---------- clímax: 8 cortes no piano ---------- */
(() => {
  const id = 'climax', G = grid(id), BE = G.beats, cutAt = k => BE[Math.min(k * 2, BE.length - 1)] || k * 1.2;
  const VZ = ['gaussian', 'regression', 'classification', 'clusters', 'embeddings', 'gradient', 'transformer', 'agents'];
  const FXS = ['N(μ, σ²)', 'ŷ = Xβ + ε', 'σ(wᵀx + b)', 'argmin Σ‖x − μₖ‖²', 'cos θ = a·b/‖a‖‖b‖', 'θ ← θ − η∇L(θ)', 'softmax(QKᵀ/√dₖ)V', 'gerar → julgar → corrigir'];
  const N = TX.climaxWords.length, T_KEY = cutAt(N);
  for (let k = 0; k < N; k++) cue(id, cutAt(k), 'hit', { size: .35 + k * .05 }); cue(id, T_KEY, 'impact', { size: 1 }); cue(id, T_KEY, 'combo');

  SCENES[id] = {
    peaks: [[0, 12]],
    caps: [[.3, T_KEY - .2, 'Tudo o que vimos se apoia em *ciência de dados*: da estatística aos agentes de IA', 'NOSSA BASE', { top: true }]],
    themeAt: t => t < T_KEY ? (Math.floor(t / 1.2) % 2 ? 'light' : 'dark') : 'dark',
    draw(ctx, t) {
      let k = -1; for (let i = 0; i < N; i++) if (t >= cutAt(i)) k = i;
      if (t >= T_KEY || k < 0) {
        bgDark(ctx, t, { centerA: .9, center: '#3A1A08' });
        if (k < 0) return;
        const p = P(t, T_KEY, .5); glow(ctx, W / 2, H / 2, 700, C.orange, .35 + .25 * BT.level);
        collage(ctx, t, { seed: 113, n: 8, theme: 'dark', alpha: .6 });
        [[460, 360, 160, C.red], [1460, 420, 190, C.orange], [960, 760, 140, C.yellow]].forEach(([x, y, r, c], i) => splat(ctx, x, y, r, c, 140 + i, E.outBack(P(t, T_KEY + i * .08, .35)), .8));
        ctx.save(); ctx.translate(W / 2, H / 2); const s = lerp(1.7, 1, E.outExpo(p)) * (1 + .03 * BT.beat); ctx.scale(s, s);
        rich(ctx, TX.climaxKey, 0, 0, { size: 112, weight: 900, color: '#FFF', retro: true, depth: 7, lw: 5 }); ctx.restore();
        return;
      }
      const lt = t - cutAt(k), dur = cutAt(k + 1) - cutAt(k), light = k % 2 === 1, p = clamp(lt / dur);
      if (light) bgLight(ctx, t); else bgDark(ctx, t, { centerA: .85, center: '#2E1A0C' });
      if (!light) neonGrid(ctx, t, { horizon: 900, alpha: .45, speed: 1.2 });
      const vx = 380, vy = 170, vw = 1160, vh = 640;
      if (light) paper(ctx, vx - 30, vy - 30, vw + 60, vh + 60, { torn: true, seed: 180 + k, fill: '#FFFDF8', shadow: 12, lw: 4 }); else holo(ctx, vx - 30, vy - 30, vw + 60, vh + 60, { color: C.orange });
      VIZ[VZ[k]](ctx, vx, vy, vw, vh, E.outCubic(clamp(p * 1.3)), { t, theme: light ? 'light' : 'dark' });
      const ws = lerp(1.5, 1, E.outExpo(clamp(lt / .25)));
      ctx.save(); ctx.translate(130, 930); ctx.rotate(-.03); ctx.scale(ws, ws);
      const w = measure(ctx, TX.climaxWords[k], 96, 900) + 80; brush(ctx, -40, -62, w, 124, [C.red, C.orange, C.yellow][k % 3], 190 + k, 1);
      retroText(ctx, TX.climaxWords[k], 0, 0, { size: 96, weight: 900, color: k % 3 === 2 ? INK : '#FFF', depth: k % 3 === 2 ? 0 : 5, lw: k % 3 === 2 ? 0 : 4 }); ctx.restore();
      formula(ctx, FXS[k], 1560, 960, { size: 22, neon: !light, rot: .04, seed: 30 + k });
      text(ctx, `${String(k + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`, W - 80, 90, { size: 30, weight: 900, mono: true, color: light ? INK : '#FFF', align: 'right' });
      if (lt < .07) flash(ctx, 1 - lt / .07, '#FFF8EE');
    }
  };
})();

/* ---------- letreiro final (split-flap) + encerramento ---------- */
const CLOSE = (() => {
  const id = 'close', FL = TX.flap, T_F = [1.2, 5.0, 9.0, 13.2], T_CHORD = 14.08, HI = [11, 11, 11, FL[3].indexOf(' ') + 1];
  T_F.forEach((t0, k) => { cue(id, t0, 'type', { n: 26, gap: .024 }); }); cue(id, T_CHORD, 'combo'); cue(id, T_CHORD, 'shimmer', { dur: 2.5 });
  /** quadro do letreiro; t = tempo desde o início do letreiro (as paradas usam t grande = letreiro pronto) */
  function draw(ctx, t, o = {}) {
    bgDark(ctx, t, { centerA: .9, center: '#3A2416' });
    collage(ctx, t, { seed: 131, n: 6, theme: 'dark', alpha: .7 });
    const gA = t > T_CHORD ? E.outCubic(P(t, T_CHORD, .8)) : 0, br = o.breath == null ? 0 : o.breath;
    glow(ctx, W / 2, 300, 560, C.orange, .2 + .25 * gA + .15 * br + .15 * BT.level);
    const meet = E.inOutCubic(P(t, .2, 1.2));
    intersection(ctx, W / 2, 300, 150, lerp(1400, 190, meet), { hot: Math.exp(-Math.max(0, t - T_CHORD) * 1.6) * (t > T_CHORD) * .8 + .15 * br });
    [[380, 300, 140, C.red], [1540, 330, 160, C.yellow]].forEach(([x, y, r, c], i) => splat(ctx, x, y, r, c, 300 + i, E.outBack(P(t, T_CHORD + i * .06, .35)), .8));
    const b = FLAP.board(ctx, W / 2, 680, FL, T_F, o.flicker ? t : Math.min(t, 40), { tw: 70, th: 104, hiFrom: HI, header: 'PRÓXIMA PARADA', headerCol: C.red, glowA: gA });
    if (gA > 0) { ctx.save(); ctx.globalAlpha *= gA; rr(ctx, b.x, b.y - 40, b.w, b.h + 40, 18); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.shadowColor = C.orange; ctx.shadowBlur = 24 + 16 * br; ctx.stroke(); ctx.restore(); }
    text(ctx, ((DATA.presentation_context || {}).organization || 'Mastercard Advisors').toUpperCase() + '  ·  PERFORMANCE ANALYTICS', W / 2, 860, { size: 22, weight: 800, mono: true, color: '#E9DDCC', align: 'center', ls: 5, alpha: gA });
    scanlines(ctx, .06);
  }
  SCENES[id] = { themeAt: () => 'dark', fx: { chroma: .7 }, draw(ctx, t) { draw(ctx, t); },
    peaks: [[T_CHORD - .1, T_CHORD + 1.8]],
    caps: [[T_F[0] + .3, T_F[1] - .1, 'Bem-vindos ao *futuro*', 'PRÓXIMA PARADA'], [T_F[1] + .3, T_F[2] - .1, 'Bem-vindos à *IA*', 'PRÓXIMA PARADA'],
      [T_F[2] + .3, T_F[3] - .1, 'Bem-vindos a *analytics*', 'PRÓXIMA PARADA'], [T_CHORD + .4, 26.4, 'Obrigado! Agora a conversa é com *vocês*', 'FIM DA LINHA']] };
  return { draw, T_CHORD };
})();

STOPSCN.end = {
  draw(ctx, tl, item, prevItem, p) {
    BT = { ...BT, level: .25 + .2 * BT.breath };
    CLOSE.draw(ctx, 40 + tl, { breath: BT.breath });
    const show = item === 1 ? E.inOutCubic(p) : prevItem === 1 ? 1 - E.inOutCubic(p) : 0;
    if (show > 0) { ctx.save(); ctx.fillStyle = rgba('#0B0807', .7 * show); ctx.fillRect(0, 0, W, H);
      poster(ctx, W / 2, H / 2 + (1 - show) * 700, 760, 900, 7, tl, { rot: -.01 }); ctx.restore(); }
    hint(ctx, tl, item === 0 ? '→' : '←');
  }
};
