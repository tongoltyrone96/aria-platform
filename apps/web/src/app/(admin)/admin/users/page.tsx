import { createAdminClient } from '@/lib/supabase/admin';
import { UsersTable } from './_components/UsersTable';

export default async function UsersPage() {
  const supabase = createAdminClient();

  const [{ data: profiles }, { data: subs }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, full_name, created_at, role')
      .order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('user_id, plan, status'),
  ]);

  const subMap = Object.fromEntries((subs ?? []).map((s) => [s.user_id, s]));

  const users = (profiles ?? []).map((p) => {
    const sub = subMap[p.id];
    return {
      id: p.id,
      email: p.email ?? '',
      full_name: p.full_name ?? null,
      created_at: p.created_at,
      role: p.role ?? null,
      plan: sub?.plan ?? 'starter',
      status: sub?.status ?? '-',
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm mt-1">{users.length} total users</p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
