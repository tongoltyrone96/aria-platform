'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ── Feature 1: WASAPI Dual-Stream Audio Capture ─────────── */
function AudioCaptureVisual() {
  const bars1 = [6, 14, 9, 18, 11, 20, 8, 16, 12, 7, 19, 10, 15, 8, 17];
  const bars2 = [8, 11, 17, 7, 14, 9, 20, 6, 15, 18, 10, 13, 7, 16, 11];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
      {/* Interviewer stream */}
      <div className="w-full bg-neutral-800/60 rounded-xl border border-white/10 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs text-white/50 font-medium uppercase tracking-wide">Interviewer Audio</span>
        </div>
        <div className="flex items-end gap-1 h-10">
          {bars1.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-full bg-blue-400/70"
              animate={{ height: [`${h * 0.4}px`, `${h}px`, `${h * 0.4}px`] }}
              transition={{ duration: 0.7 + i * 0.06, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }}
            />
          ))}
        </div>
      </div>

      {/* Merge arrow */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-blue-400/40 to-brand-400/40" />
        <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-2.5 h-2.5 rounded-full bg-brand-400"
          />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-brand-400/40 to-green-400/40" />
      </div>

      {/* Mic stream */}
      <div className="w-full bg-neutral-800/60 rounded-xl border border-white/10 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs text-white/50 font-medium uppercase tracking-wide">Your Microphone</span>
        </div>
        <div className="flex items-end gap-1 h-10">
          {bars2.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-full bg-green-400/70"
              animate={{ height: [`${h * 0.4}px`, `${h}px`, `${h * 0.4}px`] }}
              transition={{ duration: 0.65 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>

      {/* Output label */}
      <div className="flex items-center gap-2 bg-brand-500/10 border border-brand-500/25 rounded-lg px-4 py-2">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-brand-400"
        />
        <span className="text-xs text-brand-300 font-semibold">Clean timestamped transcript — merged</span>
      </div>
    </div>
  );
}

/* ── Feature 2: Profile-Aware Personalization ─────────────── */
function ProfileAwareVisual() {
  const lines = ['Led backend migration → 40% latency drop', 'Managed 5-engineer cross-functional team', 'Built real-time pipeline (Kafka + Node.js)'];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-8">
      {/* Resume card */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full bg-neutral-800/70 rounded-xl border border-white/10 px-5 py-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-brand-500/30 border border-brand-500/40 flex items-center justify-center text-sm font-bold text-brand-300">T</div>
          <div>
            <div className="text-sm font-semibold text-white/90">Your Resume</div>
            <div className="text-xs text-white/35">Experience · Projects · Skills</div>
          </div>
          <div className="ml-auto flex items-center gap-1 bg-green-500/15 border border-green-500/30 rounded-full px-2.5 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] text-green-400 font-semibold">Loaded</span>
          </div>
        </div>
        <div className="space-y-2">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              className="flex items-start gap-2"
            >
              <div className="w-1 h-1 rounded-full bg-brand-400/60 mt-1.5 shrink-0" />
              <span className="text-xs text-white/55 leading-relaxed">{l}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Connection */}
      <div className="flex items-center gap-2 w-full">
        <div className="h-px flex-1 bg-brand-500/20" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="text-brand-400 text-base"
        >✦</motion.div>
        <div className="h-px flex-1 bg-brand-500/20" />
      </div>

      {/* Generated answer snippet */}
      <div className="w-full bg-brand-500/10 border border-brand-500/25 rounded-xl px-5 py-4">
        <div className="text-[10px] text-brand-400 uppercase tracking-wide font-semibold mb-2">ARIA Answer — in your voice</div>
        <p className="text-xs text-white/65 leading-relaxed">
          &ldquo;When I led the backend migration at my last role, we cut latency by 40%…&rdquo;
        </p>
      </div>
    </div>
  );
}

/* ── Feature 3: Invisible Overlay ─────────────────────────── */
function InvisibleVisual() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-full grid grid-cols-2 gap-4">
        {/* What you see */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-white/35 uppercase tracking-wide font-semibold text-center">Your Screen</div>
          <div className="aspect-video bg-neutral-800 rounded-xl border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            {/* Fake video call */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-neutral-600/60 border border-white/10" />
            </div>
            {/* ARIA overlay */}
            <motion.div
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-2 left-2 right-2 bg-black/80 border border-brand-500/40 rounded-lg p-2"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-3 h-3 rounded bg-brand-500 flex items-center justify-center">
                  <span className="text-white text-[7px] font-black">A</span>
                </div>
                <span className="text-[8px] text-brand-300 font-semibold">ARIA</span>
              </div>
              <div className="text-[7px] text-white/70 leading-relaxed">Use your Kafka example here…</div>
            </motion.div>
          </div>
        </div>

        {/* What interviewer sees */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-white/35 uppercase tracking-wide font-semibold text-center">Clean Meeting View</div>
          <div className="aspect-video bg-neutral-800 rounded-xl border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-neutral-600/60 border border-white/10" />
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center">
              <span className="text-[8px] text-white/20 italic">— your personal workspace —</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2 bg-neutral-800/60 border border-white/10 rounded-lg px-4 py-2.5">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-brand-400"
        />
        <span className="text-xs text-white/55">
          <span className="text-white/80 font-semibold">100%</span> local — your data never leaves your device
        </span>
      </div>
    </div>
  );
}

const featureVisuals = [AudioCaptureVisual, ProfileAwareVisual, InvisibleVisual];

interface FeatureBlockProps {
  eyebrow: string;
  heading: string;
  body: string;
  imageRight?: boolean;
  index: number;
}

function FeatureBlock({ eyebrow, heading, body, imageRight = false, index }: FeatureBlockProps) {
  const Visual = featureVisuals[index];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col gap-8 lg:gap-20 items-center',
        imageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
      )}
    >
      {/* Text */}
      <div className="flex-1 flex flex-col gap-5 lg:max-w-lg">
        <motion.span
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex w-fit text-xs font-semibold uppercase tracking-widest text-brand-500 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5"
        >
          {eyebrow}
        </motion.span>
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">{heading}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">{body}</p>
      </div>

      {/* Visual */}
      <div className="flex-1 w-full">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="aspect-[4/3] bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-brand-500/8 blur-2xl pointer-events-none" />
          <Visual />
        </motion.div>
      </div>
    </motion.div>
  );
}

const features = [
  {
    eyebrow: 'Industry-Leading Audio Intelligence',
    heading: 'Premium WASAPI Dual-Stream Capture',
    body: 'ARIA uses Windows Audio Session API (WASAPI) — the highest-grade audio capture technology available on Windows — to record your interviewer\'s voice directly from your system audio. No extra permissions needed on their end. Your microphone is captured simultaneously, and both streams are merged into a clean, timestamped transcript that drives perfectly grounded AI responses.',
    imageRight: false,
  },
  {
    eyebrow: 'Deep Personalization',
    heading: 'Profile-Aware, Always in Your Voice',
    body: "Upload your resume once and ARIA memorizes your story. Every answer it generates is rooted in your actual experience — your specific projects, your real metrics, your genuine achievements. When asked to describe a leadership moment, ARIA doesn't invent a generic example. It surfaces your own history and helps you articulate it under pressure, naturally.",
    imageRight: true,
  },
  {
    eyebrow: 'Private by Design',
    heading: 'Your Personal AI Workspace',
    body: "ARIA runs as a native Windows application — not a browser extension. Your audio and resume data stay on your device and are never uploaded to third-party servers. The overlay is a lightweight, click-through window that sits above your video call, visible only to you. No browser permissions required, no cloud dependency, no data sharing.",
    imageRight: false,
  },
];

export function Features() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Every advantage. Built for professionals.
          </h2>
          <p className="max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
            ARIA combines premium Windows audio capture, state-of-the-art AI, and deep resume
            personalization to give you a genuine competitive advantage in any conversation.
          </p>
        </motion.div>

        <div className="flex flex-col gap-28">
          {features.map((feature, i) => (
            <FeatureBlock
              key={feature.heading}
              eyebrow={feature.eyebrow}
              heading={feature.heading}
              body={feature.body}
              imageRight={feature.imageRight}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
