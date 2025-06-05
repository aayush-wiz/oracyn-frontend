import { useState, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";
import PromptArea from "../interactive/PromptArea";
import DataVisualization from "../views/DataVisualization";

const Dashboard = () => {
  const [filesToVisualize, setFilesToVisualize] = useState(null);
  const [leftWidth, setLeftWidth] = useState(40); // Percentage width for left panel
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const dividerRef = useRef(null);

  const handleVisualize = (files) => {
    setFilesToVisualize(files);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain the width between 20% and 80%
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
      setLeftWidth(constrainedWidth);
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex h-screen overflow-hidden bg-gray-50 relative"
    >
      {/* Left Panel - PromptArea */}
      <div style={{ width: `${leftWidth}%` }} className="flex-shrink-0 h-full">
        <PromptArea onVisualize={handleVisualize} />
      </div>

      {/* Resizable Divider */}
      <div
        ref={dividerRef}
        onMouseDown={handleMouseDown}
        className={`relative w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-all duration-200 flex-shrink-0 group ${
          isDragging ? "bg-blue-500 shadow-lg" : ""
        }`}
      >
        {/* Drag Handle */}
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
          <div
            className={`w-3 h-16 bg-gray-400 rounded-full flex items-center justify-center transition-all duration-200 group-hover:opacity-100 ${
              isDragging ? "opacity-100 bg-blue-500 shadow-md" : ""
            }`}
          >
            <GripVertical className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Active Dragging Indicator */}
        {isDragging && (
          <div className="absolute inset-y-0 left-0 w-1 opacity-30 shadow-lg">
            <div className="absolute -left-2 -right-2 inset-y-0 bg-blue-200 opacity-30"></div>
          </div>
        )}
      </div>

      {/* Right Panel - DataVisualization */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="flex-shrink-0 h-full"
      >
        <DataVisualization files={filesToVisualize} />
      </div>

      {/* Resize Guide Overlay */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 bottom-0 w-0.5 shadow-lg"
            style={{ left: `${leftWidth}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
