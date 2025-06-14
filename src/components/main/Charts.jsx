// components/main/Charts.jsx
import React, { useState } from "react";
import { ChartIcons } from "../ui/Icons";

const Charts = () => {
  const [activeChart, setActiveChart] = useState("Bar");

  const chartTypes = [
    { name: "Bar", icon: ChartIcons.Bar, color: "text-gray-300" },
    { name: "Line", icon: ChartIcons.Line, color: "text-gray-300" },
    { name: "Pie", icon: ChartIcons.Pie, color: "text-gray-300" },
    { name: "Scatter", icon: ChartIcons.Scatter, color: "text-gray-300" },
    { name: "Area", icon: ChartIcons.Area, color: "text-gray-300" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Charts & Analytics</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Chart Type:</span>
          <select className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-gray-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="grid grid-cols-5 gap-4">
        {chartTypes.map((chart) => (
          <div
            key={chart.name}
            onClick={() => setActiveChart(chart.name)}
            className={`bg-gray-900/80 backdrop-blur-xl border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
              activeChart === chart.name
                ? "border-gray-500 bg-gray-800/80"
                : "border-gray-700/50 hover:border-gray-600"
            }`}
          >
            <div className={`flex flex-col items-center gap-2 ${chart.color}`}>
              <chart.icon />
              <span className="text-sm font-medium text-white">
                {chart.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Display */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {activeChart} Chart Visualization
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 text-sm hover:bg-gray-700 transition-colors">
              Export
            </button>
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors">
              Refresh
            </button>
          </div>
        </div>

        <div className="w-full h-96 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700/30">
          <div className="text-center">
            <div className="mb-4 text-gray-400">
              {React.createElement(
                chartTypes.find((c) => c.name === activeChart)?.icon ||
                  ChartIcons.Bar
              )}
            </div>
            <p className="text-gray-400">
              {activeChart} chart visualization will be rendered here
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Connect your data source to see live charts
            </p>
          </div>
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-2">Data Points</h4>
          <p className="text-2xl font-bold text-gray-300">1,234</p>
          <p className="text-gray-400 text-sm">Total data entries</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-2">Accuracy</h4>
          <p className="text-2xl font-bold text-emerald-400">98.5%</p>
          <p className="text-gray-400 text-sm">Data precision rate</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-2">Processing Time</h4>
          <p className="text-2xl font-bold text-gray-300">0.3s</p>
          <p className="text-gray-400 text-sm">Average response time</p>
        </div>
      </div>
    </div>
  );
};

export default Charts;
