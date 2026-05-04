import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '@/components/marketing/ComparisonTable';

export const metadata: Metadata = {
  title: 'ARIA vs Ntro.io — Best AI Interview Assistant for Windows',
  description:
    'Detailed comparison of ARIA vs Ntro.io. Why a native Windows app with WASAPI capture beats a Chrome extension for stealth, latency, and reliability. Best Ntro alternative.',
  keywords: [
    'ntro alternatives',
    'best AI interview assistant Windows',
    'is ntro safe',
    'ntro vs ARIA',
    'AI interview copilot Windows',
    'WASAPI interview tool',
    'interview cheating tool Windows',
  ],
  openGraph: {
    title: 'ARIA vs Ntro.io — Native Windows vs Chrome Extension',
    description:
      'Why ARIA is the superior AI interview assistant: WASAPI capture, true stealth, resume-aware answers, and lower price than Ntro.io.',
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
            Both tools promise to help you ace your interview. Only one of them actually stays
            invisible. Here&apos;s the full picture.
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

      {/* Long-form essay */}
      <section className="py-16 sm:py-20 bg-muted/20 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              ARIA vs Ntro.io: The Complete 2025 Guide for Windows Users
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6">
              If you&apos;ve been searching for the best AI interview assistant for Windows — or
              wondering whether Ntro alternatives exist that offer better stealth, faster responses,
              and a lower price — you&apos;ve found the right page. This guide compares ARIA and
              Ntro.io across every dimension that actually matters in a live interview: how the
              audio is captured, how invisible the tool is, whether it understands your resume, and
              what it costs.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              The fundamental architectural difference
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ntro.io is a Chrome extension. ARIA is a native Windows application. This single
              distinction has cascading implications for stealth, reliability, and performance that
              most comparison articles gloss over.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you install a Chrome extension, it becomes part of your browser&apos;s extension
              ecosystem. Every extension you have installed is visible in your browser&apos;s
              developer tools, in the extension management page, and — critically — through
              browser fingerprinting techniques that some interview platforms use. Corporate IT
              departments increasingly audit employee browsers before granting access to assessment
              platforms. A Chrome extension that reads audio and shows a floating overlay is a
              significant red flag in this context.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              ARIA runs as a regular Windows process. It has no browser footprint. No extension
              manifest. No content script injection. It appears in the Windows task manager as
              &quot;ARIA&quot; — indistinguishable from any other desktop application. When you
              open your video call platform, ARIA is already running at the OS layer, invisible to
              everything happening inside the browser.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              WASAPI vs Browser Audio APIs: Why it matters
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ntro.io captures audio through the Web Audio API — the standard browser API for
              accessing microphone input. This means it typically needs microphone access to both
              your mic and, in some configurations, requires a virtual audio cable or additional
              setup to capture loopback (your speakers/headphones output).
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA uses the Windows Audio Session API (WASAPI) in loopback mode. WASAPI is a
              low-level Windows audio subsystem that provides direct access to the audio being
              rendered by your sound card — the actual raw audio coming out of your speakers or
              headphones, regardless of which application produced it. This is the same API used
              by professional recording software and audio engineers.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The practical benefits of WASAPI for interview assistance are significant:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>
                <strong className="text-foreground">No interviewer-side permissions needed.</strong>{' '}
                WASAPI loopback captures what your speakers are playing — the interviewer&apos;s
                voice through your video call. Their audio is already on your system; ARIA just
                reads it. No pop-ups, no permission dialogs on their end.
              </li>
              <li>
                <strong className="text-foreground">Works through VPNs and corporate firewalls.</strong>{' '}
                Because ARIA captures at the OS level, corporate network restrictions that might
                interfere with browser-based audio capture don&apos;t affect it.
              </li>
              <li>
                <strong className="text-foreground">Zero latency audio path.</strong> WASAPI
                provides the lowest-latency audio access available on Windows, which directly
                reduces ARIA&apos;s end-to-end response time.
              </li>
              <li>
                <strong className="text-foreground">Works with any video call platform.</strong>{' '}
                Zoom, Teams, Meet, Webex, Discord — any app that plays audio through Windows is
                captured.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Is Ntro safe? What you need to know about browser extension risk
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              One of the most common searches we see is &quot;is ntro safe.&quot; The safety
              concerns fall into two categories: detection risk and data privacy.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              On detection: Ntro.io running as a Chrome extension is visible in your browser&apos;s
              extension list. During a screen share, your browser window is typically shared — and
              if an interviewer glances at your extensions bar or you accidentally open the
              extensions management page, the cat is out of the bag. More sophisticatedly, some
              proctoring software and interview platforms scan installed browser extensions at the
              start of sessions. Ntro would appear in this scan.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Additionally, browser extensions run in a context that can be inspected with browser
              devtools — something a technically sophisticated interviewer could do. Extension-based
              overlays also frequently appear in OBS and screen recording captures despite attempts
              to exclude them, because they render as part of the browser&apos;s DOM.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              ARIA&apos;s overlay is a native Win32 layered window rendered with the
              WS_EX_LAYERED and WS_EX_TRANSPARENT extended window styles, combined with
              DWMWA_EXCLUDED_FROM_PEEK. This means Windows itself excludes it from:
              screen-capture APIs used by video call apps, the Alt+Tab preview, OBS window capture,
              and DirectX full-screen capture hooks.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Resume integration: personalization vs generic answers
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Both ARIA and Ntro.io offer resume-aware answer generation. But the implementation
              quality differs materially.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA stores your resume locally (on your machine, not on a server) and indexes it
              for semantic search. When the interviewer asks a behavioral question, ARIA performs a
              real-time semantic search over your resume to find the most relevant experience and
              constructs a STAR-method answer around it. The answer references your specific
              project names, team sizes, technologies, and measurable outcomes — because those are
              what&apos;s actually in your resume.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              This matters because a generic AI-generated answer that doesn&apos;t reference your
              real experience sounds exactly like what it is. Interviewers who've conducted hundreds
              of interviews recognize canned, vague responses instantly. ARIA&apos;s grounded
              answers give you the structure and confidence to deliver a specific, authentic
              response — which is both more convincing and more memorable.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Performance: response latency under real interview conditions
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In interviews, every second of silence after a question is painful. The goal is a
              tool that surfaces an answer before you&apos;ve even finished formulating your
              thoughts.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA&apos;s end-to-end latency — from the interviewer finishing their question to the
              first answer tokens appearing in the overlay — is under 1 second on a typical broadband
              connection using the GPT-4o or DeepSeek V3 models. This is achieved by streaming the
              response token-by-token (the first words appear before the full response is generated)
              and by using speculative transcription (ARIA begins processing probable question
              completions while the interviewer is still talking).
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Browser-based tools like Ntro.io have additional latency from the browser&apos;s
              JavaScript engine, the Web Audio API processing pipeline, and the overhead of
              communicating between the extension background service worker and the content script
              overlay. In real-world testing, this can add 0.5–1.5 additional seconds.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              Pricing: ARIA is $10/mo cheaper with more features
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ARIA Pro is $29/month. Ntro.io starts at $29/month with more restrictions. But the
              more meaningful comparison is value per dollar:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>
                ARIA Starter at $19/mo gives you more sessions than Ntro&apos;s entry tier.
              </li>
              <li>
                ARIA Pro at $29/mo includes model selection (GPT-4o and DeepSeek R1), 5 resume
                profiles, unlimited sessions, and priority support.
              </li>
              <li>
                ARIA offers a lifetime deal at $249 — a one-time payment for perpetual Pro access.
                Ntro has no lifetime option.
              </li>
              <li>
                ARIA&apos;s 30-day money-back guarantee applies to all plans. No questions asked.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">
              The verdict: which tool should Windows users choose?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you&apos;re on Windows and you take interview stealth seriously, ARIA is the clear
              choice. The WASAPI-based dual-stream capture, native invisible overlay, resume-grounded
              personalization, and lower price collectively make it a meaningfully better product
              than any browser-extension competitor.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ntro.io is not a bad tool — it&apos;s a reasonable option if you&apos;re on macOS or
              if you&apos;re comfortable with the browser extension approach. But for Windows users
              who want the highest confidence that their assistance tool will remain undetected,
              ARIA&apos;s native architecture is the right call.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The 14-day free trial requires no credit card. If ARIA doesn&apos;t work perfectly
              for your setup, you pay nothing. If it works — and based on user feedback, it almost
              always does — you&apos;ll wonder how you ever went into an interview without it.
            </p>
          </article>

          {/* CTA */}
          <div className="mt-10 rounded-2xl border border-brand-500/30 bg-brand-50/60 dark:bg-brand-900/20 p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Ready to try the best Ntro alternative?
            </h3>
            <p className="text-muted-foreground mb-5 text-sm">
              14-day free trial. No credit card. Works on Windows 10 &amp; 11.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-7 py-3 transition-colors shadow-lg shadow-brand-500/25"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
