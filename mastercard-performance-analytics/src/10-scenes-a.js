/* ============================================================================
   7. SCENES — cada cena: SCENES[id].draw(ctx, t, T)  (t = tempo local, T = global)
   ========================================================================== */
const SCENES = {};
const TX = CONFIG.text;

/** linha com destaque: "Mais *dados*." → "dados" na cor accent */
function rich(ctx, str, x, y, o = {}) {
  const size = o.size || 120, weight = o.weight || 800, ls = o.ls == null ? -size * .025 : o.ls;
  const parts = str.split(/(\*[^*]+\*)/).filter(Boolean).map(p => ({ s: p.replace(/\*/g, ''), hi: p[0] === '*' }));
  const ws = parts.map(p => measure(ctx, p.s, size, weight, false, ls)), total = ws.reduce((a, b) => a + b, 0);
  let cx = o.align === 'left' ? x : o.align === 'right' ? x - total : x - total / 2;
  parts.forEach((p, i) => { text(ctx, p.s, cx, y, { size, weight, ls, color: p.hi ? (o.accent || C.orange) : (o.color || C.white), alpha: o.alpha }); cx += ws[i]; });
  return total;
}
/** pílula simples (rótulos, keywords) */
function pill(ctx, x, y, label, o = {}) {
  const size = o.size || 22, w = measure(ctx, label, size, o.weight || 700) + size * 1.6, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha); ctx.translate(x, y); ctx.scale(o.scale || 1, o.scale || 1);
  ctx.rotate(o.rot || 0);
  if (o.fill && !o.flat) { ctx.save(); ctx.translate(3, 4); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = rgba(INK, .85); ctx.fill(); ctx.restore(); }
  rr(ctx, -w / 2, -h / 2, w, h, h / 2); if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
  const st = o.stroke || (o.fill && !o.flat ? INK : null); if (st) { ctx.strokeStyle = st; ctx.lineWidth = o.lw || 2.5; ctx.stroke(); }
  text(ctx, label, 0, 1, { size, weight: o.weight || 700, color: o.color || C.ink, align: 'center' }); ctx.restore(); return w;
}
/** íris (abre/fecha) — r = raio do buraco */
function iris(ctx, cx, cy, r, color = '#000') {
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(cx, cy, Math.max(0, r), 0, TAU, true); ctx.fillStyle = color; ctx.fill('evenodd'); ctx.restore();
}

/* ---------------------------------------------------------------------------
   CENA 1 — HOOK (0:00–0:16)
   --------------------------------------------------------------------------- */
(() => {
  const id = 'hook';
  [0, .85, 1.7].forEach(t => cue(id, t, 'heart'));
  cue(id, 1.0, 'riser', { dur: 1.0, v: .2 }); cue(id, 2.0, 'impact', { size: .55 }); cue(id, 2.0, 'whoosh', { dur: .8, v: .5 });
  cue(id, 3.7, 'whoosh', { dur: .3, v: .3 });
  [4.0, 5.5, 7.0].forEach((t, i) => { cue(id, t, 'impact', { size: .9 + i * .1 }); cue(id, t - .25, 'whoosh', { dur: .25, v: .25 }); });
  cue(id, 8.5, 'pop', { p: 1.4 }); cue(id, 9.6, 'whoosh', { dur: .6, v: .45 });
  [12.6, 13.6, 14.6].forEach((t, i) => cue(id, t, 'tick', { f: 2200 + i * 500 }));
  cue(id, 12.0, 'riser', { dur: 3, v: .25 }); cue(id, 15.0, 'glitch'); cue(id, 15.25, 'whoosh', { dur: .7, dir: 'down', v: .5 });

  const r = rng(101), TYPES = ['card', 'kpi', 'spark', 'pill', 'bars', 'dot', 'dot', 'dot', 'ring'];
  const PILLS = ['Nova transação', 'Alerta de risco', 'Pix recebido', 'Meta atingida', 'Novo cliente', 'Pico de volume'];
  const KPIS = ['+12,4%', '98,7%', 'R$ 2,4 mi', '−3,1%', '1,2 mi', '+0,8 p.p.'];
  const COLS = [C.red, C.orange, C.yellow, C.cream];
  const ITEMS = Array.from({ length: 96 }, (_, i) => ({
    type: TYPES[i % TYPES.length], x: (r() * 2 - 1) * 1.15, y: (r() * 2 - 1) * .85, z0: r() * 3, rot: (r() - .5) * .5,
    col: COLS[i % 4], label: PILLS[i % PILLS.length], kpi: KPIS[i % KPIS.length], seed: i
  }));
  const dist = t => { const a = (1.5 - .32) / 5.4; let d = .32 * Math.max(0, t - 2); if (t > 9.6) d += .5 * a * Math.min(t - 9.6, 5.4) ** 2; return d; };

  function item(ctx, it, s, a) {
    ctx.save(); ctx.globalAlpha *= a; ctx.scale(s, s); ctx.rotate(it.rot);
    switch (it.type) {
      case 'card': { const g = ctx.createLinearGradient(-90, -55, 90, 55); g.addColorStop(0, it.col); g.addColorStop(1, mix(it.col, '#000', .35));
        rr(ctx, -90, -56, 180, 112, 12); ctx.fillStyle = g; ctx.fill(); rr(ctx, -66, -18, 34, 26, 5); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
        circle(ctx, 50, 32, 16, 'rgba(235,0,27,.85)'); circle(ctx, 70, 32, 16, 'rgba(247,158,27,.85)'); break; }
      case 'kpi': rr(ctx, -100, -48, 200, 96, 14); ctx.fillStyle = 'rgba(245,241,234,.95)'; ctx.fill();
        text(ctx, it.kpi, -80, 8, { size: 40, weight: 800, color: C.ink }); text(ctx, 'KPI', -80, -26, { size: 14, weight: 700, color: C.stone, mono: true }); break;
      case 'spark': { rr(ctx, -110, -50, 220, 100, 14); ctx.fillStyle = 'rgba(30,30,30,.92)'; ctx.fill(); ctx.strokeStyle = it.col; ctx.lineWidth = 5; ctx.beginPath();
        for (let k = 0; k < 9; k++) ctx.lineTo(-90 + k * 22, 20 - Math.sin(k * 1.3 + it.seed) * 22 - k * 3); ctx.stroke(); break; }
      case 'pill': { const w = measure(ctx, it.label, 24, 700) + 70; rr(ctx, -w / 2, -26, w, 52, 26); ctx.fillStyle = 'rgba(245,241,234,.95)'; ctx.fill();
        circle(ctx, -w / 2 + 28, 0, 9, it.col); text(ctx, it.label, -w / 2 + 48, 1, { size: 24, weight: 700, color: C.ink }); break; }
      case 'bars': [40, 70, 50, 90, 60].forEach((h, k) => { rr(ctx, -60 + k * 26, 40 - h, 18, h, 4); ctx.fillStyle = k === 3 ? it.col : 'rgba(245,241,234,.7)'; ctx.fill(); }); break;
      case 'dot': glow(ctx, 0, 0, 40, it.col, .9); circle(ctx, 0, 0, 9, it.col); break;
      case 'ring': circle(ctx, 0, 0, 34, null, rgba(it.col, .8), 5); break;
    }
    ctx.restore();
  }

  function storm(ctx, t) {
    const d = dist(t), born = P(t, 2, .7, E.outCubic), list = [];
    for (const it of ITEMS) {
      let z = 3 - ((it.z0 + d) % 3) + .12; // 3.12 → 0.12 (aproximando)
      const spread = lerp(.05, 1, born); const sx = W / 2 + it.x * spread * 820 / z, sy = H / 2 + it.y * spread * 520 / z;
      const a = clamp((3.1 - z) * 1.2) * clamp((z - .14) * 6) * born;
      list.push({ it, z, sx, sy, a, s: .55 / z });
    }
    list.sort((p, q) => q.z - p.z);
    for (const o of list) {
      if (o.a <= .01 || o.sx < -400 || o.sx > W + 400 || o.sy < -300 || o.sy > H + 300) continue;
      if (o.it.type === 'dot' && t > 2) { const z2 = o.z + .25 + (t > 9.6 ? .4 * P(t, 9.6, 5) : 0); const tx = W / 2 + o.it.x * 820 / z2, ty = H / 2 + o.it.y * 520 / z2; line(ctx, tx, ty, o.sx, o.sy, rgba(o.it.col, o.a * .5), 3 * o.s); }
      ctx.save(); ctx.translate(o.sx, o.sy); item(ctx, o.it, o.s, o.a); ctx.restore();
    }
  }

  SCENES[id] = {
    draw(ctx, t) {
      bgDark(ctx, t, { centerA: .6 });
      const tf = t >= 15 && t < 15.25 ? 15 : t, fall = Math.max(0, t - 15.25);
      const slamT = [4, 5.5, 7].reduce((a, s) => (t >= s ? s : a), -9), punch = Math.exp(-(t - slamT) * 7) * .07 * M.intensity;
      const cam = { z: lerp(1, 1.08, t / 16) + (t >= 4 && t < 9.6 ? punch : 0), r: Math.sin(t * .4) * .01 };
      ctx.save(); ctx.translate(0, fall * fall * 2400);
      camera(ctx, cam, () => {
        if (t < 2.2) { // o ponto laranja pulsando
          const pulse = [0, .85, 1.7].reduce((a, s) => a + Math.exp(-Math.max(0, t - s) * 6) * (t >= s), 0);
          glow(ctx, W / 2, H / 2, 120 + pulse * 80, C.orange, .7); circle(ctx, W / 2, H / 2, 16 + pulse * 8 - P(t, 2, .2) * 16, C.orange);
        }
        if (t >= 2) { const k = P(t, 2, .7); circle(ctx, W / 2, H / 2, k * 900, null, rgba(C.orange, (1 - k) * .8), 6); }
        storm(ctx, tf);
      });
      ctx.restore();
      // slams
      if (t >= 4 && t < 10.3) {
        ctx.save(); ctx.globalAlpha = .55 * win(t, 4, 10.2, .15, .4); ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H); ctx.restore();
        const L = TX.hook, acc = [C.yellow, C.orange, C.red];
        if (t < 8.5) {
          const i = t < 5.5 ? 0 : t < 7 ? 1 : 2, s0 = [4, 5.5, 7][i], p = P(t, s0, .32, E.outExpo);
          ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(lerp(1.4, 1, p), lerp(1.4, 1, p)); ctx.globalAlpha = P(t, s0, .06);
          rich(ctx, L[i], 0, 0, { size: 170, accent: acc[i] }); ctx.restore();
        } else {
          const out = P(t, 9.6, .6, E.inExpo);
          L.forEach((l, i) => { const p = P(t, 8.5 + i * .06, .4, E.outExpo); ctx.save(); ctx.translate(W / 2, H / 2 + (i - 1) * 150 * lerp(.6, 1, p)); ctx.scale(lerp(.6, 1, p) * (1 + out * 2.5), lerp(.6, 1, p) * (1 + out * 2.5));
            ctx.globalAlpha = (1 - out); rich(ctx, l, 0, 0, { size: 120, accent: acc[i] }); ctx.restore(); });
        }
      }
      // palavras-chave da narração
      TX.hookWords.forEach((w, i) => { const s = 12.6 + i; const a = P(t, s, .3) * (1 - P(t, 15, .2)); if (a <= 0) return;
        pill(ctx, W / 2 + (i - 1) * 300, 930 - (1 - P(t, s, .4, E.outBack)) * 30, w, { size: 30, fill: i === 2 ? C.orange : 'rgba(245,241,234,.12)', color: i === 2 ? '#FFF' : C.cream, alpha: a }); });
      if (t >= 15 && t < 15.25) flash(ctx, .12);
      // painel claro sobe (transição para a cena 2)
      const up = P(t, 15.25, .75, E.inOutCubic);
      if (up > 0) { ctx.fillStyle = C.cream; ctx.fillRect(0, H - H * up, W, H * up + 2); }
    }
  };
})();

/* ---------------------------------------------------------------------------
   CENA 2 — O PROBLEMA (0:16–0:34)
   --------------------------------------------------------------------------- */
(() => {
  const id = 'problem';
  [.4, .9, 1.4, 1.9].forEach((t, i) => cue(id, t, 'pop', { p: 1 + i * .15 }));
  [4, 6, 8, 10].forEach((t, i) => { cue(id, t, 'impact', { size: .3 }); cue(id, t, 'tick', { f: 1500 + i * 300, v: .2 }); });
  const r = rng(202), POST = TX.postits.map((q, i) => ({ q, t: 10.8 + i * .17, x: 120 + r() * 1680, y: 140 + r() * 820, rot: (r() - .5) * .35, c: [C.yellow, '#FFE0B8', '#FFFFFF', '#FFD3C2'][i % 4] }));
  POST.forEach((p, i) => { cue(id, p.t, 'tick', { f: 1800 + i * 90, v: .12 }); if (i % 4 === 3) cue(id, p.t, 'impact', { size: .12 + i * .01 }); });
  cue(id, 14.4, 'swell', { dur: .5 }); cue(id, 14.6, 'whoosh', { dur: .7, v: .5 }); cue(id, 15.0, 'impact', { size: .5 });
  cue(id, 17.2, 'whoosh', { dur: .8, dir: 'down', v: .4 });

  const CL = [['store', 480], ['bank', 800], ['card', 1120], ['chart', 1440]];
  const POS = [[560, 470], [1360, 470], [560, 790], [1360, 790]];
  const ROT = [-.025, .02, .018, -.02];

  SCENES[id] = {
    draw(ctx, t) {
      const shake = P(t, 10.8, 3.6) * (1 - P(t, 14.6, .3));
      bgLight(ctx, t, { drift: 10 });
      const mag = P(t, 14.6, .9, E.inExpo);
      camera(ctx, { z: 1 + shake * .02 + mag * .04, x: W / 2 + Math.sin(t * 40) * shake * 4, y: H / 2 + Math.cos(t * 37) * shake * 3 }, () => {
        // clientes
        CL.forEach(([ic, x], i) => { const a = E.outBack(P(t, .4 + i * .5, .5)) * (1 - P(t, 14.6, .5)); if (a <= 0) return;
          circle(ctx, x, 170, 46 * a, '#FFFFFF', rgba(C.ink, .12), 2); icon(ctx, ic, x, 170, 50 * a, C.ink);
          const lp = P(t, 4 + i * 2 - .5, .5, E.outCubic); if (lp > 0) { const [qx, qy] = POS[i]; line(ctx, x, 220, lerp(x, qx, lp), lerp(220, qy - 125, lp), rgba(C.ink, .18), 2, [6, 8]); } });
        // cards-pergunta
        TX.questions.forEach((q, i) => {
          const s0 = 4 + i * 2, p = P(t, s0, .45, E.outBack); if (t < s0) return;
          let [x, y] = POS[i], sc = lerp(1.3, 1, p), al = P(t, s0, .1);
          if (mag > 0) { const tx = 120 + i * 190, ty = 64; x = lerp(x, tx, mag); y = lerp(y, ty, mag); sc *= lerp(1, .14, mag); al *= 1 - P(t, 15.4, .3); }
          questionCard(ctx, x, y, q, { scale: sc, rot: ROT[i] * (1 - mag), alpha: al, w: 640, h: 240 });
        });
        // post-its se acumulando
        POST.forEach(p => { if (t < p.t) return; const a = E.outBack(P(t, p.t, .3)); const k = mag;
          const x = lerp(p.x, W / 2, k), y = lerp(p.y, H / 2, k);
          ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot + k * 2); ctx.scale(a * (1 - k), a * (1 - k));
          shadowed(ctx, 16, 'rgba(0,0,0,.14)', 6, () => { ctx.fillStyle = p.c; ctx.fillRect(-100, -56, 200, 112); });
          text(ctx, p.q, 0, 2, { size: 28, weight: 700, color: C.ink, align: 'center' }); ctx.restore(); });
      });
      // os 4 chips no canto (viram o rastreador de capítulos)
      const ca = P(t, 15.2, .35) * (1 - P(t, 17.2, .3));
      if (ca > 0) { let x = 64; TX.questions.forEach((q, i) => { const lb = `${q.n}  ${q.short}`, w = measure(ctx, lb, 17, 700) + 36;
        pill(ctx, x + w / 2, 64, lb, { size: 17, stroke: rgba(C.ink, .3), color: C.ink, alpha: ca * P(t, 15.2 + i * .08, .3), scale: E.outBack(P(t, 15.2 + i * .08, .35)) }); x += w + 12; }); }
      // complexidade → decisão
      if (t > 14.9) { ctx.save(); ctx.globalAlpha = 1 - P(t, 17.0, .25); rich(ctx, 'complexidade', W / 2 - 40, H / 2, { size: 96, color: C.ink, align: 'right', alpha: P(t, 14.9, .3) });
        const ap = P(t, 15.3, .4, E.outExpo); line(ctx, W / 2 - 10, H / 2, W / 2 - 10 + 90 * ap, H / 2, C.orange, 9); if (ap > .9) arrowHead(ctx, W / 2 + 92, H / 2, 0, 30, C.orange);
        if (t > 15.6) { ctx.save(); const s = lerp(1.25, 1, P(t, 15.6, .35, E.outExpo)); ctx.translate(W / 2 + 130, H / 2); ctx.scale(s, s); rich(ctx, '*decisão*', 0, 0, { size: 96, align: 'left' }); ctx.restore(); }
        ctx.restore(); }
      // íris fecha para o preto
      const ip = P(t, 17.2, .8, E.inExpo); if (ip > 0) iris(ctx, W / 2, H / 2, lerp(1200, 0, ip));
    }
  };
})();
