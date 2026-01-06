import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoadmapDocs from '../components/RoadmapDocs';

export default function RoadmapPage() {
    return (
        <main className="min-h-screen bg-[#FFFBF5] relative overflow-hidden">
            <Navbar />

            <div className="pt-32 pb-24">
                <div className="pill-section bg-white/20 backdrop-blur-3xl border-white/20 shadow-2xl">
                    <RoadmapDocs />
                </div>
            </div>

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pumpkin-orange/10 rounded-full blur-3xl -z-0" />

            <Footer />
        </main>
    );
}
