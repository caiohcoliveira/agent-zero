/* ============================================================================
   20. PRÉ-SHOW · ABERTURA · PARADA 0 (mapa da linha)
   ========================================================================== */

/* ---------- pré-show (loop de espera) ---------- */
STOPSCN.preshow = {
  draw(ctx, tl) {
    bgDark(ctx, tl, { centerA: .85, center: '#2E2016' });
    collage(ctx, tl * .6, { seed: 17, n: 7, theme: 'dark', alpha: .7 });
    const br = BT.breath, ctxTitle = (DATA.presentation_context || {});
    // grafites respirando ao redor
    [['star', 300, 250, 90, C.yellow], ['arrow', 1600, 300, 120, C.orange], ['spiral', 1660, 820, 90, C.red], ['crown', 260, 820, 100, C.orange], ['zigzag', 960, 960, 160, C.yellow]]
      .forEach(([k, x, y, s, c], i) => scribble(ctx, k, x, y, s, c, 400 + i, 1, { alpha: .5 + .3 * Math.sin(tl * 1.1 + i), glow: true, rot: Math.sin(tl * .4 + i) * .1 }));
    intersection(ctx, W / 2, 285, 92, 120, { hot: .25 + .25 * br });
    paintTitle(ctx, 'PERFORMANCE ANALYTICS', W / 2, 520, { size: 104, bg: C.orange, seed: 7, p: 1 });
    text(ctx, (ctxTitle.organization || 'Mastercard Advisors').toUpperCase() + '  ·  ' + TX.line, W / 2, 625, { size: 24, weight: 800, mono: true, color: '#F3E6D6', align: 'center', ls: 4 });
    const tt = tl % 16, ph = [TX.line, TX.stop.preshow, TX.line].map(s => s.padEnd(27, ' '));
    FLAP.board(ctx, W / 2, 790, ph, [-100, .4, 8.4], tt, { tw: 46, th: 66, hiFrom: [0, 0, 0] });
    glow(ctx, W / 2, 285, 300, C.orange, .25 + .2 * br);
    hint(ctx, tl, '→  para começar');
    scanlines(ctx, .05);
  }
};

/* ---------- abertura (15s, trilha sintetizada a 120 BPM; drop em 4.5) ---------- */
(() => {
  const id = 'open', SL = [4.5, 5.5, 6.5, 7.5, 9.0], COLS = [C.red, C.yellow, C.orange, '#F3EBDD', C.orange];
  const T_KICK = 1.0, T_DROP = 4.5, T_POSTER = 10.5, T_GO = 12.5;
  cue(id, T_KICK, 'pop', { p: 1.1 }); cue(id, T_DROP, 'impact', { size: 1.2 });
  SL.forEach((t0, i) => cue(id, t0, 'hit', { size: i === 4 ? .9 : .45 }));
  cue(id, SL[4] + .3, 'riser', { dur: .9, v: .2 }); cue(id, T_GO, 'whoosh', { dur: 1.4, v: .4 }); cue(id, 14.2, 'chime', { f: 784, up: 7 });
  const DOOD = [['zigzag', 260, 230, 140, C.yellow], ['star', 1650, 220, 110, C.orange], ['arrow', 1580, 880, 150, C.red], ['spiral', 300, 860, 110, C.orange], ['crown', 1700, 560, 110, C.yellow], ['x', 200, 560, 80, C.red]];

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      const go = E.inOutCubic(P(t, T_GO, 2.3)), b = BT;
      bgDark(ctx, t, { centerA: .9, center: '#33200F' });
      collage(ctx, t, { seed: 23, n: 8, theme: 'dark', alpha: .75 * (1 - go) });
      // respingos do drop
      if (t >= T_DROP) [[420, 300, 120, C.orange], [1500, 380, 150, C.red], [1240, 820, 110, C.yellow], [620, 860, 90, C.red]]
        .forEach(([x, y, r, c], i) => splat(ctx, x, y, r * (1 + .06 * b.low), c, 50 + i, E.outBack(P(t, T_DROP + i * .06, .3)), .75 * (1 - go)));
      // rabiscos que se desenham na subida e vibram com a batida
      DOOD.forEach(([k, x, y, s, c], i) => scribble(ctx, k, x, y, s * (1 + .08 * b.beat), c, 90 + i, P(t, 2.5 + i * .3, .6), { alpha: .8 * (1 - go), glow: true, rot: .1 * Math.sin(t + i) }));
      // ponto laranja que pulsa até o drop
      const pre = 1 - P(t, T_DROP - .2, .3);
      if (pre > 0) { const r = 22 + 10 * Math.sin(t * 6) * P(t, 2.5, 2) + 40 * P(t, 2.5, 2, E.inQuad);
        glow(ctx, W / 2, H / 2, r * 6, C.orange, .6 * pre); circle(ctx, W / 2, H / 2, r * pre, C.orange); inkCircle(ctx, W / 2, H / 2, r * pre, 5, 3); }
      // kicker
      const kp = E.outBack(P(t, T_KICK, .4));
      if (kp > 0) { ctx.save(); ctx.globalAlpha *= 1 - go; ctx.translate(W / 2, lerp(H / 2 - 120, 210, P(t, T_DROP - .3, .5, E.inOutCubic))); ctx.rotate(-.03); ctx.scale(kp, kp);
        const kw = measure(ctx, TX.hookKicker || '', 30, 800, true, 6) + 70; paper(ctx, -kw / 2, -30, kw, 60, { r: 6, fill: C.red, shadow: 7, shadowColor: '#000', lw: 3 });
        text(ctx, TX.hookKicker || '', 0, 2, { size: 30, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 6 }); ctx.restore(); }
      // as 5 tiras batem no tempo
      (TX.hook || []).forEach((s, i) => {
        const p = P(t, SL[i], .28), big = i === 4; if (p <= 0) return;
        const y0 = 330 + i * 112 + (big ? 22 : 0), size = big ? 104 : 74, w = measure(ctx, s, size, 900) + 120, rot = [-.02, .015, -.012, .02, -.025][i];
        const sl = E.outBack(p), x = W / 2 + (1 - E.outExpo(p)) * (i % 2 ? 900 : -900);
        ctx.save(); ctx.globalAlpha *= 1 - (big ? E.inCubic(P(t, T_GO + .6, 1.2)) : go); ctx.translate(x, y0); ctx.rotate(rot); ctx.scale(lerp(1.35, 1, sl), lerp(1.35, 1, sl));
        const vib = 1 + .02 * b.beat * (i === b.i % 5 ? 2 : 1); ctx.scale(vib, vib);
        brush(ctx, -w / 2, -size * .62, w, size * 1.24, COLS[i], 11 + i, 1);
        inkRect(ctx, -w / 2 - 4, -size * .66, w + 8, size * 1.32, 6, 3, i);
        const light = i === 1 || i === 3; retroText(ctx, s, 0, 0, light ? { size, weight: 900, color: INK, align: 'center', depth: 0, lw: 0 } : { size, weight: 900, color: '#FFF', outline: INK, align: 'center', depth: 5, lw: 4 });
        ctx.restore();
      });
      // marcador laranja circulando "Gerar valor" → vira o trem
      const mk = P(t, SL[4] + .3, .8), y4 = 330 + 4 * 112 + 22;
      if (mk > 0) {
        const fly = go, cx = lerp(W / 2, MAP.at(0)[0], fly), cy = lerp(y4, MAP.at(0)[1], fly), sc = lerp(1, .05, E.inQuad(fly));
        ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc * .4); scribble(ctx, 'circle', 0, 0, 640, C.orange, 7, mk, { lw: .028, glow: true }); ctx.restore();
        if (fly > .85) { const a = (fly - .85) / .15; glow(ctx, cx, cy, 90, C.orange, .6 * a); circle(ctx, cx, cy, 16 * a, C.orange); inkCircle(ctx, cx, cy, 16 * a, 4, 77); }
      }
      // o mapa começa a ser traçado
      if (go > .5) metroMap(ctx, t, { reveal: .12 * E.inOutCubic((go - .5) * 2), alpha: clamp((go - .5) * 3), future: false });
      scanlines(ctx, .05);
    }
  };
})();

/* ---------- parada 0: o mapa da linha (roteiro) ---------- */
STOPSCN.stop0 = (() => {
  const SEQ = [1, 2, 3, 'p1', 4, 5, 6, 'p2', 7];
  const view = item => {
    if (!item) return { x: W / 2, y: H / 2, s: 1 };
    const n = MAP.node(SEQ[item - 1]); return { x: lerp(W / 2, n.x, .62), y: lerp(H / 2, n.y, .62), s: 1.24 };
  };
  function infoCard(ctx, k, a, tl) {
    if (a <= 0) return;
    const n = MAP.node(k), isStop = typeof k === 'string', st = isStop ? null : TX.stations[k - 1];
    const title = isStop ? TX.stop.label : st.title, sub = isStop ? TX.stop.talkStop : st.teaser;
    const w = Math.max(measure(ctx, title, 30, 900), measure(ctx, sub, 22, 600)) + 80, h = 120;
    const x = clamp(n.x - w / 2, 40, W - w - 40), y = n.y + (n.y > 700 ? -h - 70 : n.y < 450 ? 70 : 64);
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x + w / 2, y + h / 2 + (1 - E.outBack(a)) * 30); ctx.rotate(Math.sin(tl * .8) * .01 - .01);
    paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: 70, fill: '#F6EEDF', shadow: 10, shadowColor: '#000', lw: 3, tape: [[.5, 0, .1]] });
    if (!isStop) { retroText(ctx, st.n, -w / 2 + 34, -18, { size: 30, weight: 900, color: C.orange, depth: 2, lw: 2 }); }
    text(ctx, title, isStop ? 0 : -w / 2 + (isStop ? 40 : 84), -18, { size: 30, weight: 900, color: INK, align: isStop ? 'center' : 'left' });
    text(ctx, sub, isStop ? 0 : -w / 2 + 40, 26, { size: 22, weight: 600, color: '#4A4038', align: isStop ? 'center' : 'left' });
    ctx.restore();
  }
  return {
    draw(ctx, tl, item, prevItem, p) {
      const e = E.inOutCubic(p), a = view(prevItem), b = view(item), vx = lerp(a.x, b.x, e), vy = lerp(a.y, b.y, e), vs = lerp(a.s, b.s, e);
      bgDark(ctx, tl, { centerA: .9, center: '#33200F' });
      collage(ctx, tl * .5, { seed: 31, n: 6, theme: 'dark', alpha: .55 * P(tl, .2, 1.5) });
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(vs, vs); ctx.translate(-vx, -vy);
      const rev = lerp(.12, 1, E.inOutCubic(P(tl, 0, 2.4)));
      glow(ctx, 960, 590, 900, C.orange, .12 + .05 * BT.breath);
      metroMap(ctx, tl, { reveal: rev, hi: item ? SEQ[item - 1] : null, train: 0 });
      if (item) infoCard(ctx, SEQ[item - 1], E.outCubic(p), tl);
      if (prevItem && prevItem !== item) infoCard(ctx, SEQ[prevItem - 1], 1 - E.outCubic(p * 1.6), tl);
      ctx.restore();
      const ba = (1 - E.inOutCubic(item ? (prevItem ? 1 : p) : (prevItem ? 1 - p : 0))) * E.outCubic(P(tl, 0, .6));
      if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba; FLAP.board(ctx, W / 2, 112 - 40 * (1 - ba), [TX.line], [.3], tl, { tw: 40, th: 58, hiFrom: [5] }); ctx.restore(); }
      hint(ctx, tl, item === 9 ? TX.stop.go : '→');
      scanlines(ctx, .05);
    }
  };
})();
