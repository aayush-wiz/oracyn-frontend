import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";
import {
  Search,
  Star,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  Tag,
  Share2,
  Trash2,
  X
} from "lucide-react";

const StarredChatsModal = ({ isOpen, onClose, onSelectChat }) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [starredChats, setStarredChats] = useState([]);
  const [error, setError] = useState(null);
  const [openOptionsId, setOpenOptionsId] = useState(null);
  const buttonRefs = useRef({});

  useEffect(() => {
    const fetchStarredChats = async () => {
      if (!token) return;
      setError(null);
      try {
        const chats = await authAPI.getChats(token);
        const starred = chats
          .filter((chat) => chat.status === "STARRED")
          .map((chat) => ({
            id: chat.id,
            title: chat.title || "Untitled Chat",
            lastMessage: chat.messages?.length
              ? chat.messages[chat.messages.length - 1].content
              : "",
            participants: ["You"],
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            tags: chat.tags || [],
            messageCount: chat.messages?.length || 0,
            type: "conversation",
            category: "General",
            isActive: false,
            attachments: chat.documents?.length || 0,
          }));
        setStarredChats(starred);
      } catch (err) {
        setError("Failed to load starred chats");
        console.error("Error fetching starred chats:", err);
      }
    };
    fetchStarredChats();
  }, [token]);

  const handleToggleOptions = (chatId, e) => {
    e.stopPropagation();
    setOpenOptionsId(openOptionsId === chatId ? null : chatId);
  };

  const handleUnstar = async (chatId, e) => {
    e.stopPropagation();
    setError(null);
    try {
      await authAPI.updateChat(token, chatId, "NONE");
      setStarredChats((prev) => prev.filter((chat) => chat.id !== chatId));
      setOpenOptionsId(null);
    } catch (err) {
      setError("Failed to unstar chat");
      console.error("Error unstarring chat:", err);
    }
  };

  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    setError(null);
    try {
      await authAPI.deleteChat(token, chatId);
      setStarredChats((prev) => prev.filter((chat) => chat.id !== chatId));
      setOpenOptionsId(null);
    } catch (err) {
      setError("Failed to delete chat");
      console.error("Error deleting chat:", err);
    }
  };

  const handleShare = async (chatId, e) => {
    e.stopPropagation();
    setError(null);
    try {
      // Placeholder for POST /api/chats/:id/share
      const shareLink = await authAPI.shareChat(token, chatId);
      navigator.clipboard.writeText(shareLink);
      alert("Share link copied to clipboard!");
      setOpenOptionsId(null);
    } catch (err) {
      setError("Failed to share chat");
      console.error("Error sharing chat:", err);
    }
  };

  const getModalPosition = (chatId) => {
    const button = buttonRefs.current[chatId];
    if (!button) return { top: 0, left: 0 };
    const rect = button.getBoundingClientRect();
    const modalHeight = 100;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    return {
      top:
        spaceBelow < modalHeight + 20
          ? rect.top + window.scrollY - modalHeight - 4
          : rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX - 100,
    };
  };

  const filteredChats = starredChats
    .filter((chat) => {
      const matchesSearch =
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "messages":
          return b.messageCount - a.messageCount;
        default:
          return 0;
      }
    });

  const handleSelectChat = (chat) => {
    onSelectChat(chat.id);
    onClose();
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Business":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Development":
        return "bg-green-50 text-green-700 border-green-200";
      case "Creative":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Data Science":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Education":
        return "bg-pink-50 text-pink-700 border-pink-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Starred Chats
              </h2>
              <p className="text-gray-600">
                Your favorite and important conversations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search starred chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none min-w-32 transition-all duration-300 cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Title A-Z</option>
                <option value="messages">Most Messages</option>
              </select>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded text-sm transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 rounded text-sm transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>{filteredChats.length} starred chats</span>
              <span>•</span>
              <span>
                {starredChats.filter((c) => c.isActive).length} active
              </span>
              <span>•</span>
              <span>
                {starredChats.reduce((sum, c) => sum + c.messageCount, 0)} total
                messages
              </span>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("recent");
              }}
              className="text-yellow-600 hover:text-yellow-700 font-medium text-sm cursor-pointer"
            >
              Clear filters
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {filteredChats.length > 0 ? (
            <div className="h-full overflow-y-auto p-6">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group relative"
                      onClick={() => handleSelectChat(chat)}
                    >
                      {chat.isActive && (
                        <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-blue-500" />
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                              chat.category
                            )}`}
                          >
                            {chat.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <button
                            ref={(el) => (buttonRefs.current[chat.id] = el)}
                            onClick={(e) => handleToggleOptions(chat.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {chat.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {chat.lastMessage}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {chat.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{chat.messageCount} msgs</span>
                          <span>{chat.attachments} files</span>
                        </div>
                      </div>
                      {openOptionsId === chat.id && (
                        <div
                          className="fixed w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999]"
                          style={getModalPosition(chat.id)}
                        >
                          <button
                            onClick={(e) => handleUnstar(chat.id, e)}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <Star className="w-4 h-4 text-yellow-500" />
                            Unstar
                          </button>
                          <button
                            onClick={(e) => handleShare(chat.id, e)}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <Share2 className="w-4 h-4 text-blue-400" />
                            Share
                          </button>
                          <button
                            onClick={(e) => handleDelete(chat.id, e)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-blue-500" />
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                              chat.category
                            )}`}
                          >
                            {chat.category}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {chat.title}
                            </h3>
                            <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                            {chat.isActive && (
                              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                            {chat.lastMessage}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {new Date(chat.updatedAt).toLocaleDateString()}
                            </span>
                            <span>{chat.messageCount} messages</span>
                            <span>{chat.attachments} attachments</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleShare(chat.id, e)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            ref={(el) => (buttonRefs.current[chat.id] = el)}
                            onClick={(e) => handleToggleOptions(chat.id, e)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {openOptionsId === chat.id && (
                        <div
                          className="fixed w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999]"
                          style={getModalPosition(chat.id)}
                        >
                          <button
                            onClick={(e) => handleUnstar(chat.id, e)}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <Star className="w-4 h-4 text-yellow-500" />
                            Unstar
                          </button>
                          <button
                            onClick={(e) => handleShare(chat.id, e)}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <Share2 className="w-4 h-4 text-blue-400" />
                            Share
                          </button>
                          <button
                            onClick={(e) => handleDelete(chat.id, e)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No starred chats found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Star your important conversations to access them quickly.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{starredChats.length} starred conversations</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarredChatsModal;
