// Fix: Add CSRF tokens and SameSite cookies
// Run: node ex-015-csrf-demo-autopsy.js
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
let email = 'user@example.com';

function csrfToken(req, res, next) {
  let t = req.cookies.csrf;
  if (!t) {
    t = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf', t, { httpOnly: true, sameSite: 'Strict' });
  }
  res.locals.csrf = t;
  next();
}

function requireCsrf(req, res, next) {
  if (req.body && req.body._csrf && req.body._csrf === req.cookies.csrf) return next();
  return res.status(403).send('CSRF token invalid');
}

app.use(csrfToken);
app.post('/update-email', requireCsrf, (req, res) => {
  email = req.body.email || email;
  res.send('updated');
});
app.get('/me', (req, res) => res.json({ email, csrf: res.locals.csrf }));
app.listen(3001, () => console.log('CSRF fixed on http://localhost:3001'));
