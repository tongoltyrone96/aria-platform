import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Installation - ARIA Docs' };

export default function InstallPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Installation</h1>

      <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 text-sm">
        <strong>Requirements:</strong> Windows 10 / 11 (64-bit), 4 GB RAM, internet connection.
      </div>

      <h2 className="text-xl font-semibold">Step 1 - Download</h2>
      <p>Go to your <a href="/dashboard" className="text-brand-500 hover:underline">dashboard</a> and click <strong>Download ARIA for Windows</strong>. Save the <code>.exe</code> installer.</p>

      <h2 className="text-xl font-semibold">Step 2 - Run the installer</h2>
      <p>Double-click the downloaded file. If Windows Defender SmartScreen appears, click <strong>More info → Run anyway</strong>. (ARIA is code-signed; SmartScreen warns on new publishers.)</p>

      <h2 className="text-xl font-semibold">Step 3 - Activate your license</h2>
      <p>On first launch, ARIA will ask for your license key. Copy it from the email we sent you (or from <a href="/dashboard" className="text-brand-500 hover:underline">your dashboard</a>) and paste it in.</p>

      <h2 className="text-xl font-semibold">Step 4 - Upload your resume & JD</h2>
      <p>Go to the <strong>Profile</strong> tab. Upload your resume (PDF or DOCX) and paste the job description for the role you are interviewing for.</p>

      <h2 className="text-xl font-semibold">Step 5 - Start a session</h2>
      <p>Click <strong>Start Session</strong>. ARIA will capture both your microphone and system audio (WASAPI loopback) and begin transcribing. Press <kbd>Ctrl+Alt+A</kbd> at any time to trigger an answer.</p>

      <h2 className="text-xl font-semibold">Troubleshooting</h2>
      <p>See the <a href="/docs/troubleshooting" className="text-brand-500 hover:underline">Troubleshooting guide</a> if you run into issues.</p>
    </article>
  );
}
