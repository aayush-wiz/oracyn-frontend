import React, { useState, useRef } from "react";
import { UploadIcon } from "../ui/Icons";

const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Upload Document</h2>
        <p className="text-gray-400 mb-6">
          Upload a document to start analyzing with AI
        </p>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragOver
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">Drag and drop your file here</p>
          <p className="text-gray-400 text-sm mb-4">or click to browse</p>
          <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
          />
        </div>

        <p className="text-gray-500 text-xs mt-4">
          Supported: PDF, DOC, DOCX, TXT, CSV, XLS, XLSX
        </p>
      </div>
    </div>
  );
};

export default FileUploadModal;
