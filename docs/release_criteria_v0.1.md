# Pumpkin v0.1 Release Criteria 🛡️

**Philosophy:** v0.1 is about **Trust**, not Power.

* It is better to lack a feature than to have it broken.
* It is better to crash with a nice error than to panic silently.
* It is better to document "Coming Soon" than to document broken code.

## ⛔ Gatekeeping Rules (Must Pass)

All items below are **BLOCKING**. If any are unmet, v0.1 cannot be released.

### 1. Installation & CLI

- [ ] **Clean Install:** `npm install -g pumpkin-lang` works on a fresh Node.js environment (Mac/Linux/Windows).
* [ ] **No Build Tools:** The user does NOT need `cargo` or `rustc` installed to run the CLI.
* [ ] **Smoke Test:** `pumpkin run tests/smoke.pumpkin` produces the exact expected output.
* [ ] **Version:** `pumpkin version` matches `package.json` and `Cargo.toml`.
* [ ] **Help:** `pumpkin help` is clear and typo-free.

### 2. Browser Playground

- [ ] **Loads:** Website loads without console errors.
* [ ] **Executes:** "Run" button successfully executes the default example (`first_program.pumpkin`).
* [ ] **Safety:** Entering `while true {}` (or similar infinite loop) does **NOT** freeze the browser tab (Worker termination/timeout working or user warned).
* [ ] **WASM Fallback:** If WASM fails to load, a clear error message is shown in the UI (not just a blank screen).

### 3. Error Quality Bar

- [ ] **No Panics:** The Rust core **NEVER** panics. All errors are returned as `ExecutionResult.error`.
* [ ] **No "Unknown Errors":** Every error scenario reachable by the smoke test has a specific variant (`TypeError`, `UndefinedVariable`, etc.).
* [ ] **Locations:** All syntax and runtime errors correctly point to the line causing the issue.
* [ ] **Hints:** Common beginner mistakes (e.g. missing `let`, wrong type math) show helpful hints.

### 4. Documentation

- [ ] **Honest Docs:** `docs/pumpkin_guide.md` describes *exactly* what is implemented. Remove or mark as "Planned" any features not in v0.1.
* [ ] **Readme:** The root `README.md` has working install instructions and a simple "Hello World" example that actually runs.

## ⚠️ Allowed Limitations (What Can Be Broken/Missing)

For v0.1, we explicitly accept the following:

* **Performance:** Code can be slow. Naive AST walking is acceptable.
* **Advanced Features:** No Functions, Arrays, Objects, or Imports required yet (unless strictly needed for "Hello World").
* **Line Numbers:** Off-by-one errors in line numbers are annoying but acceptable if documented.
* **Filesystem:** `show` is the only IO required. No file reading/writing.
* **Persistence:** CLI REPL doesn't need to save history.

## Release Checklist

1. Run `./tests/run_smoke_test.sh` -> **PASS**
2. Clean install test -> **PASS**
3. Manual Playground check -> **PASS**
4. Tag `v0.1.0` in git.
5. `npm publish`
