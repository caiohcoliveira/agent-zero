/* Medidor de leitura (teste "sem som e sem ajuda" do roteiro v7).
   Para cada texto essencial de cada cena: tempo parado na tela × tempo necessário
   (palavras / 2,5 por segundo + 2,5 s quando há um visual novo para interpretar).
   Textos que entram juntos (até 0,8 s de diferença) somam as palavras.
   Uso: node tools/read_check.js [performance-analytics.html]   (precisa do Playwright) */
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '..', 'performance-analytics.html'));
  const b = await chromium.launch(), p = await b.newPage();
  await p.goto('file://' + file); await p.waitForTimeout(500);
  const rows = await p.evaluate(() => window.__read());
  await b.close();
  const WPS = 2.5, VIS = 2.5, FADE = .65, kinds = new Set(['title', 'body', 'list', 'concl', 'big', 'note', 'label']);
  const items = rows.filter(r => kinds.has(r.kind) && r.words > 0).map(r => ({ ...r, T0: r.start + r.t0, T1: r.start + r.t1 }));
  items.sort((a, b) => a.T0 - b.T0);
  // grupos: textos que entram quase juntos são lidos juntos
  const groups = []; items.forEach(it => { const g = groups[groups.length - 1]; if (g && it.T0 - g.T0 <= .8 && it.scene === g.scene) g.items.push(it); else groups.push({ T0: it.T0, scene: it.scene, items: [it] }); });
  let bad = 0, total = 0;
  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
  console.log('cena        início   palavras  precisa   tem     situação  texto');
  groups.forEach(g => {
    const w = g.items.reduce((a, r) => a + r.words, 0), vis = g.items.some(r => r.visual) ? VIS : 0, need = w / WPS + vis;
    const have = Math.min(...g.items.map(r => r.T1)) - g.T0 - FADE, ok = have >= need, warn = !ok && have >= need * .8;
    total++; if (!ok && !warn) bad++;
    console.log(`${g.scene.padEnd(11)} ${fmt(g.T0).padStart(7)}  ${String(w).padStart(5)}    ${need.toFixed(1).padStart(5)}s  ${have.toFixed(1).padStart(5)}s   ${ok ? 'ok      ' : warn ? 'apertado' : 'CURTO   '}  ${g.items.map(r => String(r.text).replace(/\*/g, '')).join(' | ').slice(0, 90)}`);
  });
  console.log(`\n${total} telas de texto · ${bad} curtas demais (abaixo de 80% do tempo de leitura)`);
})();
