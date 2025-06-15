// components/main/Dashboard.jsx
import React from "react";
import {
  DocumentIcon,
  ChatIcon,
  ChartIcon,
  ClockIcon,
  ActivityIcon,
  TrendingUpIcon,
  MessageSquareIcon,
  BarChartIcon,
  SettingsIcon,
} from "../ui/Icons";

const Dashboard = () => {
  const statsCards = [
    {
      title: "Documents",
      value: "12",
      change: "+2 from last week",
      icon: <DocumentIcon className="w-6 h-6" />,
    },
    {
      title: "Active Chats",
      value: "2",
      change: "+1 new today",
      icon: <ChatIcon className="w-6 h-6" />,
    },
    {
      title: "Charts",
      value: "1",
      change: "Visualizations created",
      icon: <ChartIcon className="w-6 h-6" />,
    },
    {
      title: "Processing",
      value: "2.3s avg",
      change: "Average time",
      icon: <ClockIcon className="w-6 h-6" />,
    },
  ];

  const recentActivities = [
    {
      title: "Financial Report Analysis",
      time: "2 hours ago",
      icon: <DocumentIcon className="w-5 h-5" />,
    },
    {
      title: "Revenue Trends Chart",
      time: "3 hours ago",
      icon: <BarChartIcon className="w-5 h-5" />,
    },
    {
      title: "Q4 Performance Data",
      time: "5 hours ago",
      icon: <DocumentIcon className="w-5 h-5" />,
    },
  ];

  const usageMetrics = [
    { label: "Document Processing", percentage: 78 },
    { label: "Chat Interactions", percentage: 65 },
    { label: "Chart Generation", percentage: 45 },
  ];

  const quickActions = [
    {
      title: "Start New Chat",
      icon: <MessageSquareIcon className="w-5 h-5" />,
      primary: true,
    },
    {
      title: "View Charts",
      icon: <BarChartIcon className="w-5 h-5" />,
      primary: false,
    },
    {
      title: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      primary: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Your analytics and document processing overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm">{stat.change}</p>
              </div>
              <div className="text-gray-400">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <ActivityIcon className="w-5 h-5" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="text-gray-400">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <TrendingUpIcon className="w-5 h-5" />
            Usage Metrics
          </h3>
          <div className="space-y-6">
            {usageMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-medium">
                    {metric.label}
                  </span>
                  <span className="text-white font-bold">
                    {metric.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metric.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 ${
                action.primary
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-800/50 text-white border border-gray-700/50 hover:bg-gray-700/50"
              }`}
            >
              {action.icon}
              {action.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
