// hooks/useDocuments.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatAPI, fileAPI } from "../services/api.js";
import { useAuth } from "./useAuth.js";

export const useDocuments = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Get all documents (chats)
  const {
    data: documents = [],
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: () => chatAPI.getChats(token),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => {
      // Transform chat data to document-like structure
      return data.map((chat) => ({
        id: chat.id,
        name: chat.title || "Untitled Document",
        type: "document",
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        status: chat.status,
        state: chat.state,
        messageCount: chat.messages?.length || 0,
        lastMessage: chat.messages?.[0]?.content || "",
        documentCount: chat.documents?.length || 0,
        documents: chat.documents || [],
        isEmpty: !chat.documents?.length && !chat.messages?.length,
      }));
    },
  });

  // Create new document (chat)
  const createDocumentMutation = useMutation({
    mutationFn: (title) => chatAPI.createChat(token, title),
    onSuccess: (newChat) => {
      // Add new document to cache
      queryClient.setQueryData(["documents"], (oldData = []) => {
        const newDocument = {
          id: newChat.id,
          name: newChat.title || "Untitled Document",
          type: "document",
          createdAt: newChat.createdAt,
          updatedAt: newChat.updatedAt,
          status: newChat.status,
          state: newChat.state,
          messageCount: 0,
          lastMessage: "",
          documentCount: 0,
          documents: [],
          isEmpty: true,
        };
        return [newDocument, ...oldData];
      });
    },
    onError: (error) => {
      console.error("Create document failed:", error);
    },
  });

  // Update document (chat)
  const updateDocumentMutation = useMutation({
    mutationFn: ({ documentId, updates }) =>
      chatAPI.updateChat(token, documentId, updates),
    onMutate: async ({ documentId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["documents"] });

      // Snapshot previous value
      const previousDocuments = queryClient.getQueryData(["documents"]);

      // Optimistically update
      queryClient.setQueryData(["documents"], (oldData = []) =>
        oldData.map((doc) =>
          doc.id === documentId
            ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
            : doc
        )
      );

      return { previousDocuments };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  // Delete document (chat)
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId) => chatAPI.deleteChat(token, documentId),
    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });

      const previousDocuments = queryClient.getQueryData(["documents"]);

      // Optimistically remove document
      queryClient.setQueryData(["documents"], (oldData = []) =>
        oldData.filter((doc) => doc.id !== documentId)
      );

      return { previousDocuments };
    },
    onError: (err, documentId, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  // Get document details
  const useDocumentDetails = (documentId) => {
    return useQuery({
      queryKey: ["document", documentId],
      queryFn: () => chatAPI.getChatMessages(token, documentId),
      enabled: !!token && !!documentId,
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  // Get document files
  const useDocumentFiles = (documentId) => {
    return useQuery({
      queryKey: ["document", documentId, "files"],
      queryFn: () => chatAPI.getChatFiles(token, documentId),
      enabled: !!token && !!documentId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Upload file to document
  const uploadFileMutation = useMutation({
    mutationFn: ({ documentId, file }) =>
      fileAPI.uploadFile(token, documentId, file),
    onSuccess: (data, { documentId }) => {
      // Invalidate document files and details
      queryClient.invalidateQueries({
        queryKey: ["document", documentId, "files"],
      });
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error) => {
      console.error("File upload failed:", error);
    },
  });

  // Get recent documents
  const recentDocuments = documents
    .filter((doc) => !doc.isEmpty)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  // Get user statistics
  const stats = {
    totalDocuments: documents.length,
    totalQueries: documents.reduce((sum, doc) => sum + doc.messageCount, 0),
    documentsThisWeek: documents.filter((doc) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(doc.createdAt) > weekAgo;
    }).length,
  };

  return {
    // Data
    documents,
    recentDocuments,
    stats,

    // Loading states
    isLoadingDocuments,
    isCreatingDocument: createDocumentMutation.isPending,
    isUpdatingDocument: updateDocumentMutation.isPending,
    isDeletingDocument: deleteDocumentMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,

    // Actions
    createDocument: createDocumentMutation.mutateAsync,
    updateDocument: updateDocumentMutation.mutateAsync,
    deleteDocument: deleteDocumentMutation.mutateAsync,
    uploadFile: uploadFileMutation.mutateAsync,
    refetchDocuments,

    // Errors
    documentsError,
    createError: createDocumentMutation.error,
    updateError: updateDocumentMutation.error,
    deleteError: deleteDocumentMutation.error,
    uploadError: uploadFileMutation.error,

    // Helpers
    useDocumentDetails,
    useDocumentFiles,

    // Reset functions
    resetCreateError: createDocumentMutation.reset,
    resetUpdateError: updateDocumentMutation.reset,
    resetDeleteError: deleteDocumentMutation.reset,
    resetUploadError: uploadFileMutation.reset,
  };
};
