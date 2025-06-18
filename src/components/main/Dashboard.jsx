// components/main/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/useStore";
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
    maxChatSessions,
    charts,
    processingSpeed,
    apiCalls,
    storageUsed,
    maxStorage,
    getOrCreateEmptyChat,
    getRecentActivities,
  } = useStore();

  // Calculate active chat sessions
  const activeChatSessions = chats.length;

  // Get recent activities
  const recentActivities = getRecentActivities();

  const stats = [
    {
      label: "Documents",
      value: totalDocumentsProcessed,
      change:
        totalDocumentsProcessed > 0 ? "Total processed" : "No documents yet",
      icon: <DocumentIcon className="w-5 h-5 text-gray-400" />,
      color: "from-blue-600/20 to-purple-600/20",
      borderColor: "border-blue-500/40",
    },
    {
      label: "Active Chats",
      value: activeChatSessions,
      change: `${maxChatSessions - activeChatSessions} slots available`,
      icon: <ChatIcon className="w-5 h-5 text-gray-400" />,
      color: "from-green-600/20 to-emerald-600/20",
      borderColor: "border-green-500/40",
    },
    {
      label: "Charts",
      value: charts.length,
      change: "Visualizations created",
      icon: <ChartIcon className="w-5 h-5 text-gray-400" />,
      color: "from-purple-600/20 to-pink-600/20",
      borderColor: "border-purple-500/40",
    },
    {
      label: "Processing",
      value: processingSpeed === 0 ? "N/A" : `${processingSpeed}s avg`,
      change: "Average time",
      icon: <ClockIcon className="w-5 h-5 text-gray-400" />,
      color: "from-orange-600/20 to-yellow-600/20",
      borderColor: "border-orange-500/40",
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
      color: "bg-blue-500",
    },
    {
      label: "API Calls This Month",
      current: apiCalls,
      total: 5000,
      icon: <ZapIcon className="w-4 h-4 text-gray-400" />,
      color: "bg-green-500",
    },
    {
      label: "Storage Used",
      current: (storageUsed / 1024).toFixed(2), // Convert MB to GB
      total: (maxStorage / 1024).toFixed(1), // Convert MB to GB
      unit: "GB",
      icon: <StorageIcon className="w-4 h-4 text-gray-400" />,
      color: "bg-purple-500",
    },
    {
      label: "Active Chat Sessions",
      current: activeChatSessions,
      total: maxChatSessions,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      label: "Start New Chat",
      icon: <MessageSquareIcon className="w-5 h-5" />,
      primary: true,
      action: () => {
        const chatId = getOrCreateEmptyChat();
        if (chatId) {
          navigate(`/chat/${chatId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gray-500 rotate-45"></div>
        <div className="absolute top-40 right-40 w-24 h-24 border border-gray-600 rotate-12"></div>
        <div className="absolute bottom-32 left-32 w-16 h-16 border border-gray-400"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-gray-500 rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gray-500 opacity-20"></div>
      </div>

      <div className="relative z-10 overflow-y-auto h-screen space-y-10 p-8">
        {/* Header */}
        <div className="relative">
          {/* Geometric accent */}
          <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-white via-gray-400 to-transparent opacity-30"></div>

          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            Good morning, John Doe
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Here's what's happening with your projects today
          </p>

          {/* Corner accent */}
          <div className="absolute -bottom-2 right-0 w-6 h-6 border-r-2 border-b-2 border-gray-600 opacity-30"></div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, i) => (
            <div
              key={i}
              className={`group relative bg-gradient-to-br ${item.color} backdrop-blur-sm border ${item.borderColor} rounded-xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden`}
            >
              {/* Geometric corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 w-6 h-6 border border-current rotate-45"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border border-current"></div>
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-sm text-gray-400 mb-2 font-medium">
                    {item.label}
                  </p>
                  <p className="text-3xl font-black text-white mb-1 tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-500">{item.change}</p>
                </div>
                <div className="transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  {item.icon}
                </div>
              </div>

              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          ))}
        </div>

        {/* Mid Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="group relative bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 transition-all duration-500 hover:border-gray-600/70 hover:bg-gray-900/80 overflow-hidden">
            {/* Geometric corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-gray-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-gray-500"></div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-12 h-12 border border-gray-400 rotate-45"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border border-gray-500"></div>
            </div>

            <h3 className="text-white font-bold text-2xl mb-6 flex items-center gap-3 relative z-10 tracking-tight">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/40 rounded-lg flex items-center justify-center">
                <ActivityIcon className="w-5 h-5 text-blue-400" />
              </div>
              Recent Activity
            </h3>

            <div className="space-y-4 relative z-10">
              {activity.length > 0 ? (
                activity.map((a) => (
                  <div
                    key={a.id}
                    className="group/item flex items-center gap-4 p-4 rounded-xl bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:scale-105 relative overflow-hidden"
                    onClick={() => navigate(`/chat/${a.id}`)}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-500 opacity-50 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-500 opacity-50 group-hover/item:opacity-100 transition-opacity duration-300"></div>

                    <div className="transform group-hover/item:scale-110 group-hover/item:rotate-6 transition-transform duration-300">
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold group-hover/item:text-gray-200 transition-colors duration-300">
                        {a.title}
                      </p>
                      <p className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-300">
                        {a.time}
                      </p>
                    </div>

                    {/* Hover shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover/item:translate-x-full transition-transform duration-700"></div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800/60 border border-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ChatIcon className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 font-medium">
                    No recent activity
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start a new chat to get started
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Project Usage */}
          <div className="group relative bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 transition-all duration-500 hover:border-gray-600/70 hover:bg-gray-900/80 overflow-hidden">
            {/* Geometric corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-gray-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-gray-500"></div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-12 h-12 border border-gray-400 rotate-45"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border border-gray-500"></div>
            </div>

            <h3 className="text-white font-bold text-2xl mb-6 flex items-center gap-3 relative z-10 tracking-tight">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600/30 to-emerald-600/30 border border-green-500/40 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 text-green-400" />
              </div>
              Project Usage
            </h3>

            <div className="space-y-6 relative z-10">
              {usage.map((u, i) => {
                const percent =
                  u.total > 0 ? ((u.current / u.total) * 100).toFixed(1) : 0;
                return (
                  <div key={i} className="group/usage">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-300 font-medium">
                        {u.label}
                      </span>
                      <span className="text-gray-400">
                        {u.current} {u.unit ? u.unit : ""} / {u.total}{" "}
                        {u.unit ? u.unit : ""}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${u.color} rounded-full transition-all duration-1000 ease-out relative`}
                          style={{ width: `${percent}%` }}
                        >
                          {/* Animated shimmer on progress bar */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
                        </div>
                      </div>
                      {/* Percentage display */}
                      <div className="absolute right-0 -top-6 text-xs text-gray-500 font-medium">
                        {percent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-white via-gray-400 to-transparent opacity-30"></div>

          <h3 className="text-white text-2xl font-bold mb-6 tracking-tight">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={action.action}
                className={`group relative flex items-center justify-center gap-3 p-6 rounded-xl transition-all duration-500 font-semibold text-lg overflow-hidden hover:scale-105 hover:-translate-y-1 ${
                  action.primary
                    ? "bg-white text-black hover:bg-gray-100 border-2 border-white"
                    : "bg-gray-800/60 text-white border-2 border-gray-700/50 hover:bg-gray-800/80 hover:border-gray-600/70 backdrop-blur-sm"
                }`}
              >
                {/* Geometric corner accents for non-primary buttons */}
                {!action.primary && (
                  <>
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                  </>
                )}

                <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {action.icon}
                </div>
                <span className="relative z-10">{action.label}</span>

                {/* Hover effects */}
                {action.primary ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
