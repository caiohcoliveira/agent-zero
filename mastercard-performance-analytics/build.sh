#!/usr/bin/env bash
# Junta src/ em um único HTML autossuficiente, com os dados (JSON) embutidos no topo.
#   performance-analytics.html      → dados de exemplo (data/presentation.sample.json); é o que vai para o Git
#   dist/performance-analytics.html → dados reais (data/presentation.json), só local, fora do Git
# Uso: ./build.sh            gera os dois (o segundo só se data/presentation.json existir)
#      ./build.sh outro.json gera dist/performance-analytics.html com o JSON indicado
set -euo pipefail
cd "$(dirname "$0")"

build() { # $1 = JSON de dados · $2 = HTML de saída
  mkdir -p "$(dirname "$2")"
  {
    python3 - "$1" src/00-head.html <<'PY'
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
  } > "$2"
  echo "OK → $2 ($(wc -c < "$2") bytes) · dados: $1"
}

if [ $# -ge 1 ]; then build "$1" dist/performance-analytics.html; exit 0; fi
build data/presentation.sample.json performance-analytics.html
if [ -f data/presentation.json ]; then build data/presentation.json dist/performance-analytics.html; fi
