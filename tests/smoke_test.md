# End-to-End Smoke Test Specification 🧪

**Status:** BLOCKS RELEASES ⛔
**Test File:** [`tests/smoke.pumpkin`](file:///Users/frederickdineen/pumpkin./tests/smoke.pumpkin)

## Test Purpose

Validates that Pumpkin v0.1 works correctly across all execution environments:

1. CLI (via Node.js + WASM)
2. Node.js programmatic API
3. Browser (WASM in Web Worker)

## Expected Output

All environments must produce **identical** output:

```
=== Pumpkin Smoke Test ===
"Pumpkin"
15
21
X is large
1
2
3
Test Complete!
```

## Test Coverage

The smoke test exercises:

* ✅ Variable declarations (`let`)
* ✅ Basic types (number, string, boolean)
* ✅ Arithmetic operators (`+`, `*`)
* ✅ `show` statement
* ✅ `if` conditionals
* ✅ `repeat` loops
* ✅ Variable reassignment

## Validation Steps

### 1. CLI Test

```bash
pumpkin run tests/smoke.pumpkin
```

**Expected:** Output matches specification above.
**Exit Code:** 0

### 2. Node.js API Test

```javascript
import { parseToAST } from './src/parser.js';
import init, { PumpkinVM } from './dist/pkg/pumpkin_core.js';
import fs from 'fs';

await init(fs.readFileSync('./dist/pkg/pumpkin_core_bg.wasm'));
const vm = new PumpkinVM();

const source = fs.readFileSync('./tests/smoke.pumpkin', 'utf-8');
const ast = parseToAST(source);
const result = vm.run(JSON.stringify(ast));

console.assert(result.success, 'Execution failed');
console.assert(result.output.length === 8, 'Wrong output length');
console.assert(result.output[0] === '=== Pumpkin Smoke Test ===');
```

**Expected:** All assertions pass.

### 3. Browser Test

```html
<!DOCTYPE html>
<html>
<head><title>Pumpkin Smoke Test</title></head>
<body>
<pre id="output"></pre>
<script type="module">
  import init, { PumpkinVM } from './pkg/pumpkin_core.js';
  
  await init();
  const vm = new PumpkinVM();
  
  // Fetch and run smoke test
  const response = await fetch('/tests/smoke.pumpkin');
  const source = await response.text();
  
  // Parse via TypeScript parser (loaded separately)
  const ast = parseToAST(source);
  const result = vm.run(JSON.stringify(ast));
  
  document.getElementById('output').textContent = result.output.join('\n');
  
  // Validate
  if (result.output.length !== 8) {
    throw new Error('Smoke test failed: wrong output length');
  }
</script>
</body>
</html>
```

**Expected:** Output renders correctly in browser console.

## Automation

Run all tests via:

```bash
./tests/run_smoke_test.sh
```

Script exits with code 1 if any test fails.

## Release Checklist

* [ ] CLI smoke test passes
* [ ] Node.js API smoke test passes
* [ ] Browser smoke test passes (manual verification)
* [ ] All outputs match exactly

**If any test fails, DO NOT RELEASE.**
