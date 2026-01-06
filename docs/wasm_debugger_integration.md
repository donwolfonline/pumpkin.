# WASM Debugger Integration Guide

This guide explains how to hook the Rust `DebugSession` into a JavaScript frontend (VS Code or Web IDE).

## 1. Rust Side (wasm.rs)

You need to expose the `DebugSession` to WASM.

```rust
#[wasm_bindgen]
pub struct WasmDebugger {
    session: DebugSession<'static>, // simplified lifetime
}

#[wasm_bindgen]
impl WasmDebugger {
    pub fn new(bytecode: &[u8]) -> Self { ... }
    
    pub fn step(&mut self) -> JsValue {
        let reason = self.session.step();
        serde_wasm_bindgen::to_value(&reason).unwrap()
    }
    
    pub fn resume(&mut self) -> JsValue {
        let reason = self.session.resume();
        serde_wasm_bindgen::to_value(&reason).unwrap()
    }
    
    pub fn get_state(&self) -> JsValue {
        let state = self.session.get_state();
        serde_wasm_bindgen::to_value(&state).unwrap() // Returns { ip, line, stack }
    }
    
    pub fn set_breakpoint(&mut self, line: usize) {
        self.session.set_breakpoint(line);
    }
}
```

## 2. JavaScript Side (IDE)

```javascript
import init, { WasmDebugger } from './pumpkin_core.js';

async function startDebug() {
    await init();
    
    const bytecode = compile(source); // compile source first
    const dbg = WasmDebugger.new(bytecode);
    
    // Add Breakpoint
    dbg.set_breakpoint(5);
    
    // Run
    let status = dbg.resume();
    console.log("Stopped:", status); // { type: "Breakpoint", "0": 5 }
    
    // Inspect
    let state = dbg.get_state();
    updateUI(state.stack, state.line);
}
```

## 3. Protocol

The `StopReason` enum maps to JSON:

* `"Step"`
* `{"Breakpoint": 5}`
* `"Halted"`
* `{"Error": "msg"}`

This simple protocol allows any web-based editor to drive the Pumpkin VM step-by-step.
