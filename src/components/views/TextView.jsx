const TextView = ({ fileData }) => {
  if (!fileData || fileData.data.type !== "text") {
    return null;
  }

  return (
    <div className="h-full p-6">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {fileData.name}
          </h3>
          <p className="text-sm text-gray-600">
            {fileData.data.lines.length} lines,{" "}
            {fileData.data.totalWords} words
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
            {fileData.data.content}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TextView; 