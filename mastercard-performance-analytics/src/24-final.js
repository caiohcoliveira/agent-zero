/* ============================================================================
   24. TRECHO 3 ("Epic Piano") — estação 07, clímax, letreiro final + encerramento
   ========================================================================== */

/* ---------- desenhos das 3 direções do futuro ---------- */
const FUTURE_ART = {
  // um lugar na mesa do board: sala com tela de resultados, mesa em perspectiva, conselheiros e o lugar de Analytics
  chair(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s);
    ctx.fillStyle = '#3A2618'; ctx.fillRect(-440, -300, 880, 230); for (let k = -4; k <= 4; k++) line(ctx, k * 100, -300, k * 100, -70, 'rgba(0,0,0,.35)', 4);
    ctx.fillStyle = '#24170F'; ctx.fillRect(-440, -70, 880, 320); line(ctx, -440, -70, 440, -70, INK, 5);
    rr(ctx, -300, -150, 120, 60, 6); ctx.fillStyle = '#C9A060'; ctx.fill(); inkRect(ctx, -300, -150, 120, 60, 6, 3, 2); text(ctx, 'SALA DO\nBOARD', -240, -119, { size: 18, weight: 900, mono: true, color: INK, align: 'center', ls: 2, lh: 1.1 });
    rr(ctx, -170, -244, 340, 150, 8); ctx.fillStyle = '#0E1420'; ctx.fill(); inkRect(ctx, -170, -244, 340, 150, 8, 4, 3); glow(ctx, 0, -170, 200, '#7FB0FF', .15);
    for (let k = 0; k < 6; k++) { const bh = (24 + k * 16) * E.outCubic(clamp(p * 1.5 - k * .08)); rr(ctx, -140 + k * 48, -110 - bh, 30, bh, 3); ctx.fillStyle = k === 5 ? C.yellow : C.orange; ctx.fill(); }
    line(ctx, -150, -115, 150, -115, '#BFD8FF', 2);
    const bust = (x, y, sc, suit, hair, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
      if (o.glow) { glow(ctx, 0, -10, 130, C.orange, .55); }
      ctx.beginPath(); ctx.moveTo(-34, 50); ctx.quadraticCurveTo(-36, -2, 0, -6); ctx.quadraticCurveTo(36, -2, 34, 50); ctx.closePath(); ctx.fillStyle = suit; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(0, 16); ctx.lineTo(8, -4); ctx.fillStyle = '#F3EBDD'; ctx.fill();
      vball(ctx, 0, -30, 24, '#F2C29B', { lw: 3.5, rim: false }); ctx.beginPath(); ctx.arc(0, -34, 25, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(18, -30); ctx.quadraticCurveTo(0, -46, -20, -28); ctx.closePath(); ctx.fillStyle = hair; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      circle(ctx, 8, -30, 3, INK); circle(ctx, -6, -30, 3, INK); ctx.restore(); };
    // conselheiros nas laterais e na cabeceira
    bust(0, -64, .8, '#2C3352', '#4A3426');
    [[-205, -16, .9, '#3A3A48', '#2A1E18'], [-262, 56, 1, '#2C3352', '#C9A060'], [-318, 128, 1.1, '#4A2E2E', '#1A1412'], [205, -16, .9, '#38404A', '#8A5A3A'], [262, 56, 1, '#2C3352', '#3A2A20']].forEach(b => bust(...b));
    // Analytics ganha a cadeira
    const a = E.outBack(clamp(p * 1.6 - .2)); if (a > 0) { ctx.save(); ctx.translate(318, 128); ctx.scale(a, a); bust(0, 0, 1.1, C.orange, C.yellow, { glow: true }); pill(ctx, 0, -100, 'Analytics', { size: 26, fill: C.yellow, weight: 900, rot: -.05 }); ctx.restore(); }
    // mesa em perspectiva
    ctx.beginPath(); ctx.moveTo(-150, -34); ctx.lineTo(150, -34); ctx.lineTo(300, 160); ctx.lineTo(-300, 160); ctx.closePath();
    const g = ctx.createLinearGradient(0, -34, 0, 160); g.addColorStop(0, '#9A6440'); g.addColorStop(1, '#5A3420'); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = '#3A2214'; ctx.beginPath(); ctx.moveTo(-300, 160); ctx.lineTo(300, 160); ctx.lineTo(300, 184); ctx.lineTo(-300, 184); ctx.closePath(); ctx.fill(); ctx.stroke();
    [[-150, 20], [-90, 90], [120, 10], [70, 100]].forEach(([x, y], k) => { ctx.save(); ctx.translate(x, y); ctx.rotate((k - 1.5) * .2); paper(ctx, -24, -16, 48, 32, { r: 2, fill: '#FFFDF8', shadow: 2, lw: 2, volume: false }); ctx.restore(); });
    ctx.restore();
  },
  // eficiência operacional: robozinhos automatizando as tarefas na esteira
  robots(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s);
    for (let k = 0; k < 3; k++) { ctx.save(); ctx.translate(-300 + k * 300, -170); ctx.rotate(t * (k % 2 ? -.8 : .8)); icon(ctx, 'gear', 0, 0, 90, 'rgba(255,233,214,.18)', 10); ctx.restore(); }
    pill(ctx, -300, -240, 'manual', { size: 22, fill: C.red, color: '#FFF', weight: 900 }); pill(ctx, 300, -240, 'automático', { size: 22, fill: C.yellow, weight: 900 });
    rr(ctx, -420, 100, 840, 34, 17); ctx.fillStyle = '#3A3028'; ctx.fill(); inkRect(ctx, -420, 100, 840, 34, 17, 4, 3);
    for (let k = 0; k < 15; k++) { const x = -420 + ((k * 60 + t * 90) % 840); circle(ctx, x, 117, 9, '#6A5E52', INK, 2); }
    for (let k = 0; k < 8; k++) { const x = ((t * 90 + k * 110) % 880) - 440, done = x > 60;
      ctx.save(); ctx.translate(x, 70); paper(ctx, -22, -28, 44, 56, { r: 4, fill: done ? '#F6EEDF' : '#FFD9CF', shadow: 3, lw: 2.5, volume: false });
      if (done) icon(ctx, 'check', 0, 0, 30, '#D9890B', 8); else { line(ctx, -12, -10, 12, -10, '#8A8378', 3); line(ctx, -12, 0, 8, 0, '#8A8378', 3); line(ctx, -12, 10, 12, 10, '#8A8378', 3); } ctx.restore(); }
    const n = Math.ceil(clamp(p * 1.3) * 3);
    for (let k = 0; k < n; k++) { const x = -170 + k * 170, bob = Math.sin(t * 6 + k * 2) * 6, arm = Math.max(0, Math.sin(t * 6 + k * 2));
      ctx.save(); ctx.translate(x, bob);
      vlimb(ctx, -34, -30, -46, 20 + arm * 30, 14, '#9AA3AE'); vlimb(ctx, 34, -30, 46, 20 + arm * 30, 14, '#9AA3AE');
      vslab(ctx, -36, -52, 72, 70, 16, '#B8C2CC', { lw: 3.5 }); circle(ctx, 0, -18, 10, C.orange, INK, 2.5);
      line(ctx, 0, -110, 0, -134, INK, 4); circle(ctx, 0, -138, 8, C.red, INK, 2); glow(ctx, 0, -138, 26, C.red, .5 + .5 * Math.sin(t * 8 + k));
      vball(ctx, 0, -82, 32, '#D2D9E0', { lw: 4 }); rr(ctx, -24, -92, 48, 20, 10); ctx.fillStyle = INK; ctx.fill();
      const bl = Math.floor(t * 3 + k) % 7 === 0; circle(ctx, -10, -82, bl ? 1.5 : 5, C.yellow); circle(ctx, 10, -82, bl ? 1.5 : 5, C.yellow);
      ctx.restore(); }
    ctx.restore();
  },
  // projetos user-pay: os clientes usam o ativo de Advanced Analytics e pagam pelo uso
  userpay(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s);
    const cl = [[-320, -160, 'bank', C.red], [0, -210, 'store', C.yellow], [320, -160, 'bank', '#F3EBDD'], [-330, 120, 'store', C.orange], [330, 120, 'card', C.red], [0, 175, 'store', '#F3EBDD']];
    const n = Math.ceil(clamp(p * 1.4) * cl.length);
    cl.slice(0, n).forEach(([x, y], k) => { ctx.save(); ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 30; line(ctx, x, y, 0, -10, 'rgba(255,233,214,.35)', 3); ctx.restore();
      const u = (t * .6 + k * .17) % 1; vball(ctx, lerp(x, 0, u), lerp(y, -10, u), 13, C.yellow, { lw: 2.5, rim: false }); });
    glow(ctx, 0, -10, 220, C.orange, .45);
    vslab(ctx, -120, -90, 240, 150, 40, C.orange, { lw: 4.5 }); icon(ctx, 'chart', 0, -16, 90, '#FFF', 9);
    pill(ctx, 20, 100, 'Advanced Analytics', { size: 24, fill: '#F6EEDF', weight: 900 });
    cl.slice(0, n).forEach(([x, y, ic, c], k) => { const a = E.outBack(clamp(p * 1.4 * cl.length - k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); vball(ctx, 0, 0, 40, c, { lw: 4 }); icon(ctx, ic, 0, 0, 44, c === C.red ? '#FFF' : INK, 7); ctx.restore(); });
    pill(ctx, 250, 30, 'pagamento por uso', { size: 22, fill: C.yellow, weight: 900, rot: -.03 });
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
  const T_SIGN = [bt(1), bt(3), bt(5), bt(7), bt(9)], T_ROW = bt(10) - .4, T_KEY = bt(10) + .4, ART = ['chair', 'merge', 'tiles', 'robots', 'userpay'], NS = T_SIGN.length;
  T_SIGN.forEach(t0 => { cue(id, t0, 'chime', { f: 784, up: 5 }); cue(id, t0, 'whoosh', { dur: .5, v: .25 }); }); cue(id, T_KEY, 'swell', { dur: 2 });

  function sign(ctx, x, y, s, k, t, p) {
    const f = TX.future[k], w = 820, h = 640, light = k === 2;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate([-.015, .01, -.01, .012, -.01][k]);
    paper(ctx, -w / 2, -h / 2, w, h, { r: 22, fill: '#1B1511', shadow: 16, shadowColor: '#000', lw: 5, outline: '#000' });
    rr(ctx, -w / 2 + 20, -h / 2 + 20, w - 40, 120, 14); ctx.fillStyle = [C.red, C.orange, C.yellow, C.orange, C.red][k]; ctx.fill(); inkRect(ctx, -w / 2 + 20, -h / 2 + 20, w - 40, 120, 14, 4, k);
    text(ctx, f.title, 0, -h / 2 + 62, { size: 44, weight: 900, color: light ? INK : '#FFF', align: 'center' });
    text(ctx, f.sub, 0, -h / 2 + 108, { size: 28, weight: 700, color: light ? INK : '#FFE9D6', align: 'center' });
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
      [T_SIGN[2] + .3, T_SIGN[3] - .3, '*Mais escaláveis e diferenciados*: soluções que se replicam e se destacam', 'DIREÇÃO 3'],
      [T_SIGN[3] + .3, T_SIGN[4] - .3, '*Eficiência operacional*: automação de projetos — robôs cuidando das tarefas repetitivas', 'DIREÇÃO 4'],
      [T_SIGN[4] + .3, T_ROW, '*Projetos User-Pay* com Advanced Analytics: os clientes pagam pelo uso dos nossos ativos', 'DIREÇÃO 5']],
    draw(ctx, t) {
      const rise = E.outCubic(P(t, 0, 8)), row = E.inOutCubic(P(t, T_ROW, 1.4));
      bgDark(ctx, t, { centerA: .9, center: '#2B1408' });
      neonGrid(ctx, t, { horizon: lerp(900, 700, rise), sun: lerp(120, 300, rise), alpha: .9, speed: .5 + .6 * BT.level });
      // o trilho segue para o horizonte e o trem corre para o sol
      ctx.save(); ctx.globalAlpha *= 1 - row * .7; const hz = lerp(900, 700, rise);
      [[-1, C.red], [1, C.yellow]].forEach(([sd, c]) => { ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 16; line(ctx, W / 2 + sd * 40, hz, W / 2 + sd * 420, H, c, 8); ctx.restore(); });
      const u = (t * .12) % 1, ty = lerp(H - 40, hz + 10, u), tx = W / 2, ts = lerp(1, .2, u);
      glow(ctx, tx, ty, 90 * ts, C.orange, .7); circle(ctx, tx, ty, 26 * ts, C.orange); ctx.restore();
      // as 5 placas: cada uma no centro por alguns compassos, depois em fila
      T_SIGN.forEach((t0, k) => {
        const p = P(t, t0, .8), ap = E.outBack(P(t, t0, .5)); if (ap <= 0) return;
        const next = k < NS - 1 ? E.inOutCubic(P(t, T_SIGN[k + 1] - .5, .8)) : 0, gone = k < NS - 1 ? next * (1 - row) : 0;
        const cx = lerp(W / 2, -600, gone), cy = 560, rx = 200 + k * 380, ry = 500;
        const x = lerp(cx, rx, row), y = lerp(cy, ry, row), s = lerp(ap, .44, row) * (1 + .01 * BT.beat);
        if (gone < 1 || row > 0) sign(ctx, x, y, s, k, t, clamp(p * 1.4));
      });
      const kp = P(t, T_KEY, .6); if (kp > 0) paintTitle(ctx, TX.futureKey, W / 2, 880, { size: 64, bg: C.red, seed: 51, p: kp });
      scanlines(ctx, .05);
    }
  };
  POSTERS[7] = (ctx, w, h, tl) => {
    TX.future.forEach((f, k) => { const y = -h / 2 + 76 + k * 92;
      ctx.save(); ctx.translate(-w / 2 + 80, y + 4); ctx.beginPath(); ctx.rect(-62, -42, 124, 84); ctx.clip(); ctx.fillStyle = '#1B1511'; ctx.fillRect(-62, -42, 124, 84); FUTURE_ART[ART[k]](ctx, .15, tl, 1); ctx.restore();
      text(ctx, f.title, -w / 2 + 160, y - 8, { size: 24, weight: 900, color: INK }); text(ctx, f.sub, -w / 2 + 160, y + 20, { size: 18, weight: 700, color: '#4A4038' }); });
    rich(ctx, 'É esse o *papel*', 0, h / 2 - 90, { size: 34, weight: 900, color: INK }); rich(ctx, 'que queremos ocupar.', 0, h / 2 - 50, { size: 34, weight: 900, color: INK });
  };
})();

/* ---------- clímax: 8 cortes no piano ---------- */
(() => {
  const id = 'climax', G = grid(id), BE = G.beats, cutAt = k => BE[Math.min(k * 2, BE.length - 1)] || k * 1.2;
  const VZ = ['gaussian', 'lp', 'classification', 'clusters', 'nlp', 'mlp', 'transformer', 'agents'];
  const FXS = ['N(μ, σ²) · p < 0,05', 'max cᵀx  s.a.  Ax ≤ b', 'σ(wᵀx + b)', 'argmin Σ‖x − μₖ‖²', 'texto → tokens → vetores', 'h = σ(Wx + b)', 'softmax(QKᵀ/√dₖ)V', 'perceber → raciocinar → agir'];
  const N = TX.climaxWords.length, T_KEY = cutAt(N);
  for (let k = 0; k < N; k++) cue(id, cutAt(k), 'hit', { size: .35 + k * .05 }); cue(id, T_KEY, 'impact', { size: 1 }); cue(id, T_KEY, 'combo');

  SCENES[id] = {
    peaks: [[0, 12]],
    caps: [[.3, T_KEY - .2, 'Por trás de tudo, *disciplinas*: da estatística à inteligência artificial', 'NOSSA BASE', { top: true }]],
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
        const [k1, k2] = TX.climaxKey.split(/\s(?=\*)/); text(ctx, k1, 0, -80, { size: 64, weight: 900, color: '#FFE9D6', align: 'center' });
        rich(ctx, k2 || '', 0, 30, { size: 96, weight: 900, color: '#FFF', retro: true, depth: 7, lw: 5 }); ctx.restore();
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
      const fs = Math.min(96, 1300 / Math.max(1, measure(ctx, TX.climaxWords[k], 96, 900)) * 96), w = measure(ctx, TX.climaxWords[k], fs, 900) + 80; brush(ctx, -40, -fs * .65, w, fs * 1.3, [C.red, C.orange, C.yellow][k % 3], 190 + k, 1);
      retroText(ctx, TX.climaxWords[k], 0, 0, { size: fs, weight: 900, color: k % 3 === 2 ? INK : '#FFF', depth: k % 3 === 2 ? 0 : 5, lw: k % 3 === 2 ? 0 : 4 });
      text(ctx, TX.climaxSub[k], 0, fs * .72 + 14, { size: 30, weight: 800, color: light ? INK : '#FFE9D6' }); ctx.restore();
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
    if (o.bg !== false) { bgDark(ctx, t, { centerA: .9, center: '#3A2416' }); collage(ctx, t, { seed: 131, n: 6, theme: 'dark', alpha: .7 }); }
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
  draw(ctx, tl, item, prevItem, p, ui) {
    ui = ui || { hover: null, pop: null, prevPop: null, popP: 1 };
    BT = { ...BT, level: .25 + .2 * BT.breath };
    platform(ctx, tl, { led: true, people: true }); ctx.save(); ctx.fillStyle = 'rgba(12,9,7,.55)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    CLOSE.draw(ctx, 40 + tl, { breath: BT.breath, bg: false });
    const show = item === 1 ? E.inOutCubic(p) : prevItem === 1 ? 1 - E.inOutCubic(p) : 0, L = slideRects(7), ph = L.top - 90, pw = ph * .78;
    if (show > 0) { ctx.save(); ctx.fillStyle = rgba('#0B0807', .7 * show); ctx.fillRect(0, 0, W, H);
      poster(ctx, W / 2, 40 + ph / 2 + (1 - show) * 700, pw, ph, 7, tl, { rot: -.01 }); ctx.restore(); slideStrip(ctx, 7, show, ui); SLIDE.pump(); }
    if (item === 1) slidePopup(ctx, 7, ui);
    if (!item) text(ctx, 'clique no letreiro para rever a estação 07', W / 2, H - 46, { size: 22, weight: 700, mono: true, color: '#FFF', align: 'center', ls: 2, alpha: .4 + .2 * Math.sin(tl * 2.4) });
    hint(ctx, tl, item === 0 ? '→' : '←');
  },
  hit(x, y, ui) {
    if (!__state.item) return { poster: 0 };
    if (ui.pop != null) return popupHit(7, x, y, ui);
    for (const r of slideRects(7).rects) if (x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h + 30) return { thumb: r.i };
    return { back: true };
  },
  click(tg, ui, ctl) {
    if (tg && tg.pop) return popupAct(7, tg, ui, ctl);
    if (tg && tg.poster != null) { ctl.setItem(1); return true; }
    if (tg && tg.thumb != null) { ctl.popup(tg.thumb); return true; }
    if (tg && tg.back) { ctl.setItem(0); return true; }
    return true;
  },
  key(k, ui, ctl) { if (__state.item && popupKey(7, k, ui, ctl)) return true; if (k === 'Escape' && __state.item) { ctl.setItem(0); return true; } return false; }
};
