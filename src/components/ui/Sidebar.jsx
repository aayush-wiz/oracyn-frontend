import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Star,
  Clock,
  Settings,
  User,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Edit3,
  Trash2,
  LogOut,
  FileText,
  Search,
  Bookmark,
} from "lucide-react";
import SavedAnalysesModal from "../modals/SavedAnalysesModal";

// Import or define your dummy data here
const dummyChats = [
  {
    id: 1735574400000,
    name: "Financial Report Analysis",
    isEmpty: false,
    isStarred: true,
  },
  {
    id: 1735488000000,
    name: "Marketing Strategy Review",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 1735401600000,
    name: "Q4 Sales Data",
    isEmpty: false,
    isStarred: true,
  },
  {
    id: 1735315200000,
    name: "Customer Feedback Summary",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 1735228800000,
    name: "Product Launch Metrics",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 1735142400000,
    name: "Untitled Chat",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 1735142400040,
    name: "Untitled Chat 2",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 1735142403040,
    name: "Untitled Chat 3",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 17351424034220,
    name: "Untitled Chat 4",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 17355424034220,
    name: "Untitled Chat 5",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 13351424034220,
    name: "Untitled Chat 6",
    isEmpty: false,
    isStarred: false,
  },
  {
    id: 13351424134220,
    name: "Untitled Chat 7",
    isEmpty: false,
    isStarred: false,
  },
];

const Sidebar = ({ onSelectAnalysis }) => {
  const [chats, setChats] = useState(dummyChats);
  const [isSavedAnalysesOpen, setIsSavedAnalysesOpen] = useState(false);
  const [openChatOptionId, setOpenChatOptionId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef(null);

  const handleStartNewChat = () => {
    // Check if there's already an empty chat
    const hasEmptyChat = chats.some((chat) => chat.isEmpty);

    if (!hasEmptyChat) {
      // Create a new chat
      const newChat = {
        id: Date.now(), // Simple ID generation
        name: `New Analysis`,
        isEmpty: true,
        isStarred: false,
      };
      setChats([newChat, ...chats]); // Add to beginning of array
    }
  };

  const handleToggleChatOptions = (chatId) => {
    setOpenChatOptionId(openChatOptionId === chatId ? null : chatId);
    setIsSettingsModalOpen(false); // Close Settings modal when opening chat options
  };

  const handleToggleSettingsModal = () => {
    setIsSettingsModalOpen((prev) => !prev);
    setOpenChatOptionId(null); // Close chat options when opening Settings modal
  };

  const handleToggleSidebar = () => {
    setIsMinimized(!isMinimized);
    // Close any open modals when toggling
    setOpenChatOptionId(null);
    setIsSettingsModalOpen(false);
  };

  const handleStarChat = (chatId) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, isStarred: !chat.isStarred } : chat
      )
    );
    setOpenChatOptionId(null);
  };

  const handleDeleteChat = (chatId) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
    setOpenChatOptionId(null);
  };

  const handleStartRename = (chatId, currentName) => {
    setEditingChatId(chatId);
    setEditingName(currentName);
    setOpenChatOptionId(null);
  };

  const handleSaveRename = (chatId) => {
    if (editingName.trim()) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, name: editingName.trim() } : chat
        )
      );
    }
    setEditingChatId(null);
    setEditingName("");
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditingName("");
  };

  const handleRenameKeyPress = (e, chatId) => {
    if (e.key === "Enter") {
      handleSaveRename(chatId);
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenChatOptionId(null);
        setIsSettingsModalOpen(false);
      }
    };

    if (openChatOptionId || isSettingsModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openChatOptionId, isSettingsModalOpen]);

  // Filter chats based on search
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate starred and regular chats
  const starredChats = filteredChats.filter((chat) => chat.isStarred);
  const regularChats = filteredChats.filter((chat) => !chat.isStarred);

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
        isMinimized ? "w-16" : "w-80"
      }`}
    >
      {isMinimized ? (
        // Minimized Sidebar
        <div className="flex flex-col h-full items-center py-4 gap-3">
          {/* Toggle Button */}
          <button
            onClick={handleToggleSidebar}
            className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors group"
          >
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </button>

          {/* Start New Chat Icon */}
          <button
            onClick={handleStartNewChat}
            className="w-10 h-10 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors group"
            title="New Analysis"
          >
            <Plus className="w-5 h-5 text-green-600" />
          </button>

          {/* Starred Icon */}
          <button
            className="w-10 h-10 bg-yellow-50 hover:bg-yellow-100 rounded-lg flex items-center justify-center transition-colors"
            title="Starred"
          >
            <Star className="w-5 h-5 text-yellow-600" />
          </button>

          {/* Recent Icon */}
          <button
            className="w-10 h-10 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
            title="Recent"
          >
            <Clock className="w-5 h-5 text-purple-600" />
          </button>

          {/* Saved Analyses */}
          <button
            onClick={() => setIsSavedAnalysesOpen(true)}
            className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors"
            title="Saved Analyses"
          >
            <Bookmark className="w-5 h-5 text-indigo-600" />
          </button>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Settings Icon */}
          <div className="relative">
            <button
              onClick={handleToggleSettingsModal}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
              title="Account"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>

            {/* Settings Modal for Minimized View */}
            {isSettingsModalOpen && (
              <div
                ref={modalRef}
                className="absolute left-full ml-2 bottom-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <Link to="/settings/profile">
                  <div className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </div>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Expanded Sidebar
        <>
          {/* Header */}
          <div className="flex flex-col p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  DocAnalyzer
                </span>
              </div>
              <button
                onClick={handleToggleSidebar}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* New Analysis Button */}
            <button
              onClick={handleStartNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              New Analysis
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {/* Quick Actions */}
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsSavedAnalysesOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                    Saved
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
                    <Clock className="w-4 h-4" />
                    Recent
                  </button>
                </div>
              </div>

              {/* Starred Analyses */}
              {starredChats.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-sm font-semibold text-gray-700">
                      Starred
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {starredChats.slice(0, 5).map((chat) => (
                      <ChatItem
                        key={chat.id}
                        chat={chat}
                        isEditing={editingChatId === chat.id}
                        editingName={editingName}
                        onEdit={handleStartRename}
                        onSave={handleSaveRename}
                        onCancel={handleCancelRename}
                        onKeyPress={handleRenameKeyPress}
                        onToggleOptions={handleToggleChatOptions}
                        onStar={handleStarChat}
                        onDelete={handleDeleteChat}
                        openOptionsId={openChatOptionId}
                        modalRef={modalRef}
                        setEditingName={setEditingName}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Analyses */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">
                    Recent
                  </h3>
                </div>
                <div className="space-y-1">
                  {regularChats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isEditing={editingChatId === chat.id}
                      editingName={editingName}
                      onEdit={handleStartRename}
                      onSave={handleSaveRename}
                      onCancel={handleCancelRename}
                      onKeyPress={handleRenameKeyPress}
                      onToggleOptions={handleToggleChatOptions}
                      onStar={handleStarChat}
                      onDelete={handleDeleteChat}
                      openOptionsId={openChatOptionId}
                      modalRef={modalRef}
                      setEditingName={setEditingName}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <button
                onClick={handleToggleSettingsModal}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isSettingsModalOpen ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">
                    John Doe
                  </div>
                  <div className="text-xs text-gray-500">
                    john.doe@company.com
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>

              {isSettingsModalOpen && (
                <div
                  ref={modalRef}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </div>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <SavedAnalysesModal
        isOpen={isSavedAnalysesOpen}
        onClose={() => setIsSavedAnalysesOpen(false)}
        onSelectAnalysis={onSelectAnalysis}
      />
    </div>
  );
};

// Chat Item Component
const ChatItem = ({
  chat,
  isEditing,
  editingName,
  onEdit,
  onSave,
  onCancel,
  onKeyPress,
  onToggleOptions,
  onStar,
  onDelete,
  openOptionsId,
  modalRef,
  setEditingName,
}) => {
  return (
    <div className="group relative">
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
              onClick={() => onToggleOptions(chat.id)}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center transition-all"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </>
        )}
      </div>

      {openOptionsId === chat.id && !isEditing && (
        <div
          ref={modalRef}
          className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
          <button
            onClick={() => onStar(chat.id)}
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
            onClick={() => onDelete(chat.id)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
