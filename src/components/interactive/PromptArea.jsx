import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";
import {
  Brain,
  Upload,
  FileText,
  CheckCircle,
  Eye,
  Send,
  FileSpreadsheet,
  Presentation,
  File,
  MessageCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import FileUpload from "./FileUpload";

const PromptArea = ({ selectedChatId, onVisualize, onStartChat }) => {
  const { token } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState([]);

  const handleFilesUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (indexToRemove) => {
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Upload files to backend R2 storage and visualize
  const handleVisualize = async () => {
    if (!selectedChatId || uploadedFiles.length === 0 || !token) return;
    setIsProcessing(true);
    setError(null);
    setUploadProgress([]);

    try {
      // Upload each file to backend R2 storage
      const uploaded = [];
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        setUploadProgress((prev) => [
          ...prev,
          { fileName: file.name, status: "uploading" },
        ]);

        try {
          const response = await authAPI.uploadFile(
            token,
            selectedChatId,
            file
          );
          uploaded.push(response);
          setUploadProgress((prev) =>
            prev.map((p) =>
              p.fileName === file.name ? { ...p, status: "completed" } : p
            )
          );
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          setUploadProgress((prev) =>
            prev.map((p) =>
              p.fileName === file.name ? { ...p, status: "error" } : p
            )
          );
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      // Update chat state to VISUALIZE in backend
      await authAPI.updateChatState(token, selectedChatId, "VISUALIZE");

      onVisualize(uploaded);
      setUploadedFiles([]);
      setUploadProgress([]);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
      console.error("Upload error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Upload files and start chat with backend
  const handleStartChat = async () => {
    if (
      !prompt.trim() ||
      uploadedFiles.length === 0 ||
      !selectedChatId ||
      !token
    )
      return;
    setIsProcessing(true);
    setError(null);
    setUploadProgress([]);

    try {
      // Upload files to backend R2 storage first
      const uploadedBackendFiles = [];
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        setUploadProgress((prev) => [
          ...prev,
          { fileName: file.name, status: "uploading" },
        ]);

        try {
          const response = await authAPI.uploadFile(
            token,
            selectedChatId,
            file
          );
          uploadedBackendFiles.push({
            id: response.id,
            url: response.url,
            key: response.key,
            name: response.name,
            type: response.type,
            size: response.size,
          });
          setUploadProgress((prev) =>
            prev.map((p) =>
              p.fileName === file.name ? { ...p, status: "completed" } : p
            )
          );
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          setUploadProgress((prev) =>
            prev.map((p) =>
              p.fileName === file.name ? { ...p, status: "error" } : p
            )
          );
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      // Start chat with uploaded files from backend
      onStartChat(prompt.trim(), uploadedBackendFiles);

      // Clear the form
      setPrompt("");
      setUploadedFiles([]);
      setUploadProgress([]);
    } catch (err) {
      setError(`Failed to start chat: ${err.message}`);
      console.error("Chat start error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      prompt.trim() &&
      uploadedFiles.length > 0 &&
      selectedChatId &&
      !isProcessing
    ) {
      e.preventDefault();
      handleStartChat();
    }
  };

  const getFileIcon = (file) => {
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />;
    if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />;
    if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      return (
        <FileSpreadsheet className="w-4 h-4 text-green-600 flex-shrink-0" />
      );
    if (file.type === "text/csv")
      return (
        <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
      );
    if (
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
      return <Presentation className="w-4 h-4 text-orange-600 flex-shrink-0" />;
    if (file.type === "text/plain")
      return <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />;
    return <File className="w-4 h-4 text-gray-600 flex-shrink-0" />;
  };

  const isInputDisabled = !selectedChatId || isProcessing;
  const isChatDisabled =
    !prompt.trim() ||
    uploadedFiles.length === 0 ||
    !selectedChatId ||
    isProcessing;
  const isVisualizeDisabled =
    uploadedFiles.length === 0 || !selectedChatId || isProcessing;

  return (
    <div className="w-full h-screen flex flex-col bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
            <p className="text-sm text-gray-600">
              Upload to server and analyze documents
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Document Status
            </h3>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {uploadedFiles.length} ready for upload
              </span>
            </div>
          )}
        </div>

        {uploadedFiles.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                No documents selected
              </p>
              <p className="text-xs text-gray-500">
                Select files to upload to server
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid gap-2 max-h-24 overflow-y-auto">
              {uploadedFiles.slice(0, 3).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-200"
                >
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • Ready for server
                      upload
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
            {uploadedFiles.length > 3 && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-600 font-medium">
                  +{uploadedFiles.length - 3} more files ready
                </span>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold text-gray-600">
              Server Upload Progress:
            </h4>
            {uploadProgress.map((progress, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {progress.status === "uploading" && (
                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                )}
                {progress.status === "completed" && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {progress.status === "error" && (
                  <AlertCircle className="w-3 h-3 text-red-500" />
                )}
                <span className="truncate">{progress.fileName}</span>
                <span
                  className={`ml-auto ${
                    progress.status === "uploading"
                      ? "text-blue-600"
                      : progress.status === "completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {progress.status === "uploading"
                    ? "Uploading..."
                    : progress.status === "completed"
                    ? "Uploaded"
                    : "Failed"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 overflow-auto">
        <FileUpload
          onFilesUpload={handleFilesUpload}
          onFileRemove={handleFileRemove}
          uploadedFiles={uploadedFiles}
        />
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Start Chat Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            Start AI Analysis Chat
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isInputDisabled}
              className={`w-full px-4 py-4 pr-12 border rounded-xl resize-none outline-none transition-all text-sm ${
                isInputDisabled
                  ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              }`}
              rows="3"
              placeholder={
                isInputDisabled
                  ? isProcessing
                    ? "Uploading to server..."
                    : "Select a chat first..."
                  : uploadedFiles.length === 0
                  ? "Upload documents first, then ask your question..."
                  : "Ask your first question about the documents...\n\nExample: Summarize the key points from these documents"
              }
            />
            <button
              onClick={handleStartChat}
              disabled={isChatDisabled}
              className={`absolute bottom-3 right-3 p-2.5 rounded-lg transition-all ${
                isChatDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <button
            onClick={handleStartChat}
            disabled={isChatDisabled}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
              isChatDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading to Server...
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Upload & Start AI Chat
              </>
            )}
          </button>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              {isInputDisabled ? (
                isProcessing ? (
                  <>Uploading files to server...</>
                ) : (
                  <>Select a chat to enable AI analysis</>
                )
              ) : uploadedFiles.length === 0 ? (
                <>Upload documents first</>
              ) : (
                <>Press Shift + Enter for new line</>
              )}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">
                Enter
              </kbd>
              to upload & start
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">or</span>
          </div>
        </div>

        {/* Visualize Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Document Visualization
          </label>
          <button
            onClick={handleVisualize}
            disabled={isVisualizeDisabled}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
              isVisualizeDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading to Server...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                Upload & View Documents
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center">
            Upload to server and view documents in original format
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptArea;
