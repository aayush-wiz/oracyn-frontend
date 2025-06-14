// components/main/Chat.jsx
import React, { useState } from "react";
import { Send, Bot, User } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", content: "Hello! How can I help you today?" },
    { id: 2, type: "user", content: "I need help with my data analysis." },
    {
      id: 3,
      type: "bot",
      content:
        "I'd be happy to help you with data analysis! What specific aspect would you like to work on?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          type: "user",
          content: inputMessage,
        },
      ]);
      setInputMessage("");

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "bot",
            content: "I understand. Let me help you with that...",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">AI Chat Assistant</h1>
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Online</span>
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl h-[70vh] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 bg-gray-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                  message.type === "user"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.type === "user" && (
                <div className="w-8 h-8 bg-gray-600/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="border-t border-gray-700/50 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
