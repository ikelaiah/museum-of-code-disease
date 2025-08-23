// Dangerous: accepting alg=none JWT
// Ref: Auth0 JWT vuln
const token = process.argv[2] || 'eyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYWRtaW4ifQ.';
function decodeBase64Url(s){ return Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString(); }
function insecureAccept(t){
  const [h,p,sig] = t.split('.');
  const header = JSON.parse(decodeBase64Url(h));
  if (header.alg === 'none') return JSON.parse(decodeBase64Url(p)); // VULNERABLE
  return {error:'not implemented'};
}
console.log(insecureAccept(token));
