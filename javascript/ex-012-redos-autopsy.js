// Fix: Use linear-time regex or timeouts
const safe = /^(?:a+)$/; // no nested quantifiers
const s = 'a'.repeat(30000) + 'X';
console.time('match');
console.log(safe.test(s));
console.timeEnd('match');
