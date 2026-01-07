# Contributing to Pumpkin 🎃

First off, thank you for wanting to help grow Pumpkin! Our goal is to make programming accessible to everyone, and we appreciate your help in building "Code for Humans."

## 📜 Intellectual Property & Ownership

By contributing to Pumpkin, you agree that:

1. Your contributions will be licensed under the project's **MIT License**.
2. You grant the project maintainer (Frederick Dineen) a perpetual, worldwide, royalty-free license to use, modify, and distribute your contributions.
3. This ensures that the Pumpkin project remains unified and protected for the community.

## 🚀 How to Contribute

1. **Discuss First:** For major features (like new v0.2.0 bytecode instructions), please open an **Issue** first to discuss the design.
2. **Fork & Branch:** Fork the repo and create your branch from `main`.
3. **Rust Standards:** Since our core is in Rust, please ensure your code passes `cargo fmt` and `cargo test`.
4. **Submit a PR:** Open a Pull Request with a clear description of your changes.

## 🛠️ Development Setup

- **Core:** Rust (latest stable)
- **WASM:** wasm-pack
- **CLI:** Node.js (v18+)

We follow a "Hidden Complexity" philosophy: keep the internal Rust code robust and enterprise-grade, but keep the user-facing Pumpkin syntax simple and friendly.
