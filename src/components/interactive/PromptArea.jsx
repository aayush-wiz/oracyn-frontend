import { useState } from "react";
import FileUpload from "../file/FileUpload";

const PromptArea = ({ onVisualize }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [prompt, setPrompt] = useState("");

  const handleFilesUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    console.log("Files uploaded:", files);
    // Here you would typically send files to your backend
  };

  const handleFileRemove = (removedFile) => {
    // Remove the file from our state to keep it in sync
    setUploadedFiles((prev) => prev.filter((file) => file !== removedFile));
    console.log("File removed:", removedFile);
  };

  const handleVisualize = () => {
    if (uploadedFiles.length > 0) {
      console.log("Visualizing files:", uploadedFiles);
      if (onVisualize) {
        onVisualize(uploadedFiles);
      }
      // Here you would typically send the files to your backend for visualization
    }
  };

  const handleSubmitPrompt = (e) => {
    e.preventDefault();
    if (prompt.trim() && uploadedFiles.length > 0) {
      console.log("Submitting prompt:", prompt);
      console.log("With files:", uploadedFiles);
      // Here you would typically send the prompt and files to your backend for analysis
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && uploadedFiles.length > 0) {
      e.preventDefault();
      handleSubmitPrompt(e);
    }
  };

  const isInputDisabled = uploadedFiles.length === 0;
  const isSubmitDisabled = !prompt.trim() || uploadedFiles.length === 0;
  const isVisualizeDisabled = uploadedFiles.length === 0;

  return (
    <div className="w-1/2 h-screen flex flex-col bg-[#ffffe5]">
      {/* File Upload Status Section */}
      <div className="px-6 py-4 border-b border-gray-300">
        <h3 className="text-lg font-queensides-medium text-gray-800">
          File Upload Status
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {uploadedFiles.length === 0
            ? "Please upload at least one document to start analyzing"
            : `${uploadedFiles.length} file${
                uploadedFiles.length > 1 ? "s" : ""
              } uploaded and ready for analysis`}
        </p>
        {uploadedFiles.length > 0 && (
          <div className="mt-2">
            {/* Scrollable file badges container */}
            <div className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="flex flex-wrap gap-2 pr-2">
                {uploadedFiles.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full inline-block"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Upload Section */}
      <div className="px-6 py-4">
        <FileUpload
          onFilesUpload={handleFilesUpload}
          onFileRemove={handleFileRemove}
        />
      </div>

      {/* Spacer to push prompt to bottom */}
      <div className="flex-1"></div>

      {/* Prompt Section */}
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmitPrompt}>
          <div
            className={`rounded-2xl shadow-sm border p-4 transition-all duration-200 ${
              isInputDisabled
                ? "bg-gray-50 border-gray-200"
                : "bg-amber-50 border-gray-200"
            }`}
          >
            <div className="flex gap-3 items-end">
              {/* Prompt Input */}
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isInputDisabled}
                  className={`w-full px-4 py-3 border rounded-xl resize-none outline-none transition-all duration-200 font-queensides ${
                    isInputDisabled
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed placeholder-gray-400"
                      : "border-black bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent"
                  }`}
                  rows="3"
                  placeholder={
                    isInputDisabled
                      ? "Upload documents first to start asking questions..."
                      : "Enter your prompt to analyze the documents..."
                  }
                  style={{ minHeight: "60px", maxHeight: "120px" }}
                />
              </div>
              <div className="flex flex-col gap-3">
                {/* Visualize Button */}
                <button
                  onClick={handleVisualize}
                  disabled={isVisualizeDisabled}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isVisualizeDisabled
                      ? "bg-amber-100 cursor-not-allowed text-gray-500"
                      : "bg-amber-400 hover:bg-amber-500 text-white hover:scale-105 hover:shadow-md cursor-pointer"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 ml-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 ml-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                    />
                  </svg>
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isSubmitDisabled
                      ? "bg-amber-100 cursor-not-allowed text-gray-500"
                      : "bg-amber-400 hover:bg-amber-500 text-white hover:scale-105 hover:shadow-md cursor-pointer"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Helper Text */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <span
                className={isInputDisabled ? "text-gray-400" : "text-gray-500"}
              >
                {isInputDisabled
                  ? "Upload files to enable text input"
                  : "Press Shift + Enter for new line"}
              </span>
              <span
                className={isInputDisabled ? "text-gray-400" : "text-gray-500"}
              >
                {isInputDisabled ? "Files required" : "Enter to send"}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptArea;
