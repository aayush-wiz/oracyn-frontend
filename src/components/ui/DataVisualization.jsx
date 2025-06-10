import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";
import { LoadingCenter } from "../ui/Loading.jsx";

const DataVisualization = ({ files = [], selectedChatId }) => {
  const { token } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [backendFiles, setBackendFiles] = useState([]);
  const [error, setError] = useState(null);
  const [contentError, setContentError] = useState(null);

  // Load files from backend if not provided as props
  useEffect(() => {
    const loadFilesFromBackend = async () => {
      if (files.length > 0 || !selectedChatId || !token) return;

      setIsLoadingFiles(true);
      setError(null);

      try {
        const response = await authAPI.getChatFiles(token, selectedChatId);
        setBackendFiles(response || []);
      } catch (err) {
        console.error("Error loading files from backend:", err);
        setError("Failed to load files from server");
        setBackendFiles([]);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    loadFilesFromBackend();
  }, [selectedChatId, token, files.length]);

  // Use either prop files or backend files
  const displayFiles = files.length > 0 ? files : backendFiles;

  // Load file content from backend when a file is selected
  useEffect(() => {
    const loadFileContent = async () => {
      if (!selectedFile || !token) return;

      setIsLoadingContent(true);
      setContentError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/files/${
            selectedFile.id
          }/content`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load file content: ${response.statusText}`
          );
        }

        const contentData = await response.json();
        setFileContent(contentData);
      } catch (error) {
        console.error("Error loading file content:", error);
        setContentError(`Failed to load file content: ${error.message}`);

        // Fallback to generating preview info from file metadata
        setFileContent(generateFilePreview(selectedFile));
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadFileContent();
  }, [selectedFile, token]);

  // Generate basic file preview from metadata when content can't be loaded
  const generateFilePreview = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const uploadDate = file.uploadedAt
      ? new Date(file.uploadedAt).toLocaleDateString()
      : "Unknown";

    return {
      type: "metadata",
      name: file.name,
      size: file.size,
      uploadDate,
      fileType: fileExtension,
      downloadUrl: file.url,
      metadata: {
        extension: fileExtension,
        mimeType: file.type,
        sizeFormatted: formatFileSize(file.size),
      },
    };
  };

  // Handle file download
  const handleDownload = async (file) => {
    try {
      if (file.url) {
        // If file has direct URL, use it
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Otherwise, request download URL from backend
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/files/${file.id}/download`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to get download URL");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      setError(`Failed to download file: ${error.message}`);
    }
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("sheet") || type.includes("csv")) return "📊";
    if (type.includes("presentation")) return "📑";
    if (type.includes("text")) return "📄";
    if (type.includes("image")) return "🖼️";
    return "📎";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeFromName = (fileName) => {
    return fileName.split(".").pop().toLowerCase();
  };

  const filteredFiles = displayFiles.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const fileType = file.type
      ? file.type.split("/")[0]
      : getFileTypeFromName(file.name);
    const matchesFilter = filterType === "all" || fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  const fileTypes = [
    ...new Set(
      displayFiles.map((file) => {
        if (file.type) return file.type.split("/")[0];
        const ext = getFileTypeFromName(file.name);
        if (["pdf", "doc", "docx", "txt"].includes(ext)) return "text";
        if (["csv", "xlsx", "xls"].includes(ext)) return "spreadsheet";
        if (["ppt", "pptx"].includes(ext)) return "presentation";
        if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
        return "application";
      })
    ),
  ];

  const renderFileContent = () => {
    if (isLoadingContent) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <LoadingCenter message="Loading file content..." />
        </div>
      );
    }

    if (contentError) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Content Load Error
            </h3>
            <p className="text-sm text-red-500 mb-4">{contentError}</p>
            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">File Information:</p>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (!fileContent) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Select a file to preview
            </h3>
            <p className="text-sm text-gray-400">
              Choose a file from the list to view its contents
            </p>
          </div>
        </div>
      );
    }

    // Render different content types based on backend response
    if (fileContent.type === "pdf") {
      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">PDF Document</h3>
              {fileContent.downloadUrl && (
                <button
                  onClick={() => window.open(fileContent.downloadUrl, "_blank")}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Original
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Pages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fileContent.pageCount || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Size</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatFileSize(fileContent.size || 0)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Words</p>
                <p className="text-lg font-semibold text-gray-900">
                  {fileContent.wordCount || "N/A"}
                </p>
              </div>
            </div>

            {fileContent.text && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Content Preview</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {fileContent.text.substring(0, 2000)}
                    {fileContent.text.length > 2000 && "..."}
                  </p>
                </div>
              </div>
            )}

            {fileContent.metadata && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Document Metadata</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(fileContent.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium text-gray-600">{key}:</span>
                      <span className="ml-2 text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (fileContent.type === "csv" || fileContent.type === "spreadsheet") {
      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Spreadsheet Data</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Rows</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fileContent.rowCount || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Columns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fileContent.columnCount || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Size</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatFileSize(fileContent.size || 0)}
                </p>
              </div>
            </div>

            {fileContent.headers && fileContent.data && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Data Preview</h4>
                <div className="overflow-x-auto bg-gray-50 rounded-lg">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        {fileContent.headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fileContent.data.slice(0, 10).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-200">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 text-sm text-gray-900"
                            >
                              {String(cell).substring(0, 50)}
                              {String(cell).length > 50 && "..."}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {fileContent.rowCount > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing 10 of {fileContent.rowCount} rows
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (fileContent.type === "text") {
      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Text Document</h3>

            {fileContent.wordCount && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Words</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {fileContent.wordCount}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Characters
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {fileContent.charCount || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Lines</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {fileContent.lineCount || "N/A"}
                  </p>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Content</h4>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm">
                  {fileContent.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Fallback for metadata-only view
    if (fileContent.type === "metadata") {
      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">File Information</h3>
              {fileContent.downloadUrl && (
                <button
                  onClick={() => handleDownload(selectedFile)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">File Name</p>
                  <p className="text-lg font-semibold text-gray-900 break-all">
                    {fileContent.name}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">File Size</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {fileContent.metadata.sizeFormatted}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">File Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {fileContent.fileType.toUpperCase()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Upload Date
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {fileContent.uploadDate}
                  </p>
                </div>
              </div>

              {fileContent.metadata && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Additional Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      MIME Type: {fileContent.metadata.mimeType}
                    </p>
                    <p className="text-sm text-gray-600">
                      Preview not available for this file type. Use the download
                      button to access the file.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Unknown file format
          </h3>
          <p className="text-sm text-gray-400">
            Unable to preview this file type
          </p>
        </div>
      </div>
    );
  };

  // Show loading state while fetching files
  if (isLoadingFiles) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <LoadingCenter message="Loading documents from server..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error Loading Documents
          </h3>
          <p className="text-sm text-red-500 mb-4">{error}</p>
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

  // Show empty state
  if (displayFiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            No documents to display
          </h3>
          <p className="text-sm text-gray-400">
            Upload documents to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* File List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Documents ({displayFiles.length})
          </h3>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All types</option>
            {fileTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)} files
              </option>
            ))}
          </select>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto">
          {filteredFiles.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">
                No files match your criteria
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {filteredFiles.map((file, index) => (
                <div
                  key={file.id || index}
                  onClick={() => setSelectedFile(file)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFile?.id === file.id
                      ? "bg-blue-50 border-blue-200 border"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {getFileIcon(file.type || file.name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {file.type
                          ? file.type.split("/")[1]?.toUpperCase()
                          : getFileTypeFromName(file.name).toUpperCase()}
                      </p>
                      {file.uploadedAt && (
                        <p className="text-xs text-gray-400">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {selectedFile && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => handleDownload(selectedFile)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        )}
      </div>

      {/* Content Viewer */}
      {renderFileContent()}
    </div>
  );
};

export default DataVisualization;
