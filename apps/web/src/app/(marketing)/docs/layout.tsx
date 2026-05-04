import Link from 'next/link';

const DOC_PAGES = [
  { href: '/docs/install', label: 'Installation' },
  { href: '/docs/onboarding', label: 'Getting Started' },
  { href: '/docs/wasapi-setup', label: 'WASAPI Setup' },
  { href: '/docs/license-activation', label: 'License Activation' },
  { href: '/docs/troubleshooting', label: 'Troubleshooting' },
  { href: '/docs/faq', label: 'FAQ' },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border p-6 space-y-1">
        <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-3">Documentation</p>
        {DOC_PAGES.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="block px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 px-8 py-10 max-w-3xl prose prose-neutral dark:prose-invert">
        {children}
      </main>
    </div>
  );
}
