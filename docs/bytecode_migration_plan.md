# Bytecode Migration Plan (AST Interpreter => Bytecode VM)

> **Goal:** Transition Pumpkin execution from tree-walking `interpreter.rs` to stack-machine `vm.rs` without breaking changes.
> **Strategy:** Incremental implementation with side-by-side validation.

## 1. The New Pipeline

```mermaid
graph LR
    Source -->|Ohm Parser| AST
    AST -->|Compiler (New)| Chunk[Bytecode Chunk]
    Chunk -->|VM (New)| Result
```

## 2. Logic Redistribution

The responsibility of language semantics moves from runtime evaluation to compile-time analysis and runtime instructions.

| Feature | Old (AST Interpreter) | New (Compiler + VM) |
| :--- | :--- | :--- |
| **Arithmetic** | Recursive `eval_expr` | Compiler emits `ADD`/`SUB`; VM executes op. |
| **Control Flow** | Recursive `exec_block` | Compiler flattens to `JMP`/`JMP_FALSE` offsets. |
| **Variables** | `Environment` (HashMap) lookup at runtime | Compiler resolves to **Stack Indices** (Locals) or Global Consts. |
| **Functions** | `CallExpr` creates new Env | `CALL` opcode pushes Frame; Args are already on stack. |

## 3. Compatibility & Test Strategy (The "Dual-Run" Harness)

To ensure zero regressions, we will implement a "Dual-Run" mode in the test runner.

1. **Parse** source to AST.
2. **Run A:** Pass AST to `interpreter::evaluate()`. Capture Result A.
3. **Run B:** Pass AST to `compiler::compile()` -> `vm::run()`. Capture Result B.
4. **Compare:** Assert `Result A == Result B`.

*Note: This works for deterministic outputs. I/O (print) will need output buffering to compare.*

## 4. Migration Phases

### Phase 1: Foundations (✅ Done)

* Define `OpCode`, `Chunk`.
* Basic VM Loop (`vm.rs`).
* Basic Compiler (`compiler.rs`) for literals/arithmetic.

### Phase 2: Expressions & simple Statements

* Implement `LetDecl` (Global only initially).
* Implement `ShowStmt`.
* Goal: Run `let x = 1 + 2; show x`.

### Phase 3: Control Flow (Jumps)

* Implement `IfStmt` compilation (patching jump offsets).
* Implement `Loop`/`While` compilation.
* Goal: Run loops and conditionals.

### Phase 4: Local Variables (The Hardest Part)

* **Compiler:** Implement a `Scope` tracker. Map identifier names to stack slot indices (0, 1, 2...).
* **Compiler:** Handle block scoping (pop locals after block).
* **VM:** Implement `GET_LOCAL` / `SET_LOCAL` using relative stack offsets.

### Phase 5: Functions

* Implement `FuncDecl`: Compile body to a separate Chunk (or specialized function object).
* Implement `CallExpr`: `CALL` opcode.
* VM: Call Frames logic.

### Phase 6: Switchover

* Update `lib.rs` default `execute` to use VM.
* Deprecate (but keep) AST Interpreter for reference/tooling.

## 5. Risk Analysis & Pitfalls

### Pitfall: Short-Circuiting Drift

* **Risk:** `and`/`or` logic is subtle. If Compiler blindly emits code for both sides without jumps, side effects happen eagerly.
* **Mitigation:** Ensure `and`/`or` compile to Conditional Jumps (`JMP_FALSE`), not just binary ops.

### Pitfall: Variable Resolution

* **Risk:** Shadowing behavior differs between HashMap (dynamic) and Stack Index (static).
* **Mitigation:** Compiler must strictly simulate the scope stack to resolve the correct "most recent" variable index.

### Pitfall: Debugging

* **Risk:** `vm.rs` stack traces are raw numbers, hard to read.
* **Mitigation:** Invest early in the `disassemble` view and `TraceHook` to print human-readable execution steps.
