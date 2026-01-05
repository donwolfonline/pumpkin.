# 🎃 Try Pumpkin Locally

Welcome! If you want to experience Pumpkin on your own machine, follow these steps.

## 1. Quick Setup

Assuming you have Node.js installed:

```bash
# Install Pumpkin globally
npm install -g .  # If inside this repo
# OR
npm install -g pumpkin-lang
```

## 2. Take the Tour

We have prepared an interactive tour script. Run it to see Pumpkin in action:

```bash
pumpkin run examples/tour.pumpkin
```

## 3. Play with Examples

Explore the `examples/` folder for more scripts:

* **`examples/hello_world.pumpkin`**: The classic starter.
* **`examples/guess_number.pumpkin`**: A simple interactive game.
* **`examples/daily_routine.pumpkin`**: Logic demo.

Run the guessing game:

```bash
pumpkin run examples/guess_number.pumpkin
```

## 4. Write Your Own

1. Create a file `myscript.pumpkin`.
2. Write some code:

    ```pumpkin
    show "Hello from my script!"
    let x = 10 * 10
    show x
    ```

3. Run it:

    ```bash
    pumpkin run myscript.pumpkin
    ```

## 5. Enter the REPL

Want to experiment line-by-line?

```bash
pumpkin repl
```

Type `exit` to leave.
