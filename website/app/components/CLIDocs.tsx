import React from 'react';
import { Terminal, Play, RotateCcw, HelpCircle, Info } from 'lucide-react';

export default function CLIDocs() {
    const commands = [
        {
            cmd: "run",
            args: "<file.pumpkin>",
            desc: "Executes a source file.",
            icon: <Play className="w-5 h-5 text-green-500" />,
            example: "pumpkin run hello.pumpkin"
        },
        {
            cmd: "repl",
            args: "",
            desc: "Starts interactive mode.",
            icon: <RotateCcw className="w-5 h-5 text-blue-500" />,
            example: "pumpkin repl"
        },
        {
            cmd: "--version",
            args: "",
            desc: "Shows current version.",
            icon: <Info className="w-5 h-5 text-purple-500" />,
            example: "pumpkin --version"
        },
        {
            cmd: "--help",
            args: "[command]",
            desc: "Displays help info.",
            icon: <HelpCircle className="w-5 h-5 text-orange-500" />,
            example: "pumpkin --help"
        }
    ];

    return (
        <section id="cli" className="py-20 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-burgundy-mid/10 px-6 py-2 rounded-full mb-6 border-2 border-burgundy-mid/20 shadow-sm">
                        <Terminal className="w-5 h-5 text-burgundy-mid" />
                        <span className="font-heading font-black text-burgundy-mid tracking-tight uppercase text-sm">Console Mastery</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-crazy font-extrabold mb-6 text-gray-900 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                        Command Line Interface
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-2xl mx-auto leading-relaxed">
                        Control <span className="text-pumpkin-orange underline decoration-wavy">Pumpkin</span> directly from your favorite terminal.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {commands.map((c, i) => (
                        <div key={i} className="content-card group hover:-translate-y-2 transition-all duration-300 border-white/20">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                                        {c.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-code font-black text-gray-900 leading-none mb-1">
                                            {c.cmd}
                                        </h3>
                                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-none">{c.args || "no flags"}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-800 font-bold mb-8 text-lg leading-relaxed">{c.desc}</p>
                            <div className="bg-burgundy-dark rounded-[24px] p-6 text-emerald-400 font-code text-base relative group-hover:bg-burgundy-dark/90 transition-colors shadow-inner border-2 border-white/5">
                                <span className="text-white/30 select-none">$</span> {c.example}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
