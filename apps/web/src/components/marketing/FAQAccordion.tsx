'use client';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { FAQItem } from '@/lib/faq-data';

interface FAQAccordionProps {
  items?: FAQItem[];
}

const defaultFAQs: FAQItem[] = [
  {
    q: 'Is Aria detectable during video interviews?',
    a: 'No. Aria runs as a private desktop overlay that operates entirely outside of what your camera, screen share, or video platform can see. Zoom, Google Meet, Microsoft Teams, Webex, and every other major platform cannot detect it. Your interviewer sees only what you choose to show them, nothing more.',
  },
  {
    q: 'What interview types does Aria support?',
    a: 'Aria covers the full range of modern interview formats including behavioral, technical, system design, live coding, case study, competency-based, and general conversational interviews. You can select your mode before each session or let Aria detect the format automatically as the conversation unfolds.',
  },
  {
    q: 'How does Aria know what to suggest?',
    a: 'Aria listens to the interviewer in real time and matches each question against your uploaded resume, experience bank, and job description. Its AI model then surfaces the most relevant answer frameworks and talking points instantly. The more context you provide before the session, the more precise and role-specific the suggestions become.',
  },
  {
    q: 'How accurate is the live transcription?',
    a: 'Aria uses premium WASAPI audio capture to directly access your system audio, which gives it a clean, uncompressed signal regardless of microphone quality or background noise. Transcription accuracy consistently exceeds 98 percent under normal interview conditions.',
  },
  {
    q: 'Can multiple people use one account at the same time?',
    a: 'Yes. Every plan including Free supports simultaneous multi-user access on a single account. Team members or interview partners can be active at the same time without conflicts. Higher plans include more interview calls and resume profiles to accommodate heavier team usage.',
  },
  {
    q: 'Is my interview data private?',
    a: 'Completely. All audio processing and AI inference happen locally on your device. Nothing from your interview session is sent to external servers. Transcripts and session data are stored only on your machine, and we have no access to your content at any time.',
  },
  {
    q: 'What Windows versions does Aria support?',
    a: 'Aria supports Windows 10 version 1903 or later and Windows 11. For smooth real-time performance we recommend at least an Intel Core i5 or AMD Ryzen 5 processor and 8GB of RAM. Most modern laptops and desktops meet these requirements comfortably.',
  },
  {
    q: 'Can I use Aria for mock practice interviews?',
    a: 'Yes. Aria includes a dedicated Practice Mode where you can run full mock sessions, review your transcripts, and receive detailed post-session feedback on pacing, clarity, and answer quality. It is the most effective way to build your experience bank and sharpen your delivery before the real interview.',
  },
  {
    q: 'How do I get started?',
    a: 'Sign up on the Aria website, choose your plan, and receive your personal token key. Download the Windows app, enter your token, and Aria is ready in under two minutes. Upload your resume and a job description on first launch and you are set for your first session. No technical setup required.',
  },
];

export function FAQAccordion({ items }: FAQAccordionProps) {
  const displayItems = items ?? defaultFAQs;

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {displayItems.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.05 }}
        >
          <AccordionItem
            value={`item-${index}`}
            className="border border-border/50 rounded-lg px-6 transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-0.5"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}
