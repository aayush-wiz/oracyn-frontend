// hooks/useMessages.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatAPI } from "../services/api.js";
import { useAuth } from "./useAuth.js";

export const useMessages = (documentId) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Get messages for a document/chat
  const {
    data: messageData,
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["document", documentId, "messages"],
    queryFn: () => chatAPI.getChatMessages(token, documentId),
    enabled: !!token && !!documentId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
  });

  const messages = messageData?.messages || [];
  const documents = messageData?.documents || [];
  const chatState = messageData?.chatState || "UPLOAD";

  // Send regular message
  const sendMessageMutation = useMutation({
    mutationFn: ({ content, type = "REGULAR" }) =>
      chatAPI.sendMessage(token, documentId, content, type),
    onMutate: async ({ content, type = "REGULAR" }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["document", documentId, "messages"],
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData([
        "document",
        documentId,
        "messages",
      ]);

      // Create optimistic user message
      const optimisticUserMessage = {
        id: `temp-${Date.now()}`,
        chatId: documentId,
        sender: "USER",
        content,
        type,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      // Optimistically update messages
      queryClient.setQueryData(
        ["document", documentId, "messages"],
        (oldData) => ({
          ...oldData,
          messages: [...(oldData?.messages || []), optimisticUserMessage],
        })
      );

      return { previousData };
    },
    onSuccess: (data) => {
      // Replace optimistic messages with real ones
      queryClient.setQueryData(
        ["document", documentId, "messages"],
        (oldData) => ({
          ...oldData,
          messages: [
            ...(oldData?.messages || []).filter((msg) => !msg.isOptimistic),
            data.userMessage,
            data.assistantMessage,
          ],
        })
      );

      // Invalidate documents list to update last message
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["document", documentId, "messages"],
          context.previousData
        );
      }
    },
  });

  // Submit query (initial question)
  const submitQueryMutation = useMutation({
    mutationFn: (prompt) => chatAPI.submitQuery(token, documentId, prompt),
    onMutate: async (prompt) => {
      await queryClient.cancelQueries({
        queryKey: ["document", documentId, "messages"],
      });

      const previousData = queryClient.getQueryData([
        "document",
        documentId,
        "messages",
      ]);

      // Create optimistic query message
      const optimisticQuery = {
        id: `temp-query-${Date.now()}`,
        chatId: documentId,
        sender: "USER",
        content: prompt,
        type: "QUERY",
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      queryClient.setQueryData(
        ["document", documentId, "messages"],
        (oldData) => ({
          ...oldData,
          messages: [...(oldData?.messages || []), optimisticQuery],
          chatState: "CHAT",
        })
      );

      return { previousData };
    },
    onSuccess: (data) => {
      // Replace optimistic with real data
      queryClient.setQueryData(
        ["document", documentId, "messages"],
        (oldData) => ({
          ...oldData,
          messages: [
            ...(oldData?.messages || []).filter((msg) => !msg.isOptimistic),
            data.query,
            data.response,
          ],
          chatState: "CHAT",
        })
      );

      // Update documents list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["document", documentId, "messages"],
          context.previousData
        );
      }
    },
  });

  // Generate suggestions based on uploaded files
  const generateSuggestions = (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return [];

    const baseSuggestions = [
      "What are the key insights from this document?",
      "Summarize the main points",
      "What are the important dates mentioned?",
      "Extract all numerical data",
      "What actions are recommended?",
    ];

    let typeSuggestions = [];

    // Determine suggestions based on file types
    const hasSpreadsheet = uploadedFiles.some(
      (file) =>
        file.type?.includes("spreadsheet") ||
        file.type?.includes("excel") ||
        file.type?.includes("csv")
    );

    const hasPDF = uploadedFiles.some((file) => file.type?.includes("pdf"));

    const hasPresentation = uploadedFiles.some(
      (file) =>
        file.type?.includes("presentation") || file.type?.includes("powerpoint")
    );

    if (hasSpreadsheet) {
      typeSuggestions.push(
        "What columns are available in the data?",
        "Calculate summary statistics",
        "Find trends in the data",
        "Identify outliers or anomalies"
      );
    }

    if (hasPDF) {
      typeSuggestions.push(
        "What is the document structure?",
        "List all headings and sections",
        "Extract contact information",
        "Find key takeaways"
      );
    }

    if (hasPresentation) {
      typeSuggestions.push(
        "What is the presentation structure?",
        "Summarize each slide",
        "Extract bullet points",
        "What is the main message?"
      );
    }

    return [...typeSuggestions, ...baseSuggestions].slice(0, 8);
  };

  // Parse AI response for structured data
  const parseAIResponse = (content) => {
    // Basic parsing - can be enhanced based on your AI response format
    return {
      answer: content,
      confidence: 0.85, // Default confidence
      sources: [], // Extract from content if formatted
      relatedQuestions: [
        "Can you provide more details about this topic?",
        "What are the implications of this analysis?",
        "Are there any additional insights?",
      ],
    };
  };

  // Get the latest AI response
  const latestAIResponse = messages
    .filter((msg) => msg.sender === "ASSISTANT" && msg.type === "RESPONSE")
    .slice(-1)[0];

  const parsedResponse = latestAIResponse
    ? parseAIResponse(latestAIResponse.content)
    : null;

  return {
    // Data
    messages,
    documents,
    chatState,
    parsedResponse,

    // Loading states
    isLoadingMessages,
    isSendingMessage: sendMessageMutation.isPending,
    isSubmittingQuery: submitQueryMutation.isPending,

    // Actions
    sendMessage: sendMessageMutation.mutateAsync,
    submitQuery: submitQueryMutation.mutateAsync,
    refetchMessages,
    generateSuggestions,

    // Errors
    messagesError,
    sendError: sendMessageMutation.error,
    queryError: submitQueryMutation.error,

    // Reset functions
    resetSendError: sendMessageMutation.reset,
    resetQueryError: submitQueryMutation.reset,

    // Computed states
    hasMessages: messages.length > 0,
    lastMessage: messages[messages.length - 1],
    canSendMessage:
      !sendMessageMutation.isPending && !submitQueryMutation.isPending,
  };
};
