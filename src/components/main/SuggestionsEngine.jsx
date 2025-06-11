import { useState } from "react";
import {
  Lightbulb,
  ArrowRight,
  Sparkles,
  FileText,
  BarChart3,
  Search,
  Clock,
  Target,
} from "lucide-react";

const SuggestionsEngine = ({
  suggestions = [],
  onSuggestionClick,
  onContinue,
  isProcessing = false,
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const getSuggestionIcon = (suggestion) => {
    const text = suggestion.toLowerCase();

    if (text.includes("summary") || text.includes("summarize")) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    if (
      text.includes("data") ||
      text.includes("chart") ||
      text.includes("number")
    ) {
      return <BarChart3 className="w-4 h-4 text-green-500" />;
    }
    if (
      text.includes("key") ||
      text.includes("important") ||
      text.includes("main")
    ) {
      return <Target className="w-4 h-4 text-purple-500" />;
    }
    if (
      text.includes("date") ||
      text.includes("time") ||
      text.includes("when")
    ) {
      return <Clock className="w-4 h-4 text-orange-500" />;
    }
    return <Search className="w-4 h-4 text-gray-500" />;
  };

  const getSuggestionCategory = (suggestion) => {
    const text = suggestion.toLowerCase();

    if (
      text.includes("summary") ||
      text.includes("summarize") ||
      text.includes("overview")
    ) {
      return "Summary";
    }
    if (
      text.includes("data") ||
      text.includes("number") ||
      text.includes("statistic") ||
      text.includes("calculate")
    ) {
      return "Data Analysis";
    }
    if (
      text.includes("key") ||
      text.includes("important") ||
      text.includes("insight")
    ) {
      return "Key Insights";
    }
    if (
      text.includes("extract") ||
      text.includes("find") ||
      text.includes("list")
    ) {
      return "Information Extraction";
    }
    return "General";
  };

  // Group suggestions by category
  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const category = getSuggestionCategory(suggestion);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(suggestion);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Smart Suggestions
          </h3>
          <p className="text-sm text-gray-600">
            AI-powered questions to get you started
          </p>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            Upload a document to see smart suggestions
          </p>
        </div>
      ) : (
        <>
          {/* Suggestions by category */}
          <div className="space-y-6">
            {Object.entries(groupedSuggestions).map(
              ([category, categorySuggestions]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {categorySuggestions.map((suggestion, index) => (
                      <button
                        key={`${category}-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={isProcessing}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 group disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedSuggestion === suggestion
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">
                              {getSuggestionIcon(suggestion)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                                {suggestion}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Custom query option */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Want something specific?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ask your own question about the document
                  </p>
                </div>
                {onContinue && (
                  <button
                    onClick={onContinue}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium border border-blue-200"
                  >
                    Write Custom Query
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          💡 Tips for better results:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Be specific about what information you're looking for</li>
          <li>• Ask about particular sections, dates, or data points</li>
          <li>
            • Try questions that start with "What", "How", "When", or "Why"
          </li>
          <li>• Reference specific terms that appear in your document</li>
        </ul>
      </div>
    </div>
  );
};

export default SuggestionsEngine;
