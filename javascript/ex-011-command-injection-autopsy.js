// Fix: Use spawn with argument array and no shell
const { spawn } = require('child_process');
const arg = process.argv[2] || 'status';
const allowed = new Set(['status','log','rev-parse']);
const cmd = 'git';
const args = allowed.has(arg) ? [arg] : ['status'];
const p = spawn(cmd, args, { shell: false });

p.stdout.on('data', d => process.stdout.write(d));
p.stderr.on('data', d => process.stderr.write(d));
p.on('close', (code) => process.exit(code));
