import { createClient } from '@/lib/supabase/server';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { Download, Phone, Code2, Zap } from 'lucide-react';
import { LicenseKeyDisplay } from '@/components/dashboard/LicenseKeyDisplay';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.ariainterview.com';
const DOWNLOAD_URL = 'https://github.com/tongoltyrone96/aria-releases/releases/download/v0.0.1/ARIA.Setup.0.0.1.exe';

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

function planLabel(plan: string) {
  const labels: Record<string, string> = {
    starter: 'Free',
    pro: 'Pro', pro_annual: 'Pro',
    elite: 'Elite', elite_annual: 'Elite',
    // legacy
    trial: 'Free', free: 'Free', lifetime: 'Elite',
  };
  return labels[plan] ?? plan.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function isPaidPlan(plan: string) {
  return plan !== 'starter' && plan !== 'trial' && plan !== 'free';
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? '';

  const { account, usage } = await getAccountData(token);

  const plan = account?.subscription?.plan ?? 'free';
  const periodEnd = account?.subscription?.currentPeriodEnd
    ? new Date(account.subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;
  const activeDevices = account?.licenses?.flatMap((l: { devices: unknown[] }) => l.devices).filter((d: { status: string }) => d.status === 'active').length ?? 0;
  const licenseKey: string | null = account?.licenses?.[0]?.key ?? null;

  const callsUsed: number = usage?.calls?.used ?? 0;
  const callsLimit: number = usage?.calls?.limit ?? 10;
  const codingUsed: number = usage?.codingSessions?.used ?? 0;
  const codingLimit: number = usage?.codingSessions?.limit ?? 2;
  const answersPerCall: number = usage?.answersPerCall ?? 6;
  const byDay = usage?.byDay ?? [];

  const isUnlimited = (n: number) => n === -1;

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
          <p className="text-xl font-bold">{planLabel(plan)}</p>
          {isPaidPlan(plan) && periodEnd && (
            account?.subscription?.cancelAtPeriodEnd
              ? <p className="text-xs text-destructive mt-1">Cancels {periodEnd}</p>
              : <p className="text-xs text-muted-foreground mt-1">Renews {periodEnd}</p>
          )}
          {!isPaidPlan(plan) && (
            <p className="text-xs text-muted-foreground mt-1">Free forever — no credit card needed</p>
          )}
        </div>
        <a
          href="/dashboard/billing"
          className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          {isPaidPlan(plan) ? 'Manage' : 'Upgrade'}
        </a>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="text-xs font-medium">Interview calls / mo</span>
          </div>
          <p className="text-2xl font-bold">
            {callsUsed}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              / {isUnlimited(callsLimit) ? '∞' : callsLimit}
            </span>
          </p>
          {!isUnlimited(callsLimit) && (
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (callsUsed / callsLimit) * 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span className="text-xs font-medium">AI answers / call</span>
          </div>
          <p className="text-2xl font-bold">
            {isUnlimited(answersPerCall) ? '∞' : answersPerCall}
          </p>
          <p className="text-xs text-muted-foreground">per interview call</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Code2 className="h-4 w-4" />
            <span className="text-xs font-medium">Live coding / mo</span>
          </div>
          <p className="text-2xl font-bold">
            {codingUsed}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              / {isUnlimited(codingLimit) ? '∞' : codingLimit}
            </span>
          </p>
          {!isUnlimited(codingLimit) && (
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (codingUsed / codingLimit) * 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Active devices */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Active devices</span>
        <span className="text-sm font-semibold">{activeDevices}</span>
      </div>

      {/* Usage chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4">Answers per day (last 30 days)</h2>
        {byDay.length > 0
          ? <UsageChart data={byDay} />
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
          href={DOWNLOAD_URL}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    </div>
  );
}
