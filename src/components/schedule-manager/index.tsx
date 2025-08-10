"use client";

import { useCallback, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useScheduleManager } from "./use-schedule-manager";
import { TabId } from "./types";
import { ScheduleManagerHeader } from "./schedule-manager-header";
import { ScheduleManagerSidebar } from "./schedule-manager-sidebar";
import { ScheduleManagerContent } from "./schedule-manager-content";
import { ScheduleManagerActions } from "./schedule-manager-actions";
import { ScheduleManagerLoading } from "./schedule-manager-loading";

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

  const [activeTab, setActiveTab] = useState<TabId>("schedule");

  const handleSave = useCallback(async () => {
    await saveChanges();
    onSave?.();
  }, [saveChanges, onSave]);

  if (isLoading) {
    return <ScheduleManagerLoading />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <ScheduleManagerHeader
        timeZone={timeZone}
        onTimeZoneChange={updateTimeZone}
        onClose={onClose}
      />

      <div className="flex">
        <ScheduleManagerSidebar
          activeTab={activeTab}
          timeZone={timeZone}
          onTabChange={setActiveTab}
        />

        <div className="flex-1">
          <ScheduleManagerContent
            activeTab={activeTab}
            workingHours={workingHours}
            consultationSettings={consultationSettings}
            timeZone={timeZone}
            onWorkingHoursChange={updateWorkingHours}
            onConsultationSettingsChange={updateConsultationSettings}
            onApplyTemplate={applyTemplate}
          />

          <ScheduleManagerActions
            hasChanges={hasChanges}
            isSaving={isSaving}
            error={error || undefined}
            onSave={handleSave}
            onReset={resetChanges}
          />
        </div>
      </div>
    </div>
  );
}
