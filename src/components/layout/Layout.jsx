import Sidebar from "../ui/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="bg-[#ffffe5] flex h-screen overflow-hidden">
      <Sidebar />
      {/* Divider */}
      <div className="w-px h-screen bg-gray-500 flex-shrink-0"></div>
      <Outlet />
    </div>
  );
};

export default Layout; 