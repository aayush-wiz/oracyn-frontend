import { useState, useRef } from "react";

const FileUpload = ({ onFilesUpload, onFileRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef();

  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
    "application/vnd.ms-excel", // .xls files
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx files
    "application/vnd.ms-powerpoint", // .ppt files
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx files
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
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
  };

  const processFiles = (files) => {
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(
          `File type ${file.type} is not supported. Please upload PDF, Word, TXT, excel, CSV or powerpoint files.`
        );
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(
          `File ${file.name} is too large. Please upload files smaller than 10MB.`
        );
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      if (onFilesUpload) {
        onFilesUpload(validFiles);
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (indexToRemove) => {
    const fileToRemove = uploadedFiles[indexToRemove];
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    // Notify parent component about file removal
    if (onFileRemove) {
      onFileRemove(fileToRemove, indexToRemove);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      {/* File Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`bg-amber-50 rounded-lg border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer ${
          isDragging
            ? "border-black bg-amber-100"
            : "border-gray-400 hover:border-black hover:bg-amber-100"
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

        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isDragging
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">
              PDF, Word, TXT, CSV, Excel files up to 10MB
            </p>
          </div>
        </div>

        {/* Supported file types indicator */}
        <div className="mt-4 flex justify-center space-x-4">
          {["PDF", "DOC", "TXT", "CSV", "XLS"].map((type) => (
            <span
              key={type}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          {/* Scrollable container for files */}
          <div className="max-h-50 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Remove file"
                >
                  <svg
                    className="w-4 h-4 text-gray-500 hover:text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
