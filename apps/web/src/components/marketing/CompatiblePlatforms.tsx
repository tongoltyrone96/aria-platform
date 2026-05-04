'use client';

import { motion } from 'framer-motion';
import { Video, Phone, Monitor, Bot } from 'lucide-react';

const categories = [
  {
    icon: Video,
    label: 'Video Calls',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    platforms: ['Zoom', 'Microsoft Teams', 'Google Meet', 'Discord', 'Webex', 'Whatsapp', 'Viber', 'Slack'],
  },
  {
    icon: Phone,
    label: 'Phone & VoIP',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    platforms: ['Google Voice', 'Zadarma', 'RingCentral', 'Vonage', 'Dialpad', 'OpenPhone', 'Grasshopper', 'Any SIP app'],
  },
  {
    icon: Monitor,
    label: 'Screen Share',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    platforms: ['Any screen-share session', 'Remote interviews', 'HireVue', 'Codility', 'HackerRank', 'Karat', 'CoderPad', 'Proctored exams'],
  },
  {
    icon: Bot,
    label: 'AI-powered Calls',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    platforms: ['AI phone screens', 'Automated interviews', 'Async video platforms', 'Recorded interviews', 'Any audio source', 'VoiceAI systems', 'HR bot calls', 'Assessment centers'],
  },
];

const marqueeLogos = [
  'Zoom', 'Teams', 'Google Meet', 'Discord', 'Webex', 'Whatsapp',
  'Viber', 'Slack', 'Google Voice', 'Zadarma', 'RingCentral', 'BlueJeans',
  'HireVue', 'HackerRank', 'CoderPad', 'Karat', 'Codility',
];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
      <motion.div
        animate={{ x: reverse ? ['0%', '50%'] : ['-50%', '0%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="flex shrink-0 gap-4"
      >
        {[...marqueeLogos, ...marqueeLogos, ...marqueeLogos, ...marqueeLogos].map((logo, i) => (
          <div
            key={`${logo}-${i}`}
            className="shrink-0 flex items-center justify-center h-10 px-6 rounded-lg bg-white/5 border border-white/10 text-sm text-white/50 font-medium whitespace-nowrap"
          >
            {logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function CompatiblePlatforms() {
  return (
    <section className="py-24 sm:py-32 bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4">Universal Compatibility</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Works with every platform you use
          </h2>
          <p className="max-w-2xl mx-auto text-base text-white/50 leading-relaxed">
            Because ARIA captures audio at the Windows system level — not inside a browser — it works with
            any app that plays sound through your speakers or headphones.
            <strong className="text-white/80"> If you can hear them, ARIA can hear them.</strong>
          </p>
        </motion.div>

        {/* Marquee strips */}
        <div className="space-y-3 mb-16">
          <Marquee />
          <Marquee reverse />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-5 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${cat.bg}`}>
                <cat.icon size={20} className={cat.color} />
              </div>
              <div>
                <p className={`text-sm font-bold mb-3 ${cat.color}`}>{cat.label}</p>
                <ul className="space-y-1.5">
                  {cat.platforms.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-white/50">
                      <span className={`w-1 h-1 rounded-full shrink-0 ${cat.color.replace('text-', 'bg-')}`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-white/30">
            Works silently in the background on <strong className="text-white/50">Windows 10 &amp; 11</strong> with any audio output device.
            No browser extension. No installation of drivers. Just download and activate.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
