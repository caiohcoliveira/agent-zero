/* ============================================================================
   20. PRÉ-SHOW · EMBARQUE (play 1) · CONVERSA 0 (mapa da linha)
   ----------------------------------------------------------------------------
   v7: o bilhete já diz por que estamos embarcando.
     0–6 s   IDENTIDADE  painel de partidas "PERFORMANCE ANALYTICS" + a missão escrita;
                         a analista chega à plataforma com o bilhete; o trem encosta
     6–13 s  PROPÓSITO   as portas abrem, ela embarca; o bilhete em close (DE dados →
                         PARA valor) é carimbado; a câmera mergulha na porta
     14–20 s PERCURSO    o mapa da linha, com os 3 capítulos escritos
   ========================================================================== */

/* ---------- pré-show (loop de espera) ---------- */
STOPSCN.preshow = {
  draw(ctx, tl) {
    const br = BT.breath, ctxTitle = (DATA.presentation_context || {});
    platform(ctx, tl, { sign: 'PLATAFORMA 1', people: true });
    ctx.save(); ctx.fillStyle = 'rgba(10,7,5,.38)'; ctx.fillRect(0, 210, W, 620); ctx.restore();
    intersection(ctx, W / 2, 310, 80, 104, { hot: .25 + .25 * br });
    paintTitle(ctx, 'PERFORMANCE ANALYTICS', W / 2, 496, { size: 104, bg: C.orange, seed: 7, p: 1 });
    const tt = tl % 16, ph = [TX.line, TX.stop.preshow, TX.line].map(s => s.padEnd(27, ' '));
    FLAP.board(ctx, W / 2, 742, ph, [-100, .4, 8.4], tt, { tw: 42, th: 60, hiFrom: [0, 0, 0] });
    hud(ctx, c => {
      c.shadowColor = 'rgba(0,0,0,.85)'; c.shadowBlur = 14;
      para(c, TX.mission.replace('dados', '*dados*').replace('decisões', '*decisões*'), W / 2, 588, 1500, { size: 40, weight: 800, color: '#FFF', accent: C.yellow, align: 'center' });
      text(c, (ctxTitle.organization || 'Mastercard Advisors').toUpperCase() + '  ·  ' + TX.line, W / 2, 652, { size: 22, weight: 800, mono: true, color: '#F3E6D6', align: 'center', ls: 4 });
    });
  },
  ui(ctx, tl) { hint(ctx, tl, '→  para começar'); }
};

/* ---------- o mapa com os 3 capítulos (fim do embarque e Conversa 0) ---------- */
const MAPVIEW = { x: W / 2, y: H / 2 - 30, s: .93 };   // o mapa um pouco menor e mais baixo: o topo fica livre para o texto
const CHAP_POS = [[700, 424], [856, 776], [1330, 812]];
function chapterTags(ctx, aFn) {
  TX.chapters.forEach(([name, ks, col], i) => {
    const a = aFn(i); if (a <= 0) return; const [x, y] = CHAP_POS[i], s = E.outBack(clamp(a)), w = measure(ctx, name, 34, 900) + 76;
    ctx.save(); ctx.translate(x, y); ctx.rotate([-.02, .015, -.012][i]); ctx.scale(s, s);
    paper(ctx, -w / 2, -38, w, 76, { r: 12, fill: col, shadow: 8, shadowColor: '#000', lw: 3.5 });
    tape(ctx, -w / 2 + 30, -38, 70, 24, -.3, 40 + i);
    late(ctx, c => { c.globalAlpha *= clamp(a * 1.6);
      text(c, `CAPÍTULO ${i + 1}  ·  ESTAÇÕES ${ks.map(k => TX.stations[k - 1].n).join(', ')}`, 0, -60, { size: 19, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 2 });
      text(c, name, 0, 2, { size: 34, weight: 900, color: i === 2 ? INK : '#FFF', align: 'center' }); });
    ctx.restore();
  });
}
function mapWorld(ctx, view, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(view.s, view.s); ctx.translate(-view.x, -view.y); fn(); ctx.restore(); }

/* ---------- embarque (20 s, trilha sintetizada a 120 BPM: compasso = 2 s) ---------- */
(() => {
  const id = 'open';
  const T_WALK0 = .4, T_WALK1 = 2.7, T_ARR = 1.3, T_STOP = 5.0, T_DOOR = 6.0, T_GO = 6.15, T_IN = 7.25;
  const T_TIX = 6.3, T_PUNCH = 7.6, T_DIVE = 13.0, T_MAP = 13.9;
  const L = 1500, S = 1.18, TY0 = 930 - 408 * S, DOOR = L * .5, GX = 1500, GY = 1052, GS = 1.3;
  const BOARD = 'PERFORMANCE ANALYTICS';
  cue(id, .3, 'type', { n: 22, gap: .03 }); cue(id, T_ARR, 'whoosh', { dur: 3.4, v: .35 });
  cue(id, T_DOOR, 'impact', { size: .8 }); cue(id, T_DOOR + .05, 'chime', { f: 987.8, up: -4 }); cue(id, T_TIX, 'pop', { p: 1, v: .2 });
  cue(id, T_PUNCH, 'click', { v: 1 }); cue(id, T_PUNCH + .1, 'shimmer', { dur: 1.6 }); cue(id, T_DIVE, 'whoosh', { dur: 1.2, v: .4 });
  [0, 1, 2].forEach(i => cue(id, T_MAP + 1.6 + i * .35, 'pop', { p: 1 + i * .1, v: .2 }));

  const SCRIPT = SAY.reg(id, [
    [.8, 6.6, 'big', TX.mission.replace('dados', '*dados*').replace('decisões', '*decisões*'), { y: 432, size: 52, band: true, visual: true }],
    [6.3, 13.6, 'title', 'Dos *dados* ao *valor*'],
    [6.4, 13.6, 'body', 'Combinamos conhecimento de *negócio*, *analytics* e *implementação* para orientar decisões.', { y: 250, visual: true }],
    [14.6, 20.3, 'title', 'O percurso'],
    [14.7, 20.3, 'note', 'Uma viagem pelas capacidades da nossa área, em *três capítulos*.', { x: 480, y: 128, w: 1340, align: 'left', size: 34, weight: 800 }]
  ]);

  function girl(ctx, t) {
    if (t < T_WALK0 || t > T_IN + .4) return;
    let x = GX, y = GY, s = GS, pose, a = 1; const dir = -1;
    if (t < T_WALK1) { const u = clamp((t - T_WALK0) / (T_WALK1 - T_WALK0)); x = lerp(W + 150, GX, E.outCubic(u)); pose = PEOPLE.walk((t - T_WALK0) * 16); }
    else if (t < T_GO) pose = PEOPLE.hold(E.outCubic(P(t, T_WALK1, .5)), PEOPLE.mixPose(PEOPLE.walk(0), PEOPLE.POSE.stand, clamp((t - T_WALK1) / .3)));
    else { const u = clamp((t - T_GO) / (T_IN - T_GO)), e = E.inOutSine(u); x = lerp(GX, W / 2 + 30, e); y = lerp(GY, 934, e); s = lerp(GS, .96, e); pose = PEOPLE.hold(1, PEOPLE.walk((t - T_GO) * 15)); a = 1 - P(t, T_IN - .2, .4); }
    ctx.save(); ctx.globalAlpha *= a;
    glow(ctx, x, y - 200 * s, 260 * s, '#FFD9A8', .16);
    PEOPLE.draw(ctx, x, y, s, pose, { dir, t, phones: 'neck', mood: t > T_DOOR ? 'happy' : 'calm' });
    const [hx, hy] = PEOPLE.hand(x, y, s, pose, { dir }), ta = 1 - P(t, T_TIX - .1, .3);   // o bilhete pequeno vira o close
    if (t > T_WALK1 && ta > 0) { ctx.save(); ctx.globalAlpha *= ta; ticket(ctx, hx - 54 * s, hy - 18 * s, .3 * s * E.outBack(P(t, T_WALK1, .45)), { rot: .07 }); ctx.restore(); }
    ctx.restore();
  }
  function platformShot(ctx, t) {
    const dive = E.inCubic(P(t, T_DIVE, .9)), wake = 1 - E.outCubic(P(t, 0, 1.4)), push = 1 + .05 * E.inOutSine(P(t, T_DOOR, T_DIVE - T_DOOR));
    ctx.save();
    if (dive > 0) { const z = 1 + dive * 5; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -(TY0 + 170 * S)); ctx.translate(0, (TY0 + 170 * S - H / 2) * (1 - dive)); }
    else { ctx.translate(W / 2, TY0 + 170 * S); ctx.scale(push, push); ctx.translate(-W / 2, -(TY0 + 170 * S)); }
    platform(ctx, t, { doodles: [['star', 140, 330, 70, C.yellow], ['arrow', 1790, 300, 90, C.orange]] });   // sem placa: o painel de partidas e o título ocupam o topo
    const ba = 1 - P(t, T_DOOR, .4); if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba; FLAP.board(ctx, W / 2, 232 - 60 * P(t, T_DOOR, .4), [BOARD], [.3], t, { tw: 50, th: 74, hiFrom: [0], header: 'PARTIDA', headerCol: C.red, glowA: P(t, 1.6, .6) }); ctx.restore(); }
    // o trem chega da esquerda e freia com a porta no centro; o farol varre a plataforma
    const arr = E.outCubic(P(t, T_ARR, T_STOP - T_ARR)), x = lerp(-L * S - 80, W / 2 - DOOR * S, arr), sway = (1 - arr) * Math.sin(t * 30) * 2;
    if (t > T_ARR) {
      if (arr < .995) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const hx = x + L * S, g = ctx.createRadialGradient(hx, TY0 + 260, 10, hx, TY0 + 260, 520); g.addColorStop(0, 'rgba(255,236,200,.55)'); g.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = g; ctx.fillRect(hx - 40, TY0 - 200, 900, 900); ctx.restore(); }
      trainCar(ctx, x, TY0 + sway, S, { len: L, doors: [L * .17, DOOR, L * .83], logoX: 520, open: E.inOutCubic(P(t, T_DOOR, .7)), seed: 11, lit: 1 });
      if (arr < .97) { const r = rng(3); ctx.save(); ctx.globalAlpha = .45 * (1 - arr); for (let k = 0; k < 14; k++) { const ly = TY0 + r() * 420 * S, lx = x + r() * L * S; line(ctx, lx, ly, lx - 300 - r() * 400, ly, 'rgba(255,240,220,.6)', 3); } ctx.restore(); }
      if (t > T_DOOR) glow(ctx, W / 2, TY0 + 200 * S, 300, '#FFE2B0', .4 * P(t, T_DOOR, .6));
    }
    girl(ctx, t);
    ctx.restore();
    // o bilhete em close: DE dados → PARA valor, carimbado no embarque (como na v5.4)
    const tp = E.outBack(P(t, T_TIX, .5)) * (1 - P(t, T_DIVE - .2, .4));
    if (tp > 0) { glow(ctx, W / 2 + 40, 650, 520, '#FFD9A8', .22 * tp); ticket(ctx, W / 2 + 40, 650 + (1 - tp) * 320, 1.12 * tp, { punch: P(t, T_PUNCH, .3), rot: -.04 + .01 * Math.sin(t * .8) }); }
    if (wake > 0) { ctx.save(); ctx.globalAlpha = .85 * wake; ctx.fillStyle = '#050403'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (dive > .55) flash(ctx, (dive - .55) / .45 * .9, '#FFD9A0');
  }
  function mapShot(ctx, t) {
    const a = P(t, T_MAP, .7); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    bgDark(ctx, t, { centerA: .9, center: '#33200F' }); glow(ctx, 960, 590, 900, C.orange, .14);
    const z = lerp(1.6, 1, E.outCubic(P(t, T_MAP, 1.4)));
    mapWorld(ctx, { ...MAPVIEW, s: MAPVIEW.s * z }, () => {
      metroMap(ctx, t, { reveal: E.inOutCubic(P(t, T_MAP, 1.5)), train: 0 });
      chapterTags(ctx, i => P(t, T_MAP + 1.6 + i * .35, .4));
    });
    ctx.restore();
  }
  SCENES[id] = {
    themeAt: () => 'dark', hideMap: true,
    peaks: [[T_DOOR - .1, T_DOOR + 1.2], [T_PUNCH - .1, T_PUNCH + .6, .5]],
    script: SCRIPT,
    draw(ctx, t) {
      if (t < T_MAP + .8) platformShot(ctx, t);
      mapShot(ctx, t);
      scanlines(ctx, .04);
      SAY.draw(ctx, t, SCRIPT, 'dark');
    }
  };
})();

/* ---------- Conversa 0: a missão e o mapa, interativos (clique numa estação → detalhe; → embarca) ---------- */
STOPSCN.stop0 = (() => {
  const KEYS = [1, 2, 3, 'p1', 4, 5, 6, 'p2', 7];
  const view = k => { if (k == null) return MAPVIEW; const n = MAP.node(k); return { x: lerp(W / 2, n.x, .8), y: lerp(H / 2, n.y, .8), s: 1.45 }; };
  const camOf = ui => { const e = E.inOutCubic(ui.selP), a = view(ui.prevSel), b = view(ui.sel); return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), s: lerp(a.s, b.s, e) }; };
  const toScreen = (c, x, y) => [W / 2 + (x - c.x) * c.s, H / 2 + (y - c.y) * c.s];
  function detail(ctx, k, a, tl, cam) {
    if (a <= 0 || k == null) return;
    const n = MAP.node(k), isStop = typeof k === 'string', st = isStop ? null : TX.stations[k - 1];
    const title = isStop ? TX.stopInfo[k][0] : st.title, sub = isStop ? TX.stopInfo[k][1] : st.teaser, see = isStop ? [] : st.see || [];
    const w = 860, h = 240 + see.length * 60, [sx] = toScreen(cam, n.x, n.y), x = sx < W / 2 ? W - w - 70 : 70, y = H / 2 - h / 2 + 30;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x + w / 2, y + h / 2 + (1 - E.outBack(a)) * 40); ctx.rotate(-.006);
    paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: 70, fill: '#F6EEDF', shadow: 14, shadowColor: '#000', lw: 4, tape: [[.5, 0, .05]] });
    rr(ctx, -w / 2 + 24, -h / 2 + 26, w - 48, 100, 10); ctx.fillStyle = isStop ? C.yellow : k <= 3 ? C.red : k <= 6 ? C.orange : C.yellow; ctx.fill(); inkRect(ctx, -w / 2 + 24, -h / 2 + 26, w - 48, 100, 10, 3, 5);
    const light = isStop || k === 7;
    if (!isStop) retroText(ctx, st.n, -w / 2 + 64, -h / 2 + 76, { size: 48, weight: 900, color: '#FFF', depth: 3, lw: 3 });
    const ttl = measure(ctx, title, 32, 900) > w - 200 ? twoLines(title) : title;
    text(ctx, ttl, isStop ? 0 : -w / 2 + 134, -h / 2 + 76, { size: 32, weight: 900, color: light ? INK : '#FFF', align: isStop ? 'center' : 'left', lh: 1.08 });
    para(ctx, sub, -w / 2 + 40, -h / 2 + 146, w - 80, { size: 28, weight: 700, color: '#4A4038' });
    see.forEach((l, i) => { const yy = -h / 2 + 236 + i * 60; circle(ctx, -w / 2 + 52, yy, 9, C.orange, INK, 2.5); text(ctx, l, -w / 2 + 76, yy + 1, { size: Math.min(28, 28 * (w - 120) / measure(ctx, l, 28, 800)), weight: 800, color: INK }); });
    ctx.restore();
  }
  return {
    draw(ctx, tl, item, prevItem, p, ui) {
      ui = ui || { sel: null, prevSel: null, selP: 1, hover: null };
      const cam = camOf(ui);
      // fundo: a estação continua viva atrás do mapa (luz piscando, ratinho, trem passando…)
      platform(ctx, tl, { led: true, people: true });
      ctx.save(); ctx.fillStyle = 'rgba(12,9,7,.68)'; ctx.fillRect(0, 0, W, H); ctx.restore();
      mapWorld(ctx, cam, () => {
        glow(ctx, 960, 590, 900, C.orange, .12 + .05 * BT.breath);
        metroMap(ctx, tl, { reveal: 1, hi: ui.sel != null ? ui.sel : ui.hover, train: 0 });
        const dim = 1 - (ui.sel != null ? E.outCubic(ui.selP) * .7 : (1 - E.outCubic(ui.selP)) * .7 * (ui.prevSel != null ? 1 : 0));
        ctx.save(); ctx.globalAlpha *= dim; chapterTags(ctx, () => 1); ctx.restore();
      });
      scanlines(ctx, .04);
    },
    ui(ctx, tl, item, prevItem, p, ui) {
      ui = ui || { sel: null, prevSel: null, selP: 1, hover: null };
      const cam = camOf(ui), out = ui.sel == null ? 1 - E.outCubic(ui.selP) : 0, inn = ui.sel != null ? E.outCubic(ui.selP) : 0;
      // a missão escrita, sempre visível
      const ma = ui.sel == null ? E.inOutCubic(ui.selP) : 1 - E.inOutCubic(ui.selP);
      if (ma > 0) { ctx.save(); ctx.globalAlpha *= ma; ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 16;
        text(ctx, 'NOSSA MISSÃO', W / 2, 62, { size: 20, weight: 800, mono: true, color: C.yellow, align: 'center', ls: 5 });
        para(ctx, TX.mission.replace('dados', '*dados*').replace('decisões', '*decisões*'), W / 2, 84, 1600, { size: 44, weight: 900, color: '#FFF', accent: C.yellow, align: 'center' }); ctx.restore(); }
      detail(ctx, ui.prevSel, ui.prevSel !== ui.sel ? out : 0, tl, cam); detail(ctx, ui.sel, inn, tl, cam);
      const ha = .55 + .2 * Math.sin(tl * 2.4);
      text(ctx, ui.sel == null ? 'clique numa estação para ver o que vamos mostrar' : 'clique fora do cartão para voltar ao mapa', W / 2, H - 42, { size: 24, weight: 700, mono: true, color: '#FFF', align: 'center', ls: 2, alpha: ha });
      hint(ctx, tl, TX.stop.go);
    },
    /** alvo sob o ponteiro (coordenadas do palco) */
    hit(x, y, ui) {
      const cam = camOf(ui); let best = null, bd = 70 * cam.s;
      KEYS.forEach(k => { const n = MAP.node(k), [sx, sy] = toScreen(cam, n.x, n.y), d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = k; } });
      return best;
    },
    click(target, ui, ctl) { ctl.select(target === ui.sel ? null : target); return true; },
    key(k, ui, ctl) {
      if (ui.sel != null && (k === 'Escape' || k === 'ArrowLeft' || k === 'PageUp' || k === 'ArrowRight' || k === 'PageDown')) { ctl.select(null); return true; }
      return false;
    }
  };
})();
