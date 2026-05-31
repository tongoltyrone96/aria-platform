import { ArrowUpRight, Calendar, Check, Code2, Copy, Download, KeyRound, Maximize2, Mic, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { downloadExcel } from "../../lib/exportCsv";

const mockData = {
  name: "John Smith",
  plan: "Pro",
  tokenKey: "ARIA-PRO-4X7K-9QW2-MNBV",
  renewal: "Jun 11, 2026",
  usage: {
    calls: { used: 42, limit: 70 },
    coding: { used: 27, limit: 50 },
  },
};

type UsageLog = {
  date: string;
  calls: number;
  coding: number;
};

type ActivityRow = {
  date: string;
  interview: number;
  phoneCall: number;
  coding: number;
  scheduled: number;
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function createTemporaryUsageLogs(today = new Date()): UsageLog[] {
  const logs: UsageLog[] = [];
  const year = today.getFullYear();

  for (let month = 0; month <= today.getMonth(); month++) {
    const maxDay = month === today.getMonth() ? today.getDate() : getDaysInMonth(year, month);

    for (let day = 1; day <= maxDay; day++) {
      const hasActivity = day % 2 === 0 || day % 5 === 0;
      if (!hasActivity) continue;

      logs.push({
        date: toDateKey(new Date(year, month, day)),
        calls: ((day + month) % 4) + 1,
        coding: (day + month) % 3,
      });
    }
  }

  return logs;
}

// TODO [SUPABASE:DB]: replace with usage_logs fetched for the current user.
const usageLogs = createTemporaryUsageLogs();

function createTemporaryActivityRows(today = new Date()): ActivityRow[] {
  const rows: ActivityRow[] = [];

  for (let offset = 0; offset < 45; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    const daySeed = date.getDate() + date.getMonth();
    const hasActivity = offset < 3 || daySeed % 2 === 0 || daySeed % 5 === 0;
    if (!hasActivity) continue;

    rows.push({
      date: toDateKey(date),
      interview: (daySeed % 3) + (offset % 6 === 0 ? 1 : 0),
      phoneCall: daySeed % 2,
      coding: daySeed % 4 === 0 ? 2 : daySeed % 3,
      scheduled: daySeed % 5 === 0 ? 2 : daySeed % 3 === 0 ? 1 : 0,
    });
  }

  return rows;
}

// TODO [SUPABASE:DB]: replace with daily activity aggregates from interview_sessions, usage_logs, and interview_schedules.
const activityRows = createTemporaryActivityRows();

function buildPolyline(values: number[], maxValue: number) {
  if (!values.length) return "";

  const width = 540;
  const height = 160;
  const usableHeight = 128;
  const topPadding = 16;
  const step = values.length === 1 ? 0 : width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = Math.round(index * step);
      const y = Math.round(topPadding + (1 - value / maxValue) * usableHeight);
      return `${x},${y}`;
    })
    .join(" ");
}

function buildAxisValues(maxValue: number) {
  return [1, 0.8, 0.6, 0.4, 0.2, 0].map((ratio) => Math.round(maxValue * ratio));
}

function sumLogs(logs: UsageLog[], predicate: (date: Date) => boolean) {
  return logs.reduce(
    (totals, log) => {
      const date = new Date(`${log.date}T00:00:00`);
      if (!predicate(date)) return totals;

      totals.calls += log.calls;
      totals.coding += log.coding;
      return totals;
    },
    { calls: 0, coding: 0 },
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between border-b border-[#F3E2DA] px-5 py-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div>
        <div className="text-2xl font-bold tracking-tight text-[#111827]">{value}</div>
        <div className="mt-1 text-sm font-medium text-[#111827]">{label}</div>
        <div className="mt-3 flex items-center gap-2 text-xs text-[#7182B6]">
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
          {trend}
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#F05A28] shadow-[0_8px_20px_rgba(240,90,40,0.12)] ring-1 ring-[#F3E2DA]">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function AnalyticsChart() {
  const [view, setView] = useState<"monthly" | "daily">("monthly");
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const availableMonthIndexes = MONTH_NAMES.map((_, index) => index).filter((month) => month <= today.getMonth());
  const monthlyCalls = MONTH_NAMES.map((_, month) => sumLogs(usageLogs, (date) => date.getFullYear() === currentYear && date.getMonth() === month).calls);
  const monthlyCoding = MONTH_NAMES.map((_, month) => sumLogs(usageLogs, (date) => date.getFullYear() === currentYear && date.getMonth() === month).coding);
  const daysInSelectedMonth = getDaysInMonth(currentYear, selectedMonth);
  const lastVisibleDay = selectedMonth === today.getMonth() ? today.getDate() : daysInSelectedMonth;
  const dailyLabels = Array.from({ length: lastVisibleDay }, (_, index) => String(index + 1));
  const dailyCalls = dailyLabels.map((day) =>
    sumLogs(
      usageLogs,
      (date) => date.getFullYear() === currentYear && date.getMonth() === selectedMonth && date.getDate() === Number(day),
    ).calls,
  );
  const dailyCoding = dailyLabels.map((day) =>
    sumLogs(
      usageLogs,
      (date) => date.getFullYear() === currentYear && date.getMonth() === selectedMonth && date.getDate() === Number(day),
    ).coding,
  );
  const activeLabels = view === "monthly" ? MONTH_NAMES : dailyLabels;
  const activeCalls = view === "monthly" ? monthlyCalls : dailyCalls;
  const activeCoding = view === "monthly" ? monthlyCoding : dailyCoding;
  const maxValue = Math.max(10, ...activeCalls, ...activeCoding);
  const axisValues = buildAxisValues(maxValue);
  const callsPolyline = buildPolyline(activeCalls, maxValue);
  const codingPolyline = buildPolyline(activeCoding, maxValue);
  const visibleAxisLabels =
    view === "monthly"
      ? activeLabels
      : dailyLabels.filter((label) => label === "1" || Number(label) % 5 === 0 || Number(label) === lastVisibleDay);

  return (
    <div className="rounded-xl border border-[#F3E2DA] bg-white p-4 md:p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <h2 className="text-lg font-semibold text-[#111827]">Usage Analytics</h2>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#7182B6]">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-700" />Calls</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#F05A28]" />Coding</span>
            <div className="flex flex-wrap gap-2">
              {(["monthly", "daily"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    view === option ? "bg-slate-900 text-white" : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          {view === "daily" && (
            <div className="flex flex-wrap gap-2">
              {availableMonthIndexes.map((monthIndex) => (
                <button
                  key={MONTH_NAMES[monthIndex]}
                  type="button"
                  onClick={() => setSelectedMonth(monthIndex)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selectedMonth === monthIndex
                      ? "bg-slate-900 text-white"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {MONTH_NAMES[monthIndex]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative h-[220px] overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-[#7182B6]">
          {axisValues.map((value) => (
            <div key={value} className="flex items-center gap-4">
              <span className="w-6">{value}</span>
              <span className="h-px flex-1 bg-[#F3E2DA]" />
            </div>
          ))}
        </div>
        <svg className="absolute left-10 right-0 top-2 h-[170px] w-[calc(100%-2.5rem)]" viewBox="0 0 540 160" preserveAspectRatio="none">
          <polyline points={callsPolyline} fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={codingPolyline} fill="none" stroke="#F05A28" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div
          className={`absolute bottom-0 left-10 right-0 grid text-center text-xs text-[#7182B6] ${
            view === "monthly" ? "grid-cols-12" : "grid-cols-7"
          }`}
        >
          {(view === "monthly" ? activeLabels : visibleAxisLabels).map((label) => <span key={label}>{label}</span>)}
        </div>
      </div>
    </div>
  );
}

function PlanRing() {
  // TODO [SUPABASE:DB]: compute these ratios from the authenticated user's plan limits and usage summary.
  // Example: Pro calls = used 42 / limit 70, coding = used 27 / limit 50.
  // Do not keep hard-coded percentages after backend integration.
  return (
    <div className="rounded-xl border border-[#F3E2DA] bg-white p-5">
      <h2 className="mb-5 text-lg font-semibold text-[#111827]">Plan Usage</h2>
      <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#334155_0_62%,#E2E8F0_62%_100%)]">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#F05A28_0_48%,#E2E8F0_48%_100%)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center">
            <div>
              <div className="text-2xl font-bold text-[#111827]">62%</div>
              <div className="text-xs text-[#7182B6]">used</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-4 text-xs text-[#7182B6]">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-700" />Calls</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#F05A28]" />Coding</span>
      </div>
    </div>
  );
}

function TokenKeyCard({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <div className="rounded-xl border border-[#F3E2DA] bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#111827]">Token Key</h2>
        <p className="mt-1 text-xs text-[#7182B6]">Use this key in the desktop app.</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#F05A28] shadow-sm ring-1 ring-slate-200">
          <KeyRound className="h-5 w-5" />
        </div>
        <code className="block break-all text-sm font-semibold tracking-wider text-[#111827]">{mockData.tokenKey}</code>
      </div>
      <button
        onClick={onCopy}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy Key"}
      </button>
    </div>
  );
}

function formatActivityDate(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ActivityTable({ rows }: { rows: ActivityRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#F3E2DA] text-left text-xs text-[#7182B6]">
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Interview</th>
            <th className="pb-3 font-medium">Phone Call</th>
            <th className="pb-3 font-medium">Coding Sessions</th>
            <th className="pb-3 font-medium">Scheduled</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#FFF0E8]">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-[#7182B6]">
                No activity found for this date range.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.date} className="text-[#111827]">
                <td className="py-4 text-[#7182B6]">{formatActivityDate(row.date)}</td>
                <td className="py-4 font-medium">{row.interview}</td>
                <td className="py-4 font-medium">{row.phoneCall}</td>
                <td className="py-4 font-medium">{row.coding}</td>
                <td className="py-4 font-medium">{row.scheduled}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Overview() {
  const [copied, setCopied] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockData.tokenKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMonthActivityRows = useMemo(() => {
    const today = new Date();
    return activityRows.filter((row) => {
      const date = new Date(`${row.date}T00:00:00`);
      return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
    });
  }, []);

  const visibleActivityRows = currentMonthActivityRows.slice(0, 3);

  const handleActivityExport = () => {
    downloadExcel(
      "aria-current-month-activity.xls",
      "Aria Current Month Activity",
      ["Date", "Interview Sessions", "Phone Calls", "Coding Sessions", "Scheduled Interviews"],
      currentMonthActivityRows.map((row) => [
        formatActivityDate(row.date),
        row.interview,
        row.phoneCall,
        row.coding,
        row.scheduled,
      ]),
    );
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Welcome Back, {mockData.name.split(" ")[0]}</h1>
        <p className="mt-2 text-sm text-[#7182B6]">Here is the information about your Aria account</p>
      </div>

      <div className="grid rounded-xl border border-[#F3E2DA] bg-white md:grid-cols-4">
        <MetricCard icon={Mic} value={`${mockData.usage.calls.used}/${mockData.usage.calls.limit}`} label="Interview calls" trend="+1.0% this week" />
        <MetricCard icon={Code2} value={`${mockData.usage.coding.used}/${mockData.usage.coding.limit}`} label="Coding sessions" trend="+0.4% this week" />
        <MetricCard icon={Sparkles} value={mockData.plan} label="Current plan" trend="Unlimited answers" />
        <MetricCard icon={Calendar} value={mockData.renewal} label="Next renewal" trend={`${mockData.plan} plan`} />
      </div>

      <div className="grid gap-7 lg:grid-cols-[360px_1fr]">
        <TokenKeyCard copied={copied} onCopy={handleCopy} />
        <AnalyticsChart />
      </div>

      <div className="grid gap-7 lg:grid-cols-[260px_1fr]">
        <PlanRing />
        <div className="rounded-xl border border-[#F3E2DA] bg-white p-5">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">Activity</h2>
              <p className="mt-1 text-xs text-[#7182B6]">Current month daily totals for interviews, phone calls, coding, and scheduled sessions.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleActivityExport}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
                aria-label="Export current month activity"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActivityModalOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
                aria-label="Expand activity table"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <ActivityTable rows={visibleActivityRows} />
        </div>
      </div>

      {activityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="flex max-h-[86vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Activity</h2>
                <p className="mt-1 text-sm text-[#7182B6]">Current month activity · {currentMonthActivityRows.length} daily rows.</p>
              </div>
              <button
                type="button"
                onClick={() => setActivityModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
                aria-label="Close activity table"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-5 overflow-auto p-6">
              <ActivityTable rows={currentMonthActivityRows} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
