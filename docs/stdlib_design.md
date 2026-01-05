# Pumpkin Standard Library Design 📚

## Philosophy: "Batteries Included, No Assembly Required"

For a beginner-focused language, **Imports are Friction**.
A user shouldn't need to know *where* the `random` function lives to use it. They just want a random number.

### The Decision: Global Namespaces 🌍

Instead of `import math`, Pumpkin will pre-load standard modules into global **Namespaces**.
This feels like "Built-in Superpowers" rather than "External Dependencies".

**Example:**

```python
# No imports needed!
let x = Math.sin(1.5)
let msg = Text.upper("hello")
let now = Time.now()
```

## Structure & Naming 🏷️

We will use **PascalCase** for Module Names (acting like static classes/singletons) and **camelCase** for functions.

### 1. `Math` 🧮

Wraps JS `Math`.

- `Math.sin(x)`, `Math.cos(x)`, `Math.tan(x)`
- `Math.sqrt(x)`, `Math.pow(base, exp)`
- `Math.round(x)`, `Math.floor(x)`, `Math.ceil(x)`
- `Math.abs(x)`
- `Math.min(a, b)`, `Math.max(a, b)`
- `Math.PI` (Constant)

### 2. `Text` 📝

String manipulation helpers.

- `Text.len(str)` (or native property?) -> Let's use `Text.len` for consistency or `len(str)` global?
  - *Decision*: `len(x)` is generic global. `Text` has specific string methods.
- `Text.upper(str)`, `Text.lower(str)`
- `Text.split(str, delimiter)`
- `Text.replace(str, old, new)`
- `Text.contains(str, substr)`

### 3. `Time` ⏱️

- `Time.now()` -> Returns timestamp
- `Time.sleep(ms)` -> **Critical for fun loops/animations**
- `Time.format(timestamp, formatStr)`

### 4. `Random` 🎲

- `Random.float()` -> 0.0 to 1.0
- `Random.int(min, max)` -> Integers
- `Random.choice(list)` -> Pick one item

### 5. `IO` 🖥️ (and Globals)

Some things are so common they are **Global Functions**, not namespaced.

- `show val` (Keyword)
- `ask "prompt" into var` (Keyword)
- `print(val)` -> Alias for `show`?
- `len(list_or_str)` -> Generic length check.

## Implementation Strategy ⚙️

We already established `src/stdlib/index.ts`.
We will expand `installStdlib(env)` to define these objects.

**In `src/stdlib/index.ts`:**

```typescript
const MathModule = {
    type: 'object',
    properties: {
        'sin': { type: 'native_func', call: (args) => Math.sin(args[0]) },
        'PI': Math.PI
    }
};

env.define('Math', MathModule);
```

**Wait, AST Interop:**
Our Interpreter currently expects `CallExpr` to resolve to a `Function` object with `body` (Block).
We need to support **Native Functions** in the Interpreter logic.

**Modification Required:**
Update `Interpreter` to handle `func.kind === 'native'`.

```typescript
interface NativeFunc {
    type: 'native_function';
    name: string;
    call: (args: any[]) => any;
}
```

## Risk: "Polluting the Global Scope"

*Mitigation*: We only claim ~5 global names (`Math`, `Text`, `Time`, `Random`, `len`).
This is acceptable for a v0.1 beginner language. It avoids the cognitive load of `import`.

## Future Proofing 🔮

If we add extensive libraries later (e.g. `Physics`, `Game`, `Network`), we can introduce `use Game` statements then. For now, the "Core 4" are always there.
