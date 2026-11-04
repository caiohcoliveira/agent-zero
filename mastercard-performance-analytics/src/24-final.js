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
  const id = 's07', DIR = TX.future, ART = ['chair', 'merge', 'robots', 'tiles', 'userpay'];   // a grade que cresce (tiles) é o ganho de escala
  const POS = [560, 1360, 2600, 3400, 5040], GROUP = [0, 0, 1, 1, 2], T_G = [.6, 9.4, 18.2].map(t => onBeat(id, t)), CAMX = [960, 3000, 5040], RAIL = 900;
  const T_P = DIR.map((d, i) => beatsFrom(id, T_G[GROUP[i]] + .5, i % 2));   // cada painel numa batida (o segundo do grupo, uma batida depois)
  /** posição da frente do trem: anda constante (268 px/s) pela cidade e freia nos últimos 3 s, parando junto da estação "?" (5760) */
  const trainX = t => { const v = 268.1, t1 = 22, d = 3; if (t <= t1) return -600 + v * t; const u = Math.min(t - t1, d); return -600 + v * t1 + v * u - v * u * u / (2 * d); };
  const CAM = [[0, 960, 540, 1.06], [2.4, 960, 540, 1], [9.0, 960, 540, 1], [9.9, 3000, 540, 1], [17.8, 3000, 540, 1], [18.7, 5040, 540, 1], [23.6, 5040, 540, 1], [26.4, 5560, 540, 1.04]];
  T_G.forEach((t0, g) => cue(id, t0 + .2, g ? 'whoosh' : 'chime', g ? { dur: .9, v: .3 } : { f: 784, up: 7 })); DIR.forEach((d, i) => cue(id, T_P[i], 'pop', { p: 1 + i * .06, v: .2 }));
  const SCRIPT = SAY.reg(id, [
    [3.8, 26.6, 'title', 'Para onde a *linha* segue'],
    [T_G[2] + 1.6, 26.6, 'note', 'Entregas analíticas com *contratação definida* para cada projeto.', { x: 1580, y: 470, w: 540, size: 30, weight: 800 }]
  ]);
  SAY.reg(id, DIR.map((d, i) => [T_P[i], [9.4, 18.2, 26.4][GROUP[i]], 'label', d.title + ' ' + d.sub]));
  function panelArt(ctx, t, i) {
    const g = GROUP[i], t0 = T_P[i], p = E.outBack(P(t, t0, .6)), x = POS[i], y = 480; if (p <= 0) return;
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
        const xt = trainX(t); LINE.draw(ctx, [[-600, RAIL], [6200, RAIL]], (xt + 600) / 6800, { w: 22, head: false, glow: 14 });
        // as outras linhas (tracks) chegam alinhadas: paralelas à linha laranja, por baixo dela, e sobem a 45° para encontrá-la na estação
        [[C.red, 1360], [C.yellow, 3400], ['#E9DCC8', 5040]].forEach(([col, xm], k) => { const p = E.inOutSine(P(t, T_G[k] + 1.2, 2)), yk = RAIL + 44;
          LINE.draw(ctx, [[xm - 1500, yk], [xm - 130 - (yk - RAIL), yk], [xm - 130, RAIL]], p, { w: 10, col, shadow: false, alpha: .6, head: false }); });
        for (let i = 0; i < 5; i++) panelArt(ctx, t, i);
        // uma estação ainda em aberto
        const op = P(t, 23.2, .8); if (op > 0) { const x = 5760; ctx.save(); ctx.globalAlpha *= op; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 30; circle(ctx, x, RAIL, 46, 'rgba(255,255,255,.06)', C.yellow, 5); ctx.restore();
          pin(ctx, x, RAIL, c => { c.globalAlpha *= op; text(c, '?', 0, 4, { size: 54, weight: 900, color: C.yellow, align: 'center' }); text(c, 'a próxima estação', 0, -90, { size: 30, weight: 900, color: '#FFF', align: 'center' }); }); }
        // o trem da linha puxa o traço laranja pela cidade e para na próxima estação
        sideTrain(ctx, xt, RAIL - 11);
      });
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- clímax (v7.11): 5 cases entram nos compassos e viram — frente: case | método; verso: técnicas → Analytics & Advanced Analytics ---------- */
(() => {
  const id = 'climax', CC = TX.climaxCases, N = CC.length, VZ = ['ab', 'classification', 'clusters', 'forecast', 'lp'], COL = [C.orange, C.red, C.yellow, '#E8822A', C.red];
  // cada card entra num tempo forte (um por compasso desde que a batida começa, 3,57) e vira 2 tempos depois;
  // todos ficam virados para leitura até a frase-chave no grande ataque (20,37)
  const T_IN = k => onBeat(id, 3.57 + 2.4 * k, 'bar'), T_FLIP = k => beatsFrom(id, T_IN(k), 2), T_KEY = onBeat(id, 20.37, 'bar');
  const TW = 330, TH = 470, GAP = 22, TX0 = (W - (N * TW + (N - 1) * GAP)) / 2, TY0 = 322;
  for (let k = 0; k < N; k++) { cue(id, T_IN(k), 'hit', { size: .3 + k * .05 }); cue(id, T_FLIP(k), 'whoosh', { dur: .3, v: .18 }); }
  cue(id, T_KEY, 'impact', { size: 1 }); cue(id, T_KEY, 'combo');
  // v7.12: o eixo da v5 — as técnicas do mais simples ao mais complexo, acesas por uma varredura até o último tempo forte (25,17)
  const AXT = [['Estatística', 'gaussian'], ['Regressão', 'regression'], ['Séries temporais', 'forecast'], ['Otimização', 'lp'], ['Clusters', 'clusters'], ['Árvores', 'tree'],
    ['Gradient boosting', 'ensemble'], ['Recomendação', 'recommend'], ['Embeddings', 'embeddings'], ['Redes neurais', 'mlp'], ['Transformers', 'transformer'], ['Agentes de IA', 'agents']];
  const AX0 = 180, AX1 = 1740, AY = 820, axX = k => AX0 + k * (AX1 - AX0) / (AXT.length - 1), CW = 128, CH = 118;
  const T_AX = T_KEY + .5, T_SW0 = T_KEY + .9, T_SW1 = onBeat(id, 25.17, 'bar'), SWX = u => lerp(AX0 - 50, AX1 + 50, E.inOutSine(u));
  const T_LIT = AXT.map((_, k) => T_SW0 + Math.acos(1 - 2 * clamp((axX(k) - AX0 + 50) / (AX1 - AX0 + 100))) / Math.PI * (T_SW1 - T_SW0));
  cue(id, T_SW0, 'riser', { dur: T_SW1 - T_SW0, v: .22 }); T_LIT.forEach((t0, k) => cue(id, t0, 'tick', { f: 1400 + k * 90, v: .12 })); cue(id, T_SW1, 'shimmer', { dur: 1.2 });
  const SCRIPT = SAY.reg(id, [[.3, T_KEY - .1, 'title', 'Por trás de tudo, *métodos* e *técnicas*']]);
  SAY.reg(id, CC.map((c, k) => [T_IN(k), T_KEY + .3, 'label', c.name + ' · ' + c.method]));     // o nome do case fica nos dois lados do card
  SAY.reg(id, CC.map((c, k) => [T_FLIP(k), T_KEY + .3, 'label', c.tech.join(', ')]));
  SAY.reg(id, [[T_KEY + .2, 26.6, 'big', TX.climaxKey], [T_AX, 26.6, 'label', 'do mais simples ao mais complexo']]);
  /** teste A/B: duas distribuições (A e B) e a diferença entre as médias */
  function abViz(ctx, x, y, w, h, p) {
    const bell = (m, s, col, fill) => { ctx.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60, px = x + u * w, py = y + h - Math.exp(-((u - m) ** 2) / (2 * s * s)) * h * .85 * p; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fillStyle = rgba(col, fill); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); };
    line(ctx, x, y + h, x + w, y + h, '#8A8378', 2); bell(.38, .12, '#8A8378', .18); bell(.6, .12, C.orange, .22);
    if (p > .6) { const a = clamp((p - .6) * 3); [[.38, 'A', '#6A6056'], [.6, 'B', C.orange]].forEach(([m, l, col]) => { ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([5, 5]); line(ctx, x + m * w, y + h * .1, x + m * w, y + h, col, 2); ctx.restore();
      late(ctx, c => { c.globalAlpha *= a; text(c, l, x + m * w, y + 2, { size: 20, weight: 900, color: col, align: 'center' }); }); }); }
  }
  function front(ctx, k, t, c) {
    paper(ctx, 0, 0, TW, TH, { r: 18, fill: '#FFFDF8', shadow: 10, shadowColor: '#000', lw: 3 });
    rr(ctx, 0, 0, TW, 12, 6); ctx.fillStyle = COL[k]; ctx.fill();
    const vp = E.outCubic(clamp((t - T_IN(k)) / 1.2));
    if (VZ[k] === 'ab') abViz(ctx, 30, 56, TW - 60, 150, vp); else VIZ[VZ[k]](ctx, 26, 40, TW - 52, 180, vp, { t, theme: 'light' });
    late(ctx, cc => { para(cc, c.name, TW / 2, 248, TW - 44, { size: 30, weight: 900, color: INK, align: 'center', lh: 1.08 });
      tag(cc, TW / 2, 400, c.method, { size: fitSize(cc, c.method, 24, TW - 70), fill: COL[k], color: COL[k] === C.yellow ? INK : '#FFF' }); });
  }
  function back(ctx, k, c) {
    rr(ctx, 8, 12, TW, TH, 18); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill();
    rr(ctx, 0, 0, TW, TH, 18); ctx.fillStyle = '#1C1612'; ctx.fill(); ctx.strokeStyle = COL[k]; ctx.lineWidth = 4; ctx.stroke();
    // cabeçalho com a MESMA altura em todos os cards (a do nome mais longo): nome encostado no método; divisória e lista alinhadas
    late(ctx, cc => { const nh = Math.max(...CC.map(q => wrapRich(cc, q.name, TW - 52, 24, 900).lines.length)) * 24 * 1.08, own = wrapRich(cc, c.name, TW - 52, 24, 900).lines.length * 24 * 1.08;
      para(cc, c.name, 26, 30 + nh - own, TW - 52, { size: 24, weight: 900, color: '#FFF', lh: 1.08 });
      text(cc, c.method.toUpperCase(), 26, 46 + nh, { size: fitSize(cc, c.method.toUpperCase(), 17, TW - 52, 800), weight: 800, mono: true, color: COL[k] === C.red ? '#FF8A7A' : COL[k], ls: 1 });
      line(cc, 26, 70 + nh, TW - 26, 70 + nh, 'rgba(243,230,214,.25)', 2);
      c.tech.forEach((s, i) => { const y = 108 + nh + i * 62; circle(cc, 38, y, 7, COL[k]); para(cc, s, 58, y - 15, TW - 84, { size: 24, weight: 800, color: '#F3E6D6', lh: 1.05 }); });
      if (c.etc) text(cc, 'e outras técnicas', 58, 108 + nh + c.tech.length * 62, { size: 21, weight: 700, color: '#BFB3A3' }); });
  }
  SCENES[id] = {
    peaks: [[0, 26.4, .45], [T_KEY - .1, T_KEY + 1.6, 1]], script: SCRIPT,
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .9, center: '#2E1A0C' });
      // na frase-chave os cards saem (encolhem e somem): ficam a frase e o eixo das técnicas
      const kd = E.inOutCubic(P(t, T_KEY, .6)), dim = 1 - kd;
      for (let k = 0; k < N; k++) {
        const p = P(t, T_IN(k), .5); if (p <= 0) continue;
        const f = E.inOutCubic(P(t, T_FLIP(k), .5)), sx = Math.max(.02, Math.abs(Math.cos(f * Math.PI))), lift = 1 + .06 * Math.sin(f * Math.PI), s = lerp(1.15, 1, E.outExpo(p)) * lift * (1 - .08 * kd);
        const x = TX0 + k * (TW + GAP), y = TY0 + (1 - E.outCubic(p)) * 40;
        ctx.save(); ctx.globalAlpha *= clamp(p * 2) * dim; ctx.translate(lerp(x + TW / 2, W / 2, .06 * kd), lerp(y + TH / 2, H / 2, .06 * kd)); ctx.scale(s * sx, s); ctx.translate(-TW / 2, -TH / 2);
        if (f < .5) front(ctx, k, t, CC[k]); else back(ctx, k, CC[k]);
        ctx.restore();
      }
      if (t >= T_KEY) { const p = P(t, T_KEY, .5), end = P(t, T_SW1, .5);
        glow(ctx, W / 2, 330, 640, C.orange, .26 + .14 * BT.level + .2 * end);
        hud(ctx, c => { c.translate(W / 2, 330); const s = lerp(1.3, 1, E.outExpo(p)) * (1 + .05 * Math.sin(Math.PI * end)); c.scale(s, s);
          const [k1, k2] = TX.climaxKey.split(/\s(?=\*)/); text(c, k1, 0, -80, { size: 64, weight: 900, color: '#FFE9D6', align: 'center' });
          rich(c, k2 || '', 0, 30, { size: 110, weight: 900, color: '#FFF', accent: C.orange }); }, P(t, T_KEY + .2, .45));
        // o eixo: as técnicas, da mais simples à mais complexa; a varredura acende uma a uma
        const ax = P(t, T_AX, .6), sw = clamp((t - T_SW0) / (T_SW1 - T_SW0)), sx = SWX(sw);
        if (ax > 0) { ctx.save(); ctx.globalAlpha *= ax;
          line(ctx, AX0, AY, AX1, AY, 'rgba(245,241,234,.22)', 4); if (sw > 0) line(ctx, AX0, AY, Math.min(Math.max(sx, AX0), AX1), AY, C.orange, 6);
          circle(ctx, AX0, AY, 10, C.cream); circle(ctx, AX1, AY, 10, sw >= 1 ? C.orange : '#5A4E44');
          AXT.forEach(([nm, vz], k) => { const x = axX(k), pop = E.outBack(P(t, T_AX + k * .06, .4)), lit = t >= T_LIT[k]; if (pop <= 0) return;
            line(ctx, x, AY - 18, x, AY, lit ? C.orange : 'rgba(245,241,234,.25)', 3);
            ctx.save(); ctx.translate(x, AY - 30 - CH / 2); ctx.scale(pop, pop); ctx.globalAlpha *= lit ? 1 : .42;
            rr(ctx, -CW / 2, -CH / 2, CW, CH, 12); ctx.fillStyle = '#1C1612'; ctx.fill(); ctx.strokeStyle = lit ? C.orange : 'rgba(245,241,234,.3)'; ctx.lineWidth = 3; ctx.stroke();
            ctx.save(); rr(ctx, -CW / 2, -CH / 2, CW, CH, 12); ctx.clip(); VIZ[vz](ctx, -CW / 2 + 12, -CH / 2 + 8, CW - 24, 58, lit ? 1 : .6, { t, theme: 'dark' }); ctx.restore();
            late(ctx, c => para(c, nm, 0, 14, CW - 14, { size: 16, weight: 800, color: lit ? '#FFF' : '#BFB3A3', align: 'center', lh: 1.05 }));
            ctx.restore(); });
          if (sw > 0 && sw < 1) { glow(ctx, sx, AY - 90, 200, C.orange, .45); line(ctx, sx, AY - 200, sx, AY + 16, 'rgba(255,230,200,.9)', 4); }
          ctx.restore();
          late(ctx, c => { c.globalAlpha *= ax; text(c, 'mais simples', AX0, AY + 46, { size: 26, weight: 800, mono: true, color: '#E9DCC8', align: 'center' });
            text(c, 'mais complexo', AX1, AY + 46, { size: 26, weight: 800, mono: true, color: C.orange, align: 'center' });
            text(c, 'do mais simples ao mais complexo', W / 2, 560, { size: 34, weight: 800, color: '#E9DCC8', align: 'center' }); }); } }
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- letreiro final (split-flap) + encerramento ---------- */
const CLOSE = (() => {
  // T_CHORD: o letreiro acende no prato da cadência final da parte 3 (67,17 s do play); a última placa vira no primeiro tempo dela
  const id = 'close', FL = TX.flap, T_F = [1.2, 5.0, 9.0, 13.2], T_CHORD = 14.37, HI = [11, 11, 11, FL[3].indexOf(' ') + 1];
  T_F.forEach((t0, k) => { cue(id, t0, 'type', { n: 26, gap: .024 }); }); cue(id, T_CHORD, 'combo'); cue(id, T_CHORD, 'shimmer', { dur: 2.5 });
  /** quadro do letreiro; t = tempo desde o início do letreiro (as paradas usam t grande = letreiro pronto) */
  function draw(ctx, t, o = {}) {
    if (o.bg !== false) { bgDark(ctx, t, { centerA: .9, center: '#3A2416' }); collage(ctx, t, { seed: 131, n: 6, theme: 'dark', alpha: .7 }); }
    const gA = t > T_CHORD ? E.outCubic(P(t, T_CHORD, .8)) : 0, br = o.breath == null ? 0 : o.breath;
    glow(ctx, W / 2, 300, 560, C.orange, .2 + .25 * gA + .15 * br + .15 * BT.level);
    const meet = E.inOutCubic(P(t, .2, 1.2));
    intersection(ctx, W / 2, 300, 150, lerp(1400, 190, meet), { hot: Math.exp(-Math.max(0, t - T_CHORD) * 1.6) * (t > T_CHORD) * .8 + .15 * br });
    const b = FLAP.board(ctx, W / 2, 680, FL, T_F, o.flicker ? t : Math.min(t, 40), { tw: 70, th: 104, hiFrom: HI, glowA: gA });
    if (gA > 0) { ctx.save(); ctx.globalAlpha *= gA; rr(ctx, b.x - 4, b.y - 4, b.w + 8, b.h + 8, 21); /* v7.13: a borda acompanha o letreiro */ ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.shadowColor = C.orange; ctx.shadowBlur = 24 + 16 * br; ctx.stroke(); ctx.restore(); }
    text(ctx, ((DATA.presentation_context || {}).organization || 'Mastercard Advisors').toUpperCase() + '  ·  PERFORMANCE ANALYTICS', W / 2, 860, { size: 22, weight: 800, mono: true, color: '#E9DDCC', align: 'center', ls: 5, alpha: gA });
    scanlines(ctx, .06);
  }
  SCENES[id] = { themeAt: () => 'dark', fx: { chroma: .7 }, draw(ctx, t) { draw(ctx, t); },
    peaks: [[T_CHORD - .1, T_CHORD + 1.8]],
    caps: [[T_F[0] + .3, T_F[1] - .1, 'Bem-vindos ao *futuro*'], [T_F[1] + .3, T_F[2] - .1, 'Bem-vindos à *IA*'],
      [T_F[2] + .3, T_F[3] - .1, 'Bem-vindos a *analytics*'], [T_CHORD + .4, 18.77, 'Obrigado! Agora a conversa é com *vocês*', 'FIM DA LINHA']] };
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
    if (show > 0) { ctx.save(); ctx.fillStyle = rgba('#0B0807', .7 * show); ctx.fillRect(0, 0, W, H); HUD.begin(ctx); poster(ctx, W / 2, 40 + ph / 2 + (1 - show) * 700, pw, ph, 7, tl, { cables: false }); HUD.flush(ctx); ctx.restore(); slideStrip(ctx, 7, show, ui); SLIDE.pump(); }
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
