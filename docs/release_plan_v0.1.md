# 🚀 Pumpkin v0.1 Release Plan

## Philosophy

**"Under-promise, Over-deliver."**
We are releasing a "preview" for curious learners, not a production tool for enterprises. Our tone is honest, calm, and welcoming.

---

## 📅 Timeline (4 Weeks)

### Week 1: Polish & Freeze

- [ ] **Code Freeze**: No new syntax features.
- [ ] **Bug Bash**: Verify all examples in `examples/` run without errors.
- [ ] **Error Audit**: specific check that all error messages are friendly.

### Week 2: Content & Docs

- [ ] **Website**: Deploy `website/` to a live URL (e.g., Netlify/Vercel).
- [ ] **Guide**: Ensure `docs/pumpkin_guide.md` matches the implementation exactly.
- [ ] **Playground**: Ensure the web playground works on mobile.

### Week 3: Soft Launch (The "Inner Circle")

- [ ] **discord**: Open the server to 50 curated testers (educators/mentors).
- [ ] **Feedback Loop**: Fix critical bugs found by testers.
- [ ] **Testimonials**: Get 3 quotes for the landing page.

### Week 4: Public Launch

- [ ] **GitHub**: Create Release `v0.1.0`.
- [ ] **Twitter**: Publish "Why I built this" thread.
- [ ] **Reddit**: Post to `r/programminglanguages` and `r/learnprogramming`.

---

## 📦 Scope

### ✅ Included (The "Happy Path")

* **Core Syntax**: `let`, `show`, `ask`, `if/else`, `repeat`, `while`, `function`.
- **Data Types**: Numbers, Strings, Booleans, Simple Lists, Simple Objects.
- **Standard Library v1**: Math, Text, List (basic operations).
- **Tools**: REPL, File Runner (`pumpkin run file.pumpkin`), and Web Playground.
- **Documentation**: Beginner Guide, Syntax Diagrams.

### ❌ Explicitly NOT Included (Manage Expectations)

* **File I/O**: No reading/writing files on disk yet.
- **Modules**: No `import` from other files.
- **Classes/OOP**: No complex inheritance.
- **Package Manager**: No `npm` equivalent yet.
- **Perf**: Speed is not a priority for v0.1.

---

## 📢 Announcement Strategy

### The "Anti-Hype" Message
>
> "Pumpkin is a small language for people who find coding scary. It's not fast, it's not powerful, but it's friendly. It's v0.1, so there might be bugs, but we promise to fix them together."

### Channels

1. **Twitter / X**: Thread with side-by-side screenshots (Python Error vs Pumpkin Friendly Error).
2. **Reddit**: Text post focusing on the *philosophy* ("Why I removed the semicolon").
3. **Hacker News**: Show HN. (Be prepared for criticism, ignore the trolls).

---

## 🛡️ Support & Feedback

### How to Handle Bugs

* **Publicly**: Acknowledge them immediately. "Great catch! We missed that."
- **Tagging**: Label issues as `bug` and `v0.1`.
- **Priority**: Fix crashes first, then confusing errors.

### Where to Collect Feedback

* **GitHub Issues**: For bugs and feature requests.
- **Discord**: For "I'm stuck" and "Look what I made".
- **Google Form**: (Optional) "First impressions" survey on the thank-you page.
