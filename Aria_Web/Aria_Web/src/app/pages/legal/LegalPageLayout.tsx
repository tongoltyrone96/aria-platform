import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Ban,
  BadgeCheck,
  Clock,
  CreditCard,
  Database,
  FileText,
  FileWarning,
  Gavel,
  KeyRound,
  Mail,
  Plug,
  Receipt,
  RefreshCw,
  Scale,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ScrollControls } from "../../components/ScrollControls";

type LegalItem = {
  title: string;
  text: string;
};

export type LegalSection = {
  title: string;
  body?: string[];
  items?: LegalItem[];
};

type LegalPageLayoutProps = {
  title: string;
  updatedAt: string;
  intro: string[];
  sections: LegalSection[];
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getSectionIcon(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("collect") || normalized.includes("database")) return Database;
  if (normalized.includes("use information")) return Settings;
  if (normalized.includes("share")) return Share2;
  if (normalized.includes("security")) return ShieldCheck;
  if (normalized.includes("retention")) return Clock;
  if (normalized.includes("rights")) return UserCheck;
  if (normalized.includes("third")) return Plug;
  if (normalized.includes("age")) return BadgeCheck;
  if (normalized.includes("changes") || normalized.includes("modification")) return RefreshCw;
  if (normalized.includes("contact")) return Mail;
  if (normalized.includes("ethical")) return Scale;
  if (normalized.includes("account")) return UserPlus;
  if (normalized.includes("subscription")) return CreditCard;
  if (normalized.includes("refund")) return Receipt;
  if (normalized.includes("prohibited")) return Ban;
  if (normalized.includes("enforcement")) return ShieldAlert;
  if (normalized.includes("desktop") || normalized.includes("token")) return KeyRound;
  if (normalized.includes("ai")) return Sparkles;
  if (normalized.includes("liability")) return FileWarning;
  if (normalized.includes("law")) return Gavel;

  return FileText;
}

export function LegalPageLayout({ title, updatedAt, intro, sections }: LegalPageLayoutProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(slugify(sections[0]?.title ?? ""));

  useEffect(() => {
    const sectionIds = sections.map((section) => slugify(section.title));

    const handleScroll = () => {
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.getBoundingClientRect().top <= 140) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goHome = () => {
    navigate("/#site-footer");
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <main>
        <section className="relative overflow-hidden bg-[#0A0A0A]">
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
          <div className="mx-auto max-w-6xl px-6 pt-6 pb-8 md:pt-8 md:pb-10">
            <div className="flex items-center">
              <Button
                type="button"
                onClick={goHome}
                className="h-10 rounded-full bg-white px-5 text-sm font-semibold text-[#0A0A0A] shadow-sm hover:bg-[#F05A28] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Aria
              </Button>
            </div>

            <div className="mx-auto mt-2 max-w-3xl text-center md:mt-3">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#F05A28] text-white shadow-lg shadow-[#F05A28]/20">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">{title}</h1>
              <div className="mx-auto mt-6 max-w-2xl space-y-3 text-base leading-7 text-white/72 md:text-lg">
                {intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold text-[#F05A28]">Last updated: {updatedAt}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
          <div className="lg:hidden mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-950">Quick Navigation</div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sections.map((section) => {
                const sectionId = slugify(section.title);
                const Icon = getSectionIcon(section.title);

                return (
                  <button
                    key={section.title}
                    onClick={() => scrollToSection(sectionId)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-[#0A0A0A] hover:text-white"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-950">Quick Navigation</div>
                <nav className="mt-4 space-y-2">
                  {sections.map((section) => {
                    const sectionId = slugify(section.title);
                    const Icon = getSectionIcon(section.title);
                    const active = activeSection === sectionId;

                    return (
                      <button
                        key={section.title}
                        onClick={() => scrollToSection(sectionId)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-[#F05A28] text-white"
                            : "text-gray-600 hover:bg-[#0A0A0A] hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
              {sections.map((section, index) => {
                const Icon = getSectionIcon(section.title);
                const isLastSection = index === sections.length - 1;

                return (
                  <section
                    key={section.title}
                    id={slugify(section.title)}
                    className={isLastSection ? "scroll-mt-24 pb-24" : "scroll-mt-24"}
                  >
                    {index > 0 && <Separator className="my-10 bg-gray-200" />}
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 shrink-0 text-[#F05A28]" />
                      <h2 className="text-3xl font-bold tracking-tight text-gray-950">{section.title}</h2>
                    </div>

                    {section.body && (
                      <div className="mt-6 space-y-4 text-[15px] leading-7 text-gray-600">
                        {section.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    )}

                    {section.items && (
                      <div
                        className={
                          section.title === "Contact Us"
                            ? "mt-7 grid gap-6 sm:grid-cols-2"
                            : "mt-7 grid gap-6"
                        }
                      >
                        {section.items.map((item) => (
                          <div key={item.title}>
                            {section.title === "Contact Us" ? (
                              <p className="text-[15px] leading-7 text-gray-600">
                                <span className="font-semibold text-gray-950">{item.title}: </span>
                                {item.text}
                              </p>
                            ) : (
                              <>
                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                <p className="mt-2 text-[15px] leading-7 text-gray-600">{item.text}</p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </article>
          </div>
        </div>
      </main>

      <ScrollControls mode="topOnly" />
    </div>
  );
}
