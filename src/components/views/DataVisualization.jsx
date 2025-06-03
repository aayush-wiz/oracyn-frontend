import { useState, useEffect } from "react";
import { processFiles } from "../../utils/fileProcessors";
import TableView from "./TableView";
import TextView from "./TextView";
import ErrorView from "./ErrorView";
import ChartView from "./ChartView";
import WordCloudView from "./WordCloudView";
import SummaryView from "./SummaryView";
import PDFView from "./PDFView";
import ViewTabs from "../ui/ViewTabs";
import FileSelector from "../file/FileSelector";

const DataVisualization = ({ files }) => {
  const [activeView, setActiveView] = useState("table");
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(0);

  useEffect(() => {
    if (files && files.length > 0) {
      handleProcessFiles(files);
    }
  }, [files]);

  const handleProcessFiles = async (uploadedFiles) => {
    setLoading(true);
    try {
      const results = await processFiles(uploadedFiles);
      setProcessedData(results);
      setSelectedFile(0); // Select first file by default
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentView = () => {
    if (!processedData || !processedData[selectedFile]) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    const currentFileData = processedData[selectedFile];

    // For PDF files, use the specialized PDFView component
    if (currentFileData.data.type === "pdf") {
      return <PDFView fileData={currentFileData} />;
    }

    switch (activeView) {
      case "table":
        // Show table view for CSV/Excel, text view for text files, or error view for errors
        if (currentFileData.data.error) {
          return <ErrorView fileData={currentFileData} />;
        } else if (currentFileData.data.type === "text") {
          return <TextView fileData={currentFileData} />;
        } else if (
          currentFileData.data.type === "csv" ||
          currentFileData.data.type === "excel"
        ) {
          return <TableView fileData={currentFileData} />;
        }
        break;
      case "chart":
        return <ChartView fileData={currentFileData} />;
      case "wordcloud":
        return <WordCloudView fileData={currentFileData} />;
      case "summary":
        return <SummaryView fileData={currentFileData} />;
      default:
        return null;
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="flex-1 h-screen bg-[#ffffe5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-queensides-medium text-gray-600 mb-2">
            No Data to Visualize
          </h3>
          <p className="text-sm text-gray-500">
            Upload files and click visualize to see your data
          </p>
        </div>
      </div>
    );
  }

  // For PDF files, don't show the standard navigation tabs since PDFView has its own tabs
  const currentFileData = processedData && processedData[selectedFile];
  const isPDFFile = currentFileData && currentFileData.data.type === "pdf";

  return (
    <div className="flex-1 h-screen bg-[#ffffe5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-300 flex-shrink-0">
        <h2 className="text-xl font-queensides-medium text-gray-800">
          Data Visualization
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {processedData
            ? `Analyzing ${processedData.length} file${
                processedData.length > 1 ? "s" : ""
              }`
            : "Processing files..."}
        </p>
      </div>

      {/* File Selector */}
      <div className="flex-shrink-0">
        <FileSelector
          files={processedData}
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
        />
      </div>

      {/* Navigation Tabs - Only show for non-PDF files */}
      {!isPDFFile && (
        <div className="flex-shrink-0">
          <ViewTabs activeView={activeView} onViewChange={setActiveView} />
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing files...</p>
            </div>
          </div>
        ) : (
          renderCurrentView()
        )}
      </div>
    </div>
  );
};

export default DataVisualization;
