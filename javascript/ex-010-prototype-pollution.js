// Dangerous: Prototype Pollution via __proto__
// Run: node ex-010-prototype-pollution.js
// Reference: https://portswigger.net/web-security/prototype-pollution

function merge(target, src) {
  // VULN: naive merge copies __proto__
  for (const k in src) {
    target[k] = src[k];
  }
  return target;
}

const payload = JSON.parse('{"__proto__": {"polluted": true}}');
const o = merge({}, payload);
console.log('polluted in {}?:', ({}).polluted === true);
console.log('own keys of o:', Object.keys(o));
