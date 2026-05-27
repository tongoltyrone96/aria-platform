'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Shield, Zap, Target, Brain, Globe, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

const DOWNLOAD_URL = 'https://github.com/tongoltyrone96/aria-releases/releases/download/v0.2.4/ARIA-Setup-0.2.4.exe';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

const FEATURE_BADGES = [
  { icon: Shield, label: 'Runs as a private desktop overlay' },
  { icon: Zap, label: 'Answers appear the moment you need them' },
  { icon: Target, label: 'Pinpoint-accurate answers shaped by your role' },
  { icon: Brain, label: 'No question goes unanswered, technical or behavioral' },
  { icon: Globe, label: 'Every interview format, perfectly handled' },
];

const SLIDES = [
  { src: '/interview1.png', alt: 'ARIA in action during a real interview session' },
  { src: '/interview2.jpeg', alt: 'Before and after - confidence with ARIA vs without' },
  { src: '/Log-in.png', alt: 'ARIA Interview Assistant dashboard' },
];

function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex(next);
  }, []);

  const prev = useCallback(() => {
    goTo((index - 1 + SLIDES.length) % SLIDES.length, -1);
  }, [index, goTo]);

  const next = useCallback(() => {
    goTo((index + 1) % SLIDES.length, 1);
  }, [index, goTo]);

  useEffect(() => {
    const iv = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
      {/* Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={index}
          src={SLIDES[index].src}
          alt={SLIDES[index].alt}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i, i > index ? 1 : -1)}
            className="transition-all rounded-full"
            style={{
              width: i === index ? '24px' : '8px',
              height: '8px',
              backgroundColor: i === index ? '#F05A28' : 'rgba(255,255,255,0.55)',
            }}
          />
        ))}
      </div>

      {/* Stats bubble */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-xl shadow-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-1 h-7">
            {[30, 50, 70, 90].map((h, i) => (
              <div
                key={i}
                className="w-2 rounded-sm"
                style={{ height: `${h}%`, backgroundColor: '#F05A28', opacity: 0.5 + i * 0.17 }}
              />
            ))}
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Interview Success Rate</div>
            <div className="text-xs font-semibold" style={{ color: '#F05A28' }}>Rapidly Rising</div>
            <div className="text-lg font-bold leading-none" style={{ color: '#F05A28' }}>98%+</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section
      className="pt-40 pb-24"
      style={{
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Text + CTA */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="space-y-4">
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center px-3 py-1 rounded-full border border-border"
              style={{ backgroundColor: '#F0F4F8' }}
            >
              <Monitor className="w-4 h-4 mr-2" style={{ color: '#F05A28' }} />
              <span className="text-sm text-foreground">AI-Powered Interview Assistant for Windows</span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-5xl sm:text-6xl font-semibold leading-[1.1] tracking-tight text-foreground"
            >
              Ace Every Interview with
              <span style={{ color: '#F05A28' }}> Real-Time AI Assistance</span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Every question. Perfect answer. Aria listens live so you never hesitate.
            </motion.p>
          </div>

          <motion.div {...fadeUp(0.3)} className="flex justify-center gap-4">
            <a
              href={DOWNLOAD_URL}
              className="inline-flex items-center gap-2 text-white text-base font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ backgroundColor: '#F05A28', boxShadow: '0 8px 24px rgba(240,90,40,0.35)' }}
            >
              <Monitor className="w-5 h-5" />
              Download for Windows
            </a>
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-2 text-foreground text-base font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 border-2 border-border bg-background hover:bg-muted"
            >
              <Play className="w-5 h-5" style={{ color: '#F05A28' }} />
              Demo
            </button>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div {...fadeUp(0.35)} className="relative flex items-center mt-14 mb-10">
          <div className="flex-1 h-px bg-border" />
          <div className="px-4 flex items-center gap-1.5">
            <div className="w-0.5 h-5 bg-border rounded" />
            <div className="w-0.5 h-3 bg-border rounded" />
            <div className="mx-1 w-9 h-9 rounded-full border border-border flex items-center justify-center">
              <Monitor className="w-4 h-4" style={{ color: '#F05A28' }} />
            </div>
            <div className="w-0.5 h-3 bg-border rounded" />
            <div className="w-0.5 h-5 bg-border rounded" />
          </div>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border mb-14">
          {FEATURE_BADGES.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              {...fadeUp(0.1 * i)}
              className="flex flex-col items-center text-center px-4 py-6"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: '#F05A28' }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium leading-snug text-foreground">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Image slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="-mx-4 sm:-mx-8 lg:-mx-16"
        >
          <HeroSlideshow />
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
              >
                <X size={20} />
              </button>

              {/* Video */}
              <video
                controls
                autoPlay
                className="w-full h-auto"
                style={{ maxHeight: '80vh' }}
              >
                <source src="/ARIA.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
