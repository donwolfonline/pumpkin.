export class PumpkinError extends Error {
    what;
    why;
    how;
    constructor(what, why, how) {
        super(what);
        this.what = what;
        this.why = why;
        this.how = how;
        // Restore prototype chain for instanceof checks
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class PumpkinSyntaxError extends PumpkinError {
    constructor(details, suggestion = 'Check for missing brackets (}) or quotes (").') {
        super(`I didn't understand that command.`, `It looks like there's a syntax mistake: ${details}`, `Try reading your code carefully. ${suggestion}`);
    }
}
export class UnknownVariableError extends PumpkinError {
    constructor(variableName) {
        super(`You tried to use "${variableName}" but it was never created.`, `Pumpkin doesn't know what "${variableName}" is yet.`, `Try writing: let ${variableName} = ...`);
    }
}
export class InvalidOperationError extends PumpkinError {
    constructor(operation, reason) {
        super(`I couldn't perform the "${operation}" operation.`, reason, `Check that your values make sense for this operation.`);
    }
}
export class TypeMismatchError extends PumpkinError {
    constructor(expected, got) {
        super(`I expected a ${expected}, but got a ${got}.`, `Some commands only work with specific types of data.`, `Make sure you are using the right type (like a number for math).`);
    }
}
export class FunctionNotFoundError extends PumpkinError {
    constructor(funcName) {
        super(`I couldn't find a function named "${funcName}".`, `It hasn't been defined or imported.`, `Check if you spelled it correctly or forgot to define it.`);
    }
}
export class IndexOutOfBoundsError extends PumpkinError {
    constructor(index, size) {
        super(`You tried to look at item number ${index}, but the list only has ${size} items.`, `Lists start counting at 0, so the last item is at ${size - 1}.`, `Make sure your index is between 0 and ${size - 1}.`);
    }
}
export function printError(error) {
    if (error instanceof PumpkinError) {
        console.log('\n🎃 Whoops! Something went wrong.\n');
        console.log('What happened:');
        console.log(error.what + '\n');
        console.log('Why it happened:');
        console.log(error.why + '\n');
        console.log('How to fix it:');
        console.log(error.how + '\n');
    }
    else {
        // Fallback for unexpected JS errors
        console.log('\n🎃 An unexpected error occurred.\n');
        console.log('Details:', error.message || error);
    }
}
//# sourceMappingURL=errors.js.map