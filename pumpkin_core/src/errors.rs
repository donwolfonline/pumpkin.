
// pumpkin_core/src/errors.rs

use crate::ast::SourceLocation;
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "kind")]
pub enum PumpkinError {
    RuntimeError {
         message: String,
         location: Option<SourceLocation>,
         hint: Option<String>,
    },
    TypeError {
         expected: String,
         actual: String,
         location: Option<SourceLocation>,
    },
    UndefinedVariableError {
         name: String,
         location: Option<SourceLocation>,
         hint: Option<String>,
    },
    DivisionByZeroError {
         location: Option<SourceLocation>,
    },
    ResourceExhausted {
        message: String,
        location: Option<SourceLocation>,
    },
}

impl PumpkinError {
    
    pub fn runtime(msg: &str, loc: Option<SourceLocation>) -> Self {
        PumpkinError::RuntimeError {
            message: msg.to_string(),
            location: loc,
            hint: None,
        }
    }

    pub fn type_mismatch(expected: &str, actual: &str, loc: Option<SourceLocation>) -> Self {
        PumpkinError::TypeError {
            expected: expected.to_string(),
            actual: actual.to_string(),
            location: loc,
        }
    }
    
    // Formatting helpers
    pub fn pretty_print(&self, _source_code: &str) -> String {
        // In real CLI, we would use source_code lines. for now just formatting.
        match self {
            PumpkinError::RuntimeError { message, location, hint } => {
                format!("🚨 Runtime Error: {}\n{}", message, self.format_loc(location, hint))
            }
            PumpkinError::TypeError { expected, actual, location } => {
                format!("🚨 Type Error: Expected {}, but got {}.\n{}", expected, actual, self.format_loc(location, &None))
            }
            PumpkinError::UndefinedVariableError { name, location, hint } => {
                format!("🚨 Undefined Variable: '{}'.\n{}", name, self.format_loc(location, hint))
            },
            PumpkinError::DivisionByZeroError { location } => {
                format!("🚨 Math Error: Division by zero is not allowed.\n{}", self.format_loc(location, &None))
            }
            PumpkinError::ResourceExhausted { message, location } => {
                format!("🛑 Resource Limits: {}\n{}", message, self.format_loc(location, &None))
            }
        }
    }

    fn format_loc(&self, loc: &Option<SourceLocation>, hint: &Option<String>) -> String {
        let loc_str = if let Some(l) = loc {
            format!("   at line {}, column {}", l.line, l.col)
        } else {
            "   (Unknown location)".to_string()
        };
        
        if let Some(h) = hint {
            format!("{}\n   💡 Hint: {}", loc_str, h)
        } else {
            loc_str
        }
    }
}

// Result trait
impl fmt::Display for PumpkinError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl std::error::Error for PumpkinError {}
