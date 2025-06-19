// components/main/chat/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import useStore from "../../../store/useStore";
import {
  Send,
  Bot,
  UserCircle,
  FileText,
  Plus,
  MessageSquare,
  History,
  AlertTriangle,
  Upload,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import ChartSidebar from "./ChatComponents/ChartSidebar";
import FileUploadModal from "../../ui/FileUploadModal";
import ChartDisplayModal from "./ChatComponents/ChartDisplayModal";
import HistoryModal from "../HistoryModal";

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDocumentRequired, setShowDocumentRequired] = useState(false);
  const [documentModalDismissed, setDocumentModalDismissed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showNewChatWarning, setShowNewChatWarning] = useState(false);
  const bottomRef = useRef(null);
  const [navigationHandled, setNavigationHandled] = useState(false);

  const {
    chats,
    activeChat,
    charts,
    createChat,
    setActiveChat,
    updateChat,
    addMessage,
    addDocument,
    createChart,
    incrementApiCalls,
    updateProcessingSpeed,
    getCurrentChat,
    initializeStore,
    hasEmptyChat,
    isChatEmpty,
    getOrCreateEmptyChat,
  } = useStore();

  const currentChat = getCurrentChat();

  // Initialize store on mount
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Handle routing and chat management - Fixed to prevent infinite loops
  useEffect(() => {
    // Prevent navigation handling if already handled or if we're in the middle of navigation
    if (navigationHandled) return;

    const timeoutId = setTimeout(() => {
      try {
        // Case 1: No ID in URL and no chats exist - create first chat
        if (!id && chats.length === 0) {
          const newChatId = getOrCreateEmptyChat();
          if (newChatId) {
            navigate(`/chat/${newChatId}`, { replace: true });
            setNavigationHandled(true);
          }
          return;
        }

        // Case 2: No ID in URL but chats exist - go to first available chat
        if (!id && chats.length > 0) {
          const emptyChat = chats.find((chat) => isChatEmpty(chat));
          const targetChat = emptyChat || chats[0];
          setActiveChat(targetChat.id);
          navigate(`/chat/${targetChat.id}`, { replace: true });
          setNavigationHandled(true);
          return;
        }

        // Case 3: ID provided but chat doesn't exist (deleted scenario)
        if (id && chats.length > 0) {
          const chatExists = chats.find((chat) => chat.id === id);
          if (!chatExists) {
            // Chat was deleted, navigate to first available chat
            const firstChat = chats[0];
            setActiveChat(firstChat.id);
            navigate(`/chat/${firstChat.id}`, { replace: true });
            setNavigationHandled(true);
            return;
          }
        }

        // Case 4: ID provided, no chats exist - create new chat
        if (id && chats.length === 0) {
          const newChatId = getOrCreateEmptyChat();
          if (newChatId) {
            navigate(`/chat/${newChatId}`, { replace: true });
            setNavigationHandled(true);
          }
          return;
        }

        // Case 5: Valid chat ID, just sync active chat
        if (id && currentChat && activeChat !== id) {
          setActiveChat(id);
          setNavigationHandled(true);
          return;
        }

        // Case 6: Everything is in sync
        if (id && currentChat && activeChat === id) {
          setNavigationHandled(true);
          return;
        }
      } catch (error) {
        console.error("Navigation error:", error);
        setNavigationHandled(true);
      }
    }, 0); // Use setTimeout to prevent immediate state updates

    return () => clearTimeout(timeoutId);
  }, [id, chats.length]); // Removed currentChat?.id and activeChat to prevent loops

  // Reset navigation handled when route changes
  useEffect(() => {
    setNavigationHandled(false);
    setDocumentModalDismissed(false); // Reset for each chat
  }, [id]);

  // Show file upload modal for new chats without documents (only once)
  useEffect(() => {
    if (
      currentChat &&
      !currentChat.document &&
      currentChat.messages.length <= 1 &&
      !showDocumentRequired
    ) {
      setShowFileUpload(true);
    }
  }, [currentChat?.id]); // Only trigger when chat ID changes, not on other state updates

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  const handleNewChat = () => {
    // Check if there's already an empty chat
    if (hasEmptyChat()) {
      alert(
        "You already have an empty chat. Please use it or add content before creating a new one."
      );
      return;
    }

    // Check if current chat has user messages (not just welcome message)
    const hasUserMessages =
      currentChat && currentChat.messages.some((msg) => msg.sender === "user");

    if (hasUserMessages) {
      setShowNewChatWarning(true);
      return;
    }

    const newChatId = createChat();
    if (newChatId) {
      navigate(`/chat/${newChatId}`);
      setShowFileUpload(true);
      setShowDocumentRequired(false);
    } else {
      alert(
        "Cannot create new chat. Either maximum chat sessions reached or you have an empty chat that needs to be used."
      );
    }
  };

  const handleForceNewChat = () => {
    // Only allow if no empty chat exists
    if (hasEmptyChat()) {
      alert(
        "You have an empty chat. Please use it or add content before creating a new one."
      );
      setShowNewChatWarning(false);
      return;
    }

    const newChatId = createChat();
    if (newChatId) {
      navigate(`/chat/${newChatId}`);
      setShowFileUpload(true);
      setShowDocumentRequired(false);
      setShowNewChatWarning(false);
    } else {
      alert("Maximum chat sessions reached. Please close an existing chat.");
    }
  };

  const handleFileUploadClose = () => {
    setShowFileUpload(false);
    // Only show document required modal if user hasn't dismissed it before for this chat
    if (currentChat && !currentChat.document && !documentModalDismissed) {
      setShowDocumentRequired(true);
    }
  };

  const handleFileUpload = (file) => {
    if (currentChat && file) {
      addDocument({
        name: file.name,
        size: file.size,
        chatId: currentChat.id,
        type: file.type,
      });

      updateChat(currentChat.id, {
        document: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
        documentsUsed: 1,
        title: `Chat: ${file.name}`,
      });

      addMessage(currentChat.id, {
        sender: "assistant",
        text: `I've successfully analyzed "${file.name}". What would you like to know about this document? You can ask me to create charts, analyze data, or answer specific questions about the content.`,
      });

      setShowFileUpload(false);
      setShowDocumentRequired(false);
    }
  };

  const handleDocumentRequiredUpload = () => {
    setShowDocumentRequired(false);
    setShowFileUpload(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    addMessage(currentChat.id, {
      sender: "user",
      text: message,
    });

    const userQuery = message;
    setMessage("");
    setIsTyping(true);

    incrementApiCalls();
    const startTime = Date.now();

    setTimeout(() => {
      const processingTime = (Date.now() - startTime) / 1000;
      updateProcessingSpeed(processingTime);

      const response = generateMockResponse(userQuery, currentChat);

      addMessage(currentChat.id, {
        sender: "assistant",
        text: response,
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
    // Check if a chart with the same type and label already exists for this chat
    const existingChart = charts.find(
      (chart) =>
        chart.chatId === currentChat.id &&
        chart.type === chartConfig.type &&
        chart.label === chartConfig.label
    );

    if (existingChart) {
      // If chart already exists, just navigate to it instead of creating a new one
      navigate(`?selected=${existingChart.id}`, { replace: false });
      return;
    }

    // Only create new chart if it doesn't exist
    const mockData = generateMockChartData(chartConfig.type);
    const newChart = createChart({
      ...chartConfig,
      chatId: currentChat.id,
      createdFrom: currentChat.title,
      data: mockData,
    });

    navigate(`?selected=${newChart.id}`, { replace: false });
  };

  // Custom component for chart triggers
  const ChartTriggerButton = ({ type, label }) => (
    <button
      className="inline-flex items-center gap-2 px-4 py-2 mt-3 mr-2 mb-2 bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-600/50 hover:border-blue-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm group/chart relative"
      onClick={() => handleChartTrigger({ type, label })}
    >
      <span className="transform group-hover/chart:rotate-12 transition-transform duration-300">
        📊
      </span>
      {label}
      <div className="absolute inset-0 bg-blue-400/10 rounded-lg opacity-0 group-hover/chart:opacity-100 transition-opacity duration-300"></div>
    </button>
  );

  // Function to render message content with chart buttons
  const renderMessageContent = (text) => {
    // Split text by chart-trigger tags
    const chartTriggerRegex =
      /<chart-trigger\s+type="([^"]+)"\s+label="([^"]+)"><\/chart-trigger>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = chartTriggerRegex.exec(text)) !== null) {
      // Add text before the chart trigger
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push(
            <ReactMarkdown key={`text-${lastIndex}`}>
              {textBefore}
            </ReactMarkdown>
          );
        }
      }

      // Add the chart trigger button
      const [, type, label] = match;
      parts.push(
        <ChartTriggerButton
          key={`chart-${match.index}`}
          type={type}
          label={label.replace(/_/g, " ")}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last chart trigger
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push(
          <ReactMarkdown key={`text-${lastIndex}`}>
            {remainingText}
          </ReactMarkdown>
        );
      }
    }

    // If no chart triggers found, just render as regular markdown
    if (parts.length === 0) {
      return <ReactMarkdown>{text}</ReactMarkdown>;
    }

    return <div className="space-y-2">{parts}</div>;
  };

  // Generate mock chart data based on type
  const generateMockChartData = (type) => {
    const labels = ["Q1", "Q2", "Q3", "Q4"];
    const colors = [
      "rgba(99, 102, 241, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
    ];

    switch (type) {
      case "pie":
      case "doughnut":
        return {
          labels: ["Revenue", "Expenses", "Profit", "Investment"],
          datasets: [
            {
              data: [12400000, 8200000, 4200000, 2100000],
              backgroundColor: colors,
              borderColor: colors.map((c) => c.replace("0.8", "1")),
              borderWidth: 2,
            },
          ],
        };
      case "line":
        return {
          labels,
          datasets: [
            {
              label: "Revenue Growth",
              data: [8200000, 9100000, 10800000, 12400000],
              borderColor: "rgba(99, 102, 241, 1)",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        };
      default: // bar
        return {
          labels,
          datasets: [
            {
              label: "Revenue by Quarter",
              data: [8200000, 9100000, 10800000, 12400000],
              backgroundColor: colors,
              borderColor: colors.map((c) => c.replace("0.8", "1")),
              borderWidth: 2,
            },
          ],
        };
    }
  };

  // Generate mock responses based on query
  const generateMockResponse = (query, chat) => {
    const lowerQuery = query.toLowerCase();

    if (!chat.document) {
      return "Please upload a document first so I can help you analyze it.";
    }

    if (lowerQuery.includes("revenue") || lowerQuery.includes("sales")) {
      return `Based on the analysis of **${chat.document.name}**, here are the revenue insights:

**Total Revenue: $12.4M** (Q4 2024)
- YoY Growth: 18%
- QoQ Growth: 6.9%

**Revenue Breakdown:**
- SaaS Subscriptions: $8.43M (68%)
- Professional Services: $2.73M (22%)
- License Sales: $1.24M (10%)

<chart-trigger type="pie" label="Revenue_Breakdown"></chart-trigger>

Would you like me to analyze specific revenue streams or compare with previous quarters?`;
    }

    if (
      lowerQuery.includes("chart") ||
      lowerQuery.includes("visualiz") ||
      lowerQuery.includes("graph")
    ) {
      return `I can create various visualizations from your document data. Here are some options:

<chart-trigger type="line" label="Trend_Analysis"></chart-trigger>
<chart-trigger type="bar" label="Category_Comparison"></chart-trigger>
<chart-trigger type="pie" label="Data_Distribution"></chart-trigger>

Click on any chart button above to generate the visualization.`;
    }

    if (lowerQuery.includes("summary") || lowerQuery.includes("overview")) {
      return `Here's a comprehensive summary of **${chat.document.name}**:

**Key Metrics:**
- Total Revenue: $12.4M (+18% YoY)
- Active Users: 45,000 (+23% YoY)
- Customer Satisfaction: 94%
- Market Share: 12%

**Growth Trends:**
- Quarterly revenue growth averaging 7.2%
- User acquisition rate of 1,200 new users/month
- Customer retention rate of 89%

<chart-trigger type="line" label="Growth_Trends"></chart-trigger>

Would you like me to dive deeper into any specific area?`;
    }

    return `I've analyzed your query about "${query}" in the context of **${chat.document.name}**. 

Based on the document content, I can help you with:
- **Data analysis** and insights extraction
- **Creating visualizations** and charts
- **Answering specific questions** about the content
- **Generating summaries** and reports

<chart-trigger type="bar" label="Data_Overview"></chart-trigger>

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
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col relative overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gray-500 rotate-45"></div>
        <div className="absolute top-40 right-40 w-24 h-24 border border-gray-600 rotate-12"></div>
        <div className="absolute bottom-32 left-32 w-16 h-16 border border-gray-400"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-gray-500 rotate-45"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-center px-8 py-6 border-b border-gray-800/60 backdrop-blur-xl bg-black/40 relative z-10">
        {/* Geometric corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-gray-600 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-gray-600 opacity-30"></div>

        {/* Left side - Chat info */}
        <div className="absolute left-8 flex items-center gap-4">
          <div className="relative">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {currentChat.title}
            </h2>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500"></div>
          </div>
          {currentChat.document && (
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-900/60 border border-gray-700/50 rounded-lg backdrop-blur-sm">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">
                {currentChat.document.name}
              </span>
            </div>
          )}
        </div>

        {/* Center - Action Buttons */}
        <div className="flex items-center gap-4">
          {/* History Button */}
          <button
            onClick={() => setShowHistory(true)}
            className="group relative bg-transparent border-2 border-gray-700 text-white px-4 py-3 font-semibold overflow-hidden transition-all duration-500 hover:border-gray-500 hover:shadow-lg hover:shadow-gray-500/20 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gray-600 transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
              <History className="w-5 h-5" />
              History
            </span>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="group relative bg-transparent border-2 border-gray-600 text-white px-4 py-3 font-semibold overflow-hidden transition-all duration-500 hover:border-white hover:shadow-xl hover:shadow-white/20 hover:scale-105"
          >
            <div className="absolute inset-0 bg-white transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-black">
              <Plus className="w-5 h-5" />
              New Chat
            </span>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>

          {/* Upload Document Button - Only show if no document uploaded */}
          {!currentChat.document && (
            <button
              onClick={() => setShowFileUpload(true)}
              className="group relative bg-transparent border-2 border-blue-600 text-white px-4 py-3 font-semibold overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105"
            >
              <div className="absolute inset-0 bg-blue-600 transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
                <Upload className="w-5 h-5" />
                Upload Document
              </span>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Chat Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* No Document Notice - Less intrusive than modal */}
            {!currentChat.document &&
              !showFileUpload &&
              !showDocumentRequired && (
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/50 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">
                        No Document Uploaded
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Upload a document to start analyzing data and creating
                        charts. You can also navigate to other chats or the
                        dashboard.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFileUpload(true)}
                        className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                      >
                        <Upload className="w-4 h-4 inline mr-1" />
                        Upload
                      </button>
                      <button
                        onClick={() => setShowHistory(true)}
                        className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600/50 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                      >
                        Other Chats
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {currentChat.messages?.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } group`}
              >
                <div
                  className={`flex gap-4 max-w-[80%] ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="flex-shrink-0 relative">
                    <div className="w-10 h-10 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center group-hover:border-gray-600/70 transition-all duration-300">
                      {msg.sender === "user" ? (
                        <UserCircle className="w-6 h-6 text-gray-300" />
                      ) : (
                        <Bot className="w-6 h-6 text-indigo-400" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`rounded-xl px-6 py-4 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden ${
                      msg.sender === "user"
                        ? "bg-indigo-600/80 text-white border border-indigo-500/50"
                        : "bg-gray-800/80 text-gray-100 border border-gray-700/50"
                    }`}
                  >
                    {/* Geometric background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-2 right-2 w-4 h-4 border border-current rotate-45"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 border border-current"></div>
                    </div>

                    <div className="relative z-10">
                      {renderMessageContent(msg.text)}
                    </div>
                    <p className="text-xs mt-2 opacity-60">{msg.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300">Assistant is thinking</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Chart Sidebar - Always visible when charts exist */}
        <ChartSidebar chatId={currentChat.id} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800/60 px-8 py-6 backdrop-blur-xl bg-black/40 relative z-10">
        {/* Geometric accent */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

        <div className="max-w-4xl mx-auto">
          <div
            className={`flex items-center gap-4 bg-gray-900/60 backdrop-blur-sm rounded-xl px-6 py-4 border transition-all duration-500 ${
              isFocused
                ? "border-gray-500/80 shadow-lg shadow-white/10"
                : "border-gray-700/50"
            }`}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                currentChat.document
                  ? "Ask a question about your document..."
                  : "Upload a document to start..."
              }
              disabled={!currentChat.document}
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !currentChat.document}
              className="relative group p-3 overflow-hidden text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm transition-all duration-300 bg-indigo-600/80 border border-indigo-400/20"
            >
              {/* Bottom-to-top background hover animation */}
              <span className="absolute inset-0 bg-indigo-500 transition-all duration-300 origin-bottom scale-y-0 group-hover:scale-y-100 z-0" />

              {/* Send Icon */}
              <Send className="w-6 h-6 relative z-10 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUploadModal
          isOpen={showFileUpload}
          onClose={handleFileUploadClose}
          onUpload={handleFileUpload}
        />
      )}

      {/* Document Required Modal */}
      {showDocumentRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden">
            {/* Geometric background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-8 h-8 border border-gray-400 rotate-45"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border border-gray-500"></div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-blue-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-blue-500"></div>

            <div className="p-6 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Document Required
                  </h3>
                  <p className="text-sm text-gray-400">
                    This chat needs a document to function
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                This chat requires a document to analyze and create charts. You
                can upload one now, or navigate to another chat that already has
                a document.
              </p>

              <div className="space-y-3">
                {/* Primary action - Upload */}
                <button
                  onClick={handleDocumentRequiredUpload}
                  className="w-full group relative bg-transparent border-2 border-blue-600 text-white px-4 py-3 font-semibold overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-blue-600 transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Document
                  </span>
                </button>

                {/* Secondary actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setShowDocumentRequired(false);
                      setShowHistory(true);
                      setDocumentModalDismissed(true);
                    }}
                    className="px-3 py-2 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500/70 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                  >
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Other Chats
                  </button>
                  <button
                    onClick={() => {
                      setShowDocumentRequired(false);
                      setDocumentModalDismissed(true);
                      navigate("/");
                    }}
                    className="px-3 py-2 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500/70 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                  >
                    📊 Dashboard
                  </button>
                </div>

                {/* Dismiss option */}
                <button
                  onClick={() => {
                    setShowDocumentRequired(false);
                    setDocumentModalDismissed(true);
                  }}
                  className="w-full px-4 py-2 bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700/30 hover:border-gray-600/50 text-gray-400 hover:text-gray-300 rounded-lg transition-all duration-300 text-sm"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Continue without document (limited functionality)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* New Chat Warning Modal */}
      {showNewChatWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden">
            {/* Geometric background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-8 h-8 border border-gray-400 rotate-45"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border border-gray-500"></div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-orange-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-orange-500"></div>

            <div className="p-6 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-600/20 border border-orange-500/50 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Start New Chat?
                  </h3>
                  <p className="text-sm text-gray-400">
                    You have an active conversation
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                You currently have an active chat with messages. Starting a new
                chat will keep your current conversation in history, but you'll
                lose the current context.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewChatWarning(false)}
                  className="flex-1 px-4 py-3 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500/70 text-white rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Continue Current
                </button>
                <button
                  onClick={handleForceNewChat}
                  className="group flex-1 relative bg-transparent border-2 border-orange-600 text-white px-4 py-3 font-semibold overflow-hidden transition-all duration-500 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-orange-600 transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                    Start New Chat
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Display Modal */}
      <ChartDisplayModal />
    </div>
  );
};

export default Chat;
