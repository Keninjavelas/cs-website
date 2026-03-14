"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X, Send, Bot } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface Action {
  label: string;
  type: "link" | "message";
  value: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  actions?: Action[];
}

interface HistoryMessage {
  role: "user" | "bot";
  message: string;
}

const initialGreeting =
  "Hi! I'm Styza, the IEEE Computer Society Assistant Owl. I can help you explore events, announcements, membership, and more.";

const defaultQuickActions: Action[] = [
  { label: "View Events", type: "link", value: "/events" },
  { label: "Join IEEE", type: "link", value: "/membership" },
  { label: "Meet the Team", type: "link", value: "/team" },
  { label: "Contact Us", type: "link", value: "/contact" },
];

export default function ChatWindow({
  onClose,
  onThinkingChange,
}: {
  onClose: () => void;
  onThinkingChange?: (thinking: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: initialGreeting,
      sender: "bot",
      timestamp: new Date(),
      actions: defaultQuickActions,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      onThinkingChange?.(false);
    };
  }, [onThinkingChange]);

  const sanitizeActions = (actions: unknown): Action[] | undefined => {
    if (!Array.isArray(actions)) return undefined;

    const validActions = actions.filter(
      (action): action is Action =>
        typeof action === "object" &&
        action !== null &&
        "label" in action &&
        "type" in action &&
        "value" in action &&
        typeof action.label === "string" &&
        (action.type === "link" || action.type === "message") &&
        typeof action.value === "string"
    );

    return validActions.length > 0 ? validActions.slice(0, 4) : undefined;
  };

  const clearBotActions = (message: Message): Message =>
    message.sender === "bot" && message.actions
      ? { ...message, actions: undefined }
      : message;

  const sendMessageText = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    const baseMessages = messages.map(clearBotActions);
    const history: HistoryMessage[] = [...baseMessages, userMessage]
      .slice(-5)
      .map((item) => ({
        role: item.sender === "user" ? "user" : "bot",
        message: item.text,
      }));

    setMessages([...baseMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);
    onThinkingChange?.(true);

    // Simulate typing delay (600-1200ms)
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 600));

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          page: pathname,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: "bot",
        timestamp: new Date(),
        actions:
          Array.isArray(data.actions) && data.actions.length > 0
            ? sanitizeActions(data.actions)
            : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      onThinkingChange?.(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await sendMessageText(inputValue);
  };

  const handleActionClick = async (action: Action) => {
    if (isTyping) return;

    if (action.type === "link") {
      router.push(action.value);
      return;
    }

    await sendMessageText(action.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-[#0B1120] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">Styza</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Styza &ndash; IEEE Assistant</h3>
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onActionClick={handleActionClick}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about IEEE..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-900 caret-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            maxLength={500}
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}
