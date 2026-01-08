import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mx-4 md:mx-8 lg:mx-12 mb-4 md:mb-8 bg-white/80 backdrop-blur-xl py-6 md:py-8 rounded-[32px] border-2 border-gray-900/10 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col xl:flex-row items-center justify-center gap-y-4 gap-x-6 text-sm font-medium text-gray-500 text-center xl:text-left flex-wrap">

                    {/* Copyright & Changelog */}
                    <div className="flex items-center gap-3">
                        <p>© {new Date().getFullYear()} Pumpkin 🎃.</p>
                        <span className="text-gray-300">•</span>
                        <Link href="/changelog" className="text-pumpkin-orange font-bold hover:underline decoration-wavy underline-offset-4">
                            Change Log
                        </Link>
                    </div>

                    <span className="hidden xl:inline text-gray-300">•</span>

                    {/* Licenses */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/donwolfonline/pumpkin./blob/main/LICENSE"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-gray-400 hover:text-pumpkin-orange transition-colors"
                        >
                            {/* MIT License Icon */}
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100" aria-label="MIT License">
                                <path d="M9 7V17M15 7V17M4 5H20V19H4V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                            MIT License
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                            href="https://github.com/donwolfonline/pumpkin./blob/main/LICENSE-GPL"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-gray-400 hover:text-pumpkin-orange transition-colors"
                        >
                            {/* GPL License Icon */}
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100" aria-label="GPL License">
                                <path d="M3 6h18M7 6v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6M10 10v6M14 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                            GPL v3
                        </a>
                    </div>

                    <span className="hidden xl:inline text-gray-300">•</span>

                    {/* Founder */}
                    <div>
                        Founded by <a href="https://www.frederickdineen.com" target="_blank" rel="noopener noreferrer" className="text-pumpkin-orange font-bold hover:underline decoration-wavy underline-offset-4">Frederick Dineen</a>
                    </div>

                    <span className="hidden xl:inline text-gray-300">•</span>

                    {/* Tech Stack & Github */}
                    <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                        {/* JavaScript Logo */}
                        <svg viewBox="0 0 100 100" className="w-5 h-5 rounded-sm fill-[#F7DF1E]" role="img" aria-label="JavaScript">
                            <rect width="100" height="100" rx="10" ry="10" />
                            <text x="75" y="75" fontSize="45" fontWeight="bold" fill="black" textAnchor="middle" fontFamily="Arial, sans-serif">JS</text>
                        </svg>
                        {/* TypeScript Logo */}
                        <svg viewBox="0 0 100 100" className="w-5 h-5 rounded-sm fill-[#3178C6]" role="img" aria-label="TypeScript">
                            <rect width="100" height="100" rx="10" ry="10" />
                            <text x="75" y="75" fontSize="45" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">TS</text>
                        </svg>
                        {/* Next.js Logo */}
                        <svg viewBox="0 0 180 180" className="w-5 h-5 fill-black" role="img" aria-label="Next.js">
                            <mask height="180" id="mask0_next_compact" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }} ><circle cx="90" cy="90" fill="#000" r="90" /></mask>
                            <g mask="url(#mask0_next_compact)"><circle cx="90" cy="90" data-circle="true" fill="#000" r="90" /><path d="M149.508 157.52L69.142 54H54v71.97h12.27V66.912l80.284 103.235c2.492-6.582 5.067-12.637 2.954-12.627z" fill="#fff" /><path d="M115.79 54h12.27v72h-12.27z" fill="#fff" /></g>
                        </svg>
                        {/* Node.js Logo */}
                        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-[#339933]" role="img" aria-label="Node.js">
                            <path d="M16 0L29.856 8V24L16 32L2.144 24V8L16 0Z" />
                            <text x="16" y="20" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">JS</text>
                        </svg>
                        {/* Rust Logo */}
                        <svg viewBox="0 0 100 100" className="w-5 h-5 fill-[#000000]" role="img" aria-label="Rust">
                            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z" opacity="0.2" />
                            <path d="M50 10a40 40 0 1 0 0 80 40 40 0 0 0 0-80z" fill="none" stroke="currentColor" strokeWidth="6" />
                            <text x="50" y="65" fontSize="50" fontWeight="900" textAnchor="middle" fill="currentColor">R</text>
                        </svg>

                        <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>

                        <a
                            href="https://www.npmjs.com/package/pumpkin-lang"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#CB3837] transition-all transform hover:scale-110"
                            aria-label="NPM Package"
                        >
                            <svg viewBox="0 0 256 256" className="w-5 h-5 fill-current" role="img" aria-label="NPM">
                                <path d="M0 256V0h256v256z" fill="#C12127" fillOpacity="0" />
                                <path d="M48 48h160v160h-32V80h-48v128H48z" />
                            </svg>
                        </a>
                        <a
                            href="https://marketplace.visualstudio.com/items?itemName=FrederickDineen.pumpkin-vscode"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#0078D4] transition-all transform hover:scale-110"
                            aria-label="VS Code Marketplace"
                        >
                            <svg viewBox="0 0 23 23" className="w-5 h-5 fill-current" role="img" aria-label="Microsoft">
                                <path d="M11.4 0H0v11.4h11.4V0zM23 0H11.6v11.4H23V0zM11.4 11.6H0V23h11.4V11.6zM23 11.6H11.6V23H23V11.6z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.linkedin.com/company/iampumpkin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#0A66C2] transition-all transform hover:scale-110"
                            aria-label="LinkedIn Company Page"
                        >
                            <Linkedin size={20} />
                        </a>
                        <a
                            href="https://x.com/thenewpumpkin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-black transition-all transform hover:scale-110"
                            aria-label="Twitter / X"
                        >
                            <Twitter size={20} />
                        </a>
                        <a
                            href="https://github.com/donwolfonline/pumpkin."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-pumpkin-orange transition-all transform hover:scale-110"
                            aria-label="GitHub Repository"
                        >
                            <Github size={20} />
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}
