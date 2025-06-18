// components/main/chat/ChatComponents/HistoryModal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/useStore";
import {
  X,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  BarChart3,
  Trash2,
  Eye,
} from "lucide-react";

const HistoryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { chats, activeChat, setActiveChat, deleteChat, getChatCharts } =
    useStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
    onClose();
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteChat(chatId);
      if (activeChat === chatId) {
        // If we deleted the active chat, navigate to the first remaining chat or create new
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        if (remainingChats.length > 0) {
          handleChatSelect(remainingChats[0].id);
        } else {
          navigate("/chat");
          onClose();
        }
      }
    }
  };

  const getPreviewText = (chat) => {
    if (chat.messages.length === 0) return "No messages yet";
    const lastMessage = chat.messages[chat.messages.length - 1];
    const text = lastMessage.text.replace(/<[^>]*>/g, ""); // Remove HTML tags
    return text.length > 60 ? text.substring(0, 60) + "..." : text;
  };

  const sortedChats = [...chats].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 h-[80vh] relative overflow-hidden">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-16 h-16 border border-gray-400 rotate-45"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border border-gray-500 rotate-12"></div>
          <div className="absolute bottom-8 left-8 w-8 h-8 border border-gray-600"></div>
          <div className="absolute bottom-8 right-8 w-14 h-14 border border-gray-400 rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gray-500 opacity-20"></div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-gray-500"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-gray-500"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-gray-500"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-gray-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 backdrop-blur-sm bg-black/20 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Chat History
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {chats.length} conversation{chats.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="group p-2 bg-gray-800/60 hover:bg-red-900/30 border border-gray-600/50 hover:border-red-700/50 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-gray-300 group-hover:text-red-300" />
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 h-screen overflow-y-auto p-6 relative z-10">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-800/40 border border-gray-700/50 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No chats yet
              </h3>
              <p className="text-gray-500">
                Start your first conversation to see it here
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedChats.map((chat, index) => {
                const isActive = activeChat === chat.id;
                const chatCharts = getChatCharts(chat.id);

                return (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={`group relative p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
                      isActive
                        ? "bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/20"
                        : "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/70"
                    }`}
                  >
                    {/* Geometric corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-current opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-current opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400"></div>
                    )}

                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Chat title and document */}
                        <div className="flex items-center gap-3 mb-3">
                          <h3
                            className={`font-semibold text-lg truncate transition-colors duration-300 ${
                              isActive
                                ? "text-white"
                                : "text-gray-200 group-hover:text-white"
                            }`}
                          >
                            {chat.title}
                          </h3>

                          {chat.document && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 border border-gray-600/50 rounded-lg">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-300 truncate max-w-32">
                                {chat.document.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Preview text */}
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                          {getPreviewText(chat)}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(chat.updatedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(chat.updatedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{chat.messages.length} messages</span>
                          </div>
                          {chatCharts.length > 0 && (
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              <span>{chatCharts.length} charts</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChatSelect(chat.id);
                          }}
                          className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 text-indigo-300 rounded-lg transition-all duration-300 hover:scale-110"
                          title="Open Chat"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 rounded-lg transition-all duration-300 hover:scale-110"
                          title="Delete Chat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Animated hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700/50 p-6 backdrop-blur-sm bg-black/10 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live sync enabled</span>
              </div>
              <span>•</span>
              <span>Last updated: {formatTime(new Date().toISOString())}</span>
            </div>

            <button
              onClick={onClose}
              className="group relative bg-transparent border-2 border-gray-600 text-white px-6 py-2 font-semibold overflow-hidden transition-all duration-500 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105"
            >
              <div className="absolute inset-0 bg-indigo-600 transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                Close
              </span>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HistoryModal;
