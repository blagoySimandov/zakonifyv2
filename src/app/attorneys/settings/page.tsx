"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  AttorneyLayout,
  ProfilePictureUpload,
  AvailabilityDashboard,
  ScheduleManager,
  TimeOffManager,
} from "@/components";
import {
  MOCK_ATTORNEY_ID,
  PRACTICE_AREA_LABELS,
  PracticeArea,
} from "@/constants";
import { SETTINGS_CONSTANTS } from "./constants";
import { SETTINGS_MESSAGES } from "./messages";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Save,
  Shield,
  Calendar,
  Plane,
} from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

type SettingsTab =
  | typeof SETTINGS_CONSTANTS.TABS.PROFILE
  | typeof SETTINGS_CONSTANTS.TABS.AVAILABILITY
  | typeof SETTINGS_CONSTANTS.TABS.TIME_OFF;

export default function AttorneySettings() {
  const [attorneyId] = useState<Doc<"attorneys">["_id"]>(MOCK_ATTORNEY_ID);
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    SETTINGS_CONSTANTS.TABS.PROFILE,
  );
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Partial<Doc<"attorneys">>>();

  // Fetch attorney data
  const attorney = useQuery(api.attorneys.getById, { id: attorneyId });

  // Update attorney mutation
  const updateAttorney = useMutation(api.attorneys.update);

  const handleEdit = (field: string) => {
    setIsEditing({ ...isEditing, [field]: true });
    if (attorney) {
      // Handle nested location fields
      if (field.startsWith("location.")) {
        const locationField = field.split(".")[1];
        setFormData({
          ...formData,
          [field]:
            attorney.location?.[
              locationField as keyof typeof attorney.location
            ],
        });
      } else {
        setFormData({
          ...formData,
          [field]: attorney[field as keyof typeof attorney],
        });
      }
    }
  };

  const handleSave = async (field: string) => {
    if (!attorney) return;

    try {
      // Handle nested location fields
      if (field.startsWith("location.")) {
        const locationField = field.split(".")[1];
        await updateAttorney({
          id: attorney._id,
          location: {
            [locationField]: formData?.[field as keyof typeof formData],
          },
        });
      } else {
        await updateAttorney({
          id: attorney._id,
          [field]: formData?.[field as keyof typeof formData],
        });
      }
      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const handleCancel = (field: string) => {
    setIsEditing({ ...isEditing, [field]: false });
    setFormData({ ...formData, [field]: "" });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const EditableField = ({
    label,
    field,
    value,
    icon: Icon,
    type = "text",
    placeholder,
  }: {
    label: string;
    field: string;
    value: string | number | undefined;
    icon: React.ElementType;
    type?: string;
    placeholder?: string;
  }) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-slate-500" />
            <label className="text-sm font-medium text-slate-700">
              {label}
            </label>
          </div>
          {!isEditing[field] && (
            <button
              onClick={() => handleEdit(field)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing[field] ? (
          <div className="space-y-2">
            <input
              autoFocus
              type={type}
              value={String(formData?.[field as keyof typeof formData] || "")}
              onChange={(e) =>
                handleInputChange(
                  field,
                  type === "number" ? Number(e.target.value) : e.target.value,
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave(field);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  handleCancel(field);
                }
              }}
              placeholder={placeholder}
              className="w-full px-3 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onMouseDown={(e) => e.preventDefault()} // Prevent input from losing focus
                onClick={() => handleSave(field)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                disabled={false}
              >
                <Save className="h-3 w-3" />
                Save
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()} // Prevent input from losing focus
                onClick={() => handleCancel(field)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 border border-slate-300 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-900">
              {value || <span className="text-slate-400">Not set</span>}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (!attorney) {
    return (
      <AttorneyLayout
        title={SETTINGS_MESSAGES.PAGE_TITLE}
        attorneyId={attorneyId}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500">
              {SETTINGS_MESSAGES.LOADING.FETCHING_DATA}
            </p>
          </div>
        </div>
      </AttorneyLayout>
    );
  }

  const tabs = [
    {
      id: SETTINGS_CONSTANTS.TABS.PROFILE as SettingsTab,
      label: SETTINGS_MESSAGES.TABS.PROFILE,
      icon: User,
    },
    {
      id: SETTINGS_CONSTANTS.TABS.AVAILABILITY as SettingsTab,
      label: SETTINGS_MESSAGES.TABS.AVAILABILITY,
      icon: Calendar,
    },
    {
      id: SETTINGS_CONSTANTS.TABS.TIME_OFF as SettingsTab,
      label: SETTINGS_MESSAGES.TABS.TIME_OFF,
      icon: Plane,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case SETTINGS_CONSTANTS.TABS.PROFILE:
        return renderProfileTab();
      case SETTINGS_CONSTANTS.TABS.AVAILABILITY:
        return renderCombinedAvailabilityTab();
      case SETTINGS_CONSTANTS.TABS.TIME_OFF:
        return <TimeOffManager attorneyId={attorneyId} />;
      default:
        return renderProfileTab();
    }
  };

  // Combined availability and schedule management
  const renderCombinedAvailabilityTab = () => (
    <div className="space-y-8">
      {/* Availability Overview & Stats */}
      <AvailabilityDashboard attorneyId={attorneyId} />

      {/* Schedule Management */}
      <div className="border-t pt-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {SETTINGS_MESSAGES.AVAILABILITY.SCHEDULE_MANAGEMENT_TITLE}
          </h2>
          <p className="text-gray-600">
            {SETTINGS_MESSAGES.AVAILABILITY.SCHEDULE_MANAGEMENT_SUBTITLE}
          </p>
        </div>
        <ScheduleManager attorneyId={attorneyId} />
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <>
      {/* Profile Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <ProfilePictureUpload
              attorney={attorney}
              onUploadSuccess={() => {
                // Convex automatically refetches queries when data changes
              }}
            />
            <div>
              <CardTitle className="text-slate-900">
                {attorney.fullName}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {attorney.email}
              </CardDescription>
              {attorney.isVerified && (
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">
                    Verified Attorney
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-900">
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-600">
              Update your basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <EditableField
              label="Full Name"
              field="fullName"
              value={attorney.fullName}
              icon={User}
              placeholder="Enter your full name"
            />

            <EditableField
              label="Email Address"
              field="email"
              value={attorney.email}
              icon={Mail}
              type="email"
              placeholder="Enter your email"
            />

            <EditableField
              label="Phone Number"
              field="phoneNumber"
              value={attorney.phoneNumber}
              icon={Phone}
              type="tel"
              placeholder="Enter your phone number"
            />
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-900">
              Professional Information
            </CardTitle>
            <CardDescription className="text-slate-600">
              Manage your professional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <EditableField
              label="Years of Experience"
              field="yearsOfExperience"
              value={attorney.yearsOfExperience}
              icon={Briefcase}
              type="number"
              placeholder="Enter years of experience"
            />

            <EditableField
              label="Hourly Rate ($)"
              field="hourlyRate"
              value={attorney.hourlyRate}
              icon={DollarSign}
              type="number"
              placeholder="Enter your hourly rate"
            />

            <EditableField
              label="Bar Association ID"
              field="barAssociationId"
              value={attorney.barAssociationId}
              icon={Shield}
              placeholder="Enter your bar association ID"
            />
          </CardContent>
        </Card>
      </div>

      {/* Location Information */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-slate-900">Location Information</CardTitle>
          <CardDescription className="text-slate-600">
            Update your location details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EditableField
              label="City"
              field="location.city"
              value={attorney.location?.city}
              icon={MapPin}
              placeholder="Enter city"
            />

            <EditableField
              label="State"
              field="location.state"
              value={attorney.location?.state}
              icon={MapPin}
              placeholder="Enter state"
            />

            <EditableField
              label="Zip Code"
              field="location.zipCode"
              value={attorney.location?.zipCode}
              icon={MapPin}
              placeholder="Enter zip code"
            />
          </div>
        </CardContent>
      </Card>

      {/* Practice Areas */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-slate-900">Practice Areas</CardTitle>
          <CardDescription className="text-slate-600">
            Manage your areas of expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attorney.practiceAreas?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {attorney.practiceAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {PRACTICE_AREA_LABELS[area as PracticeArea]}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No practice areas set</p>
            )}
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Edit Practice Areas
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <AttorneyLayout
      title={SETTINGS_MESSAGES.PAGE_TITLE}
      attorneyId={attorneyId}
    >
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">{renderTabContent()}</div>
      </div>
    </AttorneyLayout>
  );
}
