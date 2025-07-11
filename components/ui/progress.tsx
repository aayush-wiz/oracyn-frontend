// components/ui/progress.tsx
export const Progress = ({
  value,
  className = "",
  indicatorColor = "#3b82f6",
}: {
  value: number;
  className?: string;
  indicatorColor?: string;
}) => (
  <div
    className={`relative w-full bg-slate-800 rounded-full overflow-hidden ${className}`}
  >
    <div
      className="absolute left-0 top-0 h-full transition-all duration-300"
      style={{ width: `${value}%`, backgroundColor: indicatorColor }}
    />
  </div>
);
