// utils/constants.js

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_TYPES: [
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_EXTENSIONS: [
    ".pdf",
    ".txt",
    ".csv",
    ".xlsx",
    ".xls",
    ".pptx",
    ".ppt",
    ".docx",
    ".doc",
  ],
};

// Chat/Document states
export const CHAT_STATES = {
  UPLOAD: "UPLOAD",
  PREVIEW: "PREVIEW",
  QUERY: "QUERY",
  CHAT: "CHAT",
  VISUALIZE: "VISUALIZE",
};

// Chat statuses
export const CHAT_STATUS = {
  STARRED: "STARRED",
  SAVED: "SAVED",
  NONE: "NONE",
};

// Message types
export const MESSAGE_TYPES = {
  REGULAR: "REGULAR",
  QUERY: "QUERY",
  RESPONSE: "RESPONSE",
  SYSTEM: "SYSTEM",
};

// Message senders
export const MESSAGE_SENDERS = {
  USER: "USER",
  ASSISTANT: "ASSISTANT",
};

// File type information
export const FILE_TYPE_INFO = {
  "application/pdf": {
    name: "PDF Document",
    description: "Portable Document Format",
    icon: "📄",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    capabilities: [
      "Text extraction",
      "Structure analysis",
      "Image recognition",
      "Table detection",
    ],
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    name: "Excel Spreadsheet",
    description: "Microsoft Excel Workbook",
    icon: "📊",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    capabilities: [
      "Data analysis",
      "Formula extraction",
      "Chart interpretation",
      "Statistical summaries",
    ],
  },
  "application/vnd.ms-excel": {
    name: "Excel Spreadsheet",
    description: "Microsoft Excel Workbook (Legacy)",
    icon: "📊",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    capabilities: [
      "Data analysis",
      "Formula extraction",
      "Chart interpretation",
      "Statistical summaries",
    ],
  },
  "text/csv": {
    name: "CSV Data File",
    description: "Comma Separated Values",
    icon: "📈",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    capabilities: [
      "Data analysis",
      "Statistical calculations",
      "Trend identification",
      "Data visualization",
    ],
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    name: "PowerPoint Presentation",
    description: "Microsoft PowerPoint",
    icon: "📑",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    capabilities: [
      "Slide analysis",
      "Content extraction",
      "Structure mapping",
      "Key points identification",
    ],
  },
  "application/vnd.ms-powerpoint": {
    name: "PowerPoint Presentation",
    description: "Microsoft PowerPoint (Legacy)",
    icon: "📑",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    capabilities: [
      "Slide analysis",
      "Content extraction",
      "Structure mapping",
      "Key points identification",
    ],
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    name: "Word Document",
    description: "Microsoft Word Document",
    icon: "📝",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    capabilities: [
      "Text analysis",
      "Content summarization",
      "Structure extraction",
      "Keyword identification",
    ],
  },
  "application/msword": {
    name: "Word Document",
    description: "Microsoft Word Document (Legacy)",
    icon: "📝",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    capabilities: [
      "Text analysis",
      "Content summarization",
      "Structure extraction",
      "Keyword identification",
    ],
  },
  "text/plain": {
    name: "Text File",
    description: "Plain Text Document",
    icon: "📄",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    capabilities: [
      "Text analysis",
      "Content parsing",
      "Keyword extraction",
      "Structure identification",
    ],
  },
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
  },
  USER: {
    PROFILE: "/api/user/profile",
  },
  CHATS: {
    BASE: "/api/chats",
    MESSAGES: (id) => `/api/chats/${id}/messages`,
    FILES: (id) => `/api/chats/${id}/files`,
    UPLOAD: (id) => `/api/chats/${id}/upload`,
    QUERY: (id) => `/api/chats/${id}/query`,
    SHARE: (id) => `/api/chats/${id}/share`,
  },
};

// Query keys for TanStack Query
export const QUERY_KEYS = {
  USER: ["user"],
  USER_PROFILE: ["user", "profile"],
  DOCUMENTS: ["documents"],
  DOCUMENT: (id) => ["document", id],
  DOCUMENT_MESSAGES: (id) => ["document", id, "messages"],
  DOCUMENT_FILES: (id) => ["document", id, "files"],
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  SIDEBAR_COLLAPSED: "sidebarCollapsed",
};

// Toast/notification types
export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Application routes
export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  ANALYZE: "/analyze",
  ANALYZE_DOCUMENT: (id) => `/analyze/${id}`,
  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_SECURITY: "/settings/security",
  SETTINGS_DATA: "/settings/data",
};

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_WITH_TIME: "MMM dd, yyyy HH:mm",
  ISO: "yyyy-MM-dd",
  TIME_ONLY: "HH:mm",
};

// Environment variables
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  APP_NAME: import.meta.env.VITE_APP_NAME || "DocAnalyzer",
  MAX_FILE_SIZE:
    parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || FILE_UPLOAD.MAX_SIZE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
