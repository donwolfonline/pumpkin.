'use client';

import { motion } from 'framer-motion';
import Vine from './VineDecoration';

export default function CodeComparison() {
    return (
        <section className="pill-section py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-5xl sm:text-6xl md:text-7xl font-crazy font-extrabold text-center mb-20 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] leading-tight"
                >
                    Code That <span className="text-pumpkin-orange">Doesn't Scare</span> You! 👻
                </motion.h2>
                <div className="grid md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
                    {/* Boring Symbols */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, rotate: -2 }}
                        whileInView={{ opacity: 1, x: 0, rotate: -1 }}
                        viewport={{ once: true }}
                        className="bg-burgundy-dark/90 backdrop-blur-xl rounded-[40px] p-8 sm:p-10 shadow-2xl border-4 border-white/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-500/30" />
                        <h3 className="text-2xl sm:text-3xl font-crazy text-gray-400 mb-8 flex items-center gap-3">
                            <span>😴</span> Boring Symbols
                        </h3>
                        <pre className="bg-black/60 p-6 sm:p-8 rounded-3xl overflow-x-auto font-code text-sm sm:text-base border border-white/5 text-gray-400">
                            <code>{`const x = readline();
if (x != null && x > 10) {
  console.log("Success");
}`}</code>
                        </pre>
                    </motion.div>

                    {/* Fun Pumpkin */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: 2 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-pumpkin-orange/20 to-teal-accent/20 backdrop-blur-xl rounded-[40px] p-8 sm:p-10 shadow-2xl border-4 border-pumpkin-orange/40 relative"
                    >
                        <div className="absolute -top-5 -right-5 bg-pumpkin-orange text-white p-3 rounded-2xl font-crazy text-sm shadow-xl rotate-12">
                            WOW! SO EASY!
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-crazy text-pumpkin-orange mb-8 flex items-center gap-3">
                            <span>🎃</span> Thinking in Pumpkin
                        </h3>
                        <pre className="bg-black/60 p-6 sm:p-8 rounded-3xl overflow-x-auto font-code text-sm sm:text-base border-2 border-pumpkin-orange/30 shadow-[0_0_30px_rgba(255,140,26,0.2)]">
                            <code className="text-white">{`ask "Enter a number" into x

if x > 10 {
    show "Success"
}`}</code>
                        </pre>
                    </motion.div>
                </div>
                <p className="text-center text-2xl sm:text-3xl mt-16 font-crazy text-gray-100 drop-shadow-lg">
                    Pumpkin lets you focus on <strong className="text-pumpkin-orange underline decoration-wavy underline-offset-8">logic</strong>, not punctuation! 🍭
                </p>
            </div>

            {/* Atmospheric Background Decorations */}
            <Vine className="top-10 left-0" rotate={-30} delay={0.2} />
            <Vine className="bottom-0 right-0" rotate={180} delay={0.5} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-accent/5 blur-[150px] rounded-full -z-10" />
        </section>
    );
}

