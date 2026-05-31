import { useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PlatformBanner } from "./components/PlatformBanner";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Benefits } from "./components/Benefits";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { ScrollControls } from "./components/ScrollControls";
import { SignIn } from "./pages/auth/SignIn";
import { SignUp } from "./pages/auth/SignUp";
import { Checkout, CheckoutCancel, CheckoutSuccess } from "./pages/checkout/Checkout";
import { DashboardLayout } from "./pages/dashboard/DashboardLayout";
import { Overview } from "./pages/dashboard/Overview";
import { Usage } from "./pages/dashboard/Usage";
import { Interviews } from "./pages/dashboard/Interviews";
import { Billing } from "./pages/dashboard/Billing";
import { Settings } from "./pages/dashboard/Settings";
import { Support } from "./pages/dashboard/Support";
import { PrivacyPolicy } from "./pages/legal/PrivacyPolicy";
import { TermsOfService } from "./pages/legal/TermsOfService";

function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <PlatformBanner />
        <Features />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <ScrollControls />
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthed = localStorage.getItem("aria_authed") === "1";

  if (!isAuthed) {
    return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
      <Route path="/checkout/success" element={<RequireAuth><CheckoutSuccess /></RequireAuth>} />
      <Route path="/checkout/cancel" element={<CheckoutCancel />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        <Route index element={<Overview />} />
        <Route path="usage" element={<Usage />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
      </Route>
    </Routes>
  );
}
