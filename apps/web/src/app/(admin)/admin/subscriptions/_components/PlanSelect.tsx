'use client';

import { updateSubscription } from '../../actions';

const PLANS = ['starter', 'pro', 'pro_annual', 'elite', 'elite_annual'];

const COLORS: Record<string, string> = {
  starter: 'text-slate-600',
  pro: 'text-violet-700',
  pro_annual: 'text-violet-700',
  elite: 'text-amber-700',
  elite_annual: 'text-amber-700',
};

export function PlanSelect({ id, current }: { id: string; current: string }) {
  return (
    <select
      defaultValue={current}
      onChange={async (e) => {
        await updateSubscription(id, { plan: e.target.value });
      }}
      className={`text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${COLORS[current] ?? 'text-slate-600'}`}
      style={{ '--tw-ring-color': '#F05A28' } as React.CSSProperties}
    >
      {PLANS.map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  );
}
