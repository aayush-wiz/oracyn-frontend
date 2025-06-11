import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useDocuments } from "../../hooks/useDocuments.js";
import {
  FileText,
  Upload,
  TrendingUp,
  FileSpreadsheet,
  Presentation,
  File,
  Plus,
  Search,
  ArrowRight,
  Zap,
  Brain,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { fileUtils, dateUtils } from "../../utils/helper.js";
import { FILE_TYPE_INFO } from "../../utils/constants.js";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    documents,
    recentDocuments,
    stats,
    isLoadingDocuments,
    documentsError,
    createDocument,
    isCreatingDocument,
  } = useDocuments();

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument("New Analysis");
      // Navigate to the new document
      window.location.href = `/analyze/${newDoc.id}`;
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  const getFileIcon = (type) => {
    const typeInfo = FILE_TYPE_INFO[type];
    if (typeInfo) {
      return <FileText className={`w-5 h-5 ${typeInfo.color}`} />;
    }

    // Fallback logic for unknown types
    if (type?.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (
      type?.includes("spreadsheet") ||
      type?.includes("excel") ||
      type?.includes("csv")
    )
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    if (type?.includes("presentation"))
      return <Presentation className="w-5 h-5 text-orange-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description:
        "Get intelligent insights from your documents using advanced AI",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Processing",
      description: "Upload and analyze documents in seconds, not minutes",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Suggestions",
      description:
        "Get contextual suggestions on what to analyze in your documents",
    },
  ];

  // Loading state
  if (isLoadingDocuments) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (documentsError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-sm text-red-500 mb-4">
            {documentsError.message || "Failed to load dashboard data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to analyze your documents with AI?
            </p>
          </div>
          <button
            onClick={handleCreateDocument}
            disabled={isCreatingDocument}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isCreatingDocument ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            <span className="font-medium">
              {isCreatingDocument ? "Creating..." : "Upload Document"}
            </span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Documents
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalDocuments}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Queries
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalQueries}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.documentsThisWeek}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Documents
              </h2>
              <Link
                to="/analyze"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {recentDocuments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.documents?.[0]?.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>
                            {doc.documentCount} document
                            {doc.documentCount !== 1 ? "s" : ""}
                          </span>
                          <span>•</span>
                          <span>
                            {doc.messageCount} quer
                            {doc.messageCount !== 1 ? "ies" : "y"}
                          </span>
                          <span>•</span>
                          <span>{dateUtils.formatDate(doc.updatedAt)}</span>
                        </div>
                        {doc.lastMessage && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                            {doc.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.status === "STARRED" && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                      <Link
                        to={`/analyze/${doc.id}`}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        <span>
                          {doc.state === "CHAT" ? "Continue" : "Analyze"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first document to get started with AI analysis
              </p>
              <button
                onClick={handleCreateDocument}
                disabled={isCreatingDocument}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isCreatingDocument ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>
                  {isCreatingDocument ? "Creating..." : "Upload Document"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Powerful Document Analysis
            </h2>
            <p className="text-gray-600">
              Discover what makes our AI-powered document analysis different
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {documents.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={handleCreateDocument}
                disabled={isCreatingDocument}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">New Analysis</p>
                  <p className="text-sm text-gray-600">Upload new document</p>
                </div>
              </button>

              <Link
                to="/analyze"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">All Documents</p>
                  <p className="text-sm text-gray-600">View all analyses</p>
                </div>
              </Link>

              <Link
                to="/settings"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Settings</p>
                  <p className="text-sm text-gray-600">Manage preferences</p>
                </div>
              </Link>

              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">AI Insights</p>
                  <p className="text-sm text-gray-600">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
