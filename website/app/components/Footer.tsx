import { Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Pumpkin Programming Language. Open source (MIT).
                    </p>
                    <a
                        href="https://github.com/donwolfonline/pumpkin."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <Github size={20} />
                        <span className="text-sm font-medium">GitHub</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
