# Pumpkin Standard Library API Reference (v0.3)

## Design Principles

1. **Pure Functions**: No side effects, same input always produces same output
2. **Predictable**: Deterministic behavior, no randomness
3. **Educational**: Clear names, simple implementations
4. **Safe**: Well-defined error behavior

---

## 1. Math Module

Functions for numerical operations.

### `math.abs(n: number): number`

Returns the absolute value of a number.

**Behavior:**

- Positive numbers return unchanged
- Negative numbers return positive equivalent
- Zero returns zero

**Examples:**

```pumpkin
math.abs(-5)   # 5
math.abs(3.14) # 3.14
math.abs(0)    # 0
```

**Errors:** Type error if `n` is not a number.

---

### `math.floor(n: number): number`

Returns the largest integer less than or equal to `n`.

**Examples:**

```pumpkin
math.floor(4.9)   # 4
math.floor(-2.1)  # -3
math.floor(7)     # 7
```

---

### `math.ceil(n: number): number`

Returns the smallest integer greater than or equal to `n`.

**Examples:**

```pumpkin
math.ceil(4.1)   # 5
math.ceil(-2.9)  # -2
math.ceil(7)     # 7
```

---

### `math.round(n: number): number`

Rounds to the nearest integer. Halfway cases round away from zero.

**Examples:**

```pumpkin
math.round(4.5)   # 5
math.round(4.4)   # 4
math.round(-2.5)  # -3
```

---

### `math.sqrt(n: number): number`

Returns the square root of `n`.

**Examples:**

```pumpkin
math.sqrt(16)  # 4
math.sqrt(2)   # 1.414...
```

**Errors:** Runtime error if `n < 0`.

---

### `math.pow(base: number, exp: number): number`

Returns `base` raised to the power `exp`.

**Examples:**

```pumpkin
math.pow(2, 3)    # 8
math.pow(10, -2)  # 0.01
```

---

### `math.min(a: number, b: number): number`

Returns the smaller of two numbers.

**Examples:**

```pumpkin
math.min(5, 10)   # 5
math.min(-3, -1)  # -3
```

---

### `math.max(a: number, b: number): number`

Returns the larger of two numbers.

**Examples:**

```pumpkin
math.max(5, 10)   # 10
math.max(-3, -1)  # -1
```

---

### `math.clamp(n: number, min: number, max: number): number`

Restricts `n` to the range `[min, max]`.

**Examples:**

```pumpkin
math.clamp(5, 0, 10)   # 5
math.clamp(-5, 0, 10)  # 0
math.clamp(15, 0, 10)  # 10
```

**Errors:** Runtime error if `min > max`.

---

## 2. String Module

Functions for text manipulation.

### `string.length(s: string): number`

Returns the number of characters in the string.

**Examples:**

```pumpkin
string.length("hello")  # 5
string.length("")       # 0
```

---

### `string.upper(s: string): string`

Converts all letters to uppercase.

**Examples:**

```pumpkin
string.upper("hello")  # "HELLO"
string.upper("Hi!")    # "HI!"
```

---

### `string.lower(s: string): string`

Converts all letters to lowercase.

**Examples:**

```pumpkin
string.lower("HELLO")  # "hello"
string.lower("Hi!")    # "hi!"
```

---

### `string.trim(s: string): string`

Removes whitespace from both ends.

**Examples:**

```pumpkin
string.trim("  hello  ")  # "hello"
string.trim("world")      # "world"
```

---

### `string.substring(s: string, start: number, end: number): string`

Extracts characters from index `start` (inclusive) to `end` (exclusive).

**Examples:**

```pumpkin
string.substring("hello", 1, 4)  # "ell"
string.substring("world", 0, 2)  # "wo"
```

**Errors:**

- Runtime error if `start < 0` or `end > length`
- Runtime error if `start > end`

---

### `string.at(s: string, index: number): string`

Returns the character at the given index.

**Examples:**

```pumpkin
string.at("hello", 0)  # "h"
string.at("hello", 4)  # "o"
```

**Errors:** Runtime error if index out of bounds.

---

### `string.concat(a: string, b: string): string`

Concatenates two strings.

**Examples:**

```pumpkin
string.concat("hello", " world")  # "hello world"
```

---

### `string.contains(haystack: string, needle: string): boolean`

Returns `true` if `haystack` contains `needle`.

**Examples:**

```pumpkin
string.contains("hello world", "world")  # true
string.contains("hello", "bye")          # false
```

---

### `string.starts_with(s: string, prefix: string): boolean`

Returns `true` if `s` starts with `prefix`.

**Examples:**

```pumpkin
string.starts_with("hello", "he")  # true
string.starts_with("hello", "lo")  # false
```

---

### `string.ends_with(s: string, suffix: string): boolean`

Returns `true` if `s` ends with `suffix`.

**Examples:**

```pumpkin
string.ends_with("hello", "lo")  # true
string.ends_with("hello", "he")  # false
```

---

## 3. Array Module

Functions for list manipulation.

### `array.length(arr: array): number`

Returns the number of elements.

**Examples:**

```pumpkin
array.length([1, 2, 3])  # 3
array.length([])         # 0
```

---

### `array.push(arr: array, value: any): array`

Returns a new array with `value` added to the end.

**Examples:**

```pumpkin
array.push([1, 2], 3)  # [1, 2, 3]
```

**Note:** Original array is unchanged (pure function).

---

### `array.pop(arr: array): array`

Returns a new array with the last element removed.

**Examples:**

```pumpkin
array.pop([1, 2, 3])  # [1, 2]
```

**Errors:** Runtime error if array is empty.

---

### `array.get(arr: array, index: number): any`

Returns the element at the given index.

**Examples:**

```pumpkin
array.get([10, 20, 30], 1)  # 20
```

**Errors:** Runtime error if index out of bounds.

---

### `array.slice(arr: array, start: number, end: number): array`

Returns a new array from index `start` to `end` (exclusive).

**Examples:**

```pumpkin
array.slice([1, 2, 3, 4], 1, 3)  # [2, 3]
```

---

### `array.concat(a: array, b: array): array`

Returns a new array with elements from both arrays.

**Examples:**

```pumpkin
array.concat([1, 2], [3, 4])  # [1, 2, 3, 4]
```

---

### `array.reverse(arr: array): array`

Returns a new array with elements in reverse order.

**Examples:**

```pumpkin
array.reverse([1, 2, 3])  # [3, 2, 1]
```

---

### `array.contains(arr: array, value: any): boolean`

Returns `true` if `value` is in the array.

**Examples:**

```pumpkin
array.contains([1, 2, 3], 2)  # true
array.contains([1, 2, 3], 5)  # false
```

---

### `array.index_of(arr: array, value: any): number`

Returns the first index of `value`, or `-1` if not found.

**Examples:**

```pumpkin
array.index_of([10, 20, 30], 20)  # 1
array.index_of([10, 20, 30], 99)  # -1
```

---

## 4. Logic Module

Utility functions for control flow and validation.

### `logic.is_number(value: any): boolean`

Returns `true` if value is a number.

**Examples:**

```pumpkin
logic.is_number(42)      # true
logic.is_number("text")  # false
```

---

### `logic.is_string(value: any): boolean`

Returns `true` if value is a string.

---

### `logic.is_boolean(value: any): boolean`

Returns `true` if value is a boolean.

---

### `logic.is_array(value: any): boolean`

Returns `true` if value is an array.

---

### `logic.is_null(value: any): boolean`

Returns `true` if value is `nil`.

---

### `logic.equals(a: any, b: any): boolean`

Deep equality check for values.

**Examples:**

```pumpkin
logic.equals([1, 2], [1, 2])  # true
logic.equals("hi", "hi")       # true
```

---

## Implementation Strategy

### Approach: Native VM Functions

Implement stdlib functions as **native VM functions** (Rust implementations) rather than Pumpkin code.

**Benefits:**

- Performance: No interpretation overhead
- Safety: Type checking in Rust
- Reliability: Well-tested implementations

**Mechanism:**

1. Add `NativeFunction` variant to `PumpkinValue`
2. Register stdlib functions in global environment at VM startup
3. Call Rust implementations directly from VM

**Example Registration:**

```rust
// In VM initialization
globals.define("math.abs", PumpkinValue::NativeFunction(math_abs));
globals.define("string.upper", PumpkinValue::NativeFunction(string_upper));
```

**Example Implementation:**

```rust
fn math_abs(args: &[PumpkinValue]) -> Result<PumpkinValue, PumpkinError> {
    if args.len() != 1 {
        return Err(PumpkinError::runtime("math.abs expects 1 argument"));
    }
    match &args[0] {
        PumpkinValue::Number(n) => Ok(PumpkinValue::Number(n.abs())),
        _ => Err(PumpkinError::runtime("math.abs expects a number")),
    }
}
```

---

## Usage Examples

### Example 1: Math Operations

```pumpkin
let radius = 5
let area = math.pow(radius, 2) * 3.14159
show "Area:"
show math.round(area)  # 79
```

### Example 2: String Processing

```pumpkin
let input = "  Hello World  "
let clean = string.trim(input)
let upper = string.upper(clean)
show upper  # "HELLO WORLD"
```

### Example 3: Array Manipulation

```pumpkin
let numbers = [5, 2, 8, 1, 9]
let sorted_desc = array.reverse(numbers)
let first_three = array.slice(sorted_desc, 0, 3)
show first_three  # [9, 8, 5]
```

### Example 4: Type Checking

```pumpkin
let value = 42

if logic.is_number(value) {
    show "It's a number!"
    show math.abs(value)
}
```
