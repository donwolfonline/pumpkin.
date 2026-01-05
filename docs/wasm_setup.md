# WASM Setup & Build Guide 🕸️

Pumpkin Core is designed to be compiled to WebAssembly for use in the browser (or Node.js).

## 1. Prerequisites

You need `wasm-pack` installed:

```bash
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

## 2. Building for Web

To build the package for direct browser usage (ES modules):

```bash
cd pumpkin_core
wasm-pack build --target web
```

This generates a `pkg/` directory containing:

* `pumpkin_core_bg.wasm`: The binary.
* `pumpkin_core.js`: The JS bindings.

## 3. Usage in JavaScript

```html
<script type="module">
  import init, { PumpkinVM } from './pkg/pumpkin_core.js';

  async function run() {
    await init(); // Initialize WASM
    const vm = new PumpkinVM();
    
    // serialized AST from Ohm
    const astJson = "{\"kind\": \"Program\", ... }"; 
    
    const result = vm.run(astJson);
    console.log(result.output); // ["Hello World"]
  }
  
  run();
</script>
```

## 4. Development Notes

* **Panics:** `console_error_panic_hook` is enabled by default, so Rust panics will show up in the browser console with stack traces.
* **State:** `PumpkinVM` holds the `Environment`. Create a new instance to reset state.
