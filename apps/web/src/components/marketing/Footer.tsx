'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Twitter, Youtube, Github } from 'lucide-react';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

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

const socials = [
  { label: 'X / Twitter', href: 'https://twitter.com/aria_ai_app', Icon: Twitter },
  { label: 'YouTube', href: 'https://youtube.com/@aria_ai_app', Icon: Youtube },
  {
    label: 'Discord',
    href: 'https://discord.gg/aria-ai',
    Icon: ({ className }: { className?: string }) => <DiscordIcon className={className} />,
  },
  { label: 'GitHub', href: 'https://github.com/aria-ai-app', Icon: Github },
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
                <p className="text-sm font-medium" style={{ color: '#F05A28' }}>Thanks — you&apos;re in!</p>
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

            <div className="flex items-center gap-4">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
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
