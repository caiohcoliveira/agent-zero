/* ---------------------------------------------------------------------------
   CENA 7 — CASO 04 · INSIGHTS EM ESCALA (2:26–3:00)
   Dentro do nó "Insights" do pipeline:
   A) 3 geradores (Analista, Business, C-Level) leem report e dashboard
   B) Validador reprova → refazer → aprova
   C) Embalador entrega o título: no report, no dashboard, em qualquer processo
   D) por baixo do capô: transformers puros em GPU, vários modelos, perímetro
      "Ambiente Mastercard" — o dado nunca sai
   E) escala: o motor de insights conectado a qualquer processo
   --------------------------------------------------------------------------- */
(() => {
  const id = 'insights', AG = TX.agents, ST = TX.stack;
  // ---- tempos-chave (locais) ----
  const T_CARD = .3, T_STAGE = 2.6, T_GEN = [3.6, 4.0, 4.4], T_SCAN = 4.8, T_DRAFT = [6.0, 6.5, 7.0];
  const T_TOVAL = 8.8, T_NO = 9.6, T_BACK = 9.9, T_DRAFT2 = 11.1, T_TOVAL2 = 11.5, T_OK = 12.2;
  const T_TOPACK = 12.6, T_WRAP = 13.3, T_REP = 13.9, T_DASH = 15.0, T_PROC = 16.0;
  const T_HOOD = 18.6, T_PERIM = 19.0, T_TF = 19.2, T_ATT = 20.0, T_GPU = 20.6, T_MOD = 21.4, T_NEVER = 24.0, T_RING = 26.8, T_STAMP = CONFIG.caseDone.insights, T_OUT = 32.8;
  // ---- cues ----
  cue(id, .05, 'impact', { size: .5 }); cue(id, T_CARD, 'pop', { p: 1.2 }); cue(id, T_STAGE, 'whoosh', { dur: .4, v: .3 });
  T_GEN.forEach((t, i) => { cue(id, t - .25, 'whoosh', { dur: .25, dir: 'down', v: .2 }); cue(id, t, 'pop', { p: .7 + i * .15, v: .3 }); });
  [0, 1, 2].forEach(i => cue(id, T_SCAN + i * .35, 'ping', { f: 1400 + i * 200 })); T_DRAFT.forEach(t => cue(id, t, 'type', { n: 10 }));
  cue(id, T_TOVAL, 'whoosh', { dur: .6, v: .3 }); cue(id, T_NO, 'buzz'); cue(id, T_BACK, 'whoosh', { dur: .6, dir: 'down', v: .25 });
  cue(id, T_DRAFT2, 'type', { n: 8, gap: .04 }); cue(id, T_TOVAL2, 'whoosh', { dur: .5, v: .3 }); cue(id, T_OK, 'chime', { f: 1175, up: 7 });
  cue(id, T_WRAP, 'pop', { p: 1.5 }); cue(id, T_REP, 'whoosh', { dur: .7, v: .4 }); cue(id, T_REP + .75, 'ding'); cue(id, T_DASH, 'whoosh', { dur: .7, v: .35 }); cue(id, T_DASH + .75, 'ding', { f: 1568 });
  for (let k = 0; k < 6; k++) cue(id, T_PROC + .55 + k * .25, 'pop', { p: 1 + k * .1, v: .2 });
  cue(id, T_HOOD, 'swell', { dur: .6 }); cue(id, T_HOOD + .6, 'impact', { size: .5 }); cue(id, T_PERIM, 'shimmer', { dur: 1.2 });
  for (let k = 0; k < 6; k++) cue(id, T_TF + k * .22, 'tick', { f: 1800 + k * 150, v: .12 });
  cue(id, T_GPU, 'riser', { dur: 1.2, v: .2 }); for (let k = 0; k < 5; k++) cue(id, T_MOD + k * .3, 'chime', { f: 880 * Math.pow(2, k * 2 / 12), up: 7 });
  [0, 1, 2].forEach(k => cue(id, T_NEVER + .5 + k * .5, 'buzz')); cue(id, T_NEVER + .6, 'impact', { size: .5 });
  cue(id, T_RING, 'whoosh', { dur: .9, v: .45 }); for (let k = 0; k < 12; k++) cue(id, T_RING + 1.0 + k * .22, 'pop', { p: .8 + k * .06, v: .14 });
  cue(id, T_STAMP, 'impact', { size: .7 }); cue(id, T_STAMP, 'combo'); cue(id, T_OUT, 'whoosh', { dur: 1.0, dir: 'down', v: .4 });

  // ---- layout ----
  const REP = { x: 70, y: 290, w: 380, h: 220 }, DSH = { x: 70, y: 560, w: 380, h: 230 };
  const GX = 585, GY = [330, 500, 670], CX = 645, CW = 330, CH = 96, VX = 1110, VY = 500, PX = 1270, PY = 500;
  const PROCS = AG.processes.map((p, k) => ({ name: p[0], ic: p[1], x: 1500 + (k % 2) * 230, y: 330 + Math.floor(k / 2) * 165 }));
  const PERIM = { x: 120, y: 220, w: 1520, h: 660 };
  const RING = [['Report', 'doc'], ['Dashboard', 'dashboard'], ['CRM', 'user'], ['E-mail', 'doc'], ['App', 'card'], ['API', 'nodes'],
    ['Alertas', 'bolt'], ['Slides', 'chart'], ['Board', 'board'], ['Pix', 'pix'], ['Cartões', 'card'], ['Lojas', 'store']];
  const SHORT = 'E-commerce +18% em 3 MCCs → revisar regras';

  function draft(ctx, x, y, role, txt, p, o = {}) {
    if (p <= 0) return; const col = AGENT_STYLE[role].body, s = o.scale == null ? 1 : o.scale;
    ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha) * clamp(p * 4); ctx.translate(x, y); ctx.scale(s, s);
    paper(ctx, 0, -CH / 2, CW, CH, { r: 10, fill: '#FFFDF8', shadow: 6, shadowColor: '#000', outline: o.ok ? C.orange : INK, lw: o.ok ? 4 : 2.5 });
    ctx.save(); rr(ctx, 0, -CH / 2, CW, CH, 10); ctx.clip(); ctx.fillStyle = role === 'validador' ? C.orange : col; ctx.fillRect(0, -CH / 2, 8, CH); ctx.restore();
    text(ctx, (o.tag || AGENT_STYLE[role].label).toUpperCase(), 22, -CH / 2 + 19, { size: 13, weight: 800, mono: true, color: C.stone, ls: 1.5 });
    text(ctx, txt.slice(0, Math.ceil(txt.length * clamp(p * 1.25))), 22, 12, { size: 18, weight: 800, color: INK, lh: 1.25 });
    ctx.restore();
  }
  function miniReport(ctx, R, head, t) {
    paper(ctx, R.x, R.y, R.w, R.h, { r: 10, fill: '#FFFDF8', shadow: 7, shadowColor: '#000', lw: 3 });
    text(ctx, 'REPORT DE FRAUDE · BOARD', R.x + 16, R.y + 64, { size: 13, weight: 800, mono: true, color: C.stone, ls: 1.5 });
    rr(ctx, R.x + 12, R.y + 12, R.w - 24, 34, 8);
    if (head > 0) { ctx.fillStyle = C.orange; ctx.fill(); text(ctx, SHORT.slice(0, Math.ceil(SHORT.length * clamp(head * 1.2))), R.x + 24, R.y + 30, { size: 14, weight: 800, color: '#FFF' }); }
    else { ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); text(ctx, 'DESTAQUE: ?', R.x + 24, R.y + 30, { size: 14, weight: 800, mono: true, color: C.orange, alpha: .6 + .4 * Math.sin(t * 7) }); }
    ['0,08%', '−12%', '3 alertas'].forEach((v, i) => { const bx = R.x + 16 + i * (R.w - 32) / 3; rr(ctx, bx, R.y + 82, (R.w - 32) / 3 - 10, 44, 6); ctx.fillStyle = '#F3EEE7'; ctx.fill(); text(ctx, v, bx + 10, R.y + 104, { size: 17, weight: 900, color: INK }); });
    ctx.beginPath(); for (let k = 0; k < 10; k++) ctx.lineTo(R.x + 22 + k * (R.w - 44) / 9, R.y + R.h - 26 - Math.sin(k * .9) * 16 - (k > 6 ? 24 : 0)); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.stroke();
  }
  function lock(ctx, x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * .12; ctx.beginPath(); ctx.arc(0, -s * .15, s * .28, Math.PI, 0); ctx.stroke(); rr(ctx, -s * .42, -s * .15, s * .84, s * .62, s * .1); ctx.fillStyle = col; ctx.fill(); circle(ctx, 0, s * .12, s * .08, '#100C09'); ctx.restore(); }

  // ---- por baixo do capô ----
  function transformer(ctx, x, y, w, t, p) {
    const B = [['Softmax', C.yellow], ['Add & Norm', '#C9B79C'], ['Feed Forward', C.orange], ['Add & Norm', '#C9B79C'], ['Multi-Head Attention', C.red], ['Embeddings + posição', C.yellow]];
    const bh = 58, gap = 28; text(ctx, 'TRANSFORMER', x, y - 22, { size: 15, weight: 800, mono: true, color: C.orange, ls: 3, alpha: p > 0 ? 1 : 0 });
    B.forEach(([nm, col], i) => { const a = E.outBack(P(p, (5 - i) * .12, .35)); if (a <= 0) return; const by = y + i * (bh + gap);
      ctx.save(); ctx.translate(x + w / 2, by + bh / 2); ctx.scale(a, a); holo(ctx, -w / 2, -bh / 2, w, bh, { color: col, corners: false }); text(ctx, nm, 0, 1, { size: 19, weight: 800, color: '#FFF1E2', align: 'center' }); ctx.restore();
      if (i < 5 && a >= 1) { line(ctx, x + w / 2, by + bh + gap - 2, x + w / 2, by + bh + 6, rgba('#FFE2C4', .7), 2); arrowHead(ctx, x + w / 2, by + bh + 4, -Math.PI / 2, 10, '#FFE2C4'); } });
    if (p > .8) { const by1 = y + (bh + gap), by4 = y + 4 * (bh + gap) + bh, bx = x + w + 18; ctx.strokeStyle = rgba(C.orange, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx - 8, by1); ctx.lineTo(bx, by1); ctx.lineTo(bx, by4); ctx.lineTo(bx - 8, by4); ctx.stroke();
      neonText(ctx, '× N', bx + 12, (by1 + by4) / 2, { size: 24, weight: 800 });
      [[4, 3], [2, 1]].forEach(([a, b]) => { const ya = y + a * (bh + gap) + bh / 2, yb = y + b * (bh + gap) + bh / 2; ctx.beginPath(); ctx.moveTo(x, ya); ctx.bezierCurveTo(x - 40, ya, x - 40, yb, x, yb); ctx.strokeStyle = rgba(C.yellow, .7); ctx.lineWidth = 2; ctx.stroke(); }); }
    if (p >= 1) for (let k = 0; k < 4; k++) { const q = ((t * .5 + k / 4) % 1), ty = lerp(y + 5 * (bh + gap) + bh, y, q); glow(ctx, x + w / 2, ty, 14, C.yellow, .9); rr(ctx, x + w / 2 - 5, ty - 5, 10, 10, 2); ctx.fillStyle = C.yellow; ctx.fill(); }
  }
  function attention(ctx, x, y, s, t, p) {
    const n = 8, c = s / n; text(ctx, 'ATENÇÃO · Q × K', x, y - 20, { size: 14, weight: 800, mono: true, color: C.orange, ls: 2, alpha: p });
    for (let i = 0; i < n; i++) { let row = [], sum = 0; for (let j = 0; j < n; j++) { const v = Math.exp(-((i - j - Math.round(Math.sin(t * .8 + i) * 1.5)) ** 2) / 3) + .15 * hash(i * 9 + j); row.push(v); sum += v; }
      row.forEach((v, j) => { const a = clamp(p * 2 - (i + j) / (2 * n)); rr(ctx, x + j * c + 1, y + i * c + 1, c - 2, c - 2, 3); ctx.fillStyle = a > 0 ? heat(clamp(v / sum * 2.4) * a) : '#1C1712'; ctx.fill(); }); }
    ctx.strokeStyle = rgba(C.orange, .7 * p); ctx.lineWidth = 2; ctx.strokeRect(x, y, s, s);
  }
  function gpu(ctx, x, y, w, h, t, p) {
    holo(ctx, x, y, w, h, { title: 'GPU · CUDA · FP16 · BATCH', alpha: clamp(p * 3) });
    const cols = 18, rows = 9, gx = x + 24, gy = y + 48, cw = (w - 48) / cols, ch = (h - 96) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const on = clamp(p * 2 - (c + r) / (cols + rows)); if (on <= 0) continue;
      const wv = Math.max(0, Math.sin(t * 7 - c * .55 - r * .35)); ctx.fillStyle = mix('#2A1E15', wv > .6 ? C.yellow : C.orange, (.2 + .8 * wv) * on); ctx.fillRect(gx + c * cw + 1.5, gy + r * ch + 1.5, cw - 3, ch - 3); }
    for (let k = 0; k < 14; k++) { const px = x + 30 + k * (w - 60) / 13; line(ctx, px, y + h, px, y + h + 10, rgba(C.orange, .6 * p), 2); line(ctx, px, y, px, y - 10, rgba(C.orange, .6 * p), 2); }
    text(ctx, 'tokens/s ▲', x + w - 20, y + h - 22, { size: 15, weight: 700, mono: true, color: C.sand, align: 'right', alpha: p });
  }

  SCENES[id] = {
    themeAt: () => 'dark',
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .8, center: '#2A1A10' });
      const stageA = 1 - P(t, T_HOOD, .7), hoodA = P(t, T_HOOD + .2, .7) * (1 - P(t, T_RING - .2, .6)), ringA = P(t, T_RING, .6) * (1 - P(t, T_OUT, .9));
      neonGrid(ctx, t, { horizon: 900, alpha: .3 * stageA + .7 * hoodA + .4 * ringA, speed: .5 });
      collage(ctx, t, { seed: 71, n: 5, theme: 'dark', alpha: .8 * stageA * P(t, T_STAGE, .6) });
      // chegada: o anel do nó "?" encolhe
      if (t < 1.2) { const k = P(t, 0, 1.2, E.outCubic); circle(ctx, W / 2, H / 2, lerp(900, 60, k), null, rgba(C.orange, 1 - k), lerp(40, 4, k)); }
      if (t < T_STAGE + .3) { const sc = E.outBack(P(t, T_CARD, .45)), flip = P(t, T_STAGE, .3, E.inCubic);
        questionCard(ctx, W / 2, H / 2, Q('insights'), { theme: 'dark', tag: 'DENTRO DO NÓ INSIGHTS', scale: lerp(1.6, 1.25, sc), flip: 1 - flip, w: 680, h: 240, alpha: P(t, T_CARD, .1) }); }

      // ================= A–C: agentes → título em todo lugar =================
      if (stageA > 0 && t > T_STAGE) {
        ctx.save(); ctx.globalAlpha = stageA * P(t, T_STAGE, .4); const lift = P(t, T_HOOD, .7, E.inCubic) * -200; ctx.translate(0, lift);
        caseHeader(ctx, t - T_STAGE, TX.cases.insights, { theme: 'dark' });
        miniReport(ctx, REP, P(t, T_REP + .75, .9), t);
        const dp = P(t, T_DASH + .75, .9); dashboard(ctx, DSH.x, DSH.y, DSH.w, DSH.h, { t, title: AG.headline, titleP: dp, mini: true, seed: 3 });
        [[REP, 'report'], [DSH, 'dashboard']].forEach(([R, lb], k) => pill(ctx, R.x + R.w - 70, R.y - 6, lb, { size: 15, fill: k ? C.yellow : C.red, color: k ? INK : '#FFF', rot: .04 }));
        // loop "refazer"
        const loopP = P(t, T_NO + .2, .6, E.inOutCubic) * (1 - P(t, T_DRAFT2, .4));
        if (loopP > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(VX, VY - 70); ctx.bezierCurveTo(VX - 40, 210, GX + 120, 200, GX + 20, GY[0] - 70);
          ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = rgba(C.red, loopP); ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
          arrowHead(ctx, GX + 20, GY[0] - 66, Math.PI * .62, 20, rgba(C.red, loopP)); pill(ctx, 860, 232, 'refazer', { size: 22, fill: C.red, color: '#FFF', alpha: loopP, rot: -.04 }); }
        if (t > T_GEN[2]) { const ca = P(t, T_GEN[2], .5) * .6; GY.forEach(gy => line(ctx, CX + CW + 6, gy, VX - 60, VY, rgba(C.cream, ca * .4), 2, [4, 8])); line(ctx, VX + 60, VY, PX - 52, PY, rgba(C.orange, ca), 3, [4, 8]); }
        // geradores + feixes de leitura
        AG.gen.forEach((g, i) => { const p = P(t, T_GEN[i] - .25, .25, E.inQuad); if (p <= 0) return;
          const land = P(t, T_GEN[i], .35), sq = land < 1 ? Math.sin(land * Math.PI) * (1 - land) * 1.6 : 0, y = lerp(GY[i] - 380, GY[i], p);
          const scanning = t > T_SCAN + i * .35 && t < T_TOVAL, think = t > T_BACK + .4 && t < T_DRAFT2;
          if (scanning) { const tg = [[REP.x + REP.w, REP.y + 100], [DSH.x + DSH.w, DSH.y + 120], [REP.x + REP.w, REP.y + 30]][i], bp = P(t, T_SCAN + i * .35, .3), col = i === 2 ? C.cream : AGENT_STYLE[g.role].body;
            ctx.save(); const gr = ctx.createLinearGradient(GX, y, tg[0], tg[1]); gr.addColorStop(0, rgba(col, 0)); gr.addColorStop(1, rgba(col, .35 * bp)); ctx.beginPath(); ctx.moveTo(GX - 30, y - 10); ctx.lineTo(tg[0], tg[1] - 30); ctx.lineTo(tg[0], tg[1] + 30); ctx.lineTo(GX - 30, y + 10); ctx.closePath(); ctx.fillStyle = gr; ctx.fill(); ctx.restore(); }
          agent(ctx, GX, y, 40, { role: g.role, t: t + i, seed: i, squash: sq, look: scanning ? -1 : 0, think, label: g.name, theme: 'dark' }); });
        // rascunhos
        AG.gen.forEach((g, i) => { const go1 = P(t, T_TOVAL + i * .08, .6, E.inOutCubic), back = P(t, T_BACK + i * .06, .6, E.inOutCubic);
          if (t < T_BACK) draft(ctx, lerp(CX, VX - 40, go1), lerp(GY[i], VY, go1), g.role, g.draft, P(t, T_DRAFT[i], .9), { scale: lerp(1, .32, go1) });
          else if (t < T_DRAFT2) circle(ctx, lerp(VX - 40, CX, back) + 20, lerp(VY, GY[i], back), 10, rgba(C.red, 1 - back));
          else { const go2 = P(t, T_TOVAL2 + i * .06, .55, E.inOutCubic); if (go2 < 1) draft(ctx, lerp(CX, VX - 40, go2), lerp(GY[i], VY, go2), g.role, g.draft, P(t, T_DRAFT2, .5), { scale: lerp(1, .32, go2), tag: g.name + ' · v2', alpha: 1 - P(t, T_TOVAL2 + .45, .15) }); } });
        // validador e embalador
        const vin = E.outBack(P(t, T_GEN[2] + .3, .4));
        if (vin > 0) { const verdict = t > T_NO && t < T_BACK + .7 ? 'no' : t > T_OK ? 'ok' : null, shake = t > T_NO && t < T_NO + .45 ? Math.sin(t * 70) * 6 : 0;
          if (verdict === 'no') glow(ctx, VX, VY, 140, C.red, .5 * (1 - P(t, T_NO, .8))); if (verdict === 'ok') glow(ctx, VX, VY, 140, C.yellow, .55 * (1 - P(t, T_OK, 1.2)));
          agent(ctx, VX + shake, VY, 50 * vin, { role: 'validador', t: t + 7, seed: 5, verdict, label: AG.validator, theme: 'dark' }); }
        const pin = E.outBack(P(t, T_GEN[2] + .5, .4));
        if (pin > 0) agent(ctx, PX, PY, 46 * pin, { role: 'embalador', t: t + 3, seed: 9, label: AG.packer, theme: 'dark', squash: t > T_WRAP && t < T_WRAP + .4 ? Math.sin(P(t, T_WRAP, .4) * Math.PI) * .5 : 0 });
        // insight aprovado → embalador → faixas de título (report, dashboard)
        if (t > T_OK && t < T_WRAP) { const toP = P(t, T_TOPACK, .6, E.inOutCubic); draft(ctx, lerp(VX - 170, PX - 170, toP), lerp(VY + 160, PY + 160, toP), 'validador', AG.headline.replace(' — ', '\n'), 1, { tag: 'insight aprovado', ok: true, scale: .82, alpha: P(t, T_OK, .3) }); }
        [[T_REP, REP.x + 12, REP.y + 29, REP.w - 24, 34], [T_DASH, DSH.x, DSH.y + DSH.h * .1, DSH.w, DSH.h * .2]].forEach(([t0, hx, hy, hw, hh]) => {
          if (t < T_WRAP || t > t0 + .8) return; const fly = P(t, t0, .75, E.inOutCubic), sw = lerp(260, hw, fly), sh = lerp(58, hh, fly);
          const sx = lerp(PX - 130, hx, fly), sy = lerp(PY + 150, hy, fly) - Math.sin(fly * Math.PI) * 180;
          ctx.save(); ctx.globalAlpha *= clamp(P(t, T_WRAP, .3) * 3) * (1 - P(t, t0 + .7, .1)); paper(ctx, sx, sy - sh / 2, sw, sh, { r: sh / 2, fill: C.orange, shadow: 5, shadowColor: '#000', lw: 2.5 });
          text(ctx, SHORT, sx + 18, sy + 1, { size: lerp(13, 14, fly), weight: 800, color: '#FFF' }); ctx.restore(); });
        // qualquer processo
        PROCS.forEach((pr, k) => { const t0 = T_PROC + k * .25, a = E.outBack(P(t, T_PROC - .4 + k * .08, .4)); if (a <= 0) return;
          const q = P(t, t0, .55, E.inOutCubic); if (q > 0 && q < 1) { const x = lerp(PX + 40, pr.x, q), y = lerp(PY, pr.y, q) - Math.sin(q * Math.PI) * 60; line(ctx, PX + 40, PY, x, y, rgba(C.orange, .5), 2, [4, 6]); pill(ctx, x, y, 'insight', { size: 13, fill: C.orange, color: '#FFF' }); }
          const hit = t > t0 + .55; if (hit) glow(ctx, pr.x, pr.y, 90, C.orange, .4 * (1 - P(t, t0 + .55, .8)));
          circle(ctx, pr.x + 4, pr.y + 5, 40 * a, '#000'); circle(ctx, pr.x, pr.y, 40 * a, hit ? '#FFFDF8' : '#2A241E', hit ? INK : 'rgba(243,235,221,.7)', 3); icon(ctx, pr.ic, pr.x, pr.y, 40 * a, hit ? INK : C.cream, 8);
          text(ctx, pr.name, pr.x, pr.y + 62, { size: 18, weight: 800, color: C.cream, align: 'center', alpha: a });
          if (hit) { circle(ctx, pr.x + 30, pr.y - 30, 13 * E.outBack(P(t, t0 + .55, .3)), C.orange, INK, 2); icon(ctx, 'check', pr.x + 30, pr.y - 29, 15 * E.outBack(P(t, t0 + .55, .3)), '#FFF', 14); } });
        if (t > T_PROC - .4) text(ctx, 'qualquer processo', 1615, 830, { size: 22, weight: 800, mono: true, color: C.orange, align: 'center', alpha: P(t, T_PROC, .4) });
        ctx.restore();
      }

      // ================= D: por baixo do capô =================
      if (hoodA > 0) {
        ctx.save(); ctx.globalAlpha = hoodA;
        const pr = P(t, T_PERIM, .9, E.inOutCubic);
        ctx.save(); ctx.setLineDash([18, 10]); ctx.lineDashOffset = -t * 40; ctx.shadowColor = C.orange; ctx.shadowBlur = 16; rr(ctx, PERIM.x, PERIM.y, PERIM.w * pr, PERIM.h, 26); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
        rr(ctx, PERIM.x, PERIM.y, PERIM.w * pr, PERIM.h, 26); ctx.fillStyle = 'rgba(255,95,0,.04)'; ctx.fill();
        if (pr > .2) { ctx.save(); ctx.translate(PERIM.x + 200, PERIM.y); ctx.rotate(-.02); const lw = measure(ctx, ST.perimeter, 22, 900, true, 3) + 86;
          paper(ctx, -lw / 2, -24, lw, 48, { r: 6, fill: INK, outline: C.orange, shadow: 5, shadowColor: C.orange, lw: 2.5 }); lock(ctx, -lw / 2 + 30, 2, 30, C.orange);
          text(ctx, ST.perimeter, -lw / 2 + 56, 2, { size: 22, weight: 900, mono: true, color: PAPER, ls: 3 }); ctx.restore(); }
        transformer(ctx, 190, 300, 330, t, P(t, T_TF, 1.6));
        if (t > T_ATT) { attention(ctx, 600, 312, 220, t, P(t, T_ATT, .8)); formula(ctx, 'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)·V', 700, 590, { neon: true, size: 14, alpha: P(t, T_ATT + .5, .4) }); }
        if (t > T_GPU) gpu(ctx, 905, 300, 350, 300, t, P(t, T_GPU, 1.0));
        ST.models.forEach((m, k) => { const a = E.outBack(P(t, T_MOD + k * .3, .4)); if (a <= 0) return; const my = 300 + k * 88, mx = 1300;
          line(ctx, 1255, 450, mx, my + 32, rgba(C.orange, .45 * clamp(a)), 2); ctx.save(); ctx.translate(mx + 140, my + 32); ctx.scale(a, a);
          holo(ctx, -140, -32, 280, 64, { color: k % 2 ? C.yellow : C.orange, corners: false }); text(ctx, m, -116, 1, { size: 22, weight: 900, color: '#FFF1E2' });
          circle(ctx, 112, 0, 7 + Math.sin(t * 6 + k) * 1.5, k === 4 ? C.red : '#7CFF9B'); ctx.restore(); });
        if (t > T_MOD + 1.2) text(ctx, 'vários modelos', 1440, 760, { size: 20, weight: 800, mono: true, color: C.sand, align: 'center', alpha: P(t, T_MOD + 1.2, .4) });
        if (t > T_TF + .8) formula(ctx, 'self-hosted · transformers puros', 630, 800, { size: 19, rot: -.02, seed: 21, scale: E.outBack(P(t, T_TF + .8, .4)) });
        // o dado nunca sai
        const ex = { x: 1790, y: 540 }, nv = P(t, T_NEVER, .5);
        if (nv > 0) { ctx.save(); ctx.globalAlpha *= nv; [[-34, 10, 34], [0, -14, 44], [36, 8, 36], [0, 24, 40]].forEach(([dx, dy, r]) => circle(ctx, ex.x + dx, ex.y + dy, r, '#2A241E'));
          [[-34, 10, 34], [0, -14, 44], [36, 8, 36]].forEach(([dx, dy, r]) => circle(ctx, ex.x + dx, ex.y + dy, r, null, rgba(C.cream, .5), 2));
          text(ctx, ST.external, ex.x, ex.y + 92, { size: 18, weight: 800, mono: true, color: C.stone, align: 'center' }); icon(ctx, 'cross', ex.x, ex.y + 6, 70 * E.outBack(P(t, T_NEVER + .3, .4)), C.red, 14); ctx.restore();
          for (let k = 0; k < 3; k++) { const t0 = T_NEVER + .1 + k * .5; if (t < t0) continue; const q = (t - t0) / 1.0; if (q > 1.4) continue;
            const wallX = PERIM.x + PERIM.w, x = q < .5 ? lerp(1250, wallX - 10, q * 2) : lerp(wallX - 10, 1300, (q - .5) * 1.1), y = 720 + k * 34;
            glow(ctx, x, y, 22, q < .5 ? C.yellow : C.orange, .9); rr(ctx, x - 8, y - 8, 16, 16, 3); ctx.fillStyle = C.yellow; ctx.fill();
            if (q >= .5 && q < .75) { const f = 1 - (q - .5) * 4; glow(ctx, wallX, y, 80, C.red, .8 * f); line(ctx, wallX, y - 40, wallX, y + 40, rgba('#FFF', f), 5); } }
          ctx.save(); ctx.translate(PERIM.x + PERIM.w - 40, 840); ctx.rotate(-.06); const s = E.outBack(P(t, T_NEVER + .6, .4)); ctx.scale(s, s);
          const nw = measure(ctx, ST.never, 30, 900) + 50; paper(ctx, -nw, -30, nw, 60, { r: 6, fill: C.yellow, shadow: 6, shadowColor: '#000', lw: 3 }); text(ctx, ST.never, -nw / 2, 2, { size: 30, weight: 900, color: INK, align: 'center' }); ctx.restore(); }
        ctx.restore();
        if (t > T_HOOD && t < T_HOOD + 1.2) { const sy = lerp(0, H, P(t, T_HOOD, 1.1, E.inOutCubic)); glow(ctx, W / 2, sy, 300, C.orange, .5); line(ctx, 0, sy, W, sy, '#FFE2C4', 3); }
      }

      // ================= E: escala — conectável a qualquer processo =================
      if (ringA > 0) {
        ctx.save(); ctx.globalAlpha = ringA; const cx = W / 2, cy = 545, rp = P(t, T_RING, 1.0, E.outCubic);
        RING.forEach(([nm, ic], k) => { const a = -Math.PI / 2 + k * TAU / RING.length + (t - T_RING) * .05, x = cx + Math.cos(a) * 700 * rp, y = cy + Math.sin(a) * 340 * rp, t0 = T_RING + 1.0 + k * .22;
          line(ctx, cx, cy, x, y, rgba(C.orange, .4), 2, [5, 7]); for (let j = 0; j < 2; j++) { const q = ((t - T_RING) * .8 + j * .5 + k * .13) % 1; glow(ctx, lerp(cx, x, q), lerp(cy, y, q), 14, C.yellow, .9); }
          const hit = t > t0; circle(ctx, x + 4, y + 5, 42, '#000'); circle(ctx, x, y, 42, hit ? '#FFFDF8' : '#2A241E', hit ? INK : 'rgba(243,235,221,.7)', 3); icon(ctx, ic, x, y, 40, hit ? INK : C.cream, 8);
          text(ctx, nm, x, y + 64, { size: 18, weight: 800, color: C.cream, align: 'center' });
          if (hit) { const s = E.outBack(P(t, t0, .35)); pill(ctx, x + 34, y - 44, 'insight ✓', { size: 13, fill: C.orange, color: '#FFF', scale: s, rot: -.05 }); } });
        glow(ctx, cx, cy, 300, C.orange, .45); holo(ctx, cx - 170, cy - 110, 340, 220, { title: 'INSIGHT ENGINE' });
        intersection(ctx, cx, cy + 6, 46, 58, {}); AG.gen.forEach((g, k) => agent(ctx, cx - 70 + k * 70, cy + 82, 16, { role: g.role, t: t + k, seed: k }));
        ctx.restore();
        const sp = P(t, T_STAMP, 1.1) * (1 - P(t, T_OUT, .4)); if (sp > 0) { ctx.save(); ctx.globalAlpha = .45 * clamp(sp * 3); ctx.fillStyle = '#0B0807'; ctx.fillRect(0, 0, W, H); ctx.restore(); stamp(ctx, W / 2, cy, TX.cases.insights.stamp, sp, { theme: 'dark' }); }
      }
      scanlines(ctx, .08);
      flash(ctx, P(t, T_OUT + .3, .9, E.inCubic), '#0B0807');
    }
  };
})();
