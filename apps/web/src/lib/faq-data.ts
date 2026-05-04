export interface FAQItem {
  q: string;
  a: string;
}

export const allFAQs: FAQItem[] = [
  {
    q: 'Is ARIA detectable during a video interview?',
    a: "No. ARIA renders its overlay using a transparent, click-through native window that is excluded from all standard screen-capture APIs on Windows. It does not appear in Zoom, Teams, Google Meet, or OBS screen-share captures. Because it's a native app — not a browser extension — it also doesn't show up in browser extension audits or task-manager screenshots taken by interviewers.",
  },
  {
    q: 'How does the dual-stream audio capture work?',
    a: "ARIA uses the Windows Audio Session API (WASAPI) in loopback mode to capture the audio your speakers are playing — i.e., your interviewer's voice coming through the call. Simultaneously, your microphone input is captured via a separate stream. Both are transcribed independently and merged into a timestamped conversation log that the AI uses to generate accurate, context-aware answers.",
  },
  {
    q: 'Does ARIA work with VPNs and corporate firewalls?',
    a: "Yes. Because ARIA captures audio at the Windows audio layer — not via a browser extension injecting into a web app — corporate VPNs and firewalls have no visibility into it. The only outbound traffic is to the AI API (OpenAI or DeepSeek), which is standard HTTPS traffic indistinguishable from normal web browsing.",
  },
  {
    q: 'What Windows versions are supported?',
    a: "ARIA supports Windows 10 (version 1903 and later) and Windows 11. A 64-bit processor and at least 8 GB of RAM are recommended for smooth real-time transcription. macOS and Linux are not currently supported — the WASAPI loopback capture is a Windows-specific API.",
  },
  {
    q: 'Does ARIA store my interview audio or transcripts?',
    a: "By default, all transcripts are processed in-memory and discarded when the session ends. If you enable session history (optional), transcripts are stored encrypted on your local machine only — nothing is uploaded to ARIA servers. Audio is never stored or transmitted; only the text transcript is sent to the AI provider.",
  },
  {
    q: 'Can I use my own OpenAI or DeepSeek API key?',
    a: "Yes. Pro and Lifetime plan users can bring their own API key for OpenAI (GPT-4o) or DeepSeek (R1 / V3). This lets you keep costs predictable, use your existing enterprise agreements, and ensure your data is covered by your own API provider's terms. ARIA's bundled API credits are also available as a convenience option.",
  },
  {
    q: 'How does the 14-day free trial work?',
    a: "You can download and use ARIA Pro for 14 days with no credit card required. At the end of the trial period, you'll be prompted to choose a plan. If you don't subscribe, ARIA will stop working — no charge, no hassle. Trial sessions are limited to 10 per week to prevent abuse.",
  },
  {
    q: 'What is the refund policy?',
    a: "We offer a 30-day money-back guarantee on all monthly and annual plans. If ARIA doesn't work for your setup or you're not satisfied for any reason, contact support within 30 days of purchase and we'll issue a full refund. Lifetime deals have a 14-day refund window from the date of purchase.",
  },
  {
    q: 'Does ARIA work with coding interview platforms like LeetCode or HackerRank?',
    a: "Yes. ARIA's code-question support mode (Pro plan) recognizes when a coding problem is being read aloud or displayed, and provides structured hints — time/space complexity, algorithm approach, edge cases — without writing the code for you. This keeps your answer authentic while ensuring you don't blank on the approach.",
  },
  {
    q: 'How do I add my resume to ARIA?',
    a: "In the ARIA desktop app, navigate to Profile → Resumes and upload a PDF or paste your resume text. ARIA will parse and index your experience, skills, education, and projects. You can store up to 1 resume on Starter and 5 on Pro, allowing you to switch profiles for different interview types (e.g., one for SWE roles, one for EM roles).",
  },
  {
    q: 'How is ARIA different from Ntro.io?',
    a: "Ntro.io is a Chrome extension — it runs inside your browser and is therefore visible to screen-share tools and browser extension audits. ARIA is a native Windows application that captures audio at the OS layer, making it completely invisible to video call software. ARIA also supports offline/local AI models, costs less ($19/mo vs $29/mo), offers WASAPI dual-stream capture, and includes a lifetime deal option.",
  },
  {
    q: 'Will ARIA work if my interviewer uses a different platform (Zoom vs Teams vs Meet)?',
    a: "Yes. Because ARIA captures audio from your system's audio output — not from within a specific app — it works with any video call platform: Zoom, Microsoft Teams, Google Meet, Webex, BlueJeans, Discord, and any other app that routes audio through Windows. No platform-specific integrations or permissions are needed.",
  },
  {
    q: 'Is using AI assistance during interviews ethical?',
    a: "This is a personal decision. ARIA is a tool, like spell-check or a calculator — it's designed to reduce interview anxiety and help you articulate your genuine experience more clearly. ARIA does not fabricate experience you don't have; it helps you retrieve and present your real background under pressure. Many users find it levels the playing field against candidates who have interview coaches or insider knowledge.",
  },
  {
    q: 'Can multiple people use one ARIA license?',
    a: "ARIA licenses are per-user, not per-device. A single license can be activated on up to 2 devices (Starter/Pro) or 5 devices (Lifetime). Sharing credentials with other users violates the Terms of Service and will result in account suspension. Team plans with shared billing are on the roadmap.",
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Log in to your ARIA account, go to Settings → Billing, and click "Cancel subscription." Your access will continue until the end of the current billing period. No cancellation fee. If you paid annually, you\'ll receive a prorated refund for unused months if you\'re within the 30-day refund window.',
  },
];
