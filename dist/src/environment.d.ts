type PumpkinValue = any;
export declare class Environment {
    vars: Map<string, PumpkinValue>;
    parent: Environment | null;
    constructor(vars?: Map<string, PumpkinValue>, parent?: Environment | null);
    define(name: string, value: PumpkinValue): void;
    assign(name: string, value: PumpkinValue): void;
    get(name: string): PumpkinValue;
    has(name: string): boolean;
}
export {};
//# sourceMappingURL=environment.d.ts.map