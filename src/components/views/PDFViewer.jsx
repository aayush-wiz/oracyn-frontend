import { FileText } from "lucide-react";

const WordViewer = ({ file }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{file.name}</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            {file.name.endsWith(".docx") ? "DOCX" : "DOC"}
          </span>
        </div>
      </div>
      <div className="h-full p-6 bg-blue-25 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Word Document
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Word document viewer will be integrated here
          </p>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-left max-w-md">
            <p className="text-xs text-gray-500 mb-2">File Details:</p>
            <p className="text-sm">
              <strong>Name:</strong> {file.name}
            </p>
            <p className="text-sm">
              <strong>Size:</strong> {formatFileSize(file.size)}
            </p>
            <p className="text-sm">
              <strong>Type:</strong> Microsoft Word
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordViewer;
