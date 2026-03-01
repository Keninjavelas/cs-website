/**
 * In-memory rate limiter for preventing spam and abuse
 * Tracks submissions per IP address with automatic cleanup
 */

interface RateLimitEntry {
  count: number;
  firstRequestTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly cleanupIntervalMs: number;

  constructor(
    maxRequests: number = 5,
    windowMs: number = 10 * 60 * 1000, // 10 minutes
    cleanupIntervalMs: number = 5 * 60 * 1000 // 5 minutes
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.cleanupIntervalMs = cleanupIntervalMs;

    // Start cleanup interval
    setInterval(() => this.cleanup(), cleanupIntervalMs);
  }

  /**
   * Check if a request from the given IP is allowed
   * @returns true if allowed, false if rate limited
   */
  isAllowed(ip: string): boolean {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry) {
      // First request from this IP
      this.store.set(ip, {
        count: 1,
        firstRequestTime: now,
      });
      return true;
    }

    // Check if window has expired
    if (now - entry.firstRequestTime > this.windowMs) {
      // Window expired, reset
      this.store.set(ip, {
        count: 1,
        firstRequestTime: now,
      });
      return true;
    }

    // Within window - check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return false;
    }

    // Increment counter
    entry.count++;
    return true;
  }

  /**
   * Get remaining requests for an IP
   */
  getRemaining(ip: string): number {
    const entry = this.store.get(ip);

    if (!entry) {
      return this.maxRequests;
    }

    const now = Date.now();
    if (now - entry.firstRequestTime > this.windowMs) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();

    for (const [ip, entry] of this.store.entries()) {
      if (now - entry.firstRequestTime > this.windowMs) {
        this.store.delete(ip);
      }
    }
  }

  /**
   * Reset rate limit for a specific IP (for testing)
   */
  reset(ip: string): void {
    this.store.delete(ip);
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.store.clear();
  }
}

// Global rate limiter instances
const contactFormLimiter = new RateLimiter(5, 10 * 60 * 1000);
const eventRegistrationLimiter = new RateLimiter(5, 10 * 60 * 1000);

/**
 * Extract IP address from NextRequest
 */
export function getIP(request: Request): string {
  const headers = request.headers;

  // Try various header sources in order of preference
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  const clientIP = headers.get("cf-connecting-ip");
  if (clientIP) {
    return clientIP;
  }

  // Fallback - should not happen in production
  return "unknown";
}

/**
 * Check if contact form submission is allowed for IP
 */
export function isContactFormAllowed(ip: string): boolean {
  return contactFormLimiter.isAllowed(ip);
}

/**
 * Check if event registration is allowed for IP
 */
export function isEventRegistrationAllowed(ip: string): boolean {
  return eventRegistrationLimiter.isAllowed(ip);
}

/**
 * Get remaining submissions for contact form
 */
export function getContactFormRemaining(ip: string): number {
  return contactFormLimiter.getRemaining(ip);
}

/**
 * Get remaining registrations for event
 */
export function getEventRegistrationRemaining(ip: string): number {
  return eventRegistrationLimiter.getRemaining(ip);
}

/**
 * Reset limiter for testing
 */
export function resetContactFormLimiter(ip?: string): void {
  if (ip) {
    contactFormLimiter.reset(ip);
  } else {
    contactFormLimiter.clear();
  }
}

export function resetEventRegistrationLimiter(ip?: string): void {
  if (ip) {
    eventRegistrationLimiter.reset(ip);
  } else {
    eventRegistrationLimiter.clear();
  }
}
