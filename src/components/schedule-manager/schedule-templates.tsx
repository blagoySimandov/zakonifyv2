"use client";

import { WeeklySchedule } from "@/types/availability";
import { SCHEDULE_MESSAGES } from "./messages";

interface ScheduleTemplatesProps {
  onApplyTemplate: (templateName: string) => void;
  currentSchedule: WeeklySchedule;
}

export function ScheduleTemplates({}: ScheduleTemplatesProps) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {SCHEDULE_MESSAGES.TEMPLATES.TITLE}
        </h3>
        <p className="text-sm text-gray-600">
          {SCHEDULE_MESSAGES.TEMPLATES.SUBTITLE}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center py-8">
          Schedule templates coming soon...
        </p>
      </div>
    </div>
  );
}
