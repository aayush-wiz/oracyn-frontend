import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Star,
  Clock,
  Settings,
  User,
  ChevronRight,
  ChevronLeft,
  LogOut,
  FileText,
  Search,
  Bookmark,
} from "lucide-react";
import SavedAnalysesModal from "../modals/SavedAnalysesModal";
import { Link } from "react-router-dom";
import ChatItem from "../interactive/ChatItem.jsx";
import AllChatsModal from "../modals/AllChatModal.jsx";
import StarredChatsModal from "../modals/StarredChatModal.jsx";

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
  const [isStarredModalOpen, setIsStarredModalOpen] = useState(false);
  const [isAllChatsModalOpen, setIsAllChatsModalOpen] = useState(false);
  const [openChatOptionId, setOpenChatOptionId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Refs for modal management
  const sidebarScrollRef = useRef(null);
  const settingsButtonRef = useRef(null);

  const handleStartNewChat = () => {
    const hasEmptyChat = chats.some((chat) => chat.isEmpty);
    if (!hasEmptyChat) {
      const newChat = {
        id: Date.now(),
        name: `New Analysis`,
        isEmpty: true,
        isStarred: false,
      };
      setChats([newChat, ...chats]);
    }
  };

  const handleToggleSidebar = () => {
    setIsMinimized(!isMinimized);
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

  // Disable sidebar scroll when modals are open
  useEffect(() => {
    if (sidebarScrollRef.current) {
      if (openChatOptionId || isSettingsModalOpen) {
        sidebarScrollRef.current.style.overflowY = "hidden";
      } else {
        sidebarScrollRef.current.style.overflowY = "auto";
      }
    }
  }, [openChatOptionId, isSettingsModalOpen]);

  // Global click handler to close modals
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Close chat options if clicking outside
      if (openChatOptionId) {
        const chatModal = document.querySelector(
          `[data-chat-modal="${openChatOptionId}"]`
        );
        const chatButton = document.querySelector(
          `[data-chat-button="${openChatOptionId}"]`
        );

        if (
          chatModal &&
          !chatModal.contains(e.target) &&
          chatButton &&
          !chatButton.contains(e.target)
        ) {
          setOpenChatOptionId(null);
        }
      }

      // Close settings modal if clicking outside
      if (isSettingsModalOpen) {
        const settingsModal = document.querySelector("[data-settings-modal]");

        if (
          settingsModal &&
          !settingsModal.contains(e.target) &&
          settingsButtonRef.current &&
          !settingsButtonRef.current.contains(e.target)
        ) {
          setIsSettingsModalOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleGlobalClick);
    return () => document.removeEventListener("mousedown", handleGlobalClick);
  }, [openChatOptionId, isSettingsModalOpen]);

  // Filter chats
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const starredChats = filteredChats.filter((chat) => chat.isStarred);
  const regularChats = filteredChats.filter((chat) => !chat.isStarred);

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-400 ${
        isMinimized ? "w-16" : "w-80"
      }`}
    >
      {isMinimized ? (
        // Minimized Sidebar
        <div className="flex flex-col h-full items-center py-4 gap-3">
          <button
            onClick={handleToggleSidebar}
            className="relative w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors group cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-blue-600" />
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50">
              Expand
            </div>
          </button>

          <button
            onClick={handleStartNewChat}
            className="relative w-10 h-10 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors group cursor-pointer"
          >
            <Plus className="w-5 h-5 text-green-600" />
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50">
              Start New Chat
            </div>
          </button>

          <button
            onClick={() => setIsStarredModalOpen(true)}
            className="relative w-10 h-10 bg-yellow-50 hover:bg-yellow-100 rounded-lg flex items-center justify-center transition-colors group cursor-pointer"
          >
            <Star className="w-5 h-5 text-yellow-600" />
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50">
              Starred Chats
            </div>
          </button>

          <button
            onClick={() => setIsAllChatsModalOpen(true)}
            className="relative w-10 h-10 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors group cursor-pointer"
          >
            <Clock className="w-5 h-5 text-purple-600" />
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50">
              Recent Chats
            </div>
          </button>

          <button
            onClick={() => setIsSavedAnalysesOpen(true)}
            className="relative w-10 h-10 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors group cursor-pointer"
          >
            <Bookmark className="w-5 h-5 text-indigo-600" />
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50">
              Saved Chats
            </div>
          </button>

          <div className="flex-1"></div>

          <div className="relative">
            <button
              ref={settingsButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsModalOpen(!isSettingsModalOpen);
                setOpenChatOptionId(null);
              }}
              className="relative w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors group cursor-pointer"
            >
              <User className="w-5 h-5 text-gray-600" />
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50">
                Settings
              </div>
            </button>

            {isSettingsModalOpen && (
              <div
                data-settings-modal
                className="fixed left-16 bottom-4 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999]"
              >
                <Link to="/settings/profile">
                  <div className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </div>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer">
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <Link to="/dashboard">
                  <span className="text-xl font-bold text-black cursor-pointer">
                    DocAnalyzer
                  </span>
                </Link>
              </div>
              <button
                onClick={handleToggleSidebar}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <button
              onClick={handleStartNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
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
            <div ref={sidebarScrollRef} className="h-full overflow-y-auto">
              {/* Quick Actions */}
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsSavedAnalysesOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4" />
                    Saved
                  </button>
                  <button
                    onClick={() => setIsAllChatsModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors cursor-pointer"
                  >
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
                    <h3 className="text-md font-500 text-gray-700 underline">
                      Starred
                    </h3>
                  </div>
                  <div
                    className={`space-y-1 ${
                      starredChats.length > 3
                        ? "max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        : ""
                    }`}
                  >
                    {starredChats.map((chat, index) => (
                      <ChatItem
                        key={chat.id}
                        chat={chat}
                        isEditing={editingChatId === chat.id}
                        editingName={editingName}
                        onEdit={handleStartRename}
                        onSave={handleSaveRename}
                        onCancel={handleCancelRename}
                        onKeyPress={handleRenameKeyPress}
                        onStar={handleStarChat}
                        onDelete={handleDeleteChat}
                        openOptionsId={openChatOptionId}
                        setOpenOptionsId={setOpenChatOptionId}
                        setEditingName={setEditingName}
                        isLast={index === starredChats.length - 1}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Analyses */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h3 className="text-md font-medium text-gray-700 underline">
                    Recent
                  </h3>
                </div>
                <div className="space-y-1">
                  {regularChats.map((chat, index) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isEditing={editingChatId === chat.id}
                      editingName={editingName}
                      onEdit={handleStartRename}
                      onSave={handleSaveRename}
                      onCancel={handleCancelRename}
                      onKeyPress={handleRenameKeyPress}
                      onStar={handleStarChat}
                      onDelete={handleDeleteChat}
                      openOptionsId={openChatOptionId}
                      setOpenOptionsId={setOpenChatOptionId}
                      setEditingName={setEditingName}
                      isLast={index === regularChats.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="relative ">
              <button
                ref={settingsButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSettingsModalOpen(!isSettingsModalOpen);
                  setOpenChatOptionId(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
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
              </button>

              {isSettingsModalOpen && (
                <div
                  data-settings-modal
                  className="fixed bottom-16 left-4 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999]"
                >
                  <Link to="/settings/profile">
                    <div className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                      <Settings className="w-4 h-4 text-gray-500" />
                      Settings
                    </div>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer">
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
      <AllChatsModal
        isOpen={isAllChatsModalOpen}
        onClose={() => setIsAllChatsModalOpen(false)}
        onSelectAnalysis={onSelectAnalysis}
      />
      <StarredChatsModal
        isOpen={isStarredModalOpen}
        onClose={() => setIsStarredModalOpen(false)}
        onSelectAnalysis={onSelectAnalysis}
      />
    </div>
  );
};

export default Sidebar;
