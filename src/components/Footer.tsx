import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <span className="font-display font-extrabold text-2xl">Aurabites</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              India's favorite healthy snack brand. Premium roasted makhana with authentic flavors and 10g protein per pack.
            </p>
            <div className="flex gap-4">
              <a
                href={CONTACT_INFO.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-background/70 hover:text-background text-sm transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-background/70 hover:text-background text-sm transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-background text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-background text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Policies</h4>
            <ul className="space-y-2">

              <li>
                <Link to="/privacy" className="text-background/70 hover:text-background text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-background/70 hover:text-background text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-background/70 hover:text-background text-sm transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-background/70 hover:text-background text-sm transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{CONTACT_INFO.EMAIL}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-background/70">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{CONTACT_INFO.PHONE}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{CONTACT_INFO.ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-8 text-center">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Aurabites. All rights reserved. Made with 💛 in India.
          </p>
        </div>
      </div>
    </footer>
  );
};
