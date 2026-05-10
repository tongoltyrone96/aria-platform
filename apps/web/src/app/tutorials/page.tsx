import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

interface Step {
  step: string;
  text: string;
}

interface Tutorial {
  id: string;
  icon: string;
  label: string;
  title: string;
  description: string;
  steps: Step[];
  tip?: string;
}

const tutorials: Tutorial[] = [
  {
    id: 'ai-answers',
    icon: '⚡',
    label: 'Real-Time AI',
    title: 'Getting Real-Time AI Answers During Your Interview',
    description:
      'ARIA listens to both your interviewer and you simultaneously via WASAPI audio capture. The moment a question is detected, it generates a tailored answer in under 1 second — right on your overlay panel.',
    steps: [
      { step: '01', text: 'Launch ARIA and sign in. The overlay appears as a transparent, click-through window above your video call.' },
      { step: '02', text: 'Upload your resume in Settings → Profile. ARIA memorizes your projects, metrics, and achievements to ground every answer in your real story.' },
      { step: '03', text: 'Start your interview as normal. ARIA detects when a question is asked and displays a suggested answer on your overlay.' },
      { step: '04', text: 'Press Ctrl+Alt+A to refresh or regenerate an answer if you want a different angle. The shortcut works silently with no visual flash to the interviewer.' },
      { step: '05', text: 'Speak naturally — ARIA\'s answer is a guide, not a script. Add your own tone and delivery on top of the structured content it provides.' },
    ],
    tip: 'ARIA uses the STAR method (Situation, Task, Action, Result) by default for behavioral questions. Enable coaching mode in Settings for inline STAR structure hints alongside each answer.',
  },
  {
    id: 'live-coding',
    icon: '💻',
    label: 'Live Coding',
    title: 'Using ARIA During Live Coding & Technical Interviews',
    description:
      'Technical rounds — whether on HackerRank, CoderPad, or a shared IDE — are where candidates freeze most often. ARIA\'s coding assistant analyzes the problem, explains the approach, and hints at edge cases — visible only on your personal overlay panel.',
    steps: [
      { step: '01', text: 'When a coding question appears, ARIA automatically detects it from the audio transcript — no copy-pasting needed.' },
      { step: '02', text: 'The ARIA panel shows the problem decomposed: time complexity guidance, a suggested algorithmic approach, and language-specific starter logic.' },
      { step: '03', text: 'As you type, ARIA highlights potential edge cases (empty arrays, overflow, off-by-one) and reminds you to handle them before the interviewer asks.' },
      { step: '04', text: 'If you get stuck or the interviewer gives a follow-up ("can you optimize it?"), press Ctrl+Alt+A to re-analyze with the new constraint.' },
      { step: '05', text: 'After submitting, ARIA summarizes what went well and what to revisit — useful if the interviewer asks you to walk through your solution.' },
    ],
    tip: 'Tell ARIA your preferred language in Profile settings (Python, JavaScript, Go, etc.) and it will format code hints in that language by default.',
  },
  {
    id: 'display-setup',
    icon: '🖥️',
    label: 'Display Setup',
    title: 'Setting Up the AI Overlay for Maximum Comfort',
    description:
      'ARIA\'s overlay panel is a lightweight, click-through window that sits above your video call. Positioning it well means you can glance at suggestions naturally without breaking eye contact with your camera.',
    steps: [
      { step: '01', text: 'In ARIA Settings → Display, choose which monitor the overlay appears on. A secondary monitor is ideal — you can read suggestions while keeping your primary screen focused on the call.' },
      { step: '02', text: 'Resize the overlay panel by dragging its edges. A narrower panel at the side of your screen is less distracting than a full-width view during the interview.' },
      { step: '03', text: 'Use the opacity slider in Settings → Display to find a transparency level that keeps the panel readable without dominating your attention.' },
      { step: '04', text: 'Enable Focus Mode in Settings — the overlay collapses to a thin edge indicator while you speak or type, and expands when you hold Alt to review suggestions.' },
      { step: '05', text: 'Position the overlay near your webcam so your eye movement looks natural. Reading suggestions close to the camera line helps maintain perceived eye contact.' },
    ],
    tip: 'Test your overlay position during a mock call with a friend before your real interview. Make sure you can read suggestions comfortably at a glance without moving your head noticeably.',
  },
  {
    id: 'wasapi-setup',
    icon: '🎙️',
    label: 'Audio Setup',
    title: 'Setting Up WASAPI for Perfect Dual-Stream Audio',
    description:
      'ARIA uses Windows Audio Session API (WASAPI) loopback to capture system audio — your interviewer\'s voice — and your microphone simultaneously. No extra software, no virtual cables, no latency.',
    steps: [
      { step: '01', text: 'Open ARIA → Settings → Audio. Select your default playback device (speakers or headphones) as the "Loopback Source" — this captures everything your interviewer says.' },
      { step: '02', text: 'Select your microphone as the "Microphone Source." ARIA will merge both streams into a single timestamped transcript.' },
      { step: '03', text: 'Run the Audio Test (Settings → Audio → Test Capture). Speak a few words and play a YouTube video — both should appear in the live waveform preview.' },
      { step: '04', text: 'If the loopback source shows silence, make sure your default playback device matches what your video call is outputting to. Check Windows Sound → Playback tab.' },
      { step: '05', text: 'For Bluetooth headsets: use WASAPI Shared Mode instead of Exclusive Mode to avoid audio dropouts. Toggle this in Settings → Audio → Advanced.' },
    ],
    tip: 'Using a virtual meeting with a friend is the best way to verify both streams before your real interview. Run the ARIA audio test while on a call and confirm both voices appear in the transcript.',
  },
];

export default function TutorialsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-950 pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page header */}
          <div className="pt-16 pb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">Tutorials</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Learn How to Use ARIA
            </h1>
            <p className="max-w-xl mx-auto text-base text-white/50 leading-relaxed">
              Step-by-step guides covering everything from first launch to advanced AI assistant techniques.
            </p>
          </div>

          {/* Nav pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {tutorials.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-all"
              >
                <span>{t.icon}</span>
                {t.label}
              </a>
            ))}
          </div>

          {/* Tutorials */}
          <div className="flex flex-col gap-20">
            {tutorials.map((tutorial, idx) => (
              <section key={tutorial.id} id={tutorial.id} className="scroll-mt-24">
                {/* Header */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-2xl shrink-0">
                    {tutorial.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-1 block">
                      {tutorial.label}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                      {tutorial.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-white/55 leading-relaxed mb-8 pl-17">
                  {tutorial.description}
                </p>

                {/* Steps */}
                <div className="flex flex-col gap-px ml-0">
                  {tutorial.steps.map((s, i) => (
                    <div key={i} className="flex gap-5 group">
                      {/* Step number + connector */}
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/10 group-hover:border-brand-500/40 flex items-center justify-center shrink-0 transition-colors">
                          <span className="text-xs font-bold text-brand-400 font-mono">{s.step}</span>
                        </div>
                        {i < tutorial.steps.length - 1 && (
                          <div className="w-px flex-1 bg-white/8 my-1" />
                        )}
                      </div>
                      {/* Content */}
                      <div className={`pt-1.5 ${i < tutorial.steps.length - 1 ? 'pb-6' : ''}`}>
                        <p className="text-sm text-white/70 leading-relaxed">{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pro tip */}
                {tutorial.tip && (
                  <div className="mt-6 flex gap-3 rounded-xl border border-brand-500/20 bg-brand-500/8 px-5 py-4">
                    <span className="text-brand-400 text-sm font-bold shrink-0">Pro tip:</span>
                    <p className="text-sm text-white/60 leading-relaxed">{tutorial.tip}</p>
                  </div>
                )}

                {idx < tutorials.length - 1 && (
                  <div className="mt-20 border-t border-white/8" />
                )}
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-24 rounded-2xl border border-brand-500/25 bg-brand-500/8 p-10 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to try it yourself?</h3>
            <p className="text-white/50 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Download ARIA for free — no credit card, no time limit. Start with 10 interview calls per month and see the difference.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm px-8 py-3.5 transition-all shadow-lg shadow-brand-500/25 hover:-translate-y-0.5"
            >
              Download for Free
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
