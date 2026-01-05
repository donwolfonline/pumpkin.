# Contributing to Pumpkin 🎃

Hi there! 👋 We are thrilled that you want to contribute to Pumpkin.
Pumpkin is a language **designed for learning**, and that applies to our contributors too.

**You do NOT need to be a compiler expert to help.**

## 🌱 What We Value

* **Kindness:** We are learning together. There are no "stupid" questions.
* **Clarity:** Readable code is better than clever code.
* **Curiosity:** We want you to understand *how* the language works.

## 🚀 How to Get Started

### 1. Find an Issue

Look for issues labeled **"Good First Issue"**.
These are tasks we have specifically prepared for new contributors. They usually involve:

* Adding a helper function to the Standard Library (e.g. `Math.sqrt`).
* Fixing a typo in documentation.
* Adding a simple example program.

### 2. Setup Your Environment

```bash
git clone https://github.com/yourname/pumpkin.git
cd pumpkin
npm install
npm test
```

If the tests pass, you are ready!

### 3. Make Your Change

* Create a branch: `git checkout -b feature/my-cool-feature`.
* Write your code.
* Run `npm test` often.
* Add a test case in `tests/` if relevant.

### 4. Open a Pull Request (PR)

Push your branch and open a PR. We will review it and help you merge it!

## 🗺️ Project Structure

* `src/parser.ts`: Reads code and finds structure.
* `src/interpreter.ts`: Runs the code.
* `src/stdlib/`: Where standard functions (Math, Text) live. **(Good place to start!)**
* `grammar/`: The Ohm syntax rules.

## 🤝 Need Help?

Ask us in the [Discussions] tab or open an issue with your question. We are here to help you grow.

Happy Coding! 🎃
