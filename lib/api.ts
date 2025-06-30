// lib/api.ts

import axios from "axios";
import { ChartData } from "chart.js";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // This ensures cookies are sent
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChartWithChatInfo extends ChartData {
  id: string;
  chat: {
    id: string;
    title: string;
  };
}

export const api = {
  // signup function (no changes)
  async signup(data: { username: string; email: string; password: string }) {
    try {
      const response = await apiClient.post("/api/auth/signup", data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Signup API error:",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Signup API error:", error.message);
      } else {
        console.error("Signup API error:", error);
      }
      throw error;
    }
  },

  // signin function (no changes)
  async signin(data: { email: string; password: string }) {
    try {
      const response = await apiClient.post("/api/auth/signin", data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Signin API error:",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Signin API error:", error.message);
      } else {
        console.error("Signin API error:", error);
      }
      throw error;
    }
  },

  async getMe() {
    try {
      const response = await apiClient.get("/api/auth/me");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // A 401 status is NOT an application error. It's the expected and
        // valid response from the server when a user has no active session.
        // We will not log it to the console. We simply re-throw the error
        // so that our application logic (in providers.tsx) can react to it
        // by setting the user state to null.
        if (error.response?.status === 401) {
          throw error; // This is normal, do not log it.
        }

        // However, if we get any OTHER status code (like 500 Internal Server Error),
        // that IS an unexpected error, and we DO want to log it for debugging.
        console.error(
          "GetMe API error:",
          error.response?.data || error.message
        );
      } else {
        // Also log any non-Axios errors that might occur.
        console.error("An unknown error occurred in getMe:", error);
      }

      // We must always re-throw so the calling code knows the request failed.
      throw error;
    }
  },

  // signout function (no changes)
  async signout() {
    try {
      const response = await apiClient.post("/api/auth/signout");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Signout API error:",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Signout API error:", error.message);
      } else {
        console.error("Signout API error:", error);
      }
      throw error;
    }
  },

  // getDashboardStats function (no changes)
  async getDashboardStats() {
    try {
      const response = await apiClient.get("/api/stats");
      return response.data as {
        chats: number;
        documents: number;
        charts: number;
        tokensUsed: number;
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "GetStats API error:",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("GetStats API error:", error.message);
      } else {
        console.error("GetStats API error:", error);
      }
      throw error;
    }
  },

  async generateChart(
    chatId: string,
    prompt: string,
    chartType: string = "bar"
  ) {
    // We default to 'bar' but can send others like 'line' or 'pie'
    const response = await apiClient.post("/api/charts", {
      chatId,
      prompt,
      chartType,
      label: `Chart based on: "${prompt.substring(0, 30)}..."`, // A sensible default label
    });
    return response.data;
  },
  // createChat, getChats, getChatById functions (no changes)
  async createChat(data: { title: string }) {
    const response = await apiClient.post("/api/chats", data);
    return response.data;
  },
  async getChats() {
    const response = await apiClient.get("/api/chats");
    return response.data;
  },
  async getChatById(id: string) {
    try {
      const response = await apiClient.get(`/api/chats/${id}`);
      return response.data;
    } catch (error) {
      console.error(`API error fetching chat ${id}:`, error);
      throw error;
    }
  },

  // CHART API functions (no changes)
  async getAllCharts(): Promise<ChartWithChatInfo[]> {
    try {
      const response = await apiClient.get("/api/charts");
      // We cast the response data to our specific type
      return response.data as ChartWithChatInfo[];
    } catch (error) {
      console.error("API error fetching all charts:", error);
      throw error;
    }
  },

  async getChartById(id: string) {
    const response = await apiClient.get(`/api/charts/${id}`);
    return response.data;
  },
  async uploadDocument(chatId: string, file: File) {
    const formData = new FormData();
    formData.append("document", file);

    // The endpoint here must match your backend route for uploading documents to a chat.
    const response = await apiClient.post(
      `/api/chats/${chatId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async addMessage(chatId: string, text: string, isFirstMessage: boolean) {
    const response = await apiClient.post(`/api/chats/${chatId}/messages`, {
      text,
      // We send a flag to let the backend know it should trigger the chat rename logic.
      shouldRenameChat: isFirstMessage,
    });
    return response.data;
  },
};
