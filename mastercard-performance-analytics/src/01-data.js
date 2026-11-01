/* ============================================================================
   1b. DADOS — os números e textos das cenas vêm do bloco <script id="pa-data">
   ----------------------------------------------------------------------------
   • No projeto: data/presentation.json (fora do Git) → ./build.sh injeta no HTML.
   • No HTML pronto: edite o bloco "pa-data" no topo do arquivo e salve.
   • Todo acesso tem valor-reserva: se faltar um campo, a cena mostra "—".
   ========================================================================== */
const DATA = (() => {
  try { return JSON.parse(document.getElementById('pa-data').textContent); }
  catch (e) { console.warn('[pa-data] JSON inválido, seguindo sem dados', e); return {}; }
})();

/** lê um caminho como 'a.b[2].c' e devolve `fb` se algo faltar */
function dget(obj, path, fb) {
  let v = obj;
  for (const k of path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)) {
    if (v == null) return fb;
    v = v[k];
  }
  return v == null ? fb : v;
}
/** seção n da apresentação (1 a 7) */
const SEC = n => (DATA.presentation_structure || []).find(s => s.section === n) || {};
/** case da seção 4 pelo começo do nome (ex.: 'Cliente X') */
const CASE = prefix => (SEC(4).cases || []).find(c => String(c.case_name || '').startsWith(prefix)) || {};
/** números-manchete de uma seção */
const HEADLINES = n => (DATA.headline_numbers_for_slides || []).filter(h => h.section === n);

/* ---- formatação pt-BR dos números de tela ---- */
const FMT = {
  num(v, d = 2) { return Number(v).toLocaleString('pt-BR', { maximumFractionDigits: d }); },
  /** 1.5 → '1,5×' */
  mult(v, d = 2) { return FMT.num(v, d) + '×'; },
  /** '+0.25 de variação relativa' (ou 0.25) → '+25%' */
  rel(v, d = 1) {
    const x = typeof v === 'number' ? v : parseFloat(String(v));
    return isFinite(x) ? (x >= 0 ? '+' : '−') + FMT.num(Math.abs(x) * 100, d) + '%' : '—';
  },
  /** '0.25MM' → '250 mil' · '2.5MM' → '2,5 mi' */
  mm(v) {
    const x = parseFloat(String(v)) * 1e6;
    if (!isFinite(x)) return '—';
    return x >= 1e6 ? FMT.num(x / 1e6, 1) + ' mi' : x >= 1e3 ? FMT.num(x / 1e3, 0) + ' mil' : FMT.num(x, 0);
  },
  /** valor em milhões de US$ → 'US$ 2,5 mil' · 'US$ 1,5 mi' */
  usdMM(v) {
    const x = Number(v) * 1e6;
    if (!isFinite(x)) return '—';
    return 'US$ ' + (x >= 1e6 ? FMT.num(x / 1e6, 1) + ' mi' : x >= 1e3 ? FMT.num(x / 1e3, 1) + ' mil' : FMT.num(x, 0));
  },
  /** número-manchete em texto livre → versão pt-BR; o que não reconhece só troca ponto decimal por vírgula */
  auto(s) {
    s = String(s == null ? '—' : s).trim();
    let m;
    if ((m = s.match(/^([+-]?\d+(?:\.\d+)?)x$/i))) return FMT.mult(parseFloat(m[1]));
    if ((m = s.match(/^([+-]?\d+(?:\.\d+)?)\s*(?:de variação )?relative?$|^([+-]?\d+(?:\.\d+)?)\s*de variação relativa$/i))) return FMT.rel(parseFloat(m[1] || m[2]));
    if ((m = s.match(/^(\d+(?:\.\d+)?)MM$/))) return FMT.mm(m[1]);
    if ((m = s.match(/^\$\s?(\d+(?:\.\d+)?)\s*->\s*\$\s?(\d+(?:\.\d+)?)$/))) return `US$ ${FMT.num(+m[1], 0)} → US$ ${FMT.num(+m[2], 0)}`;
    if ((m = s.match(/^\$\s?(\d+(?:\.\d+)?)$/))) return 'US$ ' + FMT.num(+m[1], 0);
    return s.replace(/(\d)\.(\d)/g, '$1,$2').replace(/->/g, '→');
  },
  /** item de headline_numbers_for_slides → texto de tela; um campo "display" manual tem prioridade */
  headline(h) { return h && h.display ? h.display : FMT.auto(h && h.number); }
};

window.__data = { DATA, SEC, CASE, HEADLINES, FMT, dget };
