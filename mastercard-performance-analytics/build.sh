#!/usr/bin/env bash
# Junta src/ em um único HTML autossuficiente (performance-analytics.html),
# com o JSON de dados (data/presentation.json) embutido e editável no topo.
# Uso: ./build.sh            usa data/presentation.json
#      ./build.sh outro.json usa o JSON indicado
set -euo pipefail
cd "$(dirname "$0")"
DATA="${1:-data/presentation.json}"
OUT=performance-analytics.html
{
  python3 - "$DATA" src/00-head.html <<'PY'
import json, sys
data = json.load(open(sys.argv[1], encoding='utf-8'))  # falha aqui se o JSON estiver inválido
txt = json.dumps(data, ensure_ascii=False, indent=2).replace('</', '<\\/').replace('<!--', '<\\u0021--')
sys.stdout.write(open(sys.argv[2], encoding='utf-8').read().replace('/*PA_DATA*/', txt))
PY
  for f in src/[0-9][0-9]-*.js; do
    printf '\n/* ===== %s ===== */\n' "$(basename "$f")"
    cat "$f"
  done
  cat src/99-tail.html
} > "$OUT"
echo "OK → $OUT ($(wc -c < "$OUT") bytes) · dados: $DATA"
