import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  File,
  FileSpreadsheet,
  Presentation,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const FileUpload = ({ onFilesUpload, onFileRemove, uploadedFiles }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  const fileInputRef = useRef();

  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  // Fixed file type info with exact MIME type matching
  const fileTypeInfo = {
    "application/pdf": {
      icon: FileText,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    "text/plain": {
      icon: FileText,
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
    "application/msword": {
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    "text/csv": {
      icon: FileSpreadsheet,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    "application/vnd.ms-excel": {
      icon: FileSpreadsheet,
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      icon: FileSpreadsheet,
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    "application/vnd.ms-powerpoint": {
      icon: Presentation,
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      {
        icon: Presentation,
        color: "text-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
      },
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  const processFiles = (files) => {
    const errors = [];
    const validFiles = files.filter((file) => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type (${file.type})`);
        return false;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(
          `${file.name}: File too large (${formatFileSize(
            file.size
          )}). Maximum size is 10MB.`
        );
        return false;
      }

      // Check for duplicates
      if (
        uploadedFiles &&
        uploadedFiles.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        )
      ) {
        errors.push(`${file.name}: File already uploaded`);
        return false;
      }

      return true;
    });

    setUploadErrors(errors);

    if (validFiles.length > 0 && onFilesUpload) {
      onFilesUpload(validFiles);
    }

    // Clear errors after 5 seconds
    if (errors.length > 0) {
      setTimeout(() => setUploadErrors([]), 5000);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (indexToRemove) => {
    if (onFileRemove) {
      onFileRemove(indexToRemove);
    }
  };

  const clearAllFiles = () => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      // Remove all files by calling onFileRemove for each file index in reverse order
      for (let i = uploadedFiles.length - 1; i >= 0; i--) {
        onFileRemove(i);
      }
    }
    setUploadErrors([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file) => {
    const typeInfo = fileTypeInfo[file.type] || {
      icon: File,
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
    };
    return typeInfo;
  };

  const getFileExtension = (filename) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  return (
    <div className="space-y-6">
      {/* Error Messages */}
      {uploadErrors.length > 0 && (
        <div className="space-y-2">
          {uploadErrors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ))}
        </div>
      )}

      {/* File Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50 scale-[1.02]"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.doc,.docx,.csv,.xls,.xlsx,.ppt,.pptx"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isDragging ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <Upload
              className={`w-8 h-8 transition-colors ${
                isDragging ? "text-blue-600" : "text-gray-600"
              }`}
            />
          </div>

          {/* Upload Text */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragging ? "Drop files here" : "Upload Documents"}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {isDragging
                ? "Release to upload your files"
                : "Drag and drop files here, or click to browse"}
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: 10MB per file
            </p>
          </div>

          {/* Supported File Types */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { ext: "PDF", color: "bg-red-100 text-red-700" },
              { ext: "DOCX", color: "bg-blue-100 text-blue-700" },
              { ext: "XLSX", color: "bg-green-100 text-green-700" },
              { ext: "PPTX", color: "bg-orange-100 text-orange-700" },
              { ext: "CSV", color: "bg-emerald-100 text-emerald-700" },
              { ext: "TXT", color: "bg-gray-100 text-gray-700" },
            ].map((type) => (
              <span
                key={type.ext}
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${type.color}`}
              >
                {type.ext}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h4 className="text-sm font-semibold text-gray-900">
                Uploaded Files ({uploadedFiles.length})
              </h4>
            </div>
            <button
              onClick={clearAllFiles}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Files Grid */}
          <div className="grid gap-3 max-h-60 overflow-y-auto pr-2">
            {uploadedFiles.map((file, index) => {
              const fileInfo = getFileIcon(file);
              const IconComponent = fileInfo.icon;

              return (
                <div
                  key={`${file.name}-${index}`}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-sm ${fileInfo.bg} ${fileInfo.border}`}
                >
                  {/* File Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${fileInfo.bg.replace(
                      "50",
                      "100"
                    )}`}
                  >
                    <IconComponent className={`w-5 h-5 ${fileInfo.color}`} />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <span
                        className={`px-1.5 py-0.5 text-xs font-medium rounded ${fileInfo.color
                          .replace("text-", "bg-")
                          .replace("500", "100")} ${fileInfo.color}`}
                      >
                        {getFileExtension(file.name)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        Ready to visualize
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
                    title="Remove file"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload Summary */}
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""}{" "}
                ready for visualization
              </span>
            </div>
            <span className="text-xs text-green-600">
              Total:{" "}
              {formatFileSize(
                uploadedFiles.reduce((sum, file) => sum + file.size, 0)
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
