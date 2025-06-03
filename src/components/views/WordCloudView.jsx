import { useEffect, useRef } from "react";
import * as d3 from "d3";

const WordCloudView = ({ fileData }) => {
  const chartRef = useRef();

  const renderWordCloud = (data) => {
    if (!chartRef.current || !data || data.type !== "text") return;

    d3.select(chartRef.current).selectAll("*").remove();

    const width = 600;
    const height = 400;
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const maxCount = Math.max(...data.wordCount.map((d) => d.count));

    data.wordCount.slice(0, 30).forEach((d, i) => {
      const fontSize = Math.max(12, Math.min(36, (d.count / maxCount) * 36));
      const x = (i % 6) * 100 + 20;
      const y = Math.floor(i / 6) * 60 + 40;

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .text(d.word)
        .style("font-size", `${fontSize}px`)
        .style("fill", "#d97706")
        .style("font-family", "inherit")
        .style("font-weight", "bold");

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y + 15)
        .text(`(${d.count})`)
        .style("font-size", "10px")
        .style("fill", "#666")
        .style("font-family", "inherit");
    });
  };

  useEffect(() => {
    if (fileData && chartRef.current) {
      renderWordCloud(fileData.data);
    }
  }, [fileData]);

  return (
    <div className="h-full p-6">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium mb-2">Word Frequency</h3>
          <p className="text-sm text-gray-600">
            {fileData?.data.type === "text"
              ? "Most frequent words from your text file"
              : "Word cloud is available for text files"}
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div ref={chartRef} className="w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default WordCloudView; 