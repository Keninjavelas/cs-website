import { createSupabaseServer } from "@/lib/supabase-ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Plus } from "lucide-react";

export default async function AdminEventsPage() {
  const supabase = await createSupabaseServer();

  console.log("\n📅 === ADMIN EVENTS PAGE ===");
  console.log("Loading all events...");

  interface Event {
    id: string;
    title: string;
    slug: string;
    event_date: string;
    is_published: boolean;
    created_at: string;
  }

  let events: Event[] = [];

  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, slug, event_date, is_published, created_at")
      .order("event_date", { ascending: false });

    if (!error && data) {
      console.log("✅ Events loaded:", data.length);
      events = data;
    } else if (error) {
      console.log("⚠️ Error loading events:", error.message);
    }
  } catch (err) {
    console.log("⚠️ Exception loading events:", err);
  }

  console.log("=== END ADMIN EVENTS PAGE ===\n");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Events</h1>
              <p className="text-muted-foreground">
                Create, edit, and manage chapter events
              </p>
            </div>
            <Link href="/admin/events/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Events List */}
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.event_date).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div>
                          Status:{" "}
                          <span
                            className={
                              event.is_published
                                ? "text-green-600 font-medium"
                                : "text-yellow-600 font-medium"
                            }
                          >
                            {event.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/admin/events/${event.id}/registrations`}
                      >
                        <Button variant="outline" size="sm">
                          Registrations
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" disabled>
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No events created yet</p>
              <Link href="/admin/events/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
