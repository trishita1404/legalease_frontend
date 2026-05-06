import Link from "next/link";
import { Scale } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-50/50">
      <div className="container mx-auto px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight text-primary">
                LegalEase<span className="text-slate-500">+</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering the legal industry with secure, transparent, and efficient case management solutions.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-primary">Security Standards</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><span className="block italic font-medium">Support:</span> support@legalease.com</li>
              <li><span className="block italic font-medium">Sales:</span> sales@legalease.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} LegalEase+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}