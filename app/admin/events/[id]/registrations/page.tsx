import { createSupabaseServer } from "@/lib/supabase-ssr";
import { RegistrationsTable } from "@/components/admin/registrations-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventRegistrationsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  console.log("\n🔐 === ADMIN REGISTRATIONS PAGE ===");
  console.log("Fetching registrations for event:", id);

  try {
    // ===== FETCH EVENT DETAILS =====
    console.log("\n📋 Fetching event details...");
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id, title, slug, created_at")
      .eq("id", id)
      .single();

    if (eventError || !eventData) {
      console.log("❌ Event not found:", eventError?.message);
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/admin">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <Card className="border-destructive/20">
              <CardContent className="pt-6">
                <p className="text-destructive">Event not found</p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    console.log("✅ Event found:", eventData.title);

    // ===== FETCH REGISTRATIONS =====
    console.log("\n👥 Fetching registrations...");
    const { data: registrations, error: regError } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", id)
      .order("created_at", { ascending: false });

    if (regError) {
      console.log("❌ Error fetching registrations:", regError.message);
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/admin">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <Card className="border-destructive/20">
              <CardContent className="pt-6">
                <p className="text-destructive">
                  Failed to load registrations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    console.log("✅ Registrations fetched:", registrations?.length || 0);
    console.log("=== END REGISTRATIONS PAGE ===\n");

    const registrationCount = registrations?.length || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Registrations
              </h1>
              <p className="text-muted-foreground">
                {eventData.title}
              </p>
            </div>
          </div>

          {/* Stats Card */}
          <Card className="border-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Registration Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Registrations
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {registrationCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    First Registration
                  </p>
                  <p className="text-sm font-medium">
                    {registrations && registrations.length > 0
                      ? new Date(
                          registrations[registrations.length - 1].created_at
                        ).toLocaleDateString("en-IN")
                      : "No registrations"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Latest Registration
                  </p>
                  <p className="text-sm font-medium">
                    {registrations && registrations.length > 0
                      ? new Date(registrations[0].created_at).toLocaleDateString(
                          "en-IN"
                        )
                      : "No registrations"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registrations Table */}
          {registrations && registrations.length > 0 ? (
            <RegistrationsTable
              registrations={registrations}
              exportHref={`/admin/events/${id}/registrations/export`}
            />
          ) : (
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No registrations yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Registrations will appear here once users start registering.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.log("❌ Exception:", error);
    console.log("=== END REGISTRATIONS PAGE ===\n");

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
          <Card className="border-destructive/20">
            <CardContent className="pt-6">
              <p className="text-destructive">An error occurred</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
