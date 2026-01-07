// pumpkin_core/src/lib.rs

pub mod ast;
pub mod env;
pub mod errors;
// pub mod interpreter;
pub mod value;

// Enable WASM module
pub mod chunk;
pub mod compiler;
pub mod debugger;
pub mod vm;
pub mod wasm;

use serde::{Deserialize, Serialize};

pub use crate::ast::Program;
pub use crate::env::Environment;
pub use crate::errors::PumpkinError;
pub use crate::value::PumpkinValue;

// -----------------------------------------------------------------------------
// Public Execution API
// -----------------------------------------------------------------------------

#[derive(Debug, Serialize)]
pub struct ExecutionResult {
    pub success: bool,
    pub output: Vec<String>,
    pub return_value: Option<PumpkinValue>,
    pub error: Option<PumpkinError>,
}
