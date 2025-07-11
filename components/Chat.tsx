"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

interface ChatProps {
  chatId: string;
}

interface Message {
  text: string;
  sender: "user" | "assistant";
}

const Chat = ({ chatId }: ChatProps) => {
  const [chat, setChat] = useState<any>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatId) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setChat(res.data);
      })
      .catch((error) => {
        console.error("Error fetching chat:", error);
      });
  }, [chatId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  if (!chat) return <div className="text-white p-4">Loading chat...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* Chat Title */}
      <div className="px-4 py-3 border-b border-slate-800 text-xl font-semibold">
        {chat.title}
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {chat.messages.map((message: Message, index: number) => (
          <div
            key={index}
            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm break-words ${
              message.sender === "user"
                ? "ml-auto bg-blue-600 text-white text-right"
                : "mr-auto bg-slate-800 text-slate-200 text-left"
            }`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input at Bottom */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 sticky bottom-0">
        <Input
          className="bg-slate-900 text-white placeholder:text-slate-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Chat;
