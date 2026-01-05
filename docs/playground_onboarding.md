# 🎡 Pumpkin Playground Onboarding Flow

## Goal

Guide a beginner to their first "Aha!" moment in under 5 minutes without overwhelming them.

## Tone

* **Calm**: No aggressive popups.
* **Encouraging**: Celebrate small wins.
* **Human**: Speak like a friend, not a manual.

---

## The Flow

### Step 1: The Welcome (State: Fresh Load)

**UI State**:

* Editor: Pre-filled with `hello_world.pumpkin`.
* Output Panel: Shows a friendly greeting card (not yet the console).

**Microcopy (Output Panel)**:
> **👋 Hi there! I'm Pumpkin.**
>
> I'm a coding language designed to be read, not deciphered.
>
> On the left is your code. It looks a lot like English, right?
>
> **Let's see what it does.**
>
> [ Button: Start the Magic 🚀 ]

---

### Step 2: The Action (State: User clicks "Start")

**Interaction**:

* The "Start" button pulses the **Run** button in the toolbar.
* A small tooltip arrow points to the Run button.

**Microcopy (Tooltip)**:
> Click this button to run your code.

---

### Step 3: The Win (State: User clicks "Run")

**Interaction**:

* Code runs instantly.
* Output panel changes to the Console view.
* Mascot (Happy Variant) appears briefly.

**Microcopy (Console)**:
> `Hello, World!`
> `I am coding!`
>
> **🎃 Note:** You just ran your first program! That wasn't so scary, was it?

---

### Step 4: The Challenge (State: Post-Run)

**UI State**:

* A small inline tip appears below the Editor or in the Output footer.

**Microcopy**:
> **✨ Try this:**
> Change `"Hello, World!"` to say your own name.
>
> Then hit **Run** again to see the update.

---

### Step 5: The Discovery (State: User runs modified code)

**Interaction**:

* Code runs with new output.
* "Examples" dropdown highlights gently.

**Microcopy (Toast/Footer)**:
> **You're a natural! 🌟**
>
> Ready for more? Check out the **Examples** menu to see games, math, and more.

---

## Edge Cases

### Case: User deletes everything

**Microcopy (Editor)**:
> "A blank canvas! ✨
>
> Try typing: `show "Hello"`
> Or load an **Example** to get started."

### Case: User hits an error immediately

**Microcopy (Error Panel)**:
> **🎃 No worries!**
> Everyone makes mistakes. That's how we learn.
>
> [ Button: Reset to Hello World ]
