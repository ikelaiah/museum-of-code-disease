# Fix: Use SafeLoader
import yaml, sys
payload = sys.argv[1] if len(sys.argv)>1 else 'a: 1'
obj = yaml.load(payload, Loader=yaml.SafeLoader)
print(obj)
