// services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

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
    return handleResponse(response);
  },

  signup: async (firstName, lastName, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    return handleResponse(response);
  },

  // User Profile
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
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
    return handleResponse(response);
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error("Backend health check failed:", error);
      return false;
    }
  },
};

export const chatAPI = {
  // Get all chats (documents)
  getChats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Create new chat (document session)
  createChat: async (token, title) => {
    const response = await fetch(`${API_BASE_URL}/api/chats`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    return handleResponse(response);
  },

  // Update chat
  updateChat: async (token, chatId, updates) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  // Delete chat
  deleteChat: async (token, chatId) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Get chat messages
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
    return handleResponse(response);
  },

  // Send message
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
    return handleResponse(response);
  },

  // Submit query
  submitQuery: async (token, chatId, prompt) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    return handleResponse(response);
  },

  // Get chat files
  getChatFiles: async (token, chatId) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Share chat
  shareChat: async (token, chatId) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/share`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },
};

export const chartAPI = {
  // Get all charts for a chat
  getCharts: async (token, chatId) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/charts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Create a new chart
  createChart: async (token, chatId, { prompt, chartType, label }) => {
    const response = await fetch(`${API_BASE_URL}/api/charts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        prompt,
        chartType,
        label,
      }),
    });
    return handleResponse(response);
  },

  // Delete a chart
  deleteChart: async (token, chartId) => {
    const response = await fetch(`${API_BASE_URL}/api/charts/${chartId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
};

export const fileAPI = {
  // Upload file to chat
  uploadFile: async (token, chatId, file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return handleResponse(response);
  },
};

// Combined API object for easier imports
export const api = {
  auth: authAPI,
  chat: chatAPI,
  file: fileAPI,
  chart: chartAPI,
};
