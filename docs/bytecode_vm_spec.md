# Official Pumpkin Bytecode VM Specification (v1.0)

> **Status:** Ratified
> **Target:** v1.0
> **Architecture:** Stack-based, Deterministic.

## 1. Architecture Overview

 The Pumpkin VM is a **stack-based virtual machine**. It executes instructions that manipulate a centralized operand stack and manages control flow via a call stack of frames.

### 1.1. Data Model

* **Values:** All values are boxed `PumpkinValue` types (f64, bool, String, Ref<List>, Ref<Object>).
* **Locals:** Local variables are allocated directly on the operand stack.
* **Globals:** Global variables are stored in a centralized `HashMap<String, Value>`.

### 1.2. The Stacks

1. **Operand Stack:** A contiguous array of values.
    * Used for arithmetic inputs/outputs.
    * Used for local variable storage (base pointer access).
2. **Call Stack:** A stack of `CallFrame` structs.
    * Stores `ip` (Instruction Pointer) for return.
    * Stores `bp` (Base Pointer) - offset in Operand Stack where the function's locals begin.

### 1.3. Trace Hooks

The VM allows an optional `TraceHook` to be registered. This hook is called *before* every instruction execution, passing the current `IP`, `OpCode`, and formatted `Stack` dump.

## 2. Bytecode Format (The "Chunk")

A "Chunk" represents a sequence of bytecode and associated data.

| Field | Type | Description |
| :--- | :--- | :--- |
| `constants` | `Vec<Value>` | Pool of literals (Numbers, Strings) used by code. |
| `code` | `Vec<u8>` | The raw bytecode instruction stream. |
| `lines` | `Vec<usize>` | Parallel array mapping byte offsets to source lines (for debugging). |

## 3. Instruction Set Architecture (ISA)

Opcodes are 1 byte. Operands follow immediately in the stream.

### 3.1. Stack & Constants

| Op | Code | Operand | Stack Effect | Description |
| :--- | :--- | :--- | :--- | :--- |
| `RETURN` | 0x00 | - | `[val] -> []` | Returns from current function with top value. |
| `CONST` | 0x01 | `idx: u8` | `[] -> [val]` | Push constant from pool[`idx`]. |
| `POP` | 0x02 | - | `[val] -> []` | Discard top value. |
| `NIL` | 0x03 | - | `[] -> [null]` | Push `null`. |
| `TRUE` | 0x04 | - | `[] -> [true]` | Push `true`. |
| `FALSE` | 0x05 | - | `[] -> [false]` | Push `false`. |

### 3.2. Variables

| Op | Code | Operand | Stack Effect | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET_LOCAL` | 0x10 | `idx: u8` | `[] -> [val]` | Push valid at stack[`bp` + `idx`]. |
| `SET_LOCAL` | 0x11 | `idx: u8` | `[val] -> [val]` | Set stack[`bp` + `idx`] = val (peek). |
| `GET_GLOBAL`| 0x12 | `idx: u8` | `[] -> [val]` | literal=`consts[idx]`. Push global[`literal`]. |
| `SET_GLOBAL`| 0x13 | `idx: u8` | `[val] -> [val]` | literal=`consts[idx]`. Set global[`literal`] = val. |

### 3.3. Arithmetic & Logic

| Op | Code | Stack Effect | Description |
| :--- | :--- | :--- | :--- |
| `ADD` | 0x30 | `[a, b] -> [a+b]` | Add numbers or concat strings. |
| `SUB` | 0x31 | `[a, b] -> [a-b]` | Subtract. |
| `MUL` | 0x32 | `[a, b] -> [a*b]` | Multiply. |
| `DIV` | 0x33 | `[a, b] -> [a/b]` | Divide. ERR if zero. |
| `EQ` | 0x34 | `[a, b] -> [bool]`| Equality. |
| `GT` | 0x35 | `[a, b] -> [bool]`| Greater Than. |
| `LT` | 0x36 | `[a, b] -> [bool]`| Less Than. |
| `NOT` | 0x37 | `[a] -> [!a]` | Boolean Negation. |

### 3.4. Control Flow

| Op | Code | Operand | Description |
| :--- | :--- | :--- | :--- |
| `JMP` | 0x50 | `offset: u16` | Unconditional jump forward. `ip += offset`. |
| `JMP_FALSE` | 0x51 | `offset: u16` | Pop cond. If falsey, `ip += offset`. |
| `LOOP` | 0x52 | `offset: u16` | Unconditional loop backward. `ip -= offset`. |
| `CALL` | 0x53 | `args: u8` | Call function. Expects `[callee, arg1, ... argN]` on stack. |

### 3.5. Arrays & Objects

| Op | Code | Operand | Stack Effect | Description |
| :--- | :--- | :--- | :--- | :--- |
| `ARRAY` | 0x70 | `count: u8` | `[e1...eN] -> [arr]` | Create array from top `count` values. |
| `GET_IDX` | 0x71 | - | `[arr, idx] -> [val]` | Get array index. |
| `SET_IDX` | 0x72 | - | `[arr, idx, val] -> [val]` | Set array index. |
| `GET_PROP`| 0x73 | `idx: u8` | `[obj] -> [val]` | literal=`consts[idx]`. Get property by name. |

## 4. Execution Loop Pseudocode

```rust
loop {
    let byte = read_u8();
    match byte {
        ADD => {
            let b = stack.pop();
            let a = stack.pop();
            stack.push(a + b);
        }
        CALL => {
            let arg_count = read_u8();
            // 1. Peek Callee at stack[-arg_count - 1]
            // 2. Create new CallFrame { ip: 0, bp: stack.len() - arg_count }
            // 3. Push frame to call_stack
            // 4. Set IP to function start
        }
    }
}
```

## 5. Error Handling

VM Errors (Stack Overflow, Unknown OpCode, Type Error) interrupt the loop and return a `Err(PumpkinError)`. The host is responsible for catching this and rendering a user-friendly message with the `lines` mapping info.
