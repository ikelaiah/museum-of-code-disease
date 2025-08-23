-- Dangerous: Second-order SQL Injection
-- Reference: https://portswigger.net/web-security/sql-injection/second-order
-- Scenario: store attacker input safely (no error now), later concatenated into dynamic SQL

-- step1: attacker stores payload into profile.bio
-- UPDATE users SET bio = 'admin' -- ' WHERE id=123;

-- step2: admin runs a report builder that does:
-- EXECUTE('SELECT * FROM users WHERE role=''' + bio + ''''); -- VULNERABLE
