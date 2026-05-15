'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { DeleteUserButton } from './DeleteUserButton';

const PLAN_BADGE: Record<string, string> = {
  starter: 'bg-slate-100 text-slate-600',
  pro: 'bg-violet-100 text-violet-700',
  pro_annual: 'bg-violet-100 text-violet-700',
  elite: 'bg-amber-100 text-amber-700',
  elite_annual: 'bg-amber-100 text-amber-700',
};

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: string | null;
  plan: string;
  status: string;
}

export function UsersTable({ users }: { users: User[] }) {
  const [q, setQ] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = users.filter((u) => {
    if (q && !u.email.toLowerCase().includes(q.toLowerCase())) return false;
    if (planFilter && u.plan !== planFilter) return false;
    if (statusFilter && u.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none w-56"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-600 focus:outline-none"
        >
          <option value="">All Plans</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="pro_annual">Pro Annual</option>
          <option value="elite">Elite</option>
          <option value="elite_annual">Elite Annual</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-600 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="canceled">Canceled</option>
          <option value="past_due">Past Due</option>
          <option value="trialing">Trialing</option>
        </select>
        <span className="text-sm text-slate-400">{filtered.length} of {users.length}</span>
      </div>

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
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate-800">{u.email}</p>
                  {u.full_name && <p className="text-xs text-slate-400 mt-0.5">{u.full_name}</p>}
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs text-slate-400" title={u.id}>
                    {u.id.slice(0, 8)}...
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${PLAN_BADGE[u.plan] ?? PLAN_BADGE.starter}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString('en-US')}
                </td>
                <td className="px-5 py-3.5">
                  {u.role === 'admin' && (
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-600">admin</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  {u.role !== 'admin' && <DeleteUserButton userId={u.id} email={u.email} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
