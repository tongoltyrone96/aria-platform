'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next');
  const next = nextUrl?.startsWith('/') ? nextUrl : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message ?? 'Sign in failed. Please try again.');
        return;
      }

      if (!data?.session || !data.user) {
        setError('Unable to sign in. Please verify your credentials and try again.');
        return;
      }

      router.push(next);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium hover:underline" style={{ color: '#F05A28' }}>
            Sign up free
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 text-sm placeholder:text-muted-foreground"
            style={{ '--tw-ring-color': '#F05A28' } as React.CSSProperties}
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <Link href="/forgot" className="text-xs hover:underline" style={{ color: '#F05A28' }}>
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 text-sm placeholder:text-muted-foreground"
            style={{ '--tw-ring-color': '#F05A28' } as React.CSSProperties}
            placeholder="Min. 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            'w-full py-3 px-4 text-white rounded-xl font-semibold text-sm',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5',
          )}
          style={{ backgroundColor: '#F05A28' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
