/* ---------------------------------------------------------------------------
   CENA 8 — CAPACIDADES (3:00–3:22)
   Pull-back: os 4 casos são nós de um ecossistema → 5 capacidades acendem
   (Crédito, ML, Advanced Analytics, Ciência de Dados, IA) com snap-zoom
   --------------------------------------------------------------------------- */
(() => {
  const id = 'skills', CX = W / 2, CY = 540;
  const T_IGN = [4.0, 6.4, 8.8, 11.2, 13.6], T_WIDE = 16.0, T_PULL = 19.0;
  const SK = [['Crédito', 'credit'], ['Machine Learning', 'tree'], ['Advanced Analytics', 'forecast'], ['Ciência de Dados', 'clusters'], ['IA', 'ai']];
  const ANG = [-90, -18, 54, 126, 198].map(a => a * Math.PI / 180), TWD = 340, THD = 210;
  const tilePos = i => ({ x: CX + Math.cos(ANG[i]) * 660, y: CY + Math.sin(ANG[i]) * 350 });
  const CASES = [['Insights', 'dashboard', 270], ['Recomendação', 'grid', 0], ['Embeddings', 'nodes', 90], ['Lights-off', 'pipe', 180]]
    .map(([n, ic, a]) => ({ n, ic, x: CX + Math.cos(a * Math.PI / 180) * 310, y: CY + Math.sin(a * Math.PI / 180) * 200 }));
  cue(id, .3, 'whoosh', { dur: 3.0, dir: 'down', v: .35 });
  T_IGN.forEach((t, i) => { cue(id, t - .1, 'whoosh', { dur: .3, v: .3 }); cue(id, t, 'stab', { i }); cue(id, t, 'chime', { f: 784 * Math.pow(2, [0, 2, 4, 7, 9][i] / 12), up: 12 }); });
  cue(id, T_WIDE, 'whoosh', { dur: .7, dir: 'down', v: .35 }); cue(id, 16.4, 'combo'); cue(id, T_PULL - 2.8, 'riser', { dur: 5.8, v: .4 });

  function camAt(t) {
    // começa colado no nó "Lights-off" e abre
    if (t < T_IGN[0] - .1) { const k = P(t, .3, 3.4, E.inOutCubic), c = CASES[3]; return { x: lerp(c.x, CX, k), y: lerp(c.y, CY, k), z: lerp(3.4, 1, k), r: lerp(-.08, 0, k) }; }
    if (t < T_WIDE) { // snap de tile em tile ("em dois" = textura stop motion)
      const tt = twos(t); let i = T_IGN.findIndex((ti, k) => tt >= ti - .1 && (k === 4 || tt < T_IGN[k + 1] - .1)); if (i < 0) i = 0;
      const from = i === 0 ? { x: CX, y: CY, z: 1 } : { ...tilePos(i - 1), z: 1.8 }, to = { ...tilePos(i), z: 1.8 };
      const k = P(tt, T_IGN[i] - .1, .38, E.outExpo); return { x: lerp(from.x, to.x, k), y: lerp(from.y, to.y, k), z: lerp(from.z, to.z, k), r: 0 };
    }
    const w = P(t, T_WIDE, .8, E.inOutCubic), last = tilePos(4), pl = P(t, T_PULL, 3, E.inCubic);
    return { x: lerp(last.x, CX, w), y: lerp(last.y, CY, w), z: lerp(1.8, 1, w) * lerp(1, .55, pl), r: pl * .06 };
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .8, center: '#2A1D14', drift: 10 });
      const allPulse = t > T_WIDE + .3 ? .5 + .5 * Math.sin((t - T_WIDE) * 6) : 0;
      camera(ctx, camAt(t), () => {
        dotGrid(ctx, t, 'rgba(255,255,255,.04)', 0);
        // conexões hub → tiles
        SK.forEach((_, i) => { const p = tilePos(i), on = t >= T_IGN[i];
          ctx.save(); if (!on) ctx.setLineDash([6, 10]); line(ctx, CX, CY, p.x, p.y, on ? rgba(C.orange, .55 + allPulse * .3) : 'rgba(245,241,234,.12)', on ? 3 : 2); ctx.restore();
          if (on) for (let k = 0; k < 2; k++) { const q = ((t - T_IGN[i]) * .7 + k * .5) % 1; glow(ctx, lerp(CX, p.x, q), lerp(CY, p.y, q), 18, C.yellow, .9); } });
        CASES.forEach(c => line(ctx, CX, CY, c.x, c.y, rgba(C.orange, .45), 2));
        // hub
        glow(ctx, CX, CY, 260, C.orange, .35 + allPulse * .2); intersection(ctx, CX, CY, 92, 112, {});
        text(ctx, TX.brand, CX, CY + 122, { size: 26, weight: 800, color: '#FFF', align: 'center' });
        // casos (já resolvidos)
        CASES.forEach(c => { circle(ctx, c.x, c.y, 38, C.ink2, C.orange, 3); icon(ctx, c.ic, c.x, c.y, 40, C.cream, 8);
          circle(ctx, c.x + 28, c.y - 28, 13, C.orange); icon(ctx, 'check', c.x + 28, c.y - 27, 15, '#FFF', 14);
          text(ctx, c.n, c.x, c.y + 60, { size: 20, weight: 700, color: C.sand, align: 'center' }); });
        // tiles de capacidade
        SK.forEach(([name, viz], i) => {
          const p = tilePos(i), on = t >= T_IGN[i], ip = P(t, T_IGN[i], .35, E.outBack), x = p.x - TWD / 2, y = p.y - THD / 2;
          ctx.save(); ctx.translate(p.x, p.y); const s = on ? lerp(.9, 1, ip) : .9; ctx.scale(s, s); ctx.translate(-p.x, -p.y);
          if (on) glow(ctx, p.x, p.y, 300, C.orange, .25 * (1 - P(t, T_IGN[i], 1.2)) + .08 + allPulse * .06);
          rr(ctx, x, y, TWD, THD, 22); ctx.fillStyle = on ? '#1C1A18' : 'rgba(30,30,30,.6)'; ctx.fill();
          ctx.strokeStyle = on ? C.orange : 'rgba(245,241,234,.15)'; ctx.lineWidth = on ? 3 : 2; ctx.stroke();
          if (on) { ctx.save(); rr(ctx, x, y, TWD, THD, 22); ctx.clip(); VIZ[viz](ctx, x + 26, y + 22, TWD - 52, THD - 82, P(t, T_IGN[i] + .05, 1.6), { t, theme: 'dark' }); ctx.restore(); }
          text(ctx, name, x + 24, y + THD - 30, { size: 26, weight: 800, color: on ? C.cream : 'rgba(245,241,234,.35)' });
          if (on) circle(ctx, x + TWD - 26, y + THD - 30, 8, C.orange);
          ctx.restore();
        });
      });
      flash(ctx, P(t, 21.5, .5) * 1.0, C.cream);
    }
  };
})();
