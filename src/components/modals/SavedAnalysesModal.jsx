import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";
import {
  Search,
  Star,
  FileText,
  Download,
  Eye,
  MoreHorizontal,
  X,
  Calendar,
  Tag,
  Bookmark,
  TrendingUp,
  Database,
  BarChart3,
  Clock,
  Archive,
} from "lucide-react";

const SavedAnalysesModal = ({ isOpen, onClose, onSelectAnalysis }) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [savedAnalyses, setSavedAnalyses] = useState([]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!token) return;
      try {
        const chats = await authAPI.getChats(token);
        // Filter chats with queries/analyses
        const analyses = chats
          .filter((chat) => chat.messages?.some((msg) => msg.type === "query"))
          .map((chat) => ({
            id: chat.id,
            title: chat.title || "Untitled Analysis",
            type:
              chat.messages.find((msg) => msg.type === "query")?.queryType ||
              "summary",
            query:
              chat.messages.find((msg) => msg.type === "query")?.content || "",
            documents: chat.documents?.map((doc) => doc.name) || [],
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            tags: chat.tags || [],
            preview:
              chat.messages
                .find((msg) => msg.type === "response")
                ?.content.slice(0, 100) || "",
            starred: chat.status === "STARRED",
            size:
              chat.documents?.reduce((sum, doc) => sum + (doc.size || 0), 0) ||
              0,
            queries:
              chat.messages?.filter((msg) => msg.type === "query").length || 0,
          }));
        setSavedAnalyses(analyses);
      } catch (err) {
        console.error("Error fetching analyses:", err);
      }
    };
    fetchAnalyses();
  }, [token]);

  const filteredAnalyses = savedAnalyses
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesFilter = filterType === "all" || item.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "queries":
          return b.queries - a.queries;
        default:
          return 0;
      }
    });

  const handleSelectAnalysis = (analysis) => {
    onSelectAnalysis(analysis.id);
    onClose();
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "summary":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "extraction":
        return <Database className={`${iconClass} text-green-500`} />;
      case "comparison":
        return <BarChart3 className={`${iconClass} text-purple-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "summary":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "extraction":
        return "bg-green-50 text-green-700 border-green-200";
      case "comparison":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Saved Analyses
              </h2>
              <p className="text-gray-600">
                Manage and access your saved document analyses
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search analyses, queries, or tags..."
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
                <option value="all">All Types</option>
                <option value="summary">Summary</option>
                <option value="extraction">Extraction</option>
                <option value="comparison">Comparison</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-w-32 cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Title A-Z</option>
                <option value="queries">Most Queried</option>
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
              <span>{filteredAnalyses.length} analyses found</span>
              <span>•</span>
              <span>
                {savedAnalyses.filter((a) => a.starred).length} starred
              </span>
              <span>•</span>
              <span>
                {savedAnalyses.reduce((sum, a) => sum + a.queries, 0)} total
                queries
              </span>
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

        <div className="flex-1 overflow-hidden">
          {filteredAnalyses.length > 0 ? (
            <div className="h-full overflow-y-auto p-6">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAnalyses.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
                      onClick={() => handleSelectAnalysis(item)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(item.type)}
                          <div>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(
                                item.type
                              )}`}
                            >
                              {item.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.starred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("More options for:", item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {item.preview}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{item.queries} queries</span>
                          <span>{item.documents.length} docs</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAnalyses.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
                      onClick={() => handleSelectAnalysis(item)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(item.type)}
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(
                              item.type
                            )}`}
                          >
                            {item.type}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {item.title}
                            </h3>
                            {item.starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {item.preview}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <span>{item.queries} queries</span>
                            <span>{item.documents.length} documents</span>
                            <span>{formatSize(item.size)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("View analysis:", item.id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Download analysis:", item.id);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("More options for:", item.id);
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No analyses found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  No saved analyses match your current filters. Try adjusting
                  your search criteria or clear all filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>
                Total storage:{" "}
                {formatSize(savedAnalyses.reduce((sum, a) => sum + a.size, 0))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => console.log("Archive selected")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              Archive All
            </button>
            <button
              onClick={() => console.log("Export all")}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export All
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

export default SavedAnalysesModal;
