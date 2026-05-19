'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';

// Note: metadata export can't be used in a 'use client' component.
// Keep this page as a client component with metadata exported from a parent or use a layout.
// For this simple contact page we include the metadata as a standard export and rely on
// Next.js to pick it up via the layout's generateMetadata (or just add a separate metadata.ts).

const contactChannels = [
  {
    icon: Mail,
    title: 'Email support',
    description: 'For billing, technical issues, and general questions.',
    value: 'contact@ariainterview.com',
    href: 'mailto:contact@ariainterview.com',
    cta: 'Send email',
  },
  {
    icon: MessageSquare,
    title: 'Discord community',
    description: 'Join our community for quick answers and feature discussions.',
    value: '@tj19960224',
    href: 'https://discord.com/users/tj19960224',
    cta: 'Join Discord',
  },
  {
    icon: Send,
    title: 'Telegram',
    description: 'DM us for quick questions or just say hi.',
    value: '+1 (315) 281-9469',
    href: 'https://t.me/+13152819469',
    cta: 'Message us',
  },
];

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      console.error('[ContactForm] Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-50/60 dark:bg-green-900/10 p-8 text-center">
        <p className="text-lg font-semibold text-foreground mb-2">Message sent!</p>
        <p className="text-sm text-muted-foreground">
          We typically respond within a few hours on business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium text-foreground">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
        >
          <option value="">Select a topic¦</option>
          <option value="billing">Billing &amp; refund</option>
          <option value="technical">Technical support</option>
          <option value="feature">Feature request</option>
          <option value="partnership">Partnership</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us what's on your mindâ€¦"
          className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-y"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-50/60 dark:bg-red-900/10 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 transition-colors self-start"
      >
        {loading ? 'Sendingâ€¦' : 'Send message'}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center bg-gradient-to-b from-brand-50/60 to-background dark:from-brand-900/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Contact us
          </h1>
          <p className="text-lg text-muted-foreground">
            Questions, bug reports, or partnership inquiries â€” we&apos;re happy to hear from you.
          </p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {contactChannels.map((ch) => (
              <div
                key={ch.title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <ch.icon size={20} className="text-brand-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{ch.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{ch.description}</p>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                    rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    {ch.cta} &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
