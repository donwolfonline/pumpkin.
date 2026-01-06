
use std::rc::Rc;
use crate::ast::*;
use crate::env::Environment;
use crate::value::PumpkinValue;
use crate::errors::PumpkinError;

pub trait Host {
    fn show(&self, msg: &str);
}

type ExecResult = Result<PumpkinValue, PumpkinError>;

pub struct InterpreterConfig {
    pub max_instructions: usize,
}

struct InterpreterContext<'a> {
    env: Rc<Environment>,
    root_env: Rc<Environment>,
    host: &'a dyn Host,
    config: InterpreterConfig,
    instructions_executed: usize,
}

enum StmtResult {
    Continue,
    Return(PumpkinValue),
}

pub fn evaluate(program: &Program, env: Rc<Environment>, host: &dyn Host, config: InterpreterConfig) -> ExecResult {
    let mut ctx = InterpreterContext {
        env: env.clone(),
        root_env: env, 
        host,
        config,
        instructions_executed: 0,
    };
    
    let mut last_result = PumpkinValue::Null;
    for stmt in &program.body {
        match exec_stmt(stmt, &mut ctx)? {
             StmtResult::Return(val) => return Ok(val), 
             StmtResult::Continue => { last_result = PumpkinValue::Null; }
        }
    }
    Ok(last_result)
}

fn exec_stmt(stmt: &Statement, ctx: &mut InterpreterContext) -> Result<StmtResult, PumpkinError> {
    ctx.instructions_executed += 1;
    if ctx.instructions_executed > ctx.config.max_instructions {
         let loc = match stmt {
            Statement::LetStmt(s) => s.loc.clone(),
            Statement::AssignStmt(s) => s.loc.clone(),
            Statement::ShowStmt(s) => s.loc.clone(),
            Statement::IfStmt(s) => s.loc.clone(),
            Statement::RepeatStmt(s) => s.loc.clone(),
            Statement::WhileStmt(s) => s.loc.clone(),
            Statement::FuncDecl(s) => s.loc.clone(),
            Statement::ReturnStmt(s) => s.loc.clone(),
            Statement::ExprStmt(s) => s.expression.loc().clone(),
             _ => None,
        };
        return Err(PumpkinError::ResourceExhausted {
            message: "Execution exceeded instruction limit (Infinite Loop?)".to_string(),
            location: loc,
        });
    }

    match stmt {
        Statement::LetStmt(s) => {
            let val = eval_expr(&s.value, ctx)?;
            ctx.env.define(&s.name.name, val);
            Ok(StmtResult::Continue)
        }
        Statement::AssignStmt(s) => {
            let val = eval_expr(&s.value, ctx)?;
            
            match &s.target {
                Expression::Identifier(id) => {
                    ctx.env.assign(&id.name, val)?; 
                }
                Expression::IndexExpr(idx_expr) => {
                     // 1. Eval object -> List
                     let obj_val = eval_expr(&idx_expr.object, ctx)?;
                     // 2. Eval index -> Number
                     let idx_val = eval_expr(&idx_expr.index, ctx)?;
                     
                     match (obj_val, idx_val) {
                         (PumpkinValue::List(list_rc), PumpkinValue::Number(n)) => {
                             let mut list = list_rc.borrow_mut();
                             let index = n as usize;
                             if n < 0.0 || index >= list.len() {
                                 return Err(PumpkinError::runtime("Index out of bounds", s.loc.clone()));
                             }
                             list[index] = val;
                         }
                         (PumpkinValue::List(_), _) => {
                             return Err(PumpkinError::type_mismatch("number", "other", idx_expr.loc.clone()));
                         }
                         (other, _) => {
                             return Err(PumpkinError::type_mismatch("list", other.type_name(), idx_expr.loc.clone()));
                         }
                     }
                }
                _ => return Err(PumpkinError::runtime("Invalid assignment target", s.loc.clone())),
            }
            Ok(StmtResult::Continue)
        }
        Statement::ShowStmt(s) => {
            let val = eval_expr(&s.expression, ctx)?;
            ctx.host.show(&format!("{}", val));
            Ok(StmtResult::Continue)
        }
        Statement::IfStmt(s) => {
            let cond = eval_expr(&s.condition, ctx)?;
            if cond.is_truthy() {
                if let StmtResult::Return(val) = exec_block(&s.then_block, ctx)? {
                    return Ok(StmtResult::Return(val));
                }
            } else if let Some(else_block) = &s.else_block {
                if let StmtResult::Return(val) = exec_block(else_block, ctx)? {
                     return Ok(StmtResult::Return(val));
                }
            }
            Ok(StmtResult::Continue)
        }
        Statement::RepeatStmt(s) => {
            let count_val = eval_expr(&s.count, ctx)?;
             match count_val {
                PumpkinValue::Number(n) => {
                    let count = n as usize; 
                    if n < 0.0 { return Ok(StmtResult::Continue); }
                    
                    for _ in 0..count {
                         if let StmtResult::Return(val) = exec_block(&s.body, ctx)? {
                             return Ok(StmtResult::Return(val));
                         }
                    }
                    Ok(StmtResult::Continue)
                }
                _ => Err(PumpkinError::type_mismatch("number", count_val.type_name(), s.loc.clone()))
            }
        }
        Statement::WhileStmt(s) => {
             loop {
                 let cond = eval_expr(&s.condition, ctx)?;
                 if !cond.is_truthy() { break; }
                 
                 if let StmtResult::Return(val) = exec_block(&s.body, ctx)? {
                      return Ok(StmtResult::Return(val));
                 }
             }
             Ok(StmtResult::Continue)
        }
        Statement::Block(b) => {
             match exec_block(b, ctx)? {
                 StmtResult::Return(val) => Ok(StmtResult::Return(val)),
                 StmtResult::Continue => Ok(StmtResult::Continue),
             }
        },
        Statement::ExprStmt(s) => {
            eval_expr(&s.expression, ctx)?;
            Ok(StmtResult::Continue)
        },
        
        Statement::FuncDecl(s) => {
            let func_val = PumpkinValue::Function {
                params: s.params.iter().map(|p| p.name.clone()).collect(),
                body: s.body.clone(),
            };
            ctx.env.define(&s.name.name, func_val);
             Ok(StmtResult::Continue)
        },
        Statement::ReturnStmt(s) => {
             let val = if let Some(expr) = &s.argument {
                eval_expr(expr, ctx)?
            } else {
                PumpkinValue::Null
            };
            Ok(StmtResult::Return(val))
        },
    }
}

fn exec_block(block: &Block, ctx: &mut InterpreterContext) -> Result<StmtResult, PumpkinError> {
    for stmt in &block.body {
        match exec_stmt(stmt, ctx)? {
            StmtResult::Return(val) => return Ok(StmtResult::Return(val)),
            StmtResult::Continue => {}
        }
    }
    Ok(StmtResult::Continue)
}

fn eval_expr(expr: &Expression, ctx: &mut InterpreterContext) -> ExecResult {
    match expr {
        Expression::Literal(l) => {
            if l.value.is_number() {
                 Ok(PumpkinValue::Number(l.value.as_f64().unwrap()))
            } else if l.value.is_string() {
                 Ok(PumpkinValue::String(l.value.as_str().unwrap().to_string()))
            } else if l.value.is_boolean() {
                 Ok(PumpkinValue::Boolean(l.value.as_bool().unwrap()))
            } else {
                 Ok(PumpkinValue::Null)
            }
        }
        Expression::Identifier(id) => {
            ctx.env.get(&id.name).ok_or_else(|| {
                PumpkinError::UndefinedVariableError { 
                    name: id.name.clone(), 
                    location: id.loc.clone(), 
                    hint: None 
                }
            })
        }
        Expression::ArrayLiteral(node) => {
            let mut elements = Vec::new();
            for elem_expr in &node.elements {
                elements.push(eval_expr(elem_expr, ctx)?);
            }
            Ok(PumpkinValue::List(Rc::new(std::cell::RefCell::new(elements))))
        }
        Expression::ObjectLiteral(_) => {
            Err(PumpkinError::runtime("Object literals not fully implemented in runtime yet", None))
        }
        Expression::IndexExpr(idx_expr) => {
             let obj_val = eval_expr(&idx_expr.object, ctx)?;
             let idx_val = eval_expr(&idx_expr.index, ctx)?;
             
             match (obj_val, idx_val) {
                 (PumpkinValue::List(list_rc), PumpkinValue::Number(n)) => {
                     let list = list_rc.borrow();
                     let index = n as usize;
                     if n < 0.0 || index >= list.len() {
                         return Err(PumpkinError::runtime("Index out of bounds", idx_expr.loc.clone()));
                     }
                     Ok(list[index].clone())
                 }
                 (PumpkinValue::List(_), _) => {
                     Err(PumpkinError::type_mismatch("number", "other", idx_expr.loc.clone()))
                 }
                 (other, _) => {
                     Err(PumpkinError::type_mismatch("list", other.type_name(), idx_expr.loc.clone()))
                 }
             }
        }
        Expression::MemberExpr(mem_expr) => {
             let obj_val = eval_expr(&mem_expr.object, ctx)?;
             match (obj_val, mem_expr.property.name.as_str()) {
                 (PumpkinValue::List(list_rc), "length") => {
                     let list = list_rc.borrow();
                     Ok(PumpkinValue::Number(list.len() as f64))
                 }
                 (PumpkinValue::List(_), prop_name) => {
                      Err(PumpkinError::runtime(&format!("List has no property '{}'", prop_name), mem_expr.loc.clone()))
                 }
                 (other, _) => {
                     Err(PumpkinError::runtime(&format!("Type {} has no properties", other.type_name()), mem_expr.loc.clone()))
                 }
             }
        }
        Expression::BinaryExpr(b) => {
            // Short-circuiting
            if b.operator == "and" {
                let left = eval_expr(&b.left, ctx)?;
                if !left.is_truthy() { return Ok(PumpkinValue::Boolean(false)); }
                let right = eval_expr(&b.right, ctx)?;
                return Ok(PumpkinValue::Boolean(right.is_truthy()));
            }
            if b.operator == "or" {
                let left = eval_expr(&b.left, ctx)?;
                if left.is_truthy() { return Ok(PumpkinValue::Boolean(true)); }
                let right = eval_expr(&b.right, ctx)?;
                return Ok(PumpkinValue::Boolean(right.is_truthy()));
            }

            let left = eval_expr(&b.left, ctx)?;
            let right = eval_expr(&b.right, ctx)?;
            
            match b.operator.as_str() {
                "+" => left.add(&right),
                "-" => left.sub(&right),
                "*" => left.mul(&right),
                "/" => left.div(&right),
                "==" => Ok(PumpkinValue::Boolean(left == right)),
                "!=" => Ok(PumpkinValue::Boolean(left != right)),
                 ">" | "<" | ">=" | "<=" => {
                     match (left, right) {
                         (PumpkinValue::Number(n1), PumpkinValue::Number(n2)) => {
                             let res = match b.operator.as_str() {
                                 ">" => n1 > n2,
                                 "<" => n1 < n2,
                                 ">=" => n1 >= n2,
                                 "<=" => n1 <= n2,
                                 _ => false,
                             };
                             Ok(PumpkinValue::Boolean(res))
                         },
                         _ => Err(PumpkinError::type_mismatch("number", "other", b.loc.clone()))
                     }
                 },
                _ => Err(PumpkinError::runtime(&format!("Unknown operator: {}", b.operator), b.loc.clone())),
            }
        }
        Expression::UnaryExpr(u) => {
            let val = eval_expr(&u.argument, ctx)?;
            match u.operator.as_str() {
                "-" => match val {
                    PumpkinValue::Number(n) => Ok(PumpkinValue::Number(-n)),
                    _ => Err(PumpkinError::type_mismatch("number", val.type_name(), u.loc.clone()))
                },
                "not" | "!" => Ok(PumpkinValue::Boolean(!val.is_truthy())),
                _ => Err(PumpkinError::runtime(&format!("Unknown operator: {}", u.operator), u.loc.clone()))
            }
        }
        Expression::CallExpr(c) => {
            // 1. Eval Callee
            let func_val = eval_expr(&c.callee, ctx)?;
            
            match func_val {
                PumpkinValue::Function { params, body } => {
                    // 2. Check Arity
                    if params.len() != c.arguments.len() {
                        return Err(PumpkinError::runtime(
                             &format!("Expected {} arguments, got {}", params.len(), c.arguments.len()), 
                             c.loc.clone()
                        ));
                    }
                    
                    // 3. Eval Arguments (in current scope)
                    let mut arg_vals = Vec::new();
                    for arg in &c.arguments {
                        arg_vals.push(eval_expr(arg, ctx)?);
                    }
                    
                    // 4. Create New Scope (Child of Root/Global)
                    let call_env = Rc::new(Environment::new_enclosed(ctx.root_env.clone()));
                    
                    // 5. Bind Params
                    for (param, arg) in params.iter().zip(arg_vals.into_iter()) {
                        call_env.define(param, arg);
                    }
                    
                    // 6. Swap Env and Execute
                    let old_env = ctx.env.clone();
                    ctx.env = call_env;
                    
                    // Execute Body
                    // Note: If body has return stmt, we catch it here and unwrap.
                    let result = match exec_block(&body, ctx)? {
                        StmtResult::Return(val) => val,
                        StmtResult::Continue => PumpkinValue::Null,
                    };
                    
                    // Restore Env
                    ctx.env = old_env;
                    
                    Ok(result)
                }
                _ => Err(PumpkinError::type_mismatch("function", func_val.type_name(), c.loc.clone()))
            }
        }
    }
}
