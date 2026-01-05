export declare class PumpkinError extends Error {
    what: string;
    why: string;
    how: string;
    constructor(what: string, why: string, how: string);
}
export declare class PumpkinSyntaxError extends PumpkinError {
    constructor(details: string, suggestion?: string);
}
export declare class UnknownVariableError extends PumpkinError {
    constructor(variableName: string);
}
export declare class InvalidOperationError extends PumpkinError {
    constructor(operation: string, reason: string);
}
export declare class TypeMismatchError extends PumpkinError {
    constructor(expected: string, got: string);
}
export declare class FunctionNotFoundError extends PumpkinError {
    constructor(funcName: string);
}
export declare class IndexOutOfBoundsError extends PumpkinError {
    constructor(index: number, size: number);
}
export declare function printError(error: any): void;
//# sourceMappingURL=errors.d.ts.map