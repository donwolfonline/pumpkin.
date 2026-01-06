import React from 'react';
import { Code2, Play } from 'lucide-react';

export default function ExamplesDocs() {
    const examples = [
        {
            title: "FizzBuzz",
            desc: "The classic programming challenge. Print Fizz, Buzz, or FizzBuzz.",
            code: `let i = 1
while i <= 20 {
    let is_fizz = i % 3 == 0
    let is_buzz = i % 5 == 0
    
    if is_fizz and is_buzz {
        show "FizzBuzz"
    } else {
        if is_fizz {
            show "Fizz"
        } else {
            if is_buzz {
                show "Buzz"
            } else {
                show i
            }
        }
    }
    i = i + 1
}`
        },
        {
            title: "Prime Checker",
            desc: "Check if a number is prime using a simple division test.",
            code: `let number = 17
let is_prime = true

if number < 2 {
    is_prime = false
}

let divisor = 2
while divisor < number {
    if number % divisor == 0 {
        is_prime = false
    }
    divisor = divisor + 1
}

if is_prime {
    show "Prime!"
} else {
    show "Not prime"
}`
        },
        {
            title: "Factorial",
            desc: "Calculate n! iteratively (e.g., 5! = 120).",
            code: `let n = 5
let result = 1
let counter = n

while counter > 0 {
    result = result * counter
    counter = counter - 1
}

show result`
        },
        {
            title: "State Machine",
            desc: "A traffic light that cycles: Green → Yellow → Red.",
            code: `let state = "green"
let cycles = 0

while cycles < 6 {
    show state
    
    if state == "green" {
        state = "yellow"
    } else {
        if state == "yellow" {
            state = "red"
        } else {
            state = "green"
        }
    }
    cycles = cycles + 1
}`
        }
    ];

    return (
        <section id="examples" className="py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-blue-100/30 px-6 py-2 rounded-full mb-6 border-2 border-blue-200/50 shadow-sm">
                        <Code2 className="w-5 h-5 text-blue-600" />
                        <span className="font-heading font-black text-blue-700 tracking-tight uppercase text-sm">Gallery</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-crazy font-extrabold mb-6 text-gray-900 drop-shadow-[2px_2px_0px_rgba(37,99,235,0.2)]">
                        Learn by Example
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-2xl mx-auto leading-relaxed">
                        Real programs you can <span className="text-pumpkin-orange italic">study, run, and break</span> right now.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {examples.map((ex, i) => (
                        <div key={i} className="content-card group hover:-translate-y-2 transition-all duration-500 p-0 overflow-hidden flex flex-col border-white/20">
                            <div className="bg-white/40 backdrop-blur-xl px-8 py-6 border-b border-white/20 flex items-center justify-between group-hover:bg-white/60 transition-all">
                                <div>
                                    <h3 className="text-2xl font-crazy font-extrabold text-gray-900 leading-none mb-1">{ex.title}</h3>
                                    <p className="text-sm text-gray-600 font-bold opacity-80">{ex.desc}</p>
                                </div>
                                <div className="w-12 h-12 bg-pumpkin-orange rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                                    <Play className="w-6 h-6 text-white ml-1" />
                                </div>
                            </div>
                            <div className="!bg-[#111] p-8 relative overflow-hidden">
                                <pre className="text-base font-code text-emerald-400 overflow-x-auto leading-loose relative z-10">
                                    {ex.code}
                                </pre>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Code2 className="w-32 h-32 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="pill-section py-12 px-8 bg-white/10 backdrop-blur-2xl inline-block border-white/20 shadow-hero">
                        <p className="text-2xl font-bold text-gray-900 mb-8">Hungry for more code?</p>
                        <a href="https://github.com/donwolfonline/pumpkin" className="btn btn-primary px-10 py-5 text-xl">
                            Browse GitHub Examples
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
