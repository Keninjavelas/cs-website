/**
 * PUBLIC ACHIEVEMENTS PAGE
 * 
 * - Server component
 * - Fetches only published achievements from Supabase
 * - Fetches associated media gallery for each achievement
 * - Shows founding state if none exist
 * - Renders clean achievement cards with media galleries
 * - RLS protected: only public data visible
 */

import { createSupabaseServer } from "@/lib/supabase-ssr";
import { Sparkles } from "lucide-react";
import { MediaGallery } from "@/components/media-gallery";
import { type MediaItem } from "@/lib/media-upload";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year?: string;
  image_url?: string;
  is_published: boolean;
  created_at: string;
  media?: MediaItem[];
}

export default async function AchievementsPage() {
  const supabase = await createSupabaseServer();

  let achievements: Achievement[] = [];
  let error: string | null = null;

  try {
    const { data, error: fetchError } = await supabase
      .from("achievements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (fetchError) {
      error = "Failed to load achievements";
      console.error("Supabase error:", fetchError);
    } else {
      achievements = data || [];
      
      // Fetch media for each achievement
      for (const achievement of achievements) {
        const { data: mediaData } = await supabase
          .from("media")
          .select("*")
          .eq("achievement_id", achievement.id)
          .order("display_order", { ascending: true });
        
        achievement.media = mediaData || [];
      }
    }
  } catch (err) {
    error = "An unexpected error occurred";
    console.error("Fetch error:", err);
  }

  const isEmpty = achievements.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Achievements</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Celebrating milestones and accomplishments of IEEE Computer Society.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-center">
          {error}
        </div>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Journey Begins</h2>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            As a newly established IEEE Computer Society Student Chapter, our
            achievements are yet to unfold. Stay connected as we build milestones
            together.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="rounded-lg overflow-hidden border border-border bg-card hover:border-primary/50 transition-colors"
            >
              {/* Media Gallery */}
              {achievement.media && achievement.media.length > 0 && (
                <div className="relative w-full">
                  <MediaGallery media={achievement.media} />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>

                {achievement.year && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.year}
                  </p>
                )}

                <p className="text-foreground/80 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
