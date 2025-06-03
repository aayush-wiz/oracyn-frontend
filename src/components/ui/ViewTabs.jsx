const ViewTabs = ({ activeView, onViewChange }) => {
  const views = [
    { key: "table", label: "Data Table" },
    { key: "chart", label: "Charts" },
    { key: "wordcloud", label: "Word Cloud" },
    { key: "summary", label: "Summary" },
  ];

  return (
    <div className="px-6 py-3 border-b border-gray-200">
      <div className="flex space-x-4">
        {views.map((view) => (
          <button
            key={view.key}
            onClick={() => onViewChange(view.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeView === view.key
                ? "bg-amber-400 text-white"
                : "bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-800"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewTabs; 