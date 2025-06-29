import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // This ensures cookies are sent
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
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
        console.error(
          "GetMe API error:",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("GetMe API error:", error.message);
      } else {
        console.error("GetMe API error:", error);
      }
      throw error;
    }
  },

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

  // NEW FUNCTION FOR DASHBOARD
  async getDashboardStats() {
    try {
      // Assumes a new backend endpoint at GET /api/stats
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

  // CHART API
  async getAllCharts() {
    const response = await apiClient.get("/api/charts");
    return response.data;
  },
  async getChartById(id: string) {
    const response = await apiClient.get(`/api/charts/${id}`);
    return response.data;
  },
};
