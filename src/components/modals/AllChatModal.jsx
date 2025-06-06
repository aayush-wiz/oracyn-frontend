import { useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  Download,
  MoreHorizontal,
  X,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  Archive,
  MessageCircle,
  Trash2,
  Pin,
} from "lucide-react";

const AllChatsModal = ({ isOpen, onClose, onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("list");

  // Mock data for all chats
  const [allChats] = useState([
    {
      id: 1,
      title: "Marketing Strategy Discussion",
      lastMessage: "Let's focus on the Q2 campaign objectives...",
      participants: ["You", "Claude"],
      createdAt: "2024-01-15 10:30 AM",
      updatedAt: "2024-01-15 02:45 PM",
      tags: ["marketing", "strategy"],
      messageCount: 45,
      type: "conversation",
      category: "Business",
      isActive: false,
      starred: true,
      pinned: false,
      attachments: 3,
    },
    {
      id: 2,
      title: "Code Review Session",
      lastMessage: "The implementation looks good...",
      participants: ["You", "Claude"],
      createdAt: "2024-01-14 04:20 PM",
      updatedAt: "2024-01-14 06:15 PM",
      tags: ["coding", "review"],
      messageCount: 28,
      type: "technical",
      category: "Development",
      isActive: true,
      starred: true,
      pinned: true,
      attachments: 8,
    },
    {
      id: 3,
      title: "Quick Math Help",
      lastMessage: "Thanks for the calculation help!",
      participants: ["You", "Claude"],
      createdAt: "2024-01-14 01:20 PM",
      updatedAt: "2024-01-14 01:45 PM",
      tags: ["math", "help"],
      messageCount: 8,
      type: "support",
      category: "Education",
      isActive: false,
      starred: false,
      pinned: false,
      attachments: 0,
    },
    {
      id: 4,
      title: "Creative Writing Session",
      lastMessage: "The character development in chapter 3...",
      participants: ["You", "Claude"],
      createdAt: "2024-01-13 11:30 AM",
      updatedAt: "2024-01-13 01:20 PM",
      tags: ["writing", "creative"],
      messageCount: 67,
      type: "creative",
      category: "Creative",
      isActive: false,
      starred: true,
      pinned: false,
      attachments: 2,
    },
    {
      id: 5,
      title: "Data Analysis Help",
      lastMessage: "The correlation shows significant...",
      participants: ["You", "Claude"],
      createdAt: "2024-01-12 02:15 PM",
      updatedAt: "2024-01-12 04:30 PM",
      tags: ["data", "analysis"],
      messageCount: 19,
      type: "analytical",
      category: "Data Science",
      isActive: false,
      starred: true,
      pinned: false,
      attachments: 5,
    },
    {
      id: 6,
      title: "General Questions",
      lastMessage: "What are the benefits of...",
      participants: ["You", "Claude"],
      createdAt: "2024-01-11 09:45 AM",
      updatedAt: "2024-01-11 09:50 AM",
      tags: ["general", "questions"],
      messageCount: 3,
      type: "conversation",
      category: "General",
      isActive: false,
      starred: false,
      pinned: false,
      attachments: 0,
    },
    {
      id: 7,
      title: "Language Learning Practice",
      lastMessage: "Tu pronunciación está mejorando...",
      participants: ["You", "Claude"],
      createdAt: "2024-01-11 09:45 AM",
      updatedAt: "2024-01-11 11:20 AM",
      tags: ["language", "spanish"],
      messageCount: 89,
      type: "educational",
      category: "Education",
      isActive: false,
      starred: true,
      pinned: false,
      attachments: 1,
    },
    {
      id: 8,
      title: "Recipe Ideas",
      lastMessage: "Here are some vegetarian options...",
      participants: ["You", "Claude"],
      createdAt: "2024-01-10 07:20 PM",
      updatedAt: "2024-01-10 07:35 PM",
      tags: ["cooking", "recipes"],
      messageCount: 12,
      type: "conversation",
      category: "Lifestyle",
      isActive: false,
      starred: false,
      pinned: false,
      attachments: 0,
    },
  ]);

  const filteredChats = allChats
    .filter((chat) => {
      const matchesSearch =
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesFilter =
        filterType === "all" ||
        (filterType === "starred" && chat.starred) ||
        (filterType === "active" && chat.isActive) ||
        (filterType === "pinned" && chat.pinned) ||
        chat.category.toLowerCase() === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Always sort pinned chats first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

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
    onSelectChat(chat);
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
      case "Lifestyle":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "General":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Chats</h2>
              <p className="text-gray-600">
                Manage and access all your conversations
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search all chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-w-32 cursor-pointer"
              >
                <option value="all">All Chats</option>
                <option value="starred">Starred</option>
                <option value="pinned">Pinned</option>
                <option value="active">Active</option>
                <option value="business">Business</option>
                <option value="development">Development</option>
                <option value="creative">Creative</option>
                <option value="education">Education</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-w-32 cursor-pointer"
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
              <span>{filteredChats.length} chats</span>
              <span>•</span>
              <span>{allChats.filter((c) => c.starred).length} starred</span>
              <span>•</span>
              <span>{allChats.filter((c) => c.isActive).length} active</span>
              <span>•</span>
              <span>{allChats.filter((c) => c.pinned).length} pinned</span>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setSortBy("recent");
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {/* Content */}
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
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        {chat.pinned && (
                          <Pin className="w-4 h-4 text-indigo-500 fill-current" />
                        )}
                        {chat.starred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        {chat.isActive && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>

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
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 pr-8">
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`bg-white border rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group ${
                        chat.pinned
                          ? "border-indigo-200 bg-indigo-50"
                          : "border-gray-200"
                      }`}
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
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {chat.pinned && (
                                <Pin className="w-4 h-4 text-indigo-500 fill-current" />
                              )}
                              {chat.starred && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                              {chat.isActive && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                            {chat.lastMessage}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {new Date(chat.updatedAt).toLocaleDateString()}
                            </span>
                            <span>{chat.messageCount} messages</span>
                            {chat.attachments > 0 && (
                              <span>{chat.attachments} attachments</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Pin/Unpin chat:", chat.id);
                            }}
                            className={`p-2 rounded transition-colors ${
                              chat.pinned
                                ? "text-indigo-600 hover:bg-indigo-100"
                                : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                            }`}
                            title={chat.pinned ? "Unpin" : "Pin"}
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Star/Unstar chat:", chat.id);
                            }}
                            className={`p-2 rounded transition-colors ${
                              chat.starred
                                ? "text-yellow-500 hover:bg-yellow-100"
                                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                            }`}
                            title={chat.starred ? "Unstar" : "Star"}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                chat.starred ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Archive chat:", chat.id);
                            }}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Delete chat:", chat.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("More options:", chat.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No chats found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  No conversations match your current filters. Try adjusting
                  your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                    setSortBy("recent");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{allChats.length} total conversations</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => console.log("Bulk actions")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              Bulk Actions
            </button>
            <button
              onClick={() => console.log("Export chats")}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllChatsModal;
