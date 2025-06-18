// components/ui/FileUploadModal.jsx
import { useState, useRef } from "react";
import { FileText, Upload, X, CheckCircle } from "lucide-react";

const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);

      // Simulate upload delay
      setTimeout(() => {
        onUpload(file);
        setFile(null);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative overflow-hidden">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-6 left-6 w-12 h-12 border border-gray-400 rotate-45"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border border-gray-500 rotate-12"></div>
          <div className="absolute bottom-6 left-6 w-6 h-6 border border-gray-600"></div>
          <div className="absolute bottom-6 right-6 w-10 h-10 border border-gray-400 rotate-45"></div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-gray-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-gray-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-gray-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-gray-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 backdrop-blur-sm bg-black/20 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Upload Document
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Start analyzing your data with AI
            </p>
          </div>

          {!isUploading && (
            <button
              onClick={handleClose}
              className="group p-2 bg-gray-800/60 hover:bg-red-900/30 border border-gray-600/50 hover:border-red-700/50 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-gray-300 group-hover:text-red-300" />
            </button>
          )}
        </div>

        {/* Upload Area */}
        <div className="p-6 relative z-10">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-500 backdrop-blur-sm ${
              dragActive
                ? "border-indigo-500/80 bg-indigo-500/10 scale-105"
                : file
                ? "border-green-500/60 bg-green-500/10"
                : "border-gray-600/60 hover:border-gray-500/80 hover:bg-gray-800/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Geometric accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-current opacity-20"></div>
            <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-current opacity-20"></div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.pptx,.png,.jpg,.jpeg"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-indigo-600/20 border border-indigo-500/50 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="text-white font-medium">Processing Document</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Analyzing {file?.name}...
                  </p>
                </div>
              </div>
            ) : file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-600/20 border border-green-500/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-800/60 border border-gray-600/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium mb-2">
                    Drag and drop your document here
                  </p>
                  <p className="text-gray-400 text-sm mb-4">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative bg-transparent border-2 border-gray-600 text-white px-6 py-3 font-semibold overflow-hidden transition-all duration-500 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-indigo-600 transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                      Browse Files
                    </span>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                </div>
                <div className="pt-4 border-t border-gray-700/50">
                  <p className="text-gray-500 text-xs">
                    Supported formats: PDF, DOC, DOCX, TXT, CSV, XLSX, PPTX,
                    Images
                  </p>
                </div>
              </div>
            )}

            {/* Animated border effect */}
            {dragActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent transform -skew-x-12 animate-shimmer pointer-events-none rounded-xl"></div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t border-gray-700/50 backdrop-blur-sm bg-black/10 relative z-10">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="flex-1 px-6 py-3 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500/70 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="group flex-1 relative bg-transparent border-2 border-gray-600 text-white px-6 py-3 font-semibold overflow-hidden transition-all duration-500 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-indigo-600 transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-0 group-disabled:translate-x-0"></div>
            <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
              {isUploading ? "Processing..." : "Upload & Analyze"}
            </span>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>

        {/* Progress indicator for uploading */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FileUploadModal;
