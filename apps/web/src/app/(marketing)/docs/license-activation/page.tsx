import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'License Activation — ARIA Docs' };

export default function LicenseActivationPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">License Activation</h1>

      <p>Your license key is sent by email after purchase. It looks like: <code>sk_live_a3f29c8b45d6e7f1...</code></p>

      <h2 className="text-xl font-semibold">Activating ARIA</h2>
      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
        <li>Open ARIA. The activation screen appears on first launch.</li>
        <li>Paste your license key and click <strong>Activate</strong>.</li>
        <li>ARIA connects to our server to verify the key and your hardware fingerprint.</li>
        <li>Once verified, a device JWT is stored securely using Windows DPAPI.</li>
        <li>You will not need to enter the key again on this machine.</li>
      </ol>

      <h2 className="text-xl font-semibold">Device limits</h2>
      <p>Each license allows activation on a limited number of machines (Starter: 1 device, Pro: 2 devices). To activate a new machine, go to <a href="/dashboard/devices" className="text-brand-500 hover:underline">Devices</a> in your dashboard and revoke an existing device first.</p>

      <h2 className="text-xl font-semibold">Offline grace period</h2>
      <p>ARIA works offline for up to 7 days. Every 4 hours it silently validates your license in the background. After 7 days offline, paid features are paused until connectivity is restored.</p>
    </article>
  );
}
