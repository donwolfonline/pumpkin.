import React from 'react';
import { Rocket, CheckCircle2, Compass, Target, XCircle } from 'lucide-react';

export default function RoadmapDocs() {
    const versions = [
        {
            version: "v0.2",
            status: "Current",
            icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
            tagline: "Execution Foundation",
            features: ["Bytecode VM", "Functions", "Arrays", "Modules", "Debugger API"],
            color: "green"
        },
        {
            version: "v0.3",
            status: "Planned",
            icon: <Compass className="w-6 h-6 text-blue-600" />,
            tagline: "Standard Library & I/O",
            features: ["File I/O (Sandboxed)", "String Methods", "Math Library", "Collection Helpers"],
            color: "blue"
        },
        {
            version: "v0.4",
            status: "Exploration",
            icon: <Rocket className="w-6 h-6 text-purple-600" />,
            tagline: "Developer Experience",
            features: ["Better Error Messages", "Optional Type Hints", "Package Manager", "LSP Support"],
            color: "purple"
        },
        {
            version: "v1.0",
            status: "Vision",
            icon: <Target className="w-6 h-6 text-orange-600" />,
            tagline: "Production-Ready Embedding",
            features: ["Performance Guarantees", "Security Audit", "Stable API", "Optimized WASM"],
            color: "orange"
        }
    ];

    const nonGoals = [
        "Classes/OOP (Use functions and closures instead)",
        "Macros (Code generation obscures behavior)",
        "Implicit Behavior (No operator overloading)"
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-3 bg-indigo-100/30 px-6 py-2 rounded-full mb-6 border-2 border-indigo-200/50 shadow-sm">
                        <Rocket className="w-5 h-5 text-indigo-600" />
                        <span className="font-heading font-black text-indigo-700 tracking-tight uppercase text-sm">Future Vision</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-crazy font-extrabold mb-8 text-gray-900 drop-shadow-[2px_2px_0px_#1E4D4D]">
                        Language Roadmap
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-3xl mx-auto leading-relaxed">
                        Where Pumpkin is headed. <span className="text-gray-400 italic">No dates. No promises. Just vibes.</span>
                    </p>
                </div>

                {/* Philosophy */}
                <div className="content-card !bg-[#111] border-white/20 shadow-hero p-8 md:p-12 mb-20 relative overflow-hidden group">
                    <h2 className="text-3xl font-crazy font-extrabold text-white mb-8 border-b-2 border-white/10 pb-4">Design Philosophy</h2>
                    <div className="grid md:grid-cols-3 gap-10 text-base relative z-10">
                        {[
                            { title: "Human-Readable", desc: "Code reads like English, not math. If a 10-year-old can't read it, it's out." },
                            { title: "Safety by Default", desc: "Never crash. Handle errors gracefully. The compiler should be your best friend." },
                            { title: "Incremental Power", desc: "Start simple. Add complexity only when it's absolutely necessary." }
                        ].map((item, idx) => (
                            <div key={idx} className="group/item">
                                <h3 className="text-2xl font-crazy font-extrabold text-pumpkin-orange mb-3 group-hover/item:translate-x-1 transition-transform">{item.title}</h3>
                                <p className="text-gray-300 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-pumpkin-orange/5 rounded-full blur-[80px]" />
                </div>

                {/* Version Cards */}
                <div className="space-y-12 mb-24">
                    {versions.map((v, i) => (
                        <div key={i} className={`content-card transition-all duration-500 hover:-translate-y-2 flex flex-col md:flex-row gap-10 items-start overflow-hidden relative ${v.color === 'green' ? 'border-l-8 border-l-green-500' :
                            v.color === 'blue' ? 'border-l-8 border-l-blue-500' :
                                v.color === 'purple' ? 'border-l-8 border-l-purple-500' :
                                    'border-l-8 border-l-orange-500'
                            }`}>
                            <div className="flex items-center gap-6 md:w-[30%]">
                                <div className="bg-white/40 backdrop-blur-md p-5 rounded-[30px] border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                                    {v.icon}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-5xl font-crazy font-extrabold text-gray-900 leading-none">{v.version}</h3>
                                    <div className={`font-heading font-black uppercase tracking-[3px] text-xs mt-2 ${v.color === 'green' ? 'text-green-600' :
                                        v.color === 'blue' ? 'text-blue-600' :
                                            v.color === 'purple' ? 'text-purple-600' :
                                                'text-orange-600'
                                        }`}>{v.status}</div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-3xl font-crazy font-extrabold text-gray-900 mb-6 drop-shadow-sm">{v.tagline}</h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {v.features.map((f, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-800 font-bold bg-white/30 p-3 rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm group-hover:bg-white/50 transition-colors">
                                            <div className="w-2 h-2 bg-pumpkin-orange rounded-full shadow-[0_0_10px_#FF8C1A]"></div>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Decorative Version BG */}
                            <div className="absolute top-1/2 -right-10 -translate-y-1/2 text-9xl font-crazy opacity-[0.03] pointer-events-none select-none">
                                {v.version}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Non-Goals */}
                <div className="content-card border-red-500/20 bg-red-50/10 backdrop-blur-3xl overflow-hidden group">
                    <div className="flex items-center gap-4 mb-10 relative z-10 transition-transform duration-500 group-hover:translate-x-2">
                        <div className="p-4 bg-red-100 rounded-2xl border-2 border-red-200 shadow-lg">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-4xl font-crazy font-extrabold text-gray-900">The Hard &quot;No&quot; List</h2>
                    </div>
                    <p className="text-xl font-bold text-gray-800 mb-8 relative z-10">We will <span className="text-red-600 underline decoration-wavy">NEVER</span> add these to the core:</p>
                    <div className="grid md:grid-cols-3 gap-6 relative z-10">
                        {nonGoals.map((ng, i) => (
                            <div key={i} className="flex items-start gap-3 text-gray-800 font-bold bg-white/40 p-5 rounded-[30px] border border-white/50 shadow-sm hover:translate-y-[-4px] transition-transform">
                                <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                                <span className="leading-tight">{ng}</span>
                            </div>
                        ))}
                    </div>

                    {/* Background glow */}
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
                </div>

            </div>
        </section>
    );
}
