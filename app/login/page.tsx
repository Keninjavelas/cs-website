"use client";

import { useState } from "react";
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
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ===== DIAGNOSTIC LOGGING =====
    console.log("\n🔐 === LOGIN ATTEMPT ===");
    console.log("Timestamp:", new Date().toISOString());
    
    // 1. Log input validation
    console.log("\n📋 Input Validation:");
    console.log("  Email defined:", email !== undefined);
    console.log("  Email non-empty:", email.length > 0);
    console.log("  Email value:", email || "(empty)");
    console.log("  Password defined:", password !== undefined);
    console.log("  Password non-empty:", password.length > 0);
    console.log("  Password length:", password.length, "characters");
    
    // 2. Log payload (without password)
    console.log("\n📤 Payload (without password):");
    const payload = {
      email,
      password: password ? "***REDACTED***" : "(empty)",
      grant_type: "password"
    };
    console.log(JSON.stringify(payload, null, 2));

    try {
      // 3. Initialize Supabase client + log before request
      const supabase = createSupabaseBrowser();
      if (!supabase?.auth?.signInWithPassword) {
        setError("Authentication service unavailable. Please try again.");
        setLoading(false);
        console.log("❌ Supabase auth client unavailable");
        console.log("=== END LOGIN ATTEMPT ===\n");
        return;
      }

      console.log("\n🌐 Sending request to Supabase...");
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 4. Log the full response
      console.log("\n📥 Supabase Response Received:");
      console.log("  Timestamp:", new Date().toISOString());
      
      if (signInError) {
        console.log("  Status: ERROR");
        console.log("  Error message:", signInError.message);
        console.log("  Error status:", signInError.status);
        console.log("  Error code:", (signInError as any).code);
        console.log("  Full error object:", JSON.stringify(signInError, null, 2));
        
        // Check for email confirmation requirement
        if (signInError.message?.includes("Email not confirmed") || 
            signInError.message?.includes("email_not_confirmed")) {
          console.log("  ⚠️ Email confirmation required!");
        }
        
        setError(signInError.message);
        setLoading(false);
        console.log("\n❌ Login failed");
        console.log("=== END LOGIN ATTEMPT ===\n");
        return;
      }

      // 5. Log successful response
      console.log("  Status: SUCCESS");
      console.log("  User ID:", data?.user?.id);
      console.log("  User email:", data?.user?.email);
      console.log("  User role:", data?.user?.user_metadata?.role);
      console.log("  Session exists:", !!data?.session);
      console.log("  Access token length:", data?.session?.access_token?.length || 0, "characters");
      console.log("  Full user data:", JSON.stringify({
        id: data?.user?.id,
        email: data?.user?.email,
        metadata: data?.user?.user_metadata,
        confirmed_at: data?.user?.email_confirmed_at
      }, null, 2));

      // Check if user exists in public.admins table
      console.log("\n🔑 Admin Check:");
      console.log("  Querying public.admins table...");
      
      const { data: adminRecord, error: adminError } = await supabase
        .from("admins")
        .select("id")
        .eq("user_id", data.user?.id)
        .single();

      if (adminError || !adminRecord) {
        console.log("  ❌ User is not an admin! Signing out...");
        console.log("  Error:", adminError?.message || "No admin record found");
        setError("Access denied. Admin role required.");
        await supabase.auth.signOut();
        setLoading(false);
        console.log("\n❌ Login denied - insufficient permissions");
        console.log("=== END LOGIN ATTEMPT ===\n");
        return;
      }

      console.log("  ✅ User is an admin!");

      // Success - redirect to admin dashboard
      console.log("\n✅ Authentication successful!");
      console.log("  Redirecting to /admin...");
      console.log("=== END LOGIN ATTEMPT ===\n");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      console.log("\n⚠️ Exception during login:");
      console.log("  Name:", error.name);
      console.log("  Message:", error.message);
      console.log("  Stack:", error.stack);
      console.log("  Full error:", JSON.stringify(error, null, 2));
      
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      console.log("\n❌ Login failed with exception");
      console.log("=== END LOGIN ATTEMPT ===\n");
    }
  };

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
