// utils/errorHandler.js

// Error types
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  AUTH: "AUTH_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  FILE_UPLOAD: "FILE_UPLOAD_ERROR",
  SERVER: "SERVER_ERROR",
  CLIENT: "CLIENT_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

// Custom error class
export class AppError extends Error {
  constructor(
    message,
    type = ERROR_TYPES.UNKNOWN,
    severity = ERROR_SEVERITY.MEDIUM,
    details = null
  ) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Error message mappings
const ERROR_MESSAGES = {
  // Network errors
  "Network request failed":
    "Unable to connect to the server. Please check your internet connection.",
  "Failed to fetch":
    "Unable to connect to the server. Please check your internet connection.",
  NetworkError: "Network connection failed. Please try again.",

  // Auth errors
  "Invalid email or password":
    "The email or password you entered is incorrect.",
  "Email already exists": "An account with this email already exists.",
  "Token is not valid": "Your session has expired. Please log in again.",
  "No token, authorization denied": "Please log in to continue.",
  Unauthorized: "You are not authorized to perform this action.",

  // File upload errors
  "File too large":
    "The file you selected is too large. Please choose a file smaller than 10MB.",
  "Invalid file type":
    "This file type is not supported. Please upload a PDF, Word, Excel, PowerPoint, CSV, or text file.",
  "Upload failed": "Failed to upload the file. Please try again.",

  // Server errors
  "Server error": "Something went wrong on our end. Please try again later.",
  "Internal server error":
    "Server is experiencing issues. Please try again later.",
  "Service unavailable":
    "The service is temporarily unavailable. Please try again later.",

  // Default fallbacks
  "Unknown error": "An unexpected error occurred. Please try again.",
};

// Parse error from different sources
export const parseError = (error) => {
  // Handle AppError instances
  if (error instanceof AppError) {
    return error;
  }

  // Handle fetch/network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new AppError(
      ERROR_MESSAGES["Failed to fetch"] || error.message,
      ERROR_TYPES.NETWORK,
      ERROR_SEVERITY.HIGH
    );
  }

  // Handle API response errors
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    if (status === 401) {
      return new AppError(
        ERROR_MESSAGES[message] || "Authentication failed",
        ERROR_TYPES.AUTH,
        ERROR_SEVERITY.HIGH
      );
    }

    if (status === 403) {
      return new AppError(
        "You do not have permission to perform this action",
        ERROR_TYPES.AUTH,
        ERROR_SEVERITY.MEDIUM
      );
    }

    if (status === 404) {
      return new AppError(
        "The requested resource was not found",
        ERROR_TYPES.CLIENT,
        ERROR_SEVERITY.LOW
      );
    }

    if (status === 422) {
      return new AppError(
        ERROR_MESSAGES[message] || "Validation failed",
        ERROR_TYPES.VALIDATION,
        ERROR_SEVERITY.LOW
      );
    }

    if (status >= 500) {
      return new AppError(
        ERROR_MESSAGES[message] || "Server error occurred",
        ERROR_TYPES.SERVER,
        ERROR_SEVERITY.HIGH
      );
    }
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return new AppError(
      error.message,
      ERROR_TYPES.VALIDATION,
      ERROR_SEVERITY.LOW
    );
  }

  // Handle file upload errors
  if (error.message.includes("file") || error.message.includes("upload")) {
    return new AppError(
      ERROR_MESSAGES[error.message] || error.message,
      ERROR_TYPES.FILE_UPLOAD,
      ERROR_SEVERITY.MEDIUM
    );
  }

  // Handle generic JavaScript errors
  const userMessage =
    ERROR_MESSAGES[error.message] ||
    error.message ||
    "An unexpected error occurred";

  return new AppError(userMessage, ERROR_TYPES.UNKNOWN, ERROR_SEVERITY.MEDIUM, {
    originalError: error.message,
  });
};

// Get user-friendly error message
export const getUserErrorMessage = (error) => {
  const parsedError = parseError(error);
  return parsedError.message;
};

// Check if error is retryable
export const isRetryableError = (error) => {
  const parsedError = parseError(error);

  // Don't retry auth errors
  if (parsedError.type === ERROR_TYPES.AUTH) {
    return false;
  }

  // Don't retry validation errors
  if (parsedError.type === ERROR_TYPES.VALIDATION) {
    return false;
  }

  // Don't retry client errors (4xx)
  if (parsedError.type === ERROR_TYPES.CLIENT) {
    return false;
  }

  // Retry network and server errors
  return [ERROR_TYPES.NETWORK, ERROR_TYPES.SERVER].includes(parsedError.type);
};

// Log error for debugging
export const logError = (error, context = {}) => {
  const parsedError = parseError(error);

  const errorLog = {
    message: parsedError.message,
    type: parsedError.type,
    severity: parsedError.severity,
    timestamp: parsedError.timestamp,
    context,
    stack: error.stack,
    details: parsedError.details,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.group(
      `🚨 ${parsedError.type} - ${parsedError.severity.toUpperCase()}`
    );
    console.error("Message:", parsedError.message);
    console.error("Context:", context);
    console.error("Details:", parsedError.details);
    console.error("Stack:", error.stack);
    console.groupEnd();
  }

  // In production, you might want to send to error tracking service
  if (
    import.meta.env.PROD &&
    parsedError.severity === ERROR_SEVERITY.CRITICAL
  ) {
    // Send to error tracking service (e.g., Sentry, LogRocket, etc.)
    // sendToErrorTracking(errorLog);
  }

  return errorLog;
};

// Error boundary helper
export const handleErrorBoundary = (error, errorInfo) => {
  const parsedError = parseError(error);

  logError(error, {
    componentStack: errorInfo.componentStack,
    errorBoundary: true,
  });

  return {
    hasError: true,
    error: parsedError,
    userMessage: getUserErrorMessage(error),
  };
};

// React Query error handler
export const handleQueryError = (error, query) => {
  const parsedError = parseError(error);

  logError(error, {
    queryKey: query.queryKey,
    queryHash: query.queryHash,
    reactQuery: true,
  });

  // For auth errors, clear user data and redirect to login
  if (parsedError.type === ERROR_TYPES.AUTH) {
    // This will be handled by the auth hook
    return parsedError;
  }

  return parsedError;
};

// Mutation error handler
export const handleMutationError = (error, variables, context, mutation) => {
  const parsedError = parseError(error);

  logError(error, {
    variables,
    context,
    mutationKey: mutation.options.mutationKey,
    mutation: true,
  });

  return parsedError;
};

// File validation error handler
export const handleFileValidationError = (file, errors) => {
  const errorMessage = `File "${file.name}" validation failed: ${errors.join(
    ", "
  )}`;

  return new AppError(
    errorMessage,
    ERROR_TYPES.FILE_UPLOAD,
    ERROR_SEVERITY.LOW,
    { fileName: file.name, errors }
  );
};

// Form validation error handler
export const handleFormValidationError = (field, value, rule) => {
  let message = `${field} is invalid`;

  switch (rule) {
    case "required":
      message = `${field} is required`;
      break;
    case "email":
      message = `Please enter a valid email address`;
      break;
    case "minLength":
      message = `${field} must be at least ${rule.value} characters`;
      break;
    case "maxLength":
      message = `${field} must be no more than ${rule.value} characters`;
      break;
    case "password":
      message = `Password must be at least 8 characters with uppercase, lowercase, and number`;
      break;
    default:
      message = `${field} is invalid`;
  }

  return new AppError(message, ERROR_TYPES.VALIDATION, ERROR_SEVERITY.LOW, {
    field,
    value,
    rule,
  });
};

// Export utility functions
export const errorUtils = {
  parse: parseError,
  getUserMessage: getUserErrorMessage,
  isRetryable: isRetryableError,
  log: logError,
  handleBoundary: handleErrorBoundary,
  handleQuery: handleQueryError,
  handleMutation: handleMutationError,
  handleFileValidation: handleFileValidationError,
  handleFormValidation: handleFormValidationError,
};
