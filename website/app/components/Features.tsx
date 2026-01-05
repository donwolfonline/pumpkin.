'use client';

import { motion } from 'framer-motion';

const features = [
    { icon: '📦', title: 'Variables', desc: 'Store data like a pro. Strings, numbers, and booleans are ready to use instantly.', rarity: 'Common' },
    { icon: '🧮', title: 'Math & Logic', desc: 'Calculate the tip or solve the universe. Plus, simple logic with "if", "else", "and".', rarity: 'Common' },
    { icon: '🔁', title: 'Loops', desc: 'Repeat yourself without getting tired. Use "repeat" or "while" to automate everything.', rarity: 'Uncommon' },
    { icon: '💬', title: 'Output', desc: 'Just say "show". No "System.out.println" or "console.log" required here.', rarity: 'Rare' },
    { icon: '🛡️', title: 'Friendly Errors', desc: 'Errors that help you fix them, not scare you away. "Hey, you missed a quote!"', rarity: 'Epic' },
    { icon: '🚀', title: 'Zero Setup', desc: 'No compiler to install. No environment variables. Just open your browser and code.', rarity: 'Legendary' },
];

export default function Features() {
    return (
        <section className="py-20 px-4 md:px-0 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
                    viewport={{ once: true }}
                    className="text-4xl sm:text-5xl md:text-6xl font-crazy font-extrabold text-center mb-16 text-pumpkin-orange drop-shadow-[2px_2px_0px_#000]"
                >
                    Language Capabilities ⚡
                </motion.h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 50, scale: 0.5 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -10, rotate: index % 2 === 0 ? 2 : -2 }}
                            className="relative group h-full"
                        >
                            <div className="bg-white rounded-[32px] p-8 h-full flex flex-col items-center text-center border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                                <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300 drop-shadow-md">
                                    {feature.icon}
                                </div>
                                <div className="mb-4 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-600 border border-gray-300">
                                    {feature.rarity}
                                </div>
                                <h3 className="text-2xl font-crazy text-gray-900 mb-4 tracking-wide underline decoration-pumpkin-orange/50 underline-offset-4">
                                    {feature.title}
                                </h3>
                                <p className="text-base leading-relaxed text-gray-600 font-medium">
                                    {feature.desc}
                                </p>

                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-pumpkin-orange/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] -z-10 blur-xl" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-accent/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-pumpkin-orange/20 rounded-full blur-[100px] -z-10" />
        </section>
    );
}

