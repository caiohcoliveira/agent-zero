/* ---------------------------------------------------------------------------
   CENA 7 — CASO 04 · LIGHTS-OFF REPORTING · FRAUDE (2:32–3:00)
   "Antes" caricato e manual → CLICK (apagão) → pipeline neon do dado ao board,
   com os agentes do caso 01 destacando o que importa → antes × depois
   --------------------------------------------------------------------------- */
(() => {
  const id = 'lightsoff';
  const T_BEFORE = 3.0, T_WORDS = [6.0, 6.9, 7.8, 8.9], T_SWITCH = 10.2, T_CLICK = 12.0, T_PIPE = 14.0, T_RED = 16.3, T_AG = 17.0, T_OK = 18.3, T_REP = 19.0, T_HEAD = 19.7, T_SEND = 20.6, T_CYC = 21.5, T_SPLIT = 24.0, T_STAMP = 25.6, T_OUT = 27.1;
  const NODES = [['Ingestão', 'db'], ['Validação', 'shield'], ['Processamento', 'gear'], ['Insights', 'spark'], ['Publicação', 'doc'], ['Board', 'board']];
  const NX = i => 220 + i * 296, NY = 500;
  // ---- cues ----
  cue(id, .2, 'whoosh', { dur: .4, v: .3 }); cue(id, .35, 'impact', { size: .3 }); cue(id, T_BEFORE, 'whoosh', { dur: .5, dir: 'down', v: .3 });
  for (let k = 0; k < 9; k++) cue(id, T_BEFORE + .4 + k * .9, 'tick', { f: 900 + k * 40, v: .12 });
  [4.5, 6.5, 8.5, 10.5].forEach(t => cue(id, t, 'pop', { p: .9, v: .16 }));
  T_WORDS.forEach((t, i) => cue(id, t, 'impact', { size: .2 + i * .05 }));
  cue(id, T_SWITCH, 'whoosh', { dur: .6, v: .4 }); cue(id, T_CLICK, 'click', { v: 1.2 }); cue(id, T_CLICK + .02, 'impact', { size: .35 });
  NODES.forEach((_, i) => { cue(id, T_PIPE + i, 'stab', { i }); cue(id, T_PIPE + i, 'impact', { size: .2 }); });
  cue(id, T_RED + .55, 'buzz'); [0, 1, 2].forEach(k => cue(id, T_AG + k * .15, 'pop', { p: 1 + k * .15 })); cue(id, T_OK, 'chime', { f: 1175 });
  cue(id, T_HEAD, 'type', { n: 8, gap: .04 }); cue(id, T_SEND, 'whoosh', { dur: .7, v: .4 }); cue(id, T_SEND + .8, 'ding');
  [0, 1, 2, 3].forEach(k => cue(id, T_CYC + k * .65, 'chime', { f: 1318 + k * 60, up: 5 }));
  cue(id, T_SPLIT, 'whoosh', { dur: .6, v: .3 }); cue(id, T_STAMP, 'impact', { size: .7 }); cue(id, T_STAMP + .35, 'combo'); cue(id, T_OUT, 'whoosh', { dur: .9, dir: 'down', v: .4 });

  /** analista caricato correndo entre janelas */
  function analyst(ctx, x, y, t, run) {
    const ph = t * 14, lg = Math.sin(ph) * 22 * run, ar = Math.cos(ph) * 18 * run;
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = C.ink; ctx.lineCap = 'round'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(-lg * .6, -4); ctx.moveTo(0, -60); ctx.lineTo(lg * .6, -4); ctx.stroke();
    rr(ctx, -26, -150, 52, 96, 22); ctx.fillStyle = '#5E5850'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-18, -130); ctx.lineTo(-40 - ar * .4, -86 + ar * .4); ctx.moveTo(18, -130); ctx.lineTo(40 + ar * .4, -86 - ar * .4); ctx.lineWidth = 8; ctx.stroke();
    circle(ctx, 0, -178, 24, '#8A8378'); rr(ctx, -16, -186, 32, 10, 5); ctx.fillStyle = C.ink; ctx.fill();
    if (run > .5) for (let k = 0; k < 3; k++) { const q = (t * 2 + k / 3) % 1; ctx.fillStyle = rgba('#7FB3FF', 1 - q); ctx.beginPath(); ctx.ellipse(28 + k * 8, -196 + q * 40, 4, 6, 0, 0, TAU); ctx.fill(); }
    line(ctx, -60, -120, -100, -120, rgba(C.ink, .25), 4); line(ctx, -56, -96, -110, -96, rgba(C.ink, .25), 4);
    ctx.restore();
  }
  function appWindow(ctx, x, y, w, h, s, label) {
    if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    card(ctx, -w / 2, -h / 2, w, h, { r: 14, blur: 18 }); ctx.fillStyle = '#ECE6DD'; ctx.fillRect(-w / 2 + 1, -h / 2 + 1, w - 2, 30);
    [0, 1, 2].forEach(i => circle(ctx, -w / 2 + 20 + i * 18, -h / 2 + 16, 5, C.sand)); text(ctx, label, -w / 2 + 80, -h / 2 + 16, { size: 15, weight: 700, mono: true, color: C.stone });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = (r + c) % 3 ? '#F1ECE4' : '#E2DBD0'; ctx.fillRect(-w / 2 + 16 + c * (w - 32) / 4, -h / 2 + 46 + r * 28, (w - 32) / 4 - 6, 20); }
    ctx.restore();
  }
  function report(ctx, x, y, w, h, p, o = {}) {
    if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(o.s || 1, o.s || 1);
    card(ctx, -w / 2, -h / 2, w, h, { r: 12, blur: 24 });
    const hp = o.head || 0; rr(ctx, -w / 2 + 12, -h / 2 + 12, (w - 24) * clamp(p * 2), 34, 8); ctx.fillStyle = hp > 0 ? C.orange : '#ECE6DD'; ctx.fill();
    if (hp > 0) text(ctx, 'Fraude: novo padrão no e-commerce ↑'.slice(0, Math.ceil(34 * hp)), -w / 2 + 24, -h / 2 + 30, { size: 15, weight: 800, color: '#FFF' });
    [0, 1, 2].forEach(i => { const a = clamp(p * 3 - .6 - i * .3); rr(ctx, -w / 2 + 12 + i * (w - 24) / 3, -h / 2 + 58, (w - 24) / 3 - 8, 40, 8); ctx.fillStyle = rgba('#F3EEE7', a); ctx.fill();
      text(ctx, ['0,08%', '−12%', '3 alertas'][i], -w / 2 + 22 + i * (w - 24) / 3, -h / 2 + 79, { size: 15, weight: 800, color: C.ink, alpha: a }); });
    const ca = clamp(p * 2 - 1); ctx.beginPath(); for (let k = 0; k < 8; k++) ctx.lineTo(-w / 2 + 20 + k * (w - 40) / 7, h / 2 - 20 - Math.sin(k * .9) * 18 - k * 3); ctx.strokeStyle = rgba(C.red, ca); ctx.lineWidth = 3; ctx.stroke();
    if (o.label) text(ctx, o.label, w / 2 - 14, h / 2 - 14, { size: 14, weight: 800, mono: true, color: C.stone, align: 'right', base: 'alphabetic' });
    ctx.restore();
  }

  SCENES[id] = {
    themeAt: t => (t < T_CLICK ? 'light' : 'dark'),
    draw(ctx, t) {
      // ---------- ANTES ----------
      if (t < T_CLICK) {
        bgLight(ctx, t, { base: '#EFEBE5' });
        if (t < 3.2) { const sc = E.outBack(P(t, .05, .45)), out = P(t, 2.8, .4); questionCard(ctx, W / 2, H / 2, TX.questions[3], { tag: 'FRAUDE · BOARD', scale: lerp(1.6, 1.25, sc) * (1 - out * .4), alpha: 1 - out, w: 640, h: 240 }); }
        const b = P(t, T_BEFORE, .5);
        if (b > 0) {
          ctx.save(); ctx.globalAlpha = b;
          line(ctx, 120, 860, W - 120, 860, rgba(C.ink, .25), 4);
          pill(ctx, W - 170, 160, 'ANTES', { size: 24, fill: C.mute, color: '#FFF' });
          // pilha de planilhas
          const n = Math.min(10, 1 + Math.floor((t - T_BEFORE) * 1.15));
          for (let k = 0; k < n; k++) { const wob = Math.sin(t * 6 + k) * (k / 10) * 6; ctx.save(); ctx.translate(330 + wob, 840 - k * 34); ctx.rotate((hash(k) - .5) * .08);
            rr(ctx, -120, -15, 240, 30, 5); ctx.fillStyle = k % 2 ? '#FFFFFF' : '#F4F0E9'; ctx.fill(); ctx.strokeStyle = rgba(C.ink, .15); ctx.lineWidth = 2; ctx.stroke();
            for (let c = 1; c < 5; c++) line(ctx, -120 + c * 48, -15, -120 + c * 48, 15, rgba(C.ink, .1), 1); ctx.restore(); }
          text(ctx, 'xlsx × ' + n * 3, 330, 870 - n * 34 - 40, { size: 20, weight: 700, mono: true, color: C.stone, align: 'center' });
          // janelas + copia/cola
          const wins = [[820, 470, 'extração.xlsx'], [1080, 560, 'base_fraude.csv'], [880, 690, 'board_v7_final.pptx']];
          wins.forEach(([x, y, lb], i) => appWindow(ctx, x, y, 320, 200, .92 + .08 * Math.sin(t * 5 + i * 2), lb));
          for (let k = 0; k < 2; k++) { const a = wins[k], c = wins[k + 1], q = ((t - T_BEFORE) * 1.3 + k * .5) % 1;
            ctx.save(); ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(a[0] + 120, a[1]); ctx.quadraticCurveTo((a[0] + c[0]) / 2 + 200, (a[1] + c[1]) / 2, c[0] + 140, c[1]); ctx.strokeStyle = rgba(C.ink, .3); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
            const bx = (1 - q) * (1 - q) * (a[0] + 120) + 2 * (1 - q) * q * ((a[0] + c[0]) / 2 + 200) + q * q * (c[0] + 140), by = (1 - q) * (1 - q) * a[1] + 2 * (1 - q) * q * (a[1] + c[1]) / 2 + q * q * c[1];
            pill(ctx, bx, by, k ? 'Ctrl+V' : 'Ctrl+C', { size: 16, fill: C.ink, color: C.cream }); }
          // analista correndo
          const ax = 640 + Math.sin((t - T_BEFORE) * 1.6) * 520; analyst(ctx, ax, 856, t, 1);
          // relógio girando
          const cx = 1700, cy = 400; circle(ctx, cx, cy, 86, '#FFFFFF', rgba(C.ink, .3), 5);
          for (let k = 0; k < 12; k++) { const a = k * TAU / 12; line(ctx, cx + Math.cos(a) * 70, cy + Math.sin(a) * 70, cx + Math.cos(a) * 78, cy + Math.sin(a) * 78, C.stone, 3); }
          const mh = t * 9, hh = t * .75; line(ctx, cx, cy, cx + Math.cos(mh) * 64, cy + Math.sin(mh) * 64, C.red, 5); line(ctx, cx, cy, cx + Math.cos(hh) * 40, cy + Math.sin(hh) * 40, C.ink, 7);
          // cafés acumulando
          [4.5, 6.5, 8.5, 10.5].forEach((ct, k) => { const a = E.outBack(P(t, ct, .35)); if (a <= 0) return; const x = 1500 + k * 80; icon(ctx, 'cup', x, 824, 64 * a, C.mute, 8);
            for (let s = 0; s < 2; s++) { const q = (t * .8 + s * .5 + k * .3) % 1; ctx.beginPath(); ctx.moveTo(x - 6 + s * 12, 780 - q * 50); ctx.quadraticCurveTo(x + 6 + s * 12, 770 - q * 50, x - 6 + s * 12, 750 - q * 50); ctx.strokeStyle = rgba(C.stone, .6 * (1 - q)); ctx.lineWidth = 3; ctx.stroke(); } });
          // barra travada
          const jit = Math.sin(t * 30) * 2; rr(ctx, 700, 940, 520, 26, 13); ctx.fillStyle = '#E2DBD0'; ctx.fill(); rr(ctx, 700, 940, 520 * .87 + jit, 26, 13); ctx.fillStyle = C.stone; ctx.fill();
          text(ctx, 'Gerando report… 87%', 1240, 953, { size: 20, weight: 700, mono: true, color: C.mute });
          // extrair · conferir · formatar · repetir
          ['extrair', 'conferir', 'formatar', 'repetir ↻'].forEach((w, i) => { const p = P(t, T_WORDS[i], .3, E.outExpo); if (p <= 0) return; const x = 520 + i * 280;
            ctx.save(); ctx.translate(x, 290); ctx.rotate((i % 2 ? .05 : -.04)); ctx.scale(lerp(1.6, 1, p), lerp(1.6, 1, p)); ctx.globalAlpha *= p;
            rr(ctx, -125, -38, 250, 76, 12); ctx.strokeStyle = i === 3 ? C.red : C.ink; ctx.lineWidth = 5; ctx.stroke(); text(ctx, w, 0, 2, { size: 40, weight: 800, color: i === 3 ? C.red : C.ink, align: 'center' }); ctx.restore(); });
          ctx.restore();
        }
        caseHeader(ctx, t - T_BEFORE, TX.case4, { theme: 'light' });
        // interruptor
        const sw = P(t, T_SWITCH, .7, E.outExpo);
        if (sw > 0) { ctx.save(); ctx.globalAlpha = .55 * sw; ctx.fillStyle = '#E8E2D8'; ctx.fillRect(0, 0, W, H); ctx.restore();
          const x = lerp(W + 300, W / 2, sw), y = H / 2; shadowed(ctx, 60, 'rgba(0,0,0,.25)', 20, () => { rr(ctx, x - 150, y - 230, 300, 460, 40); ctx.fillStyle = '#FFFFFF'; ctx.fill(); });
          rr(ctx, x - 62, y - 140, 124, 280, 30); ctx.fillStyle = '#EFEAE2'; ctx.fill();
          rr(ctx, x - 52, y - 128, 104, 120, 24); ctx.fillStyle = C.orange; ctx.fill(); text(ctx, 'ON', x, y - 68, { size: 34, weight: 800, color: '#FFF', align: 'center' });
          text(ctx, 'lights-off', x, y + 300, { size: 44, weight: 800, color: C.ink, align: 'center', alpha: P(t, T_SWITCH + .5, .4) }); }
        return;
      }
      // ---------- APAGÃO + PIPELINE NEON ----------
      bgDark(ctx, t, { base: '#07080B', centerA: lerp(0, .8, P(t, T_PIPE, 3)), center: '#2A1A10', grid: false });
      if (t < T_CLICK + .9) { const k = P(t, T_CLICK, .9); const x = W / 2, y = H / 2; ctx.save(); ctx.globalAlpha = (1 - k) * .5;
        rr(ctx, x - 150, y - 230, 300, 460, 40); ctx.strokeStyle = rgba(C.cream, .4); ctx.lineWidth = 2; ctx.stroke(); rr(ctx, x - 52, y + 8, 104, 120, 24); ctx.fillStyle = C.ink3; ctx.fill(); ctx.restore(); }
      const up = P(t, T_SPLIT, .8, E.inOutCubic), ny = NY - up * 120, zoom = 1 - P(t, T_OUT, .9, E.inExpo) * .7, fade = 1 - P(t, T_OUT + .4, .5);
      camera(ctx, { z: zoom, x: W / 2, y: H / 2 }, () => {
        ctx.save(); ctx.globalAlpha = fade;
        // trilho neon
        for (let i = 0; i < NODES.length - 1; i++) { const lp = P(t, T_PIPE + i + .1, .8, E.inOutCubic); if (lp <= 0) continue; const x0 = NX(i) + 60, x1 = NX(i + 1) - 60, xe = lerp(x0, x1, lp);
          glow(ctx, xe, ny, 40, C.orange, .6); ctx.save(); ctx.shadowColor = C.orange; ctx.shadowBlur = 18; line(ctx, x0, ny, xe, ny, C.orange, 5); ctx.restore(); }
        const lit = clamp((t - T_PIPE) / (NODES.length - 1)); // fração do trilho aceso
        for (let k = 0; k < 16; k++) { const q = ((t - T_PIPE) * .32 + k / 16) % 1; if (q > lit || t < T_PIPE + .6) continue; const x = lerp(NX(0), NX(5), q);
          glow(ctx, x, ny, 22, C.yellow, .8); rr(ctx, x - 7, ny - 7, 14, 14, 3); ctx.fillStyle = C.yellow; ctx.fill(); }
        // pacote suspeito barrado na validação
        if (t > T_RED && t < T_RED + 1.6) { const k = P(t, T_RED, .55), d = P(t, T_RED + .55, 1, E.inQuad); const x = lerp(NX(0), NX(1) - 30, k), y = ny + d * 160;
          glow(ctx, x, y, 30, C.red, 1 - d); rr(ctx, x - 9, y - 9, 18, 18, 3); ctx.fillStyle = rgba(C.red, 1 - d); ctx.fill(); if (d > 0) icon(ctx, 'cross', NX(1), ny - 100, 40, rgba(C.red, 1 - d), 12); }
        // nós
        NODES.forEach(([lb, ic], i) => { const a = E.outBack(P(t, T_PIPE + i, .45)); if (a <= 0) return; const x = NX(i);
          glow(ctx, x, ny, 150, C.orange, .35 * a); circle(ctx, x, ny, 60 * a, '#141010', C.orange, 4); icon(ctx, ic, x, ny, 58 * a, i === 5 ? C.yellow : C.cream, 7);
          text(ctx, lb, x, ny + 100, { size: 26, weight: 800, color: C.cream, align: 'center', alpha: P(t, T_PIPE + i, .4) }); });
        // agentes do caso 01 voltam: geradores no nó Insights, validador e embalador
        const ga = 1 - P(t, T_SPLIT, .4);
        ['analista', 'business', 'clevel'].forEach((rl, k) => { const a = E.outBack(P(t, T_AG + k * .15, .4)); if (a <= 0) return; agent(ctx, NX(3) - 70 + k * 70, ny - 150, 26 * a, { role: rl, t: t + k, seed: k, alpha: ga, look: 1 }); });
        const va = E.outBack(P(t, T_AG + .5, .4)); if (va > 0) agent(ctx, (NX(3) + NX(4)) / 2, ny - 180, 30 * va, { role: 'validador', t: t + 5, verdict: t > T_OK ? 'ok' : null, alpha: ga });
        const pa = E.outBack(P(t, T_AG + .7, .4)); if (pa > 0) agent(ctx, NX(4) + 40, ny - 150, 28 * pa, { role: 'embalador', t: t + 2, alpha: ga });
        // report se monta e vai ao board
        const rp = P(t, T_REP, 1.0), snd = P(t, T_SEND, .8, E.inOutCubic);
        if (t > T_REP && t < T_SPLIT + .5) { const rx = lerp(NX(4), NX(5), snd), ry = lerp(ny + 250, ny - 210, snd) - Math.sin(snd * Math.PI) * 80;
          report(ctx, rx, ry, 300, 180, rp, { head: P(t, T_HEAD, .9), s: lerp(1, .8, snd) }); }
        if (t > T_SEND + .8) { const g = 1 - P(t, T_SEND + .8, 1.2); glow(ctx, NX(5), ny, 260, C.yellow, .7 * g); }
        // ciclo: Jan, Fev, Mar, Abr — o report chega sozinho, todo mês
        ['Jan', 'Fev', 'Mar', 'Abr'].forEach((m, k) => { const t0 = T_CYC + k * .65, q = P(t, t0, .55, E.inOutCubic); if (t < t0 || t > T_SPLIT + .4) return;
          const x = lerp(NX(4), NX(5) - 20 + k * 16, q), y = lerp(ny + 250, ny + 230 - k * 14, q); report(ctx, x, y, 170, 100, 1, { s: 1, label: m }); });
        if (t > T_CYC) { const x = NX(5), y = ny - 360, a = P(t, T_CYC, .4) * (1 - P(t, T_SPLIT, .3)); ctx.save(); ctx.globalAlpha = a; circle(ctx, x, y, 44, null, rgba(C.cream, .7), 4);
          line(ctx, x, y, x + Math.cos(t * .3) * 30, y + Math.sin(t * .3) * 30, C.cream, 4); line(ctx, x, y, x, y - 22, C.cream, 5); text(ctx, 'no horário', x, y + 70, { size: 20, weight: 700, mono: true, color: C.stone, align: 'center' }); ctx.restore(); }
        // antes × depois
        if (up > 0) {
          const y = lerp(H + 100, 770, up), w = 760, h = 200;
          ctx.save(); ctx.globalAlpha = up; rr(ctx, W / 2 - w - 30, y, w, h, 24); ctx.fillStyle = '#1B1B1B'; ctx.fill(); ctx.strokeStyle = rgba(C.cream, .12); ctx.lineWidth = 2; ctx.stroke();
          text(ctx, 'ANTES', W / 2 - w - 30 + 40, y + 50, { size: 20, weight: 700, mono: true, color: C.stone, ls: 3 }); text(ctx, 'Manual · fragmentado · lento', W / 2 - w - 30 + 40, y + 120, { size: 40, weight: 800, color: C.stone });
          rr(ctx, W / 2 + 30, y, w, h, 24); ctx.fillStyle = rgba(C.orange, .14); ctx.fill(); ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.stroke(); glow(ctx, W / 2 + 30 + w / 2, y + h / 2, 400, C.orange, .25);
          text(ctx, 'DEPOIS · LIGHTS-OFF', W / 2 + 70, y + 50, { size: 20, weight: 700, mono: true, color: C.orange, ls: 3 }); text(ctx, 'Automático · consistente · escalável', W / 2 + 70, y + 120, { size: 40, weight: 800, color: C.cream });
          ctx.restore(); }
        ctx.restore();
      });
      if (t > T_CLICK + 1.6) caseHeader(ctx, t - T_CLICK - 1.6, TX.case4, { theme: 'dark', out: T_OUT - T_CLICK - 1.6 });
      stamp(ctx, W / 2, 250, TX.case4.stamp, P(t, T_STAMP, 1.1) * (1 - P(t, T_OUT, .4)), { theme: 'dark' });
    }
  };
})();
