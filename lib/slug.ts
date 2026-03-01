/**
 * Slug Generator Utility
 * 
 * Generates URL-friendly slugs from strings with uniqueness checking.
 */

/**
 * Generate a slug from a title
 * @param title - The original title
 * @param timestamp - Optional timestamp for uniqueness
 * @returns URL-friendly slug
 */
export function generateSlug(title: string, timestamp?: boolean): string {
  // Convert to lowercase and trim
  let slug = title.toLowerCase().trim();

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, "-");

  // Remove special characters (keep only alphanumeric and hyphens)
  slug = slug.replace(/[^a-z0-9-]/g, "");

  // Remove consecutive hyphens
  slug = slug.replace(/-+/g, "-");

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  // Append timestamp for uniqueness if requested
  if (timestamp) {
    const ts = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    slug = `${slug}-${ts}`;
  }

  return slug;
}

/**
 * Validate slug uniqueness (mock implementation)
 * In production, this would check against the database
 */
export async function isSlugUnique(): Promise<boolean> {
  // This is a placeholder - actual implementation would query Supabase
  // For now, we'll assume all slugs are unique since the form will handle it
  return true;
}
