# The Pumpkin Guide 🎃

Welcome to Pumpkin! If you've never written code before, you're in the right place. Pumpkin is designed to be friendly, helpful, and fun.

---

## 1. What is Pumpkin?

Pumpkin is a programming language built for humans, not robots. It reads like English and explains errors in a way that helps you learn.

### Philosophy

* **Simple is better.** No confusing symbols unless they are necessary.
* **Errors are teachers.** When something goes wrong, Pumpkin explains *why* and *how* to fix it.
* **One step at a time.** Code is executed one line at a time.

### Who is it for?

* Beginners learning to code for the first time.
* Students exploring computer science.
* Creatives who want to automate daily tasks.

---

## 2. Getting Started

### Installing Pumpkin

1. Download the Pumpkin package.
2. Install `Node.js` (we need this to run Pumpkin).
3. Open your terminal.

### The Interactive Mode (REPL)

Want to try it out? Just type this in your terminal:

```bash
node src/repl.js
```

You will see a prompt like `🎃 >`. You can type code here and see it run instantly!

### Running a File

Write your code in a file ending with `.pumpkin`. Then run it like this:

```bash
node src/run.js my_script.pumpkin
```

---

## 3. Language Basics

### Show me the code

To print something to the screen, use `show`:

```pumpkin
show "Hello, World!"
show 123
```

### Remembering Things (Variables)

Use `let` to save information for later. Think of it like a box with a label.

```pumpkin
let score = 100
show score
```

You can change what's in the box later:

```pumpkin
score = score + 50
show score
```

### Asking for Info

Use `ask` to get information from the user.

```pumpkin
ask "What is your name?" into user
show "Hi " + user
```

---

## 4. Logic & Flow

### Making Decisions (If/Else)

Computers are smart. They can choose what to do based on rules you create.

```pumpkin
let temperature = 30

if temperature > 25 {
    show "It's hot outside! ☀️"
} else {
    show "Bring a jacket. 🧥"
}
```

### Doing Things Again (Loops)

Don't repeat yourself. Let the computer do it.
**Repeat Loop:**

```pumpkin
repeat 3 times {
    show "Hip hip hooray!"
}
```

**While Loop:**

```pumpkin
let power = 1
while power < 100 {
    show power
    power = power * 2
}
```

---

## 5. Data Types

### Numbers

Whole numbers (`1`) or decimals (`1.5`). You can do math with them: `+`, `-`, `*`, `/`.

```pumpkin
let cost = 19.99
```

### Text (Strings)

Words inside quotes (`"Like this"`).

```pumpkin
let message = "I love Pumpkin"
```

### Lists

A collection of items.

```pumpkin
let colors = ["Red", "Green", "Blue"]
show colors[0]  # Prints "Red"
```

### Objects

Group related information together with labels.

```pumpkin
let person = { name: "Alice", age: 30 }
show person.name
```

---

## 6. Functions

Functions are like mini-programs you can reuse. Give them a name and call them whenever you need.

```pumpkin
function greet(name) {
    show "Hello, " + name + "!"
}

greet("Bob")
greet("Sarah")
```

---

## 7. Errors & Debugging

Everyone makes mistakes! Pumpkin works hard to explain them.
If you type `sho "hello"`, Pumpkin might say:
> **What happened:** I didn't understand "sho".
> **Why:** It looks like a typo.
> **How to fix:** Did you mean "show"?

Read the error message carefully—it's trying to help!

---

## 8. Standard Library Overview

Pumpkin comes with tools ready to use.

* **Core**: `show()`, `ask()`, `typeOf()`
* **Math**: `add()`, `random(min, max)`, `average(list)`
* **Text**: `upper("text")`, `lower("text")`, `length("text")`
* **List**: `count(list)`, `first(list)`, `last(list)`
* **Time**: `now()`, `wait(seconds)`

---

## 9. Next Steps

Congratulations! You know the basics.

* Check out the **examples** folder for real programs.
* Try modifying `guess_number.pumpkin` to make it harder.
* Write a program to help you with your math homework.

**Happy Coding! 🎃**
