export type ChatIntent =
  | "membership"
  | "events"
  | "team"
  | "announcements"
  | "contact"
  | "general";

export function detectIntent(message: string): ChatIntent {
  const text = message.toLowerCase().trim();

  if (
    text.includes("join") ||
    text.includes("membership") ||
    text.includes("register") ||
    text.includes("enroll")
  ) {
    return "membership";
  }

  if (
    text.includes("event") ||
    text.includes("events") ||
    text.includes("workshop") ||
    text.includes("hackathon") ||
    text.includes("seminar") ||
    text.includes("session") ||
    text.includes("activity")
  ) {
    return "events";
  }

  if (
    text.includes("team") ||
    text.includes("committee") ||
    text.includes("advisor") ||
    text.includes("advisors") ||
    text.includes("faculty") ||
    text.includes("leadership")
  ) {
    return "team";
  }

  if (
    text.includes("announcement") ||
    text.includes("announcements") ||
    text.includes("news") ||
    text.includes("update") ||
    text.includes("updates") ||
    text.includes("post")
  ) {
    return "announcements";
  }

  if (
    text.includes("contact") ||
    text.includes("email") ||
    text.includes("reach") ||
    text.includes("support") ||
    text.includes("phone") ||
    text.includes("mail")
  ) {
    return "contact";
  }

  return "general";
}
