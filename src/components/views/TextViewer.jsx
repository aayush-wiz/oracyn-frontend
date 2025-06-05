import { FileText } from "lucide-react";

const TextViewer = ({ file }) => {
  const mockTextContent = `This is a sample text file content.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Section 2:
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

The actual content of the uploaded text file will be displayed here when integrated with the backend.`;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{file.name}</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
            TXT
          </span>
        </div>
      </div>
      <div className="h-full p-6 overflow-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
            {mockTextContent}
          </pre>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Character count: {mockTextContent.length} | Lines:{" "}
            {mockTextContent.split("\n").length}
          </p>
          <div className="mt-2 text-xs text-gray-400">
            File: {file.name} | Size: {formatFileSize(file.size)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextViewer;
