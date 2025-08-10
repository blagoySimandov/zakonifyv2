import { TabId } from "./types";
import { WeeklyScheduleEditor } from "./weekly-schedule-editor";
import { BreakTimeManager } from "./break-time-manager";
import { ConsultationSettingsEditor } from "./consultation-settings-editor";
import { ScheduleTemplates } from "./schedule-templates";
import { WeeklySchedule, ConsultationSettings } from "@/types/availability";

interface ScheduleManagerContentProps {
  activeTab: TabId;
  workingHours: WeeklySchedule;
  consultationSettings: ConsultationSettings;
  timeZone: string | null;
  onWorkingHoursChange: (workingHours: WeeklySchedule) => void;
  onConsultationSettingsChange: (settings: ConsultationSettings) => void;
  onApplyTemplate: (templateName: string) => void;
}

export function ScheduleManagerContent({
  activeTab,
  workingHours,
  consultationSettings,
  timeZone,
  onWorkingHoursChange,
  onConsultationSettingsChange,
  onApplyTemplate,
}: ScheduleManagerContentProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case "schedule":
        return (
          <WeeklyScheduleEditor
            workingHours={workingHours}
            onChange={onWorkingHoursChange}
            timeZone={timeZone || "America/New_York"}
          />
        );
      case "breaks":
        return (
          <BreakTimeManager
            workingHours={workingHours}
            onChange={onWorkingHoursChange}
          />
        );
      case "settings":
        return (
          <ConsultationSettingsEditor
            settings={consultationSettings}
            onChange={onConsultationSettingsChange}
          />
        );
      case "templates":
        return (
          <ScheduleTemplates
            onApplyTemplate={onApplyTemplate}
            currentSchedule={workingHours}
          />
        );
      default:
        return null;
    }
  };

  return <div className="p-6">{renderTabContent()}</div>;
}
