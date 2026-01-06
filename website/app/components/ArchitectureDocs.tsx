import React from 'react';
import { Folder, FileCode, Monitor, Server, Box } from 'lucide-react';

export default function ArchitectureDocs() {
    const structure = [
        {
            dir: "pumpkin_core/",
            desc: "The Rust Engine",
            details: "Contains the VM, Compiler, and OpCode definitions. The source of truth for execution.",
            icon: <Server className="w-6 h-6 text-orange-600" />
        },
        {
            dir: "grammar/",
            desc: "Syntax Definition",
            details: "Holds 'pumpkin.ohm'. Uses Ohm.js (PEG) to define the human-friendly syntax rules.",
            icon: <FileCode className="w-6 h-6 text-yellow-600" />
        },
        {
            dir: "src/",
            desc: "CLI & Tooling",
            details: "TypeScript wrappers for the CLI commands and legacy interpreter logic.",
            icon: <Box className="w-6 h-6 text-blue-600" />
        },
        {
            dir: "website/",
            desc: "Documentation",
            details: "Next.js application powering this site and the playground.",
            icon: <Monitor className="w-6 h-6 text-teal-600" />
        }
    ];

    return (
        <section id="architecture" className="py-20 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-gray-900 text-white px-6 py-2 rounded-full mb-6 border-2 border-white/10 shadow-hero">
                        <Folder className="w-5 h-5 text-pumpkin-orange" />
                        <span className="font-heading font-extrabold tracking-tight uppercase text-sm">Project Blueprint</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-crazy font-extrabold text-gray-900 mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                        Architecture Overview
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-2xl mx-auto leading-relaxed">
                        How the <span className="text-teal-accent underline decoration-wavy font-crazy">Pumpkin</span> repository is organized for stability and speed.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {structure.map((item, i) => (
                        <div key={i} className="content-card group hover:-translate-y-2.5 transition-all duration-500">
                            <div className="flex gap-6">
                                <div className="bg-white/20 p-4 rounded-[24px] border border-white/30 shadow-lg group-hover:scale-110 transition-transform h-fit">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-code font-black text-2xl text-gray-900 mb-1">{item.dir}</h3>
                                    <div className="text-[10px] font-black uppercase tracking-[3px] text-pumpkin-orange mb-4 opacity-70 leading-none">{item.desc}</div>
                                    <p className="text-gray-700 font-medium leading-relaxed">{item.details}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 content-card !bg-[#111] border-white/10 shadow-hero relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-3xl font-crazy font-extrabold text-white mb-8 text-center drop-shadow-sm">The Compilation Pipeline</h3>
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 text-sm font-code">
                            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-emerald-400 shadow-inner group-hover:bg-white/10 transition-colors">
                                Source Code (.pumpkin)
                            </div>
                            <div className="text-white/20 text-2xl hidden lg:block animate-pulse">&rarr;</div>
                            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-emerald-400 shadow-inner group-hover:bg-white/10 transition-colors">
                                Lexer/Parser (Ohm)
                            </div>
                            <div className="text-white/20 text-2xl hidden lg:block animate-pulse">&rarr;</div>
                            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-emerald-400 shadow-inner group-hover:bg-white/10 transition-colors">
                                Abstract Syntax Tree
                            </div>
                            <div className="text-white/20 text-2xl hidden lg:block animate-pulse">&rarr;</div>
                            <div className="bg-pumpkin-orange text-white px-8 py-4 rounded-2xl border-4 border-white/20 shadow-xl font-black scale-110 group-hover:scale-115 transition-all">
                                Bytecode VM (Rust)
                            </div>
                        </div>
                    </div>

                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pumpkin-orange/5 blur-[100px] rounded-full pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
