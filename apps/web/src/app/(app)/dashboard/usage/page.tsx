import { createClient } from '@/lib/supabase/server';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { Phone, Code2 } from 'lucide-react';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.ariainterview.com';

export default async function UsagePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? '';

  let usage = null;
  try {
    const res = await fetch(`${API_URL}/v1/usage`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (res.ok) usage = await res.json();
  } catch { /* ignore */ }

  const callsUsed: number = usage?.calls?.used ?? 0;
  const callsLimit: number = usage?.calls?.limit ?? 10;
  const codingUsed: number = usage?.codingSessions?.used ?? 0;
  const codingLimit: number = usage?.codingSessions?.limit ?? 2;
  const byDay: Array<{ date: string; count: number }> = usage?.byDay ?? [];

  const periodStart: string = usage?.period?.start ?? '';
  const periodEnd: string = usage?.period?.end ?? '';

  const isUnlimited = (n: number) => n === -1;

  const callsPct = isUnlimited(callsLimit) ? 0 : Math.min(Math.round((callsUsed / callsLimit) * 100), 100);
  const codingPct = isUnlimited(codingLimit) ? 0 : Math.min(Math.round((codingUsed / codingLimit) * 100), 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usage</h1>
        {periodStart && (
          <p className="text-muted-foreground text-sm mt-1">
            {periodStart} &ndash; {periodEnd}
          </p>
        )}
      </div>

      {/* Interview calls */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Interview calls this month</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{callsUsed} used</span>
          <span className="text-muted-foreground">
            Limit: {isUnlimited(callsLimit) ? 'Unlimited' : callsLimit}
          </span>
        </div>
        {!isUnlimited(callsLimit) && (
          <>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${callsPct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{callsPct}% of monthly limit used</p>
          </>
        )}
      </div>

      {/* Live coding sessions */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Live coding sessions this month</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{codingUsed} used</span>
          <span className="text-muted-foreground">
            Limit: {isUnlimited(codingLimit) ? 'Unlimited' : codingLimit}
          </span>
        </div>
        {!isUnlimited(codingLimit) && (
          <>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${codingPct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{codingPct}% of monthly limit used</p>
          </>
        )}
      </div>

      {/* Daily answer chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4">Daily answers (last 30 days)</h2>
        {byDay.length > 0
          ? <UsageChart data={byDay} />
          : <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
        }
      </div>

      {/* Approaching limit warnings */}
      {!isUnlimited(callsLimit) && callsPct >= 80 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm">
          <p className="font-medium text-amber-600 dark:text-amber-400">Call limit almost reached</p>
          <p className="text-muted-foreground mt-1">
            {callsPct}% of monthly interview calls used.{' '}
            <a href="/dashboard/billing" className="text-brand-500 hover:underline">Upgrade</a> for more.
          </p>
        </div>
      )}
    </div>
  );
}
