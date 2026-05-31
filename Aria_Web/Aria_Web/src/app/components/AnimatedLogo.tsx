const LOGO_HEIGHT = 51;
const LOGO_WIDTH = Math.round((1100 / 600) * LOGO_HEIGHT);
const LOGO_COLOR = "#F05A28";

export default function AnimatedLogo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  void variant;

  return (
    <span
      role="img"
      aria-label="Aria"
      className="-my-[8px] block shrink-0"
      style={{
        width: LOGO_WIDTH,
        height: LOGO_HEIGHT,
        backgroundColor: LOGO_COLOR,
        WebkitMaskImage: "url('/AriaLogo.png')",
        maskImage: "url('/AriaLogo.png')",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
