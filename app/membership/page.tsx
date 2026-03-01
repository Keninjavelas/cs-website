import { ExternalLink, Users, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";

export default function MembershipPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Membership</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Join our community and connect with the global IEEE network
        </p>
      </div>

      {/* Two Types of Membership */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* IEEE Global Membership */}
        <Card className="border-2">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <ExternalLink className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">IEEE Global Membership</CardTitle>
            <CardDescription className="text-base">
              Become a member of the worldwide IEEE organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Benefits Include:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access to IEEE Xplore Digital Library</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Discounts on IEEE conferences and publications</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Networking with 400,000+ professionals worldwide</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Career resources and job board access</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Professional development opportunities</span>
                </li>
              </ul>
            </div>
            <a
              href="https://www.ieee.org/membership"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Join IEEE <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </CardContent>
        </Card>

        {/* Chapter Membership */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Chapter Membership</CardTitle>
            <CardDescription className="text-base">
              Join our WhatsApp Community (Free & Instant)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Chapter Benefits:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Register for all chapter events and workshops</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access to technical resources and materials</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Participate in hackathons and competitions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Connect with peers and mentors locally</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contribute to community projects</span>
                </li>
              </ul>
            </div>
            <a
              href="https://chat.whatsapp.com/L4U5kjfKBJK1XgJclrUJNA"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
            >
              Join the IEEE CS WhatsApp Community
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter Signup Section */}
      <div className="mt-16 mb-16">
        <NewsletterCard />
      </div>

      {/* Clarification */}
      <Card className="bg-muted/20 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Important Note</h3>
              <p className="text-muted-foreground">
                <strong>Chapter membership is free and instant</strong> - just click the button
                above to join our WhatsApp Community and participate in all our local events
                and activities.
              </p>
              <p className="text-muted-foreground">
                IEEE global membership is optional but highly recommended for additional
                benefits like access to IEEE Xplore and professional networking opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About IEEE */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center">About IEEE</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
          <p>
            IEEE (Institute of Electrical and Electronics Engineers) is the world&apos;s largest
            technical professional organization dedicated to advancing technology for the
            benefit of humanity.
          </p>
          <p>
            The IEEE Computer Society is IEEE&apos;s largest society, bringing together computing
            professionals from all areas of computing. With over 60,000 members worldwide,
            it provides resources, leadership opportunities, and a community for those
            passionate about computing technology.
          </p>
          <p>
            Our Student Chapter is part of this global network, bringing these opportunities
            to our campus and providing a bridge between academic learning and professional
            excellence.
          </p>
        </div>
      </section>
    </div>
  );
}
