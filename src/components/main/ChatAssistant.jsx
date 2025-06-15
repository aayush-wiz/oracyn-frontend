// Main Chat Assistant Component
import React, { useState, useEffect, useRef } from "react";
import { useTypingEffect } from "../../hooks/useTypingEffect";
import {
  LightbulbIcon,
  BotIcon,
  UserIcon,
  DocumentIcon,
  SendIcon,
  StopIcon,
  CloseIcon,
  EditIcon,
  CopyIcon,
} from "../ui/Icons";
import ChartTab from "../ui/ChartTab";
import FileUploadModal from "../ui/FileUploadModal";

const ChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [charts, setCharts] = useState([]);
  const [activeChart, setActiveChart] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const messagesEndRef = useRef(null);
  const generateTimeoutRef = useRef(null);

  const suggestedQuestions = [
    "Summarize the key points in this document",
    "What are the main findings?",
    "Create a chart showing the data trends",
    "Analyze the financial performance",
    "Generate insights from the data",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setShowUploadModal(false);
  };

  const getChatResponse = (message) => {
    const responses = [
      "Based on your document analysis, here are the key insights I've found. The data shows several important trends that are worth highlighting for further analysis.",
      "I've analyzed the document and identified several critical points. The main findings suggest that there are opportunities for improvement in various areas.",
      "Here's a comprehensive summary of your document. The analysis reveals important patterns and recommendations for your consideration.",
      "After reviewing the uploaded file, I can provide you with detailed insights. The data indicates several key performance indicators that require attention.",
    ];

    if (message.toLowerCase().includes("chart")) {
      // Simulate chart creation
      setTimeout(() => {
        const newChart = {
          id: Date.now(),
          title: "Data Trends Chart",
          content: "Chart visualization would appear here",
        };
        setCharts((prev) => [...prev, newChart]);
      }, 2000);
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || isGenerating || isTyping) return;

    setShowSuggestions(false);
    setIsGenerating(true);

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Much longer thinking time - like AI is actually processing the document
    generateTimeoutRef.current = setTimeout(() => {
      const response = getChatResponse(message);
      const aiMessage = {
        id: Date.now() + Math.random(),
        text: response,
        sender: "ai",
        timestamp: new Date(),
        isTyping: true, // This will trigger the typing effect
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false); // Stop the thinking dots

      // Wait for the FULL typing animation to complete before stopping generation
      const typingDuration = response.length * 100 + 3000; // Much slower typing
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id ? { ...msg, isTyping: false } : msg
          )
        );
        setIsGenerating(false);
      }, typingDuration);
    }, 5000 + Math.random() * 3000); // 5-8 seconds thinking time
  };

  const handleStopGeneration = () => {
    if (generateTimeoutRef.current) {
      clearTimeout(generateTimeoutRef.current);
    }
    setIsGenerating(false);
    setIsTyping(false);

    // Remove the last incomplete message if it exists
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.sender === "ai" && lastMessage.isTyping) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const handleEditMessage = (messageId, newText) => {
    // Find the message and all messages after it
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    // Remove all messages after the edited message (including AI responses)
    const updatedMessages = messages.slice(0, messageIndex);

    // Add the edited message as a NEW message to avoid conflicts
    const editedMessage = {
      id: Date.now(), // New ID to prevent conflicts
      text: newText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...updatedMessages, editedMessage]);
    setEditingMessageId(null);
    setEditValue("");

    // Re-send only the AI response part after a brief delay
    setTimeout(() => {
      if (!isGenerating && !isTyping) {
        setIsGenerating(true);
        setIsTyping(true);

        generateTimeoutRef.current = setTimeout(() => {
          const response = getChatResponse(newText);
          const aiMessage = {
            id: Date.now() + Math.random(),
            text: response,
            sender: "ai",
            timestamp: new Date(),
            isTyping: true, // This will trigger the typing effect
          };

          setMessages((prev) => [...prev, aiMessage]);
          setIsTyping(false); // Stop the thinking dots

          // Wait for the FULL typing animation to complete
          const typingDuration = response.length * 100 + 3000;
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessage.id ? { ...msg, isTyping: false } : msg
              )
            );
            setIsGenerating(false);
          }, typingDuration);
        }, 5000 + Math.random() * 3000); // Same long thinking time
      }
    }, 300);
  };

  const handleCopyResponse = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);

      // Hide the "copied" text after 5 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 5000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSuggestionClick = (question) => {
    handleSendMessage(question);
  };

  const handleSubmit = () => {
    if (editingMessageId) {
      const messageToEdit = editValue.trim();
      if (messageToEdit) {
        handleEditMessage(editingMessageId, messageToEdit);
      }
    } else {
      if (inputValue.trim()) {
        handleSendMessage(inputValue);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape" && editingMessageId) {
      setEditingMessageId(null);
      setEditValue("");
    }
  };

  const removeChart = (chartId) => {
    setCharts((prev) => prev.filter((chart) => chart.id !== chartId));
    if (activeChart?.id === chartId) {
      setActiveChart(null);
    }
  };

  // Typing effect for AI messages
  const TypingMessage = ({ message }) => {
    const { displayedText, isComplete } = useTypingEffect(
      message.text,
      100, // Very slow typing - 100ms per character
      message.isTyping === true
    );

    const textToShow = message.isTyping ? displayedText : message.text;

    return (
      <div className="bg-gray-900/80 text-white border border-gray-700/50 rounded-xl p-4">
        <p className="whitespace-pre-wrap">{textToShow}</p>
        {(isComplete || !message.isTyping) && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div className="flex items-center gap-2">
              {copiedMessageId === message.id && (
                <span className="text-xs text-green-400 animate-pulse">
                  Copied
                </span>
              )}
              <button
                onClick={() => handleCopyResponse(message.text, message.id)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy response"
              >
                <CopyIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onFileUpload={handleFileUpload}
      />

      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2">Chat Assistant</h1>
        <p className="text-gray-400">AI-powered insights for your documents</p>
        {uploadedFile && (
          <div className="flex items-center gap-3 text-white mt-3">
            <DocumentIcon className="w-5 h-5" />
            <span>📄 {uploadedFile.name}</span>
          </div>
        )}
      </div>

      {/* Chart Tabs */}
      {charts.length > 0 && (
        <div className="flex gap-1 px-6 pt-4">
          {charts.map((chart) => (
            <ChartTab
              key={chart.id}
              chart={chart}
              isActive={activeChart?.id === chart.id}
              onClick={() => setActiveChart(chart)}
              onClose={() => removeChart(chart.id)}
            />
          ))}
        </div>
      )}

      {/* Chart Display */}
      {activeChart && (
        <div className="mx-6 mb-4 bg-gray-900 border border-gray-700 rounded-b-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">{activeChart.title}</h3>
            <button
              onClick={() => setActiveChart(null)}
              className="text-gray-400 hover:text-white"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-white text-center">
            {activeChart.content}
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 flex flex-col min-h-0 px-6">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.length === 0 && showSuggestions && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-white">
                <LightbulbIcon className="w-5 h-5" />
                <span>Suggested questions:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-left text-white hover:bg-gray-800/50 transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="max-w-[80%]">
                {message.sender === "user" ? (
                  <div className="bg-white text-black rounded-xl p-4">
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-600">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <button
                        onClick={() => {
                          setEditingMessageId(message.id);
                          setEditValue(message.text);
                        }}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        title="Edit message"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <TypingMessage message={message} />
                )}
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-gray-700" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="border-t border-gray-800 p-6 bg-gray-950">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={editingMessageId ? editValue : inputValue}
              onChange={(e) => {
                if (editingMessageId) {
                  setEditValue(e.target.value);
                } else {
                  setInputValue(e.target.value);
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder={
                editingMessageId
                  ? "Edit your message..."
                  : "Ask anything about your document..."
              }
              className="w-full p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
              rows="1"
              style={{ minHeight: "56px", maxHeight: "120px" }}
            />
          </div>

          {isGenerating ? (
            <button
              type="button"
              onClick={handleStopGeneration}
              className="w-14 h-14 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl flex items-center justify-center transition-all duration-200"
            >
              <StopIcon className="w-5 h-5 text-gray-300" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !(editingMessageId ? editValue.trim() : inputValue.trim())
              }
              className="w-14 h-14 bg-white hover:bg-gray-100 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200"
            >
              <SendIcon className="w-5 h-5 text-black" />
            </button>
          )}
        </div>

        {editingMessageId && (
          <div className="mt-2 text-sm text-gray-400">
            Editing message - press Enter to send or Escape to cancel
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAssistant;
