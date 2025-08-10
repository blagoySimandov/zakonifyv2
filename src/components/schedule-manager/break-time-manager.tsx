"use client";

import { WeeklySchedule } from "@/types/availability";
import { SCHEDULE_MESSAGES } from "./messages";

interface BreakTimeManagerProps {
  workingHours: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
}

export function BreakTimeManager({}: BreakTimeManagerProps) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {SCHEDULE_MESSAGES.BREAK_MANAGER.TITLE}
        </h3>
        <p className="text-sm text-gray-600">
          {SCHEDULE_MESSAGES.BREAK_MANAGER.SUBTITLE}
        </p>
      </div>
    </div>
  );
}
