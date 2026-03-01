"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="rounded-full bg-destructive/10 p-4 mx-auto w-fit mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Something Went Wrong
        </h1>

        <p className="text-muted-foreground mb-2">
          We encountered an unexpected error while loading this page.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="bg-muted rounded-lg p-3 text-left text-xs text-muted-foreground mb-6 font-mono overflow-auto max-h-32">
            <p className="font-semibold mb-1">Error Details:</p>
            <p className="break-words whitespace-pre-wrap">{error.message}</p>
            {error.digest && (
              <p className="mt-2">
                <span className="font-semibold">Digest:</span> {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Button onClick={reset}>Try Again</Button>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
