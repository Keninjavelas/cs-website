"use client";

import { FormEvent, useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("https://hkbkcsieee.substack.com/api/v1/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok || response.status === 200) {
        setSuccess(true);
        setEmail("");
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError("Subscription failed. Please try again.");
      }
    } catch (err) {
      setError("Subscription failed. Please try again.");
      console.error("Newsletter subscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 shadow-lg backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Mail className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <CardTitle className="text-2xl">Chapter Newsletter</CardTitle>
        <CardDescription className="text-base">
          Stay updated with IEEE CS events, announcements, and technical insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={loading}
              className="w-full px-4 py-3 bg-background/50 border border-blue-500/20 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:from-blue-600/50 disabled:via-indigo-600/50 disabled:to-purple-600/50 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </span>
              ) : success ? (
                <span className="flex items-center justify-center">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Subscribed!
                </span>
              ) : (
                "Subscribe to Newsletter →"
              )}
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-300">
                  Successfully subscribed! Check your inbox.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            📧 We respect your privacy. Unsubscribe at any time. No spam, ever.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
