import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left — form panel */}
      <div className="flex flex-col w-full lg:w-1/2 xl:w-2/5 min-h-screen bg-background px-8 py-10 md:px-14">
        {/* Logo */}
        <Link href="/" className="shrink-0 mb-8 block">
          <AnimatedLogo />
        </Link>

        {/* Form content centered in remaining space */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ARIA AI &middot;{' '}
          <Link href="/terms" className="hover:underline">Terms</Link>{' '}
          &middot;{' '}
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </p>
      </div>

      {/* Right — image panel (desktop only) */}
      <div className="hidden lg:block lg:w-1/2 xl:w-3/5 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Log-in.png"
          alt="Aria interview assistant"
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
