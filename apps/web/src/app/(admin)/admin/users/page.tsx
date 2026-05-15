import { createAdminClient } from '@/lib/supabase/admin';
import { DeleteUserButton } from './_components/DeleteUserButton';
import { TableFilters } from '../../_components/TableFilters';

const PLAN_BADGE: Record<string, string> = {
  starter: 'bg-slate-100 text-slate-600',
  pro: 'bg-violet-100 text-violet-700',
  pro_annual: 'bg-violet-100 text-violet-700',
  elite: 'bg-amber-100 text-amber-700',
  elite_annual: 'bg-amber-100 text-amber-700',
};

const PLAN_FILTERS = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Elite', value: 'elite' },
];

const STATUS_FILTERS = [
  { label: 'Active', value: 'active' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Past Due', value: 'past_due' },
  { label: 'Trialing', value: 'trialing' },
];

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string; status?: string }>;
}) {
  const { q, plan, status } = await searchParams;
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, country, created_at, role')
    .order('created_at', { ascending: false });

  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, plan, status');

  const subMap = Object.fromEntries((subs ?? []).map((s) => [s.user_id, s]));

  const filtered = (profiles ?? []).filter((p) => {
    const sub = subMap[p.id];
    const userPlan = sub?.plan ?? 'starter';
    const userStatus = sub?.status ?? '-';
    if (q && !p.email?.toLowerCase().includes(q.toLowerCase())) return false;
    if (plan && userPlan !== plan) return false;
    if (status && userStatus !== status) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm mt-1">
          {filtered.length} of {profiles?.length ?? 0} users
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
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => {
              const sub = subMap[p.id];
              const userPlan = sub?.plan ?? 'starter';
              const userStatus = sub?.status ?? '-';
              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-medium text-slate-800">{p.email}</p>
                      {p.full_name && <p className="text-xs text-slate-400 mt-0.5">{p.full_name}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="font-mono text-xs text-slate-400 cursor-pointer hover:text-slate-700 transition-colors"
                      title={p.id}
                    >
                      {p.id.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${PLAN_BADGE[userPlan] ?? PLAN_BADGE.starter}`}>
                      {userPlan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      userStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {userStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">
                    {new Date(p.created_at).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-5 py-3.5">
                    {p.role === 'admin' && (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-600">
                        admin
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {p.role !== 'admin' && (
                      <DeleteUserButton userId={p.id} email={p.email} />
                    )}
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
