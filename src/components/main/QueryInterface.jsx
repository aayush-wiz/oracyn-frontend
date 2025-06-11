import { useState, useEffect } from "react";
import {
  Send,
  FileText,
  Sparkles,
  ArrowLeft,
  Lightbulb,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { fileUtils } from "../../utils/helper.js";

const QueryInterface = ({
  file,
  suggestions = [],
  onQuery,
  isProcessing = false,
  initialQuery = "",
  onBack,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onQuery(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSelectedSuggestions([suggestion]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const isQueryValid = query.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ask Your Question
        </h2>
        <p className="text-gray-600">
          What would you like to know about your document?
        </p>
      </div>

      {/* Document Info */}
      {file && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{file.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  {fileUtils.getTypeInfo(file.type)?.name || "Document"}
                </span>
                {file.size && (
                  <>
                    <span>•</span>
                    <span>{fileUtils.formatSize(file.size)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Area */}
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about this document... (e.g., 'What are the key findings?' or 'Summarize the main points')"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            disabled={isProcessing}
          />

          {/* Character count */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {query.length} / 1000
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Press{" "}
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                Cmd+Enter
              </kbd>{" "}
              to submit
            </div>
            <button
              type="submit"
              disabled={!isQueryValid || isProcessing}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="font-medium">Analyze Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Smart Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Smart Suggestions
            </h3>
            <span className="text-sm text-gray-500">Click to use</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.slice(0, 6).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isProcessing}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group disabled:opacity-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                      {suggestion}
                    </p>
                  </div>
                  <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-blue-500 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Query Examples */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Example Questions:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "What are the main findings in this document?",
            "Can you summarize the key points?",
            "What numbers or statistics are mentioned?",
            "Are there any important dates or deadlines?",
            "What recommendations are made?",
            "What are the main conclusions?",
          ].map((example, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-sm text-gray-600"
            >
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>{example}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryInterface;
