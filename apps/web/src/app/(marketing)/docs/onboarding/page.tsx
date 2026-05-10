import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Getting Started — ARIA Docs' };

export default function OnboardingPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Getting Started</h1>
      <p className="text-muted-foreground">
        This guide walks you through your first ARIA session from sign-up to your first AI-assisted answer.
      </p>

      <h2 className="text-xl font-semibold">1. Create your account</h2>
      <p>
        Go to{' '}
        <a href="/signup" className="text-brand-500 hover:underline">
          ariainterview.com/signup
        </a>{' '}
        and register with your work or personal email. Your account is activated immediately{' '}
        {'—'} no email confirmation required.
      </p>

      <h2 className="text-xl font-semibold">2. Start your free plan</h2>
      <p>
        Every new account starts on the <strong>Free plan</strong> {'—'} 10 interview calls
        and 6 AI answers per call per month, no credit card required. You can upgrade at any time
        from the{' '}
        <a href="/dashboard/billing" className="text-brand-500 hover:underline">
          Billing
        </a>{' '}
        page.
      </p>

      <h2 className="text-xl font-semibold">3. Download and install ARIA</h2>
      <p>
        Head to your{' '}
        <a href="/dashboard" className="text-brand-500 hover:underline">
          Dashboard
        </a>{' '}
        and click <strong>Download ARIA for Windows</strong>. Run the installer and follow the
        prompts. See the{' '}
        <a href="/docs/install" className="text-brand-500 hover:underline">
          Installation guide
        </a>{' '}
        for detailed steps.
      </p>

      <h2 className="text-xl font-semibold">4. Activate your license</h2>
      <p>
        On first launch ARIA will prompt you for your license key. Copy it from the welcome email
        or from the <strong>Licenses</strong> section of your dashboard. See{' '}
        <a href="/docs/license-activation" className="text-brand-500 hover:underline">
          License Activation
        </a>{' '}
        for details.
      </p>

      <h2 className="text-xl font-semibold">5. Configure audio capture</h2>
      <p>
        ARIA uses <strong>WASAPI loopback</strong> to capture system audio with zero latency and no
        additional processing overhead. Open the ARIA settings, go to the <strong>Audio</strong>{' '}
        tab, and select your output device (speakers or headphones). ARIA will capture everything
        your interviewer says through that device.
      </p>
      <p>
        For detailed audio setup see the{' '}
        <a href="/docs/wasapi-setup" className="text-brand-500 hover:underline">
          WASAPI Setup guide
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold">6. Add your resume and job description</h2>
      <p>
        Go to the <strong>Profile</strong> tab inside ARIA. Upload your resume (PDF or DOCX) and
        paste in the job description for the role you are interviewing for. ARIA uses this context
        to generate highly relevant, personalised answers.
      </p>

      <h2 className="text-xl font-semibold">7. Run your first session</h2>
      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
        <li>
          Click <strong>Start Session</strong> in ARIA.
        </li>
        <li>Join your video call (Zoom, Teams, Google Meet, etc.) as normal.</li>
        <li>
          When the interviewer asks a question, press{' '}
          <kbd className="bg-muted px-1.5 py-0.5 rounded text-foreground text-xs font-mono">
            Ctrl+Alt+A
          </kbd>{' '}
          to generate an answer.
        </li>
        <li>ARIA will stream a response into the overlay within 1 second.</li>
        <li>Read the answer naturally {'—'} the overlay is visible only on your local display.</li>
      </ol>

      <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 text-sm">
        <strong>Tip:</strong> Rehearse with ARIA before your real interview by doing a mock session
        with a friend or by replaying recorded interviews.
      </div>

      <h2 className="text-xl font-semibold">Next steps</h2>
      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
        <li>
          <a href="/docs/wasapi-setup" className="text-brand-500 hover:underline">
            Fine-tune audio capture
          </a>
        </li>
        <li>
          <a href="/docs/troubleshooting" className="text-brand-500 hover:underline">
            Troubleshooting common issues
          </a>
        </li>
        <li>
          <a href="/docs/faq" className="text-brand-500 hover:underline">
            Frequently asked questions
          </a>
        </li>
      </ul>
    </article>
  );
}
