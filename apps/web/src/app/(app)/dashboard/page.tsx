import { createClient } from '@/lib/supabase/server';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { Download, Zap, Monitor, Clock } from 'lucide-react';
import { LicenseKeyDisplay } from '@/components/dashboard/LicenseKeyDisplay';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.ariainterview.com';
const CDN_URL = process.env['NEXT_PUBLIC_CDN_URL'] ?? 'https://cdn.ariainterview.com';

async function getAccountData(token: string) {
  try {
    const [accountRes, usageRes] = await Promise.all([
      fetch(`${API_URL}/v1/account`, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 } }),
      fetch(`${API_URL}/v1/usage`, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 } }),
    ]);
    const account = accountRes.ok ? await accountRes.json() : null;
    const usage = usageRes.ok ? await usageRes.json() : null;
    return { account, usage };
  } catch {
    return { account: null, usage: null };
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? '';

  const { account, usage } = await getAccountData(token);

  const plan = account?.subscription?.plan ?? 'trial';
  const periodEnd = account?.subscription?.currentPeriodEnd
    ? new Date(account.subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';
  const activeDevices = account?.licenses?.flatMap((l: { devices: unknown[] }) => l.devices).filter((d: { status: string }) => d.status === 'active').length ?? 0;
  const licenseKey: string | null = account?.licenses?.[0]?.key ?? null;
  const usedThisMonth = usage?.used ?? 0;
  const limit = usage?.limit ?? 50;
  const byDay = usage?.byDay ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back to ARIA</p>
      </div>

      {/* Plan card */}
      <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">Current Plan</p>
          <p className="text-xl font-bold capitalize">{plan.replace('_', ' ')}</p>
          {account?.subscription?.cancelAtPeriodEnd
            ? <p className="text-xs text-destructive mt-1">Cancels {periodEnd}</p>
            : <p className="text-xs text-muted-foreground mt-1">Renews {periodEnd}</p>
          }
        </div>
        <a
          href="/dashboard/billing"
          className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          {plan === 'trial' ? 'Upgrade' : 'Manage'}
        </a>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Zap, label: 'Answers this month', value: `${usedThisMonth} / ${limit}` },
          { icon: Monitor, label: 'Active devices', value: String(activeDevices) },
          { icon: Clock, label: 'Days in trial', value: plan === 'trial' ? '14' : 'â€”' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Usage chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4">Answers per day (last 30 days)</h2>
        {byDay.length > 0
          ? <UsageChart data={byDay} limit={limit} />
          : <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No usage data yet</div>
        }
      </div>

      {/* License key */}
      {licenseKey && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <h2 className="text-sm font-semibold">Your License Key</h2>
          <p className="text-xs text-muted-foreground">Enter this key in the ARIA desktop app to activate.</p>
          <LicenseKeyDisplay licenseKey={licenseKey} />
        </div>
      )}

      {/* Download */}
      <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Download ARIA for Windows</h2>
          <p className="text-sm text-muted-foreground mt-1">Install the desktop app and activate your license</p>
        </div>
        <a
          href={`${CDN_URL}/releases/ARIA-latest.exe`}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    </div>
  );
}
