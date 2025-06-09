import { useState, useRef, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth.js";
import {
  Send,
  User,
  Bot,
  FileText,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  FileSpreadsheet,
  Presentation,
  File,
} from "lucide-react";

const ChatInterface = ({
//   selectedChatId,
  initialQuery,
  uploadedFiles = [],
  onGoBack,
}) => {
//   const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize chat with the first query
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      // Add user's initial query
      const userMessage = {
        id: Date.now(),
        sender: "USER",
        content: initialQuery,
        type: "QUERY",
        createdAt: new Date().toISOString(),
      };

      // Simulate AI response
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ASSISTANT",
        content: `I've analyzed your query "${initialQuery}" along with the ${
          uploadedFiles.length
        } document${
          uploadedFiles.length > 1 ? "s" : ""
        } you uploaded. Here's what I found:

**Document Summary:**
${uploadedFiles.map((file) => `• ${file.name} (${file.type})`).join("\n")}

**Analysis Results:**
Based on the content of your documents, I can provide insights, summaries, and answer specific questions about the information contained within them. The documents have been processed and are ready for detailed analysis.

**Key Findings:**
1. Successfully processed ${uploadedFiles.length} document${
          uploadedFiles.length > 1 ? "s" : ""
        }
2. Content is now available for question-answering
3. You can ask follow-up questions about specific sections or request detailed summaries

How would you like me to help you further analyze these documents?`,
        type: "RESPONSE",
        createdAt: new Date(Date.now() + 2000).toISOString(),
      };

      setMessages([userMessage]);

      // Simulate typing delay for AI response
      setTimeout(() => {
        setMessages((prev) => [...prev, aiResponse]);
      }, 1500);
    }
  }, [initialQuery, uploadedFiles, messages.length]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentMessage]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: "USER",
      content: currentMessage.trim(),
      type: "REGULAR",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ASSISTANT",
        content: generateMockResponse(userMessage.content),
        type: "RESPONSE",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateMockResponse = (query) => {
    const responses = [
      "Based on the documents you've uploaded, I can provide the following insights...",
      "Looking at your documents, here are the key points that relate to your question...",
      "From the analysis of your uploaded files, I found several relevant pieces of information...",
      "After reviewing the content in your documents, I can summarize the following...",
      "The documents contain valuable information about your query. Here's what I discovered...",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse}

**Document References:**
${uploadedFiles
  .slice(0, 2)
  .map((file) => `• Referenced from: ${file.name}`)
  .join("\n")}

**Detailed Analysis:**
Your question "${query}" relates to several sections in the uploaded documents. I've identified relevant passages and can provide specific citations if needed.

Would you like me to:
1. Provide more detailed information about any specific aspect?
2. Reference particular sections from your documents?
3. Compare information across multiple documents?`;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getFileIcon = (file) => {
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4 text-red-500" />;
    if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return <FileText className="w-4 h-4 text-blue-500" />;
    if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
    if (file.type === "text/csv")
      return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    if (
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
      return <Presentation className="w-4 h-4 text-orange-500" />;
    if (file.type === "text/plain")
      return <FileText className="w-4 h-4 text-gray-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onGoBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Back to upload"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Document Analysis Chat
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{uploadedFiles.length} documents loaded</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>

          {/* Document indicators */}
          <div className="flex items-center gap-2">
            {uploadedFiles.slice(0, 3).map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                title={file.name}
              >
                {getFileIcon(file)}
                <span className="max-w-16 truncate">{file.name}</span>
              </div>
            ))}
            {uploadedFiles.length > 3 && (
              <div className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{uploadedFiles.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === "USER" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ASSISTANT" && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div
              className={`max-w-2xl px-4 py-3 rounded-2xl ${
                message.sender === "USER"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div
                className={`text-xs mt-2 flex items-center gap-1 ${
                  message.sender === "USER" ? "text-blue-200" : "text-gray-500"
                }`}
              >
                <Clock className="w-3 h-3" />
                {formatTime(message.createdAt)}
              </div>
            </div>

            {message.sender === "USER" && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-2xl px-4 py-3 rounded-2xl bg-gray-100">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                <span className="text-gray-600">Analyzing documents...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask questions about your documents..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-h-32"
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className={`absolute bottom-2 right-2 p-2 rounded-xl transition-all ${
                !currentMessage.trim() || isLoading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Shift + Enter for new line</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            Documents ready for analysis
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
