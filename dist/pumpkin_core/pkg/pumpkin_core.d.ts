/* tslint:disable */
/* eslint-disable */

export class PumpkinVM {
  free(): void;
  [Symbol.dispose](): void;
  constructor();
  /**
   * Run a serialized Pumpkin AST against the persistent VM environment.
   * Input: JSON string of Program AST.
   * Output: JSON string of ExecutionResult.
   */
  run(ast_json: string): any;
}
