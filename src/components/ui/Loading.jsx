import {
  Loader2,
  RefreshCw,
  Download,
  Upload,
  Search,
  MessageCircle,
} from "lucide-react";

const Loading = ({
  type = "default", // default, overlay, inline, button, modal
  size = "md", // sm, md, lg, xl
  message = "Loading...",
  icon = null, // custom icon or predefined: spinner, refresh, download, upload, search, chat
  color = "blue", // blue, green, purple, gray, indigo
  overlay = false, // deprecated, use type="overlay" instead
  className = "",
  showMessage = true,
  fullHeight = false,
}) => {
  // Handle backward compatibility
  const loadingType = overlay ? "overlay" : type;

  // Size configurations
  const sizeConfig = {
    sm: {
      icon: "w-4 h-4",
      text: "text-xs",
      padding: "p-2",
      gap: "gap-2",
    },
    md: {
      icon: "w-5 h-5",
      text: "text-sm",
      padding: "p-3",
      gap: "gap-2",
    },
    lg: {
      icon: "w-6 h-6",
      text: "text-base",
      padding: "p-4",
      gap: "gap-3",
    },
    xl: {
      icon: "w-8 h-8",
      text: "text-lg",
      padding: "p-6",
      gap: "gap-4",
    },
  };

  // Color configurations
  const colorConfig = {
    blue: {
      icon: "text-blue-600",
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    green: {
      icon: "text-green-600",
      text: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    purple: {
      icon: "text-purple-600",
      text: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    gray: {
      icon: "text-gray-600",
      text: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
    indigo: {
      icon: "text-indigo-600",
      text: "text-indigo-700",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
    },
    white: {
      icon: "text-white",
      text: "text-white",
      bg: "bg-transparent",
      border: "border-transparent",
    },
  };

  // Icon selection
  const getIcon = () => {
    if (icon) {
      switch (icon) {
        case "spinner":
          return Loader2;
        case "refresh":
          return RefreshCw;
        case "download":
          return Download;
        case "upload":
          return Upload;
        case "search":
          return Search;
        case "chat":
          return MessageCircle;
        default:
          // If icon is a custom component, return it
          if (typeof icon === "function" || typeof icon === "object") {
            return icon;
          }
          // If icon is invalid, return default
          return Loader2;
      }
    }
    return Loader2; // Default
  };

  const IconComponent = getIcon();
  const sizes = sizeConfig[size] || sizeConfig.md; // Fallback to medium if invalid size
  const colors = colorConfig[color] || colorConfig.blue; // Fallback to blue if invalid color

  // Base icon with animation
  const AnimatedIcon = () => {
    if (!IconComponent) {
      return (
        <Loader2 className={`${sizes.icon} ${colors.icon} animate-spin`} />
      );
    }

    return (
      <IconComponent className={`${sizes.icon} ${colors.icon} animate-spin`} />
    );
  };

  // Different loading types
  switch (loadingType) {
    case "overlay":
      return (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}
        >
          <div
            className={`bg-white rounded-lg shadow-lg ${sizes.padding} flex flex-col items-center ${sizes.gap}`}
          >
            <AnimatedIcon />
            {showMessage && (
              <span className={`${sizes.text} ${colors.text} font-medium`}>
                {message}
              </span>
            )}
          </div>
        </div>
      );

    case "modal":
      return (
        <div
          className={`bg-white rounded-lg shadow-lg border ${colors.border} ${sizes.padding} flex flex-col items-center ${sizes.gap} ${className}`}
        >
          <AnimatedIcon />
          {showMessage && (
            <span
              className={`${sizes.text} ${colors.text} font-medium text-center`}
            >
              {message}
            </span>
          )}
        </div>
      );

    case "inline":
      return (
        <div className={`flex items-center ${sizes.gap} ${className}`}>
          <AnimatedIcon />
          {showMessage && (
            <span className={`${sizes.text} ${colors.text}`}>{message}</span>
          )}
        </div>
      );

    case "button":
      return (
        <div
          className={`flex items-center justify-center ${sizes.gap} ${className}`}
        >
          <AnimatedIcon />
          {showMessage && (
            <span className={`${sizes.text} font-medium`}>{message}</span>
          )}
        </div>
      );

    case "center":
      return (
        <div
          className={`flex flex-col items-center justify-center ${
            fullHeight ? "h-full min-h-[200px]" : "py-8"
          } ${className}`}
        >
          <AnimatedIcon />
          {showMessage && (
            <span className={`${sizes.text} ${colors.text} font-medium mt-2`}>
              {message}
            </span>
          )}
        </div>
      );

    default: // "default"
      return (
        <div
          className={`flex items-center justify-center ${sizes.padding} ${colors.bg} ${colors.border} border rounded-lg ${className}`}
        >
          <div className={`flex items-center ${sizes.gap}`}>
            <AnimatedIcon />
            {showMessage && (
              <span className={`${sizes.text} ${colors.text} font-medium`}>
                {message}
              </span>
            )}
          </div>
        </div>
      );
  }
};

// Predefined loading components for common use cases
export const LoadingOverlay = (props) => <Loading type="overlay" {...props} />;

export const LoadingButton = (props) => (
  <Loading type="button" size="sm" showMessage={false} {...props} />
);

export const LoadingInline = (props) => (
  <Loading type="inline" size="sm" {...props} />
);

export const LoadingCard = (props) => <Loading type="default" {...props} />;

export const LoadingCenter = (props) => <Loading type="center" {...props} />;

export const LoadingModal = (props) => <Loading type="modal" {...props} />;

// Usage examples as comments:
/*
// Basic usage
<Loading />

// Overlay loading
<Loading type="overlay" message="Saving changes..." />

// Inline loading
<Loading type="inline" size="sm" message="Fetching data..." />

// Button loading state
<Loading type="button" size="sm" />

// Custom icon and color
<Loading icon="upload" color="green" message="Uploading file..." />

// Different sizes
<Loading size="lg" message="Processing..." />

// Without message
<Loading showMessage={false} />

// Predefined components
<LoadingOverlay message="Creating new chat..." />
<LoadingButton />
<LoadingInline message="Searching..." />
<LoadingCard message="Loading chats..." />
<LoadingCenter message="Initializing..." fullHeight />

// Custom styling
<Loading className="my-4" color="purple" />
*/

export default Loading;
