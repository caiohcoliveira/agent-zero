/* ---------------------------------------------------------------------------
   CENA 3 — QUEM SOMOS / A INTERSEÇÃO (0:34–0:56)
   --------------------------------------------------------------------------- */
/** os dois círculos com a interseção laranja (motivo central do filme) */
function intersection(ctx, cx, cy, R, d, o = {}) {
  const ax = cx - d / 2, bx = cx + d / 2, hot = o.hot || 0;
  glow(ctx, ax, cy, R * 1.5, C.red, .25 * (o.alpha == null ? 1 : o.alpha)); glow(ctx, bx, cy, R * 1.5, C.yellow, .2 * (o.alpha == null ? 1 : o.alpha));
  ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
  const gA = ctx.createRadialGradient(ax - R * .3, cy - R * .3, R * .1, ax, cy, R); gA.addColorStop(0, '#FF3347'); gA.addColorStop(1, C.red);
  const gB = ctx.createRadialGradient(bx - R * .3, cy - R * .3, R * .1, bx, cy, R); gB.addColorStop(0, '#FFC25A'); gB.addColorStop(1, C.yellow);
  const sd = Math.max(5, R * .05); ctx.save(); ctx.translate(sd, sd * 1.15); ctx.beginPath(); ctx.arc(ax, cy, R, 0, TAU); ctx.moveTo(bx + R, cy); ctx.arc(bx, cy, R, 0, TAU); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fill('nonzero'); ctx.restore();
  circle(ctx, ax, cy, R, gA); circle(ctx, bx, cy, R, gB);
  if (d < 2 * R) {
    ctx.save(); ctx.beginPath(); ctx.arc(ax, cy, R, 0, TAU); ctx.clip();
    circle(ctx, bx, cy, R, mix(C.orange, '#FFE6C7', hot * .6));
    ctx.restore();
  }
  [ax, bx].forEach(c0 => { ctx.save(); ctx.beginPath(); ctx.arc(c0, cy, R, 0, TAU); ctx.clip(); ctx.globalAlpha *= .22; ctx.drawImage(SHADE, c0 - R, cy - R, R * 2, R * 2); ctx.restore(); });
  const lw = Math.max(2.5, R * .028); circle(ctx, ax, cy, R, null, INK, lw); circle(ctx, bx, cy, R, null, INK, lw);
  if (hot > 0 && d < 2 * R) glow(ctx, cx, cy, R * 1.1, '#FFF2E0', hot * .7);
  if (o.labels) {
    const ls = Math.max(18, R * .15);
    text(ctx, o.labels[0], ax - R * .42, cy, { size: ls, weight: 800, align: 'center', color: '#FFF', alpha: o.labelA == null ? 1 : o.labelA });
    text(ctx, o.labels[1], bx + R * .42, cy, { size: ls, weight: 800, align: 'center', color: C.ink, alpha: o.labelA == null ? 1 : o.labelA });
  }
  ctx.restore();
}

(() => {
  const id = 'hub';
  cue(id, .2, 'whoosh', { dur: 3.4, v: .22 }); cue(id, 1.6, 'riser', { dur: 2.4, v: .3 });
  cue(id, 4.0, 'impact', { size: 1.4 }); cue(id, 4.0, 'shimmer', { dur: 1.6 }); cue(id, 4.2, 'whoosh', { dur: 1.1, v: .25 });
  cue(id, 6.6, 'whoosh', { dur: 1.1, dir: 'down', v: .25 });
  const SAT_T = [9.8, 10.5, 11.2], CHAIN_T = [13.5, 14.6, 15.9, 17.4];
  SAT_T.forEach((t, i) => cue(id, t, 'chime', { f: 784 * Math.pow(2, i * 2 / 12), up: 5 }));
  [11.4, 11.6, 11.8, 12.0].forEach((t, i) => cue(id, t, 'pop', { p: 1.1 + i * .12 }));
  CHAIN_T.forEach((t, i) => cue(id, t, i === 3 ? 'ding' : 'chime', { f: [880, 988, 1175, 1318][i] }));
  cue(id, 17.4, 'impact', { size: .5 }); cue(id, 18.4, 'whoosh', { dur: 1.4, v: .55 }); cue(id, 18.9, 'swell', { dur: 1.1 });

  const HUB = { x: W / 2, y: 430 }, SAT = [[-2.6, 'Modelos', 'tree'], [-Math.PI / 2, 'Tecnologia', 'gear'], [-.54, 'Estratégia', 'trend']];
  const CHAIN = [['Dados', 'db'], ['Insights', 'spark'], ['Decisão', 'check'], ['Impacto', 'trend']];
  const chipAng = (t, i) => t * .45 + i * TAU / 4 + .9;
  const chipPos = (t, i) => { const a = chipAng(t, i); return [HUB.x + Math.cos(a) * 360, HUB.y + 10 + Math.sin(a) * 92]; };

  SCENES[id] = {
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: lerp(.3, .9, P(t, 4, 1)), center: '#3A2416' });
      const shrink = P(t, 6.6, 1.3, E.inOutCubic), dive = P(t, 18.4, 1.5, E.inExpo);
      const R = lerp(270, 138, shrink), cy = lerp(H / 2 - 40, HUB.y, shrink);
      let d = lerp(2300, 560, P(t, .2, 3.6, E.inOutCubic)); if (t >= 3.8) d = lerp(560, 330, P(t, 3.8, .28, E.outExpo));
      d *= R / 270;
      const hot = Math.exp(-Math.max(0, t - 4) * 1.6) * (t >= 4);
      ctx.save(); ctx.globalAlpha = 1 - dive;
      // conexões hub → satélites
      SAT.forEach(([a, , ], i) => { const p = P(t, SAT_T[i] - .25, .4, E.outCubic); if (p <= 0) return;
        const sx = HUB.x + Math.cos(a) * 330, sy = HUB.y + Math.sin(a) * 300;
        ctx.save(); ctx.setLineDash([10, 12]); ctx.lineDashOffset = -t * 40; line(ctx, HUB.x, HUB.y, lerp(HUB.x, sx, p), lerp(HUB.y, sy, p), rgba(C.cream, .3), 2.5); ctx.restore(); });
      drawChips(ctx, t, dive, false);
      intersection(ctx, W / 2, cy, R, d, { hot, labels: [TX.circleA, TX.circleB], labelA: P(t, .8, .6) });
      // flare
      if (hot > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fl = hot;
        const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(255,140,40,0)'); g.addColorStop(.5, `rgba(255,220,180,${.75 * fl})`); g.addColorStop(1, 'rgba(255,140,40,0)');
        ctx.fillStyle = g; ctx.fillRect(0, cy - 3, W, 6); glow(ctx, W / 2, cy, 420 * fl + 60, C.orange, .6 * fl);
        circle(ctx, W / 2, cy, 300 + (1 - fl) * 700, null, rgba('#FFE2C4', fl * .5), 3); ctx.restore(); }
      // wordmark
      const wy = lerp(H / 2 + 330, HUB.y + 228, shrink), ws = lerp(98, 58, shrink);
      if (t > 4.1) scanText(ctx, TX.brand, W / 2, wy, P(t, 4.2, 1.2, E.inOutCubic), { size: ws, weight: 800, color: '#FFF', ls: -1.5 });
      // satélites
      SAT.forEach(([a, lb, ic], i) => { const p = E.outBack(P(t, SAT_T[i], .45)); if (p <= 0) return;
        const sx = HUB.x + Math.cos(a) * 330, sy = HUB.y + Math.sin(a) * 300;
        circle(ctx, sx, sy, 50 * p, C.ink2, rgba(C.orange, .8), 3); icon(ctx, ic, sx, sy, 50 * p, C.cream);
        text(ctx, lb, sx, sy + 82, { size: 26, weight: 700, color: C.cream, align: 'center', alpha: P(t, SAT_T[i] + .1, .3) }); });
      // cadeia Dados → Insights → Decisão → Impacto
      const cyc = 880, xs = [450, 790, 1130, 1470];
      CHAIN.forEach(([lb, ic], i) => {
        const p = E.outBack(P(t, CHAIN_T[i], .45)); if (t < CHAIN_T[i] - .6) return;
        if (i > 0) { const ap = P(t, CHAIN_T[i] - .55, .5, E.inOutCubic); const x0 = xs[i - 1] + 66, x1 = xs[i] - 66;
          line(ctx, x0, cyc, lerp(x0, x1, ap), cyc, rgba(C.orange, .8), 4); if (ap >= 1) arrowHead(ctx, x1 + 4, cyc, 0, 18, C.orange);
          if (t > CHAIN_T[i]) for (let k = 0; k < 3; k++) { const q = (t * .9 + k / 3) % 1; glow(ctx, lerp(x0, x1, q), cyc, 16, C.yellow, .9); } }
        if (p <= 0) return; const fin = i === 3;
        if (fin) glow(ctx, xs[i], cyc, 170, C.orange, .55 + .2 * Math.sin(t * 5));
        circle(ctx, xs[i], cyc, 58 * p, fin ? C.orange : C.ink2, fin ? null : rgba(C.orange, .9), 3);
        icon(ctx, ic, xs[i], cyc, 52 * p, fin ? '#FFF' : C.cream, 8);
        text(ctx, lb, xs[i], cyc + 96, { size: 30, weight: 800, color: fin ? C.orange : C.cream, align: 'center', alpha: P(t, CHAIN_T[i], .3) });
      });
      ctx.restore();
      drawChips(ctx, t, dive, true);
    }
  };
  function drawChips(ctx, t, dive, front) {
      TX.questions.forEach((q, i) => {
        const p = P(t, 11.4 + i * .2, .8, E.outExpo); if (p <= 0) return;
        let [x, y] = chipPos(t, i); x = lerp(64 + i * 190, x, p); y = lerp(64, y, p);
        const lb = `${q.n}  ${q.short}`, w = measure(ctx, lb, 18, 700) + 36;
        if (i === 0 && dive > 0) { if (!front) return;
          const [ox, oy] = chipPos(18.4, 0), ex = lerp(ox, W / 2, dive), ey = lerp(oy, H / 2, dive), ew = lerp(w, W + 40, dive), eh = lerp(40, H + 40, dive);
          rr(ctx, ex - ew / 2, ey - eh / 2, ew, eh, lerp(20, 0, dive)); ctx.fillStyle = mix(C.orange, '#16130F', clamp(dive * 1.6)); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
          if (dive < .4) text(ctx, lb, ex, ey, { size: 18 * (1 + dive * 3), weight: 700, color: '#FFF', align: 'center', alpha: 1 - dive * 2.5 });
          return;
        }
        const isFront = Math.sin(chipAng(t, i)) > 0 || p < 1; if (isFront !== front) return;
        const k = isFront ? 1 : .8, hi = i === 0 && t > 17.9;
        pill(ctx, x, y, lb, { size: 18, scale: k, fill: hi ? C.orange : (isFront ? 'rgba(30,30,30,.85)' : 'rgba(30,30,30,.6)'), stroke: rgba(C.cream, isFront ? .45 : .2), color: hi ? '#FFF' : C.cream, alpha: (1 - dive) * (isFront ? 1 : .55) });
      });
  }
})();
