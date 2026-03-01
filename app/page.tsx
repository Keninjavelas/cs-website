import Link from "next/link";
import { ArrowRight, Users, Award, Zap, CheckCircle2, Globe, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServer } from "@/lib/supabase-ssr";

export const dynamic = "force-dynamic";

interface AnnouncementPreview {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default async function HomePage() {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("announcements")
    .select("id, title, slug, content, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const latestAnnouncements: AnnouncementPreview[] = data || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-background to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>Official IEEE CS Student Chapter</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Advancing Technology
              <span className="block text-primary mt-2">For Humanity</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the IEEE Computer Society Student Chapter - where innovation
              meets collaboration. Engage in cutting-edge technical workshops,
              hackathons, and professional development opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all rounded-lg px-8 py-6 sm:px-10"
              >
                <Link href="/events">
                  Explore Events
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-primary text-white hover:bg-primary/10 transition-all rounded-lg px-8 py-6 sm:px-10"
              >
                <Link href="/membership">Join IEEE CS</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About IEEE Computer Society */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              About IEEE Computer Society
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              IEEE Computer Society is the world's premier computing organization, dedicated to advancing the theory, practice, and application of computing and information technologies. Our student chapter at HKBK College brings this global mission to our local community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access a worldwide community of computing professionals and students aligned with IEEE's vision for technological advancement.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Technical Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Develop expertise through rigorous technical programs, certifications, and hands-on projects across emerging computing domains.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Professional Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advance your career through networking, mentorship, industry partnerships, and professional development opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Vision
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Building a thriving community of tech enthusiasts committed to excellence, innovation, and meaningful contributions to society.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Foster a collaborative environment where students learn, share, and grow together through peer-to-peer knowledge exchange.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Promote technical excellence through workshops, competitions, and industry interactions that push boundaries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Drive innovation by providing platforms for students to explore emerging technologies and create impactful solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Foundational Milestones Section */}
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Milestones
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key achievements in establishing our chapter and building momentum
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-muted">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg leading-tight">
                  Chapter Established
                </CardTitle>
                <span className="text-xs text-primary font-semibold">
                  2026
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Official IEEE Computer Society Student Chapter formation at HKBK College
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-muted">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg leading-tight">
                  Core Team Appointed
                </CardTitle>
                <span className="text-xs text-primary font-semibold">
                  2026
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Executive committee and faculty advisors onboarded
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-muted">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg leading-tight">
                  Official Website Launched
                </CardTitle>
                <span className="text-xs text-primary font-semibold">
                  2026
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Digital presence established for chapter activities
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-muted">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Presentation className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg leading-tight">
                  Inaugural Technical Session
                </CardTitle>
                <span className="text-xs text-primary font-semibold">
                  2026
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  First chapter event conducted successfully
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Latest Announcements</h2>
              <p className="text-muted-foreground">Recent chapter updates and notices</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/announcements">View All</Link>
            </Button>
          </div>

          {latestAnnouncements.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-10 text-center text-muted-foreground">
                No announcements published yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestAnnouncements.map((announcement) => (
                <Link
                  key={announcement.id}
                  href={`/announcements/${announcement.slug}`}
                >
                  <Card className="border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-xl line-clamp-2">{announcement.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {announcement.content.replace(/[#*[\]()_`]/g, "").slice(0, 150)}
                        {announcement.content.length > 150 && "..."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-4">
                        {new Date(announcement.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
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
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Be Part of the Beginning
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join IEEE CS at HKBK College of Engineering and help shape our journey as we build a thriving technical community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all rounded-lg px-8 py-6 sm:px-10"
            >
              <Link href="/membership">Join IEEE CS</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-primary text-white hover:bg-primary/10 transition-all rounded-lg px-8 py-6 sm:px-10"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

