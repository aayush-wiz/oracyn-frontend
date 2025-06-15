import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInputArea = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="flex items-center justify-center px-4 py-6 bg-transparent">
      <div
        className={`flex items-center w-full max-w-4xl px-4 py-2 transition-all rounded-full border backdrop-blur-md bg-zinc-900/60 ${
          isFocused
            ? "border-neutral-300 shadow-[0_0_12px_2px_rgba(245,245,245,0.2)]"
            : "border-neutral-700"
        }`}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          className="flex-1 outline-none bg-transparent px-2 text-sm md:text-base text-neutral-100 placeholder-neutral-400"
        />
        <button
          disabled={!message.trim()}
          className="ml-3 p-2 rounded-full transition-all bg-neutral-200/20 text-neutral-100 hover:bg-neutral-300/20 active:scale-95 active:bg-neutral-100/20 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:shadow-[0_0_12px_rgba(255,255,255,0.3)]"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInputArea;
