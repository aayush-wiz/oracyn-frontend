import Sidebar from "../ui/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="bg-[#ffffe5] flex h-screen overflow-hidden">
      <Sidebar />
      {/* Divider */}

      <Outlet />
    </div>
  );
};

export default Layout; 