# Pumpkin Language Semantics

This document describes the runtime behavior, scope rules, and evaluation model of Pumpkin v0.2.

## 1. Execution Model

Pumpkin Programs are compiled into **Bytecode** which is executed by a Stack-Based Virtual Machine.

### Evaluation Order

* **Left-to-Right**: Expressions are strictly evaluated from left to right.
* **Arguments**: Function arguments are evaluated before the function call (Eager evaluation).
* **Short-Circuiting**: Logical `and` / `or` operators short-circuit.
  * `false and crash()`: `crash()` is never executed.
  * `true or crash()`: `crash()` is never executed.

### Stack Machine

Operations push and pop values from an operand stack.
Example: `1 + 2 * 3`

1. Push `1`
2. Push `2`
3. Push `3`
4. Op `Mul` (pops 2, 3 -> pushes 6)
5. Op `Add` (pops 1, 6 -> pushes 7)

## 2. Variable Scope

Pumpkin uses **Lexical Scoping** with two distinct storage areas:

### Global Scope

* Variables declared with `let` at the top level are **Global**.
* They stick around for the lifetime of the program.
* In the Module System, "Globals" are private to the module unless exported.

### Local Scope (Functions)

* Variables declared inside a function (including parameters) are **Local**.
* They exist only while the function is running.
* Each function call creates a new **Call Frame** with its own set of locals.
* Locals are effectively "Block Scoped" within the function body (compiler restriction currently treats function body as the main scope, deeper blocks share this frame).

## 3. Truthiness

Conditionals (`if`, `while`) check if a value is "Truthy".

* **Falsy Values:**
  * `false` (boolean)
  * `nil` (null)
* **Truthy Values:**
  * Everything else.
  * `true`, `0`, `""` (Empty string), `[]` (Empty list) are all **Truthy**.

## 4. Error Handling

Pumpkin is designed to be safe. It halts execution immediately upon encountering a critical error ("Panic-free" host guarantees).

### Runtime Errors

The VM will stop and report an error for:

1. **Type Mismatches**: e.g., `1 + "hello"`.
2. **Undefined Variables**: Accessing a variable that hasn't been declared.
3. **Division by Zero**.
4. **Stack Overflow**: Recursion depth limit (currently 64 frames) exceeded.
5. **Index Out of Bounds**: Accessing `arr[10]` when size is 5.
6. **Arity Mismatch**: Calling a function with the wrong number of arguments.

### Syntax Errors

These are caught **before** execution starts during the compilation phase.

## 5. Runtime Guarantees

* **Memory Safety**: The VM is implemented in Rust. Buffer overflows or use-after-free bugs are structurally prevented in the host.
* **Sandboxing**: The core VM has no access to the file system or network. I/O is performed only via explicit host bindings (standard library mappings).
* **Determinism**: Given the same input, a Pumpkin program will always produce the same output (assuming the host environment is deterministic).
