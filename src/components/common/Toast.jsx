import { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { TOAST_TYPES } from "../../utils/constants.js";

// Toast Context
const ToastContext = createContext();

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: toast.type || TOAST_TYPES.INFO,
      title: toast.title,
      message: toast.message,
      duration: toast.duration || 5000,
      action: toast.action,
      createdAt: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    // Convenience methods
    success: (message, title, options = {}) =>
      addToast({
        type: TOAST_TYPES.SUCCESS,
        message,
        title,
        ...options,
      }),
    error: (message, title, options = {}) =>
      addToast({
        type: TOAST_TYPES.ERROR,
        message,
        title,
        duration: 8000, // Longer duration for errors
        ...options,
      }),
    warning: (message, title, options = {}) =>
      addToast({
        type: TOAST_TYPES.WARNING,
        message,
        title,
        ...options,
      }),
    info: (message, title, options = {}) =>
      addToast({
        type: TOAST_TYPES.INFO,
        message,
        title,
        ...options,
      }),
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300); // Match animation duration
  };

  const getToastStyles = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-600",
          titleColor: "text-green-800",
          messageColor: "text-green-700",
        };
      case TOAST_TYPES.ERROR:
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: AlertCircle,
          iconColor: "text-red-600",
          titleColor: "text-red-800",
          messageColor: "text-red-700",
        };
      case TOAST_TYPES.WARNING:
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
          titleColor: "text-yellow-800",
          messageColor: "text-yellow-700",
        };
      case TOAST_TYPES.INFO:
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: Info,
          iconColor: "text-blue-600",
          titleColor: "text-blue-800",
          messageColor: "text-blue-700",
        };
    }
  };

  const styles = getToastStyles(toast.type);
  const Icon = styles.icon;

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`max-w-sm w-full ${styles.bg} border ${styles.border} rounded-lg shadow-lg p-4`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${styles.iconColor}`} />
          </div>

          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className={`text-sm font-medium ${styles.titleColor} mb-1`}>
                {toast.title}
              </h4>
            )}
            <p className={`text-sm ${styles.messageColor}`}>{toast.message}</p>

            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className={`text-sm font-medium ${styles.iconColor} hover:underline`}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={handleRemove}
              className={`p-1 rounded-md ${styles.iconColor} hover:bg-black hover:bg-opacity-10 transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
export const Toaster = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

// Export everything needed
export default {
  ToastProvider,
  Toaster,
  useToast,
};
