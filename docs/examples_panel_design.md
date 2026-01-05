# "Try These Examples" Panel Design 🎠

**Goal:** Spark curiosity through playful remixing.
**Tone:** Fun, relatable, non-academic.

## 1. UX Placement

We want examples to be discoverable but not intrusive.

### Strategy: The "Jukebox" Dropdown

* **Location:** In the IDE Header, next to "Reset".
* **Label:** "📚 Examples" (Icon: Book/Sparkles).
* **Behavior:**
  * Click opens a menu (Dropdown or Modal).
  * Selecting an item **replaces** the current code.
  * *Safety:* If user has modified the current code, show confirmation: "Replace your code with this example?"

## 2. Curated Examples (v0.1)

We will ship with 4 core examples that demonstrate the language features progressively.

### 1. "Hello Pumpkin" (The Basics)

* **Concept:** Output, Simple Strings.
* **Description:** "Say hello to the world."

```pumpkin
// Welcome to Pumpkin! 🎃
// Try changing the text below:

show "Hello, World!"
show "Pumpkin is fun."
```

### 2. "The Age Calculator" (Variables & Math)

* **Concept:** Variable creation, Arithmetic, String concatenation.
* **Description:** "Do some quick math."

```pumpkin
// Let's do some math with variables.

let current_year = 2026
let birth_year = 1990

let age = current_year - birth_year

show "If you were born in " + birth_year
show "You are roughly " + age + " years old."
```

### 3. "The Bouncer" (Conditionals)

* **Concept:** `if`/`else` logic, Boolean comparison.
* **Description:** "Make a decision."

```pumpkin
// Who gets into the club?

let age = 19
let required_age = 21

if age > required_age {
    show "Welcome to the party! 🎉"
} else {
    show "Sorry, you are too young."
    show "Come back in " + (required_age - age) + " years."
}
```

### 4. "Blast Off!" (Loops)

* **Concept:** `while` loops, Reassignment.
* **Description:** "Repeat things automatically."

```pumpkin
// T-Minus 10 seconds...

let t_minus = 10

while t_minus > 0 {
    show t_minus
    t_minus = t_minus - 1
}

show "🚀 BLAST OFF!"
```

## 3. Interaction Details

* **Preview:** Hovering an example in the menu shows a tooltip with its description.
* **Auto-Run?** No. Let the user read the code first, then click Run. This encourages reading.
* **Persisting:** If a user modifies an example, it stays modified until "Reset" is clicked or page reloaded.

## 4. Implementation Plan

1. **Data Structure:** Create `website/lib/examples.ts` exporting an array of `{ id, name, description, code }`.
2. **Component:** Create `website/components/ide/ExampleSelector.tsx`.
3. **Integration:** Add to `PumpkinIDE.tsx` header.
