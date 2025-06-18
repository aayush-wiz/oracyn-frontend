// components/main/chat/ChatComponents/ChartDisplayModal.jsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useStore from "../../../../store/useStore";
import { X, Download, Share, Copy, Maximize2 } from "lucide-react";
import Chart from "chart.js/auto";

const ChartDisplayModal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { charts } = useStore();
  const [chart, setChart] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const selectedId = searchParams.get("selected");
    if (selectedId) {
      const foundChart = charts.find((c) => c.id === selectedId);
      setChart(foundChart);
    } else {
      setChart(null);
    }
  }, [searchParams, charts]);

  useEffect(() => {
    if (chart && canvasRef.current) {
      // Destroy existing chart instance
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = canvasRef.current.getContext("2d");

      // Chart configuration
      const config = {
        type: chart.type,
        data: chart.data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: chart.label,
              font: {
                size: 18,
                weight: "bold",
              },
              color: "#ffffff",
              padding: 20,
            },
            legend: {
              labels: {
                color: "#d1d5db",
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              titleColor: "#ffffff",
              bodyColor: "#d1d5db",
              borderColor: "rgba(75, 85, 99, 0.5)",
              borderWidth: 1,
            },
          },
          scales:
            chart.type !== "pie" && chart.type !== "doughnut"
              ? {
                  x: {
                    ticks: {
                      color: "#9ca3af",
                    },
                    grid: {
                      color: "rgba(75, 85, 99, 0.3)",
                    },
                  },
                  y: {
                    ticks: {
                      color: "#9ca3af",
                      callback: function (value) {
                        if (value >= 1000000) {
                          return "$" + (value / 1000000).toFixed(1) + "M";
                        } else if (value >= 1000) {
                          return "$" + (value / 1000).toFixed(0) + "K";
                        }
                        return "$" + value;
                      },
                    },
                    grid: {
                      color: "rgba(75, 85, 99, 0.3)",
                    },
                  },
                }
              : {},
          elements: {
            arc: {
              borderWidth: 2,
            },
            bar: {
              borderWidth: 2,
              borderRadius: 4,
            },
            line: {
              borderWidth: 3,
            },
            point: {
              radius: 5,
              hoverRadius: 8,
            },
          },
          animation: {
            duration: 1000,
            easing: "easeInOutQuart",
          },
          ...chart.config,
        },
      };

      const newChartInstance = new Chart(ctx, config);
      setChartInstance(newChartInstance);

      return () => {
        if (newChartInstance) {
          newChartInstance.destroy();
        }
      };
    }
  }, [chart]);

  const closeModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("selected");
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `${chart.label.replace(/\s+/g, "_")}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (!chart) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 relative overflow-hidden">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-16 h-16 border border-gray-400 rotate-45"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border border-gray-500 rotate-12"></div>
          <div className="absolute bottom-8 left-8 w-8 h-8 border border-gray-600"></div>
          <div className="absolute bottom-8 right-8 w-14 h-14 border border-gray-400 rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-gray-500 opacity-20"></div>
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
              {chart.label}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Created from {chart.createdFrom} •{" "}
              {new Date(chart.createdAt).toLocaleDateString()}
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
              onClick={handleCopyLink}
              className="group p-2 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500/70 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              title="Copy Link"
            >
              <Copy className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </button>

            <button
              onClick={closeModal}
              className="group p-2 bg-red-900/30 hover:bg-red-800/50 border border-red-700/50 hover:border-red-600/70 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-red-300 group-hover:text-red-200" />
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="p-8 relative z-10">
          <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300">
            {/* Chart canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ maxHeight: "500px" }}
              />
            </div>

            {/* Chart type indicator */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800/80 border border-gray-600/50 rounded-full text-xs text-gray-300 backdrop-blur-sm">
              {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
            </div>
          </div>

          {/* Chart metadata */}
          <div className="mt-6 p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2 font-medium">
                    {chart.type}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Data Points:</span>
                  <span className="text-white ml-2 font-medium">
                    {chart.data.labels?.length ||
                      chart.data.datasets?.[0]?.data?.length ||
                      0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white ml-2 font-medium">
                    {new Date(chart.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer pointer-events-none"></div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ChartDisplayModal;
