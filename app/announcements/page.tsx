import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { safeFetchQuery, getErrorMessage } from "@/lib/safe-fetch";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Stay updated with the latest news and updates from IEEE Computer Society HKBK. View all announcements, events, and important information.",
  openGraph: {
    title: "Announcements | IEEE CS HKBK",
    description:
      "Stay updated with the latest news and updates from IEEE Computer Society HKBK.",
    url: "https://ieee-cs-hkbk.vercel.app/announcements",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Announcements | IEEE CS HKBK",
    description:
      "Stay updated with the latest news and updates from IEEE Computer Society HKBK.",
  },
};

interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default async function AnnouncementsPage() {
  // Get excerpt (first 150 chars without Markdown syntax)
  const getExcerpt = (content: string) => {
    return content
      .replace(/[#*[\]()_`]/g, "")
      .slice(0, 150)
      .trim() + (content.length > 150 ? "..." : "");
  };

  // Safely fetch announcements from Supabase
  const result = await safeFetchQuery<Announcement>(async (supabase) => {
    return await supabase
      .from("announcements")
      .select("id, title, slug, content, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
  });

  const announcements = result.data || [];
  const hasError = result.error !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Announcements</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest news and updates from IEEE CS.
        </p>
      </div>

      {hasError ? (
        <EmptyState
          icon="alert"
          title="Unable to Load Announcements"
          description={getErrorMessage(result.error)}
          actionHref="/announcements"
          actionLabel="Try Again"
          showBackButton={true}
        />
      ) : result.isEmpty ? (
        <EmptyState
          icon="inbox"
          title="No Announcements Yet"
          description="We'll share important updates and announcements here. Check back soon!"
          actionHref="/"
          actionLabel="Back to Home"
        />
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Link
              key={announcement.id}
              href={`/announcements/${announcement.slug}`}
            >
              <Card className="border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="pt-6 pb-6">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {getExcerpt(announcement.content)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(announcement.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-primary mt-3 font-medium">
                    Read More →
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
