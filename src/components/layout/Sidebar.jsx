import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Upload,
  Settings,
  X,
  Plus,
  Star,
  Clock,
  BarChart3,
} from "lucide-react";
import { useDocuments } from "../../hooks/useDocuments.js";
import { dateUtils } from "../../utils/helper.js";
import clsx from "clsx";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { recentDocuments, createDocument, isCreatingDocument } =
    useDocuments();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Documents", href: "/analyze", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument("New Analysis");
      window.location.href = `/analyze/${newDoc.id}`;
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <>
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent
          navigation={navigation}
          recentDocuments={recentDocuments}
          location={location}
          onCreateDocument={handleCreateDocument}
          isCreatingDocument={isCreatingDocument}
        />
      </div>

      {/* Sidebar for mobile */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 transform lg:hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                DocAnalyzer
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <SidebarContent
            navigation={navigation}
            recentDocuments={recentDocuments}
            location={location}
            onCreateDocument={handleCreateDocument}
            isCreatingDocument={isCreatingDocument}
            onClose={onClose}
          />
        </div>
      </div>
    </>
  );
};

const SidebarContent = ({
  navigation,
  recentDocuments,
  location,
  onCreateDocument,
  isCreatingDocument,
  onClose,
}) => {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
      {/* Logo - Desktop only */}
      <div className="hidden lg:flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            DocAnalyzer
          </span>
        </div>
      </div>

      {/* New Document Button */}
      <div className="p-4">
        <button
          onClick={onCreateDocument}
          disabled={isCreatingDocument}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
        >
          {isCreatingDocument ? (
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Plus className="w-5 h-5 mr-2" />
          )}
          <span className="font-medium">
            {isCreatingDocument ? "Creating..." : "New Analysis"}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            (item.href === "/analyze" &&
              location.pathname.startsWith("/analyze"));

          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={clsx(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={clsx(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Recent Documents */}
      {recentDocuments.length > 0 && (
        <div className="px-4 pb-4">
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-2 px-3 mb-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Recent
              </h3>
            </div>

            <div className="space-y-1">
              {recentDocuments.slice(0, 5).map((doc) => (
                <NavLink
                  key={doc.id}
                  to={`/analyze/${doc.id}`}
                  onClick={onClose}
                  className="group flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 group-hover:text-gray-900 truncate">
                        {doc.name}
                      </span>
                      {doc.status === "STARRED" && (
                        <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {doc.documentCount} doc
                        {doc.documentCount !== 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {dateUtils.getRelativeTime(doc.updatedAt)}
                      </span>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <BarChart3 className="w-4 h-4" />
          <span>AI-Powered Analysis</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
