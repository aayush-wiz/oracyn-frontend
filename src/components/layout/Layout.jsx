// components/Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HistoryModal from "../main/HistoryModal";

const Layout = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex h-screen bg-[#030508]">
      {/* Sidebar */}
      <Sidebar onHistoryClick={() => setShowHistory(true)} />

      {/* Main Content Area */}
      <main className="flex-1 ml-[72px] overflow-hidden">
        <Outlet />
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

export default Layout;
