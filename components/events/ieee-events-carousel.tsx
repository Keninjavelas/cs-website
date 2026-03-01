"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IEEEGlobalEvent } from "@/data/ieeeGlobalEvents";

interface IEEEEventsCarouselProps {
  events: IEEEGlobalEvent[];
}

export function IEEEEventsCarousel({ events }: IEEEEventsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(events.length > 0);

  const updateScrollState = () => {
    if (!scrollRef.current) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  };

  useEffect(() => {
    updateScrollState();

    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => updateScrollState();
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [events.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) {
      return;
    }

    const amount = scrollRef.current.clientWidth * 0.9;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="absolute right-0 -top-14 z-10 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scrollByAmount("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll events left"
          className="h-9 w-9 border-primary/40 hover:bg-primary/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scrollByAmount("right")}
          disabled={!canScrollRight}
          aria-label="Scroll events right"
          className="h-9 w-9 border-primary/40 hover:bg-primary/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-4 scroll-pl-4 scroll-pr-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-6">
          {events.map((event, index) => (
            <article
              key={`${event.link}-${index}`}
              className="snap-start shrink-0 basis-full md:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)]"
            >
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full no-underline"
            >
              <Card className="h-full group hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-card/90 cursor-pointer">
                <CardHeader>
                  {event.shortName && (
                    <div className="text-2xl font-bold text-primary mb-2">
                      {event.shortName}
                    </div>
                  )}
                  <CardTitle className="text-base leading-tight line-clamp-2 mb-3">
                    {event.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {event.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{event.focusArea}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex h-full flex-col space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{event.location}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{event.date}</span>
                  </div>
                  <div className="pt-2 mt-auto">
                    <div className="w-full inline-flex items-center justify-center gap-2 h-9 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                      Visit Conference
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          </article>
        ))}
        </div>
      </div>
    </div>
  );
}
