# Pumpkin Versioning Policy 🧭

**Philosophy:** Stability is a promise.
**Current Version:** v0.1.x

## 1. The v0.1 Promise (Stable Patches)

Once v0.1.0 is released, **no changes** in the v0.1.x series allowed to break existing Pumpkin programs.

### 🔒 Immutable in v0.1.x

* **Syntax:** Valid code must remain valid. We cannot reserve new keywords (e.g. `fn`) in a patch release.
* **CLI Arguments:** `pumpkin run` flags and behavior must stay consistent.
* **Output Format:** The "unified renderer" style must not change drastically, as tools might parse it.

### 🔓 Changeable in v0.1.x

* **Internal AST:** We *can* refactor the Rust AST if it doesn't affect the JSON execution contract or if we version the contract. (Prefer avoiding this).
* **Performance:** Speed improvements are always allowed.
* **Bug Fixes:** If a program crashed the interpreter, fixing it (even if it changes "working" behavior of a buggy script) is allowed.

## 2. The v0.2 Boundary (Breaking Changes)

v0.2.0 is the next *Breaking* release.

### ⚠️ Fair Game for v0.2

* **New Keywords:** We WILL reserve `fn`, `import`, `struct`, `return`. If you used `let fn = 1` in v0.1, your code **will break** in v0.2.
* **AST Changes:** The JSON contract will likely bump to v0.2.
* **Language Semantics:** We might change how scope shadowing works if v0.1 proved confusing.

## 3. Upgrade Philosophy

**"We break it, we fix it (or tell you how)."**

When v0.2 releases, we will provide:

1. **Migration Guide:** "How to port v0.1 code to v0.2".
2. **Explicit Errors:** If v0.2 detects v0.1 patterns (like using `fn` as a variable), it should give a *helpful* error: " 'fn' is now a keyword in v0.2."

## 4. Semantic Versioning Rules

We strictly follow [SemVer](https://semver.org/), but with the "0.y.z" caveat:

* **0.1.0** -> **0.1.1**: Patch. strictly backwards compatible. Safe to auto-upgrade.
* **0.1.1** -> **0.2.0**: Minor (Breaking). New features, potential breaking changes. Manual upgrade recommended.
* **1.0.0**: The "Forever Stable" milestone. (Long term goal).

## 5. Planning the Transition

* **Feature Flagging:** We might implement v0.2 features in the v0.1 codebase behind a `--experimental` flag, but they are NOT part of the stable v0.1 API.
* **Docs:** Documentation for v0.1 stays live at `/docs/v0.1/` even after v0.2 releases.
