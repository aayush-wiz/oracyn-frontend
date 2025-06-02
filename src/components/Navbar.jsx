import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import QueryHistoryModal from "./QueryHistoryModal";
import SavedAnalysesModal from "./SavedAnalysesModal";

const Navbar = ({ onSelectQuery, onSelectAnalysis, onSearch }) => {
  const [isQueryHistoryOpen, setIsQueryHistoryOpen] = useState(false);
  const [isSavedAnalysesOpen, setIsSavedAnalysesOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <>
      <div className="bg-white shadow-lg w-full border-b border-gray-500 px-2 h-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                {/* Logo */}
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              {/* Brand Name */}
              <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
                DocAnalyzer
              </h1>
            </Link>
          </div>

          {/* Center - Search Box */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search queries and analyses..."
                className="w-full pl-4 pr-20 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-gray-50 hover:bg-white transition-colors duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                {/* Clear Search Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      if (onSearch) {
                        onSearch("");
                      }
                    }}
                    className="p-1 mr-1 flex items-center justify-center cursor-pointer hover:bg-gray-200 hover:text-black rounded transition-colors duration-200"
                  >
                    {/* Clear Icon */}
                    <svg
                      className="h-4 w-4 text-gray-400 hover:text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                {/* Search Icon Button */}
                <button
                  type="submit"
                  onClick={handleSearchSubmit}
                  className="p-2 mr-1 flex items-center justify-center hover:bg-gray-200 hover:text-black rounded transition-colors duration-200 cursor-pointer"
                >
                  {/* Search Icon */}
                  <svg
                    className="h-4 w-4 text-gray-600 hover:text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 pr-2">
            {/* Queries History */}
            <button
              onClick={() => setIsQueryHistoryOpen(true)}
              className="hidden sm:flex p-2 text-black hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200 relative group hover:scale-105 hover:shadow-md cursor-pointer"
              title="Query History"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Query History
              </div>
            </button>

            {/* Saved Analyses */}
            <button
              onClick={() => setIsSavedAnalysesOpen(true)}
              className="hidden sm:flex p-2 text-black hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200 relative group hover:scale-105 hover:shadow-md cursor-pointer"
              title="Saved Analyses"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Saved Analyses
              </div>
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-black mx-2"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="p-2 text-black hover:text-black hover:bg-gray-200 hover:scale-105 hover:shadow-md rounded-lg transition-all duration-200 relative group cursor-pointer"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="hidden md:block text-left ml-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Profile
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-500">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <svg
                      className="mr-3 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile Settings
                  </Link>
                  <div className="border-t border-gray-500"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg
                      className="mr-3 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search queries and analyses..."
                className="w-full pl-4 pr-20 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-gray-50 hover:bg-white transition-colors duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      if (onSearch) {
                        onSearch("");
                      }
                    }}
                    className="p-1 mr-1 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded"
                  >
                    <svg
                      className="h-4 w-4 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  onClick={handleSearchSubmit}
                  className="p-2 mr-1 flex items-center justify-center hover:bg-gray-200 rounded transition-colors duration-200 cursor-pointer"
                >
                  <svg
                    className="h-4 w-4 text-gray-600 hover:text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* Mobile Action Buttons */}
            <div className="flex justify-center space-x-4 mt-4 sm:hidden">
              <button
                onClick={() => {
                  setIsQueryHistoryOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex flex-col items-center p-2 text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs">History</span>
              </button>

              <button
                onClick={() => {
                  setIsSavedAnalysesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex flex-col items-center p-2 text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span className="text-xs">Saved</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}

      {/* Modals */}
      <QueryHistoryModal
        isOpen={isQueryHistoryOpen}
        onClose={() => setIsQueryHistoryOpen(false)}
        onSelectQuery={onSelectQuery}
      />

      <SavedAnalysesModal
        isOpen={isSavedAnalysesOpen}
        onClose={() => setIsSavedAnalysesOpen(false)}
        onSelectAnalysis={onSelectAnalysis}
      />
    </>
  );
};

export default Navbar;
