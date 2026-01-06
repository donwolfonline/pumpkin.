# Pumpkin: Education-First Language Design

## Mission Statement

**Pumpkin is a language where every feature teaches a fundamental computer science concept, and every excluded feature reduces cognitive load.**

---

## 1. Core Teaching Philosophy

### What Makes a Good Teaching Language?

1. **Readability**: Code reads like structured English
2. **Explainability**: Every operation can be traced step-by-step
3. **Predictability**: No hidden behavior or magic
4. **Scalability**: Grows with the learner from day 1 to day 100

### The Beginner → Intermediate Journey

**Week 1** (Day 1-7): Variables, output, simple math  
**Week 2** (Day 8-14): Conditionals, boolean logic  
**Week 3** (Day 15-21): Loops (while, repeat)  
**Week 4** (Day 22-30): Functions, parameters, return  
**Month 2**: Arrays, string manipulation  
**Month 3**: Modules, code organization  
**Month 4+**: Optional types, standard library

---

## 2. Essential Features (MUST EXIST)

These features teach fundamental CS concepts that every programmer needs.

### ✅ Variables & Assignment

**CS Concept**: State management, memory, naming  
**Why Required**: Foundation of all programming

```pumpkin
let age = 25
age = age + 1
```

**Teaches:**

- Variable declaration vs reassignment
- Left-hand side (lvalue) vs right-hand side (rvalue)
- Mutable state

---

### ✅ Conditionals (if/else)

**CS Concept**: Control flow, branching, boolean logic  
**Why Required**: Decision-making is core to algorithms

```pumpkin
if score >= 90 {
    show "A"
} else {
    show "B"
}
```

**Teaches:**

- Boolean expressions
- Code paths
- Nested conditions

---

### ✅ Loops (while, repeat)

**CS Concept**: Iteration, termination conditions  
**Why Required**: Repetition is algorithmic thinking

```pumpkin
while x > 0 {
    show x
    x = x - 1
}

repeat 5 times {
    show "Hello"
}
```

**Teaches:**

- Loop invariants
- Infinite loops (common beginner mistake)
- Counting vs condition-based iteration

---

### ✅ Functions

**CS Concept**: Abstraction, parameters, return values  
**Why Required**: Code reuse and decomposition

```pumpkin
function greet(name) {
    show "Hello"
    show name
}

function add(a, b) {
    return a + b
}
```

**Teaches:**

- Function calls vs definitions
- Parameter passing
- Return values
- Call stack

---

### ✅ Arrays

**CS Concept**: Data structures, indexing  
**Why Required**: Working with collections

```pumpkin
let scores = [90, 85, 95]
show scores[0]  # 90
```

**Teaches:**

- Zero-based indexing
- Bounds checking
- Sequential data

---

### ✅ Modules

**CS Concept**: Code organization, namespaces  
**Why Required**: Scaling beyond toy programs

```pumpkin
import math from "math-utils"
show math.sqrt(16)
```

**Teaches:**

- Separation of concerns
- Dependency management
- Public vs private code

---

## 3. Excluded Features (v0.x)

These features add power but hurt learnability.

### ❌ Classes / OOP

**Why Excluded**: Too many concepts at once (inheritance, polymorphism, `this`, constructors)

**Alternative**: Use functions and closures for encapsulation

**Example (Forbidden):**

```pumpkin
class Person {             # NO
    constructor(name) {
        this.name = name
    }
}
```

**Example (Encouraged):**

```pumpkin
function create_person(name) {  # YES
    return {
        name: name,
        greet: function() {
            show "Hello, I am"
            show name
        }
    }
}
```

---

### ❌ Operator Overloading

**Why Excluded**: Makes code behavior unpredictable

**Example (Forbidden):**

```pumpkin
# User defines what + means for custom types
```

**Rationale**: `+` should always mean addition. No surprises.

---

### ❌ Implicit Type Coercion

**Why Excluded**: Silent errors are not educational

**Example (Forbidden):**

```pumpkin
let x = "5" + 3  # Does this become "53" or 8? NO!
```

**Pumpkin Behavior:**

```pumpkin
let x = "5" + 3  # Runtime error: Cannot add string and number
```

---

### ❌ Global Mutable State (Hidden)

**Why Excluded**: Spooky action at a distance

**Example (Forbidden):**

```pumpkin
# A function modifies global variable without declaring it
```

**Pumpkin Behavior:**

- All global access is explicit (`global` keyword or module imports)

---

### ❌ Async/Await (v0.x)

**Why Excluded**: Too complex for beginners

**Alternative**: Teach synchronous execution first, introduce async in v1.0+

---

### ❌ Macros / Metaprogramming

**Why Excluded**: Code that writes code is too abstract for learners

---

## 4. Feature Inclusion Table

| Feature | v0.1 | v0.2 | v0.3 | Rationale |
|---------|------|------|------|-----------|
| Variables | ✅ | ✅ | ✅ | Core concept |
| Conditionals | ✅ | ✅ | ✅ | Core concept |
| Loops | ✅ | ✅ | ✅ | Core concept |
| Functions | ❌ | ✅ | ✅ | Week 4 concept |
| Arrays | ❌ | ✅ | ✅ | Month 2 concept |
| Modules | ❌ | ✅ | ✅ | Code organization |
| Optional Types | ❌ | ❌ | ✅ | Safety without complexity |
| Standard Library | ❌ | ❌ | ✅ | Practical utilities |
| Classes/OOP | ❌ | ❌ | ❌ | Too complex, use functions |
| Generics | ❌ | ❌ | ❌ | Type complexity |
| Async/Await | ❌ | ❌ | ❌ | Advanced topic |

---

## 5. Error Taxonomy (Educational)

### Error Categories

#### 5.1 Parse Errors (Syntax)

**When**: Code doesn't match grammar  
**Educational Goal**: Teach syntax rules

**Example:**

```pumpkin
let x = 10;  # Semicolons not allowed in Pumpkin
```

**Error Message:**

```
Parse Error at line 1:
  Unexpected ';' at end of line
  
  1 | let x = 10;
                ^
  
  Pumpkin doesn't use semicolons.
  Remove the ';' to fix this.
```

**Teaching Point**: Syntax precision

---

#### 5.2 Type Errors (Static or Runtime)

**When**: Type mismatch detected  
**Educational Goal**: Teach type compatibility

**Example:**

```pumpkin
let age: number = "twenty"
```

**Error Message:**

```
Type Error at line 1:
  Expected: number
  Got:      string
  
  1 | let age: number = "twenty"
                        ^^^^^^^^
  
  The variable 'age' was declared to hold numbers,
  but you're trying to assign a string.
  
  Did you mean: let age: number = 20
```

**Teaching Point**: Type safety

---

#### 5.3 Runtime Errors (Execution)

**When**: Valid code does invalid operation  
**Educational Goal**: Teach runtime behavior

**Example:**

```pumpkin
let arr = [1, 2, 3]
show arr[10]  # Out of bounds
```

**Error Message:**

```
Runtime Error at line 2:
  Array index out of bounds
  
  Array length: 3
  Index accessed: 10
  Valid indices: 0 to 2
  
  2 | show arr[10]
           ^^^^^^^
  
  You tried to access the 11th element (index 10),
  but the array only has 3 elements.
```

**Teaching Point**: Bounds checking

---

#### 5.4 Logic Errors (Infinite Loops)

**When**: Code runs forever  
**Educational Goal**: Teach loop termination

**Example:**

```pumpkin
let x = 10
while x > 0 {
    show x
    # Forgot to decrement x!
}
```

**Error Message (after 10,000 iterations):**

```
Warning: Possible infinite loop detected
  
  The while loop on line 2 has executed 10,000 times
  and shows no sign of stopping.
  
  Check your loop condition: x > 0
  Is 'x' ever going to become <= 0?
  
  Press Ctrl+C to stop, or Continue to keep running.
```

**Teaching Point**: Loop termination

---

## 6. VM Hooks for Teaching Mode

### 6.1 Step-by-Step Execution

The VM exposes hooks for IDEs to implement teaching mode.

**Rust API:**

```rust
pub struct VM {
    // ... existing fields
    pub teaching_mode: bool,
    pub step_callback: Option<Box<dyn Fn(&ExecutionContext)>>,
}

pub struct ExecutionContext {
    pub current_line: usize,
    pub current_instruction: OpCode,
    pub stack: Vec<PumpkinValue>,
    pub locals: HashMap<String, PumpkinValue>,
    pub call_stack: Vec<CallFrame>,
}

impl VM {
    pub fn step(&mut self) -> Result<StepResult, PumpkinError> {
        if self.teaching_mode {
            let ctx = self.capture_context();
            if let Some(callback) = &self.step_callback {
                callback(&ctx);
            }
        }
        // Execute one instruction
        self.run_instruction()
    }
}
```

**Usage (IDE):**

```rust
let mut vm = VM::new();
vm.teaching_mode = true;
vm.step_callback = Some(Box::new(|ctx| {
    println!("Line {}: {:?}", ctx.current_line, ctx.current_instruction);
    println!("Stack: {:?}", ctx.stack);
}));

vm.step()?;
```

---

### 6.2 Variable Change Tracking

**Rust API:**

```rust
pub struct VariableChange {
    pub name: String,
    pub old_value: Option<PumpkinValue>,
    pub new_value: PumpkinValue,
    pub line: usize,
}

impl VM {
    pub fn on_variable_change(
        &mut self,
        callback: Box<dyn Fn(&VariableChange)>
    ) {
        self.var_change_callback = Some(callback);
    }
}
```

**Educational Use:**

- Highlight variables when they change
- Show old vs new values
- Trace variable lifetime

---

### 6.3 Execution Cost Tracking

**Rust API:**

```rust
pub struct ExecutionStats {
    pub instructions_executed: usize,
    pub function_calls: usize,
    pub max_stack_depth: usize,
    pub memory_allocations: usize,
}

impl VM {
    pub fn get_stats(&self) -> ExecutionStats {
        // Return execution statistics
    }
}
```

**Educational Use:**

- Show algorithm efficiency
- Compare loop vs recursion cost
- Teach Big-O intuitively

---

### 6.4 "Why Did This Happen?" Explainer

**Rust API:**

```rust
impl PumpkinError {
    pub fn with_explanation(self, explain: String) -> Self {
        // Add educational context to error
    }
}
```

**Example:**

```rust
Err(PumpkinError::runtime("Division by zero")
    .with_explanation(
        "Division by zero is undefined in mathematics. \
         Before dividing, check if the divisor is zero."
    ))
```

---

## 7. Explainable Execution for IDEs

### 7.1 Bytecode Visibility Option

**Feature**: Show compiled bytecode alongside source

**UI (IDE):**

```
Source Code              Bytecode
────────────────────────────────────
let x = 10        →      LOAD_CONST 10
                         STORE_LOCAL 0

let y = 20        →      LOAD_CONST 20
                         STORE_LOCAL 1

let sum = x + y   →      LOAD_LOCAL 0
                         LOAD_LOCAL 1
                         ADD
                         STORE_LOCAL 2
```

**Educational Value**: Shows how high-level code becomes machine instructions

---

### 7.2 Stack Visualization

**Feature**: Show VM stack during execution

**UI (IDE):**

```
Instruction: ADD

Stack Before:          Stack After:
┌──────┐              ┌──────┐
│  20  │  ← Top       │  30  │  ← Result
├──────┤              └──────┘
│  10  │
└──────┘

Operation: Pop 10 and 20, push 30
```

**Educational Value**: Teaches stack-based computation

---

### 7.3 Call Frame Visualization

**Feature**: Show function call stack

**UI (IDE):**

```
Call Stack:
┌─────────────────────────┐
│ fibonacci(3)            │ ← Current
│   locals: {n: 3}        │
├─────────────────────────┤
│ fibonacci(4)            │
│   locals: {n: 4}        │
├─────────────────────────┤
│ main()                  │
│   locals: {result: ?}   │
└─────────────────────────┘
```

**Educational Value**: Teaches recursion and call stack

---

## 8. Teachable Code Examples

### Example 1: Teaching Variables

```pumpkin
# Variables are like labeled boxes

let age = 25           # Create a box labeled "age" with 25 inside
show age               # Look inside the box: 25

age = 26               # Replace contents with 26
show age               # Look again: 26

# You can't look in a box that doesn't exist
show height            # Error: Variable 'height' not declared
```

---

### Example 2: Teaching Functions

```pumpkin
# Functions are like recipes

function bake_cookies(count) {
    # Recipe steps:
    show "Mixing ingredients..."
    show "Baking"
    show count
    show "cookies"
    
    # Recipe result:
    return count * 100  # Calories
}

# Follow the recipe:
let calories = bake_cookies(12)
show calories  # 1200
```

---

### Example 3: Teaching Loops

```pumpkin
# Loops repeat instructions

# WHILE: Keep going as long as condition is true
let countdown = 5
while countdown > 0 {
    show countdown
    countdown = countdown - 1  # Important! Must change the condition
}
show "Blastoff!"

# REPEAT: Do something a fixed number of times
repeat 3 times {
    show "Hip hip hooray!"
}
```

---

### Example 4: Teaching Arrays

```pumpkin
# Arrays are like numbered lockers

let scores = [90, 85, 95]

# Locker 0: 90
# Locker 1: 85
# Locker 2: 95

show scores[0]  # Open locker 0: 90
show scores[1]  # Open locker 1: 85

scores[0] = 100  # Change what's in locker 0

# Trying to open locker 999?
# show scores[999]  # Error: Locker doesn't exist!
```

---

## 9. Scaling Path: Beginner → Intermediate

### Beginner (Week 1-4)

- No types
- No modules
- Simple I/O (`show`)
- Basic arithmetic

**Complexity**: One concept at a time

---

### Intermediate (Month 2-3)

- Optional types
- Module imports
- Standard library
- Arrays and string manipulation

**Complexity**: Combining concepts

---

### Advanced (Month 4+)

- Package manager
- Error handling patterns
- Algorithm optimization
- Code organization strategies

**Complexity**: Real-world patterns

---

## 10. Determinism & Sandboxing

### Deterministic Execution

**Requirement**: Same code + same input = same output, always

**Forbidden:**

- Random number generation (until explicit `random` module)
- Current time access (until explicit `time` module)
- File system reads (inherently non-deterministic)

**Why**: Predictable behavior aids learning

---

### Sandboxed Environment

**VM Constraints:**

- No network I/O
- No file writes (read-only file access in future)
- No system calls
- Memory limits (prevent infinite allocation)
- Instruction limits (prevent infinite loops)

**Why**: Safe for classroom/online environments

---

## Summary

Pumpkin is designed for **learning first, production later**. Every feature teaches a core concept. Every exclusion reduces cognitive load. Every error message is a teaching opportunity.

The language scales naturally from "Hello World" to algorithm implementation, without the learner needing to "forget" what they learned earlier.
