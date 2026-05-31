import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Monitor, Shield, Zap, Target, Brain, Globe } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

export function Hero() {
  return (
    <section className="pt-40 pb-20" style={{ backgroundImage: "url('/hero-bg.png')", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat" }}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="space-y-4">
            <motion.div {...fadeUp(0)} className="inline-flex items-center text-primary px-3 py-1 rounded-full border" style={{ backgroundColor: "#F0F4F8" }}>
              <Monitor className="w-4 h-4 mr-2" />
              <span className="text-sm">AI-Powered Interview Assistant for Windows</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="text-[58px] font-semibold leading-[1.1] tracking-wide" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Ace Every Interview with
              <span className="text-primary whitespace-nowrap"> Real-Time AI Assistance</span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Every question. Perfect answer. Aria listens live so you never hesitate.
            </motion.p>
          </div>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* TODO: Replace /downloads/AriaSetup.exe with the actual Windows installer path.
                Place the .exe file in public/downloads/ to serve it statically. */}
            <a href="/downloads/AriaSetup.exe" download className="cursor-pointer">
              <Button size="lg" className="text-lg px-8 py-6 bg-[#F05A28] hover:bg-[#D94E20] text-white border-0">
                <Monitor className="w-5 h-5 mr-2" />
                Download for Windows
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div {...fadeUp(0.35)} className="relative flex items-center mt-14 mb-10">
          <div className="flex-1 h-px bg-border" />
          <div className="px-4 flex items-center gap-1.5">
            <div className="w-0.5 h-5 bg-border rounded" />
            <div className="w-0.5 h-3 bg-border rounded" />
            <div className="mx-1 w-9 h-9 rounded-full border border-border flex items-center justify-center">
              <Monitor className="w-4 h-4 text-primary" />
            </div>
            <div className="w-0.5 h-3 bg-border rounded" />
            <div className="w-0.5 h-5 bg-border rounded" />
          </div>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border mb-14">
          {[
            { icon: Shield, label: "Runs as a private desktop overlay" },
            { icon: Zap, label: "Answers appear the moment you need them" },
            { icon: Target, label: "Pinpoint-accurate answers shaped by your role" },
            { icon: Brain, label: "No question goes unanswered, technical or behavioral" },
            { icon: Globe, label: "Every interview format, perfectly handled" },
          ].map(({ icon: Icon, label }, i) => (
            <motion.div key={label} {...fadeUp(0.1 * i)} className="flex flex-col items-center text-center px-4 py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "#F05A28" }}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative -mx-4 sm:-mx-8 lg:-mx-16"
        >
          <div className="rounded-xl overflow-hidden border-4 border-white" style={{ boxShadow: "0 15px 50px rgba(0,0,0,0.2)" }}>
            {/* TODO: Replace YOUTUBE_VIDEO_ID with your own YouTube video ID.
                Example: if your video URL is https://youtube.com/watch?v=abc123, use "abc123" */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/0MprWWQILbc?rel=0&modestbranding=1"
                title="Aria Interview Assistant — Live Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border">
            <div className="flex items-center space-x-3">
              <div className="flex items-end gap-1 h-8">
                {[30, 50, 70, 90].map((h, i) => (
                  <div key={i} className="w-2.5 rounded-sm" style={{ height: `${h}%`, backgroundColor: "#F05A28", opacity: 0.5 + i * 0.17 }} />
                ))}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Interview Success Rate</div>
                <div className="text-sm font-semibold text-[#F05A28]">Rapidly Rising</div>
                <div className="text-xl font-bold text-[#F05A28]">98%+</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
