export interface FAQItem {
  q: string;
  a: string;
}

export const allFAQs: FAQItem[] = [
  {
    q: 'What is ARIA and how does it work?',
    a: "ARIA is a real-time AI communication assistant for Windows. During meetings, interviews, and calls, ARIA listens to the conversation using your system's audio and microphone, then delivers personalized AI suggestions grounded in your resume and experience — in under 1 second. Think of it as a personal communication coach available whenever you need it.",
  },
  {
    q: 'How does the dual-stream audio capture work?',
    a: "ARIA uses the Windows Audio Session API (WASAPI) in loopback mode to capture the audio your speakers are playing — i.e., the other person's voice coming through the call. Simultaneously, your microphone input is captured via a separate stream. Both are transcribed and merged into a timestamped conversation log that the AI uses to generate accurate, context-aware suggestions.",
  },
  {
    q: 'Does ARIA work with VPNs and corporate networks?',
    a: "Yes. Because ARIA captures audio at the Windows system audio layer — not via a browser extension — it works reliably across different network configurations. The only outbound traffic is standard HTTPS requests to the AI provider (OpenAI or DeepSeek).",
  },
  {
    q: 'What Windows versions are supported?',
    a: "ARIA supports Windows 10 (version 1903 and later) and Windows 11. A 64-bit processor and at least 8 GB of RAM are recommended for smooth real-time transcription. macOS and Linux are not currently supported — the WASAPI audio capture is a Windows-specific API.",
  },
  {
    q: 'Does ARIA store my audio or transcripts?',
    a: "By default, all transcripts are processed in-memory and discarded when the session ends. If you enable session history (optional), transcripts are stored encrypted on your local machine only — nothing is uploaded to ARIA servers. Audio is never stored or transmitted; only the text transcript is sent to the AI provider.",
  },
  {
    q: 'Can I use my own OpenAI or DeepSeek API key?',
    a: "Yes. Pro and Lifetime plan users can bring their own API key for OpenAI (GPT-4o) or DeepSeek (R1 / V3). This lets you keep costs predictable, use your existing enterprise agreements, and ensure your data is covered by your own API provider's terms. ARIA's bundled API credits are also available as a convenience option.",
  },
  {
    q: 'How does the free plan work?',
    a: "You can download and use ARIA on the Free plan with no credit card required. The free plan includes a limited number of sessions per week so you can evaluate the product. If you need more, you can upgrade to a paid plan at any time. No automatic charges.",
  },
  {
    q: 'What is the refund policy?',
    a: "We offer a 30-day money-back guarantee on all monthly and annual plans. If ARIA doesn't work for your setup or you're not satisfied for any reason, contact support within 30 days of purchase and we'll issue a full refund. Lifetime deals have a 14-day refund window from the date of purchase.",
  },
  {
    q: 'Does ARIA work with coding interview platforms like LeetCode or HackerRank?',
    a: "Yes. ARIA's code-question support mode (Pro plan) recognizes when a coding problem is being read aloud or displayed, and provides structured hints — time/space complexity, algorithm approach, edge cases — to help you think through the problem clearly.",
  },
  {
    q: 'How do I add my resume to ARIA?',
    a: "In the ARIA desktop app, navigate to Profile → Resumes and upload a PDF or paste your resume text. ARIA will parse and index your experience, skills, education, and projects. You can store up to 1 resume on Starter and 5 on Pro, allowing you to switch profiles for different contexts (e.g., one for engineering roles, one for management roles).",
  },
  {
    q: 'How is ARIA different from Ntro.io?',
    a: "Ntro.io is a Chrome extension — it runs inside your browser and relies on browser audio APIs. ARIA is a native Windows application that captures audio at the OS level using WASAPI, providing more reliable audio capture across all call platforms. ARIA also processes data locally for privacy, costs less ($19/mo vs $29/mo), and includes a lifetime deal option.",
  },
  {
    q: 'Will ARIA work if my interviewer uses a different platform (Zoom vs Teams vs Meet)?',
    a: "Yes. Because ARIA captures audio from your system's audio output — not from within a specific app — it works with any video call platform: Zoom, Microsoft Teams, Google Meet, Webex, BlueJeans, Discord, and any other app that routes audio through Windows. No platform-specific integrations or permissions are needed.",
  },
  {
    q: 'Is ARIA appropriate for professional use?',
    a: "ARIA is designed as a professional productivity tool — similar to how Grammarly helps with writing or Otter.ai helps with meeting notes. It helps you articulate your genuine experience more clearly and reduces the anxiety of high-stakes conversations. Users are responsible for ensuring their use complies with any third-party terms applicable to their context. Please review our Acceptable Use Policy for details.",
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
