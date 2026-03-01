"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-ssr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Megaphone, Pencil, Plus, Trash2 } from "lucide-react";

interface AnnouncementRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

interface AnnouncementForm {
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
}

const emptyForm: AnnouncementForm = {
  title: "",
  slug: "",
  content: "",
  is_published: true,
};

// Helper: Convert title to slug
const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
};

export default function AdminAnnouncementsPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);

  const loadAnnouncements = async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("announcements")
      .select("id, title, slug, content, is_published, created_at")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message || "Failed to load announcements.");
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setAnnouncements(data || []);
    setLoading(false);
  };

  useEffect(() => {
    void loadAnnouncements();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : titleToSlug(title), // Only auto-generate if creating new
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError("Title, slug, and content are required.");
      return;
    }

    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content.trim(),
      is_published: form.is_published,
    };

    const result = editingId
      ? await supabase.from("announcements").update(payload).eq("id", editingId)
      : await supabase.from("announcements").insert([payload]);

    if (result.error) {
      setError(result.error.message || "Failed to save announcement.");
      setSubmitting(false);
      return;
    }

    resetForm();
    await loadAnnouncements();
    setSubmitting(false);
  };

  const startEdit = (announcement: AnnouncementRecord) => {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      slug: announcement.slug,
      content: announcement.content,
      is_published: announcement.is_published,
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this announcement? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message || "Failed to delete announcement.");
      return;
    }

    await loadAnnouncements();
  };

  const togglePublish = async (announcement: AnnouncementRecord) => {
    const { error: updateError } = await supabase
      .from("announcements")
      .update({ is_published: !announcement.is_published })
      .eq("id", announcement.id);

    if (updateError) {
      setError(updateError.message || "Failed to update publish status.");
      return;
    }

    await loadAnnouncements();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link href="/admin">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Manage Announcements</h1>
          <p className="text-muted-foreground">Create, edit, and publish chapter announcements.</p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Announcement" : "Create Announcement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="announcement-title" className="text-sm font-medium">Title *</label>
                <input
                  id="announcement-title"
                  type="text"
                  placeholder="Announcement title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="announcement-slug" className="text-sm font-medium">Slug * (auto-generated from title)</label>
                <input
                  id="announcement-slug"
                  type="text"
                  placeholder="announcement-slug"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Used in URL: /announcements/{form.slug}
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="announcement-content" className="text-sm font-medium">Content * (Markdown supported)</label>
                <textarea
                  id="announcement-content"
                  placeholder="# Heading&#10;&#10;**Bold text** and *italic text*&#10;&#10;- List item 1&#10;- List item 2&#10;&#10;[Link text](https://example.com)"
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 min-h-[200px] font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Supports: headings, bold, italic, lists, links, code blocks, tables, etc.
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                />
                Publish
              </label>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingId ? "Update Announcement" : "Create Announcement"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Announcements ({announcements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading announcements...
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No announcements yet.</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="rounded-lg border border-border/50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          /{announcement.slug}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(announcement.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void togglePublish(announcement)}
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            announcement.is_published
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {announcement.is_published ? "Published" : "Draft"}
                        </button>
                        <Button variant="outline" size="sm" onClick={() => startEdit(announcement)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => void handleDelete(announcement.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
