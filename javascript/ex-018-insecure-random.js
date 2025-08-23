// Dangerous: insecure randomness for tokens
// Ref: OWASP Cryptographic Storage Cheat Sheet
function makeToken() {
  // VULN: Math.random is not cryptographically secure
  return Math.random().toString(36).slice(2);
}
console.log(makeToken());
