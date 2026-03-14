"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ChatWindow from "./ChatWindow";

export default function OwlMascot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node)
      ) {
        setIsChatOpen(false);
      }
    };

    if (isChatOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isChatOpen]);

  const handleOwlClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className={cn(
          "fixed bottom-24 right-24 w-[320px] sm:w-[380px] z-[9999] transition-all duration-300 ease-in-out transform pointer-events-auto",
          isChatOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        <ChatWindow
          onClose={() => setIsChatOpen(false)}
          onThinkingChange={setIsThinking}
        />
      </div>

      {/* Owl Mascot */}
      <div className="fixed bottom-8 right-8 z-[10000]">
        <button
          onClick={handleOwlClick}
          className="owl-mascot-trigger group relative"
          aria-label="Open chat assistant"
        >
          {/* Owl Image */}
          <div
            className={cn(
              "relative w-20 h-20 transition-transform duration-300 group-hover:scale-110",
              isThinking ? "styza-thinking" : ""
            )}
            aria-busy={isThinking}
          >
            {isThinking && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-sky-400/25 blur-xl scale-125"
              />
            )}
            <Image
              src="/assets/robot-owl.svg"
              alt="Styza, IEEE Assistant Owl"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>

          {/* Chat indicator dot */}
          {isChatOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B1120]"></div>
          )}
        </button>
      </div>
    </>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
