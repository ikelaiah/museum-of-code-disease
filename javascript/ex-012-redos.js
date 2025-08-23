// Dangerous: ReDoS via catastrophic backtracking
// Run: node ex-012-redos.js
// Ref: OWASP ReDoS
const regex = /^(a+)+$/; // catastrophic on long 'a's
const s = 'a'.repeat(30000) + 'X';
console.time('match');
console.log(regex.test(s));
console.timeEnd('match');
