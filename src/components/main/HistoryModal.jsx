// History Modal Component
import { X } from "lucide-react";
import {useStore} from "../../store/useStore";


const HistoryModal = ({ isOpen, onClose }) => {
  const { chats, setCurrentChatId } = useStore();

  if (!isOpen) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-700 pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-white">History</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close history modal"
          >
            <X className="w-5 h-5 text-zinc-400 hover:text-white transition" />
          </button>
        </div>

        <div className="space-y-4">
          {chats.length === 0 ? (
            <p className="text-zinc-400 text-sm">
              Your recent chats will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    onClose();
                  }}
                  className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-4 py-3 hover:border-indigo-500 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {chat.name}
                      </p>
                      {chat.document && (
                        <p className="text-zinc-500 text-xs mt-1">
                          📎 {chat.document.name}
                        </p>
                      )}
                    </div>
                    <p className="text-zinc-400 text-xs">
                      {formatTime(chat.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
