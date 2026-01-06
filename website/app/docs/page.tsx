import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InstallationDocs from '../components/InstallationDocs';
import LanguageReferenceDocs from '../components/LanguageReferenceDocs';
import CLIDocs from '../components/CLIDocs';
import SemanticsDocs from '../components/SemanticsDocs';
import LimitationsDocs from '../components/LimitationsDocs';
import ArchitectureDocs from '../components/ArchitectureDocs';
import ExamplesDocs from '../components/ExamplesDocs';

export default function DocsPage() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-16 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-5xl md:text-8xl font-crazy font-extrabold text-pumpkin-orange drop-shadow-[4px_4px_0px_#000] mb-8 animate-float">
                        Documentation
                    </h1>
                    <p className="text-xl md:text-3xl text-gray-800 font-bold max-w-2xl mx-auto leading-relaxed">
                        Master the art of <span className="underline decoration-wavy decoration-teal-accent">human-first</span> coding with our comprehensive guides.
                    </p>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-pumpkin-orange/15 rounded-full blur-3xl -z-0" />
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-teal-accent/15 rounded-full blur-3xl -z-0" />
            </div>

            <div className="pill-section bg-white/20 backdrop-blur-3xl border-white/20 shadow-2xl mb-24">
                <div className="py-12">
                    <InstallationDocs />
                    <LanguageReferenceDocs />
                    <SemanticsDocs />
                    <LimitationsDocs />
                    <ArchitectureDocs />
                    <ExamplesDocs />
                    <CLIDocs />
                </div>
            </div>

            <Footer />
        </main>
    );
}
