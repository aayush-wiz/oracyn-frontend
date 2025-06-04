import { useState } from "react";

const TextView = ({ fileData }) => {
  const [activeTab, setActiveTab] = useState("content");
  const [searchTerm, setSearchTerm] = useState("");
  const [forceShowContent, setForceShowContent] = useState(false);

  const data = fileData.data;

  // Filter content based on search term
  const filteredContent = searchTerm
    ? data.content?.toLowerCase().includes(searchTerm.toLowerCase())
      ? data.content
      : ""
    : data.content;

  const renderContent = () => {
    // Special handling for TXT files with improvement recommendation
    if (data.improvementRecommended && !forceShowContent) {
      return (
        <div className="p-6 h-full flex flex-col">
          <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Content Improvement Recommended
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This text file needs more content for meaningful analysis
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  TXT
                </span>
              </div>
            </div>

            {/* Improvement Recommendation Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-2xl mx-auto">
                {/* Main Icon */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Improve Your Text Content
                  </h2>
                  <p className="text-gray-600">
                    {data.improvementReason === "too_short" &&
                      "Your text file is too short for meaningful analysis. "}
                    {data.improvementReason === "insufficient_content" &&
                      "Your text file needs more detailed content. "}
                    {data.improvementReason === "poor_diversity" &&
                      "Your text content appears repetitive. "}
                    Add more content to unlock powerful text analysis features.
                  </p>
                </div>

                {/* Improvement Suggestions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Content Length */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Add More Content
                        </h3>
                        <p className="text-sm text-green-600 font-medium">
                          Recommended
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Aim for at least 500-1000 words for meaningful text
                      analysis and insights.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Word frequency analysis
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Reading time estimates
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Content structure analysis
                      </div>
                    </div>
                  </div>

                  {/* Content Quality */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-6 h-6 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Improve Diversity
                        </h3>
                        <p className="text-sm text-purple-600 font-medium">
                          Quality Enhancement
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Use varied vocabulary and sentence structures for richer
                      analysis results.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Word cloud generation
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Vocabulary analysis
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Sentiment insights
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Suggestions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Content Suggestions
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* What to Add */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        What to Add
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Detailed descriptions and explanations</li>
                        <li>• Multiple paragraphs with different topics</li>
                        <li>• Varied sentence lengths and structures</li>
                        <li>• Rich vocabulary and terminology</li>
                        <li>• Examples and supporting details</li>
                      </ul>
                    </div>

                    {/* Content Types */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Great Content Types
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Articles and essays</li>
                        <li>• Research documents</li>
                        <li>• Creative writing pieces</li>
                        <li>• Technical documentation</li>
                        <li>• Meeting notes or reports</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Current Stats */}
                {data.statistics && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Current Content Stats
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-yellow-600">Characters:</span>
                        <span className="ml-1 font-medium">
                          {data.statistics.totalCharacters || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-yellow-600">Words:</span>
                        <span className="ml-1 font-medium">
                          {data.statistics.totalWords || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-yellow-600">Lines:</span>
                        <span className="ml-1 font-medium">
                          {data.statistics.totalLines || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-yellow-600">Unique Words:</span>
                        <span className="ml-1 font-medium">
                          {data.statistics.uniqueWords || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-600 mb-4">
                    Add more content to your text file and upload it again for
                    comprehensive analysis.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        const fileInput =
                          document.querySelector('input[type="file"]');
                        if (fileInput) {
                          fileInput.value = "";
                          fileInput.click();
                        }
                      }}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Upload Improved File
                    </button>
                    <button
                      onClick={() => setForceShowContent(true)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Analyze Anyway
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Regular text content display with sections
    const createTextSections = () => {
      if (!data.content) return [];

      const wordsPerSection = 300;
      const words = data.content.split(/\s+/);
      const sections = [];

      for (let i = 0; i < words.length; i += wordsPerSection) {
        const sectionWords = words.slice(i, i + wordsPerSection);
        const sectionContent = sectionWords.join(" ");

        sections.push({
          sectionNumber: Math.floor(i / wordsPerSection) + 1,
          content: sectionContent.trim(),
          wordCount: sectionWords.length,
        });
      }

      return sections;
    };

    const textSections = createTextSections();

    return (
      <div className="p-6 h-full flex flex-col">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Text Content
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {data.statistics?.totalWords?.toLocaleString() || 0} words •{" "}
                  {textSections.length} sections
                  {data.statistics?.estimatedReadingTime && (
                    <> • ~{data.statistics.estimatedReadingTime} min read</>
                  )}
                </p>
              </div>

              {/* File type and quality indicators */}
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  TXT
                </span>

                {data.contentQuality && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      data.contentQuality === "excellent"
                        ? "bg-green-100 text-green-800"
                        : data.contentQuality === "good"
                        ? "bg-blue-100 text-blue-800"
                        : data.contentQuality === "fair"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {data.contentQuality}
                  </span>
                )}
              </div>
            </div>

            {/* Quality Warning */}
            {(data.contentQuality === "poor" ||
              data.contentQuality === "fair") && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Content quality could be improved
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Consider adding more diverse and detailed content for
                      better analysis
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search text content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Text Content - Section-based display */}
          <div className="flex-1 overflow-auto p-6">
            {data.error ? (
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
                <p className="text-sm text-gray-600">{data.error}</p>
              </div>
            ) : data.content && textSections.length > 0 ? (
              <div className="flex flex-col items-center space-y-6 w-full">
                {textSections.map((section, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-full max-w-4xl"
                  >
                    <div className="mb-3 text-sm font-medium text-gray-600">
                      Section {section.sectionNumber} • {section.wordCount}{" "}
                      words
                    </div>

                    <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm p-6 min-h-[400px]">
                      <div
                        className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed"
                        style={{
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          lineHeight: "1.8",
                          fontSize: "14px",
                        }}
                      >
                        {searchTerm
                          ? highlightSearchTerm(section.content, searchTerm)
                          : section.content}
                      </div>
                    </div>
                  </div>
                ))}
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
                  No Content Available
                </h4>
                <p className="text-sm text-gray-600">
                  Unable to display text content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to highlight search terms
  const highlightSearchTerm = (text, term) => {
    if (!term.trim()) return text;

    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Tab content for different views
  const renderTabContent = () => {
    switch (activeTab) {
      case "content":
        return renderContent();
      case "statistics":
        return renderStatistics();
      case "analysis":
        return renderAnalysis();
      default:
        return renderContent();
    }
  };

  const renderStatistics = () => (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Text Statistics
        </h3>

        {data.statistics ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.statistics.totalWords?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.statistics.meaningfulWords?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Meaningful Words</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.statistics.uniqueWords?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Unique Words</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {data.statistics.totalSentences?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Sentences</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {data.statistics.totalParagraphs?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Paragraphs</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {data.statistics.estimatedReadingTime}
              </div>
              <div className="text-sm text-gray-600">Minutes to Read</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No statistics available</p>
        )}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Word Analysis
        </h3>

        {data.wordAnalysis?.topWords?.length > 0 ? (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Most Frequent Words
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.wordAnalysis.topWords.slice(0, 20).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{item.word}</span>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
              ))}
            </div>

            {data.wordAnalysis.wordDiversity && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Vocabulary Diversity
                </h4>
                <div className="flex items-center">
                  <div className="flex-1 bg-blue-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          data.wordAnalysis.wordDiversity * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-blue-900">
                    {Math.round(data.wordAnalysis.wordDiversity * 100)}%
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Higher diversity indicates more varied vocabulary usage
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No word analysis available</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Tabs - only show if content is displayed (not in improvement mode) */}
      {(!data.improvementRecommended || forceShowContent) && (
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="px-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "content", label: "Content", icon: "document" },
                { id: "statistics", label: "Statistics", icon: "chart" },
                { id: "analysis", label: "Analysis", icon: "search" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">{renderTabContent()}</div>
    </div>
  );
};

export default TextView;
