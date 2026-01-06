import React from 'react';
import { GitBranch, Terminal, Code, FileCheck, MessageSquare, Heart } from 'lucide-react';

export default function ContributingDocs() {
    const steps = [
        {
            icon: <GitBranch className="w-6 h-6 text-purple-600" />,
            title: "Find an Issue",
            desc: "Look for 'Good First Issue' labels. Perfect for newcomers."
        },
        {
            icon: <Terminal className="w-6 h-6 text-blue-600" />,
            title: "Build from Source",
            desc: "Clone the repo, install dependencies (Node.js + Rust), and run tests."
        },
        {
            icon: <Code className="w-6 h-6 text-green-600" />,
            title: "Write Code",
            desc: "Follow coding style. Run `cargo fmt` and `cargo clippy` for Rust."
        },
        {
            icon: <FileCheck className="w-6 h-6 text-orange-600" />,
            title: "Add Tests",
            desc: "Every feature needs a test. Run `./run_smoke_tests.sh` before submitting."
        },
        {
            icon: <MessageSquare className="w-6 h-6 text-teal-600" />,
            title: "Open a PR",
            desc: "Push your branch and open a Pull Request. We'll review it together."
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-3 bg-pink-100/30 px-6 py-2 rounded-full mb-6 border-2 border-pink-200/50 shadow-sm">
                        <Heart className="w-5 h-5 text-pink-600" />
                        <span className="font-heading font-black text-pink-700 tracking-tight uppercase text-sm">Open Source</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-crazy font-extrabold mb-8 text-gray-900 drop-shadow-[2px_2px_0px_#FF8C1A]">
                        Contributing to Pumpkin
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-3xl mx-auto leading-relaxed">
                        You don&apos;t need to be a compiler expert. If you can read code, you can <span className="text-teal-accent underline decoration-wavy">grow with us</span>.
                    </p>
                </div>

                {/* Values */}
                <div className="content-card p-10 md:p-16 mb-20 border-white/20 shadow-hero relative overflow-hidden group">
                    <h2 className="text-3xl font-crazy font-extrabold text-gray-900 mb-8 border-b-2 border-white/10 pb-4">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-10 relative z-10">
                        {[
                            { title: "Kindness", desc: "We're learning together. There are no stupid questions in the field." },
                            { title: "Clarity", desc: "Readable code beats clever code, every single time." },
                            { title: "Curiosity", desc: "We want you to dig deep and understand how the seeds grow." }
                        ].map((item, idx) => (
                            <div key={idx} className="group/item">
                                <h3 className="text-2xl font-crazy font-extrabold text-pumpkin-orange mb-3 group-hover/item:translate-x-1 transition-transform">{item.title}</h3>
                                <p className="text-gray-700 font-bold opacity-80">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-500/5 rounded-full blur-[60px]" />
                </div>

                {/* Steps */}
                <h2 className="text-4xl font-crazy font-extrabold text-gray-900 mb-10 text-center">How to Get Started</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {steps.map((step, i) => (
                        <div key={i} className="content-card group hover:-translate-y-2 transition-all duration-300 border-white/20">
                            <div className="flex flex-col h-full">
                                <div className="bg-white/40 p-5 rounded-[24px] border border-white/40 shadow-lg group-hover:scale-110 transition-transform h-fit w-fit mb-6">
                                    {step.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="text-pumpkin-orange font-heading font-black text-xs uppercase tracking-[3px] mb-2">Step {i + 1}</div>
                                    <h3 className="text-2xl font-crazy font-extrabold text-gray-900 mb-4 leading-tight">{step.title}</h3>
                                    <p className="text-gray-700 font-bold opacity-90 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Build Instructions */}
                <div className="content-card bg-burgundy-dark/95 border-white/10 shadow-hero p-10 md:p-12 mb-20 overflow-hidden group">
                    <div className="flex items-center gap-4 mb-8">
                        <Terminal className="w-10 h-10 text-emerald-400" />
                        <h3 className="text-3xl font-crazy font-extrabold text-white">Quick Build Lab</h3>
                    </div>
                    <div className="bg-black/40 rounded-3xl p-8 font-code text-base border-2 border-white/5 shadow-inner relative z-10">
                        <div className="space-y-3">
                            <div className="flex gap-4"><span className="text-white/20 select-none">$</span> <span className="text-emerald-400">git clone https://github.com/donwolfonline/pumpkin.git</span></div>
                            <div className="flex gap-4"><span className="text-white/20 select-none">$</span> <span className="text-emerald-400">cd pumpkin && npm install</span></div>
                            <div className="flex gap-4"><span className="text-white/20 select-none">$</span> <span className="text-emerald-400">cd pumpkin_core && cargo build --release</span></div>
                            <div className="text-white/30 mt-6 md:mt-10 py-2 border-t border-white/5 text-sm font-heading"># Verify with Smoke Tests</div>
                            <div className="flex gap-4"><span className="text-white/20 select-none">$</span> <span className="text-pumpkin-orange font-black">./run_smoke_tests.sh</span></div>
                        </div>
                    </div>

                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
                </div>

                {/* Need Help */}
                <div className="content-card bg-teal-accent/10 border-teal-accent/20 border-dotted border-4 p-12 text-center group hover:bg-teal-accent/15 transition-all">
                    <h3 className="text-4xl font-crazy font-extrabold text-gray-900 mb-6 drop-shadow-sm">Need a hand? 🤝</h3>
                    <p className="text-xl font-bold text-gray-800 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stuck on a build error? Confused by the VM logic? We&apos;re here to help you grow. No gatekeeping, just coding.
                    </p>
                    <a href="https://github.com/donwolfonline/pumpkin/issues" className="btn btn-primary px-12 py-5 text-2xl group-hover:scale-105 transition-transform">
                        Explore Open Issues
                    </a>
                </div>

            </div>
        </section>
    );
}
