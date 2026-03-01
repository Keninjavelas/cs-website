import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: "inbox" | "alert";
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  showBackButton?: boolean;
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  actionHref,
  actionLabel,
  showBackButton = false,
}: EmptyStateProps) {
  const IconComponent = icon === "alert" ? AlertCircle : Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <IconComponent className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {description}
      </p>
      <div className="flex gap-3">
        {actionHref && actionLabel && (
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        )}
        {showBackButton && (
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
