import { Bot } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 self-start animate-pulse text-neutral-400">
    <Bot className="w-5 h-5" />
    <div className="text-sm">Assistant is typing...</div>
    <div className="flex space-x-1">
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce delay-100" />
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce delay-200" />
    </div>
  </div>
);

export default TypingIndicator;
