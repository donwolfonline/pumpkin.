
// pumpkin_core/src/lib.rs

pub mod ast;
pub mod env;
pub mod errors;
pub mod interpreter;
pub mod value;

// Enable WASM module
pub mod wasm;

use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::rc::Rc; // Added Rc if needed for internal structures

pub use crate::ast::Program;
pub use crate::env::Environment;
pub use crate::interpreter::{evaluate, Host};
pub use crate::value::PumpkinValue;
pub use crate::errors::PumpkinError;

// -----------------------------------------------------------------------------
// Public Execution API
// -----------------------------------------------------------------------------

#[derive(Debug, Serialize, Deserialize)]
pub struct ExecutionResult {
    pub success: bool,
    pub output: Vec<String>,
    pub return_value: Option<PumpkinValue>,
    pub error: Option<PumpkinError>,
}

struct CapturingHost {
    output: RefCell<Vec<String>>,
}

impl CapturingHost {
    fn new() -> Self {
        Self { output: RefCell::new(Vec::new()) }
    }
}

impl Host for CapturingHost {
    fn show(&self, msg: &str) {
        self.output.borrow_mut().push(msg.to_string());
    }
}

/// Executes a generic Pumpkin Program and returns a structured result.
pub fn execute(program: &Program) -> ExecutionResult {
    let env = Environment::new();
    let host = CapturingHost::new();

    match evaluate(program, &env, &host) {
        Ok(val) => ExecutionResult {
            success: true,
            output: host.output.take(),
            return_value: Some(val),
            error: None,
        },
        Err(err) => ExecutionResult {
            success: false,
            output: host.output.take(), 
            return_value: None,
            error: Some(err),
        },
    }
}

/// Execute with a pre-existing Environment (e.g. for REPL)
pub fn execute_in_env(program: &Program, env: &Environment) -> ExecutionResult {
    let host = CapturingHost::new();
    match evaluate(program, env, &host) {
         Ok(val) => ExecutionResult {
            success: true,
            output: host.output.take(),
            return_value: Some(val),
            error: None,
        },
        Err(err) => ExecutionResult {
            success: false,
            output: host.output.take(),
            return_value: None,
            error: Some(err),
        },
    }
}
