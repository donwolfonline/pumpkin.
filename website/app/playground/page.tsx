import Link from 'next/link';
import Image from 'next/image';
import { PumpkinIDE } from '../../components/ide/PumpkinIDE';
import Vine from '../components/VineDecoration';

export const metadata = {
    title: 'Playground | Pumpkin',
    description: 'Write and run Pumpkin code in your browser.',
};

export default function PlaygroundPage() {
    return (
        <div className="min-h-screen bg-[#FFFBF5] relative overflow-x-hidden flex flex-col items-center py-12 px-4 md:px-8">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #FF8C1A 2px, transparent 2px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Vines */}
            <Vine className="-top-20 -left-20 w-64 h-64" rotate={45} delay={0} />
            <Vine className="-bottom-20 -right-20 w-80 h-80" rotate={-135} delay={0.5} />
            <Vine className="top-1/4 -right-10 w-40 h-40" rotate={-45} delay={1} />

            {/* Header Content */}
            <div className="mb-8 text-center relative z-10 w-full max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-6 mb-4">
                    <Link href="/" className="hover:scale-105 transition-transform">
                        <Image
                            src="/pumpkin-logo.png"
                            alt="Pumpkin Logo"
                            width={200}
                            height={50}
                            className="h-12 w-auto"
                        />
                    </Link>
                    <div className="inline-block relative">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2 tracking-tight transform -rotate-2">
                            Playground
                        </h1>
                        <span className="absolute -top-6 -right-8 text-6xl animate-bounce">🎃</span>
                    </div>
                </div>
                <p className="text-xl md:text-2xl text-gray-600 font-bold mt-4 transform rotate-1 max-w-lg mx-auto leading-relaxed">
                    Write code. Break things. <br />
                    <span className="text-pumpkin-orange">Make it spooky! 👻</span>
                </p>
            </div>

            {/* IDE Container - Floating Effect */}
            <div className="w-full relative z-20 animate-[float_6s_ease-in-out_infinite]">
                <PumpkinIDE />
            </div>

            {/* Footer */}
            <div className="mt-12 text-center relative z-10">
                <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur px-6 py-2 rounded-full border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
                    <span className="font-bold text-gray-700">Pumpkin v0.1.0</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <Link href="/" className="font-bold text-pumpkin-orange hover:underline">
                        Back to Home 🏠
                    </Link>
                </div>
            </div>
        </div>
    );
}
