'use client';

import { useState } from 'react';
import Link from 'next/link';

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Download', href: '/dashboard' },
      { label: 'Changelog', href: '/blog' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Documentation', href: '/docs/onboarding' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Refund', href: '/refund' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div>
              <span className="font-bold text-xl tracking-tight" style={{ color: '#F05A28' }}>ARIA</span>
              <p className="mt-2 text-sm text-white/50 max-w-xs leading-relaxed">
                AI Communication Assistant for Windows. Real-time suggestions grounded in your resume.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-white/70 mb-2">Get tips &amp; updates</p>
              {submitted ? (
                <p className="text-sm font-medium" style={{ color: '#F05A28' }}>Thanks - you&apos;re in!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-white/25 text-white focus:outline-none focus:ring-2 focus:border-transparent transition"
                    style={{ '--tw-ring-color': '#F05A28' } as React.CSSProperties}
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg text-white text-sm font-semibold px-4 py-2 transition-colors"
                    style={{ backgroundColor: '#F05A28' }}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-white/80 mb-4">{col.heading}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} ARIA AI Inc. All rights reserved.
          </p>
          <a
            href="https://status.ariainterview.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            All systems operational
          </a>
        </div>
      </div>
    </footer>
  );
}
