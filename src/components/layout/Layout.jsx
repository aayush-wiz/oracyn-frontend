// components/layout/Layout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import HistoryModal from "../main/HistoryModal";

const Layout = ({ children }) => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const openHistoryModal = () => setIsHistoryModalOpen(true);
  const closeHistoryModal = () => setIsHistoryModalOpen(false);

  return (
    <div className="min-h-screen bg-black">
      <div className="illuminated-grid"></div>
      <Sidebar onHistoryClick={openHistoryModal} />

      {/* Main content area */}
      <main className="ml-[72px] transition-all duration-300 ease-in-out">
        <div className="p-6">{children}</div>
      </main>

      {/* History Modal */}
      <HistoryModal isOpen={isHistoryModalOpen} onClose={closeHistoryModal} />
    </div>
  );
};

export default Layout;
