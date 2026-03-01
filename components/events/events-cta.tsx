"use client";

import Link from "next/link";
import { UserPlus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EventsCTA() {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 lg:p-12 border border-primary/20">
      <div className="text-center max-w-3xl mx-auto">
        <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-3">Be Part of the Beginning</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join us as we launch our first series of technical events and initiatives.
          Be among the founding members who shape the future of our chapter.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/membership">
              <UserPlus className="h-5 w-5" />
              Join the Chapter
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link href="/contact">
              <Mail className="h-5 w-5" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
