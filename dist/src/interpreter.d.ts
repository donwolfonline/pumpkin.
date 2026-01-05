import * as AST from './ast/nodes.js';
import { Environment } from './environment.js';
export declare function evaluate(node: AST.BaseNode, env: Environment): any;
export { Environment };
export declare const globalEnv: Environment;
export declare function resetGlobalEnv(): void;
//# sourceMappingURL=interpreter.d.ts.map