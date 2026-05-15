import { createAdminClient } from '@/lib/supabase/admin';
import { SubscriptionsTable } from './_components/SubscriptionsTable';

export default async function SubscriptionsPage() {
  const supabase = createAdminClient();

  const [{ data: subs }, { data: profiles }, { data: licenses }] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('id, user_id, plan, status, current_period_end')
      .order('id', { ascending: false }),
    supabase.from('profiles').select('id, email'),
    supabase.from('licenses').select('user_id, key'),
  ]);

  const emailMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.email ?? '']));
  const licenseMap = Object.fromEntries((licenses ?? []).map((l) => [l.user_id, l.key]));

  const subscriptions = (subs ?? []).map((s) => ({
    id: s.id,
    user_id: s.user_id,
    plan: s.plan,
    status: s.status,
    current_period_end: s.current_period_end ?? null,
    email: emailMap[s.user_id] ?? '',
    licenseKey: licenseMap[s.user_id] ?? null,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
        <p className="text-slate-500 text-sm mt-1">{subscriptions.length} total records</p>
      </div>
      <SubscriptionsTable subscriptions={subscriptions} />
    </div>
  );
}
