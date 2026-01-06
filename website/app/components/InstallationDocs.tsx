import React from 'react';
import { Download, Cpu, Package } from 'lucide-react';

export default function InstallationDocs() {
    return (
        <section id="docs" className="py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-crazy font-extrabold mb-6 text-gray-900 border-b-4 border-pumpkin-orange inline-block pb-2">
                        Install Pumpkin
                    </h2>
                    <p className="text-xl text-gray-800 font-bold">
                        Get up and running in <span className="text-pumpkin-orange underline decoration-wavy decoration-teal-accent">seconds</span>.
                    </p>
                </div>

                <div className="grid md:grid-cols-1 gap-8 mb-12">
                    {/* Method 1: NPM */}
                    <div className="content-card group hover:-translate-y-2 transition-all duration-300">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 bg-pumpkin-orange/10 rounded-[20px] flex items-center justify-center border-2 border-pumpkin-orange/20 shadow-lg group-hover:bg-pumpkin-orange/20 transition-all">
                                <Package className="w-8 h-8 text-pumpkin-orange" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-crazy font-extrabold text-gray-900">NPM (Recommended)</h3>
                                <p className="text-lg text-gray-600 font-bold">For macOS, Linux, and Windows</p>
                            </div>
                        </div>

                        <div className="bg-burgundy-dark rounded-[30px] p-6 text-emerald-400 font-code text-lg mb-6 relative shadow-inner border-2 border-white/5">
                            <span className="text-white/40 select-none">$</span> npm install -g pumpkin-lang
                        </div>
                        <p className="text-gray-700 mb-6 font-medium leading-relaxed">
                            Requires Node.js v14+. Use <code className="bg-pumpkin-orange/10 px-2 py-0.5 rounded border border-pumpkin-orange/20 text-pumpkin-orange font-bold">sudo</code> if you hit permission errors.
                        </p>
                        <div className="bg-white/5 rounded-[20px] p-4 text-sm font-code text-gray-600 border border-white/10">
                            <span className="text-gray-400"># Verify the install</span><br />
                            <span className="text-pumpkin-orange font-bold">$</span> pumpkin --version
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Prebuilt Binaries */}
                    <div className="content-card group hover:-translate-y-2 transition-all duration-300 border-teal-accent/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-teal-accent/10 rounded-2xl flex items-center justify-center border-2 border-teal-accent/20">
                                <Download className="w-7 h-7 text-teal-accent" />
                            </div>
                            <h3 className="text-2xl font-crazy font-extrabold text-gray-900">Binaries</h3>
                        </div>
                        <p className="text-gray-700 font-medium mb-8 leading-relaxed">
                            Standalone executables for x86_64 systems. No dependencies required.
                        </p>
                        <a href="https://github.com/donwolfonline/pumpkin" className="btn btn-secondary w-full text-center py-4 text-lg">
                            Download Release
                        </a>
                    </div>

                    {/* Source Build */}
                    <div className="content-card group hover:-translate-y-2 transition-all duration-300 border-burgundy-mid/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-burgundy-mid/10 rounded-2xl flex items-center justify-center border-2 border-burgundy-mid/20">
                                <Cpu className="w-7 h-7 text-burgundy-mid" />
                            </div>
                            <h3 className="text-2xl font-crazy font-extrabold text-gray-900">From Source</h3>
                        </div>
                        <p className="text-gray-700 font-medium mb-8 leading-relaxed">
                            Build the optimized Rust core yourself. Requires Cargo.
                        </p>
                        <div className="bg-burgundy-dark p-4 rounded-xl text-emerald-400 font-code text-sm shadow-inner overflow-hidden text-center">
                            cargo install --path .
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
