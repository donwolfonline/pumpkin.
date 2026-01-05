# Unified Output & Error Rendering 🎨

**Goal:** Consistent error messages and output formatting across CLI and Web Playground.

## 1. Core Principles

* **Single Source of Truth:** Error messages are defined once in Rust (`PumpkinError`).
* **Presentation Adapters:** TypeScript renderers adapt the structured error to CLI (ANSI colors) or Browser (HTML/React).
* **Consistency:** The same error produces the same wording, hints, and structure everywhere.

## 2. Rendering Rules

### Output Lines

* **Source:** `ExecutionResult.output: string[]`
* **CLI:** Print each line directly to stdout.
* **Browser:** Render as a `<div>` list in a styled console component.

### Errors

* **Source:** `ExecutionResult.error: PumpkinError`
* **Structure:**

    ```typescript
    {
      kind: "RuntimeError" | "TypeError" | "UndefinedVariableError" | "DivisionByZeroError",
      message: string,
      expected?: string,
      actual?: string,
      name?: string,
      location?: { line: number, col: number, start: number, end: number },
      hint?: string
    }
    ```

### Error Rendering Template

```
🚨 {kind}: {message}
   at line {location.line}, column {location.col}
   💡 Hint: {hint}
```

## 3. CLI Implementation

**File:** `src/renderer/cli.ts`

```typescript
import chalk from 'chalk';

export function renderError(error: PumpkinError): string {
    let output = chalk.red(`🚨 ${error.kind}: `);
    
    // Message
    if (error.message) {
        output += error.message;
    } else if (error.expected && error.actual) {
        output += `Expected ${chalk.yellow(error.expected)}, but got ${chalk.yellow(error.actual)}.`;
    } else if (error.name) {
        output += `Variable '${chalk.yellow(error.name)}' is not defined.`;
    }
    
    // Location
    if (error.location) {
        output += `\n   ${chalk.dim(`at line ${error.location.line}, column ${error.location.col}`)}`;
    }
    
    // Hint
    if (error.hint) {
        output += `\n   💡 ${chalk.cyan('Hint:')} ${error.hint}`;
    }
    
    return output;
}

export function renderOutput(lines: string[]): void {
    lines.forEach(line => console.log(line));
}
```

## 4. Browser Implementation

**File:** `src/renderer/browser.tsx`

```typescript
import React from 'react';

interface ErrorDisplayProps {
    error: PumpkinError;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    const getMessage = () => {
        if (error.message) return error.message;
        if (error.expected && error.actual) {
            return `Expected ${error.expected}, but got ${error.actual}.`;
        }
        if (error.name) {
            return `Variable '${error.name}' is not defined.`;
        }
        return "Unknown error";
    };
    
    return (
        <div className="error-display">
            <div className="error-header">
                🚨 <span className="error-kind">{error.kind}</span>: {getMessage()}
            </div>
            {error.location && (
                <div className="error-location">
                    at line {error.location.line}, column {error.location.col}
                </div>
            )}
            {error.hint && (
                <div className="error-hint">
                    💡 Hint: {error.hint}
                </div>
            )}
        </div>
    );
};

export const OutputDisplay: React.FC<{ lines: string[] }> = ({ lines }) => (
    <div className="output-display">
        {lines.map((line, i) => <div key={i} className="output-line">{line}</div>)}
    </div>
);
```

## 5. CSS (Browser)

```css
.error-display {
    background: #2d1b1b;
    border-left: 3px solid #ff5555;
    padding: 12px;
    color: #ff8888;
    font-family: 'Monaco', monospace;
}

.error-kind {
    font-weight: bold;
}

.error-location {
    color: #888;
    font-size: 0.9em;
    margin-top: 4px;
}

.error-hint {
    color: #88ccff;
    margin-top: 8px;
}

.output-display {
    font-family: 'Monaco', monospace;
    color: #eee;
}
```

## 6. Usage

**CLI:**

```typescript
import { renderError, renderOutput } from './renderer/cli';

const result = vm.run(ast);
renderOutput(result.output);
if (!result.success && result.error) {
    console.error(renderError(result.error));
}
```

**Browser:**

```typescript
import { ErrorDisplay, OutputDisplay } from './renderer/browser';

<OutputDisplay lines={result.output} />
{result.error && <ErrorDisplay error={result.error} />}
```
