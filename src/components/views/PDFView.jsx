import { useState } from "react";

const PDFView = ({ fileData }) => {
  const [activeTab, setActiveTab] = useState("visual");

  if (!fileData || fileData.data.type !== "pdf") {
    return null;
  }

  const renderVisual = () => {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                PDF Viewer
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {fileData.data.renderedPages?.length
                  ? `Showing ${fileData.data.renderedPages.length} of ${fileData.data.numPages} pages`
                  : "Visual preview not available"}
              </p>
            </div>
          </div>

          {/* PDF Pages Container */}
          <div className="flex-1 overflow-auto p-4">
            {fileData.data.renderedPages &&
            fileData.data.renderedPages.length > 0 ? (
              <div className="flex flex-col items-center space-y-6 w-full min-h-full">
                {fileData.data.renderedPages.map((page, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-full"
                  >
                    {page.error ? (
                      <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-sm font-medium text-red-800 mb-1">
                            Page {page.pageNumber} Error
                          </h4>
                          <p className="text-xs text-red-600">{page.error}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-full">
                        <div className="mb-2 text-sm font-medium text-gray-600">
                          Page {page.pageNumber}
                        </div>
                        {/* Simple responsive PDF page display */}
                        <div className="w-full flex justify-center">
                          <div className="border border-gray-300 rounded-lg shadow-md bg-white max-w-full">
                            <img
                              src={page.imageData}
                              alt={`Page ${page.pageNumber}`}
                              className="block w-full h-auto max-w-full"
                              style={{
                                maxWidth: '100%',
                                height: 'auto',
                                display: 'block',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              renderErrorState()
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderErrorState = () => (
    <div className="flex-1 overflow-auto p-4">
      {fileData.data.error ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Processing Error
          </h4>
          <p className="text-sm text-gray-600">{fileData.data.error}</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
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
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Visual Content
          </h4>
          <p className="text-sm text-gray-600">
            Unable to render PDF pages for visual display.
          </p>
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div className="p-6 h-full overflow-auto">
      <div className="space-y-6 max-w-4xl">
        {/* Processing Note (if limited pages) */}
        {fileData.data.processingNote && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-amber-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-amber-800 text-sm font-medium">
                Processing Note: {fileData.data.processingNote}
              </span>
            </div>
          </div>
        )}

        {/* Document Summary Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Document Overview
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">File Name:</span>
                <p className="text-gray-900 mt-1 break-words">
                  {fileData.name}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">File Size:</span>
                <p className="text-gray-900 mt-1">
                  {(fileData.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Pages:</span>
                <p className="text-gray-900 mt-1">
                  {fileData.data.numPages || "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Text Content:</span>
                <p className="text-gray-900 mt-1">
                  {fileData.data.textLength
                    ? `${fileData.data.textLength.toLocaleString()} characters`
                    : "No text extracted"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Estimated Words:
                </span>
                <p className="text-gray-900 mt-1">
                  {fileData.data.wordCount
                    ? fileData.data.wordCount.toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Processing Status:
                </span>
                <p
                  className={`mt-1 ${
                    fileData.data.error ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {fileData.data.error
                    ? "Error occurred"
                    : "Successfully processed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Document Metadata */}
        {fileData.data.metadata && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Document Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fileData.data.metadata).map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-600 capitalize">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </span>
                  <p className="text-gray-900 mt-1 break-words">
                    {value || "Not specified"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Analysis */}
        {fileData.data.pages && fileData.data.pages.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Page Analysis
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
                <span>Page</span>
                <span>Characters</span>
                <span>Est. Words</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {fileData.data.pages.map((page, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-50"
                  >
                    <span className="text-gray-900 font-medium">
                      Page {index + 1}
                    </span>
                    <span className="text-gray-600">
                      {page.textLength?.toLocaleString() || 0}
                    </span>
                    <span className="text-gray-600">
                      {Math.round((page.textLength || 0) / 5) || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="p-6 h-full">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">
            Extracted Text Content
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {fileData.data.textLength
              ? `${fileData.data.textLength.toLocaleString()} characters extracted`
              : "No text content available"}
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {fileData.data.fullText ? (
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
              {fileData.data.fullText}
            </pre>
          ) : fileData.data.error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Processing Error
              </h4>
              <p className="text-sm text-gray-600">{fileData.data.error}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Text Content
              </h4>
              <p className="text-sm text-gray-600">
                This PDF may contain only images or the text extraction failed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStructure = () => (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Document Structure
        </h3>

        {/* Content Distribution */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">
            Content Distribution
          </h4>
          <div className="space-y-2">
            {fileData.data.pages &&
              fileData.data.pages.map((page, index) => {
                const maxLength = Math.max(
                  ...fileData.data.pages.map((p) => p.textLength || 0)
                );
                const percentage =
                  maxLength > 0
                    ? ((page.textLength || 0) / maxLength) * 100
                    : 0;

                return (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 w-16">
                      Page {index + 1}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-20">
                      {page.textLength || 0} chars
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Document Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">
              {fileData.data.numPages || 0}
            </div>
            <div className="text-sm text-gray-600">Pages</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {fileData.data.wordCount
                ? fileData.data.wordCount.toLocaleString()
                : 0}
            </div>
            <div className="text-sm text-gray-600">Est. Words</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {fileData.data.textLength
                ? fileData.data.textLength.toLocaleString()
                : 0}
            </div>
            <div className="text-sm text-gray-600">Characters</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {fileData.data.avgWordsPerPage || 0}
            </div>
            <div className="text-sm text-gray-600">Avg Words/Page</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex space-x-4">
          {[
            { key: "visual", label: "Visual PDF", icon: "👁️" },
            { key: "overview", label: "Overview", icon: "📄" },
            { key: "content", label: "Text Content", icon: "📝" },
            { key: "structure", label: "Structure", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-amber-400 text-white"
                  : "bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "visual" && renderVisual()}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "content" && renderContent()}
        {activeTab === "structure" && renderStructure()}
      </div>
    </div>
  );
};

export default PDFView;