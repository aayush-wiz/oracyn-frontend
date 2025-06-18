// components/main/ChartGallery.jsx
import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  BarChart3,
  X,
  Download,
  Calendar,
  Clock,
  Eye,
  Trash2,
} from "lucide-react";
import Chart from "chart.js/auto";
import useStore from "../../store/useStore";

const ChartGallery = () => {
  const { charts, deleteChart } = useStore();
  const [selectedChart, setSelectedChart] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const chartRef = useRef(null);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (!selectedChart || !chartRef.current) return;

    const canvas = chartRef.current;
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    // Use actual chart data if available, otherwise mock data
    const chartData = selectedChart.data || {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: selectedChart.label,
          data: [65, 59, 80, 81, 56],
          backgroundColor: [
            "#6366f1",
            "#8b5cf6",
            "#06b6d4",
            "#10b981",
            "#f59e0b",
          ],
          borderColor: "#6366f1",
          borderWidth: 2,
        },
      ],
    };

    new Chart(canvas, {
      type: selectedChart.type || "bar",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "#d1d5db",
            },
          },
        },
        scales:
          selectedChart.type !== "pie" && selectedChart.type !== "doughnut"
            ? {
                x: {
                  ticks: { color: "#9ca3af" },
                  grid: { color: "rgba(75, 85, 99, 0.3)" },
                },
                y: {
                  ticks: { color: "#9ca3af" },
                  grid: { color: "rgba(75, 85, 99, 0.3)" },
                },
              }
            : {},
      },
    });
  }, [selectedChart]);

  const getIcon = (type) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case "bar":
        return <BarChart className={iconClass} />;
      case "line":
        return <LineChart className={iconClass} />;
      case "pie":
      case "doughnut":
        return <PieChart className={iconClass} />;
      default:
        return <BarChart3 className={iconClass} />;
    }
  };

  const getChartColor = (index) => {
    const colors = [
      {
        bg: "from-blue-600/20 to-purple-600/20",
        border: "border-blue-500/40",
        accent: "text-blue-400",
      },
      {
        bg: "from-green-600/20 to-emerald-600/20",
        border: "border-green-500/40",
        accent: "text-green-400",
      },
      {
        bg: "from-purple-600/20 to-pink-600/20",
        border: "border-purple-500/40",
        accent: "text-purple-400",
      },
      {
        bg: "from-orange-600/20 to-yellow-600/20",
        border: "border-orange-500/40",
        accent: "text-orange-400",
      },
      {
        bg: "from-red-600/20 to-pink-600/20",
        border: "border-red-500/40",
        accent: "text-red-400",
      },
      {
        bg: "from-indigo-600/20 to-blue-600/20",
        border: "border-indigo-500/40",
        accent: "text-indigo-400",
      },
    ];
    return colors[index % colors.length];
  };

  const chartTypes = ["all", "bar", "line", "pie", "doughnut"];
  const filteredCharts =
    filterType === "all"
      ? charts
      : charts.filter((chart) => chart.type === filterType);

  const handleDeleteChart = (chartId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chart?")) {
      deleteChart(chartId);
    }
  };

  const handleDownload = () => {
    if (chartRef.current) {
      const link = document.createElement("a");
      link.download = `${selectedChart.label.replace(/\s+/g, "_")}.png`;
      link.href = chartRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gray-500 rotate-45"></div>
        <div className="absolute top-40 right-40 w-24 h-24 border border-gray-600 rotate-12"></div>
        <div className="absolute bottom-32 left-32 w-16 h-16 border border-gray-400"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-gray-500 rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gray-500 opacity-20"></div>
      </div>

      <div className="relative z-10 p-8 h-screen overflow-y-auto">
        {/* Header */}
        <div className="relative mb-10">
          {/* Geometric accent */}
          <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-white via-gray-400 to-transparent opacity-30"></div>

          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            Chart Gallery
          </h1>
          <p className="text-xl text-gray-400 font-light mb-8">
            All your generated charts and visualizations
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {chartTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border-2 overflow-hidden ${
                  filterType === type
                    ? "bg-white text-black border-white"
                    : "bg-gray-800/60 text-white border-gray-700/50 hover:bg-gray-800/80 hover:border-gray-600/70 backdrop-blur-sm"
                }`}
              >
                {/* Corner accents for non-active buttons */}
                {filterType !== type && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                  </>
                )}

                <span className="relative z-10 capitalize">
                  {type}{" "}
                  {type !== "all" &&
                    `(${charts.filter((c) => c.type === type).length})`}
                </span>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 ${
                    filterType === type
                      ? "bg-gradient-to-r from-transparent via-gray-200/20 to-transparent"
                      : "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  } transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700`}
                ></div>
              </button>
            ))}
          </div>

          {/* Corner accent */}
          <div className="absolute -bottom-2 right-0 w-6 h-6 border-r-2 border-b-2 border-gray-600 opacity-30"></div>
        </div>

        {/* Charts Grid */}
        {filteredCharts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-800/60 border border-gray-700/50 rounded-2xl flex items-center justify-center mb-6 relative">
              {/* Geometric corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-gray-500 opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-gray-500 opacity-50"></div>
              <BarChart3 className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              No charts yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {filterType === "all"
                ? "Start creating visualizations in your chats to see them here"
                : `No ${filterType} charts found. Try a different filter or create some charts in your conversations.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCharts.map((chart, index) => {
              const colors = getChartColor(index);

              return (
                <div
                  key={chart.id}
                  className={`group relative bg-gradient-to-br ${colors.bg} backdrop-blur-sm border ${colors.border} rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden`}
                >
                  {/* Geometric corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>

                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-3 right-3 w-8 h-8 border border-current rotate-45"></div>
                    <div className="absolute bottom-3 left-3 w-6 h-6 border border-current"></div>
                  </div>

                  {/* Chart metadata */}
                  <div className="relative z-10 mb-4">
                    <div className="flex justify-between items-start text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatTime(chart.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTime(chart.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 bg-gray-800/60 border border-gray-700/50 rounded-xl flex items-center justify-center ${colors.accent} transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}
                      >
                        {getIcon(chart.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-white font-bold text-lg mb-1 truncate group-hover:text-gray-200 transition-colors duration-300">
                          {chart.label}
                        </h2>
                        <p className="text-gray-400 text-sm truncate">
                          From: {chart.createdFrom}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chart preview */}
                  <div
                    className="relative h-32 bg-gray-800/40 border border-gray-700/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-800/60 transition-colors duration-300"
                    onClick={() => setSelectedChart(chart)}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-gray-500 opacity-30"></div>
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-gray-500 opacity-30"></div>

                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">Click to view</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="relative z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChart(chart);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 text-indigo-300 rounded-lg transition-all duration-300 hover:scale-105"
                      title="View Chart"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">View</span>
                    </button>

                    <button
                      onClick={(e) => handleDeleteChart(chart.id, e)}
                      className="flex items-center justify-center p-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 rounded-lg transition-all duration-300 hover:scale-110"
                      title="Delete Chart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse transition-transform duration-1000"></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Chart Modal */}
        {selectedChart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 rounded-2xl shadow-2xl w-[90%] max-w-4xl mx-4 relative overflow-hidden">
              {/* Geometric background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-8 left-8 w-16 h-16 border border-gray-400 rotate-45"></div>
                <div className="absolute top-8 right-8 w-12 h-12 border border-gray-500 rotate-12"></div>
                <div className="absolute bottom-8 left-8 w-8 h-8 border border-gray-600"></div>
                <div className="absolute bottom-8 right-8 w-14 h-14 border border-gray-400 rotate-45"></div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-gray-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-gray-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-gray-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-gray-500"></div>

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50 backdrop-blur-sm bg-black/20 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {selectedChart.label}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Created from {selectedChart.createdFrom} •{" "}
                    {formatTime(selectedChart.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Action buttons */}
                  <button
                    onClick={handleDownload}
                    className="group p-2 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500/70 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    title="Download Chart"
                  >
                    <Download className="w-5 h-5 text-gray-300 group-hover:text-white" />
                  </button>

                  <button
                    onClick={() => setSelectedChart(null)}
                    className="group p-2 bg-red-900/30 hover:bg-red-800/50 border border-red-700/50 hover:border-red-600/70 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  >
                    <X className="w-5 h-5 text-red-300 group-hover:text-red-200" />
                  </button>
                </div>
              </div>

              {/* Chart Container */}
              <div className="p-8 relative z-10">
                <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300">
                  <canvas ref={chartRef} style={{ maxHeight: "500px" }} />

                  {/* Chart type indicator */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800/80 border border-gray-600/50 rounded-full text-xs text-gray-300 backdrop-blur-sm">
                    {selectedChart.type.charAt(0).toUpperCase() +
                      selectedChart.type.slice(1)}{" "}
                    Chart
                  </div>
                </div>
              </div>

              {/* Subtle animated border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse pointer-events-none"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartGallery;
