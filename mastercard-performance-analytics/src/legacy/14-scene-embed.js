/* ---------------------------------------------------------------------------
   CENA 6 — CASO 03 · PRINCIPALIDADE / EMBEDDINGS (2:02–2:32)
   Prateleira de produtos (itens isolados) → produto = vetor → decolagem para
   espaço 3D → clusters por afinidade → cos θ → trilha até o núcleo de principalidade
   --------------------------------------------------------------------------- */
(() => {
  const id = 'embed';
  const FAM = [
    { name: 'Dia a dia', col: C.yellow, c: [-1.0, -.25, .25], items: [['Conta digital', 'bank'], ['Conta salário', 'bank'], ['Pix', 'pix'], ['Cartão de débito', 'card'], ['Cartão de crédito', 'card'], ['Débito automático', 'clock'], ['Cashback', 'spark']] },
    { name: 'Investimentos', col: C.orange, c: [1.0, -.4, -.25], items: [['CDB', 'coin'], ['LCI', 'coin'], ['LCA', 'coin'], ['Tesouro Direto', 'chart'], ['Poupança', 'coin'], ['Fundos', 'trend'], ['Previdência', 'shield']] },
    { name: 'Crédito', col: C.red, c: [.25, .85, .55], items: [['Crédito pessoal', 'gauge'], ['Consignado', 'doc'], ['Cheque especial', 'gauge'], ['Financ. imobiliário', 'house'], ['Financ. de veículo', 'car'], ['Consórcio', 'doc']] },
    { name: 'Proteção', col: '#E9DCC8', c: [-.55, .55, -.95], items: [['Seguro de vida', 'umbrella'], ['Seguro residencial', 'house'], ['Seguro cartão', 'shield'], ['Capitalização', 'coin']] }
  ];
  const r = rng(606), g = () => { let s = 0; for (let i = 0; i < 4; i++) s += r(); return (s - 2) / .58; };
  const PROD = [];
  FAM.forEach((f, fi) => f.items.forEach(([name, ic]) => PROD.push({ name, ic, fi, col: f.col, p: [f.c[0] + g() * .26, f.c[1] + g() * .22, f.c[2] + g() * .26],
    vec: Array.from({ length: 4 }, () => (r() * 2 - 1)) })));
  // ordem embaralhada na prateleira (itens isolados, sem relação aparente)
  const SHELF = PROD.map((_, i) => i).sort((a, b) => hash(a * 7 + 1) - hash(b * 7 + 1));
  const byName = n => PROD.findIndex(p => p.name === n);
  const TRAIL = ['Conta digital', 'Pix', 'Cartão de crédito', 'Cashback', 'CDB', 'Previdência'].map(byName);
  const CORE = [.05, -.32, .0];
  const DUST = Array.from({ length: 140 }, (_, i) => [hash(i) * 2 - 1, hash(i + 300) * 2 - 1, hash(i + 600) * 2 - 1]);
  // ---- tempos ----
  const T_SHELF = 3.4, T_FLIP = 6.0, T_DARK = 9.0, T_DOT = 9.6, T_LIFT = 10.6, T_AX = 13.0, T_CL = 15.2, T_COS1 = 17.5, T_COS2 = 19.6, T_TRAIL = 21.8, T_CORE = 25.4, T_STAMP = CONFIG.caseDone.embed, T_OUT = 29.2;
  const TW = 250, TH = 116, GX = 20, GY = 22, SX0 = (W - (6 * TW + 5 * GX)) / 2, SY0 = 330;
  const slot = k => ({ x: SX0 + (k % 6) * (TW + GX), y: SY0 + Math.floor(k / 6) * (TH + GY) });
  // ---- cues ----
  cue(id, .3, 'pop', { p: 1.2 }); for (let k = 0; k < 8; k++) cue(id, T_SHELF + k * .2, 'tick', { f: 1600 + k * 90, v: .1 });
  for (let k = 0; k < 12; k++) cue(id, T_FLIP + k * .2, 'tick', { f: 2600 + (k % 4) * 200, v: .1 }); cue(id, 7.0, 'chime', { f: 880 });
  cue(id, T_DARK, 'swell', { dur: 1.5 }); cue(id, T_LIFT, 'whoosh', { dur: 2.2, v: .55 }); cue(id, T_LIFT + 2, 'impact', { size: .35 });
  cue(id, T_CL, 'shimmer', { dur: 2 }); FAM.forEach((_, k) => cue(id, T_CL + .7 + k * .3, 'chime', { f: 1046 + k * 120, up: 4 }));
  cue(id, T_COS1 + .6, 'ping', { f: 1760 }); cue(id, T_COS2 + .6, 'ping', { f: 988 });
  TRAIL.forEach((_, k) => cue(id, T_TRAIL + k * .55, 'ping', { f: 1046 * Math.pow(2, k * 2 / 12) })); cue(id, T_CORE, 'ding'); cue(id, T_CORE, 'impact', { size: .4 });
  cue(id, T_STAMP, 'impact', { size: .6 }); cue(id, T_STAMP, 'combo'); cue(id, T_OUT, 'riser', { dur: .8, v: .3 });

  // ---- projeção 3D ----
  const ang = t => .26 * (Math.min(t, 21) - 11) + .09 * Math.max(0, t - 21);
  function proj(p, t, cx = W / 2, cy = 600) {
    const a = ang(t), b = .32, x = p[0] * Math.cos(a) - p[2] * Math.sin(a), z = p[0] * Math.sin(a) + p[2] * Math.cos(a);
    const y = p[1] * Math.cos(b) - z * Math.sin(b), z2 = p[1] * Math.sin(b) + z * Math.cos(b), s = 3.4 / (z2 + 4.4);
    return { x: cx + x * s * 520, y: cy + y * s * 520, s, z: z2 };
  }
  const vecStr = (p, t, settle) => '[' + p.vec.map((v, i) => { const vv = t < settle ? hash(i + Math.floor(t * 14) + p.p[0] * 99) * 2 - 1 : v; return (vv < 0 ? '−' : '') + Math.abs(vv).toFixed(2); }).join(', ') + ', …]';

  SCENES[id] = {
    themeAt: t => (t < 9.8 || t > T_OUT + .4 ? 'light' : 'dark'),
    draw(ctx, t) {
      bgLight(ctx, t, { drift: 6 });
      const dk = P(t, T_DARK, 1.5, E.inOutCubic);
      if (dk > 0) { ctx.save(); ctx.globalAlpha = dk; bgDark(ctx, t, { base: C.night, center: '#1C2436', centerA: .9, grid: false }); ctx.restore();
        DUST.forEach((d, i) => { const q = proj([d[0] * 2.4, d[1] * 1.6, d[2] * 2.4], t); circle(ctx, q.x, q.y, 1.3 * q.s, rgba('#FFFFFF', .25 * dk * clamp(q.s - .4))); });
        neonGrid(ctx, t, { horizon: 905, alpha: dk * .4 * (1 - P(t, T_OUT, .3)), speed: .4 }); }
      else collage(ctx, t, { seed: 41, n: 6, alpha: 1 - P(t, T_SHELF, .6) });
      // card
      if (t < T_SHELF + .2) { const sc = E.outBack(P(t, .05, .45)), out = P(t, T_SHELF - .3, .4);
        questionCard(ctx, W / 2, H / 2, Q('embed'), { tag: 'ISSUER', scale: lerp(1.6, 1.25, sc) * (1 - out * .3), alpha: 1 - out, w: 640, h: 240 }); }
      caseHeader(ctx, t - T_SHELF, TX.cases.embed, { theme: t < 9.8 ? 'light' : 'dark', out: T_OUT - T_SHELF - .3 });
      if (t > T_SHELF + 1.2 && t < T_DARK + .4) text(ctx, 'itens isolados', SX0, SY0 - 34, { size: 20, weight: 700, mono: true, color: C.stone, alpha: win(t, T_SHELF + 1.2, T_FLIP, .4, .4), ls: 2 });
      if (t > T_FLIP + 1) formula(ctx, 'e = f(produto) ∈ ℝ¹²⁸', 1690, 258, { size: 22, rot: .03, seed: 8, alpha: win(t, T_FLIP + 1, T_DARK + .6, .3, .4), scale: E.outBack(P(t, T_FLIP + 1, .4)) });
      if (t > 7) kinetic(ctx, 'produto → *vetor*', W / 2 + 260, 250, t - 7, { size: 54, color: mix(C.ink, C.cream, dk), out: 3.0 });
      if (t > T_CL + .1) kinetic(ctx, 'proximidade = *afinidade*', W - 80, 250, t - T_CL - .1, { size: 48, align: 'right', color: C.cream, out: T_TRAIL - T_CL });
      // ---- prateleira → vetores → pontos ----
      const lift = t >= T_LIFT;
      const pts = PROD.map((p, i) => {
        const k = SHELF.indexOf(i), sl = slot(k), cx = sl.x + TW / 2, cy = sl.y + TH / 2, q = proj(p.p, t);
        const lp = P(t, T_LIFT + k * .035, 1.4, E.inOutCubic);
        return { p, i, k, sl, cx, cy, q, lp, x: lerp(cx, q.x, lp), y: lerp(cy, q.y, lp) };
      });
      if (t < T_DOT + 1.1) pts.forEach(o => {
        const a = E.outBack(P(t, T_SHELF + o.k * .05, .4)); if (a <= 0) return;
        const fl = P(t, T_FLIP + o.k * .1, .35), shrink = P(t, T_DOT + o.k * .02, .7, E.inCubic);
        const flipS = Math.abs(Math.cos(fl * Math.PI)), back = fl > .5;
        const w = lerp(TW, 18, shrink), h = lerp(TH, 18, shrink);
        ctx.save(); ctx.translate(o.cx, o.cy); ctx.scale(a * (shrink > 0 ? 1 : flipS), a);
        const dark = back && shrink < .5; rr(ctx, -w / 2, -h / 2, w, h, lerp(16, 9, shrink));
        ctx.fillStyle = shrink > 0 ? mix(dark ? C.ink2 : '#FFFFFF', o.p.col, shrink) : (dark ? C.ink2 : '#FFFFFF'); ctx.fill();
        if (shrink < .3) { ctx.globalAlpha *= 1 - shrink * 3;
          if (!back) { icon(ctx, o.p.ic, -w / 2 + 40, 0, 38, C.ink); text(ctx, o.p.name, -w / 2 + 74, 0, { size: 21, weight: 700, color: C.ink }); }
          else { text(ctx, o.p.name, -w / 2 + 18, -h / 2 + 26, { size: 15, weight: 700, color: o.p.col }); text(ctx, vecStr(o.p, t, T_FLIP + o.k * .1 + .7), -w / 2 + 18, 14, { size: 17, weight: 600, mono: true, color: C.cream }); } }
        ctx.restore();
      });
      if (t >= T_DOT + .5) {
        // eixos
        const ax = P(t, T_AX, .8);
        if (ax > 0) { const o = proj([0, 0, 0], t); [[1.4, 0, 0, 'dim 1'], [0, -1.1, 0, 'dim 2'], [0, 0, 1.4, 'dim 3']].forEach(([a, b, c, lb]) => { const e = proj([a * ax, b * ax, c * ax], t);
          line(ctx, o.x, o.y, e.x, e.y, rgba(C.cream, .18), 2); text(ctx, lb, e.x + 8, e.y, { size: 16, weight: 600, mono: true, color: C.stone, alpha: ax }); });
          text(ctx, '… dim 128', W - 80, H - 80, { size: 20, weight: 600, mono: true, color: C.stone, align: 'right', alpha: ax * (1 - P(t, T_OUT, .3)) }); }
        // halos dos clusters
        const cl = P(t, T_CL, 1.2);
        if (cl > 0) FAM.forEach((f, k) => { const q = proj(f.c, t); glow(ctx, q.x, q.y, 300 * q.s, f.col, .3 * cl);
          const la = P(t, T_CL + .7 + k * .3, .4); if (la > 0) pill(ctx, q.x, q.y - 165 * q.s, f.name, { size: 22, fill: rgba(f.col, .9), color: k === 3 ? C.ink : (k === 0 ? C.ink : '#FFF'), alpha: la * (1 - P(t, T_OUT, .3)), scale: E.outBack(la) }); });
        // pontos (ordenados por profundidade)
        pts.slice().sort((a, b) => b.q.z - a.q.z).forEach(o => {
          if (o.lp > 0 && o.lp < 1) { const pk = Math.max(0, o.lp - .12), px = lerp(o.cx, o.q.x, pk), py = lerp(o.cy, o.q.y, pk); line(ctx, px, py, o.x, o.y, rgba(o.p.col, .5), 3); }
          const sz = lerp(9, 9 * o.q.s * 1.5, o.lp), al = lerp(1, clamp(.35 + (o.q.s - .55) * 1.4), o.lp);
          glow(ctx, o.x, o.y, sz * 4, o.p.col, .5 * al); circle(ctx, o.x, o.y, sz, rgba(o.p.col, Math.max(al, .5)));
          if (cl > 0) text(ctx, o.p.name, o.x + sz + 8, o.y - sz - 4, { size: 16, weight: 600, color: C.cream, alpha: cl * al * .85 * (1 - P(t, T_OUT, .3)) });
        });
        // cos θ
        const cosDraw = (t0, a, b, label) => { const v = win(t, t0, t0 + 2.2, .5, .4); if (v <= 0) return; const o = proj([0, 0, 0], t), pa = proj(PROD[a].p, t), pb = proj(PROD[b].p, t);
          [pa, pb].forEach(pp => { const k = P(t, t0, .5, E.outCubic); line(ctx, o.x, o.y, lerp(o.x, pp.x, k), lerp(o.y, pp.y, k), rgba(C.cream, .8 * v), 3); });
          const a1 = Math.atan2(pa.y - o.y, pa.x - o.x), a2 = Math.atan2(pb.y - o.y, pb.x - o.x); ctx.beginPath(); ctx.arc(o.x, o.y, 70, Math.min(a1, a2), Math.max(a1, a2)); ctx.strokeStyle = rgba(C.yellow, v); ctx.lineWidth = 3; ctx.stroke();
          circle(ctx, o.x, o.y, 6, rgba(C.cream, v)); pill(ctx, o.x + 40, o.y + 70, label, { size: 22, fill: rgba(C.ink, .85), stroke: rgba(C.yellow, .6), color: C.yellow, alpha: v }); };
        cosDraw(T_COS1, byName('CDB'), byName('LCI'), 'cos θ = 0.94 · alta afinidade');
        cosDraw(T_COS2, byName('Cashback'), byName('Consignado'), 'cos θ = 0.12 · baixa afinidade');
        // trilha do cliente → núcleo de principalidade
        if (t > T_TRAIL) {
          const nodes = TRAIL.map(i => proj(PROD[i].p, t)).concat([proj(CORE, t)]), prog = (t - T_TRAIL) / .55;
          ctx.save(); ctx.beginPath(); nodes.forEach((n, k) => { if (k <= prog) ctx.lineTo(n.x, n.y); });
          const seg = Math.floor(prog); if (seg < nodes.length - 1) { const f = prog - seg; ctx.lineTo(lerp(nodes[seg].x, nodes[seg + 1].x, f), lerp(nodes[seg].y, nodes[seg + 1].y, f)); }
          ctx.strokeStyle = rgba(C.orange, .95); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
          nodes.forEach((n, k) => { if (k < prog && k < nodes.length - 1) circle(ctx, n.x, n.y, 12, null, C.orange, 3); });
          const hk = Math.min(prog, nodes.length - 1), hs = Math.floor(hk), hf = hk - hs, hx = hs < nodes.length - 1 ? lerp(nodes[hs].x, nodes[hs + 1].x, hf) : nodes[hs].x, hy = hs < nodes.length - 1 ? lerp(nodes[hs].y, nodes[hs + 1].y, hf) : nodes[hs].y;
          glow(ctx, hx, hy, 60, '#FFF', .8); agentDot(ctx, hx, hy);
        }
        const cp = P(t, T_CORE, .8);
        if (cp > 0) { const q = proj(CORE, t), pu = (t * 1.2) % 1; glow(ctx, q.x, q.y, 220 * cp, C.orange, .8); circle(ctx, q.x, q.y, 18 * E.outBack(cp), '#FFF2E0');
          circle(ctx, q.x, q.y, 30 + pu * 90, null, rgba(C.orange, (1 - pu) * cp), 3);
          pill(ctx, q.x, q.y + 70, 'núcleo de principalidade', { size: 24, fill: C.orange, color: '#FFF', alpha: cp * (1 - P(t, T_OUT, .2)), scale: E.outBack(cp) }); }
      }
      // treino: gradiente descendente + InfoNCE (HUD)
      const gd = win(t, T_LIFT + .2, T_CL + 2.8, .4, .5);
      if (gd > 0) { holo(ctx, 60, 742, 580, 268, { title: 'TREINO · GRADIENTE DESCENDENTE', alpha: gd });
        ctx.save(); ctx.globalAlpha *= gd; VIZ.gradient(ctx, 82, 786, 250, 205, P(t, T_LIFT + .4, 4.8), { t, theme: 'dark' });
        neonText(ctx, 'θ ← θ − η ∇L(θ)', 360, 812, { size: 21, mono: true, weight: 600 }); text(ctx, 'InfoNCE', 360, 862, { size: 16, weight: 700, mono: true, color: C.stone, ls: 2 });
        neonText(ctx, 'L = −log softmax(s⁺/τ)', 360, 894, { size: 18, mono: true, weight: 600, glow: C.yellow });
        text(ctx, 'época ' + String(Math.min(40, 1 + Math.floor(P(t, T_LIFT + .4, 4.8) * 39))).padStart(2, '0') + '/40', 360, 950, { size: 18, weight: 700, mono: true, color: C.sand }); ctx.restore(); }
      const cf = win(t, T_COS1 + .3, T_TRAIL + .2, .4, .4);
      if (cf > 0) formula(ctx, 'd_cos(a,b) = 1 − a·b / (‖a‖ ‖b‖)', 430, 334, { neon: true, size: 22, rot: -.015, alpha: cf });
      if (t > T_TRAIL) formula(ctx, 'UMAP · 128D → 3D', W - 210, H - 150, { neon: true, size: 18, alpha: win(t, T_TRAIL, T_OUT, .4, .3) });
      if (dk > 0) scanlines(ctx, .08 * dk);
      stamp(ctx, W / 2, 960, TX.cases.embed.stamp, P(t, T_STAMP, 1.1) * (1 - P(t, T_OUT, .3)), { theme: 'dark' });
      // saída: núcleo cresce até preencher a tela (creme)
      const out = P(t, T_OUT, .8, E.inExpo);
      if (out > 0) { const q = proj(CORE, t); circle(ctx, q.x, q.y, lerp(20, 2300, out), C.cream); }
    }
  };
  /** cabeça da trilha: pequeno cliente luminoso */
  function agentDot(ctx, x, y) { circle(ctx, x, y, 16, C.cream); icon(ctx, 'user', x, y, 20, C.ink, 9); }
})();
