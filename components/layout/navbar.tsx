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
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0B1120] backdrop-blur supports-[backdrop-filter]:bg-[#0B1120]/95 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 sm:h-[128px]">
          
          {/* LEFT SECTION: Brand Block */}
          <Link href="/" className="flex items-center gap-4 sm:gap-5 group">
            {/* College Emblem */}
            <div className="relative w-16 h-16 sm:w-[100px] sm:h-[100px] flex-shrink-0 transition-opacity duration-200 group-hover:opacity-90">
              <Image
                src="/assets/college-emblem.png"
                alt="HKBK College of Engineering"
                fill
                sizes="(max-width: 640px) 64px, 100px"
                className="object-contain"
                priority
              />
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-14 sm:h-[88px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

            {/* IEEE CS Chapter Logo */}
            <div className="relative w-16 h-16 sm:w-[100px] sm:h-[100px] flex-shrink-0 transition-opacity duration-200 group-hover:opacity-90">
              <Image
                src="/assets/logo.jpeg"
                alt="IEEE Computer Society Chapter"
                fill
                sizes="(max-width: 640px) 64px, 100px"
                className="object-contain"
                priority
              />
            </div>

            {/* IEEE CS Text Block */}
            <div className="hidden md:flex flex-col justify-center ml-1">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium leading-tight">
                IEEE Computer Society
              </p>
              <h1 className="text-sm font-semibold text-white group-hover:text-primary transition-colors leading-tight">
                HKBK Student Chapter
              </h1>
            </div>

            {/* Tablet shortened text */}
            <div className="hidden sm:flex md:hidden flex-col justify-center ml-1">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium leading-tight">
                IEEE CS
              </p>
              <h1 className="text-sm font-semibold text-white group-hover:text-primary transition-colors leading-tight">HKBK</h1>
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
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:text-white"
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
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:text-white"
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
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
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
        <div className="md:hidden border-t border-white/10 bg-[#0B1120]/98 backdrop-blur">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
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
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
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
