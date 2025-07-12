"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bot, CircleUser, Send } from "lucide-react";

interface ChatProps {
  chatId: string;
}

interface Message {
  sender: "user" | "assistant";
  text: string;
}

interface ChatData {
  messages: Message[];
}
const Chat = ({ chatId }: ChatProps) => {
  const [chat, setChat] = useState<ChatData | null>(null);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`,
        {
          withCredentials: true,
        }
      );
      setChat(res.data);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      sender: "user",
      text: input,
    };

    setChat((prev) => {
      if (!prev) return { messages: [userMessage] };
      return {
        ...prev,
        messages: [...prev.messages, userMessage],
      };
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}/messages`,
        { text: input },
        { withCredentials: true }
      );
      await fetchChat();
    } catch (error) {
      console.error("Message send error:", error);
    }
  };

  useEffect(() => {
    if (!chatId) return;
    fetchChat();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages?.length]);

  if (!chat) return <div className="text-white p-4">Loading chat...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {chat.messages.map((message: Message, index: number) => {
          const isUser = message.sender === "user";
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className={`flex w-full ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end gap-2 max-w-[75%] ${
                  isUser ? "flex-row-reverse" : ""
                }`}
              >
                {isUser ? (
                  <CircleUser className="w-8 h-8 text-blue-500" />
                ) : (
                  <Bot className="w-8 h-8 text-slate-400" />
                )}
                <div
                  className={`rounded-lg px-4 py-3 text-sm shadow-md whitespace-pre-wrap ${
                    isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
          setInput("");
        }}
        className="w-full border-t border-slate-800 bg-slate-900 px-4 py-3 shadow-inner sticky bottom-0 z-10"
      >
        <div className="flex items-center gap-3">
          <Input
            className="flex-1 bg-slate-800 text-white placeholder:text-slate-400 border border-slate-700 focus:ring-2 focus:ring-slate-500 focus:outline-none h-11"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-gradient-to-br from-slate-500 to-slate-900 text-white rounded-md flex items-center justify-center hover:from-slate-900 hover:to-slate-600 transition duration-300 px-4 py-2 cursor-pointer "
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
