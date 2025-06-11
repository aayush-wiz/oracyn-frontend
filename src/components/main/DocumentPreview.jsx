import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Info,
  CheckCircle,
  Clock,
  FileIcon,
  BarChart3,
  Layers,
  Hash,
  Calendar,
} from "lucide-react";
import { fileUtils, dateUtils } from "../../utils/helper.js";
import { FILE_TYPE_INFO } from "../../utils/constants.js";

const DocumentPreview = ({ file, analysisStatus = "ready" }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const fileTypeInfo = fileUtils.getTypeInfo(file?.type);

  const tabs = [
    { id: "overview", name: "Overview", icon: Info },
    { id: "preview", name: "Preview", icon: Eye },
    { id: "details", name: "Details", icon: FileIcon },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case "ready":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <div className="w-5 h-5 bg-red-500 rounded-full" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "processing":
        return "Processing...";
      case "ready":
        return "Ready for analysis";
      case "error":
        return "Processing error";
      default:
        return "Unknown status";
    }
  };

  const mockAnalysis = {
    pageCount: 15,
    wordCount: 3420,
    tableCount: 4,
    imageCount: 7,
    lastModified: file?.lastModified || Date.now(),
    fileSize: file?.size || 0,
    language: "English",
    readingTime: "12 minutes",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start space-x-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${fileTypeInfo.bgColor}`}
          >
            <FileText className={`w-6 h-6 ${fileTypeInfo.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {file?.name || "Document"}
            </h3>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(analysisStatus)}
                <span className="text-sm text-gray-600">
                  {getStatusText(analysisStatus)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{fileTypeInfo.name}</span>
                <span>•</span>
                <span>{fileUtils.formatSize(file?.size || 0)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              /* Handle download */
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download file"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Capabilities */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                AI Analysis Capabilities
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {fileTypeInfo.capabilities.map((capability, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Document Statistics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {mockAnalysis.pageCount}
                  </div>
                  <div className="text-xs text-gray-500">Pages</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Hash className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {mockAnalysis.wordCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Words</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {mockAnalysis.tableCount}
                  </div>
                  <div className="text-xs text-gray-500">Tables</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {mockAnalysis.readingTime}
                  </div>
                  <div className="text-xs text-gray-500">Read Time</div>
                </div>
              </div>
            </div>

            {/* Processing Status */}
            {analysisStatus === "processing" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Processing Document
                    </h4>
                    <p className="text-sm text-yellow-700">
                      AI is analyzing your document structure and content. This
                      usually takes 1-2 minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "preview" && (
          <div className="space-y-4">
            {/* Preview placeholder */}
            <div className="aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  Document Preview
                </h4>
                <p className="text-sm text-gray-500 max-w-sm">
                  Preview functionality will be available once the document is
                  processed
                </p>
              </div>
            </div>

            {/* Preview controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page 1 of {mockAnalysis.pageCount}
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6">
            {/* File Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                File Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">File Name</span>
                  <span className="text-sm font-medium text-gray-900">
                    {file?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">File Type</span>
                  <span className="text-sm font-medium text-gray-900">
                    {fileTypeInfo.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">File Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    {fileUtils.formatSize(file?.size || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Upload Date</span>
                  <span className="text-sm font-medium text-gray-900">
                    {dateUtils.formatDateTime(new Date())}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Analysis */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Document Analysis
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Pages</span>
                  <span className="text-sm font-medium text-gray-900">
                    {mockAnalysis.pageCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Words</span>
                  <span className="text-sm font-medium text-gray-900">
                    {mockAnalysis.wordCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tables</span>
                  <span className="text-sm font-medium text-gray-900">
                    {mockAnalysis.tableCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Images</span>
                  <span className="text-sm font-medium text-gray-900">
                    {mockAnalysis.imageCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Language</span>
                  <span className="text-sm font-medium text-gray-900">
                    {mockAnalysis.language}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Reading Time</span>
                  <span className="text-sm font-medium text-gray-900">
                    {mockAnalysis.readingTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;
