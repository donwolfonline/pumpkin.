import React from 'react';
import { Book, Code, Variable, Hash, Type, Divide, GitBranch, Repeat, Monitor } from 'lucide-react';

export default function LanguageReferenceDocs() {
    const sections = [
        {
            title: "Program Structure",
            icon: <Code className="w-5 h-5 text-blue-600" />,
            content: (
                <>
                    <p>A Pumpkin program is a sequence of statements executed from top to bottom.</p>
                    <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm mt-2 font-mono">
                        {`show "Start"
let x = 10
show x`}
                    </pre>
                </>
            )
        },
        {
            title: "Comments",
            icon: <Hash className="w-5 h-5 text-gray-500" />,
            content: (
                <>
                    <p>Use <code>#</code> for comments. They are ignored by the computer.</p>
                    <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm mt-2 font-mono">
                        {`# This is a comment
let x = 1 # Inline comment`}
                    </pre>
                </>
            )
        },
        {
            title: "Variables",
            icon: <Variable className="w-5 h-5 text-purple-600" />,
            content: (
                <>
                    <p>Use <code>let</code> to create variables. Use <code>=</code> to update.</p>
                    <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm mt-2 font-mono">
                        {`let name = "Pumpkin"
name = "Pie"`}
                    </pre>
                </>
            )
        },
        {
            title: "Types",
            icon: <Type className="w-5 h-5 text-green-600" />,
            content: (
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Number:</strong> <code>42</code>, <code>3.14</code></li>
                    <li><strong>String:</strong> <code>&quot;Hello&quot;</code></li>
                    <li><strong>Boolean:</strong> <code>true</code>, <code>false</code></li>
                </ul>
            )
        },
        {
            title: "Math & Logic",
            icon: <Divide className="w-5 h-5 text-orange-600" />,
            content: (
                <>
                    <p><strong>Math:</strong> <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>^</code></p>
                    <p className="mt-2"><strong>Logic:</strong> Use English keywords.</p>
                    <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm mt-2 font-mono">
                        {`true and false
not true
10 > 5`}
                    </pre>
                </>
            )
        },
        {
            title: "Conditionals",
            icon: <GitBranch className="w-5 h-5 text-indigo-600" />,
            content: (
                <>
                    <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm mt-2 font-mono">
                        {`if score > 90 {
    show "Win"
} else {
    show "Try loop"
}`}
                    </pre>
                </>
            )
        },
        {
            title: "Loops",
            icon: <Repeat className="w-5 h-5 text-teal-600" />,
            content: (
                <>
                    <p className="mb-2"><strong>While</strong> and <strong>Repeat</strong> loops.</p>
                    <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm mt-2 font-mono">
                        {`repeat 3 times {
    show "Hip Hop"
}

while x < 5 { ... }`}
                    </pre>
                </>
            )
        },
        {
            title: "Output",
            icon: <Monitor className="w-5 h-5 text-gray-800" />,
            content: (
                <>
                    <p>Use <code>show</code> to print to the screen.</p>
                    <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm mt-2 font-mono">
                        {`show "Hello World"`}
                    </pre>
                </>
            )
        }
    ];

    return (
        <section id="reference" className="py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-pumpkin-orange/10 px-6 py-2 rounded-full mb-6 border-2 border-pumpkin-orange/20 shadow-sm">
                        <Book className="w-5 h-5 text-pumpkin-orange" />
                        <span className="font-heading font-extrabold text-pumpkin-orange tracking-tight uppercase text-sm">v0.1 Reference</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-crazy font-extrabold mb-6 text-gray-900 drop-shadow-[2px_2px_0px_#FF8C1A]">
                        Language Reference
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-3xl mx-auto leading-relaxed">
                        Everything you need to <span className="underline decoration-wavy decoration-teal-accent">master</span> the craft of writing Pumpkin code.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="content-card group hover:-translate-y-2.5 transition-all duration-500 overflow-hidden relative">
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                                    {section.icon}
                                </div>
                                <h3 className="font-crazy font-extrabold text-2xl text-gray-900 drop-shadow-sm">{section.title}</h3>
                            </div>
                            <div className="text-gray-700 font-medium leading-relaxed relative z-10">
                                {section.content}
                            </div>

                            {/* Decorative accent */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pumpkin-orange/5 rounded-full blur-2xl group-hover:bg-pumpkin-orange/10 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
