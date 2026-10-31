/* ============================================================================
   13. PERSONAGENS 2.5D — rig simples (quadril, tronco, cabeça, braços, pernas)
   com volume pintado, contorno de tinta e luz de recorte. Poses são números
   (ângulos), então dá para misturar uma pose na outra (mixPose).
   ----------------------------------------------------------------------------
   Coordenadas: origem nos pés, no chão; altura ~380 em escala 1; olhando para +x.
   a: braços [perto, longe] = [ângulo do ombro a partir de "para baixo", dobra do cotovelo]
   l: pernas [perto, longe] = [ângulo do quadril, dobra do joelho]
   ========================================================================== */
const PEOPLE = (() => {
  const L = { thigh: 84, shin: 82, torso: 120, ua: 62, fa: 58, head: 37 };
  const dn = (x, y, a, l) => [x + Math.sin(a) * l, y + Math.cos(a) * l];
  const POSE = {
    stand: { hx: 0, hy: -166, lean: .02, tilt: 0, a: [[.14, .3], [.06, .22]], l: [[.03, 0], [-.03, 0]] },
    sit: { hx: 0, hy: -116, lean: .16, tilt: .1, a: [[1.0, 1.0], [.92, 1.08]], l: [[1.5, 1.5], [1.42, 1.42]] }
  };
  const num = (a, b, k) => typeof a === 'number' ? lerp(a, b, k) : a.map((v, i) => num(v, b[i], k));
  /** mistura duas poses (k = 0 → p, 1 → q) */
  function mixPose(p, q, k) { const o = {}; for (const key in p) o[key] = num(p[key], q[key], clamp(k)); return o; }
  function typing(t) { const p = JSON.parse(JSON.stringify(POSE.sit)); p.a[0][1] += .14 * Math.sin(t * 19); p.a[1][1] += .14 * Math.sin(t * 17 + 1.3); p.tilt += .03 * Math.sin(t * 2); return p; }
  function walk(ph) {
    const s = Math.sin(ph), c = Math.cos(ph);
    return { hx: 0, hy: -162 + 6 * Math.abs(c), lean: .07, tilt: 0, a: [[-.5 * s, .4], [.5 * s, .4]], l: [[.45 * s, Math.max(0, c) * .9], [-.45 * s, Math.max(0, -c) * .9]] };
  }
  /** dança no tempo da música: quique no tempo, troca de lado a cada batida, braços para o alto */
  function dance(t, beat, bi) {
    const sw = bi % 2 ? 1 : -1, b = Math.pow(clamp(beat), 1.6), w = Math.sin(t * 6.5);
    return { hx: sw * 10, hy: -158 + 16 * b, lean: .12 * sw, tilt: -.2 * sw, a: [[2.55 + .3 * w, .55 + .3 * b], [2.35 - .3 * w, .7]], l: [[.28 * sw, .25 + .5 * b], [-.22 * sw, .3 + .3 * b]] };
  }
  function reach(k) { const p = JSON.parse(JSON.stringify(POSE.stand)); p.a[0] = [lerp(.14, 1.75, k), lerp(.3, .05, k)]; p.lean = .08 * k; return p; }

  const COL = { skin: '#F1C29C', hair: '#F6CF62', hairDk: '#C68B2C', top: '#E2462C', pants: '#2C3352', shoe: '#17161E', phones: C.orange };
  /** desenha a personagem. o: { dir, t, phones: 'neck'|'on'|'off', mood: 'tired'|'happy'|'calm', dark (0–1), swing, sil (silhueta) } */
  function draw(ctx, x, y, s, P, o = {}) {
    const dir = o.dir || 1, dark = o.dark || 0, t = o.t || 0;
    const tint = c => o.sil ? (o.silCol || '#120D0B') : (dark > 0 ? mix(c, '#0D1024', dark * .62) : c);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
    // sombra no chão
    ctx.save(); ctx.globalAlpha *= .35; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(P.hx * .5, 4, 90, 14, 0, 0, TAU); ctx.fill(); ctx.restore();
    const H0 = [P.hx, P.hy], N = [P.hx + Math.sin(P.lean) * L.torso, P.hy - Math.cos(P.lean) * L.torso];
    const sh = side => [N[0] + side * 4, N[1] + 14], hip = side => [H0[0] + side * 6, H0[1]];
    const leg = (i, side) => { const [hx, hy] = hip(side), [a, k] = P.l[i], kn = dn(hx, hy, a, L.thigh), ft = dn(kn[0], kn[1], a - k, L.shin);
      vlimb(ctx, hx, hy, kn[0], kn[1], 38, tint(COL.pants), { ink: !o.sil }); vlimb(ctx, kn[0], kn[1], ft[0], ft[1], 25, tint(COL.pants), { ink: !o.sil });
      ctx.save(); ctx.translate(ft[0], ft[1]); ctx.rotate(-(a - k) * .3); ctx.beginPath(); ctx.ellipse(14, -4, 26, 12, 0, 0, TAU); ctx.fillStyle = tint(COL.shoe); ctx.fill(); if (!o.sil) { ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); } ctx.restore(); };
    const arm = (i, side) => { const [sx, sy] = sh(side), [a, k] = P.a[i], el = dn(sx, sy, a, L.ua), hd = dn(el[0], el[1], a + k, L.fa);
      vlimb(ctx, sx, sy, el[0], el[1], 25, tint(COL.top), { ink: !o.sil }); vlimb(ctx, el[0], el[1], hd[0], hd[1], 17, tint(COL.skin), { ink: !o.sil });
      if (o.sil) circle(ctx, hd[0], hd[1], 12, tint(COL.skin)); else vball(ctx, hd[0], hd[1], 12, tint(COL.skin), { rim: false, lw: 2.5 }); };
    // braço e perna de trás (mais escuros)
    ctx.save(); ctx.globalAlpha *= o.sil ? 1 : .92; leg(1, -1); arm(1, -1); ctx.restore();
    // tronco (blusa) com volume
    const px = Math.cos(P.lean), py = Math.sin(P.lean);
    const Wm = [lerp(N[0], H0[0], .62), lerp(N[1], H0[1], .62)];
    // pescoço
    vlimb(ctx, N[0], N[1] + 6, N[0] + Math.sin(P.lean) * 22, N[1] - Math.cos(P.lean) * 22, 16, tint(COL.skin), { ink: !o.sil });
    ctx.beginPath(); ctx.moveTo(N[0] - 30 * px, N[1] - 30 * py + 10); ctx.quadraticCurveTo(N[0], N[1] - 4, N[0] + 30 * px, N[1] + 30 * py + 10);
    ctx.quadraticCurveTo(Wm[0] + 26 * px, Wm[1] + 20 * py, Wm[0] + 22 * px, Wm[1] + 22 * py); ctx.quadraticCurveTo(H0[0] + 34 * px, H0[1] + 34 * py - 14, H0[0] + 32 * px, H0[1] + 32 * py);
    ctx.quadraticCurveTo(H0[0], H0[1] + 12, H0[0] - 32 * px, H0[1] - 32 * py); ctx.quadraticCurveTo(H0[0] - 34 * px, H0[1] - 34 * py - 14, Wm[0] - 22 * px, Wm[1] - 22 * py);
    ctx.quadraticCurveTo(Wm[0] - 26 * px, Wm[1] - 20 * py, N[0] - 30 * px, N[1] - 30 * py + 10); ctx.closePath();
    if (o.sil) { ctx.fillStyle = tint(COL.top); ctx.fill(); }
    else { const g = ctx.createLinearGradient(N[0] - 40, N[1], H0[0] + 40, H0[1]); g.addColorStop(0, mix(tint(COL.top), LIGHT.hi, .25)); g.addColorStop(1, mix(tint(COL.top), LIGHT.lo, .35)); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(N[0] + 4, N[1] + 6); ctx.lineTo(N[0] + 16 * px + 10, N[1] + 40); ctx.lineTo(N[0] + 2, N[1] + 70); ctx.strokeStyle = rgba(INK, .6); ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(N[0] + 4, N[1] + 6); ctx.lineTo(N[0] + 12, N[1] + 28); ctx.lineTo(N[0] + 22, N[1] + 10); ctx.closePath(); ctx.fillStyle = tint('#F6EEDF'); ctx.fill();
      line(ctx, H0[0] - 28 * px, H0[1] - 28 * py - 10, H0[0] + 28 * px, H0[1] + 28 * py - 10, tint('#1E1A2A'), 7); }
    leg(0, 1);
    // cabeça: rabo de cavalo atrás, rosto, franja, fones
    const hr = L.head, hc = [N[0] + Math.sin(P.lean + P.tilt) * (hr + 14), N[1] - Math.cos(P.lean + P.tilt) * (hr + 14)];
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(P.tilt + P.lean);
    if (o.phones === 'neck') { ctx.save(); ctx.translate(0, hr + 12); ctx.beginPath(); ctx.arc(0, -6, hr * .8, .2, Math.PI - .2); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke(); vball(ctx, hr * .62, 4, 11, tint(COL.phones), { rim: false, lw: 2.5 }); ctx.restore(); }
    const sw = o.swing == null ? Math.sin(t * 3) * .25 : o.swing;
    ctx.save(); ctx.translate(-hr * .78, -hr * .35); ctx.rotate(.5 + sw); ctx.beginPath(); ctx.ellipse(-8, 30, 17, 44, -.2, 0, TAU);
    if (o.sil) { ctx.fillStyle = tint(COL.hair); ctx.fill(); } else { const g = ctx.createLinearGradient(0, -10, 0, 80); g.addColorStop(0, tint(COL.hair)); g.addColorStop(1, tint(COL.hairDk)); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); }
    ctx.restore();
    if (o.sil) circle(ctx, 0, 0, hr, tint(COL.skin)); else vball(ctx, 0, 0, hr, tint(COL.skin), { lw: 4, rimCol: dark > .5 ? '#FF9A4A' : LIGHT.rim });
    if (!o.sil) {
      // rosto (olhando para +x)
      const mood = o.mood || 'calm';
      if (mood === 'happy') { ctx.beginPath(); ctx.arc(hr * .42, -hr * .06, 6, Math.PI * 1.1, Math.PI * 1.9); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke(); }
      else { ctx.beginPath(); ctx.ellipse(hr * .46, -hr * .04, 7, mood === 'tired' ? 3.5 : 9, 0, 0, TAU); ctx.fillStyle = '#FFF8EE'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(hr * .52, -hr * .03, 4.5, mood === 'tired' ? 3 : 6.5, 0, 0, TAU); ctx.fillStyle = '#3A6E8A'; ctx.fill(); circle(ctx, hr * .53, -hr * .03, 2.4, INK); if (mood !== 'tired') circle(ctx, hr * .56, -hr * .1, 1.6, '#FFF');
        line(ctx, hr * .28, -hr * (mood === 'tired' ? .1 : .3), hr * .66, -hr * (mood === 'tired' ? .08 : .28), INK, 3.5); line(ctx, hr * .62, -hr * .28, hr * .74, -hr * .36, INK, 2.5);
        if (mood === 'tired') line(ctx, hr * .3, -hr * .18, hr * .6, -hr * .14, INK, 3); }
      line(ctx, hr * .26, -hr * .32, hr * .62, -hr * (mood === 'tired' ? .24 : .36), tint(COL.hairDk), 4);
      ctx.beginPath(); ctx.moveTo(hr * .92, -hr * .02); ctx.lineTo(hr * 1.04, hr * .2); ctx.lineTo(hr * .9, hr * .22); ctx.strokeStyle = rgba(INK, .7); ctx.lineWidth = 2.5; ctx.stroke();
      if (mood === 'happy') { ctx.beginPath(); ctx.arc(hr * .62, hr * .36, 9, .2, Math.PI - .4); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); }
      else line(ctx, hr * .5, hr * .46, hr * .74, hr * (mood === 'tired' ? .5 : .44), INK, 3);
      circle(ctx, hr * .5, hr * .22, 7, 'rgba(235,90,80,.28)');
    }
    // cabelo: calota + franja, com mechas
    ctx.beginPath(); ctx.arc(0, 0, hr + 3, Math.PI * .92, Math.PI * 2.08); ctx.quadraticCurveTo(hr * .6, -hr * .2, hr * .1, -hr * .35); ctx.quadraticCurveTo(-hr * .3, -hr * .1, -hr * .9, hr * .25); ctx.closePath();
    if (o.sil) { ctx.fillStyle = tint(COL.hair); ctx.fill(); }
    else { const g = ctx.createLinearGradient(-hr, -hr, hr, hr * .4); g.addColorStop(0, mix(tint(COL.hair), LIGHT.hi, .35)); g.addColorStop(1, tint(COL.hairDk)); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.strokeStyle = rgba(tint(COL.hairDk), .7); ctx.lineWidth = 2; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-hr * .7 + k * 12, -hr * .85 + k * 2); ctx.quadraticCurveTo(-hr * .3 + k * 10, -hr * .4, -hr * .5 + k * 14, hr * .05); ctx.stroke(); } }
    if (o.phones === 'on') { ctx.beginPath(); ctx.arc(-hr * .05, -hr * .05, hr + 8, Math.PI * 1.08, Math.PI * 1.98); ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.stroke(); ctx.strokeStyle = tint(COL.phones); ctx.lineWidth = 4; ctx.stroke();
      if (o.sil) circle(ctx, -hr * .08, hr * .05, hr * .44, tint(COL.phones)); else { vball(ctx, -hr * .08, hr * .05, hr * .44, tint(COL.phones), { lw: 3.5 }); circle(ctx, -hr * .08, hr * .05, hr * .22, tint('#3A2A1E')); } }
    ctx.restore();
    arm(0, 1);
    ctx.restore();
  }

  /* ---------- bichos e figurantes da estação ---------- */
  /** ratinho correndo (x, y = chão; dir = sentido; ph = fase das patas) */
  function mouse(ctx, x, y, s, dir, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
    ctx.beginPath(); ctx.moveTo(-26, -10); ctx.bezierCurveTo(-60, -14, -70, 6, -96, -6); ctx.strokeStyle = '#8A7466'; ctx.lineWidth = 3; ctx.stroke();
    for (let k = 0; k < 2; k++) { const a = Math.sin(ph + k * Math.PI) * 8; line(ctx, -8 + k * 18, -4, -8 + k * 18 + a, 4, '#5A4A40', 4); }
    ctx.beginPath(); ctx.ellipse(0, -14, 30, 15, 0, 0, TAU); const g = ctx.createRadialGradient(-6, -22, 2, 0, -14, 30); g.addColorStop(0, '#A8968A'); g.addColorStop(1, '#4E4038'); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    circle(ctx, 24, -20, 11, '#8C7A6E', INK, 2.5); circle(ctx, 18, -32, 7, '#C79A90', INK, 2); circle(ctx, 31, -21, 2.2, INK); circle(ctx, 35, -17, 2.4, '#E7A39A');
    ctx.restore();
  }
  /** pombo bicando o chão; peck 0–1 */
  function pigeon(ctx, x, y, s, dir, peck) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
    line(ctx, -4, -6, -6, 0, '#C2504A', 3); line(ctx, 6, -6, 8, 0, '#C2504A', 3);
    ctx.beginPath(); ctx.ellipse(0, -22, 26, 17, -.15, 0, TAU); const g = ctx.createRadialGradient(-8, -30, 2, 0, -22, 26); g.addColorStop(0, '#A9AEB8'); g.addColorStop(1, '#4A4E5A'); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-22, -24); ctx.lineTo(-40, -30); ctx.lineTo(-36, -18); ctx.closePath(); ctx.fillStyle = '#3E424C'; ctx.fill();
    const hx = 22 + peck * 8, hy = -38 + peck * 26; circle(ctx, hx, hy, 10, '#6A7F80', INK, 2.5); circle(ctx, hx + 3, hy - 2, 1.8, '#F7A93B'); line(ctx, hx + 9, hy + 1, hx + 16, hy + 3, '#E0B070', 3);
    ctx.restore();
  }
  return { POSE, mixPose, typing, walk, dance, reach, draw, mouse, pigeon };
})();
