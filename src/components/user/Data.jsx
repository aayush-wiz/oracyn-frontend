import React, { useState } from "react";
import {
  FileText,
  Download,
  Trash2,
  Upload,
  HardDrive,
  Filter,
  Search,
  MoreVertical,
  Eye,
  AlertCircle,
} from "lucide-react";

const Data = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [documents] = useState([
    {
      id: 1,
      name: "Q4_Financial_Report.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2024-06-03",
      status: "processed",
      queries: 45,
      lastAccessed: "2 hours ago",
    },
    {
      id: 2,
      name: "Market_Analysis_2024.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadDate: "2024-06-02",
      status: "processing",
      queries: 12,
      lastAccessed: "1 day ago",
    },
    {
      id: 3,
      name: "Product_Specifications.txt",
      type: "TXT",
      size: "0.3 MB",
      uploadDate: "2024-06-01",
      status: "processed",
      queries: 78,
      lastAccessed: "3 hours ago",
    },
    {
      id: 4,
      name: "Research_Data.csv",
      type: "CSV",
      size: "5.2 MB",
      uploadDate: "2024-05-30",
      status: "failed",
      queries: 0,
      lastAccessed: "Never",
    },
    {
      id: 5,
      name: "Training_Manual.pdf",
      type: "PDF",
      size: "3.1 MB",
      uploadDate: "2024-05-28",
      status: "processed",
      queries: 23,
      lastAccessed: "5 hours ago",
    },
  ]);

  const [storageUsed] = useState({
    used: 12.8,
    total: 50.0,
    percentage: 25.6,
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      doc.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case "PDF":
        return "text-red-600 bg-red-100";
      case "DOCX":
        return "text-blue-600 bg-blue-100";
      case "TXT":
        return "text-gray-600 bg-gray-100";
      case "CSV":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Data Management
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors whitespace-nowrap">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Storage Overview */}
      <div className="mb-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Storage Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {storageUsed.used} GB
            </p>
            <p className="text-sm text-gray-600">Used</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {storageUsed.total} GB
            </p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {storageUsed.percentage}%
            </p>
            <p className="text-sm text-gray-600">Usage</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${storageUsed.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] md:min-w-[200px]">
                  Document
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] md:min-w-[80px]">
                  Type
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] md:min-w-[80px]">
                  Size
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px] md:min-w-[100px]">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] md:min-w-[80px]">
                  Queries
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] md:min-w-[120px]">
                  Last Accessed
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] md:min-w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 min-w-[120px] md:min-w-[200px]">
                    <div className="flex items-center min-w-0">
                      <FileText className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Uploaded {doc.uploadDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap min-w-[50px] md:min-w-[80px]">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeColor(
                        doc.type
                      )}`}
                    >
                      {doc.type}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[50px] md:min-w-[80px]">
                    {doc.size}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap min-w-[70px] md:min-w-[100px]">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[50px] md:min-w-[80px]">
                    {doc.queries}
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[80px] md:min-w-[120px]">
                    {doc.lastAccessed}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium min-w-[80px] md:min-w-[120px]">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Retention Settings */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Data Retention Settings
        </h3>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-medium text-amber-800">
                Automatic Data Cleanup
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Documents that haven't been accessed for more than 90 days will
                be automatically archived.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-delete processed documents after:
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Never</option>
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
            </select>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum storage per user:
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>50 GB</option>
              <option>100 GB</option>
              <option>250 GB</option>
              <option>Unlimited</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
