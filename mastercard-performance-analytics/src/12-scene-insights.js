/* ---------------------------------------------------------------------------
   CENA 4 — CASO 01 · INSIGHTS EM ESCALA / MULTIAGENTES (0:56–1:26)
   Fluxo: 3 geradores (Analista, Business, C-Level) → Validador (reprova/aprova)
          → Embalador → o insight vira o título (header) do dashboard
   --------------------------------------------------------------------------- */
(() => {
  const id = 'insights', AG = TX.agents;
  // ---- tempos-chave (locais) ----
  const T_FLIP = 2.0, T_LEFT = 8.6, T_GEN = [9.4, 9.9, 10.4], T_SCAN = 10.9, T_DRAFT = [12.0, 12.6, 13.2];
  const T_TOVAL = 16.2, T_NO = 17.2, T_BACK = 17.6, T_DRAFT2 = 18.9, T_TOVAL2 = 19.3, T_OK = 20.0;
  const T_TOPACK = 20.6, T_WRAP = 21.5, T_FLY = 22.3, T_SNAP = 23.2, T_WALL = 24.4, T_STAMP = 27.6, T_OUT = 29.1;

  cue(id, .1, 'whoosh', { dur: .5, v: .3 }); cue(id, .3, 'impact', { size: .3 }); cue(id, T_FLIP, 'whoosh', { dur: .4, v: .3 }); cue(id, T_FLIP + .3, 'pop', { p: 1.2 });
  cue(id, 4.8, 'chime', { f: 988, up: 5 }); cue(id, 6.4, 'tick', { f: 900, v: .25 }); cue(id, T_LEFT, 'whoosh', { dur: .5, v: .25 });
  T_GEN.forEach((t, i) => { cue(id, t - .25, 'whoosh', { dur: .25, dir: 'down', v: .2 }); cue(id, t, 'pop', { p: .7 + i * .15, v: .3 }); });
  [0, 1, 2].forEach(i => cue(id, T_SCAN + i * .35, 'ping', { f: 1400 + i * 200 }));
  T_DRAFT.forEach(t => cue(id, t, 'type', { n: 10 }));
  cue(id, T_TOVAL, 'whoosh', { dur: .6, v: .3 }); cue(id, T_NO, 'buzz'); cue(id, T_BACK, 'whoosh', { dur: .6, dir: 'down', v: .25 });
  cue(id, T_DRAFT2, 'type', { n: 8, gap: .04 }); cue(id, T_TOVAL2, 'whoosh', { dur: .5, v: .3 }); cue(id, T_OK, 'chime', { f: 1175, up: 7 });
  cue(id, T_WRAP, 'pop', { p: 1.5 }); cue(id, T_FLY, 'whoosh', { dur: .9, v: .45 }); cue(id, T_SNAP, 'impact', { size: .45 }); cue(id, T_SNAP, 'ding');
  cue(id, T_WALL, 'whoosh', { dur: .8, dir: 'down', v: .4 });
  for (let k = 0; k < 23; k++) cue(id, 25.0 + k * .095, 'pop', { p: .8 + k * .05, v: .14 });
  cue(id, T_STAMP, 'impact', { size: .6 }); cue(id, T_STAMP, 'combo'); cue(id, T_OUT, 'whoosh', { dur: .9, dir: 'down', v: .35 });

  // ---- layout ----
  const DA = { x: 330, y: 290, w: 1260, h: 700 }, DB = { x: 64, y: 300, w: 900, h: 560 };
  const GX = 1090, GY = [360, 520, 680], CX = 1170, CW = 340, CH = 100, VX = 1610, VY = 520, PX = 1800, PY = 520;
  const COLS = 6, ROWS = 4, TW = 260, TH = 165, GAP = 24, WX = (W - (COLS * TW + (COLS - 1) * GAP)) / 2, WY = 215, MAIN = 8;
  const WALL_TITLES = ['Norte +5%: Pix puxa o volume', 'Ticket médio estável; app +3%', 'Aprovação 91%: atenção ao Sul', 'Ativos +2,8% no trimestre',
    'Nordeste lidera crescimento', 'E-commerce: queda pontual', 'Churn recua 0,4 p.p.', 'Campanha digital: ROI 3,1x', AG.headline, 'Fraude estável vs. mês',
    'Débito supera meta', 'Crédito: inadimplência ok', 'SE concentra 41% do volume', 'Cashback eleva recorrência', 'Novos clientes +12%', 'Ticket sobe no fim de semana',
    'Sul: recuperação em 2 sem.', 'Mobile = 64% das compras', 'Varejo alimentar acelera', 'Viagens: alta sazonal', 'Pix cresce 9% no mês', 'Limite: uso equilibrado', 'Meta anual: 87% atingida', 'Top 10 clientes estáveis'];
  const tile = i => ({ x: WX + (i % COLS) * (TW + GAP), y: WY + Math.floor(i / COLS) * (TH + GAP), w: TW, h: TH });
  const lerpR = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k) });

  function draft(ctx, x, y, role, txt, p, o = {}) {
    if (p <= 0) return; const col = AGENT_STYLE[role].body, s = o.scale == null ? 1 : o.scale;
    ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha) * clamp(p * 4); ctx.translate(x, y); ctx.scale(s, s);
    card(ctx, 0, -CH / 2, CW, CH, { r: 14, blur: 22, stroke: o.ok ? C.orange : null, lw: 3 });
    ctx.save(); rr(ctx, 0, -CH / 2, CW, CH, 14); ctx.clip(); ctx.fillStyle = role === 'validador' ? C.orange : col; ctx.fillRect(0, -CH / 2, 7, CH); ctx.restore();
    text(ctx, (o.tag || AGENT_STYLE[role].label).toUpperCase(), 22, -CH / 2 + 20, { size: 13, weight: 700, mono: true, color: C.stone, ls: 1.5 });
    const n = Math.ceil(txt.length * clamp(p * 1.25));
    text(ctx, txt.slice(0, n), 22, 12, { size: 19, weight: 700, color: C.ink, lh: 1.25 });
    ctx.restore();
  }

  SCENES[id] = {
    themeAt: t => (t > T_OUT + .4 ? 'dark' : 'light'),
    draw(ctx, t) {
      bgLight(ctx, t, { drift: 8 });
      const toLeft = P(t, T_LEFT, .7, E.inOutCubic), toWall = P(t, T_WALL, 1.0, E.inOutCubic), fade = 1 - P(t, T_WALL, .5);
      // ---------- card-pergunta → flip → dashboard ----------
      if (t < T_FLIP + .3) {
        const flip = P(t, T_FLIP, .3, E.inCubic); const sc = E.outBack(P(t, .05, .45));
        questionCard(ctx, W / 2, H / 2, TX.questions[0], { scale: lerp(1.6, 1.25, sc), flip: 1 - flip, w: 640, h: 240, alpha: P(t, 0, .1) });
      }
      const intro = P(t, T_FLIP + .3, .35, E.outBack);
      let R = lerpR(DA, DB, toLeft); R = lerpR(R, tile(MAIN), toWall);
      const titleP = P(t, T_SNAP, .8);
      const hl = { line: win(t, T_SCAN, T_TOVAL, .3, .4), bars: win(t, T_SCAN + .35, T_TOVAL, .3, .4), kpi: win(t, T_SCAN + .7, T_TOVAL, .3, .4) };
      let anchors = null;
      if (t >= T_FLIP + .3) {
        ctx.save(); const sx = intro; ctx.translate(R.x + R.w / 2, R.y + R.h / 2); ctx.scale(sx, 1); ctx.translate(-(R.x + R.w / 2), -(R.y + R.h / 2));
        anchors = dashboard(ctx, R.x, R.y, R.w, R.h, { t: t - T_FLIP, title: AG.headline, titleP, mini: toWall > .6, hl, seed: 3 });
        ctx.restore();
      }
      // ---------- parede de dashboards (escala) ----------
      if (toWall > 0) {
        for (let i = 0; i < COLS * ROWS; i++) { if (i === MAIN) continue;
          const d = Math.hypot(i % COLS - MAIN % COLS, Math.floor(i / COLS) - Math.floor(MAIN / COLS)), a = P(t, T_WALL + .2 + d * .12, .5, E.outBack); if (a <= 0) continue;
          const tl = tile(i), k = Math.max(0, a); ctx.save(); ctx.globalAlpha = clamp(a * 1.5); ctx.translate(tl.x + TW / 2, tl.y + TH / 2); ctx.scale(k, k); ctx.translate(-(tl.x + TW / 2), -(tl.y + TH / 2));
          const order = [...Array(24).keys()].filter(j => j !== MAIN).indexOf(i);
          dashboard(ctx, tl.x, tl.y, TW, TH, { t: t - T_WALL + i, title: WALL_TITLES[i], titleP: P(t, 25.0 + order * .095, .4), mini: true, seed: i + 5 });
          ctx.restore(); }
      }
      // ---------- "o quê ✓ · o porquê ?" ----------
      const qa = win(t, 4.8, T_LEFT + .2, .3, .3);
      if (qa > 0) { pill(ctx, 1330, 228, 'o quê  ✓', { size: 26, fill: C.ink, color: C.cream, alpha: qa, scale: E.outBack(P(t, 4.8, .35)) });
        if (t > 6.4) pill(ctx, 1530, 228, 'o porquê  ?', { size: 26, fill: C.red, color: '#FFF', alpha: qa * (.75 + .25 * Math.sin(t * 9)), scale: E.outBack(P(t, 6.4, .35)) }); }
      caseHeader(ctx, t - .4, TX.case1, { theme: 'light', out: T_WALL - .4 - .4 });

      // ---------- agentes ----------
      ctx.save(); ctx.globalAlpha = fade;
      const gens = AG.gen;
      // loop "refazer"
      const loopP = P(t, T_NO + .2, .7, E.inOutCubic) * (1 - P(t, T_DRAFT2, .4));
      if (loopP > 0) { ctx.save(); ctx.beginPath(); const pts = [[VX, VY - 70], [VX - 40, 230], [GX + 120, 220], [GX + 30, GY[0] - 70]];
        ctx.moveTo(pts[0][0], pts[0][1]); ctx.bezierCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1]);
        ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = rgba(C.red, loopP); ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
        arrowHead(ctx, GX + 30, GY[0] - 66, Math.PI * .62, 20, rgba(C.red, loopP)); text(ctx, 'refazer', 1340, 236, { size: 24, weight: 800, color: C.red, align: 'center', alpha: loopP }); }
      // conexões
      if (t > T_GEN[2]) { const ca = P(t, T_GEN[2], .5) * .5;
        GY.forEach(gy => line(ctx, CX + CW + 6, gy, VX - 60, VY, rgba(C.ink, ca * .5), 2, [4, 8])); line(ctx, VX + 60, VY, PX - 52, PY, rgba(C.orange, ca), 3, [4, 8]); }
      // geradores
      gens.forEach((g, i) => {
        const p = P(t, T_GEN[i] - .25, .25, E.inQuad); if (p <= 0) return;
        const land = P(t, T_GEN[i], .35), sq = land < 1 ? Math.sin(land * Math.PI) * (1 - land) * 1.6 : 0;
        const y = lerp(GY[i] - 380, GY[i], p), scanning = t > T_SCAN + i * .35 && t < T_TOVAL;
        const think = t > T_BACK + .4 && t < T_DRAFT2;
        agent(ctx, GX, y, 40, { role: g.role, t: t + i, seed: i, squash: sq, look: scanning ? -1 : 0, think, label: g.name, theme: 'light' });
        // feixe até o alvo no dashboard
        if (scanning && anchors) { const tgt = [anchors.dip, anchors.sul, anchors.kpis && anchors.kpis[0]][i]; if (tgt) {
          const bp = P(t, T_SCAN + i * .35, .3); const col = AGENT_STYLE[g.role].body === '#3A3532' ? C.ink : AGENT_STYLE[g.role].body;
          ctx.save(); const gr = ctx.createLinearGradient(GX, y, tgt.x, tgt.y); gr.addColorStop(0, rgba(col, .0)); gr.addColorStop(1, rgba(col, .35 * bp));
          ctx.beginPath(); ctx.moveTo(GX - 30, y - 10); ctx.lineTo(tgt.x, tgt.y - 26); ctx.lineTo(tgt.x, tgt.y + 26); ctx.lineTo(GX - 30, y + 10); ctx.closePath(); ctx.fillStyle = gr; ctx.fill(); ctx.restore();
          circle(ctx, tgt.x, tgt.y, 8, col); } }
      });
      // rascunhos (rodada 1 → validador → reprovação → volta → rodada 2 → aprovação)
      gens.forEach((g, i) => {
        const go1 = P(t, T_TOVAL + i * .08, .6, E.inOutCubic), back = P(t, T_BACK + i * .06, .6, E.inOutCubic);
        if (t < T_BACK) { const x = lerp(CX, VX - 40, go1), y = lerp(GY[i], VY, go1), s = lerp(1, .32, go1);
          draft(ctx, x, y, g.role, g.draft, P(t, T_DRAFT[i], .9), { scale: s, alpha: 1 - P(t, T_NO + .25, .2) * 0 }); }
        else if (t < T_DRAFT2) { const x = lerp(VX - 40, CX, back), y = lerp(VY, GY[i], back);
          circle(ctx, x + 20, y, 10, rgba(C.red, 1 - back)); }
        else { const go2 = P(t, T_TOVAL2 + i * .06, .55, E.inOutCubic), x = lerp(CX, VX - 40, go2), y = lerp(GY[i], VY, go2);
          if (go2 < 1) draft(ctx, x, y, g.role, g.draft, P(t, T_DRAFT2, .5), { scale: lerp(1, .32, go2), tag: g.name + ' · v2', alpha: 1 - P(t, T_TOVAL2 + .45, .15) }); }
      });
      // validador
      const vin = E.outBack(P(t, T_GEN[2] + .3, .4));
      if (vin > 0) { const verdict = t > T_NO && t < T_BACK + .7 ? 'no' : t > T_OK ? 'ok' : null, shake = t > T_NO && t < T_NO + .45 ? Math.sin(t * 70) * 6 : 0;
        if (verdict === 'no') glow(ctx, VX, VY, 140, C.red, .5 * (1 - P(t, T_NO, .8)));
        if (verdict === 'ok') glow(ctx, VX, VY, 140, C.yellow, .55 * (1 - P(t, T_OK, 1.2)));
        agent(ctx, VX + shake, VY, 52 * vin, { role: 'validador', t: t + 7, seed: 5, verdict, label: AG.validator, theme: 'light' }); }
      // embalador
      const pin = E.outBack(P(t, T_GEN[2] + .5, .4));
      if (pin > 0) agent(ctx, PX, PY, 46 * pin, { role: 'embalador', t: t + 3, seed: 9, label: AG.packer, theme: 'light', squash: t > T_WRAP && t < T_WRAP + .4 ? Math.sin(P(t, T_WRAP, .4) * Math.PI) * .5 : 0 });
      ctx.restore();
      // insight aprovado → embalador → faixa de título → header
      if (t > T_OK && t < T_SNAP + .1) {
        const toP = P(t, T_TOPACK, .7, E.inOutCubic), wrap = P(t, T_WRAP, .6, E.inOutCubic), fly = P(t, T_FLY, .9, E.inOutCubic);
        if (t < T_WRAP) { draft(ctx, lerp(VX - 170, PX - 170, toP), lerp(VY + 150, PY + 150, toP), 'validador', AG.headline.replace(' — ', '\n'), 1, { tag: 'insight aprovado', ok: true, scale: lerp(.7, .85, toP), alpha: P(t, T_OK, .3) }); }
        else {
          const hd = anchors ? anchors.header : { x: DB.x, y: DB.y, w: DB.w, h: 70 };
          const sw = lerp(300, hd.w - 40, fly), sh = lerp(70, hd.h * .62, fly);
          const sx = lerp(PX - 260, hd.x + 20, fly), sy = lerp(PY + 150, hd.y + hd.h / 2, fly) - Math.sin(fly * Math.PI) * 220;
          ctx.save(); ctx.globalAlpha = clamp(wrap * 3) * (1 - P(t, T_SNAP - .05, .15));
          shadowed(ctx, 26, 'rgba(255,95,0,.35)', 8, () => { rr(ctx, sx, sy - sh / 2, sw, sh, sh / 2); ctx.fillStyle = C.orange; ctx.fill(); });
          text(ctx, AG.headline, sx + 22, sy + 1, { size: lerp(15, 24, fly), weight: 800, color: '#FFF' });
          if (fly < .3) { circle(ctx, sx + sw - 20, sy - sh / 2, 10, C.yellow); } ctx.restore();
        }
      }
      if (t > T_SNAP && t < T_SNAP + .6 && anchors) { const k = P(t, T_SNAP, .6); const hd = anchors.header; rr(ctx, hd.x - k * 20, hd.y - k * 20, hd.w + k * 40, hd.h + k * 40, 20); ctx.strokeStyle = rgba(C.orange, 1 - k); ctx.lineWidth = 4; ctx.stroke(); }
      // carimbo
      const sp = P(t, T_STAMP, 1.1);
      if (sp > 0) { ctx.save(); ctx.globalAlpha = .55 * clamp(sp * 3) * (1 - P(t, T_OUT, .4)); ctx.fillStyle = C.cream; ctx.fillRect(0, 0, W, H); ctx.restore();
        stamp(ctx, W / 2, H / 2, TX.case1.stamp, sp, { alpha: 1 - P(t, T_OUT, .4) }); }
      // saída: escurece; os tiles viram células
      const out = P(t, T_OUT, .9, E.inOutCubic);
      if (out > 0) { ctx.save(); ctx.globalAlpha = out; ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 24; i++) { const tl = tile(i), s = lerp(TW, 40, out); rr(ctx, tl.x + TW / 2 - s / 2, tl.y + TH / 2 - s / 2 * (TH / TW), s, s * (TH / TW), 6); ctx.fillStyle = rgba('#2A2622', 1); ctx.fill(); }
        ctx.restore(); }
    }
  };
})();
