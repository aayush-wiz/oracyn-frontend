// eslint-disable @next/next/no-img-element
"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Check, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";

export const AppSidebar = ({ signout }: { signout: () => void }) => {
  interface Chat {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }
  const router = useRouter();

  let counter = 1;

  const [chats, setChats] = useState<Chat[]>([]);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [titleInputs, setTitleInputs] = useState<Record<string, string>>({});

  const handledeleteChat = async (chatId: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`,
        {
          withCredentials: true,
        }
      );
      setChats(chats.filter((chat) => chat.id !== chatId));
      router.push("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats`,
        { title: `New Chat ${counter++}` },
        {
          withCredentials: true,
        }
      );

      // Optional: navigate to the newly created chat
      router.push(`/chats/${response.data.id}`);

      // Refresh chat list in sidebar
      getChats();
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleChatTitleChange = async (chatId: string) => {
    const newTitle = titleInputs[chatId];
    if (!newTitle || !newTitle.trim()) return;

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`,
        { title: newTitle },
        { withCredentials: true }
      );

      // update chats list
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: response.data.title } : chat
        )
      );

      setEditingChatId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating chat title:", error);
    }
  };

  const getChats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats`,
        {
          withCredentials: true,
        }
      );
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div className="bg-gray-900 w-50 h-full flex flex-col items-center justify-center border-r  py-4">
      {/* Logo or Brand Name */}
      <Link href="/" className="text-white hover:underline">
        <div className="text-white font-bold text-2xl mb-4 underline ">
          ORACYN
        </div>
      </Link>
      {/* Navigation Links */}
      <div className="mt-4 h-full w-full py-4 space-y-2 flex flex-col items-center justify-between">
        <Button onClick={handleNewChat} className="cursor-pointer w-fit">
          Create New Chat
        </Button>
        {/* Main Navigation */}
        <div className="flex flex-col space-y-2 w-full">
          {/* Dashboard */}
          <Link href="/" className="text-white hover:underline">
            <Button className="cursor-pointer w-fit">Dashboard</Button>
          </Link>
          {/* Charts */}
          <Link href="/charts" className="text-white hover:underline">
            <Button className="cursor-pointer w-fit">Charts</Button>
          </Link>
        </div>
        {/* Chat Section */}
        <div className="flex flex-col my-4 h-full w-full bg-slate-950">
          <span className="text-slate-400 text-md font-semibold px-4 py-2 flex items-center justify-center">
            Chats
          </span>
          <hr />
          <div className="space-y-1 px-2">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between gap-2 px-2 py-1 hover:bg-slate-800 rounded-md transition-colors duration-150"
                >
                  <Link
                    href={`/chats/${chat.id}`}
                    className="flex-1 overflow-hidden"
                  >
                    {editingChatId === chat.id ? (
                      <input
                        type="text"
                        value={titleInputs[chat.id] || ""}
                        onChange={(e) =>
                          setTitleInputs((prev) => ({
                            ...prev,
                            [chat.id]: e.target.value,
                          }))
                        }
                        placeholder="Enter chat title"
                        className="w-full bg-transparent text-white placeholder:text-slate-400 border-b border-slate-600 focus:outline-none focus:border-slate-300 transition duration-200 text-sm sm:text-base"
                        autoFocus
                      />
                    ) : (
                      <span className="truncate text-white text-sm sm:text-base block">
                        {chat.title?.trim().length === 0
                          ? "Untitled Chat"
                          : chat.title.length > 25
                          ? `${chat.title.slice(0, 25)}...`
                          : chat.title}
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center gap-1 pl-2 shrink-0">
                    {editingChatId === chat.id ? (
                      <button
                        className="p-1 rounded hover:bg-slate-700"
                        onClick={() => handleChatTitleChange(chat.id)}
                      >
                        <Check className="w-4 h-4 text-slate-400" />
                      </button>
                    ) : (
                      <button
                        className="p-1 rounded hover:bg-slate-700"
                        onClick={() => {
                          setEditingChatId(chat.id);
                          setTitleInputs((prev) => ({
                            ...prev,
                            [chat.id]: chat.title,
                          }));
                        }}
                      >
                        <PenLine className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                    <button
                      className="p-1 rounded hover:bg-slate-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handledeleteChat(chat.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-slate-300 text-sm px-4 py-2">
                No chats available
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-2 w-full">
          {/* Settings */}
          <Link href="/settings" className="text-white hover:underline">
            <Button className="cursor-pointer w-fit">Settings</Button>
          </Link>
          {/* Charts */}
          <div onClick={signout} className="text-white hover:underline">
            <Button className="cursor-pointer w-fit">Sign Out</Button>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 text-white">
        <p>© 2025 ORACYN</p>
        <p>
          <a
            href="https://github.com/aayush-wiz"
            target="_blank"
            className="text-white hover:underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

export default AppSidebar;
