import type { MetadataRoute } from "next";
import { createSupabaseServer } from "@/lib/supabase-ssr";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ieee-cs-hkbk.vercel.app";
  const supabase = await createSupabaseServer();

  // Fetch published events
  const { data: events } = await supabase
    .from("events")
    .select("slug, updated_at")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  // Fetch published announcements
  const { data: announcements } = await supabase
    .from("announcements")
    .select("slug, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/membership`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  // Dynamic event pages
  const eventPages =
    events?.map((event: { slug: string; updated_at?: string }) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: new Date(event.updated_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  // Dynamic announcement pages
  const announcementPages =
    announcements?.map((announcement: { slug: string; created_at: string }) => ({
      url: `${baseUrl}/announcements/${announcement.slug}`,
      lastModified: new Date(announcement.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || [];

  return [...staticPages, ...eventPages, ...announcementPages];
}
