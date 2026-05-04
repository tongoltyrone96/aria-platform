import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'ARIA AI Privacy Policy — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 1, 2025</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Overview</h2>
            <p className="leading-relaxed">
              ARIA AI Inc. (&quot;ARIA,&quot; &quot;we,&quot; or &quot;us&quot;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use the ARIA software and related services.
              Please read this policy carefully. If you disagree with its terms, discontinue use of
              ARIA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
              2.1 Information you provide
            </h3>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Account information: name, email address, password (hashed).</li>
              <li>Resume content: uploaded via the Profile section of the desktop app.</li>
              <li>
                Payment information: processed by Stripe. We do not store card numbers.
              </li>
              <li>Support correspondence: emails, chat messages with our support team.</li>
            </ul>
            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
              2.2 Information collected automatically
            </h3>
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                Usage telemetry: anonymized session counts, feature usage events, error reports.
              </li>
              <li>
                Device information: Windows version, hardware specs (for performance diagnostics
                only).
              </li>
              <li>Log data: IP address, access timestamps, app version.</li>
            </ul>
            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
              2.3 What we do NOT collect
            </h3>
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                Interview audio is never transmitted to ARIA servers. Audio is processed locally
                via WASAPI and the resulting text transcript is sent to the AI provider.
              </li>
              <li>
                Interview transcripts are not stored on ARIA servers unless you explicitly enable
                cloud session history.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1.5">
              <li>To provide, maintain, and improve the ARIA software and services.</li>
              <li>To process transactions and manage your subscription.</li>
              <li>To respond to support requests and communicate with you.</li>
              <li>To detect and prevent fraud, abuse, and security incidents.</li>
              <li>
                To send product updates, security notices, and marketing communications (you can
                opt out at any time).
              </li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. AI API Data Processing</h2>
            <p className="leading-relaxed">
              ARIA sends interview transcript text to third-party AI providers (OpenAI, DeepSeek)
              to generate suggested answers. This data is subject to the respective
              provider&apos;s privacy policy. OpenAI&apos;s API data usage policy is available at
              openai.com/policies/api-data-usage. By using ARIA, you consent to this transcript
              data being processed by the AI provider you select.
            </p>
            <p className="leading-relaxed mt-3">
              If you use your own API key (Pro plan feature), data is sent directly to your API
              provider account under your own agreement with that provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Data Sharing</h2>
            <p className="leading-relaxed">We do not sell your personal information. We share data only with:</p>
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li>
                Service providers: Stripe (payments), Supabase (authentication/database), AWS
                (infrastructure), Resend (transactional email).
              </li>
              <li>AI providers: OpenAI or DeepSeek, as described above.</li>
              <li>
                Law enforcement: when required by law, court order, or to protect our legal rights.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Data Retention</h2>
            <p className="leading-relaxed">
              Account data is retained for the duration of your account and for 90 days after
              deletion. Anonymized telemetry may be retained indefinitely in aggregated form.
              Resume data is stored locally on your machine and is deleted immediately when you
              remove it from the app. Cloud session history (if enabled) is retained for 30 days
              by default; you can delete it at any time from Settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
            <p className="leading-relaxed">
              Depending on your location, you may have the right to access, correct, delete, or
              restrict processing of your personal data. To exercise these rights, contact us at{' '}
              <a
                href="mailto:privacy@aria-ai.com"
                className="text-brand-500 hover:text-brand-600 underline"
              >
                privacy@aria-ai.com
              </a>
              . We will respond within 30 days. EU/EEA users may also lodge a complaint with their
              local supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures including TLS encryption for all
              data in transit, bcrypt password hashing, row-level security in our database, and
              periodic third-party security reviews. No system is 100% secure; we encourage you to
              use a strong, unique password for your ARIA account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              ARIA is not intended for use by individuals under 16 years of age. We do not
              knowingly collect personal information from children. If you believe we have
              inadvertently collected such information, contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy periodically. Material changes will be communicated
              via email or in-app notice 14 days before taking effect. Continued use of ARIA
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Contact</h2>
            <p className="leading-relaxed">
              Privacy questions:{' '}
              <a
                href="mailto:privacy@aria-ai.com"
                className="text-brand-500 hover:text-brand-600 underline"
              >
                privacy@aria-ai.com
              </a>
              <br />
              ARIA AI Inc., 1234 Technology Drive, Wilmington, DE 19801, USA
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
