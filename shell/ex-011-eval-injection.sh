#!/usr/bin/env bash
# Dangerous: eval injection
# Run: bash ex-011-eval-injection.sh '$(echo PWNED)'
cmd=${1-echo hello}
eval $cmd # VULNERABLE
