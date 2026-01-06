# Pumpkin Type System Specification (v0.3)

## 1. Overview

Pumpkin implements a **gradual type system** with optional runtime type checking. Types are annotations that provide safety guarantees without requiring all code to be typed.

### Core Principles

- **Optional**: Types are never required
- **Runtime**: Type checks execute during program execution
- **Explicit**: No automatic type inference
- **Friendly**: Clear error messages for type violations

## 2. Supported Types

| Type | Description | Example Values |
|------|-------------|----------------|
| `number` | Numeric values (integers and floats) | `42`, `3.14`, `-7` |
| `string` | Text values | `"hello"`, `"world"` |
| `boolean` | Truth values | `true`, `false` |
| `array` | Lists of any values | `[1, 2, 3]`, `["a", "b"]` |

## 3. Type Annotation Syntax

### Variable Declarations

```pumpkin
let identifier: Type = Expression
```

**Examples:**

```pumpkin
let age: number = 25
let name: string = "Alice"
let active: boolean = true
let items: array = [1, 2, 3]
```

### Function Parameters

```pumpkin
function name(param: Type, param2: Type) {
    # body
}
```

**Example:**

```pumpkin
function greet(name: string, age: number) {
    show "Hello"
    show name
}
```

### Function Return Types

```pumpkin
function name(params): Type {
    return expression
}
```

**Example:**

```pumpkin
function add(a: number, b: number): number {
    return a + b
}
```

## 4. Type Checking Rules

### Rule 1: Variable Assignment

When assigning to a typed variable, the value must match the declared type.

```pumpkin
let x: number = 10  # OK
x = 20              # OK: 20 is a number
x = "hello"         # ERROR: Expected number, got string
```

### Rule 2: Function Arguments

When calling a function with typed parameters, arguments must match parameter types.

```pumpkin
function process(data: string) {
    show data
}

process("hello")    # OK
process(42)         # ERROR: Expected string, got number
```

### Rule 3: Function Return

When a function declares a return type, the returned value must match.

```pumpkin
function get_age(): number {
    return 25       # OK
}

function broken(): number {
    return "old"    # ERROR: Expected number, got string
}
```

### Rule 4: Untyped Variables

Variables without type annotations accept any value.

```pumpkin
let x = 10          # No type annotation
x = "hello"         # OK: untyped variables can change type
x = true            # OK
```

## 5. Type Compatibility

### Exact Match Required

Pumpkin uses **exact type matching**. No automatic conversions.

```pumpkin
let x: number = 10
let y: string = "10"

# These are NOT compatible
x = y  # ERROR: string is not compatible with number
```

### Array Elements

In v0.3, array element types are not checked.

```pumpkin
let items: array = [1, "two", true]  # OK: mixed types allowed
```

## 6. Error Messages

Type errors include:

- **Expected type**
- **Actual type**
- **Source location**
- **Contextual hint**

**Example:**

```
Runtime Error at line 5:
  Type mismatch: variable 'age' expects number, got string
  
  5 | age = "twenty"
      ^^^^^^^^^^

Hint: 'age' was declared with type 'number' on line 3
```

## 7. Scope Rules

Type annotations are bound to variable names within their scope:

```pumpkin
let x: number = 10

function test() {
    # 'x' is still typed as number here
    x = 20          # OK
    x = "error"     # ERROR: x is number globally
}
```

## 8. Type Erasure

Type information is used only for runtime checks and error messages. It does not affect:

- Memory layout
- Performance (minimal overhead)
- Serialization

## 9. Migration Path

Existing untyped code requires no changes:

```pumpkin
# Before (v0.2): All code untyped
let x = 10
let y = 20
show x + y

# After (v0.3): Gradually add types
let x: number = 10
let y: number = 20
show x + y
```

## 10. Limitations (v0.3)

The following are **not supported**:

❌ **Type Inference**

```pumpkin
let x: number = 10
let y = x + 5  # 'y' is still untyped, not inferred as number
```

❌ **Union Types**

```pumpkin
let x: number | string = 10  # Not supported
```

❌ **Generic Types**

```pumpkin
let items: array<number> = [1, 2, 3]  # Not supported
```

❌ **Compile-time Type Checking**
All type errors are detected at **runtime**, not during compilation.

## 11. Future Roadmap

**v0.4** (Exploration):

- Optional static type analysis (warnings, not errors)
- Type inference for simple cases

**v1.0**:

- Generic array types: `array<T>`
- Union types: `number | string`
- Structural typing for objects
