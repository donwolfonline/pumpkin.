# 🎃 Pumpkin Programming Language

> **A friendly, explorative language for learning to code.**
> *v0.1.0 - The Foundation Release*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.0-orange.svg)]()
[![Status](https://img.shields.io/badge/status-experimental-blue.svg)]()

Pumpkin is a toy programming language designed to be the "Anti-Gatekeeper". It prioritizes friendly error messages, predictable behavior, and a zero-setup experience over raw performance or complex features.

**[Try the Playground](https://pumpkinpatch.vercel.app/playground)** (Runs entirely in your browser!)

---

## 🎨 What can I build?

Pumpkin v0.1 is designed for **Creative Coding** and **Learning**. While it's not meant for building operating systems or web servers yet, it's perfect for:

* **Algorithmic Art:** Generate patterns, sequences, and text-based visuals.
* **Text Adventures:** Create interactive stories with simple logic.
* **Math Experiments:** Visualize algorithms and solve problems playfully.
* **Learning Basics:** Master loops, variables, and conditions without the headache.

---

## 🚀 Installation

### CLI (Mac, Linux, Windows)

You can install the Pumpkin CLI via npm. It works on any machine with Node.js installed.

```bash
npm install -g pumpkin-lang
```

Verify the installation:

```bash
pumpkin version
# Output: 🎃 Pumpkin v0.1.0
```

---

## ⚡ Quick Start

### 1. Interactive REPL

Just type `pumpkin repl` to start playing immediately.

```bash
$ pumpkin repl
Welcome to Pumpkin v0.1.0 🎃
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
pumpkin run hello.pumpkin
```

---

## 🌟 Features (v0.1)

Pumpkin v0.1 allows you to write basic algorithmic logic.

* **Variables:** `let x = 10`, `let name = "Pumpkin"`
* **Math:** `+`, `-`, `*`, `/`, `( )`
* **Logic:** `if`, `else`, `and`, `or`, `not`
* **Loops:** `while`, `repeat`
* **Output:** `show "text"`
* **Comments:** `// This is a comment`

### What's Missing? (Known Limitations)

To keep v0.1 stable, we intentionally excluded:

* ❌ User-defined Functions
* ❌ Arrays / Lists
* ❌ File I/O
* ❌ Imports

These features are planned for **v0.2**.

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

## 🏆 Contributor Trophies

Pumpkin honors its contributors with a gamified achievement system. Each level represents a milestone in your journey as a Pumpkin developer.

<div align="center">

| Level | Trophy | Achievement |
| :--- | :---: | :--- |
| **1. The Seedling** | ![Seedling](/website/public/images/trophies/seedling.png) | For your very first merged Pull Request. |
| **2. The Sprout** | ![Sprout](/website/public/images/trophies/sprout.png) | For 5 contributions or solving your first complex bug. |
| **3. The Winding Vine** | ![Vine](/website/public/images/trophies/vine.png) | For 10 contributions or implementing a new library module. |
| **4. The Blossom** | ![Blossom](/website/public/images/trophies/blossom.png) | For leading documentation efforts or conducting major refactors. |
| **5. Golden Pumpkin** | ![Gold](/website/public/images/trophies/golden_pumpkin.png) | For 25 contributions or implementing a core language feature. |
| **6. Jack-o'-Lantern** | ![Lantern](/website/public/images/trophies/jack_o_lantern.png) | For 50 contributions or achieving "Enlightenment" level optimization. |
| **7. Master Pie-Maker** | ![Pie Maker](/website/public/images/trophies/pie_maker.svg) | For reaching core maintainer status and architectural leadership. |
| **8. The Great Pumpkin** | ![Great Pumpkin](/website/public/images/trophies/great_pumpkin.svg) | For legendary impact that transforms the entire Pumpkin ecosystem. |

</div>

---

## 📜 License

Pumpkin is open-source software licensed under the [MIT license](LICENSE).

---

Made with 🎃 for the next generation of coders.
