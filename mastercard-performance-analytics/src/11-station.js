/* ============================================================================
   11. KIT DA ESTAÇÃO — o vagão da Linha Performance Analytics, o trem que
   passa entre as estações, o painel "próxima estação", o bilhete de embarque,
   as legendas de tela (o vídeo roda sem narrador) e os cartões de conexão
   ========================================================================== */

/** vagão visto de lado. (x, y) = canto superior esquerdo; base de 1000 × 400 em escala s.
 *  o: len (comprimento base), open (0–1 abre as portas), lit (luz interna), seed, label */
function trainCar(ctx, x, y, s, o = {}) {
  const L = o.len || 1000, open = clamp(o.open || 0), lit = o.lit == null ? 1 : o.lit, R = rng(o.seed || 3);
  const doors = o.doors || [L * .25, L * .75], DW = 150, WY = 60, WH = 116;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // sombra chapada, truques e rodas
  rr(ctx, 16, 20, L, 360, 46); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fill();
  [[L * .08, L * .3], [L * .62, L * .3]].forEach(([bx, bw]) => { rr(ctx, bx, 340, bw, 34, 10); ctx.fillStyle = '#211A15'; ctx.fill(); });
  [L * .14, L * .32, L * .68, L * .86].forEach(wx => { circle(ctx, wx, 378, 30, '#1A1512', INK, 5); circle(ctx, wx, 378, 9, '#6E665C'); });
  // corpo: teto, faixa Mastercard, saia
  ctx.save(); rr(ctx, 0, 0, L, 360, 46); ctx.clip();
  ctx.fillStyle = '#F3EBDD'; ctx.fillRect(0, 0, L, 360);
  ctx.fillStyle = '#DCD1C1'; ctx.fillRect(0, 0, L, 30);
  [[C.red, 232], [C.orange, 250], [C.yellow, 268]].forEach(([c, yy]) => { ctx.fillStyle = c; ctx.fillRect(0, yy, L, 18); });
  ctx.fillStyle = '#2A221C'; ctx.fillRect(0, 300, L, 60);
  hatch(ctx, () => rr(ctx, 0, 0, L, 300, 0), L * .78, 0, L * .22, 300, { alpha: .14, gap: 12 });
  // janelas com a luz quente do vagão e passageiros
  const slots = [], edges = [30, ...doors.flatMap(d => [d - DW / 2 - 22, d + DW / 2 + 22]), L - 30];
  for (let k = 0; k < edges.length; k += 2) { const a = edges[k], b = edges[k + 1], n = Math.max(0, Math.floor((b - a + 24) / 146)), w0 = n ? (b - a - (n - 1) * 24) / n : 0;
    for (let j = 0; j < n; j++) slots.push(a + j * (w0 + 24), w0); }
  for (let k = 0; k < slots.length; k += 2) {
    const wx = slots[k], ww = slots[k + 1];
    rr(ctx, wx, WY, ww, WH, 18); const g = ctx.createLinearGradient(0, WY, 0, WY + WH);
    g.addColorStop(0, mix('#3A2A1E', '#FFE2B0', lit)); g.addColorStop(1, mix('#2A1E15', '#FF9C45', lit)); ctx.fillStyle = g; ctx.fill();
    const heads = Math.floor(R() * 3);
    for (let h = 0; h < heads; h++) { const hx = wx + ww * (.25 + .5 * R()), hy = WY + WH - 30;
      ctx.fillStyle = 'rgba(40,24,14,.72)'; ctx.beginPath(); ctx.arc(hx, hy - 16, 15, 0, TAU); ctx.fill(); rr(ctx, hx - 26, hy, 52, 40, 18); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.moveTo(wx + 14, WY + 8); ctx.lineTo(wx + 40, WY + 8); ctx.lineTo(wx + 14, WY + 60); ctx.fill();
    inkRect(ctx, wx, WY, ww, WH, 18, 5, k + 1);
  }
  // portas: duas folhas que deslizam; atrás, o interior aceso
  doors.forEach((d, i) => {
    const dx = d - DW / 2, gap = open * 66;
    rr(ctx, dx, 44, DW, 256, 8); ctx.fillStyle = mix('#2A1E15', '#FFC27A', lit * (.4 + .6 * open)); ctx.fill();
    if (open > 0) glow(ctx, d, 170, 140 * open, '#FFD9A0', .5 * open * lit);
    [[-1, dx - gap], [1, d + gap]].forEach(([sd, lx]) => {
      rr(ctx, lx, 44, DW / 2, 256, 6); ctx.fillStyle = '#E9DFCF'; ctx.fill();
      rr(ctx, lx + 14, 64, DW / 2 - 28, 104, 10); ctx.fillStyle = mix('#3A2A1E', '#FFD49A', lit); ctx.fill();
      inkRect(ctx, lx, 44, DW / 2, 256, 6, 4, 20 + i * 2 + (sd > 0));
    });
    rr(ctx, d - 58, 12, 116, 26, 5); ctx.fillStyle = '#120E0B'; ctx.fill();
    text(ctx, o.label || 'ANALYTICS', d, 26, { size: 15, weight: 900, mono: true, color: C.orange, align: 'center', ls: 2 });
  });
  // logo no costado
  const lx = o.logoX == null ? L * .5 : o.logoX;
  intersection(ctx, lx - 140, 206, 11, 13);
  text(ctx, 'PERFORMANCE ANALYTICS', lx - 120, 207, { size: 17, weight: 900, color: INK, ls: 2 });
  ctx.restore();
  inkRect(ctx, 0, 0, L, 360, 46, 6, o.seed || 3);
  ctx.restore();
}

/* ---------- o trem passa na frente da câmera na chegada de cada estação (esconde o corte) ---------- */
const TRAIN_PASS = (() => {
  const S = 3.2, LEN = 1000, HALF = .5, list = [];
  const stopAt = T => CONFIG.mode !== 'reel' && CONFIG.stops.some(st => st.after && Math.abs(st.T - T) < 1e-3);
  for (let k = 1; k <= 7; k++) { const Ts = CONFIG.stationStart[k]; if (Ts == null) continue; list.push({ Ts, fromStop: stopAt(Ts) }); }
  list.forEach(p => { const sc = sceneAt(p.Ts + .01); cue(sc.id, Math.max(0, p.Ts - .35 - sc.start), 'whoosh', { dur: .9, v: .38 }); });
  return {
    list,
    draw(ctx, T) {
      list.forEach(p => {
        const u = (T - (p.Ts - HALF)) / (2 * HALF); if (u <= 0 || u >= 1 || (p.fromStop && u < .5)) return;
        const span = W + LEN * S + 80, x = W + 40 - span * u, y = -40;
        ctx.save(); ctx.globalAlpha = .28; trainCar(ctx, x + 70, y, S, { len: LEN, seed: 5, lit: .9 }); ctx.restore();
        trainCar(ctx, x, y, S, { len: LEN, seed: 5, lit: .9 });
        // rastros de velocidade
        const r = rng(Math.floor(p.Ts * 10)); ctx.save(); ctx.globalAlpha = .5;
        for (let k = 0; k < 18; k++) { const ly = r() * H, lx = x + r() * LEN * S, lw = 200 + r() * 600; line(ctx, lx, ly, lx + lw, ly, k % 3 ? 'rgba(255,240,220,.5)' : rgba(C.orange, .6), 2 + r() * 5); }
        ctx.restore();
      });
    }
  };
})();

/** painel de LED do vagão: "próxima estação" nos últimos segundos de cada estação */
function nextStationLED(ctx, T) {
  let nk = 0, Tn = 0;
  for (let k = 1; k <= 7; k++) { const Ts = CONFIG.stationStart[k]; if (Ts != null && Ts > T) { nk = k; Tn = Ts; break; } }
  const stop = CONFIG.mode !== 'reel' ? CONFIG.stops.find(st => st.after && st.T > T && (!nk || st.T <= Tn)) : null;
  const target = stop ? stop.T : Tn; if (!target || target - T > 4.5) return;
  const a = clamp((4.5 - (target - T)) / .3) * clamp((target - T - .1) / .3); if (a <= 0) return;
  const label = stop ? `PRÓXIMA PARADA  ›  ${stop.id === 'end' ? 'ENCERRAMENTO' : 'CONVERSA COM AS APRESENTADORAS'}` : `PRÓXIMA ESTAÇÃO  ›  ${TX.stations[nk - 1].n} ${TX.stations[nk - 1].short}`;
  const w = measure(ctx, label, 20, 800, true, 3) + 64, x = 562, y = 62, blink = Math.floor(NOW * 2.5) % 2 ? 1 : .55;
  ctx.save(); ctx.globalAlpha *= a;
  rr(ctx, x, y - 26, w, 52, 10); ctx.fillStyle = '#0A0807'; ctx.fill(); ctx.strokeStyle = '#3A2A1E'; ctx.lineWidth = 3; ctx.stroke();
  ctx.save(); ctx.shadowColor = C.orange; ctx.shadowBlur = 10; text(ctx, label, x + 32, y + 1, { size: 20, weight: 800, mono: true, color: C.orange, ls: 3, alpha: blink }); ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let k = 0; k < 9; k++) ctx.fillRect(x + 6, y - 22 + k * 5.4, w - 12, 1.6);
  ctx.restore();
}

/** bilhete de embarque perfurado */
function ticket(ctx, x, y, s, o = {}) {
  const p = clamp(o.punch || 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || -.05); ctx.scale(s, s);
  paper(ctx, -330, -120, 660, 240, { r: 16, fill: '#F6EEDF', shadow: 12, shadowColor: '#000', lw: 4, halftone: .06 });
  rr(ctx, -330, -120, 150, 240, 16); ctx.fillStyle = C.orange; ctx.fill(); inkRect(ctx, -330, -120, 150, 240, 16, 4, 8);
  intersection(ctx, -255, -40, 30, 38);
  text(ctx, 'BILHETE', -255, 50, { size: 22, weight: 900, mono: true, color: '#FFF', align: 'center', ls: 3 });
  ctx.save(); ctx.setLineDash([8, 8]); line(ctx, -170, -110, -170, 110, INK, 3); ctx.restore();
  text(ctx, 'LINHA PERFORMANCE ANALYTICS', -140, -72, { size: 26, weight: 900, color: INK, ls: 1 });
  text(ctx, 'DE  dados', -140, -22, { size: 30, weight: 800, mono: true, color: '#4A4038' });
  text(ctx, 'PARA  valor', -140, 22, { size: 30, weight: 800, mono: true, color: C.red });
  text(ctx, '7 estações · 2 baldeações', -140, 72, { size: 20, weight: 700, mono: true, color: '#6A6056' });
  if (p > 0) { ctx.save(); ctx.translate(210, 10); ctx.rotate(-.22); ctx.scale(lerp(1.8, 1, E.outBack(p)), lerp(1.8, 1, E.outBack(p))); ctx.globalAlpha *= clamp(p * 2);
    rr(ctx, -95, -40, 190, 80, 10); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.stroke();
    text(ctx, 'EMBARQUE', 0, -8, { size: 28, weight: 900, mono: true, color: C.red, align: 'center', ls: 3 }); text(ctx, '✓ validado', 0, 22, { size: 18, weight: 800, mono: true, color: C.red, align: 'center' }); ctx.restore(); }
  ctx.restore();
}

/* ---------- legendas de tela (sem narrador, cada cena se explica sozinha) ----------
   SCENES[id].caps = [[t0, t1, 'texto com *destaque*', 'ETIQUETA'], …] em tempo local da cena */
function captionStrip(ctx, s, t) {
  const caps = (SCENES[s.id] && SCENES[s.id].caps) || [];
  caps.forEach(([t0, t1, str, kick]) => {
    const a = Math.min(P(t, t0, .35), 1 - P(t, t1 - .35, .35)); if (a <= 0) return;
    let size = 34; const plain = str.replace(/\*/g, ''), kw = kick ? measure(ctx, kick, 18, 800, true, 3) + 44 : 0;
    let tw = measure(ctx, plain, size, 800); const maxW = 1680 - kw; if (tw > maxW) { size *= maxW / tw; tw = maxW; }
    const w = kw + tw + 72, h = 78, x = W / 2 - w / 2, y = H - 122 + (1 - E.outCubic(a)) * 24;
    ctx.save(); ctx.globalAlpha *= a;
    paper(ctx, x, y, w, h, { r: 12, fill: 'rgba(18,14,11,.93)', outline: '#000', shadow: 7, shadowColor: 'rgba(0,0,0,.6)', lw: 3 });
    if (kick) { rr(ctx, x + 18, y + 20, kw - 8, 38, 6); ctx.fillStyle = C.orange; ctx.fill(); text(ctx, kick, x + 18 + (kw - 8) / 2, y + 40, { size: 18, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 3 }); }
    rich(ctx, str, x + 36 + kw, y + h / 2 + 1, { size, weight: 800, color: '#FFF', accent: C.yellow, align: 'left', ls: 0 });
    ctx.restore();
  });
}

/** cartão de conexão em tela cheia: etiqueta + frase grande (com *destaque*) + linha de apoio */
function bridgeCard(ctx, a, kicker, str, o = {}) {
  if (a <= 0) return; a = clamp(a);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = o.bg || '#120E0B'; ctx.fillRect(0, 0, W, H);
  // a linha do metrô atravessando o cartão
  const ly = H / 2 + 210, run = (o.t || 0) * 120;
  line(ctx, 0, ly, W, ly, INK, 30); line(ctx, 0, ly, W, ly, o.lineCol || C.orange, 16);
  for (let k = -1; k < 8; k++) { const x = ((k * 300 - run) % (W + 300) + W + 300) % (W + 300) - 150; circle(ctx, x, ly, 18, '#FFF8EE', INK, 5); }
  glow(ctx, W / 2, H / 2 - 20, 700, C.orange, .18);
  const e = E.outExpo(clamp(a * 1.4)), size = o.size || 100;
  if (kicker) { const kw = measure(ctx, kicker, 26, 800, true, 6) + 70; ctx.save(); ctx.translate(W / 2, H / 2 - 150); ctx.rotate(-.02);
    paper(ctx, -kw / 2, -28, kw, 56, { r: 6, fill: C.red, shadow: 6, shadowColor: '#000', lw: 3 }); text(ctx, kicker, 0, 2, { size: 26, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 6 }); ctx.restore(); }
  ctx.save(); ctx.translate(W / 2, H / 2 - 20); ctx.scale(lerp(1.25, 1, e), lerp(1.25, 1, e));
  const pw = measure(ctx, str.replace(/\*/g, ''), size, 900) + 140; brush(ctx, -pw / 2, -size * .62, pw, size * 1.24, '#2A1E15', o.seed || 9, E.outCubic(clamp(a * 1.6)));
  rich(ctx, str, 0, 0, { size, weight: 900, color: '#FFF', accent: C.orange, retro: true, depth: 6, lw: 5 });
  ctx.restore();
  if (o.sub) text(ctx, o.sub, W / 2, H / 2 + 100, { size: 34, weight: 700, color: '#E9DDCC', align: 'center', alpha: clamp(a * 2 - .8) });
  ctx.restore();
}
