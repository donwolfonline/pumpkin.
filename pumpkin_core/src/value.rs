
// pumpkin_core/src/value.rs

use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;
use std::fmt;
use crate::errors::PumpkinError;
use crate::ast::SourceLocation;

use serde::{Deserialize, Serialize}; // Added imports

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", content = "value", rename_all = "lowercase")] // Matches TS interface
pub enum PumpkinValue {
    Number(f64),
    String(String),
    Boolean(bool),
    Null,
    Function(String), 
    List(Rc<RefCell<Vec<PumpkinValue>>>),
    Object(Rc<RefCell<HashMap<String, PumpkinValue>>>),
}

impl fmt::Display for PumpkinValue {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            PumpkinValue::Number(n) => write!(f, "{}", n),
            PumpkinValue::String(s) => write!(f, "\"{}\"", s),
            PumpkinValue::Boolean(b) => write!(f, "{}", b),
            PumpkinValue::Null => write!(f, "null"),
            PumpkinValue::Function(name) => write!(f, "<function {}>", name),
            PumpkinValue::List(l) => {
                 let v = l.borrow();
                 write!(f, "[")?;
                 for (i, item) in v.iter().enumerate() {
                     if i > 0 { write!(f, ", ")?; }
                     write!(f, "{}", item)?;
                 }
                 write!(f, "]")
             },
             PumpkinValue::Object(o) => {
                 let m = o.borrow();
                 write!(f, "{{")?;
                 for (i, (k, v)) in m.iter().enumerate() {
                     if i > 0 { write!(f, ", ")?; }
                     write!(f, "{}: {}", k, v)?;
                 }
                 write!(f, "}}")
             }
        }
    }
}

impl PumpkinValue {
    pub fn type_name(&self) -> &'static str {
        match self {
            PumpkinValue::Number(_) => "number",
            PumpkinValue::String(_) => "string",
            PumpkinValue::Boolean(_) => "boolean",
            PumpkinValue::Null => "null",
            PumpkinValue::Function(_) => "function",
            PumpkinValue::List(_) => "list",
            PumpkinValue::Object(_) => "object",
        }
    }

    pub fn add(&self, other: &Self) -> Result<PumpkinValue, PumpkinError> {
        match (self, other) {
            (PumpkinValue::Number(a), PumpkinValue::Number(b)) => Ok(PumpkinValue::Number(a + b)),
            (PumpkinValue::String(a), PumpkinValue::String(b)) => Ok(PumpkinValue::String(format!("{}{}", a, b))),
            (PumpkinValue::String(a), b) => Ok(PumpkinValue::String(format!("{}{}", a, b))),
            (a, PumpkinValue::String(b)) => Ok(PumpkinValue::String(format!("{}{}", a, b))),
            
            _ => Err(PumpkinError::type_mismatch(
                "number or string", 
                &format!("{} + {}", self.type_name(), other.type_name()),
                None
            )),
        }
    }

    pub fn sub(&self, other: &Self) -> Result<PumpkinValue, PumpkinError> {
        match (self, other) {
            (PumpkinValue::Number(a), PumpkinValue::Number(b)) => Ok(PumpkinValue::Number(a - b)),
            _ => Err(PumpkinError::type_mismatch("number", self.type_name(), None)),
        }
    }

    pub fn mul(&self, other: &Self) -> Result<PumpkinValue, PumpkinError> {
        match (self, other) {
            (PumpkinValue::Number(a), PumpkinValue::Number(b)) => Ok(PumpkinValue::Number(a * b)),
            _ => Err(PumpkinError::type_mismatch("number", self.type_name(), None)),
        }
    }

    pub fn div(&self, other: &Self) -> Result<PumpkinValue, PumpkinError> {
        match (self, other) {
            (PumpkinValue::Number(a), PumpkinValue::Number(b)) => {
                if *b == 0.0 {
                    return Err(PumpkinError::DivisionByZeroError { 
                        location: None 
                    });
                }
                Ok(PumpkinValue::Number(a / b))
            },
            _ => Err(PumpkinError::type_mismatch("number", self.type_name(), None)),
        }
    }
    
    pub fn is_truthy(&self) -> bool {
        match self {
            PumpkinValue::Boolean(b) => *b,
            PumpkinValue::Null => false,
            PumpkinValue::Number(n) => *n != 0.0,
            _ => true,
        }
    }
}
