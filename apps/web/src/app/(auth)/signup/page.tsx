'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.ariainterview.com';

const COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'KR', name: 'South Korea' }, { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' }, { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' }, { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' }, { code: 'SG', name: 'Singapore' },
  { code: 'OTHER', name: 'Other' },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', country: 'US', marketing: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          country: form.country,
          marketingOptIn: form.marketing,
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { details?: string };
        setError(err.details ?? 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Start your free trial</h1>
        <p className="text-muted-foreground mt-2">
          Free plan, no credit card required.{' '}
          <Link href="/login" className="text-brand-500 hover:underline font-medium">Sign in</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email" type="email" autoComplete="email" required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password" type="password" autoComplete="new-password" required minLength={8}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            placeholder="At least 8 characters"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="country" className="text-sm font-medium">Country</label>
          <select
            id="country"
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          >
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.marketing}
            onChange={(e) => setForm((f) => ({ ...f, marketing: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-border text-brand-500 focus:ring-brand-500"
          />
          <span className="text-sm text-muted-foreground">
            Subscribe to product updates and tips (optional)
          </span>
        </label>

        <button
          type="submit" disabled={loading}
          className={cn(
            'w-full py-2.5 px-4 bg-brand-500 text-white rounded-lg font-medium text-sm',
            'hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          )}
        >
          {loading ? 'Creating account…' : 'Start free trial'}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          By signing up you agree to our{' '}
          <Link href="/terms" className="hover:underline">Terms</Link> and{' '}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
