// utils/helpers.js
import { FILE_TYPE_INFO, FILE_UPLOAD } from "./constants.js";

// File utilities
export const fileUtils = {
  // Format file size in human readable format
  formatSize: (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Validate file type
  isValidType: (file) => {
    return FILE_UPLOAD.ALLOWED_TYPES.includes(file.type);
  },

  // Validate file size
  isValidSize: (file) => {
    return file.size <= FILE_UPLOAD.MAX_SIZE;
  },

  // Get file extension
  getExtension: (filename) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  },

  // Get file type information
  getTypeInfo: (mimeType) => {
    return (
      FILE_TYPE_INFO[mimeType] || {
        name: "Unknown File",
        description: "Unknown file type",
        icon: "📎",
        color: "text-gray-500",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        capabilities: ["Basic file handling"],
      }
    );
  },

  // Validate file completely
  validateFile: (file) => {
    const errors = [];

    if (!fileUtils.isValidType(file)) {
      errors.push(`File type "${file.type}" is not supported`);
    }

    if (!fileUtils.isValidSize(file)) {
      errors.push(
        `File size exceeds ${fileUtils.formatSize(FILE_UPLOAD.MAX_SIZE)} limit`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Date utilities
export const dateUtils = {
  // Format date for display
  formatDate: (date, options = {}) => {
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return new Date(date).toLocaleDateString("en-US", {
      ...defaultOptions,
      ...options,
    });
  },

  // Format date with time
  formatDateTime: (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return dateUtils.formatDate(date);
  },

  // Check if date is within last week
  isWithinLastWeek: (date) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(date) > weekAgo;
  },
};

// String utilities
export const stringUtils = {
  // Truncate text with ellipsis
  truncate: (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  },

  // Capitalize first letter
  capitalize: (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Convert to title case
  toTitleCase: (text) => {
    if (!text) return "";
    return text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Remove extra whitespace
  cleanWhitespace: (text) => {
    if (!text) return "";
    return text.replace(/\s+/g, " ").trim();
  },

  // Generate initials from name
  getInitials: (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last;
  },
};

// URL utilities
export const urlUtils = {
  // Build query string from object
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },

  // Parse query string to object
  parseQueryString: (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },
};

// DOM utilities
export const domUtils = {
  // Copy text to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      console.log(err)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        console.log(err)
        document.body.removeChild(textArea);
        return false;
      }
    }
  },

  // Download text as file
  downloadTextAsFile: (content, filename, mimeType = "text/plain") => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Scroll to element
  scrollToElement: (elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  },
};

// Validation utilities
export const validationUtils = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password strength validation
  isStrongPassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
  },

  // Required field validation
  isRequired: (value) => {
    return (
      value !== null && value !== undefined && value.toString().trim() !== ""
    );
  },

  // Min length validation
  hasMinLength: (value, minLength) => {
    return value && value.toString().length >= minLength;
  },

  // Max length validation
  hasMaxLength: (value, maxLength) => {
    return !value || value.toString().length <= maxLength;
  },
};

// Array utilities
export const arrayUtils = {
  // Remove duplicates from array
  unique: (array, key = null) => {
    if (key) {
      const seen = new Set();
      return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      });
    }
    return [...new Set(array)];
  },

  // Group array by key
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Sort array by key
  sortBy: (array, key, direction = "asc") => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (direction === "desc") {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
  },
};

// Local storage utilities
export const storageUtils = {
  // Set item in localStorage with error handling
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error("Error saving to localStorage:", err);
      return false;
    }
  },

  // Get item from localStorage with error handling
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error("Error reading from localStorage:", err);
      return defaultValue;
    }
  },

  // Remove item from localStorage
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error("Error removing from localStorage:", err);
      return false;
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.error("Error clearing localStorage:", err);
      return false;
    }
  },
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
