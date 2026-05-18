'use client';

import { useState, useMemo } from 'react';
import { Search, Key, ChevronLeft, ChevronRight } from 'lucide-react';
import { PlanSelect } from './PlanSelect';
import { StatusSelect } from './StatusSelect';

const PLAN_BADGE: Record<string, string> = {
  starter: 'bg-slate-100 text-slate-600',
  pro: 'bg-violet-100 text-violet-700',
  pro_annual: 'bg-violet-100 text-violet-700',
  elite: 'bg-amber-100 text-amber-700',
  elite_annual: 'bg-amber-100 text-amber-700',
};

const ITEMS_PER_PAGE = 10;

interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  current_period_end: string | null;
  email: string;
  licenseKey: string | null;
}

export function SubscriptionsTable({ subscriptions }: { subscriptions: Subscription[] }) {
  const [q, setQ] = useState('');
  const [keySearch, setKeySearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      if (q && !s.email.toLowerCase().includes(q.toLowerCase())) return false;
      if (keySearch && (!s.licenseKey || !s.licenseKey.toLowerCase().includes(keySearch.toLowerCase()))) return false;
      if (planFilter && s.plan !== planFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      return true;
    });
  }, [subscriptions, q, keySearch, planFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubs = filtered.slice(startIndex, endIndex);

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={q}
            onChange={(e) => handleFilterChange(setQ)(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none w-56"
          />
        </div>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by license key..."
            value={keySearch}
            onChange={(e) => handleFilterChange(setKeySearch)(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none w-56"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => handleFilterChange(setPlanFilter)(e.target.value)}
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
          onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-600 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="canceled">Canceled</option>
          <option value="past_due">Past Due</option>
          <option value="trialing">Trialing</option>
          <option value="paused">Paused</option>
        </select>
        <span className="text-sm text-slate-400">{filtered.length} of {subscriptions.length}</span>
      </div>

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
            {paginatedSubs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              paginatedSubs.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-700 text-xs truncate max-w-[180px]">{s.email || s.user_id.slice(0, 8) + '...'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    {s.licenseKey ? (
                      <span
                        className="font-mono text-xs text-slate-500 cursor-pointer hover:text-slate-800 transition-colors"
                        title={s.licenseKey}
                      >
                        {s.licenseKey.slice(0, 16)}...
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-orange-500 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-slate-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
