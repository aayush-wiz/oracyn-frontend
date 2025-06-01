import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DataVisualization = ({ analysisData }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [selectedChart, setSelectedChart] = useState('wordCloud');

  // Resize observer to make charts responsive
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width,
          height: Math.max(300, width * 0.5)
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    handleResize();
    return () => resizeObserver.disconnect();
  }, []);

  // Word Cloud Visualization
  const createWordCloud = (data) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const words = data.keywords || [];
    if (words.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create font size scale
    const fontScale = d3.scaleLinear()
      .domain(d3.extent(words, d => d.frequency))
      .range([12, 48]);

    // Color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Simple word positioning (can be enhanced with D3 cloud layout)
    const wordsData = words.map((word, i) => ({
      ...word,
      x: Math.random() * (innerWidth - 100) + 50,
      y: Math.random() * (innerHeight - 50) + 25,
      fontSize: fontScale(word.frequency),
      color: colorScale(i)
    }));

    // Create word elements
    g.selectAll("text")
      .data(wordsData)
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("font-size", d => d.fontSize)
      .attr("fill", d => d.color)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-weight", "bold")
      .text(d => d.word)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).transition().duration(200).attr("font-size", d.fontSize * 1.2);
        
        // Tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("opacity", 0);

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.word}<br/>Frequency: ${d.frequency}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function(_, d) {
        d3.select(this).transition().duration(200).attr("font-size", d.fontSize);
        d3.selectAll(".tooltip").remove();
      });
  };

  // Bar Chart for Sentiment Analysis
  const createSentimentChart = (data) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const sentiments = data.sentiments || [];
    if (sentiments.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(sentiments.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(sentiments, d => d.score)])
      .range([innerHeight, 0]);

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(['positive', 'neutral', 'negative'])
      .range(['#22c55e', '#6b7280', '#ef4444']);

    // Bars
    g.selectAll("rect")
      .data(sentiments)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.label))
      .attr("y", d => yScale(d.score))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.score))
      .attr("fill", d => colorScale(d.label))
      .style("cursor", "pointer")
      .on("mouseover", function() {
        d3.select(this).transition().duration(200).attr("opacity", 0.8);
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(200).attr("opacity", 1);
      });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

    // Labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (innerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Score");
  };

  // Network Diagram for Entity Relationships
  const createNetworkDiagram = (data) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const entities = data.entities || [];
    const relationships = data.relationships || [];
    
    if (entities.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create nodes and links
    const nodes = entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      importance: entity.importance || 1
    }));

    const links = relationships.map(rel => ({
      source: rel.source,
      target: rel.target,
      strength: rel.strength || 1
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => Math.sqrt(d.importance) * 10 + 5));

    // Color scale by type
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.strength) * 2);

    // Create nodes
    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", d => Math.sqrt(d.importance) * 10 + 5)
      .attr("fill", d => colorScale(d.type))
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add labels
    const label = g.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => d.name)
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("pointer-events", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  // Timeline Chart for Document Analysis
  const createTimeline = (data) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const events = data.timeline || [];
    if (events.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d");
    events.forEach(d => {
      d.date = parseDate(d.date);
    });

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(events, d => d.date))
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(events.map(d => d.category))
      .range([0, innerHeight])
      .padding(0.1);

    // Create timeline line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", innerHeight / 2)
      .attr("y2", innerHeight / 2)
      .attr("stroke", "#ddd")
      .attr("stroke-width", 2);

    // Create events
    g.selectAll("circle")
      .data(events)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.category) + yScale.bandwidth() / 2)
      .attr("r", 6)
      .attr("fill", "#3b82f6")
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).transition().duration(200).attr("r", 8);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("opacity", 0);

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.title}<br/>${d.date.toLocaleDateString()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(200).attr("r", 6);
        d3.selectAll(".tooltip").remove();
      });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));
  };

  // Render the selected chart
  useEffect(() => {
    if (!analysisData || !svgRef.current) return;

    switch (selectedChart) {
      case 'wordCloud':
        createWordCloud(analysisData);
        break;
      case 'sentiment':
        createSentimentChart(analysisData);
        break;
      case 'network':
        createNetworkDiagram(analysisData);
        break;
      case 'timeline':
        createTimeline(analysisData);
        break;
      default:
        createWordCloud(analysisData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisData, selectedChart, dimensions]);

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No analysis data available</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Data Visualization</h3>
          <div className="flex space-x-2">
            {[
              { key: 'wordCloud', label: 'Word Cloud', icon: '☁️' },
              { key: 'sentiment', label: 'Sentiment', icon: '📊' },
              { key: 'network', label: 'Network', icon: '🕸️' },
              { key: 'timeline', label: 'Timeline', icon: '📅' }
            ].map((chart) => (
              <button
                key={chart.key}
                onClick={() => setSelectedChart(chart.key)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedChart === chart.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{chart.icon}</span>
                {chart.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default DataVisualization; 