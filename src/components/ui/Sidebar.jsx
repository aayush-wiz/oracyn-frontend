import { useState, useEffect, useRef } from "react";
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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const modalRef = useRef(null);

  const handleStartNewChat = () => {
    // Check if there's already an empty chat
    const hasEmptyChat = chats.some((chat) => chat.isEmpty);

    if (!hasEmptyChat) {
      // Create a new chat
      const newChat = {
        id: Date.now(), // Simple ID generation
        name: `Chat ${chats.length + 1}`,
        isEmpty: true,
        isStarred: false,
      };
      setChats([newChat, ...chats]); // Add to beginning of array
    }
  };

  const handleToggleChatOptions = (chatId) => {
    setOpenChatOptionId(openChatOptionId === chatId ? null : chatId);
    setIsProfileModalOpen(false); // Close profile modal when opening chat options
  };

  const handleToggleProfileModal = () => {
    setIsProfileModalOpen((prev) => !prev);
    setOpenChatOptionId(null); // Close chat options when opening profile modal
  };

  const handleToggleSidebar = () => {
    setIsMinimized(!isMinimized);
    // Close any open modals when toggling
    setOpenChatOptionId(null);
    setIsProfileModalOpen(false);
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
        setIsProfileModalOpen(false);
      }
    };

    if (openChatOptionId || isProfileModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openChatOptionId, isProfileModalOpen]);

  // Separate starred and regular chats
  const starredChats = chats.filter((chat) => chat.isStarred);
  const regularChats = chats.filter((chat) => !chat.isStarred);

  return (
    <div
      className={`bg-amber-50 h-screen flex flex-col transition-all duration-300 ${
        isMinimized ? "w-16" : "w-1/5"
      }`}
    >
      {isMinimized ? (
        // Minimized Sidebar
        <div className="flex flex-col h-full items-center py-4 gap-4">
          {/* Toggle Button */}
          <button
            onClick={handleToggleSidebar}
            className="w-10 h-10 bg-amber-200 mt-1 rounded-full flex items-center justify-center hover:bg-amber-300 transition-all duration-500 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Start New Chat Icon */}
          <button className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center hover:bg-amber-300 transition-all duration-500 cursor-pointer">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          {/* Starred Icon */}
          <div className="w-10 h-10 bg-amber-200 hover:bg-amber-300 rounded-lg flex items-center justify-center transition-all duration-500 cursor-pointer">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>

          {/* Recent Icon */}
          <div className="w-10 h-10 bg-amber-200 hover:bg-amber-300 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Profile Icon */}
          <button
            onClick={handleToggleProfileModal}
            className="w-10 h-10 bg-amber-300 rounded-full flex items-center justify-center hover:bg-amber-400 transition-all duration-500 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Profile Modal for Minimized View */}
          {isProfileModalOpen && (
            <div
              ref={modalRef}
              className="absolute right-2 bottom-16 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-500"
            >
              <div className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1">
                Profile
              </div>
              <div className="h-px bg-amber-200 my-1"></div>
              <div className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1">
                Settings
              </div>
              <div className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1 text-red-600">
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        // Expanded Sidebar
        <>
          {/* Fixed Header */}
          <div className="flex flex-col gap-4 px-2 py-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSidebar}
                className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center hover:bg-amber-300 transition-all duration-500 cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="text-2xl flex items-center underline font-bold h-14">
                DocAnalyzer
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* Start a new chat */}
              <button
                onClick={handleStartNewChat}
                className="flex items-center gap-2 cursor-pointer hover:bg-amber-100 rounded-lg p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <div className="text-lg font-medium">Start a new chat</div>
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col gap-4 h-full">
              {/* Starred */}
              <div className="flex flex-col gap-2 px-2">
                <div className="text-md underline font-semibold">Starred</div>
                {/* Starred chats - scrollable after 3 items */}
                <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                  {starredChats.length > 0 ? (
                    starredChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`text-md font-medium rounded-md px-1 py-1 cursor-pointer relative ${
                          openChatOptionId !== chat.id
                            ? "hover:bg-amber-200"
                            : ""
                        } ${chat.isEmpty ? "text-gray-500 italic" : ""}`}
                      >
                        <div className="flex items-center gap-2 justify-between">
                          {editingChatId === chat.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onBlur={() => handleSaveRename(chat.id)}
                              onKeyDown={(e) =>
                                handleRenameKeyPress(e, chat.id)
                              }
                              className="flex-1 text-md font-medium bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <div className="flex-1 text-md font-medium">
                              {chat.name} {chat.isEmpty && "(empty)"}
                            </div>
                          )}
                          {editingChatId !== chat.id && (
                            <button
                              onClick={() => handleToggleChatOptions(chat.id)}
                              className={`text-md font-medium rounded-md px-1 py-1 cursor-pointer ${
                                openChatOptionId === chat.id
                                  ? "bg-amber-200"
                                  : ""
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-black hover:text-gray-500 cursor-pointer"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                          )}
                          {openChatOptionId === chat.id && (
                            <div
                              ref={modalRef}
                              className="absolute w-30 right-0 top-full mt-1 bg-white rounded-md shadow-lg py-1 z-100 border border-gray-500"
                            >
                              <div
                                onClick={() => handleStarChat(chat.id)}
                                className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1"
                              >
                                Unstar
                              </div>
                              {/*Divider*/}
                              <div className="h-px bg-amber-200 my-1"></div>
                              <div
                                onClick={() =>
                                  handleStartRename(chat.id, chat.name)
                                }
                                className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1"
                              >
                                Rename
                              </div>
                              <div
                                onClick={() => handleDeleteChat(chat.id)}
                                className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1 text-red-600"
                              >
                                Delete
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm italic px-1">
                      No starred chats
                    </div>
                  )}
                </div>
              </div>

              {/* Chat History */}
              <div className="flex flex-col flex-1 border-t min-h-0">
                <div className="flex flex-col h-full pl-2">
                  {/* Recents */}
                  <div className="text-md underline font-semibold py-2 flex-shrink-0">
                    Recents
                  </div>
                  {/* Recent chats - scrollable */}
                  <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-0 pr-2">
                    {/* Show user-created chats and dummy chats */}
                    {regularChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`text-md font-medium rounded-md px-1 py-1 cursor-pointer relative ${
                          openChatOptionId !== chat.id
                            ? "hover:bg-amber-200"
                            : ""
                        } ${chat.isEmpty ? "text-gray-500 italic" : ""}`}
                      >
                        <div className="flex items-center gap-2 justify-between">
                          {editingChatId === chat.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onBlur={() => handleSaveRename(chat.id)}
                              onKeyDown={(e) =>
                                handleRenameKeyPress(e, chat.id)
                              }
                              className="flex-1 text-md font-medium bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <div className="flex-1 text-md font-medium">
                              {chat.name} {chat.isEmpty && "New Chat"}
                            </div>
                          )}
                          {editingChatId !== chat.id && (
                            <button
                              onClick={() => handleToggleChatOptions(chat.id)}
                              className={`text-md font-medium rounded-md px-1 py-1 cursor-pointer ${
                                openChatOptionId === chat.id
                                  ? "bg-amber-200"
                                  : ""
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-black hover:text-gray-500 cursor-pointer"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                          )}
                          {openChatOptionId === chat.id && (
                            <div
                              ref={modalRef}
                              className="absolute w-30 right-0 top-full mt-1 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-500"
                            >
                              <div
                                onClick={() => handleStarChat(chat.id)}
                                className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1"
                              >
                                {chat.isStarred ? "Unstar" : "Star"}
                              </div>
                              {/*Divider*/}
                              <div className="h-px bg-black my-1"></div>
                              <div
                                onClick={() =>
                                  handleStartRename(chat.id, chat.name)
                                }
                                className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1"
                              >
                                Rename
                              </div>
                              <div
                                onClick={() => handleDeleteChat(chat.id)}
                                className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1 text-red-600"
                              >
                                Delete
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Profile Section */}
          <div className="flex-shrink-0 p-2 border-t">
            {/* Profile */}
            <div className="relative">
              <button
                onClick={handleToggleProfileModal}
                className={`flex flex-col gap-2 p-2 w-full cursor-pointer rounded-md ${
                  isProfileModalOpen ? "bg-amber-200" : "hover:bg-amber-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-300 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">User Name</span>
                </div>
              </button>

              {isProfileModalOpen && (
                <div
                  ref={modalRef}
                  className="absolute w-full right-0 bottom-full mb-4 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-500"
                >
                  <div className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1">
                    Profile
                  </div>
                  {/*Divider*/}
                  <div className="h-px bg-black my-1"></div>
                  <div className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1">
                    Settings
                  </div>
                  <div className="text-md hover:bg-amber-200 rounded-sm cursor-pointer px-2 py-1 text-red-600">
                    Logout
                  </div>
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

export default Sidebar;
