import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, Bell, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsletterEmbed } from "@/components/newsletter/newsletter-embed";

export const metadata: Metadata = {
  title: "Newsletter | IEEE CS HKBK",
  description:
    "Subscribe to the IEEE Computer Society Student Chapter newsletter for event announcements, technical insights, chapter news, and exclusive opportunities delivered to your inbox.",
  keywords: [
    "IEEE CS Newsletter",
    "HKBK Newsletter",
    "Technical Updates",
    "Event Announcements",
    "Computing News",
    "Student Chapter Newsletter",
    "CS Newsletter",
    "Engineering Newsletter",
  ],
  openGraph: {
    title: "IEEE CS Newsletter | Stay Connected",
    description:
      "Subscribe to the IEEE Computer Society HKBK chapter newsletter for the latest updates.",
    type: "website",
  },
};

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Header */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-blue-950/20 to-indigo-950/20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-blue-400 transition-colors mb-12 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          {/* Page Title */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl mb-8 border border-blue-500/20 shadow-xl">
              <Mail className="h-10 w-10 text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              IEEE CS Newsletter
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stay connected with the latest updates, events, and opportunities
              from our chapter. Join our community of innovators and tech enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Receive */}
      <section className="py-16 lg:py-20 bg-muted/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            What You&apos;ll Receive
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl">Event Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Be the first to know about upcoming workshops, hackathons,
                  seminars, and technical sessions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                  <Bell className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl">Chapter Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get updates on chapter activities, achievements, and
                  milestones as we grow together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl">Technical Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive curated technical articles, tutorials, and resources
                  from our community of experts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl">Exclusive Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access exclusive internships, competitions, and networking
                  opportunities before anyone else.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl">Monthly Digest</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get a comprehensive monthly roundup of everything happening
                  in the chapter and beyond.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl">And More!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Industry insights, career tips, and updates from the global
                  IEEE CS community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <NewsletterEmbed
            substackUrl="hkbkcsieee.substack.com"
            title="Subscribe to Our Newsletter"
            description="Join hundreds of students and professionals staying updated with IEEE CS HKBK. No spam, just quality content delivered to your inbox."
            showIcon={false}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20 bg-muted/30 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  How often will I receive emails?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We send a monthly digest and occasional updates for important
                  events. You&apos;ll typically receive 2-4 emails per month—just enough to keep you informed without overwhelming your inbox.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I unsubscribe anytime?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! Every email includes an unsubscribe link at the bottom. You can
                  opt out at any time with just one click, no questions asked.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  Is my email address safe?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, 100%. We never share, sell, or distribute your email address to third parties. Your privacy
                  is our top priority, and we comply with all data protection regulations including GDPR.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  Will I get promotional content or spam?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Never. We promise zero spam, ever. You&apos;ll only receive relevant updates about
                  chapter activities, technical content, events, and genuine opportunities from IEEE CS HKBK.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
