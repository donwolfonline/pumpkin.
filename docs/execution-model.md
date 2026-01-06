# Pumpkin Execution Model

> **Status:** Authoritative
> **Version:** 1.0 (Draft)
> **Audience:** Language Implementers, Compiler Contributors

This document defines the formal execution semantics of the Pumpkin programming language. It serves as the source of truth for the behavior of the interpreter and any future compilation targets.

## 1. Program Lifecycle

The execution of a Pumpkin program follows a strict three-phase synchronous lifecycle:

### Phase 1: Parsing (Source → AST)

* **Input:** UTF-8 encoded source string.
* **Action:** The source is parsed using the official Ohm grammar.
* **Outcome:**
  * **Success:** A complete, structural Abstract Syntax Tree (AST) rooted at a `Program` node.
  * **Failure:** A `SyntaxError` is raised immediately. No execution occurs.
* **Note:** Parsing is atomic. Partial or malformed programs are rejected entirely.

### Phase 2: Static Analysis (AST → Validated AST)

* *Currently minimal (v1.0).*
* Future passes may include type checking or linter validation before execution begins.

### Phase 3: Runtime Execution (AST → Side Effects)

* **Input:** Validated AST.
* **Action:** The runtime traverses the AST depth-first, executing statements and evaluating expressions.
* **Outcome:** Side effects (e.g., `show` output) and a final execution result.

---

## 2. Statement vs Expression Model

Pumpkin enforces a strict distinction between **Statements** (actions) and **Expressions** (values).

### Statements

* **Definition:** Syntactic units that perform actions or control flow. They do **not** return a value.
* **Examples:** `let`, `show`, `if`, `while`, `return`.
* **Constraint:** A statement cannot be used where an expression is expected (e.g., `let x = (if true { 1 })` is invalid).

### Expressions

* **Definition:** Syntactic units that evaluate to a `PumpkinValue`.
* **Examples:** Literals (`5`, `"hello"`), binary operations (`3 + 4`), function calls (`my_func()`), identifiers (`x`).
* **Constraint:** An expression can be promoted to a `Statement` (Expression Statement), primarily for function calls with side effects.

---

## 3. Evaluation Order

### 3.1. Block Execution

* Statements within a `Block` are executed strictly **sequentially** from top to bottom.
* Execution stops immediately if:
  * A `ReturnStmt` is encountered.
  * A runtime error is raised.

### 3.2. Expression Evaluation

* **Binary Operators:** Evaluated **Left-to-Right**.
  * In `A + B`, `A` is evaluated first, then `B`.
* **Function Arguments:** Evaluated **Left-to-Right** before the function body is entered.
* **Short-Circuiting:**
  * `and`: If LHS is falsy, RHS is not evaluated.
  * `or`: If LHS is truthy, RHS is not evaluated.

---

## 4. Variable Lifetime and Scope

Pumpkin utilizes **Lexical Scoping** with **Block Visibility**.

### 4.1. Definition

* Variables defined with `let` are visible only within the block `{ ... }` in which they are declared, and any nested child blocks.

### 4.2. Shadowing

* Inner scopes can declare a variable with the same name as an outer scope variable.
* Inside the inner scope, the inner variable shadows (hides) the outer one.
* Once the inner scope exits, the outer variable becomes visible again.

### 4.3. Hoisting

* Pumpkin allows **Functional Hoisting** (Functions can be called before they are defined in the source text), but **Variables are NOT hoisted**.
* Accessing a variable before its `let` statement results in an `UndefinedVariableError`.

---

## 5. Error Propagation

Errors in Pumpkin are **Panic-based** (in the host sense) or **Result-bubbling** (in the implementation sense), stopping execution immediately. There is no `try/catch` mechanism exposed to the user in v1.0.

### 5.1. Syntax Errors

* Occur during Phase 1.
* Halt the entire program before any code runs.

### 5.2. Runtime Errors

* Occur during Phase 3.
* Examples: Division by zero, Type mismatch, Undefined variable.
* **Behavior:** Immediate termination of the `execute()` call. The execution engine returns an `Error` result containing the line number and message. Stack unwinding occurs within the interpreter implementation.

---

## 6. Determinism Guarantees

Pumpkin v1.0 is designed to be **Deterministic**.

* **Rule:** Given the same initial `Environment` and the same source code, the execution sequence and output must be identical every single time.
* **Concurrency:** Pumpkin is single-threaded. There are no race conditions.
* **Randomness:** Currently no built-in RNG (unless added to stdlib). If added, determinism relies on seeding.

---

## 7. Memory Model (Abstract)

* **Values:** All primitive values (numbers, booleans) are passed by **Copy**.
* **Objects/Strings:** Conceptually passed by **Ref** (immutable strings in v1.0) or **Copy** depending on optimization, but behave mostly as immutable values to the user.
* **Mutation:** Only occurs via explicit reassignment (`x = 5`). Scopes manage the "stack" of active variables. When a scope closes, its local variables are dropped (freed).
