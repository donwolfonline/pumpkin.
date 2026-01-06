# Pumpkin CLI Reference

The `pumpkin` command-line interface is the primary tool for developing, running, and managing Pumpkin applications.

## Usage

```bash
pumpkin [COMMAND] [OPTIONS] [ARGS...]
```

If no command is specified, the CLI defaults to `repl` mode (or displays help depending on implementation).

## Commands

### `run`

Executes a Pumpkin source file.

**Usage:**

```bash
pumpkin run <file.pumpkin>
```

**Examples:**

```bash
pumpkin run script.pumpkin
pumpkin run examples/hello.pumpkin
```

**Exit Codes:**

- `0`: Execution successful.
- `1`: Syntax or Runtime error occurred.
- `127`: File not found.

---

### `repl`

Target: Interactive Read-Eval-Print Loop.
Starts an interactive session to type and execute Pumpkin code line-by-line.

**Usage:**

```bash
pumpkin repl
```

**Features:**

- Immediate feedback on expressions.
- Values are printed automatically (implicit `show`).
- Type `exit()` or press `Ctrl+C` twice to quit.

**Session Example:**

```text
> let x = 10
< null
> x * 2
< 20
```

---

### `fmt` (Preview)

Formats Pumpkin source code to standard style guidelines.
*Note: This feature is currently a placeholder in v0.2.*

**Usage:**

```bash
pumpkin fmt <file.pumpkin>
```

---

### `version`

Displays the current installed version of Pumpkin.

**Usage:**

```bash
pumpkin --version
```

**Output:**

```text
Pumpkin v0.2.0
```

---

### `help`

Displays help information for commands and options.

**Usage:**

```bash
pumpkin --help
```

## Error Handling

The CLI aims to provide helpful error messages.

**Syntax Error Example:**

```text
Error: Unexpected token '}' at line 5, column 12.
   |
 5 |    if (x > ) }
   |             ^
```

**Runtime Error Example:**

```text
Runtime Error: Division by zero.
   at main (script.pumpkin:10)
```

## Environment Variables

- `PUMPKIN_TRACE=1`: Enables verbose VM execution tracing (bytecodes and stack operations).
- `PUMPKIN_DEBUG=1`: Enables internal debugger logs.
