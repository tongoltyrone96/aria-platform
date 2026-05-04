import { Header } from '@/components/marketing/Header';
import { Hero } from '@/components/marketing/Hero';
import { Features } from '@/components/marketing/Features';
import { CompatiblePlatforms } from '@/components/marketing/CompatiblePlatforms';
import { ComparisonTable } from '@/components/marketing/ComparisonTable';
import { PricingTable } from '@/components/marketing/PricingTable';
import { Testimonials } from '@/components/marketing/Testimonials';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { allFAQs } from '@/lib/faq-data';
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

        {/* Comparison */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3">Why ARIA</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How ARIA compares to other AI assistants
              </h2>
              <p className="max-w-2xl mx-auto text-base text-muted-foreground">
                Most interview tools are browser extensions — visible, detectable, and limited.
                ARIA is a native Windows app that operates at a deeper level.
              </p>
            </div>
            <ComparisonTable />
            <div className="text-center mt-8">
              <Link
                href="/compare/ntro"
                className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                See the full detailed comparison &rarr;
              </Link>
            </div>
          </div>
        </section>

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

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ */}
        <section className="py-24 sm:py-32 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Frequently asked questions
              </h2>
            </div>
            <FAQAccordion items={allFAQs.slice(0, 6)} />
            <div className="text-center mt-10">
              <Link
                href="/faq"
                className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                See all {allFAQs.length} questions &rarr;
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
