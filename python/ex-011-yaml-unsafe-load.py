# Dangerous: yaml.load with unsafe loader
# Run: python ex-011-yaml-unsafe-load.py '!!python/object/apply:os.system ["echo YAML_PWNED"]'
# Ref: PyYAML docs
import yaml, sys
payload = sys.argv[1] if len(sys.argv)>1 else 'a: 1'
obj = yaml.load(payload, Loader=yaml.Loader)  # VULNERABLE
print(obj)
