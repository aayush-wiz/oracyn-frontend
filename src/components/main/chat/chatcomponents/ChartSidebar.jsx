// components/main/ChatComponents/ChartSidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../../../store/useStore";
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const ChartSidebar = ({ chatId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { charts } = useStore();

  // Filter charts for current chat
  const chatCharts = charts.filter((chart) => chart.chatId === chatId);

  const getIcon = (type) => {
    const icons = {
      bar: BarChart,
      line: LineChart,
      pie: PieChart,
      activity: Activity,
      trending: TrendingUp,
      area: Activity,
      scatter: BarChart3,
      doughnut: PieChart,
    };
    return icons[type] || BarChart3;
  };

  const getChartColor = (index) => {
    const colors = [
      "text-blue-400",
      "text-green-400",
      "text-purple-400",
      "text-yellow-400",
      "text-pink-400",
      "text-indigo-400",
    ];
    return colors[index % colors.length];
  };

  const handleViewChart = (chart) => {
    // Navigate to charts page with specific chart selected
    navigate(`/charts?selected=${chart.id}`);
  };

  if (chatCharts.length === 0) return null;

  return (
    <div className="relative">
      <aside
        className={`h-full bg-gray-900/50 backdrop-blur-xl border-l border-gray-700/30 transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-16"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              {isExpanded && (
                <div>
                  <h3 className="text-white font-semibold">Charts</h3>
                  <p className="text-xs text-gray-400">
                    {chatCharts.length} created
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chart List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {chatCharts.map((chart, index) => {
              const IconComponent = getIcon(chart.type);
              const colorClass = getChartColor(index);

              return (
                <div
                  key={chart.id}
                  onClick={() => handleViewChart(chart)}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg cursor-pointer
                    transition-all duration-200 hover:bg-gray-800/50
                    ${!isExpanded ? "justify-center" : ""}
                  `}
                >
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    bg-gray-800/50 ${colorClass}
                  `}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {isExpanded && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {chart.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(chart.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <button
                onClick={() => navigate("/charts")}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
              >
                <span>View all charts</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ChartSidebar;
