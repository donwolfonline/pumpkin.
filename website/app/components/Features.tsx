'use client';

import { motion } from 'framer-motion';

const features = [
    { icon: '🎁', title: 'Derpy Errors', desc: "Pumpkin doesn't yell. It whispers kindly: \"Hey, that semicolon looks lonely, maybe delete it?\"", rarity: 'Common' },
    { icon: '🪄', title: 'Magic Words', desc: 'No brackets. No jargon. Just words you already know, like "show" and "ask".', rarity: 'Rare' },
    { icon: '🍗', title: 'Instant Power', desc: 'Download it. Run it. Build global domination from your bedroom. No setup required.', rarity: 'Epic' },
];

export default function Features() {
    return (
        <section className="pill-section py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
                    viewport={{ once: true }}
                    className="text-5xl sm:text-6xl md:text-7xl font-crazy font-extrabold text-center mb-20 text-pumpkin-orange drop-shadow-[0_10px_40px_rgba(255,140,26,0.6)]"
                >
                    Collect Your Features! 💎
                </motion.h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 50, scale: 0.5 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -20, rotate: index % 2 === 0 ? 3 : -3 }}
                            className="relative p-1 bg-gradient-to-br from-pumpkin-orange via-transparent to-teal-accent rounded-[40px] group shadow-2xl"
                        >
                            <div className="bg-[#1e1422] rounded-[38px] p-10 h-full flex flex-col items-center text-center">
                                <div className="text-7xl mb-8 group-hover:scale-150 group-hover:rotate-[20deg] transition-all duration-300 drop-shadow-[0_0_20px_rgba(255,140,26,0.4)]">
                                    {feature.icon}
                                </div>
                                <div className="mb-4 px-4 py-1 rounded-full bg-black/40 text-xs font-bold uppercase tracking-widest text-pumpkin-orange border border-pumpkin-orange/30">
                                    {feature.rarity} Item
                                </div>
                                <h3 className="text-3xl font-crazy text-white mb-6 tracking-wide underline decoration-pumpkin-orange/50 underline-offset-8">
                                    {feature.title}
                                </h3>
                                <p className="text-lg leading-relaxed opacity-80 text-gray-300 font-medium">
                                    {feature.desc}
                                </p>

                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-pumpkin-orange/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px] -z-10 blur-xl" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-accent/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-pumpkin-orange/10 rounded-full blur-[100px] -z-10" />
        </section>
    );
}

