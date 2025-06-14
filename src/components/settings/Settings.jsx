// components/settings/Settings.jsx
import React, { useState } from "react";
import { Save, User, Bell, Shield, Palette } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailAlerts: false,
    dataBackup: true,
    displayName: "John Doe",
    email: "john.doe@example.com",
    theme: "dark",
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const settingsCategories = [
    {
      title: "Profile Settings",
      icon: User,
      items: [
        { key: "displayName", label: "Display Name", type: "text" },
        { key: "email", label: "Email Address", type: "email" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { key: "notifications", label: "Enable Notifications", type: "toggle" },
        { key: "emailAlerts", label: "Email Alerts", type: "toggle" },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { key: "darkMode", label: "Dark Mode", type: "toggle" },
        {
          key: "theme",
          label: "Theme",
          type: "select",
          options: ["dark", "light", "auto"],
        },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { key: "dataBackup", label: "Automatic Data Backup", type: "toggle" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {settingsCategories.map((category) => (
          <div
            key={category.title}
            className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <category.icon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">
                {category.title}
              </h3>
            </div>

            <div className="space-y-4">
              {category.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <label className="text-gray-300 font-medium">
                    {item.label}
                  </label>

                  {item.type === "toggle" && (
                    <button
                      onClick={() =>
                        handleSettingChange(item.key, !settings[item.key])
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings[item.key] ? "bg-gray-600" : "bg-gray-700"
                      }`}
                    >
                      <div
                        className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                          settings[item.key] ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}

                  {item.type === "text" && (
                    <input
                      type="text"
                      value={settings[item.key]}
                      onChange={(e) =>
                        handleSettingChange(item.key, e.target.value)
                      }
                      className="w-64 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-500"
                    />
                  )}

                  {item.type === "email" && (
                    <input
                      type="email"
                      value={settings[item.key]}
                      onChange={(e) =>
                        handleSettingChange(item.key, e.target.value)
                      }
                      className="w-64 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-500"
                    />
                  )}

                  {item.type === "select" && (
                    <select
                      value={settings[item.key]}
                      onChange={(e) =>
                        handleSettingChange(item.key, e.target.value)
                      }
                      className="w-32 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-500"
                    >
                      {item.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Delete Account</p>
              <p className="text-gray-400 text-sm">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
