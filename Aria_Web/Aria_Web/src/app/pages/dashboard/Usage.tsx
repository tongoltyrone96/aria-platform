import { Code2, Download, Maximize2, Mic, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getScheduledInterviews } from "../../lib/interviews";
import { getDailyUsageRecords, getUsageSummary } from "../../lib/usage";
import { downloadExcel } from "../../lib/exportCsv";
import type { DailyUsageRecord, UsageSummary } from "../../lib/usage";
import type { ScheduledInterview } from "../../lib/interviews";

// TODO [SUPABASE:DB]: fetch usage records for current billing period from usage_logs table
// TODO [SUPABASE:DB]: fetch plan limits from profiles + plans table

type DailyActivityRow = DailyUsageRecord & {
  interview: number;
  phoneCall: number;
  scheduled: number;
};

function toDateKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getScheduledDate(item: ScheduledInterview) {
  return item.scheduledAt ?? item.savedAt;
}

function buildDailyActivityRows(usageRecords: DailyUsageRecord[], scheduledItems: ScheduledInterview[]): DailyActivityRow[] {
  const rows = new Map<string, DailyActivityRow>();

  usageRecords.forEach((record) => {
    const date = toDateKey(record.date);
    rows.set(date, {
      date,
      calls: record.calls,
      interview: record.interview ?? record.calls,
      phoneCall: record.phoneCall ?? 0,
      coding: record.coding,
      scheduled: rows.get(date)?.scheduled ?? 0,
    });
  });

  scheduledItems.forEach((item) => {
    const date = toDateKey(getScheduledDate(item));
    const existing = rows.get(date);

    rows.set(date, {
      date,
      calls: existing?.calls ?? 0,
      interview: existing?.interview ?? 0,
      phoneCall: existing?.phoneCall ?? 0,
      coding: existing?.coding ?? 0,
      scheduled: (existing?.scheduled ?? 0) + 1,
    });
  });

  return Array.from(rows.values()).sort((a, b) => b.date.localeCompare(a.date));
}

function filterDailyActivityRows(rows: DailyActivityRow[], range: { start: string; end: string }) {
  return rows.filter((row) => {
    if (range.start && row.date < range.start) return false;
    if (range.end && row.date > range.end) return false;
    return true;
  });
}

function exportDailyActivityRows(rows: DailyActivityRow[], filename: string) {
  downloadExcel(
    filename,
    "Aria Usage History",
    ["Date", "Interview", "Phone Call", "Coding Sessions", "Scheduled Interviews"],
    rows.map((row) => [formatDate(row.date), row.interview, row.phoneCall, row.coding, row.scheduled]),
  );
}

function DateRangeSearch({
  value,
  onChange,
}: {
  value: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
}) {
  return (
    <div className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <label className="space-y-1.5 text-xs font-medium text-[#7182B6]">
        Start date
        <input
          type="date"
          value={value.start}
          onChange={(event) => onChange({ ...value, start: event.target.value })}
          className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#F05A28]"
        />
      </label>
      <label className="space-y-1.5 text-xs font-medium text-[#7182B6]">
        End date
        <input
          type="date"
          value={value.end}
          onChange={(event) => onChange({ ...value, end: event.target.value })}
          className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#F05A28]"
        />
      </label>
      <button
        type="button"
        onClick={() => onChange({ start: "", end: "" })}
        className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        Clear
      </button>
    </div>
  );
}

function DailyActivityTable({
  rows,
  loading,
  error,
  onRetry,
}: {
  rows: DailyActivityRow[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[#7182B6] text-left border-b border-[#F3E2DA]">
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Interview</th>
            <th className="pb-3 font-medium">Phone Call</th>
            <th className="pb-3 font-medium">Coding Sessions</th>
            <th className="pb-3 font-medium">Scheduled</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#FFF0E8]">
          {loading ? (
            [0, 1, 2].map((row) => (
              <tr key={row}>
                <td className="py-4" colSpan={5}>
                  <div className="h-5 animate-pulse rounded bg-slate-100" />
                </td>
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-[#7182B6]">
                <div className="flex flex-col items-center gap-3">
                  <span>{error ? "Usage data is unavailable right now." : "No usage activity found yet."}</span>
                  {error && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="h-10 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.date} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 text-[#7182B6]">{formatDate(row.date)}</td>
                <td className="py-4 font-medium text-[#111827]">{row.interview}</td>
                <td className="py-4 font-medium text-[#111827]">{row.phoneCall}</td>
                <td className="py-4 font-medium text-[#111827]">{row.coding}</td>
                <td className="py-4 font-medium text-[#111827]">{row.scheduled}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function UsageCard({
  icon: Icon,
  label,
  usage,
  color,
  note,
  loading,
  error,
}: {
  icon: React.ElementType;
  label: string;
  usage?: { used: number; limit: number };
  color: string;
  note?: string;
  loading?: boolean;
  error?: boolean;
}) {
  const pct = usage?.limit ? Math.min(Math.round((usage.used / usage.limit) * 100), 100) : null;
  const warn = pct !== null && pct >= 80;

  return (
    <div className="rounded-xl border border-[#F3E2DA] bg-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-[0_8px_20px_rgba(240,90,40,0.12)] ring-1 ring-[#F3E2DA]">
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        <span className="font-medium text-sm text-[#111827]">{label}</span>
      </div>
      {loading ? (
        <div className="space-y-3">
          <div className="h-8 w-20 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
          <div className="h-2 w-full animate-pulse rounded bg-slate-100" />
        </div>
      ) : error || !usage ? (
        <div>
          <div className="text-2xl font-bold mb-1 text-[#111827]">--</div>
          <div className="text-sm text-[#7182B6]">{note ?? "Usage data unavailable"}</div>
        </div>
      ) : (
        <>
          <div className="text-3xl font-bold mb-1 text-[#111827]">{usage.used.toLocaleString()}</div>
          <div className={`text-sm mb-3 ${warn ? "text-[#F05A28] font-medium" : "text-[#7182B6]"}`}>
            of {usage.limit} this period {warn && "— nearing limit"}
          </div>
          <div className="h-2 bg-[#FFF0E8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: warn ? "#F05A28" : color }}
            />
          </div>
          <div className="text-xs text-[#7182B6] mt-2">{pct}% used</div>
        </>
      )}
    </div>
  );
}

export function Usage() {
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
  const [usageRecords, setUsageRecords] = useState<DailyUsageRecord[]>([]);
  const [scheduledItems, setScheduledItems] = useState<ScheduledInterview[]>([]);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyError, setDailyError] = useState(false);
  const [dateSearchOpen, setDateSearchOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const loadDailyActivity = async () => {
    setDailyLoading(true);
    setDailyError(false);

    try {
      const [summary, records, schedules] = await Promise.all([
        getUsageSummary(),
        getDailyUsageRecords(),
        getScheduledInterviews(),
      ]);

      setUsageSummary(summary);
      setUsageRecords(Array.isArray(records) ? records : []);
      setScheduledItems(Array.isArray(schedules) ? schedules : []);
    } catch {
      setUsageSummary(null);
      setUsageRecords([]);
      setScheduledItems([]);
      setDailyError(true);
    } finally {
      setDailyLoading(false);
    }
  };

  useEffect(() => {
    void loadDailyActivity();
  }, []);

  const dailyActivityRows = useMemo(
    () => buildDailyActivityRows(usageRecords, scheduledItems),
    [scheduledItems, usageRecords],
  );
  const filteredDailyActivityRows = useMemo(
    () => filterDailyActivityRows(dailyActivityRows, dateRange),
    [dailyActivityRows, dateRange],
  );

  const handleExport = () => {
    exportDailyActivityRows(filteredDailyActivityRows, "aria-usage-history.xls");
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Usage</h1>
          <p className="text-[#7182B6] text-sm mt-2">
            {usageSummary ? `${usageSummary.planName} Plan · ${usageSummary.billingPeriod}` : "Usage data unavailable"}
          </p>
        </div>
      </div>

      {/* Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <UsageCard
          icon={Mic}
          label="Interview Calls"
          usage={usageSummary?.calls}
          color="#F05A28"
          loading={dailyLoading}
          error={dailyError}
        />
        <UsageCard
          icon={Code2}
          label="Live Coding Sessions"
          usage={usageSummary?.coding}
          color="#0EA5E9"
          loading={dailyLoading}
          error={dailyError}
        />
      </div>

      {/* Daily History */}
      <div className="rounded-xl border border-[#F3E2DA] bg-white p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Daily Activity</h2>
            <p className="mt-1 text-xs text-[#7182B6]">All daily usage records from purchase date to today.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDateSearchOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
              aria-label="Search usage by date range"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
              aria-label="Export usage table"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setTableModalOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
              aria-label="Expand usage table"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {dateSearchOpen && (
          <div className="mb-5">
            <DateRangeSearch value={dateRange} onChange={setDateRange} />
          </div>
        )}

        <DailyActivityTable rows={filteredDailyActivityRows} loading={dailyLoading} error={dailyError} onRetry={loadDailyActivity} />
        {filteredDailyActivityRows.length > 0 && (
          <p className="text-xs text-[#7182B6] mt-4">
            {/* TODO [SUPABASE:DB]: paginate daily records and scheduled aggregates from backend */}
            Showing {filteredDailyActivityRows.length} daily rows
          </p>
        )}
      </div>

      {tableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="flex max-h-[86vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Daily Activity</h2>
                <p className="mt-1 text-sm text-[#7182B6]">Showing {filteredDailyActivityRows.length} daily rows.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
                  aria-label="Export usage table"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
                  aria-label="Close usage table"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-5 overflow-auto p-6">
              <DateRangeSearch value={dateRange} onChange={setDateRange} />
              <DailyActivityTable rows={filteredDailyActivityRows} loading={dailyLoading} error={dailyError} onRetry={loadDailyActivity} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
