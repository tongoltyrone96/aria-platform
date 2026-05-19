import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'ARIA AI Refund Policy - 30-day money-back guarantee on all plans.',
};

export default function RefundPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Refund Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 1, 2025</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Our Guarantee</h2>
            <p className="leading-relaxed">
              We want you to be completely satisfied with ARIA. If ARIA doesn&apos;t work for your
              setup or you&apos;re unhappy for any reason, we offer a straightforward money-back
              guarantee - no lengthy forms, no interrogation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Monthly &amp; Annual Plans</h2>
            <p className="leading-relaxed">
              You may request a full refund within <strong className="text-foreground">30 days</strong> of
              your initial purchase date. This applies to both monthly and annual subscriptions.
              After 30 days, subscriptions are non-refundable for the current billing period.
            </p>
            <p className="leading-relaxed mt-3">
              Renewal charges are not eligible for refunds unless there is a billing error on our
              part. We recommend canceling your subscription before the renewal date if you no
              longer wish to use ARIA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Lifetime Deal</h2>
            <p className="leading-relaxed">
              Lifetime license purchases may be refunded within{' '}
              <strong className="text-foreground">14 days</strong> of the purchase date. After 14
              days, lifetime purchases are final. If you encounter a technical issue that prevents
              ARIA from functioning on your system, contact support” we&apos;ll do everything
              possible to resolve it or issue a refund at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Free Trial</h2>
            <p className="leading-relaxed">
              ARIA&apos;s Free plan requires no credit card. You will not be charged
              anything during the trial period. A refund request during a free trial is not
              applicable since no payment has been made.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">How to Request a Refund</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Email{' '}
                <a
                  href="mailto:contact@ariainterview.com"
                  className="text-brand-500 hover:text-brand-600 underline"
                >
                  contact@ariainterview.com
                </a>{' '}
                from the email address on your ARIA account.
              </li>
              <li>Include your order number or the email used to purchase.</li>
              <li>
                Briefly describe the reason for your refund request (optional but helps us
                improve).
              </li>
            </ol>
            <p className="leading-relaxed mt-4">
              We will process your refund within 5-10 business days. Refunds are returned to the
              original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Abuse Prevention</h2>
            <p className="leading-relaxed">
              Accounts that repeatedly purchase and request refunds may be flagged for abuse and
              permanently suspended. Our refund policy is designed to protect legitimate users, not
              to enable unlimited free access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Contact</h2>
            <p className="leading-relaxed">
              Questions about billing or refunds:{' '}
              <a
                href="mailto:contact@ariainterview.com"
                className="text-brand-500 hover:text-brand-600 underline"
              >
                contact@ariainterview.com
              </a>
              . Or{' '}
              <Link href="/contact" className="text-brand-500 hover:text-brand-600 underline">
                use our contact form
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
