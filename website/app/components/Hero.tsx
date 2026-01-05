'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Vine from './VineDecoration';

export default function Hero() {
    return (
        <header className="px-6 md:px-12 py-20 md:py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left z-10"
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-crazy leading-tight mb-8 rotate-[-2deg] text-gray-900 drop-shadow-[2px_2px_0px_#fff]">
                            The programming <br /> language you can <br />
                            <span className="relative inline-block text-pumpkin-orange hover:rotate-[5deg] transition-transform cursor-pointer drop-shadow-[2px_2px_0px_#000]">
                                actually read! 🎃
                                <span className="absolute -bottom-2 left-0 w-full h-4 bg-teal-accent/20 -rotate-2 -z-10" />
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl lg:text-3xl mb-12 opacity-95 font-semibold max-w-2xl mx-auto lg:mx-0 text-gray-700 leading-relaxed">
                            Stop wrestling with scary syntax. Pumpkin is the derpy-friendly language that makes coding feel like a party! 🥳
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                            <a href="#playground" className="btn btn-primary text-xl scale-110 hover:scale-125 transition-transform active:scale-100 shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-gray-900 hover:shadow-none hover:translate-y-[4px]">
                                Try It Now! 🚀
                            </a>
                            <a href="#docs" className="btn btn-outline border-2 border-gray-900 text-gray-900 hover:bg-pumpkin-orange hover:text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[4px] bg-white">
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
                                className="w-48 sm:w-64 md:w-80 lg:w-96 drop-shadow-[8px_8px_0px_rgba(0,0,0,0.1)] group-hover:animate-jitter"
                            />
                            <div className="absolute -top-10 -left-10 bg-white border-2 border-gray-900 text-black p-3 rounded-2xl font-crazy text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-[-10deg]">
                                &quot;Wait, what? Logic?&quot;
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
                                className="w-32 sm:w-44 md:w-56 lg:w-64 drop-shadow-[8px_8px_0px_rgba(0,0,0,0.1)] group-hover:animate-jitter scale-x-[-1]"
                            />
                            <div className="absolute -top-5 -right-5 bg-pumpkin-orange border-2 border-gray-900 text-white p-3 rounded-2xl font-crazy text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-[15deg]">
                                &quot;LOOK A BUG!&quot;
                            </div>
                        </motion.div>

                        {/* Subtle Orange Glow behind them */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-pumpkin-orange/10 blur-[60px] rounded-full -z-10" />
                    </motion.div>
                </div>
            </div>

            {/* Background Decorations (Subtle blobs) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50/50 rounded-full blur-[100px] -z-10" />

            {/* Decorative Vines */}
            <Vine className="top-20 right-10 opacity-40" rotate={120} delay={0.5} />
            <Vine className="bottom-10 left-20 opacity-40" rotate={-45} delay={1} />
            <Vine className="top-1/2 left-0 opacity-30" rotate={90} delay={1.5} />
        </header>
    );
}
