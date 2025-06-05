import { FileSpreadsheet } from "lucide-react";

const CSVViewer = ({ file }) => {
  // Mock CSV data
  const mockCSVData = [
    ["Product", "Category", "Price", "Stock", "Rating"],
    ["iPhone 14", "Electronics", "$999", "150", "4.5"],
    ["MacBook Pro", "Electronics", "$2,399", "75", "4.8"],
    ["AirPods", "Electronics", "$249", "200", "4.3"],
    ["iPad Air", "Electronics", "$599", "120", "4.6"],
    ["Apple Watch", "Electronics", "$399", "85", "4.4"],
  ];

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-emerald-50">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-900">{file.name}</h3>
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
            CSV
          </span>
        </div>
      </div>
      <div className="h-full p-6 overflow-auto">
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">CSV Data</h4>
          <p className="text-sm text-gray-600 mb-4">
            Raw CSV file visualization
          </p>
        </div>

        {/* CSV Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full">
            <thead className="bg-emerald-50">
              {mockCSVData.slice(0, 1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <th
                      key={cellIndex}
                      className="px-4 py-2 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider border-r border-emerald-200 last:border-r-0"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCSVData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-emerald-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Rows: {mockCSVData.length - 1} | Columns:{" "}
            {mockCSVData[0]?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CSVViewer;
