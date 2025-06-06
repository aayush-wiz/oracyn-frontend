const FileSelector = ({ files, selectedFile, onFileChange }) => {
  if (!files || files.length <= 1) {
    return null;
  }

  return (
    <div className="px-6 py-3 border-b border-gray-200">
      <select
        value={selectedFile}
        onChange={(e) => onFileChange(parseInt(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {files.map((file, index) => (
          <option key={index} value={index}>
            {file.name} ({file.data.type})
          </option>
        ))}
      </select>
    </div>
  );
};

export default FileSelector;
