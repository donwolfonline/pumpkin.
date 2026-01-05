# Pumpkin Language Specification v0.1 🎃

**Version:** 0.1.0-alpha
**Status:** Implementing
**Date:** 2026-01-05

## 1. Introduction

Pumpkin is a friendly, interpreted programming language designed for beginners. It prioritizes readability, helpful error messages, and a "batteries-included" experience over raw performance or complex abstractions.

### 1.1 Goals

* **Beginner-First:** Syntax that reads like English.
* **Safe:** No undefined behavior or segmentation faults.
* **Helpful:** Errors explain *why* and *how to fix*.

---

## 2. Syntax & Grammar

Pumpkin uses a C-family style syntax with mandatory braces `{}` for blocks and optional semicolons.

### 2.1 Comments

* **Line Comment:** `# This is a comment`

### 2.2 Keywords

`let` `if` `else` `while` `return` `function` `show` `ask` `into` `true` `false` `not` `or` `and`

---

## 3. Data Types

Pumpkin is dynamically typed. The following primitive types exist:

| Type | Example | Description |
| :--- | :--- | :--- |
| **Number** | `42`, `3.14` | 64-bit floating point (JS Double). |
| **String** | `"Hello"` | UTF-8 text literal. Strict double quotes. |
| **Boolean** | `true` | Logical true/false. |
| **Function** | `greet` | First-class function value. |
| **List** | `[1, 2, 3]` | Ordered list of values (0-indexed). |
| **Object** | `{ name: "P" }` | Key-value dictionary. |

*Note: `null` or `undefined` are not explicitly exposable in v0.1 Syntax but exist internally.*

---

## 4. Variables

Variables are block-scoped and declared with `let`.

```python
let x = 10
x = 20      # Reassignment
# let x = 30 # Error: Variable 'x' already declared in this scope
```

Shadowing is allowed in nested blocks.

---

## 5. Control Flow

### 5.1 If / Else

Braces `{}` are mandatory. Parentheses `()` around condition are optional.

```python
if score > 100 {
    show "Win!"
} else {
    show "Try again"
}
```

### 5.2 While Loop

Runs while the condition is true.

```python
while x > 0 {
    x = x - 1
}
```

### 5.3 Repeat Loop (Syntactic Sugar)

Simplified syntax for counting loops.

```python
repeat 5 times {
    show "Hello"
}
```

---

## 6. Functions

Functions are first-class values defined with `function`.

```python
function add(a, b) {
    return a + b
}
```

### 6.1 Scope

Functions capture their definition environment (Lexical Scoping / Closures).

### 6.2 Return

`return value` exits the function immediately. If no return statement is reached, it returns `null` (internal).

---

## 7. Operators

### 7.1 Arithmetic

`+` (Add/Concat), `-`, `*`, `/`, `%` (Modulo), `^` (Power)

### 7.2 Comparison

`==`, `!=`, `<`, `>`, `<=`, `>=`

### 7.3 Logic

`and`, `or`, `not` (English keywords, lower precedence than comparison).

---

## 8. Built-in Statements (I/O)

### 8.1 Show

Prints a value to the standard output.
`show "Hello"`

### 8.2 Ask

Prompts the user for input.
`ask "What is your name?" into name`

---

## 9. Standard Library (Module System)

Pumpkin v0.1 provides global namespaces for standard utilities. No `import` is required.

### 9.1 Math

* `Math.sin(x)`, `Math.cos(x)`, `Math.PI`, `Math.round(x)` ...

### 9.2 Text

* `Text.upper(str)`, `Text.lower(str)`, `Text.len(str)` ...

### 9.3 Time

* `Time.now()`, `Time.sleep(ms)` ...

---

## 10. Execution Model (Undefined Behavior)

### 10.1 Order of Evaluation

Expressions are evaluated left-to-right.

### 10.2 Recursion

Recursion is allowed. Stack depth is limited by the host JavaScript engine. Stack overflow results in a generic Runtime Error.

### 10.3 Typing

Operations on mismatched types (e.g., `10 - "hello"`) result in a `TypeMismatchError` at runtime. Implicit coercion happens only for String concatenation (`"Age: " + 10`).

---

## 11. File Structure

Pumpkin source files use the `.pumpkin` extension.
The entry point is executed top-to-bottom.
