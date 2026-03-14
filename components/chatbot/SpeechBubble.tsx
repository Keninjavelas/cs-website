export default function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 animate-fade-in pointer-events-none">
      <div className="relative">
        {/* Bubble content */}
        <div className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-gray-800 border border-gray-200">
          {text}
        </div>
        
        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
          <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
