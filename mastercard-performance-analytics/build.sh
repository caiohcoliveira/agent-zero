#!/usr/bin/env bash
# Monta performance-analytics.html (arquivo único e offline) — ver tools/build.py.
# Uso: ./build.sh            usa data/presentation.json
#      ./build.sh outro.json usa o JSON indicado
set -euo pipefail
cd "$(dirname "$0")"
python3 tools/build.py "$@"
