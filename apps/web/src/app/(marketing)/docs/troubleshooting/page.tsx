import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Troubleshooting — ARIA Docs' };

export default function TroubleshootingPage() {
  const issues = [
    {
      q: 'ARIA cannot capture system audio',
      a: 'Make sure "Stereo Mix" or "WASAPI Loopback" is enabled in Windows Sound settings. Right-click the speaker icon → Sounds → Recording tab → right-click empty area → Show Disabled Devices.',
    },
    {
      q: 'License activation fails',
      a: 'Check your internet connection. If behind a corporate proxy, add api.aria-ai.com to the allowlist. Contact support if the issue persists.',
    },
    {
      q: 'ARIA shows "Device limit reached"',
      a: 'You have activated ARIA on the maximum number of machines for your plan. Go to the Devices page in your dashboard and revoke a device you no longer use.',
    },
    {
      q: 'Answer generation is slow',
      a: 'Expected latency is under 1 second for the first token. If you experience delays >3s, check your network latency to api.aria-ai.com and ensure DeepSeek services are operational (see status.aria-ai.com).',
    },
    {
      q: 'Windows Defender blocks the installer',
      a: 'ARIA is code-signed but SmartScreen warns on newer publishers. Click "More info" then "Run anyway". You can verify the SHA256 hash shown on the download page.',
    },
  ];

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Troubleshooting</h1>
      <div className="space-y-5">
        {issues.map(({ q, a }) => (
          <div key={q} className="border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm">{q}</h3>
            <p className="text-sm text-muted-foreground mt-2">{a}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Still stuck? Email <a href="mailto:support@aria-ai.com" className="text-brand-500 hover:underline">support@aria-ai.com</a>.
      </p>
    </article>
  );
}
