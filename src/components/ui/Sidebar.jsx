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
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { authAPI } from "../../services/api.js";
import ChatItem from "../interactive/ChatItem.jsx";
import AllChatsModal from "../modals/AllChatModal.jsx";
import StarredChatsModal from "../modals/StarredChatModal.jsx";
import SavedAnalysesModal from "../modals/SavedAnalysesModal.jsx";
import Loading, {
  LoadingCenter,
} from "./Loading.jsx";

const Sidebar = ({ onSelectAnalysis }) => {
  const { user, token, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [isSavedAnalysesOpen, setIsSavedAnalysesOpen] = useState(false);
  const [isStarredModalOpen, setIsStarredModalOpen] = useState(false);
  const [isAllChatsModalOpen, setIsAllChatsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [openChatOptionId, setOpenChatOptionId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Loading states
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Refs for modal management
  const sidebarScrollRef = useRef(null);
  const settingsButtonRef = useRef(null);

  // Fetch chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;

      setIsLoadingChats(true);
      try {
        const chatsData = await authAPI.getChats(token);
        setChats(
          chatsData.map((chat) => ({
            id: chat.id,
            name: chat.title || "Untitled Chat",
            isEmpty: !chat.documents?.length && !chat.messages?.length,
            isStarred: chat.status === "STARRED",
          }))
        );
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoadingChats(false);
        setIsInitialLoad(false);
      }
    };
    fetchChats();
  }, [token]);

  // Helper function to generate unique chat name
  const generateUniqueChatName = (baseName = "New Analysis") => {
    const existingNames = chats.map((chat) => chat.name.toLowerCase());

    if (!existingNames.includes(baseName.toLowerCase())) {
      return baseName;
    }

    let counter = 1;
    let newName;
    do {
      newName = `${baseName} ${counter}`;
      counter++;
    } while (existingNames.includes(newName.toLowerCase()));

    return newName;
  };

  const handleStartNewChat = async () => {
    try {
      // Check if there's already an empty chat
      const existingEmptyChat = chats.find((chat) => chat.isEmpty);
      if (existingEmptyChat) {
        // If there's an empty chat, just select it instead of creating a new one
        onSelectAnalysis?.(existingEmptyChat.id);
        return;
      }

      setIsCreatingChat(true);

      // Generate unique name for new chat
      const uniqueName = generateUniqueChatName();

      const newChat = await authAPI.createChat(token, uniqueName);
      const newChatData = {
        id: newChat.id,
        name: newChat.title || uniqueName,
        isEmpty: true,
        isStarred: false,
      };

      setChats([newChatData, ...chats]);
      onSelectAnalysis?.(newChat.id);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsCreatingChat(false);
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
    const trimmedName = editingName.trim();

    if (!trimmedName) {
      // If empty name, cancel the rename
      handleCancelRename();
      return;
    }

    // Check for duplicate names (excluding the current chat being renamed)
    const existingNames = chats
      .filter((chat) => chat.id !== chatId)
      .map((chat) => chat.name.toLowerCase());

    if (existingNames.includes(trimmedName.toLowerCase())) {
      // If duplicate name exists, generate a unique one
      const uniqueName = generateUniqueChatName(trimmedName);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, name: uniqueName } : chat
        )
      );
    } else {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, name: trimmedName } : chat
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

  // Show loading overlay when creating chat
  // Remove this section completely as we'll handle loading in the button

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
            disabled={isCreatingChat}
            className="relative w-10 h-10 bg-green-50 hover:bg-green-100 disabled:opacity-75 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors group cursor-pointer"
          >
            {isCreatingChat ? (
              <Loading
                type="button"
                size="sm"
                showMessage={false}
                color="green"
              />
            ) : (
              <Plus className="w-5 h-5 text-green-600" />
            )}
            {!isCreatingChat && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50">
                Start New Chat
              </div>
            )}
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
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                >
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
              disabled={isCreatingChat}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium cursor-pointer min-h-[48px]"
            >
              {isCreatingChat ? (
                <Loading
                  type="button"
                  size="sm"
                  message="Creating..."
                  color="white"
                />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  New Analysis
                </>
              )}
            </button>
          </div>

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

          <div className="flex-1 overflow-hidden">
            <div ref={sidebarScrollRef} className="h-full overflow-y-auto">
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

              {/* Loading state for initial load */}
              {isInitialLoad && isLoadingChats ? (
                <LoadingCenter message="Loading your analyses..." fullHeight />
              ) : (
                <>
                  {/* Loading state for refresh */}
                  {isLoadingChats && !isInitialLoad && (
                    <div className="p-4">
                      <Loading
                        type="inline"
                        size="sm"
                        message="Refreshing chats..."
                      />
                    </div>
                  )}

                  {starredChats.length > 0 && (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <h3 className="text-md font-medium text-gray-700 underline">
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
                            onClick={() => onSelectAnalysis?.(chat.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

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
                          onClick={() => onSelectAnalysis?.(chat.id)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="relative">
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
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
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
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                  >
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
        chats={chats.filter((chat) => chat.status === "SAVED")}
      />
      <AllChatsModal
        isOpen={isAllChatsModalOpen}
        onClose={() => setIsAllChatsModalOpen(false)}
        onSelectAnalysis={onSelectAnalysis}
        chats={chats}
      />
      <StarredChatsModal
        isOpen={isStarredModalOpen}
        onClose={() => setIsStarredModalOpen(false)}
        onSelectAnalysis={onSelectAnalysis}
        chats={starredChats}
      />
    </div>
  );
};

export default Sidebar;
