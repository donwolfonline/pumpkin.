
// pumpkin_core/src/env.rs

use std::collections::HashMap;
use std::rc::Rc;
use std::cell::RefCell;
use crate::value::PumpkinValue;
use crate::errors::PumpkinError;

#[derive(Debug, Clone, PartialEq)]
pub struct Environment {
    vars: RefCell<HashMap<String, PumpkinValue>>,
    parent: Option<Rc<Environment>>,
}

impl Environment {
    pub fn new() -> Self {
        Environment {
            vars: RefCell::new(HashMap::new()),
            parent: None,
        }
    }

    pub fn new_enclosed(parent: Rc<Environment>) -> Self {
        Environment {
            vars: RefCell::new(HashMap::new()),
            parent: Some(parent),
        }
    }

    pub fn define(&self, name: &str, value: PumpkinValue) {
        self.vars.borrow_mut().insert(name.to_string(), value);
    }

    pub fn get(&self, name: &str) -> Option<PumpkinValue> {
        if let Some(val) = self.vars.borrow().get(name) {
            return Some(val.clone());
        }

        if let Some(parent) = &self.parent {
            return parent.get(name);
        }

        None
    }

    pub fn assign(&self, name: &str, value: PumpkinValue) -> Result<(), PumpkinError> {
        // Check local scope
        if self.vars.borrow().contains_key(name) {
            self.vars.borrow_mut().insert(name.to_string(), value);
            return Ok(());
        }

        // Check parent scope
        if let Some(parent) = &self.parent {
            return parent.assign(name, value);
        }

        // Renamed error variant
        Err(PumpkinError::UndefinedVariableError { 
            name: name.to_string(), 
            location: None, 
            hint: Some("Did you declare it with 'let'?".to_string()) 
        })
    }
}
