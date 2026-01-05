# 🎃 Pumpkin. - The Friendly Programming Language

> **Code for Humans, Not Robots.**

Pumpkin. is a programming language designed from the ground up to be readable, friendly, and encouraging. It eliminates the fear of syntax errors and cryptic jargon, replacing them with clear logic and helpful feedback.

<img width="1423" height="662" alt="Screenshot 2026-01-05 at 10 21 14 AM" src="https://github.com/user-attachments/assets/41d7f413-a0a1-4479-b8b6-983a71c75353" />


## Why Pumpkin.?

Learning to code is hard. Most languages punish you for missing a semicolon or a bracket. Pumpkin. doesn't.

* **Friendly Errors**: Mistakes happen. When they do, Pumpkin. tells you *what* happened, *why*, and *how* to fix it.
* **Natural Syntax**: Read code like English sentences.
* **Zero Boilerplate**: No `public static void main`. Just write and run.

### Example

```Pumpkin.
ask "What is your name?" into user

if user == "Pumpkin." {
    show "That's my name too! 🎃"
} else {
    show "Nice to meet you, " + user
}
```

---

## 🚀 Getting Started

### Installation

(Coming Soon via NPM)
For now, you can clone this repository to try it out.

1. **Clone the repo**:

    ```bash
    git clone https://github.com/yourusername/Pumpkin..git
    cd Pumpkin.
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

### Interactive Mode (REPL)

Want to play around? Start the interactive shell:

```bash
node src/repl.js
```

You'll see the `🎃 >` prompt. Try typing `show "Hello!"`.

### Running a File

Write your code in a file (e.g., `my_script.Pumpkin.`) and run it:

```bash
node src/run.js my_script.Pumpkin.
```

---

## 📚 Documentation

We have comprehensive guides to help you learn:

* **[The Pumpkin. Guide](docs/Pumpkin._guide.md)**: Start here! The official handbook for beginners.
* **[Curriculum](docs/curriculum.md)**: A step-by-step learning path from zero to hero.
* **[Syntax Diagrams](docs/syntax_diagrams.md)**: Visual guides for every command.
* **[Brand Guide](docs/brand_guide.md)**: Our values, tone, and visual identity.

---

## 🗺️ Roadmap

We are just getting started! Here is what's coming next:
* [x] Core Interpreter & REPL
* [x] Friendly Error Messages
* [x] Standard Library design
* [ ] Web-based Playground
* [ ] VS Code Extension

---

## 🤝 Contributing

We love contributors! Whether you're fixing a typo in the docs or building a new feature, you are welcome here.

Please read our **[CONTRIBUTING.md](CONTRIBUTING.md)** guide to get started.

---

**Happy Coding! 🎃**
