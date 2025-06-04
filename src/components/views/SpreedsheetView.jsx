import { useState, useMemo } from "react";

const CSVView = ({ fileData }) => {
  const [activeTab, setActiveTab] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  if (
    !fileData ||
    (fileData.data.type !== "csv" && fileData.data.type !== "excel")
  ) {
    return null;
  }

  const data = fileData.data.data || [];
  const columns = fileData.data.columns || [];

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle numeric sorting
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Handle string sorting
      const aStr = String(aValue || "").toLowerCase();
      const bStr = String(bValue || "").toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderTable = () => {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Data Table
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredData.length} of {data.length} rows • {columns.length}{" "}
                  columns
                </p>
              </div>

              {/* Rows per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    #
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="truncate">{column}</span>
                        {sortColumn === column && (
                          <svg
                            className={`w-4 h-4 ${
                              sortDirection === "asc"
                                ? "transform rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-gray-500 border-r border-gray-200">
                        {startIndex + index + 1}
                      </td>
                      {columns.map((column) => (
                        <td
                          key={column}
                          className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"
                          title={String(row[column] || "")}
                        >
                          {String(row[column] || "")}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No data found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + rowsPerPage, sortedData.length)} of{" "}
                {sortedData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const summary = fileData.data.summary || {};

    return (
      <div className="p-6 h-full overflow-auto">
        <div className="space-y-6 max-w-4xl">
          {/* File Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              File Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {data.length}
                </div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {columns.length}
                </div>
                <div className="text-sm text-gray-600">Columns</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(fileData.size / 1024).toFixed(1)}KB
                </div>
                <div className="text-sm text-gray-600">File Size</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {fileData.data.type.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">File Type</div>
              </div>
            </div>
          </div>

          {/* Column Analysis */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Column Analysis
            </h3>
            <div className="space-y-4">
              {columns.map((column) => {
                const columnSummary = summary[column] || {};
                return (
                  <div
                    key={column}
                    className="border border-gray-100 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{column}</h4>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          columnSummary.dataType === "numeric"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {columnSummary.dataType || "unknown"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Non-empty:</span>
                        <div className="font-medium">
                          {columnSummary.total || 0}
                        </div>
                      </div>
                      {columnSummary.dataType === "numeric" && (
                        <>
                          <div>
                            <span className="text-gray-600">Min:</span>
                            <div className="font-medium">
                              {columnSummary.min || "N/A"}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Max:</span>
                            <div className="font-medium">
                              {columnSummary.max || "N/A"}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Average:</span>
                            <div className="font-medium">
                              {columnSummary.avg || "N/A"}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCharts = () => {
    // Get numeric columns for chart creation
    const numericColumns = columns.filter((col) => {
      const summary = fileData.data.summary?.[col];
      return summary && summary.dataType === "numeric";
    });

    return (
      <div className="p-6 h-full overflow-auto">
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Data Visualization
            </h3>

            {numericColumns.length > 0 ? (
              <div className="space-y-6">
                {numericColumns.slice(0, 3).map((column) => {
                  // Create a simple histogram for numeric data
                  const values = data
                    .map((row) => parseFloat(row[column]))
                    .filter((val) => !isNaN(val))
                    .sort((a, b) => a - b);

                  if (values.length === 0) return null;

                  const min = Math.min(...values);
                  const max = Math.max(...values);
                  const range = max - min;
                  const bucketSize = range / 10;

                  const buckets = Array.from({ length: 10 }, (_, i) => {
                    const bucketMin = min + i * bucketSize;
                    const bucketMax = min + (i + 1) * bucketSize;
                    const count = values.filter(
                      (val) => val >= bucketMin && val < bucketMax
                    ).length;
                    return { min: bucketMin, max: bucketMax, count };
                  });

                  const maxCount = Math.max(...buckets.map((b) => b.count));

                  return (
                    <div
                      key={column}
                      className="border border-gray-100 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-gray-900 mb-3">
                        {column} Distribution
                      </h4>
                      <div className="space-y-1">
                        {buckets.map((bucket, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div className="text-xs text-gray-600 w-24">
                              {bucket.min.toFixed(1)}-{bucket.max.toFixed(1)}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-amber-400 h-4 rounded-full transition-all duration-300"
                                style={{
                                  width: `${(bucket.count / maxCount) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="text-xs text-gray-600 w-8">
                              {bucket.count}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Numeric Data
                </h4>
                <p className="text-sm text-gray-600">
                  No numeric columns found for visualization.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRaw = () => (
    <div className="p-6 h-full">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">Raw Data</h3>
          <p className="text-sm text-gray-600 mt-1">
            First 100 rows in JSON format
          </p>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-xs text-gray-800 font-mono leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(data.slice(0, 100), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex space-x-4">
          {[
            { key: "table", label: "Data Table", icon: "📊" },
            { key: "summary", label: "Summary", icon: "📈" },
            { key: "charts", label: "Charts", icon: "📉" },
            { key: "raw", label: "Raw Data", icon: "🔧" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-amber-400 text-white"
                  : "bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "table" && renderTable()}
        {activeTab === "summary" && renderSummary()}
        {activeTab === "charts" && renderCharts()}
        {activeTab === "raw" && renderRaw()}
      </div>
    </div>
  );
};

export default CSVView;
