
// pumpkin_core/src/wasm.rs

use wasm_bindgen::prelude::*;
use crate::{Environment, execute_in_env, ExecutionResult, Program};

#[wasm_bindgen]
pub struct PumpkinVM {
    // Persistent environment across calls
    env: Environment,
}

#[wasm_bindgen]
impl PumpkinVM {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PumpkinVM {
        utils::set_panic_hook();
        PumpkinVM {
            env: Environment::new(),
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
                 // Construct a manual error result if JSON parsing fails
                 let err_result = ExecutionResult {
                     success: false,
                     error: Some(crate::errors::PumpkinError::runtime(&format!("JSON Parse Error: {}", e), None)),
                     output: vec![],
                     return_value: None,
                 };
                 // Safety: This unwrap is safe because ExecutionResult is strictly serializable
                 return serde_wasm_bindgen::to_value(&err_result).unwrap();
             }
        };

        // 2. Execute in persistent environment
        let result = execute_in_env(&program, &self.env);

        // 3. Return Serialized Result (JsValue object)
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
