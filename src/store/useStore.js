// store/useStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

const useStore = create(
  persist(
    (set, get) => ({
      // Chat state
      chats: [],
      activeChat: null,

      // Chart state
      charts: [],
      activeChart: null,

      // Document state
      documents: [],

      // Analytics state
      apiCalls: 0,
      processingSpeed: 0,
      totalDocumentsProcessed: 0,
      storageUsed: 0, // in MB
      maxStorage: 5120, // 5GB in MB
      maxChatSessions: 10,

      // Helper function to check if a chat is empty
      isChatEmpty: (chat) => {
        if (!chat) return true;

        // A chat is empty if:
        // 1. No messages at all, OR
        // 2. Only has welcome/assistant messages and no user messages, OR
        // 3. No document uploaded and no meaningful user interaction
        const hasUserMessages = chat.messages.some(
          (msg) => msg.sender === "user"
        );
        const hasDocument = !!chat.document;

        return !hasUserMessages && !hasDocument;
      },

      // Check if there's an existing empty chat
      hasEmptyChat: () => {
        const { chats, isChatEmpty } = get();
        return chats.some((chat) => isChatEmpty(chat));
      },

      // Chat actions
      createChat: () => {
        const { chats, hasEmptyChat } = get();

        // Check if maximum chats reached
        if (chats.length >= 10) return null;

        // Check if there's already an empty chat
        if (hasEmptyChat()) {
          return null; // Don't create new chat if empty one exists
        }

        const newChat = {
          id: nanoid(), // Use nanoid for unique ID
          title: `New Chat ${chats.length + 1}`,
          messages: [],
          document: null,
          documentsUsed: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChat: newChat.id,
        }));

        return newChat.id;
      },

      // Get or create empty chat (for dashboard and routing)
      getOrCreateEmptyChat: () => {
        const { chats, isChatEmpty, createChat } = get();

        // First, try to find an existing empty chat
        const emptyChat = chats.find((chat) => isChatEmpty(chat));
        if (emptyChat) {
          return emptyChat.id;
        }

        // If no empty chat exists, create a new one
        return createChat();
      },

      setActiveChat: (chatId) => {
        set({ activeChat: chatId });
      },

      updateChat: (chatId, updates) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, ...updates, updatedAt: new Date().toISOString() }
              : chat
          ),
        }));
      },

      deleteChat: (chatId) => {
        set((state) => {
          const updatedChats = state.chats.filter((chat) => chat.id !== chatId);
          const updatedCharts = state.charts.filter(
            (chart) => chart.chatId !== chatId
          );
          const updatedDocuments = state.documents.filter(
            (doc) => doc.chatId !== chatId
          );

          return {
            chats: updatedChats,
            charts: updatedCharts,
            documents: updatedDocuments,
            activeChat: state.activeChat === chatId ? null : state.activeChat,
          };
        });
      },

      addMessage: (chatId, message) => {
        const newMessage = {
          id: nanoid(), // Use nanoid for unique message ID
          timestamp: new Date().toLocaleTimeString(),
          ...message,
        };

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  updatedAt: new Date().toISOString(),
                }
              : chat
          ),
        }));

        return newMessage;
      },

      // Chart actions
      createChart: (chartData) => {
        const newChart = {
          id: nanoid(), // Use nanoid for unique chart ID
          chatId: chartData.chatId,
          type: chartData.type || "bar",
          label: chartData.label || "Untitled Chart",
          data: chartData.data || {
            labels: ["Sample Data"],
            datasets: [
              {
                label: "Sample Dataset",
                data: [42],
                backgroundColor: ["rgba(99, 102, 241, 0.8)"],
                borderColor: ["rgba(99, 102, 241, 1)"],
                borderWidth: 1,
              },
            ],
          },
          config: chartData.config || {},
          createdAt: new Date().toISOString(),
          createdFrom: chartData.createdFrom || "Chat",
        };

        set((state) => ({
          charts: [newChart, ...state.charts],
        }));

        return newChart;
      },

      updateChart: (chartId, updates) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === chartId ? { ...chart, ...updates } : chart
          ),
        }));
      },

      deleteChart: (chartId) => {
        set((state) => ({
          charts: state.charts.filter((chart) => chart.id !== chartId),
        }));
      },

      // Document actions
      addDocument: (documentData) => {
        const newDocument = {
          id: nanoid(), // Use nanoid for unique document ID
          chatId: documentData.chatId,
          name: documentData.name,
          size: documentData.size,
          type: documentData.type,
          uploadedAt: new Date().toISOString(),
        };

        set((state) => ({
          documents: [newDocument, ...state.documents],
          totalDocumentsProcessed: state.totalDocumentsProcessed + 1,
          storageUsed: state.storageUsed + documentData.size / (1024 * 1024), // Convert to MB
        }));

        return newDocument;
      },

      // Analytics actions
      incrementApiCalls: () => {
        set((state) => ({
          apiCalls: state.apiCalls + 1,
        }));
      },

      updateProcessingSpeed: (speed) => {
        set({ processingSpeed: speed });
      },

      // Utility functions
      getCurrentChat: () => {
        const { chats, activeChat } = get();
        return chats.find((chat) => chat.id === activeChat);
      },

      getChatCharts: (chatId) => {
        const { charts } = get();
        return charts.filter((chart) => chart.chatId === chatId);
      },

      // Get recent activities from chats
      getRecentActivities: () => {
        const { chats } = get();
        return chats
          .filter((chat) => chat.messages.length > 0)
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
          .map((chat) => ({
            ...chat,
            lastUsed: chat.updatedAt,
          }));
      },

      // Initialize with welcome message if no chats exist
      initializeStore: () => {
        const { chats, createChat, updateChat } = get();
        if (chats.length === 0) {
          const welcomeChatId = createChat();
          if (welcomeChatId) {
            updateChat(welcomeChatId, {
              title: "Welcome Chat",
              messages: [
                {
                  id: nanoid(),
                  sender: "assistant",
                  text: "Welcome to Oracyn! Upload a document to start analyzing and creating charts from your data.",
                  timestamp: new Date().toLocaleTimeString(),
                },
              ],
            });
          }
        }
      },
    }),
    {
      name: "oracyn-store",
      version: 1,
    }
  )
);

export default useStore;
