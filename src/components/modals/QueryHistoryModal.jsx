import { useState } from 'react';
import Modal from './Modal';

const QueryHistoryModal = ({ isOpen, onClose, onSelectQuery }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual query history from your state/API
  const [queryHistory] = useState([
    {
      id: 1,
      query: "Summarize the main points of the uploaded documents",
      timestamp: "2024-01-15 10:30 AM",
      documentCount: 3,
      status: "completed"
    },
    {
      id: 2,
      query: "What are the key financial metrics mentioned?",
      timestamp: "2024-01-15 09:45 AM",
      documentCount: 2,
      status: "completed"
    },
    {
      id: 3,
      query: "Extract all dates and deadlines from the contract",
      timestamp: "2024-01-14 04:20 PM",
      documentCount: 1,
      status: "completed"
    },
    {
      id: 4,
      query: "Compare the pricing models in both documents",
      timestamp: "2024-01-14 02:15 PM",
      documentCount: 2,
      status: "failed"
    },
    {
      id: 5,
      query: "Find all mentions of regulatory compliance",
      timestamp: "2024-01-13 11:30 AM",
      documentCount: 4,
      status: "completed"
    }
  ]);

  const filteredHistory = queryHistory.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectQuery = (query) => {
    onSelectQuery(query.query);
    onClose();
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Query History" size="lg">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search query history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredHistory.length} queries found</span>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear search
          </button>
        </div>

        {/* Query List */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleSelectQuery(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(item.status)}
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {item.query}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span>{item.documentCount} document{item.documentCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectQuery(item);
                    }}
                    className="ml-4 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Use Query
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500">No queries found matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Add functionality to clear all history
              console.log('Clear all history');
            }}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          >
            Clear All History
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QueryHistoryModal; 