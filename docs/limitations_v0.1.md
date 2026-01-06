# Known Limitations (v0.1)

This document outlines the architectural boundaries and feature constraints of Pumpkin v0.1. We believe in transparency about what the language *cannot* do yet.

## 1. No User-Defined Functions

**Limitation:** You cannot define `function name() { ... }`.
**Why:** v0.1 focuses solely on strict imperative control flow and the core expression evaluator. We wanted to nail the parser and interpreter loop before introducing call stacks and frames.
**Status:** **Implemented in v0.2.** The new Stack Logic VM supports first-class functions and closures.

## 2. No Arrays or Lists

**Limitation:** You can only store single values (scalars) in variables. No `[1, 2, 3]`.
**Why:** Implementing contiguous memory allocation and garbage collection interactions for heap-allocated objects was out of scope for the initial "Proof of Syntax" release.
**Status:** **Implemented in v0.2.** Arrays are now a core primitive type.

## 3. Single-File Execution Only

**Limitation:** You cannot `import` or `include` other Pumpkin files. Code must exist in one file.
**Why:** Dependency resolution and module loading require a robust file system abstraction and cycle detection, which adds significant complexity to the runtime.
**Status:** **Implemented in v0.2.** A strict module system has been added.

## 4. No File I/O

**Limitation:** You cannot read from or write to files. The only output is `show` (stdout).
**Why:** Sandbox safety. We intentionally restricted the runtime to be pure computation to ensure it could be embedded safely anywhere without risking file system corruption.
**Status:** **Under Consideration for v0.3.** We may add a safe standard library wrapper later.

## 5. No Imports / Standard Library

**Limitation:** There is no `Math`, `String`, or `Time` library.
**Why:** We are keeping the core binary size extremely small (< 2MB).
**Status:** **Partial in v0.2.** New primitive functions and module support lay the groundwork for a standard library.
