// Fix: Require expected alg and verify signature
const crypto = require('crypto');
const secret = 'supersecret';
function verifyHS256(t){
  const [h,p,sig] = t.split('.');
  const expected = crypto.createHmac('sha256', secret).update(h + '.' + p).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return {error:'bad sig'};
  const header = JSON.parse(Buffer.from(h,'base64url').toString());
  if (header.alg !== 'HS256') return {error:'bad alg'};
  return JSON.parse(Buffer.from(p,'base64url').toString());
}
module.exports = { verifyHS256 };
