# Pumpkin Language Roadmap

This document outlines the vision and evolution of Pumpkin. **We do not commit to timelines or specific release dates.** This roadmap reflects our design philosophy and long-term goals.

## Design Philosophy

Pumpkin is built on three core principles:

1. **Human-Readable Syntax**: Code should read like English, not mathematical notation.
2. **Safety by Default**: The runtime should never crash. Errors are caught and reported gracefully.
3. **Incremental Complexity**: Start simple, add power carefully.

We deliberately avoid "kitchen sink" language design. Every feature must justify its existence.

---

## v0.2 (Current Release)

**Status:** ✅ Shipped

### What We Built

* **Bytecode VM**: Replaced the AST interpreter with a stack-based VM for performance.
* **User-Defined Functions**: First-class functions with parameters and return values.
* **Arrays**: Single-dimensional lists with runtime bounds checking.
* **Module System**: Strict static imports and exports (one file = one module).
* **Debugger API**: Platform-agnostic single-step execution hooks.

### Why These Features?

v0.2 establishes the **execution foundation**. Functions and arrays are essential for any real program. The module system allows code organization without introducing complex dependency resolution.

---

## v0.3 (Planned)

**Focus:** Standard Library & I/O

### Proposed Features

* **File I/O**: Safe read/write operations with sandboxed permissions.
* **String Methods**: `split`, `trim`, `toUpperCase`, etc.
* **Math Library**: `sqrt`, `abs`, `floor`, `sin`, `cos`.
* **Collection Helpers**: `map`, `filter`, `reduce` for arrays.

### Why These Features?

v0.2 gave us the engine. v0.3 makes it **useful**. Without I/O and a standard library, Pumpkin is limited to toy programs. We prioritize safety (sandboxed file access) over raw power.

---

## v0.4 (Exploration)

**Focus:** Developer Experience

### Proposed Features

* **Error Messages 2.0**: Contextual hints, "did you mean?" suggestions.
* **Type Annotations (Optional)**: Gradual typing for documentation and tooling.
* **Package Manager**: Install third-party Pumpkin libraries.
* **LSP (Language Server)**: Autocomplete and inline diagnostics in editors.

### Why These Features?

v0.4 is about making Pumpkin **pleasant to use at scale**. Better errors reduce frustration. Optional types help teams coordinate without forcing everyone to adopt them. An LSP unlocks professional tooling.

---

## v1.0 (Vision)

**Goal:** Production-Ready Embedding

### What v1.0 Means

* **Performance Guarantees**: Predictable execution time for embedded use cases.
* **Memory Safety Audit**: External security review of the Rust core.
* **Stable API**: No breaking changes to the language syntax or VM.
* **WebAssembly First-Class**: Optimized WASM builds for browser/edge deployment.

### Philosophy

v1.0 is not about adding features. It's about **confidence**. We want developers to embed Pumpkin in production systems knowing it won't break.

---

## Non-Goals

We explicitly **will not** add:

* **Classes/OOP**: Pumpkin uses functions and closures. We believe composition beats inheritance.
* **Macros**: Code generation obscures behavior. Pumpkin code should be obvious.
* **Implicit Behavior**: No operator overloading, no hidden type coercions.

---

## How You Can Influence This

Open an issue on GitHub to propose features or discuss priorities. We prioritize:

1. **Simplicity** over power.
2. **Safety** over performance.
3. **Clarity** over brevity.

If a feature makes the language harder to learn, it needs exceptional justification.
