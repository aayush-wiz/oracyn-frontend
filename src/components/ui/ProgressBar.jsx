import clsx from "clsx";

const ProgressBar = ({
  value,
  max = 100,
  size = "md",
  variant = "primary",
  showLabel = true,
  className,
  ...props
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variants = {
    primary: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  };

  return (
    <div className={clsx("w-full", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={clsx(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizes[size]
        )}
      >
        <div
          className={clsx(
            "h-full transition-all duration-300 ease-out rounded-full",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
