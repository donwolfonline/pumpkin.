# Pumpkin Bytecode VM Design (v0.5)

> **Status:** Draft / Future Architecture
> **Model:** Stack-based Virtual Machine
> **Goal:** Performance, portability, and deterministic execution.

## 1. Architecture

### 1.1. The Stack

The VM operates on a centralized **Operand Stack**.

* All operations (add, sub, call) consume values from the top of the stack and push results back.
* Values are tagged `PumpkinValue` (Number, Boolean, String, Ref).

### 1.2. Call Frames

Execution context is managed via **Call Frames**.

* **Instruction Pointer (IP):** Current bytecode offset.
* **Stack Offset:** Base pointer for the function's access to the operand stack.
* **Locals:** Fixed-size array for local variables (resolved to indices at compile time).
* **Constants:** Pointer to the chunk's constant pool.

## 2. Instruction Set Architecture (ISA)

Opcodes are 1 byte. Operands vary.

### 2.1. Stack Manipulation

| Opcode | Mnemonic | Operand | Description |
| :--- | :--- | :--- | :--- |
| 0x01 | `CONST` | `idx: u16` | Push constant from pool at `idx`. |
| 0x02 | `NIL` | - | Push `null`. |
| 0x03 | `TRUE` | - | Push `true`. |
| 0x04 | `FALSE` | - | Push `false`. |
| 0x05 | `POP` | - | Discard top value. |

### 2.2. Arithmetic & Logic (Binary Ops)

| Opcode | Mnemonic | Description |
| :--- | :--- | :--- |
| 0x10 | `ADD` | Pop b, a; push a + b. |
| 0x11 | `SUB` | Pop b, a; push a - b. |
| 0x12 | `MUL` | Pop b, a; push a * b. |
| 0x13 | `DIV` | Pop b, a; push a / b. |
| 0x20 | `EQ` | Pop b, a; push a == b. |
| 0x21 | `GT` | Pop b, a; push a > b. |
| 0x22 | `NOT` | Pop a; push !a. |

### 2.3. Variables

| Opcode | Mnemonic | Operand | Description |
| :--- | :--- | :--- | :--- |
| 0x30 | `GET_LOCAL` | `idx: u8` | Push value of local var at `idx`. |
| 0x31 | `SET_LOCAL` | `idx: u8` | Set local var at `idx` to top of stack. |
| 0x32 | `GET_GLOBAL`| `idx: u16`| Push value of global (by name idx). |
| 0x33 | `SET_GLOBAL`| `idx: u16`| Set global (by name idx) to top. |

### 2.4. Control Flow

| Opcode | Mnemonic | Operand | Description |
| :--- | :--- | :--- | :--- |
| 0x40 | `JMP` | `offset: u16` | Unconditional jump (IP += offset). |
| 0x41 | `JMP_FALSE` | `offset: u16` | Pop cond; jump if falsey. |
| 0x42 | `LOOP` | `offset: u16` | Unconditional loop back (IP -= offset). |

### 2.5. Functions

| Opcode | Mnemonic | Operand | Description |
| :--- | :--- | :--- | :--- |
| 0x50 | `CALL` | `args: u8` | Call function with `args` on stack. |
| 0x51 | `RET` | - | Return from current frame. |

## 3. Example Compilation

### Source

```pumpkin
let a = 10
if a > 5 {
    show a
}
```

### Bytecode Assembly

```asm
CONST 0     ; Push 10 (idx 0 in const pool)
SET_GLOBAL 0 ; Set global "a" (idx 0 in name pool)
POP          ; Clean stmt expr result

GET_GLOBAL 0 ; Push a
CONST 1      ; Push 5
GT           ; a > 5
JMP_FALSE 8  ; Jump to end if false (offset 8)

GET_GLOBAL 0 ; Push a
PRINT        ; (Intrinsic show)
POP          ; Clean

; Label: END
NIL          ; Implicit script return
RET
```

## 4. Execution Loop (Rust Sketch)

```rust
loop {
    let byte = read_byte();
    match byte {
        op::ADD => {
            let b = stack.pop();
            let a = stack.pop();
            stack.push(a + b);
        },
        op::JMP_FALSE => {
            let offset = read_u16();
            if is_falsey(stack.pop()) {
                ip += offset;
            }
        },
        // ...
    }
}
```
