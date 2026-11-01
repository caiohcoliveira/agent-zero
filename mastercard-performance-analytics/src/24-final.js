/* ============================================================================
   24. PLAY 4 ("Epic Piano") — estação 07, as disciplinas, o letreiro final + encerramento
   ----------------------------------------------------------------------------
   07 · uma cidade conectada: 5 direções em 3 grupos (decisão e integração · reuso e
        eficiência · User-Pay), cada uma com frase explicativa; uma estação ainda em aberto
   clímax · as 8 disciplinas entram uma a uma e FICAM na tela (leitura) → "Tudo se resume
        a Analytics & Advanced Analytics" · letreiro: WELCOME TO… (como na v5.4)
   ========================================================================== */
/* ---------- desenhos das 3 direções do futuro ---------- */
const FUTURE_ART = {
  // um lugar na mesa do board: sala com tela de resultados, mesa em perspectiva, conselheiros e o lugar de Analytics
  chair(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s);
    ctx.fillStyle = '#3A2618'; ctx.fillRect(-440, -300, 880, 230); for (let k = -4; k <= 4; k++) line(ctx, k * 100, -300, k * 100, -70, 'rgba(0,0,0,.35)', 4);
    ctx.fillStyle = '#24170F'; ctx.fillRect(-440, -70, 880, 320); line(ctx, -440, -70, 440, -70, INK, 5);
    rr(ctx, -300, -150, 120, 60, 6); ctx.fillStyle = '#C9A060'; ctx.fill(); inkRect(ctx, -300, -150, 120, 60, 6, 3, 2); text(ctx, 'SALA DO\nBOARD', -240, -119, { size: 18, weight: 900, mono: true, color: INK, align: 'center', ls: 2, lh: 1.1 });
    rr(ctx, -170, -244, 340, 150, 8); ctx.fillStyle = '#0E1420'; ctx.fill(); inkRect(ctx, -170, -244, 340, 150, 8, 4, 3); glow(ctx, 0, -170, 200, '#7FB0FF', .15);
    for (let k = 0; k < 6; k++) { const bh = (24 + k * 16) * E.outCubic(clamp(p * 1.5 - k * .08)); rr(ctx, -140 + k * 48, -110 - bh, 30, bh, 3); ctx.fillStyle = k === 5 ? C.yellow : C.orange; ctx.fill(); }
    line(ctx, -150, -115, 150, -115, '#BFD8FF', 2);
    const bust = (x, y, sc, suit, hair, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
      if (o.glow) { glow(ctx, 0, -10, 130, C.orange, .55); }
      ctx.beginPath(); ctx.moveTo(-34, 50); ctx.quadraticCurveTo(-36, -2, 0, -6); ctx.quadraticCurveTo(36, -2, 34, 50); ctx.closePath(); ctx.fillStyle = suit; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(0, 16); ctx.lineTo(8, -4); ctx.fillStyle = '#F3EBDD'; ctx.fill();
      vball(ctx, 0, -30, 24, '#F2C29B', { lw: 3.5, rim: false }); ctx.beginPath(); ctx.arc(0, -34, 25, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(18, -30); ctx.quadraticCurveTo(0, -46, -20, -28); ctx.closePath(); ctx.fillStyle = hair; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      circle(ctx, 8, -30, 3, INK); circle(ctx, -6, -30, 3, INK); ctx.restore(); };
    // conselheiros nas laterais e na cabeceira
    bust(0, -64, .8, '#2C3352', '#4A3426');
    [[-205, -16, .9, '#3A3A48', '#2A1E18'], [-262, 56, 1, '#2C3352', '#C9A060'], [-318, 128, 1.1, '#4A2E2E', '#1A1412'], [205, -16, .9, '#38404A', '#8A5A3A'], [262, 56, 1, '#2C3352', '#3A2A20']].forEach(b => bust(...b));
    // Analytics ganha a cadeira
    const a = E.outBack(clamp(p * 1.6 - .2)); if (a > 0) { ctx.save(); ctx.translate(318, 128); ctx.scale(a, a); bust(0, 0, 1.1, C.orange, C.yellow, { glow: true }); pill(ctx, 0, -100, 'Analytics', { size: 26, fill: C.yellow, weight: 900, rot: -.05 }); ctx.restore(); }
    // mesa em perspectiva
    ctx.beginPath(); ctx.moveTo(-150, -34); ctx.lineTo(150, -34); ctx.lineTo(300, 160); ctx.lineTo(-300, 160); ctx.closePath();
    const g = ctx.createLinearGradient(0, -34, 0, 160); g.addColorStop(0, '#9A6440'); g.addColorStop(1, '#5A3420'); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = '#3A2214'; ctx.beginPath(); ctx.moveTo(-300, 160); ctx.lineTo(300, 160); ctx.lineTo(300, 184); ctx.lineTo(-300, 184); ctx.closePath(); ctx.fill(); ctx.stroke();
    [[-150, 20], [-90, 90], [120, 10], [70, 100]].forEach(([x, y], k) => { ctx.save(); ctx.translate(x, y); ctx.rotate((k - 1.5) * .2); paper(ctx, -24, -16, 48, 32, { r: 2, fill: '#FFFDF8', shadow: 2, lw: 2, volume: false }); ctx.restore(); });
    ctx.restore();
  },
  // eficiência operacional: robozinhos automatizando as tarefas na esteira
  robots(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s);
    for (let k = 0; k < 3; k++) { ctx.save(); ctx.translate(-300 + k * 300, -170); ctx.rotate(t * (k % 2 ? -.8 : .8)); icon(ctx, 'gear', 0, 0, 90, 'rgba(255,233,214,.18)', 10); ctx.restore(); }
    pill(ctx, -300, -240, 'manual', { size: 22, fill: C.red, color: '#FFF', weight: 900 }); pill(ctx, 300, -240, 'automático', { size: 22, fill: C.yellow, weight: 900 });
    rr(ctx, -420, 100, 840, 34, 17); ctx.fillStyle = '#3A3028'; ctx.fill(); inkRect(ctx, -420, 100, 840, 34, 17, 4, 3);
    for (let k = 0; k < 15; k++) { const x = -420 + ((k * 60 + t * 90) % 840); circle(ctx, x, 117, 9, '#6A5E52', INK, 2); }
    for (let k = 0; k < 8; k++) { const x = ((t * 90 + k * 110) % 880) - 440, done = x > 60;
      ctx.save(); ctx.translate(x, 70); paper(ctx, -22, -28, 44, 56, { r: 4, fill: done ? '#F6EEDF' : '#FFD9CF', shadow: 3, lw: 2.5, volume: false });
      if (done) icon(ctx, 'check', 0, 0, 30, '#D9890B', 8); else { line(ctx, -12, -10, 12, -10, '#8A8378', 3); line(ctx, -12, 0, 8, 0, '#8A8378', 3); line(ctx, -12, 10, 12, 10, '#8A8378', 3); } ctx.restore(); }
    const n = Math.ceil(clamp(p * 1.3) * 3);
    for (let k = 0; k < n; k++) { const x = -170 + k * 170, bob = Math.sin(t * 6 + k * 2) * 6, arm = Math.max(0, Math.sin(t * 6 + k * 2));
      ctx.save(); ctx.translate(x, bob);
      vlimb(ctx, -34, -30, -46, 20 + arm * 30, 14, '#9AA3AE'); vlimb(ctx, 34, -30, 46, 20 + arm * 30, 14, '#9AA3AE');
      vslab(ctx, -36, -52, 72, 70, 16, '#B8C2CC', { lw: 3.5 }); circle(ctx, 0, -18, 10, C.orange, INK, 2.5);
      line(ctx, 0, -110, 0, -134, INK, 4); circle(ctx, 0, -138, 8, C.red, INK, 2); glow(ctx, 0, -138, 26, C.red, .5 + .5 * Math.sin(t * 8 + k));
      vball(ctx, 0, -82, 32, '#D2D9E0', { lw: 4 }); rr(ctx, -24, -92, 48, 20, 10); ctx.fillStyle = INK; ctx.fill();
      const bl = Math.floor(t * 3 + k) % 7 === 0; circle(ctx, -10, -82, bl ? 1.5 : 5, C.yellow); circle(ctx, 10, -82, bl ? 1.5 : 5, C.yellow);
      ctx.restore(); }
    ctx.restore();
  },
  // projetos user-pay: os clientes usam o ativo de Advanced Analytics e pagam pelo uso
  userpay(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s);
    const cl = [[-320, -160, 'bank', C.red], [0, -210, 'store', C.yellow], [320, -160, 'bank', '#F3EBDD'], [-330, 120, 'store', C.orange], [330, 120, 'card', C.red], [0, 175, 'store', '#F3EBDD']];
    const n = Math.ceil(clamp(p * 1.4) * cl.length);
    cl.slice(0, n).forEach(([x, y], k) => { ctx.save(); ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 30; line(ctx, x, y, 0, -10, 'rgba(255,233,214,.35)', 3); ctx.restore();
      const u = (t * .6 + k * .17) % 1; vball(ctx, lerp(x, 0, u), lerp(y, -10, u), 13, C.yellow, { lw: 2.5, rim: false }); });
    glow(ctx, 0, -10, 220, C.orange, .45);
    vslab(ctx, -120, -90, 240, 150, 40, C.orange, { lw: 4.5 }); icon(ctx, 'chart', 0, -16, 90, '#FFF', 9);
    pill(ctx, 20, 100, 'Advanced Analytics', { size: 24, fill: '#F6EEDF', weight: 900 });
    cl.slice(0, n).forEach(([x, y, ic, c], k) => { const a = E.outBack(clamp(p * 1.4 * cl.length - k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); vball(ctx, 0, 0, 40, c, { lw: 4 }); icon(ctx, ic, 0, 0, 44, c === C.red ? '#FFF' : INK, 7); ctx.restore(); });
    pill(ctx, 250, 30, 'pagamento por uso', { size: 22, fill: C.yellow, weight: 900, rot: -.03 });
    ctx.restore();
  },
  // as tracks se aproximam até as lentes se fundirem
  merge(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s); const d = lerp(260, 120, E.inOutCubic(p)), cols = [C.red, C.yellow, '#F3EBDD', C.orange];
    cols.forEach((c, k) => { const a = k / 4 * TAU + t * .15, x = Math.cos(a) * d, y = Math.sin(a) * d * .7; ctx.save(); ctx.globalAlpha *= .85; circle(ctx, x, y, 150, c); ctx.restore(); inkCircle(ctx, x, y, 150, 4, k); });
    glow(ctx, 0, 0, 200, C.orange, .5 * p + .2 * BT.level); retroText(ctx, 'Analytics', 0, 0, { size: 44, weight: 900, color: '#FFF', align: 'center', depth: 3, lw: 3 });
    ctx.restore();
  },
  // um tile vira mosaico; um deles brilha (o diferencial)
  tiles(ctx, s, t, p) {
    ctx.save(); ctx.scale(s, s); const n = Math.max(1, Math.round(lerp(1, 25, E.inCubic(p)))), g = 5, sz = 90;
    for (let k = 0; k < n; k++) { const c = k % g, r = Math.floor(k / g), x = (c - 2) * (sz + 12), y = (r - 2) * (sz + 12), hot = k === 12;
      if (hot) { holo(ctx, x - sz / 2, y - sz / 2, sz, sz, { color: C.orange }); glow(ctx, x, y, 120, C.orange, .5 + .3 * BT.level); }
      else { rr(ctx, x - sz / 2, y - sz / 2, sz, sz, 8); ctx.fillStyle = ['#3A2A1E', '#4A3426', '#2E241D'][k % 3]; ctx.fill(); inkRect(ctx, x - sz / 2, y - sz / 2, sz, sz, 8, 2.5, k); } }
    ctx.restore();
  }
};

/* ---------- 07 · O futuro de analytics: uma cidade conectada ---------- */
(() => {
  const id = 's07', DIR = TX.future, ART = ['chair', 'merge', 'tiles', 'robots', 'userpay'];
  const POS = [560, 1360, 2600, 3400, 5040], GROUP = [0, 0, 1, 1, 2], T_G = [.6, 9.4, 18.2], CAMX = [960, 3000, 5040], RAIL = 900;
  const CAM = [[0, 960, 540, 1.06], [2.4, 960, 540, 1], [9.0, 960, 540, 1], [9.9, 3000, 540, 1], [17.8, 3000, 540, 1], [18.7, 5040, 540, 1], [23.6, 5040, 540, 1], [26.4, 5560, 540, 1.04]];
  T_G.forEach((t0, g) => cue(id, t0 + .2, g ? 'whoosh' : 'chime', g ? { dur: .9, v: .3 } : { f: 784, up: 7 })); DIR.forEach((d, i) => cue(id, T_G[GROUP[i]] + .5 + (i % 2) * .7, 'pop', { p: 1 + i * .06, v: .2 }));
  const SCRIPT = SAY.reg(id, [
    [3.8, 26.6, 'title', 'Para onde a *linha* segue'],
    [T_G[2] + 1.6, 26.6, 'note', 'Entregas analíticas com *contratação definida* para cada projeto.', { x: 1580, y: 470, w: 540, size: 30, weight: 800 }]
  ]);
  SAY.reg(id, DIR.map((d, i) => [T_G[GROUP[i]] + .5 + (i % 2) * .7, [9.4, 18.2, 26.4][GROUP[i]], 'label', d.title + ' ' + d.sub]));
  function panelArt(ctx, t, i) {
    const g = GROUP[i], t0 = T_G[g] + .5 + (i % 2) * .7, p = E.outBack(P(t, t0, .6)), x = POS[i], y = 480; if (p <= 0) return;
    ctx.save(); ctx.translate(x, y + (1 - p) * 60); ctx.globalAlpha *= clamp(p);
    holo(ctx, -330, -230, 660, 420, { color: [C.orange, C.red, C.yellow, C.orange, C.yellow][i] });
    ctx.save(); ctx.beginPath(); ctx.rect(-320, -220, 640, 400); ctx.clip(); FUTURE_ART[ART[i]](ctx, i === 0 ? .62 : .58, t, clamp((t - t0) / 3)); ctx.restore();
    ctx.restore();
    pin(ctx, x, y + 200, c => { c.globalAlpha *= clamp(p); c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12; text(c, DIR[i].title, 0, 46, { size: 40, weight: 900, color: '#FFF', align: 'center' }); text(c, DIR[i].sub, 0, 92, { size: 32, weight: 800, color: C.yellow, align: 'center' }); });
    // a estação desta direção na linha
    circle(ctx, x, RAIL, 26, '#FFF8EE', INK, 6); icon(ctx, 'spark', x, RAIL, 30, C.orange, 5);
  }
  SCENES[id] = {
    themeAt: () => 'dark', script: SCRIPT, peaks: [[4.6, 5.6, .5], [T_G[2] - .1, T_G[2] + 1, .4]],
    draw(ctx, t) {
      const cam = camKey(t, CAM);
      ctx.drawImage(TEX.dark, 0, 0); const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#120C1C'); sky.addColorStop(.7, '#3A1E2A'); sky.addColorStop(1, '#120A08'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      layer(ctx, cam, 0, () => { sun(ctx, W / 2 + 240, 700, 260, t); for (let k = 0; k < 50; k++) circle(ctx, hash(k * 3.3) * W, hash(k * 8.1) * 420, 1.3 + hash(k) * 1.4, rgba('#FFF4DC', .4 + .4 * Math.sin(t * 2 + k))); });
      layer(ctx, cam, .2, () => skyline(ctx, t, { y: 900, h: 520, seed: 101, col: '#1C1220', lit: .55 }));
      layer(ctx, cam, .45, () => { skyline(ctx, t, { y: 980, h: 360, seed: 113, col: '#120C10', lit: .4 }); skyline(ctx, t, { y: 980, h: 360, seed: 113, col: '#120C10', lit: .4, x: 2120 }); });
      layer(ctx, cam, 1, () => {
        const g = ctx.createLinearGradient(0, RAIL, 0, H); g.addColorStop(0, '#24160E'); g.addColorStop(1, '#0C0806'); ctx.fillStyle = g; ctx.fillRect(-800, RAIL - 10, 7600, 400);
        const lp = clamp(t / 25.4); LINE.draw(ctx, [[-600, RAIL], [6200, RAIL]], lp, { w: 22, head: true, glow: 14 });
        // as outras linhas (tracks) chegando à cidade, atrás dos painéis
        [[C.red, -300, 160], [C.yellow, 2200, 120], ['#E9DCC8', 4300, 180]].forEach(([col, x0, y0], k) => { const p = E.inOutSine(P(t, T_G[Math.min(k, 2)] + 1.2, 2)); LINE.draw(ctx, [[x0, y0], [x0 + 500, 500], [x0 + 860, RAIL]], p, { w: 10, col, shadow: false, alpha: .45 }); });
        for (let i = 0; i < 5; i++) panelArt(ctx, t, i);
        // uma estação ainda em aberto
        const op = P(t, 23.2, .8); if (op > 0) { const x = 5760; ctx.save(); ctx.globalAlpha *= op; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 30; circle(ctx, x, RAIL, 46, 'rgba(255,255,255,.06)', C.yellow, 5); ctx.restore();
          pin(ctx, x, RAIL, c => { c.globalAlpha *= op; text(c, '?', 0, 4, { size: 54, weight: 900, color: C.yellow, align: 'center' }); text(c, 'a próxima estação', 0, -90, { size: 30, weight: 900, color: '#FFF', align: 'center' }); }); }
        // a analista caminha pela cidade, ao longo da linha
        const gx = cam.x - 520 + 40 * Math.sin(t * .5); PEOPLE.draw(ctx, gx, RAIL + 150, .62, t > 23.6 ? PEOPLE.point(E.outCubic(P(t, 23.6, .5)), PEOPLE.POSE.stand) : PEOPLE.walk(t * 14), { dir: 1, t, phones: 'neck', mood: 'happy' });
      });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- clímax: as 8 disciplinas entram e ficam (painel para ler) → Analytics & Advanced Analytics ---------- */
(() => {
  const id = 'climax', VZ = ['gaussian', 'lp', 'classification', 'clusters', 'nlp', 'mlp', 'transformer', 'agents'], N = TX.climaxWords.length;
  const T_IN = k => .6 + k * 1.2, T_KEY = 14.4, TW = 410, TH = 330, TX0 = 105, TY0 = 250;
  for (let k = 0; k < N; k++) cue(id, T_IN(k), 'hit', { size: .3 + k * .04 }); cue(id, T_KEY, 'impact', { size: 1 }); cue(id, T_KEY, 'combo');
  const SCRIPT = SAY.reg(id, [[.3, T_KEY - .1, 'title', 'Por trás de tudo, *disciplinas*']]);
  SAY.reg(id, TX.climaxWords.map((w, k) => [T_IN(k), T_KEY, 'label', w + ' ' + TX.climaxSub[k]]));
  SAY.reg(id, [[T_KEY + .2, 19.4, 'big', TX.climaxKey]]);
  SCENES[id] = {
    peaks: [[0, 19.2, .45], [T_KEY - .1, T_KEY + 1.6, 1]], script: SCRIPT,
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#2E1A0C' }); neonGrid(ctx, t, { horizon: 960, alpha: .3, speed: 1 });
      const dim = 1 - .7 * E.inOutCubic(P(t, T_KEY, .6));
      for (let k = 0; k < N; k++) {
        const p = P(t, T_IN(k), .5); if (p <= 0) continue; const c = k % 4, r = Math.floor(k / 4), x = TX0 + c * (TW + 24), y = TY0 + r * (TH + 30), light = (c + r) % 2 === 1, s = lerp(1.25, 1, E.outExpo(p));
        ctx.save(); ctx.globalAlpha *= clamp(p * 2) * dim; ctx.translate(x + TW / 2, y + TH / 2); ctx.scale(s, s); ctx.translate(-TW / 2, -TH / 2);
        if (light) paper(ctx, 0, 0, TW, TH, { r: 16, fill: '#FFFDF8', shadow: 10, shadowColor: '#000', lw: 3.5 }); else holo(ctx, 0, 0, TW, TH, { color: [C.orange, C.red, C.yellow][k % 3] });
        VIZ[VZ[k]](ctx, 24, 20, TW - 48, 180, E.outCubic(clamp((t - T_IN(k)) / 1.4)), { t, theme: light ? 'light' : 'dark' });
        const nm = TX.climaxWords[k], sub = TX.climaxSub[k], col = light ? INK : '#FFF';
        late(ctx, cc => { const fs = Math.min(32, (TW - 30) / Math.max(1, measure(cc, nm, 32, 900)) * 32); text(cc, nm, TW / 2, 238, { size: fs, weight: 900, color: col, align: 'center' });
          para(cc, sub, TW / 2, 262, TW - 40, { size: 23, weight: 700, color: light ? '#4A4038' : '#F3E6D6', align: 'center', lh: 1.12 }); });
        ctx.restore();
        if (t - T_IN(k) < .08) flash(ctx, (1 - (t - T_IN(k)) / .08) * .25, '#FFF8EE');
      }
      if (t >= T_KEY) { const p = P(t, T_KEY, .5); glow(ctx, W / 2, H / 2, 700, C.orange, .35 + .25 * BT.level);
        [[460, 360, 160, C.red], [1460, 420, 190, C.orange], [960, 780, 140, C.yellow]].forEach(([x, y, r, cc], i) => splat(ctx, x, y, r, cc, 140 + i, E.outBack(P(t, T_KEY + i * .08, .35)), .8));
        hud(ctx, c => { c.translate(W / 2, H / 2); const s = lerp(1.6, 1, E.outExpo(p)) * (1 + .02 * BT.beat); c.scale(s, s);
          const [k1, k2] = TX.climaxKey.split(/\s(?=\*)/); c.shadowColor = '#000'; c.shadowBlur = 20; text(c, k1, 0, -80, { size: 64, weight: 900, color: '#FFE9D6', align: 'center' });
          rich(c, k2 || '', 0, 30, { size: 100, weight: 900, color: '#FFF', retro: true, depth: 7, lw: 5 }); }, p); }
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- letreiro final (split-flap) + encerramento ---------- */
const CLOSE = (() => {
  const id = 'close', FL = TX.flap, T_F = [1.2, 5.0, 9.0, 13.2], T_CHORD = 14.08, HI = [11, 11, 11, FL[3].indexOf(' ') + 1];
  T_F.forEach((t0, k) => { cue(id, t0, 'type', { n: 26, gap: .024 }); }); cue(id, T_CHORD, 'combo'); cue(id, T_CHORD, 'shimmer', { dur: 2.5 });
  /** quadro do letreiro; t = tempo desde o início do letreiro (as paradas usam t grande = letreiro pronto) */
  function draw(ctx, t, o = {}) {
    if (o.bg !== false) { bgDark(ctx, t, { centerA: .9, center: '#3A2416' }); collage(ctx, t, { seed: 131, n: 6, theme: 'dark', alpha: .7 }); }
    const gA = t > T_CHORD ? E.outCubic(P(t, T_CHORD, .8)) : 0, br = o.breath == null ? 0 : o.breath;
    glow(ctx, W / 2, 300, 560, C.orange, .2 + .25 * gA + .15 * br + .15 * BT.level);
    const meet = E.inOutCubic(P(t, .2, 1.2));
    intersection(ctx, W / 2, 300, 150, lerp(1400, 190, meet), { hot: Math.exp(-Math.max(0, t - T_CHORD) * 1.6) * (t > T_CHORD) * .8 + .15 * br });
    [[380, 300, 140, C.red], [1540, 330, 160, C.yellow]].forEach(([x, y, r, c], i) => splat(ctx, x, y, r, c, 300 + i, E.outBack(P(t, T_CHORD + i * .06, .35)), .8));
    const b = FLAP.board(ctx, W / 2, 680, FL, T_F, o.flicker ? t : Math.min(t, 40), { tw: 70, th: 104, hiFrom: HI, header: 'PRÓXIMA PARADA', headerCol: C.red, glowA: gA });
    if (gA > 0) { ctx.save(); ctx.globalAlpha *= gA; rr(ctx, b.x, b.y - 40, b.w, b.h + 40, 18); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.shadowColor = C.orange; ctx.shadowBlur = 24 + 16 * br; ctx.stroke(); ctx.restore(); }
    text(ctx, ((DATA.presentation_context || {}).organization || 'Mastercard Advisors').toUpperCase() + '  ·  PERFORMANCE ANALYTICS', W / 2, 860, { size: 22, weight: 800, mono: true, color: '#E9DDCC', align: 'center', ls: 5, alpha: gA });
    scanlines(ctx, .06);
  }
  SCENES[id] = { themeAt: () => 'dark', fx: { chroma: .7 }, draw(ctx, t) { draw(ctx, t); },
    peaks: [[T_CHORD - .1, T_CHORD + 1.8]],
    caps: [[T_F[0] + .3, T_F[1] - .1, 'Bem-vindos ao *futuro*', 'PRÓXIMA PARADA'], [T_F[1] + .3, T_F[2] - .1, 'Bem-vindos à *IA*', 'PRÓXIMA PARADA'],
      [T_F[2] + .3, T_F[3] - .1, 'Bem-vindos a *analytics*', 'PRÓXIMA PARADA'], [T_CHORD + .4, 26.4, 'Obrigado! Agora a conversa é com *vocês*', 'FIM DA LINHA']] };
  return { draw, T_CHORD };
})();

STOPSCN.end = {
  draw(ctx, tl, item, prevItem, p, ui) {
    BT = { ...BT, level: .25 + .2 * BT.breath };
    platform(ctx, tl, { led: true, people: true }); ctx.save(); ctx.fillStyle = 'rgba(12,9,7,.55)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    CLOSE.draw(ctx, 40 + tl, { breath: BT.breath, bg: false });
  },
  ui(ctx, tl, item, prevItem, p, ui) {
    ui = ui || { hover: null, pop: null, prevPop: null, popP: 1 };
    const show = item === 1 ? E.inOutCubic(p) : prevItem === 1 ? 1 - E.inOutCubic(p) : 0, L = slideRects(7), ph = L.top - 90, pw = ph * .78;
    if (show > 0) { ctx.save(); ctx.fillStyle = rgba('#0B0807', .7 * show); ctx.fillRect(0, 0, W, H); HUD.begin(); poster(ctx, W / 2, 40 + ph / 2 + (1 - show) * 700, pw, ph, 7, tl, { rot: -.01 }); HUD.flush(ctx); ctx.restore(); slideStrip(ctx, 7, show, ui); SLIDE.pump(); }
    if (item === 1) slidePopup(ctx, 7, ui);
    if (!item) text(ctx, 'clique no letreiro para rever a estação 07', W / 2, H - 46, { size: 22, weight: 700, mono: true, color: '#FFF', align: 'center', ls: 2, alpha: .4 + .2 * Math.sin(tl * 2.4) });
    hint(ctx, tl, item === 0 ? '→' : '←');
  },
  hit(x, y, ui) {
    if (!__state.item) return { poster: 0 };
    if (ui.pop != null) return popupHit(7, x, y, ui);
    for (const r of slideRects(7).rects) if (x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h + 30) return { thumb: r.i };
    return { back: true };
  },
  click(tg, ui, ctl) {
    if (tg && tg.pop) return popupAct(7, tg, ui, ctl);
    if (tg && tg.poster != null) { ctl.setItem(1); return true; }
    if (tg && tg.thumb != null) { ctl.popup(tg.thumb); return true; }
    if (tg && tg.back) { ctl.setItem(0); return true; }
    return true;
  },
  key(k, ui, ctl) { if (__state.item && popupKey(7, k, ui, ctl)) return true; if (k === 'Escape' && __state.item) { ctl.setItem(0); return true; } return false; }
};
/* cartaz 07: as 5 direções e a base */
POSTERS[7] = (ctx, w, h, tl) => {
  TX.future.forEach((d, i) => { const y = -220 + i * 82, on = Math.floor(tl / 2.2) % 5 === i; rr(ctx, -210, y - 34, 420, 70, 10); ctx.fillStyle = on ? C.yellow : '#FFFDF8'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
    late(ctx, c => { text(c, d.title, -190, y - 10, { size: 22, weight: 900, color: INK }); text(c, d.sub, -190, y + 16, { size: 18, weight: 700, color: '#3A332C' }); }); });
  late(ctx, c => para(c, 'Base: estatística, otimização, machine learning e IA.', 0, 196, 420, { size: 20, weight: 800, color: '#8A6A48', align: 'center' }));
};
