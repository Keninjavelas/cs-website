import { createSupabaseServer } from "@/lib/supabase-ssr";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";
import {
  Shield,
  Calendar,
  Users,
  Megaphone,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.name || "Admin";
  const userEmail = user?.email || "Unknown";

  // Fetch statistics
  let eventCount = 0;
  let registrationCount = 0;

  try {
    // Get event count
    const { count: eventCountResult, error: eventError } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true });

    if (!eventError) {
      eventCount = eventCountResult || 0;
    }

    // Get registration count
    const { count: regCountResult, error: regError } = await supabase
      .from("registrations")
      .select("id", { count: "exact", head: true });

    if (!regError) {
      registrationCount = regCountResult || 0;
    }


  } catch (err) {
    // Silently handle errors
  }

  // Management sections configuration
  // NOTE: Team and Achievements are permanently static and not managed via CMS
  const managementSections = [
    {
      title: "Manage Events",
      description: "Create, edit, and manage chapter events",
      icon: Calendar,
      href: "/admin/events",
      count: eventCount,
      action: "View Events",
    },
    {
      title: "View Registrations",
      description: "Monitor event registrations and export data",
      icon: Users,
      href: "/admin/registrations",
      count: registrationCount,
      action: "View All",
    },

    {
      title: "Manage Announcements",
      description: "Create and publish announcements",
      icon: Megaphone,
      href: "/admin/announcements",
      count: 0,
      action: "Manage",
    },
    {
      title: "Manage Achievements",
      description: "Create and publish chapter achievements",
      icon: Trophy,
      href: "/admin/achievements",
      count: 0,
      action: "Manage",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CMS Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Content Management System
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">
            Welcome, {userName}!
          </h2>
          <p className="text-lg text-muted-foreground">
            Manage all chapter content from a single dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 mb-12">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {eventCount}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Events created
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Registrations
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {registrationCount}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                User registrations
              </p>
            </CardContent>
          </Card>


        </div>

        {/* Management Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Content Management</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {managementSections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <Link key={idx} href={section.href}>
                  <Card className="h-full border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        {section.count > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {section.count}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {section.description}
                      </p>
                      <Button
                        variant="ghost"
                        className="w-full justify-between group/btn"
                      >
                        {section.action}
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Admin Info */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administrator Account
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium break-all">{userEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Role</p>
              <p className="font-medium">Administrator</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
