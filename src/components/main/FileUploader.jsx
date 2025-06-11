import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";
import { fileUtils } from "../../utils/helper.js";
import { FILE_UPLOAD, FILE_TYPE_INFO } from "../../utils/constants.js";
import { errorUtils } from "../../utils/errorHandler.js";

const FileUploader = ({ onFileUpload, isProcessing = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    setError(null);

    // Validate file
    const validation = fileUtils.validateFile(file);
    if (!validation.isValid) {
      const errorMessage = validation.errors.join(", ");
      setError(errorMessage);
      return;
    }

    setSelectedFile(file);
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    },
    [handleFileSelect]
  );

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setError(null);
      await onFileUpload(selectedFile);
      // Don't clear selectedFile here - let parent component handle the flow
    } catch (error) {
      setError(errorUtils.getUserMessage(error));
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get file type info
  const getFileTypeInfo = (file) => {
    return fileUtils.getTypeInfo(file.type);
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Document
        </h2>
        <p className="text-gray-600">
          Upload a document to start analyzing it with AI. We support various
          formats including PDF, Word, Excel, and more.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* File Upload Area */}
      <div className="mb-8">
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={FILE_UPLOAD.ALLOWED_EXTENSIONS.join(",")}
              onChange={handleFileInputChange}
            />

            <div className="space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-10 h-10 text-gray-400" />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your file here, or{" "}
                  <button
                    onClick={openFilePicker}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    browse
                  </button>
                </h3>
                <p className="text-sm text-gray-500">
                  Maximum file size:{" "}
                  {fileUtils.formatSize(FILE_UPLOAD.MAX_SIZE)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    getFileTypeInfo(selectedFile).bgColor
                  }`}
                >
                  <FileText
                    className={`w-6 h-6 ${getFileTypeInfo(selectedFile).color}`}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedFile.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{getFileTypeInfo(selectedFile).name}</span>
                    <span>•</span>
                    <span>{fileUtils.formatSize(selectedFile.size)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={clearSelection}
                disabled={isProcessing}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                What we can analyze:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {getFileTypeInfo(selectedFile).capabilities.map(
                  (capability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{capability}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isProcessing}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">
                  {isProcessing ? "Uploading..." : "Upload & Continue"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Supported Formats */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Supported File Formats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(FILE_TYPE_INFO)
            .slice(0, 8)
            .map(([type, info]) => (
              <div
                key={type}
                className="flex items-center space-x-3 p-3 bg-white rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center ${info.bgColor}`}
                >
                  <span className="text-sm">{info.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {info.name}
                  </p>
                  <p className="text-xs text-gray-500">{info.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          💡 Tips for best results:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure your document has clear, readable text</li>
          <li>• For PDFs, avoid password-protected files</li>
          <li>• Larger documents may take longer to process</li>
          <li>• You can ask specific questions about your document content</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;
