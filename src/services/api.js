// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authAPI = {
  // Authentication
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    return response.json();
  },

  signup: async (firstName, lastName, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }
    return response.json();
  },

  // User Profile
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }
    return response.json();
  },

  updateProfile: async (token, firstName, lastName) => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }
    return response.json();
  },

  // Chats - Full CRUD with backend
  getChats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch chats");
    }
    return response.json();
  },

  createChat: async (token, title) => {
    const response = await fetch(`${API_BASE_URL}/api/chats`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create chat");
    }
    return response.json();
  },

  updateChat: async (token, chatId, updates) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update chat");
    }
    return response.json();
  },

  deleteChat: async (token, chatId) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete chat");
    }
    return response.json();
  },

  // Chat Files - Backend R2 storage integration
  getChatFiles: async (token, chatId) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to fetch chat files from server"
      );
    }
    return response.json();
  },

  // File Upload - Direct to backend R2 storage
  uploadFile: async (token, chatId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, browser sets it with boundary
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload file to server");
    }
    return response.json();
  },

  // Chat Messages - Real backend message storage
  getChatMessages: async (token, chatId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/chats/${chatId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch messages from server");
    }
    return response.json();
  },

  sendMessage: async (token, chatId, content, type = "REGULAR") => {
    const response = await fetch(
      `${API_BASE_URL}/api/chats/${chatId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, type }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send message to server");
    }
    return response.json();
  },

  // Submit initial query - Backend processing
  submitQuery: async (token, chatId, prompt) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to submit query to server");
    }
    return response.json();
  },

  // Update chat state - Backend state management
  updateChatState: async (token, chatId, state) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update chat state on server");
    }
    return response.json();
  },

  // Share chat - Backend sharing
  shareChat: async (token, chatId) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/share`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to share chat");
    }
    return response.json();
  },

  // Health check - Test backend connection
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.ok;
    } catch (error) {
      console.error("Backend health check failed:", error);
      return false;
    }
  },
};
