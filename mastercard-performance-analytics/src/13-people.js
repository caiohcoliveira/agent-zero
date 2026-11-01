/* ============================================================================
   13. PERSONAGENS — estilo desenho animado: cabeça grande, corpo baixinho, contorno
   grosso, olhos grandes e sombra chapada. Rig simples (quadril, tronco, cabeça, braços, pernas). Poses são números
   (ângulos), então dá para misturar uma pose na outra (mixPose).
   ----------------------------------------------------------------------------
   Coordenadas: origem nos pés, no chão; altura ~300 em escala 1; vista 3/4 olhando para +x.
   a: braços [perto, longe] = [ângulo do ombro a partir de "para baixo", dobra do cotovelo]
   l: pernas [perto, longe] = [ângulo do quadril, dobra do joelho]
   ========================================================================== */
const PEOPLE = (() => {
  // proporções de desenho animado: cabeça grande, corpo baixinho, braços e pernas finos, tênis grandes
  const L = { thigh: 46, shin: 46, torso: 82, ua: 40, fa: 36, R: 62 };
  const dn = (x, y, a, l) => [x + Math.sin(a) * l, y + Math.cos(a) * l];
  const POSE = {
    stand: { hx: 0, hy: -102, lean: 0, tilt: 0, a: [[.22, .15], [.14, .15]], l: [[.02, 0], [-.02, 0]] },
    sit: { hx: 0, hy: -60, lean: .04, tilt: .06, a: [[1.28, .42], [1.18, .52]], l: [[1.57, 1.57], [1.52, 1.52]] }
  };
  const num = (a, b, k) => typeof a === 'number' ? lerp(a, b, k) : a.map((v, i) => num(v, b[i], k));
  /** mistura duas poses (k = 0 → p, 1 → q) */
  function mixPose(p, q, k) { const o = {}; for (const key in p) o[key] = num(p[key], q[key], clamp(k)); return o; }
  function typing(t) { const p = JSON.parse(JSON.stringify(POSE.sit)); p.a[0][1] += .2 * Math.sin(t * 19); p.a[1][1] += .2 * Math.sin(t * 17 + 1.3); p.tilt += .04 * Math.sin(t * 2.2); return p; }
  /** passinho rápido e curto (como o andar apressado dos desenhos): tronco firme, pernas miúdas, quique leve */
  function walk(ph) {
    const s = Math.sin(ph), c = Math.cos(ph);
    return { hx: 0, hy: -102 - 5 * Math.abs(s), lean: .06, tilt: .05 * Math.sin(ph * 2), a: [[.55 + .18 * s, 1.05], [.5 - .18 * s, 1.05]], l: [[.36 * s, Math.max(0, c) * .95], [-.36 * s, Math.max(0, -c) * .95]] };
  }
  /** dança no tempo da música: desce no tempo, troca de lado a cada batida, braços para o alto */
  function dance(t, beat, bi) {
    const sw = bi % 2 ? 1 : -1, b = Math.pow(clamp(beat), 1.6), w = Math.sin(t * 6.5);
    return { hx: sw * 9, hy: -102 + 12 * b, lean: .1 * sw, tilt: -.2 * sw, a: [[2.7 + .3 * w, .45 + .3 * b], [2.55 - .3 * w, .55]], l: [[.25 * sw, .3 + .5 * b], [-.2 * sw, .3 + .35 * b]] };
  }
  function reach(k) { const p = JSON.parse(JSON.stringify(POSE.stand)); p.a[0] = [lerp(.22, 1.75, k), lerp(.15, 0, k)]; p.lean = .06 * k; return p; }
  /** segura algo na frente do peito (o bilhete); k = 0 braço solto → 1 segurando */
  function hold(k, base) { const p = JSON.parse(JSON.stringify(base || POSE.stand)); p.a[0] = [lerp(p.a[0][0], .5, k), lerp(p.a[0][1], 1.75, k)]; return p; }
  /** acena com o braço da frente */
  function wave(t, k = 1, base) { const p = JSON.parse(JSON.stringify(base || POSE.stand)); p.a[0] = [lerp(p.a[0][0], 2.75, k), lerp(p.a[0][1], .45 + .38 * Math.sin(t * 9), k)]; p.tilt += .05 * k; return p; }
  /** aponta para a frente e para cima */
  function point(k, base) { const p = JSON.parse(JSON.stringify(base || POSE.stand)); p.a[0] = [lerp(p.a[0][0], 2.05, k), lerp(p.a[0][1], -.05, k)]; p.lean += .03 * k; return p; }
  /** posição da mão (i = 0 braço da frente · 1 de trás) no mesmo espaço de draw(x, y, s, P, { dir }) */
  function hand(x, y, s, P, o = {}, i = 0) {
    const dir = o.dir || 1, side = i === 0 ? 1 : -1, N = [P.hx + Math.sin(P.lean) * L.torso, P.hy - Math.cos(P.lean) * L.torso];
    const sh = [N[0] + side * 30, N[1] + 14], [a, k] = P.a[i], el = dn(sh[0], sh[1], a, L.ua), hd = dn(el[0], el[1], a + k, L.fa);
    return [x + hd[0] * s * dir, y + hd[1] * s];
  }

  const COL = { skin: '#F7CBA6', skinDk: '#E3A27C', hair: '#F7D45C', hairDk: '#D8A433', top: '#E2462C', topDk: '#B8321E', stripe: C.yellow, pants: '#2E3A66', pantsDk: '#222B4E', shoe: '#FFFFFF', sole: C.orange, phones: C.orange };
  /** desenha a personagem (vista 3/4, olhando para +x). o: { dir, t, phones: 'neck'|'on', mood: 'tired'|'happy'|'calm', dark, swing, sil } */
  function draw(ctx, x, y, s, P, o = {}) {
    const dir = o.dir || 1, dark = o.dark || 0, t = o.t || 0, sil = !!o.sil, R = L.R;
    const tint = c => sil ? (o.silCol || '#120D0B') : (dark > 0 ? mix(c, '#0D1024', dark * .62) : c), OUT = sil ? tint('#000') : INK;
    const seg = (x1, y1, x2, y2, w, c) => { ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = OUT; ctx.lineWidth = w + 7; ctx.stroke(); ctx.strokeStyle = tint(c); ctx.lineWidth = w; ctx.stroke(); };
    const blob = (pathFn, c, lw = 4) => { pathFn(); ctx.fillStyle = tint(c); ctx.fill(); if (lw > 0) { ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); } };
    ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
    ctx.save(); ctx.globalAlpha *= .3; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(P.hx * .5, 3, 70, 11, 0, 0, TAU); ctx.fill(); ctx.restore();
    const H0 = [P.hx, P.hy], N = [P.hx + Math.sin(P.lean) * L.torso, P.hy - Math.cos(P.lean) * L.torso];
    const leg = (i, side) => { const hip = [H0[0] + side * 13, H0[1] - 4], [a, k] = P.l[i], kn = dn(hip[0], hip[1], a, L.thigh), ft = dn(kn[0], kn[1], a - k, L.shin);
      seg(hip[0], hip[1], kn[0], kn[1], 19, side > 0 ? COL.pants : COL.pantsDk); seg(kn[0], kn[1], ft[0], ft[1], 16, side > 0 ? COL.pants : COL.pantsDk);
      ctx.save(); ctx.translate(ft[0], ft[1]); ctx.rotate(-(a - k) * .25);
      blob(() => { ctx.beginPath(); ctx.ellipse(12, 2, 27, 15, 0, 0, TAU); }, COL.shoe); if (!sil) { ctx.beginPath(); ctx.ellipse(12, 10, 26, 6, 0, 0, Math.PI); ctx.fillStyle = tint(COL.sole); ctx.fill(); line(ctx, 2, -6, 14, -8, rgba(INK, .5), 2.5); }
      ctx.restore(); };
    const arm = (i, side) => { const sh = [N[0] + side * 30, N[1] + 14], [a, k] = P.a[i], el = dn(sh[0], sh[1], a, L.ua), hd = dn(el[0], el[1], a + k, L.fa);
      seg(sh[0], sh[1], el[0], el[1], 15, side > 0 ? COL.top : COL.topDk); seg(el[0], el[1], hd[0], hd[1], 11, side > 0 ? COL.skin : COL.skinDk);
      blob(() => { ctx.beginPath(); ctx.arc(hd[0], hd[1], 11, 0, TAU); }, side > 0 ? COL.skin : COL.skinDk, 3.5); };
    leg(1, -1); arm(1, -1);
    // tronco: blusa vermelha com gola branca e faixa amarela, sombra chapada do lado de trás
    const px = Math.cos(P.lean), py = Math.sin(P.lean), sx = (k, w) => [lerp(N[0], H0[0], k) + w * px, lerp(N[1], H0[1], k) + w * py];
    const torso = () => { ctx.beginPath(); const p1 = sx(0, -32), p2 = sx(0, 32), p3 = sx(1.08, 38), p4 = sx(1.08, -38); ctx.moveTo(p1[0], p1[1] + 6); ctx.quadraticCurveTo(N[0], N[1] - 4, p2[0], p2[1] + 6); ctx.quadraticCurveTo(p2[0] + 8, (p2[1] + p3[1]) / 2, p3[0], p3[1]); ctx.quadraticCurveTo(H0[0], H0[1] + 16, p4[0], p4[1]); ctx.quadraticCurveTo(p1[0] - 8, (p1[1] + p4[1]) / 2, p1[0], p1[1] + 6); ctx.closePath(); };
    blob(torso, COL.top, 4.5);
    if (!sil) { ctx.save(); torso(); ctx.clip(); const d = sx(0, -36); ctx.fillStyle = tint(COL.topDk); ctx.beginPath(); ctx.ellipse(d[0] - 6, (N[1] + H0[1]) / 2, 22, 70, 0, 0, TAU); ctx.fill();
      const st = sx(.72, 0); ctx.fillStyle = tint(COL.stripe); ctx.save(); ctx.translate(st[0], st[1]); ctx.rotate(P.lean); ctx.fillRect(-50, -6, 100, 12); ctx.restore(); ctx.restore(); torso(); ctx.strokeStyle = OUT; ctx.lineWidth = 4.5; ctx.stroke();
      blob(() => { ctx.beginPath(); ctx.moveTo(N[0] - 16, N[1] + 4); ctx.lineTo(N[0] + 2, N[1] + 26); ctx.lineTo(N[0] + 20, N[1] + 4); ctx.lineTo(N[0] + 2, N[1] + 12); ctx.closePath(); }, '#FFFFFF', 3); }
    leg(0, 1);
    // cabeça
    const ang = P.lean + P.tilt, hc = [N[0] + Math.sin(ang) * (R * .86), N[1] - Math.cos(ang) * (R * .86)];
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(ang);
    if (o.phones === 'neck') { ctx.beginPath(); ctx.ellipse(-4, R * .95, R * .5, R * .2, 0, .1, Math.PI - .1); ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.stroke(); ctx.strokeStyle = tint(COL.phones); ctx.lineWidth = 4; ctx.stroke(); blob(() => { ctx.beginPath(); ctx.ellipse(-R * .52, R * .98, 13, 16, .3, 0, TAU); }, COL.phones, 3.5); }
    // rabo de cavalo atrás, com elástico laranja
    const sw = o.swing == null ? Math.sin(t * 4) * .25 : o.swing;
    ctx.save(); ctx.translate(-R * .82, -R * .42); ctx.rotate(.55 + sw);
    blob(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-34, 30, -12, 86); ctx.quadraticCurveTo(-2, 70, 6, 92); ctx.quadraticCurveTo(26, 44, 0, 0); ctx.closePath(); }, COL.hair, 4);
    if (!sil) line(ctx, -4, 20, -8, 70, tint(COL.hairDk), 3);
    blob(() => { ctx.beginPath(); ctx.ellipse(0, 4, 13, 9, 0, 0, TAU); }, COL.phones, 3); ctx.restore();
    // rosto com sombra chapada
    const face = () => { ctx.beginPath(); ctx.ellipse(0, 0, R * 1.04, R, 0, 0, TAU); };
    blob(face, sil ? COL.skin : COL.skinDk, 0);
    if (!sil) { ctx.save(); face(); ctx.clip(); ctx.beginPath(); ctx.ellipse(R * .14, -R * .06, R * .96, R * .94, 0, 0, TAU); ctx.fillStyle = tint(COL.skin); ctx.fill(); ctx.restore(); }
    face(); ctx.strokeStyle = OUT; ctx.lineWidth = 4.5; ctx.stroke();
    blob(() => { ctx.beginPath(); ctx.ellipse(-R * .7, R * .14, 12, 16, 0, 0, TAU); }, COL.skinDk, 3.5);
    if (!sil) {
      const mood = o.mood || 'calm', eyes = [[R * .4, R * .06, R * .22, R * .29], [-R * .08, R * .06, R * .17, R * .27]];
      eyes.forEach(([ex, ey, rx, ry], k) => {
        if (mood === 'happy') { ctx.beginPath(); ctx.ellipse(ex, ey + ry * .2, rx * .8, ry * .55, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); return; }
        blob(() => { ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, TAU); }, '#FFFFFF', 3);
        const pxp = ex + rx * .32, pyp = ey + ry * .12; circle(ctx, pxp, pyp, rx * .42, tint('#3D7FA8')); circle(ctx, pxp, pyp, rx * .24, INK); circle(ctx, pxp + rx * .14, pyp - ry * .16, rx * .12, '#FFFFFF');
        if (mood === 'tired') { ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, rx + 1, ry + 1, 0, 0, TAU); ctx.clip(); ctx.fillStyle = tint(COL.skin); ctx.fillRect(ex - rx - 2, ey - ry - 2, rx * 2 + 4, ry * .95); ctx.restore(); line(ctx, ex - rx, ey - ry * .1, ex + rx, ey - ry * .1, INK, 3.5); }
        line(ctx, ex + rx * .6, ey - ry * .8, ex + rx * 1.05, ey - ry * 1.05, INK, 3); line(ctx, ex + rx * .2, ey - ry * .98, ex + rx * .45, ey - ry * 1.28, INK, 3);
        ctx.beginPath(); ctx.arc(ex, ey - ry * 1.25, rx * .9, Math.PI * 1.15, Math.PI * 1.85); ctx.strokeStyle = tint(COL.hairDk); ctx.lineWidth = 4; ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(R * .72, R * .2); ctx.quadraticCurveTo(R * .86, R * .36, R * .7, R * .42); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      if (mood === 'happy') blob(() => { ctx.beginPath(); ctx.moveTo(R * .12, R * .56); ctx.quadraticCurveTo(R * .4, R * .9, R * .66, R * .54); ctx.closePath(); }, '#8A1E1E', 3);
      else if (mood === 'tired') { ctx.beginPath(); ctx.moveTo(R * .18, R * .66); ctx.quadraticCurveTo(R * .3, R * .6, R * .4, R * .66); ctx.quadraticCurveTo(R * .5, R * .72, R * .6, R * .64); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(R * .4, R * .5, R * .2, .3, Math.PI - .5); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke(); }
      circle(ctx, R * .66, R * .44, R * .12, 'rgba(240,110,100,.35)'); circle(ctx, -R * .2, R * .44, R * .1, 'rgba(240,110,100,.3)');
    }
    // cabelo: calota com franja em pontas
    const hair = () => { ctx.beginPath(); ctx.moveTo(-R * 1.05, R * .3); ctx.bezierCurveTo(-R * 1.25, -R * .9, R * .5, -R * 1.45, R * 1.02, -R * .32);
      ctx.lineTo(R * .78, -R * .18); ctx.lineTo(R * .7, R * .02); ctx.lineTo(R * .48, -R * .26); ctx.lineTo(R * .3, -R * .02); ctx.lineTo(R * .12, -R * .34); ctx.lineTo(-R * .1, -R * .1); ctx.lineTo(-R * .3, -R * .42);
      ctx.quadraticCurveTo(-R * .62, -R * .2, -R * .7, R * .3); ctx.closePath(); };
    blob(hair, COL.hair, 4.5);
    if (!sil) { ctx.save(); hair(); ctx.clip(); ctx.fillStyle = tint(COL.hairDk); ctx.beginPath(); ctx.ellipse(-R * .9, R * .1, R * .4, R * .9, .2, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(R * .1, -R * .78, R * .38, R * .1, -.25, 0, TAU); ctx.fill(); ctx.restore(); hair(); ctx.strokeStyle = OUT; ctx.lineWidth = 4.5; ctx.stroke(); }
    if (o.phones === 'on') { ctx.beginPath(); ctx.ellipse(-R * .1, -R * .1, R * .95, R * 1.1, .15, Math.PI * 1.02, Math.PI * 1.93); ctx.strokeStyle = OUT; ctx.lineWidth = 11; ctx.stroke(); ctx.strokeStyle = tint(COL.phones); ctx.lineWidth = 5; ctx.stroke();
      blob(() => { ctx.beginPath(); ctx.ellipse(-R * .7, R * .12, 22, 27, 0, 0, TAU); }, COL.phones, 4); if (!sil) circle(ctx, -R * .7, R * .12, 11, tint('#3A2A1E')); }
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
  return { POSE, mixPose, typing, walk, dance, reach, hold, wave, point, hand, draw, mouse, pigeon };
})();
