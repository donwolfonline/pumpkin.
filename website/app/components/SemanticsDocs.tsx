import { Layers, Eye, ShieldCheck, Box, Cpu } from 'lucide-react';

export default function SemanticsDocs() {
    const truthiness = [
        { val: "false", bool: "False", class: "text-red-600 bg-red-50" },
        { val: "nil", bool: "False", class: "text-red-600 bg-red-50" },
        { val: "true", bool: "True", class: "text-green-600 bg-green-50" },
        { val: "0", bool: "True", class: "text-green-600 bg-green-50" },
        { val: "\"\"", bool: "True", class: "text-green-600 bg-green-50" },
        { val: "[]", bool: "True", class: "text-green-600 bg-green-50" },
    ];

    return (
        <section id="semantics" className="py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-3 bg-purple-100/30 px-6 py-2 rounded-full mb-6 border-2 border-purple-200/50 shadow-sm">
                        <Cpu className="w-5 h-5 text-purple-600" />
                        <span className="font-heading font-black text-purple-700 tracking-tight uppercase text-sm">Deep Dive</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-crazy font-extrabold mb-8 text-gray-900 drop-shadow-[2px_2px_0px_#FF8C1A]">
                        Language Semantics
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-2xl mx-auto leading-relaxed">
                        How Pumpkin actually <span className="text-pumpkin-orange underline decoration-wavy">thinks and works</span> under the hood.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Execution Model */}
                    <div className="space-y-10">
                        <div className="content-card group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-white/40 p-4 rounded-[24px] border border-white/40 shadow-lg group-hover:rotate-6 transition-transform">
                                    <Layers className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-3xl font-crazy font-extrabold text-gray-900">Stack Execution</h3>
                            </div>
                            <p className="text-lg text-gray-700 font-bold mb-6 leading-relaxed opacity-90">
                                Pumpkin runs on a Stack-Based Virtual Machine. Expressions are evaluated <span className="text-blue-600">Left-to-Right</span>.
                                Logical operators use <span className="text-blue-600">short-circuit</span> evaluation.
                            </p>
                            <div className="bg-burgundy-dark/95 border-2 border-white/10 rounded-3xl p-6 font-code text-sm shadow-inner relative overflow-hidden">
                                <div className="text-white/30 mb-3 border-b border-white/5 pb-2"># VM Lab: 1 + 2 * 3</div>
                                <div className="space-y-2 text-emerald-400 font-medium">
                                    <div className="flex items-center gap-3 px-2 py-1 rounded bg-white/5"><span className="text-white/20 w-8">01</span> PUSH 1</div>
                                    <div className="flex items-center gap-3 px-2 py-1 rounded bg-white/5"><span className="text-white/20 w-8">02</span> PUSH 2</div>
                                    <div className="flex items-center gap-3 px-2 py-1 rounded bg-white/5"><span className="text-white/20 w-8">03</span> PUSH 3</div>
                                    <div className="flex items-center gap-3 px-2 py-1 rounded bg-white/10 border-l-4 border-emerald-500"><span className="text-white/20 w-8">04</span> MUL <span className="text-white/40 italic ml-4">(Pop 2, 3 → Push 6)</span></div>
                                    <div className="flex items-center gap-3 px-2 py-1 rounded bg-white/10 border-l-4 border-emerald-500"><span className="text-white/20 w-8">05</span> ADD <span className="text-white/40 italic ml-4">(Pop 1, 6 → Push 7)</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="content-card group hover:-translate-y-2 transition-all duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-white/40 p-4 rounded-[24px] border border-white/40 shadow-lg group-hover:rotate-6 transition-transform">
                                    <Box className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-3xl font-crazy font-extrabold text-gray-900">Scoping</h3>
                            </div>
                            <ul className="space-y-6">
                                <li className="flex gap-4 items-start">
                                    <div className="w-2 h-2 bg-pumpkin-orange rounded-full mt-2.5 shadow-[0_0_8px_#FF8C1A]"></div>
                                    <div className="flex-1">
                                        <span className="font-crazy font-extrabold text-gray-900 text-xl block mb-1">Global Scope</span>
                                        <p className="text-gray-700 font-bold opacity-80">Variables at the top level persist for the entire program lifetime. Rooted in the patch.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-2 h-2 bg-teal-accent rounded-full mt-2.5 shadow-[0_0_8px_#3B8B8B]"></div>
                                    <div className="flex-1">
                                        <span className="font-crazy font-extrabold text-gray-900 text-xl block mb-1">Local Scope</span>
                                        <p className="text-gray-700 font-bold opacity-80">Variables inside functions exist only during the call. Clean. Predictable. Lexical.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Truthiness & Errors */}
                    <div className="space-y-10">
                        <div className="content-card group hover:-translate-y-2 transition-all duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-white/40 p-4 rounded-[24px] border border-white/40 shadow-lg group-hover:rotate-6 transition-transform">
                                    <Eye className="w-8 h-8 text-teal-600" />
                                </div>
                                <h3 className="text-3xl font-crazy font-extrabold text-gray-900">Truthiness</h3>
                            </div>
                            <p className="text-lg text-gray-700 font-bold mb-8 leading-relaxed opacity-90">
                                Only <code className="bg-red-50 px-2 py-0.5 rounded border border-red-100 text-red-600">false</code> and <code className="bg-red-50 px-2 py-0.5 rounded border border-red-100 text-red-600">nil</code> are falsy. Everything else is true. No weird edge cases.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {truthiness.map((t, i) => (
                                    <div key={i} className={`flex justify-between items-center px-5 py-3 rounded-[20px] border-2 transition-all group/item hover:scale-105 ${t.bool === 'True' ? 'bg-green-50/50 border-green-200/50 text-green-700' : 'bg-red-50/50 border-red-200/50 text-red-700'
                                        }`}>
                                        <span className="font-code font-bold text-lg">{t.val}</span>
                                        <span className="font-heading font-black uppercase tracking-widest text-[10px] bg-white/60 px-2 py-0.5 rounded-full">{t.bool}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="content-card group bg-burgundy-dark/95 border-white/10 shadow-hero relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-orange-500/10 p-4 rounded-[24px] border border-orange-500/20 shadow-lg group-hover:rotate-6 transition-transform">
                                    <ShieldCheck className="w-8 h-8 text-orange-400" />
                                </div>
                                <h3 className="text-3xl font-crazy font-extrabold text-white">Runtime Safety</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    { title: "Memory Safe", desc: "No buffer overflows or raw pointer access. The VM handles the ground work." },
                                    { title: "Strict Sandbox", desc: "No file system or network access by default. Secure from the first seed." },
                                    { title: "Panic-Free", desc: "Runtime errors halt execution safely with human-readable diagnostics." }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-4 group/item">
                                        <ShieldCheck className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                                        <div>
                                            <span className="font-crazy font-extrabold text-white text-xl block mb-1">{item.title}</span>
                                            <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Abstract glow */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -z-0" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-teal-accent/5 rounded-full blur-[80px] -z-0" />
        </section>
    );
}
