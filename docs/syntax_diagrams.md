# 🎨 Pumpkin Visual Syntax Guide

This guide helps you see the "shape" of Pumpkin code. Use these diagrams to remember how to write commands.

---

## 1. Basics

### Variable Declaration

**What it does**: Creates a box to store information.

```mermaid
graph LR
    A("let"):::keyword --> B(Name):::var
    B --> C("="):::op
    C --> D(Value):::val

    classDef keyword fill:#ffaa00,color:#fff,stroke:none;
    classDef var fill:#44aaff,color:#fff,stroke:none;
    classDef op fill:#999,color:#fff,stroke:none;
    classDef val fill:#00cc66,color:#fff,stroke:none;
```

* **Pattern**: `let` `name` `=` `value`
* **Example**: `let score = 100`

### Print Statement

**What it does**: Shows text or numbers on the screen.

```mermaid
graph LR
    A("show"):::keyword --> B(Value):::val

    classDef keyword fill:#ffaa00,color:#fff,stroke:none;
    classDef val fill:#00cc66,color:#fff,stroke:none;
```

* **Pattern**: `show` `value`
* **Example**: `show "Hello!"`

### Input Statement

**What it does**: Asks the user a question.

```mermaid
graph LR
    A("ask"):::keyword --> B("Question"):::val
    B --> C("into"):::keyword
    C --> D(Name):::var

    classDef keyword fill:#ffaa00,color:#fff,stroke:none;
    classDef val fill:#00cc66,color:#fff,stroke:none;
    classDef var fill:#44aaff,color:#fff,stroke:none;
```

* **Pattern**: `ask` `"Question?"` `into` `variable`
* **Example**: `ask "Name?" into user`

---

## 2. Logic & Loops

### If / Else Block

**What it does**: Makes a decision.

```mermaid
graph TD
    A("if"):::keyword --> B{Condition}
    B --> C{"{"}:::op
    C --> D[Result 1]
    D --> E("}"):::op
    E -.-> F("else"):::keyword
    F -.-> G{"{"}:::op
    G -.-> H[Result 2]
    H -.-> I("}"):::op

    classDef keyword fill:#ffaa00,color:#fff,stroke:none;
    classDef op fill:#999,color:#fff,stroke:none;
```

* **Pattern**: `if` `condition` `{` `result` `}`
* **Example**:

    ```pumpkin
    if score > 10 {
        show "Win!"
    }
    ```

### Repeat Loop

**What it does**: Does the same thing a specific number of times.

```mermaid
graph LR
    A("repeat"):::keyword --> B(Number):::val
    B --> C("times"):::keyword
    C --> D{"{ Code }"}:::block

    classDef keyword fill:#ffaa00,color:#fff,stroke:none;
    classDef val fill:#00cc66,color:#fff,stroke:none;
    classDef block fill:#eee,stroke:#333;
```

* **Pattern**: `repeat` `number` `times` `{` `code` `}`
* **Example**:

    ```pumpkin
    repeat 3 times {
        show "Hip hip hooray!"
    }
    ```

### While Loop

**What it does**: Repeats *while* a condition is true.

```mermaid
graph LR
    A("while"):::keyword --> B{Condition}
    B --> C{"{ Code }"}:::block

    classDef keyword fill:#ffaa00,color:#fff,stroke:none;
    classDef block fill:#eee,stroke:#333;
```

* **Pattern**: `while` `condition` `{` `code` `}`
* **Example**:

    ```pumpkin
    while x < 10 {
        x = x + 1
    }
    ```

---

## 3. Data & Functions

### List

**What it does**: A collection of items.

```mermaid
graph LR
    A("["):::op --> B(Item 1):::val
    B --> C(","):::op
    C --> D(Item 2):::val
    D --> E("]"):::op

    classDef op fill:#999,color:#fff,stroke:none;
    classDef val fill:#00cc66,color:#fff,stroke:none;
```

* **Pattern**: `[` `Item`, `Item` `]`
* **Example**: `["Apple", "Banana"]`

### Object

**What it does**: A group of labeled items.

```mermaid
graph LR
    A("{"):::op --> B(Key):::var
    B --> C(":"):::op
    C --> D(Value):::val
    D --> E("}"):::op

    classDef op fill:#999,color:#fff,stroke:none;
    classDef var fill:#44aaff,color:#fff,stroke:none;
    classDef val fill:#00cc66,color:#fff,stroke:none;
```

* **Pattern**: `{` `key` `:` `value` `}`
* **Example**: `{ name: "Pumpkin", ver: 1 }`

### Function Definition

**What it does**: Creates a new command.

```mermaid
graph LR
    A("function"):::keyword --> B(Name):::func
    B --> C("("):::op
    C --> D(Params):::var
    D --> E(")"):::op
    E --> F{"{ Code }"}:::block

    classDef keyword fill:#ffaa00,color:#fff,stroke:none;
    classDef func fill:#cc33ff,color:#fff,stroke:none;
    classDef var fill:#44aaff,color:#fff,stroke:none;
    classDef op fill:#999,color:#fff,stroke:none;
    classDef block fill:#eee,stroke:#333;
```

* **Pattern**: `function` `name` `(` `params` `)` `{` `code` `}`
* **Example**:

    ```pumpkin
    function greet(name) {
        show "Hi " + name
    }
    ```

### Function Call

**What it does**: Runs the command.

```mermaid
graph LR
    A(Name):::func --> B("("):::op
    B --> C(Arguments):::val
    C --> D(")"):::op

    classDef func fill:#cc33ff,color:#fff,stroke:none;
    classDef op fill:#999,color:#fff,stroke:none;
    classDef val fill:#00cc66,color:#fff,stroke:none;
```

* **Pattern**: `name` `(` `values` `)`
* **Example**: `greet("Alice")`
