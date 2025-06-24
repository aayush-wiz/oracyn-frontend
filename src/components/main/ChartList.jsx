import React, { useState } from "react";
import ChartComponent from "./ChartComponent";
import { useCharts } from "../../hooks/useCharts";
import { Plus, Trash2, RefreshCw } from "lucide-react";

export const ChartList = ({ chatId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [chartPrompt, setChartPrompt] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [chartLabel, setChartLabel] = useState("");

  const {
    charts = [],
    isLoading,
    error,
    createChart,
    deleteChart,
    isCreating: isCreatingChart,
    isDeleting,
    refetchCharts,
  } = useCharts(chatId);

  const handleCreateChart = async (e) => {
    e.preventDefault();
    if (!chartPrompt || !chartType || !chartLabel) return;

    try {
      await createChart({
        prompt: chartPrompt,
        chartType,
        label: chartLabel,
      });
      setChartPrompt("");
      setChartLabel("");
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating chart:", error);
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (window.confirm("Are you sure you want to delete this chart?")) {
      try {
        await deleteChart(chartId);
      } catch (error) {
        console.error("Error deleting chart:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        Error loading charts: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Charts</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => refetchCharts()}
            disabled={isLoading || isCreatingChart || isDeleting}
            className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-50"
            title="Refresh charts"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            disabled={isLoading || isCreatingChart || isDeleting}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Chart
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="p-4 mb-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium">Create New Chart</h3>
          <form onSubmit={handleCreateChart} className="space-y-4">
            <div>
              <label
                htmlFor="chartLabel"
                className="block text-sm font-medium text-gray-700"
              >
                Chart Label
              </label>
              <input
                type="text"
                id="chartLabel"
                value={chartLabel}
                onChange={(e) => setChartLabel(e.target.value)}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter chart label"
                required
              />
            </div>

            <div>
              <label
                htmlFor="chartType"
                className="block text-sm font-medium text-gray-700"
              >
                Chart Type
              </label>
              <select
                id="chartType"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="chartPrompt"
                className="block text-sm font-medium text-gray-700"
              >
                What would you like to visualize?
              </label>
              <textarea
                id="chartPrompt"
                rows={3}
                value={chartPrompt}
                onChange={(e) => setChartPrompt(e.target.value)}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe the data you want to visualize..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingChart}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isCreatingChart ? "Creating..." : "Create Chart"}
              </button>
            </div>
          </form>
        </div>
      )}

      {charts.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          No charts found. Create your first chart using the button above.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {charts.map((chart) => (
            <div key={chart.id} className="relative group">
              <div className="absolute top-0 right-0 z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteChart(chart.id)}
                  disabled={isDeleting}
                  className="text-red-400 hover:text-red-500 disabled:opacity-50"
                  title="Delete chart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="h-full">
                <ChartComponent
                  chartData={
                    typeof chart.data === "string"
                      ? JSON.parse(chart.data)
                      : chart.data
                  }
                  chartType={chart.type}
                  title={chart.label}
                />
                <div className="mt-1 text-xs text-gray-500">
                  Created: {new Date(chart.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartList;
