import { Loader2 } from "lucide-react";

const Loading = ({
  size = "md",
  text = "Loading...",
  className = "",
  center = true,
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const content = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );

  if (center) {
    return (
      <div className="flex items-center justify-center p-8">{content}</div>
    );
  }

  return content;
};

export default Loading;
