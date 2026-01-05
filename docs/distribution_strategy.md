# Pumpkin Distribution Strategy v0.1 📦

**Goal:** Install Pumpkin in under 2 minutes via `npm install -g pumpkin-lang`.

## 1. Installation Command

```bash
npm install -g pumpkin-lang
```

After installation, users can immediately run:

```bash
pumpkin run hello.pumpkin
pumpkin repl
pumpkin version
```

## 2. Package Structure

The npm package includes:

```
pumpkin-lang/
├── package.json
├── README.md
├── LICENSE
├── dist/
│   ├── src/              # Compiled TypeScript (CLI, Parser)
│   ├── grammar/          # Ohm grammar files
│   └── pkg/              # WASM artifacts
│       ├── pumpkin_core_bg.wasm
│       ├── pumpkin_core.js
│       └── pumpkin_core.d.ts
└── bin/
    └── pumpkin -> dist/src/cli.js
```

## 3. Build Pipeline

### Step 1: Build Rust Core to WASM

```bash
cd pumpkin_core
wasm-pack build --target nodejs --out-dir ../dist/pkg
```

**Output:** `dist/pkg/` contains WASM binary and JS bindings.

### Step 2: Build TypeScript

```bash
npm run build  # tsc && cp -r grammar dist/
```

**Output:** `dist/src/` contains compiled JS files.

### Step 3: Publish to npm

```bash
npm publish
```

## 4. package.json Configuration

```json
{
  "name": "pumpkin-lang",
  "version": "0.1.0",
  "description": "A friendly, interpreted language for education",
  "main": "dist/src/index.js",
  "bin": {
    "pumpkin": "./dist/src/cli.js"
  },
  "files": [
    "dist/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "prebuild": "cd pumpkin_core && wasm-pack build --target nodejs --out-dir ../dist/pkg",
    "build": "tsc && cp -r grammar dist/",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["language", "interpreter", "education", "wasm"],
  "license": "MIT"
}
```

## 5. Release Artifacts

Each release includes:

1. **npm Package:** Published to npmjs.com (primary distribution).
2. **GitHub Release:**
    * Source tarball: `pumpkin-v0.1.0.tar.gz`
    * WASM binary: `pumpkin_core_bg.wasm` (for reference)
    * Changelog: `CHANGELOG.md`

## 6. Versioning Rules (Semantic Versioning)

* **v0.1.x:** Initial release, breaking changes allowed.
* **v0.2.0:** Language spec changes or major features.
* **v0.x.y:** Bug fixes and patches.
* **v1.0.0:** Stable API, backwards compatibility guaranteed.

## 7. Installation Speed

**Target:** Under 2 minutes.

**Breakdown:**

* Download package: ~10 MB (WASM + JS) → ~10-20s on moderate connection.
* Install dependencies: None (all bundled) → ~5s.
* Link binary: Automatic via npm → ~1s.

**Total:** ~30 seconds typical, <2 minutes on slow connections. ✅

## 8. Browser Distribution (Playground)

For the web playground, the WASM artifacts are served statically:

```bash
cd pumpkin_core
wasm-pack build --target web --out-dir ../website/public/pkg
```

The website imports:

```html
<script type="module">
  import init from './pkg/pumpkin_core.js';
  await init();
</script>
```

## 9. Future Enhancements

* **CDN Hosting:** Host WASM on unpkg/jsdelivr for faster web loading.
* **Native Binaries:** For CLI, ship OS-specific binaries (macOS/Linux/Windows) to skip WASM overhead.
* **Docker Image:** `docker run pumpkin/pumpkin-lang` for sandboxed execution.
