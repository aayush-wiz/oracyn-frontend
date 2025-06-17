import { useState } from "react";

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

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };


  const Input = ({ type = "text", value, onChange }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );

  const Label = ({ children }) => (
    <label className="block text-sm font-medium text-zinc-300 mb-1">
      {children}
    </label>
  );

  const Switch = ({ checked, onCheckedChange }) => (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
        checked ? "bg-green-500" : "bg-zinc-600"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </button>
  );

  const Select = ({ value, onValueChange, children }) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </select>
  );

  const SelectItem = ({ value, children }) => (
    <option value={value}>{children}</option>
  );

  const Button = ({ variant = "default", children, ...props }) => {
    const base =
      "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition";
    const variants = {
      default:
        "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
      secondary: "bg-zinc-700 text-white hover:bg-zinc-600 focus:ring-zinc-500",
      outline:
        "border border-zinc-500 text-white hover:bg-zinc-800 focus:ring-zinc-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    return (
      <button className={`${base} ${variants[variant]}`} {...props}>
        {children}
      </button>
    );
  };

  const Textarea = ({ value, onChange }) => (
    <textarea
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    ></textarea>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 h-screen overflow-auto text-white p-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Profession</Label>
            <Input
              value={form.profession}
              onChange={(e) => handleChange("profession", e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label>Bio (Optional)</Label>
            <Textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={form.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
            />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={form.confirmNewPassword}
              onChange={(e) =>
                handleChange("confirmNewPassword", e.target.value)
              }
            />
          </div>
        </div>
        <Button variant="secondary" className="mt-4">
          Change Password
        </Button>
        <div className="flex items-center justify-between mt-6">
          <Label>Two-Factor Auth</Label>
          <Switch
            checked={form.twoFactor}
            onCheckedChange={(v) => handleChange("twoFactor", v)}
          />
        </div>
        <div className="mt-4">
          <Label>Session Timeout (hours)</Label>
          <Input
            type="number"
            value={form.sessionTimeout}
            onChange={(e) => handleChange("sessionTimeout", e.target.value)}
          />
        </div>
      </section>

      {/* AI & Processing */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">AI & Processing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>AI API Key</Label>
            <Input
              value={form.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
            />
          </div>
          <div>
            <Label>AI Model</Label>
            <Select
              value={form.aiModel}
              onValueChange={(v) => handleChange("aiModel", v)}
            >
              <SelectItem value="GPT-4">GPT-4</SelectItem>
              <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
            </Select>
          </div>
          <div>
            <Label>Processing Mode</Label>
            <Select
              value={form.processingMode}
              onValueChange={(v) => handleChange("processingMode", v)}
            >
              <SelectItem value="Balanced">Balanced</SelectItem>
              <SelectItem value="Speed">Speed</SelectItem>
              <SelectItem value="Accuracy">Accuracy</SelectItem>
            </Select>
          </div>
          <div>
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={form.maxTokens}
              onChange={(e) => handleChange("maxTokens", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label>Auto-summarize Documents</Label>
            <Switch
              checked={form.autoSummary}
              onCheckedChange={(v) => handleChange("autoSummary", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Smart Data Extraction</Label>
            <Switch
              checked={form.smartExtract}
              onCheckedChange={(v) => handleChange("smartExtract", v)}
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="flex items-center justify-between mb-4">
          <Label>Email Alerts</Label>
          <Switch
            checked={form.emailAlerts}
            onCheckedChange={(v) => handleChange("emailAlerts", v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Weekly Reports</Label>
          <Switch
            checked={form.weeklyReports}
            onCheckedChange={(v) => handleChange("weeklyReports", v)}
          />
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
        <div className="mb-4">
          <Label>Retention (days)</Label>
          <Input
            type="number"
            value={form.retention}
            onChange={(e) => handleChange("retention", e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Analytics Sharing</Label>
          <Switch
            checked={form.analyticsSharing}
            onCheckedChange={(v) => handleChange("analyticsSharing", v)}
          />
        </div>
      </section>

      {/* Danger Zone */}
      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Delete Account</p>
            <p className="text-gray-400 text-sm">
              This action cannot be undone
            </p>
          </div>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary">Save All Changes</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  );
};

export default Settings;
