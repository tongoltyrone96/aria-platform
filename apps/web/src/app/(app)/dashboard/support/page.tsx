export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="text-muted-foreground text-sm mt-1">Get help from the ARIA team</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a
          href="/docs"
          className="bg-card border border-border rounded-xl p-5 hover:border-brand-500/50 transition-colors group"
        >
          <h2 className="font-semibold group-hover:text-brand-500 transition-colors">Documentation</h2>
          <p className="text-sm text-muted-foreground mt-1">Setup guides, troubleshooting, and API reference</p>
        </a>
        <a
          href="mailto:support@ariainterview.com"
          className="bg-card border border-border rounded-xl p-5 hover:border-brand-500/50 transition-colors group"
        >
          <h2 className="font-semibold group-hover:text-brand-500 transition-colors">Email support</h2>
          <p className="text-sm text-muted-foreground mt-1">support@ariainterview.com Â· Reply within 24h</p>
        </a>
      </div>

      {/* Crisp chat embed placeholder */}
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground text-sm">Live chat powered by Crisp</p>
        <p className="text-xs text-muted-foreground mt-1">Add your Crisp website ID to enable live chat</p>
        {/* TODO: Add Crisp script in layout.tsx: <script>window.$crisp=[];window.CRISP_WEBSITE_ID="YOUR_ID";</script> */}
      </div>
    </div>
  );
}
