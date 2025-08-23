// Fix: Enforce allowlist and block internal IPs
const http = require('http');
const https = require('https');
const { URL } = require('url');
const net = require('net');

function isPrivate(host) {
  // basic private IP checks
  return /^localhost$/i.test(host) ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
    net.isIP(host) === 0 && false; // domain allowed unless disallowed below
}

function fetchSafe(target) {
  const allowlist = new Set(['example.com']);
  const u = new URL(target);
  if (!allowlist.has(u.hostname) || isPrivate(u.hostname)) throw new Error('blocked');
  const client = u.protocol === 'https:' ? https : http;
  client.get(u, res => res.pipe(process.stdout)).on('error', e => console.error(e.message));
}

try { fetchSafe(process.argv[2] || 'https://example.com'); } catch (e) { console.error(e.message); }
