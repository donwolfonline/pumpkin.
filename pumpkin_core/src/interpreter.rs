
// pumpkin_core/src/interpreter.rs

use std::rc::Rc;
use crate::ast::*;
use crate::env::Environment;
use crate::value::PumpkinValue;
use crate::errors::PumpkinError;

pub trait Host {
    fn show(&self, msg: &str);
}

type ExecResult = Result<PumpkinValue, PumpkinError>;

pub fn evaluate(program: &Program, env: &Environment, host: &dyn Host) -> ExecResult {
    let mut last_result = PumpkinValue::Null;
    for stmt in &program.body {
        last_result = exec_stmt(stmt, env, host)?;
    }
    Ok(last_result)
}

fn exec_stmt(stmt: &Statement, env: &Environment, host: &dyn Host) -> ExecResult {
    match stmt {
        Statement::LetStmt(s) => {
            let val = eval_expr(&s.value, env)?;
            env.define(&s.name.name, val);
            Ok(PumpkinValue::Null)
        }
        Statement::AssignStmt(s) => {
            let val = eval_expr(&s.value, env)?;
            env.assign(&s.name.name, val)?;
            Ok(PumpkinValue::Null)
        }
        Statement::ShowStmt(s) => {
            let val = eval_expr(&s.expression, env)?;
            host.show(&format!("{}", val));
            Ok(PumpkinValue::Null)
        }
        Statement::IfStmt(s) => {
            let cond = eval_expr(&s.condition, env)?;
            if cond.is_truthy() {
                exec_block(&s.then_block, env, host)
            } else if let Some(else_block) = &s.else_block {
                exec_block(else_block, env, host)
            } else {
                Ok(PumpkinValue::Null)
            }
        }
        Statement::RepeatStmt(s) => {
            let count_val = eval_expr(&s.count, env)?;
            match count_val {
                PumpkinValue::Number(n) => {
                    let count = n as usize; 
                    if n < 0.0 {
                        return Ok(PumpkinValue::Null);
                    }
                    
                    let mut last = PumpkinValue::Null;
                    for _ in 0..count {
                        last = exec_block(&s.body, env, host)?;
                    }
                    Ok(last)
                }
                _ => Err(PumpkinError::type_mismatch("number", count_val.type_name(), s.loc.clone()))
            }
        }
        Statement::WhileStmt(s) => {
             let mut last = PumpkinValue::Null;
             loop {
                 let cond = eval_expr(&s.condition, env)?;
                 if !cond.is_truthy() {
                     break;
                 }
                 last = exec_block(&s.body, env, host)?;
             }
             Ok(last)
        }
        Statement::Block(b) => exec_block(b, env, host),
        Statement::ExprStmt(s) => eval_expr(&s.expression, env),
        
        Statement::FuncDecl(_) => Ok(PumpkinValue::Null), 
        Statement::ReturnStmt(_) => Ok(PumpkinValue::Null),
    }
}

fn exec_block(block: &Block, parent_env: &Environment, host: &dyn Host) -> ExecResult {
    let mut last = PumpkinValue::Null;
    for stmt in &block.body {
        last = exec_stmt(stmt, parent_env, host)?;
    }
    Ok(last)
}

fn eval_expr(expr: &Expression, env: &Environment) -> ExecResult {
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
            env.get(&id.name).ok_or_else(|| {
                PumpkinError::UndefinedVariableError { 
                    name: id.name.clone(), 
                    location: id.loc.clone(), 
                    hint: None 
                }
            })
        }
        Expression::BinaryExpr(b) => {
            let left = eval_expr(&b.left, env)?;
            let right = eval_expr(&b.right, env)?;
            
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
                 "and" => Ok(PumpkinValue::Boolean(left.is_truthy() && right.is_truthy())),
                 "or" => Ok(PumpkinValue::Boolean(left.is_truthy() || right.is_truthy())),
                _ => Err(PumpkinError::runtime(&format!("Unknown operator: {}", b.operator), b.loc.clone())),
            }
        }
        Expression::UnaryExpr(u) => {
            let val = eval_expr(&u.argument, env)?;
            match u.operator.as_str() {
                "-" => match val {
                    PumpkinValue::Number(n) => Ok(PumpkinValue::Number(-n)),
                    _ => Err(PumpkinError::type_mismatch("number", val.type_name(), u.loc.clone()))
                },
                "not" | "!" => Ok(PumpkinValue::Boolean(!val.is_truthy())),
                _ => Err(PumpkinError::runtime(&format!("Unknown operator: {}", u.operator), u.loc.clone()))
            }
        }
        _ => Err(PumpkinError::runtime("Expression type not supported yet", None)),
    }
}
