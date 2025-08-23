// Dangerous: Command Injection in Node.js
// Run: node ex-011-command-injection.js "&& echo PWNED"
// Ref: PortSwigger OS Command Injection
const { exec } = require('child_process');
const user = process.argv[2] || 'status';
// VULN: concatenation passed to shell
exec('git ' + user, (e, out, err) => {
  if (e) { console.error(String(e)); return; }
  console.log(out || err);
});
