"use client";

import { WeeklySchedule } from "@/types/availability";
import { SCHEDULE_MESSAGES } from "./messages";
import { DayRows } from "./day-rows";
import { ScheduleHeader } from "./schedule-header";
import { WeeklySummary } from "./weekly-summary";
import { useWeeklySchedule } from "./use-weekly-schedule";

interface WeeklyScheduleEditorProps {
  workingHours: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
  timeZone: string;
}

export function WeeklyScheduleEditor({
  workingHours,
  onChange,
  timeZone,
}: WeeklyScheduleEditorProps) {
  const { days, updateDay, toggleWorkingDay, copyToAllDays } =
    useWeeklySchedule({
      workingHours,
      onChange,
    });

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {SCHEDULE_MESSAGES.SCHEDULE_EDITOR.TITLE}
        </h3>
        <p className="text-sm text-gray-600">
          {SCHEDULE_MESSAGES.SCHEDULE_EDITOR.SUBTITLE}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ScheduleHeader />

        <DayRows
          days={days}
          workingHours={workingHours}
          onToggleWorkingDay={toggleWorkingDay}
          onUpdateDay={updateDay}
          onCopyToAllDays={copyToAllDays}
        />
      </div>

      <WeeklySummary workingHours={workingHours} timeZone={timeZone} />
    </div>
  );
}
