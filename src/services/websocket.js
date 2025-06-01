import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    
    // Use Vite environment variable
    this.serverUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
  }

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('authToken');

    this.socket = io(this.serverUrl, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection_status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.emit('connection_error', error);
    });

    // File processing events
    this.socket.on('file_processing_started', (data) => {
      this.emit('file_processing_started', data);
    });

    this.socket.on('file_processing_progress', (data) => {
      this.emit('file_processing_progress', data);
    });

    this.socket.on('file_processing_completed', (data) => {
      this.emit('file_processing_completed', data);
    });

    this.socket.on('file_processing_failed', (data) => {
      this.emit('file_processing_failed', data);
    });

    // Query processing events
    this.socket.on('query_processing_started', (data) => {
      this.emit('query_processing_started', data);
    });

    this.socket.on('query_processing_progress', (data) => {
      this.emit('query_processing_progress', data);
    });

    this.socket.on('query_result', (data) => {
      this.emit('query_result', data);
    });

    this.socket.on('query_error', (data) => {
      this.emit('query_error', data);
    });

    // System notifications
    this.socket.on('system_notification', (data) => {
      this.emit('system_notification', data);
    });

    // Analytics updates
    this.socket.on('analytics_update', (data) => {
      this.emit('analytics_update', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event emitter functionality
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  off(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Send events to server
  send(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected. Cannot send event:', event);
    }
  }

  // Join room for specific updates
  joinRoom(room) {
    this.send('join_room', { room });
  }

  // Leave room
  leaveRoom(room) {
    this.send('leave_room', { room });
  }

  // Subscribe to file processing updates
  subscribeToFileProcessing(fileId) {
    this.joinRoom(`file_${fileId}`);
  }

  // Unsubscribe from file processing updates
  unsubscribeFromFileProcessing(fileId) {
    this.leaveRoom(`file_${fileId}`);
  }

  // Subscribe to query updates
  subscribeToQueryUpdates(queryId) {
    this.joinRoom(`query_${queryId}`);
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socket: this.socket?.connected || false,
    };
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService; 