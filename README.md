# 🎃 Pumpkin: Code for Humans

> **The programming language that grows your ideas.**
> *v0.1.8 - The Foundation Release*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.8-orange.svg)](https://www.npmjs.com/package/pumpkin-lang)
[![Status](https://img.shields.io/badge/status-experimental-blue.svg)](https://github.com/donwolfonline/pumpkin.)

Pumpkin is a programming language built for **humans**, not robots. It removes the scary symbols and confusing jargon, replacing them with clear instructions that make sense the first time you read them.

**[Try the Playground](https://pumpkinpatch.vercel.app/playground)** (Runs entirely in your browser!)

---

## 🎨 What can I build?

Pumpkin is designed for **Creative Coding**, **Learning**, and **Exploration**.

* **Algorithmic Art:** Generate patterns which you can see in our "Use Cases" page.
* **Text Adventures:** Create interactive stories with simple logic.
* **Math Experiments:** Visualize algorithms and solve problems playfully.
* **Learning Basics:** Master loops, variables, and conditions without the headache.

---

## 🚀 Installation

### CLI (Mac, Linux, Windows)

You can install the Pumpkin CLI via npm. It works on any machine with Node.js installed.

```bash
npm install pumpkin-lang
```

Verify the installation:

```bash
npx pumpkin --version
# Output: 🎃 Pumpkin v0.1.8
```

### Editor Support (VS Code)

To get file icons and syntax highlighting, install our official extension:

1. Search for **"Pumpkin Language Support"** in the VS Code Extensions view.
2. Or visit the **[VS Code Marketplace (Click here to install)](https://marketplace.visualstudio.com/items?itemName=FrederickDineen.pumpkin-vscode)**.
3. Click **Install**.

---

## ⚡ Quick Start

### 1. Interactive REPL

Just type `npx pumpkin repl` to start playing immediately.

```bash
$ npx pumpkin repl
Welcome to Pumpkin v0.1.8 🎃
> show "Hello World"
"Hello World"
> let x = 10
> show x * 2
20
```

### 2. Running a File

Create a file named `hello.pumpkin`:

```pumpkin
// hello.pumpkin
let name = "Developer"
show "Hello, " + name + "!"

let count = 0
repeat 3 {
    count = count + 1
    show count
}
```

Run it:

```bash
npx pumpkin run hello.pumpkin
```

---

## 🌟 Features (v0.1)

Pumpkin allows you to write basic algorithmic logic with a smile.

* **Variables:** `let x = 10`, `let name = "Pumpkin"`
* **Math:** `+`, `-`, `*`, `/`, `( )` (Human-readable math)
* **Logic:** `if`, `else`, `and`, `or`, `not`
* **Loops:** `while`, `repeat`
* **Output:** `show "text"`
* **Standard Lib:** Basic math and logic modules.
* **Comments:** `// This is a comment`

### What's Missing? (Known Limitations)

To keep v0.1 stable, we intentionally excluded:

* ❌ User-defined Functions
* ❌ Arrays / Lists
* ❌ File I/O
* ❌ Imports (Partially supported in standard lib)

These are actively being worked on! See our **[Roadmap](./ROADMAP.md)**.

---

## 🛠️ For Contributors

We love contributors! This project is a great place to learn about language design, Rust, and WASM.

### Architecture

* **Core:** Written in **Rust** (`/pumpkin_core`). compiled to WASM.
* **CLI:** Written in **TypeScript** (`/src/cli`). Wraps the WASM core.
* **Website:** Next.js + React (`/website`). Hosted on Vercel.

### Development Setup

1. **Prerequisites:** Node.js (v18+), Rust (latest stable), `wasm-pack`.
2. **Build Core:**

    ```bash
    cd pumpkin_core
    wasm-pack build --target nodejs --out-dir ../dist/pkg
    ```

3. **Run Tests:**

    ```bash
    ./tests/run_smoke_test.sh
    ```

---

## 📜 License

Pumpkin is released under the [MIT License](LICENSE) and the [GNU GPL v3](LICENSE-GPL). You may choose either license to govern your use of the software.

**Trademark Notice:** The name "Pumpkin", and the "Pumpkin." logo are trademarks of Citrullix Inc. Use of these marks in derivative works requires explicit permission to avoid community confusion.

---

Made with 🎃 for the next generation of coders.
