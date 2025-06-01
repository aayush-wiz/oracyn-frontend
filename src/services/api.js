import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Don't redirect here, let the component handle it
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user && user !== 'undefined' ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      return null;
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/auth/profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh', { refreshToken });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    return response.data;
  },
};

// File APIs
export const fileAPI = {
  upload: async (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(percentCompleted);
      },
    });
    return response.data;
  },

  list: async (page = 1, limit = 10) => {
    const response = await api.get('/files', {
      params: { page, limit },
    });
    return response.data;
  },

  delete: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  getProcessingStatus: async (fileId) => {
    const response = await api.get(`/files/${fileId}/status`);
    return response.data;
  },

  startProcessing: async (fileIds) => {
    const response = await api.post('/files/process', { fileIds });
    return response.data;
  },
};

// Query APIs
export const queryAPI = {
  submit: async (query, fileIds = []) => {
    const response = await api.post('/query', {
      query,
      fileIds,
      timestamp: new Date().toISOString(),
    });
    return response.data;
  },

  getHistory: async (page = 1, limit = 20) => {
    const response = await api.get('/query/history', {
      params: { page, limit },
    });
    return response.data;
  },

  deleteQuery: async (queryId) => {
    const response = await api.delete(`/query/${queryId}`);
    return response.data;
  },

  clearHistory: async () => {
    const response = await api.delete('/query/history');
    return response.data;
  },
};

// Analysis APIs
export const analysisAPI = {
  save: async (analysisData) => {
    const response = await api.post('/analyses', analysisData);
    return response.data;
  },

  list: async (page = 1, limit = 10, type = 'all') => {
    const response = await api.get('/analyses', {
      params: { page, limit, type },
    });
    return response.data;
  },

  get: async (analysisId) => {
    const response = await api.get(`/analyses/${analysisId}`);
    return response.data;
  },

  delete: async (analysisId) => {
    const response = await api.delete(`/analyses/${analysisId}`);
    return response.data;
  },

  export: async (analysisId, format = 'json') => {
    const response = await api.get(`/analyses/${analysisId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  exportAll: async (format = 'json') => {
    const response = await api.get('/analyses/export', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// Analytics APIs
export const analyticsAPI = {
  getDashboardData: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getQueryStats: async (timeRange = '7d') => {
    const response = await api.get('/analytics/queries', {
      params: { timeRange },
    });
    return response.data;
  },

  getFileStats: async () => {
    const response = await api.get('/analytics/files');
    return response.data;
  },

  getUsageStats: async (timeRange = '30d') => {
    const response = await api.get('/analytics/usage', {
      params: { timeRange },
    });
    return response.data;
  },
};

export default api; 