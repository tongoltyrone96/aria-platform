'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    image: '/App_SK.png',
    title: 'Sign Up and Manage Your Account',
    description:
      'Register on the Aria website and choose the plan that fits your needs. Your dashboard gives you full control to track token usage, upgrade your plan, and manage billing in one place. Once registered, you receive a personal token key to activate the desktop app instantly.',
    imageRight: true,
  },
  {
    number: '02',
    image: '/App_Settings.png',
    title: 'Set Up Your Interview Profile',
    description:
      'Upload your resume and the job description so Aria understands exactly what the role demands. Schedule upcoming interviews, configure your preferred interview type, and build out your experience bank. Every setting is saved, so your next session picks up right where you stopped.',
    imageRight: false,
  },
  {
    number: '03',
    image: '/App_Interview.png',
    title: 'Enter the Interview Ready from Second One',
    description:
      'With your profile set, jump straight into any interview with a single click. Aria runs silently alongside your video call, delivering real-time answer suggestions on your private display. Fine-tune display layout, response style, and conversation preferences on the fly so you stay fully in control throughout.',
    imageRight: true,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps and walk into every interview with confidence.
          </p>
        </motion.div>

        <div className="flex flex-col gap-20">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col ${step.imageRight ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
            >
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: step.imageRight ? -48 : 48 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="flex-1 space-y-4"
              >
                <span className="text-6xl font-bold text-muted-foreground/20 leading-none block mb-4">
                  {step.number}
                </span>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: step.imageRight ? 48 : -48 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
                className="flex-1 bg-white rounded-2xl shadow-lg p-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.image} alt={step.title} className="w-full rounded-xl object-cover" />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
