import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, MapPin, Users, Clock, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventBySlug, getUpcomingEvents } from "@/data/events";
import { formatDate, formatDateTime } from "@/lib/utils";
import { createSupabaseServer } from "@/lib/supabase-ssr";
import { EventRegistrationForm } from "@/components/events/event-registration-form";
import { MediaGallery } from "@/components/media-gallery";
import { type MediaItem } from "@/lib/media-upload";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  // Try to fetch from Supabase first
  let event = null;
  try {
    const { data } = await supabase
      .from("events")
      .select("title, description, event_date, location, image_url")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (data) {
      event = data;
    }
  } catch {
    // Fall back to local data
  }

  // Fall back to local event data
  if (!event) {
    const localEvent = getEventBySlug(slug);
    if (localEvent) {
      event = {
        title: localEvent.title,
        description: localEvent.description,
        event_date: localEvent.date,
        location: localEvent.location,
        image_url: null,
      };
    }
  }

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const eventTitle = event.title;
  const eventDescription = event.description.slice(0, 160);
  const eventImage = event.image_url || "/assets/college-emblem.png";

  return {
    title: eventTitle,
    description: eventDescription,
    openGraph: {
      title: eventTitle,
      description: eventDescription,
      type: "website",
      url: `https://ieee-cs-hkbk.vercel.app/events/${slug}`,
      images: [
        {
          url: eventImage,
          width: 1200,
          height: 630,
          alt: eventTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: eventTitle,
      description: eventDescription,
      images: [eventImage],
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  // Try to fetch from Supabase first
  let supabaseEvent = null;
  let eventMedia: MediaItem[] = [];
  
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, event_date, location, image_url, is_published, slug")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (!error && data) {
      supabaseEvent = data;
      
      // Fetch media for this event
      const { data: mediaData } = await supabase
        .from("media")
        .select("*")
        .eq("event_id", data.id)
        .order("display_order", { ascending: true });
      
      eventMedia = mediaData || [];
    }
  } catch (err) {
    // Silently handle errors
  }

  // Fall back to local event data
  const localEvent = getEventBySlug(slug);

  if (!supabaseEvent && !localEvent) {
    notFound();
  }

  const event = localEvent!;
  const hasSupabaseData = !!supabaseEvent;

  const isUpcoming = new Date(event.date) > new Date();

  // JSON-LD structured data for Event
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bangalore",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "IEEE Computer Society HKBK",
      url: "https://ieee-cs-hkbk.vercel.app",
    },
    eventStatus: isUpcoming
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventCancelled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(supabaseEvent?.image_url && { image: supabaseEvent.image_url }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema),
        }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      {/* Event Media Gallery */}
      <div className="mb-8">
        {eventMedia.length > 0 ? (
          <MediaGallery media={eventMedia} />
        ) : (
          <div className="h-64 md:h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center text-muted-foreground">
            <p className="text-lg">Event Banner</p>
          </div>
        )}
      </div>

      {/* Event Title and Meta */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          {isUpcoming ? (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              Upcoming
            </span>
          ) : (
            <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full font-medium">
              Past Event
            </span>
          )}
          {event.category && (
            <span className="bg-muted px-3 py-1 rounded-full">
              {event.category}
            </span>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {formatDateTime(event.date)}
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            {event.location}
          </div>
          {event.capacity && (
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Capacity: {event.capacity}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Registration */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasSupabaseData && supabaseEvent ? (
                // Show registration form for Supabase events
                <EventRegistrationForm
                  eventId={supabaseEvent.id}
                  eventTitle={supabaseEvent.title}
                />
              ) : isUpcoming ? (
                // Show "coming soon" for local events
                <>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-primary mb-1">
                          Online Registration Coming Soon
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Our online registration system is currently under development. 
                          For now, please contact us directly to register for this event.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event Date</span>
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    {event.capacity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Seats</span>
                        <span className="font-medium">{event.capacity}</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" asChild>
                    <Link href="/contact">Contact Us to Register</Link>
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    This event has already concluded.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}

// Generate static params for all events
export function generateStaticParams() {
  const events = getUpcomingEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}
