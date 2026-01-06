# Standard Library Design (v0.1)

> **Status:** Authoritative
> **Principles:** Pure, Deterministic, No I/O.
> **Implementation Strategy:** Intrinsic Global Objects or Methods.

## 1. Math Module

Exposed as a global `Math` object.

### Functions

* `Math.abs(n)`: Returns absolute value.
* `Math.ceil(n)`: Rounds up to nearest integer.
* `Math.floor(n)`: Rounds down to nearest integer.
* `Math.round(n)`: Rounds to nearest integer.
* `Math.max(a, b)`: Returns larger of two numbers.
* `Math.min(a, b)`: Returns smaller of two numbers.
* `Math.sqrt(n)`: Square root. Errors on negative input.
* `Math.pow(base, exp)`: Power function.

*Note: `Math.random()` is EXCLUDED to ensure determinism.*

### Examples

```pumpkin
let x = Math.abs(-5)    # 5
let y = Math.max(10, 2) # 10
```

## 2. String Module

Exposed as methods on String values (preferred) or `String` global for utilities.
For v0.1, we define these as **methods** on string primitives for ergonomics.

### Methods

* `.length`: Property (already designed).
* `.toUpper()`: Returns uppercase string.
* `.toLower()`: Returns lowercase string.
* `.contains(sub)`: Returns boolean `true` if substring exists.
* `.startsWith(sub)`: Boolean.
* `.endsWith(sub)`: Boolean.

### Examples

```pumpkin
let s = "Hello"
show s.length        # 5
show s.toUpper()     # "HELLO"
show s.contains("ll") # true
```

## 3. Logic Module

Exposed as a global `Logic` object for helper predicates that go beyond operators.

### Functions

* `Logic.isEven(n)`: Returns true if integer part is even.
* `Logic.isOdd(n)`: Returns true if integer part is odd.
* `Logic.xor(a, b)`: Exclusive OR. `(a or b) and not (a and b)`.
* `Logic.not(a)`: Alias for operator `not`.

### Examples

```pumpkin
show Logic.isEven(4)    # true
show Logic.xor(true, true) # false
```

## 4. Implementation Details

* **Intrinsics:** These functions are not written in Pumpkin; they are implemented in Rust within the interpreter's `eval_expr` logic (specifically handling `CallExpr` checks for `MemberExpr` callees).
* **Purity:** All functions return new values and do not modify arguments (Strings are immutable).
