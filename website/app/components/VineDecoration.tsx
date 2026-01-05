'use client';

import { motion } from 'framer-motion';

export default function Vine({ className = "", rotate = 0, delay = 0 }: { className?: string; rotate?: number; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 1 }}
            className={`absolute pointer-events-none -z-10 ${className}`}
            style={{ transform: `rotate(${rotate}deg)` }}
        >
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                    d="M10,190 Q50,150 20,100 T80,50 Q100,20 150,40"
                    stroke="#2D4D44"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, delay }}
                />
                {/* Simple leaves */}
                <circle cx="20" cy="100" r="8" fill="#3B6B5D" />
                <circle cx="80" cy="50" r="10" fill="#4C8A77" />
                <circle cx="150" cy="40" r="6" fill="#3B6B5D" />
                <path d="M140,40 L160,40" stroke="#2D4D44" strokeWidth="2" />
            </svg>
        </motion.div>
    );
}
