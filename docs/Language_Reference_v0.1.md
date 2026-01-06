# Pumpkin Language Reference (v0.1)

This document describes the syntax and features of the Pumpkin programming language.

## 1. Program Structure

A Pumpkin program consists of a sequence of statements. Statements are executed one after another from top to bottom.

```pumpkin
show "Start"
let x = 10
show x
```

## 2. Comments

Comments are lines that are ignored by the computer. They are used to explain code to humans.
Use the `#` symbol to start a comment.

```pumpkin
# This is a comment
let x = 1 # Inline comments work too
```

## 3. Variables

Variables are named containers for storing data.
Use the `let` keyword to create a new variable.

```pumpkin
let name = "Pumpkin"
let age = 1
```

To update a variable, simply use the `=` operator without `let`.

```pumpkin
let score = 0
score = score + 1
```

## 4. Types

Pumpkin supports three core primitive types:

### Number

Represents both integers and decimals.

```pumpkin
let count = 42
let price = 12.99
```

### String

Text enclosed in double quotes.

```pumpkin
let message = "Hello World"
```

### Boolean

Represents true or false logic.

```pumpkin
let is_valid = true
let is_done = false
```

## 5. Expressions

Expressions return a value. You can group them with parentheses `()`.

```pumpkin
let result = (10 + 5) * 2
```

## 6. Math Operators

Standard mathematical operations are supported:

| Operator | Description | Example |
|----------|-------------|---------|
| `+`      | Add         | `1 + 1` |
| `-`      | Subtract    | `10 - 5`|
| `*`      | Multiply    | `3 * 4` |
| `/`      | Divide      | `20 / 2`|
| `%`      | Modulo      | `10 % 3`|
| `^`      | Power       | `2 ^ 3` |

## 7. Logical Operators

Use English keywords for logic, not symbols.

| Operator | Description | Example |
|----------|-------------|---------|
| `and`    | Both must be true | `true and false` |
| `or`     | One must be true | `true or false` |
| `not`    | Invert value | `not true` |

**Comparisons:**
`==`, `!=`, `<`, `>`, `<=`, `>=`.

```pumpkin
if age >= 18 and has_ticket {
    show "Welcome"
}
```

## 8. Conditionals

Use `if` and `else` to run code based on conditions. The code block must be inside `{ }`.

```pumpkin
let score = 85

if score > 90 {
    show "Excellent"
} else {
    show "Good job"
}
```

## 9. Loops

### While Loop

Runs a block of code while a condition is true.

```pumpkin
let i = 0
while i < 5 {
    show i
    i = i + 1
}
```

### Repeat Loop

Runs a block of code a specific number of times.

```pumpkin
repeat 3 times {
    show "Hip Hip Hooray!"
}
```

## 10. Output

Use `show` to print values to the console/output.

```pumpkin
show "Hello World"
show 10 * 10
```
