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
      <section className="py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-crazy font-extrabold mb-12 text-pumpkin-orange drop-shadow-[2px_2px_0px_#000]">
            What is Pumpkin?
          </h2>
          <p className="text-xl md:text-3xl mb-8 leading-relaxed font-bold text-gray-900">
            Pumpkin is a programming language built for <span className="underline decoration-wavy decoration-teal-accent">humans</span>, not robots.
          </p>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto text-gray-700 font-medium">
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
