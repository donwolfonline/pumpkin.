# Pumpkin Debugger UX Specification

## Philosophy

**Debugging Should Feel Like Learning, Not Fighting**

### Core Principles

1. **Calm**: No intimidating symbols or jargon
2. **Clear**: Show exactly what's happening
3. **Educational**: Help users understand code execution
4. **Optional**: Zero overhead when not debugging

---

## 1. IDE Debugger (Monaco-based)

### Visual Design

**Color Palette:**

- Current line: Soft yellow highlight (`#FFF9E6`)
- Breakpoint line: Subtle red dot in gutter (`#FF6B6B`)
- Paused state: Gentle blue overlay (`#E3F2FD`)
- Variables changed: Soft green highlight (`#E8F5E9`)

**Typography:**

- Variable names: Monospace, medium weight
- Values: Monospace, lighter weight
- Types: Sans-serif, small, gray

---

### Feature 1: Line Highlighting

**Behavior:**

- Current execution line has a **soft yellow background**
- Animated pulse on step (subtle, 300ms fade)
- Line number shows a **▶** play symbol

**Example:**

```
  1  let x = 10
  2  let y = 20
▶ 3  let sum = x + y    ← Soft yellow background
  4  show sum
```

**Why:** Immediate visual feedback of program state without overwhelming colors.

---

### Feature 2: Variable Panel

**Layout:**

```
┌─ VARIABLES ───────────────┐
│ Local Scope               │
│  x: 10        (number)    │
│  y: 20        (number)    │
│  sum: 30      (number) ✓  │ ← Green checkmark = just changed
│                           │
│ Global Scope             │
│  (empty)                  │
└───────────────────────────┘
```

**Features:**

- **Auto-expand locals** by default
- **Type annotations** in gray
- **Change indicators** (✓) for updated variables
- **Collapsible arrays/objects** with item count

**Array Display:**

```
scores: [90, 85, 95]  (array, 3 items)
  ▼ [0]: 90
  ▼ [1]: 85
  ▼ [2]: 95
```

**Educational Note:**  
Hovering over a type shows a tooltip: "This is a number. Numbers can be used in math operations."

---

### Feature 3: Call Stack Panel

**Layout:**

```
┌─ CALL STACK ──────────────┐
│ ▶ main()                  │
│     at line 3             │
│                           │
│   calculateSum()          │
│     at line 12            │
│                           │
│   helper()                │
│     at line 25            │
└───────────────────────────┘
```

**Features:**

- **Oldest (bottom) to newest (top)** ordering
- **Click to jump** to function definition
- **Current frame highlighted** with ▶
- **Max depth indicator** if approaching stack limit

**Warning Display:**

```
⚠ Stack depth: 58/64
  (Recursion nearing limit)
```

---

### Feature 4: Breakpoint Toggles

**Interaction:**

- **Click line gutter** to toggle breakpoint
- **Red dot** appears in gutter
- **Conditional breakpoints** (right-click):

  ```
  ⊙ if x > 10
  ```

**Breakpoint States:**

- **Active**: Solid red dot (●)
- **Disabled**: Gray hollow dot (○)
- **Conditional**: Red dot with "?" (●?)

**Educational Tooltip:**
"Breakpoints pause execution here. Use them to inspect variables at specific moments."

---

### Feature 5: Execution Speed Control

**Slider Control:**

```
┌─ SPEED ──────────────────┐
│  Slow  ◀═══●═════▶  Fast │
│                          │
│  100ms per instruction   │
└──────────────────────────┘
```

**Presets:**

- **Slow**: 500ms (for teaching)
- **Medium**: 100ms (for observation)
- **Fast**: 10ms (for quick runs)
- **Instant**: No delay (default)

**Why:** Slowed execution helps learners see the order of operations.

---

### Control Buttons

**Layout:**

```
[▶ Continue]  [⏸ Pause]  [↷ Step Over]  [↓ Step Into]  [↑ Step Out]  [⏹ Stop]
```

**Tooltips:**

- **Continue**: Run until next breakpoint
- **Pause**: Pause at current instruction
- **Step Over**: Execute this line, don't enter functions
- **Step Into**: Enter function calls
- **Step Out**: Run until current function returns
- **Stop**: Terminate execution

---

## 2. CLI Debugger

### Interactive Mode

**Starting:**

```bash
pumpkin debug script.pumpkin
```

**Prompt:**

```
Pumpkin Debugger v0.3
Type 'help' for commands

[paused at line 1]
> 
```

---

### Commands

#### `step` (or `s`)

Execute one instruction, stepping into functions.

**Example:**

```
> step
[paused at line 2]
  1  let x = 10
▶ 2  let y = 20
  3  show x + y
```

---

#### `next` (or `n`)

Execute one line, stepping over functions.

---

#### `continue` (or `c`)

Run until next breakpoint or program end.

---

#### `break <line>` (or `b <line>`)

Set breakpoint at line number.

**Example:**

```
> break 5
Breakpoint set at line 5
```

---

#### `list` (or `l`)

Show surrounding code with line numbers.

**Output:**

```
  1  let x = 10
  2  let y = 20
▶ 3  let sum = x + y
  4  show sum
  5  show "Done"
```

---

#### `print <var>` (or `p <var>`)

Show variable value.

**Example:**

```
> print x
x = 10 (number)
```

---

#### `locals`

Show all local variables.

**Output:**

```
Local Variables:
  x = 10 (number)
  y = 20 (number)
  sum = 30 (number)
```

---

#### `stack`

Show call stack.

**Output:**

```
Call Stack:
  #0  main() at line 3
  #1  calculate() at line 12
  #2  helper() at line 25
```

---

#### `help`

Show all commands.

---

### Error Display (CLI)

**Clear, Educational Format:**

```
╭─ Runtime Error ──────────────────────────────────╮
│                                                  │
│  Type Mismatch                                   │
│  Expected: number                                │
│  Got:      string                                │
│                                                  │
│  at line 5:                                      │
│    age = "twenty"                                │
│           ^^^^^^^^                               │
│                                                  │
│  Hint: Variable 'age' was declared with type     │
│        'number' on line 3. Strings and numbers   │
│        are not compatible.                       │
│                                                  │
╰──────────────────────────────────────────────────╯
```

**Features:**

- **Box drawing** for visual containment
- **Error type** as heading
- **Expected vs Actual** comparison
- **Source code snippet** with highlighting
- **Educational hint** in plain language

---

## 3. Shared Behavior (IDE & CLI)

### Breakpoint Consistency

Same breakpoint data format in both environments:

```json
{
  "file": "script.pumpkin",
  "line": 5,
  "condition": null,
  "enabled": true
}
```

**Behavior:**

- Breakpoints persist between debug sessions
- Stored in workspace config (not global)

---

### Variable Inspection

**Same display format:**

```
variable_name: value (type)
```

**Type Representations:**

- Numbers: `42`, `3.14`
- Strings: `"hello"` (with quotes)
- Booleans: `true`, `false`
- Arrays: `[1, 2, 3]` (or `(3 items)` if long)
- Null: `nil`

---

### Step Granularity

**Instruction-level stepping:**

- Each VM opcode is a "step"
- Users see line changes, not raw opcodes

**Example:**

```pumpkin
let sum = a + b  # This is 4 VM instructions:
                 # 1. LOAD a
                 # 2. LOAD b
                 # 3. ADD
                 # 4. STORE sum
```

**User sees:** One step = one line (unless "step into" opcode mode enabled).

---

## 4. Performance Guarantees

### Zero Overhead When Disabled

**Mechanism:**

- Debugger compiles out at build time if `--release` flag used
- No runtime checks if debugger not attached
- Same bytecode with or without debug info

**Verification:**

```bash
pumpkin build --release
# No debugger hooks in output
```

---

## 5. Debugger API (Platform-Agnostic)

### Events Emitted

**For IDE/CLI to consume:**

```rust
pub enum DebugEvent {
    Paused { line: usize, locals: HashMap<String, Value> },
    Resumed,
    Breakpoint { line: usize },
    StepCompleted { line: usize },
    VariableChanged { name: String, value: Value },
    Error { message: String, line: usize },
    Finished,
}
```

**Communication:**

- WebSocket for IDE (JSON-RPC)
- Stdin/Stdout for CLI (line-based protocol)

---

## 6. Educational Features

### "Why Did This Happen?" Mode

**Triggered on errors:**

Instead of:

```
Error: Division by zero
```

Show:

```
╭─ Division by Zero ───────────────────────────────╮
│                                                  │
│  You tried to divide by zero on line 8:         │
│    result = 10 / x                               │
│                                                  │
│  The variable 'x' has value 0.                   │
│                                                  │
│  Why this is an error:                           │
│  Division by zero is undefined in mathematics.   │
│                                                  │
│  How to fix:                                     │
│  Check if x is zero before dividing:             │
│    if x != 0 {                                   │
│      result = 10 / x                             │
│    }                                             │
│                                                  │
╰──────────────────────────────────────────────────╯
```

---

### "Rewind" Feature (Future)

**Concept:**

- Record execution history
- Allow stepping **backward**
- Show "time travel" of variable values

**UI:**

```
[◀◀ Rewind]  [▶▶ Forward]

Timeline:
  ┌─────┬─────┬─────┬─────┬─────┐
  │ L1  │ L2  │ L3  │ L4  │ L5  │
  └─────┴─────┴─────┴─────┴─────┘
            ▲ You are here
```

---

## 7. CLI Command Summary

| Command | Alias | Description |
|---------|-------|-------------|
| `step` | `s` | Step one instruction |
| `next` | `n` | Step over function calls |
| `continue` | `c` | Run to next breakpoint |
| `break <line>` | `b` | Set breakpoint |
| `list` | `l` | Show code |
| `print <var>` | `p` | Show variable |
| `locals` | - | Show all locals |
| `stack` | - | Show call stack |
| `quit` | `q` | Exit debugger |
| `help` | `h` | Show commands |

---

## 8. Example Debugging Session (CLI)

```bash
$ pumpkin debug factorial.pumpkin

Pumpkin Debugger v0.3
Type 'help' for commands

[paused at line 1]
> list
  1  function factorial(n) {
  2      if n <= 1 {
  3          return 1
  4      }
  5      return n * factorial(n - 1)
  6  }
  7
▶ 8  show factorial(5)

> break 3
Breakpoint set at line 3

> continue
Breakpoint hit at line 3

> locals
Local Variables:
  n = 5 (number)

> print n
n = 5 (number)

> continue
Breakpoint hit at line 3

> locals
Local Variables:
  n = 4 (number)

> stack
Call Stack:
  #0  factorial(4) at line 3
  #1  factorial(5) at line 5
  #2  main() at line 8

> quit
Debugger exited.
```

---

## 9. Implementation Notes

### Monaco Integration

**Decorations API:**

```typescript
editor.deltaDecorations([], [
  {
    range: new monaco.Range(lineNumber, 1, lineNumber, 1),
    options: {
      isWholeLine: true,
      className: 'pumpkin-current-line',
      glyphMarginClassName: 'pumpkin-current-glyph'
    }
  }
]);
```

**CSS:**

```css
.pumpkin-current-line {
  background-color: #FFF9E6;
  border-left: 3px solid #FFD54F;
}

.pumpkin-current-glyph::before {
  content: "▶";
  color: #F57C00;
}
```

---

## 10. Accessibility

### Screen Reader Support

**Announcements:**

- "Paused at line 5"
- "Variable x changed to 10"
- "Breakpoint at line 12 hit"

**Keyboard Navigation:**

- `F9`: Toggle breakpoint
- `F5`: Continue
- `F10`: Step over
- `F11`: Step into
- `Shift+F11`: Step out

---

## Summary

The Pumpkin debugger prioritizes **calm, educational debugging** over power-user features. Every interaction is designed to teach, not intimidate.
