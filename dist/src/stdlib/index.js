import { Environment } from '../environment.js';
export function installStdlib(env) {
    // print(...)
    env.define('print', {
        type: 'function',
        name: 'print',
        params: ['message'],
        body: null, // Native function
        closure: env,
        // Native Implementation Hook (not strictly AST compatible yet, need NativeFunc support)
        // For v0.1: we can't easily add native code functions because interpreter loop expects AST Block.
        // We need 'NativeFunction' support in Interpreter.
        // Quick Hack: We don't need 'print' because we have 'show' statement.
        // So for v0.1, we define nothing or define 'print' as alias if possible?
        // Let's leave it minimal. 'show' is the Pumpkin way.
    });
    // We can define math constants
    env.define('PI', Math.PI);
}
//# sourceMappingURL=index.js.map