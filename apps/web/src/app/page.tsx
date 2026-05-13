import { Header } from '@/components/marketing/Header';
import { Hero } from '@/components/marketing/Hero';
import { CompatiblePlatforms } from '@/components/marketing/CompatiblePlatforms';
import { Features } from '@/components/marketing/Features';
import { Benefits } from '@/components/marketing/Benefits';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Testimonials } from '@/components/marketing/Testimonials';
import { PricingTable } from '@/components/marketing/PricingTable';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Hero />

        {/* Compatible Platforms */}
        <CompatiblePlatforms />

        {/* Features */}
        <Features />

        {/* Benefits */}
        <Benefits />

        {/* How It Works */}
        <HowItWorks />

        {/* Testimonials */}
        <Testimonials />

        {/* Pricing */}
        <section className="py-24 sm:py-32 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3">Pricing</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Start free. Scale when you need it.
              </h2>
              <p className="max-w-xl mx-auto text-base text-muted-foreground">
                Every plan lets multiple users share one account at the same time.
                No per-seat nonsense.
              </p>
            </div>
            <PricingTable />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 sm:py-32 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know before your next interview.
              </p>
            </div>
            <FAQAccordion />
            <div className="text-center mt-10">
              <Link
                href="/faq"
                className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                See all questions &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
