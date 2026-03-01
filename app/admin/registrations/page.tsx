import { createSupabaseServer } from "@/lib/supabase-ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Download } from "lucide-react";

export default async function AdminRegistrationsPage() {
  const supabase = await createSupabaseServer();

  console.log("\n👥 === ADMIN REGISTRATIONS PAGE ===");
  console.log("Loading all registrations...");

  interface Registration {
    id: string;
    event_id: string;
    name: string;
    email: string;
    usn: string | null;
    branch: string | null;
    created_at: string;
    event?: {
      title: string;
      slug: string;
    };
  }

  let registrations: Registration[] = [];

  try {
    const { data, error } = await supabase
      .from("registrations")
      .select(
        `
        id,
        event_id,
        name,
        email,
        usn,
        branch,
        created_at,
        events(title, slug)
      `
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      console.log("✅ Registrations loaded:", data.length);
      registrations = data as unknown as Registration[];
    } else if (error) {
      console.log("⚠️ Error loading registrations:", error.message);
    }
  } catch (err) {
    console.log("⚠️ Exception loading registrations:", err);
  }

  console.log("=== END ADMIN REGISTRATIONS PAGE ===\n");

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
              <h1 className="text-4xl font-bold mb-2">All Registrations</h1>
              <p className="text-muted-foreground">
                View and manage registrations across all events
              </p>
            </div>
            <Button variant="outline" className="gap-2" disabled>
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur mb-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Registrations
                </p>
                <p className="text-3xl font-bold text-primary">
                  {registrations.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Unique Events
                </p>
                <p className="text-3xl font-bold text-primary">
                  {new Set(registrations.map((r) => r.event_id)).size}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Latest Registration
                </p>
                <p className="text-3xl font-bold text-primary">
                  {registrations.length > 0
                    ? new Date(
                        registrations[0].created_at
                      ).toLocaleDateString("en-IN")
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        {registrations.length > 0 ? (
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/10">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Event
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Registered On
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr
                        key={reg.id}
                        className="border-b border-border/30 hover:bg-primary/5 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-foreground">
                          {reg.name}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {reg.email}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                            {reg.event?.title || "Unknown Event"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(reg.created_at).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                No registrations yet
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
