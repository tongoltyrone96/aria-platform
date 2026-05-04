import { createClient } from '@/lib/supabase/server';
import { UsageChart } from '@/components/dashboard/UsageChart';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.aria-ai.com';

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

  const used = usage?.used ?? 0;
  const limit = usage?.limit ?? 50;
  const byDay: Array<{ date: string; count: number }> = usage?.byDay ?? [];
  const pct = Math.min(Math.round((used / limit) * 100), 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usage</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {usage?.period?.start} — {usage?.period?.end}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{used} answers used</span>
          <span className="text-muted-foreground">Limit: {limit}</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{pct}% of monthly limit used</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4">Daily usage (last 30 days)</h2>
        {byDay.length > 0
          ? <UsageChart data={byDay} limit={limit} />
          : <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
        }
      </div>

      {pct >= 80 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm">
          <p className="font-medium text-amber-600 dark:text-amber-400">Approaching your limit</p>
          <p className="text-muted-foreground mt-1">
            You&apos;ve used {pct}% of your monthly answers.{' '}
            <a href="/pricing" className="text-brand-500 hover:underline">Upgrade</a> for more.
          </p>
        </div>
      )}
    </div>
  );
}
