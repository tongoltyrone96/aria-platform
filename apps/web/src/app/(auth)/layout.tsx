import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6">
        <Link href="/" className="text-brand-500 font-bold text-xl tracking-tight">
          ARIA
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
      <footer className="p-6 text-center text-sm text-muted-foreground">
        © 2026 ARIA AI ·{' '}
        <Link href="/terms" className="hover:underline">Terms</Link> ·{' '}
        <Link href="/privacy" className="hover:underline">Privacy</Link>
      </footer>
    </div>
  );
}
