import { useState } from "react";
import {
  Brain,
  FileText,
  MessageSquare,
  Copy,
  Share2,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { fileUtils, dateUtils, domUtils } from "../../utils/helper.js";

const ResultsDisplay = ({ query, results, file, onNewQuery, onFeedback }) => {
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopyAnswer = async () => {
    const success = await domUtils.copyToClipboard(results.answer);
    if (success) {
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 2000);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    if (onFeedback) {
      onFeedback(type);
    }
  };

  const handleNewQuery = () => {
    if (onNewQuery) {
      onNewQuery("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Analysis Complete
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>{file?.name || "Document"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{dateUtils.formatDateTime(new Date())}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              <span>Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Query and Answer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Answer */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Question */}
            <div className="p-6 border-b border-gray-200 bg-blue-50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Your Question
                  </h3>
                  <p className="text-blue-800">{query}</p>
                </div>
              </div>
            </div>

            {/* Answer */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyAnswer}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy answer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copiedAnswer && (
                    <span className="text-sm text-green-600 font-medium">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              {/* Answer content */}
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {results.answer}
                </div>
              </div>

              {/* Confidence indicator */}
              {results.confidence && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Confidence Level
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(results.confidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results.confidence * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Was this answer helpful?
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFeedback("positive")}
                      className={`p-2 rounded-lg transition-colors ${
                        feedback === "positive"
                          ? "bg-green-100 text-green-600"
                          : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback("negative")}
                      className={`p-2 rounded-lg transition-colors ${
                        feedback === "negative"
                          ? "bg-red-100 text-red-600"
                          : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Document Info
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Name</span>
                <p className="font-medium text-gray-900">
                  {file?.name || "Unknown"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Type</span>
                <p className="font-medium text-gray-900">
                  {fileUtils.getTypeInfo(file?.type)?.name || "Document"}
                </p>
              </div>
              {file?.size && (
                <div>
                  <span className="text-sm text-gray-500">Size</span>
                  <p className="font-medium text-gray-900">
                    {fileUtils.formatSize(file.size)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Questions */}
          {results.relatedQuestions && results.relatedQuestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Related Questions
              </h3>
              <div className="space-y-3">
                {results.relatedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onNewQuery && onNewQuery(question)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 group-hover:text-blue-700">
                        {question}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleNewQuery}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask Another Question</span>
              </button>

              <button
                onClick={() => {
                  /* Handle share */
                }}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Results</span>
              </button>

              <button
                onClick={() =>
                  domUtils.downloadTextAsFile(
                    `Question: ${query}\n\nAnswer: ${results.answer}`,
                    `analysis-${Date.now()}.txt`
                  )
                }
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Export Results</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
