// Dangerous: SSRF by fetching attacker-controlled URLs
// Run: node ex-016-ssrf.js http://169.254.169.254/latest/meta-data/
// Ref: PortSwigger SSRF
const http = require('http');
const https = require('https');
const { URL } = require('url');

const target = process.argv[2] || 'http://example.com';
const u = new URL(target);
const client = u.protocol === 'https:' ? https : http;
client.get(u, res => {
  res.pipe(process.stdout);
}).on('error', e => console.error(e.message));
