"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createAchievement, updateAchievement } from "@/lib/actions/achievements";
import { createSupabaseBrowser } from "@/lib/supabase-ssr";
import { fetchMedia, type MediaItem } from "@/lib/media-upload";
import { MediaManager } from "@/components/admin/media-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AchievementFormProps {
  achievement?: {
    id: string;
    title: string;
    description: string;
    year?: string;
    image_url?: string;
    is_published: boolean;
  };
  onSuccess?: () => void;
}

export function AchievementForm({ achievement, onSuccess }: AchievementFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [title, setTitle] = useState(achievement?.title || "");
  const [description, setDescription] = useState(achievement?.description || "");
  const [year, setYear] = useState(achievement?.year || "");
  const [isPublished, setIsPublished] = useState(achievement?.is_published ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [achievementId, setAchievementId] = useState<string | null>(achievement?.id || null);

  const isEditing = !!achievement?.id;

  // Load existing media when editing
  const loadMedia = useCallback(async (id: string) => {
    const media = await fetchMedia(id, "achievement", supabase);
    setExistingMedia(media);
  }, [supabase]);

  useEffect(() => {
    if (achievement?.id) {
      loadMedia(achievement.id);
    }
  }, [achievement?.id, loadMedia]);

  const handleMediaUpdate = (media: MediaItem[]) => {
    setExistingMedia(media);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const result = isEditing
        ? await updateAchievement(achievement!.id, {
            title,
            description,
            year,
            image_url: "", // Deprecated field, keeping for backward compatibility
            is_published: isPublished,
          })
        : await createAchievement({
            title,
            description,
            year,
            image_url: "", // Deprecated field, keeping for backward compatibility
            is_published: isPublished,
          });

      if (result.success) {
        setSuccess(result.message);

        // For new achievements, set the ID so MediaManager can upload
        if (!isEditing && result.achievement?.id) {
          setAchievementId(result.achievement.id);
          setSuccess("Achievement created! You can now upload media below.");
        } else if (isEditing) {
          // For edits, refresh after short delay
          setTimeout(() => {
            onSuccess?.();
            router.refresh();
          }, 1000);
        }

        // Clear form only if not editing
        if (!isEditing) {
          setTitle("");
          setDescription("");
          setYear("");
          setIsPublished(true);
        }
      } else {
        setError(result.message || "An error occurred");
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
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {error}
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
            placeholder="Achievement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Achievement description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isLoading}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              placeholder="e.g., 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
              Publish achievement
            </Label>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : isEditing ? "Update Achievement" : "Create Achievement"}
        </Button>
      </form>

      {/* Media Manager Section */}
      <div className="border-t border-gray-700 pt-8">
        <MediaManager
          parentId={achievementId}
          parentType="achievement"
          existingMedia={existingMedia}
          onMediaUpdate={handleMediaUpdate}
        />
      </div>
    </div>
  );
}

