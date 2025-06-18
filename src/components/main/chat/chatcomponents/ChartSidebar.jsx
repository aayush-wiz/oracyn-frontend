// components/main/chat/ChatComponents/ChartSidebar.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useStore from "../../../../store/useStore";
import {
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const ChartSidebar = ({ chatId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getChatCharts } = useStore();

  const chatCharts = getChatCharts(chatId);

  const getIcon = (type) => {
    const icons = {
      bar: BarChart3,
      line: LineChart,
      pie: PieChart,
      activity: Activity,
      trending: TrendingUp,
      area: Activity,
      scatter: BarChart3,
      doughnut: PieChart,
    };
    const IconComponent = icons[type] || BarChart3;
    return <IconComponent className="w-5 h-5" />;
  };

  const getChartColor = (index) => {
    const colors = [
      "text-blue-400 border-blue-500/30 bg-blue-500/10",
      "text-green-400 border-green-500/30 bg-green-500/10",
      "text-purple-400 border-purple-500/30 bg-purple-500/10",
      "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
      "text-pink-400 border-pink-500/30 bg-pink-500/10",
      "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    ];
    return colors[index % colors.length];
  };

  const handleViewChart = (chart) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("selected", chart.id);
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  // Always show sidebar, even if no charts yet
  // if (chatCharts.length === 0) return null;

  return (
    <aside
      className={`h-full bg-gray-900/40 backdrop-blur-xl border-l border-gray-700/30 transition-all duration-500 ease-in-out relative overflow-hidden ${
        isExpanded ? "w-80" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-8 right-4 w-8 h-8 border border-gray-400 rotate-45"></div>
        <div className="absolute bottom-12 left-4 w-6 h-6 border border-gray-500"></div>
        <div className="absolute top-1/2 left-2 w-4 h-4 border border-gray-600 rotate-12"></div>
      </div>

      {/* Expand/Collapse indicator */}
      <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-20">
        <div className="w-6 h-12 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-l-lg flex items-center justify-center">
          {isExpanded ? (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      <div className="flex flex-col h-full p-4 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
          </div>
          {isExpanded && (
            <div className="opacity-0 animate-fade-in">
              <h3 className="text-white font-bold text-lg tracking-tight">
                Charts
              </h3>
              <p className="text-xs text-gray-400">
                {chatCharts.length} visualization
                {chatCharts.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {/* Charts List */}
        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {chatCharts.length === 0 ? (
            <div className="text-center py-8">
              {isExpanded && (
                <div className="opacity-0 animate-fade-in">
                  <div className="w-12 h-12 mx-auto bg-gray-800/40 border border-gray-700/50 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm">No charts yet</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Ask for visualizations to see charts here
                  </p>
                </div>
              )}
            </div>
          ) : (
            chatCharts.map((chart, index) => {
              const colorClass = getChartColor(index);
              const isSelected = searchParams.get("selected") === chart.id;

              return (
                <div
                  key={chart.id}
                  onClick={() => handleViewChart(chart)}
                  className={`
                    group/chart relative cursor-pointer transition-all duration-300 overflow-hidden
                    ${!isExpanded ? "flex justify-center" : ""}
                    ${isSelected ? "transform scale-105" : "hover:scale-105"}
                  `}
                >
                  {/* Chart item background */}
                  <div
                    className={`
                    p-3 rounded-xl border backdrop-blur-sm transition-all duration-300
                    ${
                      isSelected
                        ? "bg-white/10 border-white/30 shadow-lg shadow-white/10"
                        : "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/70"
                    }
                  `}
                  >
                    {/* Geometric corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-current opacity-20 group-hover/chart:opacity-60 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-current opacity-20 group-hover/chart:opacity-60 transition-opacity duration-300"></div>

                    <div className="flex items-center gap-3">
                      {/* Chart icon */}
                      <div
                        className={`
                          w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300
                          ${colorClass} group-hover/chart:scale-110 group-hover/chart:rotate-6
                        `}
                      >
                        {getIcon(chart.type)}
                      </div>

                      {isExpanded && (
                        <div className="flex-1 min-w-0 opacity-0 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-white font-medium truncate group-hover/chart:text-gray-200 transition-colors duration-300">
                                {chart.label}
                              </p>
                              <p className="text-xs text-gray-400 group-hover/chart:text-gray-300 transition-colors duration-300">
                                {new Date(chart.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover/chart:text-white transition-all duration-300 transform group-hover/chart:translate-x-1" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Animated hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover/chart:translate-x-full transition-transform duration-700"></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {isExpanded && (
          <div className="mt-6 pt-4 border-t border-gray-700/50 opacity-0 animate-fade-in">
            {chatCharts.length > 0 ? (
              <button
                onClick={() => navigate("/charts")}
                className="w-full group relative flex items-center justify-between px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300 overflow-hidden"
              >
                {/* Geometric accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

                <span className="relative z-10">View all charts</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />

                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                Charts will appear here when you create them in the conversation
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
          border-radius: 4px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
    </aside>
  );
};

export default ChartSidebar;
