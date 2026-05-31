import { useEffect, useRef, useState } from "react";
import {
  BarChart2,
  CalendarClock,
  ChevronDown,
  CreditCard,
  FileText,
  KeyRound,
  Mail,
  Monitor,
  Paperclip,
  Send,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";
import { createSupportTicket } from "../../lib/support";

const issueTypes = [
  "Account access",
  "Billing or payment",
  "Desktop app activation",
  "Interview session",
  "Usage or limits",
  "Technical issue",
  "Other",
];

type HelpItem = {
  title: string;
  text: string;
};

type HelpSection = {
  title: string;
  body: string;
  items: HelpItem[];
};

const helpSections: HelpSection[] = [
  {
    title: "Account And Access",
    body: "Use this section when you cannot sign in, need to update account details, or need to confirm which account is connected to your desktop app.",
    items: [
      {
        title: "Sign-in issues",
        text: "Confirm that you are using the same email used during signup. If social sign-in was used, continue with that provider instead of password login.",
      },
      {
        title: "Profile changes",
        text: "Name and email changes should be handled from Settings after backend account endpoints are enabled. Email changes may require verification.",
      },
      {
        title: "Account deletion",
        text: "Account deletion is permanent and must revoke token access, desktop app access, and active subscription handling on the backend.",
      },
    ],
  },
  {
    title: "Desktop App Activation",
    body: "The desktop app should be connected to your web account through a token key. Activation problems usually come from an expired, copied incorrectly, or account-mismatched key.",
    items: [
      {
        title: "Where to find the token key",
        text: "Open Overview and copy the Token Key. Paste it into the desktop app activation screen without extra spaces.",
      },
      {
        title: "When activation fails",
        text: "Use Help Centre to submit a ticket with the device name, the time of activation, and the exact error message shown by the desktop app.",
      },
      {
        title: "Device access",
        text: "Token and license validation must be enforced server-side so unauthorized devices cannot access paid features.",
      },
    ],
  },
  {
    title: "Interviews And Schedules",
    body: "Interview records shown in the dashboard should come from the same backend records used by the desktop app.",
    items: [
      {
        title: "Scheduled interviews",
        text: "The Interviews page shows currently scheduled, not-yet-started interviews. Past or canceled schedules should not be counted as current scheduled items.",
      },
      {
        title: "Completed sessions",
        text: "Completed interviews appear in History after the desktop app saves the session title, date, duration, and transcript messages.",
      },
      {
        title: "Missing records",
        text: "If a session is missing, include the interview title, date, and whether it was a company or general interview in your ticket.",
      },
    ],
  },
  {
    title: "Usage And Plan Limits",
    body: "Usage numbers should reflect actual backend records and active plan entitlements, not frontend estimates.",
    items: [
      {
        title: "Interview calls",
        text: "Interview and phone-call counts should be calculated from completed billable sessions in the current billing period.",
      },
      {
        title: "Coding sessions",
        text: "Coding Session usage should be counted separately from interview calls and compared against the active plan limit.",
      },
      {
        title: "Usage disputes",
        text: "If usage looks wrong, submit the date range and the session names that appear incorrect.",
      },
    ],
  },
  {
    title: "Billing And Receipts",
    body: "Billing changes and payment method updates should be handled through Stripe-hosted flows, while this dashboard shows trusted summaries from the backend.",
    items: [
      {
        title: "Change plan",
        text: "Use Billing to change plans. Paid plan changes should open Stripe Customer Portal or Checkout depending on the backend flow.",
      },
      {
        title: "Payment method",
        text: "The dashboard may show payment method summaries such as card type or crypto method, but card entry and updates must stay inside Stripe.",
      },
      {
        title: "Receipts",
        text: "Receipt rows should come from Stripe or the backend billing ledger. Clicking the PDF icon should open a hosted receipt or backend-secured document.",
      },
    ],
  },
  {
    title: "Submitting A Ticket",
    body: "A good Help Centre ticket gives the team enough context to reproduce or verify the issue without unnecessary back-and-forth.",
    items: [
      {
        title: "What to include",
        text: "Choose the issue type, write a short subject, describe the steps, include relevant dates or session titles, and attach a screenshot when useful.",
      },
      {
        title: "After submission",
        text: "After the backend creates the ticket, the user should receive an automatic confirmation email and a support manager should be notified.",
      },
      {
        title: "Private information",
        text: "Do not include passwords, full card numbers, or secret keys in a ticket. The team should request sensitive verification through secure flows only.",
      },
    ],
  },
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getHelpIcon(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("account")) return UserRound;
  if (normalized.includes("desktop")) return Monitor;
  if (normalized.includes("interview")) return CalendarClock;
  if (normalized.includes("usage")) return BarChart2;
  if (normalized.includes("billing")) return CreditCard;
  if (normalized.includes("ticket")) return Ticket;
  if (normalized.includes("token")) return KeyRound;
  if (normalized.includes("security")) return ShieldCheck;

  return FileText;
}

export function Support() {
  const [issueTypeOpen, setIssueTypeOpen] = useState(false);
  const issueTypeRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState({
    issueType: issueTypes[0],
    subject: "",
    description: "",
    attachment: null as File | null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);

    try {
      await createSupportTicket(form);
      setSubmitted(true);
      setForm({ issueType: issueTypes[0], subject: "", description: "", attachment: null });
    } catch {
      setSubmitError("Ticket could not be submitted right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!issueTypeOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!issueTypeRef.current?.contains(event.target as Node)) {
        setIssueTypeOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIssueTypeOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [issueTypeOpen]);

  return (
    <div className="max-w-6xl space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Help Centre</h1>
        <p className="text-[#7182B6] text-sm mt-2">Find account, app, usage, and billing guidance. Use Help Centre tickets when you need direct assistance.</p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-8 rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-[#111827]">Help Topics</div>
            <nav className="mt-4 space-y-1.5">
              {helpSections.map((section) => {
                const Icon = getHelpIcon(section.title);
                const sectionId = slugify(section.title);

                return (
                  <button
                    key={section.title}
                    type="button"
                    onClick={() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[#7182B6] transition-colors hover:bg-slate-100 hover:text-[#111827]"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-7">
          <div className="mb-7">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#7182B6]">Help Centre Guide</div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#111827]">Before You Submit A Ticket</h2>
            <p className="mt-2 text-sm leading-6 text-[#7182B6]">
              These sections explain what the dashboard should show, where each record comes from, and what information to include in a Help Centre ticket.
            </p>
          </div>

          <div className="space-y-9">
            {helpSections.map((section, index) => {
              const Icon = getHelpIcon(section.title);

              return (
                <section
                  key={section.title}
                  id={slugify(section.title)}
                  className="scroll-mt-24 border-t border-slate-100 pt-7 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#F05A28] shadow-[0_8px_20px_rgba(240,90,40,0.12)] ring-1 ring-slate-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#111827]">{section.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#7182B6]">{section.body}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {section.items.map((item) => (
                      <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <h4 className="text-sm font-semibold text-[#111827]">{item.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-[#7182B6]">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  {index === helpSections.length - 1 && (
                    <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-[#7182B6]">
                      For urgent account or billing issues, use the ticket form below and choose the closest matching issue type.
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </article>
      </div>

      {/* Submit Ticket */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">Submit a Ticket</h2>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-green-500" />
            </div>
            <div className="font-medium">Ticket submitted</div>
            <p className="text-sm text-muted-foreground mt-1">
              A confirmation email has been sent. A support manager will contact you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">What do you need help with?</label>
              <div ref={issueTypeRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIssueTypeOpen((open) => !open)}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-medium text-[#111827] transition-colors hover:border-slate-300 focus:border-[#F05A28] focus:outline-none"
                  aria-expanded={issueTypeOpen}
                >
                  {form.issueType}
                  <ChevronDown className={`h-4 w-4 text-[#7182B6] transition-transform ${issueTypeOpen ? "rotate-180" : ""}`} />
                </button>
                {issueTypeOpen && (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10">
                    {issueTypes.map((issueType) => {
                      const selected = form.issueType === issueType;

                      return (
                        <button
                          key={issueType}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, issueType });
                            setIssueTypeOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            selected
                              ? "bg-slate-900 font-semibold text-white"
                              : "text-[#111827] hover:bg-slate-100"
                          }`}
                        >
                          {issueType}
                          {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">Subject</label>
              <input
                type="text"
                required
                placeholder="Briefly describe your issue"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#111827] transition-colors focus:border-[#F05A28] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">Description</label>
              <textarea
                required
                rows={6}
                placeholder="Add the steps, error message, device, and what you expected to happen."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#111827] transition-colors focus:border-[#F05A28] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">Attachment</label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-[#7182B6] transition-colors hover:border-slate-400 hover:bg-white">
                <span className="flex min-w-0 items-center gap-2">
                  <Paperclip className="h-4 w-4 shrink-0" />
                  <span className="truncate">{form.attachment ? form.attachment.name : "Attach a screenshot or document"}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-[#111827]">Choose file</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setForm({ ...form, attachment: e.target.files?.[0] ?? null })}
                />
              </label>
            </div>
            {submitError && <p className="text-sm font-medium text-red-500">{submitError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Submit Ticket"}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
