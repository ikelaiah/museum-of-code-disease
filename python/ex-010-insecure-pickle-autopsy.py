# Fix: Do not unpickle untrusted data; use JSON or a safe schema
# Run: python ex-010-insecure-pickle-autopsy.py

import json
import sys

if __name__ == '__main__':
    # Accept only JSON primitives/objects
    data = sys.argv[1] if len(sys.argv) > 1 else '{"msg":"hello"}'
    obj = json.loads(data)
    print('Loaded safely:', obj)
