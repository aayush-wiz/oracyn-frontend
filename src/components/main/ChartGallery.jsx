// Chart Gallery Component
import { useState, useEffect, useRef } from "react";
import { BarChart, LineChart, PieChart, BarChart3 } from "lucide-react";
import Chart from "chart.js/auto";
import useStore from "../../store/useStore";

const ChartGallery = () => {
  const { charts } = useStore();
  const [selectedChart, setSelectedChart] = useState(null);
  const chartRef = useRef(null);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  useEffect(() => {
    if (!selectedChart || !chartRef.current) return;

    const canvas = chartRef.current;
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    // Mock chart data for demonstration
    const mockData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: selectedChart.label,
          data: [65, 59, 80, 81, 56],
          backgroundColor: "#6366f1",
        },
      ],
    };

    new Chart(canvas, {
      type: selectedChart.type || "bar",
      data: mockData,
      options: { responsive: true },
    });
  }, [selectedChart]);

  const getIcon = (type) => {
    switch (type) {
      case "bar":
        return <BarChart className="w-6 h-6" />;
      case "line":
        return <LineChart className="w-6 h-6" />;
      case "pie":
        return <PieChart className="w-6 h-6" />;
      default:
        return <BarChart3 className="w-6 h-6" />;
    }
  };

  return (
    <section className="p-6 bg-zinc-950 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Chart Gallery</h1>
      <p className="text-zinc-400 mb-6">
        All your generated charts and visualizations
      </p>

      {charts.length === 0 ? (
        <p className="text-zinc-500">No charts created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {charts.map((chart) => (
            <div
              key={chart.id}
              onClick={() => setSelectedChart(chart)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4 shadow-md cursor-pointer hover:border-zinc-700 transition"
            >
              <div className="flex justify-between text-sm text-zinc-400">
                <span>{chart.chatName}</span>
                <span>{formatTime(chart.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                {getIcon(chart.type)}
                <h2 className="text-white font-semibold text-lg">
                  {chart.label}
                </h2>
              </div>
              <div className="h-32 bg-zinc-800 rounded-lg flex items-center justify-center">
                <span className="text-zinc-500">Click to view</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 p-6 rounded-lg shadow-xl w-[90%] max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-semibold">
                {selectedChart.label}
              </h2>
              <button
                onClick={() => setSelectedChart(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <canvas ref={chartRef} height="300" />
          </div>
        </div>
      )}
    </section>
  );
};

export default ChartGallery;
