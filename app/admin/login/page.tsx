"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-ssr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Check if user is already logged in as admin
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const supabase = createSupabaseBrowser();
        const {
          data: { user },
        } = await supabase.auth.getUser();



        if (user) {
          // Check if user is admin via public.admins table
          const { data: adminRecord, error: adminError } = await supabase
            .from("admins")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();



          if (adminRecord) {
            // Already logged in as admin - redirect to dashboard

            router.push("/admin");
            router.refresh();
            return;
          } else {

          }
        } else {
          console.log("❌ No user logged in - showing login form");
        }
        console.log("=== END AUTH CHECK ===\n");
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);



    try {
      const supabase = createSupabaseBrowser();
      if (!supabase?.auth?.signInWithPassword) {
        setError("Authentication service unavailable. Please try again.");
        setLoading(false);
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.log("❌ Sign in error:", signInError.message);
        setError(signInError.message);
        setLoading(false);
        console.log("=== END LOGIN ATTEMPT ===\n");
        return;
      }



      // Check if user is admin via public.admins table
      const { data: adminRecord, error: adminError } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", data.user?.id)
        .maybeSingle();



      if (adminError || !adminRecord) {
        console.log("❌ User is not an admin - denying access");
        setError("Access denied. Admin role required.");
        await supabase.auth.signOut();
        setLoading(false);
        console.log("=== END LOGIN ATTEMPT ===\n");
        return;
      }

      console.log("✅ User is an admin - granting access");
      console.log("=== END LOGIN ATTEMPT ===\n");

      // Success - redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.log("❌ Exception during login:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      console.log("=== END LOGIN ATTEMPT ===\n");
    }
  };

  // Show loading state while checking existing auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
