# Rust Interpreter Execution Trace 🔬

Execution flow for `if x > 5 { show "Big" }`.

```rust
// 1. Initial State
// Env = { x: 10 }
// AST = IfStmt(cond: x > 5, then: Show("Big"))

fn evaluate(ast, env) {
    // 2. Visit Statement
    exec_stmt(IfStmt, env) {
        
        // 3. Evaluate Condition
        eval_expr(BinaryExpr(x > 5), env) {
            left = eval_expr(Ident(x), env) -> 10
            right = eval_expr(Literal(5), env) -> 5
            
            // 4. Perform Operation
            match ">" {
                10 > 5 -> true
            }
            return Boolean(true)
        }

        // 5. Branch Logic
        if true {
            exec_block(then_block, env) {
                // 6. Execute "Show"
                exec_stmt(ShowStmt("Big"), env) {
                    val = eval_expr(Literal("Big")) -> "Big"
                    host.show("Big") // -> OUTPUT: "Big"
                }
            }
        }
    }
}
```

## design Notes

1. **Pure Function:** `evaluate` takes `&Program` and `&Environment` and returns `Result`. It has no side effects other than via `Host`.
2. **Recursion:** Tree walking naturally uses the Rust stack.
3. **Safety:** Every operation (getting a variable, adding numbers) returns `Result`, ensuring no panics.
