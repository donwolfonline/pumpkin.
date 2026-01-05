# Installation Verification Matrix 🏗️

**Status:** BLOCKS RELEASE ⛔
**Version:** v0.1.0

If any cell in this matrix fails, the release is **ABORTED**.

## 1. Platform Matrix

| Platform | Environment | Install Command | Expected Success Criteria | Common Failure Points |
| :--- | :--- | :--- | :--- | :--- |
| **macOS** | Terminal (zsh/bash) | `npm install -g pumpkin-lang` | `pumpkin version` returns `0.1.0`. `pumpkin run` executes. | Permissions (`sudo` needed?), Node version old. |
| **Linux** | Ubuntu/Debian | `npm install -g pumpkin-lang` | Same as above. | Missing glibc (rare for JS/WASM), Permission denied. |
| **Windows** | PowerShell / CMD | `npm install -g pumpkin-lang` | Same as above. | Path not updated, ExecutionPolicy restrictions. |
| **Browser** | Chrome / Firefox / Safari | Visit Playground URL | Editor loads, "Run" prints output. | WASM MIME type error, CSP blocking WASM. |

## 2. verification Steps (Manual)

### Step 1: Clean Environment Check

Ensure no previous versions of `pumpkin-lang` are installed.

```bash
npm uninstall -g pumpkin-lang
pumpkin version # Should fail "command not found"
```

### Step 2: Installation

Run the install command.

```bash
npm install -g pumpkin-lang
```

* **Time Check:** Must complete in < 2 minutes.
* **Logs:** No "gyp ERR!" or native build compilation messages (WASM should be pre-built).

### Step 3: Version Check

```bash
pumpkin version
# Expected Output: 🎃 Pumpkin v0.1.0
```

### Step 4: Execution Check (The Smoke Test)

Create a file `test.pumpkin`:

```pumpkin
show "It works!"
```

Run it:

```bash
pumpkin run test.pumpkin
# Expected Output: "It works!"
```

### Step 5: REPL Check

Run `pumpkin repl`.
Type `show 1 + 1`.
Expected output: `2`.
Type `exit` to quit.

## 3. Browser Checklist

* [ ] **Load:** Open Playground URL.
* [ ] **Console:** Check DevTools Console. No red errors.
* [ ] **Run:** Click "Run" on default code. Output appears.
* [ ] **Reload:** Refresh page. content persists (if local storage implemented) or resets cleanly.
* [ ] **Offline:** (Optional) Disconnect internet. Playground should still load (if PWA/Cached) or at least run if already loaded.

## 4. Failure Protocol

If a test fails:

1. **Stop Release.**
2. Identify if it's a code issue (Rust/TS) or Packaging issue (npm).
3. Fix issue.
4. Increment patch version (e.g., `v0.1.1-rc1`) if needed.
5. **Restart Verification Matrix from Step 1.**
