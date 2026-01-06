import Link from 'next/link';
import Image from 'next/image';
import { PumpkinIDE } from '../../components/ide/PumpkinIDE';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Playground | Pumpkin',
    description: 'Write and run Pumpkin code in your browser.',
};

export default function PlaygroundPage() {
    return (
        <div className="min-h-screen bg-[#FFFBF5] relative overflow-hidden flex flex-col">
            <Navbar />

            {/* Content Container */}
            <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-8 relative z-10 w-full">
                {/* Background Blobs (Premium Design) */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pumpkin-orange/10 blur-[120px] rounded-full -z-10 animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-accent/10 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Header Content */}
                <div className="mb-12 text-center relative max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 bg-pumpkin-orange/10 px-6 py-2 rounded-full mb-6 border-2 border-pumpkin-orange/20 shadow-sm mx-auto">
                        <span className="text-xl">✨</span>
                        <span className="font-heading font-black text-pumpkin-orange tracking-tight uppercase text-sm">Interactive Sandbox</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-crazy font-extrabold text-gray-900 mb-6 drop-shadow-[4px_4px_0px_#FF8C1A] rotate-[-1deg]">
                        Playground
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 font-bold transform rotate-1 max-w-lg mx-auto leading-relaxed">
                        Write code. Break things. <br />
                        <span className="text-pumpkin-orange underline decoration-wavy decoration-orange-300 underline-offset-8">Make it spooky! 👻</span>
                    </p>
                </div>

                {/* IDE Container - Removed Floating Animate */}
                <div className="w-full relative px-2">
                    <PumpkinIDE />
                </div>
            </main>

            <Footer />
        </div>
    );
}
