"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const ChatPageSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="h-8 w-1/3 bg-zinc-800 rounded mb-6"></div>
    <div className="flex-grow space-y-4">
      <div className="h-16 w-1/2 bg-zinc-900 rounded-lg self-start"></div>
      <div className="h-20 w-3/4 bg-zinc-800 rounded-lg self-end ml-auto"></div>
      <div className="h-12 w-1/2 bg-zinc-900 rounded-lg self-start"></div>
    </div>
    <div className="h-12 w-full bg-zinc-800 rounded-lg mt-auto"></div>
  </div>
);

const ChatPage = () => {
  const params = useParams();
  const chatId = params.chatId as string;

  const {
    data: chat,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => api.getChatById(chatId),
    enabled: !!chatId, // Only run the query if chatId is available
  });

  if (isLoading) {
    return <ChatPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center text-red-400">
        <h2 className="text-xl font-bold">Error</h2>
        <p>Could not load the chat. Please try again later.</p>
        <p className="text-sm text-zinc-500 mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-4">
        {chat?.title || "Chat"}
      </h1>

      {/* Messages area */}
      <div className="flex-grow bg-zinc-950/30 rounded-lg p-4 mb-4 overflow-y-auto">
        {chat?.messages.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chat.messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xl p-3 rounded-lg ${
                  msg.sender === "user" ? "bg-blue-600" : "bg-zinc-800"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Message Input (Placeholder) */}
      <div className="mt-auto">
        <p className="text-xs text-center text-zinc-600 mb-2">
          Document Upload & Chat Input will go here.
        </p>
        <div className="flex items-center p-2 bg-zinc-900 border border-zinc-700 rounded-lg">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow bg-transparent focus:outline-none px-2"
          />
          <button className="px-4 py-2 bg-slate-700 rounded-md">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
