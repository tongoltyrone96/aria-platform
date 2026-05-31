import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import AnimatedLogo from "./AnimatedLogo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("aria_authed"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onStorage = () => setAuthed(!!localStorage.getItem("aria_authed"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="fixed top-8 left-0 right-0 z-50 px-6">
      <div
        className={`max-w-5xl mx-auto bg-[rgba(12,12,12,0.85)] backdrop-blur-md rounded-full px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "shadow-2xl shadow-black/20" : "shadow-lg shadow-black/10"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <AnimatedLogo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-5 py-2 rounded-full text-[14px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {authed ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-full bg-white text-[#0A0A0A] text-[14px] font-semibold hover:bg-[#F05A28] hover:text-white transition-all duration-200"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-[14px] font-medium text-white/70 hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full bg-white text-[#0A0A0A] text-[14px] font-semibold hover:bg-[#F05A28] hover:text-white transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 max-w-5xl mx-auto bg-[rgba(12,12,12,0.95)] backdrop-blur-md rounded-2xl px-6 py-5 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/70 hover:text-white text-[14px] font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-white/10 pt-3 flex flex-col gap-3">
            {authed ? (
              <Link
                to="/dashboard"
                className="px-5 py-3 rounded-full bg-white text-[#0A0A0A] text-[14px] font-semibold text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-white/70 hover:text-white text-[14px] font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-3 rounded-full bg-white text-[#0A0A0A] text-[14px] font-semibold text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
