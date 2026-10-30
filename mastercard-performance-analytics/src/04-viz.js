/* ============================================================================
   4. VIZ — visualizações de modelos reutilizáveis (cenas 8, 9 e 10)
   Assinatura: VIZ.nome(ctx, x, y, w, h, p, o) — caixa (x,y,w,h), p = entrada 0..1,
   o = { t: tempo para movimento contínuo, theme: 'dark'|'light' }
   ========================================================================== */
const VIZ = (() => {
  const fg = o => (o.theme === 'light' ? C.ink : C.cream);
  const faint = o => (o.theme === 'light' ? 'rgba(20,20,20,.12)' : 'rgba(245,241,234,.14)');
  const U = (w, h) => Math.min(w, h) / 100; // unidade relativa
  const axes = (ctx, x, y, w, h, o, p = 1) => { line(ctx, x, y + h, x + w * p, y + h, faint(o), Math.max(1, U(w, h) * .5)); line(ctx, x, y + h, x, y + h - h * p, faint(o), Math.max(1, U(w, h) * .5)); };
  const pts = (seed, n, f) => { const r = rng(seed); return Array.from({ length: n }, (_, i) => f(r, i)); };
  const gauss = r => { let s = 0; for (let i = 0; i < 4; i++) s += r(); return (s - 2) / .58; };

  const V = {};

  V.gaussian = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h); axes(ctx, x, y, w, h, o, E.outCubic(clamp(p * 2)));
    const curve = []; const n = 80;
    for (let i = 0; i <= n; i++) { const z = (i / n) * 6 - 3; curve.push([x + (i / n) * w, y + h - Math.exp(-z * z / 2) * h * .86]); }
    const cut = Math.max(2, Math.round(n * E.inOutCubic(clamp(p * 1.4))));
    ctx.save(); ctx.beginPath(); smoothPath(ctx, curve.slice(0, cut + 1)); ctx.lineTo(curve[cut][0], y + h); ctx.lineTo(x, y + h); ctx.closePath();
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, rgba(C.orange, .55)); g.addColorStop(1, rgba(C.red, .05)); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); smoothPath(ctx, curve.slice(0, cut + 1)); ctx.strokeStyle = C.orange; ctx.lineWidth = u * 1.4; ctx.stroke(); ctx.restore();
    [[0, 'μ'], [-1, '−σ'], [1, '+σ'], [-2, '−2σ'], [2, '+2σ']].forEach(([z, lb], i) => {
      const a = clamp((p - .45 - i * .06) * 4); if (a <= 0) return; const sx = x + (z + 3) / 6 * w;
      line(ctx, sx, y + h, sx, y + h - Math.exp(-z * z / 2) * h * .86, rgba(z ? C.yellow : '#FFFFFF', a * (z ? .7 : .9)), u * .6, [u * 1.5, u * 1.5]);
      if (u > 1.4) text(ctx, lb, sx, y + h + u * 5, { size: u * 4.2, weight: 700, mono: true, color: fg(o), align: 'center', alpha: a * .8 });
    });
  };

  V.regression = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h); axes(ctx, x, y, w, h, o);
    const P0 = pts(11, 34, (r, i) => { const fx = (i + r()) / 34; return [fx, clamp(.18 + fx * .62 + gauss(r) * .08, .03, .97)]; });
    P0.forEach(([fx, fy], i) => { const a = clamp((p * 1.6 - i / 34 * .6) * 3); circle(ctx, x + fx * w, y + h - fy * h, u * 1.6 * a, rgba(fg(o), .85 * a)); });
    const lp = E.outExpo(clamp((p - .35) * 1.8));
    if (lp > 0) {
      const x1 = x, y1 = y + h - .18 * h, x2 = x + w * lp, y2 = y + h - (.18 + .62 * lp) * h;
      P0.forEach(([fx, fy]) => { if (fx > lp) return; const ly = y + h - (.18 + .62 * fx) * h; line(ctx, x + fx * w, y + h - fy * h, x + fx * w, ly, rgba(C.yellow, .35), u * .4); });
      glow(ctx, x2, y2, u * 10, C.orange, .7); line(ctx, x1, y1, x2, y2, C.orange, u * 1.4);
    }
  };

  V.classification = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), bd = fx => .5 + .28 * Math.sin(fx * 3.2 + .6);
    const P0 = pts(21, 46, r => { const fx = r(), fy = r(); return [fx, fy, fy > bd(fx) ? 1 : 0]; }).filter(q => Math.abs(q[1] - bd(q[0])) > .06);
    const bp = E.inOutCubic(clamp((p - .3) * 1.6));
    if (bp > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * bp, h); ctx.clip();
      ctx.beginPath(); ctx.moveTo(x, y); for (let i = 0; i <= 40; i++) ctx.lineTo(x + i / 40 * w, y + h - bd(i / 40) * h); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fillStyle = rgba(C.red, .1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x, y + h); for (let i = 0; i <= 40; i++) ctx.lineTo(x + i / 40 * w, y + h - bd(i / 40) * h); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fillStyle = rgba(C.yellow, .1); ctx.fill();
      ctx.beginPath(); for (let i = 0; i <= 40; i++) ctx.lineTo(x + i / 40 * w, y + h - bd(i / 40) * h); ctx.strokeStyle = fg(o); ctx.lineWidth = u * 1.1; ctx.setLineDash([u * 3, u * 2]); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
    P0.forEach(([fx, fy, c], i) => { const a = clamp(p * 3 - i / P0.length); const sx = x + fx * w, sy = y + h - fy * h; if (c) circle(ctx, sx, sy, u * 1.8 * a, C.red); else { ctx.save(); ctx.translate(sx, sy); ctx.rotate(Math.PI / 4); ctx.fillStyle = C.yellow; const s = u * 3 * a; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore(); } });
  };

  V.tree = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), lv = 4, nodes = [];
    for (let d = 0; d < lv; d++) for (let i = 0; i < 2 ** d; i++) nodes.push({ d, i, cx: x + w * (i + .5) / 2 ** d, cy: y + h * (.1 + d * .27) });
    const grow = p * (lv + .6);
    nodes.forEach(n => {
      if (n.d > 0) { const par = nodes.find(m => m.d === n.d - 1 && m.i === n.i >> 1); const lp = clamp(grow - n.d + .3);
        if (lp > 0) { const ex = lerp(par.cx, n.cx, E.outCubic(lp)), ey = lerp(par.cy, n.cy, E.outCubic(lp)); ctx.beginPath(); ctx.moveTo(par.cx, par.cy); ctx.bezierCurveTo(par.cx, (par.cy + ey) / 2, ex, (par.cy + ey) / 2, ex, ey); ctx.strokeStyle = rgba(fg(o), .45); ctx.lineWidth = u * .8; ctx.stroke(); } }
    });
    nodes.forEach(n => {
      const a = E.outBack(clamp(grow - n.d)); if (a <= 0) return; const leaf = n.d === lv - 1;
      const col = leaf ? ((n.i * 7) % 3 ? C.yellow : C.red) : n.d === 0 ? C.orange : fg(o);
      if (leaf) circle(ctx, n.cx, n.cy, u * 3.2 * a, col); else { const bw = u * (n.d === 0 ? 16 : 11) * a, bh = u * 5.4 * a; rr(ctx, n.cx - bw / 2, n.cy - bh / 2, bw, bh, bh / 2); ctx.fillStyle = col; ctx.fill(); }
    });
  };

  V.ensemble = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), k = 5, tw = w / k * .78;
    for (let i = 0; i < k; i++) {
      const tx = x + (i + .5) * w / k - tw / 2, a = clamp(p * 2.4 - i * .18);
      ctx.save(); ctx.globalAlpha *= a; V.tree(ctx, tx, y, tw, h * .5, clamp(p * 2 - i * .1), o); ctx.restore();
      const vp = E.inOutCubic(clamp((p - .5) * 2.6 - i * .05));
      if (vp > 0) { const sx = tx + tw / 2, sy = y + h * .58, ex = x + w / 2, ey = y + h * .9; const vx = lerp(sx, ex, vp), vy = lerp(sy, ey, vp);
        line(ctx, sx, sy, vx, vy, rgba(C.orange, .5), u * .6); circle(ctx, vx, vy, u * 1.6, i === 1 ? C.red : C.yellow); }
    }
    const rp = E.outBack(clamp((p - .82) * 6));
    if (rp > 0) { circle(ctx, x + w / 2, y + h * .9, u * 6 * rp, C.orange); icon(ctx, 'check', x + w / 2, y + h * .9, u * 7 * rp, '#FFF', 14); }
  };

  V.clusters = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), cs = [[.24, .32, C.red], [.72, .28, C.yellow], [.5, .76, C.orange]];
    const P0 = pts(31, 60, (r, i) => { const c = i % 3; return { sx: r(), sy: r(), c, dx: cs[c][0] + gauss(r) * .07, dy: cs[c][1] + gauss(r) * .07 }; });
    const mp = E.inOutCubic(clamp(p * 1.3)), t = o.t || 0;
    cs.forEach(([cx, cy, col], i) => { const a = clamp((p - .55) * 3); if (a > 0) glow(ctx, x + cx * w, y + cy * h, u * 26, col, a * .35); });
    P0.forEach(q => { const px = x + lerp(q.sx, q.dx, mp) * w + Math.sin(t * 2 + q.sx * 9) * u * .4, py = y + lerp(q.sy, q.dy, mp) * h;
      circle(ctx, px, py, u * 1.5, mp > .2 ? mix(o.theme === 'light' ? '#8A8378' : '#D9D3CA', cs[q.c][2], clamp(mp * 1.4)) : rgba(fg(o), .6)); });
    cs.forEach(([cx, cy], i) => { const a = clamp((p - .6) * 4); if (a <= 0) return; const px = x + cx * w, py = y + cy * h, s = u * 3.2;
      line(ctx, px - s, py - s, px + s, py + s, rgba(fg(o), a), u * .9); line(ctx, px - s, py + s, px + s, py - s, rgba(fg(o), a), u * .9); });
  };

  V.anomaly = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), t = o.t || 0;
    const P0 = pts(41, 70, r => [.42 + gauss(r) * .12, .55 + gauss(r) * .12]);
    P0.forEach(([fx, fy], i) => { const a = clamp(p * 3 - i / 70); circle(ctx, x + fx * w, y + fy * h, u * 1.4 * a, rgba(fg(o), .55)); });
    const a = clamp((p - .4) * 3); if (a <= 0) return;
    const ox = x + w * .84, oy = y + h * .2, pu = (t * 1.6) % 1;
    glow(ctx, ox, oy, u * 18, C.red, a * .8); circle(ctx, ox, oy, u * 2.6, C.red);
    circle(ctx, ox, oy, u * (5 + pu * 14), null, rgba(C.red, (1 - pu) * a), u * .7);
    line(ctx, x + w * .42, y + h * .55, ox, oy, rgba(C.red, .35 * a), u * .5, [u * 2, u * 2]);
    if (u > 1.4) text(ctx, 'outlier', ox, oy + u * 9, { size: u * 4.4, weight: 700, mono: true, color: C.red, align: 'center', alpha: a });
  };

  V.embeddings = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), t = o.t || 0, cx = x + w / 2, cy = y + h / 2, ang = t * .6, cols = [C.red, C.yellow, C.orange, C.sand];
    const P0 = pts(51, 90, (r, i) => { const c = i % 4, cc = [[-1, -.4, .3], [1, -.2, -.4], [.1, .9, .5], [-.3, .1, -1]][c]; return [cc[0] + gauss(r) * .28, cc[1] + gauss(r) * .28, cc[2] + gauss(r) * .28, c]; });
    const proj = P0.map(([a, b, c, k]) => { const xr = a * Math.cos(ang) - c * Math.sin(ang), zr = a * Math.sin(ang) + c * Math.cos(ang); const s = 3 / (zr + 4.2); return [cx + xr * s * w * .34, cy + b * s * h * .5, s, k, zr]; }).sort((m, n) => n[4] - m[4]);
    proj.forEach(([px, py, s, k], i) => { const a = clamp(p * 2.5 - i / 90); circle(ctx, px, py, u * 1.7 * s * a, rgba(cols[k], .35 + .65 * clamp(s - .5))); });
  };

  V.recommend = (ctx, x, y, w, h, p, o = {}) => {
    const R = 7, Cn = 11, cw = w / Cn, ch = h / R, r = rng(61);
    for (let i = 0; i < R; i++) for (let j = 0; j < Cn; j++) {
      const v = clamp(.5 + .45 * Math.sin(i * 1.3 + j * .7) * Math.cos(j * .4 - i * .2) + (r() - .5) * .2), sweep = clamp(p * 1.6 - (i + j) / (R + Cn));
      rr(ctx, x + j * cw + 2, y + i * ch + 2, cw - 4, ch - 4, Math.min(cw, ch) * .18); ctx.fillStyle = sweep > 0 ? heat(v * sweep) : (o.theme === 'light' ? '#E7E1D7' : '#2A2622'); ctx.fill();
      if (v > .88 && sweep >= 1) { const s = E.outBack(clamp((p - .7) * 4)); icon(ctx, 'spark', x + j * cw + cw / 2, y + i * ch + ch / 2, Math.min(cw, ch) * .7 * s, '#FFF'); }
    }
  };

  V.agents = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), t = o.t || 0, roles = ['analista', 'business', 'clevel', 'validador', 'embalador'];
    const pos = [[.14, .3], [.14, .7], [.42, .5], [.68, .5], [.9, .5]].map(([a, b]) => [x + a * w, y + b * h]);
    [[0, 2], [1, 2], [2, 3], [3, 4]].forEach(([a, b], i) => { const lp = clamp(p * 2.2 - i * .25); if (lp <= 0) return;
      line(ctx, pos[a][0], pos[a][1], lerp(pos[a][0], pos[b][0], lp), lerp(pos[a][1], pos[b][1], lp), rgba(C.orange, .5), u * .6);
      const k = (t * .9 + i * .25) % 1; if (lp >= 1) circle(ctx, lerp(pos[a][0], pos[b][0], k), lerp(pos[a][1], pos[b][1], k), u * 1.4, C.yellow); });
    roles.forEach((rl, i) => { const a = E.outBack(clamp(p * 2.4 - i * .2)); if (a > 0) agent(ctx, pos[i][0], pos[i][1], u * 7 * a, { role: rl, t: t + i, seed: i, verdict: rl === 'validador' && p > .8 ? 'ok' : null }); });
  };

  V.pipeline = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), t = o.t || 0, n = 5, cy = y + h / 2, ic = ['db', 'shield', 'gear', 'spark', 'doc'];
    const lp = E.inOutCubic(clamp(p * 1.5));
    line(ctx, x + w * .08, cy, x + w * .08 + w * .84 * lp, cy, rgba(C.orange, .8), u * 1.2);
    for (let k = 0; k < 7; k++) { const q = ((t * .45 + k / 7) % 1); if (q < lp) { const px = x + w * .08 + w * .84 * q; glow(ctx, px, cy, u * 5, C.yellow, .8); ctx.fillStyle = C.yellow; ctx.fillRect(px - u * 1.4, cy - u * 1.4, u * 2.8, u * 2.8); } }
    for (let i = 0; i < n; i++) { const a = E.outBack(clamp(p * 2 - i * .18)); if (a <= 0) continue; const px = x + w * (.08 + .84 * i / (n - 1));
      circle(ctx, px, cy, u * 8 * a, o.theme === 'light' ? '#FFF' : C.ink2, rgba(C.orange, .9), u * .9); icon(ctx, ic[i], px, cy, u * 9 * a, C.orange, 8); }
  };

  V.credit = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), t = o.t || 0, gx = x + w * .5, gy = y + h * .5, R = Math.min(w * .32, h * .42);
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(gx, gy, R, Math.PI + i * Math.PI / 3 + .04, Math.PI + (i + 1) * Math.PI / 3 - .04); ctx.strokeStyle = [C.red, C.yellow, C.orange][i]; ctx.lineWidth = u * 4; ctx.stroke(); }
    ctx.lineCap = 'butt';
    const v = lerp(.1, .78 + Math.sin(t * 2.4) * .04, E.outElastic(clamp(p * 1.3))), na = Math.PI + v * Math.PI;
    line(ctx, gx, gy, gx + Math.cos(na) * R * .82, gy + Math.sin(na) * R * .82, fg(o), u * 1.6); circle(ctx, gx, gy, u * 3, fg(o));
    if (u > 1) text(ctx, String(Math.round(lerp(300, 1000, v))), gx, gy + u * 9, { size: u * 9, weight: 800, color: fg(o), align: 'center' });
    // distribuições bons/maus + corte
    const by = y + h * .97, bh = h * .3, bx = x + w * .06, bw = w * .88, cut = lerp(.3, .5, E.inOutCubic(clamp((p - .3) * 1.5)));
    [[.34, C.red], [.64, C.yellow]].forEach(([m, col]) => { ctx.beginPath(); for (let i = 0; i <= 50; i++) { const z = i / 50; ctx.lineTo(bx + z * bw, by - Math.exp(-((z - m) ** 2) / .012) * bh * clamp(p * 2)); } ctx.strokeStyle = col; ctx.lineWidth = u * .9; ctx.stroke(); });
    line(ctx, bx + cut * bw, by, bx + cut * bw, by - bh * 1.05, rgba(fg(o), .8), u * .6, [u * 1.5, u * 1.5]);
  };

  V.forecast = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), split = .62; axes(ctx, x, y, w, h, o);
    const P0 = pts(71, 26, (r, i) => { const fx = (i + r()) / 26 * split; return [fx, .2 + fx * .7 + Math.sin(fx * 14) * .05 + gauss(r) * .04]; });
    P0.forEach(([fx, fy], i) => circle(ctx, x + fx * w, y + h - fy * h, u * 1.3 * clamp(p * 3 - i / 26), rgba(fg(o), .8)));
    const lp = E.outCubic(clamp((p - .25) * 2)); if (lp <= 0) return;
    const f = fx => .2 + fx * .7, xe = lerp(0, split, lp);
    line(ctx, x, y + h - f(0) * h, x + xe * w, y + h - f(xe) * h, C.orange, u * 1.2);
    const cp = E.outCubic(clamp((p - .55) * 2.2)); if (cp <= 0) return;
    const xf = lerp(split, .98, cp);
    ctx.beginPath(); ctx.moveTo(x + split * w, y + h - f(split) * h);
    ctx.lineTo(x + xf * w, y + h - (f(xf) + (xf - split) * .55) * h); ctx.lineTo(x + xf * w, y + h - (f(xf) - (xf - split) * .55) * h); ctx.closePath();
    ctx.fillStyle = rgba(C.yellow, .22); ctx.fill();
    line(ctx, x + split * w, y + h - f(split) * h, x + xf * w, y + h - f(xf) * h, C.yellow, u * 1.1, [u * 2, u * 1.5]);
    line(ctx, x + split * w, y, x + split * w, y + h, faint(o), u * .5, [u, u]);
  };

  V.ai = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), t = o.t || 0;
    const a1 = E.outBack(clamp(p * 3)); if (a1 > 0) { ctx.save(); ctx.globalAlpha *= clamp(a1); rr(ctx, x, y + h * .36, w * .26, h * .28, u * 4); ctx.fillStyle = rgba(fg(o), .12); ctx.fill();
      for (let i = 0; i < 3; i++) { rr(ctx, x + w * .03, y + h * (.42 + i * .07), w * (.18 - i * .04), h * .035, h * .02); ctx.fillStyle = rgba(fg(o), .6); ctx.fill(); } ctx.restore(); }
    const G = [[.42, .3], [.42, .7], [.56, .5], [.66, .22], [.66, .78]];
    const gp = clamp((p - .2) * 2);
    [[0, 2], [1, 2], [2, 3], [2, 4], [0, 3], [1, 4]].forEach(([a, b], i) => { const q = clamp(gp * 2 - i * .12); if (q > 0) line(ctx, x + G[a][0] * w, y + G[a][1] * h, x + lerp(G[a][0], G[b][0], q) * w, y + lerp(G[a][1], G[b][1], q) * h, rgba(C.orange, .5), u * .6); });
    G.forEach(([gx, gy], i) => { const q = E.outBack(clamp(gp * 2 - i * .15)); if (q > 0) { circle(ctx, x + gx * w, y + gy * h, u * 3 * q, i === 2 ? C.orange : C.yellow); } });
    for (let k = 0; k < 6; k++) { const q = (t * .8 + k / 6) % 1; if (gp >= 1) circle(ctx, x + lerp(.27, .78, q) * w, y + h * (.5 + Math.sin(q * 9 + k) * .12), u * .9, rgba('#FFF', .9)); }
    const a3 = E.outBack(clamp((p - .7) * 4)); if (a3 > 0) { ctx.save(); ctx.globalAlpha *= clamp(a3); rr(ctx, x + w * .76, y + h * .34, w * .24, h * .32, u * 4); ctx.fillStyle = C.orange; ctx.fill(); icon(ctx, 'spark', x + w * .88, y + h * .5, u * 12, '#FFF'); ctx.restore(); }
  };

  V.gradient = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), mx = x + w * .66, my = y + h * .6, fgc = o.theme === 'light' ? C.ink : C.cream;
    for (let k = 7; k >= 1; k--) { ctx.beginPath(); ctx.ellipse(mx, my, w * .09 * k, h * .075 * k, -.35, 0, TAU);
      ctx.strokeStyle = k < 3 ? rgba(C.orange, .85) : rgba(fgc, .18 + (7 - k) * .05); ctx.lineWidth = Math.max(1, u * .5); ctx.stroke(); }
    const N = 14, pts = []; let px = x + w * .08, py = y + h * .14, vx = 0, vy = 0;
    for (let i = 0; i <= N; i++) { pts.push([px, py]); vx = vx * .5 - (px - mx) * .2; vy = vy * .5 - (py - my) * .2; px += vx; py += vy + (i % 2 ? 1 : -1) * h * .07 * Math.pow(.72, i); }
    const k = clamp(p) * N, n = Math.min(N - 1, Math.floor(k)), f = k - n;
    ctx.beginPath(); for (let i = 0; i <= n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineTo(lerp(pts[n][0], pts[n + 1][0], f), lerp(pts[n][1], pts[n + 1][1], f));
    ctx.strokeStyle = C.yellow; ctx.lineWidth = Math.max(1.5, u * .8); ctx.stroke();
    for (let i = 0; i <= n; i++) circle(ctx, pts[i][0], pts[i][1], Math.max(1.5, u * .9), C.yellow);
    const hx = lerp(pts[n][0], pts[n + 1][0], f), hy = lerp(pts[n][1], pts[n + 1][1], f);
    glow(ctx, hx, hy, u * 9, C.orange, .9); circle(ctx, hx, hy, Math.max(3, u * 2.2), '#FFF', INK, 2);
    const s = u * 2.4; line(ctx, mx - s, my - s, mx + s, my + s, fgc, Math.max(1, u * .5)); line(ctx, mx - s, my + s, mx + s, my - s, fgc, Math.max(1, u * .5));
  };

  /** atenção estilo "attention heads": tokens Q (cima) × K (baixo), linhas com peso */
  V.transformer = (ctx, x, y, w, h, p, o = {}) => {
    const u = U(w, h), n = 6, t = o.t || 0, fgc = o.theme === 'light' ? INK : C.cream, ty = y + h * .1, by = y + h * .9, xs = i => x + w * (.08 + .84 * i / (n - 1));
    for (let i = 0; i < n; i++) { let ws = [], sum = 0; for (let j = 0; j < n; j++) { const v = Math.exp(-((i - j - Math.round(Math.sin(t * 1.3 + i * 1.7) * 1.4)) ** 2) / 1.2); ws.push(v); sum += v; }
      ws.forEach((v, j) => { const wgt = v / sum, a = clamp(p * 2.2 - (i + j) / (2 * n)) * wgt; if (a <= .02) return;
        ctx.beginPath(); ctx.moveTo(xs(i), ty + u * 5); ctx.bezierCurveTo(xs(i), y + h * .5, xs(j), y + h * .5, xs(j), by - u * 5); ctx.strokeStyle = rgba(i % 2 ? C.yellow : C.orange, clamp(a * 1.6)); ctx.lineWidth = Math.max(1, u * 2.4 * wgt); ctx.stroke(); }); }
    for (let i = 0; i < n; i++) { const a = E.outBack(clamp(p * 3 - i * .1)); if (a <= 0) continue;
      [[ty, 'Q'], [by, 'K']].forEach(([yy, lb]) => { const bw = u * 11 * a, bh = u * 8 * a; rr(ctx, xs(i) - bw / 2, yy - bh / 2, bw, bh, u * 1.5); ctx.fillStyle = lb === 'Q' ? C.orange : C.yellow; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1, u * .5); ctx.stroke();
        if (u > 1.2) text(ctx, lb + (i + 1), xs(i), yy + 1, { size: u * 4, weight: 800, mono: true, color: INK, align: 'center' }); }); }
  };

  return V;
})();
