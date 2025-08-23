// Fix: Block dangerous keys and use null-prototype objects
// Run: node ex-010-prototype-pollution-autopsy.js

function safeMerge(target, src) {
  const dangerous = new Set(['__proto__', 'constructor', 'prototype']);
  for (const k of Object.keys(src)) {
    if (dangerous.has(k)) continue;
    target[k] = src[k];
  }
  return target;
}

const payload = JSON.parse('{"__proto__": {"polluted": true}, "ok": 1}');
const o = safeMerge(Object.create(null), payload);
console.log('polluted in {}?:', ({}).polluted === undefined);
console.log('ok in o?:', o.ok === 1);
