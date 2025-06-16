// components/main/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store/useStore";
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
  StorageIcon,
  ZapIcon,
} from "../ui/Icons";

const Dashboard = () => {
  const navigate = useNavigate();

  // Get data from Zustand store
  const {
    totalDocumentsProcessed,
    chats,
    activeChatSessions,
    maxChatSessions,
    charts,
    processingSpeed,
    apiCalls,
    storageUsed,
    maxStorage,
    createChat,
    getRecentActivities,
  } = useAppStore();

  // Get recent activities
  const recentActivities = getRecentActivities();

  const stats = [
    {
      label: "Documents",
      value: totalDocumentsProcessed,
      change:
        totalDocumentsProcessed > 0 ? "Total processed" : "No documents yet",
      icon: <DocumentIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Active Chats",
      value: activeChatSessions,
      change: `${maxChatSessions - activeChatSessions} slots available`,
      icon: <ChatIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Charts",
      value: charts.length,
      change: "Visualizations created",
      icon: <ChartIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Processing",
      value: processingSpeed === 0 ? "N/A" : `${processingSpeed}s avg`,
      change: "Average time",
      icon: <ClockIcon className="w-5 h-5 text-gray-400" />,
    },
  ];

  // Format recent activities from actual chats
  const activity = recentActivities.map((chat) => ({
    id: chat.id,
    title: chat.title,
    time: formatTimeAgo(chat.lastUsed),
    icon: <ChatIcon className="w-5 h-5 text-blue-400" />,
  }));

  const usage = [
    {
      label: "Documents Processed",
      current: totalDocumentsProcessed,
      total: 50,
    },
    {
      label: "API Calls This Month",
      current: apiCalls,
      total: 5000,
      icon: <ZapIcon className="w-4 h-4 text-gray-400" />,
    },
    {
      label: "Storage Used",
      current: (storageUsed / 1024).toFixed(2), // Convert MB to GB
      total: (maxStorage / 1024).toFixed(1), // Convert MB to GB
      unit: "GB",
      icon: <StorageIcon className="w-4 h-4 text-gray-400" />,
    },
    {
      label: "Active Chat Sessions",
      current: activeChatSessions,
      total: maxChatSessions,
    },
  ];

  const quickActions = [
    {
      label: "Start New Chat",
      icon: <MessageSquareIcon className="w-5 h-5" />,
      primary: true,
      action: () => {
        const newChatId = createChat();
        if (newChatId) {
          navigate(`/chat/${newChatId}`);
        } else {
          alert(
            "Maximum chat sessions reached. Please close an existing chat."
          );
        }
      },
    },
    {
      label: "View Charts",
      icon: <BarChartIcon className="w-5 h-5" />,
      action: () => navigate("/charts"),
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      action: () => navigate("/settings"),
    },
  ];

  // Helper function to format time
  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="space-y-10 p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">
          Good morning, John Doe
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your projects today
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="text-3xl font-bold text-white">{item.value}</p>
              <p className="text-sm text-gray-500">{item.change}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </div>

      {/* Mid Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <ActivityIcon className="w-5 h-5" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activity.length > 0 ? (
              activity.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition cursor-pointer"
                  onClick={() => navigate(`/chat/${a.id}`)}
                >
                  {a.icon}
                  <div>
                    <p className="text-white font-medium">{a.title}</p>
                    <p className="text-sm text-gray-400">{a.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChatIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No recent activity</p>
                <p className="text-sm mt-1">Start a new chat to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Usage */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5" />
            Project Usage
          </h3>
          <div className="space-y-5">
            {usage.map((u, i) => {
              const percent =
                u.total > 0 ? ((u.current / u.total) * 100).toFixed(1) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{u.label}</span>
                    <span className="text-gray-400">
                      {u.current} {u.unit ? u.unit : ""} / {u.total}{" "}
                      {u.unit ? u.unit : ""}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700/50 rounded-full">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl transition font-medium ${
                action.primary
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-800/50 text-white border border-gray-700/50 hover:bg-gray-700/40"
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
