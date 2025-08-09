"use client";

import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useScheduleManager } from "./hooks";
import { SCHEDULE_CONSTANTS } from "./constants";
import { WeeklyScheduleEditor } from "./weekly-schedule-editor";
import { BreakTimeManager } from "./break-time-manager";
import { ConsultationSettingsEditor } from "./consultation-settings-editor";
import { ScheduleTemplates } from "./schedule-templates";
import { TimeZoneSelector } from "./time-zone-selector";
import {
  Clock,
  Save,
  RefreshCw,
  Calendar,
  Settings,
  LayoutTemplate as Template,
  Globe,
  AlertCircle,
  Loader,
} from "lucide-react";

interface ScheduleManagerProps {
  attorneyId: Id<"attorneys">;
  onClose?: () => void;
  onSave?: () => void;
}

export function ScheduleManager({
  attorneyId,
  onClose,
  onSave,
}: ScheduleManagerProps) {
  const {
    workingHours,
    consultationSettings,
    timeZone,
    isLoading,
    isSaving,
    error,
    hasChanges,
    updateWorkingHours,
    updateConsultationSettings,
    updateTimeZone,
    saveChanges,
    resetChanges,
    applyTemplate,
  } = useScheduleManager(attorneyId);

  const [activeTab, setActiveTab] = useState<
    "schedule" | "breaks" | "settings" | "templates"
  >("schedule");

  const tabs = [
    {
      id: "schedule",
      label: SCHEDULE_CONSTANTS.TABS.SCHEDULE,
      icon: Calendar,
      description: "Set your weekly working hours",
    },
    {
      id: "breaks",
      label: SCHEDULE_CONSTANTS.TABS.BREAKS,
      icon: Clock,
      description: "Configure lunch breaks and buffer times",
    },
    {
      id: "settings",
      label: SCHEDULE_CONSTANTS.TABS.CONSULTATION_SETTINGS,
      icon: Settings,
      description: "Consultation duration and pricing",
    },
    {
      id: "templates",
      label: SCHEDULE_CONSTANTS.TABS.TEMPLATES,
      icon: Template,
      description: "Use predefined schedule templates",
    },
  ] as const;

  const handleSave = async () => {
    try {
      await saveChanges();
      onSave?.();
    } catch {
      // Error handling is managed by the hook
    }
  };

  const renderTabButton = (tab: (typeof tabs)[0]) => {
    const IconComponent = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-3 w-full p-3 text-left rounded-lg transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        <IconComponent className="w-5 h-5" />
        <div>
          <div className="font-medium">{tab.label}</div>
          <div className="text-xs text-gray-500">{tab.description}</div>
        </div>
      </button>
    );
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {SCHEDULE_CONSTANTS.TITLE}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {SCHEDULE_CONSTANTS.SUBTITLE}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <TimeZoneSelector value={timeZone} onChange={updateTimeZone} />
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "schedule":
        return (
          <WeeklyScheduleEditor
            workingHours={workingHours}
            onChange={updateWorkingHours}
            timeZone={timeZone}
          />
        );
      case "breaks":
        return (
          <BreakTimeManager
            workingHours={workingHours}
            onChange={updateWorkingHours}
          />
        );
      case "settings":
        return (
          <ConsultationSettingsEditor
            settings={consultationSettings}
            onChange={updateConsultationSettings}
          />
        );
      case "templates":
        return (
          <ScheduleTemplates
            onApplyTemplate={applyTemplate}
            currentSchedule={workingHours}
          />
        );
      default:
        return null;
    }
  };

  const renderActionButtons = () => (
    <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3">
        {hasChanges && (
          <div className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {SCHEDULE_CONSTANTS.UNSAVED_CHANGES}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {hasChanges && (
          <button
            onClick={resetChanges}
            disabled={isSaving}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            {SCHEDULE_CONSTANTS.ACTIONS.RESET}
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving
            ? SCHEDULE_CONSTANTS.ACTIONS.SAVING
            : SCHEDULE_CONSTANTS.ACTIONS.SAVE_CHANGES}
        </button>
      </div>
    </div>
  );

  const renderSuccessMessage = () => {
    // This would be shown temporarily after successful save
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="text-gray-600">
              {SCHEDULE_CONSTANTS.LOADING_MESSAGE}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      {renderHeader()}

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 p-4 border-r border-gray-200 bg-gray-50">
          <div className="space-y-2">{tabs.map(renderTabButton)}</div>

          {/* Time Zone Display */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-1">
              <Globe className="w-4 h-4" />
              Current Time Zone
            </div>
            <p className="text-sm text-blue-600">
              {timeZone?.replace("_", " ") || "Not set"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">{renderTabContent()}</div>

          {renderActionButtons()}
        </div>
      </div>

      {renderSuccessMessage()}
    </div>
  );
}

