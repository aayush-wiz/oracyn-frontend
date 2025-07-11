"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [titleInputs, setTitleInputs] = useState<Record<string, string>>({});
  let counter = 1;

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`,
          { withCredentials: true }
        );

        setChats((prev) => prev.filter((chat) => chat.id !== chatId));

        // Navigate to home
        router.push("/");
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    },
    [router]
  );

  const handleNewChat = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats`,
        { title: `New Chat ${counter++}` },
        { withCredentials: true }
      );
      router.push(`/chats/${response.data.id}`);
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

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: response.data.title } : chat
        )
      );
      setEditingChatId(null);
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
    <div className="bg-slate-950 text-white w-64 h-screen flex flex-col justify-between border-r border-slate-800">
      {/* Top Section */}
      <div className="flex flex-col px-4 py-6 space-y-4">
        <Link
          href="/"
          className="text-2xl font-bold underline text-center cursor-pointer"
        >
          ORACYN
        </Link>

        <Button onClick={handleNewChat} className="w-full cursor-pointer">
          Create New Chat
        </Button>

        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button className="w-full cursor-pointer">Dashboard</Button>
          </Link>
          <Link href="/charts">
            <Button className="w-full cursor-pointer">Charts</Button>
          </Link>
        </div>

        {/* Chat Section */}
        <div className="mt-6">
          <h2 className="text-slate-400 border-b-2 font-semibold mb-2 text-center">
            Chats
          </h2>
          <div className="space-y-1 max-h-[calc(100vh-350px)] overflow-y-auto pr-1">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between hover:bg-slate-800 px-4 py-2 rounded-md transition-all group"
                >
                  {/* Left Section */}
                  <div className="flex-1 overflow-hidden">
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
                        className="w-full bg-transparent text-white placeholder:text-slate-400 border-b border-slate-600 focus:outline-none focus:border-slate-300 text-sm"
                        autoFocus
                      />
                    ) : (
                      <Link
                        href={`/chats/${chat.id}`}
                        className="text-sm font-medium text-slate-200 truncate block group-hover:text-white"
                      >
                        {chat.title?.trim().length === 0
                          ? "Untitled Chat"
                          : chat.title.length > 25
                          ? `${chat.title.slice(0, 25)}...`
                          : chat.title}
                      </Link>
                    )}
                  </div>

                  {/* Right Section - Action Buttons */}
                  <div className="flex items-center gap-1 ml-2">
                    {editingChatId === chat.id ? (
                      <button
                        onClick={() => handleChatTitleChange(chat.id)}
                        className="p-1 hover:bg-slate-700 rounded transition"
                      >
                        <Check className="w-4 h-4 text-green-400 group-hover:text-green-500" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingChatId(chat.id);
                          setTitleInputs((prev) => ({
                            ...prev,
                            [chat.id]: chat.title,
                          }));
                        }}
                        className="p-1 hover:bg-slate-700 rounded cursor-pointer transition"
                      >
                        <PenLine className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="p-1 hover:bg-slate-700 rounded cursor-pointer transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs px-2">No chats available</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 py-6 gap-0.5 flex flex-col space-y-2 border-t border-slate-800">
        <Link href="/settings" passHref>
          <Button className="w-full cursor-pointer">Settings</Button>
        </Link>
        <Button onClick={signout} className="w-full cursor-pointer">
          Sign Out
        </Button>
        <div className="mt-4 text-xs text-center text-slate-500">
          <p>© 2025 ORACYN</p>
          <a
            href="https://github.com/aayush-wiz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
