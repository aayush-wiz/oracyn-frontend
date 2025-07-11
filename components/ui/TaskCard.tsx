import { FC } from "react";
import { Progress } from "@/components/ui/progress";

interface TaskCardProps {
  title: string;
  description: string;
  progress: number;
  accentColor?: string; // e.g., "#3b82f6"
}

const TaskCard: FC<TaskCardProps> = ({
  title,
  description,
  progress,
  accentColor = "#3b82f6",
}) => {
  return (
    <div className="bg-[#111827] rounded-xl shadow-md w-[260px] p-4 flex flex-col justify-between text-white hover:shadow-lg hover:shadow-slate-700 hover:scale-x-105 hover:scale-y-105 transition-all duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm mb-2">
        <div className={`w-2 h-2 rounded-full bg-opacity-80`} />
      </div>

      <div className="text-xs text-slate-400 mb-2">{description}</div>

      <div className="flex items-center justify-between">
        <Progress
          value={progress}
          className="w-[75%] h-1.5 bg-slate-700"
          indicatorColor={accentColor}
        />
        <span className="text-xs text-slate-300 font-semibold">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
