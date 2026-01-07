import { Github } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mx-4 md:mx-8 lg:mx-12 mb-4 md:mb-8 bg-white/80 backdrop-blur-xl py-8 md:py-10 rounded-[32px] border-2 border-gray-900/10 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0">

                    {/* Left: Copyright & Legal */}
                    <div className="flex flex-col items-center lg:items-start order-2 lg:order-1 gap-2">
                        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 text-sm font-medium text-gray-500">
                            <p>© {new Date().getFullYear()} Pumpkin 🎃.</p>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <Link href="/changelog" className="text-pumpkin-orange font-bold hover:underline decoration-wavy underline-offset-4">
                                Change Log
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
                            <a
                                href="https://github.com/donwolfonline/pumpkin/blob/main/LICENSE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-pumpkin-orange transition-colors"
                            >
                                {/* MIT License Icon */}
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100" aria-label="MIT License">
                                    <path d="M9 7V17M15 7V17M4 5H20V19H4V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                                MIT License
                            </a>
                            <span className="hidden sm:inline text-gray-300 mx-1">•</span>
                            <a
                                href="https://github.com/donwolfonline/pumpkin/blob/main/LICENSE-GPL"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-pumpkin-orange transition-colors"
                            >
                                {/* GPL License Icon (Scale) */}
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100" aria-label="GPL License">
                                    <path d="M3 6h18M7 6v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6M10 10v6M14 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                                GPL v3
                            </a>
                        </div>
                    </div>

                    {/* Center: Founder Info (Prominent) */}
                    <div className="order-1 lg:order-2">
                        <p className="text-sm md:text-base font-medium text-gray-500 text-center">
                            Founded by <a href="https://www.frederickdineen.com" target="_blank" rel="noopener noreferrer" className="text-pumpkin-orange font-bold hover:underline decoration-wavy underline-offset-4">Frederick Dineen</a>
                        </p>
                    </div>

                    {/* Right: Tech Stack & GitHub */}
                    <div className="order-3 flex flex-col items-center lg:items-end gap-3">
                        <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                            {/* JavaScript Logo */}
                            <svg viewBox="0 0 100 100" className="w-5 h-5 md:w-6 md:h-6 rounded-sm fill-[#F7DF1E]" role="img" aria-label="JavaScript">
                                <rect width="100" height="100" rx="10" ry="10" />
                                <text x="75" y="75" fontSize="45" fontWeight="bold" fill="black" textAnchor="middle" fontFamily="Arial, sans-serif">JS</text>
                            </svg>
                            {/* TypeScript Logo */}
                            <svg viewBox="0 0 100 100" className="w-5 h-5 md:w-6 md:h-6 rounded-sm fill-[#3178C6]" role="img" aria-label="TypeScript">
                                <rect width="100" height="100" rx="10" ry="10" />
                                <text x="75" y="75" fontSize="45" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">TS</text>
                            </svg>
                            {/* Next.js Logo */}
                            <svg viewBox="0 0 180 180" className="w-5 h-5 md:w-6 md:h-6 fill-black" role="img" aria-label="Next.js">
                                <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }} ><circle cx="90" cy="90" fill="#000" r="90" /></mask>
                                <g mask="url(#mask0_next)"><circle cx="90" cy="90" data-circle="true" fill="#000" r="90" /><path d="M149.508 157.52L69.142 54H54v71.97h12.27V66.912l80.284 103.235c2.492-6.582 5.067-12.637 2.954-12.627z" fill="#fff" /><path d="M115.79 54h12.27v72h-12.27z" fill="#fff" /></g>
                            </svg>
                            {/* Node.js Logo */}
                            <svg viewBox="0 0 32 32" className="w-5 h-5 md:w-6 md:h-6 fill-[#339933]" role="img" aria-label="Node.js">
                                <path d="M16 0L29.856 8V24L16 32L2.144 24V8L16 0Z" />
                                <text x="16" y="20" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">JS</text>
                            </svg>
                            {/* Rust Logo */}
                            <svg viewBox="0 0 100 100" className="w-5 h-5 md:w-6 md:h-6 fill-[#000000]" role="img" aria-label="Rust">
                                <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z" opacity="0.2" />
                                <path d="M50 10a40 40 0 1 0 0 80 40 40 0 0 0 0-80z" fill="none" stroke="currentColor" strokeWidth="6" />
                                <text x="50" y="65" fontSize="50" fontWeight="900" textAnchor="middle" fill="currentColor">R</text>
                            </svg>

                            <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>

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

                <div className="mt-8 pt-6 border-t border-gray-900/5">
                    <p className="text-[10px] sm:text-xs leading-relaxed text-gray-400 text-center max-w-3xl mx-auto">
                        <span className="font-bold text-gray-500">Trademark Notice:</span> The name "Pumpkin", and the "Pumpkin." logo are trademarks of Citrullix Inc. Use of these marks in derivative works requires explicit permission to avoid community confusion.
                    </p>
                </div>
            </div>
        </footer>
    );
}
