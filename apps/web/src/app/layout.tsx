import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ARIA — AI Interview Copilot for Windows',
    template: '%s | ARIA',
  },
  description:
    'ARIA listens to your interviews via WASAPI, knows your resume, and gives you spoken answers in under 1 second. Native. Stealth. Smarter than browser extensions.',
  keywords: ['AI interview assistant', 'interview copilot', 'Windows', 'WASAPI', 'DeepSeek'],
  authors: [{ name: 'ARIA AI' }],
  creator: 'ARIA AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.aria-ai.com',
    siteName: 'ARIA',
    title: 'ARIA — AI Interview Copilot for Windows',
    description:
      'Native Windows AI that hears both sides of your interview and answers in real time.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'ARIA AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARIA — AI Interview Copilot for Windows',
    description: 'Native Windows AI that hears both sides of your interview and answers in real time.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
