import { Mail } from "lucide-react";

interface NewsletterEmbedProps {
  /**
   * Your Substack URL (e.g., "yoursubstack.substack.com")
   */
  substackUrl?: string;
  /**
   * Heading text
   */
  title?: string;
  /**
   * Description/subtitle text
   */
  description?: string;
  /**
   * Whether to show the decorative icon
   */
  showIcon?: boolean;
  /**
   * Compact mode (for smaller sections)
   */
  compact?: boolean;
}

export function NewsletterEmbed({
  substackUrl = "hkbkcsieee.substack.com",
  title = "Stay Updated with IEEE CS",
  description = "Get event announcements, technical insights, and chapter news delivered directly to your inbox.",
  showIcon = true,
  compact = false,
}: NewsletterEmbedProps) {
  const embedUrl = `https://${substackUrl}/embed`;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className={`text-center mb-8 ${compact ? "mb-6" : "mb-8"}`}>
        {showIcon && (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl mb-6 border border-blue-500/20 shadow-lg">
            <Mail className="h-8 w-8 text-blue-400" />
          </div>
        )}
        <h2
          className={`font-bold mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent ${
            compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-muted-foreground max-w-2xl mx-auto leading-relaxed ${
            compact ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          {description}
        </p>
      </div>

      {/* Substack Embed with Premium Styling */}
      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          {/* Premium Card Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-blue-500/20 backdrop-blur-sm bg-gradient-to-br from-blue-900/30 to-indigo-900/30 transition-all duration-300 hover:shadow-2xl hover:border-blue-500/40">
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
            
            {/* Iframe */}
            <div className="relative z-10">
              <iframe
                src={embedUrl}
                width="100%"
                height="320"
                style={{ border: "none" }}
                scrolling="no"
                title="Newsletter Signup"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-center text-muted-foreground mt-6 animate-in fade-in duration-1000 delay-500">
          📧 We respect your privacy. Unsubscribe at any time. No spam, ever.
        </p>
      </div>
    </div>
  );
}
