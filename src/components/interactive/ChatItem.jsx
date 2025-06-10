import { useRef, useState } from "react";
import {
  MoreHorizontal,
  Star,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";

const ChatItem = ({
  chat,
  isEditing,
  editingName,
  onEdit,
  onSave,
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

  // Local loading states for individual actions
  const [isStarring, setIsStarring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Optimistic update state
  const [optimisticState, setOptimisticState] = useState({
    isStarred: chat.isStarred,
    name: chat.name,
  });

  const handleToggleOptions = (e) => {
    e.stopPropagation();
    setOpenOptionsId(openOptionsId === chat.id ? null : chat.id);
    setActionError(null); // Clear any previous errors
  };

  const handleStar = async (e) => {
    e.stopPropagation();

    if (isStarring) return; // Prevent double-clicks

    setIsStarring(true);
    setActionError(null);

    // Optimistic update
    const previousState = optimisticState.isStarred;
    setOptimisticState((prev) => ({ ...prev, isStarred: !prev.isStarred }));

    try {
      const newStatus = chat.isStarred ? "NONE" : "STARRED";
      await authAPI.updateChat(token, chat.id, { status: newStatus });

      // Call parent handler to update the main state
      await onStar(chat.id);

      setOpenOptionsId(null);
    } catch (err) {
      console.error("Error starring chat:", err);

      // Rollback optimistic update
      setOptimisticState((prev) => ({ ...prev, isStarred: previousState }));
      setActionError(
        `Failed to ${chat.isStarred ? "unstar" : "star"} chat: ${err.message}`
      );
    } finally {
      setIsStarring(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (isDeleting) return; // Prevent double-clicks

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${chat.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setActionError(null);

    try {
      await authAPI.deleteChat(token, chat.id);

      // Call parent handler to update the main state
      await onDelete(chat.id);

      setOpenOptionsId(null);
    } catch (err) {
      console.error("Error deleting chat:", err);
      setActionError(`Failed to delete chat: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStartEdit = (e) => {
    e.stopPropagation();
    onEdit(chat.id, chat.name);
    setActionError(null);
  };

  const handleSaveEdit = async () => {
    if (isRenaming) return; // Prevent double-saves

    const trimmedName = editingName.trim();

    if (!trimmedName) {
      setActionError("Chat name cannot be empty");
      return;
    }

    if (trimmedName === chat.name) {
      // No change, just cancel
      onEdit(null, "");
      return;
    }

    setIsRenaming(true);
    setActionError(null);

    // Optimistic update
    const previousName = optimisticState.name;
    setOptimisticState((prev) => ({ ...prev, name: trimmedName }));

    try {
      await authAPI.updateChat(token, chat.id, { title: trimmedName });

      // Call parent handler to update the main state
      await onSave(chat.id);
    } catch (err) {
      console.error("Error renaming chat:", err);

      // Rollback optimistic update
      setOptimisticState((prev) => ({ ...prev, name: previousName }));
      setActionError(`Failed to rename chat: ${err.message}`);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onEdit(null, "");
      setActionError(null);
    }
  };

  const handleInputBlur = () => {
    // Only save if we're not already saving
    if (!isRenaming) {
      handleSaveEdit();
    }
  };

  const handleChatClick = () => {
    if (isEditing || isDeleting || isStarring) return; // Prevent clicks during operations
    onClick?.(chat.id);
  };

  const getModalPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };

    const rect = buttonRef.current.getBoundingClientRect();
    const modalHeight = 160; // Increased to account for potential error message
    const modalWidth = 160;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceToRight = viewportWidth - rect.left;

    let top, left;

    // Determine vertical position
    if (isLast || spaceBelow < modalHeight + 20) {
      top = rect.top + window.scrollY - modalHeight - 4;
    } else {
      top = rect.bottom + window.scrollY + 4;
    }

    // Determine horizontal position
    if (spaceToRight < modalWidth + 20) {
      left = rect.right + window.scrollX - modalWidth;
    } else {
      left = rect.left + window.scrollX;
    }

    return { top, left };
  };

  const modalPosition = getModalPosition();

  return (
    <>
      <div className="group" onClick={handleChatClick}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            openOptionsId === chat.id ? "bg-gray-100" : "hover:bg-gray-50"
          } ${
            isDeleting || isStarring ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {isEditing ? (
            <div className="flex-1">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyPress}
                className="w-full text-sm bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                disabled={isRenaming}
              />
              {isRenaming && (
                <div className="flex items-center gap-1 mt-1">
                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                  <span className="text-xs text-blue-600">Saving...</span>
                </div>
              )}
              {actionError && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-600">{actionError}</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {optimisticState.name}
                </div>
                {chat.isEmpty && (
                  <div className="text-xs text-gray-500">New analysis</div>
                )}
                {(isStarring || isDeleting) && (
                  <div className="flex items-center gap-1 mt-1">
                    <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                    <span className="text-xs text-gray-500">
                      {isStarring
                        ? optimisticState.isStarred
                          ? "Starring..."
                          : "Unstarring..."
                        : "Deleting..."}
                    </span>
                  </div>
                )}
              </div>
              <button
                ref={buttonRef}
                data-chat-button={chat.id}
                onClick={handleToggleOptions}
                disabled={isStarring || isDeleting || isRenaming}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center transition-all disabled:opacity-50"
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
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999] min-w-[140px]"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
          }}
        >
          {actionError && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-600">{actionError}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleStar}
            disabled={isStarring || isDeleting}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left disabled:opacity-50"
          >
            {isStarring ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <Star
                className={`w-4 h-4 ${
                  optimisticState.isStarred
                    ? "text-yellow-500 fill-current"
                    : "text-gray-400"
                }`}
              />
            )}
            {optimisticState.isStarred ? "Unstar" : "Star"}
          </button>

          <button
            onClick={handleStartEdit}
            disabled={isStarring || isDeleting || isRenaming}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4 text-gray-400" />
            Rename
          </button>

          <div className="border-t border-gray-100 my-1"></div>

          <button
            onClick={handleDelete}
            disabled={isStarring || isDeleting || isRenaming}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default ChatItem;
