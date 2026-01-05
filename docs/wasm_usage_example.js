// docs/wasm_usage_example.js

/*
  How to use the Pumpkin WASM Core in a browser environment.
  Prerequisite: `wasm-pack build --target web` has been run.
*/

import init, { PumpkinVM } from './pkg/pumpkin_core.js';

async function runPumpkin() {
    console.log("Loading WASM...");
    await init();
    console.log("WASM Loaded!");

    // 1. Create a VM instance (maintains scope)
    const vm = new PumpkinVM();

    // 2. Define a Pumpkin Program (JSON AST)
    // Corresponds to: let x = 10; show x;
    const ast = {
        kind: "Program",
        body: [
            {
                kind: "LetStmt",
                name: { kind: "Identifier", name: "x" },
                value: { kind: "Literal", value: 10 }
            },
            {
                kind: "ShowStmt",
                expression: { kind: "Identifier", name: "x" }
            }
        ]
    };

    // 3. Run it
    // Returns: { success: true, output: ["10"], return_value: null, error: null }
    const result = vm.run(JSON.stringify(ast));

    // 4. Handle Output
    if (result.success) {
        console.log("Output:", result.output);
    } else {
        console.error("Error:", result.error);
    }
}

// runPumpkin();
