import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContributingDocs from '../components/ContributingDocs';

export default function ContributingPage() {
    return (
        <main className="min-h-screen bg-[#FFFBF5] relative overflow-hidden">
            <Navbar />

            <div className="pt-32 pb-24">
                <div className="pill-section bg-white/20 backdrop-blur-3xl border-white/20 shadow-2xl">
                    <ContributingDocs />
                </div>
            </div>

            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-0" />
            <div className="absolute top-3/4 left-0 w-96 h-96 bg-teal-accent/10 rounded-full blur-3xl -z-0" />

            <Footer />
        </main>
    );
}
