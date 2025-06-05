import { FileSpreadsheet } from "lucide-react";

const ExcelViewer = ({ file }) => {
  // Mock spreadsheet data
  const mockData = [
    ["Name", "Age", "City", "Salary"],
    ["John Doe", "28", "New York", "$75,000"],
    ["Jane Smith", "32", "Los Angeles", "$82,000"],
    ["Mike Johnson", "45", "Chicago", "$91,000"],
    ["Sarah Wilson", "29", "Houston", "$68,000"],
  ];

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-green-50">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">{file.name}</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            {file.name.endsWith(".xlsx") ? "XLSX" : "XLS"}
          </span>
        </div>
      </div>
      <div className="h-full p-6 overflow-auto">
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Excel Spreadsheet
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Sample spreadsheet visualization
          </p>
        </div>

        {/* Mock Spreadsheet Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              {mockData.slice(0, 1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <th
                      key={cellIndex}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
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
            Actual spreadsheet data will be displayed here when integrated with
            backend
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExcelViewer;
