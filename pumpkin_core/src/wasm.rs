
// pumpkin_core/src/wasm.rs

use wasm_bindgen::prelude::*;
use crate::{Environment, execute_in_env, ExecutionResult, Program};

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
        // Set hard limit of 1,000,000 instructions for security
        let config = crate::interpreter::InterpreterConfig {
            max_instructions: 1_000_000,
        };

        // We need to implement Host trait for PumpkinVM or pass a temporary host
        // Since PumpkinVM doesn't implement Host yet, we need to handle output capture.
        // For now, let's create a temporary Host implementation that captures to a Vec.
        // Wait, execute_in_env was a helper in lib.rs. I need to check lib.rs or update this to call evaluate directly.
        // Assuming execute_in_env is updated or we call evaluate directly.
        
        // Let's call evaluate directly since we just changed its signature.
        // However, we need a Host.
        // In the previous code, execute_in_env was used. Let's assume we update execute_in_env in lib.rs?
        // No, I only touched interpreter.rs. I should check lib.rs OR instantiate a host here.
        
        // Let's implement a simple struct that implements Host
        struct WasmHost {
             output: std::cell::RefCell<Vec<String>>,
        }
        impl crate::interpreter::Host for WasmHost {
             fn show(&self, msg: &str) {
                 self.output.borrow_mut().push(msg.to_string());
             }
        }
        
        let host = WasmHost { output: std::cell::RefCell::new(vec![]) };
        
        let exec_result = crate::interpreter::evaluate(&program, self.env.clone(), &host, config);
        
        let result = match exec_result {
            Ok(val) => ExecutionResult {
                success: true,
                output: host.output.into_inner(),
                return_value: Some(format!("{}", val)), // simplistic for now
                error: None,
            },
            Err(e) => ExecutionResult {
                 success: false,
                 output: host.output.into_inner(), // Return partial output
                 return_value: None,
                 error: Some(e),
            }
        };

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
