import { useEffect, useState } from "react";
import { Check, CreditCard, FileText, X } from "lucide-react";
import { createBillingPortalSession, getBillingOverview } from "../../lib/billing";
import type { BillingReceipt, BillingSubscription } from "../../lib/billing";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["10 calls / month", "6 AI answers per call", "1 coding session / month"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19.99",
    period: "per month",
    features: ["70 calls / month", "Unlimited AI answers", "50 coding sessions / month"],
  },
  {
    id: "elite",
    name: "Elite",
    price: "$29.99",
    period: "per month",
    features: ["150 calls / month", "Unlimited AI answers", "100 coding sessions / month"],
  },
];

export function Billing() {
  const [selectedReceipt, setSelectedReceipt] = useState<BillingReceipt | null>(null);
  const [subscription, setSubscription] = useState<BillingSubscription | null>(null);
  const [receipts, setReceipts] = useState<BillingReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingError, setBillingError] = useState(false);
  const [portalError, setPortalError] = useState("");

  const loadBilling = async () => {
    setLoading(true);
    setBillingError(false);

    try {
      const overview = await getBillingOverview();
      setSubscription(overview.subscription);
      setReceipts(Array.isArray(overview.receipts) ? overview.receipts : []);
    } catch {
      setSubscription(null);
      setReceipts([]);
      setBillingError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBilling();
  }, []);

  const openBillingPortal = async () => {
    setPortalError("");

    try {
      const { url } = await createBillingPortalSession();
      window.location.href = url;
    } catch {
      setPortalError("Billing portal is unavailable right now.");
    }
  };

  const openReceipt = (receipt: BillingReceipt) => {
    // TODO [STRIPE]: open Stripe hosted_invoice_url or receipt URL for this row.
    if (receipt.hostedUrl) {
      window.open(receipt.hostedUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setSelectedReceipt(receipt);
  };

  const currentPlanName = subscription?.plan;
  const statusTone = (status: string) => {
    const normalized = status.toLowerCase();

    if (["paid", "active", "succeeded"].some((value) => normalized.includes(value))) {
      return "bg-green-50 text-green-600";
    }

    if (["pending", "processing"].some((value) => normalized.includes(value))) {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-red-50 text-red-600";
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Billing</h1>
        <p className="text-[#7182B6] text-sm mt-2">Manage your plan and payment details.</p>
      </div>

      {/* Payment Method */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="text-xs font-semibold text-[#7182B6] uppercase tracking-wide mb-3">Payment Method</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#F05A28]" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#111827]">
              {loading ? "Loading payment method..." : subscription?.paymentMethod?.label ?? "No payment method on file"}
            </div>
            <div className="text-xs text-[#7182B6]">
              {subscription?.paymentMethod?.type ?? "Payment method will appear after Stripe sync"}
            </div>
          </div>
        </div>
        {portalError && <p className="mt-3 text-sm text-red-500">{portalError}</p>}
        <button
          type="button"
          onClick={openBillingPortal}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          Update Card
        </button>
      </div>

      {/* Plan Options */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[#111827]">Plan Options</h2>
          <p className="mt-1 text-sm text-[#7182B6]">Compare plan limits and manage the active subscription.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border-2 p-5 transition-all ${
                plan.name === currentPlanName ? "border-slate-900 bg-slate-50" : "border-slate-200"
              }`}
            >
              {plan.name === currentPlanName && (
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex text-xs font-semibold bg-slate-900 text-white px-2 py-0.5 rounded-full">
                    Current
                  </span>
                  <span className="inline-flex text-xs font-semibold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                    Paid subscription
                  </span>
                </div>
              )}
              <div className="font-semibold text-[#111827]">{plan.name}</div>
              <div className="text-xl font-bold mt-1">
                {plan.price}{" "}
                <span className="text-xs font-normal text-[#7182B6]">/ {plan.period}</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#7182B6]">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.name === currentPlanName ? (
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-xs">
                    <span className="text-[#7182B6]">Billing period</span>
                    <span className="text-right font-medium text-[#111827]">{subscription?.billingPeriod ?? "Unavailable"}</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openBillingPortal}
                  className="mt-4 flex h-10 w-full items-center justify-center rounded-full bg-slate-900 px-4 text-center text-xs font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  Change Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">Billing History</h2>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((row) => (
              <div key={row} className="h-12 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : receipts.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#111827]">No receipts available</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#7182B6]">
              {billingError
                ? "Billing history is unavailable right now. Please try again later."
                : "Billing history will appear here after your first payment."}
            </p>
            {billingError && (
              <button
                type="button"
                onClick={loadBilling}
                className="mt-4 h-10 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#7182B6] text-left border-b border-slate-200">
                  <th className="pb-3 font-medium">No.</th>
                  <th className="pb-3 font-medium">Receipt No.</th>
                  <th className="pb-3 font-medium">Payment Date</th>
                  <th className="pb-3 font-medium">Valid Until</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-center font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((inv, index) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-[#7182B6]">{index + 1}</td>
                    <td className="py-4 font-mono text-xs text-[#111827]">{inv.id}</td>
                    <td className="py-4 text-[#7182B6]">{inv.paymentDate}</td>
                    <td className="py-4 text-[#7182B6]">{inv.validUntil}</td>
                    <td className="py-4 font-medium text-[#111827]">{inv.amount}</td>
                    <td className="py-4 text-[#7182B6]">{inv.method}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusTone(inv.status)}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        type="button"
                        onClick={() => openReceipt(inv)}
                        className="receipt-icon-button inline-flex items-center justify-center text-red-600 transition-colors hover:text-red-700"
                        aria-label="Open receipt PDF"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Payment Receipt</h2>
                <p className="mt-1 text-sm text-[#7182B6]">{selectedReceipt.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
                aria-label="Close receipt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[#111827]">Aria Payment Receipt</div>
                    <div className="text-sm text-[#7182B6]">Paid subscription document</div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-sm">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[#7182B6]">Receipt No.</span>
                    <span className="font-medium text-[#111827]">{selectedReceipt.id}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[#7182B6]">Payment Date</span>
                    <span className="font-medium text-[#111827]">{selectedReceipt.paymentDate}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[#7182B6]">Valid Until</span>
                    <span className="font-medium text-[#111827]">{selectedReceipt.validUntil}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[#7182B6]">Plan</span>
                    <span className="font-medium text-[#111827]">{subscription?.plan ?? "Unavailable"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[#7182B6]">Amount</span>
                    <span className="font-medium text-[#111827]">{selectedReceipt.amount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[#7182B6]">Payment Method</span>
                    <span className="font-medium text-[#111827]">{selectedReceipt.method}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[#7182B6]">Status</span>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(selectedReceipt.status)}`}>
                      {selectedReceipt.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
