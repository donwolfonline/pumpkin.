# 🎓 Pumpkin Teaching Curriculum

This curriculum is designed to take a complete beginner from "What is code?" to building useful automation tools.

**Core Principle**: Learners must feel successful within the first 10 minutes.

---

## Level 1: First Contact 👽

**Goal**: Overcome the fear of the blank screen. Run your first program.

### Concepts

1. Programming is just giving instructions.
2. `show` prints text to the screen.
3. The computer reads one line at a time.

### Lesson

* **Explain**: "Computers are dumb. They need specific instructions."
* **Code**:

    ```pumpkin
    show "Hello, I am a computer."
    show "I will do what you say."
    ```

* **Exercise**: Make the computer introduce itself and say your favorite color.
  * *Expected Output*: "Hello! My favorite color is blue."

---

## Level 2: Thinking in Steps 🧠

**Goal**: Store information and talk back to the user.

### Concepts

1. **Variables** (`let`): Storing data in a named box.
2. **Input** (`ask`): Getting data from the human.
3. **Concatenation**: Joining text together.

### Lesson

* **Explain**: "Use `ask` to ask a question, and `let` to remember the answer."
* **Code**:

    ```pumpkin
    ask "What is your name?" into user
    show "Nice to meet you, " + user
    ```

* **Exercise**: Create a "Robot Waiter". It should ask what you want to eat, then say "Coming right up, [Food]!".

---

## Level 3: Repetition & Logic 🔄

**Goal**: Make the computer do the boring work and make decisions.

### Concepts

1. **Loops** (`repeat`): Doing the same thing multiple times.
2. **Logic** (`if`/`else`): Making choices based on data.

### Lesson

* **Explain**: "Use `repeat` to count. Use `if` to check things."
* **Code**:

    ```pumpkin
    repeat 3 times {
        show "Clap!"
    }

    let age = 10
    if age > 5 {
        show "You are big!"
    }
    ```

* **Exercise**: Write a "Rocket Launch" program. Count down from 5, then if the fuel (a variable) is ready, say "Blast off!", otherwise say "Mission Aborted."

---

## Level 4: Organizing Code 🗂️

**Goal**: Reuse code to keep things clean.

### Concepts

1. **Functions**: Grouping instructions under a name.
2. **Arguments**: Passing data into functions.
3. **Standard Library**: Using built-in tools like `Math`.

### Lesson

* **Explain**: "A function is a recipe. You write it once, and cook it many times."
* **Code**:

    ```pumpkin
    function cheer(name) {
        show "Go " + name + "! You can do it!"
    }

    cheer("Alice")
    cheer("Bob")
    ```

* **Exercise**: Create a function `calculateArea(width, height)` that multiplies the numbers and shows the result. Use it to find the area of a room.

---

## Level 5: Real Projects 🚀

**Goal**: Build something useful for real life.

### Concepts

1. **Automation**: Combining everything to solve a problem.
2. **Lists**: Handling multiple items.

### Lesson

* **Explain**: "Let's build a tool you can use tomorrow."
* **Code (Project Idea: Daily Planner)**:

    ```pumpkin
    let tasks = ["Wake up", "Code Pumpkin", "Sleep"]
    
    show "Here is your plan for today:"
    
    let i = 0
    repeat 3 times {
        show tasks[i]
        i = i + 1
    }
    ```

* **Exercise (Final Project)**: Build a "Math Quiz Game".
    1. Generate two random numbers (using `Math`).
    2. Ask the user to add them.
    3. Check if they are right.
    4. Keep score!

---

## Next Steps

* Read the **Standard Library** docs to see what else you can do.
* Check out the `examples/` folder for more ideas.
