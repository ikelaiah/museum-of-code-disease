// Fix: Use configured external URL base instead of trusting Host
const http = require('http');
const BASE = process.env.PUBLIC_BASE || 'https://example.com';
http.createServer((req, res) => {
  const link = `${BASE}/reset?token=abc`;
  res.end(`Reset link: ${link}`);
}).listen(3003, () => console.log('Host header fix on 3003'));
