# Pumpkin Research Experimentation Platform

## Vision

**Pumpkin is a playground for language design research where experimental features can be safely tested without disrupting stable users.**

---

## 1. Experimental Architecture Boundaries

### 1.1 Swappable Components

The compiler pipeline has well-defined boundaries for experimentation:

```
Source Code
    ↓
┌─────────────┐
│   Lexer     │ ← Swappable (alternative tokenization)
└─────────────┘
    ↓
┌─────────────┐
│   Parser    │ ← Fixed (Ohm grammar is canonical)
└─────────────┘
    ↓
┌─────────────┐
│    AST      │ ← Fixed (core representation)
└─────────────┘
    ↓
┌─────────────┐
│ Type Check  │ ← Swappable (experimental type systems)
└─────────────┘
    ↓
┌─────────────┐
│  Optimizer  │ ← Swappable (experimental optimizations)
└─────────────┘
    ↓
┌─────────────┐
│  Codegen    │ ← Swappable (multiple backends)
└─────────────┘
    ↓
┌─────────────┐
│   Runtime   │ ← Swappable (VM, interpreter, JIT)
└─────────────┘
```

---

### 1.2 Core vs Experimental Separation

**Core (Stable)**:

- Lexer (tokenization)
- Parser (grammar → AST)
- AST data structures
- Bytecode format
- VM execution (baseline)

**Experimental (Unstable)**:

- Type system extensions
- Advanced optimizations
- Alternative runtimes
- Language feature proposals

---

## 2. Multiple Execution Models

### 2.1 Baseline: Bytecode VM (Stable)

**Status**: Production-ready, default  
**Performance**: 50-100x slower than native

```rust
#[cfg(not(feature = "experimental-runtime"))]
pub fn execute(bytecode: &Chunk) -> Result<(), PumpkinError> {
    let mut vm = VM::new();
    vm.run(bytecode)
}
```

---

### 2.2 Experimental: AST Interpreter

**Status**: Research  
**Use Case**: Debugging, teaching, rapid prototyping

```rust
#[cfg(feature = "experimental-ast-interpreter")]
pub fn execute_ast(ast: &Program) -> Result<(), PumpkinError> {
    let mut interpreter = ASTInterpreter::new();
    interpreter.eval(ast)
}
```

**Activation**:

```bash
cargo build --features experimental-ast-interpreter
pumpkin run --runtime=ast script.pumpkin
```

---

### 2.3 Experimental: Register-Based VM

**Status**: Research  
**Use Case**: Performance comparison

```rust
#[cfg(feature = "experimental-register-vm")]
pub fn execute_register(bytecode: &Chunk) -> Result<(), PumpkinError> {
    let mut vm = RegisterVM::new();
    vm.run(bytecode)
}
```

---

### 2.4 Future: JIT-Ready IR

**Status**: Planned  
**Use Case**: Proof-of-concept for LLVM/Cranelift integration

```rust
#[cfg(feature = "experimental-jit")]
pub fn execute_jit(ir: &IR) -> Result<(), PumpkinError> {
    let mut jit = JITCompiler::new();
    jit.compile_and_run(ir)
}
```

---

## 3. Experimental Type System Ideas

### 3.1 Gradual Typing (Currently Planned for v0.3)

**Status**: Experimental → Stable path  
**Feature Flag**: `gradual-types`

```pumpkin
let x: number = 10  # Type annotation
let y = 20          # No type (dynamic)
```

---

### 3.2 Research: Refinement Types

**Status**: Pure research  
**Feature Flag**: `experimental-refinement-types`

```pumpkin
# Hypothetical syntax
let age: number{x | x >= 0 && x <= 120} = 25
```

**Implementation Sketch**:

```rust
#[cfg(feature = "experimental-refinement-types")]
pub struct RefinementType {
    base: Type,
    predicate: Expr,  // Boolean expression
}
```

---

### 3.3 Research: Effect Types

**Status**: Pure research  
**Feature Flag**: `experimental-effect-types`

```pumpkin
# Functions declare side effects
function read_file(path): string [IO] {
    # ...
}

# Pure functions have no effects
function add(a, b): number [] {
    return a + b
}
```

---

### 3.4 Research: Dependent Types (Toy)

**Status**: Academic experiment  
**Feature Flag**: `experimental-dependent-types`

```pumpkin
# Array length in type
function first(arr: array[n], n: number): any {
    return arr[0]  # Compile error if n == 0
}
```

**Note**: Not intended for production, purely for research.

---

## 4. Feature Flag Strategy

### 4.1 Cargo Features Hierarchy

```toml
[features]
default = ["std"]

# Stable features
std = []
alloc = []
wasm = []

# Experimental: Opt-in
experimental = [
    "experimental-types",
    "experimental-runtime",
    "experimental-optimization"
]

experimental-types = ["gradual-types", "refinement-types"]
experimental-runtime = ["ast-interpreter", "register-vm"]
experimental-optimization = ["constant-folding", "dead-code-elimination"]

# Individual flags
gradual-types = []
refinement-types = []
ast-interpreter = []
register-vm = []
```

---

### 4.2 Compile-Time Gating

**Pattern**: All experimental code behind feature flags

```rust
// Stable: Always available
pub fn compile_to_bytecode(ast: &AST) -> Chunk {
    // ...
}

// Experimental: Feature-gated
#[cfg(feature = "experimental-register-vm")]
pub fn compile_to_register_bytecode(ast: &AST) -> RegisterChunk {
    // ...
}
```

---

### 4.3 Runtime Feature Detection

```rust
pub struct PumpkinFeatures {
    pub gradual_types: bool,
    pub refinement_types: bool,
    pub register_vm: bool,
}

impl PumpkinFeatures {
    pub fn available() -> Self {
        Self {
            gradual_types: cfg!(feature = "gradual-types"),
            refinement_types: cfg!(feature = "refinement-types"),
            register_vm: cfg!(feature = "experimental-register-vm"),
        }
    }
}
```

**User Query**:

```bash
pumpkin --features
Available features:
  ✓ gradual-types
  ✗ refinement-types (experimental)
  ✓ register-vm (experimental)
```

---

## 5. Versioning and Instability Policy

### 5.1 Release Channels

**Stable Channel** (v0.x, v1.x):

- Default installation
- Backward compatible (within major version)
- No experimental features

**Nightly Channel** (nightly-YYYY-MM-DD):

- Latest experimental features
- Breaking changes allowed
- For researchers and early adopters

**Example**:

```bash
# Install stable
cargo install pumpkin

# Install nightly
cargo install pumpkin --version nightly
```

---

### 5.2 Experimental Feature Lifecycle

```
Proposal
    ↓
RFC (Request for Comments)
    ↓
Experimental Implementation (feature flag)
    ↓ (6+ months of use)
Stabilization Review
    ↓
Stable (feature flag removed, always on)
    OR
Deprecated (feature removed)
```

**Example Timeline**:

- **Month 0**: RFC for gradual types
- **Month 1**: Experimental implementation (`--features gradual-types`)
- **Month 7**: Stabilization review
- **Month 8**: Graduated to stable (v0.3 release)

---

### 5.3 Breaking Change Policy

**Stable Features**: No breaking changes (within major version)

**Experimental Features**: Breaking changes allowed with warning

**Warning Format**:

```rust
#[deprecated(
    since = "0.4.0",
    note = "Experimental feature 'refinement-types' syntax has changed. \
            See migration guide: https://..."
)]
```

---

## 6. Isolation of Experiments

### 6.1 Separate Compilation Paths

```rust
pub fn compile(ast: &AST, features: &PumpkinFeatures) -> CompilationResult {
    if features.gradual_types {
        #[cfg(feature = "gradual-types")]
        return compile_with_types(ast);
    }
    
    // Default stable path
    compile_baseline(ast)
}
```

**Guarantee**: Experimental code **never** affects stable path.

---

### 6.2 Test Isolation

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn stable_behavior() {
        // Tests without experimental features
        let runtime = Pumpkin::new(PumpkinConfig::default());
        // ...
    }
    
    #[test]
    #[cfg(feature = "experimental-register-vm")]
    fn experimental_register_vm() {
        // Tests only when feature enabled
        let runtime = Pumpkin::new_with_runtime(Runtime::Register);
        // ...
    }
}
```

---

### 6.3 Documentation Separation

**Stable Docs**: `docs.pumpkin-lang.org`  
**Experimental Docs**: `nightly.pumpkin-lang.org`

**Documentation Markers**:

```markdown
# Gradual Types

⚠️ **EXPERIMENTAL**: This feature requires `--features gradual-types`

Syntax:
```pumpkin
let x: number = 10
```

```

---

## 7. Example Experimental Feature: Pattern Matching

### 7.1 Proposal (RFC)

**RFC #42: Pattern Matching for Pumpkin**

**Motivation**: Destructuring and matching are common in modern languages.

**Proposed Syntax**:
```pumpkin
match value {
    1 => show "one"
    2 => show "two"
    _ => show "other"
}
```

---

### 7.2 Feature Flag

```toml
[features]
experimental-pattern-matching = ["dep:pattern-parser"]
```

---

### 7.3 Implementation (Gated)

```rust
#[cfg(feature = "experimental-pattern-matching")]
pub mod pattern_matching {
    use crate::ast::*;
    
    pub struct MatchExpr {
        pub value: Box<Expr>,
        pub arms: Vec<MatchArm>,
    }
    
    pub struct MatchArm {
        pub pattern: Pattern,
        pub body: Box<Expr>,
    }
    
    pub fn compile_match(expr: &MatchExpr) -> Result<Chunk, CompileError> {
        // Implementation...
    }
}
```

---

### 7.4 User Activation

```bash
# Build with experimental feature
cargo build --features experimental-pattern-matching

# Or via environment
export PUMPKIN_EXPERIMENTAL=pattern-matching
pumpkin run script.pumpkin
```

---

### 7.5 Stabilization Criteria

Before graduating to stable:

1. ✅ Implementation complete
2. ✅ Test coverage > 90%
3. ✅ Used in 3+ real projects
4. ✅ No major bugs for 6 months
5. ✅ Documentation complete
6. ✅ Community approval

---

## 8. Guidelines for Research Contributors

### 8.1 Starting an Experiment

**Process**:

1. Write RFC in `docs/rfcs/`
2. Discuss in GitHub Discussions
3. Get maintainer approval
4. Implement behind feature flag
5. Document as experimental

---

### 8.2 Code Quality Requirements

**Even experimental code must**:

- Compile without warnings
- Have tests (even if feature-gated)
- Follow Rust style guide
- Not break stable code

**Example**:

```rust
#[cfg(feature = "experimental-register-vm")]
mod register_vm {
    // Well-structured, tested code
    // even though experimental
}
```

---

### 8.3 Documentation Requirements

**Experimental Feature Checklist**:

- [ ] RFC document
- [ ] Implementation guide
- [ ] Usage examples
- [ ] Performance benchmarks (if relevant)
- [ ] Known limitations
- [ ] Migration path (if replacing existing)

---

### 8.4 Collaboration Model

**Maintainers**: Review RFCs, approve stabilization  
**Contributors**: Implement experiments, gather feedback  
**Community**: Test, provide feedback, vote on graduation

**Decision Process**:

- RFC requires 2 maintainer approvals
- Stabilization requires community poll + maintainer consensus

---

## 9. Experimentation Safeguards

### 9.1 Binary Size

**Rule**: Experimental features must not bloat stable binary.

**Enforcement**:

```rust
// CI check
#[cfg(test)]
fn test_binary_size() {
    let size = measure_binary_size("pumpkin");
    assert!(size < 5_000_000); // 5 MB max
}
```

---

### 9.2 Compile Time

**Rule**: Feature flags shouldn't slow stable builds.

**Monitoring**:

```bash
cargo build --timings
# Ensure stable path < 10s on CI
```

---

### 9.3 Test Coverage

**Rule**: Experimental code requires tests.

**Enforcement**:

```yaml
# .github/workflows/ci.yml
- name: Test experimental features
  run: |
    cargo test --all-features
    cargo tarpaulin --features experimental --out Lcov
    # Coverage must be > 80%
```

---

## 10. Comparison: Stable vs Experimental

| Aspect | Stable | Experimental |
|--------|--------|--------------|
| Breaking changes | ❌ No | ✅ Yes (with warning) |
| Feature flags | None | Required |
| Documentation | Complete | May be incomplete |
| Support | Guaranteed | Best-effort |
| Performance | Optimized | May be slower |
| Binary impact | Included always | Only if enabled |

---

## 11. Example: Enabling Multiple Experiments

```bash
# Enable all experimental features
cargo build --all-features

# Enable specific experiments
cargo build --features experimental-register-vm,gradual-types

# Use in code
pumpkin run --runtime=register --type-check=gradual script.pumpkin
```

---

## 12. Deprecation and Removal

### 12.1 Failed Experiments

**If an experiment doesn't graduate**:

1. Mark as deprecated (1 release)
2. Remove from docs (next release)
3. Remove code (2 releases later)

**Example**:

```rust
#[deprecated(
    since = "0.5.0",
    note = "Experimental refinement types are being removed. \
            No replacement."
)]
#[cfg(feature = "experimental-refinement-types")]
pub fn check_refinement(ty: &Type) -> bool {
    // ...
}
```

---

## 13. Research Metrics

### 13.1 Success Criteria for Experiments

**Quantitative**:

- Downloads with feature enabled
- GitHub issues/discussions
- Performance benchmarks

**Qualitative**:

- Community feedback
- Academic citations
- Production use cases

---

### 13.2 Tracking

```rust
// Telemetry (opt-in)
#[cfg(feature = "telemetry")]
fn record_feature_usage(feature: &str) {
    metrics::counter!("pumpkin.feature.used", "name" => feature);
}
```

---

## Summary

Pumpkin's research platform enables **safe experimentation** through:

1. **Clear boundaries**: Core vs experimental separation
2. **Feature flags**: Rust's cfg system for opt-in
3. **Channels**: Stable vs nightly releases
4. **Lifecycle**: RFC → Experimental → Stable (or deprecated)
5. **Safeguards**: No impact on stable users

The platform welcomes language design research while maintaining production-grade stability for serious users.
