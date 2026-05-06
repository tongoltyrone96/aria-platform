import { createClient } from '@/lib/supabase/server';
import { ExternalLink } from 'lucide-react';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.ariainterview.com';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? '';

  let subscription = null;
  try {
    const res = await fetch(`${API_URL}/v1/account`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      subscription = data.subscription;
    }
  } catch { /* ignore */ }

  const PLAN_PRICES: Record<string, string> = {
    starter: 'Free',
    pro: '$17.99/mo', pro_annual: '$190.03/yr',
    elite: '$27.99/mo', elite_annual: '$295.56/yr',
    // legacy
    trial: 'Free', free: 'Free', lifetime: 'Lifetime',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your subscription and payment method</p>
      </div>

      {/* Current plan */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Current Plan</h2>
        {subscription ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold capitalize">
            {{ starter: 'Free', pro: 'Pro', pro_annual: 'Pro', elite: 'Elite', elite_annual: 'Elite' }[subscription.plan as string] ?? subscription.plan.replace('_', ' ')}
          </p>
              <p className="text-sm text-muted-foreground mt-1">
                {PLAN_PRICES[subscription.plan] ?? ''}
                {subscription.currentPeriodEnd && (
                  <> Â· {subscription.cancelAtPeriodEnd ? 'Cancels' : 'Renews'}{' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</>
                )}
              </p>
              {subscription.cancelAtPeriodEnd && (
                <p className="text-xs text-destructive mt-1">Your subscription will not renew.</p>
              )}
            </div>
            <div className="flex gap-2">
              <a
                href="/pricing"
                className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Change plan
              </a>
              <form action={`${API_URL}/v1/billing/portal`} method="POST">
                <input type="hidden" name="token" value={token} />
                <a
                  href={`${API_URL}/v1/billing/portal`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Manage <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">14-day Free Trial</p>
              <p className="text-sm text-muted-foreground mt-1">Upgrade to keep access after trial ends</p>
            </div>
            <a
              href="/pricing"
              className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
            >
              Upgrade now
            </a>
          </div>
        )}
      </div>

      {/* Pricing quick links */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { plan: 'pro', name: 'Pro', price: '$17.99/mo', href: '/pricing' },
          { plan: 'pro_annual', name: 'Pro Annual', price: '$190/yr', href: '/pricing' },
          { plan: 'elite', name: 'Elite', price: '$27.99/mo', href: '/pricing' },
        ].map((p) => (
          <a
            key={p.plan}
            href={p.href}
            className="bg-card border border-border rounded-xl p-4 hover:border-brand-500/50 transition-colors group"
          >
            <p className="font-semibold group-hover:text-brand-500 transition-colors">{p.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{p.price}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
