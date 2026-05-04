'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureBlockProps {
  eyebrow: string;
  heading: string;
  body: string;
  imageRight?: boolean;
  index: number;
}

function FeatureBlock({ eyebrow, heading, body, imageRight = false, index }: FeatureBlockProps) {
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
          className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center border border-border shadow-xl overflow-hidden relative"
        >
          {/* Decorative inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent" />
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-brand-500/10 blur-2xl" />

          {/* Feature number */}
          <span className="relative text-8xl font-black text-brand-500/10 select-none">
            0{index + 1}
          </span>
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
    eyebrow: 'Zero Digital Footprint',
    heading: 'Completely Invisible to Everyone Else',
    body: "ARIA runs as a native Windows process — never a browser extension. It doesn't appear in screen-share thumbnails, OBS capture regions, or task-switcher previews. The overlay is a transparent, click-through window that sits above your video call without triggering any screen-capture detection APIs. You see everything. Your interviewer sees nothing unusual.",
    imageRight: false,
  },
];

export function Features() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Every advantage. Zero compromise.
          </h2>
          <p className="max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
            ARIA combines premium Windows audio APIs, state-of-the-art AI, and a pixel-perfect
            invisible overlay to give you a genuine, undetectable edge in any interview.
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
