"use client";

import { WeeklySchedule } from "@/types/availability";
import { SCHEDULE_CONSTANTS } from "./constants";

interface BreakTimeManagerProps {
  workingHours: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
}

export function BreakTimeManager({}: BreakTimeManagerProps) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {SCHEDULE_CONSTANTS.BREAK_MANAGER.TITLE}
        </h3>
        <p className="text-sm text-gray-600">
          {SCHEDULE_CONSTANTS.BREAK_MANAGER.SUBTITLE}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center py-8">
          Break time management coming soon...
        </p>
      </div>
    </div>
  );
}