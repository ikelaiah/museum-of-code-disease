#!/usr/bin/env bash
# Fix: avoid eval; use arrays
cmd=${1-echo hello}
set -- "$cmd"
"$@"
