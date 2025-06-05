import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  User,
  Database,
  Shield,
  Zap,
  Settings2,
  ChevronLeft,
  Search,
} from "lucide-react";

const Settings = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const navigationItems = [
    {
      to: "/settings/profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      description: "Manage your personal information and preferences",
    },
    {
      to: "/settings/data",
      label: "Data",
      icon: <Database className="w-5 h-5" />,
      description: "View and manage your documents and storage",
    },
    {
      to: "/settings/security",
      label: "Security",
      icon: <Shield className="w-5 h-5" />,
      description: "Password, authentication, and privacy settings",
    },
    {
      to: "/settings/integrations",
      label: "Integrations",
      icon: <Zap className="w-5 h-5" />,
      description: "Connect external services and manage API keys",
    },
  ];

  const filteredItems = navigationItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActive = (path) => location.pathname === path;
  const currentSection = navigationItems.find((item) => isActive(item.to));

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="pl-2">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Settings2 className="w-8 h-8 text-blue-600" />
                Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[calc(100%-120px)] overflow-auto">
          <div className="flex h-full">
            {/* Sidebar Navigation */}
            <div className="w-80 border-r border-gray-200 bg-gray-50/50">
              {/* Navigation Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Configuration
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose what you'd like to configure
                </p>
              </div>

              {/* Navigation Items */}
              <div className="p-4 space-y-2">
                {filteredItems.map((item) => (
                  <Link key={item.to} to={item.to}>
                    <div
                      className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive(item.to)
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                          : "hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            isActive(item.to)
                              ? "bg-blue-500"
                              : "bg-gray-100 group-hover:bg-blue-100"
                          }`}
                        >
                          <div
                            className={`${
                              isActive(item.to)
                                ? "text-white"
                                : "text-gray-600 group-hover:text-blue-600"
                            }`}
                          >
                            {item.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold mb-1 ${
                              isActive(item.to) ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.label}
                          </h3>
                          <p
                            className={`text-sm leading-relaxed ${
                              isActive(item.to)
                                ? "text-blue-100"
                                : "text-gray-600"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {isActive(item.to) && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Content Header */}
              {currentSection && (
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <div className="text-blue-600">{currentSection.icon}</div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {currentSection.label} Settings
                      </h2>
                      <p className="text-sm text-gray-600">
                        {currentSection.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-auto bg-gray-50/30">
                {location.pathname === "/settings" ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Welcome to Settings
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md">
                        Select a section from the sidebar to configure your
                        account settings and preferences.
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                        {navigationItems.slice(0, 4).map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-center group"
                          >
                            <div className="text-gray-600 group-hover:text-blue-600 mb-2 flex justify-center">
                              {item.icon}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.label}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Outlet />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
