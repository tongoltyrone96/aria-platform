import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ARIA AI Terms of Service — the rules and conditions governing your use of ARIA.',
};

export default function TermsPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 1, 2025</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By downloading, installing, or using ARIA (&quot;the Software&quot;), you agree to be
              bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these
              Terms, do not use the Software. These Terms constitute a legally binding agreement
              between you and ARIA AI Inc. (&quot;ARIA,&quot; &quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. License Grant</h2>
            <p className="leading-relaxed">
              Subject to your compliance with these Terms, ARIA grants you a limited,
              non-exclusive, non-transferable, revocable license to install and use the Software on
              Windows devices you own or control, solely for your personal, non-commercial use
              during a valid subscription period or within the scope of your lifetime license.
            </p>
            <p className="leading-relaxed mt-3">
              You may not sublicense, sell, resell, transfer, or assign the Software or your
              license to any third party. Sharing account credentials with other individuals is
              prohibited and will result in immediate account termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Permitted Use</h2>
            <p className="leading-relaxed">
              ARIA is intended to help users communicate more effectively during job interviews by
              surfacing relevant information from their own professional background. You are solely
              responsible for ensuring that your use of ARIA complies with any applicable
              assessment, employment, or platform terms you have agreed to with third parties.
              ARIA does not endorse misrepresentation of qualifications or experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Prohibited Conduct</h2>
            <p className="leading-relaxed">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Reverse engineer, decompile, or disassemble the Software.</li>
              <li>Use the Software to violate any applicable law or regulation.</li>
              <li>
                Attempt to circumvent any security, licensing, or usage restrictions in the
                Software.
              </li>
              <li>Use automated scripts to abuse the trial or subscription system.</li>
              <li>Resell or redistribute the Software or any outputs it generates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Subscription and Billing</h2>
            <p className="leading-relaxed">
              Paid subscriptions are billed monthly or annually in advance. Your subscription
              automatically renews at the end of each billing period unless you cancel before
              renewal. Prices are subject to change with 30 days&apos; notice. We reserve the right
              to offer promotional pricing, which may not be available upon renewal.
            </p>
            <p className="leading-relaxed mt-3">
              Lifetime licenses are one-time purchases that provide access to Pro features for the
              lifetime of the ARIA product. &quot;Lifetime&quot; means for as long as ARIA AI Inc.
              offers the Software commercially, not necessarily the user&apos;s lifetime.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Intellectual Property</h2>
            <p className="leading-relaxed">
              ARIA and all related trademarks, logos, software, and documentation are the exclusive
              property of ARIA AI Inc. Nothing in these Terms grants you any ownership interest in
              the Software. Feedback, suggestions, or improvements you provide may be used by ARIA
              without obligation or compensation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ARIA DOES NOT WARRANT THAT THE SOFTWARE
              WILL BE ERROR-FREE, UNINTERRUPTED, OR THAT IT WILL MEET YOUR SPECIFIC REQUIREMENTS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              8. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ARIA AI INC. SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF
              PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE
              SOFTWARE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE TWELVE
              MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Termination</h2>
            <p className="leading-relaxed">
              We may terminate or suspend your access to ARIA immediately and without notice if you
              breach these Terms. Upon termination, your license to use the Software ceases
              immediately. Sections on intellectual property, disclaimers, limitation of liability,
              and governing law survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms are governed by the laws of the State of Delaware, United States, without
              regard to conflict of law principles. Any disputes shall be resolved in the federal or
              state courts located in Delaware. You waive any objection to jurisdiction or venue in
              those courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Changes to Terms</h2>
            <p className="leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes
              via email or in-app notification. Continued use of ARIA after the effective date
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">12. Contact</h2>
            <p className="leading-relaxed">
              For questions about these Terms, contact us at{' '}
              <a
                href="mailto:legal@aria-ai.com"
                className="text-brand-500 hover:text-brand-600 underline"
              >
                legal@aria-ai.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
