// components/main/chat/TypingIndicator.jsx
import { Bot } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex items-center gap-4 group">
    {/* Bot avatar */}
    <div className="w-10 h-10 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center group-hover:border-gray-600/70 transition-all duration-300 relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1 right-1 w-2 h-2 border border-current rotate-45"></div>
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border border-current"></div>
      </div>

      <Bot className="w-6 h-6 text-indigo-400 relative z-10" />
    </div>

    {/* Typing message */}
    <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-4 relative overflow-hidden group-hover:border-gray-600/70 transition-all duration-300">
      {/* Geometric corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-gray-600 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-gray-600 opacity-30"></div>

      <div className="flex items-center gap-3 relative z-10">
        <span className="text-gray-300 font-medium">Assistant is thinking</span>

        {/* Animated dots */}
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce shadow-lg shadow-indigo-400/50"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce shadow-lg shadow-indigo-400/50"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce shadow-lg shadow-indigo-400/50"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>

      {/* Subtle pulsing background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 animate-pulse rounded-xl"></div>

      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer rounded-xl"></div>
    </div>

    <style jsx>{`
      @keyframes shimmer {
        0% {
          transform: translateX(-100%) skewX(-12deg);
        }
        100% {
          transform: translateX(200%) skewX(-12deg);
        }
      }

      .animate-shimmer {
        animation: shimmer 3s ease-in-out infinite;
      }
    `}</style>
  </div>
);

export default TypingIndicator;
