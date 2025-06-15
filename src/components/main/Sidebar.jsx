import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  OracynLogo,
  DashboardIcon,
  ChatIcon,
  ChartsIcon,
  SettingsIcon,
  HistoryIcon,
  UserProfileIcon,
} from "../ui/Icons";

const Sidebar = ({ onHistoryClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get active nav from current path
  const currentPath = location.pathname.substring(1) || "dashboard";
  const [activeNav, setActiveNav] = useState(currentPath);

  // Update active nav when route changes
  useEffect(() => {
    const path = location.pathname.substring(1) || "dashboard";
    setActiveNav(path);
  }, [location.pathname]);

  // --- Styles for reuse (avoids repeating long class strings) ---
  const navItemBase =
    "flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200";
  const navItemIdle = "hover:bg-gray-800/50";
  const navItemActive = "text-white bg-gray-800/80";

  // --- Data for Navigation Links ---
  const navLinks = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      path: "/dashboard",
    },
    { id: "chat", label: "ChatAssistant", icon: ChatIcon, path: "/chat" },
    { id: "charts", label: "Charts", icon: ChartsIcon, path: "/charts" },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      path: "/settings",
    },
  ];

  const handleNavigation = (link) => {
    setActiveNav(link.id);
    navigate(link.path);
  };

  return (
    <div className="relative">
      {/* The sidebar itself */}
      <aside className="fixed top-0 left-0 h-full w-[72px] hover:w-64 bg-gray-900/90 backdrop-blur-xl border-r border-gray-700/30 z-50 transition-all duration-300 ease-in-out group">
        <div className="flex flex-col h-full p-3">
          {/* Logo and App Name */}
          <div className="flex items-center h-16 shrink-0 mb-4 pl-1">
            <div className="logo-flicker">
              <OracynLogo />
            </div>
            <span className="text-xl font-bold text-white ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
              Oracyn
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow">
            {navLinks.map((link) => (
              <div
                key={link.id}
                className={`nav-item ${navItemBase} ${
                  activeNav === link.id
                    ? navItemActive + " active"
                    : navItemIdle
                }`}
                onClick={() => handleNavigation(link)}
              >
                <div className={activeNav === link.id ? "icon-flicker" : ""}>
                  <link.icon
                    className={`w-7 h-7 shrink-0 ${
                      activeNav === link.id ? "text-white" : "text-gray-400"
                    }`}
                  />
                </div>
                <span className="ml-4 font-semibold text-gray-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                  {link.label}
                </span>
              </div>
            ))}

            {/* History Button */}
            <div
              className={`nav-item ${navItemBase} ${navItemIdle}`}
              onClick={onHistoryClick}
            >
              <HistoryIcon className="w-7 h-7 shrink-0 text-gray-400" />
              <span className="ml-4 font-semibold text-gray-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                History
              </span>
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="mt-auto shrink-0 border-t border-gray-700/50 pt-4">
            <div className="flex items-center">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <UserProfileIcon />
              </div>
              <div className="ml-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                <p className="font-semibold text-white text-sm">John Doe</p>
                <p className="text-xs text-gray-400">john.doe@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
