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

  const getActiveNav = (pathname) => {
    if (pathname === "/" || pathname.includes("/dashboard")) return "dashboard";
    if (pathname.includes("/chat")) return "chat";
    if (pathname.includes("/charts")) return "charts";
    if (pathname.includes("/settings")) return "settings";
    return "dashboard";
  };

  const [activeNav, setActiveNav] = useState(getActiveNav(location.pathname));

  useEffect(() => {
    setActiveNav(getActiveNav(location.pathname));
  }, [location.pathname]);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      path: "/dashboard",
      gradient: "from-blue-500 to-purple-600",
      glow: "shadow-blue-500/25",
    },
    {
      id: "chat",
      label: "Chat",
      icon: ChatIcon,
      path: "/chat",
      gradient: "from-green-500 to-emerald-600",
      glow: "shadow-green-500/25",
    },
    {
      id: "charts",
      label: "Charts",
      icon: ChartsIcon,
      path: "/charts",
      gradient: "from-purple-500 to-pink-600",
      glow: "shadow-purple-500/25",
    },
  ];

  return (
    <>
      {/* Main Sidebar */}
      <div className="fixed top-0 left-0 z-50 h-screen w-20 hover:w-80 group transition-all duration-500 ease-out">
        {/* Background with geometric pattern */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl border-r border-gray-800">
          {/* Geometric corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-gray-600/50"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-gray-600/50"></div>
          
          {/* Animated geometric elements */}
          <div className="absolute top-1/4 right-2 w-8 h-8 border border-gray-700/30 rotate-45 transition-transform duration-700 group-hover:rotate-90"></div>
          <div className="absolute bottom-1/3 right-3 w-6 h-6 border border-gray-600/30 transition-transform duration-700 group-hover:rotate-45"></div>
          
          {/* Expanding glow effect */}
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-white/10 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="flex items-center h-20 border-b border-gray-800/50">
            <div 
              className="flex items-center cursor-pointer group/logo w-full px-3"
              onClick={() => navigate("/dashboard")}
            >
              {/* Logo Icon - Fixed Position */}
              <div className="w-14 flex justify-center flex-shrink-0">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-gray-600/50 rounded-lg"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <OracynLogo className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Logo Text - Appears to the right */}
              <div className="flex-1 overflow-hidden">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  <span className="text-xl font-black text-white tracking-tight">Oracyn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`relative flex items-center h-14 rounded-xl transition-all duration-300 group/nav overflow-hidden mx-3 ${
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} ${item.glow} shadow-lg` 
                      : "hover:bg-gray-800/60"
                  }`}
                >
                  {/* Icon - Fixed Position */}
                  <div className="w-14 flex justify-center flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? "bg-white/20 scale-110" 
                        : "group-hover/nav:bg-gray-700/50 group-hover/nav:scale-110"
                    }`}>
                      <Icon className={`w-6 h-6 transition-colors duration-300 ${
                        isActive ? "text-white" : "text-gray-400 group-hover/nav:text-gray-200"
                      }`} />
                    </div>
                  </div>
                  
                  {/* Label - Appears to the right */}
                  <div className="flex-1 overflow-hidden">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      <span className={`text-lg font-bold whitespace-nowrap ${
                        isActive ? "text-white" : "text-gray-300"
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}

                  {/* Hover Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/nav:translate-x-full transition-transform duration-700"></div>
                </Link>
              );
            })}

            {/* History Button */}
            <div className="mx-3">
              <button
                onClick={onHistoryClick}
                className="relative flex items-center h-14 w-full rounded-xl transition-all duration-300 group/nav hover:bg-gray-800/60 overflow-hidden"
              >
                {/* Icon - Fixed Position */}
                <div className="w-14 flex justify-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover/nav:bg-gray-700/50 group-hover/nav:scale-110">
                    <HistoryIcon className="w-6 h-6 text-gray-400 group-hover/nav:text-gray-200 transition-colors duration-300" />
                  </div>
                </div>
                
                {/* Label - Appears to the right */}
                <div className="overflow-hidden">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    <span className="text-lg font-bold text-gray-300 whitespace-nowrap">
                      History
                    </span>
                  </div>
                </div>

                {/* Hover Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/nav:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          </nav>

          {/* Profile Section */}
          <div className="p-3 border-t border-gray-800/50">
            <button
              onClick={() => navigate("/settings")}
              className={`relative flex items-center h-16 w-full rounded-xl transition-all duration-300 group/profile overflow-hidden ${
                activeNav === "settings"
                  ? "bg-gradient-to-r from-orange-500 to-yellow-600 shadow-orange-500/25 shadow-lg"
                  : "hover:bg-gray-800/60"
              }`}
            >
              {/* Profile Icon - Fixed Position */}
              <div className="w-14 flex justify-center flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeNav === "settings"
                    ? "bg-white/20 scale-110"
                    : "group-hover/profile:bg-gray-700/50 group-hover/profile:scale-110"
                }`}>
                  {activeNav === "settings" ? (
                    <SettingsIcon className="w-7 h-7 text-white" />
                  ) : (
                    <UserProfileIcon className="w-7 h-7" />
                  )}
                </div>
              </div>
              
              {/* Profile Info - Appears to the right */}
              <div className="flex-1 overflow-hidden">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  <div className={`${activeNav === "settings" ? "text-white" : "text-gray-300"}`}>
                    <p className="text-sm font-bold">John Doe</p>
                    <p className="text-xs opacity-80">
                      {activeNav === "settings" ? "Settings" : "john.doe@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Indicator */}
              {activeNav === "settings" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-white rounded-r-full"></div>
              )}

              {/* Hover Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/profile:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;