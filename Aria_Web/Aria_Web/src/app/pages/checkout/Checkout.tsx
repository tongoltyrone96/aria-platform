import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Check, CreditCard, ExternalLink, ShieldCheck } from "lucide-react";
import AnimatedLogo from "../../components/AnimatedLogo";

const checkoutPlans = {
  pro: {
    id: "pro",
    name: "Pro",
    price: "$19.99",
    period: "per month",
    features: [
      "Multiple users can share one account simultaneously",
      "70 interview calls / month",
      "Unlimited AI answers per call",
      "50 live coding sessions / month",
      "Premium WASAPI audio capture",
      "State-of-the-art AI models",
      "Advanced AI overlay",
      "Multi-user simultaneous access",
      "STAR-method coaching mode",
      "Priority support",
    ],
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: "$29.99",
    period: "per month",
    features: [
      "Multiple users can share one account simultaneously",
      "150 interview calls / month",
      "Unlimited AI answers per call",
      "100 live coding sessions / month",
      "Premium WASAPI audio capture",
      "State-of-the-art AI models",
      "Advanced AI overlay",
      "Multi-user simultaneous access",
      "STAR-method coaching mode",
      "Code-question deep analysis",
      "Early access to new features",
      "Dedicated support",
    ],
  },
};

type PaidPlanId = keyof typeof checkoutPlans;

function isPaidPlan(plan: string | null): plan is PaidPlanId {
  return plan === "pro" || plan === "elite";
}

export function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const planId = searchParams.get("plan");
  const plan = useMemo(() => (isPaidPlan(planId) ? checkoutPlans[planId] : null), [planId]);

  const startStripeCheckout = async () => {
    if (!plan) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          successUrl: `${window.location.origin}/checkout/success?plan=${plan.id}`,
          cancelUrl: `${window.location.origin}/checkout/cancel?plan=${plan.id}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Stripe Checkout endpoint is not configured.");
      }

      const data = (await response.json()) as { url?: string };
      if (!data.url) {
        throw new Error("Stripe Checkout did not return a redirect URL.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start Stripe Checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <CheckoutShell>
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#111827]">Choose a paid plan</h1>
          <p className="mt-2 text-sm text-[#7182B6]">Stripe Checkout is used for Pro and Elite subscriptions.</p>
          <Link
            to="/#pricing"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0A0A0A] px-5 text-sm font-semibold text-white hover:bg-[#F05A28]"
          >
            View Plans
          </Link>
        </div>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell>
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_380px]">
        <div className="p-8 lg:p-10">
          <Link to="/signup" className="inline-flex items-center gap-2 text-sm font-medium text-[#7182B6] hover:text-[#F05A28]">
            <ArrowLeft className="h-4 w-4" />
            Back to signup
          </Link>

          <div className="mt-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                <CreditCard className="h-6 w-6 text-[#F05A28]" />
              </div>
              <h1 className="text-3xl font-bold text-[#111827]">Continue with Stripe Checkout</h1>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#7182B6]">
              Aria does not collect card details on this page. Stripe handles card entry, billing details, invoices,
              subscription renewal, and payment security.
            </p>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-[#111827] sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <span>Payment details are entered on Stripe's hosted checkout page.</span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <span>After payment, the subscription should be activated by your Stripe webhook.</span>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {error} Add a server endpoint that creates a Stripe Checkout Session and returns <code className="font-mono">url</code>.
            </div>
          )}

          <button
            type="button"
            onClick={startStripeCheckout}
            disabled={loading}
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F05A28] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#D94E22] disabled:opacity-60"
          >
            {loading ? "Opening Stripe..." : "Continue to Stripe"}
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50 p-8 lg:border-l lg:border-t-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#F05A28]">Selected Plan</div>
          <h2 className="mt-3 text-2xl font-bold text-[#111827]">{plan.name}</h2>
          <div className="mt-2 text-3xl font-bold text-[#111827]">
            {plan.price}
            <span className="text-sm font-normal text-[#7182B6]"> / {plan.period}</span>
          </div>
          <ul className="mt-6 max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-[#7182B6]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </CheckoutShell>
  );
}

export function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get("plan") || "pro";

  const goToDashboard = () => {
    navigate("/dashboard/billing");
  };

  return (
    <CheckoutShell>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#111827]">Payment received</h1>
        <p className="mt-2 text-sm text-[#7182B6]">
          Stripe returned successfully for the {plan} plan. Your subscription must be confirmed by the server before
          paid features are activated.
        </p>
        <button
          type="button"
          onClick={goToDashboard}
          className="mt-6 h-11 rounded-xl bg-[#0A0A0A] px-5 text-sm font-semibold text-white hover:bg-[#F05A28]"
        >
          Go to Billing
        </button>
      </div>
    </CheckoutShell>
  );
}

export function CheckoutCancel() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "pro";

  return (
    <CheckoutShell>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-[#111827]">Checkout canceled</h1>
        <p className="mt-2 text-sm text-[#7182B6]">No payment was made. You can return to signup or choose another plan.</p>
        <div className="mt-6 flex gap-3">
          <Link
            to={`/signup?plan=${plan}`}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#111827] hover:border-[#F05A28] hover:text-[#F05A28]"
          >
            Back
          </Link>
          <Link
            to="/#pricing"
            className="flex-1 rounded-xl bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#F05A28]"
          >
            Plans
          </Link>
        </div>
      </div>
    </CheckoutShell>
  );
}

function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <header className="px-8 py-8">
        <Link to="/" className="inline-block">
          <AnimatedLogo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-10">{children}</main>
    </div>
  );
}
