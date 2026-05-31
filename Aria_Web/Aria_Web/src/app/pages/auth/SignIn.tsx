import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AnimatedLogo from "../../components/AnimatedLogo";
import { VisualPanel } from "./SignUp";

// TODO [SUPABASE:AUTH]: import { supabase } from "@/lib/supabase"

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // TODO [SUPABASE:AUTH]: const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    // TODO [SUPABASE:AUTH]: if (error) { setError(error.message); setLoading(false); return; }
    await new Promise((r) => setTimeout(r, 700));

    setLoading(false);
    // TODO [SUPABASE:AUTH]: replace with real session check
    localStorage.setItem("aria_authed", "1");
    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <div className="relative w-full lg:w-1/2 xl:w-2/5 flex h-full flex-col bg-white">
        <Link to="/" className="absolute left-8 top-10 hidden lg:block">
          <AnimatedLogo />
        </Link>

        <div className="px-8 pt-8 w-full max-w-md mx-auto">
          <Link to="/" className="lg:hidden block text-xl font-bold text-[#F05A28]">
            Aria
          </Link>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-8 pb-6">
          <div className="min-h-[520px] w-full max-w-md pt-8">
            <div className="text-center pb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
              <p className="mt-2 text-sm text-gray-500">
                Sign in to manage your plan, token key, and Aria desktop access.
              </p>
            </div>

            <div className="mb-6">
              <SocialBtn label="Continue with Google" onClick={() => {}}>
                {/* TODO [SUPABASE:AUTH]: supabase.auth.signInWithOAuth({ provider: 'google' }) */}
                <GoogleIcon />
                <span>Google</span>
              </SocialBtn>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <IconInput
                icon={<Mail className="w-4 h-4" />}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />

              <div className="relative">
                <IconInput
                  icon={<Lock className="w-4 h-4" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-end">
                {/* TODO [SUPABASE:AUTH]: supabase.auth.resetPasswordForEmail(email) */}
                <a href="#" className="text-sm font-medium text-[#F05A28] hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-[#F05A28] hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <VisualPanel />
      </div>
    </div>
  );
}

function IconInput({
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-10 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200"
      />
    </div>
  );
}

function SocialBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
