import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { UserCircle, Bot } from "lucide-react";
import ChartSidebar from "./ChatSidebar";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import rehypeRaw from "rehype-raw";
import { Chart } from "chart.js/auto";

const messages = [
  {
    id: 1,
    sender: "user",
    text: "Can you summarize the uploaded document?",
    timestamp: "2025-06-15 10:00 AM",
  },
  {
    id: 2,
    sender: "assistant",
    type: "summary",
    text: `
### Document Summary (click to toggle)
<details><summary>View Summary</summary>

- **Title**: Financial Report Q1 2024  
- **Key Points**:
  - Revenue grew by **18% YoY**.
  - Main contributors: *North America*, *SaaS vertical*.
  - Issues faced: delayed invoicing in EMEA.
- **Recommendation**: Streamline invoicing and explore LATAM market.

</details>

\`\`\`python
# Extracted data hint
summary = extract_summary(document)
\`\`\`

Inline math: $E = mc^2$ and display math: 

$$
\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}
$$

<ChartTrigger id="revenueChart" label="Revenue Chart" />
    `,
    timestamp: "2025-06-15 10:01 AM",
  },
];

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 self-start animate-pulse text-neutral-400">
    <Bot className="w-5 h-5" />
    <div className="text-sm">Assistant is typing...</div>
    <div className="flex space-x-1">
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce delay-100" />
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce delay-200" />
    </div>
  </div>
);

const ChatArea = () => {
  const bottomRef = useRef(null);
  const [activeChart, setActiveChart] = useState(null);
  const chartRef = useRef(null);

  const charts = [
    {
      id: "revenueChart",
      label: "Revenue Chart",
      type: "bar",
      data: {
        labels: ["North America", "Europe", "Asia"],
        datasets: [
          {
            label: "Revenue ($M)",
            data: [45.2, 30.8, 18.7],
            backgroundColor: "#38bdf8",
          },
        ],
      },
    },
  ];

  useEffect(() => {
    if (!activeChart || !chartRef.current) return;
    const canvas = chartRef.current;
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();
    new Chart(canvas, {
      type: activeChart.type,
      data: activeChart.data,
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }, [activeChart]);

  return (
    <div className="relative w-full h-full flex">
      <div className="bg-zinc-900/70 w-full px-6 py-8 space-y-6 overflow-y-auto rounded-xl backdrop-blur">
        {messages.map((msg) => (
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
                          setActiveChart(
                            charts.find((chart) => chart.id === props.id)
                          )
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

        <TypingIndicator />
        <div ref={bottomRef} />
      </div>

      {/* Hover Sidebar */}
      <ChartSidebar charts={charts} onChartClick={setActiveChart} />

      {/* Modal */}
      {activeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 p-6 rounded-lg shadow-xl w-[90%] max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-semibold">
                {activeChart.label}
              </h2>
              <button
                onClick={() => setActiveChart(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <canvas ref={chartRef} height="300" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
