import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ScrollControlsProps = {
  mode?: "toggle" | "topOnly";
};

export function ScrollControls({ mode = "toggle" }: ScrollControlsProps) {
  const [nearTop, setNearTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => setNearTop(window.scrollY < 120);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (mode === "toggle" && nearTop) {
      window.scrollBy({
        top: window.innerHeight * 0.85,
        behavior: "smooth",
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (mode === "topOnly" && nearTop) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0A0A] text-white shadow-lg transition-colors hover:bg-[#F05A28]"
      aria-label={mode === "toggle" && nearTop ? "Scroll down" : "Scroll to top"}
    >
      {mode === "toggle" && nearTop ? (
        <ChevronDown className="w-5 h-5" />
      ) : (
        <ChevronUp className="w-5 h-5" />
      )}
    </button>
  );
}
