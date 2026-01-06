# Installation

This guide details how to install the Pumpkin programming language on macOS, Linux, and Windows.

## Prerequisites

- **macOS/Linux**: Terminal access.
- **Windows**: PowerShell or WSL (Windows Subsystem for Linux) is recommended.
- **Dependencies**:
  - For NPM install: Node.js v14 or higher.
  - For Source build: Rust (latest stable).

## Method 1: NPM (Recommended)

The easiest way to install Pumpkin is via the Node Package Manager (npm). This provides the CLI tool wrapping the cross-platform WebAssembly runtime.

### Installation

```bash
npm install -g pumpkin-lang
```

*Note: You may need to use `sudo` on Linux/macOS if you encounter permission errors.*

### Verification

Run the following command to verify the installation:

```bash
pumpkin --version
```

Expected output:

```text
Pumpkin v0.2.0
```

## Method 2: Build from Source (Rust)

For maximum performance or development, build the native executable from the Rust source code.

### Prerequisites

Ensure Rust is installed:

```bash
rustc --version
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pumpkin-lang/pumpkin.git
   cd pumpkin
   ```

2. Install using Cargo:

   ```bash
   cargo install --path pumpkin_core
   ```

   This compiles the binary and places it in your Cargo bin directory (usually `~/.cargo/bin`).

### Verification

```bash
pumpkin_core --version
```

*Note: The native binary is currently named `pumpkin_core`. You may alias it to `pumpkin` manually.*

## Method 3: Prebuilt Binaries

Precompiled binaries are available for major platforms on the GitHub Releases page.

1. Navigate to the [Releases Page](https://github.com/pumpkin-lang/pumpkin/releases).
2. Download the archive matching your architecture:
    - macOS: `pumpkin-macos-x86_64.tar.gz` or `pumpkin-macos-aarch64.tar.gz`
    - Linux: `pumpkin-linux-x86_64.tar.gz`
    - Windows: `pumpkin-windows-x86_64.zip`
3. Extract the archive.
4. Move the executable to a directory in your system `PATH` (e.g., `/usr/local/bin` on Unix, or a dedicated tools folder on Windows).

## Troubleshooting

### Command Not Found

If `pumpkin` is not recognized after installation:

1. **NPM**: Ensure your npm global bin directory is in your `PATH`.
2. **Cargo**: Ensure `~/.cargo/bin` is in your `PATH`.

### Permission Denied (EACCES)

If installing via npm fails with permission errors:

1. Use `sudo npm install -g pumpkin-lang`.
2. Or, configure npm to use a directory owned by the current user.

### Build Failures

If `cargo install` fails:

1. Update Rust: `rustup update`.
2. Ensure you have the necessary build tools installed (e.g., `build-essential` on Ubuntu, Xcode CLI tools on macOS).

## Uninstall

To remove Pumpkin from your system:

**NPM:**

```bash
npm uninstall -g pumpkin-lang
```

**Cargo:**

```bash
cargo uninstall pumpkin_core
```

**Binary:**
Simply delete the executable file from the directory where you placed it.
