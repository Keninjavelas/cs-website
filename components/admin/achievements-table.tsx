"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAchievement, togglePublishStatus } from "@/lib/actions/achievements";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, AlertCircle } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year?: string;
  image_url?: string;
  is_published: boolean;
  created_at: string;
}

interface AchievementsTableProps {
  achievements: Achievement[];
  onEdit: (achievement: Achievement) => void;
}

export function AchievementsTable({ achievements, onEdit }: AchievementsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setError(null);
    setDeletingId(id);

    try {
      const result = await deleteAchievement(id);

      if (!result.success) {
        setError(result.message || "Failed to delete achievement");
        setDeletingId(null);
      } else {
        setDeleteConfirm(null);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setError(null);
    setTogglingId(id);

    try {
      const result = await togglePublishStatus(id, !currentStatus);

      if (!result.success) {
        setError(result.message || "Failed to update achievement");
        setTogglingId(null);
      } else {
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
      setTogglingId(null);
    }
  };

  if (achievements.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div>
          <p className="text-muted-foreground mb-2">No achievements yet</p>
          <p className="text-sm text-muted-foreground">Create your first achievement to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left font-semibold">Title</th>
              <th className="px-6 py-4 text-left font-semibold">Year</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((achievement) => (
              <tr
                key={achievement.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{achievement.title}</td>
                <td className="px-6 py-4 text-muted-foreground">{achievement.year || "—"}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTogglePublish(achievement.id, achievement.is_published)}
                    disabled={togglingId === achievement.id}
                    className="cursor-pointer"
                  >
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                        achievement.is_published
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                      } ${togglingId === achievement.id ? "opacity-50" : ""}`}
                    >
                      {achievement.is_published ? "Published" : "Draft"}
                    </div>
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(achievement)}
                      disabled={deletingId === achievement.id || togglingId === achievement.id}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Edit</span>
                    </Button>

                    {deleteConfirm === achievement.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(achievement.id)}
                          disabled={deletingId === achievement.id}
                        >
                          {deletingId === achievement.id ? "Deleting..." : "Confirm"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirm(null)}
                          disabled={deletingId === achievement.id}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(achievement.id)}
                        disabled={deletingId === achievement.id || togglingId === achievement.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Delete</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
