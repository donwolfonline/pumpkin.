'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UseCasesDocs from '../components/UseCasesDocs';

export default function CasesPage() {
    return (
        <main className="min-h-screen bg-[#FFFBF5] relative overflow-hidden">
            <Navbar />

            <div className="pt-32 pb-24">
                <div className="pill-section bg-white/20 backdrop-blur-3xl border-white/20 shadow-2xl">
                    <UseCasesDocs />
                </div>
            </div>

            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pumpkin-orange/10 rounded-full blur-3xl -z-0" />
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-teal-accent/10 rounded-full blur-3xl -z-0" />

            <Footer />
        </main>
    );
}
