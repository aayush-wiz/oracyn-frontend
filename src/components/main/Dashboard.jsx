// components/main/Dashboard.jsx
import React from "react";
import { ChartIcons } from "../ui/Icons";

const Dashboard = () => {
  const statsCards = [
    { title: "Total Users", value: "12,345", change: "+12%", positive: true },
    { title: "Revenue", value: "$45,678", change: "+8%", positive: true },
    { title: "Orders", value: "1,234", change: "-3%", positive: false },
    { title: "Conversion", value: "3.45%", change: "+15%", positive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-gray-400 text-sm">Welcome back, John! 👋</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ChartIcons.Line />
            Performance Overview
          </h3>
          <div className="w-full h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Line chart visualization goes here</p>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ChartIcons.Pie />
            Distribution
          </h3>
          <div className="w-full h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Pie chart visualization goes here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-600/30 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-white text-sm">New user registered</p>
                  <p className="text-gray-400 text-xs">2 minutes ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
