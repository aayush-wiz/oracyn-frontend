import { useState, useRef } from 'react';

const FileUpload = ({ onFilesUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv'
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
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please upload PDF, Word, TXT, or CSV files.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Please upload files smaller than 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesUpload(validFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
      className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
        isDragging 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.doc,.docx,.csv"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="space-y-3">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-900">
            {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, Word, TXT, CSV files up to 10MB
          </p>
        </div>
      </div>

      {/* Supported file types indicator */}
      <div className="mt-4 flex justify-center space-x-4">
        {['PDF', 'DOC', 'TXT', 'CSV'].map((type) => (
          <span
            key={type}
            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FileUpload; 