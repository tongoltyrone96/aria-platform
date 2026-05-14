import { createAdminClient } from '@/lib/supabase/admin';
import { PlanSelect } from './_components/PlanSelect';
import { StatusSelect } from './_components/StatusSelect';

export default async function SubscriptionsPage() {
  const supabase = createAdminClient();

  const { data: subs } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan, status, current_period_end, trial_ends_at')
    .order('id', { ascending: false });

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email');

  const emailMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.email]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">구독 관리</h1>
        <p className="text-slate-500 text-sm mt-1">전체 {subs?.length ?? 0}건</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">사용자</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">플랜</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">상태</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">기간 종료</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(subs ?? []).map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate-700 text-xs truncate max-w-[200px]">
                    {emailMap[s.user_id] ?? s.user_id.slice(0, 8) + '...'}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <PlanSelect id={s.id} current={s.plan} />
                </td>
                <td className="px-5 py-3.5">
                  <StatusSelect id={s.id} current={s.status} />
                </td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">
                  {s.current_period_end
                    ? new Date(s.current_period_end).toLocaleDateString('ko-KR')
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
