"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-ssr";
import { fetchMedia, type MediaItem } from "@/lib/media-upload";
import { MediaManager } from "@/components/admin/media-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    event_date: string;
    location: string;
    image_url?: string;
    is_published: boolean;
  };
  onSuccess?: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [title, setTitle] = useState(event?.title || "");
  const [slug, setSlug] = useState(event?.slug || "");
  const [description, setDescription] = useState(event?.description || "");
  const [eventDate, setEventDate] = useState(event?.event_date || "");
  const [location, setLocation] = useState(event?.location || "");
  const [isPublished, setIsPublished] = useState(event?.is_published ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [eventId, setEventId] = useState<string | null>(event?.id || null);

  const isEditing = !!event?.id;

  // Load existing media when editing
  const loadMedia = useCallback(async (id: string) => {
    const media = await fetchMedia(id, "event", supabase);
    setExistingMedia(media);
  }, [supabase]);

  useEffect(() => {
    if (event?.id) {
      loadMedia(event.id);
    }
  }, [event?.id, loadMedia]);

  const handleMediaUpdate = (media: MediaItem[]) => {
    setExistingMedia(media);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!eventDate) {
      setError("Event date is required");
      return;
    }
    if (!location.trim()) {
      setError("Location is required");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare event data
      const eventData = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        event_date: eventDate,
        location: location.trim(),
        image_url: "", // Deprecated field, keeping for backward compatibility
        is_published: isPublished,
      };

      let result;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", event!.id);

        if (updateError) {
          setError(updateError.message || "Failed to update event");
          setIsLoading(false);
          return;
        }

        result = { success: true, message: "Event updated successfully" };
        
        // Refresh after short delay for edits
        setSuccess(result.message);
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1000);
      } else {
        const { data: newEvent, error: insertError } = await supabase
          .from("events")
          .insert([eventData])
          .select()
          .single();

        if (insertError || !newEvent) {
          setError(insertError?.message || "Failed to create event");
          setIsLoading(false);
          return;
        }

        result = { success: true, message: "Event created successfully" };
        
        // Set event ID so MediaManager can upload
        setEventId(newEvent.id);
        setSuccess(`${result.message} You can now upload media below.`);
        
        // Clear form fields
        setTitle("");
        setSlug("");
        setDescription("");
        setEventDate("");
        setLocation("");
        setIsPublished(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            placeholder="event-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isLoading}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date *</Label>
            <Input
              id="eventDate"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="Event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-input"
            />
            <Label htmlFor="isPublished" className="mb-0 cursor-pointer">
              Publish event
            </Label>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
        </Button>
      </form>

      {/* Media Manager Section */}
      <div className="border-t border-gray-700 pt-8">
        <MediaManager
          parentId={eventId}
          parentType="event"
          existingMedia={existingMedia}
          onMediaUpdate={handleMediaUpdate}
        />
      </div>
    </div>
  );
}
