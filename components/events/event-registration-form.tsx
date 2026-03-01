"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-ssr";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  User,
  BookOpen,
  ChevronDown,
} from "lucide-react";

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
}

export function EventRegistrationForm({
  eventId,
  eventTitle,
  onSuccess,
}: EventRegistrationFormProps) {
  const supabase = createSupabaseBrowser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [usn, setUsn] = useState("");
  const [branch, setBranch] = useState("");
  const [company, setCompany] = useState(""); // Honeypot field

  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setUsn("");
    setBranch("");
    setCompany("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSuccessMessage("");
    setLoading(true);

    // Check honeypot field (silent rejection if filled)
    if (company && company.trim().length > 0) {
      // Treat as success to not reveal honeypot to bots
      setSuccess(true);
      setSuccessMessage("You are successfully registered.");
      resetForm();
      setIsExpanded(false);
      setLoading(false);

      if (onSuccess) {
        onSuccess();
      }
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        event_id: eventId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        usn: usn.trim() || null,
        branch: branch.trim() || null,
        company: company.trim() || null, // Include honeypot in data (will be handled server-side if needed)
      };

      const { error: insertError } = await supabase
        .from("registrations")
        .insert([registrationData]);

      if (insertError) {
        if (
          insertError.code === "23505" ||
          insertError.message.toLowerCase().includes("duplicate")
        ) {
          setError(
            "You've already registered for this event with this email address."
          );
        } else if (
          insertError.code === "429" ||
          insertError.message.toLowerCase().includes("rate")
        ) {
          setError("Too many registrations. Please try again later.");
        } else {
          setError("Failed to register. Please try again.");
        }

        setLoading(false);
        return;
      }

      setSuccess(true);
      setSuccessMessage("You are successfully registered.");
      resetForm();
      setIsExpanded(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {success && successMessage && (
        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      <Button
        type="button"
        className="w-full gap-2"
        size="lg"
        onClick={() => {
          setError("");
          setSuccess(false);
          setSuccessMessage("");
          setIsExpanded((prev) => !prev);
        }}
        aria-expanded={isExpanded}
        aria-controls="event-registration-panel"
      >
        Register Now
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </Button>

      <div
        id="event-registration-panel"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[720px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="reg-name" className="text-sm font-medium block">
              Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reg-email" className="text-sm font-medium block">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reg-usn" className="text-sm font-medium block">
              USN (Optional)
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="reg-usn"
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="e.g., 1BK20CS001"
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reg-branch" className="text-sm font-medium block">
              Branch (Optional)
            </label>
            <select
              id="reg-branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select your branch...</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Science">Information Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            No login required. We&rsquo;ll never share your information.
          </p>
          <p className="text-xs text-muted-foreground text-center truncate" title={eventTitle}>
            Event: {eventTitle}
          </p>
        </form>
      </div>
    </div>
  );
}
