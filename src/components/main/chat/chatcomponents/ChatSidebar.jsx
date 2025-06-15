import React, { useState } from "react";
import {
  BarChart,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  LineChart,
} from "lucide-react";

const ChartSidebar = ({ charts, onChartClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sampleCharts =  [
    { id: 1, label: "Revenue Analytics", type: "bar", status: "idle" },
    { id: 2, label: "User Growth Trends", type: "line", status: "active" },
    { id: 3, label: "Market Share Distribution", type: "pie", status: "idle" },
    { id: 4, label: "Performance Metrics", type: "activity", status: "idle" },
    { id: 5, label: "Sales Pipeline", type: "trending", status: "idle" },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "bar":
        return BarChart;
      case "line":
        return TrendingUp;
      case "pie":
        return PieChart;
      case "activity":
        return Activity;
      case "trending":
        return LineChart;
      default:
        return BarChart3;
    }
  };

  const handleChartClick = (chart) => {
    if (onChartClick) onChartClick(chart);
  };

  return (
    <div className="relative">
      <aside
        className={`fixed top-0 right-0 h-full bg-transparent backdrop-blur-xl border-l border-gray-700/30 z-50 transition-all duration-500 ease-in-out group ${
          isExpanded ? "w-36" : "w-[72px]"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full p-3">
          {/* Header */}
          <div className="flex items-center h-16 shrink-0 mb-4 pl-1">
            <div className="logo-flicker">
              <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-white ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
              Charts
            </span>
          </div>

          {/* Chart Items Grid */}
          <nav className="flex-grow grid grid-cols-1 overflow-y-auto justify-items-center ">
            {sampleCharts.map((chart) => {

              const IconComponent = getIcon(chart.type);
              const isActive = chart.status === "active";

              return (
                <div
                  key={chart.id}
                  onClick={() => handleChartClick(chart)}
                  className={`flex flex-col items-center shrink w-full h-fit p-1 rounded-lg cursor-pointer text-center transition-colors duration-300 ${
                    isActive ? "bg-gray-700/40" : "hover:bg-gray-700/40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? "" : ""
                    }`}
                  >
                    <IconComponent
                      className={`w-full group-hover:w-full group-hover:h-24 transition-all duration-300 ${
                        isActive ? "text-gray-400" : "text-gray-300"
                      }`}
                    />
                  </div>
                  <span
                    className="mt-1 text-[10px] text-gray-300 truncate max-w-full text-center"
                    title={chart.label}
                  >
                    {chart.label}
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Status */}
          <div className="mt-auto shrink-0 border-t border-gray-700/50 pt-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-center mt-1">
                <p className="font-semibold text-white text-[10px]">5 Active</p>
                <p className="text-[9px] text-gray-400">Real-time</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChartSidebar;
