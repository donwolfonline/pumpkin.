
import { UnknownVariableError } from './errors.js';

type PumpkinValue = any; // We can refine this later (number | string | boolean | ...)

export class Environment {
    public vars: Map<string, PumpkinValue>;
    public parent: Environment | null;

    constructor(vars: Map<string, PumpkinValue> = new Map(), parent: Environment | null = null) {
        this.vars = vars;
        this.parent = parent;
    }

    // Define a new variable in the current scope (e.g., 'let x = 1')
    define(name: string, value: PumpkinValue): void {
        this.vars.set(name, value);
    }

    // Update an existing variable (e.g., 'x = 2')
    assign(name: string, value: PumpkinValue): void {
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
    get(name: string): PumpkinValue {
        if (this.vars.has(name)) {
            return this.vars.get(name);
        }

        if (this.parent) {
            return this.parent.get(name);
        }

        throw new UnknownVariableError(name);
    }

    // Check if a variable exists (used for internal checks)
    has(name: string): boolean {
        if (this.vars.has(name)) return true;
        if (this.parent) return this.parent.has(name);
        return false;
    }
}
