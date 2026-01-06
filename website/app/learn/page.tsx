import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LearnPage from '../components/LearnPage';

export default function Learn() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <LearnPage />
            <Footer />
        </main>
    );
}
