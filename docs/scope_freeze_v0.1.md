# Feature Scope Freeze: v0.1 🧊

**Status:** LOCKED 🔒
**Date:** Jan 5, 2026

This document defines the **absolute final scope** for Pumpkin v0.1. Any feature not listed here is **rejected** until v0.2.

## ✅ Included Features (The "Yes" List)

These features are implemented and must work perfectly.

### Core Language

* **Variables:** `let` declarations, reassignment, shadowing.
* **Types:** `Number` (f64), `String` (utf8), `Boolean`.
* **Arithmetic:** `+`, `-`, `*`, `/`, `( )` grouping.
* **Logic:** `and`, `or`, `not`, comparison operators (`>`, `<`, `==`, etc).
* **Control Flow:**
  * `if` / `else` (blocks required).
  * `while` loops.
  * `repeat` loops (syntactic sugar).
* **Output:** `show` statement (stdout).
* **Comments:** `//` single line comments.

### Tooling

* **CLI:** `run`, `repl`, `version`, `help`.
* **Browser Playground:** Editor + Console + WASM Runtime.
* **Error System:** Friendly, colored errors with hints and location highlighting.

## ⛔ Excluded Features (The "No" List)

These features are explicitly **CUT** from v0.1 to ensure stability.

* ❌ **Functions:** No user-defined functions `fn`.
* ❌ **Data Structures:** No `List`, `Array`, or `Object` / `Struct`.
* ❌ **Modules:** No `import` or `export`.
* ❌ **File I/O:** Cannot read/write files (sandbox safety).
* ❌ **Null:** `null` exists internally but is not exposed/used by users yet.
* ❌ **Strings:** No string interpolation or methods (`.length`).

## 🔮 Deferred Ideas (The v0.2 Implementation Plan)

These are great ideas that we will build **after** v0.1 is stable.

1. **User Functions:** The biggest missing piece.
2. **Lists:** `[1, 2, 3]` syntax.
3. **Standard Library:** Math functions (`Math.sin`), String utils.
4. **Syntax Highlighting:** VS Code extension (currently text-mate grammar exists but unreleased).

## 🛡️ Rejection Policy

**Rule:** If a PR adds a feature not in the "Included" list, it must be **closed**.

**Response Template:**
> "Thanks for the contribution! Pumpkin is currently in a Feature Freeze for v0.1 to focus on stability and documentation. This feature is scope-creeping v0.1. Please re-submit this after the v0.1 release tag is pushed. (See `docs/scope_freeze_v0.1.md`)"
