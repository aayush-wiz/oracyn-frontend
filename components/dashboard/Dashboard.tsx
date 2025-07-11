"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "@/components/ui/TaskCard";
import Button from "@/components/ui/button";

const Dashboard = () => {
  interface Stats {
    chartsCreated: number;
    chatsCreated: number;
    documentsProcessed: number;
    tokensUsed: number;
  }

  const [userName, setUserName] = useState<string | null>("User");
  const [stats, setStats] = useState<Stats>({
    chartsCreated: 0,
    chatsCreated: 0,
    documentsProcessed: 0,
    tokensUsed: 0,
  });
  const [hover, setHover] = useState<boolean>(false);

  const getStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stats`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const { chats, charts, documents, tokens } = response.data;
      setStats({
        chartsCreated: charts,
        chatsCreated: chats,
        documentsProcessed: documents,
        tokensUsed: tokens,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data?.user?.username) {
        setUserName(response.data.user.username);
      } else {
        setUserName("Guest");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserName("Guest");
    }
  };

  useEffect(() => {
    getUserDetails();
    getStats();
  }, []);

  return (
    <div className="bg-slate-950 text-white min-h-screen w-full px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome, {userName} 👋</h1>
        <p className="text-lg text-slate-400">
          Here are your current stats across the platform.
        </p>
      </header>

      {/* Stats Overview */}
      <section>
        <h2 className="text-2xl font-semibold mb-1">Your Stats</h2>
        <p className="text-sm text-slate-400 mb-4">
          These reflect your engagement with the system.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TaskCard
            title="Charts"
            description="Chart generated successfully"
            progress={stats.chartsCreated * 10}
            accentColor="#3b82f6"
          />
          <TaskCard
            title="Chats Created"
            description="Engage in conversations"
            progress={stats.chatsCreated * 10}
            accentColor="#3b82f6"
          />
          <TaskCard
            title="Documents Processed"
            description="Number of documents processed"
            progress={stats.documentsProcessed * 10}
            accentColor="#3b82f6"
          />
          <TaskCard
            title="Tokens Used"
            description="Total tokens consumed"
            progress={stats.tokensUsed * 0.01}
            accentColor="#3b82f6"
          />
        </div>
      </section>

      {/* Create New Chat */}
      <section className="flex flex-col items-center justify-center gap-4 rounded-lg bg-slate-900 py-10 px-6 mt-6">
        <h3 className="text-xl font-medium text-white">
          Start Exploring Your Document
        </h3>
        <div className="relative">
          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white"
          >
            Create New Chat
          </Button>

          {/* Tooltip */}
          {hover && (
            <div
              className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap
                       bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-md shadow-lg z-10
                       animate-fade-in"
            >
              You can create {10 - (stats?.chatsCreated ?? 0)} more chats.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
