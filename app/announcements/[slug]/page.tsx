import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { safeFetchSingle, getErrorMessage } from "@/lib/safe-fetch";
import { createSupabaseServer } from "@/lib/supabase-ssr";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

interface AnnouncementDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for announcement detail page
export async function generateMetadata({
  params,
}: AnnouncementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("announcements")
    .select("title, content, created_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) {
    return {
      title: "Announcement Not Found",
    };
  }

  // Extract plain text from markdown for description
  const plainText = data.content
    .replace(/[#*>`\-\[\]]/g, "")
    .replace(/\n/g, " ")
    .trim();
  const description = plainText.slice(0, 160);

  return {
    title: data.title,
    description,
    openGraph: {
      title: data.title,
      description,
      type: "article",
      publishedTime: data.created_at,
      url: `https://ieee-cs-hkbk.vercel.app/announcements/${slug}`,
      images: [
        {
          url: "https://ieee-cs-hkbk.vercel.app/assets/college-emblem.png",
          width: 1200,
          height: 630,
          alt: "IEEE CS HKBK",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: ["https://ieee-cs-hkbk.vercel.app/assets/college-emblem.png"],
    },
  };
}

export default async function AnnouncementDetailPage({
  params,
}: AnnouncementDetailPageProps) {
  const { slug } = await params;

  const result = await safeFetchSingle<Announcement>(async (supabase) => {
    return await supabase
      .from("announcements")
      .select("id, title, slug, content, is_published, created_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
  });

  if (result.error) {
    // Show error state first
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <Link href="/announcements">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Announcements
          </Button>
        </Link>
        <EmptyState
          icon="alert"
          title="Unable to Load Announcement"
          description={getErrorMessage(result.error)}
          actionHref="/announcements"
          actionLabel="View All Announcements"
        />
      </div>
    );
  }

  if (!result.data) {
    notFound();
  }

  const announcement = result.data;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link href="/announcements">
        <Button variant="ghost" className="mb-8 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Announcements
        </Button>
      </Link>

      <article>
        <header className="mb-8 pb-8 border-b border-border/40">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {announcement.title}
          </h1>
          <p className="text-muted-foreground">
            {new Date(announcement.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <Card className="border-primary/20 mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="prose prose-invert max-w-none dark:prose-headings:text-foreground dark:prose-p:text-muted-foreground dark:prose-a:text-primary dark:prose-strong:text-foreground dark:prose-code:text-primary dark:prose-pre:bg-secondary dark:prose-pre:text-foreground">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold mt-5 mb-2">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-bold mt-4 mb-2">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed text-muted-foreground">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1">
                      {children}
                    </li>
                  ),
                  code: ({ children }) => (
                    <code className="bg-secondary text-primary px-[0.3em] py-[0.2em] rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-secondary p-4 rounded-lg overflow-x-auto mb-4 border border-border/40">
                      <code className="text-sm font-mono text-foreground">
                        {children}
                      </code>
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <table className="w-full border-collapse mb-4 border border-border/40">
                      {children}
                    </table>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-secondary border-b border-border/40">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody>
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="border-b border-border/40">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="text-left px-3 py-2 font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2 text-muted-foreground">
                      {children}
                    </td>
                  ),
                }}
              >
                {announcement.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <footer className="border-t border-border/40 pt-8">
          <Link href="/announcements">
            <Button variant="outline">
              ← Back to All Announcements
            </Button>
          </Link>
        </footer>
      </article>
    </div>
  );
}
