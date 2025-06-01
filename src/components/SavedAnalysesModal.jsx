import { useState } from 'react';
import Modal from './Modal';

const SavedAnalysesModal = ({ isOpen, onClose, onSelectAnalysis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, summary, extraction, comparison

  // Mock data - replace with actual saved analyses from your state/API
  const [savedAnalyses] = useState([
    {
      id: 1,
      title: "Q4 Financial Report Analysis",
      type: "summary",
      query: "Summarize the main financial insights from Q4 report",
      documents: ["Q4-report.pdf", "budget-analysis.xlsx"],
      createdAt: "2024-01-15 10:30 AM",
      tags: ["financial", "quarterly"],
      preview: "The Q4 financial report shows a 15% increase in revenue compared to the previous quarter..."
    },
    {
      id: 2,
      title: "Contract Terms Extraction",
      type: "extraction",
      query: "Extract all key terms and conditions from the contract",
      documents: ["service-contract.pdf"],
      createdAt: "2024-01-14 04:20 PM",
      tags: ["legal", "contract"],
      preview: "Key terms identified: Payment terms - Net 30 days, Service level agreement - 99.9% uptime..."
    },
    {
      id: 3,
      title: "Product Comparison Study",
      type: "comparison",
      query: "Compare features and pricing across all product documents",
      documents: ["product-a.pdf", "product-b.pdf", "pricing-sheet.xlsx"],
      createdAt: "2024-01-13 11:30 AM",
      tags: ["product", "comparison", "pricing"],
      preview: "Comparison analysis reveals that Product A offers better value for enterprise customers..."
    },
    {
      id: 4,
      title: "Regulatory Compliance Check",
      type: "extraction",
      query: "Find all regulatory compliance requirements",
      documents: ["compliance-doc.pdf", "regulations.pdf"],
      createdAt: "2024-01-12 02:15 PM",
      tags: ["compliance", "regulatory"],
      preview: "Identified 12 compliance requirements including GDPR, SOX, and industry-specific regulations..."
    }
  ]);

  const filteredAnalyses = savedAnalyses.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSelectAnalysis = (analysis) => {
    onSelectAnalysis(analysis);
    onClose();
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'summary':
        return (
          <svg className={`${iconClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'extraction':
        return (
          <svg className={`${iconClass} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      case 'comparison':
        return (
          <svg className={`${iconClass} text-purple-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClass} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Saved Analyses" size="xl">
      <div className="space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search saved analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Types</option>
            <option value="summary">Summary</option>
            <option value="extraction">Extraction</option>
            <option value="comparison">Comparison</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredAnalyses.length} analyses found</span>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>

        {/* Analyses Grid */}
        <div className="max-h-96 overflow-y-auto">
          {filteredAnalyses.length > 0 ? (
            <div className="grid gap-4">
              {filteredAnalyses.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleSelectAnalysis(item)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(item.type)}
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Export analysis:', item.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Export"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAnalysis(item);
                        }}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.preview}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{item.createdAt}</span>
                      <span>•</span>
                      <span>{item.documents.length} document{item.documents.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex space-x-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-gray-500">No saved analyses found matching your criteria.</p>
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
          <div className="flex space-x-2">
            <button
              onClick={() => {
                console.log('Export all analyses');
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            >
              Export All
            </button>
            <button
              onClick={() => {
                console.log('Delete selected analyses');
              }}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SavedAnalysesModal; 