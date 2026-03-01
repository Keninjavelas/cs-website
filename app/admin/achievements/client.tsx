"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AchievementForm } from "@/components/admin/achievements-form";
import { AchievementsTable } from "@/components/admin/achievements-table";

type Achievement = {
  id: string;
  title: string;
  description: string;
  year?: string;
  image_url?: string;
  is_published: boolean;
  created_at: string;
};

interface AchievementsPageClientProps {
  initialAchievements: Achievement[];
}

export function AchievementsPageClient({
  initialAchievements,
}: AchievementsPageClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(
    null
  );

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setEditingAchievement(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingAchievement(null);
            setShowForm(!showForm);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Achievement
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingAchievement ? "Edit Achievement" : "Create New Achievement"}
              </CardTitle>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAchievement(null);
                }}
                className="text-muted-foreground hover:text-foreground text-lg"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <AchievementForm
              achievement={editingAchievement || undefined}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>All Achievements ({initialAchievements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AchievementsTable
            achievements={initialAchievements}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
