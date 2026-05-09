import type { Metadata } from 'next';
import { PricingTable } from '@/components/marketing/PricingTable';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { allFAQs } from '@/lib/faq-data';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for ARIA AI Interview Copilot. Start free for Free plan. Plans from $17.99/mo. Lifetime deal available.',
};

// Pricing-specific FAQs
const pricingFAQs = allFAQs.filter((faq) =>
  [
    'How does the 14-day free trial work?',
    'What is the refund policy?',
    'Can multiple people use one ARIA license?',
    'How do I cancel my subscription?',
    'Can I use my own OpenAI or DeepSeek API key?',
  ].includes(faq.q)
);

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center bg-gradient-to-b from-brand-50/60 to-background dark:from-brand-900/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Simple, honest pricing
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Free plan — no credit card required. Upgrade when ARIA helps you
            land the offer.
          </p>
        </div>
      </section>

      {/* Pricing table */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingTable />
        </div>
      </section>

      {/* Feature comparison callout */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Everything in Pro, none of the browser risk
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-8">
            Unlike Chrome extension competitors, ARIA is a native Windows app. No extension
            manifest. No browser fingerprint. Just a transparent overlay that nobody else can see.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              {
                title: 'WASAPI Loopback',
                desc: 'Captures both sides of the call at the OS audio layer — works with every video platform.',
              },
              {
                title: 'Invisible Overlay',
                desc: 'Excluded from all screen-capture APIs. Your interviewer sees only you.',
              },
              {
                title: 'Resume-Grounded',
                desc: 'Every answer is personalized to your actual experience, not generic filler.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10 text-center">
            Pricing FAQ
          </h2>
          <FAQAccordion items={pricingFAQs} />
        </div>
      </section>
    </>
  );
}
