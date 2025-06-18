// store/useStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

      // Chat actions
      createChat: () => {
        const { chats } = get();
        if (chats.length >= 10) return null; // Max 10 chats

        const newChat = {
          id: `chat-${Date.now()}`,
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
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          activeChat: state.activeChat === chatId ? null : state.activeChat,
        }));
      },

      addMessage: (chatId, message) => {
        const newMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
          id: `chart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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
          id: `doc-${Date.now()}`,
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
        const { chats } = get();
        if (chats.length === 0) {
          const welcomeChatId = get().createChat();
          if (welcomeChatId) {
            get().updateChat(welcomeChatId, {
              title: "Welcome Chat",
              messages: [
                {
                  id: "welcome-msg",
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
