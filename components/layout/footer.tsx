import Link from "next/link";
import { Linkedin, Instagram, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  CS
                </span>
              </div>
              <span className="font-bold text-lg">IEEE Computer Society</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This is the official website of the IEEE Computer Society Student
              Chapter. Advancing technology for humanity through professional
              development, technical excellence, and community engagement.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/ieee-computer-society-hkbkce/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/ieeecs_hkbkce?igsh=MzBxeHdqdngycnNt&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/achievements"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Achievements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:hkbk.cs.ieee@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  hkbk.cs.ieee@gmail.com
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Send us a message →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} IEEE Computer Society Student Chapter. All rights
            reserved.
          </p>
          <p className="mt-2">
            Part of the{" "}
            <a
              href="https://www.ieee.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Institute of Electrical and Electronics Engineers (IEEE)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
