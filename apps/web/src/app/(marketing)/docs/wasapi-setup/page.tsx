import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'WASAPI Setup - ARIA Docs' };

export default function WasapiSetupPage() {
  const steps = [
    {
      heading: 'Open Windows Sound settings',
      body: ‘Right-click the speaker icon in the system tray and select Open Sound settings, or go to Settings → System → Sound.’,
    },
    {
      heading: 'Enable recording devices',
      body: 'Scroll to the Input section and click More sound settings. In the classic Sound panel, go to the Recording tab. Right-click an empty area and make sure Show Disabled Devices is checked.',
    },
    {
      heading: 'Enable Stereo Mix (if available)',
      body: 'If you see Stereo Mix in the list, right-click it and select Enable. Set it as the default recording device. This is the simplest option for most consumer hardware.',
    },
    {
      heading: 'Select your device in ARIA',
      body: ‘Open ARIA → Settings → Audio. Under System Audio Capture, choose the same output device (speakers or headphones) that your video call plays through. ARIA uses WASAPI loopback on that device.’,
    },
    {
      heading: 'Test the capture',
      body: 'Click Test Capture in the ARIA audio settings. Play a video or audio clip on your computer. You should see the waveform indicator move. If it does, ARIA is capturing system audio correctly.',
    },
  ];

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">WASAPI Setup</h1>
      <p className="text-muted-foreground">
        ARIA uses <strong>Windows Audio Session API (WASAPI) loopback</strong> to capture your system audio - including
        the interviewer's voice - with zero additional processes and no visible recording indicators.
        This page explains how to configure it correctly.
      </p>

      <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 text-sm">
        <strong>Why WASAPI?</strong> Unlike virtual audio cables or third-party drivers, WASAPI loopback is a
        native Windows API. It leaves no extra processes in Task Manager and produces no audio artifacts that
        a meeting platform can detect.
      </div>

      <h2 className="text-xl font-semibold">Setup steps</h2>
      <ol className="space-y-5">
        {steps.map(({ heading, body }, i) => (
          <li key={heading} className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-500/10 text-brand-500 text-sm font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-sm">{heading}</p>
              <p className="text-sm text-muted-foreground mt-1">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="text-xl font-semibold">Supported configurations</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Setup</th>
              <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Works?</th>
              <th className="text-left py-2 font-semibold text-muted-foreground">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              ['Speakers / headphones (default)', '✅ Yes', 'WASAPI loopback on default output'],
              ['USB headset with own sound card', '✅ Yes', 'Select the USB device in ARIA audio settings'],
              ['Bluetooth headphones', '⚠️ Usually', 'Some BT stacks have loopback restrictions; test first'],
              ['Virtual audio cable (e.g. VB-Cable)', '✅ Yes', 'Route call audio through the virtual device'],
              ['Exclusive mode applications', '⚠️ Limited', 'Disable exclusive mode in device Properties → Advanced'],
            ].map(([setup, works, notes]) => (
              <tr key={setup as string}>
                <td className="py-2 pr-4">{setup}</td>
                <td className="py-2 pr-4">{works}</td>
                <td className="py-2 text-muted-foreground">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold">Troubleshooting audio issues</h2>
      <div className="space-y-4">
        {[
          {
            q: 'No audio captured - waveform flat',
            a: 'Make sure ARIA is set to loopback the same device your call audio plays through. Check that the device is not muted in Windows Volume Mixer.',
          },
          {
            q: 'Choppy or delayed transcription',
            a: 'Close other applications using the audio device. Set the audio device sample rate to 44100 Hz in Device Properties → Advanced.',
          },
          {
            q: 'ARIA only captures microphone, not system audio',
            a: "Verify the device selected in ARIA → Settings → Audio is an output device (playback), not an input (recording) device.",
          },
        ].map(({ q, a }) => (
          <div key={q} className="border border-border rounded-xl p-4">
            <p className="font-semibold text-sm">{q}</p>
            <p className="text-sm text-muted-foreground mt-2">{a}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Still having trouble? See the{' '}
        <a href="/docs/troubleshooting" className="text-brand-500 hover:underline">Troubleshooting guide</a> or email{' '}
        <a href="mailto:contact@ariainterview.com" className="text-brand-500 hover:underline">contact@ariainterview.com</a>.
      </p>
    </article>
  );
}
