#!/usr/bin/env bash
# Junta src/ em um único HTML autossuficiente: performance-analytics.html
set -euo pipefail
cd "$(dirname "$0")"
OUT=performance-analytics.html
{
  cat src/00-head.html
  for f in src/[0-9][0-9]-*.js; do
    printf '\n/* ===== %s ===== */\n' "$(basename "$f")"
    cat "$f"
  done
  cat src/99-tail.html
} > "$OUT"
echo "OK → $OUT ($(wc -c < "$OUT") bytes)"
