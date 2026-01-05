# Pumpkin CLI UX Guidelines 🎃

**Philosophy:** Friendly, not clever.
**Goal:** A 10-year-old should feel confident using this CLI.

## 1. Help Text Strategy

* **Greeting:** Start with a friendly header.
* **Action-Oriented:** Describe what commands *do*, not just what they *are*.
* **Examples:** Always provide copy-pasteable examples.
* **Hints:** Suggest what to do next.

### Proposed Help Output

```text
🎃 Pumpkin v0.1.0 - The friendly language for learning.

Usage:
  pumpkin <command> [options]

Commands:
  run     Execute a Pumpkin program file
  repl    Start the interactive playground
  help    Show this help message
  version Show the current version

Examples:
  pumpkin run hello.pumpkin
  pumpkin repl

Need help? Visit https://pumpkin-lang.org/docs
```

## 2. Error Wording

Errors should be conversational but precise.

| Technical (Bad) | Friendly (Good) |
| :--- | :--- |
| `FileNotFoundError: no such file or directory` | `❌ I couldn't find the file "code.pumpkin".` |
| `SyntaxError: unexpected token` | `❌ I didn't understand that symbol.` |
| `Parse Error` | `❌ Something looks wrong in your code.` |

### Guidelines

1. **Use Emojis:** ❌ for errors, 🎃 for success/info. Use sparingly.
2. **No Stack Traces:** Never show JS/Rust stack traces to the user.
3. **Suggest Solutions:** "Did you mean...?"

## 3. Command Discoverability

* **Default Behavior:** If the user runs `pumpkin` (no args), show the Help text, but also suggest `pumpkin repl` explicitly.
  * *Message:* "Hi! Try running 'pumpkin repl' to play interactively, or 'pumpkin help' for more."

## 4. Color Strategy

* **Red:** Errors.
* **Yellow:** Warnings, Hints, File paths.
* **Green:** Success, Valid output.
* **Dim (Grey):** Boilerplate, locations.

## 5. Implementation Plan

1. Update `src/cli/index.ts` to use this new Help format.
2. Review `src/cli/run.ts` to ensure "File Not Found" matches the friendly guideline.
