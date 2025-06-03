const TableView = ({ fileData }) => {
  if (!fileData || fileData.error) {
    return null;
  }

  return (
    <div className="h-full p-6 overflow-hidden">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {fileData.name}
          </h3>
          <p className="text-sm text-gray-600">
            {fileData.data.rows} rows × {fileData.data.columns.length} columns
            {fileData.data.type === "excel" && fileData.data.sheetName && (
              <span className="ml-2 text-amber-600">
                (Sheet: {fileData.data.sheetName})
              </span>
            )}
          </p>
          {fileData.data.type === "excel" && fileData.data.totalSheets > 1 && (
            <p className="text-xs text-gray-500 mt-1">
              Note: Showing first sheet only. Total sheets:{" "}
              {fileData.data.totalSheets}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <div className="overflow-auto h-full w-full">
            <table className="border-collapse text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border border-gray-200 bg-gray-50">
                    #
                  </th>
                  {fileData.data.columns.slice(0, 20).map((column, index) => (
                    <th
                      key={index}
                      className="min-w-24 max-w-32 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border border-gray-200 bg-gray-50"
                      title={column}
                    >
                      <div className="truncate">{column}</div>
                    </th>
                  ))}
                  {fileData.data.columns.length > 20 && (
                    <th className="min-w-24 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border border-gray-200 bg-gray-50">
                      <div className="truncate text-amber-600">
                        +{fileData.data.columns.length - 20} more columns
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white">
                {fileData.data.data.slice(0, 100).map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }
                  >
                    <td className="w-12 px-2 py-2 text-xs text-gray-900 border border-gray-200 font-medium">
                      {rowIndex + 1}
                    </td>
                    {fileData.data.columns.slice(0, 20).map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="min-w-24 max-w-32 px-2 py-2 text-xs text-gray-900 border border-gray-200"
                        title={String(row[column] || "")}
                      >
                        <div className="truncate">
                          {String(row[column] || "").substring(0, 100)}
                        </div>
                      </td>
                    ))}
                    {fileData.data.columns.length > 20 && (
                      <td className="min-w-24 px-2 py-2 text-xs text-gray-500 border border-gray-200">
                        <div className="truncate">...</div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableView; 