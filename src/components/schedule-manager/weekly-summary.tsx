import { Clock } from "lucide-react";
import { WeeklySchedule } from "@/types/availability";
import { calculateWeeklyHours, countWorkingDays } from "./utils";

interface WeeklySummaryProps {
  workingHours: WeeklySchedule;
  timeZone: string;
}

export function WeeklySummary({ workingHours, timeZone }: WeeklySummaryProps) {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center gap-2 text-blue-700 mb-2">
        <Clock className="w-4 h-4" />
        <span className="font-medium">Weekly Summary</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-blue-600">Total Hours: </span>
          <span className="font-medium">
            {calculateWeeklyHours(workingHours)}h
          </span>
        </div>
        <div>
          <span className="text-blue-600">Working Days: </span>
          <span className="font-medium">{countWorkingDays(workingHours)}</span>
        </div>
        <div>
          <span className="text-blue-600">Time Zone: </span>
          <span className="font-medium">{timeZone.replace("_", " ")}</span>
        </div>
      </div>
    </div>
  );
}
