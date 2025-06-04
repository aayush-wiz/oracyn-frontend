import { useState, useMemo } from "react";

const DocView = ({ fileData }) => {
  const [activeTab, setActiveTab] = useState("content");
  const [searchTerm, setSearchTerm] = useState("");

  if (!fileData || fileData.data.type !== "document") {
    return null;
  }

  const data = fileData.data;

  // Filter content based on search term
  const filteredContent = useMemo(() => {
    if (!searchTerm.trim() || !data.content) return data.content;

    const searchRegex = new RegExp(searchTerm, "gi");
    return data.content.replace(searchRegex, `**${searchTerm}**`);
  }, [data.content, searchTerm]);

  // Filter paragraphs based on search term
  const filteredParagraphs = useMemo(() => {
    if (!searchTerm.trim() || !data.structure?.paragraphs)
      return data.structure.paragraphs;

    return data.structure.paragraphs.filter((para) =>
      para.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.structure?.paragraphs, searchTerm]);

  const renderContent = () => {
    // Special handling for DOC files with conversion recommendation
    if (data.conversionRecommended) {
      return (
        <div className="p-6 h-full flex flex-col">
          <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Document Conversion Recommended
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    DOC files have limited support in this application
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  DOC
                </span>
              </div>
            </div>

            {/* Conversion Recommendation Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-2xl mx-auto">
                {/* Main Icon */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-amber-600"
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Convert Your Document for Better Results
                  </h2>
                  <p className="text-gray-600">
                    DOC files have limited support. For the best experience,
                    please convert your document to one of the recommended
                    formats below.
                  </p>
                </div>

                {/* Conversion Options */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* DOCX Option */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                        <h3 className="text-lg font-semibold text-gray-900">
                          DOCX Format
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">
                          Recommended
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Modern Word format with excellent text extraction,
                      formatting preservation, and full feature support.
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
                        Perfect text extraction
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
                        Preserves formatting
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
                        Full analysis features
                      </div>
                    </div>
                  </div>

                  {/* PDF Option */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-red-300 transition-colors">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
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
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          PDF Format
                        </h3>
                        <p className="text-sm text-red-600 font-medium">
                          Alternative
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Universal format with excellent visual representation and
                      reliable text extraction.
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
                        Visual page preview
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
                        Reliable text extraction
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
                        Universal compatibility
                      </div>
                    </div>
                  </div>
                </div>

                {/* How to Convert */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    How to Convert
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Microsoft Word */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Using Microsoft Word
                      </h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        <li>1. Open your DOC file in Microsoft Word</li>
                        <li>
                          2. Click <strong>File</strong> →{" "}
                          <strong>Save As</strong>
                        </li>
                        <li>
                          3. Choose <strong>Word Document (.docx)</strong> or{" "}
                          <strong>PDF</strong>
                        </li>
                        <li>4. Save and upload the new file</li>
                      </ol>
                    </div>

                    {/* Online Converters */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Using Online Tools
                      </h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        <li>
                          1. Use Google Docs, LibreOffice, or online converters
                        </li>
                        <li>2. Upload your DOC file</li>
                        <li>3. Export as DOCX or PDF</li>
                        <li>4. Download and upload here</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-600 mb-4">
                    Once you've converted your document, simply upload it again
                    for the best analysis experience.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button className="px-6 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors font-medium">
                      Upload New File
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      Try Anyway
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Break content into page-like sections (existing code for DOCX files)
    const createPageSections = () => {
      if (!data.content) return [];

      const wordsPerPage = 500; // Approximately 500 words per "page"
      const words = data.content.split(/\s+/);
      const sections = [];

      for (let i = 0; i < words.length; i += wordsPerPage) {
        const pageWords = words.slice(i, i + wordsPerPage);
        const pageContent = pageWords.join(" ");

        // Try to break at natural paragraph boundaries near the end
        const lastParagraphBreak = pageContent.lastIndexOf("\n\n");
        const lastSentenceBreak = pageContent.lastIndexOf(". ");

        let finalContent = pageContent;
        if (lastParagraphBreak > pageContent.length * 0.8) {
          finalContent = pageContent.substring(0, lastParagraphBreak + 2);
        } else if (lastSentenceBreak > pageContent.length * 0.8) {
          finalContent = pageContent.substring(0, lastSentenceBreak + 2);
        }

        sections.push({
          pageNumber: Math.floor(i / wordsPerPage) + 1,
          content: finalContent.trim(),
          wordCount: finalContent.split(/\s+/).length,
        });
      }

      return sections;
    };

    const pageSections = createPageSections();

    return (
      <div className="p-6 h-full flex flex-col">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Document Content
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {data.statistics?.totalWords?.toLocaleString() || 0} words •{" "}
                  {pageSections.length} sections
                  {data.statistics?.estimatedReadingTime && (
                    <> • ~{data.statistics.estimatedReadingTime} min read</>
                  )}
                </p>
              </div>

              {/* File type and quality indicators */}
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    data.subType === "docx"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {data.subType?.toUpperCase() || "DOC"}
                </span>

                {/* Extraction Quality Indicator */}
                {data.extractionQuality && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      data.extractionQuality === "excellent"
                        ? "bg-green-100 text-green-800"
                        : data.extractionQuality === "good"
                        ? "bg-blue-100 text-blue-800"
                        : data.extractionQuality === "fair"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {data.extractionQuality}
                  </span>
                )}
              </div>
            </div>

            {/* Quality Warning */}
            {data.extractionQuality === "poor" && (
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
                      Text extraction quality is poor
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Consider converting this document to DOCX or PDF format
                      for better results
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search document content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
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

          {/* Document Content - Page-like sections */}
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
            ) : data.content && pageSections.length > 0 ? (
              <div className="flex flex-col items-center space-y-8 w-full min-h-full">
                {pageSections.map((section, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-full max-w-4xl"
                  >
                    {/* Section/Page Header */}
                    <div className="mb-3 text-sm font-medium text-gray-600">
                      Section {section.pageNumber} • {section.wordCount} words
                    </div>

                    {/* Page-like Container */}
                    <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm p-8 min-h-[600px]">
                      <div className="prose prose-sm max-w-none">
                        {/* Show HTML content if available and better than text */}
                        {data.htmlContent &&
                        data.extractionQuality !== "excellent" ? (
                          <div
                            className="formatted-content text-sm text-gray-800 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: section.content.replace(/\n/g, "<br/>"),
                            }}
                            style={{
                              fontFamily: 'Georgia, "Times New Roman", serif',
                              lineHeight: "1.8",
                              fontSize: "14px",
                            }}
                          />
                        ) : (
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
                        )}
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
                  Unable to extract text content from this document.
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

  const renderAnalysis = () => {
    const stats = data.statistics || {};
    const structure = data.structure || {};

    return (
      <div className="p-6 h-full overflow-auto">
        <div className="space-y-6 max-w-4xl">
          {/* Document Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Document Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {stats.totalWords?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalParagraphs || 0}
                </div>
                <div className="text-sm text-gray-600">Paragraphs</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalSentences || 0}
                </div>
                <div className="text-sm text-gray-600">Sentences</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.estimatedReadingTime || 0}
                </div>
                <div className="text-sm text-gray-600">Min Read</div>
              </div>
            </div>
          </div>

          {/* Readability Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Readability Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <div className="text-xl font-bold text-gray-800">
                  {stats.avgWordsPerSentence || 0}
                </div>
                <div className="text-sm text-gray-600">Avg Words/Sentence</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.avgWordsPerSentence > 20
                    ? "Complex"
                    : stats.avgWordsPerSentence > 15
                    ? "Moderate"
                    : "Simple"}
                </div>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <div className="text-xl font-bold text-gray-800">
                  {stats.avgSentencesPerParagraph || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Avg Sentences/Paragraph
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.avgSentencesPerParagraph > 8
                    ? "Dense"
                    : stats.avgSentencesPerParagraph > 4
                    ? "Balanced"
                    : "Concise"}
                </div>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <div className="text-xl font-bold text-gray-800">
                  {stats.uniqueWords || 0}
                </div>
                <div className="text-sm text-gray-600">Unique Words</div>
                <div className="text-xs text-gray-500 mt-1">
                  Vocabulary:{" "}
                  {stats.totalWords && stats.uniqueWords
                    ? Math.round((stats.uniqueWords / stats.totalWords) * 100)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Document Structure */}
          {structure.headings && structure.headings.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Document Structure
              </h3>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 mb-3">
                  Potential Headings
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {structure.headings.map((heading, index) => (
                    <div
                      key={index}
                      className="text-sm border-l-4 border-amber-400 pl-3 py-1"
                    >
                      {heading}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWordCloud = () => {
    const wordAnalysis = data.wordAnalysis || {};
    const topWords = wordAnalysis.topWords || [];

    return (
      <div className="p-6 h-full overflow-auto">
        <div className="space-y-6 max-w-4xl">
          {/* Most Frequent Words */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Word Frequency Analysis
            </h3>

            {topWords.length > 0 ? (
              <div className="space-y-6">
                {/* Top 10 Words Bar Chart */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">
                    Most Frequent Words
                  </h4>
                  <div className="space-y-2">
                    {topWords.slice(0, 10).map((item, index) => {
                      const maxCount = topWords[0]?.count || 1;
                      const percentage = (item.count / maxCount) * 100;

                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="text-sm font-medium text-gray-600 w-20">
                            {item.word}
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-amber-400 h-4 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-500 w-12">
                            {item.count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Word Cloud Style Display */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Word Cloud</h4>
                  <div className="bg-gray-50 rounded-lg p-6 min-h-64 flex flex-wrap items-center justify-center gap-2">
                    {topWords.slice(0, 30).map((item, index) => {
                      const fontSize = Math.max(
                        12,
                        Math.min(32, (item.count / topWords[0].count) * 24 + 12)
                      );
                      const opacity = Math.max(
                        0.6,
                        item.count / topWords[0].count
                      );

                      return (
                        <span
                          key={index}
                          className="text-amber-600 font-medium hover:text-amber-800 transition-colors cursor-default"
                          style={{
                            fontSize: `${fontSize}px`,
                            opacity: opacity,
                          }}
                          title={`${item.word}: ${item.count} occurrences`}
                        >
                          {item.word}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Word Length Distribution */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">
                    Word Length Distribution
                  </h4>
                  <div className="space-y-2">
                    {[...Array(10)].map((_, lengthIndex) => {
                      const length = lengthIndex + 1;
                      const wordsOfLength = topWords.filter(
                        (w) => w.word.length === length
                      ).length;
                      const maxLength = Math.max(
                        ...[...Array(10)].map(
                          (_, i) =>
                            topWords.filter((w) => w.word.length === i + 1)
                              .length
                        )
                      );
                      const percentage =
                        maxLength > 0 ? (wordsOfLength / maxLength) * 100 : 0;

                      if (wordsOfLength === 0) return null;

                      return (
                        <div
                          key={length}
                          className="flex items-center space-x-3"
                        >
                          <div className="text-sm font-medium text-gray-600 w-16">
                            {length} letters
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-400 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-500 w-8">
                            {wordsOfLength}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Word Analysis
                </h4>
                <p className="text-sm text-gray-600">
                  Unable to analyze word frequency from this document.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStructure = () => {
    const structure = data.structure || {};
    const stats = data.statistics || {};

    return (
      <div className="p-6 h-full overflow-auto">
        <div className="space-y-6 max-w-4xl">
          {/* Document Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Document Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">File Name:</span>
                  <p className="text-gray-900 mt-1 break-words">
                    {data.metadata?.fileName || fileData.name}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">File Size:</span>
                  <p className="text-gray-900 mt-1">
                    {(fileData.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Document Type:
                  </span>
                  <p className="text-gray-900 mt-1">
                    {data.subType?.toUpperCase() || "Document"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">
                    Character Count:
                  </span>
                  <p className="text-gray-900 mt-1">
                    {stats.totalCharacters?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Processing Status:
                  </span>
                  <p
                    className={`mt-1 ${
                      data.error ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {data.error ? "Error occurred" : "Successfully processed"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Processing Note:
                  </span>
                  <p className="text-gray-900 mt-1 text-sm">
                    {data.metadata?.processingNote || "No additional notes"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Content Breakdown
            </h3>
            <div className="space-y-4">
              {/* Paragraphs Preview */}
              {structure.paragraphs && structure.paragraphs.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">
                    Paragraphs ({structure.paragraphs.length} total)
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-4">
                    {(searchTerm
                      ? filteredParagraphs
                      : structure.paragraphs.slice(0, 10)
                    ).map((paragraph, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-700 border-b border-gray-50 pb-2 last:border-b-0"
                      >
                        <span className="text-xs text-gray-500 mr-2">
                          #{index + 1}
                        </span>
                        {paragraph.length > 200
                          ? `${paragraph.substring(0, 200)}...`
                          : paragraph}
                      </div>
                    ))}
                    {searchTerm && filteredParagraphs.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        No paragraphs match your search.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Processing Messages */}
              {data.processingMessages &&
                data.processingMessages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Processing Information
                    </h4>
                    <div className="space-y-2">
                      {data.processingMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded ${
                            msg.type === "warning"
                              ? "bg-yellow-50 text-yellow-800"
                              : msg.type === "error"
                              ? "bg-red-50 text-red-800"
                              : "bg-blue-50 text-blue-800"
                          }`}
                        >
                          <span className="font-medium capitalize">
                            {msg.type}:
                          </span>{" "}
                          {msg.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex space-x-4">
          {[
            { key: "content", label: "Document Content", icon: "📄" },
            { key: "analysis", label: "Text Analysis", icon: "📊" },
            { key: "wordcloud", label: "Word Frequency", icon: "☁️" },
            { key: "structure", label: "Structure", icon: "🗂️" },
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
        {activeTab === "content" && renderContent()}
        {activeTab === "analysis" && renderAnalysis()}
        {activeTab === "wordcloud" && renderWordCloud()}
        {activeTab === "structure" && renderStructure()}
      </div>
    </div>
  );
};

export default DocView;
