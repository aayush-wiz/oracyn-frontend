// Chat Area Component
import { useState, useEffect, useRef } from "react";
import { Bot, UserCircle, FileText } from "lucide-react";
import { useStore } from "../../../../store/useStore";
import ChartSidebar from "./ChartSidebar";
import TypingIndicator from "./TypingIndicator";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const ChatArea = () => {
  const { getCurrentChat, addChart } = useStore();
  const currentChat = getCurrentChat();
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Mock function to simulate chart creation
  const handleChartTrigger = (chartConfig) => {
    const newChart = addChart(chartConfig);
    console.log("Chart created:", newChart);
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-400">Start a new chat to begin</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex">
      <div className="bg-zinc-900/70 w-full px-6 py-8 space-y-6 overflow-y-auto rounded-xl backdrop-blur">
        {currentChat.document && (
          <div className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-zinc-400" />
              <span className="text-sm text-zinc-300">
                Document uploaded: {currentChat.document.name}
              </span>
            </div>
          </div>
        )}

        {currentChat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1 ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="text-xs text-neutral-400">{msg.timestamp}</div>
            <div className="flex items-start space-x-3">
              {msg.sender === "assistant" && (
                <Bot className="w-6 h-6 text-neutral-400" />
              )}
              {msg.sender === "user" && (
                <UserCircle className="w-6 h-6 text-neutral-400" />
              )}

              <div
                className={`rounded-xl max-w-[80%] p-4 text-sm md:text-base shadow-md ${
                  msg.sender === "user"
                    ? "bg-neutral-200/20 text-neutral-100"
                    : "bg-neutral-700/40 text-neutral-100"
                }`}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
                  remarkPlugins={[remarkMath]}
                  components={{
                    charttrigger: ({ node, ...props }) => (
                      <span
                        className="inline-block px-3 py-1 bg-blue-600/20 border border-blue-500 text-blue-300 rounded cursor-pointer hover:bg-blue-600/40"
                        onClick={() =>
                          handleChartTrigger({
                            type: props.type || "bar",
                            label: props.label,
                            data: props.data,
                          })
                        }
                      >
                        📊 {props.label}
                      </span>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChartSidebar />
    </div>
  );
};

export default ChatArea;
