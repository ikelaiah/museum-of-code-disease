// Dangerous: CSRF on state-changing endpoint (no CSRF token)
// Run: node ex-015-csrf-demo.js
// Ref: OWASP CSRF
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
let email = 'user@example.com';

app.post('/update-email', (req, res) => {
  // VULN: no CSRF token check, cookie-based auth assumed
  email = req.body.email || email;
  res.send('updated');
});

app.get('/me', (req, res) => res.json({ email }));
app.listen(3000, () => console.log('CSRF demo on http://localhost:3000'));
