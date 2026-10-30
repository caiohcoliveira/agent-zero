/* ---------------------------------------------------------------------------
   CENA 5 — CASO 02 · RECOMENDAÇÃO / ALS (1:26–2:02)  ★ ponto alto didático
   Matriz cliente×SKU esparsa → R ≈ U·Vᵀ → alternância do ALS (erro cai)
   → recombinação (lacunas viram propensões) → espaço latente → cesta
   --------------------------------------------------------------------------- */
(() => {
  const id = 'als', NR = 8, NC = 12, K = 3, PITCH = 64, CELL = 56;
  const X0 = W / 2 - NC * PITCH / 2, Y0 = 590 - NR * PITCH / 2;
  const FC = [C.red, C.orange, C.yellow];
  const SKU = ['bottle', 'box', 'can', 'cup', 'bag', 'jar', 'carton', 'tube', 'bottle', 'box', 'can', 'cup'];
  // ---- fatores latentes com estrutura (3 "gostos") ----
  const r = rng(505), grp = i => (i < 3 ? 0 : i < 6 ? 1 : 2), pgrp = j => Math.floor(j / 4);
  const Uf = Array.from({ length: NR }, (_, i) => Array.from({ length: K }, (_, k) => clamp((k === grp(i) ? .82 : .12) + (r() - .5) * .3, .02, 1)));
  const Vf = Array.from({ length: NC }, (_, j) => Array.from({ length: K }, (_, k) => clamp((k === pgrp(j) ? .85 : .1) + (r() - .5) * .3, .02, 1)));
  const U0 = Uf.map(row => row.map(() => r())), V0 = Vf.map(row => row.map(() => r()));
  const S = Uf.map(u => Vf.map(v => u.reduce((a, x, k) => a + x * v[k], 0))), smax = Math.max(...S.flat());
  const SN = S.map(row => row.map(v => v / smax));
  const OBS = SN.map((row, i) => row.map((v, j) => (v > .5 && hash(i * 31 + j * 7) < .5) || hash(i * 13 + j * 17 + 3) < .06));
  const OBS_LIST = []; OBS.forEach((row, i) => row.forEach((o, j) => { if (o) OBS_LIST.push([i, j]); }));
  OBS_LIST.sort((a, b) => hash(a[0] * 12 + a[1]) - hash(b[0] * 12 + b[1]));
  const STARS = SN.map((row, i) => row.map((v, j) => [v, j]).filter(([, j]) => !OBS[i][j]).sort((a, b) => b[0] - a[0]).slice(0, 2).map(a => a[1]));
  // ---- tempos ----
  const T_GRID = 3.2, T_BUY = 5.0, T_ROW = 7.9, T_COL = 9.0, T_Q = 10.4, T_SPLIT = 13.0, T_ALS = 15.4, T_BACK = 22.0, T_SWEEP = 22.8, T_STAR = 24.4;
  const T_LAT = 27.0, T_PICK = 28.8, T_BASK = 31.8, T_DELIV = 32.8, T_STAMP = 33.8;
  const HALF = [1.2, 1.2, .9, .9, .6, .6, .45, .45], HT = HALF.reduce((a, d, i) => (a.push((a[i - 1] || T_ALS) + (i ? HALF[i - 1] : 0)), a), []).map((v, i) => i === 0 ? T_ALS : v);
  // ---- cues ----
  cue(id, .2, 'whoosh', { dur: .4, v: .3 }); cue(id, .35, 'impact', { size: .3 }); cue(id, 3.0, 'glitch'); cue(id, 3.0, 'whoosh', { dur: .5, v: .35 });
  for (let k = 0; k < 6; k++) cue(id, T_GRID + .3 + k * .25, 'tick', { f: 1200 + k * 120, v: .1 });
  OBS_LIST.forEach(([i, j], k) => { if (k % 2 === 0) cue(id, T_BUY + k * .13, 'tick', { f: 2400 + (k % 5) * 160, v: .12 }); });
  cue(id, T_ROW, 'whoosh', { dur: .4, v: .2 }); cue(id, T_COL, 'whoosh', { dur: .4, v: .2 }); cue(id, T_Q + .8, 'glitch');
  cue(id, T_SPLIT, 'whoosh', { dur: 1.2, v: .45 }); cue(id, T_SPLIT + 1.2, 'impact', { size: .5 });
  HT.forEach((t, h) => { cue(id, t, 'tick', { f: h % 2 ? 1500 : 2100, v: .25 }); });
  cue(id, T_BACK, 'whoosh', { dur: .8, dir: 'down', v: .35 }); cue(id, T_SWEEP, 'shimmer', { dur: 1.5 }); cue(id, T_SWEEP, 'riser', { dur: 1.4, v: .18 });
  STARS.forEach((_, i) => cue(id, T_STAR + i * .16, 'pop', { p: 1 + i * .1, v: .18 }));
  cue(id, T_LAT, 'whoosh', { dur: 1.2, v: .4 }); cue(id, T_PICK, 'ping', { f: 1568 }); [0, 1, 2].forEach(k => cue(id, T_PICK + .4 + k * .25, 'ping', { f: 1760 + k * 200 }));
  cue(id, T_BASK, 'whoosh', { dur: .6, v: .3 }); cue(id, T_DELIV + .55, 'ding'); cue(id, T_STAMP, 'impact', { size: .6 }); cue(id, T_STAMP, 'combo');

  // ---- espaço latente (projeção 2D dos 3 fatores) ----
  const DIR = [[-1, -.55], [1, -.55], [0, 1]], LC = { x: W / 2, y: 600 };
  const latent = (f, seed, spread = 470) => { const s = f.reduce((a, b) => a + b, 0); let x = 0, y = 0; f.forEach((v, k) => { x += v / s * DIR[k][0]; y += v / s * DIR[k][1]; });
    return { x: LC.x + x * spread + (hash(seed) - .5) * 230, y: LC.y + y * spread * .6 + (hash(seed + 9) - .5) * 150 }; };
  const LCLI = Uf.map((u, i) => latent(u, i + 1, 430)), LPRO = Vf.map((v, j) => latent(v, j + 50, 520));
  const HERO = 4, PICKS = SN[HERO].map((v, j) => [v, j]).sort((a, b) => b[0] - a[0]).slice(0, 3).map(a => a[1]);

  function cellRect(i, j, R) { return { x: R.x + j * PITCH * R.s + (PITCH - CELL) / 2 * R.s, y: R.y + i * PITCH * R.s + (PITCH - CELL) / 2 * R.s, w: CELL * R.s, h: CELL * R.s }; }
  /** valores de U/V durante a alternância (convergem a cada meia-rodada ativa) */
  function factorVals(t, isU) {
    let k = 0; HT.forEach((ht, h) => { if (t >= ht + HALF[h] * .5 && (h % 2 === 0) === isU) k++; });
    const conv = 1 - Math.pow(.42, k), A = isU ? U0 : V0, B = isU ? Uf : Vf;
    return A.map((row, i) => row.map((v, q) => lerp(v, B[i][q], conv)));
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .7, center: '#2A211B' });
      const split = P(t, T_SPLIT, 1.4, E.inOutCubic), back = P(t, T_BACK, .8, E.inOutCubic), lat = P(t, T_LAT, 1.2, E.inOutCubic);
      const mergeK = split * (1 - back);
      const RS = { x: lerp(X0, 90, mergeK), y: lerp(Y0, 590 - NR * PITCH * .55 / 2, mergeK), s: lerp(1, .55, mergeK) };
      const UP = { x: 640, y: 590 - NR * 52 / 2, p: 52 }, VP = { x: 900, y: 590 - K * 52 / 2, p: 52 };
      const matA = (1 - mergeK * .55) * (1 - P(t, T_LAT, .7));
      // ---------- card + estilhaço ----------
      if (t < 3.4) { const sc = E.outBack(P(t, .05, .45)), sh = P(t, 3.0, .4);
        questionCard(ctx, W / 2, H / 2, TX.questions[1], { theme: 'dark', tag: 'VAREJO', scale: lerp(1.6, 1.25, sc) * (1 + sh * .2), alpha: 1 - sh, w: 640, h: 240 }); }
      if (t >= 3.0 && t < 4.2) { const k = P(t, 3.0, 1.0, E.outCubic); for (let n = 0; n < 24; n++) { const i = n % NR, j = (n * 5) % NC, c = cellRect(i, j, { x: X0, y: Y0, s: 1 });
        const sx = W / 2 + (hash(n) - .5) * 600, sy = H / 2 + (hash(n + 3) - .5) * 220; rr(ctx, lerp(sx, c.x, k), lerp(sy, c.y, k), CELL, CELL, 8); ctx.fillStyle = rgba(C.cream, .5 * (1 - k)); ctx.fill(); } }
      caseHeader(ctx, t - 3.4, TX.case2, { theme: 'dark', out: 35 - 3.4 });
      // ---------- matriz R ----------
      if (t >= T_GRID && matA > 0) {
        ctx.save(); ctx.globalAlpha = matA;
        for (let i = 0; i < NR; i++) for (let j = 0; j < NC; j++) {
          const a = P(t, T_GRID + (i + j) * .035, .3); if (a <= 0) continue; const c = cellRect(i, j, RS);
          const sweep = clamp((t - T_SWEEP) * 1.6 - (i + j) / (NR + NC) * 1.4);
          rr(ctx, c.x, c.y, c.w, c.h, 8 * RS.s); ctx.fillStyle = sweep > 0 ? heat(SN[i][j] * E.outCubic(sweep)) : '#262220'; ctx.globalAlpha = matA * a; ctx.fill();
          const ob = OBS[i][j], k = OBS_LIST.findIndex(q => q[0] === i && q[1] === j), bt = T_BUY + k * .13;
          if (ob && t > bt) { const bp = E.outBack(P(t, bt, .3)); circle(ctx, c.x + c.w / 2, c.y + c.h / 2, c.w * .22 * bp, sweep > 0 ? null : C.yellow, sweep > 0 ? '#FFF' : null, 3); if (sweep <= 0) glow(ctx, c.x + c.w / 2, c.y + c.h / 2, c.w * .7, C.yellow, .35 * (1 - P(t, bt, 1))); }
          if (!ob && t > T_Q && t < T_SPLIT + .4 && sweep <= 0) { const fl = .25 + .35 * (hash(i * 12 + j + Math.floor(t * 8)) > .5); text(ctx, '?', c.x + c.w / 2, c.y + c.h / 2 + 2, { size: 30 * RS.s, weight: 800, color: C.stone, align: 'center', alpha: fl * P(t, T_Q, .4) * (1 - P(t, T_SPLIT, .4)) }); }
          if (STARS[i].includes(j) && t > T_STAR) { const sp = E.outBack(P(t, T_STAR + i * .16, .4)); glow(ctx, c.x + c.w / 2, c.y + c.h / 2, c.w, '#FFF', .4 * sp); icon(ctx, 'spark', c.x + c.w / 2, c.y + c.h / 2, c.w * .6 * sp, '#FFF'); }
        }
        // destaques de linha/coluna
        const rowA = win(t, T_ROW, T_COL + .4, .3, .4), colA = win(t, T_COL, T_Q + .2, .3, .4);
        if (rowA > 0) { rr(ctx, RS.x - 6, RS.y + 2 * PITCH * RS.s - 2, NC * PITCH * RS.s + 6, PITCH * RS.s, 12); ctx.strokeStyle = rgba(C.orange, rowA); ctx.lineWidth = 4; ctx.globalAlpha = matA; ctx.stroke(); text(ctx, 'cliente', RS.x + NC * PITCH * RS.s + 24, RS.y + 2.5 * PITCH * RS.s, { size: 26, weight: 700, color: C.orange, alpha: rowA }); }
        if (colA > 0) { rr(ctx, RS.x + 5 * PITCH * RS.s + 2, RS.y - 6, PITCH * RS.s - 4, NR * PITCH * RS.s + 6, 12); ctx.strokeStyle = rgba(C.yellow, colA); ctx.lineWidth = 4; ctx.globalAlpha = matA; ctx.stroke(); text(ctx, 'produto (SKU)', RS.x + 5.5 * PITCH * RS.s, RS.y + NR * PITCH * RS.s + 34, { size: 26, weight: 700, color: C.yellow, align: 'center', alpha: colA }); }
        ctx.restore();
        if (t > T_STAR + .3 && t < T_LAT + .3) text(ctx, 'lacunas → propensões', X0 + NC * PITCH / 2, Y0 + NR * PITCH + 50, { size: 32, weight: 800, color: C.orange, align: 'center', alpha: win(t, T_STAR + .3, T_LAT + .3, .4, .3) });
      }
      // ---------- avatares (clientes) e SKUs — viram pontos no espaço latente ----------
      for (let i = 0; i < NR; i++) {
        const a = E.outBack(P(t, T_GRID + .2 + i * .06, .35)); if (a <= 0) continue;
        const gx = RS.x - 46 * RS.s, gy = RS.y + (i + .5) * PITCH * RS.s, L = LCLI[i];
        let x = lerp(gx, L.x, lat), y = lerp(gy, L.y, lat); const hero = i === HERO && t > T_PICK;
        if (hero) { const pull = P(t, T_PICK + 1.2, 1.4, E.inOutCubic), c = PICKS.reduce((acc, j) => [acc[0] + LPRO[j].x / 3, acc[1] + LPRO[j].y / 3], [0, 0]); x = lerp(x, lerp(L.x, c[0], .45), pull); y = lerp(y, lerp(L.y, c[1], .45), pull); glow(ctx, x, y, 90, C.orange, .6); }
        const rad = lerp(20 * RS.s, hero ? 36 : 27, lat) * a;
        circle(ctx, x, y, rad, lat > .5 ? mix('#3A3532', FC[grp(i)], .55) : '#3A3532', rgba(C.cream, .5), 2); icon(ctx, 'user', x, y, rad * 1.3, C.cream, 9);
        if (hero && t < T_BASK + 1) PICKS.forEach((j, k) => { const lp = P(t, T_PICK + .4 + k * .25, .4, E.outCubic); if (lp > 0) line(ctx, x, y, lerp(x, LPRO[j].x, lp), lerp(y, LPRO[j].y, lp), rgba(C.orange, .8), 3); });
      }
      for (let j = 0; j < NC; j++) {
        const a = E.outBack(P(t, T_GRID + .3 + j * .05, .35)); if (a <= 0) continue;
        const gx = RS.x + (j + .5) * PITCH * RS.s, gy = RS.y - 44 * RS.s, L = LPRO[j], picked = PICKS.includes(j);
        let x = lerp(gx, L.x, lat), y = lerp(gy, L.y, lat), s = lerp(34 * RS.s, 46, lat) * a, al = 1;
        if (picked && t > T_BASK) { const bp = P(t, T_BASK + PICKS.indexOf(j) * .12, .6, E.inOutCubic); const bx = LCLI[HERO].x + 150, by = LCLI[HERO].y - 120; x = lerp(x, bx, bp); y = lerp(y, by, bp); s *= lerp(1, .5, bp); al = 1 - P(t, T_DELIV - .1, .2); }
        if (al <= 0) continue;
        ctx.save(); ctx.globalAlpha = al;
        if (lat > 0) { rr(ctx, x - s * .75, y - s * .75, s * 1.5, s * 1.5, s * .35); ctx.fillStyle = rgba(mix('#2A2622', FC[pgrp(j)], .6), lat); ctx.fill(); if (picked && t > T_PICK) { ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.stroke(); } }
        icon(ctx, SKU[j], x, y, s, lat > .5 ? '#FFF' : C.sand, 8); ctx.restore();
      }
      if (lat > 0) { // rótulos de grupo no espaço latente
        ctx.save(); ctx.globalAlpha = lat * .5; [180, 340, 500].forEach(rad => { ctx.beginPath(); ctx.ellipse(LC.x, LC.y, rad * 1.5, rad * .62, 0, 0, TAU); ctx.strokeStyle = 'rgba(245,241,234,.07)'; ctx.lineWidth = 2; ctx.setLineDash([4, 10]); ctx.stroke(); }); ctx.setLineDash([]); ctx.restore();
        ['gosto A', 'gosto B', 'gosto C'].forEach((g, k) => { const c = { x: LC.x + DIR[k][0] * 420, y: LC.y + DIR[k][1] * 420 * .6 }; glow(ctx, c.x, c.y, 330, FC[k], .16 * lat);
          text(ctx, g, c.x + (k === 2 ? 270 : DIR[k][0] * 300), c.y + (k === 2 ? 20 : 30), { size: 22, weight: 700, mono: true, color: FC[k], align: 'center', alpha: lat * .8 }); });
        text(ctx, 'espaço latente', W - 70, H - 70, { size: 24, weight: 700, mono: true, color: C.stone, align: 'right', alpha: lat * (1 - P(t, 35.2, .5)) });
      }
      // ---------- U e Vᵀ (fatoração + ALS) ----------
      if (mergeK > 0 && t < T_LAT) {
        const Uv = factorVals(t, true), Vv = factorVals(t, false);
        ctx.save(); ctx.globalAlpha = clamp(split * 1.6) * (1 - back);
        const h = HT.findIndex((ht, i) => t >= ht && t < ht + HALF[i]), active = t >= T_ALS && h >= 0 ? (h % 2 === 0 ? 'U' : 'V') : null;
        for (let i = 0; i < NR; i++) for (let k = 0; k < K; k++) { // U
          const from = cellRect(i, k * 4 + 1.5, { x: X0, y: Y0, s: 1 }), x = lerp(from.x, UP.x + k * UP.p, split), y = lerp(from.y, UP.y + i * UP.p, split), sz = lerp(CELL, UP.p - 6, split);
          rr(ctx, x, y, sz, sz, 7); ctx.fillStyle = mix('#262220', FC[k], clamp(Uv[i][k])); ctx.fill(); }
        for (let k = 0; k < K; k++) for (let j = 0; j < NC; j++) { // Vᵀ
          const from = cellRect(k * 2.5 + 1.5, j, { x: X0, y: Y0, s: 1 }), x = lerp(from.x, VP.x + j * VP.p, split), y = lerp(from.y, VP.y + k * VP.p, split), sz = lerp(CELL, VP.p - 6, split);
          rr(ctx, x, y, sz, sz, 7); ctx.fillStyle = mix('#262220', FC[k], clamp(Vv[j][k])); ctx.fill(); }
        const la = P(t, T_SPLIT + 1, .5);
        text(ctx, '≈', 560, 590, { size: 80, weight: 300, color: C.cream, align: 'center', alpha: la }); text(ctx, '×', 845, 590, { size: 64, weight: 300, color: C.cream, align: 'center', alpha: la });
        text(ctx, 'R', 90 + NC * PITCH * .55 / 2, 590 + NR * PITCH * .55 / 2 + 44, { size: 30, weight: 800, mono: true, color: C.sand, align: 'center', alpha: la });
        text(ctx, 'U', UP.x + 78, UP.y + NR * UP.p + 34, { size: 30, weight: 800, mono: true, color: active === 'U' ? C.orange : C.sand, align: 'center', alpha: la });
        text(ctx, 'clientes × fatores', UP.x + 78, UP.y + NR * UP.p + 68, { size: 20, weight: 600, color: C.stone, align: 'center', alpha: la });
        text(ctx, 'Vᵀ', VP.x + NC * VP.p / 2, VP.y - 34, { size: 30, weight: 800, mono: true, color: active === 'V' ? C.orange : C.sand, align: 'center', alpha: la });
        text(ctx, 'fatores × produtos', VP.x + NC * VP.p / 2, VP.y + K * VP.p + 34, { size: 20, weight: 600, color: C.stone, align: 'center', alpha: la });
        text(ctx, 'fatores latentes  ·  "gostos ocultos"', UP.x - 4, UP.y - 40, { size: 22, weight: 700, color: C.yellow, alpha: la });
        if (active) { const isU = active === 'U', bx = isU ? UP.x - 10 : VP.x - 10, by = isU ? UP.y - 10 : VP.y - 10, bw = isU ? K * UP.p + 14 : NC * VP.p + 14, bh = isU ? NR * UP.p + 14 : K * VP.p + 14;
          const hp = P(t, HT[h], HALF[h]); glow(ctx, bx + bw / 2, by + bh / 2, Math.max(bw, bh) * .8, C.orange, .25 * (1 - hp));
          rr(ctx, bx, by, bw, bh, 14); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.stroke();
          pill(ctx, 1200, 820, isU ? 'fixa V  →  resolve U' : 'fixa U  →  resolve V', { size: 26, fill: C.orange, color: '#FFF' }); }
        if (t >= T_ALS) { // curva de erro
          const lx = 1560, ly = 760, lw = 300, lh = 150; text(ctx, 'erro', lx, ly - 20, { size: 18, weight: 700, mono: true, color: C.stone });
          line(ctx, lx, ly + lh, lx + lw, ly + lh, rgba(C.cream, .2), 2); line(ctx, lx, ly, lx, ly + lh, rgba(C.cream, .2), 2);
          const n = HT.filter(ht => t >= ht).length; ctx.beginPath(); for (let k = 0; k <= n; k++) ctx.lineTo(lx + k / HALF.length * lw, ly + lh - lh * Math.pow(.62, k) * .95);
          ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.stroke(); circle(ctx, lx + n / HALF.length * lw, ly + lh - lh * Math.pow(.62, n) * .95, 7, C.yellow);
        }
        ctx.restore();
        const fa = win(t, T_SPLIT + .8, T_BACK + .4, .5, .4) * .55;
        text(ctx, 'R ≈ U · Vᵀ', W - 70, 170, { size: 40, weight: 700, mono: true, color: C.cream, align: 'right', alpha: fa * 1.4 });
        text(ctx, 'min Σ (r − uᵀv)² + λ(‖u‖² + ‖v‖²)', W - 70, 222, { size: 24, weight: 500, mono: true, color: C.sand, align: 'right', alpha: fa });
      }
      // ---------- cesta ----------
      if (t > T_BASK) {
        const L = LCLI[HERO], pull = P(t, T_PICK + 1.2, 1.4, E.inOutCubic), c = PICKS.reduce((acc, j) => [acc[0] + LPRO[j].x / 3, acc[1] + LPRO[j].y / 3], [0, 0]);
        const hx = lerp(L.x, lerp(L.x, c[0], .45), pull), hy = lerp(L.y, lerp(L.y, c[1], .45), pull);
        const dv = P(t, T_DELIV, .6, E.inOutCubic), bx = lerp(hx + 150, hx + 46, dv), by = lerp(hy - 120, hy - 40, dv), ba = E.outBack(P(t, T_BASK, .4));
        if (t > T_DELIV + .6) { const k = P(t, T_DELIV + .6, .8); circle(ctx, hx, hy, 40 + k * 120, null, rgba(C.yellow, 1 - k), 4); }
        circle(ctx, bx, by, 44 * ba, C.orange); icon(ctx, 'basket', bx, by + 2, 54 * ba, '#FFF', 8);
        if (t > T_DELIV + .6) pill(ctx, bx + 120, by - 40, 'cesta recomendada', { size: 22, fill: C.cream, color: C.ink, scale: E.outBack(P(t, T_DELIV + .6, .4)) });
      }
      stamp(ctx, W / 2, 960, TX.case2.stamp, P(t, T_STAMP, 1.1), { theme: 'dark' });
    }
  };
})();
