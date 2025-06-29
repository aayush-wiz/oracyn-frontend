"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { userAtom } from "@/lib/atoms";
import { SidebarBody, SidebarLink, useSidebar } from "./ui/sidebar";
import {
  IconLayoutDashboard,
  IconMessages,
  IconChartBar,
  IconSettings,
  IconPlus,
  IconLogout,
  IconHexagonLetterO,
} from "@tabler/icons-react";

export const AppSidebar = ({ signout }: { signout: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { open, animate } = useSidebar();
  const [user] = useAtom(userAtom);

  // This is the single source of truth for the chat list
  const { data: chats, isLoading: isLoadingChats } = useQuery({
    queryKey: ["chats"],
    queryFn: api.getChats,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const createChatMutation = useMutation({
    mutationFn: () => api.createChat({ title: "New Chat" }),
    onSuccess: (newChat) => {
      // Instantly update the UI by adding the new chat to the cached list
      queryClient.setQueryData(["chats"], (oldData: any[] | undefined) =>
        oldData ? [newChat, ...oldData] : [newChat]
      );
      router.push(`/chats/${newChat.id}`);
    },
    onError: (error) => {
      console.error("Failed to create chat:", error);
      // You could add a user-facing toast notification here
    },
  });

  const handleNewChat = () => {
    // Prevent action if chat list is not yet loaded
    if (!chats) return;

    // 1. Find if a chat with the default title already exists.
    const emptyChat = chats.find((chat) => chat.title === "New Chat");

    // 2. If it exists, navigate to it instead of creating a new one.
    if (emptyChat) {
      router.push(`/chats/${emptyChat.id}`);
    } else {
      // 3. Otherwise, create a new one.
      createChatMutation.mutate();
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconLayoutDashboard className="text-neutral-400 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Charts",
      href: "/charts",
      icon: <IconChartBar className="text-neutral-400 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const bottomLinks = [
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="text-neutral-400 h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <SidebarBody className="flex flex-col justify-between py-4">
      {/* Top section: Logo, New Chat, Main links, and History */}
      <div className="flex flex-col gap-2">
        <SidebarLink
          link={{
            label: "ORACYN",
            href: "/",
            icon: (
              <IconHexagonLetterO className="text-blue-500 h-7 w-7 flex-shrink-0" />
            ),
          }}
          className="font-bold text-xl !text-white"
        />

        <button
          onClick={handleNewChat}
          disabled={createChatMutation.isPending || isLoadingChats}
          className="flex items-center gap-2 w-full text-white bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed group/sidebar"
        >
          <div className="w-12 h-10 flex items-center justify-center">
            <IconPlus size={20} className="flex-shrink-0" />
          </div>
          <motion.span
            animate={{
              display: open ? "inline-block" : "none",
              opacity: open ? 1 : 0,
            }}
            className="whitespace-pre"
          >
            {createChatMutation.isPending ? "Creating..." : "New Chat"}
          </motion.span>
        </button>

        <div className="flex flex-col gap-2 mt-4">
          {links.map((link) => (
            <SidebarLink
              key={link.label}
              link={link}
              className={cn(pathname === link.href && "bg-zinc-800 rounded-lg")}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <motion.span
            animate={{
              display: open ? "inline-block" : "none",
              opacity: open ? 1 : 0,
            }}
            className="text-xs text-neutral-500 px-4"
          >
            History
          </motion.span>
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-2">
            {isLoadingChats && (
              <span className="text-xs text-neutral-500 px-4">Loading...</span>
            )}
            {chats?.map((chat: { id: string; title: string }) => (
              <SidebarLink
                key={chat.id}
                link={{
                  href: `/chats/${chat.id}`,
                  label: chat.title,
                  icon: (
                    <IconMessages className="text-neutral-400 h-5 w-5 flex-shrink-0" />
                  ),
                }}
                className={cn(
                  "!w-full",
                  pathname === `/chats/${chat.id}` && "bg-zinc-800 rounded-lg"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section: Settings and Sign Out */}
      <div className="flex flex-col gap-2">
        {bottomLinks.map((link) => (
          <SidebarLink
            key={link.label}
            link={link}
            className={cn(pathname === link.href && "bg-zinc-800 rounded-lg")}
          />
        ))}
        <SidebarLink
          onClick={signout}
          link={{
            label: "Sign Out",
            href: "#",
            icon: (
              <IconLogout className="text-neutral-400 h-5 w-5 flex-shrink-0" />
            ),
          }}
        />
      </div>
    </SidebarBody>
  );
};
