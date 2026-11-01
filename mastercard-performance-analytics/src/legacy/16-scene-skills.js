/* ---------------------------------------------------------------------------
   CENA 8 — POSSIBILIDADES (3:00–3:22) · mostrado, não verbalizado
   Onda 1: painéis de colagem ISSUER × ACQUIRER
   Onda 2: stickers de capacidades analíticas
   Onda 3: tags neon do estado da arte sobre grid synthwave (+ fórmulas soltas)
   Fecho: tudo vira um tile de um mosaico que se repete ao infinito (∞)
   --------------------------------------------------------------------------- */
(() => {
  const id = 'skills', WV = TX.waves;
  const T_W1 = 1.6, T_W2 = 7.6, T_W3 = 12.8, T_ZOOM = 18.4, T_INF = 20.2, T_FLASH = 21.5;
  const I_ICON = ['shield', 'gauge', 'check', 'nodes', 'coin'], A_ICON = ['shield', 'store', 'bolt', 'pipe', 'doc'];
  const W2 = [[560, 430, -.06], [960, 425, .05], [1390, 432, -.03], [700, 550, .04], [1200, 548, -.05], [520, 668, .06], [920, 672, -.02], [1330, 666, .04], [700, 790, -.05], [1170, 792, .03]];
  const W2C = [PAPER, C.yellow, C.orange, PAPER, C.red, C.yellow, PAPER, C.orange, C.yellow, C.red];
  const W2I = ['nodes', 'bolt', 'trend', 'user', 'store', 'basket', 'card', 'chart', 'pipe', 'grid'];
  const EGGS = [['P(Y | do(X))', 420, 640], ['τ(x) = E[Y|T=1,x] − E[Y|T=0,x]', 430, 790], ['Q(s,a) ← Q + α[r + γ·max Q′ − Q]', 1490, 790], ['h_v ← σ(W · Σ h_u)', 1500, 640], ['max Σ wᵢ·fᵢ(x)', 960, 930]];
  const t1 = k => T_W1 + .4 + k * .3; // itens da onda 1 alternando painéis (k = 0..9)
  // ---- cues ----
  cue(id, .2, 'impact', { size: .4 }); cue(id, T_W1, 'whoosh', { dur: .5, v: .4 });
  for (let k = 0; k < 10; k++) { cue(id, t1(k), 'pop', { p: .8 + k * .05, v: .2 }); cue(id, t1(k), 'tick', { f: 1500 + k * 90, v: .12 }); }
  cue(id, T_W2, 'whoosh', { dur: .6, v: .4 }); for (let k = 0; k < 10; k++) cue(id, T_W2 + .4 + k * .35, 'pop', { p: 1.1 + k * .06, v: .2 });
  cue(id, T_W3, 'shimmer', { dur: 1.8 }); cue(id, T_W3, 'impact', { size: .6 }); for (let k = 0; k < 9; k++) cue(id, T_W3 + .3 + k * .4, 'ping', { f: 988 * Math.pow(2, (k % 5) * 2 / 12) });
  cue(id, T_ZOOM, 'whoosh', { dur: 2.6, dir: 'down', v: .5 }); cue(id, T_INF, 'chime', { f: 784, up: 12 }); cue(id, T_FLASH, 'impact', { size: 1.2 });

  const OFF = makeCanvas(W, H, () => {}), octx = OFF.getContext('2d');
  const MINI = makeCanvas(480, 270, () => {}), mctx = MINI.getContext('2d');

  function panel(ctx, t, cx, cy, s, a, title, items, icons, col, side) {
    if (a <= 0) return; const w = 760, h = 640;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(s, s); ctx.rotate(side ? .015 : -.015);
    paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: side ? 81 : 82, amp: 4, fill: PAPER, shadow: 14, shadowColor: '#000', lw: 4, halftone: .06, tape: [[.12, 0, -.3], [.88, 0, .3]] });
    paper(ctx, -w / 2 + 26, -h / 2 + 30, w - 52, 86, { r: 6, fill: col, shadow: 6, lw: 3, halftone: .2 });
    retroText(ctx, title, 0, -h / 2 + 76, { size: 54, weight: 900, color: side ? INK : '#FFF', align: 'center', shadow: INK, depth: side ? 0 : 4, lw: side ? 0 : 3, ls: 6 });
    items.forEach((it, k) => { const at = t1(k * 2 + side), p = E.outBack(P(t, at, .35)); if (p <= 0) return; const y = -h / 2 + 168 + k * 94;
      ctx.save(); ctx.translate(-w / 2 + 40 + 340 * (1 - p) * (side ? 1 : -1) * 0, y); ctx.globalAlpha *= clamp(p * 2);
      paper(ctx, 0, -36, w - 80, 72, { torn: true, seed: 90 + k + side * 10, amp: 2, fill: '#FFFDF8', shadow: 5, lw: 2.5 });
      circle(ctx, 42, 0, 24, col, INK, 2.5); icon(ctx, icons[k], 42, 0, 28, side ? INK : '#FFF', 9);
      text(ctx, it, 84, 2, { size: it.length > 20 ? 30 : 34, weight: 900, color: INK }); ctx.restore(); });
    ctx.restore();
  }

  function compose(ctx, t) {
    bgDark(ctx, t, { centerA: .8, center: '#2A1A10' });
    const w3 = P(t, T_W3, .9, E.inOutCubic);
    neonGrid(ctx, t, { horizon: 700, sun: 230, alpha: w3, speed: .6 });
    collage(ctx, t, { seed: 91, n: 6, theme: 'dark', alpha: .8 * (1 - w3) });
    // onda 1 → painéis encolhem para os cantos na onda 2 e somem na 3
    const m = P(t, T_W2, .9, E.inOutCubic), pa = P(t, T_W1, .4) * (1 - P(t, T_W3, .6));
    panel(ctx, t, lerp(520, 270, m), lerp(560, 300, m), lerp(1, .42, m) * lerp(.9, 1, E.outBack(P(t, T_W1, .5))), pa, 'ISSUER', WV.issuer, I_ICON, C.red, 0);
    panel(ctx, t, lerp(1400, 1650, m), lerp(560, 300, m), lerp(1, .42, m) * lerp(.9, 1, E.outBack(P(t, T_W1 + .15, .5))), pa, 'ACQUIRER', WV.acquirer, A_ICON, C.yellow, 1);
    // onda 2: stickers de capacidades
    WV.analytics.forEach((nm, k) => { const at = T_W2 + .4 + k * .35, p = E.outBack(P(t, at, .4)); if (p <= 0) return;
      const [x, y, r] = W2[k], back = w3, xx = x, yy = y + back * 150, s = p * lerp(1, .78, back);
      ctx.save(); ctx.globalAlpha *= lerp(1, .45, back); ctx.translate(xx, yy); ctx.rotate(r); ctx.scale(s, s);
      const tw = measure(ctx, nm, 30, 900) + 96; paper(ctx, -tw / 2, -32, tw, 64, { r: 32, fill: W2C[k], shadow: 7, shadowColor: '#000', lw: 3 });
      circle(ctx, -tw / 2 + 34, 0, 18, '#FFFDF8', INK, 2); icon(ctx, W2I[k], -tw / 2 + 34, 0, 22, INK, 9);
      text(ctx, nm, -tw / 2 + 62, 2, { size: 30, weight: 900, color: W2C[k] === C.red ? '#FFF' : INK }); ctx.restore(); });
    // onda 3: estado da arte (neon)
    WV.frontier.forEach((nm, k) => { const at = T_W3 + .3 + k * .4, p = P(t, at, .5, E.outCubic); if (p <= 0) return;
      const x = [420, 960, 1500][k % 3], y = [240, 340, 440][Math.floor(k / 3)] + (1 - p) * 120, tw = 460;
      ctx.save(); ctx.globalAlpha *= p; holo(ctx, x - tw / 2, y - 34, tw, 68, { color: k % 2 ? C.yellow : C.orange, corners: k === 8 });
      neonText(ctx, nm, x, y + 1, { size: nm.length > 22 ? 25 : 29, weight: 800, align: 'center', glow: k % 2 ? C.yellow : C.orange }); ctx.restore(); });
    EGGS.forEach(([f, x, y], k) => { const p = P(t, T_W3 + 1.2 + k * .45, .5); if (p > 0) formula(ctx, f, x, y + Math.sin(t * 1.2 + k) * 6, { neon: true, size: 18, alpha: p, rot: (k % 2 ? .03 : -.03) }); });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      const z = P(t, T_ZOOM, 2.6, E.inOutCubic);
      if (z <= 0) { compose(ctx, t); scanlines(ctx, .07 * P(t, T_W3, .8)); return; }
      // mosaico infinito: compõe uma vez, reduz, repete
      compose(octx, t); mctx.drawImage(OFF, 0, 0, 480, 270);
      ctx.fillStyle = '#0B0807'; ctx.fillRect(0, 0, W, H);
      const s = lerp(1, .16, z), tw = W * s, th = H * s, gap = 18 * z, rot = z * .05;
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rot);
      const nx = Math.ceil((W * .75) / (tw + gap)) + 1, ny = Math.ceil((H * .75) / (th + gap)) + 1;
      for (let j = -ny; j <= ny; j++) for (let i = -nx; i <= nx; i++) {
        const x = i * (tw + gap) - tw / 2, y = j * (th + gap) - th / 2, d = Math.hypot(i, j);
        if (d === 0) { ctx.drawImage(z < .35 ? OFF : MINI, x, y, tw, th); continue; }
        ctx.globalAlpha = clamp(z * 3) * clamp(1 - d * .12); if (ctx.globalAlpha <= 0) continue;
        ctx.drawImage(MINI, x, y, tw, th); ctx.globalAlpha = 1;
      }
      ctx.restore();
      ctx.save(); ctx.globalAlpha = .5 * z; vignette(ctx, .9); ctx.restore();
      const inf = P(t, T_INF, .8, E.outCubic);
      if (inf > 0) { ctx.save(); ctx.globalAlpha = inf; glow(ctx, W / 2, H / 2, 520, C.orange, .5); neonText(ctx, '∞', W / 2, H / 2 - 10, { size: lerp(180, 300, inf), weight: 300, align: 'center', blur: 30 }); ctx.restore(); }
      scanlines(ctx, .07);
      flash(ctx, P(t, T_FLASH, .3) * (1 - P(t, T_FLASH + .3, .2)) + P(t, T_FLASH, .45), C.cream);
    }
  };
})();
