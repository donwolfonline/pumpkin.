# Pumpkin Contributor Recruitment Plan 🎃

**Goal:** Attract 5-10 core contributors who want to learn how compilers work.

## 1. The Value Proposition 💡

Why should someone work on Pumpkin?

* **"Learn by Doing":** Most people want to build a language but don't know where to start. Pumpkin is that starting point.
* **Non-Intimidating:** We use strict TypeScript but simple architecture. No PhD required.
* **High Impact:** We are at v0.1. Every PR defines the language.

## 2. The Contributor Ladder 🪜

We optimize for **Retention** over Speed.

### Level 1: The Fixer (Issues: "Good First Issue")

* **Entry Point:** Typos, Docs, Simple Standard Library functions (`Math.abs`).
* **Reward:** Name in `AUTHORS.md`, Twitter shoutout.

### Level 2: The Builder (Issues: "Help Wanted")

* **Tasks:** Implementing a new specific feature (e.g., `String.reverse`), adding unit tests for edge cases.
* **Reward:** Triage rights, invitation to Discord "Core Dev" channel.

### Level 3: The Architect (Issues: "RFC")

* **Tasks:** Designing new syntax, optimizing the Interpreter, Rust migration.
* **Reward:** Core Maintainer status, merge rights.

## 3. Outreach Strategy 📣

### Twitter / Social Media Template
>
> 🎃 Want to build your first programming language?
>
> Pumpkin is a new beginner-friendly language written in TypeScript. We are looking for learners to help us build the Standard Library!
>
> ✅ No compiler experience needed
> ✅ "Good First Issues" ready
> ✅ Mentorship provided
>
> [Link to Repo] #buildinpublic #typescript #opensource

### Direct Developer Outreach (DM)
>
> "Hey! I saw you're interested in TypeScript/Compilers. I'm building a toy language called Pumpkin explicitly for teaching how interpreters work. We have some open issues for implementing math functions that would be a great weekend project if you want to dip your toes into language design. No pressure!"

## 4. "Good First Issue" Definitions 🏷️

An issue is ONLY a "Good First Issue" if:

1. **Context is Isolated:** The user doesn't need to understand the Parser to fix it. (e.g., "Add `Math.sqrt` to `stdlib/index.ts`").
2. **Solution is Known:** The maintainer knows exactly how to solve it and has sketched the path.
3. **Verification is Easy:** "Run `npm test` and see it pass."

---
*This plan is internal. The public face is `CONTRIBUTING.md`.*
