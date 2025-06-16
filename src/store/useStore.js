// store/appStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      // Documents state
      documents: [],
      totalDocumentsProcessed: 0,

      // Chats state
      chats: [],
      activeChatSessions: 0,
      maxChatSessions: 10,

      // Charts state
      charts: [],

      // System metrics
      processingSpeed: 0, // in seconds
      apiCalls: 0,
      storageUsed: 0, // in MB
      maxStorage: 500, // in MB

      // Actions for documents
      addDocument: (document) =>
        set((state) => ({
          documents: [
            ...state.documents,
            {
              id: Date.now(),
              name: document.name,
              uploadedAt: new Date().toISOString(),
              size: document.size || 0,
              ...document,
            },
          ],
          totalDocumentsProcessed: state.totalDocumentsProcessed + 1,
          storageUsed: Math.min(
            state.storageUsed + (document.size || 0) / (1024 * 1024),
            state.maxStorage
          ),
        })),

      // Actions for chats
      createChat: () => {
        const state = get();
        if (state.activeChatSessions >= state.maxChatSessions) {
          return null; // Max sessions reached
        }

        const newChat = {
          id: `chat-${Date.now()}`,
          title: `New Chat ${state.chats.length + 1}`,
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
          messages: [],
          documentsUsed: 0,
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatSessions: Math.min(
            state.activeChatSessions + 1,
            state.maxChatSessions
          ),
        }));

        return newChat.id;
      },

      updateChat: (chatId, updates) =>
        set((state) => ({
          chats: state.chats
            .map((chat) =>
              chat.id === chatId
                ? { ...chat, ...updates, lastUsed: new Date().toISOString() }
                : chat
            )
            .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed)),
        })),

      deleteChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          activeChatSessions: Math.max(0, state.activeChatSessions - 1),
        })),

      // Actions for charts
      addChart: (chart) =>
        set((state) => ({
          charts: [
            ...state.charts,
            {
              id: Date.now(),
              createdAt: new Date().toISOString(),
              ...chart,
            },
          ],
        })),

      // Get recent activities (top 3 most recent chats)
      getRecentActivities: () => {
        const state = get();
        return state.chats
          .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
          .slice(0, 3);
      },

      // Update metrics
      updateProcessingSpeed: (speed) => set({ processingSpeed: speed }),
      incrementApiCalls: () =>
        set((state) => ({ apiCalls: state.apiCalls + 1 })),

      // Reset functions
      resetStore: () =>
        set({
          documents: [],
          totalDocumentsProcessed: 0,
          chats: [],
          activeChatSessions: 0,
          charts: [],
          processingSpeed: 0,
          apiCalls: 0,
          storageUsed: 0,
        }),
    }),
    {
      name: "oracyn-app-storage", // unique name for localStorage
      partialize: (state) => ({
        documents: state.documents,
        totalDocumentsProcessed: state.totalDocumentsProcessed,
        chats: state.chats,
        charts: state.charts,
        storageUsed: state.storageUsed,
      }), // Only persist certain parts of the state
    }
  )
);

export default useStore;