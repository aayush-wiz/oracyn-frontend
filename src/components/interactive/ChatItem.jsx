import { useRef } from "react";
import { MoreHorizontal, Star, Edit3, Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";

const ChatItem = ({
  chat,
  isEditing,
  editingName,
  onEdit,
  onSave,
  onKeyPress,
  onStar,
  onDelete,
  openOptionsId,
  setOpenOptionsId,
  setEditingName,
  isLast,
  onClick,
}) => {
  const { token } = useAuth();
  const buttonRef = useRef(null);

  const handleToggleOptions = (e) => {
    e.stopPropagation();
    setOpenOptionsId(openOptionsId === chat.id ? null : chat.id);
  };

  const handleStar = async (e) => {
    e.stopPropagation();
    try {
      await authAPI.updateChat(
        token,
        chat.id,
        chat.isStarred ? "NONE" : "STARRED"
      );
      onStar(chat.id);
    } catch (err) {
      console.error("Error starring chat:", err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await authAPI.deleteChat(token, chat.id);
      onDelete(chat.id);
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const getModalPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    const modalHeight = 120;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    if (isLast || spaceBelow < modalHeight + 20) {
      return {
        top: rect.top + window.scrollY - modalHeight - 4,
        left: rect.left + window.scrollX - 100,
      };
    }
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX - 100,
    };
  };

  const modalPosition = getModalPosition();

  return (
    <>
      <div className="group" onClick={() => onClick?.(chat.id)}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            openOptionsId === chat.id ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          {isEditing ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => onSave(chat.id)}
              onKeyDown={(e) => onKeyPress(e, chat.id)}
              className="flex-1 text-sm bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {chat.name}
                </div>
                {chat.isEmpty && (
                  <div className="text-xs text-gray-500">New analysis</div>
                )}
              </div>
              <button
                ref={buttonRef}
                data-chat-button={chat.id}
                onClick={handleToggleOptions}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {openOptionsId === chat.id && !isEditing && (
        <div
          data-chat-modal={chat.id}
          className="fixed w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999]"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
          }}
        >
          <button
            onClick={handleStar}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left"
          >
            <Star
              className={`w-4 h-4 ${
                chat.isStarred
                  ? "text-yellow-500 fill-current"
                  : "text-gray-400"
              }`}
            />
            {chat.isStarred ? "Unstar" : "Star"}
          </button>
          <button
            onClick={() => onEdit(chat.id, chat.name)}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left"
          >
            <Edit3 className="w-4 h-4 text-gray-400" />
            Rename
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default ChatItem;
