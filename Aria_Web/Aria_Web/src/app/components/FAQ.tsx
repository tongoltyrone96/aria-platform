import { motion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";

const faqs = [
  { question: "Is Aria detectable during video interviews?", answer: "No. Aria runs as a private desktop overlay that operates entirely outside of what your camera, screen share, or video platform can see. Zoom, Google Meet, Microsoft Teams, Webex, and every other major platform cannot detect it. Your interviewer sees only what you choose to show them, nothing more." },
  { question: "What interview types does Aria support?", answer: "Aria covers the full range of modern interview formats including behavioral, technical, system design, live coding, case study, competency-based, and general conversational interviews. You can select your mode before each session or let Aria detect the format automatically as the conversation unfolds." },
  { question: "How does Aria know what to suggest?", answer: "Aria listens to the interviewer in real time and matches each question against your uploaded resume, experience bank, and job description. Its local AI model then surfaces the most relevant answer frameworks and talking points instantly. The more context you provide before the session, the more precise and role-specific the suggestions become." },
  { question: "How accurate is the live transcription?", answer: "Aria uses premium WASAPI audio capture to directly access your system audio, which gives it a clean, uncompressed signal regardless of microphone quality or background noise. Transcription accuracy consistently exceeds 98 percent under normal interview conditions." },
  { question: "Can multiple people use one account at the same time?", answer: "Yes. Every plan including Free supports simultaneous multi-user access on a single account. Team members or interview partners can be active at the same time without conflicts. Higher plans include more interview calls and resume profiles to accommodate heavier team usage." },
  { question: "Is my interview data private?", answer: "Completely. All audio processing and AI inference happen locally on your device. Nothing from your interview session is sent to external servers. Transcripts and session data are stored only on your machine, and we have no access to your content at any time." },
  { question: "What Windows versions does Aria support?", answer: "Aria supports Windows 10 version 1903 or later and Windows 11. For smooth real-time performance we recommend at least an Intel Core i5 or AMD Ryzen 5 processor and 8GB of RAM. Most modern laptops and desktops meet these requirements comfortably." },
  { question: "Can I use Aria for mock practice interviews?", answer: "Yes. Aria includes a dedicated Practice Mode where you can run full mock sessions, review your transcripts, and receive detailed post-session feedback on pacing, clarity, and answer quality. It is the most effective way to build your experience bank and sharpen your delivery before the real interview." },
  { question: "How do I get started?", answer: "Sign up on the Aria website, choose your plan, and receive your personal token key. Download the Windows app, enter your token, and Aria is ready in under two minutes. Upload your resume and a job description on first launch and you are set for your first session. No technical setup required." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground mb-12">Everything you need to know before your next interview.</p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
            >
              <AccordionItem value={`item-${index}`} className="border border-border/50 rounded-lg px-6 transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-0.5">
                <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-12 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm md:p-8"
        >
          <h3 className="text-2xl font-semibold tracking-tight">Still need help?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Visit the Help Centre for account, desktop app, usage, and billing guidance, or submit a ticket when you need direct assistance.
          </p>
          <Button asChild className="mt-6 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
            <a href="/dashboard/support">Open Help Centre</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
