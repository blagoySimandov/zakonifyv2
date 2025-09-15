"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ATTORNEY_DASHBOARD_MESSAGES } from "@/messages";
import { 
  Clock,
  Settings,
  CalendarX,
  Save,
  RotateCcw,
} from "lucide-react";
import { WorkingHoursConfig } from "./working-hours-config";
import { ConsultationSettingsConfig } from "./consultation-settings-config";
import { BlockedPeriodsManager } from "./blocked-periods-manager";

interface AvailabilityProfileManagerProps {
  attorney: any;
  availabilityProfile: any;
}

export function AvailabilityProfileManager({
  attorney,
  availabilityProfile
}: AvailabilityProfileManagerProps) {
  const [activeTab, setActiveTab] = useState<"working-hours" | "settings" | "blocked-periods">("working-hours");
  const [isEditing, setIsEditing] = useState(!availabilityProfile);
  const [profileData, setProfileData] = useState(
    availabilityProfile || {
      timeZone: "Europe/Sofia",
      workingHours: {
        monday: { start: "09:00", end: "17:00", breaks: [] },
        tuesday: { start: "09:00", end: "17:00", breaks: [] },
        wednesday: { start: "09:00", end: "17:00", breaks: [] },
        thursday: { start: "09:00", end: "17:00", breaks: [] },
        friday: { start: "09:00", end: "17:00", breaks: [] },
      },
      consultationSettings: {
        defaultDuration: 60,
        bufferTime: 15,
        maxConsultationsPerDay: 8,
        allowBackToBack: false,
        minAdvanceBooking: 24,
        maxAdvanceBooking: 720, // 30 days
      },
      isActive: true,
    }
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const createOrUpdateProfile = useMutation(api.availability.createOrUpdateAvailabilityProfile);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createOrUpdateProfile({
        attorneyId: attorney._id,
        ...profileData,
      });
      setSaveMessage(ATTORNEY_DASHBOARD_MESSAGES.SUCCESS.PROFILE_SAVED);
      setIsEditing(false);
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage(ATTORNEY_DASHBOARD_MESSAGES.ERRORS.PROFILE_SAVE_ERROR);
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (availabilityProfile) {
      setProfileData(availabilityProfile);
    }
    setIsEditing(false);
  };


  const tabs = [
    {
      id: "working-hours",
      label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.TITLE,
      icon: Clock,
    },
    {
      id: "settings", 
      label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.TITLE,
      icon: Settings,
    },
    {
      id: "blocked-periods",
      label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TITLE,
      icon: CalendarX,
    },
  ] as const;

  if (!availabilityProfile && !isEditing) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center">
        <div className="mb-6">
          <AlertCircle className="mx-auto h-16 w-16 text-amber-500 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.NO_PROFILE_TITLE}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.NO_PROFILE_DESCRIPTION}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors font-medium text-lg"
          >
            {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CREATE_PROFILE}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Main Content */}
      <div className="bg-white rounded-3xl overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "working-hours" && (
            <WorkingHoursConfig
              workingHours={profileData.workingHours}
              timeZone={profileData.timeZone}
              isEditing={isEditing}
              onChange={(workingHours, timeZone) =>
                setProfileData((prev: any) => ({ ...prev, workingHours, timeZone }))
              }
            />
          )}
          
          {activeTab === "settings" && (
            <ConsultationSettingsConfig
              settings={profileData.consultationSettings}
              attorney={attorney}
              isEditing={isEditing}
              onChange={(consultationSettings) =>
                setProfileData((prev: any) => ({ ...prev, consultationSettings }))
              }
            />
          )}
          
          {activeTab === "blocked-periods" && (
            <BlockedPeriodsManager
              attorneyId={attorney._id}
            />
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {saveMessage && (
              <div className={`mb-4 text-sm font-medium px-4 py-2 rounded-xl ${
                saveMessage.includes("успешно") || saveMessage.includes("обновена")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {saveMessage}
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CANCEL}</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSaving 
                    ? "Запазване..." 
                    : ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.SAVE_PROFILE
                  }
                </span>
              </button>
            </div>
          </div>
        )}

        {!isEditing && availabilityProfile && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors font-medium"
              >
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.EDIT_PROFILE}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}