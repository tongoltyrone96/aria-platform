import { createAdminClient } from '@/lib/supabase/admin';
import { PlanSelect } from './_components/PlanSelect';
import { StatusSelect } from './_components/StatusSelect';
import { TableFilters } from '../../../_components/TableFilters';

const PLAN_FILTERS = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Pro Annual', value: 'pro_annual' },
  { label: 'Elite', value: 'elite' },
  { label: 'Elite Annual', value: 'elite_annual' },
];

const STATUS_FILTERS = [
  { label: 'Active', value: 'active' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Past Due', value: 'past_due' },
  { label: 'Trialing', value: 'trialing' },
  { label: 'Paused', value: 'paused' },
];

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string; status?: string }>;
}) {
  const { q, plan, status } = await searchParams;
  const supabase = createAdminClient();

  const [{ data: subs }, { data: profiles }, { data: licenses }] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('id, user_id, plan, status, current_period_end, trial_ends_at')
      .order('id', { ascending: false }),
    supabase.from('profiles').select('id, email'),
    supabase.from('licenses').select('user_id, key').catch(() => ({ data: null })),
  ]);

  const emailMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.email]));
  const licenseMap = Object.fromEntries((licenses ?? []).map((l) => [l.user_id, l.key]));

  const filtered = (subs ?? []).filter((s) => {
    const email = emailMap[s.user_id] ?? '';
    if (q && !email.toLowerCase().includes(q.toLowerCase())) return false;
    if (plan && s.plan !== plan) return false;
    if (status && s.status !== status) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
        <p className="text-slate-500 text-sm mt-1">
          {filtered.length} of {subs?.length ?? 0} records
        </p>
      </div>

      <TableFilters
        searchPlaceholder="Search by email..."
        filters={[
          { key: 'plan', placeholder: 'All Plans', options: PLAN_FILTERS },
          { key: 'status', placeholder: 'All Statuses', options: STATUS_FILTERS },
        ]}
      />

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">License Key</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Period End</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => {
              const licenseKey = licenseMap[s.user_id];
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-700 text-xs truncate max-w-[180px]">
                      {emailMap[s.user_id] ?? s.user_id.slice(0, 8) + '...'}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    {licenseKey ? (
                      <span
                        className="font-mono text-xs text-slate-500 cursor-pointer hover:text-slate-800 transition-colors"
                        title={licenseKey}
                      >
                        {licenseKey.slice(0, 16)}...
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <PlanSelect id={s.id} current={s.plan} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusSelect id={s.id} current={s.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">
                    {s.current_period_end
                      ? new Date(s.current_period_end).toLocaleDateString('en-US')
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
