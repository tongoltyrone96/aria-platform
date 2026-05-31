import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import AnimatedLogo from "../../components/AnimatedLogo";
import {
  BarChart2,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MessagesSquare,
  Settings,
  UserRound,
  X,
} from "lucide-react";

// TODO [SUPABASE:AUTH]: import { supabase } from "@/lib/supabase"
// TODO [SUPABASE:AUTH]: fetch current user with supabase.auth.getUser()

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Usage", href: "/dashboard/usage", icon: BarChart2 },
  { label: "Interviews", href: "/dashboard/interviews", icon: MessagesSquare },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help Centre", href: "/dashboard/support", icon: MessageCircle },
];

const mockUser = {
  name: "John Smith",
  role: "Pro Plan",
  avatarInitials: "JS",
};

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [profileMenuOpen]);

  const handleSignOut = async () => {
    // TODO [SUPABASE:AUTH]: await supabase.auth.signOut()
    localStorage.removeItem("aria_authed");
    localStorage.removeItem("aria_plan");
    navigate("/");
  };

  const Sidebar = () => (
    <aside className="flex h-full w-[236px] shrink-0 flex-col border-r border-[#F3E2DA] bg-white">
      <div className="flex h-24 items-center px-10">
        <Link to="/" className="flex items-center">
          <AnimatedLogo variant="light" />
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-8 pt-6">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href;

          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={`relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                active
                  ? "text-[#F05A28]"
                  : "text-[#7182B6] hover:bg-slate-50 hover:text-[#F05A28]"
              }`}
            >
              {active && <span className="absolute -right-8 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-l-full bg-[#F05A28]" />}
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 px-8 pb-8">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-[#FF3B30] transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="dashboard-surface flex h-screen overflow-hidden bg-white text-[#111827]">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <header className="flex h-24 shrink-0 items-center justify-between px-6 md:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden md:block" />

          <div className="ml-auto flex items-center">
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-100"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F05A28] text-sm font-semibold text-white shadow-sm">
                  {mockUser.avatarInitials}
                </div>
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-medium text-[#111827]">{mockUser.name}</div>
                  <div className="text-xs text-[#7182B6]">{mockUser.role}</div>
                </div>
                <ChevronDown className={`hidden h-4 w-4 text-[#7182B6] transition-transform sm:block ${profileMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 z-30 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F05A28] text-sm font-semibold text-white">
                        {mockUser.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#111827]">{mockUser.name}</div>
                        <div className="truncate text-xs text-[#7182B6]">{mockUser.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111827] transition-colors hover:bg-slate-50"
                      role="menuitem"
                    >
                      <UserRound className="h-4 w-4 text-[#7182B6]" />
                      Account Settings
                    </Link>
                    <Link
                      to="/dashboard/billing"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111827] transition-colors hover:bg-slate-50"
                      role="menuitem"
                    >
                      <CreditCard className="h-4 w-4 text-[#7182B6]" />
                      Billing & Plan
                    </Link>
                    <Link
                      to="/dashboard/support"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111827] transition-colors hover:bg-slate-50"
                      role="menuitem"
                    >
                      <MessageCircle className="h-4 w-4 text-[#7182B6]" />
                      Help Centre
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 py-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#FF3B30] transition-colors hover:bg-red-50"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 pb-10 md:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
