'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const links = [
        { href: '#learn', label: 'Learn' },
        { href: '#docs', label: 'Docs' },
        { href: '/playground', label: 'Playground' },
        { href: '/community', label: 'Community' },
    ];

    return (
        <nav className="fixed top-4 md:top-8 left-4 md:left-8 lg:left-12 right-4 md:right-8 lg:right-12 z-50 bg-white/80 backdrop-blur-2xl border-2 border-gray-900/10 rounded-full shadow-xl overflow-visible">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
                        <Image
                            src="/pumpkin-dot-logo.png"
                            alt="Pumpkin Logo"
                            width={220}
                            height={55}
                            className="h-12 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex gap-8">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="font-bold text-gray-700 relative group transition-colors hover:text-pumpkin-orange"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pumpkin-orange transition-all duration-300 group-hover:w-full" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop CTA */}
                    <a href="#get-started" className="hidden md:block btn btn-primary text-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] transition-all border-2 border-gray-900">
                        Get Started
                    </a>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-black/5 text-gray-900 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-md z-[-1]"
                        />

                        {/* Floating Menu Container */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                                mass: 0.8
                            }}
                            className="absolute top-full left-0 right-0 mt-4 mx-2 p-4 bg-white border-2 border-gray-900 rounded-[2rem] shadow-[8px_8px_0px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col gap-3"
                        >
                            {links.map((link, index) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{
                                        delay: index * 0.05,
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }}
                                    className="flex items-center justify-center w-full py-3 px-6 rounded-full bg-gray-50 border-2 border-transparent hover:border-pumpkin-orange hover:bg-pumpkin-orange/10 transition-all duration-300 group"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="font-bold text-gray-900 text-lg group-hover:scale-105 transition-transform duration-300">
                                        {link.label}
                                    </span>
                                </motion.a>
                            ))}
                            <motion.a
                                href="#get-started"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    delay: links.length * 0.05,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15
                                }}
                                className="flex items-center justify-center w-full py-4 px-6 mt-2 rounded-full bg-pumpkin-orange text-white font-black border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] transition-all duration-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started 🚀
                            </motion.a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
