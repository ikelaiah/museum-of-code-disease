#!/usr/bin/env bash
# Dangerous: unquoted variables and globbing
# Run: bash ex-010-unquoted-vars.sh "*.txt"
set -euo pipefail
pattern=${1-*.txt}
# VULN: word splitting + globbing
for f in $pattern; do
  echo processing $f
done
