'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Mic, Shield, Zap, Brain, Clock, Star,
  BarChart3, Settings, Users,
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Real-Time Audio Capture',
    description: 'Premium WASAPI audio capture gives Aria a clean, direct signal from your system - no microphone quality concerns, no background noise interference.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Answer Generation',
    description: 'State-of-the-art language models process each question instantly and surface the most relevant, role-specific answer frameworks in under one second.',
  },
  {
    icon: Shield,
    title: 'Private Desktop Overlay',
    description: 'Aria runs entirely outside the scope of screen share and video platforms. Your camera and interviewer see only what you choose to show.',
  },
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'The moment a question is asked, Aria surfaces your answer. No delay, no searching - just the right response at exactly the right moment.',
  },
  {
    icon: Star,
    title: 'STAR-Method Coaching',
    description: 'Behavioral questions are framed through the STAR method automatically, pulling real stories from your experience bank and shaping them into compelling answers.',
  },
  {
    icon: Clock,
    title: 'Session Recording & Review',
    description: 'Every session is transcribed and stored locally. Review your answers after each interview and track how your delivery improves over time.',
  },
  {
    icon: BarChart3,
    title: 'Live Coding Analysis',
    description: 'Screenshot your coding problem and Aria analyzes it on-screen, surfacing optimal approaches and explanations while you code.',
  },
  {
    icon: Settings,
    title: 'Full Customization',
    description: 'Configure response style, font size, overlay position, and interview type before each session. Every setting persists so your next session is ready immediately.',
  },
  {
    icon: Users,
    title: 'Multi-User Access',
    description: 'Every plan supports multiple users on the same account simultaneously. Share with your team or interview partners - no per-seat fees ever.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to Ace Every Interview
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aria packs every tool you need into one private Windows overlay - from real-time AI answers to post-session coaching.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 3) * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 space-y-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#F05A28' }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
