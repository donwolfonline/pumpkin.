import { PumpkinSyntaxError, UnknownVariableError, InvalidOperationError, TypeMismatchError, FunctionNotFoundError, IndexOutOfBoundsError, printError } from './errors.js';
console.log('--- Testing Pumpkin Error Messages ---\n');
try {
    throw new UnknownVariableError('age');
}
catch (e) {
    printError(e);
}
try {
    throw new PumpkinSyntaxError('Unexpected token "=" at line 1', 'Did you mean to use "let" or "=="?');
}
catch (e) {
    printError(e);
}
try {
    throw new InvalidOperationError('divide by zero', 'You cannot split a number into zero parts.');
}
catch (e) {
    printError(e);
}
try {
    throw new TypeMismatchError('number', 'string');
}
catch (e) {
    printError(e);
}
try {
    throw new FunctionNotFoundError('fly');
}
catch (e) {
    printError(e);
}
try {
    throw new IndexOutOfBoundsError(10, 5);
}
catch (e) {
    printError(e);
}
//# sourceMappingURL=test_errors.js.map