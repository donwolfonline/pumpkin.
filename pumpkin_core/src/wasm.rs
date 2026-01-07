// pumpkin_core/src/wasm.rs

use crate::{Environment, ExecutionResult, Program};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PumpkinVM {
    // Persistent environment across calls
    env: std::rc::Rc<Environment>,
}

#[wasm_bindgen]
impl PumpkinVM {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PumpkinVM {
        utils::set_panic_hook();
        PumpkinVM {
            env: std::rc::Rc::new(Environment::new()),
        }
    }

    /// Run a serialized Pumpkin AST against the persistent VM environment.
    /// Input: JSON string of Program AST.
    /// Output: JSON string of ExecutionResult.
    pub fn run(&self, ast_json: &str) -> JsValue {
        // 1. Parse JSON to Program
        let program: Program = match serde_json::from_str(ast_json) {
            Ok(p) => p,
            Err(e) => {
                let err_result = ExecutionResult {
                    success: false,
                    error: Some(crate::errors::PumpkinError::runtime(
                        &format!("JSON Parse Error: {}", e),
                        None,
                    )),
                    output: vec![],
                    return_value: None,
                };
                return serde_wasm_bindgen::to_value(&err_result).unwrap();
            }
        };

        // 2. Compile to Bytecode
        let compiler = crate::compiler::Compiler::new();
        let chunk = match compiler.compile(&program) {
            Ok(c) => c,
            Err(e) => {
                let err_result = ExecutionResult {
                    success: false,
                    error: Some(e),
                    output: vec![],
                    return_value: None,
                };
                return serde_wasm_bindgen::to_value(&err_result).unwrap();
            }
        };

        // 3. Execute VM
        let mut vm = crate::vm::VM::new(chunk, self.env.clone());
        let vm_result = vm.run();
        let output = vm.get_output();

        let result = match vm_result {
            Ok(val) => ExecutionResult {
                success: true,
                output,
                return_value: Some(val),
                error: None,
            },
            Err(e) => ExecutionResult {
                success: false,
                output,
                return_value: None,
                error: Some(e),
            },
        };

        serde_wasm_bindgen::to_value(&result).unwrap()
    }
}

// Utility for better panic messages in browser console
mod utils {
    pub fn set_panic_hook() {
        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();
    }
}
