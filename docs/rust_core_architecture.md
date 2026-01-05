# Rust Core Architecture 🦀

**Crate Name:** `pumpkin_core`
**Goal:** A high-performance, deterministic interpreter for Pumpkin ASTs, compile-able to WASM.

## 1. Principles

1. **Pure Execution:** The core does NOT know how to parse text. It only consumes JSON AST.
2. **Environment as State:** The entire state of a program is encapsulated in an `Environment` struct, which can be serialized/inspected.
3. **WASM First:** From day one, specific bindings (`#[wasm_bindgen]`) are exposed to run in the browser.

## 2. Crate Structure

```text
pumpkin_core/
├── Cargo.toml          # Dependencies: serde, serde_json, wasm-bindgen
└── src/
    ├── lib.rs          # Entry point (WASM bindings)
    ├── ast.rs          # AST definitions (Mirror of src/ast/nodes.ts)
    ├── env.rs          # Scoping and Variable storage
    ├── interpreter.rs  # The Tree Walker logic
    ├── value.rs        # The Pumpkin Value Enum
    ├── stdlib.rs       # Standard Library Native implementations
    └── errors.rs       # Error types
```

## 3. Data Types (`value.rs`)

We use an Enum to represent all runtime values. RC (Reference Counting) is used for complex types to allow shared ownership (like closures).

```rust
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Clone, Debug, PartialEq)]
pub enum PumpkinValue {
    Number(f64),
    String(String),
    Boolean(bool),
    Null,
    Function(Rc<Function>), // References AST node + Closure Env
    List(Rc<RefCell<Vec<PumpkinValue>>>),
    Object(Rc<RefCell<HashMap<String, PumpkinValue>>>),
}
```

## 4. The Interpreter (`interpreter.rs`)

The `evaluate` function takes an implementation of a `Host` trait (for I/O) to ensure the core remains pure.

```rust
pub trait Host {
    fn show(&self, msg: &str);
    fn ask(&self, prompt: &str) -> String;
}

pub fn evaluate(ast: &Program, env: &mut Environment, host: &dyn Host) -> Result<PumpkinValue, RuntimeError> {
    // Match on AST nodes...
}
```

## 5. WASM Boundary (`lib.rs`)

We expose a class `PumpkinVM` to JavaScript.

```rust
#[wasm_bindgen]
pub struct PumpkinVM {
    env: Environment,
}

#[wasm_bindgen]
impl PumpkinVM {
    pub fn new() -> PumpkinVM { ... }

    pub fn run(&mut self, json_ast: &str) -> Result<JsValue, JsValue> {
        let ast: Program = serde_json::from_str(json_ast)?;
        // Run interpreter...
    }
}
```

## 6. Execution Flow

1. **JS Side:** `Ohm.js` parses source -> `JSON AST`.
2. **Boundary:** JS passes JSON string to `PumpkinVM.run()`.
3. **Rust Side:** Serde deserializes JSON -> `Rust AST` structs.
4. **Loop:** Interpreter walks the tree, modifying the `Environment`.
5. **Output:** Calls back to JS `console.log` (via Host trait) for `show`.

## 7. Migration Checklist

* [ ] Define `ast.rs` matching TypeScript interfaces exactly.
* [ ] Implement `Environment` with `HashMap` and parent pointers.
* [ ] Port `stdlib` math functions to Rust.
