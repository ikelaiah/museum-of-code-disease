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

## Why this exists

- **Learn by contrast.** Seeing *what not to do* sharpens code review instincts and improves architectural taste.
- **Have some fun.** A little gallows humour about software disasters keeps things memorable.
- **Shareable teaching aids.** Drop an exhibit into a brown-bag session or code kata and refactor together.

This project’s name is a playful nod to UNSW’s **Museum of Human Disease**—a long-running educational collection in Sydney. We’re **not affiliated** with UNSW or the museum. :contentReference[oaicite:0]{index=0}

---

## What’s inside

```bash
museum-of-code-disease/
├─ python/
│  ├─ ex-001-nightmare.py
│  ├─ ex-001-nightmare-autopsy.py
│  ├─ ex-002-lipsy.py
│  └─ ex-002-lipsy-autopsy.py
├─ java/
│  ├─ ex-001-nightmare.java
│  └─ ex-001-nightmare-autopsy.java
├─ rust/
│  ├─ ex-001-nightmare.rs
│  └─ ex-001-nightmare-autopsy.rs
├─ javascript/
│  ├─ ex-001-nightmare.js
│  └─ ex-001-nightmare-autopsy.js
├─ freepascal/
│  ├─ ex-001-nightmare.pas
│  └─ ex-001-nightmare-autopsy.pas
├─ sql/
│  ├─ ex-001-evil-joins.sql
│  └─ ex-001-evil-joins-autopsy.sql
├─ LICENSE.md
├─ CONTRIBUTING.md
└─ README.md
```

- Each exhibit includes:

  - the **bad code** (as-is, unformatted),
  - a short **“What’s wrong here?”** checklist,
  - optionally a **safer rewrite** for contrast.

---

## Current Exhibits

- **Python ex-001**: Global chaos, eval() dangers, SQL injection
- **Python ex-002**: Parentheses ceremony (formatting terrorism)  
- **Java ex-001**: Bracket alignment terrorism (Python-style), resource leaks, SQL injection
- **Rust ex-001**: Borrow checker destruction, unsafe code paradise, memory leaks
- **JavaScript ex-001**: Type coercion hell, prototype pollution, callback pyramid
- **FreePascal ex-001**: Memory leaks, race conditions, goto abuse
- **SQL ex-001**: Absolute NATURAL JOIN chaos, injection vulnerabilities

---

## Exhibit template

Put this in `templates/EXHIBIT_TEMPLATE.md` and copy for new exhibits.

```markdown
# Exhibit {ID}: {Short title}

**Language:** {Python | Free Pascal | SQL | …}  
**Tags:** {globals, eval, sql-injection, race-conditions, …}

## The specimen

Path: `{folder}/ex-{id}-{slug}.{ext}`

## Symptoms (what’s wrong)

- [ ] {smell 1: why it’s harmful}
- [ ] {smell 2: why it’s harmful}
- [ ] {smell 3: why it’s harmful}

## Safer rewrite (optional)

Link to a clean version or gist.

## Teaching notes

- {prompt or exercise idea}
- {discussion questions}
```

---

## Contributing

PRs welcome! Please follow the vibe:

1. **Keep it educational.** No calling out individuals or companies. No doxxing.
2. **Isolate danger.** Don’t include secrets, real endpoints, or irreversible commands.
3. **Explain the harm.** Add a checklist that teaches *why* the code is bad.
4. **Small, focused exhibits.** One main theme per exhibit (it’s okay to sprinkle minor sins).
5. **Naming:** `ex-XYZ-short-slug.ext` with a matching notes file.

Before merging, we’ll sanity-check that an exhibit:

* runs (or *fails*) in a controlled way,
* doesn’t reach out to real services unless mocked,
* doesn’t include malware or anything illegal.

---

## Usage (for workshops)

* **Show the specimen.** Let people cringe for 2–3 minutes.
* **Ask for smells.** Collect observations before revealing the checklist.
* **Time-boxed refactor.** 15–20 minutes, pairs or groups.
* **Debrief.** Compare approaches and tradeoffs.

---

## Code of Conduct

- Be kind. We’re here to learn.
- This repo exists **for fun and education**—it’s **not** about shaming anyone’s past code. Most of us have written versions of these exhibits!

---

## License

- This project: MIT
- Code samples: MIT

---

## Inspiration

* **Museum of Human Disease (UNSW, founded 1959)**—an educational collection helping people understand health and disease. Again, **no affiliation**; we just love the museum metaphor. ([UNSW Sites][1])


[1]: https://www.unsw.edu.au/medicine-health/disease-museum/about?utm_source=chatgpt.com "About us | Museum of Human disease - UNSW Sydney"
