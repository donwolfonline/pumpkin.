# User-Defined Functions Spec (v0.2)

> **Status:** Authoritative
> **Target:** v0.2 Release
> **Constraints:** No closures, no overloading, no default parameters.

## 1. Syntax

Functions are declared using the `function` keyword (or `fun` alias if grammar permits, but `function` is canonical).

```pumpkin
function name(param1, param2) {
    # Body statements
    return value
}
```

### 1.1. Components

* **Keyword:** `function`
* **Identifier:** CamelCase or snake_case name.
* **Parameters:** Comma-separated identifiers. Parentheses `()` are **mandatory** even if empty.
* **Body:** A `{ ... }` block.
* **Return:** Explicit `return` keyword. Implicit return is `null`.

## 2. Evaluation & Scoping

### 2.1. Declaration & Hoisting

* **Hoisting:** Functions are **hoisted** to the top of their enclosing block scope.
* **Visibility:**
  * A function defined in the global scope is visible everywhere.
  * A function defined in a block is visible only within that block (and its children).
* **Constraint (v0.2):** Functions **do not capture** outer variables (no closures). They can read/write global variables, but access to local variables of parent functions (if nested) is undefined/forbidden for v0.2 to simplify the memory model.
  * *Implementation Note:* The interpreter may implement standard lexical scoping for variables, but "Closure Values" (passing a function that holds state) are not supported.

### 2.2. Calling Convention

* **Call by Value:** Expressions passed as arguments are fully evaluated before the function begins.
* **Arity Check:** Strict. Calling `f(1)` when `f` takes 2 arguments is a **Runtime Error**.
* **Recursion:** Supported. Stack depth is limited by the host (WASM stack or explicit counter).

## 3. Return Values

* **Explicit:** `return 10` exits the function immediately with value `10`.
* **Implicit:** Reaching the end of the block returns `null`.
* **Early Return:** Allowed anywhere in the body.

## 4. Edge Cases & Errors

| Case | Result |
| :--- | :--- |
| `function duplicate()` | **Runtime Error** (Redefinition in same scope) or Shadowing (if logical). v0.2: Shadowing allowed. |
| `call_missing_arg(1)` | **Runtime Error:** "Expected 2 arguments, got 1." |
| `call_extra_arg(1, 2, 3)` | **Runtime Error:** "Expected 2 arguments, got 3." |
| `return` (no value) | Returns `null`. |
| Nested Definitions | Allowed, scoped to the block. |

## 5. Examples

### Basic Math

```pumpkin
function add(a, b) {
    return a + b
}

show add(5, 10) # 15
```

### Recursion (Factorial)

```pumpkin
function factorial(n) {
    if n <= 1 {
        return 1
    }
    return n * factorial(n - 1)
}

show factorial(5) # 120
```

### Scope Shadowing

```pumpkin
let msg = "Global"

function test() {
    let msg = "Local"
    show msg
}

test()      # Prints "Local"
show msg    # Prints "Global"
```
