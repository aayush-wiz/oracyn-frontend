"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// UI & Child Component Imports
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { DocumentUploadView } from "@/components/DocumentUploadView";
import { StreamingTextMessage } from "@/components/StreamingTextMessage";
import {
  ExpandableChartCard,
  ChartCardData,
} from "@/components/ExpandableChartCard";
import { IconSparkles } from "@tabler/icons-react";

// Skeleton component for the initial loading state
const ChatPageSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="h-8 w-1/3 bg-zinc-800 rounded mb-6 shrink-0"></div>
    <div className="flex-grow space-y-4">
      <div className="h-16 w-2/3 bg-zinc-900 rounded-lg self-start"></div>
      <div className="h-20 w-3/4 bg-blue-900/50 rounded-lg self-end ml-auto"></div>
      <div className="h-12 w-1/2 bg-zinc-900 rounded-lg self-start"></div>
    </div>
    <div className="h-12 w-full bg-zinc-800 rounded-lg mt-auto shrink-0"></div>
  </div>
);

// Type definitions for clarity
type Message = { id: string; sender: "user" | "assistant"; text: string };

// Helper function to determine if a prompt is a chart request
const isChartRequest = (text: string): boolean => {
  const keywords = [
    "chart",
    "graph",
    "plot",
    "visualize",
    "bar",
    "line",
    "pie",
    "doughnut",
    "area",
  ];
  const lowerText = text.toLowerCase();
  return keywords.some((keyword) => lowerText.includes(keyword));
};

const ChatPage = () => {
  const params = useParams();
  const queryClient = useQueryClient();

  // Safely gets the chatId string, handling both `[chatId]` and `[...chatId]` routes.
  const getChatId = () => {
    const chatIdParam = params.chatId;
    return Array.isArray(chatIdParam) ? chatIdParam[0] : chatIdParam;
  };
  const chatId = getChatId();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const bottomOfMessagesRef = useRef<HTMLDivElement>(null);

  // Main query to fetch all data for this chat
  const {
    data: chatData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => api.getChatById(chatId!),
    enabled: !!chatId, // Query is only enabled when chatId is available
  });

  // Effect to sync messages from the server with our local state
  useEffect(() => {
    if (chatData?.messages) {
      setMessages(chatData.messages);
    }
  }, [chatData]);

  // Effect to scroll to the bottom when new content is added
  useEffect(() => {
    setTimeout(() => {
      bottomOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, chatData?.charts]); // Auto-scroll on new messages OR new charts

  // --- MUTATIONS ---
  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      if (!chatId) throw new Error("Chat ID is missing for upload.");
      return api.uploadDocument(chatId, file);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] }),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => {
      if (!chatId) throw new Error("Chat ID is missing for message.");
      return api.addMessage(chatId, text, messages.length === 0);
    },
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: ["chat", chatId] });
      const previousData = queryClient.getQueryData(["chat", chatId]);
      setMessages((prev) => [
        ...prev,
        { id: `optimistic-${Date.now()}`, sender: "user", text },
      ]);
      setInputValue("");
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["chat", chatId], context.previousData);
      }
    },
  });

  const generateChartMutation = useMutation({
    mutationFn: (prompt: string) => {
      if (!chatId) throw new Error("Chat ID is missing for chart generation.");
      return api.generateChart(chatId, prompt);
    },
    onMutate: () => setInputValue(""),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] }),
    onError: (err) => console.error("Chart generation failed", err),
  });

  // Main handler that delegates to the correct mutation
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (
      !text ||
      sendMessageMutation.isPending ||
      generateChartMutation.isPending
    )
      return;

    if (isChartRequest(text)) {
      generateChartMutation.mutate(text);
    } else {
      sendMessageMutation.mutate(text);
    }
  };

  // --- RENDER LOGIC ---
  if (!chatId) {
    return (
      <div className="text-center text-red-500">
        Error: Invalid Chat URL. No Chat ID found.
      </div>
    );
  }

  if (isLoading) return <ChatPageSkeleton />;

  if (isError) {
    return (
      <div className="text-center text-red-400">
        <h2>Error</h2>
        <p>Could not load chat data: {(error as Error).message}</p>
      </div>
    );
  }

  const isNewChat = !chatData?.documents || chatData.documents.length === 0;

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 mb-4">
        <h1 className="text-2xl font-bold text-white truncate">
          {chatData?.title || "New Chat"}
        </h1>
        <p className="text-xs text-zinc-500">Chat ID: {chatId}</p>
      </div>

      {isNewChat ? (
        <DocumentUploadView
          onUploadConfirm={(file) => uploadMutation.mutate(file)}
          isUploading={uploadMutation.isPending}
          uploadError={
            uploadMutation.isError
              ? (uploadMutation.error as Error).message
              : null
          }
        />
      ) : (
        <>
          <div className="flex-grow mb-4 pr-4 -mr-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={`${msg.id}-${index}`}
                className={`mb-4 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "assistant" ? (
                  <StreamingTextMessage text={msg.text} />
                ) : (
                  <div className="max-w-xl p-3 bg-blue-600 text-white rounded-lg break-words">
                    <p>{msg.text}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Render charts using the ExpandableChartCard component */}
            {chatData?.charts && chatData.charts.length > 0 && (
              <div className="my-6 border-t border-zinc-700/50 pt-6">
                <ExpandableChartCard
                  charts={chatData.charts as ChartCardData[]}
                />
              </div>
            )}

            {/* Loading indicator for chart generation */}
            {generateChartMutation.isPending && (
              <div className="flex justify-center items-center gap-3 text-zinc-400 bg-zinc-900/50 p-4 rounded-lg my-4">
                <IconSparkles className="animate-pulse text-yellow-400" />
                Analyzing data and generating chart...
              </div>
            )}
            <div ref={bottomOfMessagesRef} />
          </div>

          <div className="mt-auto shrink-0">
            <PlaceholdersAndVanishInput
              placeholders={[
                "What are the key takeaways from the document?",
                "Summarize the introduction.",
                "Create a bar chart showing revenue by quarter.",
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onSubmit={handleSubmit}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
