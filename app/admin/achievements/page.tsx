/**
 * ADMIN ACHIEVEMENTS PAGE
 * 
 * - Server component
 * - Protected by existing admin layout
 * - Fetches achievements for management
 * - Delegates to client component for interactivity
 * - RLS authenticated access
 */

import { createSupabaseServer } from "@/lib/supabase-ssr";
import { AchievementsPageClient } from "./client";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year?: string;
  image_url?: string;
  is_published: boolean;
  created_at: string;
}

export default async function AdminAchievementsPage() {
  const supabase = await createSupabaseServer();

  let achievements: Achievement[] = [];
  let error: string | null = null;

  try {
    const { data, error: fetchError } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      error = "Failed to load achievements";
      console.error("Supabase error:", fetchError);
    } else {
      achievements = data || [];
    }
  } catch (err) {
    error = "An unexpected error occurred";
    console.error("Fetch error:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Achievements Management</h1>
        <p className="text-muted-foreground mt-2">
          Create, edit, publish, and manage achievements.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
          {error}
        </div>
      )}

      <AchievementsPageClient initialAchievements={achievements} />
    </div>
  );
}
