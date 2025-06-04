import { useState } from "react";

const PPTXView = ({ fileData }) => {
  const [activeTab, setActiveTab] = useState("visual");
  const [selectedSlide, setSelectedSlide] = useState(0);

  const data = fileData.data;

  // Visual slide presentation mode
  const renderVisualPresentation = () => {
    const slides = data.visualSlides || [];

    if (slides.length === 0) {
      return renderConversionRecommendation();
    }

    const currentSlide = slides[selectedSlide];

    return (
      <div className="p-6 h-full flex flex-col">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Visual Presentation
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {slides.length} slides • Slide {selectedSlide + 1} of{" "}
                  {slides.length}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  PPTX
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

            {/* Slide Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedSlide(Math.max(0, selectedSlide - 1))}
                disabled={selectedSlide === 0}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <span className="text-sm text-gray-600">
                Slide {selectedSlide + 1}
              </span>

              <button
                onClick={() =>
                  setSelectedSlide(
                    Math.min(slides.length - 1, selectedSlide + 1)
                  )
                }
                disabled={selectedSlide === slides.length - 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Main Slide Display */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-5xl mx-auto">
              {/* Current Slide */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex flex-col items-center">
                  {/* Slide Image/Preview */}
                  <div className="w-full max-w-4xl mb-4">
                    {currentSlide.imageData ? (
                      <img
                        src={currentSlide.imageData}
                        alt={`Slide ${currentSlide.slideNumber}`}
                        className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                        style={{ maxHeight: "500px", objectFit: "contain" }}
                      />
                    ) : (
                      <div
                        className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg
                            className="w-16 h-16 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 14a1 1 0 001 1h12a1 1 0 001-1L17 4M9 9v6m6-6v6"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            Slide {currentSlide.slideNumber}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Visual content not available
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slide Text Content (if available) */}
                  {currentSlide.text && (
                    <div className="w-full max-w-4xl">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Slide Content:
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {currentSlide.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Slide Thumbnails Navigation */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  All Slides:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedSlide(index)}
                      className={`cursor-pointer rounded-lg border-2 transition-all ${
                        selectedSlide === index
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {slide.imageData ? (
                          <img
                            src={slide.imageData}
                            alt={`Slide ${slide.slideNumber}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <div className="text-center">
                              <svg
                                className="w-6 h-6 text-gray-400 mx-auto mb-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 14a1 1 0 001 1h12a1 1 0 001-1L17 4M9 9v6m6-6v6"
                                />
                              </svg>
                              <span className="text-xs text-gray-500">
                                {slide.slideNumber}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-center">
                        <span className="text-xs text-gray-600">
                          Slide {slide.slideNumber}
                        </span>
                        {slide.wordCount > 0 && (
                          <span className="text-xs text-gray-500 block">
                            {slide.wordCount} words
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Conversion recommendation screen (when no visual slides available)
  const renderConversionRecommendation = () => {
    if (!data.conversionRecommended) {
      return renderVisualPresentation();
    }

    return (
      <div className="p-6 h-full flex flex-col">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Visual Content Not Available
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Convert to PDF for better visual representation
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  data.subType === "ppt"
                    ? "bg-red-100 text-red-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {data.subType?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Conversion Recommendation Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 14a1 1 0 001 1h12a1 1 0 001-1L17 4M9 9v6m6-6v6"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Show Your Slides as They Were Designed
              </h2>

              <p className="text-gray-600 mb-8">
                To see your slides with their original formatting, images, and
                layout, convert your presentation to PDF format.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Quick Conversion Steps
                </h3>
                <div className="text-left">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        1
                      </span>
                      <p className="text-blue-800">
                        Open your presentation in PowerPoint or Google Slides
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        2
                      </span>
                      <p className="text-blue-800">
                        Go to File → Export → PDF or File → Download → PDF
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        3
                      </span>
                      <p className="text-blue-800">
                        Upload the PDF here to see your slides with perfect
                        formatting
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Upload PDF Version
                </button>

                {data.content && (
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    View Text Analysis
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Text analysis tab (extracted content)
  const renderAnalysis = () => (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Content Analysis
        </h3>

        {data.wordAnalysis?.topWords?.length > 0 ? (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Most Frequent Words
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {data.wordAnalysis.topWords.slice(0, 16).map((item, index) => (
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
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">
                  Vocabulary Diversity
                </h4>
                <div className="flex items-center">
                  <div className="flex-1 bg-purple-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          data.wordAnalysis.wordDiversity * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-purple-900">
                    {Math.round(data.wordAnalysis.wordDiversity * 100)}%
                  </span>
                </div>
                <p className="text-xs text-purple-700 mt-1">
                  Higher diversity indicates more varied vocabulary in
                  presentation
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

  // Statistics tab
  const renderStatistics = () => (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Presentation Statistics
        </h3>

        {data.statistics ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {data.statistics.confirmedSlides ||
                  data.statistics.estimatedSlides}
              </div>
              <div className="text-sm text-gray-600">Total Slides</div>
            </div>
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
                {data.statistics.estimatedPresentationTime}
              </div>
              <div className="text-sm text-gray-600">Minutes (Est.)</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {data.statistics.totalSentences?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Sentences</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No statistics available</p>
        )}
      </div>
    </div>
  );

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "visual":
        return renderVisualPresentation();
      case "analysis":
        return renderAnalysis();
      case "statistics":
        return renderStatistics();
      default:
        return renderVisualPresentation();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Tabs - show if we have visual slides or extracted content */}
      {(data.visualSlides?.length > 0 || data.content) && (
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="px-6">
            <nav className="-mb-px flex space-x-8">
              {[
                {
                  id: "visual",
                  label: "Visual Slides",
                  icon: "presentation",
                  show: data.visualSlides?.length > 0,
                },
                {
                  id: "analysis",
                  label: "Text Analysis",
                  icon: "search",
                  show: data.content,
                },
                {
                  id: "statistics",
                  label: "Statistics",
                  icon: "chart",
                  show: data.statistics,
                },
              ]
                .filter((tab) => tab.show)
                .map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-600"
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
      <div className="flex-1 overflow-hidden">
        {data.visualSlides?.length > 0 || data.content
          ? renderTabContent()
          : renderConversionRecommendation()}
      </div>
    </div>
  );
};

export default PPTXView;
