"use server";

import { createSupabaseServer } from "@/lib/supabase-ssr";
import { revalidatePath } from "next/cache";

interface AchievementInput {
  title: string;
  description: string;
  year?: string;
  image_url?: string;
  is_published?: boolean;
}

interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
  achievement?: { id: string };
}

/**
 * CREATE ACHIEVEMENT
 * - Server action
 * - Authenticated Supabase client
 * - RLS will check admin status via auth.uid() -> public.admins
 */
export async function createAchievement(
  input: AchievementInput
): Promise<ActionResult> {
  try {
    const supabase = await createSupabaseServer();

    // Validate inputs
    if (!input.title?.trim()) {
      return { success: false, message: "Title is required", error: "VALIDATION_ERROR" };
    }
    if (!input.description?.trim()) {
      return { success: false, message: "Description is required", error: "VALIDATION_ERROR" };
    }

    const { data: achievement, error } = await supabase.from("achievements").insert([
      {
        title: input.title.trim(),
        description: input.description.trim(),
        year: input.year?.trim() || null,
        image_url: input.image_url?.trim() || null,
        is_published: input.is_published ?? true,
      },
    ])
    .select()
    .single();

    if (error) {
      console.error("Supabase insert error:", error);
      
      // Check for RLS violation
      if (error.message?.includes("row level security")) {
        return {
          success: false,
          message: "Access denied: You are not authorized to create achievements",
          error: "PERMISSION_DENIED",
        };
      }

      return {
        success: false,
        message: error.message || "Failed to create achievement",
        error: error.code || "DB_ERROR",
      };
    }

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");

    return {
      success: true,
      message: "Achievement created successfully",
      achievement: { id: achievement.id },
    };
  } catch (err) {
    console.error("Create achievement error:", err);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "SERVER_ERROR",
    };
  }
}

/**
 * UPDATE ACHIEVEMENT
 * - Server action
 * - Authenticated Supabase client
 * - RLS will check admin status
 */
export async function updateAchievement(
  id: string,
  input: AchievementInput
): Promise<ActionResult> {
  try {
    if (!id) {
      return { success: false, message: "Achievement ID is required", error: "VALIDATION_ERROR" };
    }

    if (!input.title?.trim()) {
      return { success: false, message: "Title is required", error: "VALIDATION_ERROR" };
    }
    if (!input.description?.trim()) {
      return { success: false, message: "Description is required", error: "VALIDATION_ERROR" };
    }

    const supabase = await createSupabaseServer();

    const { error } = await supabase
      .from("achievements")
      .update({
        title: input.title.trim(),
        description: input.description.trim(),
        year: input.year?.trim() || null,
        image_url: input.image_url?.trim() || null,
        is_published: input.is_published ?? true,
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);

      if (error.message?.includes("row level security")) {
        return {
          success: false,
          message: "Access denied: You are not authorized to update achievements",
          error: "PERMISSION_DENIED",
        };
      }

      return {
        success: false,
        message: error.message || "Failed to update achievement",
        error: error.code || "DB_ERROR",
      };
    }

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");

    return {
      success: true,
      message: "Achievement updated successfully",
    };
  } catch (err) {
    console.error("Update achievement error:", err);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "SERVER_ERROR",
    };
  }
}

/**
 * DELETE ACHIEVEMENT
 * - Server action
 * - Authenticated Supabase client
 * - RLS will check admin status
 */
export async function deleteAchievement(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return { success: false, message: "Achievement ID is required", error: "VALIDATION_ERROR" };
    }

    const supabase = await createSupabaseServer();

    const { error } = await supabase.from("achievements").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);

      if (error.message?.includes("row level security")) {
        return {
          success: false,
          message: "Access denied: You are not authorized to delete achievements",
          error: "PERMISSION_DENIED",
        };
      }

      return {
        success: false,
        message: error.message || "Failed to delete achievement",
        error: error.code || "DB_ERROR",
      };
    }

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");

    return {
      success: true,
      message: "Achievement deleted successfully",
    };
  } catch (err) {
    console.error("Delete achievement error:", err);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "SERVER_ERROR",
    };
  }
}

/**
 * TOGGLE PUBLISH STATUS
 * - Server action
 * - Authenticated Supabase client
 * - RLS will check admin status
 */
export async function togglePublishStatus(
  id: string,
  isPublished: boolean
): Promise<ActionResult> {
  try {
    if (!id) {
      return { success: false, message: "Achievement ID is required", error: "VALIDATION_ERROR" };
    }

    const supabase = await createSupabaseServer();

    const { error } = await supabase
      .from("achievements")
      .update({ is_published: isPublished })
      .eq("id", id);

    if (error) {
      console.error("Supabase toggle error:", error);

      if (error.message?.includes("row level security")) {
        return {
          success: false,
          message: "Access denied: You are not authorized to manage achievements",
          error: "PERMISSION_DENIED",
        };
      }

      return {
        success: false,
        message: error.message || "Failed to update achievement status",
        error: error.code || "DB_ERROR",
      };
    }

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");

    return {
      success: true,
      message: `Achievement ${isPublished ? "published" : "unpublished"} successfully`,
    };
  } catch (err) {
    console.error("Toggle publish error:", err);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "SERVER_ERROR",
    };
  }
}
