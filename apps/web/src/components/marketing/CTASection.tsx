import Link from 'next/link';

export function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500" />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_107%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6">
          Prepare smarter.
          <br />
          <span className="text-brand-100">Communicate with confidence.</span>
        </h2>
        <p className="max-w-xl mx-auto text-base sm:text-lg text-white/75 mb-10 leading-relaxed">
          ARIA listens to your conversations, knows your resume, and delivers personalized AI
          suggestions in under a second — natively on Windows. Join thousands of professionals
          who communicate more clearly in every interview and meeting.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-brand-50 text-brand-700 text-base font-bold px-8 py-4 transition-colors shadow-xl shadow-brand-900/30"
          >
            Start with Free plan
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/15 text-white text-base font-semibold px-8 py-4 transition-colors backdrop-blur"
          >
            View pricing
          </Link>
        </div>
        <p className="mt-5 text-xs text-white/50">
          No credit card required &middot; Works on Windows 10 &amp; 11 &middot; Cancel anytime
        </p>
      </div>
    </section>
  );
}
