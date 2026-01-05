# 🎃 Pumpkin Error Tone Guide

## Philosophy

**"Errors are guidance, not blame."**
In Pumpkin, an error is not a failure. It is a conversation starter. It is an opportunity to teach the user something new about the language.

When writing error messages, imagine you are a kind teacher sitting next to a student. You are patient, supportive, and you always explain *why*.

---

## 1. Vocabulary Rules

| Instead of... ❌ | Say... ✅ | Why? |
| :--- | :--- | :--- |
| "Illegal" / "Invalid" | "We didn't expect..." | "Illegal" sounds like a crime. |
| "Syntax Error" | "I don't understand this." | Technical jargon vs human language. |
| "Fatal Error" | "We hit a snag." | "Fatal" is scary. |
| "Aborting" | "Stopping for now." | Keep it calm. |
| "Argument" / "Parameter" | "input" / "value" | Use simple English. |

## 2. Emotional Rules

* **Assume Good Intent**: The user didn't try to break the code. They just made a typo.
* **Share the Blame**: Use "We" (the language) and "Us". E.g., "We couldn't find..." instead of "You forgot...".
* **Be Specific**: Never just say "Error". Point to the exact line and word.

---

## 3. The Message Structure

Every error message must answer three questions:

1. **What happened?** (The problem)
2. **Why did it happen?** (The context)
3. **How do I fix it?** (The solution)

### Template
>
> **🎃 Whoops! [Friendly Title]**
>
> **What happened:**
> [Simple description of what the code tried to do.]
>
> **Why:**
> [Explanation of the rule that was broken.]
>
> **How to fix it:**
> [Concrete suggestion or example code.]

---

## 4. Examples

### Unknown Variable

* ❌ **Bad**: `ReferenceError: 'scor' is not defined.`
* ✅ **Good**:
    > **🎃 Whoops! Unknown Variable**
    > **What happened:**
    > I couldn't find a variable named `scor`.
    > **Why:**
    > You tried to use this name, but I haven't seen it created with `let` yet.
    > **How to fix it:**
    > * Check your spelling (did you mean `score`?).
    > * Make sure you create it first: `let scor = 10`

### Type Mismatch

* ❌ **Bad**: `TypeError: operand kinds 'string' and 'number' are incompatible.`
* ✅ **Good**:
    > **🎃 Whoops! Confusing Math**
    > **What happened:**
    > You tried to subtract a Number from Text.
    > **Why:**
    > Math only works on numbers. I don't know how to subtract "Apple" - 5.
    > **How to fix it:**
    > Ensure both sides are numbers.

### Invalid Operation

* ❌ **Bad**: `IndexOutOfRangeException: Index 5 out of bounds for length 3.`
* ✅ **Good**:
    > **🎃 Whoops! Empty Spot**
    > **What happened:**
    > You asked for item number 5 in the list.
    > **Why:**
    > The list only has 3 items.
    > **How to fix it:**
    > Try a number between 1 and 3.

### Syntax Issue

* ❌ **Bad**: `Unexpected token '{' at line 10.`
* ✅ **Good**:
    > **🎃 Whoops! I'm Confused**
    > **What happened:**
    > I found a symbol `{` that I didn't expect here.
    > **Why:**
    > It looks like you might be starting a block, but the command before it isn't finished.
    > **How to fix it:**
    > Did you forget a `repeat` or `if` keyword before the `{`?
