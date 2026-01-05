import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PumpkinShowcase from './components/PumpkinShowcase';
import CodeComparison from './components/CodeComparison';
import Features from './components/Features';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="relative py-20 md:py-24 lg:py-28">
      <Navbar />
      <Hero />
      <section className="pill-section py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-crazy font-extrabold mb-12 text-pumpkin-orange drop-shadow-lg">
            What is Pumpkin?
          </h2>
          <p className="text-xl md:text-3xl mb-8 leading-relaxed font-semibold text-white/90">
            Pumpkin is a programming language built for humans, not robots.
          </p>
          <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-3xl mx-auto">
            Most languages feel like specialized codes written for machines. Pumpkin feels like English. It removes the scary symbols and confusing jargon, replacing them with clear instructions that make sense the first time you read them.
          </p>
        </div>
      </section>
      <PumpkinShowcase />
      <CodeComparison />
      <Features />
      <Footer />
    </main>
  );
}
