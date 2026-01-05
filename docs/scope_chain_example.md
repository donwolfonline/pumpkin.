# Pumpkin Scope Chain Rules 🕸️

Variables in Pumpkin are **block-scoped**. This means each `{ ... }` block creates a new Environment that inherits from its parent.

## 1. Scope Chain Visualization

```rust
// [Global Scope] (x=10)
let x = 10 
{
    // [Inner Scope A] (parent=Global)
    show x  // -> 10 (finds in Global)
    let y = 20
    {
        // [Inner Scope B] (parent=Inner Scope A)
        let x = 99 // Shadowing
        show x // -> 99 (finds locally)
        show y // -> 20 (finds in parent)
    }
    show x // -> 10 (Inner Scope B x is gone)
}
// show y -> Error (y is in Inner Scope A, which is closed)
```

## 2. Rules

### 2.1 Definition (`let`)

`define(name, val)` always inserts into the **Current Scope**.

* This allows shadowing global variables.

### 2.2 Assignment (`=`)

`assign(name, val)` walks **Up the Scope Chain**.

1. Check Current Scope. If found, update.
2. If not, check Parent Scope.
3. Repeat until Global.
4. If never found -> `UndefinedVariable` Error.

## 3. Rust Implementation (`Environment`)

Each environment holds:

1. `vars`: A Map of local variables.
2. `parent`: An optional pointer (`Rc<Environment>`) to the outer scope.

This structure allows efficient lookups (`O(depth)`) and cheap cloning of scope handles (via `Rc`).
