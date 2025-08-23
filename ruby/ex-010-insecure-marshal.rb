# Dangerous: Marshal.load on untrusted data
# Run: ruby ex-010-insecure-marshal.rb "\x04\bu:\x07String\x06:\x06ETI\x06I\"\nhello\x06:\x06EF"
# Ref: CWE-502
input = ARGV[0] || Marshal.dump('hello')
obj = Marshal.load(input) # VULNERABLE
p obj
