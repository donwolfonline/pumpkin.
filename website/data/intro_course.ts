
import { Course } from '../types/course';

export const INTRO_COURSE: Course = {
    id: 'intro_to_pumpkin',
    title: 'Welcome to the Patch',
    lessons: [
        {
            id: '01_hello',
            title: '1. Hello, Pumpkin!',
            description: `
**Welcome to coding!**

Computers are friendly, but they need clear instructions. The command \`show\` tells the computer to print something to the screen.

**Your Goal:**
Change the code to say exactly: \`"Hello Pumpkin"\` (Don't forget the quotes!)
            `.trim(),
            goal: 'Print "Hello Pumpkin" to the console.',
            starterCode: `show "Hello World"`,
            successConditions: [
                {
                    id: 'match_output',
                    type: 'OUTPUT_EXACT',
                    value: 'Hello Pumpkin',
                    message: 'Make sure it says exactly "Hello Pumpkin"!'
                }
            ]
        },
        {
            id: '02_variables',
            title: '2. Remembering Things',
            description: `
**Computers have great memories.**

We use **variables** to store information. Think of a variable like a box with a label.
Here, we made a box named \`my_name\` using the keyword \`let\`.

**Your Goal:**
1. Change the value inside \`my_name\` to be **your actual name** (or a nickname!).
2. Run the code to see it.
            `.trim(),
            goal: 'Change the variable to your name.',
            starterCode: `// We made a box called 'my_name'
let my_name = "Guest"

show "Hello " + my_name`,
            lockedRanges: [
                { startLine: 4, endLine: 4 } // Lock the 'show' line so they focus on the variable
            ],
            successConditions: [
                {
                    id: 'changed_name',
                    type: 'OUTPUT_REGEX',
                    value: 'Hello (?!Guest).*', // Must NOT be "Hello Guest"
                    message: 'Change "Guest" to your own name!'
                }
            ]
        },
        {
            id: '03_math',
            title: '3. Pumpkin Math',
            description: `
**Computers are basically super-fast calculators.**

You can use standard math symbols:
* \`+\` (Add)
* \`-\` (Subtract)
* \`*\` (Multiply)
* \`/\` (Divide)

**Your Goal:**
How many hours are in 3 days? Modify the code to calculate \`24 * 3\`.
            `.trim(),
            goal: 'Calculate 24 * 3',
            starterCode: `// How many hours in 3 days?
show 24 * 1 // Change this!`,
            successConditions: [
                {
                    id: 'math_correct',
                    type: 'OUTPUT_EXACT',
                    value: '72',
                    message: 'The answer should be 72.'
                },
                {
                    id: 'code_check',
                    type: 'CODE_CONTAINS',
                    value: '*',
                    message: 'Use the * symbol for multiplication.'
                }
            ]
        },
        {
            id: '04_decisions',
            title: '4. Making Decisions',
            description: `
**Code can make choices.**

We use \`if\` to do things ONLY when a condition is true.
It's like saying: *"If it is raining, take an umbrella."*

**Your Goal:**
Change the value of \`is_hungry\` to \`true\` so that the Pumpkin eats the pie.
            `.trim(),
            goal: 'Set is_hungry to true.',
            starterCode: `let is_hungry = false

if is_hungry {
    show "Nom nom nom! 🥧"
}

show "Done."`,
            lockedRanges: [
                { startLine: 3, endLine: 7 } // Lock the logic, force them to change the variable
            ],
            successConditions: [
                {
                    id: 'ate_pie',
                    type: 'OUTPUT_CONTAINS',
                    value: 'Nom nom nom!',
                    message: 'The pumpkin didn\'t eat! Make sure is_hungry is true.'
                }
            ]
        },
        {
            id: '05_loops',
            title: '5. Again and Again',
            description: `
**Computers love repetition.**

Instead of copying and pasting code, we can use \`repeat\`.
This makes the computer do the same block of code multiple times.

**Your Goal:**
Write a loop that prints **"Hip Hip Hooray!"** exactly **3 times**.
            `.trim(),
            goal: 'Repeat the cheer 3 times.',
            starterCode: `// Write your loop here:
repeat 1 {
    show "Hip Hip Hooray!"
}`,
            successConditions: [
                {
                    id: 'loop_count',
                    type: 'OUTPUT_REGEX',
                    // Match line appearing 3 times
                    value: '(Hip Hip Hooray!\\s*){3}',
                    message: 'Make sure it prints exactly 3 times!'
                },
                {
                    id: 'used_repeat',
                    type: 'CODE_CONTAINS',
                    value: 'repeat',
                    message: 'Use the "repeat" keyword.'
                }
            ]
        }
    ]
};
