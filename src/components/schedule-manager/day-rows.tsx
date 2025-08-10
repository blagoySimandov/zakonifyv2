"use client";

import { DayOfWeek, DaySchedule, WeeklySchedule } from "@/types/availability";
import { DayRow } from "./day-row";

interface DayRowsProps {
  days: DayOfWeek[];
  workingHours: WeeklySchedule;
  onToggleWorkingDay: (day: DayOfWeek) => void;
  onUpdateDay: (day: DayOfWeek, schedule: DaySchedule | undefined) => void;
  onCopyToAllDays: (day: DayOfWeek) => void;
}

export function DayRows({
  days,
  workingHours,
  onToggleWorkingDay,
  onUpdateDay,
  onCopyToAllDays,
}: DayRowsProps) {
  return (
    <div className="px-4">
      {days.map((day) => (
        <DayRow
          key={day}
          day={day}
          schedule={workingHours[day]}
          isWorking={!!workingHours[day]}
          onToggleWorkingDay={onToggleWorkingDay}
          onUpdateDay={onUpdateDay}
          onCopyToAllDays={onCopyToAllDays}
        />
      ))}
    </div>
  );
}
