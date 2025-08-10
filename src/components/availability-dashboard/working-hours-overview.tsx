"use client";

import { WeeklySchedule } from "@/types/availability";
import { Clock, Edit, MapPin } from "lucide-react";
import { DASHBOARD_LABELS } from "./messages";

interface WorkingHoursOverviewProps {
  workingHours?: WeeklySchedule;
  timeZone?: string;
  onEditClick: () => void;
}

export function WorkingHoursOverview({
  workingHours,
  timeZone,
  onEditClick,
}: WorkingHoursOverviewProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const renderDaySchedule = (
    dayName: keyof WeeklySchedule,
    schedule: {
      start: string;
      end: string;
      breaks?: Array<{ start: string; end: string }>;
    },
  ) => {
    const shortDay = DASHBOARD_LABELS.DAY_SHORT_NAMES[dayName];

    return (
      <div
        key={dayName}
        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900 w-12">
            {shortDay}
          </span>
        </div>
        <div className="text-right">
          {schedule ? (
            <div>
              <span className="text-sm text-gray-900">
                {formatTime(schedule.start)} - {formatTime(schedule.end)}
              </span>
              {schedule.breaks && schedule.breaks.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {DASHBOARD_LABELS.WORKING_HOURS.BREAK_LABEL}{" "}
                  {schedule.breaks.map(
                    (
                      breakPeriod: { start: string; end: string },
                      index: number,
                    ) => (
                      <span key={index}>
                        {formatTime(breakPeriod.start)}-
                        {formatTime(breakPeriod.end)}
                        {index < (schedule.breaks?.length || 0) - 1 ? ", " : ""}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">
              {DASHBOARD_LABELS.WORKING_HOURS.NOT_WORKING}
            </span>
          )}
        </div>
      </div>
    );
  };

  const hasAnySchedule =
    workingHours &&
    Object.values(workingHours).some((schedule) => schedule !== undefined);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {DASHBOARD_LABELS.WORKING_HOURS.TITLE}
          </h3>
        </div>
        <button
          onClick={onEditClick}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          {DASHBOARD_LABELS.WORKING_HOURS.EDIT_BUTTON}
        </button>
      </div>

      {timeZone && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
          <MapPin className="w-4 h-4" />
          <span>
            {DASHBOARD_LABELS.WORKING_HOURS.TIME_ZONE_LABEL}{" "}
            {timeZone.replace("_", " ")}
          </span>
        </div>
      )}

      {hasAnySchedule ? (
        <div className="space-y-0">
          {Object.entries(workingHours!).map(([day, schedule]) =>
            renderDaySchedule(day as keyof WeeklySchedule, schedule),
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {DASHBOARD_LABELS.WORKING_HOURS.NO_SCHEDULE}
          </p>
          <button
            onClick={onEditClick}
            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Set Working Hours
          </button>
        </div>
      )}
    </div>
  );
}
