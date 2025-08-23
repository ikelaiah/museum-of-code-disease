#!/usr/bin/env bash
# Fix: always quote variables; use arrays
set -euo pipefail
pattern=${1-*.txt}
shopt -s nullglob
for f in "${pattern}"; do
  echo "processing $f"
done
