import { UnknownVariableError } from './errors.js';
export class Environment {
    vars;
    parent;
    constructor(vars = new Map(), parent = null) {
        this.vars = vars;
        this.parent = parent;
    }
    // Define a new variable in the current scope (e.g., 'let x = 1')
    define(name, value) {
        this.vars.set(name, value);
    }
    // Update an existing variable (e.g., 'x = 2')
    assign(name, value) {
        if (this.vars.has(name)) {
            this.vars.set(name, value);
            return;
        }
        if (this.parent) {
            this.parent.assign(name, value);
            return;
        }
        throw new UnknownVariableError(name);
    }
    // Get a variable's value
    get(name) {
        if (this.vars.has(name)) {
            return this.vars.get(name);
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        throw new UnknownVariableError(name);
    }
    // Check if a variable exists (used for internal checks)
    has(name) {
        if (this.vars.has(name))
            return true;
        if (this.parent)
            return this.parent.has(name);
        return false;
    }
}
//# sourceMappingURL=environment.js.map