import { useState } from "react";
import PDFViewer from "../views/PDFViewer";
import WordViewer from "../views/WordViewer";
import ExcelViewer from "../views/ExcelViewer";
import PowerPointViewer from "../views/PowerPointViewer";
import CSVViewer from "../views/CSVViewer";
import TextViewer from "../views/TextViewer";
import {
  Eye,
  FileText,
  File,
  Database,
  Download,
  Share2,
  Maximize2,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";

const DataVisualization = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState(0);

  // Fixed icon function with exact MIME type matching
  const getFileIcon = (fileType) => {
    const iconClass = "w-5 h-5";
    if (fileType === "application/pdf")
      return <FileText className={`${iconClass} text-red-500`} />;
    if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return <FileText className={`${iconClass} text-blue-500`} />;
    if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      return <FileSpreadsheet className={`${iconClass} text-green-500`} />;
    if (fileType === "text/csv")
      return <FileSpreadsheet className={`${iconClass} text-emerald-500`} />;
    if (
      fileType === "application/vnd.ms-powerpoint" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
      return <Presentation className={`${iconClass} text-orange-500`} />;
    if (fileType === "text/plain")
      return <FileText className={`${iconClass} text-gray-500`} />;
    return <File className={`${iconClass} text-gray-500`} />;
  };

  const getFileViewer = (file) => {
    if (!file) return null;

    if (file.type === "application/pdf") {
      return <PDFViewer file={file} />;
    } else if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <WordViewer file={file} />;
    } else if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return <ExcelViewer file={file} />;
    } else if (
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return <PowerPointViewer file={file} />;
    } else if (file.type === "text/csv") {
      return <CSVViewer file={file} />;
    } else if (file.type === "text/plain") {
      return <TextViewer file={file} />;
    } else {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unsupported File Type
            </h3>
            <p className="text-sm text-gray-600">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">{file.type}</p>
          </div>
        </div>
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!files || files.length === 0) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to Visualize
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload documents and click "Visualize" to view them in their
            original format
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <FileText className="w-4 h-4" />
            <span>
              Supports PDF, Word, Excel, PowerPoint, CSV, and TXT files
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Document Viewer
              </h2>
              <p className="text-sm text-gray-600">
                Viewing {files.length} document{files.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File Navigation */}
      {files.length > 1 && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => setSelectedFile(index)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  selectedFile === index
                    ? "border-blue-500 text-blue-600 bg-white"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {getFileIcon(file.type)}
                <span className="truncate max-w-40">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(file.size)})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-6">
        {getFileViewer(files[selectedFile])}
      </div>
    </div>
  );
};

export default DataVisualization;
