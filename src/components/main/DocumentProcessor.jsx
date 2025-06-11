import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments.js";
import { useMessages } from "../../hooks/useMessages.js";
import FileUploader from "./FileUploader.jsx";
import QueryInterface from "./QueryInterface.jsx";
import ResultsDisplay from "./ResultsDisplay.jsx";
import SuggestionsEngine from "./SuggestionsEngine.jsx";
import DocumentPreview from "./DocumentPreview.jsx";
import {
  FileText,
  Brain,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { CHAT_STATES } from "../../utils/constants.js";
import { errorUtils } from "../../utils/errorHandler.js";

const DocumentProcessor = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState("upload");
  const [currentDocumentId, setCurrentDocumentId] = useState(documentId);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

  // Hooks
  const {
    createDocument,
    isCreatingDocument,
    uploadFile,
    isUploadingFile,
    useDocumentDetails,
    useDocumentFiles,
    createError,
    uploadError,
  } = useDocuments();

  // Document details and files (only if we have a documentId)
  const { data: documentDetails, isLoading: isLoadingDetails } =
    useDocumentDetails(currentDocumentId);

  const { data: documentFiles = [], isLoading: isLoadingFiles } =
    useDocumentFiles(currentDocumentId);

  // Messages for the current document
  const {
    messages,
    documents,
    chatState,
    sendMessage,
    submitQuery,
    generateSuggestions,
    isSendingMessage,
    isSubmittingQuery,
    sendError,
    queryError,
    parsedResponse,
  } = useMessages(currentDocumentId);

  // Handle existing document load
  useEffect(() => {
    if (documentId && documentDetails) {
      setCurrentDocumentId(documentId);

      // Determine step based on chat state and content
      if (
        documentDetails.chatState === CHAT_STATES.CHAT &&
        messages.length > 0
      ) {
        setCurrentStep("results");
      } else if (documentFiles.length > 0) {
        setCurrentStep("preview");
      } else {
        setCurrentStep("upload");
      }
    }
  }, [documentId, documentDetails, documentFiles, messages]);

  // Handle errors
  useEffect(() => {
    const latestError = createError || uploadError || sendError || queryError;
    if (latestError) {
      setError(errorUtils.getUserMessage(latestError));
    }
  }, [createError, uploadError, sendError, queryError]);

  // Create new document session
  const handleFileUpload = async (file) => {
    try {
      setError(null);

      // Create new document (chat) if we don't have one
      let docId = currentDocumentId;

      if (!docId) {
        const newDoc = await createDocument(`Analysis: ${file.name}`);
        docId = newDoc.id;
        setCurrentDocumentId(docId);
        navigate(`/analyze/${docId}`, { replace: true });
      }

      // Upload file to the document
      await uploadFile({ documentId: docId, file });

      setCurrentStep("preview");
    } catch (err) {
      setError(errorUtils.getUserMessage(err));
    }
  };

  // Handle query submission
  const handleQuery = async (queryText) => {
    try {
      setError(null);
      setQuery(queryText);

      if (!currentDocumentId) {
        throw new Error("No document selected");
      }

      await submitQuery(queryText);
      setCurrentStep("results");
    } catch (err) {
      setError(errorUtils.getUserMessage(err));
    }
  };

  // Handle new query from results page
  const handleNewQuery = (newQuery) => {
    setQuery(newQuery);
    setCurrentStep("query");
  };

  // Reset to start
  const handleReset = () => {
    setCurrentStep("upload");
    setCurrentDocumentId(null);
    setQuery("");
    setError(null);
    navigate("/analyze", { replace: true });
  };

  // Generate suggestions based on uploaded files
  const suggestions = generateSuggestions(documentFiles || documents);

  // Determine current step based on state
  const steps = [
    { id: "upload", name: "Upload", icon: FileText },
    { id: "preview", name: "Preview", icon: CheckCircle },
    { id: "query", name: "Query", icon: Brain },
    { id: "results", name: "Results", icon: Lightbulb },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const isProcessing =
    isCreatingDocument ||
    isUploadingFile ||
    isSendingMessage ||
    isSubmittingQuery;

  // Loading state
  if (documentId && (isLoadingDetails || isLoadingFiles)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading document...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Document Analysis
              </h1>
              <p className="text-sm text-gray-600">
                {documentFiles.length > 0
                  ? `${documentFiles.length} document${
                      documentFiles.length > 1 ? "s" : ""
                    } uploaded`
                  : "Upload and analyze your documents with AI"}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Start Over</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mt-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-px mx-4 ${
                      index < currentStepIndex ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-6 mt-4">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                {isCreatingDocument && "Creating document session..."}
                {isUploadingFile && "Uploading file..."}
                {isSubmittingQuery && "Processing query..."}
                {isSendingMessage && "Sending message..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {currentStep === "upload" && (
          <div className="max-w-4xl mx-auto p-6">
            <FileUploader
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {currentStep === "preview" && documentFiles.length > 0 && (
          <div className="flex-1 flex">
            <div className="flex-1 p-6">
              <DocumentPreview file={documentFiles[0]} />
            </div>
            <div className="w-80 border-l border-gray-200 p-6">
              <SuggestionsEngine
                suggestions={suggestions}
                onSuggestionClick={(suggestion) => {
                  setQuery(suggestion);
                  setCurrentStep("query");
                }}
                onContinue={() => setCurrentStep("query")}
              />
            </div>
          </div>
        )}

        {currentStep === "query" && (
          <div className="max-w-4xl mx-auto p-6">
            <QueryInterface
              file={documentFiles[0] || { name: "Document" }}
              suggestions={suggestions}
              onQuery={handleQuery}
              isProcessing={isProcessing}
              initialQuery={query}
            />
          </div>
        )}

        {currentStep === "results" && parsedResponse && (
          <div className="max-w-6xl mx-auto p-6">
            <ResultsDisplay
              query={query}
              results={parsedResponse}
              file={documentFiles[0] || { name: "Document" }}
              onNewQuery={handleNewQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentProcessor;
