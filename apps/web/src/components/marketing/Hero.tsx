'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Play, X, Mic2, Zap } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Typing animation ─────────────────────────────────── */
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, 18);
    return () => clearInterval(iv);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-brand-400 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

/* ─── Audio waveform bars ──────────────────────────────── */
function WaveformBar({ i }: { i: number }) {
  return (
    <motion.div
      className="w-0.5 rounded-full bg-brand-400/70"
      animate={{ height: ['6px', `${12 + Math.sin(i) * 10}px`, '6px'] }}
      transition={{ duration: 0.8 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
    />
  );
}

/* ─── Main product mockup ─────────────────────────────── */
function ProductMockup() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setPhase((p) => (p + 1) % 4), 3200);
    return () => clearInterval(iv);
  }, []);

  const question = 'How do you handle conflicts within your engineering team?';
  const answer = 'In my previous role at a Series B startup, I introduced structured conflict-resolution retrospectives every sprint. When two engineers disagreed on architecture choices, I facilitated a trade-off analysis session — documenting pros, cons, and risk. The result: we shipped on time, and both engineers felt ownership. That process is now standard on the team.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      {/* Outer glow */}
      <div className="absolute -inset-8 bg-brand-500/10 rounded-3xl blur-3xl pointer-events-none" />

      {/* Main container */}
      <div className="relative rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl overflow-hidden">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 py-3 bg-neutral-950/80 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-white/30 font-mono hidden sm:block">
              ARIA Interview Copilot v2.4 — Active
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Waveform */}
            <div className="flex items-end gap-px h-4">
              {Array.from({ length: 14 }).map((_, i) => <WaveformBar key={i} i={i} />)}
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 rounded-full px-3 py-1">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-400"
              />
              <span className="text-xs text-green-400 font-semibold">LIVE</span>
            </div>
          </div>
        </div>

        {/* ── Main area: video call + ARIA panel side by side ── */}
        <div className="flex flex-col lg:flex-row min-h-[420px]">

          {/* LEFT — simulated video call */}
          <div className="flex-1 relative bg-neutral-800 overflow-hidden">
            {/* Gradient background simulating a video call */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(59,130,246,0.08),transparent_60%)]" />

            {/* Simulated person silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-neutral-600/60 border-2 border-white/10" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-16 bg-neutral-700/40 rounded-full blur-xl" />
              </div>
            </div>

            {/* Interviewer label */}
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur rounded-lg px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-xs text-white/80 font-medium">Interviewer — Sarah K.</span>
              </div>
            </div>

            {/* Question bubble overlay */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-4 left-4 right-4 bg-black/70 backdrop-blur border border-white/10 rounded-xl p-4"
                >
                  <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Question detected</p>
                  <p className="text-sm text-white leading-relaxed font-medium">&ldquo;{question}&rdquo;</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Self-view pip */}
            <div className="absolute bottom-4 right-4 w-20 h-14 sm:w-28 sm:h-20 rounded-xl border border-white/15 bg-neutral-700 overflow-hidden shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-brand-500/40 border border-brand-500/30" />
              </div>
              <div className="absolute bottom-1 left-1.5">
                <span className="text-[9px] text-white/60 font-medium">You</span>
              </div>
            </div>

            {/* Call controls bar */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-neutral-950/80 to-transparent flex items-end justify-center pb-2 gap-3">
              {['🎤', '📹', '💬', '⋯'].map((icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs">
                  {icon}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs">📞</div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-px bg-white/10" />

          {/* RIGHT — ARIA answer panel */}
          <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-neutral-950/60">
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-brand-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">A</span>
                </div>
                <span className="text-sm font-semibold text-white">ARIA Copilot</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Zap size={11} className="text-brand-400" />
                <span>0.8s</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* User transcript */}
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] text-white/60 shrink-0 mt-0.5">I</div>
                <div className="bg-neutral-800 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-white/70 leading-relaxed">
                  {phase >= 1
                    ? `"${question}"`
                    : <span className="text-white/30 italic">Waiting for question…</span>}
                </div>
              </div>

              {/* ARIA response */}
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-2 items-start flex-row-reverse"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-0.5">A</div>
                    <div className="bg-brand-500/15 border border-brand-500/25 rounded-xl rounded-tr-sm px-3 py-2.5 text-xs text-white/85 leading-relaxed max-w-[calc(100%-2rem)]">
                      {phase === 2
                        ? <TypewriterText text={answer} delay={0} />
                        : answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyzing indicator */}
              {phase === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center flex-row-reverse"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">A</div>
                  <div className="bg-neutral-800 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <span className="text-xs text-white/40">Generating</span>
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 rounded-full bg-brand-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Keyboard hint */}
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-white/30">
                <Mic2 size={11} />
                <span>WASAPI capture active</span>
              </div>
              <kbd className="text-[10px] bg-white/8 border border-white/12 text-white/30 rounded px-2 py-0.5 font-mono">
                Ctrl+Alt+A
              </kbd>
            </div>
          </div>
        </div>

        {/* ── Bottom stats bar ── */}
        <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-neutral-950/60">
          {[
            { label: 'Response Time', value: '< 1s', color: 'text-green-400' },
            { label: 'Detection Risk', value: 'Zero', color: 'text-brand-400' },
            { label: 'Audio Source', value: 'WASAPI', color: 'text-violet-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 sm:px-6 py-3 text-center">
              <p className={`text-sm font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Hero ─────────────────────────────────────────────── */
export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-neutral-950 pt-44 pb-20">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:52px_52px]" />

        {/* Glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-brand-500/12 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-violet-600/8 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Top text block (~30% of content) ── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center gap-5 mb-12"
          >
            <motion.h1
              variants={item}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06]"
            >
              <span className="text-white">Ace Every Interview.</span>
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Without Anyone Knowing.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-base sm:text-lg text-white/55 leading-relaxed"
            >
              ARIA captures both sides of your call with premium WASAPI audio,
              knows your resume, and whispers perfect answers in under 1 second.
              <span className="text-white/80"> Invisible. Instant. Undetectable.</span>
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm px-7 py-3.5 transition-all shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5"
              >
                <Download size={16} />
                Download for Windows — Free
              </Link>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm px-6 py-3.5 transition-all hover:-translate-y-0.5"
              >
                <span className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center">
                  <Play size={9} fill="currentColor" className="text-brand-400" />
                </span>
                Watch Demo
              </button>
            </motion.div>

            <motion.p variants={item} className="text-xs text-white/25">
              Free forever plan — no credit card needed &middot; Windows 10 &amp; 11 &middot; Multiple users per account
            </motion.p>
          </motion.div>

          {/* ── Product mockup (~70% of content) ── */}
          <ProductMockup />
        </div>
      </section>

      {/* Video modal */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="aspect-video bg-neutral-800 flex items-center justify-center">
                <p className="text-white/30 text-sm">Demo video coming soon</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
