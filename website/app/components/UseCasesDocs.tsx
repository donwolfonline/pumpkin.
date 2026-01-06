import React from 'react';
import { Lightbulb, BookOpen, Wrench, FlaskConical, GraduationCap, XCircle } from 'lucide-react';

export default function UseCasesDocs() {
    const useCases = [
        {
            title: "Learning Algorithms",
            icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
            description: "Focus on the logic, not the syntax. Implement sorting, searching, or graph traversal without fighting the compiler over semicolons or memory management."
        },
        {
            title: "Teaching Programming",
            icon: <GraduationCap className="w-8 h-8 text-green-500" />,
            description: "Perfect for the first 10 hours of coding. Students can read code aloud and understand it immediately. 'show' means show."
        },
        {
            title: "Embedding in Tools",
            icon: <Wrench className="w-8 h-8 text-blue-500" />,
            description: "Need a safe, sandboxed scripting language for your Rust or WASM application? Pumpkin is lightweight, secure by default, and easy to bind."
        },
        {
            title: "Language Experimentation",
            icon: <FlaskConical className="w-8 h-8 text-purple-500" />,
            description: "A clean slate to test compiler concepts, interpreter designs, or new syntax ideas without the baggage of 30-year-old languages."
        },
    ];

    return (
        <section className="py-20 bg-transparent min-h-screen relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-3 bg-teal-accent/10 px-6 py-2 rounded-full mb-6 border-2 border-teal-accent/20 shadow-sm">
                        <BookOpen className="w-5 h-5 text-teal-accent" />
                        <span className="font-heading font-black text-teal-accent tracking-tight uppercase text-sm">Philosophy</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-crazy font-extrabold mb-8 text-gray-900 drop-shadow-[2px_2px_0px_#FF8C1A]">
                        What is Pumpkin For?
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto font-bold leading-relaxed">
                        Pumpkin isn&apos;t trying to replace Python or Rust. It&apos;s built for <span className="text-pumpkin-orange underline decoration-wavy decoration-teal-accent">specific moments</span> in a developer&apos;s journey.
                    </p>
                </div>

                {/* Use Cases Grid */}
                <div className="grid md:grid-cols-2 gap-10 mb-24">
                    {useCases.map((useCase, idx) => (
                        <div key={idx} className="content-card group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="bg-white/40 p-5 rounded-[30px] border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                                    {useCase.icon}
                                </div>
                                <h3 className="text-3xl font-crazy font-extrabold text-gray-900">{useCase.title}</h3>
                            </div>
                            <p className="text-lg text-gray-700 font-bold leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                                {useCase.description}
                            </p>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-accent/5 rounded-full blur-2xl group-hover:bg-teal-accent/10 transition-colors" />
                        </div>
                    ))}
                </div>

                {/* Anti-Patterns (What it is NOT) */}
                <div className="content-card bg-burgundy-dark/95 border-white/20 shadow-hero p-8 md:p-16 relative overflow-hidden group">
                    <div className="flex items-center gap-6 mb-12 relative z-10">
                        <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center border-2 border-red-500/20 shadow-lg">
                            <XCircle className="w-10 h-10 text-red-400 animate-pulse" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-crazy font-extrabold text-white">Non-Goals & Anti-Patterns</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 relative z-10">
                        {[
                            { title: "High-Performance Computing", desc: "If you need to multiply matrices at the speed of light, use Rust or Julia. We prioritize readability over raw speed." },
                            { title: "Production Backends", desc: "No standard library for networking or databases yet. Not ready to run your mission-critical API server." },
                            { title: "System Programming", desc: "No manual memory management or low-level drivers. Pumpkin is a high-level managed language." },
                            { title: "Large Scale Apps", desc: "Managing 100k lines without classes or modules would be painful. Use Pumpkin for targeted logic." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[40px] hover:bg-white/10 transition-all group/item shadow-inner">
                                <h3 className="text-2xl font-crazy font-extrabold text-pumpkin-orange mb-3 group-hover/item:translate-x-1 transition-transform">{item.title}</h3>
                                <p className="text-gray-300 font-medium leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
                </div>

            </div>
        </section>
    );
}
