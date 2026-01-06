# Contributing to Pumpkin 🎃

Hi there! 👋 We are thrilled that you want to contribute to Pumpkin.
Pumpkin is a language **designed for learning**, and that applies to our contributors too.

**You do NOT need to be a compiler expert to help.**

## 🌱 What We Value

* **Kindness:** We are learning together. There are no "stupid" questions.
* **Clarity:** Readable code is better than clever code.
* **Curiosity:** We want you to understand *how* the language works.

## 🚀 Getting Started

### 1. Find an Issue

Look for issues labeled **"Good First Issue"**.
These are tasks we have specifically prepared for new contributors. They usually involve:

* Adding a helper function to the Standard Library (e.g. `Math.sqrt`).
* Fixing a typo in documentation.
* Adding a simple example program.

### 2. Build from Source

#### Prerequisites

* **Node.js** v14+ (for CLI and website)
* **Rust** 1.70+ (for `pumpkin_core` VM)
* **wasm-pack** (for WASM builds, optional)

#### Clone and Build

```bash
git clone https://github.com/donwolfonline/pumpkin.git
cd pumpkin
npm install

# Build the Rust core
cd pumpkin_core
cargo build --release
cd ..

# Run the CLI
npm run build
npm link
pumpkin --version
```

### 3. Running Tests

We have multiple test suites:

#### Smoke Tests (Shell)

```bash
./run_smoke_tests.sh
```

#### Rust Unit Tests

```bash
cd pumpkin_core
cargo test
```

#### TypeScript Tests

```bash
npm test
```

Always run tests before opening a PR. If you add a feature, add a test.

## 📝 Coding Style

### Rust (`pumpkin_core`)

* Follow standard `rustfmt` formatting: `cargo fmt`
* Run `cargo clippy` and fix warnings.
* Prefer explicit types over `impl Trait` in public APIs.
* Comment complex VM operations inline.

### TypeScript (`src`)

* Use 4-space indentation.
* Avoid `any` types. Use specific types or generics.
* Functions should be small and single-purpose.

### Documentation

* Update relevant `.md` files in `docs/` if you change behavior.
* If you add a language feature, update `docs/Language_Reference_v0.1.md`.

## 🔧 How to Add Language Features Safely

Adding a new language feature (e.g., a new operator or statement type) requires touching multiple layers:

1. **Grammar** (`grammar/pumpkin.ohm`): Define the syntax rule.
2. **AST** (`pumpkin_core/src/ast.rs`): Add a new AST node variant.
3. **Compiler** (`pumpkin_core/src/compiler.rs`): Emit bytecode for the new feature.
4. **VM** (`pumpkin_core/src/vm.rs`): Implement the OpCode execution logic.
5. **Tests**: Add smoke tests in `tests/smoke/` and unit tests in Rust.

**Golden Rule:** If you are unsure, open an issue first to discuss the design before coding.

## 💬 How to Propose Changes

1. **Open an Issue** describing the problem or feature.
2. **Wait for Feedback** from maintainers (usually within 48 hours).
3. **Create a PR** once the approach is agreed upon.
4. **Respond to Reviews** promptly. We may ask for changes or clarifications.

## 🗺️ Project Structure

* `pumpkin_core/`: The Rust VM and compiler (v0.2+).
* `src/`: TypeScript CLI wrappers and legacy interpreter.
* `grammar/`: Ohm.js syntax rules.
* `website/`: Next.js documentation and playground.
* `examples/`: Sample Pumpkin programs.
* `docs/`: Documentation markdown files.

**(Good places to start: `examples/`, `docs/`, or `src/stdlib/`)**

## 🤝 Need Help?

Ask us in the [Discussions] tab or open an issue with your question. We are here to help you grow.

Happy Coding! 🎃
