# Fix: avoid Marshal.load; use JSON
require 'json'
input = ARGV[0] || '{"msg":"hello"}'
obj = JSON.parse(input)
p obj
