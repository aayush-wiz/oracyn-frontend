import { useState, useRef, useEffect } from "react";
import { GripVertical, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";
import { useOutletContext } from "react-router-dom";
import PromptArea from "../interactive/PromptArea.jsx";
import DataVisualization from "./DataVisualization.jsx";
import ChatInterface from "../chat/ChatInterface.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";

const Dashboard = () => {
  const { token } = useAuth();
  const { selectedAnalysisId } = useOutletContext();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [filesToVisualize, setFilesToVisualize] = useState([]);
  const [chatState, setChatState] = useState("upload"); // "upload", "chat", "visualize"
  const [initialQuery, setInitialQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [leftWidth, setLeftWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingChatData, setIsLoadingChatData] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const dividerRef = useRef(null);

  // Load chat data from backend when selectedAnalysisId changes
  useEffect(() => {
    const loadChatData = async () => {
      if (selectedAnalysisId !== selectedChatId) {
        setSelectedChatId(selectedAnalysisId);
        setError(null);

        if (selectedAnalysisId && token) {
          setIsLoadingChatData(true);
          try {
            // Get chat messages and files from backend
            const [messagesResponse, filesResponse] = await Promise.all([
              authAPI.getChatMessages(token, selectedAnalysisId),
              authAPI.getChatFiles(token, selectedAnalysisId),
            ]);

            // Determine chat state based on backend data
            if (
              messagesResponse.messages &&
              messagesResponse.messages.length > 0
            ) {
              // Chat has messages - go to chat state
              setChatState("chat");
              setUploadedFiles(messagesResponse.documents || []);

              // Find initial query from messages
              const firstQuery = messagesResponse.messages.find(
                (msg) => msg.type === "QUERY"
              );
              setInitialQuery(firstQuery ? firstQuery.content : "");
            } else if (filesResponse && filesResponse.length > 0) {
              // Chat has files but no messages - go to visualize state
              setChatState("visualize");
              setFilesToVisualize(filesResponse);
              setUploadedFiles([]);
            } else {
              // New empty chat - go to upload state
              setChatState("upload");
              setInitialQuery("");
              setUploadedFiles([]);
              setFilesToVisualize([]);
            }
          } catch (err) {
            console.error("Error loading chat data from backend:", err);
            setError("Failed to load chat data from server");
            // Reset to upload state on error
            setChatState("upload");
            setInitialQuery("");
            setUploadedFiles([]);
            setFilesToVisualize([]);
          } finally {
            setIsLoadingChatData(false);
          }
        } else {
          // No chat selected, reset state
          setChatState("upload");
          setInitialQuery("");
          setUploadedFiles([]);
          setFilesToVisualize([]);
        }
      }
    };

    loadChatData();
  }, [selectedAnalysisId, selectedChatId, token]);

  // Handle file upload and visualization (backend integration)
  const handleVisualize = async (files) => {
    try {
      setError(null);
      setFilesToVisualize(files);
      setChatState("visualize");

      // Update chat state in backend
      if (selectedChatId && token) {
        await authAPI.updateChatState(token, selectedChatId, "VISUALIZE");
      }
    } catch (err) {
      console.error("Error handling visualization:", err);
      setError("Failed to update chat state on server");
    }
  };

  // Handle starting chat (files already uploaded to backend)
  const handleStartChat = async (query, files) => {
    try {
      setError(null);
      setInitialQuery(query);
      setUploadedFiles(files);
      setChatState("chat");

      // Submit initial query to backend and update chat state
      if (selectedChatId && token) {
        await Promise.all([
          authAPI.submitQuery(token, selectedChatId, query),
          authAPI.updateChatState(token, selectedChatId, "CHAT"),
        ]);
      }
    } catch (err) {
      console.error("Error starting chat:", err);
      setError("Failed to start chat with server");
    }
  };

  // Go back to upload mode (update backend state)
  const handleGoBackToUpload = async () => {
    try {
      setError(null);
      setChatState("upload");
      setInitialQuery("");

      // Update chat state in backend
      if (selectedChatId && token) {
        await authAPI.updateChatState(token, selectedChatId, "UPLOAD");
      }
    } catch (err) {
      console.error("Error updating chat state:", err);
      setError("Failed to update chat state on server");
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
      setLeftWidth(constrainedWidth);
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  // Show loading screen while fetching chat data from backend
  if (isLoadingChatData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600">
            Loading chat data from server...
          </span>
        </div>
      </div>
    );
  }

  // Show error if backend connection failed
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Server Connection Error
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Render welcome screen when no chat is selected
  if (!selectedChatId) {
    return <WelcomeScreen />;
  }

  // Render chat interface when in chat state (full screen)
  if (chatState === "chat") {
    return (
      <ChatInterface
        selectedChatId={selectedChatId}
        initialQuery={initialQuery}
        uploadedFiles={uploadedFiles}
        onGoBack={handleGoBackToUpload}
      />
    );
  }

  // Render split pane for upload/visualize states
  return (
    <div
      ref={containerRef}
      className="flex-1 flex h-screen overflow-auto bg-gray-50 relative"
    >
      <div style={{ width: `${leftWidth}%` }} className="flex-shrink-0 h-full">
        {chatState === "upload" ? (
          <PromptArea
            selectedChatId={selectedChatId}
            onVisualize={handleVisualize}
            onStartChat={handleStartChat}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center p-8">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Document Visualization Active
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Your documents are loaded from server and displayed in the
                viewer panel
              </p>
              <button
                onClick={handleGoBackToUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Upload
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        ref={dividerRef}
        onMouseDown={handleMouseDown}
        className={`relative w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-all duration-200 flex-shrink-0 group ${
          isDragging ? "bg-blue-500 shadow-lg" : ""
        }`}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
          <div
            className={`w-3 h-16 bg-gray-400 rounded-full flex items-center justify-center transition-all duration-200 group-hover:opacity-100 ${
              isDragging ? "opacity-100 bg-blue-500 shadow-md" : ""
            }`}
          >
            <GripVertical className="w-3 h-3 text-white" />
          </div>
        </div>
        {isDragging && (
          <div className="absolute inset-y-0 left-0 w-1 opacity-30 shadow-lg">
            <div className="absolute -left-2 -right-2 inset-y-0 bg-blue-200 opacity-30"></div>
          </div>
        )}
      </div>

      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="flex-shrink-0 h-full"
      >
        <DataVisualization
          files={filesToVisualize}
          selectedChatId={selectedChatId}
        />
      </div>

      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 bottom-0 w-0.5 shadow-lg"
            style={{ left: `${leftWidth}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
