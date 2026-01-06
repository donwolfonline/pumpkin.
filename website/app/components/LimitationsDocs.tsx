import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function LimitationsDocs() {
    const limitations = [
        {
            title: "No User-Defined Functions",
            desc: "You cannot define reusable blocks of code with parameters.",
            reason: "v0.1 focuses on linear imperative execution logic.",
            status: "Fixed in v0.2",
            fixed: true
        },
        {
            title: "No Arrays or Lists",
            desc: "Variables can only hold single numbers, strings, or booleans.",
            reason: "Heap allocation and GC complexity were deferred.",
            status: "Fixed in v0.2",
            fixed: true
        },
        {
            title: "Single-File Only",
            desc: "No imports. All code must reside in a single .pumpkin file.",
            reason: "Module resolution logic is complex intentionally.",
            status: "Fixed in v0.2",
            fixed: true
        },
        {
            title: "No File I/O",
            desc: "You cannot read/write files. Only 'show' output is supported.",
            reason: "Strict sandboxing for embedded safety.",
            status: "Planned for v0.3",
            fixed: false
        }
    ];

    return (
        <section id="limitations" className="py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="flex items-center gap-6 mb-16">
                    <div className="bg-red-100 p-4 rounded-[30px] shadow-lg border-2 border-red-200">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-6xl font-crazy font-extrabold text-gray-900 border-b-4 border-red-500/20 inline-block pb-2">
                            Known Limitations <span className="text-gray-400 font-heading">(v0.1)</span>
                        </h2>
                        <p className="text-xl text-gray-800 font-bold mt-2">
                            Transparent constraints of the <span className="text-pumpkin-orange underline decoration-wavy decoration-teal-accent">initial release</span>.
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {limitations.map((item, i) => (
                        <div key={i} className="content-card group hover:-translate-x-2 transition-all duration-300 border-l-8 border-l-gray-300/40 hover:border-l-pumpkin-orange transition-all flex flex-col md:flex-row gap-8 items-start md:items-center justify-between overflow-hidden relative">
                            <div className="flex-1 relative z-10">
                                <h3 className="text-2xl font-crazy font-extrabold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-800 font-bold mb-4 leading-relaxed">{item.desc}</p>
                                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/40 shadow-inner">
                                    <p className="text-sm text-gray-600 font-medium">
                                        <span className="font-black text-gray-400 uppercase tracking-widest text-[10px] block mb-1">Rationalization</span>
                                        {item.reason}
                                    </p>
                                </div>
                            </div>

                            <div className={`px-6 py-3 rounded-full border-2 flex items-center gap-3 whitespace-nowrap shadow-sm font-heading font-black text-xs uppercase tracking-widest relative z-10 transition-colors ${item.fixed
                                    ? 'bg-green-50/80 border-green-200 text-green-700 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                                    : 'bg-yellow-50/80 border-yellow-200 text-yellow-700 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                } `}>
                                {item.fixed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                <span>{item.status}</span>
                            </div>

                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gray-900/[0.02] rounded-full blur-2xl group-hover:bg-pumpkin-orange/[0.03] transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
