# Pumpkin Package Manager Specification (v0.4)

## Philosophy

**Radical Simplicity**: No dependency hell. No version conflicts. No mystery.

### Core Principles

1. **Flat Dependencies**: No transitive dependencies allowed
2. **Explicit**: Every dependency must be declared directly
3. **Deterministic**: Same `pumpkin.toml` → Same packages, always
4. **Secure**: Read-only, no scripts, no surprises

---

## 1. Package Format

### pumpkin.toml

Every Pumpkin project has a manifest file at the root.

**Example:**

```toml
[package]
name = "my-app"
version = "1.0.0"
authors = ["Alice <alice@example.com>"]
description = "A simple Pumpkin application"

[dependencies]
json-parser = "2.1.0"
http-client = "1.3.2"
```

### Fields

#### `[package]`

- **name** (required): Package name, lowercase, hyphens allowed
- **version** (required): Semantic version (MAJOR.MINOR.PATCH)
- **authors** (optional): List of author names/emails
- **description** (optional): Short description

#### `[dependencies]`

Key-value pairs: `package-name = "exact-version"`

**Critical Rule**: Only **exact versions** allowed. No `^`, `~`, or ranges.

---

## 2. Package Structure

A published package is just a directory:

```
my-package/
├── pumpkin.toml          # Manifest
├── src/
│   └── main.pumpkin      # Entry point
└── README.md             # Documentation
```

**Constraints:**

- No subdirectories in `src/` (flat structure)
- No build scripts
- No native code
- Pure Pumpkin only

---

## 3. CLI Commands

### `pumpkin init`

Creates a new project with default `pumpkin.toml`.

**Usage:**

```bash
pumpkin init my-project
```

**Generated `pumpkin.toml`:**

```toml
[package]
name = "my-project"
version = "0.1.0"
authors = []
description = ""

[dependencies]
```

---

### `pumpkin add <package>`

Adds a dependency with exact version pinning.

**Usage:**

```bash
pumpkin add json-parser
```

**Behavior:**

1. Fetch latest version from registry (e.g., `2.1.0`)
2. Download package to local cache (`~/.pumpkin/packages/`)
3. Add to `pumpkin.toml`:

   ```toml
   json-parser = "2.1.0"
   ```

4. Create/update `pumpkin.lock` with content hash

**Add Specific Version:**

```bash
pumpkin add json-parser@2.0.5
```

---

### `pumpkin remove <package>`

Removes a dependency.

**Usage:**

```bash
pumpkin remove json-parser
```

**Behavior:**

1. Remove from `pumpkin.toml`
2. Remove from `pumpkin.lock`
3. Leave in cache (for other projects)

---

### `pumpkin install`

Installs all dependencies from `pumpkin.toml`.

**Behavior:**

1. Read `pumpkin.toml`
2. For each dependency:
   - Check local cache
   - Download if missing
   - Verify content hash (from `pumpkin.lock`)
3. No transitive dependencies (dependency packages' dependencies are ignored)

---

### `pumpkin publish`

Publishes a package to the registry.

**Requirements:**

- Valid `pumpkin.toml`
- All files under 10MB total
- No nested dependencies

**Behavior:**

1. Validate manifest
2. Create `.tar.gz` archive
3. Upload to registry
4. Generate content hash

---

## 4. Package Resolution

### Algorithm: Flat Resolution

```
For each direct dependency in pumpkin.toml:
    1. Fetch exact version from cache or registry
    2. Place in project's lib/ directory
    3. Do NOT fetch its dependencies
End
```

**Example:**

Your `pumpkin.toml`:

```toml
[dependencies]
json-parser = "2.1.0"
```

Even if `json-parser` depends on `string-utils`, you **must** declare `string-utils` yourself if you use it.

**Benefit:** No hidden dependencies. No version conflicts. Total transparency.

---

## 5. Lock File (pumpkin.lock)

Ensures reproducible builds.

**Format:**

```toml
[[package]]
name = "json-parser"
version = "2.1.0"
hash = "sha256:a1b2c3d4e5f6..."

[[package]]
name = "http-client"
version = "1.3.2"
hash = "sha256:f6e5d4c3b2a1..."
```

**Generation:**

- Created/updated by `pumpkin add` and `pumpkin install`
- Committed to version control
- Verified on every install

---

## 6. Local Cache

Packages downloaded to `~/.pumpkin/packages/`:

```
~/.pumpkin/packages/
├── json-parser-2.1.0/
│   ├── pumpkin.toml
│   └── src/
└── http-client-1.3.2/
    ├── pumpkin.toml
    └── src/
```

**Behavior:**

- Shared across all projects
- Never deleted by package manager (manual cleanup only)
- Content-addressed (hash verified on use)

---

## 7. Import Resolution

When your code imports a package:

```pumpkin
import json from "json-parser"
```

**Resolution:**

1. Look in `pumpkin.toml` for `json-parser`
2. Find version (e.g., `2.1.0`)
3. Load from `~/.pumpkin/packages/json-parser-2.1.0/src/main.pumpkin`
4. No recursive imports from dependencies

---

## 8. Security Model

### Read-Only Packages

- Packages installed in cache are **immutable**
- No write permissions
- No execution of arbitrary code during install

### No Post-Install Scripts

- **Forbidden**: `postinstall`, `preinstall`, hooks
- Packages are data, not programs

### No Network Access at Runtime

- Packages run in same sandbox as user code
- No network I/O
- No file system writes

### Content Verification

- Every package has SHA-256 hash
- Verified on download
- Verified on use
- Mismatch = hard error

---

## 9. Registry

### Central Registry: `packages.pumpkin-lang.org`

**API Endpoints:**

- `GET /search?q=json` - Search packages
- `GET /packages/:name` - Package metadata
- `GET /packages/:name/:version` - Download `.tar.gz`
- `POST /packages` - Publish (requires auth)

**Metadata Response:**

```json
{
  "name": "json-parser",
  "version": "2.1.0",
  "description": "Fast JSON parser",
  "authors": ["Bob"],
  "hash": "sha256:a1b2c3...",
  "size": 12345,
  "published": "2026-01-05T12:00:00Z"
}
```

---

## 10. Example Package

### Creating `math-utils`

**1. Initialize:**

```bash
pumpkin init math-utils
cd math-utils
```

**2. Edit `pumpkin.toml`:**

```toml
[package]
name = "math-utils"
version = "1.0.0"
authors = ["Alice"]
description = "Common math functions"

[dependencies]
# None - pure utility package
```

**3. Create `src/main.pumpkin`:**

```pumpkin
# Public API exports
export function factorial(n) {
    let result = 1
    let i = n
    while i > 0 {
        result = result * i
        i = i - 1
    }
    return result
}

export function fibonacci(n) {
    if n <= 1 {
        return n
    }
    
    let a = 0
    let b = 1
    let i = 2
    
    while i <= n {
        let temp = a + b
        a = b
        b = temp
        i = i + 1
    }
    
    return b
}
```

**4. Publish:**

```bash
pumpkin publish
```

**5. Use in another project:**

```bash
cd ../my-app
pumpkin add math-utils

# In your code:
import math from "math-utils"
show math.factorial(5)  # 120
```

---

## 11. Dependency Hell Prevention

### Problem: How Pumpkin Avoids It

**Traditional Package Managers:**

```
A depends on B@2.0
A depends on C@1.0
C depends on B@1.0
→ Conflict! Which B?
```

**Pumpkin Solution:**

```
A declares: B@2.0, C@1.0
C's dependencies are INVISIBLE to A
If A needs what C needs, A must declare it
```

**Result:** No diamond dependencies. No conflicts. Explicit > Implicit.

---

## 12. Migration from v0.3 to v0.4

**v0.3** (No package manager):

- Manually copy `.pumpkin` files
- No versioning
- No sharing

**v0.4** (Package manager):

1. Run `pumpkin init` in existing project
2. Declare any vendored code as dependencies
3. Publish reusable modules

---

## 13. Limitations (By Design)

❌ **No Transitive Dependencies**

- You must declare every package you import
- No automatic "dependency of dependency" resolution

❌ **No Version Ranges**

- Only exact versions (`1.2.3`, not `^1.2.0`)
- Ensures determinism

❌ **No Private Registries (v0.4)**

- Only public registry initially
- Private registries may come in v0.5

❌ **No Monorepo Support**

- One `pumpkin.toml` = one package
- Workspaces not supported

---

## 14. Future Enhancements (Post-v0.4)

- **Private registries**: Self-hosted package servers
- **Dev dependencies**: Separate from runtime deps
- **Scripts**: Safe, sandboxed build commands
- **Workspaces**: Manage multiple packages in one repo
