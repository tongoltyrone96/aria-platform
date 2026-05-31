import { Separator } from "./ui/separator";
import { Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const inactiveFooterLinkClass = "hover:text-primary-foreground transition-colors text-left";

  return (
    <footer id="site-footer" className="bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Aria</span>
            </div>
            <p className="text-primary-foreground/80">
              Your AI interview co-pilot. Real-time assistance, complete privacy, zero detection.
            </p>
            <div className="flex space-x-4">
              <button type="button" aria-label="LinkedIn" className="text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <Linkedin className="w-4 h-4" />
              </button>
              <button type="button" aria-label="Twitter" className="text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <Twitter className="w-4 h-4" />
              </button>
              <button type="button" aria-label="GitHub" className="text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <Github className="w-4 h-4" />
              </button>
              <button type="button" aria-label="YouTube" className="text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <Youtube className="w-4 h-4" />
              </button>
              <button type="button" aria-label="Instagram" className="text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <Instagram className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary-foreground">Product</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">Features</a></div>
              <div><a href="#pricing" className="hover:text-primary-foreground transition-colors">Pricing</a></div>
              <div><a href="/downloads/AriaSetup.exe" download className="hover:text-primary-foreground transition-colors">Download</a></div>
              <div><button type="button" className={inactiveFooterLinkClass}>System Requirements</button></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary-foreground">Support</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div><a href="#faq" className="hover:text-primary-foreground transition-colors">FAQ</a></div>
              <div><button type="button" className={inactiveFooterLinkClass}>Documentation</button></div>
              <div><a href="/dashboard/support" className="hover:text-primary-foreground transition-colors">Contact Support</a></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary-foreground">Legal</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div><a href="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></div>
              <div><a href="/terms-of-service" className="hover:text-primary-foreground transition-colors">Terms of Service</a></div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-primary-foreground/80 text-sm">
            © {new Date().getFullYear()} Aria. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
