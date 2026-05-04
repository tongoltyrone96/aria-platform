import type { Metadata } from 'next';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { allFAQs } from '@/lib/faq-data';

export const metadata: Metadata = { title: 'FAQ — ARIA Docs' };

export default function DocsFAQPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <p className="text-muted-foreground">
        Answers to the most common questions about ARIA.
      </p>
      <FAQAccordion items={allFAQs} />
      <p className="text-sm text-muted-foreground pt-4">
        Can&apos;t find what you need?{' '}
        <a href="/contact" className="text-brand-500 hover:underline">Contact us</a> and we&apos;ll get back to you within one business day.
      </p>
    </article>
  );
}
