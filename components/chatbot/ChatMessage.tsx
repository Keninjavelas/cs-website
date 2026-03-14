"use client";

import { Bot, User } from "lucide-react";

interface Action {
  label: string;
  type: "link" | "message";
  value: string;
}

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
    actions?: Action[];
  };
  onActionClick?: (action: Action) => void;
}

export default function ChatMessage({ message, onActionClick }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex items-start gap-2 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
          isUser
            ? "bg-sky-600 text-white rounded-br-none"
            : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action) => (
              <button
                key={`${message.id}-${action.label}-${action.value}`}
                type="button"
                className="px-3 py-1 text-xs bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors border border-sky-700/30"
                onClick={() => onActionClick?.(action)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
