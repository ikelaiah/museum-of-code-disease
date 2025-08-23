// Dangerous: Host header injection in password reset link builder
// Ref: PortSwigger Host header injection
const http = require('http');
http.createServer((req, res) => {
  const host = req.headers['host']; // VULNERABLE: trust Host
  const link = `http://${host}/reset?token=abc`;
  res.end(`Reset link: ${link}`);
}).listen(3002, () => console.log('Host header demo on 3002'));
