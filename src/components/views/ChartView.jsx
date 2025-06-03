import { useEffect, useRef } from "react";
import * as d3 from "d3";

const ChartView = ({ fileData }) => {
  const chartRef = useRef();

  const renderChart = (data) => {
    if (
      !chartRef.current ||
      !data ||
      (data.type !== "csv" && data.type !== "excel")
    )
      return;

    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Find the best numeric columns to chart
    const numericColumns = Object.entries(data.summary)
      .filter(([, info]) => info.dataType === "numeric")
      .map(([col]) => col);

    if (numericColumns.length === 0) {
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#666")
        .text("No numeric data available for charting");
      return;
    }

    const firstNumericCol = numericColumns[0];
    const chartData = data.data.slice(0, 15).map((row, i) => ({
      label: row[data.columns[0]] || `Row ${i + 1}`,
      value: parseFloat(row[firstNumericCol]) || 0,
    }));

    // Create scales
    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.label))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value)])
      .range([height, 0]);

    // Create bars
    g.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "#f59e0b")
      .attr("rx", 3);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    g.append("g").call(d3.axisLeft(y));

    // Add labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text(firstNumericCol);
  };

  useEffect(() => {
    if (fileData && chartRef.current) {
      renderChart(fileData.data);
    }
  }, [fileData]);

  return (
    <div className="h-full p-6">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium mb-2">Data Chart</h3>
          <p className="text-sm text-gray-600">
            {fileData?.data.type === "csv" || fileData?.data.type === "excel"
              ? "Bar chart showing numeric data from your spreadsheet"
              : "Charts are available for CSV and Excel files with numeric data"}
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div ref={chartRef} className="w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ChartView; 