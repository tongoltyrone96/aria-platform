import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '@/components/marketing/ComparisonTable';

export const metadata: Metadata = {
  title: 'ARIA vs Ntro.io — AI Interview Assistant Comparison for Windows',
  description:
    'Detailed comparison of ARIA vs Ntro.io. How a native Windows app with WASAPI audio capture delivers more reliable, private, and accurate AI assistance than a browser extension.',
  keywords: [
    'ntro alternatives',
    'best AI interview assistant Windows',
    'ntro vs ARIA',
    'AI interview copilot Windows',
    'WASAPI interview assistant',
    'AI communication assistant Windows',
    'meeting AI assistant comparison',
  ],
  openGraph: {
    title: 'ARIA vs Ntro.io — Native Windows App vs Chrome Extension',
    description:
      'Why ARIA delivers more reliable AI assistance: WASAPI audio capture, on-device privacy, resume-personalized answers, and better value than Ntro.io.',
  },
};

export default function CompareNtroPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-brand-50/60 to-background dark:from-brand-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-50 dark:bg-brand-900/30 px-4 py-1.5 text-xs font-semibold text-brand-500 uppercase tracking-wide mb-6">
            Head-to-head comparison
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-5 tracking-tight leading-[1.1]">
            ARIA vs Ntro.io: Native Windows App vs Chrome Extension
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Both tools provide AI assistance during interviews. Here&apos;s how they differ in
            audio quality, privacy, reliability, and value.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-6 py-3 transition-colors shadow-lg shadow-brand-500/25"
            >
              Try ARIA free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background hover:bg-muted text-foreground text-sm font-semibold px-6 py-3 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Feature comparison
          </h2>
          <ComparisonTable />
        </div>
      </section>

      {/* Long-form comparison */}
      <section className="py-16 sm:py-20 bg-muted/20 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              ARIA vs Ntro.io: A Technical Comparison for Windows Users
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6">
              If you&apos;re evaluating AI communication assistants for Windows, two questions
              matter most: how reliably does it capture audio, and how well does it protect your
              data? This guide compares ARIA and Ntro.io across audio quality, privacy
              architecture, personalization, performance, and pricing.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Architecture: native app vs browser extension
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ntro.io is a Chrome extension. ARIA is a native Windows application. This
              architectural difference has significant downstream effects on audio quality,
              reliability, and privacy.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Chrome extension operates within the browser&apos;s sandboxed environment. It has
              access only to what the browser exposes through its extension APIs — primarily
              microphone input via the Web Audio API. Capturing the other participant&apos;s
              audio reliably often requires additional setup like virtual audio cables.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              ARIA runs as a standard Windows process with direct access to the Windows audio
              subsystem. No browser required. No extension sandbox. This gives it access to
              higher-quality audio APIs and makes it compatible with any application that plays
              audio on Windows — not just browser-based calls.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              WASAPI vs Browser Audio APIs: audio quality and reliability
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA uses the Windows Audio Session API (WASAPI) in loopback mode — the same
              low-level audio subsystem used by professional recording software. WASAPI provides
              direct access to the audio rendered by your sound card, capturing both speakers
              simultaneously with minimal latency and no configuration needed on the other
              participant&apos;s side.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The practical advantages of WASAPI capture:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>
                <strong className="text-foreground">Works with any call platform.</strong>{' '}
                Zoom, Teams, Meet, Webex, Discord — any app that routes audio through Windows
                is automatically captured. No platform-specific integrations needed.
              </li>
              <li>
                <strong className="text-foreground">No extra setup required.</strong>{' '}
                WASAPI loopback captures speaker output directly. No virtual audio cables,
                no additional drivers, no browser permissions.
              </li>
              <li>
                <strong className="text-foreground">Works through corporate networks.</strong>{' '}
                OS-level audio capture is unaffected by VPNs, firewalls, or corporate
                network restrictions that might interfere with browser-based audio.
              </li>
              <li>
                <strong className="text-foreground">Lower latency.</strong>{' '}
                WASAPI provides the lowest-latency audio access on Windows, reducing
                ARIA&apos;s end-to-end response time.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Privacy: on-device vs cloud processing
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA processes your audio locally on your device. Transcripts are generated
              on-machine and only the text is sent to the AI provider (OpenAI or DeepSeek)
              over a standard HTTPS connection. Audio is never transmitted or stored on ARIA
              servers. Your resume is stored locally and indexed on-device for semantic search.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Because ARIA is a native Windows application rather than a browser extension,
              it requires no browser-level permissions and has no access to your browser
              history, cookies, or web activity. Data isolation is built into the architecture.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Resume personalization: grounded answers vs generic responses
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Both ARIA and Ntro.io offer resume-aware answer generation, but the implementation
              differs in meaningful ways.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA stores your resume locally and performs real-time semantic search against
              it when a question is detected. The AI constructs answers that reference your
              specific project names, team sizes, technologies, and measurable outcomes — because
              those details are what&apos;s actually in your resume. This produces responses that
              sound like you, not like a generic template.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Generic AI answers that don&apos;t reference real experience are immediately
              noticeable to experienced interviewers. Grounded, specific answers are both more
              convincing and easier to expand on naturally.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Response latency
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA&apos;s end-to-end latency — from question detection to first suggestion
              tokens appearing — is under 1 second on a typical broadband connection using
              GPT-4o or DeepSeek V3. This is achieved through streaming (first words appear
              before the full response is complete) and speculative transcription.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Browser extensions have inherent latency overhead from the JavaScript engine,
              the Web Audio API processing pipeline, and inter-process communication between
              the extension background worker and the page. In practice this adds noticeable
              delay compared to a native application with direct OS audio access.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Pricing
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA Starter is $19/month. ARIA Pro is $29/month with model selection (GPT-4o
              and DeepSeek R1), 5 resume profiles, and priority support. A lifetime deal is
              available at $249 — a one-time payment for perpetual Pro access. Ntro.io
              starts at $29/month and has no lifetime option.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              All ARIA plans include a 30-day money-back guarantee. No questions asked.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              The verdict
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For Windows users who want reliable WASAPI audio capture, on-device data
              privacy, and resume-grounded AI suggestions, ARIA is the technically stronger
              choice. Its native architecture removes the limitations imposed by browser
              sandboxing and delivers consistently lower latency.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Ntro.io is a reasonable option if you prefer a browser-based workflow or are
              on macOS. For Windows users who prioritize audio quality, privacy, and
              cross-platform call support, ARIA is the better fit.
            </p>
          </article>

          {/* CTA */}
          <div className="mt-10 rounded-2xl border border-brand-500/30 bg-brand-50/60 dark:bg-brand-900/20 p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Ready to try ARIA?
            </h3>
            <p className="text-muted-foreground mb-5 text-sm">
              Free plan available. No credit card required. Works on Windows 10 &amp; 11.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-7 py-3 transition-colors shadow-lg shadow-brand-500/25"
            >
              Get started free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
