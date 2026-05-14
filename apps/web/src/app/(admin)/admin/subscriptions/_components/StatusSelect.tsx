'use client';

import { updateSubscription } from '../../actions';

const STATUSES = ['active', 'canceled', 'past_due', 'trialing', 'paused'];

const COLORS: Record<string, string> = {
  active: 'text-green-700',
  canceled: 'text-red-600',
  past_due: 'text-orange-600',
  trialing: 'text-blue-600',
  paused: 'text-slate-500',
};

export function StatusSelect({ id, current }: { id: string; current: string }) {
  return (
    <select
      defaultValue={current}
      onChange={async (e) => {
        await updateSubscription(id, { status: e.target.value });
      }}
      className={`text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${COLORS[current] ?? 'text-slate-500'}`}
      style={{ '--tw-ring-color': '#F05A28' } as React.CSSProperties}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
