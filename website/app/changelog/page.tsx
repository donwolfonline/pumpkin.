'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const logs = [
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
        <div className="min-h-screen bg-[#FFFBF5] pt-32 pb-20 px-4 relative overflow-hidden">
            <Navbar />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl md:text-7xl font-crazy font-extrabold text-gray-900 mb-6 drop-shadow-[4px_4px_0px_#fff]">
                        📜 Change Log
                    </h1>
                    <p className="text-2xl text-gray-700 font-bold max-w-2xl mx-auto leading-relaxed">
                        Tracking every seed we plant in the Pumpkin patch.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="space-y-12 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gray-900/10 -translate-x-1/2 hidden md:block" />

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
                                <div className="bg-white p-6 md:p-8 rounded-3xl border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 bg-pumpkin-orange text-white font-bold rounded-lg text-sm border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                                            {log.version}
                                        </span>
                                        <span className="text-gray-500 font-bold text-sm">{log.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-crazy font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span>{log.icon}</span> {log.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {log.changes.map((change, i) => (
                                            <li key={i} className="flex gap-3 text-gray-700 font-medium leading-relaxed">
                                                <span className="text-pumpkin-orange">●</span>
                                                {change}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Center Icon */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-gray-900 rounded-full items-center justify-center z-20 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                <span className="text-xl">{log.icon}</span>
                            </div>

                            <div className="flex-1 hidden md:block" />
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mt-24"
                >
                    <Link
                        href="/playground"
                        className="inline-flex items-center gap-3 bg-teal-accent text-white font-black py-4 px-10 rounded-full border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-xl"
                    >
                        Go Build Something 🚀
                    </Link>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
