"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundGradient } from "./ui/background-gradient";
import {
  IconChartBar,
  IconFileText,
  IconMessages,
  IconCpu,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

const DashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-zinc-800 rounded-md w-1/3 mb-2"></div>
    <div className="h-6 bg-zinc-800 rounded-md w-1/2 mb-10"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-40 bg-zinc-900 rounded-xl"></div>
      ))}
    </div>
  </div>
);

// A reusable Stat Card component
const StatCard = ({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
}) => (
  <BackgroundGradient
    containerClassName="rounded-xl"
    className="rounded-xl bg-zinc-900 p-6 flex flex-col justify-between h-full"
  >
    <div>
      <div className="flex items-center justify-between text-zinc-400">
        <p className="font-semibold">{title}</p>
        {icon}
      </div>
      <p className="text-4xl font-bold mt-2 text-white">
        {(value ?? 0).toLocaleString()}
      </p>
    </div>
    <p className="text-xs text-zinc-500 mt-4">{description}</p>
  </BackgroundGradient>
);

const Dashboard = () => {
  const pathname = usePathname();
  const { user } = useAuth(pathname);
  const router = useRouter();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: api.getDashboardStats,
    enabled: !!user,
  });

  const createChatMutation = useMutation({
    mutationFn: () => api.createChat({ title: "New Chat" }),
    onSuccess: (newChat) => {
      router.push(`/chats/${newChat.id}`);
    },
  });

  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Welcome back, <span className="text-blue-400">{user?.username}</span>!
        </h1>
        <p className="text-zinc-400">
          Here&apos;s a summary of your activity. Let&apos;s create something
          new today.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Call to Action */}
        <div
          onClick={() => createChatMutation.mutate()}
          className="md:col-span-2 lg:col-span-4 p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <h3 className="text-xl font-bold text-white">Start a New Chat</h3>
          <p className="text-zinc-400 mt-1">
            Upload a new document and start generating insights and charts right
            away.
          </p>
        </div>

        {/* Stat Cards */}
        <StatCard
          title="Total Chats"
          value={stats.chats}
          description="Number of conversations started."
          icon={<IconMessages className="h-6 w-6" />}
        />
        <StatCard
          title="Documents"
          value={stats.documents}
          description="Files processed for analysis."
          icon={<IconFileText className="h-6 w-6" />}
        />
        <StatCard
          title="Charts"
          value={stats.charts}
          description="Visualizations generated from data."
          icon={<IconChartBar className="h-6 w-6" />}
        />
        <StatCard
          title="Tokens Used"
          value={stats.tokensUsed}
          description="Estimated AI model consumption."
          icon={<IconCpu className="h-6 w-6" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
