'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Helper to render text with markdown-style links [text](url)
const renderTextWithLinks = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
            return (
                <a
                    key={i}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-accent font-black hover:underline decoration-wavy underline-offset-4"
                >
                    {match[1]}
                </a>
            );
        }
        return part;
    });
};

const logs = [
    {
        date: 'Jan 7, 2026',
        version: 'v0.1.7',
        title: 'Release: Official Branding & Editor Support',
        changes: [
            'Designed and integrated official Pumpkin SVG branding across the ecosystem.',
            'Launched the official VS Code Marketplace extension (FrederickDineen.pumpkin-vscode). [Click here to install](https://marketplace.visualstudio.com/items?itemName=FrederickDineen.pumpkin-vscode).',
            'Added `install-extension` command to CLI for effortless editor setup.',
            'Updated CLI and website components with v0.1.7 synchronization.',
        ],
        icon: '🎨'
    },
    {
        date: 'Jan 7, 2026',
        version: 'v0.1.6',
        title: 'Hotfix: Documentation Sync',
        changes: [
            'Synchronized all version references in README and CLI output.',
            'Ensured npm landing page correctly reflects the latest release.',
        ],
        icon: '🩹'
    },
    {
        date: 'Jan 7, 2026',
        version: 'v0.1.5',
        title: 'Hotfix: Grammar Refinement',
        changes: [
            'Added support for `//` style comments alongside `#`.',
            'Made `times` keyword optional in `repeat` loops (e.g. `repeat 3 { ... }`).',
            'Fixed parsing errors in examples provided in documentation.',
        ],
        icon: '🩹'
    },
    {
        date: 'Jan 7, 2026',
        version: 'v0.1.4',
        title: 'Hotfix: ESM Compatibility',
        changes: [
            'Fixed `ReferenceError: __dirname is not defined` in CLI and REPL.',
            'Synchronized versioning across CLI, README, and website IDE components.',
            'Standardized npx instructions for easier local exploration.',
        ],
        icon: '🩹'
    },
    {
        date: 'Jan 7, 2026',
        version: 'v0.1.3',
        title: 'Hotfix: WASM Engine Inclusion',
        changes: [
            'Fixed critical issue where the WASM core engine was excluded from npm packages.',
            'Restructured build pipeline to automatically remove hidden gitignore files from distribution.',
            'Ensured full offline capability for CLI and local installations.',
        ],
        icon: '📦'
    },
    {
        date: 'Jan 7, 2026',
        version: 'v0.1.2',
        title: 'Hotfix: CLI Entry Point',
        changes: [
            'Added `#!/usr/bin/env node` hashbang to CLI entry point to fix execution errors on POSIX systems.',
            'Ensured `npx pumpkin` and global installation execute correctly.',
        ],
        icon: '🩹'
    },
    {
        date: 'Jan 7, 2026',
        version: 'v0.1.1',
        title: 'Hotfix: Distribution Paths',
        changes: [
            'Fixed `unresolved module` error in CLI runtime by correcting WASM build output path.',
            'Ensured `npm install pumpkin-lang` works out of the box.',
        ],
        icon: '🚑'
    },
    {
        date: 'Jan 7, 2026',
        version: 'v1.4.0',
        title: 'Open Source & Polish',
        changes: [
            'Implemented Dual Licensing: MIT and GNU GPL v3 for greater freedom.',
            'Refined website footer with a compact, single-line layout.',
            'Added npm registry link to footer.',
            'Updated logo and trademark guidelines for clarity.',
            'General UI polish and responsive design improvements.',
        ],
        icon: '⚖️'
    },
    {
        date: 'Jan 6, 2026',
        version: 'v1.3.0',
        title: 'The Pumpkin Language Features',
        changes: [
            'Installation via `npm install pumpkin-lang` now supported.',
            'Interactive REPL available via `pumpkin repl` command.',
            'New tour script `pumpkin run examples/tour.pumpkin` added.',
            'Added standard library examples: Guessing Game, Hello World, Daily Routine.',
            'Core language features: `show` for output, `let` for variables, human-readable math.',
        ],
        icon: '🎃'
    },
    {
        date: 'Jan 5, 2026',
        version: 'v1.2.0',
        title: 'The Brand Refresh & Hurricane Background',
        changes: [
            'Project-wide brand refresh with new high-fidelity logo.',
            'Implemented interactive "Hurricane" background dots that react to mouse movements.',
            'Added public Change Log page (you are here!) to track our progress.',
            'Optimized global layout with high-performance Canvas animations.',
        ],
        icon: '🚀'
    },
    {
        date: 'Jan 4, 2026',
        version: 'v1.1.0',
        title: 'Community & Connections',
        changes: [
            'Launched Anonymous Community Page with Neon Postgres integration.',
            'Implemented Cloudinary-powered image uploads for community posts.',
            'Added like and comment systems with real-time feedback.',
            'Implemented browser-based fingerprinting for persistent anonymous identity.',
            'Enhanced community UI with floating pumpkin mascots and skeletons.',
        ],
        icon: '🌐'
    },
    {
        date: 'Jan 3, 2026',
        version: 'v1.0.0',
        title: 'The "Pumpkin Pop" Website',
        changes: [
            'Redesigned landing page with vibrant neobrutalist theme.',
            'Implemented responsive Pumpkin IDE (Playground) with Web Worker isolation.',
            'Created unified tech footer with animated logos (JS, TS, Next, Node, Rust).',
            'Implemented mobile-first responsive layouts across the site.',
        ],
        icon: '🎃'
    },
    {
        date: 'Dec 20, 2025',
        version: 'v0.5.0',
        title: 'The Core Engine',
        changes: [
            'Initialized Pumpkin Core interpreter in Rust.',
            'Defined AST and execution flow for human-readable logic.',
            'Developed WASM bridge for browser-side execution.',
            'Integrated CodeMirror 6 with custom Pumpkin syntax highlighting.',
        ],
        icon: '⚙️'
    }
];

export default function ChangeLogPage() {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-32 pb-24 px-4 relative overflow-hidden">
            <Navbar />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-3 bg-pumpkin-orange/10 px-6 py-2 rounded-full mb-6 border-2 border-pumpkin-orange/20 shadow-sm">
                        <span className="text-xl">📜</span>
                        <span className="font-heading font-black text-pumpkin-orange tracking-tight uppercase text-sm">Development Arc</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-crazy font-extrabold text-gray-900 mb-8 drop-shadow-[2px_2px_0px_#FF8C1A]">
                        Change Log
                    </h1>
                    <p className="text-xl md:text-3xl text-gray-800 font-bold max-w-2xl mx-auto leading-relaxed">
                        Tracking every <span className="text-teal-accent underline decoration-wavy">seed we plant</span> in the Pumpkin patch.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="space-y-16 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pumpkin-orange/40 via-teal-accent/40 to-burgundy-dark/10 -translate-x-1/2 hidden md:block" />

                    {logs.map((log, index) => (
                        <motion.div
                            key={log.version}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
                            className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}
                        >
                            {/* Content Card */}
                            <div className="w-full md:w-[45%]">
                                <div className="content-card group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative border-white/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-crazy font-extrabold text-gray-900 leading-none">{log.version}</span>
                                            <span className="text-pumpkin-orange font-heading font-black text-xs uppercase tracking-widest mt-1">Release</span>
                                        </div>
                                        <span className="text-gray-500 font-bold text-sm bg-gray-100/50 px-4 py-1 rounded-full border border-gray-200">{log.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-crazy font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                                        <span className="text-3xl group-hover:rotate-12 transition-transform">{log.icon}</span>
                                        {log.title}
                                    </h3>
                                    <ul className="space-y-4">
                                        {log.changes.map((change, i) => (
                                            <li key={i} className="flex gap-4 text-gray-700 font-bold leading-relaxed items-start">
                                                <div className="w-2 h-2 bg-teal-accent rounded-full mt-2.5 shadow-[0_0_8px_#3B8B8B]"></div>
                                                <span className="flex-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                                    {renderTextWithLinks(change)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Abstract glow */}
                                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-10 transition-colors ${index % 2 === 0 ? 'bg-pumpkin-orange' : 'bg-teal-accent'
                                        }`} />
                                </div>
                            </div>

                            {/* Center Icon */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-white/40 backdrop-blur-xl border-4 border-white/50 rounded-[24px] items-center justify-center z-20 shadow-xl group hover:scale-110 transition-transform">
                                <span className="text-3xl group-hover:animate-float">{log.icon}</span>
                            </div>

                            <div className="flex-1 hidden md:block" />
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mt-32"
                >
                    <div className="pill-section py-16 px-8 bg-white/10 backdrop-blur-2xl inline-block border-white/20 shadow-hero max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-crazy font-extrabold text-gray-900 mb-8">Ready to plant your own ideas?</h2>
                        <p className="text-xl font-bold text-gray-700 mb-10 max-w-md mx-6">
                            Grab the current build and start building something human-first today.
                        </p>
                        <Link
                            href="/playground"
                            className="btn btn-primary px-12 py-5 text-2xl"
                        >
                            Go Build Something 🚀
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pumpkin-orange/15 rounded-full blur-[100px] -z-0" />
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-teal-accent/10 rounded-full blur-[120px] -z-0" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-burgundy-dark/10 rounded-full blur-[100px] -z-0" />

            <Footer />
        </div>
    );
}
