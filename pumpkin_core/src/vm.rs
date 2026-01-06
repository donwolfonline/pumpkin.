use crate::chunk::{Chunk, OpCode};
use crate::value::{PumpkinValue, PumpkinFunction};
use crate::errors::PumpkinError;
use std::rc::Rc;
use std::collections::HashMap;

pub enum StepResult {
    Continue,
    Return(PumpkinValue),
    Done,
}

struct CallFrame {
    // We hold a reference to the function being executed
    // The Chunk is inside the Function.
    function: Rc<PumpkinFunction>,
    ip: usize,
    bp: usize, // Base Pointer: index in VM stack where this frame's locals start
}

pub struct VM {
    frames: Vec<CallFrame>,
    stack: Vec<PumpkinValue>,
    globals: Rc<crate::env::Environment>, 
    trace: bool,
    output_buffer: Vec<String>,
    
    // Module System
    pub module_registry: HashMap<String, PumpkinValue>, 
    pub current_exports: HashMap<String, PumpkinValue>, 
}

impl VM {
    pub fn new(script_chunk: Chunk, globals: Rc<crate::env::Environment>) -> Self {
        // Wrap the top-level script in a pseudo-function
        let main_func = Rc::new(PumpkinFunction {
            arity: 0,
            chunk: script_chunk,
            name: "<script>".to_string(),
        });

        let main_frame = CallFrame {
            function: main_func,
            ip: 0,
            bp: 0,
        };

        Self {
            frames: vec![main_frame],
            stack: Vec::with_capacity(256),
            globals,
            trace: false,
            output_buffer: Vec::new(),
            module_registry: HashMap::new(),
            current_exports: HashMap::new(),
        }
    }
    
    pub fn with_tracing(mut self, trace: bool) -> Self {
        self.trace = trace;
        self
    }
    
    pub fn get_output(&self) -> Vec<String> {
        self.output_buffer.clone()
    }
    
    // Debugger Accessors
    pub fn ip(&self) -> usize { 
        if let Some(frame) = self.frames.last() { frame.ip } else { 0 }
    }
    
    pub fn chunk(&self) -> &Chunk {
        if let Some(frame) = self.frames.last() {
            &frame.function.chunk
        } else {
            // Should not happen in valid state, but need to return ref.
            // We can panic or return empty. Lifetimes are tricky here if we return ref.
            // Since we can't return reference to temporary, and frames might be empty?
            // For now, assume frames not empty. In `new` we push one.
            panic!("VM has no frames");
        }
    }
     pub fn get_stack_names(&self) -> Vec<String> {
        self.stack.iter().map(|v| format!("{}", v)).collect()
    }

    pub fn run(&mut self) -> Result<PumpkinValue, PumpkinError> {
        loop {
            match self.step()? {
                StepResult::Continue => continue,
                StepResult::Return(val) => return Ok(val),
                StepResult::Done => return Ok(PumpkinValue::Null),
            }
        }
    }

    pub fn step(&mut self) -> Result<StepResult, PumpkinError> {
        if self.frames.is_empty() {
             return Ok(StepResult::Done);
        }

        if self.trace {
            self.trace_execution();
        }

        // We need to read byte from current frame's chunk
        let byte = self.read_byte();
        // Since read_byte might have failed (end of code), we check?
        // Actually read_byte returns 0 if OOB. But we should check frame.ip vs len.
        // Let's assume valid bytecode structure or handle 0 as Return/Error?
        // Better: check bounds inside read_byte logic relative to frame.
        
        // Note: OpCode::from(0) is Return. So EOF implicit return.
        
        let op = OpCode::from(byte);
        
        match op {
            OpCode::Return => {
                let result = self.safe_pop().unwrap_or(PumpkinValue::Null);
                
                let frame = self.frames.pop().unwrap(); // Pop current frame
                
                if self.frames.is_empty() {
                    // Script finished
                    return Ok(StepResult::Return(result));
                }
                
                // Discard locals: remove everything from stack >= frame.bp
                // Note: bp includes arguments? 
                // Usually arguments are below BP or at BP.
                // In my design: stack: [arg1, arg2, BP_start_locals...]
                // We should pop args too usually.
                self.stack.truncate(frame.bp);
                
                // Push result back for the caller
                self.push(result);
                
                Ok(StepResult::Continue)
            },
            OpCode::Call => {
                let arg_count = self.read_byte() as usize;
                
                // Callee is at stack[len - 1 - arg_count]
                // e.g. [func, arg1] (count=1). len=2. index=2-1-1=0.
                let callee_idx = self.stack.len().checked_sub(1 + arg_count)
                    .ok_or(self.runtime_error("Stack underflow calling function"))?;
                    
                let callee = &self.stack[callee_idx];
                
                if let PumpkinValue::Function(func_rc) = callee {
                    let func = func_rc.clone(); // Clone RC
                    
                    if arg_count != func.arity {
                        return Err(self.runtime_error(&format!("Expected {} args, got {}", func.arity, arg_count)));
                    }
                    
                    // Create new frame
                    // BP points to where args start (or func?). 
                    // Usually BP points to slot 0 of the function's window.
                    // If we treat 'callee' slot as slot 0? Or arg1 as slot 0?
                    // Let's say locals 0..N are args.
                    // So BP = callee_idx + 1.
                    // This creates a window [arg1, arg2...].
                    // The function value itself stays on stack "below" window? 
                    // Or we replace function slot with return value later?
                    // Let's set BP = callee_idx. The function is local 0 ??
                    // No, usually args are locals 0..N-1.
                    // Let's set BP at `callee_idx + 1`. slot 0 = arg 1.
                    let bp = callee_idx + 1;
                    
                    let new_frame = CallFrame {
                        function: func,
                        ip: 0,
                        bp,
                    };
                    
                    if self.frames.len() >= 64 {
                        return Err(self.runtime_error("Stack overflow"));
                    }
                    
                    self.frames.push(new_frame);
                    Ok(StepResult::Continue)
                    
                } else {
                     return Err(self.runtime_error("Can only call functions"));
                }
            },
            OpCode::Print => {
                let val = self.safe_pop()?;
                let output = format!("{}", val);
                if self.trace { println!("> {}", output); }
                self.output_buffer.push(output);
                 Ok(StepResult::Continue)
            },
            OpCode::Constant => {
                let constant_idx = self.read_byte() as usize;
                let frame = self.frames.last().unwrap();
                if constant_idx >= frame.function.chunk.constants.len() {
                        return Err(self.runtime_error("Constant index out of bounds"));
                }
                let constant = frame.function.chunk.constants[constant_idx].clone();
                self.push(constant);
                 Ok(StepResult::Continue)
            },
            OpCode::Nil => { self.push(PumpkinValue::Null); Ok(StepResult::Continue) },
            OpCode::True => { self.push(PumpkinValue::Boolean(true)); Ok(StepResult::Continue) },
            OpCode::False => { self.push(PumpkinValue::Boolean(false)); Ok(StepResult::Continue) },
            OpCode::Pop => { self.safe_pop()?; Ok(StepResult::Continue) },
            
            OpCode::Add => {
                let b = self.safe_pop()?;
                let a = self.safe_pop()?;
                self.push(a.add(&b)?);
                Ok(StepResult::Continue)
            },
            OpCode::Sub => {
                let b = self.safe_pop()?;
                let a = self.safe_pop()?;
                self.push(a.sub(&b)?);
                Ok(StepResult::Continue)
            },
            OpCode::Mul => {
                let b = self.safe_pop()?;
                let a = self.safe_pop()?;
                self.push(a.mul(&b)?);
                Ok(StepResult::Continue)
            },
            OpCode::Div => {
                let b = self.safe_pop()?;
                let a = self.safe_pop()?;
                self.push(a.div(&b)?);
                Ok(StepResult::Continue)
            },
            OpCode::Equal => {
                let b = self.safe_pop()?;
                let a = self.safe_pop()?;
                self.push(PumpkinValue::Boolean(a == b));
                Ok(StepResult::Continue)
            },
            OpCode::Greater => {
                    let b = self.safe_pop()?;
                    let a = self.safe_pop()?;
                    match (a, b) {
                        (PumpkinValue::Number(n1), PumpkinValue::Number(n2)) => self.push(PumpkinValue::Boolean(n1 > n2)),
                        _ => return Err(self.runtime_error("Type error > operands must be numbers")),
                    }
                    Ok(StepResult::Continue)
            },
            OpCode::Less => {
                    let b = self.safe_pop()?;
                    let a = self.safe_pop()?;
                    match (a, b) {
                        (PumpkinValue::Number(n1), PumpkinValue::Number(n2)) => self.push(PumpkinValue::Boolean(n1 < n2)),
                        _ => return Err(self.runtime_error("Type error < operands must be numbers")),
                    }
                    Ok(StepResult::Continue)
            },
            OpCode::Not => {
                let a = self.safe_pop()?;
                self.push(PumpkinValue::Boolean(!a.is_truthy()));
                Ok(StepResult::Continue)
            },
            
            OpCode::GetGlobal => {
                let name_idx = self.read_byte() as usize;
                let frame = self.frames.last().unwrap();
                let name_val = &frame.function.chunk.constants[name_idx];
                if let PumpkinValue::String(name) = name_val {
                    // name is Rc<String>. Environment expects strict string likely.
                    let val = self.globals.get(name).ok_or_else(|| {
                        self.runtime_error(&format!("Undefined variable '{}'", name))
                    })?;
                    self.push(val);
                } else {
                    return Err(self.runtime_error("Corrupt bytecode: Global name not string"));
                }
                Ok(StepResult::Continue)
            },
            OpCode::SetGlobal => {
                let name_idx = self.read_byte() as usize;
                let frame = self.frames.last().unwrap();
                let name_val = &frame.function.chunk.constants[name_idx];
                if let PumpkinValue::String(name) = name_val {
                        let val = self.peek(0).ok_or(self.runtime_error("Stack underflow on SetGlobal"))?.clone();
                        // name is Rc<String>, assign takes &String usually.
                        if self.globals.assign(name, val.clone()).is_err() {
                            self.globals.define(name.to_string(), val); // Define usually takes String ownership? Check env.
                        }
                }
                Ok(StepResult::Continue)
            },
            
            // Locals
            OpCode::GetLocal => {
                let slot = self.read_byte() as usize;
                let frame = self.frames.last().unwrap();
                // Access stack relative to BP
                let absolute_slot = frame.bp + slot;
                if absolute_slot >= self.stack.len() {
                     return Err(self.runtime_error("Local variable slot OOB"));
                }
                self.push(self.stack[absolute_slot].clone());
                Ok(StepResult::Continue)
            },
            OpCode::SetLocal => {
                let slot = self.read_byte() as usize;
                let frame = self.frames.last().unwrap();
                let absolute_slot = frame.bp + slot;
                // Peek val
                let val = self.peek(0).ok_or(self.runtime_error("Stack underflow SetLocal"))?.clone();
                if absolute_slot >= self.stack.len() {
                    // Usually locals are initialized/pushed before Set?
                    // If we are defining a local, we just Push? 
                    // No, SetLocal replaces existing slot.
                    // Compiler must guarantee slot exists (arguments or previously pushed locals).
                    return Err(self.runtime_error("Local variable slot OOB (Set)"));
                }
                self.stack[absolute_slot] = val;
                Ok(StepResult::Continue)
            },
            
            OpCode::Jump => {
                let offset = self.read_u16();
                let frame = self.frames.last_mut().unwrap();
                frame.ip += offset as usize;
                Ok(StepResult::Continue)
            },
            OpCode::JumpIfFalse => {
                let offset = self.read_u16();
                let cond = self.peek(0).ok_or(self.runtime_error("Stack underflow JumpIfFalse"))?;
                if !cond.is_truthy() {
                    let frame = self.frames.last_mut().unwrap();
                    frame.ip += offset as usize;
                }
                Ok(StepResult::Continue)
            },
            OpCode::Loop => {
                let offset = self.read_u16();
                let frame = self.frames.last_mut().unwrap();
                frame.ip -= offset as usize;
                Ok(StepResult::Continue)
            },
            
            // --- Module Ops (reuse logic but context is frame) ---
            OpCode::Import => { 
                self.run_import_op()?; // Extracted? Or inline.
                Ok(StepResult::Continue)
            },
            OpCode::Export => {
                 self.run_export_op()?;
                 Ok(StepResult::Continue)
            },
            OpCode::ArrayLit => {
                let count = self.read_u16() as usize;
                
                // Pop count elements
                // They are on stack in order: [e1, e2, e3] (pushed last is e3)
                // If we want array [e1, e2, e3], we need to pop into vec in reverse, then reverse vec?
                // Or split off stack.
                // Stack: [..., e1, e2, e3]
                // We want to remove last count elements and put them in a vector.
                let start_idx = self.stack.len().checked_sub(count)
                    .ok_or(self.runtime_error("Stack underflow ArrayLit"))?;
                
                // Drain returns iterator, collect into Vec
                let elements: Vec<PumpkinValue> = self.stack.drain(start_idx..).collect();
                
                let list_val = PumpkinValue::List(Rc::new(RefCell::new(elements)));
                self.push(list_val);
                Ok(StepResult::Continue)
            },
            OpCode::IndexGet => {
                 let index_val = self.safe_pop()?;
                 let obj = self.safe_pop()?;
                 
                 match obj {
                     PumpkinValue::List(list_rc) => {
                         let list = list_rc.borrow();
                         match index_val {
                             PumpkinValue::Number(n) => {
                                 let idx = n as usize;
                                 if n < 0.0 || idx >= list.len() {
                                     return Err(self.runtime_error("Index out of bounds"));
                                 }
                                 self.push(list[idx].clone());
                             },
                             _ => return Err(self.runtime_error("Index must be a number")),
                         }
                     },
                     // Handle String indexing? Maybe later.
                     _ => return Err(self.runtime_error("IndexGet on non-agregate")),
                 }
                 Ok(StepResult::Continue)
            },
            OpCode::IndexSet => {
                let val = self.safe_pop()?;
                let index_val = self.safe_pop()?;
                let obj = self.safe_pop()?; // The array
                
                match obj {
                    PumpkinValue::List(list_rc) => {
                        let mut list = list_rc.borrow_mut();
                         match index_val {
                             PumpkinValue::Number(n) => {
                                 let idx = n as usize;
                                 if n < 0.0 || idx >= list.len() {
                                     return Err(self.runtime_error("Index out of bounds"));
                                 }
                                 list[idx] = val.clone();
                                 self.push(val); // Assignment expression result
                             },
                             _ => return Err(self.runtime_error("Index must be a number")),
                         }
                    },
                    _ => return Err(self.runtime_error("IndexSet on non-list")),
                }
                Ok(StepResult::Continue)
            },

            OpCode::GetProp => {
                self.run_get_prop()?;
                Ok(StepResult::Continue)
            },
            
            _ => return Err(self.runtime_error(&format!("OpCode {:?} not implemented", op))),
        }
    }

    // --- Helpers (Updated for Frames) ---
    
    // Extracted Ops for brevity/cleanliness
    fn run_import_op(&mut self) -> Result<(), PumpkinError> {
        let name_idx = self.read_byte() as usize;
        let frame = self.frames.last().unwrap();
        let name_val = &frame.function.chunk.constants[name_idx];
        if let PumpkinValue::String(name) = name_val {
            if let Some(module) = self.module_registry.get(name.as_str()) {
                self.push(module.clone());
            } else {
                    return Err(self.runtime_error(&format!("Module '{}' not found", name)));
            }
        }
        Ok(())
    }
    
    fn run_export_op(&mut self) -> Result<(), PumpkinError> {
         let name_idx = self.read_byte() as usize;
         let frame = self.frames.last().unwrap();
         let name_val = &frame.function.chunk.constants[name_idx];
            if let PumpkinValue::String(name) = name_val {
                let val = self.safe_pop()?;
                self.current_exports.insert(name.to_string(), val);
            }
        Ok(())
    }
    
    fn run_get_prop(&mut self) -> Result<(), PumpkinError> {
        let prop_idx = self.read_byte() as usize;
        let frame = self.frames.last().unwrap();
        let prop_name = match &frame.function.chunk.constants[prop_idx] {
            PumpkinValue::String(s) => s.to_string(),
             _ => return Err(self.runtime_error("Property name must be string")),
        };
        
        let obj = self.safe_pop()?;
        if let PumpkinValue::Object(map_rc) = obj {
            let map = map_rc.borrow();
            if let Some(val) = map.get(&prop_name) {
                self.push(val.clone());
            } else {
                return Err(self.runtime_error(&format!("Property '{}' not found", prop_name)));
            }
        } else {
            return Err(self.runtime_error("GetProp target must be an Object"));
        }
        Ok(())
    }

    fn push(&mut self, value: PumpkinValue) {
        self.stack.push(value);
    }

    fn safe_pop(&mut self) -> Result<PumpkinValue, PumpkinError> {
        self.stack.pop().ok_or(self.runtime_error("Stack underflow"))
    }
    
    fn peek(&self, distance: usize) -> Option<&PumpkinValue> {
        if self.stack.len() <= distance { return None; }
        Some(&self.stack[self.stack.len() - 1 - distance])
    }

    fn read_byte(&mut self) -> u8 {
        let frame = self.frames.last_mut().unwrap();
        if frame.ip < frame.function.chunk.code.len() {
             let b = frame.function.chunk.code[frame.ip];
             frame.ip += 1;
             b
        } else {
            0
        }
    }
    
    fn read_u16(&mut self) -> u16 {
        let b1 = self.read_byte() as u16;
        let b2 = self.read_byte() as u16;
        (b1 << 8) | b2
    }
    
    fn runtime_error(&self, msg: &str) -> PumpkinError {
        // Use top frame for line
        if let Some(frame) = self.frames.last() {
             let line = if frame.ip > 0 && frame.ip <= frame.function.chunk.lines.len() {
                 frame.function.chunk.lines.get(frame.ip - 1).cloned()
             } else { None };
             
             PumpkinError::RuntimeError {
                message: msg.to_string(),
                location: line.map(|l| crate::ast::SourceLocation { line: l, col: 0, length: 0 }),
                hint: None,
            }
        } else {
            PumpkinError::RuntimeError { message: msg.to_string(), location: None, hint: None }
        }
    }
    
    fn trace_execution(&self) {
        print!("          ");
        for val in &self.stack {
            print!("[ {} ]", val);
        }
        println!();
    }
}
