import { useState } from "react";
import {
  Brain,
  Upload,
  FileText,
  CheckCircle,
  Eye,
  Sparkles,
  Send,
  FileSpreadsheet,
  Presentation,
  File,
} from "lucide-react";
import FileUpload from "../file/FileUpload";

const PromptArea = ({ onVisualize }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    console.log("Files uploaded:", files);
    // Here you would typically send files to your backend
  };

  const handleFileRemove = (indexToRemove) => {
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    console.log("File removed at index:", indexToRemove);
  };

  const handleVisualize = async () => {
    if (uploadedFiles.length > 0) {
      setIsProcessing(true);
      console.log("Visualizing files:", uploadedFiles);
      if (onVisualize) {
        onVisualize(uploadedFiles);
      }
      // Simulate processing delay
      setTimeout(() => setIsProcessing(false), 1000);
      // Here you would typically send the files to your backend for visualization
    }
  };

  const handleSubmitPrompt = () => {
    if (prompt.trim() && uploadedFiles.length > 0) {
      console.log("Submitting prompt:", prompt);
      console.log("With files:", uploadedFiles);
      // Here you would typically send the prompt and files to your backend for analysis
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && uploadedFiles.length > 0) {
      e.preventDefault();
      handleSubmitPrompt();
    }
  };

  // Fixed icon function with exact MIME type matching
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

  const isInputDisabled = uploadedFiles.length === 0;
  const isSubmitDisabled = !prompt.trim() || uploadedFiles.length === 0;
  const isVisualizeDisabled = uploadedFiles.length === 0;

  return (
    <div className="w-full h-screen flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
            <p className="text-sm text-gray-600">
              Upload and visualize your documents
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Status */}
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
                {uploadedFiles.length} ready
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
                No documents uploaded
              </p>
              <p className="text-xs text-gray-500">
                Upload files to start visualizing
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
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
            {uploadedFiles.length > 3 && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-600 font-medium">
                  +{uploadedFiles.length - 3} more files uploaded
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* File Upload Section */}
      <div className="p-6 flex-1 overflow-auto">
        <FileUpload
          onFilesUpload={handleFilesUpload}
          onFileRemove={handleFileRemove}
          uploadedFiles={uploadedFiles}
        />
      </div>

      {/* Action Area */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-6">
        {/* Visualize Button */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Document Visualization
          </label>
          <button
            onClick={handleVisualize}
            disabled={isVisualizeDisabled || isProcessing}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
              isVisualizeDisabled || isProcessing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                Visualize Documents
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center">
            View your documents in their original format
          </p>
        </div>

        {/* AI Query Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI Query (for later analysis)
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
                  : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
              }`}
              rows="3"
              placeholder={
                isInputDisabled
                  ? "Upload documents first..."
                  : "Prepare your analysis query...\n\nExample: Summarize the key points"
              }
            />
            <button
              onClick={handleSubmitPrompt}
              disabled={isSubmitDisabled}
              className={`absolute bottom-3 right-3 p-2.5 rounded-lg transition-all ${
                isSubmitDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              {isInputDisabled ? (
                <>Upload files to enable AI analysis</>
              ) : (
                <>Press Shift + Enter for new line</>
              )}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">
                Enter
              </kbd>
              to analyze
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptArea;
