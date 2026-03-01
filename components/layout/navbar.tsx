"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowser } from "@/lib/supabase-ssr";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/achievements", label: "Achievements" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const supabase = await createSupabaseBrowser();
        
        // Use getUser() for secure authentication check
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setIsAdmin(false);
          setIsLoadingAuth(false);
          return;
        }

        // Check if user exists in public.admins table
        const { data: adminRecord, error: adminError } = await supabase
          .from("admins")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        const isAdminUser = !adminError && !!adminRecord;

        setIsAdmin(isAdminUser);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-primary/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT SECTION: Brand Block */}
          <Link href="/" className="flex items-center gap-4 group">
            {/* College Emblem */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src="/assets/college-emblem.png"
                alt="HKBK College of Engineering"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* IEEE CS Text Block */}
            <div className="hidden sm:flex flex-col justify-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                IEEE Computer Society
              </p>
              <h1 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                HKBK Student Chapter
              </h1>
            </div>

            {/* Mobile shortened text */}
            <div className="flex sm:hidden flex-col justify-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                IEEE CS
              </p>
              <h1 className="text-sm font-semibold text-foreground">HKBK</h1>
            </div>
          </Link>

          {/* RIGHT SECTION: Navigation */}
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                
                {/* Underline animation */}
                <span
                  className={cn(
                    "absolute bottom-1 left-3 right-3 h-0.5 bg-primary transition-all duration-200 rounded-full",
                    pathname === link.href ? "w-[calc(100%-24px)]" : "w-0 group-hover:w-[calc(100%-24px)]"
                  )}
                />
              </Link>
            ))}

            {/* Admin Dashboard Link - Only visible for admins */}
            {!isLoadingAuth && isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group flex items-center gap-2",
                  pathname.startsWith("/admin")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                Admin
                
                {/* Underline animation */}
                <span
                  className={cn(
                    "absolute bottom-1 left-3 right-3 h-0.5 bg-primary transition-all duration-200 rounded-full",
                    pathname.startsWith("/admin") ? "w-[calc(100%-24px)]" : "w-0 group-hover:w-[calc(100%-24px)]"
                  )}
                />
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary/20 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/40">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Dashboard Link - Only visible for admins on mobile */}
            {!isLoadingAuth && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin Dashboard
                </div>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
