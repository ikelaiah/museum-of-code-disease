// Fix: Validate shape and allowlist fields/operators
function findUserSafe(param) {
  let parsed;
  try { parsed = JSON.parse(param); } catch { return { error: 'bad json' }; }
  const allowedFields = new Set(['username']);
  if (typeof parsed !== 'object' || parsed === null) return { error: 'bad' };
  const q = {};
  if (typeof parsed.username === 'string') q.username = parsed.username;
  return q; // db.users.find(q)
}
console.log(findUserSafe(process.argv[2] || '{"username":"alice"}'));
