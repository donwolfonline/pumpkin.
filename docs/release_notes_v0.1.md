# Pumpkin v0.1: The Foundation Release 🌱

**Date:** Jan 5, 2026

We are proud (and a little nervous) to announce **Pumpkin v0.1**.

This is not a production-ready language. You cannot build a web server, a game, or even a complex calculator with it yet.

**But it runs.** It runs in your terminal, it runs in your browser, and it does so without panicking. It is the solid, strictly-tested foundation upon which we will build everything else.

## What is Pumpkin? 🎃

Pumpkin is a toy programming language designed for **education first**. We prioritize friendly error messages over execution speed, and simplicity over features.

In v0.1, we have proven that our core architecture (TypeScript Parser + Rust Interpreter + WASM Environment) works seamlessly together.

## What You Can Do Today

You can write simple scripts to explore algorithmic logic:

* **Variables:** `let x = 10`
* **Math:** `+`, `-`, `*`, `/` with correct operator precedence.
* **Logic:** `and`, `or`, `if`, `else`.
* **Loops:** `repeat 5` and `while count < 10`.
* **Output:** `show "Hello World"`

### Example: Finding Even Numbers

```pumpkin
let count = 0
repeat 10 {
    count = count + 1
    if (count % 2) == 0 {
        show count
        show "is even"
    }
}
```

## Known Limitations (Honesty Time) 🛑

To ensure v0.1 is stable, we intentionally left out many standard features. **These do NOT work yet:**

* ❌ **Functions:** You cannot define your own functions.
* ❌ **Arrays/Lists:** No data structures yet.
* ❌ **File I/O:** You cannot read or write files.
* ❌ **Imports:** All code must be in one file.

These are coming in v0.2.

## Installation

### CLI (Mac/Linux/Windows)

```bash
npm install -g pumpkin-lang
pumpkin run hello.pumpkin
```

### Web Playground

Try it instantly in your browser: [pumpkin-lang.org/playground](https://pumpkin-lang.org/playground)

## For Contributors

This release is really for **you**. The codebase is now architected, documented, and frozen.

* **Rust Core:** `pumpkin_core/` (The brain)
* **TypeScript CLI:** `src/cli/` (The interface)
* **Docs:** `docs/` (The map)

We are looking for help building the **Standard Library** and implementing **Arrays** for v0.2.

## Feedback

If usage feels clunky, or an error message confuses you, please tell us. That is the bug we want to fix most.
[Open an Issue](https://github.com/pumpkin-lang/pumpkin/issues)

---

## Website Blurb (Short Version)

**Announcing Pumpkin v0.1** 🚀
The first release of our friendly educational language is live! v0.1 allows you to run basic logic scripts in the browser and CLI. It mimics the reliability of Rust with the approachability of a toy. Functions and Arrays are missing, but the foundation is solid.
[Read the Release Notes >]
