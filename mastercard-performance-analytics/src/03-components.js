/* ============================================================================
   3. COMPONENTS — ícones, agentes, cards, carimbos, chips, dashboard
   ========================================================================== */

// ---------- ícones vetoriais (caixa s×s centrada em x,y) ----------
function icon(ctx, name, x, y, s, color = C.ink, lw) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw || 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const S = () => ctx.stroke(), Fl = () => ctx.fill(), B = () => ctx.beginPath();
  switch (name) {
    case 'dashboard': rr(ctx, -42, -34, 84, 68, 10); S(); B(); ctx.moveTo(-26, 18); ctx.lineTo(-26, 2); ctx.moveTo(-10, 18); ctx.lineTo(-10, -8);
      ctx.moveTo(6, 18); ctx.lineTo(6, -2); ctx.moveTo(22, 18); ctx.lineTo(22, -16); S(); break;
    case 'basket': B(); ctx.moveTo(-44, -6); ctx.lineTo(44, -6); ctx.lineTo(32, 36); ctx.lineTo(-32, 36); ctx.closePath(); S();
      B(); ctx.moveTo(-24, -6); ctx.lineTo(-6, -36); ctx.moveTo(24, -6); ctx.lineTo(6, -36); S(); B(); ctx.moveTo(-14, 6); ctx.lineTo(-12, 26); ctx.moveTo(14, 6); ctx.lineTo(12, 26); ctx.moveTo(0, 6); ctx.lineTo(0, 26); S(); break;
    case 'orbit': B(); ctx.ellipse(0, 0, 44, 18, -.4, 0, TAU); S(); circle(ctx, 0, 0, 14, color); circle(ctx, 34, -26, 7, color); break;
    case 'bolt': B(); ctx.moveTo(8, -44); ctx.lineTo(-24, 6); ctx.lineTo(0, 6); ctx.lineTo(-8, 44); ctx.lineTo(26, -8); ctx.lineTo(2, -8); ctx.closePath(); Fl(); break;
    case 'clock': circle(ctx, 0, 0, 40, null, color, 7); B(); ctx.moveTo(0, 0); ctx.lineTo(0, -24); ctx.moveTo(0, 0); ctx.lineTo(18, 10); S(); break;
    case 'check': B(); ctx.moveTo(-30, 2); ctx.lineTo(-8, 24); ctx.lineTo(32, -22); ctx.lineWidth = 12; S(); break;
    case 'cross': B(); ctx.moveTo(-24, -24); ctx.lineTo(24, 24); ctx.moveTo(24, -24); ctx.lineTo(-24, 24); ctx.lineWidth = 12; S(); break;
    case 'gear': for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * TAU / 8); ctx.fillRect(-7, -44, 14, 16); ctx.restore(); }
      circle(ctx, 0, 0, 30, null, color, 10); circle(ctx, 0, 0, 9, color); break;
    case 'db': B(); ctx.ellipse(0, -28, 34, 11, 0, 0, TAU); S(); B(); ctx.moveTo(-34, -28); ctx.lineTo(-34, 28); ctx.ellipse(0, 28, 34, 11, 0, Math.PI, 0, true); ctx.lineTo(34, -28); S();
      B(); ctx.ellipse(0, 0, 34, 11, 0, 0, Math.PI); S(); break;
    case 'shield': B(); ctx.moveTo(0, -42); ctx.lineTo(34, -28); ctx.quadraticCurveTo(34, 24, 0, 44); ctx.quadraticCurveTo(-34, 24, -34, -28); ctx.closePath(); S();
      B(); ctx.moveTo(-14, 0); ctx.lineTo(-3, 12); ctx.lineTo(16, -12); S(); break;
    case 'doc': rr(ctx, -30, -40, 60, 80, 8); S(); B(); ctx.moveTo(-16, -20); ctx.lineTo(16, -20); ctx.moveTo(-16, -4); ctx.lineTo(16, -4); ctx.moveTo(-16, 12); ctx.lineTo(4, 12); S(); break;
    case 'user': circle(ctx, 0, -16, 16, null, color, 7); B(); ctx.arc(0, 40, 32, Math.PI * 1.1, Math.PI * 1.9); S(); break;
    case 'card': rr(ctx, -44, -28, 88, 56, 9); S(); ctx.fillRect(-44, -14, 88, 10); ctx.fillRect(-32, 10, 22, 6); break;
    case 'pix': ctx.save(); ctx.rotate(Math.PI / 4); rr(ctx, -26, -26, 52, 52, 10); S(); ctx.restore(); circle(ctx, 0, 0, 7, color); break;
    case 'coin': B(); ctx.ellipse(0, 18, 34, 12, 0, 0, TAU); S(); B(); ctx.ellipse(0, 0, 34, 12, 0, 0, TAU); S(); B(); ctx.ellipse(0, -18, 34, 12, 0, 0, TAU); S(); break;
    case 'house': B(); ctx.moveTo(-40, -2); ctx.lineTo(0, -38); ctx.lineTo(40, -2); S(); B(); ctx.moveTo(-28, -10); ctx.lineTo(-28, 36); ctx.lineTo(28, 36); ctx.lineTo(28, -10); S(); rr(ctx, -8, 12, 16, 24, 3); S(); break;
    case 'car': rr(ctx, -44, -4, 88, 30, 10); S(); B(); ctx.moveTo(-28, -4); ctx.lineTo(-16, -26); ctx.lineTo(18, -26); ctx.lineTo(30, -4); S(); circle(ctx, -24, 28, 9, color); circle(ctx, 24, 28, 9, color); break;
    case 'umbrella': B(); ctx.arc(0, 0, 40, Math.PI, 0); ctx.closePath(); S(); B(); ctx.moveTo(0, 0); ctx.lineTo(0, 32); ctx.arc(-9, 32, 9, 0, Math.PI); S(); break;
    case 'chart': B(); ctx.moveTo(-40, 36); ctx.lineTo(40, 36); S(); [-26, -6, 14, 34].forEach((bx, i) => { rr(ctx, bx - 8, 30 - [26, 44, 34, 60][i], 14, [26, 44, 34, 60][i], 3); Fl(); }); break;
    case 'trend': B(); ctx.moveTo(-40, 28); ctx.lineTo(-12, 0); ctx.lineTo(6, 14); ctx.lineTo(38, -24); S(); arrowHead(ctx, 40, -26, -.85, 18, color); break;
    case 'tree': circle(ctx, 0, -30, 11, color); circle(ctx, -28, 4, 10, color); circle(ctx, 28, 4, 10, color); circle(ctx, -40, 36, 8, color); circle(ctx, -14, 36, 8, color); circle(ctx, 28, 36, 8, color);
      B(); ctx.moveTo(0, -30); ctx.lineTo(-28, 4); ctx.lineTo(-40, 36); ctx.moveTo(-28, 4); ctx.lineTo(-14, 36); ctx.moveTo(0, -30); ctx.lineTo(28, 4); ctx.lineTo(28, 36); ctx.lineWidth = 5; S(); break;
    case 'grid': for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { ctx.globalAlpha = (i + j) % 3 ? .35 : 1; rr(ctx, -40 + i * 21, -40 + j * 21, 17, 17, 3); Fl(); } ctx.globalAlpha = 1; break;
    case 'nodes': [[-30, -20], [20, -30], [34, 14], [-10, 28], [-36, 20]].forEach(([a, b], i) => circle(ctx, a, b, i === 1 ? 11 : 8, color));
      B(); ctx.moveTo(-30, -20); ctx.lineTo(20, -30); ctx.lineTo(34, 14); ctx.moveTo(-10, 28); ctx.lineTo(34, 14); ctx.lineWidth = 4; S(); break;
    case 'pipe': B(); ctx.moveTo(-44, 0); ctx.lineTo(44, 0); S(); [-30, 0, 30].forEach(px => { circle(ctx, px, 0, 11, color); }); arrowHead(ctx, 48, 0, 0, 14, color); break;
    case 'gauge': B(); ctx.arc(0, 14, 40, Math.PI, 0); S(); B(); ctx.moveTo(0, 14); ctx.lineTo(24, -14); S(); circle(ctx, 0, 14, 7, color); break;
    case 'spark': B(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 14 : 44; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); Fl(); break;
    case 'bank': B(); ctx.moveTo(-42, -16); ctx.lineTo(0, -40); ctx.lineTo(42, -16); ctx.closePath(); S(); [-26, -9, 9, 26].forEach(px => { B(); ctx.moveTo(px, -8); ctx.lineTo(px, 26); S(); }); B(); ctx.moveTo(-42, 36); ctx.lineTo(42, 36); S(); break;
    case 'store': B(); ctx.moveTo(-40, -10); ctx.lineTo(-32, -36); ctx.lineTo(32, -36); ctx.lineTo(40, -10); ctx.closePath(); S(); rr(ctx, -34, -10, 68, 46, 4); S(); rr(ctx, -10, 10, 20, 26, 2); S(); break;
    case 'board': rr(ctx, -40, -40, 80, 44, 6); S(); B(); ctx.moveTo(-44, 22); ctx.lineTo(44, 22); S(); [-30, -10, 10, 30].forEach(px => circle(ctx, px, 36, 7, color)); break;
    case 'ai': B(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 12 : 40; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); Fl(); circle(ctx, 32, -32, 7, color); break;
    // SKUs de varejo
    case 'bottle': B(); ctx.moveTo(-8, -42); ctx.lineTo(8, -42); ctx.lineTo(8, -26); ctx.quadraticCurveTo(22, -16, 22, 0); ctx.lineTo(22, 40); ctx.lineTo(-22, 40); ctx.lineTo(-22, 0); ctx.quadraticCurveTo(-22, -16, -8, -26); ctx.closePath(); S(); break;
    case 'box': rr(ctx, -34, -26, 68, 62, 6); S(); B(); ctx.moveTo(-34, -6); ctx.lineTo(34, -6); ctx.moveTo(0, -26); ctx.lineTo(0, -6); S(); break;
    case 'can': B(); ctx.ellipse(0, -30, 24, 8, 0, 0, TAU); S(); B(); ctx.moveTo(-24, -30); ctx.lineTo(-24, 32); ctx.ellipse(0, 32, 24, 8, 0, Math.PI, 0, true); ctx.lineTo(24, -30); S(); break;
    case 'cup': B(); ctx.moveTo(-28, -26); ctx.lineTo(22, -26); ctx.lineTo(16, 36); ctx.lineTo(-22, 36); ctx.closePath(); S(); B(); ctx.arc(26, 2, 12, -Math.PI / 2, Math.PI / 2); S(); break;
    case 'bag': rr(ctx, -32, -16, 64, 54, 8); S(); B(); ctx.arc(0, -16, 16, Math.PI, 0); S(); break;
    case 'jar': rr(ctx, -26, -24, 52, 64, 12); S(); rr(ctx, -20, -40, 40, 14, 4); Fl(); break;
    case 'carton': B(); ctx.moveTo(-24, -20); ctx.lineTo(0, -42); ctx.lineTo(24, -20); ctx.lineTo(24, 40); ctx.lineTo(-24, 40); ctx.closePath(); S(); B(); ctx.moveTo(-24, -20); ctx.lineTo(24, -20); S(); break;
    case 'tube': rr(ctx, -16, -36, 32, 74, 14); S(); ctx.fillRect(-10, -46, 20, 12); break;
    default: circle(ctx, 0, 0, 30, null, color, 7);
  }
  ctx.restore();
}

// ---------- AGENTES (personagens recorrentes) ----------
const AGENT_STYLE = {
  analista:  { body: C.yellow, label: 'Analista' },
  business:  { body: C.red, label: 'Business' },
  clevel:    { body: '#3A3532', label: 'C-Level' },
  validador: { body: '#F2EDE5', label: 'Validador' },
  embalador: { body: C.orange, label: 'Embalador' },
  generic:   { body: C.orange, label: '' }
};
/**
 * o: { role, t, squash (−1..1), look (−1..1), verdict: 'ok'|'no', alpha, label, theme, glowA, think }
 */
function agent(ctx, x, y, r, o = {}) {
  const st = AGENT_STYLE[o.role || 'generic'], t = o.t || 0, body = o.color || st.body;
  const bob = Math.sin(t * 4.2 + (o.seed || 0)) * r * .06, sq = o.squash || 0;
  ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
  // sombra
  ctx.save(); ctx.globalAlpha *= .22; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(x, y + r * 1.08, r * .8 * (1 + sq * .2), r * .16, 0, 0, TAU); ctx.fill(); ctx.restore();
  if (o.glowA) glow(ctx, x, y, r * 2.6, body === '#F2EDE5' ? C.yellow : body, o.glowA);
  ctx.translate(x, y + bob + r); ctx.scale(1 + sq * .22, 1 - sq * .22); ctx.translate(0, -r);
  // antena / acessório de topo
  if (o.role === 'clevel') {
    ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(-r * .42, -r * .86); ctx.lineTo(-r * .46, -r * 1.28); ctx.lineTo(-r * .2, -r * 1.06);
    ctx.lineTo(0, -r * 1.36); ctx.lineTo(r * .2, -r * 1.06); ctx.lineTo(r * .46, -r * 1.28); ctx.lineTo(r * .42, -r * .86); ctx.closePath(); ctx.fill();
  } else if (o.role === 'embalador') {
    ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.ellipse(-r * .22, -r * 1.06, r * .22, r * .12, -.5, 0, TAU); ctx.ellipse(r * .22, -r * 1.06, r * .22, r * .12, .5, 0, TAU); ctx.fill(); circle(ctx, 0, -r * 1.02, r * .1, C.yellow);
  } else {
    line(ctx, 0, -r * .92, 0, -r * 1.22, rgba(C.ink, .8), r * .07);
    const tip = o.verdict === 'no' ? C.red : o.verdict === 'ok' ? C.yellow : (o.role === 'validador' ? C.orange : '#FFF');
    glow(ctx, 0, -r * 1.26, r * .5, tip, .6 + .4 * Math.sin(t * 6)); circle(ctx, 0, -r * 1.26, r * .1, tip);
  }
  // corpo
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r * 1.05);
  g.addColorStop(0, mix(body, '#FFFFFF', .35)); g.addColorStop(1, body);
  circle(ctx, 0, 0, r, g);
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip(); ctx.globalAlpha *= .18; ctx.drawImage(SHADE, -r, -r, r * 2, r * 2); ctx.restore();
  circle(ctx, 0, 0, r, null, INK, Math.max(2, r * .075));
  // visor
  const vw = r * 1.36, vh = r * .56, vy = -r * .1;
  rr(ctx, -vw / 2, vy - vh / 2, vw, vh, vh / 2); ctx.fillStyle = C.ink; ctx.fill();
  const eyeC = o.verdict === 'no' ? C.red : o.verdict === 'ok' ? C.yellow : '#FFF6E8';
  if (o.verdict) {
    ctx.save(); ctx.translate(0, vy); icon(ctx, o.verdict === 'ok' ? 'check' : 'cross', 0, 0, vh * .95, eyeC, 10); ctx.restore();
  } else {
    const blink = (Math.sin(t * 1.7 + (o.seed || 0) * 3) > .985 || o.blink) ? .15 : 1, lk = (o.look || 0) * r * .16;
    [-1, 1].forEach(sd => { ctx.save(); ctx.translate(sd * r * .27 + lk, vy); ctx.scale(1, blink); rr(ctx, -r * .09, -r * .14, r * .18, r * .28, r * .09); ctx.fillStyle = eyeC; ctx.fill(); ctx.restore(); });
    if (o.think) { const k = (t * 3) % 1; circle(ctx, r * .5, -r * .62 - k * r * .3, r * .06 * (1 - k), rgba('#fff', 1 - k)); }
  }
  // acessórios
  if (o.role === 'analista') { ctx.strokeStyle = '#FFF'; ctx.lineWidth = r * .05; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.arc(sd * r * .27, vy, r * .2, 0, TAU); ctx.stroke(); }); line(ctx, -r * .07, vy, r * .07, vy, '#FFF', r * .05); }
  if (o.role === 'business') { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(-r * .1, r * .3); ctx.lineTo(r * .1, r * .3); ctx.lineTo(r * .06, r * .42); ctx.lineTo(r * .14, r * .8); ctx.lineTo(0, r * .92); ctx.lineTo(-r * .14, r * .8); ctx.lineTo(-r * .06, r * .42); ctx.closePath(); ctx.fill(); }
  if (o.role === 'clevel') { line(ctx, -r * .32, r * .5, r * .32, r * .5, rgba(C.yellow, .9), r * .06); }
  ctx.restore();
  if (o.label) text(ctx, o.label, x, y + r * 1.55, { size: Math.max(16, r * .4), weight: 700, align: 'center', color: o.theme === 'dark' ? C.cream : C.ink, alpha: o.alpha == null ? 1 : o.alpha });
}

// ---------- cards ----------
function card(ctx, x, y, w, h, o = {}) {
  const dark = o.theme === 'dark';
  paper(ctx, x, y, w, h, { r: o.r || 22, fill: o.fill || (dark ? '#2A241E' : '#FFFDF8'), halftone: o.halftone,
    shadow: o.blur === 0 ? 0 : (o.shadow == null ? clamp(w * .012, 4, 10) : o.shadow), shadowColor: dark ? 'rgba(0,0,0,.8)' : rgba(INK, .88),
    outline: o.stroke || (dark ? 'rgba(243,235,221,.85)' : INK), lw: o.lw || (w < 320 ? 2 : 3) });
}
/** card-pergunta (cena 2 e abertura de cada caso) — papel recortado com fita, centrado em (x,y) */
function questionCard(ctx, x, y, q, o = {}) {
  const w = o.w || 560, h = o.h || 250, dark = o.theme === 'dark', s = o.scale == null ? 1 : o.scale;
  const accent = [C.yellow, C.red, C.orange, C.red][(+q.n) - 1] || C.orange;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * (o.flip == null ? 1 : o.flip), s); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
  paper(ctx, -w / 2, -h / 2, w, h, { r: 18, fill: dark ? '#2A241E' : '#FFFDF8', outline: dark ? 'rgba(243,235,221,.9)' : INK, shadowColor: dark ? '#000' : rgba(INK, .9), shadow: 10 });
  ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.clip(); ctx.fillStyle = accent; ctx.fillRect(-w / 2, -h / 2, 18, h);
  ctx.globalAlpha *= .22; ctx.drawImage(SHADE, w / 2 - 220, h / 2 - 160, 220, 160); ctx.restore();
  line(ctx, -w / 2 + 18, -h / 2 + 4, -w / 2 + 18, h / 2 - 4, dark ? 'rgba(243,235,221,.9)' : INK, 3);
  circle(ctx, -w / 2 + 66, -h / 2 + 56, 30, accent, INK, 3); text(ctx, q.n, -w / 2 + 66, -h / 2 + 57, { size: 26, weight: 900, mono: true, color: q.n === '01' ? INK : '#FFF', align: 'center' });
  if (o.tag) text(ctx, o.tag, -w / 2 + 112, -h / 2 + 57, { size: 18, weight: 700, mono: true, color: C.stone, ls: 2 });
  icon(ctx, q.icon, w / 2 - 70, -h / 2 + 62, 58, dark ? accent : INK);
  text(ctx, q.q, -w / 2 + 48, 38, { size: 46, weight: 900, color: dark ? C.cream : INK, ls: -1, lh: 1.08 });
  tape(ctx, 0, -h / 2 - 4, 120, 34, -.04, (+q.n) * 7);
  ctx.restore();
}
/** carimbo de resultado ✓ — sticker retrô com contorno, sombra chapada e anel */
function stamp(ctx, x, y, label, p, o = {}) {
  if (p <= 0) return;
  const s = lerp(1.7, 1, E.outExpo(clamp(p * 1.6))), a = clamp(p * 4), dark = o.theme === 'dark', ring = clamp(p * 1.2);
  ctx.save(); ctx.globalAlpha *= a * (o.alpha == null ? 1 : o.alpha);
  circle(ctx, x, y, 60 + ring * 150, null, rgba(C.orange, (1 - ring) * .8), 5);
  ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.05);
  const tw = measure(ctx, label, 40, 900) + 160;
  paper(ctx, -tw / 2, -46, tw, 92, { r: 46, fill: dark ? PAPER : '#FFFDF8', shadow: 9, shadowColor: dark ? '#000' : INK, lw: 4 });
  circle(ctx, -tw / 2 + 48, 0, 32, C.orange, INK, 3.5);
  ctx.save(); ctx.beginPath(); ctx.arc(-tw / 2 + 48, 0, 32, 0, TAU); ctx.clip(); ctx.globalAlpha *= .3; ctx.drawImage(SHADE, -tw / 2 + 16, -32, 64, 64); ctx.restore();
  icon(ctx, 'check', -tw / 2 + 48, 1, 40, '#FFF', 14);
  text(ctx, label, -tw / 2 + 98, 3, { size: 40, weight: 900, color: INK, ls: -.5 });
  ctx.restore();
}
/** cabeçalho de caso: tag (sticker) + título de pôster + subtítulo */
function caseHeader(ctx, t, c, o = {}) {
  const dark = o.theme === 'dark', x = o.x || 64, y = o.y || 150, out = o.out == null ? Infinity : o.out;
  const a = P(t, 0, .4) * (1 - P(t, out, .4));
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  const tw = measure(ctx, c.tag, 18, 700, true, 3) + 28;
  ctx.save(); ctx.translate(x + tw / 2, y); ctx.rotate(-.02); paper(ctx, -tw / 2, -17, tw, 34, { r: 4, fill: C.orange, shadow: 4, shadowColor: dark ? '#000' : INK, lw: 2 });
  text(ctx, c.tag, 0, 1, { size: 18, weight: 800, mono: true, color: '#FFF', align: 'center', ls: 3 }); ctx.restore();
  kinetic(ctx, c.title, x, y + 60, t - .1, { size: 56, align: 'left', color: dark ? '#FFF' : INK, stagger: .05, retro: true, shadow: C.orange, depth: 4, lw: 0 });
  if (c.sub) kinetic(ctx, c.sub, x, y + 112, t - .35, { size: 26, weight: 500, align: 'left', color: dark ? C.sand : C.mute, stagger: .03, ls: 0 });
  ctx.restore();
}


// ---------- DASHBOARD ----------
/**
 * o: { t, title, titleP, theme, mini, seed, hl: {line, bars, kpi} (0..1) }
 * retorna âncoras de layout para os agentes mirarem
 */
function dashboard(ctx, x, y, w, h, o = {}) {
  const t = o.t || 0, r = rng(o.seed || 3), mini = o.mini;
  card(ctx, x, y, w, h, { r: mini ? 10 : 20, blur: mini ? 14 : 40 });
  const hh = h * (mini ? .2 : .13);
  ctx.save(); rr(ctx, x, y, w, h, mini ? 10 : 20); ctx.clip();
  ctx.fillStyle = '#F6F2EC'; ctx.fillRect(x, y, w, hh);
  ctx.fillStyle = rgba(C.orange, .9); ctx.fillRect(x, y + hh - 3, w * (o.titleP || 0), 3);
  ctx.restore();
  // título (o insight vira o header)
  const tp = o.titleP || 0, tx = x + (mini ? 12 : 28), ty = y + hh / 2;
  if (tp > 0 && o.title) {
    const full = o.title, n = Math.ceil(full.length * clamp(tp * 1.15));
    text(ctx, full.slice(0, n), tx, ty, { size: mini ? Math.max(9, w * .045) : Math.min(26, w * .03), weight: 800, color: C.ink });
  } else {
    ctx.fillStyle = 'rgba(20,20,20,.08)'; const sh = .5 + .5 * Math.sin(t * 5);
    rr(ctx, tx, ty - hh * .16, w * .46, hh * .32, hh * .16); ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${.5 * sh})`; rr(ctx, tx + w * .46 * ((t * .6) % 1) - 30, ty - hh * .16, 60, hh * .32, hh * .16); ctx.fill();
  }
  if (!mini) [0, 1, 2].forEach(i => circle(ctx, x + w - 30 - i * 22, ty, 6, i === 0 ? C.orange : C.sand));
  const pad = mini ? 8 : 24, top = y + hh + pad;
  const out = { header: { x, y, w, h: hh } };
  // KPIs
  if (!mini) {
    const kw = (w - pad * 5) / 4, kh = h * .17, names = ['Volume', 'Ticket médio', 'Aprovação', 'Clientes ativos'], vals = ['R$ 48,2 mi', 'R$ 183', '91,4%', '1,28 mi'], dl = ['−3,1%', '+1,2%', '+0,4%', '+2,8%'];
    out.kpis = [];
    names.forEach((nm, i) => {
      const kx = x + pad + i * (kw + pad); rr(ctx, kx, top, kw, kh, 12); ctx.fillStyle = '#FAF7F2'; ctx.fill();
      text(ctx, nm, kx + 16, top + kh * .28, { size: 15, weight: 600, color: C.stone });
      text(ctx, vals[i], kx + 16, top + kh * .64, { size: Math.min(30, kw * .14), weight: 800, color: C.ink });
      text(ctx, dl[i], kx + kw - 14, top + kh * .28, { size: 15, weight: 700, color: dl[i][0] === '−' ? C.red : '#2E7D32', align: 'right' });
      out.kpis.push({ x: kx + kw / 2, y: top + kh / 2 });
      if (o.hl && o.hl.kpi > 0 && i === 0) { rr(ctx, kx - 5, top - 5, kw + 10, kh + 10, 15); ctx.strokeStyle = rgba(C.ink, o.hl.kpi); ctx.lineWidth = 4; ctx.stroke(); }
    });
  }
  // gráfico de linha
  const ly = mini ? top : top + h * .17 + pad, lh = y + h - pad - ly, lw = mini ? w * .58 : w * .6, lx = x + pad;
  rr(ctx, lx, ly, lw, lh, mini ? 6 : 12); ctx.fillStyle = '#FAF7F2'; ctx.fill();
  const N = 14, pts = [];
  for (let i = 0; i < N; i++) {
    const base = .55 + .12 * Math.sin(i * .9 + (o.seed || 0)) + .05 * (r() - .5) + i * .012, dip = i === N - 2 ? -.28 : i === N - 1 ? -.2 : 0;
    pts.push([lx + 16 + i * (lw - 32) / (N - 1), ly + lh - 14 - (base + dip) * (lh - 40)]);
  }
  const lp = clamp(t * .8 + .2), cut = Math.max(2, Math.ceil(N * lp));
  ctx.beginPath(); smoothPath(ctx, pts.slice(0, cut)); ctx.strokeStyle = C.orange; ctx.lineWidth = mini ? 2 : 4; ctx.stroke();
  ctx.beginPath(); smoothPath(ctx, pts.slice(0, cut)); ctx.lineTo(pts[cut - 1][0], ly + lh); ctx.lineTo(pts[0][0], ly + lh); ctx.closePath(); ctx.fillStyle = rgba(C.orange, .08); ctx.fill();
  out.dip = { x: pts[N - 2][0], y: pts[N - 2][1] };
  if (o.hl && o.hl.line > 0) { circle(ctx, out.dip.x, out.dip.y, 18 + 8 * Math.sin(t * 8), null, rgba(C.red, o.hl.line), 4); }
  // barras por região
  const bx = lx + lw + pad, bw = x + w - pad - bx, regs = ['N', 'NE', 'CO', 'SE', 'S'], hs = [.55, .7, .48, .92, .28];
  rr(ctx, bx, ly, bw, lh, mini ? 6 : 12); ctx.fillStyle = '#FAF7F2'; ctx.fill();
  regs.forEach((rg, i) => {
    const cw = (bw - 24) / regs.length, cx = bx + 12 + i * cw + cw * .18, ch = (lh - (mini ? 16 : 56)) * hs[i] * clamp(t * 1.2 + .3 - i * .05);
    rr(ctx, cx, ly + lh - (mini ? 8 : 34) - ch, cw * .64, ch, 4); ctx.fillStyle = i === 4 ? C.red : i === 3 ? C.yellow : C.sand; ctx.fill();
    if (!mini) text(ctx, rg, cx + cw * .32, ly + lh - 16, { size: 14, weight: 700, color: C.stone, align: 'center' });
    if (i === 4) out.sul = { x: cx + cw * .32, y: ly + lh - 34 - ch };
  });
  if (o.hl && o.hl.bars > 0 && out.sul) { rr(ctx, out.sul.x - 26, out.sul.y - 16, 52, ly + lh - out.sul.y - 10, 8); ctx.strokeStyle = rgba(C.red, o.hl.bars); ctx.lineWidth = 4; ctx.stroke(); }
  out.lineArea = { x: lx + lw / 2, y: ly + lh / 2 }; out.barArea = { x: bx + bw / 2, y: ly + lh / 2 };
  return out;
}
