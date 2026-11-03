/* ============================================================================
   11. KIT DA ESTAÇÃO — o vagão da Linha Performance Analytics, o trem que
   passa entre as estações, o painel "próxima estação", o bilhete de embarque,
   as legendas de tela (o vídeo roda sem narrador) e os cartões de conexão
   ========================================================================== */

/** v7.11: o trem da linha é um TREM BALA visto de lado. (x, y) = canto superior esquerdo do corpo do vagão; base L × 408 em escala s
 *  (as rodas, escondidas pela saia, tocam o trilho em y = 408). o: len, open (abre as portas), lit (luz interna), seed, label,
 *  doors, logoX, nose: 'right' | 'left' | 'both' (o nariz aerodinâmico fica fora de [0, L]), noseLen */
const NOSE_LEN = 460;
function trainCar(ctx, x, y, s, o = {}) {
  const L = o.len || 1000, open = clamp(o.open || 0), lit = o.lit == null ? 1 : o.lit, R = rng(o.seed || 3), N = o.noseLen || NOSE_LEN;
  const doors = o.doors || [L * .25, L * .75], DW = 128, TOP = 22, BOT = 372, WY = 96, WH = 70;
  const nr = o.nose === 'right' || o.nose === 'both', nl = o.nose === 'left' || o.nose === 'both';
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // contorno: teto reto, nariz em curva longa até a ponta baixa, saia lisa
  const shell = () => { ctx.beginPath();
    if (nl) ctx.moveTo(0, TOP); else { ctx.moveTo(56, TOP); }
    if (nr) { ctx.lineTo(L, TOP); ctx.bezierCurveTo(L + N * .5, TOP, L + N * .95, 190, L + N, 304); ctx.quadraticCurveTo(L + N * 1.01, BOT, L + N * .72, BOT); }
    else { ctx.lineTo(L - 56, TOP); ctx.arcTo(L, TOP, L, TOP + 56, 56); ctx.lineTo(L, BOT - 24); ctx.arcTo(L, BOT, L - 24, BOT, 24); }
    if (nl) { ctx.lineTo(-N * .72, BOT); ctx.quadraticCurveTo(-N * 1.01, BOT, -N, 304); ctx.bezierCurveTo(-N * .95, 190, -N * .5, TOP, 0, TOP); }
    else { ctx.lineTo(24, BOT); ctx.arcTo(0, BOT, 0, BOT - 24, 24); ctx.lineTo(0, TOP + 56); ctx.arcTo(0, TOP, 56, TOP, 56); }
    ctx.closePath(); };
  const x0 = nl ? -N : 0, x1 = nr ? L + N : L;
  // sombra no chão e truques (as rodas ficam escondidas pela saia)
  ctx.save(); ctx.globalAlpha *= .3; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, 408, (x1 - x0) / 2, 14, 0, 0, TAU); ctx.fill(); ctx.restore();
  [L * .16, L * .84].forEach(bx => { rr(ctx, bx - 96, BOT - 6, 192, 36, 12); ctx.fillStyle = '#23292C'; ctx.fill(); [-50, 50].forEach(dx => circle(ctx, bx + dx, BOT + 24, 14, '#3A4246')); });
  // corpo branco com a luz do alto
  shell(); const g = ctx.createLinearGradient(0, TOP, 0, BOT); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.55, '#EEF1F0'); g.addColorStop(1, '#CBD2D1'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); shell(); ctx.clip();
  // saia escura, faixa de painel e a assinatura Mastercard (vermelho, laranja, amarelo) correndo até o nariz
  ctx.fillStyle = '#2C3437'; ctx.fillRect(x0 - 10, 326, x1 - x0 + 20, 60);
  line(ctx, x0, 214, x1, 214, 'rgba(120,132,136,.35)', 3);
  [[C.red, 280], [C.orange, 292], [C.yellow, 304]].forEach(([c, yy]) => { ctx.fillStyle = c; ctx.fillRect(x0 - 10, yy, x1 - x0 + 20, 10); });
  // faixa contínua de janelas (vidro escuro, interior aceso) e os passageiros
  rr(ctx, 40, WY, L - 80, WH, 22); const gw = ctx.createLinearGradient(0, WY, 0, WY + WH);
  gw.addColorStop(0, mix('#1B2830', '#3A2E22', lit * .5)); gw.addColorStop(1, mix('#22343D', '#8A5A2E', lit * .45)); ctx.fillStyle = gw; ctx.fill();
  for (let k = 0; k < Math.floor(L / 110); k++) { const hx = 70 + k * 110 + R() * 40; if (R() < .45) { ctx.fillStyle = 'rgba(10,14,16,.55)'; circle(ctx, hx, WY + 36, 11, 'rgba(10,14,16,.55)'); rr(ctx, hx - 18, WY + 48, 36, 30, 12); ctx.fill(); } }
  for (let k = 0; k < Math.ceil(L / 260); k++) { const rx = 80 + k * 260; ctx.fillStyle = 'rgba(255,255,255,.13)'; ctx.beginPath(); ctx.moveTo(rx, WY + 4); ctx.lineTo(rx + 70, WY + 4); ctx.lineTo(rx + 30, WY + WH - 4); ctx.lineTo(rx - 40, WY + WH - 4); ctx.closePath(); ctx.fill(); }
  // a janela da cabine segue a curva do nariz
  const cab = (sx, ex) => { ctx.beginPath(); ctx.moveTo(sx, WY); ctx.lineTo(ex(.18), WY); ctx.quadraticCurveTo(ex(.56), WY + 6, ex(.66), WY + WH + 4); ctx.lineTo(sx, WY + WH + 4); ctx.closePath();
    const gc = ctx.createLinearGradient(0, WY, 0, WY + WH); gc.addColorStop(0, '#16222A'); gc.addColorStop(1, '#2C4450'); ctx.fillStyle = gc; ctx.fill(); };
  if (nr) cab(L - 60, f => L + N * f); if (nl) cab(60, f => -N * f);
  // farol na ponta do nariz
  if (nr) { rr(ctx, L + N * .8, 262, N * .14, 12, 6); ctx.fillStyle = '#FFF4D6'; ctx.fill(); }
  if (nl) { rr(ctx, -N * .94, 262, N * .14, 12, 6); ctx.fillStyle = '#FFE2C8'; ctx.fill(); }
  // portas: folhas que deslizam; atrás, o interior aceso
  doors.forEach((d, i) => {
    const dx = d - DW / 2, gap = open * DW * .52;
    if (open > 0) { rr(ctx, dx, 58, DW, 262, 10); ctx.fillStyle = mix('#3A2A1E', '#FFDDA6', lit * (.5 + .5 * open)); ctx.fill(); glow(ctx, d, 190, 150 * open, '#FFE2B0', .5 * open * lit); }
    [[-1, dx - gap], [1, d + gap]].forEach(([sd, lx]) => {
      rr(ctx, lx, 58, DW / 2, 262, 8); ctx.fillStyle = open > 0 ? '#F4F6F5' : 'rgba(0,0,0,0)'; ctx.fill();
      ctx.strokeStyle = '#9AA4A7'; ctx.lineWidth = 3; ctx.stroke();
      rr(ctx, lx + 12, 80, DW / 2 - 24, 96, 10); ctx.fillStyle = mix('#1E2C34', '#5A4632', lit * .35); ctx.fill();
    });
    rr(ctx, d - 56, 30, 112, 22, 6); ctx.fillStyle = '#141B1E'; ctx.fill();
    text(ctx, o.label || 'ANALYTICS', d, 41, { size: 13, weight: 900, mono: true, color: C.orange, align: 'center', ls: 2 });
  });
  // logo no costado
  const lx = o.logoX == null ? L * .5 : o.logoX;
  intersection(ctx, lx - 132, 248, 10, 12);
  text(ctx, 'PERFORMANCE ANALYTICS', lx - 114, 249, { size: 14, weight: 900, color: '#2C3437', ls: 1 });
  // reflexo do céu no teto
  const gr = ctx.createLinearGradient(0, TOP, 0, TOP + 60); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(x0, TOP, x1 - x0, 60);
  ctx.restore();
  shell(); ctx.strokeStyle = '#1E2427'; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}

/** o trem bala da linha visto de lado (ponte, viaduto dos pilares e 07): dois vagões, nariz na frente e na traseira.
 *  xf = ponta do nariz da frente · ry = topo do trilho · o farol pulsa com a música */
function sideTrain(ctx, xf, ry, o = {}) {
  const S = o.s || .17, L = 1000, GAP = 40, n = o.cars || 2, y = ry - 408 * S, k0 = S / .17, N = NOSE_LEN;
  glow(ctx, xf - 30 * k0, y + 268 * S, 150 * k0, '#FFE9C0', .22 + .18 * BT.level);
  for (let k = n - 1; k >= 0; k--) trainCar(ctx, xf - N * S - (k + 1) * L * S - k * GAP * S, y, S, { len: L, seed: (o.seed || 7) + k, lit: 1, doors: [L * .3, L * .7],
    nose: n === 1 ? 'both' : k === 0 ? 'right' : k === n - 1 ? 'left' : null });
  glow(ctx, xf - 40 * k0, y + 268 * S, 40 * k0, '#FFF6DA', .85);
}
/** comprimento total do trem bala em escala S (para quem posiciona o trem na tela) */
const trainLen = (S = .17, n = 2) => (n * 1000 + (n - 1) * 40 + 2 * NOSE_LEN) * S;

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
        const span = W + (LEN + NOSE_LEN) * S + 80, x = W + 40 + NOSE_LEN * S - span * u, y = -40;
        ctx.save(); ctx.globalAlpha = .28; trainCar(ctx, x + 70, y, S, { len: LEN, seed: 5, lit: .9, nose: 'left' }); ctx.restore();
        trainCar(ctx, x, y, S, { len: LEN, seed: 5, lit: .9, nose: 'left' });
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
  const w = measure(ctx, label, 20, 800, true, 3) + 64, x = W - 64 - w, y = 214, blink = Math.floor(NOW * 2.5) % 2 ? 1 : .55;   // v7: abaixo do mini-mapa
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
   SCENES[id].caps = [[t0, t1, 'texto com *destaque*', 'ETIQUETA', { top }], …] em tempo local da cena */
function captionStrip(ctx, s, t) {
  const caps = (SCENES[s.id] && SCENES[s.id].caps) || [];
  caps.forEach(([t0, t1, str, kick, opt]) => {
    const a = Math.min(P(t, t0, .35), 1 - P(t, t1 - .35, .35)); if (a <= 0) return;
    let size = 34; const plain = str.replace(/\*/g, ''), kw = kick ? measure(ctx, kick, 18, 800, true, 3) + 44 : 0;
    let tw = measure(ctx, plain, size, 800); const maxW = 1680 - kw; if (tw > maxW) { size *= maxW / tw; tw = maxW; }
    const w = kw + tw + 72, h = 78, x = W / 2 - w / 2, y = (opt && opt.top ? 118 : H - 122) + (1 - E.outCubic(a)) * 24 * (opt && opt.top ? -1 : 1);
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
