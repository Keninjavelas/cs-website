import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ieeeGlobalEvents } from "@/data/ieeeGlobalEvents";
import { IEEEEventsCarousel } from "@/components/events/ieee-events-carousel";
import { EventsCTA } from "@/components/events/events-cta";

export default async function EventsPage() {
  // Use curated IEEE global events (limit to 15)
  const displayEvents = ieeeGlobalEvents.slice(0, 15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Calendar className="h-4 w-4" />
          <span>EVENTS & INITIATIVES</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Events & Technical Engagements
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our technical initiatives and community activities will be announced soon.
        </p>
      </section>

      {/* Upcoming Events - Empty State */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
        
        <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Clock className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Exciting Events Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
              We are currently planning our inaugural workshops, technical sessions, and 
              collaborative events. Stay tuned for updates on hackathons, guest lectures, 
              hands-on coding sessions, and networking opportunities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-primary/10 rounded-full">Workshops</span>
              <span className="px-3 py-1 bg-primary/10 rounded-full">Hackathons</span>
              <span className="px-3 py-1 bg-primary/10 rounded-full">Technical Talks</span>
              <span className="px-3 py-1 bg-primary/10 rounded-full">Networking Events</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* IEEE Global Events Section */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore IEEE Global Conferences</h2>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            As part of the global IEEE Computer Society ecosystem, these flagship conferences 
            represent the forefront of research and innovation in computing disciplines worldwide.
          </p>
        </div>

        <IEEEEventsCarousel events={displayEvents} />
      </section>

      {/* Call to Action */}
      <section>
        <EventsCTA />
      </section>
    </div>
  );
}
