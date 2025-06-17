// components/main/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../../../store/useStore";
import {
  Send,
  Bot,
  UserCircle,
  FileText,
  Plus,
  MessageSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import ChartSidebar from "./ChatComponents/ChartSidebar";
import FileUploadModal from "../../ui/FileUploadModal";


const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const {
    chats,
    createChat,
    updateChat,
    addDocument,
    addChart,
    incrementApiCalls,
    updateProcessingSpeed,
  } = useStore();

  const currentChat = chats.find((chat) => chat.id === id);

  // Handle initial navigation and chat creation
  useEffect(() => {
    if (!id && chats.length === 0) {
      // No chat ID and no chats exist - create first chat
      const newChatId = createChat();
      if (newChatId) {
        navigate(`/chat/${newChatId}`, { replace: true });
      }
    } else if (!id && chats.length > 0) {
      // No chat ID but chats exist - navigate to most recent
      navigate(`/chat/${chats[0].id}`, { replace: true });
    } else if (id && !currentChat) {
      // Invalid chat ID - navigate to most recent or create new
      if (chats.length > 0) {
        navigate(`/chat/${chats[0].id}`, { replace: true });
      } else {
        const newChatId = createChat();
        if (newChatId) {
          navigate(`/chat/${newChatId}`, { replace: true });
        }
      }
    }
  }, [id, chats, currentChat, createChat, navigate]);

  // Show file upload modal only for new chats without documents
  useEffect(() => {
    if (
      currentChat &&
      !currentChat.document &&
      currentChat.messages.length === 0
    ) {
      setShowFileUpload(true);
    }
  }, [currentChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  const handleNewChat = () => {
    const newChatId = createChat();
    if (newChatId) {
      navigate(`/chat/${newChatId}`);
      setShowFileUpload(true);
    } else {
      alert("Maximum chat sessions reached. Please close an existing chat.");
    }
  };

  const handleFileUpload = (file) => {
    if (currentChat && file) {
      // Add document to store
      addDocument({
        name: file.name,
        size: file.size,
        chatId: currentChat.id,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      });

      // Update chat with document info
      updateChat(currentChat.id, {
        document: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
        documentsUsed: 1,
        title: `Chat: ${file.name}`, // Update chat title with document name
      });

      // Add system message about document upload
      const systemMessage = {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `I've successfully loaded "${file.name}". What would you like to know about this document?`,
        timestamp: new Date().toLocaleTimeString(),
      };

      updateChat(currentChat.id, {
        messages: [...(currentChat.messages || []), systemMessage],
      });

      setShowFileUpload(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Update chat with new message
    updateChat(currentChat.id, {
      messages: [...(currentChat.messages || []), userMessage],
    });

    setMessage("");
    setIsTyping(true);

    // Simulate API call
    incrementApiCalls();
    const startTime = Date.now();

    // Simulate assistant response with delay
    setTimeout(() => {
      const processingTime = (Date.now() - startTime) / 1000;
      updateProcessingSpeed(processingTime);

      const assistantMessage = {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: generateMockResponse(message, currentChat.document),
        timestamp: new Date().toLocaleTimeString(),
      };

      updateChat(currentChat.id, {
        messages: [...currentChat.messages, userMessage, assistantMessage],
      });

      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChartTrigger = (chartConfig) => {
    const newChart = {
      ...chartConfig,
      chatId: currentChat.id,
      createdFrom: currentChat.title,
    };
    addChart(newChart);
  };

  // Generate mock responses based on query
  const generateMockResponse = (query, document) => {
    const lowerQuery = query.toLowerCase();

    if (!document) {
      return "Please upload a document first so I can help you analyze it.";
    }

    if (lowerQuery.includes("revenue") || lowerQuery.includes("sales")) {
      return `Based on the analysis of ${document.name}, here are the revenue insights:

**Total Revenue: $12.4M** (Q4 2024)
- YoY Growth: 18%
- QoQ Growth: 6.9%

**Revenue Breakdown:**
- SaaS Subscriptions: $8.43M (68%)
- Professional Services: $2.73M (22%)
- License Sales: $1.24M (10%)

<ChartTrigger id="revenue-chart" label="Revenue Breakdown" type="pie" />

Would you like me to analyze specific revenue streams or compare with previous quarters?`;
    }

    if (lowerQuery.includes("chart") || lowerQuery.includes("visualiz")) {
      return `I can create various visualizations from your document. Here are some options:

<ChartTrigger id="trend-chart" label="Trend Analysis" type="line" />
<ChartTrigger id="comparison-chart" label="Category Comparison" type="bar" />
<ChartTrigger id="distribution-chart" label="Data Distribution" type="pie" />

Click on any chart button above to generate the visualization.`;
    }

    return `I've analyzed your query about "${query}" in the context of ${document.name}. 

Based on the document content, I can help you with:
- Data analysis and insights
- Creating visualizations
- Answering specific questions
- Generating summaries

What specific aspect would you like me to focus on?`;
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#030508]">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 mb-4">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#030508] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">
            {currentChat.title}
          </h2>
          {currentChat.document && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FileText className="w-4 h-4" />
              <span>{currentChat.document.name}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 md:px-20 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {currentChat.messages?.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {msg.sender === "user" ? (
                      <UserCircle className="w-8 h-8 text-gray-400" />
                    ) : (
                      <Bot className="w-8 h-8 text-indigo-400" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        ChartTrigger: ({ id, label, type }) => (
                          <button
                            className="inline-flex items-center gap-2 px-3 py-1 mt-2 bg-blue-600/20 border border-blue-500 text-blue-300 rounded hover:bg-blue-600/30 transition"
                            onClick={() =>
                              handleChartTrigger({ id, label, type })
                            }
                          >
                            📊 {label}
                          </button>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                    <p className="text-xs mt-1 opacity-50">{msg.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-indigo-400" />
                <div className="bg-gray-800 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Assistant is typing</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Chart Sidebar */}
        <ChartSidebar chatId={currentChat.id} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 px-4 md:px-20 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentChat.document
                  ? "Ask a question about your document..."
                  : "Upload a document to start..."
              }
              disabled={!currentChat.document}
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !currentChat.document}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUploadModal
          isOpen={showFileUpload}
          onClose={() => setShowFileUpload(false)}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
};

export default Chat;