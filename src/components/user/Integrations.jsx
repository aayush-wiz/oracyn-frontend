import React, { useState } from "react";
import {
  Zap,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Key,
  RefreshCw,
  Trash2,
  Globe,
  Database,
  Cloud,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";

const Integrations = () => {
  const [activeTab, setActiveTab] = useState("available");

  const [connectedIntegrations] = useState([
    {
      id: 1,
      name: "OpenAI GPT-4",
      description: "Advanced language model for document analysis",
      category: "AI Models",
      icon: <Globe className="w-8 h-8" />,
      status: "connected",
      lastSync: "2 minutes ago",
      queries: 1247,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 2,
      name: "Google Drive",
      description: "Access and analyze documents from Google Drive",
      category: "Cloud Storage",
      icon: <Cloud className="w-8 h-8" />,
      status: "connected",
      lastSync: "1 hour ago",
      queries: 89,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 3,
      name: "Slack Notifications",
      description: "Get analysis results delivered to Slack",
      category: "Communication",
      icon: <MessageSquare className="w-8 h-8" />,
      status: "error",
      lastSync: "Failed",
      queries: 0,
      color: "bg-purple-100 text-purple-600",
    },
  ]);

  const [availableIntegrations] = useState([
    {
      id: 4,
      name: "Claude 3",
      description: "Anthropic's advanced AI model for document understanding",
      category: "AI Models",
      icon: <Globe className="w-8 h-8" />,
      status: "available",
      popular: true,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: 5,
      name: "Dropbox",
      description: "Connect your Dropbox for seamless document access",
      category: "Cloud Storage",
      icon: <Cloud className="w-8 h-8" />,
      status: "available",
      popular: true,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 6,
      name: "OneDrive",
      description: "Microsoft OneDrive integration for document storage",
      category: "Cloud Storage",
      icon: <Cloud className="w-8 h-8" />,
      status: "available",
      popular: false,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 7,
      name: "Microsoft Teams",
      description: "Share analysis results in Teams channels",
      category: "Communication",
      icon: <MessageSquare className="w-8 h-8" />,
      status: "available",
      popular: false,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 8,
      name: "Webhook",
      description: "Custom webhook for sending analysis results",
      category: "Developer Tools",
      icon: <Zap className="w-8 h-8" />,
      status: "available",
      popular: false,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 9,
      name: "PostgreSQL",
      description: "Store analysis results in PostgreSQL database",
      category: "Databases",
      icon: <Database className="w-8 h-8" />,
      status: "available",
      popular: false,
      color: "bg-gray-100 text-gray-600",
    },
  ]);

  const [apiKeys] = useState([
    {
      id: 1,
      name: "Production API Key",
      key: "ak_prod_****************************",
      created: "2024-05-15",
      lastUsed: "2 hours ago",
      permissions: ["read", "write", "admin"],
    },
    {
      id: 2,
      name: "Development API Key",
      key: "ak_dev_****************************",
      created: "2024-06-01",
      lastUsed: "1 day ago",
      permissions: ["read", "write"],
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const categories = [
    "All",
    "AI Models",
    "Cloud Storage",
    "Communication",
    "Databases",
    "Developer Tools",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredAvailable = availableIntegrations.filter(
    (integration) =>
      selectedCategory === "All" || integration.category === selectedCategory
  );

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Integrations</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Custom Integration
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "available"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Available ({availableIntegrations.length})
        </button>
        <button
          onClick={() => setActiveTab("connected")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "connected"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Connected ({connectedIntegrations.length})
        </button>
        <button
          onClick={() => setActiveTab("api")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "api"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          API Keys ({apiKeys.length})
        </button>
      </div>

      {/* Available Integrations Tab */}
      {activeTab === "available" && (
        <div>
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 text-sm rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Integration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAvailable.map((integration) => (
              <div
                key={integration.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${integration.color}`}>
                    {integration.icon}
                  </div>
                  {integration.popular && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-800 mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {integration.description}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {integration.category}
                </p>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  <Plus className="w-4 h-4" />
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Integrations Tab */}
      {activeTab === "connected" && (
        <div className="space-y-4">
          {connectedIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${integration.color}`}>
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {integration.name}
                      </h3>
                      {getStatusIcon(integration.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Category: {integration.category}</span>
                      <span>Last sync: {integration.lastSync}</span>
                      <span>Queries: {integration.queries}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-800 rounded-md hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {integration.status === "error" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Connection failed. Please check your credentials and try
                    reconnecting.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Manage API keys for programmatic access to the document analysis
              platform
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
              <Plus className="w-4 h-4" />
              Generate New Key
            </button>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {apiKey.name}
                      </h3>
                      <p className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-1 rounded mb-2">
                        {apiKey.key}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          Permissions:
                        </span>
                        {apiKey.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-800 rounded-md hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* API Documentation */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">
                  API Documentation
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Learn how to integrate the document analysis API into your
                  applications.
                </p>
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4" />
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
