import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Download,
  History,
  Maximize2,
  MessageCircle,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteInterviewSession,
  deleteScheduledInterview,
  getInterviewSessions,
  getScheduledInterviews,
} from "../../lib/interviews";
import { downloadExcel } from "../../lib/exportCsv";
import type {
  InterviewSession,
  ScheduledCompanyInterview,
  ScheduledGeneralInterview,
  ScheduledInterview,
} from "../../lib/interviews";

type ActiveTab = "scheduled" | "history";
type ScheduledFilter = "all" | "company" | "general";

function formatDateTime(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return { date: "Invalid date", time: "" };
  }

  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;

  if (minutes < 60) {
    return `${minutes}m ${remaining}s`;
  }

  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function scheduledTitle(item: ScheduledInterview) {
  if (item.type === "company") {
    return item.companyName ? `${item.companyName} - ${item.jobTitle}` : item.jobTitle;
  }

  return `Conversation with ${item.partnerName}`;
}

function scheduledTime(item: ScheduledInterview) {
  return item.scheduledAt ?? item.savedAt;
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#7182B6]">{body}</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#111827]">Interview data is unavailable right now</h3>
          <p className="mt-1 text-sm leading-6 text-[#7182B6]">
            Scheduled interviews and completed sessions could not be loaded. Please try again later.
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  );
}

function ScheduledCard({
  item,
  onDelete,
}: {
  item: ScheduledInterview;
  onDelete: (id: string) => void;
}) {
  const isCompany = item.type === "company";
  const dateTime = formatDateTime(scheduledTime(item));
  const detail = isCompany
    ? `${(item as ScheduledCompanyInterview).interviewType} interview`
    : (item as ScheduledGeneralInterview).style;
  const Icon = isCompany ? Briefcase : MessageCircle;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-[#111827]">{scheduledTitle(item)}</h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {isCompany ? "Company" : "General"}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#7182B6]">{detail}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#7182B6]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" />
                {dateTime.date} {dateTime.time && `at ${dateTime.time}`}
              </span>
              <span>{item.language}</span>
              {isCompany ? (
                <span>{(item as ScheduledCompanyInterview).responseStyle}</span>
              ) : (
                <span>{(item as ScheduledGeneralInterview).focusArea}</span>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
          aria-label="Cancel scheduled interview"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SessionCard({
  session,
  onSelect,
  onDelete,
}: {
  session: InterviewSession;
  onSelect: (session: InterviewSession) => void;
  onDelete: (id: string) => void;
}) {
  const dateTime = formatDateTime(session.date);
  const preview = session.messages.find((message) => message.role === "interviewer")?.text ?? "No transcript preview available.";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <button type="button" onClick={() => onSelect(session)} className="min-w-0 flex-1 rounded-xl text-left transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="truncate text-sm font-semibold text-[#111827]">{session.title}</h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDuration(session.duration)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#7182B6]">
            {dateTime.date} {dateTime.time && `at ${dateTime.time}`}
          </p>
          <p className="mt-3 truncate text-sm text-slate-600">{preview}</p>
        </button>
        <button
          type="button"
          onClick={() => onDelete(session.id)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-700"
          aria-label="Delete interview session"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Interviews() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("scheduled");
  const [scheduledFilter, setScheduledFilter] = useState<ScheduledFilter>("all");
  const [scheduled, setScheduled] = useState<ScheduledInterview[]>([]);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [titleSearch, setTitleSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);

    try {
      const [scheduledItems, sessionItems] = await Promise.all([
        getScheduledInterviews(),
        getInterviewSessions(),
      ]);

      setScheduled(Array.isArray(scheduledItems) ? scheduledItems : []);
      setSessions(Array.isArray(sessionItems) ? sessionItems : []);
    } catch {
      setScheduled([]);
      setSessions([]);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const currentScheduled = useMemo(
    () => scheduled.filter((item) => {
      const scheduleDate = item.scheduledAt ? new Date(item.scheduledAt) : null;

      if (scheduleDate && !Number.isNaN(scheduleDate.getTime())) {
        return scheduleDate.getTime() >= Date.now();
      }

      return true;
    }),
    [scheduled],
  );

  const filteredScheduled = useMemo(() => {
    const query = titleSearch.trim().toLowerCase();

    return currentScheduled.filter((item) => {
      if (scheduledFilter !== "all" && item.type !== scheduledFilter) return false;
      if (query && !scheduledTitle(item).toLowerCase().includes(query)) return false;

      const date = scheduledTime(item).slice(0, 10);
      if (dateRange.start && date < dateRange.start) return false;
      if (dateRange.end && date > dateRange.end) return false;

      return true;
    });
  }, [currentScheduled, dateRange.end, dateRange.start, scheduledFilter, titleSearch]);

  const filteredSessions = useMemo(() => {
    const query = titleSearch.trim().toLowerCase();

    return sessions.filter((session) => {
      if (query && !session.title.toLowerCase().includes(query)) return false;

      const date = session.date.slice(0, 10);
      if (dateRange.start && date < dateRange.start) return false;
      if (dateRange.end && date > dateRange.end) return false;

      return true;
    });
  }, [dateRange.end, dateRange.start, sessions, titleSearch]);

  const totalDuration = sessions.reduce((sum, session) => sum + Math.max(0, session.duration), 0);

  const handleDeleteScheduled = async (id: string) => {
    const previous = scheduled;
    setScheduled((items) => items.filter((item) => item.id !== id));

    try {
      await deleteScheduledInterview(id);
    } catch {
      setScheduled(previous);
      setHasError(true);
    }
  };

  const handleDeleteSession = async (id: string) => {
    const previous = sessions;
    setSessions((items) => items.filter((item) => item.id !== id));
    if (selectedSession?.id === id) setSelectedSession(null);

    try {
      await deleteInterviewSession(id);
    } catch {
      setSessions(previous);
      setHasError(true);
    }
  };

  const clearSearch = () => {
    setTitleSearch("");
    setDateRange({ start: "", end: "" });
  };

  const handleExport = () => {
    if (activeTab === "scheduled") {
      downloadExcel(
        "aria-scheduled-interviews.xls",
        "Aria Scheduled Interviews",
        ["Title", "Type", "Date", "Language", "Details"],
        filteredScheduled.map((item) => {
          const dateTime = formatDateTime(scheduledTime(item));
          const isCompany = item.type === "company";

          return [
            scheduledTitle(item),
            isCompany ? "Company" : "General",
            `${dateTime.date}${dateTime.time ? ` at ${dateTime.time}` : ""}`,
            item.language,
            isCompany
              ? (item as ScheduledCompanyInterview).interviewType
              : (item as ScheduledGeneralInterview).topic,
          ];
        }),
      );
      return;
    }

    downloadExcel(
      "aria-interview-history.xls",
      "Aria Interview History",
      ["Title", "Date", "Duration", "Preview"],
      filteredSessions.map((session) => {
        const dateTime = formatDateTime(session.date);
        const preview = session.messages.find((message) => message.role === "interviewer")?.text ?? "";

        return [
          session.title,
          `${dateTime.date}${dateTime.time ? ` at ${dateTime.time}` : ""}`,
          formatDuration(session.duration),
          preview,
        ];
      }),
    );
  };

  if (selectedSession) {
    const dateTime = formatDateTime(selectedSession.date);

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedSession(null)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to interviews
        </button>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h1 className="text-xl font-semibold tracking-tight text-[#111827]">{selectedSession.title}</h1>
            <p className="mt-2 text-sm text-[#7182B6]">
              {dateTime.date} {dateTime.time && `at ${dateTime.time}`} · {formatDuration(selectedSession.duration)}
            </p>
          </div>
          <div className="space-y-4 p-6">
            {selectedSession.messages.length === 0 ? (
              <EmptyState
                icon={History}
                title="No transcript available"
                body="This session exists, but no conversation messages were stored for it."
              />
            ) : (
              selectedSession.messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl rounded-xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-slate-50 text-[#111827]"
                    }`}
                  >
                    <div className={`mb-1 text-xs font-semibold uppercase ${message.role === "user" ? "text-slate-300" : "text-slate-500"}`}>
                      {message.role === "user" ? "You" : "Interviewer"}
                    </div>
                    <p className="text-sm leading-6">{message.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Interviews</h1>
          <p className="mt-2 text-sm text-[#7182B6]">Manage upcoming interviews and review completed sessions.</p>
        </div>
      </div>

      <div className="grid rounded-xl border border-slate-200 bg-white md:grid-cols-3">
        <div className="border-b border-slate-200 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#7182B6]">Scheduled</p>
              <div className="mt-2 text-3xl font-semibold text-[#111827]">{currentScheduled.length}</div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#F05A28] shadow-[0_8px_20px_rgba(240,90,40,0.12)] ring-1 ring-[#F3E2DA]">
              <CalendarClock className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="border-b border-slate-200 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#7182B6]">Completed</p>
              <div className="mt-2 text-3xl font-semibold text-[#111827]">{sessions.length}</div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#F05A28] shadow-[0_8px_20px_rgba(240,90,40,0.12)] ring-1 ring-[#F3E2DA]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="border-b border-slate-200 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#7182B6]">Interview Time</p>
              <div className="mt-2 text-3xl font-semibold text-[#111827]">{formatDuration(totalDuration)}</div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#F05A28] shadow-[0_8px_20px_rgba(240,90,40,0.12)] ring-1 ring-[#F3E2DA]">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-slate-100 p-1 shadow-inner shadow-slate-900/5">
          {[
            { id: "scheduled", label: "Scheduled" },
            { id: "history", label: "History" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                activeTab === tab.id ? "bg-slate-900 text-white shadow-sm" : "bg-transparent text-[#7182B6] hover:bg-white hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === "scheduled" && (
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              {[
                { id: "all", label: "All" },
                { id: "company", label: "Company" },
                { id: "general", label: "General" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setScheduledFilter(filter.id as ScheduledFilter)}
                  className={`h-8 rounded-full px-3 text-xs font-semibold transition-colors ${
                    scheduledFilter === filter.id ? "bg-slate-900 text-white shadow-sm" : "bg-transparent text-[#7182B6] hover:bg-slate-50 hover:text-[#111827]"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
            aria-label="Search interviews"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setTableModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
            aria-label="Expand interviews table"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
            aria-label="Export interviews table"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
          <label className="space-y-1.5 text-xs font-medium text-[#7182B6]">
            Title
            <input
              type="text"
              value={titleSearch}
              onChange={(event) => setTitleSearch(event.target.value)}
              placeholder={activeTab === "scheduled" ? "Search scheduled title" : "Search session title"}
              className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#F05A28]"
            />
          </label>
          <label className="space-y-1.5 text-xs font-medium text-[#7182B6]">
            Start date
            <input
              type="date"
              value={dateRange.start}
              onChange={(event) => setDateRange((range) => ({ ...range, start: event.target.value }))}
              className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#F05A28]"
            />
          </label>
          <label className="space-y-1.5 text-xs font-medium text-[#7182B6]">
            End date
            <input
              type="date"
              value={dateRange.end}
              onChange={(event) => setDateRange((range) => ({ ...range, end: event.target.value }))}
              className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#F05A28]"
            />
          </label>
          <button
            type="button"
            onClick={clearSearch}
            className="h-10 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Clear
          </button>
        </div>
      )}

      {hasError && <ErrorState onRetry={loadData} />}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
          ))}
        </div>
      ) : activeTab === "scheduled" ? (
        filteredScheduled.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No scheduled interviews"
            body="Scheduled interviews will appear here after the desktop app saves them to the shared backend."
          />
        ) : (
          <div className="space-y-3">
            {filteredScheduled.map((item) => (
              <ScheduledCard key={item.id} item={item} onDelete={handleDeleteScheduled} />
            ))}
          </div>
        )
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={History}
          title={sessions.length === 0 ? "No completed sessions" : "No matching sessions"}
          body={
            sessions.length === 0
              ? "Completed desktop interviews will appear here after sessions are saved to the backend."
              : "Try another search term."
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onSelect={setSelectedSession}
              onDelete={handleDeleteSession}
            />
          ))}
        </div>
      )}

      {tableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="flex max-h-[86vh] w-full max-w-6xl flex-col rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  {activeTab === "scheduled" ? "Scheduled Interviews" : "Interview History"}
                </h2>
                <p className="mt-1 text-sm text-[#7182B6]">
                  Showing {activeTab === "scheduled" ? filteredScheduled.length : filteredSessions.length} records.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
                  aria-label="Export interviews table"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
                  aria-label="Close interviews table"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-5 overflow-auto p-6">
              <div className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
                <label className="space-y-1.5 text-xs font-medium text-[#7182B6]">
                  Title
                  <input
                    type="text"
                    value={titleSearch}
                    onChange={(event) => setTitleSearch(event.target.value)}
                    placeholder={activeTab === "scheduled" ? "Search scheduled title" : "Search session title"}
                    className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#F05A28]"
                  />
                </label>
                <label className="space-y-1.5 text-xs font-medium text-[#7182B6]">
                  Start date
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(event) => setDateRange((range) => ({ ...range, start: event.target.value }))}
                    className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#F05A28]"
                  />
                </label>
                <label className="space-y-1.5 text-xs font-medium text-[#7182B6]">
                  End date
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(event) => setDateRange((range) => ({ ...range, end: event.target.value }))}
                    className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#F05A28]"
                  />
                </label>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="h-10 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  Clear
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    {activeTab === "scheduled" ? (
                      <tr className="border-b border-slate-200 text-left text-xs text-[#7182B6]">
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Language</th>
                        <th className="pb-3 font-medium">Details</th>
                      </tr>
                    ) : (
                      <tr className="border-b border-slate-200 text-left text-xs text-[#7182B6]">
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Duration</th>
                        <th className="pb-3 font-medium">Preview</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === "scheduled" ? (
                      filteredScheduled.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-sm text-[#7182B6]">No scheduled interviews found.</td>
                        </tr>
                      ) : (
                        filteredScheduled.map((item) => {
                          const dateTime = formatDateTime(scheduledTime(item));
                          const isCompany = item.type === "company";

                          return (
                            <tr key={item.id} className="text-[#111827]">
                              <td className="py-4 font-medium">{scheduledTitle(item)}</td>
                              <td className="py-4 text-[#7182B6]">{isCompany ? "Company" : "General"}</td>
                              <td className="py-4 text-[#7182B6]">{dateTime.date} {dateTime.time && `at ${dateTime.time}`}</td>
                              <td className="py-4 text-[#7182B6]">{item.language}</td>
                              <td className="py-4 text-[#7182B6]">
                                {isCompany
                                  ? (item as ScheduledCompanyInterview).interviewType
                                  : (item as ScheduledGeneralInterview).topic}
                              </td>
                            </tr>
                          );
                        })
                      )
                    ) : filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-sm text-[#7182B6]">No completed sessions found.</td>
                      </tr>
                    ) : (
                      filteredSessions.map((session) => {
                        const dateTime = formatDateTime(session.date);
                        const preview = session.messages.find((message) => message.role === "interviewer")?.text ?? "";

                        return (
                          <tr key={session.id} className="text-[#111827]">
                            <td className="py-4 font-medium">{session.title}</td>
                            <td className="py-4 text-[#7182B6]">{dateTime.date} {dateTime.time && `at ${dateTime.time}`}</td>
                            <td className="py-4 text-[#7182B6]">{formatDuration(session.duration)}</td>
                            <td className="max-w-md truncate py-4 text-[#7182B6]">{preview}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
