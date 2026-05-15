import { createAdminClient } from '@/lib/supabase/admin';
import { Users, CreditCard, TrendingUp, Star } from 'lucide-react';

export default async function AdminPage() {
  let totalUsers: number | null = 0;
  let subCounts: { plan: string; status: string }[] | null = [];

  try {
    const supabase = createAdminClient();
    const [{ count }, { data }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('plan, status'),
    ]);
    totalUsers = count;
    subCounts = data;
    console.log('[AdminPage] loaded ok, users:', count);
  } catch (e) {
    console.error('[AdminPage] createAdminClient error:', e);
  }

  const active = subCounts?.filter((s) => s.status === 'active') ?? [];
  const byPlan = {
    starter: active.filter((s) => s.plan === 'starter').length,
    pro: active.filter((s) => s.plan === 'pro').length,
    elite: active.filter((s) => s.plan === 'elite').length,
  };

  const stats = [
    { label: '전체 사용자', value: totalUsers ?? 0, icon: Users, color: 'bg-blue-500' },
    { label: '활성 구독', value: active.length, icon: CreditCard, color: 'bg-green-500' },
    { label: 'Pro 플랜', value: byPlan.pro, icon: TrendingUp, color: 'bg-violet-500' },
    { label: 'Elite 플랜', value: byPlan.elite, icon: Star, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
        <p className="text-slate-500 text-sm mt-1">ARIA 플랫폼 현황</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`${color} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">플랜별 분포</h2>
        <div className="space-y-3">
          {[
            { plan: 'Starter (Free)', count: byPlan.starter, color: 'bg-slate-400' },
            { plan: 'Pro', count: byPlan.pro, color: 'bg-violet-500' },
            { plan: 'Elite', count: byPlan.elite, color: 'bg-amber-500' },
          ].map(({ plan, count, color }) => {
            const pct = active.length > 0 ? Math.round((count / active.length) * 100) : 0;
            return (
              <div key={plan} className="flex items-center gap-3">
                <span className="w-24 text-sm text-slate-600 shrink-0">{plan}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-semibold text-slate-700 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
