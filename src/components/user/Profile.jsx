import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "john_doe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Research & Development",
    role: "Senior Data Analyst",
    joinDate: "March 2023",
    timezone: "EST (UTC-5)",
    language: "English",
    defaultModel: "GPT-4",
    queriesProcessed: "1,247",
    documentsAnalyzed: "342",
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Profile Settings
        </h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Avatar & Basic Info */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-600">@{profile.username}</p>
            <p className="text-sm text-gray-500 mt-1">
              {profile.role} • {profile.department}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField
            icon={<User className="w-5 h-5" />}
            label="Username"
            value={isEditing ? editedProfile.username : profile.username}
            isEditing={isEditing}
            onChange={(value) => handleInputChange("username", value)}
          />
          <ProfileField
            icon={<User className="w-5 h-5" />}
            label="First Name"
            value={isEditing ? editedProfile.firstName : profile.firstName}
            isEditing={isEditing}
            onChange={(value) => handleInputChange("firstName", value)}
          />
          <ProfileField
            icon={<User className="w-5 h-5" />}
            label="Last Name"
            value={isEditing ? editedProfile.lastName : profile.lastName}
            isEditing={isEditing}
            onChange={(value) => handleInputChange("lastName", value)}
          />
          <ProfileField
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value={isEditing ? editedProfile.email : profile.email}
            isEditing={isEditing}
            onChange={(value) => handleInputChange("email", value)}
          />
          <ProfileField
            icon={<Phone className="w-5 h-5" />}
            label="Phone"
            value={isEditing ? editedProfile.phone : profile.phone}
            isEditing={isEditing}
            onChange={(value) => handleInputChange("phone", value)}
          />
          <ProfileField
            icon={<MapPin className="w-5 h-5" />}
            label="Department"
            value={isEditing ? editedProfile.department : profile.department}
            isEditing={isEditing}
            onChange={(value) => handleInputChange("department", value)}
          />
        </div>
      </div>

      {/* Application Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Application Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField
            icon={<Calendar className="w-5 h-5" />}
            label="Timezone"
            value={isEditing ? editedProfile.timezone : profile.timezone}
            isEditing={isEditing}
            onChange={(value) => handleInputChange("timezone", value)}
          />
          <ProfileField
            icon={<User className="w-5 h-5" />}
            label="Language"
            value={isEditing ? editedProfile.language : profile.language}
            isEditing={isEditing}
            onChange={(value) => handleInputChange("language", value)}
          />
          <ProfileField
            icon={<User className="w-5 h-5" />}
            label="Default AI Model"
            value={
              isEditing ? editedProfile.defaultModel : profile.defaultModel
            }
            isEditing={isEditing}
            onChange={(value) => handleInputChange("defaultModel", value)}
            isSelect={true}
            options={["GPT-4", "GPT-3.5", "Claude-3", "Gemini Pro"]}
          />
          <ProfileField
            icon={<Calendar className="w-5 h-5" />}
            label="Member Since"
            value={profile.joinDate}
            isEditing={false}
            readonly={true}
          />
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Usage Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {profile.queriesProcessed}
              </p>
              <p className="text-sm text-blue-600">Queries Processed</p>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {profile.documentsAnalyzed}
              </p>
              <p className="text-sm text-purple-600">Documents Analyzed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({
  icon,
  label,
  value,
  isEditing,
  onChange,
  readonly = false,
  isSelect = false,
  options = [],
}) => {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 text-gray-500">{icon}</div>
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {isEditing && !readonly ? (
          isSelect ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )
        ) : (
          <p className="text-gray-900 font-medium">{value}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
