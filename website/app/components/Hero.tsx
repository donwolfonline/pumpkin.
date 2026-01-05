'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Vine from './VineDecoration';

export default function Hero() {
    return (
        <header className="pill-section px-6 md:px-12 py-20 md:py-32">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left z-10"
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-crazy leading-tight mb-8 rotate-[-2deg] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                            The programming <br /> language you can <br />
                            <span className="relative inline-block text-pumpkin-orange hover:rotate-[5deg] transition-transform cursor-pointer">
                                actually read! 🎃
                                <span className="absolute -bottom-2 left-0 w-full h-4 bg-teal-accent/40 -rotate-2 -z-10" />
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl lg:text-3xl mb-12 opacity-95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-semibold max-w-2xl mx-auto lg:mx-0">
                            Stop wrestling with scary syntax. Pumpkin is the derpy-friendly language that makes coding feel like a party! 🥳
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                            <a href="#playground" className="btn btn-primary text-xl scale-110 hover:scale-125 transition-transform active:scale-100">
                                Try It Now! 🚀
                            </a>
                            <a href="#docs" className="btn btn-outline text-xl hover:bg-pumpkin-orange/30">
                                Get The Guide
                            </a>
                        </div>
                    </motion.div>

                    {/* Derpy Duo Mascots */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center items-end gap-0 sm:gap-4 z-10 relative mt-12 lg:mt-0"
                    >
                        {/* The Large "Worried" Pumpkin */}
                        <motion.div
                            animate={{
                                y: [0, -30, 0],
                                rotate: [-2, 2, -2]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="group cursor-help z-20"
                        >
                            <Image
                                src="/images/mascot_neutral.svg"
                                alt="Worried Big Pumpkin"
                                width={300}
                                height={300}
                                className="w-48 sm:w-64 md:w-80 lg:w-96 drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)] group-hover:animate-jitter"
                            />
                            <div className="absolute -top-10 -left-10 bg-white text-black p-3 rounded-2xl font-crazy text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-xl rotate-[-10deg]">
                                "Wait, what? Logic?"
                            </div>
                        </motion.div>

                        {/* The Smaller "Derpy" Pumpkin */}
                        <motion.div
                            animate={{
                                y: [0, -40, 0],
                                rotate: [5, -5, 5]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="group cursor-crosshair -ml-16 sm:-ml-24 z-30"
                        >
                            <Image
                                src="/images/mascot_happy.svg"
                                alt="Derpy Small Pumpkin"
                                width={200}
                                height={200}
                                className="w-32 sm:w-44 md:w-56 lg:w-64 drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)] group-hover:animate-jitter scale-x-[-1]"
                            />
                            <div className="absolute -top-5 -right-5 bg-pumpkin-orange text-white p-3 rounded-2xl font-crazy text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-xl rotate-[15deg]">
                                "LOOK A BUG!"
                            </div>
                        </motion.div>

                        {/* Glowing Background Glow for them */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pumpkin-orange/20 blur-[120px] rounded-full -z-10" />
                    </motion.div>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pumpkin-orange/15 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-accent/20 rounded-full blur-[120px] -z-10" />

            {/* The Spooky Moon */}
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-10 left-10 sm:left-20 w-32 h-32 sm:w-48 sm:h-48 bg-[#FEF9E7] rounded-full blur-[40px] opacity-50 -z-10"
            />
            <div className="absolute top-14 left-14 sm:left-24 w-24 h-24 sm:w-36 sm:h-36 bg-[#FEF9E7] rounded-full opacity-30 shadow-[0_0_80px_#FEF9E7] -z-10" />

            {/* Decorative Vines */}
            <Vine className="top-20 right-10" rotate={120} delay={0.5} />
            <Vine className="bottom-10 left-20" rotate={-45} delay={1} />
            <Vine className="top-1/2 left-0" rotate={90} delay={1.5} />
        </header>
    );
}
