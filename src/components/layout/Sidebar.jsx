import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  const getActiveNav = (pathname) => {
    if (pathname === "/" || pathname.includes("/dashboard")) return "dashboard";
    if (pathname.includes("/chat")) return "chat";
    if (pathname.includes("/charts")) return "charts";
    if (pathname.includes("/settings")) return "settings";
    return "dashboard";
  };

  const [activeNav, setActiveNav] = useState(getActiveNav(location.pathname));

  // Update active nav when route changes
  useEffect(() => {
    setActiveNav(getActiveNav(location.pathname));
  }, [location.pathname]);

  // --- Styles for reuse (avoids repeating long class strings) ---
  const navItemBase =
    "flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200";
  const navItemIdle = "hover:bg-slate-700/50";
  const navItemActive = "text-sky-300";

  return (
    <div className="relative">
      {/* The sidebar itself */}
      <aside className="fixed top-0 left-0 h-full w-[72px] hover:w-64 bg-slate-900/30 backdrop-blur-xl border-r border-sky-500/10 z-50 transition-all duration-300 ease-in-out group">
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
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={`nav-item ${navItemBase} ${
                activeNav === "dashboard"
                  ? navItemActive + " active"
                  : navItemIdle
              }`}
            >
              <DashboardIcon
                className={`w-7 h-7 shrink-0 ${
                  activeNav === "dashboard" ? "text-sky-300" : "text-slate-400"
                }`}
              />
              <span className="ml-4 font-semibold text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                Dashboard
              </span>
            </Link>

            {/* Chat Link */}
            <Link
              to="/chat"
              className={`nav-item ${navItemBase} ${
                activeNav === "chat" ? navItemActive + " active" : navItemIdle
              }`}
            >
              <ChatIcon
                className={`w-7 h-7 shrink-0 ${
                  activeNav === "chat" ? "text-sky-300" : "text-slate-400"
                }`}
              />
              <span className="ml-4 font-semibold text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                Chat
              </span>
            </Link>

            {/* Charts Link */}
            <Link
              to="/charts"
              className={`nav-item ${navItemBase} ${
                activeNav === "charts" ? navItemActive + " active" : navItemIdle
              }`}
            >
              <ChartsIcon
                className={`w-7 h-7 shrink-0 ${
                  activeNav === "charts" ? "text-sky-300" : "text-slate-400"
                }`}
              />
              <span className="ml-4 font-semibold text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                Charts
              </span>
            </Link>

            {/* History Button */}
            <div
              className={`nav-item ${navItemBase} ${navItemIdle}`}
              onClick={onHistoryClick}
            >
              <HistoryIcon className="w-7 h-7 shrink-0 text-slate-400" />
              <span className="ml-4 font-semibold text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                History
              </span>
            </div>
          </nav>

          {/* User Profile Section - Now clickable for Settings */}
          <div className="mt-auto shrink-0 border-t border-slate-700/50 pt-4">
            <div
              className={`flex items-center cursor-pointer rounded-lg p-2 transition-colors duration-200 ${
                activeNav === "settings"
                  ? "bg-slate-700/50"
                  : "hover:bg-slate-700/30"
              }`}
              onClick={() => navigate("/settings")}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                {activeNav === "settings" ? (
                  <SettingsIcon className="w-7 h-7 text-sky-300" />
                ) : (
                  <UserProfileIcon />
                )}
              </div>
              <div className="ml-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                <p className="font-semibold text-white text-sm">John Doe</p>
                <p className="text-xs text-slate-400">
                  {activeNav === "settings"
                    ? "Settings"
                    : "john.doe@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
