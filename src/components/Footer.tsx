import { Mic } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="section-container py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <Mic className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground tracking-tight">Napster Pulse</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-sm">
              Create and participate in voice-based interviews. Easy, fast, and insightful.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#product-preview"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Account</h4>
            <ul className="space-y-3">
              <li>
                <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/my-plan" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Plan
                </a>
              </li>
            </ul>
            {/* Variant links */}
            <p className="text-[10px] text-muted-foreground/50 mt-3 uppercase tracking-wide">Variants</p>
            <ul className="space-y-1 mt-1">
              <li><a href="/pricing-v2" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">Pricing V2</a></li>
              <li><a href="/pricing-v3" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">Pricing V3</a></li>
              <li><a href="/my-plan-v2" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">My Plan V2</a></li>
              <li><a href="/my-plan-v3" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">My Plan V3</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal & Dev</h4>
            <ul className="space-y-3">
              <li>
                <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">© {currentYear} Napster Pulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
