'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Play, X, Zap, ChevronLeft, ChevronRight, Code2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Typing animation ──────────────────────────────────── */
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setStarted(false);
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [text, delay]);

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

/* ─── Audio waveform bars ───────────────────────────────── */
function WaveformBar({ i }: { i: number }) {
  return (
    <motion.div
      className="w-0.5 rounded-full bg-brand-400/70"
      animate={{ height: ['6px', `${12 + Math.sin(i) * 10}px`, '6px'] }}
      transition={{ duration: 0.8 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
    />
  );
}

/* ─── Slide 1: ARIA desktop app mockup ─────────────────── */
function SlideDemo() {
  // phase: 0=ready, 1=question typed, 2=generating, 3=answer shown, 4=script bubble
  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setPhase(0);
    setSeconds(0);
    const timers = [
      setTimeout(() => setPhase(1), 1400),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 4200),
      setTimeout(() => setPhase(4), 9000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase < 1) return;
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const question = 'How do you handle conflicts within your engineering team?';
  const questionHindi = 'आप अपनी इंजीनियरिंग टीम में विवादों को कैसे संभालते हैं?';

  return (
    <div className="relative min-h-[420px] overflow-hidden" style={{ background: '#080810' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-3 py-2 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#07070F' }}>
        {/* ARIA badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border" style={{ background: 'rgba(109,40,217,0.2)', borderColor: 'rgba(109,40,217,0.4)' }}>
          <span className="text-[10px] font-black text-violet-300">ARIA</span>
        </div>
        {/* Language */}
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <span>Spoken</span>
          <div className="flex items-center gap-1 border border-white/15 rounded px-2 py-0.5 bg-white/5">
            <span className="text-white/60">English</span>
            <span className="text-white/30 text-[8px]">▾</span>
          </div>
        </div>
        {/* Toggle */}
        <div className="flex items-center gap-1.5 text-[10px] text-white/30">
          <div className="w-7 h-3.5 rounded-full bg-white/10 border border-white/15 relative">
            <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-white/25" />
          </div>
          <span>System</span>
        </div>
        <div className="flex-1" />
        {/* Timer */}
        <span className="text-[11px] font-mono text-white/40">{mm}:{ss}</span>
        {/* Start/End button */}
        <motion.div
          animate={phase >= 1 ? { background: ['rgba(239,68,68,0.85)', 'rgba(220,38,38,0.85)', 'rgba(239,68,68,0.85)'] } : {}}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1 cursor-pointer"
          style={{ background: phase >= 1 ? 'rgba(239,68,68,0.85)' : 'rgba(20,184,166,0.9)' }}
        >
          <span className="text-[11px] font-bold text-white">{phase >= 1 ? '■ End' : '▶ Start'}</span>
        </motion.div>
        {/* Close */}
        <div className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-white/60 text-xs border border-white/10">✕</div>
      </div>

      {/* ── Main area ── */}
      <div className="flex" style={{ height: 'calc(100% - 36px)', minHeight: '382px' }}>

        {/* LEFT — Q + Answer (67%) */}
        <div className="flex flex-col" style={{ flex: '0 0 67%', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Q row */}
          <div className="flex items-start gap-2 px-3 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', minHeight: '48px' }}>
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(109,40,217,0.3)', border: '1px solid rgba(109,40,217,0.5)' }}>
              <span className="text-violet-300 text-[9px] font-black">Q</span>
            </div>
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {phase >= 1 ? (
                  <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <p className="text-xs font-bold text-white/90 truncate">{question}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(167,139,250,0.6)' }}>{questionHindi}</p>
                  </motion.div>
                ) : (
                  <motion.p key="idle" className="text-[11px] italic" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    Start a session to detect questions…
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Answer area header */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
            <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: 'rgba(109,40,217,0.35)' }}>
              <span className="text-violet-300 text-[9px] font-black">A</span>
            </div>
            <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Answer</span>
            <div className="flex-1" />
            {/* Bullet toggle */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] border" style={{ background: 'rgba(109,40,217,0.2)', borderColor: 'rgba(109,40,217,0.35)', color: 'rgba(167,139,250,0.8)' }}>
              ☰ Bullets
            </div>
            {/* Font controls */}
            <div className="flex items-center gap-1">
              <div className="px-1.5 py-0.5 rounded text-[9px] border border-white/10 text-white/30">A-</div>
              <div className="px-1.5 py-0.5 rounded text-[9px] border border-white/10 text-white/30">A+</div>
            </div>
          </div>

          {/* Answer content */}
          <div className="flex-1 overflow-hidden relative" style={{ background: '#0A0A16' }}>
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div key="ready" className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.07, 1], boxShadow: ['0 0 0px rgba(109,40,217,0.4)', '0 0 24px rgba(109,40,217,0.6)', '0 0 0px rgba(109,40,217,0.4)'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(109,40,217,0.15)', border: '2px solid rgba(109,40,217,0.5)' }}
                  >
                    <span className="text-2xl font-black text-violet-400">+</span>
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-violet-300">Ready to assist</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Start a question below to get started</p>
                  </div>
                </motion.div>
              )}

              {phase === 2 && (
                <motion.div key="gen" className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-xs text-white/40">Generating</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(109,40,217,0.8)' }}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {phase >= 3 && (
                <motion.div key="answer" className="absolute inset-0 p-3 overflow-hidden"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                >
                  <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: '"Times New Roman", serif', fontSize: '13px', lineHeight: 1.5 }}>
                    <p className="mb-2"><TypewriterText text="• Structured retrospectives: In my last role at a Series B startup, I introduced conflict-resolution retros every sprint. When two engineers disagreed on architecture choices, I facilitated a trade-off analysis session — documenting pros, cons, and risk." delay={0} /></p>
                    {phase >= 4 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        • <strong>Outcome-focused:</strong> We shipped on time and both engineers felt genuine ownership. That process became standard team practice.
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#07070F' }}>
            {/* Plan badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] border shrink-0" style={{ background: 'rgba(234,179,8,0.12)', borderColor: 'rgba(234,179,8,0.3)', color: 'rgba(234,179,8,0.8)' }}>
              ⚡ Pro
            </div>
            {/* Input */}
            <div className="flex-1 rounded-lg px-3 py-1.5 text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}>
              Type a question or context here...
            </div>
            {/* Help Me */}
            <div className="flex items-center gap-1 rounded-lg px-3 py-1.5 shrink-0" style={{ background: 'rgba(109,40,217,0.85)', border: '1px solid rgba(124,58,237,0.6)' }}>
              <span className="text-[10px] font-bold text-white">+ Help Me</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Script panel (33%) */}
        <div className="flex flex-col" style={{ flex: '0 0 33%', background: '#07070F' }}>
          {/* Script header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <span className="text-xs font-semibold text-white/50">Script</span>
            <div className="flex-1" />
            {/* Live Coding toggle */}
            <div className="flex items-center gap-1 text-[9px] border border-white/10 rounded px-2 py-0.5 text-white/30">
              <span>{'{ }'}</span>
              <span>Live Coding</span>
            </div>
          </div>

          {/* Transcript area */}
          <div className="flex-1 p-2.5 flex flex-col gap-2 overflow-hidden">
            <AnimatePresence>
              {phase >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-1.5"
                >
                  {/* Interviewer bubble */}
                  <div className="self-start max-w-[90%] rounded-xl rounded-tl-sm px-2.5 py-2 text-[9px] leading-relaxed"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    &ldquo;{question}&rdquo;
                  </div>
                  {/* My answer bubble */}
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
                    className="self-end max-w-[90%] rounded-xl rounded-tr-sm px-2.5 py-2 text-[9px] leading-relaxed"
                    style={{ background: 'rgba(109,40,217,0.18)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(109,40,217,0.25)' }}>
                    Structured retros, trade-off sessions…
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {phase < 4 && (
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.12)' }}>Transcript appears here</span>
              </div>
            )}
          </div>

          {/* Script footer */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1 text-[9px] text-white/25">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                className="w-1 h-1 rounded-full" style={{ background: 'rgba(167,139,250,0.6)' }} />
              <span>Mic</span>
            </div>
            <span className="text-white/15 text-[9px]">•</span>
            <span className="text-[9px] text-white/25">Loop</span>
            <span className="text-white/15 text-[9px]">•</span>
            <span className="text-[9px] font-mono text-white/25">REC {mm}:{ss}</span>
            <div className="flex-1" />
            <span className="text-[9px] text-white/20">Clear</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Slide 2: Two computers — left has ARIA, right doesn't ── */
const stealthHints = [
  'Use your Kafka pipeline example — matches their real-time system question.',
  'Emphasize the 40% latency reduction. Concrete metrics land well here.',
  'Add: "This approach scaled to 50k concurrent users in production."',
];

function SlideStealthShare() {
  const [hintIdx, setHintIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setHintIdx(0);
    setSeconds(0);
    const hintIv = setInterval(() => setHintIdx((h) => (h + 1) % stealthHints.length), 2800);
    const secIv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => { clearInterval(hintIv); clearInterval(secIv); };
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex min-h-[420px] overflow-hidden">

      {/* ══ LEFT — Your screen: Meet + ARIA floating on top ══ */}
      <div className="flex-1 relative overflow-hidden" style={{ background: '#08080f' }}>

        {/* Screen label */}
        <div className="absolute top-1.5 left-2 z-30 flex items-center gap-1.5">
          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[9px] text-green-400 font-semibold">Screen sharing — Your PC</span>
        </div>

        {/* Google Meet window */}
        <div className="absolute top-7 left-1.5 bottom-1.5 overflow-hidden rounded-lg border border-white/10"
          style={{ right: '148px' }}>
          {/* Browser bar */}
          <div className="flex items-center gap-1.5 px-2 py-1 border-b border-white/8 shrink-0" style={{ background: '#1e1e1e' }}>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <div className="w-2 h-2 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="rounded px-2 py-0.5 text-[7px] text-white/30 font-mono" style={{ background: '#2a2a2a' }}>
                meet.google.com/ble-ghzg-xvn
              </div>
            </div>
          </div>
          {/* Meet content */}
          <div className="relative overflow-hidden" style={{ background: '#1f0d0a', height: 'calc(100% - 24px)' }}>
            {/* Top Meet bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 z-10">
              <span className="text-[7px] text-white/30 bg-black/40 rounded px-1.5 py-0.5">You have extensions installed</span>
              <span className="text-[7px] text-white/30 bg-black/40 rounded px-1.5 py-0.5">No one else is in this meeting</span>
            </div>
            {/* Main speaker — interviewer */}
            <div className="absolute inset-6 rounded-xl overflow-hidden" style={{ background: '#2d1510' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-xl">S</div>
              </div>
              <div className="absolute bottom-1.5 left-2 text-[8px] text-white/60 bg-black/50 rounded px-1.5 py-0.5">Sarah Kim</div>
            </div>
            {/* Self pip */}
            <div className="absolute bottom-9 right-2 w-14 h-10 rounded-lg border border-white/20 overflow-hidden" style={{ background: '#1a1a3a' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-[9px] font-bold">T</div>
              </div>
              <div className="absolute bottom-0.5 left-1 text-[6px] text-white/50">You</div>
            </div>
            {/* Meet controls */}
            <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center gap-2" style={{ background: 'rgba(0,0,0,0.6)' }}>
              {['🎤', '📹', '💬', '⋯'].map((ic, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[8px]">{ic}</div>
              ))}
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[8px]">✕</div>
            </div>
          </div>
        </div>

        {/* ARIA app window — floating over Meet */}
        <div className="absolute top-7 right-1.5 bottom-1.5 w-36 rounded-lg overflow-hidden flex flex-col"
          style={{ background: '#080810', border: '1px solid rgba(109,40,217,0.45)', boxShadow: '0 0 18px rgba(109,40,217,0.18)' }}>
          {/* ARIA title bar */}
          <div className="flex items-center gap-1 px-2 py-1.5 shrink-0 border-b" style={{ background: '#07070F', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'rgba(109,40,217,0.25)', border: '1px solid rgba(109,40,217,0.45)' }}>
                <span className="text-[9px] font-black text-violet-300">ARIA</span>
              </div>
            </div>
            <div className="text-white/20 text-[9px] font-mono">{mm}:{ss}</div>
          </div>
          {/* ARIA hint cycling */}
          <div className="flex-1 flex flex-col p-2 overflow-hidden" style={{ background: '#0A0A16' }}>
            <div className="text-[7px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(167,139,250,0.5)' }}>Live Hint</div>
            <AnimatePresence mode="wait">
              <motion.div key={hintIdx}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg p-2 text-[8px] leading-relaxed flex-1"
                style={{ background: 'rgba(109,40,217,0.12)', border: '1px solid rgba(109,40,217,0.25)', color: 'rgba(255,255,255,0.72)' }}
              >
                {stealthHints[hintIdx]}
              </motion.div>
            </AnimatePresence>
            <div className="mt-2 flex items-center gap-1">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'rgba(109,40,217,0.7)' }} />
              <span className="text-[7px]" style={{ color: 'rgba(255,255,255,0.22)' }}>Your private workspace</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CENTER DIVIDER ══ */}
      <div className="flex flex-col items-center justify-center w-7 shrink-0 gap-2" style={{ background: '#030306' }}>
        <motion.div
          animate={{ x: [0, 3, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white/30 text-sm select-none"
        >→</motion.div>
        <div style={{ writingMode: 'vertical-rl' }} className="text-[7px] text-white/10 rotate-180 select-none">vs</div>
      </div>

      {/* ══ RIGHT — Interviewer's screen: no ARIA ══ */}
      <div className="flex-1 relative overflow-hidden" style={{ background: '#07050a' }}>

        {/* Screen label */}
        <div className="absolute top-1.5 right-2 z-30 flex items-center gap-1.5">
          <span className="text-[9px] text-white/30">Interviewer's View</span>
        </div>

        {/* Their Google Meet window */}
        <div className="absolute top-7 left-1.5 right-1.5 bottom-1.5 rounded-lg overflow-hidden border border-white/8">
          {/* Browser bar */}
          <div className="flex items-center gap-1.5 px-2 py-1 border-b border-white/8 shrink-0" style={{ background: '#1a1a1a' }}>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="rounded px-2 py-0.5 text-[7px] text-white/25 font-mono" style={{ background: '#2a2a2a' }}>
                meet.google.com/ble-ghzg-xvn
              </div>
            </div>
          </div>
          {/* Meet content — brownish, they see the shared screen */}
          <div className="relative overflow-hidden" style={{ background: '#1f0d0a', height: 'calc(100% - 24px)' }}>
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 z-10">
              <span className="text-[7px] text-white/30 bg-black/40 rounded px-1.5 py-0.5">You have extensions installed that may affect quality</span>
              <span className="text-[7px] text-white/30 bg-black/40 rounded px-1.5 py-0.5">No one else is in this meeting</span>
            </div>
            {/* Main area — shows Tyrone's screen (shared screen preview, no ARIA) */}
            <div className="absolute inset-6 rounded-xl overflow-hidden" style={{ background: '#2a1510' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-neutral-600 flex items-center justify-center text-white font-bold">T</div>
              </div>
            </div>
            <div className="absolute bottom-9 left-3 text-[8px] text-white/50">Tyrone Jhor Tongol</div>

            {/* Clean view indicator */}
            <motion.div
              animate={{ opacity: [0.3, 0.65, 0.3] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="absolute top-10 left-0 right-0 flex justify-center z-10"
            >
              <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-[8px] text-white/35">Standard meeting view</span>
              </div>
            </motion.div>

            {/* Meet controls */}
            <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center gap-2" style={{ background: '#111' }}>
              {['🎤', '📷', '💬', '⋮'].map((ic, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-[8px]">{ic}</div>
              ))}
              <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[8px]">✕</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── Slide 3: Live coding — screenshot → analyze → code ── */
const codeLines = [
  { text: 'function mergeIntervals(intervals) {', color: 'text-violet-400' },
  { text: '  intervals.sort((a, b) => a[0] - b[0]);', color: 'text-white/75' },
  { text: '  const result = [intervals[0]];', color: 'text-blue-300' },
  { text: '  for (const [s, e] of intervals.slice(1)) {', color: 'text-blue-300' },
  { text: '    const last = result[result.length - 1];', color: 'text-white/75' },
  { text: '    if (s <= last[1]) last[1] = Math.max(last[1], e);', color: 'text-brand-300' },
  { text: '    else result.push([s, e]);', color: 'text-white/75' },
  { text: '  }', color: 'text-white/75' },
  { text: '  return result;', color: 'text-pink-400' },
  { text: '}', color: 'text-violet-400' },
];

const shotColors = [
  'from-neutral-700 to-neutral-800',
  'from-neutral-600 to-neutral-800',
  'from-neutral-700 to-neutral-700',
];

function SlideLiveCoding() {
  // phase: 0=idle, 1=shots appearing, 2=analyze pulse, 3=code typing
  const [phase, setPhase] = useState(0);
  const [shotCount, setShotCount] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    setPhase(0);
    setShotCount(0);
    setVisibleLines(0);

    const t1 = setTimeout(() => { setPhase(1); setShotCount(1); }, 800);
    const t2 = setTimeout(() => setShotCount(2), 1800);
    const t3 = setTimeout(() => setShotCount(3), 2800);
    const t4 = setTimeout(() => setPhase(2), 3600);   // analyze pulse
    const t5 = setTimeout(() => setPhase(3), 4400);   // start code

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== 3) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= codeLines.length) clearInterval(iv);
    }, 420);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div className="relative min-h-[420px] overflow-hidden bg-[#0d1117]">

      {/* ── Editor top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-white/10 z-10">
        <Code2 size={12} className="text-brand-400" />
        <span className="text-xs text-white/50 font-mono">solution.js</span>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-white/25">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          screen sharing
        </div>
      </div>

      {/* ── Code content — fills area left of the panel ── */}
      <div className="absolute top-[37px] left-0 right-[300px] bottom-0 p-4 font-mono text-xs overflow-hidden">
        {phase < 3 ? (
          <div className="h-full flex items-center justify-center flex-col gap-3">
            <div className="text-white/15 text-[11px]">— awaiting analysis —</div>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-4 bg-white/20"
            />
          </div>
        ) : (
          codeLines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="flex items-start leading-5"
            >
              <span className="text-white/20 w-5 shrink-0 text-right mr-4 select-none">{i + 1}</span>
              <span className={line.color}>
                {line.text}
                {i === visibleLines - 1 && visibleLines < codeLines.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-3.5 bg-white/70 ml-0.5 align-middle"
                  />
                )}
              </span>
            </motion.div>
          ))
        )}
      </div>

      {/* ── ARIA screenshot tool — floating overlay panel (right) ── */}
      <div className="absolute right-3 top-3 bottom-3 w-72 bg-neutral-950/95 backdrop-blur-md border border-white/12 rounded-2xl flex flex-col shadow-2xl overflow-hidden select-none">

        {/* Top controls */}
        <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-white/40">Spoken</span>
          <div className="flex items-center gap-1 bg-neutral-800 border border-white/10 rounded-md px-2 py-1">
            <span className="text-[10px] text-white/70 font-medium">English</span>
            <span className="text-white/30 text-[8px]">▾</span>
          </div>
          <div className="flex-1" />
          <div className="w-7 h-3.5 rounded-full bg-neutral-700 border border-white/15 relative">
            <div className="absolute left-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-white/30" />
          </div>
          <span className="text-[10px] text-white/40">Screen</span>
          <div className="flex items-center gap-1 bg-green-500 rounded-md px-2 py-1 ml-1">
            <span className="text-[10px] text-white font-bold">▶ Start</span>
          </div>
        </div>

        {/* Screenshot button row */}
        <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-teal-500/90 rounded-lg px-3 py-1.5 shrink-0">
            <span className="text-[10px] font-bold text-white">⬛ Screenshot</span>
          </div>
          <AnimatePresence>
            {shotCount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] text-white/50"
              >
                {shotCount} shot{shotCount > 1 ? 's' : ''}
              </motion.span>
            )}
          </AnimatePresence>
          <div className="flex-1" />
          <button type="button" className="text-[10px] text-white/40 border border-white/15 rounded-md px-2.5 py-1.5">Clear</button>
          <motion.button
            type="button"
            animate={phase === 2 ? { scale: [1, 1.08, 1, 1.08, 1], boxShadow: ['0 0 0px #3b82f6', '0 0 10px #3b82f6', '0 0 0px #3b82f6'] } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] text-white font-bold bg-blue-500 rounded-md px-2.5 py-1.5"
          >
            ✦ Analyze
          </motion.button>
        </div>

        {/* Thumbnails */}
        <div className="flex-1 p-2.5 flex flex-col gap-2 overflow-hidden">
          <AnimatePresence>
            {Array.from({ length: shotCount }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2.5 bg-neutral-800/60 border border-white/8 rounded-lg p-2"
              >
                <div className={`w-14 h-9 rounded-md bg-gradient-to-br ${shotColors[i]} shrink-0 overflow-hidden relative`}>
                  <div className="absolute top-1 left-1 space-y-0.5">
                    {[5, 8, 4, 7].map((w, j) => (
                      <div key={j} className={`h-0.5 rounded-full bg-white/${8 + j * 4}`} style={{ width: `${w * 3}px` }} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/60 font-medium">Screenshot {i + 1}</div>
                  <div className="text-[9px] text-white/25 mt-0.5">Captured · now</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {shotCount === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] text-white/20">Take a screenshot to begin</span>
            </div>
          )}

          <AnimatePresence>
            {phase === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-1 bg-blue-500/15 border border-blue-500/30 rounded-lg px-3 py-2.5"
              >
                <div className="text-[10px] text-blue-300 font-semibold mb-1">Analysis complete</div>
                <div className="text-[10px] text-white/45 leading-relaxed">
                  Detected merge intervals. Solution generated on screen.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-white/25">
            <span>Runs locally on your device</span>
          </div>
          <div className="text-[9px] text-white/20 font-mono">REC 00:00</div>
        </div>
      </div>

    </div>
  );
}

/* ─── Slide definitions ─────────────────────────────────── */
const slides = [
  {
    id: 'demo',
    label: 'Interview Copilot',
    icon: <Zap size={11} />,
    component: SlideDemo,
  },
  {
    id: 'meeting',
    label: 'Meeting Mode',
    icon: <Zap size={11} />,
    component: SlideStealthShare,
  },
  {
    id: 'coding',
    label: 'Live Coding',
    icon: <Code2 size={11} />,
    component: SlideLiveCoding,
  },
];

/* ─── Main product mockup with slideshow ───────────────── */
function ProductMockup() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (idx: number) => {
    setDirection(idx > slideIndex ? 1 : -1);
    setSlideIndex(idx);
  };
  const prev = () => goTo((slideIndex - 1 + slides.length) % slides.length);
  const next = () => goTo((slideIndex + 1) % slides.length);

  useEffect(() => {
    const iv = setInterval(() => {
      setDirection(1);
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 14000);
    return () => clearInterval(iv);
  }, []);

  const CurrentSlide = slides[slideIndex].component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div className="absolute -inset-8 bg-brand-500/10 rounded-3xl blur-3xl pointer-events-none" />

      <div className="relative rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Top bar */}
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

        {/* Slide tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-neutral-950/50 border-b border-white/8">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                i === slideIndex
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-white/35 hover:text-white/55 hover:bg-white/5'
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={prev}
              className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              type="button"
              onClick={next}
              className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Slide content */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slideIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <CurrentSlide />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom stats bar */}
        <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-neutral-950/60">
          {[
            { label: 'Response Time', value: '< 1s', color: 'text-green-400' },
            { label: 'Privacy', value: 'On-Device', color: 'text-brand-400' },
            { label: 'Audio Engine', value: 'WASAPI', color: 'text-violet-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 sm:px-6 py-3 text-center">
              <p className={`text-sm font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            className={`transition-all rounded-full ${
              i === slideIndex ? 'w-6 h-1.5 bg-brand-400' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */
export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-neutral-950 pt-44 pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-brand-500/12 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-violet-600/8 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="text-white">Communicate with Clarity.</span>
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Powered by Real-Time AI.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-base sm:text-lg text-white/55 leading-relaxed"
            >
              ARIA listens to your conversations, knows your resume, and surfaces
              personalized AI suggestions in under 1 second — so you always have
              <span className="text-white/80"> the right words at the right moment.</span>
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

          <ProductMockup />
        </div>
      </section>

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
