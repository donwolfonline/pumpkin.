# Rust & WASM Migration Plan 🦀

This document outlines the strategic path for migrating the Pumpkin runtime from TypeScript to Rust. The goal is to improve performance and portability (WASM) without breaking the language specification or user experience.

## The Strategy: "Swap the Engine, Keep the Car"

We will use a **Strangler Fig** pattern, replacing internal components one by one while maintaining the external TypeScript API.

## Phase 1: AST Stabilization (Current Phase)

Before writing any Rust, we must ensure the "Contract" between components is language-agnostic.

* **Goal**: The AST must be serializable JSON, not rich JavaScript objects.
* **Do**: Use strict interfaces in `src/ast/nodes.ts`. Use simple data types (string, number, boolean).
* **Don't**: Rely on `instanceof` checks for node types (use `.kind` string tag).
* **Don't**: Store host-specific objects (like Node.js `Buffer` or `Date`) directly in the AST.

## Phase 2: The Rust Core (v0.5)

We will port the **Interpreter** logic first, leaving the Parser in TypeScript (Ohm.js is great and hard to replace quickly).

1. **Crate**: Create `pumpkin_core` Rust crate.
2. **Input**: Accepts JSON AST string (or byte array).
3. **Process**: Rust struct `Interpreter` walks the JSON AST.
4. **Output**: Returns a result or fires callbacks for `show`/`ask`.
5. **WASM**: Compile `pumpkin_core` to `pumpkin_core.wasm`.

**The Bridge (WASM Interface):**

```typescript
// Proposed TS Interface wrapping WASM
class RustInterpreter {
    constructor(wasmModule: any) { ... }
    evaluate(astJson: string): void;
}
```

## Phase 3: The Full Stack (v1.0)

Once the interpreter is stable in Rust, we (optionally) port the Parser.

1. **Parser**: Use `pest` or `nom` in Rust to replace Ohm.js.
2. **Benefit**: Single binary, no JS dependency for the CLI.
3. **Trade-off**: Requires rewriting the grammar from scratch. *This is low priority.*

## Architecture Compatibility Risk Analysis

| Risk | Mitigation |
| :--- | :--- |
| **FFI Overhead** | Crossing JS<->WASM boundary is slow. **Solution**: Pass the entire AST once. Batch "show" outputs if possible. |
| **Garbage Collection** | Rust doesn't have a GC; Pumpkin does. **Solution**: Implement a simple Reference Counting (Rc) model for Pumpkin values in Rust. |
| **Regressions** | Rust behaves differently than JS math. **Solution**: Extensive compliance test suite (Smoke Tests) must pass on both engines. |

## "Do Not" Rules for v0.1

To ensure this migration is possible later, **STOP** doing the following immediately:

1. ❌ **Don't use JavaScript's `eval()`** or `Function()` constructor. Rust cannot do this.
2. ❌ **Don't expose internal class methods** to users. All user interaction must go through defined AST nodes or Stdlib calls.
3. ❌ **Don't rely on JS prototype modification.** Pumpkin objects should be simple Maps/HashMaps, not JS classes.
4. ❌ **Don't bundle heavy node_modules** into the core logic. Keep the core pure logic.

## Why Rust?

1. **Speed**: Tree-walking in Rust is 10-100x faster than JS.
2. **Safety**: No more `undefined is not a function` definition-level crashes.
3. **WASM**: Runs in the browser at near-native speed, enabling a high-performance web playground.
