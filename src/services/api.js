import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (firstName, lastName, email, password) => {
    const response = await api.post("/auth/signup", {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },

  getUser: async (token) => {
    const response = await api.get("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getChats: async (token) => {
    const response = await api.get("/chats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createChat: async (token, title) => {
    const response = await api.post(
      "/chats",
      { title },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  updateChat: async (token, chatId, status, title) => {
    const response = await api.patch(
      `/chats/${chatId}`,
      { status, title },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  deleteChat: async (token, chatId) => {
    const response = await api.delete(`/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  uploadFile: async (token, chatId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/chats/${chatId}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getChatFiles: async (token, chatId) => {
    const response = await api.get(`/chats/${chatId}/files`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  submitQuery: async (token, chatId, prompt) => {
    const response = await api.post(
      `/chats/${chatId}/query`,
      { prompt },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  shareChat: async (token, chatId) => {
    const response = await api.post(
      `/chats/${chatId}/share`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.shareLink;
  },
};
