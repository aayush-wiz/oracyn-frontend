import { useState } from "react";
import {
  User,
  Shield,
  Brain,
  Bell,
  Database,
  AlertTriangle,
  Save,
  RotateCcw,
} from "lucide-react";

const Settings = () => {
  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    profession: "Senior Data Scientist",
    bio: "AI researcher and data analyst passionate about document intelligence.",
    apiKey: "",
    aiModel: "GPT-4",
    processingMode: "Balanced",
    maxTokens: 4000,
    autoSummary: false,
    smartExtract: false,
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    twoFactor: true,
    sessionTimeout: 24,
    emailAlerts: true,
    weeklyReports: true,
    retention: 90,
    analyticsSharing: false,
  });

  const numberFields = ["sessionTimeout", "maxTokens", "retention"];

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: numberFields.includes(key) ? Number(value) : value,
    }));
  };

  const Input = ({ type = "text", value, onChange, placeholder }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-800/60 backdrop-blur-sm text-white border border-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:border-gray-600/70"
    />
  );

  const Label = ({ children }) => (
    <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">
      {children}
    </label>
  );

  const Switch = ({ checked, onCheckedChange }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onCheckedChange(!checked);
        e.currentTarget.blur(); // Prevents scrolling by removing focus
      }}
      className={`relative w-14 h-7 rounded-full flex items-center px-1 transition-all duration-300 ${
        checked ? "bg-indigo-600" : "bg-gray-700"
      } group hover:scale-110`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ${
          checked ? "translate-x-7" : "translate-x-0"
        } group-hover:scale-110`}
      ></div>
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/20"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/20"></div>
    </button>
  );

  const Select = ({ value, onValueChange, children }) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full bg-gray-800/60 backdrop-blur-sm text-white border border-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:border-gray-600/70"
    >
      {children}
    </select>
  );

  const SelectItem = ({ value, children }) => (
    <option value={value} className="bg-gray-800 text-white">
      {children}
    </option>
  );

  const Button = ({
    variant = "default",
    children,
    className = "",
    onClick,
    ...props
  }) => {
    const base =
      "px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 relative overflow-hidden group";
    const variants = {
      default:
        "bg-indigo-600/80 hover:bg-indigo-600 text-white border-2 border-indigo-500/50 hover:border-indigo-500 backdrop-blur-sm",
      secondary:
        "bg-gray-800/60 hover:bg-gray-800 text-white border-2 border-gray-700/50 hover:border-gray-600/70 backdrop-blur-sm",
      outline:
        "bg-transparent border-2 border-gray-600/50 hover:border-gray-500 text-white hover:bg-gray-800/30 backdrop-blur-sm",
      destructive:
        "bg-red-600/80 hover:bg-red-600 text-white border-2 border-red-500/50 hover:border-red-500 backdrop-blur-sm",
    };

    return (
      <button
        type="button"
        className={`${base} ${variants[variant]} ${className}`}
        onClick={onClick}
        {...props}
      >
        {variant !== "destructive" && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-current opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
          </>
        )}
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </button>
    );
  };

  const Textarea = ({ value, onChange, placeholder }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-gray-800/60 backdrop-blur-sh text-white border border-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:border-gray-600/70 resize-none"
    ></textarea>
  );

  const SettingsSection = ({
    title,
    description,
    icon,
    children,
    danger = false,
  }) => (
    <section
      className={`group relative backdrop-blur-xl border rounded-2xl p-8 transition-all duration-500 hover:border-gray-600/70 overflow-hidden ${
        danger
          ? "bg-red-900/20 border-red-500/50 hover:bg-red-900/30"
          : "bg-gray-900/60 border-gray-700/50 hover:bg-gray-900/80"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 ${
          danger ? "border-red-500" : "border-gray-500"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 ${
          danger ? "border-red-500" : "border-gray-500"
        }`}
      ></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-12 h-12 border border-gray-400 rotate-45"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border border-gray-500"></div>
      </div>
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div
          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
            danger
              ? "bg-red-600/20 border-red-500/50 text-red-400"
              : "bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border-indigo-500/40 text-indigo-400"
          }`}
        >
          {icon}
        </div>
        <div>
          <h2
            className={`text-2xl font-bold tracking-tight ${
              danger ? "text-red-400" : "text-white"
            }`}
          >
            {title}
          </h2>
          {description && <p className="text-gray-400 mt-1">{description}</p>}
        </div>
      </div>
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-y-auto max-h-screen">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gray-500 rotate-45"></div>
        <div className="absolute top-40 right-40 w-24 h-24 border border-gray-600 rotate-12"></div>
        <div className="absolute bottom-32 left-32 w-16 h-16 border border-gray-400"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-gray-500 rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gray-500 opacity-20"></div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto space-y-10 p-8">
        <div className="relative">
          <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-white via-gray-400 to-transparent opacity-30"></div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            Settings
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Customize your Oracyn experience
          </p>
          <div className="absolute -bottom-2 right-0 w-6 h-6 border-r-2 border-b-2 border-gray-600 opacity-30"></div>
        </div>
        <SettingsSection
          title="Profile Information"
          description="Manage your personal details and preferences"
          icon={<User className="w-6 h-6" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>First Name</Label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Choose a username"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label>Profession</Label>
              <Input
                value={form.profession}
                onChange={(e) => handleChange("profession", e.target.value)}
                placeholder="Your job title"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Bio (Optional)</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </SettingsSection>
        <SettingsSection
          title="Security"
          description="Protect your account with strong security settings"
          icon={<Shield className="w-6 h-6" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={form.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={form.confirmNewPassword}
                onChange={(e) =>
                  handleChange("confirmNewPassword", e.target.value)
                }
                placeholder="Confirm your new password"
              />
            </div>
          </div>
          <div className="space-y-6">
            <Button variant="secondary">Change Password</Button>
            <div className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/30 rounded-xl">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-400">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                checked={form.twoFactor}
                onCheckedChange={(v) => handleChange("twoFactor", v)}
              />
            </div>
            <div>
              <Label>Session Timeout (hours)</Label>
              <Input
                type="number"
                value={form.sessionTimeout}
                onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                placeholder="24"
              />
            </div>
          </div>
        </SettingsSection>
        <SettingsSection
          title="AI & Processing"
          description="Configure your AI model preferences and processing settings"
          icon={<Brain className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <div>
              <Label>AI API Key</Label>
              <Input
                type="password"
                value={form.apiKey}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>AI Model</Label>
                <Select
                  value={form.aiModel}
                  onValueChange={(v) => handleChange("aiModel", v)}
                >
                  <SelectItem value="GPT-4">GPT-4</SelectItem>
                  <SelectItem value="GPT-3.5">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="Claude">Claude</SelectItem>
                </Select>
              </div>
              <div>
                <Label>Processing Mode</Label>
                <Select
                  value={form.processingMode}
                  onValueChange={(v) => handleChange("processingMode", v)}
                >
                  <SelectItem value="Speed">Speed Optimized</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Accuracy">Accuracy Focused</SelectItem>
                </Select>
              </div>
              <div>
                <Label>Max Tokens</Label>
                <Input
                  type="number"
                  value={form.maxTokens}
                  onChange={(e) => handleChange("maxTokens", e.target.value)}
                  placeholder="4000"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/30 rounded-xl">
                <div>
                  <Label>Auto-summarize Documents</Label>
                  <p className="text-sm text-gray-400">
                    Automatically generate summaries
                  </p>
                </div>
                <Switch
                  checked={form.autoSummary}
                  onCheckedChange={(v) => handleChange("autoSummary", v)}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/30 rounded-xl">
                <div>
                  <Label>Smart Data Extraction</Label>
                  <p className="text-sm text-gray-400">
                    Enhanced data extraction algorithms
                  </p>
                </div>
                <Switch
                  checked={form.smartExtract}
                  onCheckedChange={(v) => handleChange("smartExtract", v)}
                />
              </div>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection
          title="Notifications"
          description="Manage how you receive updates and alerts"
          icon={<Bell className="w-6 h-6" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/30 rounded-xl">
              <div>
                <Label>Email Alerts</Label>
                <p className="text-sm text-gray-400">
                  Receive important notifications via email
                </p>
              </div>
              <Switch
                checked={form.emailAlerts}
                onCheckedChange={(v) => handleChange("emailAlerts", v)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/30 rounded-xl">
              <div>
                <Label>Weekly Reports</Label>
                <p className="text-sm text-gray-400">
                  Get weekly usage summaries
                </p>
              </div>
              <Switch
                checked={form.weeklyReports}
                onCheckedChange={(v) => handleChange("weeklyReports", v)}
              />
            </div>
          </div>
        </SettingsSection>
        <SettingsSection
          title="Data & Privacy"
          description="Control how your data is stored and used"
          icon={<Database className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <div>
              <Label>Data Retention (days)</Label>
              <Input
                type="number"
                value={form.retention}
                onChange={(e) => handleChange("retention", e.target.value)}
                placeholder="90"
              />
              <p className="text-sm text-gray-400 mt-1">
                How long to keep your data before automatic deletion
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/30 rounded-xl">
              <div>
                <Label>Analytics Sharing</Label>
                <p className="text-sm text-gray-400">
                  Help improve our service with anonymous usage data
                </p>
              </div>
              <Switch
                checked={form.analyticsSharing}
                onCheckedChange={(v) => handleChange("analyticsSharing", v)}
              />
            </div>
          </div>
        </SettingsSection>
        <SettingsSection
          title="Danger Zone"
          description="Irreversible actions - proceed with caution"
          icon={<AlertTriangle className="w-6 h-6" />}
          danger={true}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-1">
                Delete Account
              </h3>
              <p className="text-gray-400 text-sm">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </SettingsSection>
        <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-8">
          <Button variant="default" className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save All Changes
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
