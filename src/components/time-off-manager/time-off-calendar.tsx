"use client";

import { TimeOffPeriod } from "@/types/availability";
import { Calendar } from "lucide-react";

interface TimeOffCalendarProps {
  timeOffPeriods: TimeOffPeriod[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export function TimeOffCalendar({}: TimeOffCalendarProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Calendar View
      </h3>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Interactive calendar coming soon...</p>
        <p className="text-gray-400 text-sm mt-2">
          This will show a full calendar with time off periods highlighted
        </p>
      </div>
    </div>
  );
}
