// components/ui/HistoryModal.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useStore from "../../store/useStore";
import {
  X,
  MessageSquare,
  FileText,
  Clock,
  Trash2,
  Search,
  ChevronRight,
} from "lucide-react";

const HistoryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { chats, deleteChat } = useStore();

  // Filter chats based on search
  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages?.some((msg) =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleChatSelect = (chatId) => {
    navigate(`/chat/${chatId}`);
    onClose();
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation(); // Prevent chat selection
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteChat(chatId);

      // If deleting current chat, navigate to another chat or dashboard
      if (location.pathname.includes(chatId)) {
        const remainingChats = chats.filter((c) => c.id !== chatId);
        if (remainingChats.length > 0) {
          navigate(`/chat/${remainingChats[0].id}`);
        } else {
          navigate("/dashboard");
        }
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessagePreview = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet";
    }
    const lastMessage = chat.messages[chat.messages.length - 1];
    return (
      lastMessage.text.substring(0, 100) +
      (lastMessage.text.length > 100 ? "..." : "")
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-white">Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">
                {searchQuery ? "No chats found" : "No chat history yet"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => {
                    navigate("/chat");
                    onClose();
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Start your first chat
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChats.map((chat) => {
                const isActive = location.pathname.includes(chat.id);

                return (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all
                      ${
                        isActive
                          ? "bg-indigo-600/20 border border-indigo-500/50"
                          : "bg-gray-800/50 hover:bg-gray-800 border border-transparent"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare
                            className={`w-4 h-4 ${
                              isActive ? "text-indigo-400" : "text-gray-400"
                            }`}
                          />
                          <h3
                            className={`font-medium truncate ${
                              isActive ? "text-white" : "text-gray-200"
                            }`}
                          >
                            {chat.title}
                          </h3>
                        </div>

                        {chat.document && (
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <FileText className="w-3 h-3" />
                            <span className="truncate">
                              {chat.document.name}
                            </span>
                          </div>
                        )}

                        <p className="text-sm text-gray-400 line-clamp-2">
                          {getMessagePreview(chat)}
                        </p>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(chat.lastUsed)}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {chat.messages?.length || 0} messages
                          </span>
                          {chat.documentsUsed > 0 && (
                            <span className="text-xs text-gray-500">
                              {chat.documentsUsed} document
                              {chat.documentsUsed > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {isActive && (
                          <ChevronRight className="w-5 h-5 text-indigo-400" />
                        )}
                        <button
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{chats.length} total chats</span>
            <span>{chats.filter((c) => c.document).length} with documents</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
