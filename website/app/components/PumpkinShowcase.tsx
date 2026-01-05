'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const pumpkins = [
    { src: '/images/mascot_neutral.svg', name: 'Curious', alt: 'Curious Pumpkin' },
    { src: '/images/mascot_happy.svg', name: 'Joyful', alt: 'Happy Pumpkin' },
    { src: '/images/mascot_help.svg', name: 'Helpful', alt: 'Helper Pumpkin' },
];

export default function PumpkinShowcase() {
    return (
        <section className="pill-section py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-center mb-12 sm:mb-16 text-pumpkin-orange drop-shadow-[0_4px_20px_rgba(255,140,26,0.3)]"
                >
                    Meet the Pumpkin Family 🎃
                </motion.h2>
                <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16">
                    {pumpkins.map((pumpkin, index) => (
                        <motion.div
                            key={pumpkin.name}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            whileHover={{ y: -15, scale: 1.05 }}
                            className="text-center"
                        >
                            <Image
                                src={pumpkin.src}
                                alt={pumpkin.alt}
                                width={150}
                                height={150}
                                className="w-28 sm:w-32 md:w-36 lg:w-40 drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] transition-all duration-300"
                            />
                            <p className="mt-4 text-lg sm:text-xl font-semibold text-white">{pumpkin.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
