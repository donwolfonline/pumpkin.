# Pumpkin Embedding API Specification

## Mission

**Pumpkin is a safe, embeddable scripting language that extends Rust applications without compromising performance or safety.**

---

## 1. Rust Embedding API Design

### 1.1 Core API Structure

```rust
pub struct Pumpkin {
    vm: VM,
    config: PumpkinConfig,
}

pub struct PumpkinConfig {
    pub max_instructions: Option<usize>,
    pub max_stack_depth: usize,
    pub max_memory: Option<usize>,
    pub allow_imports: bool,
    pub module_loader: Option<Box<dyn ModuleLoader>>,
}

impl Default for PumpkinConfig {
    fn default() -> Self {
        Self {
            max_instructions: Some(1_000_000),
            max_stack_depth: 64,
            max_memory: Some(64 * 1024 * 1024), // 64 MB
            allow_imports: true,
            module_loader: None,
        }
    }
}
```

---

### 1.2 Basic Usage Pattern

```rust
use pumpkin::{Pumpkin, PumpkinConfig, PumpkinValue};

fn main() -> Result<(), PumpkinError> {
    // Create runtime with default config
    let mut runtime = Pumpkin::new(PumpkinConfig::default());
    
    // Execute script
    let source = r#"
        let x = 10
        let y = 20
        show x + y
    "#;
    
    runtime.execute(source)?;
    
    Ok(())
}
```

---

### 1.3 Advanced Configuration

```rust
let config = PumpkinConfig {
    max_instructions: Some(100_000),    // Limit execution
    max_stack_depth: 32,                // Shallow recursion only
    max_memory: Some(10 * 1024 * 1024), // 10 MB limit
    allow_imports: false,               // No module system
    module_loader: None,
};

let mut runtime = Pumpkin::with_config(config);
```

---

## 2. VM Lifecycle Model

### 2.1 Lifecycle States

```rust
pub enum VMState {
    Uninitialized,  // Just created
    Ready,          // Compiled, ready to run
    Running,        // Currently executing
    Paused,         // Paused at breakpoint
    Finished,       // Execution complete
    Error,          // Fatal error occurred
}

impl Pumpkin {
    pub fn state(&self) -> VMState {
        self.vm.state()
    }
}
```

---

### 2.2 State Transitions

```
Uninitialized
    ↓ compile()
Ready
    ↓ run() / step()
Running ← → Paused
    ↓ (completion)
Finished

Any state → Error (on fatal error)
```

---

### 2.3 Reusable Runtime

```rust
let mut runtime = Pumpkin::new(PumpkinConfig::default());

// Run first script
runtime.execute("let x = 10")?;

// Reset and run another
runtime.reset();
runtime.execute("let y = 20")?;

// Or reuse without reset (keeps globals)
runtime.execute("show x + y")?; // x from first script still available
```

---

## 3. Module Loading and Import Semantics

### 3.1 ModuleLoader Trait

```rust
pub trait ModuleLoader: Send + Sync {
    fn load(&self, module_name: &str) -> Result<String, PumpkinError>;
}

// Example: File system loader
struct FileSystemLoader {
    base_path: PathBuf,
}

impl ModuleLoader for FileSystemLoader {
    fn load(&self, module_name: &str) -> Result<String, PumpkinError> {
        let path = self.base_path.join(format!("{}.pumpkin", module_name));
        std::fs::read_to_string(path)
            .map_err(|e| PumpkinError::module_not_found(module_name))
    }
}
```

---

### 3.2 Custom Module Loading

```rust
// In-memory module loader (for embedded scenarios)
struct MemoryModuleLoader {
    modules: HashMap<String, String>,
}

impl ModuleLoader for MemoryModuleLoader {
    fn load(&self, module_name: &str) -> Result<String, PumpkinError> {
        self.modules
            .get(module_name)
            .cloned()
            .ok_or_else(|| PumpkinError::module_not_found(module_name))
    }
}

// Usage
let mut modules = HashMap::new();
modules.insert("math-utils".to_string(), r#"
    export function add(a, b) {
        return a + b
    }
"#.to_string());

let config = PumpkinConfig {
    module_loader: Some(Box::new(MemoryModuleLoader { modules })),
    ..Default::default()
};

let mut runtime = Pumpkin::with_config(config);
runtime.execute(r#"
    import math from "math-utils"
    show math.add(5, 3)
"#)?;
```

---

### 3.3 Module Sandboxing

**Restriction**: Modules cannot:

- Access file system
- Make network calls
- Access system resources

**Enforcement**: Implemented at VM level, not module loader level.

```rust
// Even if a module tries:
export function read_file(path) {
    // No file I/O primitives exist in VM
    // This will be a runtime error
}
```

---

## 4. Host-to-Pumpkin Function Calls

### 4.1 Calling Pumpkin Functions from Rust

```rust
// Define function in Pumpkin
runtime.execute(r#"
    function greet(name) {
        return "Hello, " + name
    }
"#)?;

// Call from Rust
let result = runtime.call_function(
    "greet",
    &[PumpkinValue::String(Rc::new("Alice".to_string()))]
)?;

match result {
    PumpkinValue::String(s) => println!("{}", s), // "Hello, Alice"
    _ => {}
}
```

---

### 4.2 Registering Rust Functions for Pumpkin

```rust
// Define Rust function
fn rust_multiply(args: &[PumpkinValue]) -> Result<PumpkinValue, PumpkinError> {
    let a = args[0].as_number()?;
    let b = args[1].as_number()?;
    Ok(PumpkinValue::Number(a * b))
}

// Register in runtime
runtime.register_native_function("multiply", rust_multiply);

// Call from Pumpkin script
runtime.execute(r#"
    let result = multiply(6, 7)
    show result  # 42
"#)?;
```

---

### 4.3 Type-Safe Native Functions

```rust
use pumpkin::native_function;

#[native_function]
fn add(a: f64, b: f64) -> f64 {
    a + b
}

#[native_function]
fn concat(a: String, b: String) -> String {
    format!("{}{}", a, b)
}

// Macro generates type checking and conversion
runtime.register_native("add", add);
runtime.register_native("concat", concat);
```

---

## 5. Memory and Execution Safety Guarantees

### 5.1 Memory Safety

**Guarantee**: No undefined behavior, even with malicious scripts.

**Implementation**:

- All allocations tracked
- Memory limits enforced (configurable)
- Automatic cleanup on error
- No raw pointers exposed to scripts

```rust
pub struct PumpkinConfig {
    pub max_memory: Option<usize>,  // Hard limit
}

// VM tracks allocations
impl VM {
    fn allocate<T>(&mut self, value: T) -> Result<Rc<T>, PumpkinError> {
        let size = std::mem::size_of::<T>();
        
        if let Some(limit) = self.config.max_memory {
            if self.memory_used + size > limit {
                return Err(PumpkinError::memory_limit_exceeded());
            }
        }
        
        self.memory_used += size;
        Ok(Rc::new(value))
    }
}
```

---

### 5.2 Stack Safety

**Guarantee**: No stack overflow from scripts.

**Implementation**:

- Call stack depth limited (default 64)
- Explicit check on every function call

```rust
impl VM {
    fn call_function(&mut self, func: &Function) -> Result<(), PumpkinError> {
        if self.frames.len() >= self.config.max_stack_depth {
            return Err(PumpkinError::stack_overflow());
        }
        
        self.frames.push(CallFrame::new(func));
        Ok(())
    }
}
```

---

### 5.3 Execution Time Limits

**Guarantee**: Scripts cannot run forever (unless explicitly allowed).

**Implementation**:

- Instruction counter
- Configurable limit

```rust
impl VM {
    fn run_instruction(&mut self) -> Result<StepResult, PumpkinError> {
        if let Some(limit) = self.config.max_instructions {
            if self.instruction_count >= limit {
                return Err(PumpkinError::instruction_limit_exceeded());
            }
        }
        
        self.instruction_count += 1;
        // Execute instruction...
    }
}
```

---

### 5.4 Panic-Free Guarantee

**Guarantee**: Pumpkin VM never panics (except on internal bugs).

**Implementation**:

- All errors are `Result<T, PumpkinError>`
- No `unwrap()` or `expect()` in production code
- Fuzz testing to verify

```rust
// All public APIs return Result
impl Pumpkin {
    pub fn execute(&mut self, source: &str) -> Result<(), PumpkinError> {
        // Never panics on invalid input
    }
}
```

---

## 6. Performance Targets

### 6.1 Execution Speed

**Target**: 50-100x slower than native Rust (acceptable for scripting)

**Measurement**:

```rust
// Benchmark: Sum 1 to 1,000,000
let pumpkin_time = measure(|| {
    runtime.execute(r#"
        let sum = 0
        let i = 1
        while i <= 1000000 {
            sum = sum + i
            i = i + 1
        }
    "#)
});

let rust_time = measure(|| {
    let mut sum = 0;
    for i in 1..=1_000_000 {
        sum += i;
    }
});

assert!(pumpkin_time < rust_time * 100);
```

---

### 6.2 Memory Overhead

**Target**: < 1 MB base overhead

**Measurement**:

- Empty VM: ~100 KB
- Simple script (10 variables): ~10 KB additional
- Function-heavy script (100 functions): ~500 KB

---

### 6.3 Startup Time

**Target**: < 1ms to create runtime

```rust
let start = Instant::now();
let runtime = Pumpkin::new(PumpkinConfig::default());
let elapsed = start.elapsed();

assert!(elapsed < Duration::from_millis(1));
```

---

## 7. no_std Support

### 7.1 Crate Configuration

```toml
# Cargo.toml
[dependencies]
pumpkin_core = { version = "0.3", default-features = false }

[features]
default = ["std"]
std = ["pumpkin_core/std"]
alloc = ["pumpkin_core/alloc"]
```

---

### 7.2 no_std + alloc Mode

```rust
#![no_std]
extern crate alloc;

use alloc::rc::Rc;
use pumpkin_core::{Pumpkin, PumpkinConfig};

fn main() {
    let mut runtime = Pumpkin::new(PumpkinConfig::default());
    runtime.execute("let x = 10").unwrap();
}
```

**Available**: VM, compiler, all core features  
**Unavailable**: File I/O, modules (unless custom loader provided)

---

## 8. WASM Compatibility

### 8.1 Compilation Target

```bash
# Build for WASM
cargo build --target wasm32-unknown-unknown --no-default-features --features alloc
```

---

### 8.2 WASM API

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PumpkinWasm {
    runtime: Pumpkin,
}

#[wasm_bindgen]
impl PumpkinWasm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            runtime: Pumpkin::new(PumpkinConfig::default()),
        }
    }
    
    pub fn execute(&mut self, source: &str) -> Result<String, JsValue> {
        self.runtime.execute(source)
            .map(|_| "OK".to_string())
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}
```

---

## 9. Backward Compatibility

### 9.1 Versioning Policy

**Guarantee**: Once Pumpkin reaches 1.0, the VM API is stable.

- **Major version** (1.x → 2.x): Breaking changes allowed
- **Minor version** (1.0 → 1.1): New features, no breakage
- **Patch version** (1.0.0 → 1.0.1): Bug fixes only

---

### 9.2 Deprecation Process

```rust
#[deprecated(since = "1.2.0", note = "Use `execute` instead")]
pub fn run(&mut self, source: &str) -> Result<(), PumpkinError> {
    self.execute(source)
}

// Deprecation timeline:
// v1.2: Deprecation warning
// v1.3-1.9: Still works
// v2.0: Removed
```

---

## 10. Example: Embedding in a Rust App

### Scenario: Game with Scripted NPCs

```rust
use pumpkin::{Pumpkin, PumpkinConfig, PumpkinValue};
use std::rc::Rc;

struct GameEngine {
    pumpkin: Pumpkin,
}

impl GameEngine {
    fn new() -> Self {
        let mut pumpkin = Pumpkin::new(PumpkinConfig {
            max_instructions: Some(10_000),  // Limit per script
            max_stack_depth: 16,             // Simple scripts only
            allow_imports: false,            // No file access
            ..Default::default()
        });
        
        // Register game functions
        pumpkin.register_native_function("move_npc", Self::move_npc);
        pumpkin.register_native_function("say", Self::say);
        
        Self { pumpkin }
    }
    
    fn move_npc(args: &[PumpkinValue]) -> Result<PumpkinValue, PumpkinError> {
        let x = args[0].as_number()?;
        let y = args[1].as_number()?;
        
        println!("Moving NPC to ({}, {})", x, y);
        Ok(PumpkinValue::Null)
    }
    
    fn say(args: &[PumpkinValue]) -> Result<PumpkinValue, PumpkinError> {
        let message = args[0].as_string()?;
        println!("NPC says: {}", message);
        Ok(PumpkinValue::Null)
    }
    
    fn run_npc_script(&mut self, script: &str) -> Result<(), PumpkinError> {
        self.pumpkin.execute(script)
    }
}

fn main() {
    let mut game = GameEngine::new();
    
    // NPC behavior script
    let npc_script = r#"
        # Simple patrol behavior
        move_npc(10, 20)
        say("Halt! Who goes there?")
        
        let player_nearby = true
        if player_nearby {
            say("Welcome, traveler!")
            move_npc(15, 25)
        }
    "#;
    
    game.run_npc_script(npc_script).unwrap();
}
```

---

## 11. Complete API Reference

```rust
// Core runtime
pub struct Pumpkin { /* ... */ }

impl Pumpkin {
    pub fn new(config: PumpkinConfig) -> Self;
    pub fn with_config(config: PumpkinConfig) -> Self;
    
    // Execution
    pub fn execute(&mut self, source: &str) -> Result<(), PumpkinError>;
    pub fn reset(&mut self);
    
    // Function calls
    pub fn call_function(
        &mut self,
        name: &str,
        args: &[PumpkinValue]
    ) -> Result<PumpkinValue, PumpkinError>;
    
    // Native function registration
    pub fn register_native_function(
        &mut self,
        name: &str,
        func: NativeFunction
    );
    
    // State inspection
    pub fn state(&self) -> VMState;
    pub fn get_global(&self, name: &str) -> Option<&PumpkinValue>;
}

// Configuration
pub struct PumpkinConfig {
    pub max_instructions: Option<usize>,
    pub max_stack_depth: usize,
    pub max_memory: Option<usize>,
    pub allow_imports: bool,
    pub module_loader: Option<Box<dyn ModuleLoader>>,
}

// Values
pub enum PumpkinValue {
    Number(f64),
    String(Rc<String>),
    Boolean(bool),
    List(Rc<RefCell<Vec<PumpkinValue>>>),
    Function(Rc<Function>),
    NativeFunction(NativeFunction),
    Null,
}

// Errors
pub enum PumpkinError {
    ParseError(String),
    RuntimeError(String),
    TypeError(String),
    StackOverflow,
    MemoryLimitExceeded,
    InstructionLimitExceeded,
    ModuleNotFound(String),
}

// Module loading
pub trait ModuleLoader: Send + Sync {
    fn load(&self, module_name: &str) -> Result<String, PumpkinError>;
}
```

---

## Summary

Pumpkin's embedding API is designed for **professional Rust developers** who need a safe, predictable scripting layer. The API prioritizes:

1. **Safety**: No panics, no undefined behavior
2. **Control**: Fine-grained limits on execution
3. **Simplicity**: Minimal boilerplate
4. **Compatibility**: no_std, WASM, stable API

The language runtime is a library, not a framework. You embed it on your terms.
