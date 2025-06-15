// Chart Tab Component
const ChartTab = ({ chart, onClose, onClick, isActive }) => (
  <div
    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-all ${
      isActive
        ? "bg-gray-800 border-b-2 border-blue-500"
        : "bg-gray-900 hover:bg-gray-800"
    }`}
    onClick={onClick}
  >
    <ChartIcon className="w-4 h-4 text-white" />
    <span className="text-white text-sm">{chart.title}</span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="text-gray-400 hover:text-white"
    >
      <CloseIcon className="w-3 h-3" />
    </button>
  </div>
);

export default ChartTab;
