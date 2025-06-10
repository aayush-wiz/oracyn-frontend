import { useState, useRef } from "react";
import { Upload, FileText, X, Send, Eye, MessageCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";
import Loading from "../ui/Loading.jsx";

const PromptArea = ({ selectedChatId, onVisualize, onStartChat }) => {
  const { token } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const allowedFileTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".csv",
    ".xlsx",
    ".xls",
    ".ppt",
    ".pptx",
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB
  const maxFiles = 10;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const validateFile = (file) => {
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedFileTypes.includes(fileExtension)) {
      return `File type ${fileExtension} is not supported. Allowed types: ${allowedFileTypes.join(
        ", "
      )}`;
    }

    if (file.size > maxFileSize) {
      return `File size must be less than ${maxFileSize / (1024 * 1024)}MB`;
    }

    return null;
  };

  const handleFiles = async (files) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploadError(null);
    const validFiles = [];

    // Validate files
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }

      // Check for duplicates
      const isDuplicate = uploadedFiles.some(
        (uploaded) => uploaded.name === file.name && uploaded.size === file.size
      );

      if (!isDuplicate) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    // Upload files to backend
    for (const file of validFiles) {
      try {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

        const response = await authAPI.uploadFile(token, selectedChatId, file);

        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

        // Add uploaded file to state
        const fileData = {
          id: response.fileId || Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: response.url,
          uploadedAt: new Date().toISOString(),
        };

        setUploadedFiles((prev) => [...prev, fileData]);

        // Clear progress after a delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const updated = { ...prev };
            delete updated[file.name];
            return updated;
          });
        }, 1000);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadError(`Failed to upload ${file.name}: ${error.message}`);
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
      }
    }

    setIsUploading(false);
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("sheet") || type.includes("csv")) return "📊";
    if (type.includes("presentation")) return "📑";
    if (type.includes("text")) return "📄";
    return "📎";
  };

  const handleVisualize = () => {
    if (uploadedFiles.length === 0) return;
    onVisualize(uploadedFiles);
  };

  const handleStartChat = () => {
    if (!prompt.trim() || uploadedFiles.length === 0) return;
    onStartChat(prompt.trim(), uploadedFiles);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleStartChat();
    }
  };

  const canStartChat = prompt.trim() && uploadedFiles.length > 0;
  const canVisualize = uploadedFiles.length > 0;

  return (
    <div className="h-full overflow-auto flex flex-col bg-white p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Documents
        </h2>
        <p className="text-gray-600">
          Upload your documents and start analyzing them with AI
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-6 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFileTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, DOC, DOCX, TXT, CSV, XLS, XLSX, PPT, PPTX
            </p>
            <p className="text-xs text-gray-400">
              Max file size: 50MB • Max files: {maxFiles}
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Browse Files"}
          </button>
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{uploadError}</p>
          <button
            onClick={() => setUploadError(null)}
            className="mt-2 text-xs text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-4">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading {fileName}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What would you like to know about your documents?
        </label>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question about your documents or describe what you want to analyze..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows="4"
        />
        <p className="text-xs text-gray-500 mt-2">
          Press Ctrl + Enter to start chat
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-3">
        <button
          onClick={handleStartChat}
          disabled={!canStartChat || isUploading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isUploading ? (
            <Loading
              type="button"
              size="sm"
              message="Uploading..."
              color="white"
            />
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              Start Analysis Chat
            </>
          )}
        </button>

        <button
          onClick={handleVisualize}
          disabled={!canVisualize || isUploading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Eye className="w-5 h-5" />
          Visualize Documents
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Upload multiple documents to compare and analyze together</li>
          <li>• Be specific in your questions for better results</li>
          <li>• You can ask follow-up questions during the chat</li>
        </ul>
      </div>
    </div>
  );
};

export default PromptArea;
