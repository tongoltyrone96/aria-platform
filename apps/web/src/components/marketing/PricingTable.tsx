'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Users, Loader2, Bitcoin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.ariainterview.com';

type BillingCycle = 'monthly' | 'annual';

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  annualPrice?: number;
  annualMonthlyRate?: number;
  badge?: string;
  highlighted?: boolean;
  description: string;
  features: string[];
  /** If set, card shows a crypto payment button using this plan ID */
  cryptoPlanMonthly?: string;
  cryptoPlanAnnual?: string;
  /** Fallback link CTA (Free plan only) */
  ctaLabel?: string;
  ctaHref?: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    description: 'Get started — no credit card needed.',
    highlighted: false,
    features: [
      '10 interview calls / month',
      '6 AI answers per call',
      '1 live coding session / month',
      'Premium WASAPI audio capture',
      'State-of-the-art AI models',
      'AI assistant overlay',
      'Multi-user simultaneous access',
      'Resume upload (1 profile)',
    ],
    ctaLabel: 'Download Free',
    ctaHref: '/dashboard',
  },
  {
    name: 'Pro',
    monthlyPrice: 17.99,
    annualPrice: 190.03,
    annualMonthlyRate: 15.83,
    badge: 'Most Popular',
    highlighted: true,
    description: 'For professionals who want the full experience.',
    features: [
      '70 interview calls / month',
      'Unlimited AI answers per call',
      '50 live coding sessions / month',
      'Premium WASAPI audio capture',
      'State-of-the-art AI models',
      'Advanced AI overlay',
      'Multi-user simultaneous access',
      'Resume upload (3 profiles)',
      'STAR-method coaching mode',
      'Priority support',
    ],
    cryptoPlanMonthly: 'pro_monthly',
    cryptoPlanAnnual: 'pro_yearly',
  },
  {
    name: 'Elite',
    monthlyPrice: 27.99,
    annualPrice: 295.56,
    annualMonthlyRate: 24.63,
    description: 'For power users & teams.',
    highlighted: false,
    features: [
      '150 interview calls / month',
      'Unlimited AI answers per call',
      '100 live coding sessions / month',
      'Premium WASAPI audio capture',
      'State-of-the-art AI models',
      'Advanced AI overlay',
      'Multi-user simultaneous access',
      'Resume upload (10 profiles)',
      'STAR-method coaching mode',
      'Code-question deep analysis',
      'Early access to new features',
      'Dedicated support',
    ],
    cryptoPlanMonthly: 'elite_monthly',
    cryptoPlanAnnual: 'elite_yearly',
  },
];

// ── Crypto pay button ────────────────────────────────────────

interface CryptoPayButtonProps {
  cryptoPlan: string;
  highlighted: boolean;
}

function CryptoPayButton({ cryptoPlan, highlighted }: CryptoPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${API_URL}/api/payments/crypto/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: cryptoPlan }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { details?: string };
        throw new Error(data.details ?? `Server error ${res.status}`);
      }

      const { paymentUrl } = await res.json() as { paymentUrl: string };
      window.location.href = paymentUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold px-5 py-3 transition-all',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          highlighted
            ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 hover:-translate-y-0.5'
            : 'border border-border bg-background hover:bg-muted text-foreground',
        )}
      >
        {loading
          ? <Loader2 size={14} className="animate-spin shrink-0" />
          : <Bitcoin size={14} className="shrink-0" />}
        {loading ? 'Redirecting to checkout…' : 'Pay with Crypto'}
      </button>
      {error && (
        <p className="text-xs text-red-500 text-center leading-snug">{error}</p>
      )}
    </div>
  );
}

// ── Plan card ────────────────────────────────────────────────

function PlanCard({ plan, billing, index }: { plan: PricingPlan; billing: BillingCycle; index: number }) {
  const price =
    billing === 'annual' && plan.annualMonthlyRate !== undefined
      ? plan.annualMonthlyRate
      : plan.monthlyPrice;

  const annualSavings =
    billing === 'annual' && plan.annualPrice !== undefined
      ? plan.monthlyPrice * 12 - plan.annualPrice
      : 0;

  const cryptoPlan =
    billing === 'annual' && plan.cryptoPlanAnnual
      ? plan.cryptoPlanAnnual
      : plan.cryptoPlanMonthly;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={cn(
        'relative flex flex-col rounded-2xl border p-8 transition-all',
        plan.highlighted
          ? 'border-brand-500 shadow-2xl shadow-brand-500/15 bg-background scale-[1.02]'
          : 'border-border bg-background',
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-brand-500 px-4 py-1 text-xs font-bold text-white shadow">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Price header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-0.5">{plan.name}</h3>
        <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
        <div className="flex items-end gap-1">
          {plan.monthlyPrice === 0 ? (
            <span className="text-4xl font-bold text-foreground">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold text-foreground">
                ${(Math.round(price * 100) / 100).toFixed(2)}
              </span>
              <span className="text-muted-foreground text-sm mb-1.5">/mo</span>
            </>
          )}
        </div>
        {billing === 'annual' && annualSavings > 0 && (
          <p className="text-xs text-green-500 font-medium mt-1">
            Billed ${plan.annualPrice}/yr — save ${Math.round(annualSavings)}/yr
          </p>
        )}
        {billing === 'monthly' && plan.monthlyPrice > 0 && (
          <p className="text-xs text-muted-foreground mt-1">Billed monthly</p>
        )}
      </div>

      {/* Multi-user badge */}
      <div className="flex items-center gap-2 mb-5 text-xs font-medium text-brand-500 bg-brand-500/8 border border-brand-500/20 rounded-lg px-3 py-2">
        <Users size={13} />
        Multiple users can share one account simultaneously
      </div>

      {/* Feature list */}
      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check
              size={15}
              className={cn('mt-0.5 shrink-0', plan.highlighted ? 'text-brand-500' : 'text-green-500')}
            />
            <span className="text-sm text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {cryptoPlan ? (
        <CryptoPayButton cryptoPlan={cryptoPlan} highlighted={plan.highlighted ?? false} />
      ) : (
        <Link
          href={plan.ctaHref ?? '/dashboard'}
          className={cn(
            'inline-flex items-center justify-center rounded-xl text-sm font-semibold px-5 py-3 transition-all',
            plan.highlighted
              ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 hover:-translate-y-0.5'
              : 'border border-border bg-background hover:bg-muted text-foreground',
          )}
        >
          {plan.ctaLabel ?? 'Get Started'}
        </Link>
      )}
    </motion.div>
  );
}

// ── PricingTable ─────────────────────────────────────────────

export function PricingTable() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  return (
    <div className="flex flex-col gap-10">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={cn('text-sm font-medium transition-colors', billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={billing === 'annual'}
          onClick={() => setBilling((b) => (b === 'monthly' ? 'annual' : 'monthly'))}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
            billing === 'annual' ? 'bg-brand-500' : 'bg-muted',
          )}
        >
          <motion.span
            layout
            className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow"
            animate={{ x: billing === 'annual' ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <span className={cn('text-sm font-medium transition-colors', billing === 'annual' ? 'text-foreground' : 'text-muted-foreground')}>
          Annual
          <span className="ml-1.5 inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600">
            Save 12%
          </span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto w-full items-start">
        {plans.map((plan, i) => (
          <PlanCard key={plan.name} plan={plan} billing={billing} index={i} />
        ))}
      </div>

      {/* Fine print */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-xs text-muted-foreground"
      >
        Free plan available forever — no credit card needed. Crypto payments are one-time charges; renewal required each cycle.
      </motion.p>
    </div>
  );
}
