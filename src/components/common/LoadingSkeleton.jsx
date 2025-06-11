const LoadingSkeleton = ({
  rows = 3,
  className = "",
  avatar = false,
  title = false,
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      )}

      {title && <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>}

      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
