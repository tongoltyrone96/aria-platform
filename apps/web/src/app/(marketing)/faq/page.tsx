import type { Metadata } from 'next';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { allFAQs } from '@/lib/faq-data';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about ARIA - how it works, audio capture, privacy, pricing, and more.',
};

export default function FAQPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 sm:py-28 text-center bg-gradient-to-b from-brand-50/60 to-background dark:from-brand-900/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Frequently asked questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about ARIA - how it works, what it captures, and how it
            helps you communicate more clearly.
          </p>
        </div>
      </section>

      {/* All FAQs */}
      <section className="py-12 sm:py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQAccordion items={allFAQs} />
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 sm:py-20 bg-muted/30 border-t border-border">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our team typically responds within a few hours during business days.
          </p>
          <a
            href="mailto:contact@ariainterview.com"
            className="inline-flex items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-6 py-3 transition-colors"
          >
            Contact support
          </a>
        </div>
      </section>
    </>
  );
}
