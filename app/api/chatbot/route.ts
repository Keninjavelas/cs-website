import { NextRequest, NextResponse } from "next/server";
import { detectIntent, type ChatIntent } from "@/lib/chatbot/intents";

interface Action {
  label: string;
  type: "link" | "message";
  value: string;
}

interface HistoryMessage {
  role: "user" | "bot";
  message: string;
}

interface ChatRequest {
  message: string;
  page?: string;
  history?: HistoryMessage[];
}

interface ChatResponse {
  reply: string;
  actions?: Action[];
}

const fallbackMessage =
  "That's a great question. For detailed queries, please send us an email through the contact page so our team can assist you.";

const pageContext: Record<string, string> = {
  "/events":
    "You are currently on the Events page where we list upcoming IEEE Computer Society chapter events and workshops.",
  "/announcements":
    "You are currently viewing the Announcements page where we share the latest IEEE Computer Society chapter updates.",
  "/team":
    "This page introduces the executive committee and faculty advisors of the IEEE Computer Society chapter.",
  "/membership":
    "This page explains how you can join the IEEE Computer Society chapter and become part of the community.",
  "/contact":
    "You are on the Contact page where you can reach the IEEE Computer Society chapter team for support and questions.",
  "/about":
    "You are currently on the About page, which shares the mission and vision of the IEEE Computer Society chapter.",
};

function sanitizeMessage(text: string): string {
  return text.replace(/<[^>]*>?/gm, "").trim().slice(0, 500);
}

function normalizePage(page?: string): string {
  if (!page || typeof page !== "string") return "/";
  if (page === "/") return "/";
  return page.endsWith("/") ? page.slice(0, -1) : page;
}

function normalizeHistory(history?: HistoryMessage[]): HistoryMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item) =>
        item &&
        (item.role === "user" || item.role === "bot") &&
        typeof item.message === "string"
    )
    .map((item) => ({
      role: item.role,
      message: sanitizeMessage(item.message),
    }))
    .filter((item) => item.message.length > 0)
    .slice(-5);
}

function isPageContextQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes("which page") ||
    lowerMessage.includes("what page") ||
    lowerMessage.includes("page is this") ||
    lowerMessage.includes("where am i") ||
    lowerMessage.includes("current page") ||
    lowerMessage.includes("what is this") ||
    lowerMessage.includes("what is happening here") ||
    lowerMessage.includes("what's happening here") ||
    lowerMessage.includes("this page") ||
    lowerMessage.includes("here")
  );
}

function getPageContextReply(page: string): string {
  switch (page) {
    case "/events":
      return "You're currently on the Events page where upcoming IEEE CS chapter activities are listed.";
    case "/team":
      return "You're currently on the Team page where you can see the executive committee and faculty advisors.";
    case "/membership":
      return "You're currently on the Membership page where you can learn how to join the IEEE Computer Society chapter.";
    case "/announcements":
      return "You're currently on the Announcements page where the latest IEEE CS chapter updates are posted.";
    case "/contact":
      return "You're currently on the Contact page where you can reach the IEEE Computer Society chapter team.";
    case "/about":
      return "You're currently on the About page where you can learn more about the IEEE Computer Society chapter.";
    default:
      return "You're currently exploring the IEEE Computer Society chapter website.";
  }
}

function isHelpQuery(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("what can you help") ||
    lower.includes("help me") ||
    lower.includes("what can you do") ||
    lower.includes("options") ||
    lower.includes("show me around")
  );
}

function getChapterInfoResponse(message: string): ChatResponse | null {
  const lower = message.toLowerCase();

  if (
    lower.includes("chapter") ||
    lower.includes("about the chapter") ||
    lower.includes("tell me about") ||
    lower.includes("what is this chapter")
  ) {
    return {
      reply:
        "The IEEE Computer Society chapter brings students together through events, announcements, workshops, and membership opportunities across the website.",
    };
  }

  return null;
}

function getIdentityResponse(message: string): ChatResponse | null {
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("who are you") ||
    lowerMessage.includes("what is your name") ||
    lowerMessage.includes("your name") ||
    lowerMessage.includes("introduce yourself")
  ) {
    return {
      reply:
        "I'm Styza, the IEEE Computer Society assistant owl. I can help you explore events, announcements, and membership. Let me help you with that.",
    };
  }

  return null;
}

function isShortFollowUp(message: string): boolean {
  const lower = message.toLowerCase().trim();
  const words = lower.split(/\s+/).filter(Boolean);

  if (words.length <= 2) return true;

  const followUpHints = [
    "how",
    "when",
    "where",
    "what about",
    "details",
    "more",
    "can you explain",
    "tell me more",
    "next",
  ];

  return followUpHints.some((hint) => lower.includes(hint));
}

function inferLastIntent(history: HistoryMessage[]): ChatIntent {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const item = history[i];
    if (item.role !== "user") continue;
    const intent = detectIntent(item.message);
    if (intent !== "general") return intent;
  }
  return "general";
}

function getIntentResponse(
  intent: ChatIntent,
  normalizedPage: string,
  message: string,
  isFollowUp: boolean
): ChatResponse {
  const lower = message.toLowerCase();

  switch (intent) {
    case "membership":
      if (isFollowUp && (lower.includes("how") || lower.includes("where"))) {
        return {
          reply:
            "You can join through the membership registration details on the Membership page. I'm Styza, and I can guide you there: /membership.",
          actions: [{ label: "Join IEEE", type: "link", value: "/membership" }],
        };
      }
      if (normalizedPage === "/membership" && pageContext[normalizedPage]) {
        return {
          reply: `${pageContext[normalizedPage]} Let me help you with that - use the registration details on this page to join.`,
          actions: [{ label: "Join IEEE", type: "link", value: "/membership" }],
        };
      }
      return {
        reply:
          "I'm Styza, your IEEE chapter assistant. You can join the IEEE Computer Society through our Membership page: /membership.",
        actions: [{ label: "Join IEEE", type: "link", value: "/membership" }],
      };

    case "events":
      if (isFollowUp && lower.includes("when")) {
        return {
          reply:
            "Event dates are listed on the Events page along with session details and registration information.",
          actions: [{ label: "View Events", type: "link", value: "/events" }],
        };
      }
      if (isFollowUp) {
        return {
          reply:
            "You can explore upcoming IEEE CS chapter events on the Events page.",
          actions: [{ label: "View Events", type: "link", value: "/events" }],
        };
      }
      if (normalizedPage === "/events" && pageContext[normalizedPage]) {
        return {
          reply: `${pageContext[normalizedPage]} You can browse upcoming sessions and activities here.`,
          actions: [{ label: "View Events", type: "link", value: "/events" }],
        };
      }
      return {
        reply: "You can explore upcoming IEEE CS chapter events on the Events page.",
        actions: [{ label: "View Events", type: "link", value: "/events" }],
      };

    case "team":
      if (isFollowUp && (lower.includes("who") || lower.includes("which"))) {
        return {
          reply: "The Team page lists the executive committee and faculty advisors with their roles.",
          actions: [{ label: "Meet the Team", type: "link", value: "/team" }],
        };
      }
      if (normalizedPage === "/team" && pageContext[normalizedPage]) {
        return {
          reply: `${pageContext[normalizedPage]} Let me help you with any role-related questions.`,
          actions: [{ label: "Meet the Team", type: "link", value: "/team" }],
        };
      }
      return {
        reply: "You can see our executive committee and faculty advisors on the Team page: /team.",
        actions: [{ label: "Meet the Team", type: "link", value: "/team" }],
      };

    case "announcements":
      if (isFollowUp && (lower.includes("latest") || lower.includes("when"))) {
        return {
          reply:
            "The latest chapter updates are posted on the Announcements page with publication dates.",
          actions: [{ label: "View Announcements", type: "link", value: "/announcements" }],
        };
      }
      if (normalizedPage === "/announcements" && pageContext[normalizedPage]) {
        return {
          reply: `${pageContext[normalizedPage]} You can check this page regularly for new notices.`,
          actions: [{ label: "View Announcements", type: "link", value: "/announcements" }],
        };
      }
      return {
        reply: "You can view the latest chapter updates on the Announcements page: /announcements.",
        actions: [{ label: "View Announcements", type: "link", value: "/announcements" }],
      };

    case "contact":
      if (isFollowUp && (lower.includes("how") || lower.includes("where"))) {
        return {
          reply:
            "You can reach the chapter through the Contact page, including the official email details: /contact.",
          actions: [{ label: "Contact Us", type: "link", value: "/contact" }],
        };
      }
      if (normalizedPage === "/contact" && pageContext[normalizedPage]) {
        return {
          reply: `${pageContext[normalizedPage]} I'm Styza, and I can help direct you to the right section.`,
          actions: [{ label: "Contact Us", type: "link", value: "/contact" }],
        };
      }
      return {
        reply: "You can contact the chapter through the Contact page: /contact.",
        actions: [{ label: "Contact Us", type: "link", value: "/contact" }],
      };

    default:
      if (lower.includes("ieee")) {
        return {
          reply:
            "IEEE is the world's largest technical professional organization dedicated to advancing technology for humanity. I'm Styza, and I can help with chapter events, announcements, membership, and contact details.",
        };
      }
      if (
        lower.includes("what") ||
        lower.includes("how") ||
        lower.includes("where") ||
        lower.includes("when") ||
        lower.includes("can you")
      ) {
        return {
          reply:
            "Let me help you with that. I can guide you through events, membership, team details, announcements, and contact options.",
        };
      }
      return { reply: fallbackMessage };
  }
}

function buildReply(
  message: string,
  page: string | undefined,
  history: HistoryMessage[]
): ChatResponse {
  const normalizedPage = normalizePage(page);

  if (isPageContextQuestion(message) && pageContext[normalizedPage]) {
    return {
      reply: getPageContextReply(normalizedPage),
    };
  }

  const identityResponse = getIdentityResponse(message);
  if (identityResponse) return identityResponse;

  const chapterInfoResponse = getChapterInfoResponse(message);
  if (chapterInfoResponse) return chapterInfoResponse;

  if (isHelpQuery(message)) {
    return {
      reply: "I can help you explore the IEEE CS chapter. Choose a quick action below.",
    };
  }

  const currentIntent = detectIntent(message);
  const followUp = isShortFollowUp(message);
  const previousIntent = inferLastIntent(history);
  const resolvedIntent =
    currentIntent === "general" && followUp ? previousIntent : currentIntent;

  return getIntentResponse(resolvedIntent, normalizedPage, message, followUp);
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, page, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sanitizedMessage = sanitizeMessage(message);
    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    const normalizedHistory = normalizeHistory(history);
    const response = buildReply(sanitizedMessage, page, normalizedHistory);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
