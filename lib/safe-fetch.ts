/**
 * Safe data fetching utilities for Supabase queries
 * Provides try/catch wrappers and error handling patterns
 */

import { createSupabaseServer } from "@/lib/supabase-ssr";

export interface FetchResult<T> {
  data: T[] | null;
  error: Error | null;
  isEmpty: boolean;
}

/**
 * Safely fetch data from a Supabase table with error handling
 * Returns data, error, and isEmpty flag for consistent UX
 */
export async function safeFetchQuery<T>(
  queryFn: (client: Awaited<ReturnType<typeof createSupabaseServer>>) => Promise<{ data: T[] | null; error: unknown }>
): Promise<FetchResult<T>> {
  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await queryFn(supabase);

    if (error) {
      console.error("Supabase query error:", error);
      return {
        data: null,
        error: new Error("Failed to fetch data"),
        isEmpty: false,
      };
    }

    return {
      data: data || [],
      error: null,
      isEmpty: !data || data.length === 0,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
      isEmpty: false,
    };
  }
}

/**
 * Safely fetch a single item from Supabase
 */
export async function safeFetchSingle<T>(
  queryFn: (client: Awaited<ReturnType<typeof createSupabaseServer>>) => Promise<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await queryFn(supabase);

    if (error) {
      console.error("Supabase query error:", error);
      return {
        data: null,
        error: new Error("Failed to fetch data"),
      };
    }

    return {
      data: data || null,
      error: null,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
    };
  }
}

/**
 * Format error message for display to users
 */
export function getErrorMessage(error: Error | null): string {
  if (!error) return "";

  const message = error.message.toLowerCase();

  if (
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("failed to fetch")
  ) {
    return "Connection error. Please check your internet connection and try again.";
  }

  if (message.includes("unauthorized") || message.includes("401")) {
    return "You don't have permission to view this content.";
  }

  if (message.includes("not found") || message.includes("404")) {
    return "The requested content could not be found.";
  }

  return "Something went wrong. Please try again later.";
}
