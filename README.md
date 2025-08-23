# Museum of Code Disease 🧫

![Danger Level](https://img.shields.io/badge/danger%20level-☢️%20MAXIMUM-FFD600?style=for-the-badge&labelColor=1f2937)
![Code Quality](https://img.shields.io/badge/code%20quality-💩%20TERRIBLE-374151?style=for-the-badge&labelColor=1f2937)
![Therapy Required](https://img.shields.io/badge/therapy%20required-🛋️%20PROBABLY-273141?style=for-the-badge&labelColor=1f2937)
![License](https://img.shields.io/badge/license-MIT-2563EB?style=for-the-badge&labelColor=1f2937)
![Do Not Use](https://img.shields.io/badge/production%20use-❌%20FORBIDDEN-7F1D1D?style=for-the-badge&labelColor=1f2937)
![Cringe Factor](https://img.shields.io/badge/cringe%20factor-😱%20MAXIMUM-A855F7?style=for-the-badge&labelColor=1f2937)
![Educational Value](https://img.shields.io/badge/educational%20value-📚%20HIGH-2E8C71?style=for-the-badge&labelColor=1f2937)
![Contributions](https://img.shields.io/badge/contributions-welcome-10B981?style=for-the-badge&labelColor=1f2937)


**Counterexamples for fun & education.** 

This repo curates intentionally awful code samples (“exhibits”) across languages to help developers spot anti-patterns, sniff out smells, and practise refactoring. It’s a **teaching museum**, not a wall of shame.

> [!WARNING]  
> **Safety first:** Exhibits are insecure, leaky, brittle, and misleading **by design**.  
> Do **not** run them in production, against real services, or anywhere you care about.

---

## Why this exists 

- **Learn by contrast.** Seeing *what not to do* sharpens code review instincts and improves architectural taste.
- **Have some fun.** A little gallows humour about software disasters keeps things memorable.
- **Shareable teaching aids.** Drop an exhibit into a brown-bag session or code kata and refactor together.

---

## What's inside 
For the full catalog of exhibits and autopsies, see the index: [INDEX.md](./INDEX.md)

- Each exhibit includes:

  - the **bad code** (as-is, unformatted),
  - a short **“What’s wrong here?”** checklist,
  - optionally a **safer rewrite** for contrast.

## Sneak peek: C format string bug

Bad (specimen) from `c/ex-011-format-string.c`:
```c
// Dangerous: Format String Vulnerability
// Build: gcc -g ex-011-format-string.c -o fmt && ./fmt "%x %x %x"
// Ref: OWASP Format String Attack
#include <stdio.h>

int main(int argc, char** argv){
    char buf[128];
    const char* user = (argc>1)?argv[1]:"hello";
    // VULN: user input as format string
    printf(user);
    printf("\n");
    snprintf(buf, sizeof(buf), user); // also dangerous
    printf("snprintf result: %s\n", buf);
    return 0;
}
```

Autopsy (fix) from `c/ex-011-format-string-autopsy.c`:
```c
// Fix: Treat user input as data, not format string
#include <stdio.h>

int main(int argc, char** argv){
    char buf[128];
    const char* user = (argc>1)?argv[1]:"hello";
    printf("%s\n", user);
    snprintf(buf, sizeof(buf), "%s", user);
    printf("snprintf result: %s\n", buf);
    return 0;
}
```

Tip: also validate input and cap lengths (e.g., snprintf) in real programs.

### Sneak peek: Node.js command injection

Bad (specimen) from `javascript/ex-011-command-injection.js`:
```js
// Dangerous: Command Injection in Node.js
// Run: node javascript/ex-011-command-injection.js "&& echo PWNED"
const { exec } = require('child_process');
const user = process.argv[2] || 'status';
// VULN: concatenation passed to shell
exec('git ' + user, (e, out, err) => {
  if (e) { console.error(String(e)); return; }
  console.log(out || err);
});
```

Autopsy (fix) from `javascript/ex-011-command-injection-autopsy.js`:
```js
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
```

### Sneak peek: Python YAML unsafe load

Bad (specimen) aligned with `python/ex-011-yaml-unsafe-load.py`:
```python
# Dangerous: yaml.load with unsafe loader
import yaml, sys
payload = sys.argv[1] if len(sys.argv)>1 else 'a: 1'
obj = yaml.load(payload, Loader=yaml.Loader)  # VULNERABLE
print(obj)
```

Autopsy (fix):
```python
import yaml, sys
payload = sys.argv[1] if len(sys.argv)>1 else 'a: 1'
obj = yaml.safe_load(payload)  # only simple types
print(obj)
```

### Sneak peek: SQL injection (Python sqlite3)

Bad (specimen) extracted from `python/ex-001-nightmare.py` (`get_user`):
```python
import sqlite3
def get_user(password_guess, name_guess):
    con = sqlite3.connect(":memory:")
    cur = con.cursor()
    try:
        q = "SELECT * FROM usr WHERE nm = '" + name_guess + "' AND pwd = '" + password_guess + "';"
        res = cur.execute(q).fetchall()  # injection
        return res[0]
    finally:
        con.close()
```

Autopsy (fix):
```python
import sqlite3
def get_user_safe(password_guess, name_guess):
    con = sqlite3.connect(":memory:")
    cur = con.cursor()
    try:
        res = cur.execute(
            "SELECT * FROM usr WHERE nm = ? AND pwd = ?",
            (name_guess, password_guess)
        ).fetchall()
        return res[0] if res else None
    finally:
        con.close()
```

Tip: validate inputs, prefer parameterized queries, and avoid spawning shells.

---

## Some Exhibits 

- **🎭 [JavaScript ex-001](javascript/ex-001-nightmare.js)**: Type coercion headache, prototype pollution, callback pyramid
- **🐪 [Perl ex-001](perl/ex-001-nightmare.pl)**: Regular expression madness, cryptic syntax abuse, global variables
- **🐍 [Python ex-001](python/ex-001-nightmare.py)**: Global chaos, eval() dangers, SQL injection
- **🐍 [Python ex-002](python/ex-002-lipsy.py)**: Parentheses ceremony (formatting terrorism)  
- **🦀 [Rust ex-001](rust/ex-001-nightmare.rs)**: Borrow checker destruction, unsafe code paradise, memory leaks
- **🗄️ [SQL ex-001](sql/ex-001-evil-joins.sql)**: Absolute NATURAL JOIN chaos, injection vulnerabilities

---

## Exhibit template 📋

## The specimen 🦠

Path: `{folder}/ex-{id}-{slug}.{ext}`

## The autopsy 🔬

Path: `{folder}/ex-{id}-{slug}-autopsy.{ext}`

Also include:

- 🩺 Symptoms (what's wrong)
- ✅ Safer rewrite (optional)
- 📚 Teaching notes

---

## Contributing 🤝

PRs welcome! Please follow the vibe:

1. **Keep it educational.** 🎓 No calling out individuals or companies. No doxxing.
2. **Isolate danger.** 🔒 Don't include secrets, real endpoints, or irreversible commands.
3. **Explain the harm.** 💡 Add a checklist that teaches *why* the code is bad.
4. **Small, focused exhibits.** 🎯 One main theme per exhibit (it's okay to sprinkle minor sins).
5. **Naming:** 📝 `ex-XYZ-short-slug.ext` with a matching notes file.

Before merging, we’ll sanity-check that an exhibit:

* runs (or *fails*) in a controlled way,
* doesn’t reach out to real services unless mocked,
* doesn’t include malware or anything illegal.

---

## Usage (for workshops) 🎪

* **Show the specimen.** 😱 Let people cringe for 2–3 minutes.
* **Ask for smells.** 👃 Collect observations before revealing the checklist.
* **Time-boxed refactor.** ⏰ 15–20 minutes, pairs or groups.
* **Debrief.** 🗣️ Compare approaches and tradeoffs.

---

## Code of Conduct 💖

- Be kind. 🤗 We're here to learn.
- This repo exists **for fun and education** 🎉—it's **not** about shaming anyone's past code. Most of us have written versions of these exhibits! 😅

---

## License 📄

- This project: MIT ✅
- Code samples: MIT ✅

---

## Inspiration 💡

* **Museum of Human Disease (UNSW, founded 1959)** 🏥—an educational collection helping people understand health and disease. Again, **no affiliation**; we just love the museum metaphor. 🏛️ ([UNSW Museum of Human Disease][1])


[1]: https://www.unsw.edu.au/medicine-health/disease-museum/about "About us | Museum of Human disease - UNSW Sydney"
