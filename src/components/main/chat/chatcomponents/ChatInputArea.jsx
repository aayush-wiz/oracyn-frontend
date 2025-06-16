// Chat Input Area Component
import { useState } from "react";
import { Send } from "lucide-react";
import { useStore } from "../../../../store/useStore";

const ChatInputArea = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [message, setMessage] = useState("");
  const { addMessage, getCurrentChat } = useStore();
  const currentChat = getCurrentChat();

  const handleSend = () => {
    if (!message.trim() || !currentChat) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: message,
      timestamp: new Date().toLocaleString(),
    };

    addMessage(newMessage);
    setMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text: "I've analyzed your document. What would you like to know about it?",
        timestamp: new Date().toLocaleString(),
      };
      addMessage(assistantMessage);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            currentChat ? "Type your message..." : "Start a new chat first..."
          }
          disabled={!currentChat}
          className="flex-1 outline-none bg-transparent px-2 text-sm md:text-base text-neutral-100 placeholder-neutral-400 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || !currentChat}
          className="ml-3 p-2 rounded-full transition-all bg-neutral-200/20 text-neutral-100 hover:bg-neutral-300/20 active:scale-95 active:bg-neutral-100/20 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:shadow-[0_0_12px_rgba(255,255,255,0.3)]"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


export default ChatInputArea;