const SummaryView = ({ fileData }) => {
  if (!fileData) {
    return null;
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            File Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <span className="ml-2 text-gray-900">{fileData.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Type:</span>
              <span className="ml-2 text-gray-900">{fileData.data.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Size:</span>
              <span className="ml-2 text-gray-900">
                {(fileData.size / 1024).toFixed(1)} KB
              </span>
            </div>
            {fileData.data.rows && (
              <div>
                <span className="font-medium text-gray-600">Rows:</span>
                <span className="ml-2 text-gray-900">{fileData.data.rows}</span>
              </div>
            )}
            {fileData.data.columns && (
              <div>
                <span className="font-medium text-gray-600">Columns:</span>
                <span className="ml-2 text-gray-900">
                  {fileData.data.columns.length}
                </span>
              </div>
            )}
            {fileData.data.totalWords && (
              <div>
                <span className="font-medium text-gray-600">Words:</span>
                <span className="ml-2 text-gray-900">
                  {fileData.data.totalWords}
                </span>
              </div>
            )}
            {fileData.data.type === "excel" && fileData.data.sheetName && (
              <div>
                <span className="font-medium text-gray-600">Sheet:</span>
                <span className="ml-2 text-gray-900">
                  {fileData.data.sheetName}
                </span>
              </div>
            )}
            {fileData.data.type === "excel" && fileData.data.totalSheets && (
              <div>
                <span className="font-medium text-gray-600">Total Sheets:</span>
                <span className="ml-2 text-gray-900">
                  {fileData.data.totalSheets}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Column Statistics for CSV and Excel */}
        {(fileData.data.type === "csv" || fileData.data.type === "excel") &&
          fileData.data.summary && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Column Statistics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-600">
                        Column
                      </th>
                      <th className="text-left py-2 font-medium text-gray-600">
                        Type
                      </th>
                      <th className="text-left py-2 font-medium text-gray-600">
                        Min
                      </th>
                      <th className="text-left py-2 font-medium text-gray-600">
                        Max
                      </th>
                      <th className="text-left py-2 font-medium text-gray-600">
                        Average
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(fileData.data.summary).map(
                      ([column, stats]) => (
                        <tr key={column} className="border-b border-gray-100">
                          <td className="py-2 font-medium text-gray-900">
                            {column}
                          </td>
                          <td className="py-2 text-gray-600">
                            {stats.dataType}
                          </td>
                          <td className="py-2 text-gray-600">
                            {stats.min ?? "N/A"}
                          </td>
                          <td className="py-2 text-gray-600">
                            {stats.max ?? "N/A"}
                          </td>
                          <td className="py-2 text-gray-600">
                            {stats.avg ?? "N/A"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SummaryView; 