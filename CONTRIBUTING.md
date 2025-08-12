# Contributing to the Museum of Code Disease 🧫

Thank you for your interest in contributing to our collection of educational code horrors! We welcome contributions that help developers learn to identify and avoid common programming mistakes.

## 🎯 What We're Looking For

### Good Exhibit Candidates
- **Clear anti-patterns** that teach specific lessons
- **Multi-language examples** (Python, JavaScript, Java, C++, SQL, etc.)
- **Focused themes** (one main problem per exhibit)
- **Educational value** over pure shock value
- **Common real-world mistakes** that developers actually make

### Examples of Great Exhibits
- SQL injection vulnerabilities
- Race conditions and threading issues
- Memory leaks and resource management
- Security anti-patterns
- Performance disasters
- Maintainability nightmares
- Formatting terrorism (like our parentheses ceremony!)

## 📋 Contribution Guidelines

### 1. Keep It Educational
- **No shaming**: Don't call out specific individuals, companies, or projects
- **No doxxing**: Remove any real names, emails, or identifying information
- **Focus on learning**: Each exhibit should teach something valuable

### 2. Safety First
- **No real secrets**: Remove API keys, passwords, or sensitive data
- **No real endpoints**: Don't include actual URLs or services
- **No malware**: Nothing that could cause actual harm
- **Isolated examples**: Code should be self-contained for safety

### 3. Structure Your Contribution

Each exhibit should include:

#### Required Files
- `{language}/ex-{number}-{slug}.{ext}` - The nightmare code
- `{language}/ex-{number}-{slug}-autopsy.{ext}` - Same code with educational comments

#### Autopsy Format
Follow this pattern in your autopsy file:
```
// PROBLEM: Description of what's wrong
// FIX: How to fix it properly
// WHY IT'S BAD: Explanation of the consequences
```

### 4. Naming Convention
- **Nightmare files**: `ex-001-nightmare.py`, `ex-002-sql-injection.sql`
- **Autopsy files**: `ex-001-nightmare-autopsy.py`, `ex-002-sql-injection-autopsy.sql`
- **Use descriptive slugs**: `memory-leak`, `race-condition`, `eval-danger`

## 🚀 How to Contribute

### Option 1: GitHub Issues
1. Open an issue describing your exhibit idea
2. Include the language and main anti-pattern
3. We'll discuss and help you develop it

### Option 2: Pull Request
1. Fork the repository
2. Create a new branch: `git checkout -b exhibit/python-eval-nightmare`
3. Add your exhibit files following the naming convention
4. Update the README.md "Current Exhibits" section
5. Submit a pull request

### Option 3: Share Ideas
- Open a discussion with code snippets you've encountered
- We can help turn them into proper exhibits
- Great for when you're not sure about the format

## 🎨 Writing Great Autopsy Comments

### Do This ✅
```python
# PROBLEM: eval() executes arbitrary code - massive security risk
result = eval(user_input)  
# FIX: Use json.loads() for JSON, ast.literal_eval() for literals
# WHY IT'S BAD: Attackers can execute any Python code on your system
```

### Not This ❌
```python
# This is bad
result = eval(user_input)  # don't do this
```

### Make It Educational
- Explain **why** it's dangerous
- Show **how** to fix it
- Describe **real-world consequences**
- Include **performance implications** if relevant

## 🔍 Review Process

Before merging, we'll check that exhibits:

1. **Run safely** (or fail in expected ways)
2. **Don't reach real services** unless properly mocked
3. **Follow naming conventions**
4. **Include educational value**
5. **Are appropriate for all audiences**
6. **Don't contain actual malware or illegal content**

## 💡 Exhibit Ideas We'd Love

- **JavaScript**: Prototype pollution, `==` vs `===` chaos, callback headache
- **Java**: Null pointer exceptions, resource leaks, serialization disasters
- **C/C++**: Buffer overflows, memory management nightmares, undefined behavior
- **Go**: Goroutine leaks, interface{} abuse, error handling anti-patterns
- **Rust**: Fighting the borrow checker (and losing)
- **PHP**: Register globals, SQL injection classics, type juggling
- **CSS**: Specificity wars, layout disasters, responsive breakpoints from headache
- **Shell**: Command injection, quoting nightmares, portability disasters

## 🎭 Tone and Style

### Keep It Fun But Respectful
- **Humor is welcome** - we're here to learn and laugh
- **Be kind** - remember we've all written bad code
- **Stay educational** - entertainment should support learning
- **Avoid negativity** - focus on improvement, not criticism

### Writing Style
- Use clear, concise explanations
- Include specific examples of fixes
- Reference relevant documentation when helpful
- Keep comments focused and actionable

## 🏆 Recognition

Contributors will be:
- Listed in the README.md contributors section
- Credited in their exhibit files
- Invited to help review future contributions
- Given our eternal gratitude for making developers everywhere slightly less likely to write terrible code!

## 📞 Questions?

- Open a GitHub issue for exhibit ideas
- Start a discussion for general questions
- Check existing exhibits for format examples

Remember: The goal is to help developers learn, not to shame anyone. We've all been there! 🐛➡️🦋

---

*"The best way to learn is from other people's mistakes. The second best way is from your own mistakes. This repository focuses on the first way."* - Museum of Code Disease Philosophy
