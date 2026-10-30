/* ---------------------------------------------------------------------------
   CENA 9 — CLÍMAX (3:22–3:44)
   11 cortes no beat (1 por técnica) → eixo simples ●──● complexo com slider
   → tiles formam um anel e convergem → "Nossa especialidade é analytics."
   --------------------------------------------------------------------------- */
(() => {
  const id = 'climax', WORDS = TX.climaxWords;
  const VZ = ['gaussian', 'regression', 'classification', 'tree', 'ensemble', 'clusters', 'anomaly', 'embeddings', 'recommend', 'agents', 'pipeline'];
  const T_AXIS = 11.0, T_SLIDE = 12.4, T_RING = 17.0, T_KEY = 17.3, T_SUB = 19.4, T_CONV = 19.8, T_FLASH = 21.4;
  WORDS.forEach((_, k) => { cue(id, k, 'hit', { size: .35 + (k === 10 ? .3 : 0) }); cue(id, k - .12, 'whoosh', { dur: .14, v: .25 }); });
  cue(id, T_AXIS, 'whoosh', { dur: .8, v: .4 }); cue(id, T_SLIDE, 'riser', { dur: 4, v: .3 });
  WORDS.forEach((_, k) => cue(id, T_SLIDE + .2 + k * .36, 'tick', { f: 1400 + k * 110, v: .16 }));
  cue(id, T_RING, 'whoosh', { dur: .8, v: .35 }); cue(id, T_KEY, 'impact', { size: .9 }); cue(id, T_CONV + .6, 'swell', { dur: 1.0 });
  cue(id, T_FLASH, 'impact', { size: 1.3 }); cue(id, T_FLASH, 'shimmer', { dur: 1.4 });
  const N = WORDS.length, ax = k => 150 + k * (1620 / (N - 1));

  SCENES[id] = {
    themeAt: t => (t < T_AXIS && Math.floor(t) % 2 === 0 ? 'light' : 'dark'),
    draw(ctx, t) {
      // ---------- montagem no beat ----------
      if (t < T_AXIS) {
        const k = Math.min(N - 1, Math.floor(t)), tau = t - k, light = k % 2 === 0, theme = light ? 'light' : 'dark';
        if (light) bgLight(ctx, t); else bgDark(ctx, t, { centerA: .8, center: '#2E1E12' });
        const dir = k % 2 ? 1 : -1, enter = E.outExpo(clamp(tau / .2)), z = lerp(1.08, 1, E.outCubic(clamp(tau / .5)));
        camera(ctx, { x: W / 2 + dir * (1 - enter) * 280, y: H / 2, z }, () => {
          const vx = 600, vy = 150, vw = 1180, vh = 620;
          VIZ[VZ[k]](ctx, vx, vy, vw, vh, P(tau, 0, .82), { t, theme });
          const wp = P(tau, 0, .22, E.outExpo);
          ctx.save(); ctx.translate(110, 880); ctx.scale(lerp(1.3, 1, wp), lerp(1.3, 1, wp)); ctx.globalAlpha = clamp(wp * 3);
          text(ctx, WORDS[k], 0, 0, { size: 132, weight: 800, color: light ? C.ink : C.cream, ls: -4 }); ctx.restore();
          line(ctx, 114, 960, 114 + 220 * wp, 960, C.orange, 10);
        });
        text(ctx, String(k + 1).padStart(2, '0') + ' / ' + N, W - 80, 90, { size: 26, weight: 700, mono: true, color: light ? C.stone : C.sand, align: 'right' });
        if (tau < .07) flash(ctx, .35 * (1 - tau / .07), light ? '#FFFFFF' : C.orange);
        return;
      }
      // ---------- eixo de complexidade + anel ----------
      bgDark(ctx, t, { centerA: .85, center: '#2E1E12' });
      kinetic(ctx, TX.climaxLine, W / 2, 300, t - T_AXIS - .3, { size: 64, color: C.cream, out: T_RING - T_AXIS - .3 });
      const axA = P(t, T_AXIS, .5) * (1 - P(t, T_RING, .4)), slideX = lerp(100, 1820, P(t, T_SLIDE, 4.2, E.inOutCubic));
      if (axA > 0) { ctx.save(); ctx.globalAlpha = axA; line(ctx, 150, 660, 1770, 660, 'rgba(245,241,234,.25)', 3); circle(ctx, 150, 660, 9, C.cream); circle(ctx, 1770, 660, 9, C.orange);
        text(ctx, 'simples', 150, 708, { size: 30, weight: 700, color: C.sand, align: 'center' }); text(ctx, 'complexo', 1770, 708, { size: 30, weight: 700, color: C.orange, align: 'center' });
        if (t > T_SLIDE && t < T_SLIDE + 4.4) { glow(ctx, slideX, 560, 220, C.orange, .55); line(ctx, slideX, 470, slideX, 680, 'rgba(255,230,200,.9)', 4); }
        line(ctx, 150, 660, Math.min(slideX, 1770), 660, C.orange, 5); ctx.restore(); }
      const ring = P(t, T_RING, 1.2, E.inOutCubic), conv = P(t, T_CONV, .8, E.inExpo);
      WORDS.forEach((w, k) => {
        const fin = P(t, T_AXIS + k * .05, .6, E.outBack), lit = slideX > ax(k), tw = 140, th = 96;
        const a = (t - T_RING) * .5 + k * TAU / N - Math.PI / 2, rx = CX9 + Math.cos(a) * 780, ry = CY9 + Math.sin(a) * 390;
        let x = lerp(W / 2, ax(k), fin), y = lerp(H / 2, 560, fin);
        x = lerp(x, rx, ring); y = lerp(y, ry, ring); x = lerp(x, W / 2, conv); y = lerp(y, H / 2, conv);
        const s = (1 - conv) * Math.max(0, fin); if (s <= .01) return;
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = lit || ring > 0 ? 1 : .4;
        rr(ctx, -tw / 2, -th / 2, tw, th, 14); ctx.fillStyle = '#1C1A18'; ctx.fill(); ctx.strokeStyle = lit || ring > 0 ? C.orange : 'rgba(245,241,234,.2)'; ctx.lineWidth = 3; ctx.stroke();
        ctx.save(); rr(ctx, -tw / 2, -th / 2, tw, th, 14); ctx.clip(); VIZ[VZ[k]](ctx, -tw / 2 + 12, -th / 2 + 8, tw - 24, th - 36, 1, { t, theme: 'dark' }); ctx.restore();
        text(ctx, w, 0, th / 2 - 15, { size: 15, weight: 800, color: C.cream, align: 'center' }); ctx.restore();
      });
      if (t > T_KEY) { const s = lerp(1.25, 1, P(t, T_KEY, .4, E.outExpo)); ctx.save(); ctx.translate(W / 2, H / 2 - 10); ctx.scale(s, s); ctx.globalAlpha = P(t, T_KEY, .15);
        glow(ctx, 0, 0, 700, C.orange, .18 + .25 * conv); const [l1, l2] = TX.climaxKey.split(/ (?=\*)/);
        rich(ctx, l1, 0, -70, { size: 92, color: '#FFF' }); rich(ctx, l2, 0, 60, { size: 150 }); ctx.restore();
        kinetic(ctx, TX.climaxSub, W / 2, H / 2 + 175, t - T_SUB, { size: 36, weight: 600, color: C.sand, ls: 2 }); }
      flash(ctx, P(t, T_FLASH, .15) * (1 - P(t, T_FLASH + .25, .35)), '#FFF4E8');
    }
  };
  var CX9 = W / 2, CY9 = H / 2;
})();

/* ---------------------------------------------------------------------------
   CENA 10 — FECHAMENTO / CTA (3:44–4:00)
   --------------------------------------------------------------------------- */
(() => {
  const id = 'close';
  const T_MEET = 2.0, T_ORB = 2.4, T_BRAND = 5.3, T_FUT = 7.2, T_CTA = 11.0, T_END = 13.9;
  cue(id, .6, 'whoosh', { dur: 1.3, v: .35 }); cue(id, T_MEET, 'impact', { size: .7 }); cue(id, T_MEET, 'chime', { f: 1046, up: 7 });
  for (let k = 0; k < 9; k++) cue(id, T_ORB + k * .12, 'pop', { p: .9 + k * .08, v: .12 });
  cue(id, T_BRAND, 'shimmer', { dur: 1.4 }); cue(id, T_CTA - .3, 'whoosh', { dur: .5, v: .35 }); cue(id, T_CTA + 1.0, 'hit', { size: 1.1 }); cue(id, T_CTA + 1.0, 'combo');
  cue(id, T_END + .6, 'heart'); cue(id, T_END + 1.45, 'heart');
  const ORB = [['dashboard'], ['grid'], ['nodes'], ['pipe'], ['gauge'], ['tree'], ['agent', 'analista'], ['agent', 'business'], ['agent', 'clevel']];

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#3A2416' });
      const end = P(t, T_END, .9, E.inOutCubic), cta = P(t, T_CTA, .8, E.inOutCubic);
      const hy = lerp(420, 250, cta), hs = lerp(1, .5, cta);
      ctx.save(); ctx.globalAlpha = 1 - end;
      // anel de órbita (atrás)
      const items = ORB.map((o, k) => { const a = t * .35 + k * TAU / ORB.length, ap = E.outBack(P(t, T_ORB + k * .12, .45)); return { o, k, a, x: W / 2 + Math.cos(a) * 520 * hs, y: hy + Math.sin(a) * 175 * hs, front: Math.sin(a) > 0, ap }; });
      const drawItem = it => { if (it.ap <= 0) return; const s = (it.front ? 1 : .78) * it.ap * hs, al = it.front ? 1 : .55;
        ctx.save(); ctx.globalAlpha *= al;
        if (it.o[0] === 'agent') agent(ctx, it.x, it.y, 30 * s, { role: it.o[1], t: t + it.k, seed: it.k, look: Math.sin(t * 2 + it.k) });
        else { circle(ctx, it.x, it.y, 40 * s, C.ink2, rgba(C.orange, .8), 3); icon(ctx, it.o[0], it.x, it.y, 40 * s, C.cream, 8); }
        ctx.restore(); };
      items.filter(i => !i.front).forEach(drawItem);
      // os dois círculos voltam
      const meet = P(t, .6, 1.4, E.inOutCubic); let d = lerp(1800, 300, meet); if (t > T_MEET) d = lerp(300, 260, P(t, T_MEET, .3, E.outExpo));
      const R = 210 * hs; glow(ctx, W / 2, hy, 600 * hs, C.orange, .3 * P(t, T_MEET, 1));
      intersection(ctx, W / 2, hy, R, d * hs, { hot: Math.exp(-Math.max(0, t - T_MEET) * 2.4) * (t > T_MEET) * .8 });
      items.filter(i => i.front).forEach(drawItem);
      // assinatura
      const by = lerp(740, 470, cta), bs = lerp(96, 54, cta);
      if (t > T_BRAND) scanText(ctx, TX.brand, W / 2, by, P(t, T_BRAND, 1.0, E.inOutCubic), { size: bs, weight: 800, color: '#FFF', ls: -1.5 });
      if (t > T_FUT) kinetic(ctx, TX.future, W / 2, 870, t - T_FUT, { size: 54, weight: 700, color: C.cream, stagger: .22, dur: .5, out: T_CTA - T_FUT - .8 });
      // CTA
      if (t > T_CTA + .2) {
        const p = P(t, T_CTA + .2, .5, E.outExpo), s = lerp(1.2, 1, p);
        ctx.save(); ctx.translate(W / 2, 690); ctx.scale(s, s); ctx.globalAlpha *= clamp(p * 2); const w = rich(ctx, TX.cta, 0, 0, { size: 124, color: '#FFF' }); ctx.restore();
        const u = P(t, T_CTA + .6, .5, E.inOutCubic); line(ctx, W / 2 - 420, 780, W / 2 - 420 + 840 * u, 780, C.orange, 8);
        kinetic(ctx, TX.ctaSub, W / 2, 860, t - T_CTA - 1.0, { size: 42, weight: 500, color: C.sand, ls: 1 });
      }
      ctx.restore();
      // bookend: o ponto laranja pulsando (mesmo da abertura)
      if (end > 0) { const pulse = [T_END + .6, T_END + 1.45].reduce((a, s) => a + Math.exp(-Math.max(0, t - s) * 6) * (t >= s), 0);
        glow(ctx, W / 2, H / 2, 120 + pulse * 80, C.orange, .7 * end); circle(ctx, W / 2, H / 2, (16 + pulse * 8) * end, C.orange); }
    }
  };
})();
