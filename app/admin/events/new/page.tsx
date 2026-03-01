"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-ssr";
import { generateSlug } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState("");

  // Generate slug whenever title changes
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (value.trim()) {
      setSlug(generateSlug(value));
    } else {
      setSlug("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ===== VALIDATION =====
    console.log("\n📋 === EVENT CREATION ===");
    console.log("Timestamp:", new Date().toISOString());

    // Validate required fields
    if (!title.trim()) {
      setError("Title is required");
      setLoading(false);
      console.log("❌ Validation failed: Title is empty");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      setLoading(false);
      console.log("❌ Validation failed: Description is empty");
      return;
    }

    if (!eventDate) {
      setError("Event date is required");
      setLoading(false);
      console.log("❌ Validation failed: Event date is empty");
      return;
    }

    if (!location.trim()) {
      setError("Location is required");
      setLoading(false);
      console.log("❌ Validation failed: Location is empty");
      return;
    }

    if (!slug) {
      setError("Could not generate slug from title");
      setLoading(false);
      console.log("❌ Validation failed: Slug generation failed");
      return;
    }

    // ===== LOGGING =====
    console.log("\n✅ Validation passed");
    console.log("  Title:", title);
    console.log("  Slug:", slug);
    console.log("  Description length:", description.length, "characters");
    console.log("  Event Date:", eventDate);
    console.log("  Location:", location);
    console.log("  Image URL:", imageUrl || "(not provided)");
    console.log("  Published:", isPublished);

    try {
      // ===== PREPARE DATA =====
      console.log("\n📤 Preparing event data for Supabase...");
      const eventData = {
        title: title.trim(),
        slug: slug,
        description: description.trim(),
        event_date: eventDate,
        location: location.trim(),
        image_url: imageUrl.trim() || null,
        is_published: isPublished,
        created_at: new Date().toISOString(),
      };

      console.log("Event data to insert:");
      console.log(JSON.stringify(eventData, null, 2));

      // ===== INSERT TO SUPABASE =====
      console.log("\n🌐 Inserting event into Supabase...");
      const { data, error: insertError } = await supabase
        .from("events")
        .insert([eventData])
        .select();

      if (insertError) {
        console.log("\n❌ Supabase insert error:");
        console.log("  Message:", insertError.message);
        console.log("  Code:", (insertError as unknown as Record<string, unknown>).code);
        console.log("  Status:", (insertError as unknown as Record<string, unknown>).status);
        console.log("  Full error:", JSON.stringify(insertError, null, 2));

        setError(insertError.message || "Failed to create event");
        setLoading(false);
        console.log("\n❌ Event creation failed");
        console.log("=== END EVENT CREATION ===\n");
        return;
      }

      // ===== SUCCESS =====
      console.log("\n✅ Event created successfully!");
      console.log("  Inserted rows:", data?.length || 0);
      if (data && data.length > 0) {
        console.log("  Event ID:", (data[0] as unknown as Record<string, unknown>).id);
        console.log("  Full response:", JSON.stringify(data[0], null, 2));
      }

      console.log("\n🔄 Redirecting to admin dashboard...");
      console.log("=== END EVENT CREATION ===\n");

      // Redirect to admin page
      router.push("/admin");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      console.log("\n⚠️ Exception during event creation:");
      console.log("  Name:", error.name);
      console.log("  Message:", error.message);
      console.log("  Stack:", error.stack);

      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      console.log("\n❌ Event creation failed with exception");
      console.log("=== END EVENT CREATION ===\n");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Create Event</h1>
          <p className="text-muted-foreground">
            Add a new event to the IEEE Computer Society calendar
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Fill in the event information below. Fields marked with * are
              required.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium block">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., AI Workshop 2026"
                  required
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {slug && (
                  <p className="text-xs text-muted-foreground">
                    Slug: <code className="bg-muted px-2 py-1 rounded">{slug}</code>
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium block"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of the event..."
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                />
              </div>

              {/* Event Date Field */}
              <div className="space-y-2">
                <label htmlFor="eventDate" className="text-sm font-medium block">
                  Event Date *
                </label>
                <input
                  id="eventDate"
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium block">
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Main Auditorium, HKBK Campus"
                  required
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Image URL Field */}
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium block">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">
                  Optional. Must be a valid HTTPS URL.
                </p>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <input
                  id="isPublished"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded border border-input cursor-pointer"
                />
                <label htmlFor="isPublished" className="cursor-pointer flex-1">
                  <p className="font-medium text-sm">Publish this event</p>
                  <p className="text-xs text-muted-foreground">
                    Event will be visible on the public calendar if enabled
                  </p>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Event...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Helper Text */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border/50">
          <h3 className="font-semibold text-sm mb-2">📝 Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• The slug is automatically generated from your title</li>
            <li>• Use HTTPS for image URLs for security</li>
            <li>• Toggle publish to control visibility</li>
            <li>• All required fields are marked with an asterisk (*)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
