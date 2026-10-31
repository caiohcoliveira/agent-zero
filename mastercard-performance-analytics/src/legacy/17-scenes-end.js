/* ---------------------------------------------------------------------------
   CENA 9 — CLÍMAX (3:22–3:42)
   12 cortes no beat (1 técnica + 1 fórmula colada por corte) → eixo
   simples ●──● complexo com slider → anel → "Nossa especialidade é analytics."
   --------------------------------------------------------------------------- */
(() => {
  const id = 'climax', WORDS = TX.climaxWords, N = WORDS.length, CUT = .85;
  const VZ = ['gaussian', 'regression', 'classification', 'tree', 'ensemble', 'clusters', 'anomaly', 'gradient', 'embeddings', 'transformer', 'agents', 'pipeline'];
  const FX = ['σ² = E[(X − μ)²]', 'β̂ = (XᵀX)⁻¹ Xᵀy', 'σ(z) = 1 / (1 + e⁻ᶻ)', 'Gini = 1 − Σ pₖ²', 'F(x) = Σₘ γₘ hₘ(x)', 'min Σ ‖x − μₖ‖²',
    'z = (x − μ) / σ', 'θ ← θ − η ∇L(θ)', 'cos θ = a·b / ‖a‖‖b‖', 'softmax(QKᵀ/√dₖ)·V', 'plan → act → validate', 'cron · DAG · SLA ✓'];
  const T_AXIS = N * CUT + .2, T_SLIDE = 11.4, T_RING = 15.2, T_KEY = 15.5, T_SUB = 17.4, T_CONV = 17.8, T_FLASH = 19.4;
  WORDS.forEach((_, k) => { cue(id, k * CUT, 'hit', { size: .35 + (k === N - 1 ? .3 : 0) }); cue(id, k * CUT - .12, 'whoosh', { dur: .14, v: .25 }); });
  cue(id, T_AXIS, 'whoosh', { dur: .8, v: .4 }); cue(id, T_SLIDE, 'riser', { dur: 3.6, v: .3 });
  WORDS.forEach((_, k) => cue(id, T_SLIDE + .2 + k * .3, 'tick', { f: 1400 + k * 110, v: .16 }));
  cue(id, T_RING, 'whoosh', { dur: .8, v: .35 }); cue(id, T_KEY, 'impact', { size: .9 }); cue(id, T_CONV + .6, 'swell', { dur: .9 });
  cue(id, T_FLASH, 'impact', { size: 1.3 }); cue(id, T_FLASH, 'shimmer', { dur: 1.2 });
  const ax = k => 150 + k * (1620 / (N - 1)), CX9 = W / 2, CY9 = H / 2;

  SCENES[id] = {
    themeAt: t => (t < T_AXIS && Math.floor(t / CUT) % 2 === 0 ? 'light' : 'dark'),
    draw(ctx, t) {
      // ---------- montagem no beat ----------
      if (t < T_AXIS) {
        const k = Math.min(N - 1, Math.floor(t / CUT)), tau = t - k * CUT, light = k % 2 === 0, theme = light ? 'light' : 'dark';
        if (light) bgLight(ctx, t); else bgDark(ctx, t, { centerA: .8, center: '#2E1E12' });
        if (!light) neonGrid(ctx, t, { horizon: 860, alpha: .35, speed: .9 });
        collage(ctx, t, { seed: 100 + k, n: 4, theme, alpha: .9 });
        const dir = k % 2 ? 1 : -1, enter = E.outExpo(clamp(tau / .18)), z = lerp(1.08, 1, E.outCubic(clamp(tau / .45)));
        camera(ctx, { x: W / 2 + dir * (1 - enter) * 280, y: H / 2, z }, () => {
          VIZ[VZ[k]](ctx, 620, 170, 1160, 600, P(tau, 0, .72), { t, theme });
          const wp = P(tau, 0, .2, E.outExpo);
          ctx.save(); ctx.translate(110, 890); ctx.scale(lerp(1.3, 1, wp), lerp(1.3, 1, wp)); ctx.globalAlpha = clamp(wp * 3);
          retroText(ctx, WORDS[k], 0, 0, { size: 130, weight: 900, color: light ? INK : '#FFF', shadow: light ? C.orange : C.orange, depth: 7, lw: light ? 0 : 4, ls: -4 }); ctx.restore();
        });
        formula(ctx, FX[k], W - 380, 150, { size: 26, rot: dir * .035, seed: 30 + k, neon: !light, scale: E.outBack(P(tau, .08, .3)) });
        text(ctx, String(k + 1).padStart(2, '0') + ' / ' + N, 90, 90, { size: 26, weight: 800, mono: true, color: light ? C.stone : C.sand });
        if (!light) scanlines(ctx, .08);
        if (tau < .07) flash(ctx, .35 * (1 - tau / .07), light ? '#FFFFFF' : C.orange);
        return;
      }
      // ---------- eixo de complexidade + anel ----------
      bgDark(ctx, t, { centerA: .85, center: '#2E1E12' });
      neonGrid(ctx, t, { horizon: 900, alpha: .45, speed: .6 });
      kinetic(ctx, TX.climaxLine, W / 2, 300, t - T_AXIS - .3, { size: 64, color: '#FFF', out: T_RING - T_AXIS - .3, retro: true, shadow: C.orange, depth: 4, lw: 0 });
      const axA = P(t, T_AXIS, .5) * (1 - P(t, T_RING, .4)), slideX = lerp(100, 1820, P(t, T_SLIDE, 3.6, E.inOutCubic));
      if (axA > 0) { ctx.save(); ctx.globalAlpha = axA; line(ctx, 150, 660, 1770, 660, 'rgba(245,241,234,.25)', 3); circle(ctx, 150, 660, 9, C.cream); circle(ctx, 1770, 660, 9, C.orange);
        text(ctx, 'simples', 150, 708, { size: 30, weight: 800, color: C.sand, align: 'center' }); text(ctx, 'complexo', 1770, 708, { size: 30, weight: 800, color: C.orange, align: 'center' });
        if (t > T_SLIDE && t < T_SLIDE + 3.8) { glow(ctx, slideX, 560, 220, C.orange, .55); line(ctx, slideX, 470, slideX, 680, 'rgba(255,230,200,.9)', 4); }
        line(ctx, 150, 660, Math.min(slideX, 1770), 660, C.orange, 5); ctx.restore(); }
      const ring = P(t, T_RING, 1.2, E.inOutCubic), conv = P(t, T_CONV, .8, E.inExpo);
      WORDS.forEach((w, k) => {
        const fin = P(t, T_AXIS + k * .05, .6, E.outBack), lit = slideX > ax(k), tw = 128, th = 92;
        const a = (t - T_RING) * .5 + k * TAU / N - Math.PI / 2, rx = CX9 + Math.cos(a) * 780, ry = CY9 + Math.sin(a) * 390;
        let x = lerp(W / 2, ax(k), fin), y = lerp(H / 2, 560, fin);
        x = lerp(x, rx, ring); y = lerp(y, ry, ring); x = lerp(x, W / 2, conv); y = lerp(y, H / 2, conv);
        const s = (1 - conv) * Math.max(0, fin); if (s <= .01) return;
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = lit || ring > 0 ? 1 : .4;
        paper(ctx, -tw / 2, -th / 2, tw, th, { r: 12, fill: '#1C1A18', outline: lit || ring > 0 ? C.orange : 'rgba(245,241,234,.25)', shadow: 5, shadowColor: '#000', lw: 3 });
        ctx.save(); rr(ctx, -tw / 2, -th / 2, tw, th, 12); ctx.clip(); VIZ[VZ[k]](ctx, -tw / 2 + 10, -th / 2 + 8, tw - 20, th - 34, 1, { t, theme: 'dark' }); ctx.restore();
        text(ctx, w, 0, th / 2 - 14, { size: 14, weight: 800, color: C.cream, align: 'center' }); ctx.restore();
      });
      if (t > T_KEY) { const s = lerp(1.25, 1, P(t, T_KEY, .4, E.outExpo)); ctx.save(); ctx.translate(W / 2, H / 2 - 10); ctx.scale(s, s); ctx.globalAlpha = P(t, T_KEY, .15);
        glow(ctx, 0, 0, 700, C.orange, .18 + .25 * conv); const [l1, l2] = TX.climaxKey.split(/ (?=\*)/);
        rich(ctx, l1, 0, -70, { size: 92, color: '#FFF' }); retroText(ctx, l2.replace(/\*/g, ''), 0, 62, { size: 150, weight: 900, color: C.orange, align: 'center', shadow: INK, depth: 9, lw: 6 }); ctx.restore();
        kinetic(ctx, TX.climaxSub, W / 2, H / 2 + 185, t - T_SUB, { size: 36, weight: 600, color: C.sand, ls: 2 }); }
      scanlines(ctx, .08);
      flash(ctx, P(t, T_FLASH, .15) * (1 - P(t, T_FLASH + .25, .35)), '#FFF4E8');
    }
  };
})();

/* ---------------------------------------------------------------------------
   CENA 10 — FECHAMENTO · SPLIT-FLAP (3:42–4:00)
   A interseção volta → letreiro retrô de placas ("Próxima parada") vira letra
   por letra: WELCOME TO THE FUTURE → AI → ANALYTICS → PERFORMANCE ANALYTICS
   → o ponto laranja da abertura
   --------------------------------------------------------------------------- */
(() => {
  const id = 'close', FL = TX.flap, LEN = Math.max(...FL.map(s => s.length));
  const T_MEET = 2.0, T_ORB = 2.4, T_UP = 5.8, T_F = [6.6, 8.8, 11.0, 13.0], T_END = 16.8, STEP = .055;
  const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const PH = FL.map(s => s.padEnd(LEN, ' '));
  const HI = [11, 11, 11, FL[3].indexOf(' ') + 1]; // a partir de qual placa a frase é destacada
  cue(id, .6, 'whoosh', { dur: 1.3, v: .35 }); cue(id, T_MEET, 'impact', { size: .7 }); cue(id, T_MEET, 'chime', { f: 1046, up: 7 });
  for (let k = 0; k < 9; k++) cue(id, T_ORB + k * .12, 'pop', { p: .9 + k * .08, v: .12 });
  cue(id, T_UP, 'whoosh', { dur: .8, v: .4 });
  T_F.forEach((t0, k) => { cue(id, t0, 'type', { n: 28, gap: .022 }); cue(id, t0 + 1.05, 'hit', { size: k === 3 ? 1.2 : .5 }); });
  cue(id, T_F[3] + 1.1, 'combo'); cue(id, T_F[3] + 1.1, 'shimmer', { dur: 1.6 }); cue(id, T_END + .3, 'heart'); cue(id, T_END + 1.0, 'heart');
  const ORB = [['dashboard'], ['grid'], ['nodes'], ['pipe'], ['gauge'], ['tree'], ['agent', 'analista'], ['agent', 'business'], ['agent', 'clevel']];

  /** estado de cada placa: caractere atual, próximo e progresso do flip */
  function flapState(i, t) {
    let k = -1; T_F.forEach((t0, j) => { if (t >= t0) k = j; });
    const target = k < 0 ? ' ' : PH[k][i], prev = k <= 0 ? ' ' : PH[k - 1][i];
    if (k < 0) return { cur: ' ', nxt: ' ', q: 0, k };
    const start = T_F[k] + i * .03, dur = prev === target ? 0 : .25 + hash(i * 7 + k) * .4;
    if (t < start) return { cur: prev, nxt: prev, q: 0, k: k - 1 };
    if (t >= start + dur) return { cur: target, nxt: target, q: 0, k };
    const f = (t - start) / STEP, n = Math.floor(f), last = Math.floor(dur / STEP);
    const rc = m => (m <= 0 ? prev : m >= last ? target : CH[Math.floor(hash(i * 31 + k * 7 + m) * CH.length)]);
    return { cur: rc(n), nxt: rc(n + 1), q: f - n, k };
  }
  function tile(ctx, x, y, w, h, st, hi, glowA) {
    const mid = y + h / 2, col = hi ? C.orange : '#F6EDDD', font_ = font(h * .66, 900);
    paper(ctx, x, y, w, h, { r: 8, fill: '#1F1A15', outline: '#000', shadow: 5, shadowColor: '#000', lw: 2 });
    if (glowA > 0 && hi) glow(ctx, x + w / 2, mid, w * 1.2, C.orange, .35 * glowA);
    const ch = (c, clipTop) => { ctx.save(); ctx.beginPath(); ctx.rect(x, clipTop ? y : mid, w, h / 2); ctx.clip(); ctx.font = font_; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(c, x + w / 2, mid + h * .03); ctx.restore(); };
    // metade de cima mostra o próximo, a de baixo o atual; a aba cai por cima
    ch(st.nxt, true); ch(st.cur, false);
    if (st.q > 0 && st.cur !== st.nxt) {
      ctx.save(); ctx.translate(0, mid);
      if (st.q < .5) { ctx.scale(1, 1 - st.q * 2); ctx.translate(0, -mid); ctx.fillStyle = '#26201A'; ctx.fillRect(x + 2, y + 2, w - 4, h / 2 - 2); ch(st.cur, true); }
      else { ctx.scale(1, (st.q - .5) * 2); ctx.translate(0, -mid); ctx.fillStyle = '#26201A'; ctx.fillRect(x + 2, mid, w - 4, h / 2 - 2); ch(st.nxt, false); }
      ctx.restore(); }
    line(ctx, x + 2, mid, x + w - 2, mid, 'rgba(0,0,0,.85)', 3);
    [[x + 5, mid], [x + w - 5, mid]].forEach(([px, py]) => circle(ctx, px, py, 2.2, '#5A4A3A'));
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#3A2416' });
      collage(ctx, t, { seed: 131, n: 6, theme: 'dark', alpha: .8 * (1 - P(t, T_END, .6)) });
      const end = P(t, T_END, .9, E.inOutCubic), up = P(t, T_UP, .9, E.inOutCubic);
      const hy = lerp(430, 230, up), hs = lerp(1, .52, up), R = 200 * hs;
      ctx.save(); ctx.globalAlpha = 1 - end;
      // órbita (atrás / frente)
      const oa = 1 - P(t, T_UP, .6);
      const items = ORB.map((o, k) => { const a = t * .35 + k * TAU / ORB.length, ap = E.outBack(P(t, T_ORB + k * .12, .45)) * oa; return { o, k, x: W / 2 + Math.cos(a) * 520, y: hy + Math.sin(a) * 175, front: Math.sin(a) > 0, ap }; });
      const drawItem = it => { if (it.ap <= 0) return; const s = (it.front ? 1 : .78) * it.ap; ctx.save(); ctx.globalAlpha *= it.front ? 1 : .55;
        if (it.o[0] === 'agent') agent(ctx, it.x, it.y, 30 * s, { role: it.o[1], t: t + it.k, seed: it.k, look: Math.sin(t * 2 + it.k) });
        else { circle(ctx, it.x + 4, it.y + 5, 40 * s, '#000'); circle(ctx, it.x, it.y, 40 * s, PAPER, INK, 3); icon(ctx, it.o[0], it.x, it.y, 40 * s, INK, 8); } ctx.restore(); };
      items.filter(i => !i.front).forEach(drawItem);
      const meet = P(t, .6, 1.4, E.inOutCubic); let d = lerp(1800, 300, meet); if (t > T_MEET) d = lerp(300, 260, P(t, T_MEET, .3, E.outExpo));
      glow(ctx, W / 2, hy, 600 * hs, C.orange, .3 * P(t, T_MEET, 1) + (t > T_F[3] + 1 ? .25 * (1 - P(t, T_F[3] + 1, 1.5)) : 0));
      intersection(ctx, W / 2, hy, R, d * hs, { hot: Math.exp(-Math.max(0, t - T_MEET) * 2.4) * (t > T_MEET) * .8 });
      items.filter(i => i.front).forEach(drawItem);
      // letreiro split-flap
      const by = lerp(H + 260, 640, up);
      if (up > 0) {
        const tw = 76, th = 112, gap = 8, bw = LEN * (tw + gap) - gap, bx = (W - bw) / 2;
        paper(ctx, bx - 34, by - th / 2 - 74, bw + 68, th + 118, { r: 18, fill: '#14110E', outline: '#000', shadow: 12, shadowColor: '#000', lw: 3 });
        [[bx - 18, by - th / 2 - 58], [bx + bw + 18, by - th / 2 - 58], [bx - 18, by + th / 2 + 28], [bx + bw + 18, by + th / 2 + 28]].forEach(([px, py]) => { circle(ctx, px, py, 7, '#3B3128', '#000', 2); line(ctx, px - 4, py, px + 4, py, '#000', 2); });
        ctx.save(); ctx.translate(bx + 150, by - th / 2 - 46); ctx.rotate(-.015); paper(ctx, -140, -18, 280, 36, { r: 4, fill: C.red, shadow: 4, shadowColor: '#000', lw: 2 });
        text(ctx, 'PRÓXIMA PARADA', 0, 1, { size: 20, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 4 }); ctx.restore();
        circle(ctx, bx + bw - 30, by - th / 2 - 46, 9, Math.sin(t * 6) > 0 ? C.yellow : '#4A3A20');
        const gA = t > T_F[3] + 1 ? E.outCubic(P(t, T_F[3] + 1, .8)) : 0;
        for (let i = 0; i < LEN; i++) { const st = flapState(i, t), k = Math.max(0, st.k); tile(ctx, bx + i * (tw + gap), by - th / 2, tw, th, st, i >= HI[k] && st.cur !== ' ', gA); }
        if (gA > 0) { ctx.save(); ctx.globalAlpha *= gA; rr(ctx, bx - 34, by - th / 2 - 74, bw + 68, th + 118, 18); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.shadowColor = C.orange; ctx.shadowBlur = 24; ctx.stroke(); ctx.restore(); }
      }
      ctx.restore();
      scanlines(ctx, .07);
      // bookend: o ponto laranja pulsando (mesmo da abertura)
      if (end > 0) { const pulse = [T_END + .3, T_END + 1.0].reduce((a, s) => a + Math.exp(-Math.max(0, t - s) * 6) * (t >= s), 0);
        glow(ctx, W / 2, H / 2, 120 + pulse * 80, C.orange, .7 * end); circle(ctx, W / 2, H / 2, (16 + pulse * 8) * end, C.orange); }
    }
  };
})();
