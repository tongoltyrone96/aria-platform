'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-muted-foreground">
          Password reset link sent to <strong>{email}</strong>. It expires in 1 hour.
        </p>
        <Link href="/login" className="text-brand-500 hover:underline text-sm">Back to sign in</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">{error}</div>
        )}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className={cn(
            'w-full py-2.5 px-4 bg-brand-500 text-white rounded-lg font-medium text-sm',
            'hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
        <p className="text-center text-sm">
          <Link href="/login" className="text-brand-500 hover:underline">Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}
