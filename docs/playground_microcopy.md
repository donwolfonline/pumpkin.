# 🎡 Pumpkin Playground Microcopy

## Tone Guide

* **Friendly**: Uses emojis and casual language.
* **Calm**: Never shouts or blames.
* **Supportive**: Always suggests a next step.

---

## 1. Editor Area

### Placeholder Text (Empty State)
>
> "Type your code here...
> Try typing: show 'Hello World!'"

### Loading State
>
> "Warming up the pumpkins..."

---

## 2. Buttons & Actions

### Run Button

* **Default**: `Run Code 🚀`
* **Running**: `Running... ⏳`
* **Tooltip**: `Click to see your code happen!`

### Clear Button

* **Label**: `Clear Output 🗑️` or `Start Fresh ✨`
* **Tooltip**: `Clears the output panel, but keeps your code safe.`

### Examples Dropdown

* **Label**: `Load Example 📂`
* **Item**: `Hello World 👋`
* **Item**: `Guessing Game 🎮`
* **Item**: `Calculator 🧮`

### Share Button

* **Label**: `Share ✨`
* **Success Toast**: `Link copied! Ready to share with the world.`

---

## 3. Output Panel

### Waiting State (Default)
>
> "Ready when you are! Hit 'Run Code' to start. ✨"

### Execution Started
>
> "Here we go..."

### Success Messages (Footer)

* `Done! That was magic. ✨`
* `Program finished successfully. 🎃`
* `Great job! What will you build next?`

### Input Prompt (for `ask` command)
>
> "The program is asking for text:"
> `Type here and press Enter...`

---

## 4. Error Messages (The "Oops" State)

### Header
>
> "🎃 Oops! We hit a snag."

### Generic Error Intro
>
> "Pumpkin didn't understand this line yet. Let's fix it together."

### Specific Copy Replacements

| Technical Term | Friendly Pumpkin Copy |
| :--- | :--- |
| `SyntaxError` | `We're not sure what this means.` |
| `Unexpected Token` | `We found a symbol we didn't expect.` |
| `ReferenceError` | `We can't find a variable with that name.` |
| `TypeError` | `This operation doesn't work on these types.` |

### Next Step Suggestions

* `Check your spelling?`
* `Did you forget a quote " mark?`
* `Try looking at the Examples for help.`
