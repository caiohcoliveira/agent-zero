/* ============================================================================
   20. PRÉ-SHOW · ABERTURA · PARADA 0 (mapa da linha)
   ========================================================================== */

/* ---------- pré-show (loop de espera) ---------- */
STOPSCN.preshow = {
  draw(ctx, tl) {
    const br = BT.breath, ctxTitle = (DATA.presentation_context || {});
    platform(ctx, tl, { sign: 'PLATAFORMA 1', people: true });
    ctx.save(); ctx.fillStyle = 'rgba(10,7,5,.35)'; ctx.fillRect(0, 230, W, 560); ctx.restore();
    intersection(ctx, W / 2, 330, 80, 104, { hot: .25 + .25 * br });
    paintTitle(ctx, 'PERFORMANCE ANALYTICS', W / 2, 520, { size: 104, bg: C.orange, seed: 7, p: 1 });
    text(ctx, (ctxTitle.organization || 'Mastercard Advisors').toUpperCase() + '  ·  ' + TX.line, W / 2, 618, { size: 24, weight: 800, mono: true, color: '#F3E6D6', align: 'center', ls: 4 });
    const tt = tl % 16, ph = [TX.line, TX.stop.preshow, TX.line].map(s => s.padEnd(27, ' '));
    FLAP.board(ctx, W / 2, 730, ph, [-100, .4, 8.4], tt, { tw: 42, th: 60, hiFrom: [0, 0, 0] });
    hint(ctx, tl, '→  para começar');
  }
};

/* ---------- abertura (10s, trilha sintetizada a 120 BPM): plataforma → trem chega → portas abrem → bilhete → mapa ---------- */
(() => {
  const id = 'open', T_ARR = .9, T_STOP = 4.3, T_DOOR = 4.5, T_TIX = 5.0, T_PUNCH = 6.0, T_DIVE = 7.0, T_MAP = 7.6;
  const L = 1500, S = 1.18, TY = 930 - 408 * S, DOOR = L * .5, PLAT = TX.line.padEnd(27, ' ');
  cue(id, .3, 'type', { n: 22, gap: .03 }); cue(id, T_ARR, 'whoosh', { dur: 3.2, v: .35 }); cue(id, T_STOP - .2, 'heart', {});
  cue(id, T_DOOR, 'impact', { size: .8 }); cue(id, T_DOOR + .05, 'chime', { f: 987.8, up: -4 }); cue(id, T_TIX, 'pop', { p: 1, v: .2 }); cue(id, T_PUNCH, 'click', { v: 1 });
  cue(id, T_DIVE, 'whoosh', { dur: 1.2, v: .4 }); cue(id, T_MAP + .4, 'shimmer', { dur: 2 });
  /** quadro final do mapa (igual ao começo da Parada 0) */
  function mapFrame(ctx, t, rev, a) {
    ctx.save(); ctx.globalAlpha *= a;
    bgDark(ctx, t, { centerA: .9, center: '#33200F' }); glow(ctx, 960, 590, 900, C.orange, .14);
    metroMap(ctx, t, { reveal: rev, train: 0 });
    FLAP.board(ctx, W / 2, 112, [TX.line], [-10], t, { tw: 40, th: 58, hiFrom: [5] });
    ctx.restore();
  }
  SCENES[id] = {
    themeAt: () => 'dark',
    peaks: [[T_DOOR - .1, T_DOOR + 1.2]],
    caps: [[.4, T_DOOR - .1, 'Bem-vindos à *Linha Performance Analytics*', 'PLATAFORMA 1'],
      [T_DOOR + .2, T_DIVE + .2, 'Bilhete validado: partimos dos *dados* e chegamos ao *valor*', 'EMBARQUE'],
      [T_MAP + .3, 10.2, '7 estações e 2 paradas para conversa ao longo do caminho', 'O MAPA DA LINHA']],
    draw(ctx, t) {
      const dive = E.inCubic(P(t, T_DIVE, .9)), mapA = P(t, T_MAP - .2, .6);
      if (mapA < 1) {
        ctx.save();
        if (dive > 0) { const z = 1 + dive * 5, fx = 0, fy = 0; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -(TY + 170 * S)); ctx.translate(0, (TY + 170 * S - H / 2) * (1 - dive)); }
        platform(ctx, t, { sign: 'PLATAFORMA 1 · LINHA PERFORMANCE ANALYTICS', doodles: [['star', 140, 330, 70, C.yellow], ['arrow', 1790, 300, 90, C.orange]] });
        // painel de partidas
        FLAP.board(ctx, W / 2, 290, [PLAT, PLAT], [.3, 99], t, { tw: 34, th: 50, hiFrom: [5, 5], header: 'PARTIDA', headerCol: C.red });
        // o trem chega da direita e freia com a porta no centro
        const arr = E.outCubic(P(t, T_ARR, T_STOP - T_ARR)), x = lerp(W + 60, W / 2 - DOOR * S, arr), sway = (1 - arr) * Math.sin(t * 30) * 2;
        if (t > T_ARR) trainCar(ctx, x, TY + sway, S, { len: L, doors: [L * .17, DOOR, L * .83], logoX: 520, open: E.inOutCubic(P(t, T_DOOR, .7)), seed: 11, lit: 1 });
        if (t > T_ARR && arr < .97) { const r = rng(3); ctx.save(); ctx.globalAlpha = .45 * (1 - arr); for (let k = 0; k < 14; k++) { const ly = TY + r() * 420 * S, lx = x + r() * L * S; line(ctx, lx, ly, lx + 300 + r() * 400, ly, 'rgba(255,240,220,.6)', 3); } ctx.restore(); }
        ctx.restore();
        // bilhete validado
        const tp = E.outBack(P(t, T_TIX, .45)) * (1 - P(t, T_DIVE - .1, .4));
        if (tp > 0) ticket(ctx, W / 2 + 40, 640 + (1 - tp) * 300, tp, { punch: P(t, T_PUNCH, .3), rot: -.04 });
        if (dive > .55) flash(ctx, (dive - .55) / .45 * .9, '#FFD9A0');
      }
      if (mapA > 0) mapFrame(ctx, t, E.inOutCubic(P(t, T_MAP, 2.2)), mapA);
      scanlines(ctx, .05);
    }
  };
})();

/* ---------- parada 0: o mapa da linha, interativo (clique numa estação → detalhe; → embarca) ---------- */
STOPSCN.stop0 = (() => {
  const KEYS = [1, 2, 3, 'p1', 4, 5, 6, 'p2', 7];
  const view = k => { if (k == null) return { x: W / 2, y: H / 2, s: 1 }; const n = MAP.node(k); return { x: lerp(W / 2, n.x, .8), y: lerp(H / 2, n.y, .8), s: 1.45 }; };
  const camOf = ui => { const e = E.inOutCubic(ui.selP), a = view(ui.prevSel), b = view(ui.sel); return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), s: lerp(a.s, b.s, e) }; };
  const toScreen = (c, x, y) => [W / 2 + (x - c.x) * c.s, H / 2 + (y - c.y) * c.s];
  function detail(ctx, k, a, tl, cam) {
    if (a <= 0 || k == null) return;
    const n = MAP.node(k), isStop = typeof k === 'string', st = isStop ? null : TX.stations[k - 1];
    const title = isStop ? TX.stopInfo[k][0] : st.title, sub = isStop ? TX.stopInfo[k][1] : st.teaser, see = isStop ? [] : st.see || [];
    const w = 840, h = 230 + see.length * 58, [sx] = toScreen(cam, n.x, n.y), x = sx < W / 2 ? W - w - 70 : 70, y = H / 2 - h / 2 + 20;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x + w / 2, y + h / 2 + (1 - E.outBack(a)) * 40); ctx.rotate(-.008 + Math.sin(tl * .8) * .004);
    paper(ctx, -w / 2, -h / 2, w, h, { torn: true, seed: 70, fill: '#F6EEDF', shadow: 14, shadowColor: '#000', lw: 4, tape: [[.5, 0, .05]] });
    rr(ctx, -w / 2 + 24, -h / 2 + 26, w - 48, 100, 10); ctx.fillStyle = isStop ? C.yellow : k <= 3 ? C.red : k <= 6 ? C.orange : C.yellow; ctx.fill(); inkRect(ctx, -w / 2 + 24, -h / 2 + 26, w - 48, 100, 10, 3, 5);
    const light = isStop || k === 7;
    if (!isStop) retroText(ctx, st.n, -w / 2 + 64, -h / 2 + 76, { size: 48, weight: 900, color: '#FFF', depth: 3, lw: 3 });
    const ttl = measure(ctx, title, 32, 900) > w - 200 ? twoLines(title) : title;
    text(ctx, ttl, isStop ? 0 : -w / 2 + 134, -h / 2 + 76, { size: 32, weight: 900, color: light ? INK : '#FFF', align: isStop ? 'center' : 'left', lh: 1.08 });
    text(ctx, sub, -w / 2 + 40, -h / 2 + 166, { size: 26, weight: 700, color: '#4A4038' });
    see.forEach((l, i) => { const yy = -h / 2 + 226 + i * 58; circle(ctx, -w / 2 + 52, yy, 9, C.orange, INK, 2.5); text(ctx, l, -w / 2 + 76, yy + 1, { size: Math.min(26, 26 * (w - 120) / measure(ctx, l, 26, 800)), weight: 800, color: INK }); });
    ctx.restore();
  }
  return {
    draw(ctx, tl, item, prevItem, p, ui) {
      ui = ui || { sel: null, prevSel: null, selP: 1, hover: null };
      const cam = camOf(ui), zoomed = ui.sel != null || ui.selP < 1;
      // fundo: a estação continua viva atrás do mapa (luz piscando, ratinho, trem passando…)
      platform(ctx, tl, { led: true, people: true });
      ctx.save(); ctx.fillStyle = 'rgba(12,9,7,.66)'; ctx.fillRect(0, 0, W, H); ctx.restore();
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam.s, cam.s); ctx.translate(-cam.x, -cam.y);
      glow(ctx, 960, 590, 900, C.orange, .12 + .05 * BT.breath);
      metroMap(ctx, tl, { reveal: 1, hi: ui.sel != null ? ui.sel : ui.hover, train: 0 });
      ctx.restore();
      const out = ui.sel == null ? 1 - E.outCubic(ui.selP) : 0, inn = ui.sel != null ? E.outCubic(ui.selP) : 0;
      detail(ctx, ui.prevSel, ui.prevSel !== ui.sel ? out : 0, tl, cam); detail(ctx, ui.sel, inn, tl, cam);
      const ba = ui.sel == null ? E.inOutCubic(ui.selP) : 1 - E.inOutCubic(ui.selP);
      if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba; FLAP.board(ctx, W / 2, 112, [TX.line], [-10], tl, { tw: 40, th: 58, hiFrom: [5] }); ctx.restore(); }
      const ha = .55 + .2 * Math.sin(tl * 2.4);
      text(ctx, ui.sel == null ? 'clique numa estação para ver o que vamos mostrar' : 'clique fora do cartão para voltar ao mapa', W / 2, H - 50, { size: 24, weight: 700, mono: true, color: '#FFF', align: 'center', ls: 2, alpha: ha });
      hint(ctx, tl, TX.stop.go);
      scanlines(ctx, .05);
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
