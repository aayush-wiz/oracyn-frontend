// Main Chat Component
import { useState, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import ChatInputArea from "./chatcomponents/ChatInputArea";
import ChatArea from "./chatcomponents/ChatArea";
import FileUploadModal from "../../ui/FileUploadModal";

const Chat = () => {
  const { getCurrentChat, createNewChat, updateChat } = useStore();
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const currentChat = getCurrentChat();

  useEffect(() => {
    // Check if we need to show file upload modal
    if (!currentChat && useStore.getState().chats.length === 0) {
      const chatId = createNewChat();
      setShowFileUpload(true);
    } else if (
      currentChat &&
      !currentChat.document &&
      currentChat.messages.length === 0
    ) {
      setShowFileUpload(true);
    }
  }, [currentChat, createNewChat]);

  const handleFileUpload = (file) => {
    if (currentChat) {
      updateChat(currentChat.id, { document: file });
    }
  };

  const handleNewChat = () => {
    const currentChat = getCurrentChat();
    if (!currentChat || currentChat.messages.length > 0) {
      createNewChat();
      setShowFileUpload(true);
    }
  };

  return (
    <div className="bg-[#030508] h-screen flex flex-col">
      <div className="flex justify-between items-center px-6 py-4">
        <button
          onClick={handleNewChat}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          New Chat
        </button>
      </div>

      <div className="h-[80%] mx-[100px] flex overflow-y-auto">
        <ChatArea />
      </div>
      <div className="h-[10%] mx-[90px] my-5">
        <ChatInputArea />
      </div>

      <FileUploadModal
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default Chat;
