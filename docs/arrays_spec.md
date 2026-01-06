# Arrays/Lists Spec (v0.3)

> **Status:** Authoritative
> **Target:** v0.3 Release
> **Constraints:** Single-dimensional, no slicing.

## 1. Syntax

### 1.1. Literal

Square brackets with comma-separated expressions. Trailing commas allowed.

```pumpkin
let numbers = [1, 2, 3]
let mixed = [1, "two", true]
let empty = []
```

### 1.2. Access (Indexing)

Zero-based indexing using square brackets.

```pumpkin
let first = numbers[0]
let last = numbers[2]
```

### 1.3. Mutation (Assignment)

**Requires Grammar Update:** The grammar `Reassignment` rule must be extended to allow member expressions (e.g. `arr[0]`) on the left-hand side.

```pumpkin
numbers[0] = 99
```

### 1.4. Length

Accessed via the `.length` property (syntactic sugar or intrinsic).

```pumpkin
show numbers.length # Prints 3
```

## 2. Semantics

### 2.1. Reference Semantics

Lists are **reference types**.

```pumpkin
let a = [1]
let b = a
b[0] = 2
show a[0] # Prints 2
```

### 2.2. Bounds Checking

* **Access Out of Bounds:** Throws **Runtime Error**. (e.g., index -1 or >= length).
* **Assignment Out of Bounds:** Throws **Runtime Error**. You cannot expand an array by assigning to a new index (no sparse arrays in v0.3).

### 2.3. Methods (Intrinsic)

We will support a minimal set of methods via intrinsic handling in `CallExpr` or `MemberProp`:

* `push(val)`: Appends value to end.
* `pop()`: Removes and returns last value.

## 3. Implementation Plan (v0.3)

1. **Grammar:** Update `Reassignment` to support `Primary "[" Exp "]" "=" Exp`.
2. **AST:** Update `AssignStmt` to take a `target` (L-Value expression) instead of just `Identifier`.
3. **Interpreter:**
    * Implement `ArrayLiteral` evaluation.
    * Implement index operator `eval_expr` logic.
    * Implement `assign` logic for indices.

## 4. Edge Cases

| Case | Result |
| :--- | :--- |
| `[1, 2][10]` | **Runtime Error:** Index out of bounds. |
| `[1, 2][-1]` | **Runtime Error:** Index out of bounds. |
| `list.length = 0` | **Runtime Error:** `.length` is read-only. |
| `list["string"]` | **Runtime Error:** Index must be a number. |
