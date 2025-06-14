import React from "react";
import { X } from "lucide-react";

const HistoryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-slate-400">
            Your recent activity will appear here.
          </p>
          {/* Add your history items here */}
          <div className="space-y-2">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-white text-sm">Dashboard visited</p>
              <p className="text-slate-400 text-xs">2 minutes ago</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-white text-sm">Chart analysis completed</p>
              <p className="text-slate-400 text-xs">15 minutes ago</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-white text-sm">Settings updated</p>
              <p className="text-slate-400 text-xs">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
