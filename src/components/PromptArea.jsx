import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";

const PromptArea = ({ selectedQuery }) => {
  const [prompt, setPrompt] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Update prompt when selectedQuery changes
  useEffect(() => {
    if (selectedQuery) {
      setPrompt(selectedQuery);
    }
  }, [selectedQuery]);

  const handleSubmit = () => {
    if (prompt.trim() || uploadedFiles.length > 0) {
      console.log("Submitting:", { prompt, files: uploadedFiles });
      // Add your submit logic here
      setPrompt("");
      setUploadedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleFilesUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Document Analyzer
        </h2>
        <p className="text-sm text-gray-600">
          Ask questions about your documents
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Documents
          </label>
          <FileUpload onFilesUpload={handleFilesUpload} />

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Uploaded Files ({uploadedFiles.length})
              </p>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
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
          )}
        </div>

        {/* Prompt Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Question
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your documents..."
              className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              Ctrl + Enter to submit
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() && uploadedFiles.length === 0}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Analyze Documents
        </button>

        {/* Quick Actions */}
        <div className="mt-6">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
            Quick Actions
          </p>
          <div className="space-y-2">
            {[
              "Summarize the main points",
              "Extract key information",
              "Find specific details",
              "Compare documents",
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => setPrompt(action)}
                className="w-full text-left p-3 text-sm text-gray-700 hover:bg-white hover:border-gray-300 border border-transparent rounded-lg transition-all"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptArea;
 