# Pumpkin Developer Setup Guide

Welcome to Pumpkin! 🎃 This guide is designed to get you up and running with the Pumpkin programming language environment efficiently.

## 1. System Requirements

Before installing Pumpkin, ensure your development environment meets the following requirements:

* **Node.js**: Version 18.0.0 or higher.
* **Package Manager**: `npm` (bundled with Node.js) or `yarn`.
* **Operating System**: Windows, macOS, or Linux.

## 2. Installation

Pumpkin is distributed as an NPM package. You can install it globally to access the `pumpkin` command from anywhere in your terminal.

```bash
npm install -g pumpkin-lang
```

*Note: You may need to use `sudo` on Linux/macOS or run your terminal as Administrator on Windows if you encounter permission errors.*

### Verifying Installation

To verify that Pumpkin is installed correctly, check the version:

```bash
pumpkin --help
```

You should see the Pumpkin CLI usage menu.

## 3. Your First Program

Let's write a simple "Hello, World" program to test the runtime.

1. Create a file named `hello.pumpkin`.
2. Add the following code:

    ```pumpkin
    let message = "Hello, Pumpkin! 🎃"
    show message
    ```

3. Run the program using the CLI:

    ```bash
    pumpkin run hello.pumpkin
    ```

**Output:**

```text
Hello, Pumpkin! 🎃
```

## 4. Interactive REPL

Pumpkin includes a persistent Read-Eval-Print Loop (REPL) for quick prototyping and experimentation.

Start the REPL:

```bash
pumpkin repl
```

Usage Examples:

```pumpkin
🎃 > let x = 10
🎃 > let y = 20
🎃 > show x + y
30
```

* **Multi-line Input**: The REPL automatically detects open brackets `{`, `(`, or `[` and waits for you to close them.
* **Exit**: Type `exit` or press `Ctrl+C` to quit.
* **Reset**: Type `clear` to reset the environment state.

## 5. Troubleshooting

### Command `pumpkin` not found

* **Cause**: NPM global bin directory is not in your system `PATH`.
* **Fix**: Ensure your node/npm bin folder (e.g., `/usr/local/bin` or `%APPDATA%\npm`) is added to your environment variables.

### Permission Errors during Install

* **Cause**: Writing to global system folders requires administrative privileges.
* **Fix**: Run command with `sudo` (macOS/Linux) or use a Node version manager like `nvm` to install without root privileges.

### Syntax Errors on Valid Code

* **Cause**: Ensure you are using the correct file extension `.pumpkin`.
* **Fix**: Check `pumpkin run --help` or use the `format` command (coming soon) to check syntax.
