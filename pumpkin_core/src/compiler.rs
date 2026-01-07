use crate::ast::*;
use crate::chunk::{Chunk, OpCode};
use crate::errors::PumpkinError;
use crate::value::PumpkinValue;

use std::collections::HashMap;

pub struct Compiler {
    chunk: Chunk,
    locals: HashMap<String, usize>, // variable name -> stack slot
}

impl Compiler {
    pub fn new() -> Self {
        Self {
            chunk: Chunk::new(),
            locals: HashMap::new(),
        }
    }

    pub fn compile(mut self, program: &Program) -> Result<Chunk, PumpkinError> {
        for stmt in &program.body {
            self.compile_stmt(stmt)?;
        }
        // End of program
        // We use line 0 effectively if EOF, or last line ideally.
        self.emit_op(OpCode::Return, 0);
        Ok(self.chunk)
    }

    fn compile_block(&mut self, block: &Block) -> Result<(), PumpkinError> {
        for stmt in &block.body {
            self.compile_stmt(stmt)?;
        }
        Ok(())
    }

    fn compile_stmt(&mut self, stmt: &Statement) -> Result<(), PumpkinError> {
        match stmt {
            Statement::LetStmt(s) => {
                self.compile_expr(&s.value)?;
                let name_idx = self.identifier_constant(&s.name);
                self.emit_op(OpCode::SetGlobal, s.loc.as_ref().map_or(0, |l| l.line));
                self.emit_byte(name_idx as u8, s.loc.as_ref().map_or(0, |l| l.line));
                // Let stmt technically usually doesn't leave value on stack in some langs,
                // but SetGlobal usually leaves value (expression semantics).
                // If SetGlobal leaves value, we must pop it for statement context.
                // let's assume SetGlobal leaves it.
                self.emit_op(OpCode::Pop, s.loc.as_ref().map_or(0, |l| l.line));
            }
            Statement::AssignStmt(s) => {
                match &s.target {
                    Expression::Identifier(id) => {
                        self.compile_expr(&s.value)?;
                        let name_idx = self.identifier_constant(id);
                        let line = s.loc.as_ref().map_or(0, |l| l.line);
                        self.emit_op(OpCode::SetGlobal, line);
                        self.emit_byte(name_idx as u8, line);
                        self.emit_op(OpCode::Pop, line);
                    }
                    Expression::IndexExpr(idx_expr) => {
                        // arr[index] = val
                        // 1. Compile Array (object)
                        self.compile_expr(&idx_expr.object)?;
                        // 2. Compile Index
                        self.compile_expr(&idx_expr.index)?;
                        // 3. Compile Value
                        self.compile_expr(&s.value)?;

                        // 4. Emit IndexSet
                        let line = s.loc.as_ref().map_or(0, |l| l.line);
                        self.emit_op(OpCode::IndexSet, line);

                        // IndexSet should leave value on stack (like assignment expression usually)
                        // But AssignStmt expects to Pop it.
                        self.emit_op(OpCode::Pop, line);
                    }
                    _ => {
                        return Err(PumpkinError::runtime(
                            "Complex assignment (only var/index) supported",
                            s.loc.clone(),
                        ))
                    }
                }
            }
            Statement::ExprStmt(s) => {
                self.compile_expr(&s.expression)?;
                self.emit_op(
                    OpCode::Pop,
                    s.expression.loc().as_ref().map_or(0, |l| l.line),
                );
            }
            Statement::ShowStmt(s) => {
                self.compile_expr(&s.expression)?;
                // Intrinsic 'show' not OpCode-based in v1 stdlib, usually Call.
                // But for bootstrap we might rely on a temporary print hack or implicit behavior.
                // Since `vm.rs` doesn't implement `Show` opcode (it just has basic set),
                // we rely on `GetGlobal("show")` + `Call` if "show" was a function.
                // But "show" is a STATEMENT keyword.
                // VM.rs did NOT have a PRINT opcode in the snippet I saw.
                // I will verify VM.rs next step.
                // For now, I'll emit a Pop to be safe code-wise, but this is a semantic gap.
                // Wait! VM design doc had `PRINT (Intrinsic show)`.
                // I'll emit Pop for now to match the file I saw, but flag this.
                self.emit_op(OpCode::Print, s.loc.as_ref().map_or(0, |l| l.line));
            }
            Statement::IfStmt(s) => {
                let line = s.loc.as_ref().map_or(0, |l| l.line);
                self.compile_expr(&s.condition)?;

                // Jump if false to Else (or End)
                let then_jump = self.emit_jump(OpCode::JumpIfFalse, line);
                self.emit_op(OpCode::Pop, line); // Condition value

                self.compile_block(&s.then_block)?;

                let else_jump = self.emit_jump(OpCode::Jump, line);

                self.patch_jump(then_jump)?;
                self.emit_op(OpCode::Pop, line); // Condition pop if jumped

                if let Some(else_b) = &s.else_block {
                    self.compile_block(else_b)?;
                }
                self.patch_jump(else_jump)?;
            }
            Statement::WhileStmt(s) => {
                let line = s.loc.as_ref().map_or(0, |l| l.line);
                let loop_start = self.chunk.code.len();

                self.compile_expr(&s.condition)?;
                let exit_jump = self.emit_jump(OpCode::JumpIfFalse, line);
                self.emit_op(OpCode::Pop, line); // Cond pop

                self.compile_block(&s.body)?;

                self.emit_loop(loop_start, line);

                self.patch_jump(exit_jump)?;
                self.emit_op(OpCode::Pop, line); // Cond pop
            }
            Statement::RepeatStmt(s) => {
                let line = s.loc.as_ref().map_or(0, |l| l.line);
                // 1. Compile the count expression
                self.compile_expr(&s.count)?;

                // 2. Emit RepeatStart with placeholder jump to after loop
                let jump_to_end = self.emit_jump(OpCode::RepeatStart, line);

                // 3. Mark the loop start (right after RepeatStart)
                let loop_start = self.chunk.code.len();

                // 4. Compile the body
                self.compile_block(&s.body)?;

                // 5. Emit RepeatEnd with jump back to loop_start
                self.emit_loop_with_op(OpCode::RepeatEnd, loop_start, line);

                // 6. Patch RepeatStart jump
                self.patch_jump(jump_to_end)?;
            }
            Statement::ReturnStmt(s) => {
                let line = s.loc.as_ref().map_or(0, |l| l.line);
                if let Some(e) = &s.argument {
                    self.compile_expr(e)?;
                } else {
                    self.emit_op(OpCode::Nil, line);
                }
                self.emit_op(OpCode::Return, line);
            }
            Statement::ImportStmt(s) => {
                // 1. Emit Import opcode (loads module object)
                let mod_name_idx = self
                    .chunk
                    .add_constant(PumpkinValue::String(std::rc::Rc::new(s.module.clone())));
                let line = s.loc.as_ref().map_or(0, |l| l.line);
                self.emit_op(OpCode::Import, line);
                self.emit_byte(mod_name_idx as u8, line);

                // 2. Bind to variable name derived from module path
                // e.g., "math" -> "math", "./utils" -> "utils"
                // Simple derivation: take last segment, remove extension (handled by host mostly, here we assume clean name)
                // For now, use full string as key if simple.
                // Actually, spec says: "math" -> math.
                let var_name = s.module.split('/').last().unwrap_or(&s.module).to_string();
                let var_idx = self
                    .chunk
                    .add_constant(PumpkinValue::String(std::rc::Rc::new(var_name)));

                self.emit_op(OpCode::SetGlobal, line);
                self.emit_byte(var_idx as u8, line);
                self.emit_op(OpCode::Pop, line); // SetGlobal leaves value
            }
            Statement::ExportStmt(s) => {
                // Compile the inner declaration (Let/Func)
                self.compile_stmt(&s.declaration)?;

                // Now emit Export opcode. We need the name that was just defined.
                // This requires introspection of the inner statement.
                let name = match &*s.declaration {
                    Statement::LetStmt(l) => &l.name.name,
                    Statement::FuncDecl(f) => &f.name.name,
                    _ => {
                        return Err(PumpkinError::runtime(
                            "Only Let and Func can be exported",
                            s.loc.clone(),
                        ))
                    }
                };

                let name_idx = self
                    .chunk
                    .add_constant(PumpkinValue::String(std::rc::Rc::new(name.clone())));
                let line = s.loc.as_ref().map_or(0, |l| l.line);

                // We need to push the value to be exported.
                // Since LetStmt/FuncDecl logic (SetGlobal) pops the value (in my previous impl),
                // we need to get it back (GetGlobal).
                // OR we change Let/Set to peek. But let's stick to GetGlobal for safety.
                self.emit_op(OpCode::GetGlobal, line);
                self.emit_byte(name_idx as u8, line);

                self.emit_op(OpCode::Export, line);
                self.emit_byte(name_idx as u8, line);
            }
            Statement::FuncDecl(s) => {
                // 1. Create a new Compiler for the function
                // We need to move the block compilation logic to be reusable
                // But simplest is to create new Compiler struct?
                let mut fn_compiler = Compiler::new();
                // ToDo: Locals logic (arguments)
                // For v1 without locals, we assume args are just stack values accessed?
                // Wait, VM GetLocal accesses stack relative to BP.
                // So we need to resolve names to local indices.
                // The Compiler needs a Scope system.
                // v1.0 Simplification: We only support arguments for now.
                // We need to map param names to indices 0..N-1.

                for (i, param) in s.params.iter().enumerate() {
                    fn_compiler.declare_local(param.name.clone(), i);
                }

                fn_compiler.compile_block(&s.body)?;
                // Implicit return nil if no return
                fn_compiler.emit_op(OpCode::Nil, 0);
                fn_compiler.emit_op(OpCode::Return, 0);

                let compiled_fn = fn_compiler.finish_function(s.name.name.clone(), s.params.len());

                // 2. Emit Function constant in current chunk
                let val = PumpkinValue::Function(std::rc::Rc::new(compiled_fn));
                let fn_idx = self.emit_constant_val(val, s.loc.as_ref().map_or(0, |l| l.line)); // helper needed

                // 3. Define Global (Function is a variable)
                let var_name_idx = self.identifier_constant(&s.name);
                let line = s.loc.as_ref().map_or(0, |l| l.line);
                self.emit_op(OpCode::SetGlobal, line);
                self.emit_byte(var_name_idx as u8, line);
                self.emit_op(OpCode::Pop, line);
            }
            _ => {}
        }
        Ok(())
    }

    // ...

    fn compile_expr(&mut self, expr: &Expression) -> Result<(), PumpkinError> {
        match expr {
            Expression::ArrayLiteral(a) => {
                for element in &a.elements {
                    self.compile_expr(element)?;
                }
                // Emit ArrayLit with u16 count
                let count = a.elements.len();
                if count > u16::MAX as usize {
                    return Err(PumpkinError::runtime(
                        "Array literal too large",
                        a.loc.clone(),
                    ));
                }
                let line = a.loc.as_ref().map_or(0, |l| l.line);
                self.emit_op(OpCode::ArrayLit, line);
                self.emit_byte(((count >> 8) & 0xff) as u8, line);
                self.emit_byte((count & 0xff) as u8, line);
            }
            Expression::IndexExpr(i) => {
                self.compile_expr(&i.object)?;
                self.compile_expr(&i.index)?;
                let line = i.loc.as_ref().map_or(0, |l| l.line);
                self.emit_op(OpCode::IndexGet, line);
            }
            Expression::CallExpr(c) => {
                self.compile_expr(&c.callee)?;
                for arg in &c.arguments {
                    self.compile_expr(arg)?;
                }
                self.emit_op(OpCode::Call, c.loc.as_ref().map_or(0, |l| l.line));
                self.emit_byte(
                    c.arguments.len() as u8,
                    c.loc.as_ref().map_or(0, |l| l.line),
                );
            }
            Expression::Identifier(id) => {
                // Check if it's a local (argument)
                if let Some(idx) = self.resolve_local(&id.name) {
                    let line = id.loc.as_ref().map_or(0, |l| l.line);
                    self.emit_op(OpCode::GetLocal, line);
                    self.emit_byte(idx as u8, line);
                } else {
                    let name_idx = self.identifier_constant(id);
                    let line = id.loc.as_ref().map_or(0, |l| l.line);
                    self.emit_op(OpCode::GetGlobal, line);
                    self.emit_byte(name_idx as u8, line);
                }
            }
            Expression::Literal(l) => {
                let line = l.loc.as_ref().map_or(0, |l| l.line);
                if l.value.is_number() {
                    self.emit_constant(PumpkinValue::Number(l.value.as_f64().unwrap()), line);
                } else if l.value.is_boolean() {
                    if l.value.as_bool().unwrap() {
                        self.emit_op(OpCode::True, line);
                    } else {
                        self.emit_op(OpCode::False, line);
                    }
                } else if l.value.is_string() {
                    let val = PumpkinValue::String(std::rc::Rc::new(
                        l.value.as_str().unwrap().to_string(),
                    ));
                    self.emit_constant(val, line);
                } else if l.value.is_null() {
                    self.emit_op(OpCode::Nil, line);
                } else {
                    return Err(PumpkinError::runtime(
                        "Unsupported literal type",
                        l.loc.clone(),
                    ));
                }
            }
            // ...
            Expression::BinaryExpr(b) => {
                self.compile_expr(&b.left)?;
                self.compile_expr(&b.right)?;
                let line = b.loc.as_ref().map_or(0, |l| l.line);
                match b.operator.as_str() {
                    "+" => self.emit_op(OpCode::Add, line),
                    "-" => self.emit_op(OpCode::Sub, line),
                    "*" => self.emit_op(OpCode::Mul, line),
                    "/" => self.emit_op(OpCode::Div, line),
                    "==" => self.emit_op(OpCode::Equal, line),
                    ">" => self.emit_op(OpCode::Greater, line),
                    "<" => self.emit_op(OpCode::Less, line),
                    _ => {
                        return Err(PumpkinError::runtime(
                            "Operator compiler not impl",
                            b.loc.clone(),
                        ))
                    }
                }
            }
            // Logic And/Or require short circuiting jumps
            _ => {
                return Err(PumpkinError::runtime(
                    "Expr not supported in compiler yet",
                    expr.loc().clone(),
                ))
            }
        }
        Ok(())
    }

    // --- Emission Helpers ---

    fn emit_op(&mut self, op: OpCode, line: usize) {
        self.chunk.write_op(op, line);
    }

    fn emit_byte(&mut self, byte: u8, line: usize) {
        self.chunk.write(byte, line);
    }

    fn emit_constant(&mut self, value: PumpkinValue, line: usize) {
        let idx = self.chunk.add_constant(value);
        self.emit_op(OpCode::Constant, line);
        self.emit_byte(idx as u8, line);
    }

    fn emit_constant_val(&mut self, value: PumpkinValue, line: usize) -> u8 {
        let idx = self.chunk.add_constant(value);
        idx as u8
    }

    fn identifier_constant(&mut self, name: &Identifier) -> usize {
        self.chunk
            .add_constant(PumpkinValue::String(std::rc::Rc::new(name.name.clone())))
    }

    // --- Jumps ---

    fn emit_jump(&mut self, instruction: OpCode, line: usize) -> usize {
        self.emit_op(instruction, line);
        self.emit_byte(0xff, line); // Placeholder 16-bit
        self.emit_byte(0xff, line);
        self.chunk.code.len() - 2
    }

    fn patch_jump(&mut self, offset: usize) -> Result<(), PumpkinError> {
        // -2 to adjust for the jump instruction itself's size if relative to Next instruction?
        // Usually relative to (IP + 2).
        // Let's assume VM adds offset to IP *after* reading jump operand.
        // Jump = 1 byte Op + 2 bytes Operand.
        // Code len is now at Target.
        // Limit: 16 bit
        let jump = self.chunk.code.len() - offset - 2;

        if jump > u16::MAX as usize {
            return Err(PumpkinError::runtime("Too much code to jump over", None));
        }

        self.chunk.code[offset] = ((jump >> 8) & 0xff) as u8;
        self.chunk.code[offset + 1] = (jump & 0xff) as u8;
        Ok(())
    }

    fn emit_loop(&mut self, loop_start: usize, line: usize) {
        self.emit_op(OpCode::Loop, line);

        let offset = self.chunk.code.len() - loop_start + 2;

        // Loop jumps BACKWARDS
        if offset > u16::MAX as usize {
            // Error
        }

        self.emit_byte(((offset >> 8) & 0xff) as u8, line);
        self.emit_byte((offset & 0xff) as u8, line);
    }
    fn emit_loop_with_op(&mut self, op: OpCode, loop_start: usize, line: usize) {
        self.emit_op(op, line);

        let offset = self.chunk.code.len() - loop_start + 2;

        self.emit_byte(((offset >> 8) & 0xff) as u8, line);
        self.emit_byte((offset & 0xff) as u8, line);
    }

    // --- Scope / Locals (Minimal Implementation) ---

    fn declare_local(&mut self, name: String, slot: usize) {
        self.locals.insert(name, slot);
    }

    fn resolve_local(&self, name: &str) -> Option<usize> {
        self.locals.get(name).cloned()
    }

    pub fn finish_function(self, name: String, arity: usize) -> crate::value::PumpkinFunction {
        crate::value::PumpkinFunction {
            arity,
            chunk: self.chunk,
            name,
        }
    }
}
