import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Check, ArrowRight, ArrowLeft, Mic, Zap, Code2 } from "lucide-react";
import AnimatedLogo from "../../components/AnimatedLogo";
import { Progress } from "../../components/ui/progress";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// TODO [SUPABASE:AUTH]: import { supabase } from "@/lib/supabase"
// ─── Visual Panel ─────────────────────────────────────────────────────────────

export function VisualPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F05A28]">
      <img
        src="/Log-in.png"
        alt="Aria"
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}

// ─── Step 1: Personal Info ────────────────────────────────────────────────────

function StepOne({ formData, setFormData }: { formData: any; setFormData: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" placeholder="e.g. John"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" placeholder="e.g. Smith"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" placeholder="your@email.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })} />
      </div>
    </div>
  );
}

// ─── Step 2: Account Details ──────────────────────────────────────────────────

function StepTwo({ formData, setFormData }: { formData: any; setFormData: (d: any) => void }) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strong = formData.password.length >= 8;
  const match = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={showPw ? "text" : "password"}
            placeholder="Min. 8 characters" className="pr-10"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formData.password && (
          <p className={`text-xs ${strong ? "text-green-600" : "text-red-500"}`}>
            {strong ? "✓ Strong password" : "✗ At least 8 characters required"}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input id="confirmPassword" type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password" className="pr-10"
            value={formData.confirmPassword}
            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formData.confirmPassword && (
          <p className={`text-xs ${match ? "text-green-600" : "text-red-500"}`}>
            {match ? "✓ Passwords match" : "✗ Passwords do not match"}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 3: Plan Selection ───────────────────────────────────────────────────

const plans = [
  {
    id: "free", name: "Free", price: "$0", period: "forever",
    features: ["10 calls / month", "6 AI answers per call", "1 coding session / month"],
  },
  {
    id: "pro", name: "Pro", price: "$19.99", period: "per month", highlight: true,
    features: ["70 calls / month", "Unlimited AI answers", "50 coding sessions / month"],
  },
  {
    id: "elite", name: "Elite", price: "$29.99", period: "per month",
    features: ["150 calls / month", "Unlimited AI answers", "100 coding sessions / month"],
  },
];

function StepThree({ formData, setFormData }: { formData: any; setFormData: (d: any) => void }) {
  return (
    <div className="space-y-3">
      {plans.map(plan => {
        const selected = formData.plan === plan.id;
        return (
          <button key={plan.id} type="button" onClick={() => setFormData({ ...formData, plan: plan.id })}
            className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 ${
              selected ? "border-slate-700 bg-slate-50 shadow-sm" : "border-gray-200 hover:border-slate-300 hover:bg-slate-50"
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  selected ? "border-slate-700 bg-slate-700" : "border-gray-300"
                }`}>
                  {selected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{plan.name}</span>
                    {plan.highlight && (
                      <span className="text-[10px] font-bold bg-[#F05A28] text-white px-1.5 py-0.5 rounded-full">Popular</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{plan.features.join(" · ")}</div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div className="font-bold text-sm">{plan.price}</div>
                <div className="text-[11px] text-gray-400">/ {plan.period}</div>
              </div>
            </div>
          </button>
        );
      })}
      <div className="flex items-center gap-4 pt-1 text-xs text-gray-400">
        <span className="flex items-center gap-1"><Mic className="w-3 h-3" />Calls</span>
        <span className="flex items-center gap-1"><Zap className="w-3 h-3" />AI Answers</span>
        <span className="flex items-center gap-1"><Code2 className="w-3 h-3" />Coding</span>
      </div>
    </div>
  );
}

// ─── Signup Panel ─────────────────────────────────────────────────────────────

const steps = [
  { number: 1, title: "Personal Info",    description: "Tell us about yourself" },
  { number: 2, title: "Account Details",  description: "Secure your account" },
  { number: 3, title: "Choose Plan",      description: "Select your plan" },
];

function SignupPanel({
  currentStep,
  setCurrentStep,
  initialPlan,
}: {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  initialPlan: string;
}) {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "",
    plan: initialPlan,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError("Please fill in all fields."); return;
      }
    }
    if (currentStep === 2) {
      if (formData.password.length < 8) { setError("Password must be at least 8 characters."); return; }
      if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
    }
    setCurrentStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true); setError("");

    // TODO [SUPABASE:AUTH]: const { data, error } = await supabase.auth.signUp({
    //   email: formData.email, password: formData.password,
    //   options: { data: { name: `${formData.firstName} ${formData.lastName}` } }
    // })
    // TODO [SUPABASE:AUTH]: if (error) { setError(error.message); setLoading(false); return; }
    // TODO [SUPABASE:DB]: INSERT INTO profiles (user_id, name, plan) VALUES (data.user.id, fullName, formData.plan)
    // TODO [SUPABASE:DB]: INSERT INTO tokens (user_id, plan, token_key)

    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    // TODO [SUPABASE:AUTH]: replace with real session check
    localStorage.setItem("aria_authed", "1");
    localStorage.setItem("aria_plan", formData.plan);

    if (formData.plan === "free") {
      navigate("/dashboard");
    } else {
      navigate(`/checkout?plan=${formData.plan}`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) handleNext();
    else handleSubmit();
  };

  return (
    <form className="min-h-[520px] space-y-3" onSubmit={handleFormSubmit}>
      {/* Header */}
      <div className="text-center pt-3 pb-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
        <p className="text-gray-500 text-sm">{steps[currentStep - 1].description}</p>
      </div>

      {/* Step content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="min-h-[130px] space-y-5"
        >
          {currentStep === 1 && <StepOne formData={formData} setFormData={setFormData} />}
          {currentStep === 2 && <StepTwo formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <StepThree formData={formData} setFormData={setFormData} />}
        </motion.div>
      </AnimatePresence>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => { setError(""); setCurrentStep(s => s - 1); }}
          disabled={currentStep === 1}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        {currentStep < 3 ? (
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 text-sm"
          >
            {loading ? "Creating account…" : (
              <>{formData.plan === "free" ? "Create Free Account" : "Continue to Payment"}<ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>

      {/* Social — only step 1 */}
      {currentStep === 1 && (
        <>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>
          <div>
            <button type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {/* TODO [SUPABASE:AUTH]: supabase.auth.signInWithOAuth({ provider: 'google' }) */}
              <GoogleIcon /> Google
            </button>
          </div>
        </>
      )}

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/signin" className="text-[#F05A28] font-semibold hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function SignUp() {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const initialPlan = selectedPlan === "free" || selectedPlan === "pro" || selectedPlan === "elite"
    ? selectedPlan
    : "pro";
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / 3) * 100;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("aria_authed") !== "1") return;

    if (initialPlan === "free") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate(`/checkout?plan=${initialPlan}`, { replace: true });
    }
  }, [initialPlan, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Signup form */}
      <div className="relative w-full lg:w-1/2 xl:w-2/5 flex h-full flex-col overflow-hidden bg-white">
        <Link to="/" className="absolute left-8 top-10 hidden lg:block">
          <AnimatedLogo />
        </Link>

        {/* Progress — pinned to top */}
        <div className="w-full max-w-md mx-auto px-8 pt-6 pb-3 lg:pt-10 shrink-0">
          <div className="hidden h-[83px] lg:block" />
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-100 [&>div]:bg-slate-700" />
          </div>
          <div className="flex justify-between mt-4">
            {steps.map(step => (
              <div key={step.number} className={`flex items-center gap-2 ${
                step.number <= currentStep ? "text-slate-700" : "text-gray-300"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  step.number < currentStep
                    ? "bg-slate-700 border-slate-700 text-white"
                    : step.number === currentStep
                      ? "border-slate-700 text-slate-700"
                      : "border-gray-200 text-gray-300"
                }`}>
                  {step.number < currentStep ? <Check className="w-4 h-4" /> : step.number}
                </div>
                <span className="text-xs hidden sm:block font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form — centered in remaining space */}
        <div className="flex-1 min-h-0 flex items-start justify-center px-8 pt-10 pb-6">
          <div className="w-full max-w-md">
            <Link to="/" className="lg:hidden block text-xl font-bold text-[#F05A28] mb-8">Aria</Link>
            <SignupPanel currentStep={currentStep} setCurrentStep={setCurrentStep} initialPlan={initialPlan} />
          </div>
        </div>
      </div>

      {/* Right: Visual panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <VisualPanel />
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
