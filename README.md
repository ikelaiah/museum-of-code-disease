# Museum of Code Disease 🧫

![Danger Level](https://img.shields.io/badge/danger%20level-☢️%20MAXIMUM-red?style=for-the-badge)
![Code Quality](https://img.shields.io/badge/code%20quality-💩%20TERRIBLE-brown?style=for-the-badge)
![Educational Value](https://img.shields.io/badge/educational%20value-📚%20HIGH-brightgreen?style=for-the-badge)
![Therapy Required](https://img.shields.io/badge/therapy%20required-🛋️%20PROBABLY-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)
![Do Not Use](https://img.shields.io/badge/production%20use-❌%20FORBIDDEN-red)
![Cringe Factor](https://img.shields.io/badge/cringe%20factor-😱%20MAXIMUM-purple)

**Counterexamples for fun & education.** 

This repo curates intentionally awful code samples (“exhibits”) across languages to help developers spot anti-patterns, sniff out smells, and practise refactoring. It’s a **teaching museum**, not a wall of shame.

> ⚠️ **Safety first:** Exhibits are insecure, leaky, brittle, and misleading **by design**.  
> Do **not** run them in production, against real services, or anywhere you care about.

---

## Why this exists 🤔

- **Learn by contrast.** 👀 Seeing *what not to do* sharpens code review instincts and improves architectural taste.
- **Have some fun.** 😂 A little gallows humour about software disasters keeps things memorable.
- **Shareable teaching aids.** 🎓 Drop an exhibit into a brown-bag session or code kata and refactor together.

---

## What's inside 📦

```bash
museum-of-code-disease/
├─ c/
│  ├─ ex-001-nightmare.c
│  ├─ ex-001-nightmare-autopsy.c
│  ├─ ex-002-nightmare.c
│  └─ ex-002-nightmare-autopsy.c
├─ csharp/
│  ├─ ex-001-nightmare.cs
│  └─ ex-001-nightmare-autopsy.cs
├─ freepascal/
│  ├─ ex-001-nightmare.pas
│  └─ ex-001-nightmare-autopsy.pas
├─ java/
│  ├─ ex-001-nightmare.java
│  └─ ex-001-nightmare-autopsy.java
├─ javascript/
│  ├─ ex-001-nightmare.js
│  └─ ex-001-nightmare-autopsy.js
├─ perl/
│  ├─ ex-001-nightmare.pl
│  └─ ex-001-nightmare-autopsy.pl
├─ python/
│  ├─ ex-001-nightmare.py
│  ├─ ex-001-nightmare-autopsy.py
│  ├─ ex-002-lipsy.py
│  └─ ex-002-lipsy-autopsy.py
├─ rust/
│  ├─ ex-001-nightmare.rs
│  └─ ex-001-nightmare-autopsy.rs
├─ sql/
│  ├─ ex-001-evil-joins.sql
│  └─ ex-001-evil-joins-autopsy.sql
├─ CONTRIBUTING.md
├─ LICENSE.md
└─ README.md
```

- Each exhibit includes:

  - the **bad code** (as-is, unformatted),
  - a short **“What’s wrong here?”** checklist,
  - optionally a **safer rewrite** for contrast.

---

## Current Exhibits 🏛️

- **⚙️ [C ex-001](c/ex-001-nightmare.c)**: Memory management nightmares, buffer overflows, pointer chaos
- **⚙️ [C ex-002](c/ex-002-nightmare.c)**: Advanced memory corruption, race conditions, undefined behavior
- **🔷 [C# ex-001](csharp/ex-001-nightmare.cs)**: Resource leaks, exception handling disasters, SQL injection
- **🔧 [FreePascal ex-001](freepascal/ex-001-nightmare.pas)**: Memory leaks, race conditions, goto abuse
- **☕ [Java ex-001](java/ex-001-nightmare.java)**: Bracket alignment terrorism (Python-style), resource leaks, SQL injection
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
